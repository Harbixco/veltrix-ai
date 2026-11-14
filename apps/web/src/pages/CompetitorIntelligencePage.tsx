import React, { useState, useEffect } from 'react';
import {
  Compass,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trash2,
  Globe,
  Facebook
} from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  websiteUrl?: string;
  facebookPageUrl?: string;
  strengths: string[];
  weaknesses: string[];
  differentiators: string[];
}

export const CompetitorIntelligencePage: React.FC = () => {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [facebookPageUrl, setFacebookPageUrl] = useState('');
  const [strengths, setStrengths] = useState('');
  const [weaknesses, setWeaknesses] = useState('');
  const [differentiators, setDifferentiators] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch('/api/v1/competitors', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCompetitors(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch competitors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch('/api/v1/competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          name,
          websiteUrl: websiteUrl || undefined,
          facebookPageUrl: facebookPageUrl || undefined,
          strengths: strengths.split(',').map((s) => s.trim()).filter(Boolean),
          weaknesses: weaknesses.split(',').map((w) => w.trim()).filter(Boolean),
          differentiators: differentiators.split(',').map((d) => d.trim()).filter(Boolean)
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setName('');
        setWebsiteUrl('');
        setFacebookPageUrl('');
        setStrengths('');
        setWeaknesses('');
        setDifferentiators('');
        setNotification('Competitor registered in intelligence hub.');
        fetchCompetitors();
        setTimeout(() => setNotification(null), 3000);
      }
    } catch (err) {
      console.error('Failed to create competitor:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCompetitor = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this competitor?')) return;
    try {
      const token = localStorage.getItem('veltrix_token');
      await fetch(`/api/v1/competitors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setNotification('Competitor removed.');
      fetchCompetitors();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Failed to delete competitor:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Module 9
            </span>
            <span className="text-slate-400 text-xs">Market Differentiation</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Competitor & Market Intelligence</h1>
          <p className="text-slate-400 text-sm mt-1">
            Analyze market positioning to emphasize Veltrix Hub's unique competitive advantages and conversion architectures.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Competitor
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Brand Value Anchor Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/40 border border-emerald-500/20 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white mb-1">Veltrix Hub Core Differentiation Rule</h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              "We don't just build websites. We build trust." Unlike generic freelance developers or cookie-cutter template builders, Veltrix Hub combines production Next.js architectures with WhatsApp-first client attribution funnels and localized social proof.
            </p>
          </div>
        </div>
      </div>

      {/* Competitors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {competitors.map((comp) => (
          <div
            key={comp.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white">{comp.name}</h3>
                <button
                  onClick={() => handleDeleteCompetitor(comp.id)}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                {comp.websiteUrl && (
                  <a
                    href={comp.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </a>
                )}
                {comp.facebookPageUrl && (
                  <a
                    href={comp.facebookPageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    Meta Page
                  </a>
                )}
              </div>

              {/* Strengths */}
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Strengths
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.strengths.map((str, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-950 border border-slate-800 text-slate-300"
                    >
                      {str}
                    </span>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5 flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-amber-400" /> Weaknesses
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {comp.weaknesses.map((weak, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-500/10 border border-amber-500/20 text-amber-300"
                    >
                      {weak}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Veltrix Advantage */}
            <div className="pt-3 border-t border-slate-800/80">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Veltrix Hub Edge
                </span>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  {comp.differentiators[0] || "Differentiates with 'We don't just build websites. We build trust.' and structured WhatsApp acquisition."}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Competitor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-emerald-400" />
                Add Competitor
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCompetitor} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Competitor Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Web Agency"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Facebook Page URL</label>
                  <input
                    type="url"
                    value={facebookPageUrl}
                    onChange={(e) => setFacebookPageUrl(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Strengths (Comma separated)</label>
                <input
                  type="text"
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="Low pricing, Fast turnaround, Brand recognition"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Weaknesses (Comma separated)</label>
                <input
                  type="text"
                  value={weaknesses}
                  onChange={(e) => setWeaknesses(e.target.value)}
                  placeholder="No conversion funnels, Poor mobile speed, Generic design"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Veltrix Hub Advantage</label>
                <input
                  type="text"
                  value={differentiators}
                  onChange={(e) => setDifferentiators(e.target.value)}
                  placeholder="Why Veltrix Hub wins over this competitor..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  {isSubmitting ? 'Saving...' : 'Add Competitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
