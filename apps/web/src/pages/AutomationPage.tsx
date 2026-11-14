import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Plus,
  Play,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Webhook,
  Activity,
  X
} from 'lucide-react';

interface AutomationWorkflow {
  id: string;
  name: string;
  triggerType: string;
  conditions: string;
  actions: string;
  isActive: boolean;
  executions?: Array<{ id: string; status: string; executedAt: string; payload: string }>;
}

export const AutomationPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // New workflow form state
  const [name, setName] = useState('');
  const [triggerType, setTriggerType] = useState('LEAD_CREATED');
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.zapier.com/hooks/catch/sample');

  const fetchWorkflows = async () => {
    const token = localStorage.getItem('veltrix_token');
    try {
      const res = await fetch('/api/v1/automation/workflows', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setWorkflows(data.data);
      }
    } catch (err) {
      console.warn('Failed to fetch workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const handleTestTrigger = async (workflowId: string) => {
    setTestingId(workflowId);
    setTestResult(null);
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch(`/api/v1/automation/workflows/${workflowId}/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          payload: {
            event: 'SIMULATED_TEST',
            leadName: 'Emeka Nwosu',
            service: 'Website Development',
            amount: 250000,
            timestamp: new Date().toISOString()
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setTestResult(data.data);
        fetchWorkflows();
      }
    } catch (err) {
      console.error('Trigger test failed:', err);
    } finally {
      setTestingId(null);
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('veltrix_token');

    try {
      const res = await fetch('/api/v1/automation/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          triggerType,
          conditions: JSON.stringify({ active: true }),
          actions: JSON.stringify([
            { type: 'DISPATCH_WEBHOOK', targetUrl: webhookUrl },
            { type: 'SEND_NOTIFICATION', channel: 'WHATSAPP' }
          ])
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setName('');
        fetchWorkflows();
      }
    } catch (err) {
      console.error('Create workflow failed:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
            <Cpu className="h-3.5 w-3.5" />
            <span>Module 8 • AI Automation Intelligence</span>
          </div>
          <h1 className="font-heading text-xl font-bold text-white">Business Automation & Webhook Dispatcher</h1>
          <p className="text-xs text-slate-400">
            Automate customer communication, lead routing, and outbound webhooks to Zapier, Make, and WhatsApp Cloud.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>New Automation Workflow</span>
        </button>
      </div>

      {/* Test Execution Result Banner */}
      {testResult && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>
              Automation triggered successfully! Execution logged in MongoDB Atlas (ID: {testResult.id})
            </span>
          </div>
          <button onClick={() => setTestResult(null)} className="text-xs underline hover:opacity-80">
            Dismiss
          </button>
        </div>
      )}

      {/* Active Workflows Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-white font-heading">
          Active Business Workflows ({workflows.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workflows.map((wf) => {
            const isTesting = testingId === wf.id;
            return (
              <div
                key={wf.id}
                className="rounded-2xl border border-slate-800/80 bg-[#0F1420] p-5 space-y-4 shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-blue-400 border border-blue-500/20">
                      ⚡ {wf.triggerType}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-white line-clamp-2">{wf.name}</h3>

                  <div className="space-y-1.5 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                      <Webhook className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Outbound Webhook + WhatsApp</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Executions logged: {wf.executions?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleTestTrigger(wf.id)}
                    disabled={isTesting}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-slate-800 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Play className={`h-3.5 w-3.5 ${isTesting ? 'animate-spin text-blue-400' : 'text-emerald-400'}`} />
                    <span>{isTesting ? 'Dispatching...' : 'Test Trigger'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Workflow Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0F1420] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading text-base font-bold text-white">Create Automation Workflow</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkflow} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Workflow Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Inbound Lead Instant WhatsApp Alert"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Trigger Event *</label>
                <select
                  value={triggerType}
                  onChange={(e) => setTriggerType(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="LEAD_CREATED">New Lead Created in CRM</option>
                  <option value="PROPOSAL_SENT">Proposal Sent to Client</option>
                  <option value="DEAL_WON">Deal Marked as Closed Won</option>
                  <option value="POST_PUBLISHED">New Post Published to Facebook</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Outbound Webhook URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none font-mono text-xs"
                  placeholder="https://hooks.zapier.com/..."
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-slate-800 bg-slate-900 py-2 font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-2 font-semibold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500"
                >
                  Activate Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
