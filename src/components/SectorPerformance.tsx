import React from 'react';
import { ChevronRight } from 'lucide-react';
import { SectorData } from '../types';

interface SectorPerformanceProps {
  sectors: SectorData[];
  selectedSector: string | null;
  onSelectSector: (sectorName: string | null) => void;
}

export const SectorPerformance: React.FC<SectorPerformanceProps> = ({
  sectors,
  selectedSector,
  onSelectSector,
}) => {
  return (
    <section id="sector-performance-section" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <button
          id="btn-sector-section-title"
          onClick={() => onSelectSector(null)}
          className="group inline-flex items-center space-x-2 text-xl sm:text-2xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer text-left"
        >
          <span>Sector Performance</span>
          <ChevronRight className="w-5 h-5 text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]" />
        </button>
        <span className="text-xs text-[#787b86] font-medium">1D Performance heatmap</span>
      </div>

      {/* Sector Grid Heatmap */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {sectors.map((sector) => {
          const isPos = sector.isPositive;
          const isSelected = selectedSector === sector.name;

          return (
            <div
              key={sector.id}
              id={`sector-card-${sector.id}`}
              onClick={() => onSelectSector(isSelected ? null : sector.name)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs relative ${
                isPos
                  ? 'bg-emerald-50/50 border-[#e0e3eb] hover:border-[#089981]'
                  : 'bg-red-50/50 border-[#e0e3eb] hover:border-[#f23645]'
              } ${
                isSelected
                  ? isPos
                    ? 'ring-2 ring-[#089981]'
                    : 'ring-2 ring-[#f23645]'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-[#131722] truncate mr-1">
                  {sector.name}
                </span>
                <span
                  className={`text-xs font-black whitespace-nowrap ${
                    isPos ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isPos ? '+' : ''}
                  {sector.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="mt-2 text-[11px] text-[#787b86] truncate">
                {sector.status}: {sector.tickers}
              </div>

              {/* Progress Bar Fill */}
              <div
                className={`w-full rounded-full h-1.5 mt-3 overflow-hidden ${
                  isPos ? 'bg-emerald-100' : 'bg-red-100'
                }`}
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    isPos ? 'bg-[#089981]' : 'bg-[#f23645]'
                  }`}
                  style={{ width: `${sector.barWidthPercent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
