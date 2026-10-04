import React from "react";
import { Settings, Trash2 } from "lucide-react";

export function NodeConfigDrawer({ selectedNode, onClose, targetUrl, setTargetUrl, promptText, setPromptText, onDeleteNode }) {
  if (!selectedNode) return null;

  return (
    <div className="w-80 border-l border-slate-200 bg-white p-5 shadow-lg z-20 flex flex-col">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-slate-500" />
          Configure Node: {selectedNode.data?.actionType || selectedNode.id}
        </span>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer">
          ✕
        </button>
      </div>

      <div className="py-4 space-y-4 flex-1">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Target Web URL to Scrape</label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 outline-none focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">AI Prompt / Extraction Rule</label>
          <textarea
            rows={5}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:border-orange-500 resize-none leading-relaxed"
          />
        </div>

        <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-lg text-[11px] text-orange-800 leading-relaxed">
          💡 Any edits here will be sent directly to the Playwright scraper & Gemini synthesizer.
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          onClick={onClose}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-medium cursor-pointer"
        >
          Save & Close
        </button>

        {selectedNode.id !== "trigger" && (
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
