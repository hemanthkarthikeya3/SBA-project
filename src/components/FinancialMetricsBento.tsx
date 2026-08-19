import React from 'react';
import { ArrowUp, ArrowDown, Minus, Info } from 'lucide-react';
import { FinancialKPIs } from '../types';
import { formatK } from '../utils/formatters';

interface FinancialMetricsBentoProps {
  kpis: FinancialKPIs;
  onInspectMetric?: (metricName: string) => void;
}

export const FinancialMetricsBento: React.FC<FinancialMetricsBentoProps> = ({
  kpis,
  onInspectMetric,
}) => {
  return (
    <section id="financial-metrics-bento" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Quick Ratio Card */}
      <div
        onClick={() => onInspectMetric?.('Quick Ratio')}
        className="bg-white border border-[#c4c6cf]/60 rounded p-4 flex flex-col hover:border-[#1960a3] transition-all shadow-xs cursor-pointer group"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono font-medium text-[#74777f] uppercase tracking-wider">
            Quick Ratio
          </span>
          <Info className="w-3.5 h-3.5 text-[#74777f] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-3xl md:text-4xl font-bold text-[#002045] font-sans">
            {kpis.quickRatio.toFixed(1)}
          </span>
          <span
            className={`flex items-center text-xs font-semibold ${
              kpis.quickRatioYoY >= 0 ? 'text-emerald-700' : 'text-red-600'
            }`}
          >
            {kpis.quickRatioYoY >= 0 ? (
              <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
            )}
            {Math.abs(kpis.quickRatioYoY)} YoY
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-[#74777f] mt-auto pt-2 border-t border-gray-100">
          <span>Industry Benchmark: {kpis.quickRatioBenchmark.toFixed(1)}</span>
          <span className="text-emerald-600 font-medium font-mono text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded">
            +{(kpis.quickRatio - kpis.quickRatioBenchmark).toFixed(1)} Buffer
          </span>
        </div>
      </div>

      {/* Monthly Burn Rate Card in Rupees (₹) */}
      <div
        onClick={() => onInspectMetric?.('Burn Rate')}
        className="bg-white border border-[#c4c6cf]/60 rounded p-4 flex flex-col hover:border-[#1960a3] transition-all shadow-xs cursor-pointer group"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono font-medium text-[#74777f] uppercase tracking-wider">
            Burn Rate (Monthly)
          </span>
          <Info className="w-3.5 h-3.5 text-[#74777f] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-3xl md:text-4xl font-bold text-[#002045] font-sans">
            {formatK(kpis.monthlyBurnRate, true)}
          </span>
          <span
            className={`flex items-center text-xs font-semibold ${
              kpis.burnRateQoQ > 0 ? 'text-red-600' : 'text-emerald-700'
            }`}
          >
            {kpis.burnRateQoQ > 0 ? (
              <ArrowUp className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDown className="w-3.5 h-3.5 mr-0.5" />
            )}
            {kpis.burnRateQoQ}% QoQ
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-[#74777f] mt-auto pt-2 border-t border-gray-100">
          <span>Runway: <strong className="text-[#002045] font-semibold">{kpis.runwayMonths} Months</strong></span>
          <span className="text-[11px] bg-blue-50 text-[#1960a3] font-mono px-1.5 py-0.5 rounded font-medium">
            {kpis.cashBufferDays} Buffer Days
          </span>
        </div>
      </div>

      {/* Operating Margin Card */}
      <div
        onClick={() => onInspectMetric?.('Operating Margin')}
        className="bg-white border border-[#c4c6cf]/60 rounded p-4 flex flex-col hover:border-[#1960a3] transition-all shadow-xs cursor-pointer group sm:col-span-2 lg:col-span-1"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-mono font-medium text-[#74777f] uppercase tracking-wider">
            Operating Margin
          </span>
          <Info className="w-3.5 h-3.5 text-[#74777f] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        
        <div className="flex items-baseline gap-2.5 mb-1">
          <span className="text-3xl md:text-4xl font-bold text-[#002045] font-sans">
            {kpis.operatingMargin}%
          </span>
          <span className="flex items-center text-xs font-semibold text-[#74777f]">
            {kpis.operatingMarginTrend === 'flat' ? (
              <>
                <Minus className="w-3.5 h-3.5 mr-0.5" />
                Flat
              </>
            ) : kpis.operatingMarginTrend === 'up' ? (
              <>
                <ArrowUp className="w-3.5 h-3.5 mr-0.5 text-emerald-700" />
                +2% QoQ
              </>
            ) : (
              <>
                <ArrowDown className="w-3.5 h-3.5 mr-0.5 text-red-600" />
                -3% QoQ
              </>
            )}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-[#74777f] mt-auto pt-2 border-t border-gray-100">
          <span>Industry Benchmark: {kpis.operatingMarginBenchmark}%</span>
          <span className="text-xs text-[#002045] font-medium font-mono">
            DSCR: {kpis.dscr}x
          </span>
        </div>
      </div>
    </section>
  );
};
