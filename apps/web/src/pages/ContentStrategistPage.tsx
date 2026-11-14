import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PenTool,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Layers,
  Palette,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { VELTRIX_SERVICES, CONTENT_PILLARS } from '@veltrix/shared';

interface GeneratedCopy {
  topic: string;
  headline: string;
  contentPillar: string;
  serviceName: string;
  targetAudience: string;
  customerPainPoint: string;
  caption: string;
  suggestedCta: string;
  visualConcept: string;
  rationale: string;
}

interface ContentDraft {
  id: string;
  title: string;
  caption: string;
  contentPillar: string;
  suggestedCta: string;
  visualConcept: string;
  status: string;
  createdAt: string;
}

export const ContentStrategistPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'generate' | 'drafts'>('generate');
  const [selectedService, setSelectedService] = useState(VELTRIX_SERVICES[0].slug);
  const [selectedPillar, setSelectedPillar] = useState<'EDUCATION' | 'BUSINESS_GROWTH' | 'AUTHORITY' | 'INSPIRATION' | 'PROMOTION'>('EDUCATION');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedCopy | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [savedDraftSuccess, setSavedDraftSuccess] = useState(false);
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);

  const fetchDrafts = async () => {
    const token = localStorage.getItem('veltrix_token');
    try {
      const res = await fetch('/api/v1/content/drafts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDrafts(data.data);
      }
    } catch (err) {
      console.warn('Failed to load drafts:', err);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch('/api/v1/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          serviceSlug: selectedService,
          contentPillar: selectedPillar
        })
      });

      const data = await res.json();
      if (data.success) {
        setGenerated(data.data);
      }
    } catch (err) {
      console.error('Generation error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!generated) return;
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch('/api/v1/content/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: generated.headline,
          caption: generated.caption,
          contentPillar: generated.contentPillar,
          suggestedCta: generated.suggestedCta,
          visualConcept: generated.visualConcept
        })
      });

      const data = await res.json();
      if (data.success) {
        setSavedDraftSuccess(true);
        fetchDrafts();
        setTimeout(() => setSavedDraftSuccess(false), 2500);
      }
    } catch (err) {
      console.error('Draft save failed:', err);
    }
  };

  const copyToClipboard = (text: string, type: 'headline' | 'caption') => {
    navigator.clipboard.writeText(text);
    if (type === 'headline') {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    } else {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
            <PenTool className="h-3.5 w-3.5" />
            <span>Module 4 • AI Content Strategist</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">AI Content Planning & Copy Studio</h1>
          <p className="text-xs text-slate-400">
            Generate high-converting, pillar-aligned marketing copy mapped to Veltrix Hub's 11 core services.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 border border-slate-800 bg-[#0F1420] p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'generate' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Strategy</span>
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'drafts' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Drafts Library ({drafts.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'generate' && (
        <div className="space-y-6">
          {/* Controls: Service & Pillar Selection */}
          <div className="rounded-2xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  1. Target Service (from 11 Veltrix Hub Offerings)
                </label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {VELTRIX_SERVICES.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name} (#{s.orderIndex})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  2. Content Pillar
                </label>
                <select
                  value={selectedPillar}
                  onChange={(e) => setSelectedPillar(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                >
                  {CONTENT_PILLARS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:opacity-95 transition-all disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                <span>{generating ? 'Crafting Growth Copy...' : 'Generate Strategic Copy'}</span>
              </button>
            </div>
          </div>

          {/* Generated Result Output */}
          {generated && (
            <div className="rounded-2xl border border-blue-500/30 bg-[#0F1420] p-6 space-y-6 shadow-2xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-[11px] font-bold text-blue-400 border border-blue-500/20">
                    {generated.contentPillar}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-medium text-slate-300">{generated.serviceName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    {savedDraftSuccess ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Bookmark className="h-3.5 w-3.5" />}
                    <span>{savedDraftSuccess ? 'Saved to Drafts!' : 'Save to Library'}</span>
                  </button>

                  <button
                    onClick={() => navigate('/design-studio')}
                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500 transition-colors"
                  >
                    <Palette className="h-3.5 w-3.5" />
                    <span>Open in Design Studio</span>
                  </button>
                </div>
              </div>

              {/* Headline Hook */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Scroll-Stopping Hook / Headline
                  </span>
                  <button
                    onClick={() => copyToClipboard(generated.headline, 'headline')}
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {copiedHeadline ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedHeadline ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <h2 className="text-lg font-bold text-white font-heading">{generated.headline}</h2>
              </div>

              {/* Full Caption */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Full Post Caption & Formatting
                  </span>
                  <button
                    onClick={() => copyToClipboard(generated.caption, 'caption')}
                    className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    {copiedCaption ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedCaption ? 'Copied' : 'Copy Caption'}</span>
                  </button>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {generated.caption}
                </div>
              </div>

              {/* Strategic Insights Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 space-y-1">
                  <span className="text-[10px] font-semibold text-blue-400 uppercase">Suggested Visual Brief</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{generated.visualConcept}</p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3.5 space-y-1">
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase">Strategic Rationale</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{generated.rationale}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Drafts Library */}
      {activeTab === 'drafts' && (
        <div className="space-y-4">
          {drafts.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-[#0F1420] p-12 text-center text-xs text-slate-500 space-y-2">
              <Bookmark className="h-8 w-8 mx-auto text-slate-600" />
              <p>No drafts saved yet. Generate copy and click "Save to Library".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drafts.map((d) => (
                <div key={d.id} className="rounded-2xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                      {d.contentPillar}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-white line-clamp-2">{d.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{d.caption}</p>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {d.status}
                    </span>
                    <button
                      onClick={() => copyToClipboard(d.caption, 'caption')}
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Caption</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
