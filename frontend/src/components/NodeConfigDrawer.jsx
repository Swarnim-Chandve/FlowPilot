import React, { useState } from "react";
import { Settings, Trash2, Globe, Sparkles, MessageSquare, Table, Mail, Send, Copy, Check, Download, ExternalLink } from "lucide-react";

const ACTION_OPTIONS = [
  { value: "playwright", label: "Autonomous Browser Scraping (Playwright)", icon: Globe },
  { value: "gemini", label: "Gemini 2.5 Flash Synthesis (AI)", icon: Sparkles },
  { value: "sheets", label: "Google Sheets / Excel Sync", icon: Table },
  { value: "email", label: "Email Dispatch (SMTP / Resend)", icon: Mail },
  { value: "slack", label: "Slack Channel Notification", icon: MessageSquare },
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
  setEmailSubject,
  sheetWebhookUrl = "",
  setSheetWebhookUrl,
  slackUrl = "",
  setSlackUrl,
  discordUrl = "",
  setDiscordUrl,
  destinationUrl = "",
  setDestinationUrl,
  backendUrl = "http://localhost:8000"
}) {
  const [copiedScript, setCopiedScript] = useState(false);
  if (!selectedNode) return null;

  const currentActionType = selectedNode.data?.actionType || "playwright";
  const isTrigger = selectedNode.id === "trigger";

  const handleActionTypeChange = (newType) => {
    if (onUpdateNode) {
      onUpdateNode(selectedNode.id, { actionType: newType });
    }
  };

  const copyAppsScript = () => {
    const script = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), data.workflow_id, data.target_url, data.page_title, data.ai_summary]);
  return ContentService.createTextOutput("OK");
}`;
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="w-96 border-l border-slate-200 bg-white p-5 shadow-2xl z-20 flex flex-col h-full overflow-y-auto">
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
            <p className="text-[10px] text-slate-400 mt-1">Powered by Google Gemini with automatic 3-tier cascade fallback.</p>
          </div>
        )}

        {/* Google Sheets / Excel Live Integration */}
        {currentActionType === "sheets" && (
          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Google Sheet Webhook URL (Optional for Cloud Sync)
              </label>
              <input
                type="text"
                value={sheetWebhookUrl}
                onChange={(e) => setSheetWebhookUrl && setSheetWebhookUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-800 outline-none focus:border-orange-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Paste your Google Apps Script Webhook or Zapier/Make Webhook URL here to append rows in real-time.
              </p>
            </div>

            {/* Google Apps Script Quick Setup Box */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2 text-[11px] text-emerald-950">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1">📊 Connect Real Google Sheet (30s)</span>
                <button
                  type="button"
                  onClick={copyAppsScript}
                  className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] flex items-center gap-1 cursor-pointer transition"
                >
                  {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedScript ? "Copied!" : "Copy Script"}
                </button>
              </div>
              <p className="text-[10px] text-emerald-800 leading-relaxed">
                1. Open Google Sheet → <strong>Extensions → Apps Script</strong><br />
                2. Paste script & click <strong>Deploy → New deployment → Web app</strong> (Access: Anyone)<br />
                3. Paste the URL above!
              </p>
            </div>

            {/* Local Live CSV Export */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                💾 Local Spreadsheet Engine
              </span>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Every execution automatically appends rows to a live CSV table on disk (<code className="font-mono text-orange-600">flowpilot_sheets.csv</code>).
              </p>
              <a
                href={`${backendUrl}/api/v1/export/sheets.csv`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                Download flowpilot_sheets.csv
              </a>
            </div>
          </div>
        )}

        {/* Real Email Dispatch */}
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
            <p className="text-[10px] text-slate-400">Uses configured SMTP in .env to deliver branded HTML digests straight to your inbox.</p>
          </div>
        )}

        {/* Real Slack Alert */}
        {currentActionType === "slack" && (
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Slack Incoming Webhook URL</label>
              <input
                type="text"
                value={slackUrl}
                onChange={(e) => setSlackUrl && setSlackUrl(e.target.value)}
                placeholder="https://hooks.slack.com/services/T00/B00/XXXX"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-700 outline-none focus:border-orange-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Posts rich formatted alert blocks directly into your chosen Slack channel.</p>
            </div>
          </div>
        )}

        {/* Real Discord Alert */}
        {currentActionType === "discord" && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Discord Webhook URL</label>
            <input
              type="text"
              value={discordUrl}
              onChange={(e) => setDiscordUrl && setDiscordUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/12345/abcdef"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-mono text-slate-700 outline-none focus:border-orange-500"
            />
            <p className="text-[10px] text-slate-400 mt-1">Dispatches structured embeds with color coding directly to your Discord channel.</p>
          </div>
        )}

        {/* Outbound Webhook */}
        {currentActionType === "webhook_out" && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Destination Webhook URL</label>
            <input
              type="text"
              value={destinationUrl}
              onChange={(e) => setDestinationUrl && setDestinationUrl(e.target.value)}
              placeholder="https://api.yourdomain.com/v1/ingest"
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
