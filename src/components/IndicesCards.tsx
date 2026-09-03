import React from 'react';
import { ChevronRight, Pause, Play } from 'lucide-react';
import { CategoryType, IndexCardData } from '../types';

interface IndicesCardsProps {
  category: CategoryType;
  cards: IndexCardData[];
  onSelectCard: (card: IndexCardData) => void;
  isLiveUpdating: boolean;
  onToggleLive: () => void;
}

export const IndicesCards: React.FC<IndicesCardsProps> = ({
  category,
  cards,
  onSelectCard,
  isLiveUpdating,
  onToggleLive,
}) => {
  const categoryTitle =
    category === 'indices'
      ? 'Indices'
      : category === 'stocks'
      ? 'Leading Stocks'
      : category === 'crypto'
      ? 'Crypto Majors'
      : category === 'forex'
      ? 'Forex Currencies'
      : category === 'futures'
      ? 'Futures & Commodities'
      : 'Government Bonds';

  return (
    <section id="indices-cards-section" className="w-full">
      {/* Section Title & Link */}
      <div className="flex items-center justify-between mb-4">
        <button
          id="btn-section-title"
          onClick={() => {}}
          className="group inline-flex items-center space-x-2 text-xl sm:text-2xl font-bold tracking-tight text-[#131722] hover:text-[#2962ff] transition-colors cursor-pointer text-left"
        >
          <span>{categoryTitle}</span>
          <ChevronRight className="w-5 h-5 text-[#787b86] group-hover:text-[#2962ff] group-hover:translate-x-0.5 transition-all stroke-[2.5]" />
        </button>

        {/* Real-time update live toggle */}
        <button
          id="btn-toggle-live-updates"
          onClick={onToggleLive}
          title={isLiveUpdating ? 'Click to pause simulated feed' : 'Click to resume live feed'}
          className="flex items-center space-x-1.5 text-xs text-[#787b86] hover:text-[#131722] font-medium transition-colors cursor-pointer px-2 py-1 rounded-md hover:bg-gray-100"
        >
          <span
            className={`w-2 h-2 rounded-full transition-colors ${
              isLiveUpdating ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'
            }`}
          />
          <span>Real-time update</span>
          {isLiveUpdating ? (
            <Pause className="w-3 h-3 text-[#787b86] ml-1" />
          ) : (
            <Play className="w-3 h-3 text-[#787b86] ml-1" />
          )}
        </button>
      </div>

      {/* Indices Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isPos = card.isPositive;
          const strokeColor = isPos ? '#089981' : '#f23645';
          const gradId = `grad-${card.id}-${isPos ? 'green' : 'red'}`;

          // Format SVG sparkline coordinates
          const pts = card.sparkline;
          const stepX = 120 / (pts.length - 1);
          const pathD = pts
            .map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i * stepX).toFixed(1)} ${y}`)
            .join(' ');
          const areaD = `${pathD} L 120 35 L 0 35 Z`;

          return (
            <div
              key={card.id}
              id={`card-${card.id}`}
              onClick={() => onSelectCard(card)}
              className={`p-4 rounded-2xl bg-[#f8f9fd] hover:bg-[#f0f3fa] border border-[#e0e3eb]/80 transition-all duration-200 cursor-pointer shadow-xs hover:shadow relative overflow-hidden group ${
                card.flashState === 'up' ? 'flash-up' : card.flashState === 'down' ? 'flash-down' : ''
              }`}
            >
              {/* Top Row: Badge & Ticker Title */}
              <div className="flex items-center space-x-3 mb-3">
                <span
                  className="w-9 h-9 rounded-full text-white font-bold flex items-center justify-center shadow-xs flex-shrink-0"
                  style={{
                    backgroundColor: card.badgeBg,
                    fontSize: card.badgeText.length > 3 ? '10px' : '12px',
                  }}
                >
                  {card.badgeText}
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-[#131722] truncate group-hover:text-[#2962ff] transition-colors">
                    {card.name}
                  </div>
                  <div className="text-[11px] text-[#787b86] uppercase tracking-wide truncate">
                    {card.typeDesc}
                  </div>
                </div>
              </div>

              {/* Price & Change Row */}
              <div className="flex items-baseline justify-between mt-1">
                <div className="text-xl font-extrabold text-[#131722] tracking-tight">
                  {card.lastPrice.toLocaleString(undefined, {
                    minimumFractionDigits: card.lastPrice < 10 ? 4 : 2,
                    maximumFractionDigits: card.lastPrice < 10 ? 4 : 2,
                  })}
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs font-bold ${
                      isPos ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}
                  >
                    {isPos ? '+' : ''}
                    {card.changePrice > 0 ? `+${card.changePrice.toFixed(2)}` : card.changePrice.toFixed(2)}{' '}
                    ({isPos ? '+' : ''}
                    {card.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Sparkline Chart SVG */}
              <div className="h-10 mt-3 w-full">
                <svg
                  className="w-full h-full overflow-visible"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 120 35"
                >
                  <defs>
                    <linearGradient id={gradId} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={strokeColor}
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <path d={areaD} fill={`url(#${gradId})`} />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
