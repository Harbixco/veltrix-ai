import React, { useState, useEffect } from 'react';
import {
  Users2,
  Plus,
  DollarSign,
  Phone,
  Mail,
  Building2,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  Filter,
  X
} from 'lucide-react';
import { VELTRIX_SERVICES, LEAD_STAGES } from '../shared/constants';

interface Lead {
  id: string;
  fullName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  source: string;
  attributionRef?: string;
  stage: string;
  estimatedValue?: number;
  notes?: string;
  service?: { name: string; slug: string };
  createdAt: string;
}

export const LeadManagementPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState('ALL');

  // New Lead form inputs
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+234');
  const [serviceId, setServiceId] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('150000');
  const [source, setSource] = useState('WHATSAPP');
  const [attributionRef, setAttributionRef] = useState('POST-WEB-01');

  const fetchLeads = async () => {
    const token = localStorage.getItem('veltrix_token');
    try {
      const res = await fetch('/api/v1/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
      }
    } catch (err) {
      console.warn('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch('/api/v1/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName,
          companyName,
          email,
          phone,
          source,
          attributionRef,
          estimatedValue: parseFloat(estimatedValue) || 0
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFullName('');
        setCompanyName('');
        fetchLeads();
      }
    } catch (err) {
      console.error('Failed to create lead:', err);
    }
  };

  const handleUpdateStage = async (leadId: string, newStage: string) => {
    const token = localStorage.getItem('veltrix_token');
    try {
      await fetch(`/api/v1/leads/${leadId}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stage: newStage })
      });
      fetchLeads();
    } catch (err) {
      console.error('Failed to update stage:', err);
    }
  };

  const COLUMNS = [
    { key: 'NEW', label: 'New Inquiries', color: 'border-blue-500' },
    { key: 'CONTACTED', label: 'Contacted', color: 'border-sky-500' },
    { key: 'INTERESTED', label: 'Interested', color: 'border-indigo-500' },
    { key: 'QUALIFIED', label: 'Qualified', color: 'border-amber-500' },
    { key: 'PROPOSAL_SENT', label: 'Proposal Sent', color: 'border-purple-500' },
    { key: 'WON', label: 'Closed Won', color: 'border-emerald-500' },
    { key: 'LOST', label: 'Closed Lost', color: 'border-rose-500' }
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
            <Users2 className="h-3.5 w-3.5" />
            <span>Module 6 • CRM Pipeline</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">Lead Management & Conversion Pipeline</h1>
          <p className="text-xs text-slate-400">
            Track customer inquiries through stages from WhatsApp messages to paid signed contracts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Inbound Lead</span>
        </button>
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.key);
          const colValue = colLeads.reduce((acc, curr) => acc + (curr.estimatedValue || 0), 0);

          return (
            <div
              key={col.key}
              className="flex-shrink-0 w-72 rounded-2xl border border-slate-800 bg-[#0F1420] flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div className={`p-3.5 border-b border-slate-800 border-t-2 ${col.color} bg-slate-900/60 rounded-t-2xl`}>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xs font-bold text-white">{col.label}</span>
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {colLeads.length}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">₦{colValue.toLocaleString()}</p>
              </div>

              {/* Cards Container */}
              <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="rounded-xl border border-slate-800/90 bg-slate-900/80 p-3.5 space-y-2 shadow-md hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="truncate">
                        <h4 className="font-heading text-xs font-bold text-white truncate">{lead.fullName}</h4>
                        {lead.companyName && (
                          <p className="text-[11px] text-slate-400 truncate">{lead.companyName}</p>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                        ₦{(lead.estimatedValue || 0).toLocaleString()}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                      {lead.phone && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="h-3 w-3 text-slate-500" />
                          <span className="truncate">{lead.phone}</span>
                        </div>
                      )}
                      {lead.attributionRef && (
                        <span className="inline-block rounded bg-slate-800 px-1.5 py-0.5 text-[9px] font-mono text-blue-400">
                          {lead.attributionRef}
                        </span>
                      )}
                    </div>

                    {/* Stage Transition Selector */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500">Move stage:</span>
                      <select
                        value={lead.stage}
                        onChange={(e) => handleUpdateStage(lead.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-1.5 py-0.5 text-[10px] text-slate-300 focus:outline-none focus:border-blue-500"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {colLeads.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-slate-600">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0F1420] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-base font-bold text-white">Record New Inbound Lead</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Tunde Adeyemi"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Apex Logistics Ltd"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone (WhatsApp)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Estimated Deal Value (₦)</label>
                  <input
                    type="number"
                    value={estimatedValue}
                    onChange={(e) => setEstimatedValue(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="WHATSAPP">WhatsApp Message</option>
                    <option value="FACEBOOK">Facebook Page</option>
                    <option value="WEBSITE">Website Form</option>
                    <option value="REFERRAL">Referral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Attribution Ref</label>
                  <input
                    type="text"
                    value={attributionRef}
                    onChange={(e) => setAttributionRef(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900 py-2 font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
