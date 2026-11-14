import React from 'react';
import { Sparkles, Construction, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderProps {
  title: string;
  moduleNumber: number;
  description: string;
}

export const PlaceholderPage: React.FC<PlaceholderProps> = ({ title, moduleNumber, description }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6 space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
        <Sparkles className="h-8 w-8 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-md">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-400 border border-slate-700">
          <Construction className="h-3.5 w-3.5 text-amber-400" />
          <span>Module {moduleNumber} • Ready for Implementation</span>
        </div>
        <h1 className="font-heading text-xl font-bold text-white">{title}</h1>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Overview</span>
      </Link>
    </div>
  );
};
