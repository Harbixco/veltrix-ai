import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageCircle,
  Share2,
  ThumbsUp,
  Sparkles,
  Layers,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  X,
  Building2,
  ChevronRight
} from 'lucide-react';
import { CONTENT_PILLARS } from '../shared/constants';

interface AnalyticsOverview {
  totalPosts: number;
  totalReach: number;
  totalImpressions: number;
  totalReactions: number;
  totalComments: number;
  totalShares: number;
  totalInteractions: number;
  overallEngagementRate: number;
  bestPillar: string;
  pillarBreakdown: Record<string, { count: number; reach: number; interactions: number; avgEngagement: number }>;
}

interface RankedPost {
  id: string;
  externalPostId: string;
  caption: string;
  mediaType: string;
  mediaUrls: string[];
  contentPillar: string;
  publishedAt: string;
  performanceTier: 'TOP_PERFORMER' | 'AVERAGE' | 'NEEDS_IMPROVEMENT';
  metrics: {
    reach: number;
    impressions: number;
    reactions: number;
    comments: number;
    shares: number;
    clicks: number;
    engagementRate: number;
  };
  page?: { pageName: string; pageId: string };
}

interface DiagnosisData {
  postId: string;
  caption: string;
  contentPillar: string;
  metrics: {
    reach: number;
    reactions: number;
    comments: number;
    shares: number;
    engagementRate: number;
  };
  performanceTier: string;
  diagnosis: {
    headlineScore: number;
    headlineFeedback: string;
    messageClarityScore: number;
    messageClarityFeedback: string;
    ctaEffectivenessScore: number;
    ctaFeedback: string;
    pillarAlignment: string;
    aiHypothesis: string;
    recommendedAction: string;
  };
}

