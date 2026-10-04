import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Play, Code } from "lucide-react";

export function TriggerNode({ data }) {
  return (
    <div
      onClick={data.onSelect}
      className={`bg-white border ${data.isSelected ? "border-orange-500 ring-2 ring-orange-500/20" : "border-slate-200"} shadow-sm rounded-xl w-72 overflow-hidden text-slate-800 transition cursor-pointer`}
    >
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold text-xs">⚡</span>
          <span className="font-semibold text-xs text-slate-700">Trigger</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-200">
          Webhook
        </span>
      </div>
      <div className="p-3">
        <div className="text-xs font-medium text-slate-700">HTTP Ingestion Gateway</div>
        <div className="text-[11px] text-orange-600 font-medium mt-1 flex items-center gap-1">
          <Code className="w-3 h-3" /> Click to view cURL & API Secret
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white" />
    </div>
  );
}

export function ActionNode({ data }) {
  return (
    <div
      onClick={data.onSelect}
      className={`bg-white border ${data.isSelected ? "border-orange-500 ring-2 ring-orange-500/20" : "border-slate-200"} shadow-sm rounded-xl w-72 overflow-hidden text-slate-800 transition cursor-pointer`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white" />
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="w-3 h-3 text-slate-600 fill-slate-600" />
          <span className="font-semibold text-xs text-slate-700">Action {data.index || 1}</span>
        </div>
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
          {data.actionType}
        </span>
      </div>
      <div className="p-3 space-y-2">
        <div className="text-xs font-medium text-slate-800">
          {data.actionType === "playwright" && "Autonomous Browser Scraping"}
          {data.actionType === "gemini" && "Gemini 2.5 Flash Synthesis"}
          {data.actionType === "webhook_out" && "Dispatch Webhook Alert"}
        </div>
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
