import React, { useState } from "react";
import { Globe, Sparkles, MessageSquare, Mail, Table } from "lucide-react";

const STARTER_TEMPLATES = [
  {
    id: "tpl_hn_slack",
    title: "HackerNews Market Intel → Slack Alert",
    category: "Market Intel",
    description: "Scrapes HackerNews front-page discussions, synthesizes sentiment with Gemini 2.5, and dispatches rich Block Kit alerts directly to Slack.",
    targetUrl: "https://news.ycombinator.com",
    promptText: "Summarize top 2 trending stories, tech shifts, and key sentiment.",
    destination: "slack",
    destLabel: "Slack Channel Alert",
    destIcon: MessageSquare,
    destColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200"
  },
  {
    id: "tpl_pricing_sheets",
    title: "Competitor SaaS Pricing Watcher → Google Sheets",
    category: "Competitive Analysis",
    description: "Monitors competitor pricing pages using headless Playwright, extracts tier changes, and appends rows live to your online Google Sheet.",
    targetUrl: "https://stripe.com/pricing",
    promptText: "Extract all public pricing tiers, transaction fees, and feature differentiators.",
    destination: "sheets",
    destLabel: "Google Sheets Sync",
    destIcon: Table,
    destColor: "text-emerald-600 bg-emerald-50 border-emerald-200"
  },
  {
    id: "tpl_blog_email",
    title: "Executive Essay Scraper → Email Digest",
    category: "AI Research",
    description: "Extracts long-form essays, runs deep thesis extraction, and formats a clean executive briefing delivered straight to your Gmail inbox.",
    targetUrl: "https://paulgraham.com/articles.html",
    promptText: "Extract core thesis, contrarian perspectives, and top 3 actionable takeaways.",
    destination: "email",
    destLabel: "Email Dispatch (SMTP/Gmail)",
    destIcon: Mail,
    destColor: "text-blue-600 bg-blue-50 border-blue-200"
  },
  {
    id: "tpl_techcrunch_slack",
    title: "TechCrunch Breaking Startup Intel → Slack",
    category: "Venture Capital",
    description: "Monitors breaking funding announcements and startup launches, compiling actionable founder intel posted directly into Slack.",
    targetUrl: "https://techcrunch.com",
    promptText: "Summarize top 2 breaking startup funding rounds, valuations, and market impact.",
    destination: "slack",
    destLabel: "Slack Channel Alert",
    destIcon: MessageSquare,
    destColor: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200"
  },
  {
    id: "tpl_yc_jobs_sheets",
    title: "YC AI Engineer Jobs Extractor → Google Sheets",
    category: "Lead Gen",
    description: "Extracts active AI/ML engineer roles from startup boards and automatically logs hiring companies, salaries, and tech stacks into Google Sheets.",
    targetUrl: "https://www.ycombinator.com/jobs",
    promptText: "Extract 3 active AI/ML engineering roles, required tech stacks, and locations.",
    destination: "sheets",
    destLabel: "Google Sheets Sync",
    destIcon: Table,
    destColor: "text-emerald-600 bg-emerald-50 border-emerald-200"
  }
];

export function TemplatesView({ onSelectTemplate }) {
  const [templates] = useState(STARTER_TEMPLATES);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Workflow Templates</h1>
        <p className="text-sm text-slate-500 mt-1">
          Production-grade multi-destination workflow blueprints. Select any template to automatically pre-populate canvas nodes with custom integrations.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {templates.map((tpl) => {
          const DestIcon = tpl.destIcon;
          return (
            <div key={tpl.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-full font-semibold uppercase">
                    {tpl.category}
                  </span>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${tpl.destColor} flex items-center gap-1`}>
                    <DestIcon className="w-3 h-3" />
                    {tpl.destLabel}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900">{tpl.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="mt-4 p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-[11px] text-slate-600 font-mono truncate">
                  Target: {tpl.targetUrl}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-slate-500" /> Scrape</span>
                  <span>→</span>
                  <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-purple-500" /> Gemini</span>
                  <span>→</span>
                  <span className="flex items-center gap-1"><DestIcon className="w-3.5 h-3.5 text-slate-700" /> Destination</span>
                </div>

                <button
                  onClick={() => onSelectTemplate(tpl)}
                  className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  Use Template
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
