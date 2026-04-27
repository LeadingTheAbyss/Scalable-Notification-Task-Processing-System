from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas
from .database import get_db, engine, Base
from .redis_client import get_redis

models.Base.metadata.create_all(bind = engine)
app = FastAPI(title = "Scalable Task System")

@app.get("/health")
def health_check(db: Session = Depends(get_db), r=Depends(get_redis)):
    try:
        db.execute(text("SELECT 1"))
        db_status = "Online"
    except Exception:
        db_status = "Offline"
    
    return {"status": "API is running", "database": db_status, "redis": "Online"}

@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(title=task.title, description=task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/tasks", response_model = List[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()
