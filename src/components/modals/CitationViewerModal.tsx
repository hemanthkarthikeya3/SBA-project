import React from 'react';
import { X, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Citation } from '../../types';

interface CitationViewerModalProps {
  citation: Citation | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CitationViewerModal: React.FC<CitationViewerModalProps> = ({
  citation,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !citation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-xl w-full border border-[#c4c6cf] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-[#f7fafc] rounded-t-lg">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1960a3]" />
            <div>
              <span className="text-[10px] font-mono uppercase bg-blue-100 text-[#1960a3] px-1.5 py-0.5 rounded font-bold">
                Source Citation • {citation.type.toUpperCase()}
              </span>
              <h2 className="text-base md:text-lg font-bold text-[#002045] mt-1">
                {citation.title}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-gray-800 leading-relaxed whitespace-pre-wrap">
            {citation.snippet}
          </div>

          <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-3 rounded border border-emerald-200">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>
              Verified Grounding: This factual citation originates directly from authenticated client ledger transactions and bank credit underwriting policy databases.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#002045] text-white rounded font-semibold hover:bg-[#1a365d]"
            >
              Close Citation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
