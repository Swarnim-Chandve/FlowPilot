import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { LayoutDashboard, Boxes, History } from "lucide-react";

export function Sidebar({ currentTab, setCurrentTab }) {
  const { user } = useUser();

  return (
    <aside className="w-64 border-r border-slate-200/80 bg-white flex flex-col justify-between p-4 shrink-0">
      <div>
        <div className="px-3 py-3 mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
              ⚡
            </span>
            Dashboard
          </h2>
        </div>

        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Main Menu
        </div>

        <nav className="space-y-1">
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentTab === "dashboard"
                ? "bg-[#fff3eb] text-[#ea580c] font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => setCurrentTab("templates")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentTab === "templates"
                ? "bg-[#fff3eb] text-[#ea580c] font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Boxes className="w-4 h-4" />
            Templates
          </button>

          <button
            onClick={() => setCurrentTab("runs")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
              currentTab === "runs"
                ? "bg-[#fff3eb] text-[#ea580c] font-semibold"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <History className="w-4 h-4" />
            Previous Runs
          </button>
        </nav>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <UserButton afterSignOutUrl="/" />
          <div className="overflow-hidden">
            <div className="text-xs font-semibold text-slate-800 truncate">
              {user?.fullName || user?.primaryEmailAddress?.emailAddress || "Developer"}
            </div>
            <div className="text-[10px] text-slate-400">Authenticated via Clerk</div>
          </div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>
    </aside>
  );
}
