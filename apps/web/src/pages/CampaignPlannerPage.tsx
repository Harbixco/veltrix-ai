import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Calendar,
  DollarSign,
  Target,
  CheckCircle2,
  Trash2,
  TrendingUp,
  FileText,
  Users,
  Sparkles,
  Play,
  Pause
} from 'lucide-react';
import { VELTRIX_SERVICES } from '@veltrix/shared';

interface Campaign {
  id: string;
  name: string;
  objective: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  service?: {
    id: string;
    name: string;
    slug: string;
  };
  leads?: Array<{
    id: string;
    fullName: string;
    stage: string;
    estimatedValue?: number;
  }>;
  drafts?: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export const CampaignPlannerPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formObjective, setFormObjective] = useState('');
  const [formServiceId, setFormServiceId] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formBudget, setFormBudget] = useState('150000');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch('/api/v1/campaigns', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCampaigns(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formObjective || !formStartDate) return;

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch('/api/v1/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          name: formName,
          objective: formObjective,
          serviceId: formServiceId || undefined,
          startDate: new Date(formStartDate).toISOString(),
          endDate: formEndDate ? new Date(formEndDate).toISOString() : undefined,
          budget: parseFloat(formBudget) || 0
        })
      });

      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setFormName('');
        setFormObjective('');
        setFormStartDate('');
        setFormEndDate('');
        setFormBudget('150000');
        setNotification('Campaign created and activated successfully!');
        fetchCampaigns();
        setTimeout(() => setNotification(null), 4000);
      }
    } catch (err) {
      console.error('Create campaign failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (campaign: Campaign) => {
    const nextStatus = campaign.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      const token = localStorage.getItem('veltrix_token');
      await fetch(`/api/v1/campaigns/${campaign.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ status: nextStatus })
      });
      setNotification(`Campaign marked as ${nextStatus}.`);
      fetchCampaigns();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Toggle status failed:', err);
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const token = localStorage.getItem('veltrix_token');
      await fetch(`/api/v1/campaigns/${id}`, {
        method: 'DELETE',
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      setNotification('Campaign deleted.');
      fetchCampaigns();
      setTimeout(() => setNotification(null), 3000);
    } catch (err) {
      console.error('Delete campaign failed:', err);
    }
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const activeCount = campaigns.filter((c) => c.status === 'ACTIVE').length;
  const totalLeadsAttributed = campaigns.reduce((sum, c) => sum + (c.leads?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Module 12
            </span>
            <span className="text-slate-400 text-xs">Multi-Channel Initiatives</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Campaign Planner</h1>
          <p className="text-slate-400 text-sm mt-1">
            Orchestrate goal-oriented marketing campaigns bundling copy, designs, calendar schedules, and CRM attribution.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {/* Notification */}
      {notification && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Summary Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Active Campaigns</span>
            <h3 className="text-2xl font-bold text-white mt-1">{activeCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Allocated Budget</span>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">₦{totalBudget.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">Attributed CRM Leads</span>
            <h3 className="text-2xl font-bold text-white mt-1">{totalLeadsAttributed}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    camp.status === 'ACTIVE'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {camp.status}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleToggleStatus(camp)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title={camp.status === 'ACTIVE' ? 'Pause Campaign' : 'Resume Campaign'}
                  >
                    {camp.status === 'ACTIVE' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteCampaign(camp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete Campaign"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className="text-base font-bold text-white mb-2">{camp.name}</h2>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">{camp.objective}</p>

              <div className="grid grid-cols-2 gap-3 text-xs p-3 bg-slate-950/60 rounded-xl border border-slate-800 mb-4">
                <div>
                  <span className="text-slate-500 block text-[10px]">Service Focus</span>
                  <span className="font-semibold text-slate-200">
                    {camp.service?.name || 'Website Development'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Budget</span>
                  <span className="font-semibold text-emerald-400">
                    ₦{(camp.budget || 0).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Start Date</span>
                  <span className="font-semibold text-slate-300">
                    {new Date(camp.startDate).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Attributed Leads</span>
                  <span className="font-semibold text-white">
                    {camp.leads?.length || 0} prospect{(camp.leads?.length || 0) === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                {camp.drafts?.length || 0} Copy Drafts
              </span>
              <span className="text-emerald-400 font-medium">Tracking Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-400" />
                  Launch New Campaign
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set objective, allocate budget, and tie to one of Veltrix Hub's 11 services.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Campaign Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Q4 High-Trust Website Rebuild Initiative"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Strategic Objective</label>
                <textarea
                  rows={3}
                  value={formObjective}
                  onChange={(e) => setFormObjective(e.target.value)}
                  placeholder="What is the commercial or engagement goal of this campaign?"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Service</label>
                  <select
                    value={formServiceId}
                    onChange={(e) => setFormServiceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">All Services</option>
                    {VELTRIX_SERVICES.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Budget (₦ NGN)</label>
                  <input
                    type="number"
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
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
                  {isSubmitting ? 'Creating...' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
