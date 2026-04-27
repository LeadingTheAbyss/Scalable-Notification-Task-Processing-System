from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, worker
from .database import get_db, engine, Base
from .redis_client import get_redis

app = FastAPI(title="Scalable Task System")

@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    db_task = models.Task(title=task.title, description=task.description)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)

    worker.simulate_heavy_task.delay(db_task.id, db_task.title)

    return db_task

@app.get("/tasks", response_model = List[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()

@app.get("/health")
def health_check():
    return {"status": "Online"}
