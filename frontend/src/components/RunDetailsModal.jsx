import React from "react";

export function RunDetailsModal({ run, onClose }) {
  if (!run) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(2px)" }}>
      <div style={{ background: "#ffffff", borderRadius: "12px", width: "620px", maxHeight: "85vh", display: "flex", flexDirection: "column", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#0f172a" }}>Run Details: {run.task_id}</h3>
            <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
              Triggered: {new Date(run.created_at).toLocaleString()} • Latency: {run.execution_time_ms}ms
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", fontSize: "13px" }}>
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontWeight: 600, color: "#334155" }}>Status: </span>
            <span style={{ color: run.status === "COMPLETED" ? "#16a34a" : "#ef4444", fontWeight: 700 }}>
              {run.status}
            </span>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <div style={{ fontWeight: 600, color: "#334155", marginBottom: "6px" }}>Target Scraped:</div>
            <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
              <div style={{ fontWeight: 600, fontSize: "13px" }}>{run.result_payload?.scraped_content?.title || "N/A"}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>{run.result_payload?.scraped_content?.url}</div>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 600, color: "#334155", marginBottom: "6px" }}>Gemini 2.5 Flash Synthesis Output:</div>
            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "12px", whiteSpace: "pre-wrap", maxHeight: "250px", overflowY: "auto", color: "#1e293b" }}>
              {run.result_payload?.synthesis?.summary || "No synthesis payload recorded."}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
          <button onClick={onClose} style={{ background: "#0f172a", color: "#ffffff", border: "none", borderRadius: "6px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
