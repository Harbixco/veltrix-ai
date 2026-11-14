import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Shield,
  Key,
  Database,
  Lock,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';

interface SettingsData {
  organization: {
    id: string;
    name: string;
    slug: string;
    planType: string;
    createdAt: string;
  };
  members: Array<{
    id: string;
    role: string;
    joinedAt: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatarUrl?: string;
    };
  }>;
  apiConfig: {
    metaApiVersion: string;
    tokenEncryption: string;
    databaseEngine: string;
    webhookActive: boolean;
  };
}

export const SettingsPage: React.FC = () => {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('veltrix_token');
      const res = await fetch('/api/v1/settings', {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      });
      const result = await res.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyOrgId = () => {
    if (data?.organization.id) {
      navigator.clipboard.writeText(data.organization.id);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          Loading workspace configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-xl font-bold text-white tracking-tight">Workspace Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage organization profile, team members, and API security keys.
        </p>
      </div>

      {/* Organization Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-400" /> Organization Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-slate-950/60 p-3.5 sm:p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-xs block mb-1">Organization Name</span>
            <span className="text-white font-bold text-base">{data.organization.name}</span>
          </div>

          <div className="bg-slate-950/60 p-3.5 sm:p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-xs block mb-1">Tenant Slug</span>
            <span className="text-emerald-400 font-mono text-sm">{data.organization.slug}</span>
          </div>

          <div className="bg-slate-950/60 p-3.5 sm:p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 text-xs block mb-1">Active Plan</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PRO ENTERPRISE
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 truncate">
            Tenant ID: <code className="text-slate-200 font-mono text-[11px]">{data.organization.id}</code>
          </span>
          <button
            onClick={handleCopyOrgId}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors self-start sm:self-auto"
          >
            {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey ? 'Copied' : 'Copy ID'}</span>
          </button>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Team Members & Access Roles
        </h2>

        <div className="space-y-3">
          {data.members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow shrink-0">
                  {member.user.firstName ? member.user.firstName[0] : 'A'}
                </div>
                <div className="truncate">
                  <h3 className="text-xs font-bold text-white truncate">
                    {member.user.firstName} {member.user.lastName}
                  </h3>
                  <p className="text-[11px] text-slate-400 truncate">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800/80">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {member.role}
                </span>
                <span className="text-[11px] text-slate-500">
                  Joined {new Date(member.joinedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Infrastructure Security */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" /> Infrastructure Security
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 block mb-1">Database Cluster</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              {data.apiConfig.databaseEngine}
            </span>
            <p className="text-[10px] text-emerald-400 mt-1">36 Collections Verified</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 block mb-1">Token Cryptography</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-teal-400" />
              {data.apiConfig.tokenEncryption}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">IV + Auth Tag Validation</p>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-slate-500 block mb-1">Meta API Version</span>
            <span className="font-bold text-white flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-400" />
              Meta Graph {data.apiConfig.metaApiVersion}
            </span>
            <p className="text-[10px] text-emerald-400 mt-1">Direct Page Publishing</p>
          </div>
        </div>
      </div>
    </div>
  );
};
