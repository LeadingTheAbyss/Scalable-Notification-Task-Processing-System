import time
from celery import Celery
from .config import settings

celery_app = Celery(
    "worker",
    broker = settings.REDIS_URL,
    backend = settings.REDIS_URL
)

@celery_app.task
def simulate_heavy_task(task_id: int, title: str):
    print(f"?? Starting background job for Task {task_id}: {title}")
    time.sleep(10) 
    
    print(f"? Background job for Task {task_id} completed!")
    return f"Task {title} finished processing."
