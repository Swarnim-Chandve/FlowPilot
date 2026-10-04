import React, { useState, useEffect } from "react";
import { Globe, Sparkles } from "lucide-react";

const STARTER_TEMPLATES = [
  {
    id: "tpl_blog",
    title: "Blog Scraper to Gemini Insights",
    category: "AI Research",
    description: "Extracts core thesis, arguments, and actionable takeaways from long-form essays.",
    targetUrl: "https://paulgraham.com/articles.html",
    promptText: "Extract the core thesis and top 3 counter-intuitive takeaways."
  },
  {
    id: "tpl_hn_sentiment",
    title: "HackerNews & Tech Trend Radar",
    category: "Market Intel",
    description: "Monitors front-page discussions, community sentiment shifts, and emergent patterns.",
    targetUrl: "https://news.ycombinator.com",
    promptText: "Summarize top 2 trending stories and key sentiment."
  },
  {
    id: "tpl_pricing_monitor",
    title: "Competitor SaaS Pricing Watcher",
    category: "Competitive Analysis",
    description: "Scrapes competitor landing pages to detect price tier changes and feature updates.",
    targetUrl: "https://stripe.com/pricing",
    promptText: "Extract all public pricing tiers, fees, and feature differentiators."
  },
  {
    id: "tpl_github_cve",
    title: "GitHub Release Notes & Security Digest",
    category: "DevSecOps",
    description: "Fetches releases from mission-critical repositories and highlights security patches.",
    targetUrl: "https://github.com/fastapi/fastapi/releases",
    promptText: "Identify breaking changes, security patches, and new features."
  },
  {
    id: "tpl_job_extractor",
    title: "YC Remote AI Engineer Job Extractor",
    category: "Lead Gen",
    description: "Extracts active AI/ML engineer job postings from startup boards.",
    targetUrl: "https://www.ycombinator.com/jobs",
    promptText: "Extract AI/ML engineering roles, tech stacks, and salary ranges."
  }
];

export function TemplatesView({ onSelectTemplate }) {
  const [templates, setTemplates] = useState(STARTER_TEMPLATES);

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/templates")
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.length > 0) setTemplates(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Workflow Templates</h1>
        <p className="text-sm text-slate-500 mt-1">
          Production-grade agentic workflow templates. Select any template to instantly pre-fill canvas nodes and run.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-full font-semibold uppercase">
                  {tpl.category}
                </span>
                <span className="text-xs text-slate-400">Headless + Gemini 2.5</span>
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
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>→</span>
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              </div>

              <button
                onClick={() => onSelectTemplate(tpl)}
                className="px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
