import React from "react";
import { Settings, Trash2, Globe, Sparkles, MessageSquare, Table, Mail, Send } from "lucide-react";

const ACTION_OPTIONS = [
  { value: "playwright", label: "Autonomous Browser Scraping (Playwright)", icon: Globe },
  { value: "gemini", label: "Gemini 2.5 Flash Synthesis (AI)", icon: Sparkles },
  { value: "slack", label: "Slack Channel Notification", icon: MessageSquare },
  { value: "sheets", label: "Google Sheets / Excel Sync", icon: Table },
  { value: "email", label: "Email Dispatch (SMTP / Resend)", icon: Mail },
  { value: "discord", label: "Discord Webhook Alert", icon: Send },
  { value: "webhook_out", label: "Dispatch Outbound Webhook", icon: Send },
];

export function NodeConfigDrawer({
  selectedNode,
  onClose,
  targetUrl,
  setTargetUrl,
  promptText,
  setPromptText,
  onDeleteNode,
  onUpdateNode,
  recipientEmail = "recoverybro23@gmail.com",
  setRecipientEmail,
  emailSubject = "[FlowPilot AI Alert] Autonomous Execution Report",
  setEmailSubject
}) {
  if (!selectedNode) return null;

  const currentActionType = selectedNode.data?.actionType || "playwright";
  const isTrigger = selectedNode.id === "trigger";

  const handleActionTypeChange = (newType) => {
    if (onUpdateNode) {
      onUpdateNode(selectedNode.id, { actionType: newType });
    }
  };

  return (
    <div className="w-88 border-l border-slate-200 bg-white p-5 shadow-xl z-20 flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-slate-500" />
          Configure: {isTrigger ? "Webhook Ingestion" : `Action (${currentActionType.toUpperCase()})`}
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
          ✕
        </button>
      </div>

      <div className="py-4 space-y-4 flex-1">
        {/* Action Type Selector Dropdown */}
        {!isTrigger && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Action Integration / Destination
            </label>
            <select
              value={currentActionType}
              onChange={(e) => handleActionTypeChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 outline-none focus:border-orange-500 cursor-pointer"
            >
              {ACTION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Dynamic Fields based on Action Type */}
        {isTrigger && (
          <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-lg text-xs text-orange-900 leading-relaxed">
            <span className="font-bold">⚡ Webhook Ingestion Gateway</span>
            <p className="mt-1 text-[11px] text-orange-800">
              Receives incoming HTTP POST payloads at sub-15ms latency and pushes jobs directly into Valkey task queue.
            </p>
          </div>
        )}

        {currentActionType === "playwright" && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Web URL to Scrape</label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-orange-500"
              placeholder="https://news.ycombinator.com"
            />
            <p className="text-[10px] text-slate-400 mt-1">Headless Chromium launches in isolated sandbox to extract full dynamic DOM.</p>
          </div>
        )}

        {currentActionType === "gemini" && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">AI Prompt / Extraction Rule</label>
            <textarea
              rows={4}
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-orange-500 resize-none leading-relaxed"
              placeholder="Extract core insights, sentiment, and actionable takeaways."
            />
            <p className="text-[10px] text-slate-400 mt-1">Powered by Google Gemini 2.5 Flash with automatic 3-tier cascade fallback.</p>
          </div>
        )}

        {currentActionType === "slack" && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Slack Webhook URL</label>
              <input
                type="text"
                defaultValue="https://hooks.slack.com/services/T00/B00/XXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-700 outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Slack Channel</label>
              <input
                type="text"
                defaultValue="#flowpilot-intel"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {currentActionType === "sheets" && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Google Spreadsheet ID</label>
              <input
                type="text"
                defaultValue="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-700 outline-none focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Sheet Tab Name</label>
              <input
                type="text"
                defaultValue="Live_Digest"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {currentActionType === "email" && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Recipient Email Address</label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail && setRecipientEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-orange-500"
                placeholder="you@gmail.com"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Subject Header</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject && setEmailSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-700 outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}

        {currentActionType === "discord" && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Discord Webhook URL</label>
            <input
              type="text"
              defaultValue="https://discord.com/api/webhooks/12345/abcdef"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-700 outline-none focus:border-orange-500"
            />
          </div>
        )}

        {currentActionType === "webhook_out" && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Webhook URL</label>
            <input
              type="text"
              defaultValue="https://api.yourdomain.com/v1/ingest"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-700 outline-none focus:border-orange-500"
            />
          </div>
        )}
      </div>

      <div className="space-y-2 pt-3 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer transition shadow-xs"
        >
          Save & Close
        </button>

        {!isTrigger && (
          <button
            onClick={() => {
              if (onDeleteNode) onDeleteNode(selectedNode.id);
              onClose();
            }}
            className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete This Node
          </button>
        )}
      </div>
    </div>
  );
}
