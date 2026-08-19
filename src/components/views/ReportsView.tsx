import React from 'react';
import { BarChart3, FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import { ClientProfile } from '../../types';

interface ReportsViewProps {
  clients: ClientProfile[];
  onOpenReportModal: (client: ClientProfile) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  clients,
  onOpenReportModal,
}) => {
  const mockHistoricalReports = [
    {
      id: 'rep-01',
      client: 'Green Valley Organics',
      title: 'Q2 2026 Cash Flow Diagnostic & Delayed AR Brief',
      date: '2026-08-14',
      type: 'Executive Briefing Memo',
      status: 'Ready for Review',
    },
    {
      id: 'rep-02',
      client: 'Apex Build & Contracting',
      title: 'Retainage Liquidity & Line Upsize Underwriting Note',
      date: '2026-08-10',
      type: 'Credit Assessment',
      status: 'Shared with Client',
    },
    {
      id: 'rep-03',
      client: 'Beacon Health Partners',
      title: 'Practice Diagnostic Suite Equipment Lease Proposal',
      date: '2026-08-02',
      type: 'Advisory Pitch Pack',
      status: 'Approved',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#c4c6cf]/60 pb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
          Advisory Reports & Client Briefing Archives
        </h1>
        <p className="text-sm text-[#74777f] mt-1">
          Access AI-generated client memos, meeting preparation packs, and underwriting risk summaries
        </p>
      </div>

      <div className="bg-white border border-[#c4c6cf]/60 rounded-lg p-5 shadow-xs">
        <h2 className="text-base font-bold text-[#002045] mb-3">
          Recent Generated Client Reports
        </h2>

        <div className="space-y-3">
          {mockHistoricalReports.map((rep) => (
            <div
              key={rep.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-[#1960a3] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded bg-blue-50 text-[#1960a3]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                      {rep.type}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">{rep.date}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#002045] mt-1">{rep.title}</h3>
                  <p className="text-xs text-gray-600">Client: <strong>{rep.client}</strong></p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {rep.status}
                </span>
                <button
                  onClick={() => {
                    const c = clients.find((item) => item.name === rep.client) || clients[0];
                    onOpenReportModal(c);
                  }}
                  className="px-3 py-1.5 bg-[#1960a3] text-white rounded text-xs font-semibold hover:bg-[#002045] transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>View / Export</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
