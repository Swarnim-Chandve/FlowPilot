#!/usr/bin/env bash
echo "Stopping FlowPilot background services..."
[ -f .hooks.pid ] && kill $(cat .hooks.pid) 2>/dev/null && rm -f .hooks.pid
[ -f .backend.pid ] && kill $(cat .backend.pid) 2>/dev/null && rm -f .backend.pid
[ -f .worker.pid ] && kill $(cat .worker.pid) 2>/dev/null && rm -f .worker.pid
pkill -f "uvicorn hooks.app:app" 2>/dev/null
pkill -f "uvicorn backend.app:app" 2>/dev/null
pkill -f "worker.worker" 2>/dev/null
echo "✅ All FlowPilot services stopped cleanly."
