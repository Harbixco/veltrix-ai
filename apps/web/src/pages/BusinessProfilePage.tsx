import React, { useState } from 'react';
import { Building2, Palette, ShieldCheck, Save, Sparkles, Check } from 'lucide-react';
import { VELTRIX_BRAND_DEFAULTS, VELTRIX_SERVICES } from '@veltrix/shared';

export const BusinessProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'info' | 'brand' | 'services'>('info');
  const [saved, setSaved] = useState(false);

  // Form State initialized with permanent Veltrix brand identity
  const [formData, setFormData] = useState({
    businessName: VELTRIX_BRAND_DEFAULTS.businessName,
    tagline: VELTRIX_BRAND_DEFAULTS.tagline,
    mission: VELTRIX_BRAND_DEFAULTS.mission,
    vision: VELTRIX_BRAND_DEFAULTS.vision,
    location: VELTRIX_BRAND_DEFAULTS.location,
    brandVoice: VELTRIX_BRAND_DEFAULTS.brandVoice
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>Module 1 • Knowledge Base</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">Business Profile & AI Memory</h1>
          <p className="text-xs text-slate-400">
            Configure the permanent business knowledge base injected into all AI content and design prompts.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          <span>{saved ? 'Saved Successfully' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800/80 gap-2">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'info'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Company Identity</span>
        </button>

        <button
          onClick={() => setActiveTab('brand')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'brand'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>Brand Guidelines & Colors</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'services'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>11 Core Services</span>
        </button>
      </div>

      {/* Tab 1: Company Identity */}
      {activeTab === 'info' && (
        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Business Name</label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Core Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Mission Statement</label>
            <textarea
              rows={2}
              value={formData.mission}
              onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Vision Statement</label>
            <textarea
              rows={2}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Brand Tone & Voice</label>
            <textarea
              rows={2}
              value={formData.brandVoice}
              onChange={(e) => setFormData({ ...formData, brandVoice: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Brand Guidelines */}
      {activeTab === 'brand' && (
        <div className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-6 space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Color Palette (Hex Codes)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {Object.entries(VELTRIX_BRAND_DEFAULTS.colors).map(([key, hex]) => (
                <div key={key} className="rounded-lg border border-slate-800 bg-slate-900/80 p-3 space-y-2">
                  <div className="h-10 w-full rounded border border-white/10" style={{ backgroundColor: hex }} />
                  <div>
                    <p className="text-[10px] uppercase font-semibold text-slate-400">{key}</p>
                    <p className="text-xs font-mono text-slate-200">{hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 space-y-2">
            <h3 className="text-sm font-semibold text-white">Typography Hierarchy</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                <span className="text-slate-400 text-[10px] uppercase">Headings</span>
                <p className="text-sm font-bold text-white mt-1">Plus Jakarta Sans</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-3">
                <span className="text-slate-400 text-[10px] uppercase">Body Text</span>
                <p className="text-sm text-slate-200 mt-1">Inter</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: 11 Core Services */}
      {activeTab === 'services' && (
        <div className="space-y-3">
          <p className="text-xs text-slate-400">
            Pre-populated portfolio for Veltrix Hub. The AI automatically connects content and campaigns to these 11 services.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {VELTRIX_SERVICES.map((s) => (
              <div key={s.slug} className="rounded-xl border border-slate-800/80 bg-[#0F1420] p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{s.name}</span>
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    Active
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{s.description}</p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-300">Default CTA: </span>
                  {s.defaultCta}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
