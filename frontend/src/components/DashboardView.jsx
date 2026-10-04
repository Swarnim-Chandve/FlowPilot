import React from "react";
import { Search, PlusCircle, Play, Edit3, CheckCircle2, Clock } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export function DashboardView({ workflows, runsCount, onStartWithTemplate, onCreateWorkflow, onEditWorkflow }) {
  const { user } = useUser();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Welcome back! {user?.firstName || "Swarnim"}
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage, edit, and monitor your automated pipelines</p>
      </div>

      {/* Top Metric Stats */}
      <div className="grid grid-cols-3 gap-5">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Active Workflows</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{workflows.length}</div>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Total Tasks Enqueued</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{runsCount}</div>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Average Latency</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">6.3s</div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search workflows by name..."
            className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-700 outline-none focus:border-orange-500 shadow-xs"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onStartWithTemplate}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            Templates
          </button>
          <button
            onClick={onCreateWorkflow}
            className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            New Workflow
          </button>
        </div>
      </div>

      {/* Your Workflows List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Your Configured Workflows</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any workflow to inspect nodes, reconfigure URLs, or publish runs</p>
          </div>
          <span className="text-xs font-mono bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded">
            {workflows.length} Available
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {workflows.map((wf) => (
            <div key={wf.id} className="p-5 hover:bg-slate-50/80 transition flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                  ⚡
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{wf.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold">
                      {wf.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span>Trigger: <strong className="text-slate-700 font-mono text-[11px]">{wf.trigger}</strong></span>
                    <span>•</span>
                    <span>Pipeline: <strong className="text-slate-700">{wf.steps}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <Clock className="w-3 h-3" /> Updated recently
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEditWorkflow(wf)}
                  className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  Edit in Canvas
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
