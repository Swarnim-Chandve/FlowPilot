import React, { useState } from "react";
import { ShieldCheck, Copy, Check } from "lucide-react";

export function WebhookModal({ isOpen, onClose, targetUrl, promptText }) {
  const [copiedCurl, setCopiedCurl] = useState(false);
  if (!isOpen) return null;

  const copyCurl = () => {
    const curlCmd = `curl -X POST "http://localhost:5001/api/v1/webhook/wf_market_intel" \
  -H "Content-Type: application/json" \
  -d '{"target_url": "${targetUrl}", "prompt": "${promptText}"}'`;
    navigator.clipboard.writeText(curlCmd);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Webhook Trigger Credentials</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] text-slate-500 font-semibold uppercase">Webhook Ingestion Endpoint</label>
            <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700 select-all">
              http://localhost:5001/api/v1/webhook/wf_market_intel
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-semibold uppercase">API Secret Token</label>
            <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-700">
              fp_sec_9942a781bcf802
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-500 font-semibold uppercase">cURL for Postman / Terminal</label>
            <div className="mt-1 p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10px] overflow-x-auto leading-relaxed">
              curl -X POST "http://localhost:5001/api/v1/webhook/wf_market_intel" \<br />
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
              &nbsp;&nbsp;-d &apos;&#123;&quot;target_url&quot;: &quot;{targetUrl}&quot;, &quot;prompt&quot;: &quot;{promptText}&quot;&#125;&apos;
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={copyCurl}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCurl ? "Copied to Clipboard!" : "Copy cURL"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
