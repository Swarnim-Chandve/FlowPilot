import React from "react";

export function LiveDrawer({ isOpen, onClose, taskId, logs, resultData, isExecuting }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: "fixed", top: "57px", right: 0, width: "420px", bottom: 0, background: "#ffffff", borderLeft: "1px solid #e2e8f0", zIndex: 50, display: "flex", flexDirection: "column", boxShadow: "-4px 0 12px rgba(0,0,0,0.05)" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>Live Telemetry & Logs</div>
          <div style={{ fontSize: "11px", color: "#64748b" }}>Task ID: {taskId || "Enqueuing..."}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#64748b" }}>✕</button>
      </div>

      <div style={{ flex: 1, padding: "16px", overflowY: "auto", fontFamily: "monospace", fontSize: "12px", background: "#f8fafc" }}>
        {logs.map((log, idx) => (
          <div key={idx} style={{ marginBottom: "8px", display: "flex", gap: "8px" }}>
            <span style={{ color: "#94a3b8" }}>&gt;</span>
            <span style={{ color: log.status === "FAILED" ? "#ef4444" : "#1e293b" }}>{log.msg}</span>
          </div>
        ))}

        {resultData && (
          <div style={{ marginTop: "16px", background: "#ffffff", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
            <div style={{ fontWeight: 600, color: "#16a34a", marginBottom: "8px", fontFamily: "sans-serif", fontSize: "13px" }}>
              ✓ Execution Result ({resultData.execution_time_ms}ms)
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "6px" }}>Scraped Target</div>
            <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "10px", color: "#0f172a" }}>
              {resultData.scraped_content?.title}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "4px" }}>Gemini 2.5 Flash Synthesis</div>
            <div style={{ fontSize: "12px", color: "#334155", background: "#f8fafc", padding: "10px", borderRadius: "6px", whiteSpace: "pre-wrap", maxHeight: "240px", overflowY: "auto" }}>
              {resultData.synthesis?.summary}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
