import os
import json
import time
import asyncio
import signal
import sys
import redis
from datetime import datetime
from worker.actions import scrape_web_action, gemini_ai_action, send_email_action, send_slack_action, send_discord_action, send_google_sheets_action, webhook_dispatch_action
from backend.database import SessionLocal, WorkflowRunModel

REDIS_URL = os.getenv("VALKEY_URL") or os.getenv("REDIS_URL")
if REDIS_URL:
    r = redis.from_url(REDIS_URL, decode_responses=True, socket_timeout=None)
else:
    REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
    r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, db=0, decode_responses=True, socket_timeout=None)
QUEUE_NAME = "flowpilot:task_queue"
DLQ_NAME = "flowpilot:dead_letter_queue"
MAX_RETRIES = 3

IS_RUNNING = True

def handle_shutdown(signum, frame):
    global IS_RUNNING
    print("\n[SHUTDOWN] Received signal to stop. Finishing active tasks...")
    IS_RUNNING = False

signal.signal(signal.SIGINT, handle_shutdown)
signal.signal(signal.SIGTERM, handle_shutdown)

async def execute_workflow_steps(task_data):
    task_id = task_data.get("task_id")
    workflow_id = task_data.get("workflow_id")
    payload = task_data.get("payload", {})
    retry_count = task_data.get("retry_count", 0)

    print(f"\n[WORKER] Processing Task: {task_id} (Attempt {retry_count + 1}/{MAX_RETRIES})")
    start_time = time.time()
    
    target_url = payload.get("target_url") or payload.get("url") or "https://news.ycombinator.com"
    prompt_text = payload.get("prompt") or payload.get("promptText") or "Summarize key findings." 
    ai_prompt = payload.get("prompt", "Summarize top 2 trending stories and key sentiment.")

    try:
        # Step 1: Autonomous Browser Scrape (Playwright)
        scrape_result = await scrape_web_action(target_url)
        if scrape_result.get("status") == "FAILED" and not scrape_result.get("content"):
            raise RuntimeError(f"Playwright scrape failed: {scrape_result.get('error')}")

        # Step 2: Gemini 2.5 Flash Synthesis
        content = scrape_result.get("content", "")
        ai_result = await gemini_ai_action(ai_prompt, content)
        ai_summary = ai_result.get("ai_analysis", "")

        # Step 3: Outbound Action (Email / Slack / Discord / Webhook)
        dest_type = payload.get("destination_type") or "email"
        recipient_email = payload.get("recipient_email") or "recoverybro23@gmail.com"
        email_subj = payload.get("email_subject") or "[FlowPilot AI Alert] Autonomous Execution Report"

        dispatch_status = {}
        if dest_type == "email":
            dispatch_status = await send_email_action(recipient_email, email_subj, ai_summary)
        elif dest_type == "slack":
            slack_url = payload.get("slack_url", "")
            dispatch_status = await send_slack_action(slack_url, ai_summary)
        elif dest_type == "discord":
            discord_url = payload.get("discord_url", "")
            dispatch_status = await send_discord_action(discord_url, ai_summary)
        elif dest_type == "sheets":
            sheet_url = payload.get("sheet_webhook_url") or payload.get("destination_url") or ""
            dispatch_status = await send_google_sheets_action(
                sheet_webhook_url=sheet_url,
                title=scrape_result.get("title", "Web Page"),
                url=target_url,
                summary=ai_summary,
                workflow_id=workflow_id
            )
        elif dest_type == "webhook_out":
            dispatch_status = await webhook_dispatch_action(payload.get("destination_url", ""), {"summary": ai_summary})

        elapsed_ms = int((time.time() - start_time) * 1000)

        final_output = {
            "task_id": task_id,
            "workflow_id": workflow_id,
            "status": "COMPLETED",
            "execution_time_ms": elapsed_ms,
            "page_title": scrape_result.get("title", "Web Page"),
            "ai_summary": ai_summary,
            "dispatch_status": dispatch_status
        }

        # 1. Update in-memory Redis for fast SSE
        r.set(f"flowpilot:task:{task_id}", json.dumps(final_output), ex=86400)

        # 2. Persist in SQL Database (Cold Tier)
        try:
            db = SessionLocal()
            run_record = WorkflowRunModel(
                id=task_id,
                workflow_id=workflow_id,
                status="COMPLETED",
                target_url=target_url,
                page_title=scrape_result.get("title"),
                ai_summary=ai_result.get("ai_analysis"),
                latency_ms=elapsed_ms
            )
            db.merge(run_record)
            db.commit()
            db.close()
            print(f"[DATABASE] Persisted run {task_id} into SQL Database!")
        except Exception as db_err:
            print(f"[DB ERROR]: {db_err}")

        print(f"[SUCCESS] Task {task_id} completed successfully in {elapsed_ms}ms!\n")

    except Exception as e:
        print(f"[ERROR] Execution failed: {e}")
        if retry_count < MAX_RETRIES - 1:
            backoff_sec = (retry_count + 1) * 2
            print(f"[RETRY] Re-queueing task {task_id} with {backoff_sec}s exponential backoff...")
            time.sleep(backoff_sec)
            task_data["retry_count"] = retry_count + 1
            r.lpush(QUEUE_NAME, json.dumps(task_data))
        else:
            print(f"[DLQ] Max retries exceeded. Moving task {task_id} to Dead-Letter Queue: {DLQ_NAME}")
            task_data["error"] = str(e)
            task_data["status"] = "FAILED"
            r.lpush(DLQ_NAME, json.dumps(task_data))
            r.set(f"flowpilot:task:{task_id}", json.dumps({"status": "FAILED", "error": str(e)}), ex=86400)

def start_worker():
    print("=" * 60)
    print("FlowPilot Enterprise Distributed Worker is ACTIVE!")
    print(f"Primary Queue: {QUEUE_NAME}")
    print(f"Dead-Letter Queue: {DLQ_NAME}")
    print("=" * 60)

    while IS_RUNNING:
        try:
            queue_item = r.brpop(QUEUE_NAME, timeout=3)
            if queue_item:
                _, raw_data = queue_item
                task_data = json.loads(raw_data)
                asyncio.run(execute_workflow_steps(task_data))
        except Exception as loop_err:
            if IS_RUNNING:
                print(f"[LOOP ERROR]: {loop_err}")
                time.sleep(1)

    print("[EXIT] Worker stopped cleanly.")

if __name__ == "__main__":
    start_worker()
