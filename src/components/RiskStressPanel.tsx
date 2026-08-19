import React from 'react';
import { Sparkles, AlertTriangle, TrendingDown, ChevronRight, Truck, ShieldAlert } from 'lucide-react';
import { RiskAlert } from '../types';

interface RiskStressPanelProps {
  alerts: RiskAlert[];
  onOpenModal: (modalType: 'ar_aging' | 'stress_test' | 'vendor_ledger' | 'working_capital') => void;
}

export const RiskStressPanel: React.FC<RiskStressPanelProps> = ({
  alerts,
  onOpenModal,
}) => {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'delayed_ar':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'seasonal_dip':
        return <TrendingDown className="w-5 h-5 text-[#f59e0b]" />;
      case 'supplier_cost':
        return <Truck className="w-5 h-5 text-[#1960a3]" />;
      default:
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'delayed_ar':
        return 'bg-red-600';
      case 'seasonal_dip':
        return 'bg-[#f59e0b]';
      case 'supplier_cost':
        return 'bg-[#1960a3]';
      default:
        return 'bg-amber-600';
    }
  };

  return (
    <section
      id="risk-stress-detection-section"
      className="relative rounded-lg p-4 md:p-6 flex flex-col border border-[#1960a3]/30 bg-gradient-to-br from-[#1960a3]/[0.03] to-[#7db6ff]/[0.08] shadow-xs"
    >
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-[#1960a3]/10 text-[#1960a3]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-[#002045]">
            Risk & Stress Detection
          </h2>
        </div>
        <span className="px-2.5 py-1 bg-[#7db6ff]/20 text-[#1960a3] text-xs font-semibold rounded border border-[#1960a3]/20">
          Real-time Analysis
        </span>
      </div>

      {/* Grid of Risk Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-white rounded p-4 border border-[#c4c6cf]/50 shadow-xs relative overflow-hidden flex flex-col justify-between hover:border-[#1960a3] transition-all group"
          >
            {/* Color Accent Indicator Strip */}
            <div className={`absolute top-0 left-0 w-1.5 h-full ${getBorderColor(alert.type)}`} />

            <div>
              <div className="flex justify-between items-start mb-2 pl-2">
                <h3 className="font-semibold text-sm md:text-base text-[#002045]">
                  {alert.title}
                </h3>
                {getIconForType(alert.type)}
              </div>

              <p className="text-xs md:text-sm text-[#43474e] mb-3 pl-2 leading-relaxed">
                {alert.description}
              </p>
            </div>

            <div className="pl-2 pt-2 border-t border-gray-100 flex items-center justify-between mt-auto">
              <span className="text-[11px] font-mono text-[#74777f]">
                {alert.impactMetric}
              </span>
              <button
                onClick={() => onOpenModal(alert.actionModal)}
                className="text-[#1960a3] text-xs md:text-sm font-semibold hover:underline flex items-center gap-1 cursor-pointer group-hover:translate-x-0.5 transition-transform"
              >
                <span>{alert.actionText}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
