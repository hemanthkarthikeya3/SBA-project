import React from 'react';
import { Package, ShieldCheck, CheckCircle2, Clock, DollarSign } from 'lucide-react';
import { BankingProduct } from '../../types';

interface ProductCatalogViewProps {
  products: BankingProduct[];
  onOpenProductInCopilot?: (product: BankingProduct) => void;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  products,
  onOpenProductInCopilot,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#c4c6cf]/60 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#002045] tracking-tight">
            Commercial Advisory Product & Policy Catalog
          </h1>
          <p className="text-sm text-[#74777f] mt-1">
            Standardized commercial solutions, transparent underwriting criteria & consultative banker guidelines
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 w-fit">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Responsible Banking & Fair Lending Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white border border-[#c4c6cf]/60 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-[#1960a3] transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-mono font-semibold uppercase bg-[#7db6ff]/15 text-[#1960a3] px-2 py-0.5 rounded">
                  {p.category}
                </span>
                <span className="text-xs text-[#74777f] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {p.turnaroundTime}
                </span>
              </div>

              <h2 className="text-base font-bold text-[#002045] mb-2">
                {p.name}
              </h2>

              <p className="text-xs text-[#43474e] leading-relaxed mb-4">
                {p.description}
              </p>

              <div className="space-y-2 mb-4 text-xs font-mono bg-slate-50 p-3 rounded border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-gray-500 uppercase text-[10px]">Pricing / Discount:</span>
                  <span className="font-bold text-[#002045]">{p.interestRateRange}</span>
                </div>
                <div className="border-t border-slate-200 pt-1">
                  <span className="text-gray-500 uppercase text-[10px] block">Eligibility Requirements:</span>
                  <span className="text-gray-800 text-[11px]">{p.creditRequirements}</span>
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <span className="text-xs font-semibold text-gray-700 block">Consultative Features:</span>
                {p.keyFeatureList.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-500 italic max-w-[240px] truncate" title={p.idealCustomerProfile}>
                Target: {p.idealCustomerProfile}
              </span>
              <button
                onClick={() => onOpenProductInCopilot?.(p)}
                className="px-3 py-1.5 bg-[#002045] text-white rounded text-xs font-semibold hover:bg-[#1a365d] transition-colors"
              >
                Match with Client
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
