import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Zap, Play, Info } from "lucide-react";

export function TriggerNode({ data }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl w-72 overflow-hidden text-slate-800">
      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-slate-600" />
          <span className="font-semibold text-xs text-slate-700 tracking-tight">Trigger</span>
        </div>
        <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
      </div>

      <div className="p-3">
        <select
          value={data.triggerType || "webhook"}
          onChange={(e) => data.onChange && data.onChange("triggerType", e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-orange-500 cursor-pointer"
        >
          <option value="webhook">Webhook (HTTP POST)</option>
          <option value="schedule">Scheduled Cron</option>
          <option value="manual">Manual Trigger</option>
        </select>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white" />
    </div>
  );
}

export function ActionNode({ data }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl w-72 overflow-hidden text-slate-800">
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white" />

      <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-slate-600 fill-slate-600" />
          <span className="font-semibold text-xs text-slate-700 tracking-tight">Action {data.index || 1}</span>
        </div>
        <Info className="w-3.5 h-3.5 text-slate-400 cursor-pointer" />
      </div>

      <div className="p-3 space-y-2">
        <select
          value={data.actionType || "playwright"}
          onChange={(e) => data.onChange && data.onChange("actionType", e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 outline-none focus:border-orange-500 cursor-pointer"
        >
          <option value="playwright">Autonomous Playwright Scraper</option>
          <option value="gemini">Gemini 2.5 Flash AI Summarizer</option>
          <option value="webhook_out">Dispatch External Webhook</option>
        </select>

        {data.status && (
          <div className={"text-[11px] px-2 py-0.5 rounded font-medium " + (
            data.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
            data.status === "RUNNING" ? "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse" :
            "bg-slate-50 text-slate-500 border border-slate-200"
          )}>
            Status: {data.status}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white" />
    </div>
  );
}
