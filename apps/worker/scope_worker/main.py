import os

from celery import Celery

app = Celery(
    "scope", broker=os.environ.get("CELERY_BROKER_URL", "redis://localhost:6379/0")
)
