import os
import json
import uuid
import redis
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="FlowPilot Webhook Ingestion Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

@app.get("/")
def health():
    return {"status": "ok", "service": "webhook-gateway"}

@app.post("/api/v1/webhook/{workflow_id}")
async def receive_webhook(workflow_id: str, request: Request):
    try:
        payload = await request.json()
    except Exception:
        payload = {}

    task_id = str(uuid.uuid4())
    task_data = {
        "task_id": task_id,
        "workflow_id": workflow_id,
        "payload": payload,
        "status": "QUEUED"
    }

    r.lpush("flowpilot:task_queue", json.dumps(task_data))
    r.set(f"flowpilot:task:{task_id}", json.dumps(task_data))

    return {
        "status": "success",
        "message": "Task received and queued successfully",
        "task_id": task_id,
        "workflow_id": workflow_id
    }
