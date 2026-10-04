import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Play, Code, MessageSquare, Mail, Table, Send, Globe, Sparkles } from "lucide-react";

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

const ACTION_METADATA = {
  playwright: {
    title: "Autonomous Browser Scraping",
    tag: "PLAYWRIGHT",
    tagStyle: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Globe,
    iconColor: "text-slate-600"
  },
  gemini: {
    title: "Gemini 2.5 Flash Synthesis",
    tag: "GEMINI 2.5",
    tagStyle: "bg-purple-50 text-purple-700 border-purple-200",
    icon: Sparkles,
    iconColor: "text-purple-600"
  },
  slack: {
    title: "Slack Channel Notification",
    tag: "SLACK",
    tagStyle: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
    icon: MessageSquare,
    iconColor: "text-fuchsia-600"
  },
  sheets: {
    title: "Google Sheets / Excel Sync",
    tag: "SHEETS",
    tagStyle: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Table,
    iconColor: "text-emerald-600"
  },
  email: {
    title: "Email Dispatch (SMTP / Resend)",
    tag: "EMAIL",
    tagStyle: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Mail,
    iconColor: "text-blue-600"
  },
  discord: {
    title: "Discord Webhook Alert",
    tag: "DISCORD",
    tagStyle: "bg-indigo-50 text-indigo-700 border-indigo-200",
    icon: Send,
    iconColor: "text-indigo-600"
  },
  webhook_out: {
    title: "Dispatch Outbound Webhook",
    tag: "WEBHOOK_OUT",
    tagStyle: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Send,
    iconColor: "text-amber-600"
  }
};

export function ActionNode({ data }) {
  const meta = ACTION_METADATA[data.actionType] || ACTION_METADATA.webhook_out;
  const IconComponent = meta.icon;

  return (
    <div
      onClick={data.onSelect}
      className={`bg-white border ${data.isSelected ? "border-orange-500 ring-2 ring-orange-500/20" : "border-slate-200"} shadow-sm rounded-xl w-72 overflow-hidden text-slate-800 transition cursor-pointer`}
    >
      <Handle type="target" position={Position.Top} className="w-2.5 h-2.5 bg-emerald-500 border-2 border-white" />
      <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconComponent className={`w-3.5 h-3.5 ${meta.iconColor}`} />
          <span className="font-semibold text-xs text-slate-700">Action {data.index || 1}</span>
        </div>
        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${meta.tagStyle}`}>
          {meta.tag}
        </span>
      </div>
      <div className="p-3 space-y-2">
        <div className="text-xs font-semibold text-slate-800">
          {data.customTitle || meta.title}
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
