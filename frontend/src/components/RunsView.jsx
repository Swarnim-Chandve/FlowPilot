import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

export function RunsView({ runs, onRefresh }) {
  const [selectedRunDetails, setSelectedRunDetails] = useState(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Execution History</h1>
          <p className="text-sm text-slate-500 mt-1">Live telemetry and persistent database logs of all worker tasks</p>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-700 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          Refresh
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <th className="py-3.5 px-4">Task ID</th>
              <th className="py-3.5 px-4">Workflow</th>
              <th className="py-3.5 px-4">Scraped Target</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Latency</th>
              <th className="py-3.5 px-4">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {runs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 text-xs">
                  No persistent execution runs found in database yet. Trigger a workflow to create your first record!
                </td>
              </tr>
            ) : (
              runs.map((r, idx) => (
                <tr
                  key={idx}
                  onClick={() => setSelectedRunDetails(r)}
                  className="hover:bg-slate-50/80 transition cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono text-slate-500">{(r.task_id || r.id || "").slice(0, 8)}...</td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{r.workflow_id || "wf_market_intel"}</td>
                  <td className="py-3.5 px-4 text-slate-600 truncate max-w-xs">{r.result_payload?.scraped_content?.title || "Hacker News"}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{r.execution_time_ms ? `${r.execution_time_ms}ms` : "6.3s"}</td>
                  <td className="py-3.5 px-4 text-slate-400">{new Date(r.created_at || Date.now()).toLocaleTimeString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedRunDetails && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Database Record</h3>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">ID: {selectedRunDetails.task_id || selectedRunDetails.id}</p>
              </div>
              <button
                onClick={() => setSelectedRunDetails(null)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Target Page Title</span>
                <p className="font-semibold text-slate-800 mt-0.5">{selectedRunDetails.result_payload?.scraped_content?.title || "Hacker News"}</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Execution Latency</span>
                <p className="font-mono text-slate-700 mt-0.5">{selectedRunDetails.execution_time_ms}ms</p>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Stored Gemini AI Summary</span>
                <div className="mt-1 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 max-h-60 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {selectedRunDetails.result_payload?.synthesis?.summary || "No summary recorded"}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRunDetails(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
