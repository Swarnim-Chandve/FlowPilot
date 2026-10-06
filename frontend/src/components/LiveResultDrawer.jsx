import React, { useState, useRef } from "react";
import { CheckCircle2, Copy, Check, Move, Maximize2 } from "lucide-react";

export function LiveResultDrawer({ executionResult, onClose }) {
  const [copied, setCopied] = useState(false);
  const [pos, setPos] = useState({ x: window.innerWidth - 440, y: window.innerHeight - 480 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startPosX: 0, startPosY: 0 });

  if (!executionResult) return null;

  const res = executionResult.result || executionResult;
  const title = res.scraped_content?.title || res.page_title || res.title || "Scraped Target";
  const summary = res.synthesis?.summary || res.ai_summary || res.summary || JSON.stringify(res, null, 2);
  const latency = res.execution_time_ms || res.latency_ms || "Live";

  const copySynthesis = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onMouseDown = (e) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: pos.x,
      startPosY: pos.y,
    };

    const onMouseMove = (moveEvent) => {
      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;
      setPos({
        x: Math.max(10, Math.min(window.innerWidth - 300, dragRef.current.startPosX + dx)),
        y: Math.max(10, Math.min(window.innerHeight - 200, dragRef.current.startPosY + dy)),
      });
    };

    const onMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      style={{
        position: "fixed",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: "420px",
        height: "440px",
        minWidth: "300px",
        minHeight: "260px",
        resize: "both",
        overflow: "hidden",
        zIndex: 50,
      }}
      className="bg-white border border-slate-300 rounded-2xl shadow-2xl flex flex-col transition-shadow hover:shadow-orange-500/10"
    >
      {/* Draggable Header */}
      <div
        onMouseDown={onMouseDown}
        className="px-4 py-3 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between cursor-move select-none"
      >
        <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <Move className="w-3.5 h-3.5 text-slate-400" />
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Execution Result ({latency}ms)
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 overflow-y-auto text-xs space-y-3 flex-1 bg-white">
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Scraped Target</span>
          <p className="font-semibold text-slate-800 mt-0.5 truncate">{title}</p>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Gemini 2.5 Flash Synthesis</span>
          <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs">
            {summary}
          </div>
        </div>

        {res.dispatch_status && (
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Outbound Dispatch Telemetry</span>
            <div className={`mt-1 p-2.5 rounded-lg border text-[11px] font-medium ${
              res.dispatch_status.status === "DELIVERED" 
                ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                : "bg-blue-50 text-blue-800 border-blue-200"
            }`}>
              {res.dispatch_status.status === "DELIVERED" ? "✅ Live Delivered: " : "📬 Dispatch Ready: "}
              {res.dispatch_status.message || `${res.dispatch_status.recipient} (${res.dispatch_status.provider || "SMTP"})`}
            </div>
            {res.dispatch_status.csv_exported && (
              <a
                href="/api/v1/export/sheets.csv"
                target="_blank"
                rel="noreferrer"
                download="flowpilot_sheets.csv"
                className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                📊 Open Live Spreadsheet Table (flowpilot_sheets.csv)
              </a>
            )}
          </div>
        )}
      </div>

      {/* Action Footer with Resize Hint */}
      <div className="p-3 bg-slate-50/80 border-t border-slate-200 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
          <Maximize2 className="w-3 h-3" /> Drag corner to resize
        </span>
        <button
          onClick={copySynthesis}
          className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied Report!" : "Copy Report"}
        </button>
      </div>
    </div>
  );
}
