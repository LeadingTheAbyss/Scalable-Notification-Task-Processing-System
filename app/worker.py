import time
import requests
from celery import Celery
from .config import settings
from .database import get_db_session
from .models import Task

celery_app = Celery("worker", broker = settings.REDIS_URL, backend=settings.REDIS_URL)

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
            "content": f"?? **New Task Started!**\n**ID:** {task.id}\n**Title:** {task.title}\n**Desc:** {task.description}"
        }
        
        response = requests.post(DISCORD_WEBHOOK_URL, json = payload)
        
        if response.status_code == 204:
            print(f"Successfully sent notification for Task {task_id}")
            task.status = "completed"
        else:
            print(f"Failed to send notification: {response.status_code}")
            task.status = "failed"
        
        session.commit()
        
    except Exception as e:
        print(f"? Error: {e}")
        if task:
            task.status = "failed"
            session.commit()
    finally:
        session.close()
