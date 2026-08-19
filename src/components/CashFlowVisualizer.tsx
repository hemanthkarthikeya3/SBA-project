import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Sparkles, Filter } from 'lucide-react';
import { CashFlowPoint } from '../types';
import { formatK } from '../utils/formatters';

interface CashFlowVisualizerProps {
  data: CashFlowPoint[];
  isStressApplied?: boolean;
  onToggleStress?: () => void;
  onOpenStressModal?: () => void;
}

export const CashFlowVisualizer: React.FC<CashFlowVisualizerProps> = ({
  data,
  isStressApplied = false,
  onToggleStress,
  onOpenStressModal,
}) => {
  const [timeRange, setTimeRange] = useState<'90d' | '6m' | '1y'>('6m');
  const [hoveredPoint, setHoveredPoint] = useState<CashFlowPoint | null>(null);

  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (timeRange === '90d') {
      return data.slice(-5);
    }
    if (timeRange === '6m') {
      return data.slice(-8);
    }
    return data;
  }, [data, timeRange]);

  const maxVal = React.useMemo(() => {
    let max = 320;
    filteredData.forEach((d) => {
      const inf = d.isHistorical ? d.historicalInflow || 0 : d.predictedInflow || 0;
      const out = d.isHistorical ? d.historicalOutflow || 0 : d.predictedOutflow || 0;
      if (inf > max) max = inf;
      if (out > max) max = out;
    });
    return max + 30;
  }, [filteredData]);

  // Chart dimensions
  const chartHeight = 240;
  const paddingY = 30;
  const usableHeight = chartHeight - paddingY * 2;

  return (
    <section id="cash-flow-visualizer-card" className="bg-white border border-[#c4c6cf]/60 rounded p-4 md:p-6 flex flex-col shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#002045] flex items-center gap-2">
            <span>Cash Flow Visualizer</span>
            <span className="text-xs font-normal text-[#74777f] hidden lg:inline">
              (Monthly Inflows, Outflows & AI Projections in ₹ INR)
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Stress Scenario Toggle */}
          <button
            onClick={onToggleStress || onOpenStressModal}
            className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors border ${
              isStressApplied
                ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                : 'bg-[#f1f4f6] text-[#43474e] border-[#c4c6cf]/60 hover:bg-[#ebeef0]'
            }`}
          >
            <AlertCircle className={`w-3.5 h-3.5 ${isStressApplied ? 'text-amber-700' : 'text-[#74777f]'}`} />
            <span>{isStressApplied ? 'Q3 Stress Scenario ON' : 'Test Q3 Stress'}</span>
          </button>

          {/* Time range switcher */}
          <div className="flex gap-1 bg-[#f1f4f6] p-1 rounded border border-[#c4c6cf]/50">
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
                timeRange === '90d'
                  ? 'bg-white text-[#002045] shadow-xs font-semibold'
                  : 'text-[#74777f] hover:text-[#002045]'
              }`}
            >
              90 Days
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
                timeRange === '6m'
                  ? 'bg-white text-[#002045] shadow-xs font-semibold'
                  : 'text-[#74777f] hover:text-[#002045]'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setTimeRange('1y')}
              className={`px-2.5 py-0.5 rounded text-xs font-medium transition-all ${
                timeRange === '1y'
                  ? 'bg-white text-[#002045] shadow-xs font-semibold'
                  : 'text-[#74777f] hover:text-[#002045]'
              }`}
            >
              1 Year
            </button>
          </div>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full h-[250px] bg-slate-50/40 rounded border border-gray-100 flex flex-col justify-end p-2 overflow-hidden">
        {/* Horizontal gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between py-6 px-10 pointer-events-none opacity-40">
          <div className="border-b border-dashed border-gray-300 w-full flex justify-end text-[10px] text-gray-500">₹300k</div>
          <div className="border-b border-dashed border-gray-300 w-full flex justify-end text-[10px] text-gray-500">₹200k</div>
          <div className="border-b border-dashed border-gray-300 w-full flex justify-end text-[10px] text-gray-500">₹100k</div>
          <div className="border-b border-gray-400 w-full flex justify-end text-[10px] text-gray-500">₹0</div>
        </div>

        {/* Visual Bar Columns & Projections */}
        <div className="relative z-10 w-full h-full flex items-end justify-between px-6 pb-6 pt-4">
          {filteredData.map((pt, idx) => {
            const inflow = isStressApplied && !pt.isHistorical && pt.stressedInflow
              ? pt.stressedInflow
              : pt.isHistorical
              ? pt.historicalInflow || 0
              : pt.predictedInflow || 0;

            const outflow = isStressApplied && !pt.isHistorical && pt.stressedOutflow
              ? pt.stressedOutflow
              : pt.isHistorical
              ? pt.historicalOutflow || 0
              : pt.predictedOutflow || 0;

            const inflowHeight = (inflow / maxVal) * usableHeight;
            const outflowHeight = (outflow / maxVal) * usableHeight;
            const netVal = inflow - outflow;

            return (
              <div
                key={pt.month}
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative mx-1"
              >
                {/* Visual indicator for Predicted threshold line */}
                {!pt.isHistorical && idx === filteredData.findIndex((p) => !p.isHistorical) && (
                  <div className="absolute -left-2 top-0 bottom-6 w-px border-l-2 border-dashed border-[#1960a3]/60 z-20">
                    <span className="absolute -top-3 left-1 text-[9px] font-mono uppercase bg-[#7db6ff]/30 text-[#1960a3] px-1 rounded font-bold">
                      AI Forecast
                    </span>
                  </div>
                )}

                {/* Bars group */}
                <div className="flex items-end gap-1 w-full max-w-[36px] justify-center h-full pb-1">
                  {/* Inflow Bar */}
                  <div
                    style={{ height: `${Math.max(12, inflowHeight)}px` }}
                    className={`w-3.5 rounded-t transition-all duration-300 ${
                      pt.isHistorical
                        ? 'bg-[#002045] group-hover:bg-[#001733]'
                        : isStressApplied
                        ? 'bg-amber-600 border border-dashed border-amber-800'
                        : 'bg-[#1a365d]/80 border border-dashed border-[#002045]'
                    }`}
                  />

                  {/* Outflow Bar */}
                  <div
                    style={{ height: `${Math.max(12, outflowHeight)}px` }}
                    className={`w-3.5 rounded-t transition-all duration-300 ${
                      pt.isHistorical
                        ? 'bg-[#1960a3] group-hover:bg-[#124d85]'
                        : 'bg-[#7db6ff] border border-dashed border-[#1960a3]'
                    }`}
                  />
                </div>

                {/* Net Cash Marker Dot */}
                <div
                  className={`w-2 h-2 rounded-full mb-1 z-10 ${
                    netVal >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  title={`Net: ${formatK(netVal, true)}`}
                />

                {/* X-axis Label */}
                <span className="text-[11px] font-medium text-[#43474e] truncate w-full text-center group-hover:text-[#002045] group-hover:font-semibold">
                  {pt.label.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#002045] text-white p-3 rounded shadow-lg text-xs z-30 pointer-events-none min-w-[220px] animate-fadeIn border border-[#7db6ff]/30">
            <div className="flex justify-between items-center font-bold text-sm mb-1 pb-1 border-b border-white/20">
              <span>{hoveredPoint.label}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20">
                {hoveredPoint.isHistorical ? 'Verified Historical' : 'AI Modeled'}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-300">Inflows:</span>
                <span className="font-semibold text-emerald-300">
                  {formatK((hoveredPoint.isHistorical ? hoveredPoint.historicalInflow : hoveredPoint.predictedInflow) || 0, true)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Outflows:</span>
                <span className="font-semibold text-blue-300">
                  {formatK((hoveredPoint.isHistorical ? hoveredPoint.historicalOutflow : hoveredPoint.predictedOutflow) || 0, true)}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10 font-bold">
                <span>Net Cash Delta:</span>
                <span
                  className={
                    (hoveredPoint.historicalInflow || hoveredPoint.predictedInflow || 0) -
                      (hoveredPoint.historicalOutflow || hoveredPoint.predictedOutflow || 0) >=
                    0
                      ? 'text-emerald-400'
                      : 'text-red-400'
                  }
                >
                  {formatK(
                    (hoveredPoint.historicalInflow || hoveredPoint.predictedInflow || 0) -
                      (hoveredPoint.historicalOutflow || hoveredPoint.predictedOutflow || 0),
                    true
                  )}
                </span>
              </div>
              {hoveredPoint.events && (
                <div className="mt-2 text-[10px] text-amber-200 bg-amber-950/40 p-1.5 rounded border border-amber-500/30">
                  ⚠️ <strong>Signal:</strong> {hoveredPoint.events}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend Matching Mockup */}
      <div className="flex flex-wrap justify-center gap-6 mt-4 text-xs font-mono uppercase text-[#74777f]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#002045]" />
          <span>Historical Inflow (₹)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#1960a3]" />
          <span>Historical Outflow (₹)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full border-2 border-[#002045] border-dashed" />
          <span>Predicted Inflow (₹)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span>Positive Net Delta</span>
        </div>
      </div>
    </section>
  );
};
