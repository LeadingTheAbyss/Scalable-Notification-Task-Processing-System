from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from typing import List
import traceback
from . import models, schemas, worker
from .database import get_db, engine

models.Base.metadata.create_all(bind = engine)
app = FastAPI(title="Scalable Task System")

@app.get("/health")
def health_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "Online", "database": "Online"}
    except Exception as e:
        return {"status": "Online", "database": "Offline", "error": str(e)}

@app.post("/tasks", response_model=schemas.TaskResponse)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    try:
        db_task = models.Task(title = task.title, description = task.description)
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        worker.process_notification.delay(db_task.id)

        return db_task
    except Exception as e:
        print("? POST /tasks FAILED!")
        traceback.print_exc()
        raise HTTPException(status_code = 500, detail = str(e))

@app.get("/tasks/{task_id}", response_model = schemas.TaskResponse)
def get_task_status(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.get("/tasks", response_model = List[schemas.TaskResponse])
def list_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()
