import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Globe,
  TrendingUp,
  FileText,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers
} from 'lucide-react';

interface SEOAudit {
  url: string;
  auditScore: number;
  metaTitle: { text: string; length: number; status: string; feedback: string };
  metaDescription: { text: string; length: number; status: string; feedback: string };
  headings: { h1Count: number; h1Text: string; status: string; h2Count: number };
  technicalChecks: { sslSecured: boolean; mobileResponsive: boolean; hasFavicon: boolean; loadSpeedEst: string };
  recommendations: string[];
}

interface KeywordItem {
  id: string;
  query: string;
  searchVolume: number;
  averagePosition: number;
  clicks: number;
  impressions: number;
  intent: string;
}

export const SEOIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'keywords' | 'outline'>('audit');
  const [targetUrl, setTargetUrl] = useState('https://veltrixhub.com');
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<SEOAudit | null>(null);
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [outlineTopic, setOutlineTopic] = useState('CAC Business Registration in Nigeria');
  const [outlineResult, setOutlineResult] = useState<any>(null);
  const [outlineLoading, setOutlineLoading] = useState(false);

  useEffect(() => {
    const fetchKeywords = async () => {
      const token = localStorage.getItem('veltrix_token');
      try {
        const res = await fetch('/api/v1/seo/keywords', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setKeywords(data.data);
        }
      } catch (err) {
        console.warn('Failed to load keywords:', err);
      }
    };
    fetchKeywords();
  }, []);

  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuditLoading(true);
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch('/api/v1/seo/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ url: targetUrl })
      });
      const data = await res.json();
      if (data.success) {
        setAuditResult(data.data);
      }
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleGenerateOutline = async () => {
    setOutlineLoading(true);
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch('/api/v1/seo/outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ topic: outlineTopic })
      });
      const data = await res.json();
      if (data.success) {
        setOutlineResult(data.data);
      }
    } catch (err) {
      console.error('Outline failed:', err);
    } finally {
      setOutlineLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
            <Search className="h-3.5 w-3.5" />
            <span>Module 7 • AI Search Engine Optimization Intelligence</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">SEO Audits & Keyword Intent Intelligence</h1>
          <p className="text-xs text-slate-400">
            Diagnose website search visibility, track organic search queries, and generate search-optimized content outlines.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border border-slate-800 bg-[#0F1420] p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'audit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            On-Page Audit
          </button>
          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'keywords' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Keyword Intent ({keywords.length})
          </button>
          <button
            onClick={() => setActiveTab('outline')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'outline' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            SEO Content Outline
          </button>
        </div>
      </div>

      {/* Tab 1: On-Page Audit */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Audit URL Form */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-4">
            <form onSubmit={handleRunAudit} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  placeholder="https://yourwebsite.com"
                />
              </div>
              <button
                type="submit"
                disabled={auditLoading}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all disabled:opacity-50 shrink-0"
              >
                <Zap className={`h-4 w-4 ${auditLoading ? 'animate-bounce' : ''}`} />
                <span>{auditLoading ? 'Running Technical Audit...' : 'Run On-Page Audit'}</span>
              </button>
            </form>
          </div>

          {/* Audit Result View */}
          {auditResult && (
            <div className="rounded-2xl border border-blue-500/30 bg-[#0F1420] p-6 space-y-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-blue-400">Audited Web Property</span>
                  <h2 className="text-sm font-bold text-white font-mono">{auditResult.url}</h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase">On-Page SEO Score</span>
                    <p className="text-2xl font-bold text-emerald-400 font-heading">{auditResult.auditScore} / 100</p>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Meta Title */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Page Meta Title</span>
                    <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                      {auditResult.metaTitle.length} chars • Optimal
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {auditResult.metaTitle.text}
                  </p>
                  <p className="text-[11px] text-slate-400">{auditResult.metaTitle.feedback}</p>
                </div>

                {/* Meta Description */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">Meta Description</span>
                    <span className="rounded bg-emerald-500/10 text-emerald-400 px-2 py-0.5 text-[10px] font-bold">
                      {auditResult.metaDescription.length} chars • Optimal
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    {auditResult.metaDescription.text}
                  </p>
                  <p className="text-[11px] text-slate-400">{auditResult.metaDescription.feedback}</p>
                </div>
              </div>

              {/* Technical Checks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500">SSL Certificate</span>
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>HTTPS Active</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500">Mobile Ready</span>
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Responsive Viewport</span>
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500">H1 Tag Count</span>
                  <p className="text-xs font-bold text-white">
                    {auditResult.headings.h1Count} tag (Proper)
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500">Speed Estimate</span>
                  <p className="text-xs font-bold text-blue-400 font-mono">
                    {auditResult.technicalChecks.loadSpeedEst}
                  </p>
                </div>
              </div>

              {/* AI Recommendations */}
              <div className="space-y-2 border-t border-slate-800/80 pt-4">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                  Actionable AI SEO Improvements
                </span>
                <div className="space-y-2">
                  {auditResult.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-300"
                    >
                      <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Keyword Intent Intelligence */}
      {activeTab === 'keywords' && (
        <div className="rounded-2xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-semibold text-white font-heading">
                High-Intent Organic Search Queries
              </h2>
              <p className="text-xs text-slate-400">Classified by buyer search intent</p>
            </div>
            <span className="text-xs text-slate-400">Google Search Console Integration</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-[10px] uppercase font-semibold text-slate-400 bg-slate-900/40">
                <tr>
                  <th className="py-2.5 px-3">Search Query</th>
                  <th className="py-2.5 px-3">Intent</th>
                  <th className="py-2.5 px-3">Avg Position</th>
                  <th className="py-2.5 px-3">Monthly Volume</th>
                  <th className="py-2.5 px-3">Organic Clicks</th>
                  <th className="py-2.5 px-3">Impressions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {keywords.map((k) => (
                  <tr key={k.id} className="hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-3 font-medium text-white max-w-xs truncate">{k.query}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                          k.intent === 'TRANSACTIONAL'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : k.intent === 'COMMERCIAL'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {k.intent}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-white">#{k.averagePosition}</td>
                    <td className="py-3 px-3">{k.searchVolume?.toLocaleString()}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400">{k.clicks}</td>
                    <td className="py-3 px-3 text-slate-400">{k.impressions.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: SEO Content Outline Generator */}
      {activeTab === 'outline' && (
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Topic or Service Guide
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={outlineTopic}
                  onChange={(e) => setOutlineTopic(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. CAC Business Registration in Nigeria"
                />
                <button
                  onClick={handleGenerateOutline}
                  disabled={outlineLoading}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all shrink-0"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{outlineLoading ? 'Analyzing...' : 'Generate SEO Outline'}</span>
                </button>
              </div>
            </div>
          </div>

          {outlineResult && (
            <div className="rounded-2xl border border-slate-800/80 bg-[#0F1420] p-6 space-y-5 shadow-xl text-xs">
              <div className="border-b border-slate-800 pb-3 space-y-1">
                <span className="text-[10px] text-blue-400 uppercase font-semibold">Recommended H1 Title</span>
                <h3 className="font-heading text-base font-bold text-white">{outlineResult.suggestedTitle}</h3>
                <p className="text-slate-400 text-xs italic">{outlineResult.metaDescription}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Heading Hierarchy (H1, H2, H3)
                </span>
                <div className="space-y-1.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                  {outlineResult.headingsStructure.map((h: any, i: number) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2.5 ${
                        h.level === 'H1' ? 'font-bold text-white text-xs' : h.level === 'H2' ? 'pl-4 text-blue-300 font-medium' : 'pl-8 text-slate-400'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-slate-500">{h.level}</span>
                      <span>{h.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
