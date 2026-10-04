# FlowPilot AI - Distributed Multi-Agent Workflow Engine

> High-throughput, event-driven workflow automation platform powered by FastAPI, Valkey (Redis), Headless Playwright workers, Google Gemini 2.5 Flash, and React Flow.

---

## System Architecture

FlowPilot decouples high-speed HTTP ingestion from heavy autonomous browser scraping and LLM synthesis using a distributed message broker pattern, ensuring zero gateway blocking and real-time observability via Server-Sent Events (SSE).

```
[ External Webhook / API Trigger ]
                 |
                 v
       +-------------------+
       |  Webhook Gateway  |  (FastAPI :5001 | Latency < 15ms)
       +---------+---------+
                 | LPUSH
                 v
       +-------------------+
       |   Valkey Queue    |  (flowpilot:task_queue | Dead-Letter Queue on 3x fail)
       +---------+---------+
                 | BRPOP
                 v
       +-------------------+
       | Autonomous Worker |  (Headless Chromium Playwright + Gemini 2.5 Flash)
       +---------+---------+
                 | Persist
                 v
       +-------------------+
       | Persistent Store  |  (SQLite / PostgreSQL via SQLAlchemy)
       +---------+---------+
                 | SSE Stream
                 v
       +-------------------+
       |  API Gateway      |  (FastAPI Backend :8000)
       +---------+---------+
                 |
                 v
       +-------------------+
       |  React 19 Canvas  |  (React Flow + Clerk Enterprise Auth)
       +-------------------+
```

---

## Key Architectural Highlights

- Decoupled Asynchronous Execution: Webhook gateway responds in < 15ms with HTTP 202 Accepted while delegating compute-heavy web scraping and AI inference to background worker pools.
- Enterprise Fault Tolerance & DLQ: Built-in 3x exponential backoff retry mechanism. Exhausted tasks are routed to flowpilot:dead_letter_queue with error metadata.
- Headless Browser Sandboxing: Playwright Chromium automates JavaScript-rendered page extractions without relying on fragile third-party scrapers.
- 3-Tier Model Resilience: Automatic fallback cascade (gemini-2.5-flash -> gemini-1.5-flash -> gemini-2.0-flash) during high-demand upstream API spikes.
- Real-Time SSE Observability: Push execution steps, logs, and token-by-token statuses to the frontend without polling.
- Persistent Relational Audit Log: Tracks step latency, status (COMPLETED, FAILED, PENDING), and synthesis payloads via SQLAlchemy.

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, @xyflow/react, Clerk Authentication, TailwindCSS, Bun |
| Ingestion Gateway | FastAPI, Uvicorn, Asynchronous HTTP Handlers (Port 5001) |
| Message Broker | Valkey 7.x / Redis In-Memory Task Queue (Port 6379) |
| Worker Engine | Python 3.12+, Playwright (Headless Chromium), Google Gemini 2.5 Flash |
| API & Persistence | FastAPI (SSE on Port 8000), SQLAlchemy, SQLite / PostgreSQL |
| Containerization | Docker, Docker Compose |

---

## Quickstart via Docker

```bash
# 1. Clone repository
git clone https://github.com/Swarnim-Chandve/flowpilot-ai.git
cd flowpilot-ai

# 2. Configure keys
cp .env.example .env

# 3. Spin up full multi-container stack
docker compose up --build
```

## Local Development

```bash
# Terminal 1 - Ingestion Gateway (:5001)
uvicorn hooks.app:app --port 5001 --reload

# Terminal 2 - Distributed Worker
python -m worker.worker

# Terminal 3 - API Gateway (:8000)
uvicorn backend.app:app --port 8000 --reload

# Terminal 4 - Frontend (:5173)
cd frontend && bun dev
```

---

## Author

Built with passion by Swarnim Chandve (https://github.com/Swarnim-Chandve).
