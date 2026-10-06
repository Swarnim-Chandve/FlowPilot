#!/usr/bin/env bash

echo "=================================================="
echo "         Starting FlowPilot AI Engine             "
echo "=================================================="

# 1. Start Broker
if ! redis-cli ping > /dev/null 2>&1; then
    echo "[1/4] Starting In-Memory Broker (Valkey :6379)..."
    valkey-server --daemonize yes
else
    echo "[1/4] Broker is ACTIVE on :6379"
fi

# 2. Webhook Gateway
echo "[2/4] Starting Webhook Gateway (:5001)..."
nohup ./venv/bin/uvicorn hooks.app:app --port 5001 > logs_hooks.log 2>&1 &
echo $! > .hooks.pid

# 3. Backend API Gateway
echo "[3/4] Starting Core Backend API (:8000)..."
nohup ./venv/bin/uvicorn backend.app:app --port 8000 > logs_backend.log 2>&1 &
echo $! > .backend.pid

# 4. Distributed Worker
echo "[4/4] Starting Distributed Worker (Playwright + Gemini)..."
nohup ./venv/bin/python -m worker.worker > logs_worker.log 2>&1 &
echo $! > .worker.pid

echo "=================================================="
echo "✅ Backend & Worker Services are LIVE!"
echo "   - Webhooks : http://localhost:5001"
echo "   - Core API : http://localhost:8000"
echo "   - Worker   : Connected & Listening"
echo "=================================================="
echo "💻 Start Frontend Canvas UI in a terminal:"
echo "   cd frontend && bun dev"
echo "   (or npm run dev)"
echo "=================================================="
