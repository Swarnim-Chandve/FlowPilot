import React from "react";

export function RunsTable({ runs, onSelectRun }) {
  return (
    <div style={{ height: "240px", borderTop: "1px solid #e2e8f0", background: "#ffffff", padding: "16px 24px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <div style={{ fontWeight: "700", fontSize: "14px", color: "#0f172a" }}>Persistent Execution History (SQLAlchemy DB)</div>
        <div style={{ fontSize: "12px", color: "#64748b" }}>Audited in SQLite/Postgres</div>
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>
              <th style={{ padding: "8px 12px", fontWeight: 600 }}>TASK ID</th>
              <th style={{ padding: "8px 12px", fontWeight: 600 }}>STATUS</th>
              <th style={{ padding: "8px 12px", fontWeight: 600 }}>LATENCY</th>
              <th style={{ padding: "8px 12px", fontWeight: 600 }}>TIMESTAMP</th>
              <th style={{ padding: "8px 12px", fontWeight: 600, textAlign: "right" }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {runs.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>
                  No execution runs found yet. Click "Trigger Pipeline" to execute the distributed workflow.
                </td>
              </tr>
            ) : (
              runs.map((r) => (
                <tr key={r.task_id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "8px 12px", fontFamily: "monospace", color: "#0f172a" }}>{r.task_id}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{
                      background: r.status === "COMPLETED" ? "#dcfce7" : "#fee2e2",
                      color: r.status === "COMPLETED" ? "#166534" : "#991b1b",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontWeight: 600,
                      fontSize: "11px"
                    }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ padding: "8px 12px", color: "#475569" }}>{r.execution_time_ms}ms</td>
                  <td style={{ padding: "8px 12px", color: "#64748b" }}>{new Date(r.created_at).toLocaleTimeString()}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right" }}>
                    <button
                      onClick={() => onSelectRun(r)}
                      style={{ background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", fontWeight: 600, cursor: "pointer", color: "#334155" }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
