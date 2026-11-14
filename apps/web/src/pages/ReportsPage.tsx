import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  TrendingUp,
  Award,
  Users,
  DollarSign,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Facebook,
  Search,
  Printer
} from 'lucide-react';

interface ExecutiveReportData {
  generatedAt: string;
  organization: {
    name: string;
    slug: string;
    motto: string;
  };
  kpis: {
    totalReach: number;
    totalImpressions: number;
    avgEngagementRate: number;
    totalPosts: number;
    totalLeads: number;
    totalPipelineValue: number;
    wonDealsValue: number;
    winRate: number;
    seoScore: number;
  };
  leadSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  topPerformingPost?: {
    id: string;
    caption: string;
    contentPillar: string;
    engagementRate: number;
    reach: number;
    publishedAt: string;
  } | null;
  executiveSummary: string[];
  actionableRecommendations: string[];
}

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<ExecutiveReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExecutiveReport();
  }, []);

  const fetchExecutiveReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch('/api/v1/reports/executive', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setReport(data.data);
      }
    } catch (err) {
      console.error('Failed to load executive report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          Compiling executive growth intelligence...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Header (Hidden in Print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Executive Reports</h1>
          <p className="text-xs text-slate-400 mt-1">
            Performance summary aggregating social reach, post impressions, and growth benchmarks.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8 print:border-none print:p-0 print:bg-white print:text-black">
        {/* Report Top Branding */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                V
              </div>
              <div>
                <h2 className="text-xl font-bold text-white print:text-black">{report.organization.name}</h2>
                <p className="text-xs text-emerald-400 print:text-emerald-700 font-medium italic">
                  "{report.organization.motto}"
                </p>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 print:text-slate-600">
            <p className="font-semibold text-slate-300 print:text-black">EXECUTIVE PERFORMANCE REPORT</p>
            <p>Generated: {new Date(report.generatedAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            <p className="text-emerald-400 print:text-emerald-700 font-medium">All Data Live Verified via MongoDB Atlas</p>
          </div>
        </div>

        {/* Executive Highlights Callout */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 print:border-slate-300 print:bg-slate-50">
          <h3 className="text-sm font-bold text-white print:text-black mb-3 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400 print:text-emerald-700" />
            Executive Takeaways
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 print:text-slate-800 leading-relaxed list-disc list-inside">
            {report.executiveSummary.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        {/* 8-Point Growth Scorecard */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-3">
            Core Performance Scorecards
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl print:border-slate-300">
              <span className="text-[11px] text-slate-400 print:text-slate-600">Total Social Reach</span>
              <p className="text-xl font-bold text-white print:text-black mt-1">
                {report.kpis.totalReach.toLocaleString()}
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">Verified Facebook Posts</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl print:border-slate-300">
              <span className="text-[11px] text-slate-400 print:text-slate-600">Avg Engagement</span>
              <p className="text-xl font-bold text-emerald-400 print:text-emerald-700 mt-1">
                {report.kpis.avgEngagementRate}%
              </p>
              <span className="text-[10px] text-slate-400 print:text-slate-600">Benchmark: 2.0%</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl print:border-slate-300">
              <span className="text-[11px] text-slate-400 print:text-slate-600">CRM Pipeline Value</span>
              <p className="text-xl font-bold text-teal-400 print:text-teal-700 mt-1">
                ₦{report.kpis.totalPipelineValue.toLocaleString()}
              </p>
              <span className="text-[10px] text-slate-400 print:text-slate-600">{report.kpis.totalLeads} Prospects</span>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl print:border-slate-300">
              <span className="text-[11px] text-slate-400 print:text-slate-600">Technical SEO Health</span>
              <p className="text-xl font-bold text-white print:text-black mt-1">
                {report.kpis.seoScore}/100
              </p>
              <span className="text-[10px] text-emerald-400 font-medium">Optimal Status</span>
            </div>
          </div>
        </div>

        {/* Lead Attribution & Conversion Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 print:border-slate-300">
            <h4 className="text-xs font-bold text-white print:text-black uppercase tracking-wider mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Lead Attribution Channels
            </h4>
            <div className="space-y-3">
              {report.leadSources.map((src, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 print:text-black font-medium">{src.source}</span>
                    <span className="text-slate-400 print:text-slate-600">
                      {src.count} lead{src.count === 1 ? '' : 's'} ({src.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 print:bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${src.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Social Post Highlight */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 print:border-slate-300">
            <h4 className="text-xs font-bold text-white print:text-black uppercase tracking-wider mb-3 flex items-center gap-2">
              <Facebook className="w-4 h-4 text-blue-400" />
              Top Organic Post
            </h4>
            {report.topPerformingPost ? (
              <div className="space-y-2 text-xs">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {report.topPerformingPost.contentPillar}
                </span>
                <p className="text-slate-200 print:text-black leading-relaxed line-clamp-3">
                  "{report.topPerformingPost.caption}"
                </p>
                <div className="pt-2 flex items-center justify-between text-slate-400 print:text-slate-600 text-[11px] border-t border-slate-800/80">
                  <span>Reach: <strong className="text-white print:text-black">{report.topPerformingPost.reach}</strong></span>
                  <span>Engagement: <strong className="text-emerald-400 print:text-emerald-700">{report.topPerformingPost.engagementRate}%</strong></span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">No published posts yet.</p>
            )}
          </div>
        </div>

        {/* Actionable Next Steps */}
        <div className="pt-4 border-t border-slate-800 print:border-slate-300">
          <h4 className="text-xs font-bold text-white print:text-black uppercase tracking-wider mb-2.5">
            Recommended Growth Actions for Next 14 Days
          </h4>
          <div className="space-y-2">
            {report.actionableRecommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 print:text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 print:text-emerald-700 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
