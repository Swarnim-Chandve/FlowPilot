import os
import json
import asyncio
from fastapi import FastAPI, HTTPException, Depends

from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional, List, Any
import redis
from sqlalchemy.orm import Session

from backend.database import SessionLocal, WorkflowModel, WorkflowRunModel

app = FastAPI(title="FlowPilot Enterprise API Gateway", version="1.0.0")

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class WorkflowCreateRequest(BaseModel):
    id: Optional[str] = None
    title: str
    trigger: Optional[str] = "HTTP POST :5001"
    target_url: Optional[str] = "https://news.ycombinator.com"
    prompt: Optional[str] = "Summarize top stories and key takeaways."

@app.get("/api/v1/workflows")
def get_all_workflows(db: Session = Depends(get_db)):
    try:
        workflows = db.query(WorkflowModel).order_by(WorkflowModel.created_at.desc()).all()
    except Exception:
        workflows = []

    if not workflows:
        return [
            {
                "id": "wf_market_intel",
                "title": "Autonomous Web & AI Digest",
                "trigger": "HTTP POST :5001",
                "steps": "Headless Chromium + Gemini 2.5",
                "status": "ACTIVE",
                "targetUrl": "https://news.ycombinator.com",
                "promptText": "Summarize top 2 trending stories and key sentiment."
            },
            {
                "id": "wf_blog_scraper",
                "title": "Blog Scraper to Gemini Insights",
                "trigger": "HTTP POST :5001",
                "steps": "Playwright DOM + Structured Summary",
                "status": "ACTIVE",
                "targetUrl": "https://paulgraham.com/articles.html",
                "promptText": "Extract core thesis and actionable takeaways."
            },
            {
                "id": "wf_tech_radar",
                "title": "Competitor SaaS Pricing Watcher",
                "trigger": "HTTP POST :5001",
                "steps": "Headless Chromium + Gemini 2.5",
                "status": "ACTIVE",
                "targetUrl": "https://stripe.com/pricing",
                "promptText": "Extract all public pricing tiers and transaction fees."
            }
        ]

    return [
        {
            "id": getattr(wf, "id", "wf_default"),
            "title": getattr(wf, "title", getattr(wf, "name", "Workflow")),
            "trigger": getattr(wf, "trigger_type", "HTTP POST :5001"),
            "steps": "Headless Chromium + Gemini 2.5",
            "status": "ACTIVE",
            "targetUrl": "https://news.ycombinator.com",
            "promptText": "Summarize key points."
        }
        for wf in workflows
    ]

@app.post("/api/v1/workflows")
def create_workflow(req: WorkflowCreateRequest, db: Session = Depends(get_db)):
    wf_id = req.id or f"wf_{int(asyncio.get_event_loop().time() * 1000)}"
    try:
        new_wf = WorkflowModel(
            id=wf_id,
            title=req.title,
            trigger_type=req.trigger,
            nodes=[{"target_url": req.target_url, "prompt": req.prompt}]
        )
        db.add(new_wf)
        db.commit()
    except Exception:
        db.rollback()
    return {"status": "created", "id": wf_id, "title": req.title}

@app.get("/api/v1/templates")
def get_workflow_templates():
    return [
        {
            "id": "tpl_blog",
            "title": "Blog Scraper to Gemini Insights",
            "category": "AI Research",
            "description": "Extracts core thesis, arguments, and actionable takeaways from long-form essays.",
            "targetUrl": "https://paulgraham.com/articles.html",
            "promptText": "Extract the core thesis and top 3 counter-intuitive takeaways."
        },
        {
            "id": "tpl_hn_sentiment",
            "title": "HackerNews & Tech Trend Radar",
            "category": "Market Intel",
            "description": "Monitors front-page discussions, community sentiment shifts, and emergent patterns.",
            "targetUrl": "https://news.ycombinator.com",
            "promptText": "Summarize top 2 trending stories and key sentiment."
        },
        {
            "id": "tpl_pricing_monitor",
            "title": "Competitor SaaS Pricing Watcher",
            "category": "Competitive Analysis",
            "description": "Scrapes competitor landing pages to detect price tier changes and feature updates.",
            "targetUrl": "https://stripe.com/pricing",
            "promptText": "Extract all public pricing tiers, fees, and feature differentiators."
        },
        {
            "id": "tpl_github_cve",
            "title": "GitHub Release Notes & Security Digest",
            "category": "DevSecOps",
            "description": "Fetches releases from mission-critical repositories and highlights security patches.",
            "targetUrl": "https://github.com/fastapi/fastapi/releases",
            "promptText": "Identify breaking changes, security patches, and new features."
        },
        {
            "id": "tpl_job_extractor",
            "title": "YC Remote AI Engineer Job Extractor",
            "category": "Lead Gen",
            "description": "Extracts active AI/ML engineer job postings from startup boards.",
            "targetUrl": "https://www.ycombinator.com/jobs",
            "promptText": "Extract AI/ML engineering roles, tech stacks, and salary ranges."
        }
    ]

@app.get("/api/v1/runs")
def get_execution_runs(db: Session = Depends(get_db)):
    try:
        runs = db.query(WorkflowRunModel).order_by(WorkflowRunModel.created_at.desc()).limit(50).all()
    except Exception:
        runs = []
    results = []
    for r in runs:
        task_id_val = getattr(r, "task_id", getattr(r, "id", "unknown"))
        latency_val = getattr(r, "latency_ms", getattr(r, "execution_time_ms", 6300))
        page_title = getattr(r, "page_title", getattr(r, "target_url", "Dynamic Scrape"))
        summary = getattr(r, "ai_summary", "")

        results.append({
            "id": str(task_id_val),
            "task_id": str(task_id_val),
            "workflow_id": getattr(r, "workflow_id", "wf_market_intel"),
            "status": getattr(r, "status", "COMPLETED"),
            "execution_time_ms": latency_val,
            "created_at": r.created_at.isoformat() if getattr(r, "created_at", None) else None,
            "result_payload": {
                "scraped_content": {"title": page_title},
                "synthesis": {"summary": summary}
            }
        })
    return results

@app.get("/api/v1/tasks/{task_id}/stream")
async def stream_task_events(task_id: str):
    async def event_generator():
        for _ in range(120):
            raw_data = r.get(f"flowpilot:task:{task_id}")
            if raw_data:
                yield "data: " + raw_data + "\n\n"
                parsed = json.loads(raw_data)
                if parsed.get("status") in ["COMPLETED", "FAILED"]:
                    break 
            else:
                yield "data: {'status': 'ENQUEUED', 'message': 'Worker processing task...'}\n\n"
            await asyncio.sleep(0.5)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
