import time
import requests
import os
from celery import Celery
from .database import get_db_session
from .models import Task

url = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")
celery_app = Celery("worker", broker = url, backend = url)

DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1498608919407493246/rJB7Y0oO-Q81FDGNuhzOni_OqmHmxDb0AU5T4CyWrxyjoLOcql4POSieq663xmSiz0Re"

@celery_app.task
def process_notification(task_id: int):
    session = get_db_session()
    try:
        task = session.query(Task).filter(Task.id == task_id).first()
        if not task: return
        
        task.status = "processing"
        session.commit()

        payload = {
            "content": f"?? **New Task Started!**\n**ID:** {task.id}\n**Title:** {task.title}"
        }
        
        response = requests.post(DISCORD_WEBHOOK_URL, json = payload)
        
        if response.status_code == 204:
            task.status = "completed"
        else:
            task.status = "failed"
        
        session.commit()
        
    except Exception:
        if task:
            task.status = "failed"
            session.commit()
    finally:
        session.close()
