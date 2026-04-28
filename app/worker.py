import time
from celery import Celery
from .config import settings
from .database import get_db_session
from .models import Task

celery_app = Celery("worker", broker=settings.REDIS_URL, backend=settings.REDIS_URL)

@celery_app.task
def process_notification(task_id: int):
    session = get_db_session()
    try:
        task = session.query(Task).filter(Task.id == task_id).first()
        if not task: return
        
        task.status = "processing"
        session.commit()
        print(f"???  Processing Task {task_id}...")
        time.sleep(10) 
        task.status = "completed"
        session.commit()
        print(f"? Task {task_id} marked as Completed!")
        
    except Exception as e:
        print(f"? Error: {e}")
        if task:
            task.status = "failed"
            session.commit()
    finally:
        session.close()
