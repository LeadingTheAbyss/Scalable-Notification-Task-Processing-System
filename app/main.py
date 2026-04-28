from fastapi import FastAPI, Depends, HTTPException, Request
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List
import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter

from . import models, schemas, worker
from .database import get_db, engine
from .redis_client import get_redis

models.Base.metadata.create_all(bind = engine)

app = FastAPI(title="Scalable Task System")

@app.on_event("startup")
async def startup():
    r = redis.from_url("redis://127.0.0.1:6379/0", encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(r)

@app.get("/health")
def health_check():
    return {"status": "Online"}

@app.post("/tasks", 
          response_model=schemas.TaskResponse, 
          dependencies=[Depends(RateLimiter(times = 5, seconds = 60))])
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(title = task.title, description=task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    worker.process_notification.delay(db_task.id)
    return db_task

@app.get("/tasks", response_model=List[schemas.TaskResponse])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()
