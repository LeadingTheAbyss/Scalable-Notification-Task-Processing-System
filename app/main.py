from fastapi import FastAPI, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from typing import List
import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import os
import time

from . import models, schemas, worker
from .database import get_db, engine

app = FastAPI(title = "Scalable Task System")

@app.on_event("startup")
async def startup():
    url = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")
    r = redis.from_url(url, encoding = "utf-8", decode_responses = True)
    await FastAPILimiter.init(r)

    db_ready = False
    retries = 10
    while not db_ready and retries > 0:
        try:
            models.Base.metadata.create_all(bind = engine)
            db_ready = True
        except OperationalError:
            retries = retries - 1
            time.sleep(2)
    
    if not db_ready:
        raise Exception("Could not connect to the database")

@app.get("/")
async def serve_spa():
    path = "/app/frontend/index.html"
    if not os.path.exists(path):
        return {"error": f"File not found at {path}"}
    return FileResponse(path)

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Online", "database": "Online"}
    except Exception as e:
        return {"status": "Online", "database": "Offline", "error": str(e)}

@app.post("/tasks", response_model = schemas.TaskResponse, dependencies = [Depends(RateLimiter(times = 5, seconds = 60))])
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(title = task.title, description = task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    worker.process_notification.delay(db_task.id)
    return db_task

@app.get("/tasks", response_model = List[schemas.TaskResponse])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()
