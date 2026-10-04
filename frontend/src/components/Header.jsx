import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

export function Header({ runsCount, onShowCredentials, isExecuting, onExecute }) {
  const { user } = useUser();

  return (
    <header style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontWeight: "bold" }}>
            FP
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "15px", color: "#0f172a", letterSpacing: "-0.02em" }}>FlowPilot AI</div>
            <div style={{ fontSize: "11px", color: "#64748b" }}>Enterprise Multi-Agent Orchestration</div>
          </div>
        </div>

        <div style={{ height: "24px", width: "1px", background: "#e2e8f0", margin: "0 4px" }} />

        <div style={{ display: "flex", gap: "16px" }}>
          <div style={{ fontSize: "12px", color: "#475569" }}>
            <span style={{ color: "#94a3b8" }}>Workflows:</span> <strong style={{ color: "#0f172a" }}>1 Active</strong>
          </div>
          <div style={{ fontSize: "12px", color: "#475569" }}>
            <span style={{ color: "#94a3b8" }}>Broker Queue:</span> <strong style={{ color: "#16a34a" }}>Active (Valkey)</strong>
          </div>
          <div style={{ fontSize: "12px", color: "#475569" }}>
            <span style={{ color: "#94a3b8" }}>Executions:</span> <strong style={{ color: "#0f172a" }}>{runsCount} Runs</strong>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={onShowCredentials}
          style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "6px", padding: "7px 12px", fontSize: "13px", fontWeight: "500", color: "#334155", cursor: "pointer" }}
        >
          🔑 Webhook Credentials
        </button>

        <button
          onClick={onExecute}
          disabled={isExecuting}
          style={{
            background: isExecuting ? "#94a3b8" : "#0f172a",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            padding: "7px 16px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: isExecuting ? "not-allowed" : "pointer"
          }}
        >
          {isExecuting ? "Executing Pipeline..." : "▶ Trigger Pipeline"}
        </button>

        <div style={{ marginLeft: "8px" }}>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