export const SocialAnalyticsPage: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [posts, setPosts] = useState<RankedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'engagementRate' | 'reach' | 'reactions'>('engagementRate');
  const [activeDiagnosis, setActiveDiagnosis] = useState<DiagnosisData | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('veltrix_token');
    try {
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Fetch Overview KPIs
      const overviewRes = await fetch('/api/v1/analytics/overview', { headers });
      const overviewData = await overviewRes.json();
      if (overviewData.success) {
        setOverview(overviewData.data);
      }

      // 2. Fetch Ranked Posts
      const postsRes = await fetch(
        `/api/v1/analytics/ranked-posts?pillar=${selectedPillar}&sortBy=${sortBy}`,
        { headers }
      );
      const postsData = await postsRes.json();
      if (postsData.success) {
        setPosts(postsData.data);
      }
    } catch (err) {
      console.warn('Analytics API error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPillar, sortBy]);

  const handleOpenDiagnosis = async (postId: string) => {
    setDiagnosing(true);
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch(`/api/v1/analytics/post/${postId}/diagnosis`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActiveDiagnosis(data.data);
      }
    } catch (err) {
      console.error('Failed to load diagnosis:', err);
    } finally {
      setDiagnosing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Module 3 • Social Media Analytics Engine</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">Social Analytics & Content Diagnostics</h1>
          <p className="text-xs text-slate-400">
            Transform raw post counts into qualitative marketing intelligence, diagnosing winning vs. weak content.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0F1420] px-3 py-1.5 text-xs text-slate-300">
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="bg-transparent focus:outline-none text-xs text-slate-200"
            >
              <option value="ALL" className="bg-slate-900">All Content Pillars</option>
              {CONTENT_PILLARS.map((p) => (
                <option key={p} value={p} className="bg-slate-900">{p}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-[#0F1420] px-3 py-1.5 text-xs text-slate-300">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none text-xs text-slate-200"
            >
              <option value="engagementRate" className="bg-slate-900">Sort by Engagement Rate</option>
              <option value="reach" className="bg-slate-900">Sort by Reach</option>
              <option value="reactions" className="bg-slate-900">Sort by Reactions</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Verified Total Reach</span>
            <Eye className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">
              {overview?.totalReach.toLocaleString() || 0}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">Live Sync</span>
          </div>
          <p className="text-[11px] text-slate-500">Across all connected Facebook Pages</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Avg Engagement Rate</span>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">
              {overview?.overallEngagementRate || 0.0}%
            </span>
            <span className="text-[11px] font-semibold text-blue-400">Verified</span>
          </div>
          <p className="text-[11px] text-slate-500">Industry benchmark: 1.5% - 3.5%</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Interactions</span>
            <MessageCircle className="h-4 w-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">
              {overview?.totalInteractions.toLocaleString() || 0}
            </span>
            <span className="text-[11px] text-slate-500">Reactions + Comments</span>
          </div>
          <p className="text-[11px] text-slate-500">Empirical social actions</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Top Content Pillar</span>
            <Sparkles className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-bold text-white font-heading truncate">
              {overview?.bestPillar || 'EDUCATION'}
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">Highest ROI</span>
          </div>
          <p className="text-[11px] text-slate-500">Highest conversation density</p>
        </div>
      </div>

      {/* 5 Content Pillars Performance Breakdown */}
      <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-white font-heading">
              Content Pillar Performance Analysis
            </h2>
          </div>
          <span className="text-xs text-slate-400">5 Strategic Pillars</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {CONTENT_PILLARS.map((pillar) => {
            const stat = overview?.pillarBreakdown?.[pillar] || { count: 0, reach: 0, avgEngagement: 0 };
            return (
              <div
                key={pillar}
                onClick={() => setSelectedPillar(pillar)}
                className={`rounded-xl border p-3.5 space-y-2 cursor-pointer transition-all ${
                  selectedPillar === pillar
                    ? 'border-blue-500 bg-blue-950/20'
                    : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-300 truncate">{pillar}</span>
                  <span className="text-[10px] rounded bg-slate-800 px-1.5 py-0.5 text-slate-400">
                    {stat.count} posts
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="text-base font-bold text-white font-heading">{stat.avgEngagement}%</p>
                  <p className="text-[10px] text-slate-500">Reach: {stat.reach.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ranked Posts Diagnostic Table */}
      <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white font-heading">
              Ranked Content Diagnostic Table ({posts.length} Posts)
            </h2>
          </div>
          <span className="text-xs text-slate-400">Click "AI Diagnose" for qualitative critique</span>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            No posts found matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-[10px] uppercase font-semibold text-slate-400 bg-slate-900/40">
                <tr>
                  <th className="py-2.5 px-3">Post Caption & Thumbnail</th>
                  <th className="py-2.5 px-3">Pillar</th>
                  <th className="py-2.5 px-3">Performance Tier</th>
                  <th className="py-2.5 px-3">Reach</th>
                  <th className="py-2.5 px-3">Reactions</th>
                  <th className="py-2.5 px-3">Comments</th>
                  <th className="py-2.5 px-3">Eng. Rate</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {posts.map((p) => {
                  return (
                    <tr key={p.id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="py-3 px-3 max-w-xs">
                        <div className="flex items-start gap-2.5">
                          {p.mediaUrls?.[0] ? (
                            <img
                              src={p.mediaUrls[0]}
                              alt="Post thumbnail"
                              className="h-10 w-10 rounded-md object-cover border border-slate-800 shrink-0"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-[10px] text-slate-400 shrink-0">
                              Text
                            </div>
                          )}
                          <div className="truncate">
                            <p className="truncate text-xs font-medium text-slate-200">{p.caption}</p>
                            <span className="text-[10px] text-slate-500">
                              {new Date(p.publishedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                          {p.contentPillar}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {p.performanceTier === 'TOP_PERFORMER' && (
                          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            ★ Top Performer
                          </span>
                        )}
                        {p.performanceTier === 'AVERAGE' && (
                          <span className="rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                            Average
                          </span>
                        )}
                        {p.performanceTier === 'NEEDS_IMPROVEMENT' && (
                          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-400 border border-rose-500/20">
                            Needs Hook
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {p.metrics?.reach?.toLocaleString() || 0}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{p.metrics?.reactions || 0}</td>
                      <td className="py-3 px-3 text-slate-300">{p.metrics?.comments || 0}</td>
                      <td className="py-3 px-3 font-semibold text-emerald-400">
                        {p.metrics?.engagementRate || 0.0}%
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleOpenDiagnosis(p.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/15 border border-blue-500/30 px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>AI Diagnose</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Post Diagnosis Modal */}
      {activeDiagnosis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0F1420] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-400" />
                <h3 className="font-heading text-base font-bold text-white">AI Post Diagnostic Report</h3>
              </div>
              <button
                onClick={() => setActiveDiagnosis(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Post Snippet */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <span className="text-[10px] font-semibold text-blue-400 uppercase">Original Caption</span>
              <p className="text-xs text-slate-200 leading-relaxed italic">
                "{activeDiagnosis.caption}"
              </p>
              <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60">
                <span>Reach: <strong className="text-white">{activeDiagnosis.metrics.reach}</strong></span>
                <span>Reactions: <strong className="text-white">{activeDiagnosis.metrics.reactions}</strong></span>
                <span>Comments: <strong className="text-white">{activeDiagnosis.metrics.comments}</strong></span>
                <span>Rate: <strong className="text-emerald-400">{activeDiagnosis.metrics.engagementRate}%</strong></span>
              </div>
            </div>

            {/* Qualitative Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Headline Hook</span>
                <p className="text-lg font-bold text-white">{activeDiagnosis.diagnosis.headlineScore} / 100</p>
                <p className="text-[10px] text-slate-400 leading-tight">{activeDiagnosis.diagnosis.headlineFeedback}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Message Clarity</span>
                <p className="text-lg font-bold text-white">{activeDiagnosis.diagnosis.messageClarityScore} / 100</p>
                <p className="text-[10px] text-slate-400 leading-tight">{activeDiagnosis.diagnosis.messageClarityFeedback}</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400">CTA Effectiveness</span>
                <p className="text-lg font-bold text-white">{activeDiagnosis.diagnosis.ctaEffectivenessScore} / 100</p>
                <p className="text-[10px] text-slate-400 leading-tight">{activeDiagnosis.diagnosis.ctaFeedback}</p>
              </div>
            </div>

            {/* AI Analytical Hypothesis vs Concrete Action */}
            <div className="space-y-3">
              <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <Lightbulb className="h-4 w-4" />
                  <span>AI Strategic Hypothesis (Evidence-backed)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeDiagnosis.diagnosis.aiHypothesis}
                </p>
              </div>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Target className="h-4 w-4" />
                  <span>Recommended Action for Next Post</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeDiagnosis.diagnosis.recommendedAction}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveDiagnosis(null)}
                className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
