import React, { useState, useEffect } from 'react';
import {
  Target,
  TrendingUp,
  MessageSquare,
  Link,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  DollarSign,
  Layers,
  PhoneCall
} from 'lucide-react';
import { VELTRIX_SERVICES } from '../shared/constants';

interface OpportunityData {
  totalLeads: number;
  totalPipelineValue: number;
  wonDealsValue: number;
  winRate: number;
  opportunities: Array<{
    id: string;
    title: string;
    supportingEvidence: string;
    recommendedAction: string;
    expectedOutcome: string;
    priority: string;
  }>;
}

export const ClientAcquisitionPage: React.FC = () => {
  const [data, setData] = useState<OpportunityData | null>(null);
  const [selectedService, setSelectedService] = useState(VELTRIX_SERVICES[0].slug);
  const [campaignCode, setCampaignCode] = useState('POST-WEB-01');
  const [customPhone, setCustomPhone] = useState('2348000000000');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpps = async () => {
      const token = localStorage.getItem('veltrix_token');
      try {
        const res = await fetch('/api/v1/leads/opportunities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await res.json();
        if (resData.success) {
          setData(resData.data);
        }
      } catch (err) {
        console.warn('Failed to load opportunities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  const handleGenerateLink = async () => {
    const token = localStorage.getItem('veltrix_token');
    try {
      const res = await fetch('/api/v1/leads/whatsapp-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceSlug: selectedService,
          campaignCode,
          phoneNumber: customPhone
        })
      });
      const resData = await res.json();
      if (resData.success) {
        setGeneratedLink(resData.data.waLink);
      }
    } catch (err) {
      console.error('Failed to generate link:', err);
    }
  };

  useEffect(() => {
    handleGenerateLink();
  }, [selectedService, campaignCode, customPhone]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
            <Target className="h-3.5 w-3.5" />
            <span>Module 6 • Client Acquisition Engine</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">Conversion Strategy & WhatsApp Attribution</h1>
          <p className="text-xs text-slate-400">
            Turn social visibility into direct, trackable customer inquiries and closed revenue.
          </p>
        </div>
      </div>

      {/* KPI Value Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Pipeline Value</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">
              ₦{(data?.totalPipelineValue || 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">Open Deals</span>
          </div>
          <p className="text-[11px] text-slate-500">Across all active CRM stages</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Closed Won Revenue</span>
            <ShieldCheck className="h-4 w-4 text-blue-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">
              ₦{(data?.wonDealsValue || 0).toLocaleString()}
            </span>
            <span className="text-[11px] font-semibold text-blue-400">Converted</span>
          </div>
          <p className="text-[11px] text-slate-500">Attributed to social campaigns</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Conversion Win Rate</span>
            <TrendingUp className="h-4 w-4 text-sky-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">
              {data?.winRate || 0}%
            </span>
            <span className="text-[11px] font-semibold text-slate-400">Inquiry to Sale</span>
          </div>
          <p className="text-[11px] text-slate-500">High-intent buyer ratio</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Active Leads in CRM</span>
            <Target className="h-4 w-4 text-amber-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white font-heading">
              {data?.totalLeads || 0}
            </span>
            <span className="text-[11px] font-semibold text-amber-400">Tracked</span>
          </div>
          <p className="text-[11px] text-slate-500">Linked to specific services</p>
        </div>
      </div>

      {/* Main Grid: WhatsApp Link Generator & AI Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: WhatsApp Attribution Link Builder (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-emerald-500/30 bg-[#0F1420] p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-bold text-white">WhatsApp Lead Attribution Generator</h2>
              <p className="text-[11px] text-slate-400">Creates tracked `wa.me` links with reference tokens for each post</p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Target Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              >
                {VELTRIX_SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Campaign Tracking Ref</label>
                <input
                  type="text"
                  value={campaignCode}
                  onChange={(e) => setCampaignCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Target WhatsApp Phone</label>
                <input
                  type="text"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-emerald-500 focus:outline-none font-mono text-xs"
                />
              </div>
            </div>

            {/* Generated Link Display */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-2">
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                Tracked Click-to-Chat URL
              </span>
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[11px] font-mono text-slate-300 truncate">{generatedLink}</span>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 shrink-0"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              When a prospect clicks this link from Facebook or Instagram, their message automatically includes the campaign code (`[Ref: ${campaignCode}]`), allowing instant attribution when they message your team.
            </p>
          </div>
        </div>

        {/* Right: AI Opportunity Finder Recommendations (6 Cols) */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800/80 bg-[#0F1420] p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-sm font-bold text-white">AI Opportunity Finder</h2>
                <p className="text-[11px] text-slate-400">Data-backed recommendations to accelerate client acquisition</p>
              </div>
            </div>
            <span className="text-[10px] rounded-full bg-blue-500/10 px-2 py-0.5 font-semibold text-blue-400">
              Active Strategy
            </span>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {data?.opportunities.map((opp) => (
              <div
                key={opp.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xs font-bold text-white">{opp.title}</h3>
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      opp.priority === 'HIGH'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {opp.priority} Priority
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-300">Evidence: </strong>{opp.supportingEvidence}
                </p>

                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <p className="text-[11px] text-emerald-400 font-medium">
                    ⚡ {opp.recommendedAction}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Expected outcome: {opp.expectedOutcome}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
