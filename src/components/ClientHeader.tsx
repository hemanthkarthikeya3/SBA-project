import React from 'react';
import { ArrowLeft, Download, Calendar, ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';
import { ClientProfile } from '../types';

interface ClientHeaderProps {
  client: ClientProfile;
  onBackToClients?: () => void;
  onExportReport: () => void;
  onScheduleReview: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({
  client,
  onBackToClients,
  onExportReport,
  onScheduleReview,
}) => {
  const getRiskBadge = (tier: string) => {
    switch (tier) {
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" />
            Risk Tier: Low
          </span>
        );
      case 'Moderate':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3" />
            Risk Tier: Moderate
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3" />
            Risk Tier: Elevated
          </span>
        );
    }
  };

  return (
    <header id="client-header" className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c4c6cf]/60 pb-4">
      <div>
        <button
          onClick={onBackToClients}
          className="flex items-center gap-1.5 text-xs font-mono uppercase text-[#74777f] hover:text-[#002045] mb-1 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clients</span>
        </button>
        
        <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
          {client.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#43474e] mt-1.5">
          <span>{client.industry}</span>
          <span className="text-[#c4c6cf]">•</span>
          <span>Client since {client.clientSince}</span>
          <span className="text-[#c4c6cf]">•</span>
          {getRiskBadge(client.riskTier)}
          <span className="text-[#c4c6cf]">•</span>
          <span className="text-xs bg-[#ebeef0] text-[#43474e] px-2 py-0.5 rounded">
            Rev: {client.annualRevenue}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          id="btn-export-report"
          onClick={onExportReport}
          className="px-3.5 py-2 border border-[#1960a3] text-[#1960a3] rounded bg-white hover:bg-[#1960a3]/5 font-medium text-xs md:text-sm flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
        <button
          id="btn-schedule-review"
          onClick={onScheduleReview}
          className="px-4 py-2 bg-[#002045] text-white rounded font-medium text-xs md:text-sm hover:bg-[#1a365d] flex items-center gap-1.5 transition-colors shadow-2xs"
        >
          <Calendar className="w-4 h-4" />
          <span>Schedule Review</span>
        </button>
      </div>
    </header>
  );
};
