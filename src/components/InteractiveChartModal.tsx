import React, { useState, useMemo } from 'react';
import {
  X,
  TrendingUp,
  Maximize2,
  Minimize2,
  Bookmark,
  Share2,
  BarChart2,
  Activity,
  Layers,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Check,
} from 'lucide-react';
import { MarketAsset } from '../types';

interface InteractiveChartModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  onBookmarkToggle?: (symbol: string) => void;
  isBookmarked?: boolean;
}

type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';
type ChartType = 'area' | 'candles';

export const InteractiveChartModal: React.FC<InteractiveChartModalProps> = ({
  asset,
  onClose,
  onBookmarkToggle,
  isBookmarked = false,
}) => {
  if (!asset) return null;

  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('area');
  const [showIndicators, setShowIndicators] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [orderNotification, setOrderNotification] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  // Synthesize realistic historical price series based on timeframe & asset
  const chartData = useMemo(() => {
    const pointsCount = timeframe === '1D' ? 30 : timeframe === '5D' ? 40 : 50;
    const basePrice = asset.lastPrice;
    const volatility = asset.changePercent > 0 ? 0.015 : 0.02;
    const data: { time: string; open: number; high: number; low: number; close: number; volume: number }[] = [];

    let current = basePrice * (1 - (asset.changePercent / 100) * 1.5);
    for (let i = 0; i < pointsCount; i++) {
      const delta = (Math.random() - 0.47) * current * volatility;
      const open = current;
      const close = Math.max(0.1, current + delta);
      const high = Math.max(open, close) + Math.random() * current * 0.006;
      const low = Math.min(open, close) - Math.random() * current * 0.006;
      const volume = Math.floor(Math.random() * 500000 + 100000);

      const label =
        timeframe === '1D'
          ? `${9 + Math.floor(i / 5)}:${(i % 5) * 12 < 10 ? '0' : ''}${(i % 5) * 12}`
          : `Day ${i + 1}`;

      data.push({ time: label, open, high, low, close, volume });
      current = close;
    }
    // Ensure final point lands near asset.lastPrice
    data[data.length - 1].close = asset.lastPrice;
    return data;
  }, [asset, timeframe]);

  // Scaled SVG coordinates
  const prices = chartData.map((d) => d.close);
  const minP = Math.min(...chartData.map((d) => d.low)) * 0.998;
  const maxP = Math.max(...chartData.map((d) => d.high)) * 1.002;
  const rangeP = maxP - minP || 1;

  const svgWidth = 720;
  const svgHeight = 280;
  const paddingX = 20;
  const paddingY = 20;

  const getX = (index: number) =>
    paddingX + (index / (chartData.length - 1)) * (svgWidth - paddingX * 2);
  const getY = (val: number) =>
    svgHeight - paddingY - ((val - minP) / rangeP) * (svgHeight - paddingY * 2);

  const isPos = asset.changePercent >= 0;
  const strokeColor = isPos ? '#089981' : '#f23645';

  const linePath = chartData
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d.close).toFixed(1)}`)
    .join(' ');
  const areaPath = `${linePath} L ${svgWidth - paddingX} ${svgHeight - paddingY} L ${paddingX} ${
    svgHeight - paddingY
  } Z`;

  const activePoint = hoveredIndex !== null ? chartData[hoveredIndex] : chartData[chartData.length - 1];

  const handleOrder = (type: 'BUY' | 'SELL') => {
    setOrderNotification(`Demo ${type} order submitted for 10 units of ${asset.symbol} @ $${asset.lastPrice.toFixed(2)}`);
    setTimeout(() => setOrderNotification(null), 3500);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmarkToggle) onBookmarkToggle(asset.symbol);
  };

  return (
    <div
      id="chart-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="chart-modal-content"
        className="bg-white border border-[#e0e3eb] rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-5 py-4 border-b border-[#e0e3eb] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div
              className="w-9 h-9 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs"
              style={{ backgroundColor: asset.logoBg }}
            >
              {asset.symbol.substring(0, 4)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-[#131722]">{asset.symbol}</span>
                <span className="text-xs text-[#787b86] font-medium hidden sm:inline">{asset.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f0f3fa] text-[#2962ff]">
                  {asset.category.toUpperCase()}
                </span>
              </div>
              <div className="flex items-baseline space-x-2 text-xs">
                <span className="font-extrabold text-[#131722] text-base">
                  ${asset.lastPrice.toFixed(2)}
                </span>
                <span
                  className={`font-bold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}
                >
                  {isPos ? '+' : ''}
                  {asset.changePrice.toFixed(2)} ({isPos ? '+' : ''}
                  {asset.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-bookmark-symbol"
              onClick={handleBookmark}
              title={bookmarked ? 'Saved to Watchlist' : 'Add to Watchlist'}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                bookmarked
                  ? 'bg-blue-50 border-[#2962ff] text-[#2962ff]'
                  : 'border-[#e0e3eb] text-[#787b86] hover:bg-gray-100'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={bookmarked ? '#2962ff' : 'none'} />
            </button>
            <button
              id="btn-close-chart-modal"
              onClick={onClose}
              className="p-2 rounded-lg border border-[#e0e3eb] hover:bg-gray-100 text-[#787b86] hover:text-[#131722] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Bar: Timeframes, Chart Style, Indicators */}
        <div className="px-5 py-2.5 border-b border-[#e0e3eb] bg-[#f8f9fd] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Timeframe selector */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-[#e0e3eb]">
            {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-[#131722] text-white'
                    : 'text-[#787b86] hover:text-[#131722] hover:bg-gray-100'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Display Controls */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-white p-1 rounded-lg border border-[#e0e3eb]">
              <button
                onClick={() => setChartType('area')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  chartType === 'area'
                    ? 'bg-[#f0f3fa] text-[#2962ff]'
                    : 'text-[#787b86] hover:text-[#131722]'
                }`}
              >
                Area
              </button>
              <button
                onClick={() => setChartType('candles')}
                className={`px-2.5 py-1 rounded font-semibold transition-colors cursor-pointer ${
                  chartType === 'candles'
                    ? 'bg-[#f0f3fa] text-[#2962ff]'
                    : 'text-[#787b86] hover:text-[#131722]'
                }`}
              >
                Candles
              </button>
            </div>

            <button
              onClick={() => setShowIndicators(!showIndicators)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                showIndicators
                  ? 'bg-blue-50 border-[#2962ff] text-[#2962ff]'
                  : 'bg-white border-[#e0e3eb] text-[#787b86]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Indicators (SMA/RSI)</span>
            </button>
          </div>
        </div>

        {/* Notification Pill */}
        {orderNotification && (
          <div className="bg-[#e7f6f2] border-b border-[#089981]/30 px-5 py-2 text-xs font-semibold text-[#089981] flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>{orderNotification}</span>
          </div>
        )}

        {/* OHLCV Current Bar readout */}
        <div className="px-5 py-2 bg-white flex flex-wrap items-center gap-4 text-xs font-medium text-[#787b86] border-b border-[#e0e3eb]/60">
          <span>Time: <strong className="text-[#131722]">{activePoint.time}</strong></span>
          <span>Open: <strong className="text-[#131722]">${activePoint.open.toFixed(2)}</strong></span>
          <span>High: <strong className="text-[#089981]">${activePoint.high.toFixed(2)}</strong></span>
          <span>Low: <strong className="text-[#f23645]">${activePoint.low.toFixed(2)}</strong></span>
          <span>Close: <strong className="text-[#131722]">${activePoint.close.toFixed(2)}</strong></span>
          <span>Volume: <strong className="text-[#131722]">{activePoint.volume.toLocaleString()}</strong></span>
        </div>

        {/* Main Chart Stage */}
        <div className="p-4 sm:p-6 bg-white overflow-hidden relative flex-1 flex flex-col justify-center">
          <div className="relative w-full h-[280px]">
            <svg
              className="w-full h-full overflow-visible select-none"
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
              onMouseLeave={() => setHoveredIndex(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
                const idx = Math.round(ratio * (chartData.length - 1));
                setHoveredIndex(idx);
              }}
            >
              <defs>
                <linearGradient id="chartModalGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor={strokeColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0.2, 0.4, 0.6, 0.8].map((ratio) => {
                const y = paddingY + ratio * (svgHeight - paddingY * 2);
                const priceLevel = maxP - ratio * rangeP;
                return (
                  <g key={ratio}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#e0e3eb"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={svgWidth - paddingX + 5}
                      y={y + 3}
                      fill="#787b86"
                      fontSize="9"
                      fontFamily="sans-serif"
                    >
                      ${priceLevel.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Area Chart Mode */}
              {chartType === 'area' && (
                <>
                  <path d={areaPath} fill="url(#chartModalGrad)" />
                  <path
                    d={linePath}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}

              {/* Candlestick Chart Mode */}
              {chartType === 'candles' &&
                chartData.map((d, i) => {
                  const x = getX(i);
                  const isCandleGreen = d.close >= d.open;
                  const candleColor = isCandleGreen ? '#089981' : '#f23645';
                  const top = Math.min(getY(d.open), getY(d.close));
                  const height = Math.max(2, Math.abs(getY(d.open) - getY(d.close)));
                  const candleW = Math.max(3, (svgWidth / chartData.length) * 0.6);

                  return (
                    <g key={i}>
                      {/* Wick */}
                      <line
                        x1={x}
                        y1={getY(d.high)}
                        x2={x}
                        y2={getY(d.low)}
                        stroke={candleColor}
                        strokeWidth="1.2"
                      />
                      {/* Body */}
                      <rect
                        x={x - candleW / 2}
                        y={top}
                        width={candleW}
                        height={height}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })}

              {/* Indicators Overlay (SMA 20) */}
              {showIndicators && (
                <path
                  d={chartData
                    .map((d, i) => {
                      if (i < 5) return null;
                      const slice = chartData.slice(Math.max(0, i - 10), i + 1);
                      const avg = slice.reduce((acc, c) => acc + c.close, 0) / slice.length;
                      return `${i === 5 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(avg).toFixed(1)}`;
                    })
                    .filter(Boolean)
                    .join(' ')}
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              )}

              {/* Hover Crosshair */}
              {hoveredIndex !== null && (
                <g>
                  <line
                    x1={getX(hoveredIndex)}
                    y1={paddingY}
                    x2={getX(hoveredIndex)}
                    y2={svgHeight - paddingY}
                    stroke="#131722"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={getX(hoveredIndex)}
                    cy={getY(activePoint.close)}
                    r="4"
                    fill="#131722"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Bottom Quick Stats & Trading Action Bar */}
        <div className="px-5 py-4 border-t border-[#e0e3eb] bg-[#f8f9fd] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs w-full sm:w-auto">
            <div>
              <div className="text-[#787b86]">Day Range</div>
              <div className="font-bold text-[#131722]">
                ${asset.low.toFixed(2)} - ${asset.high.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[#787b86]">52W Range</div>
              <div className="font-bold text-[#131722]">
                ${(asset.low * 0.85).toFixed(2)} - ${asset.allTimeHigh?.toFixed(2) || (asset.high * 1.15).toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-[#787b86]">Market Cap</div>
              <div className="font-bold text-[#131722]">{asset.marketCap}</div>
            </div>
            <div>
              <div className="text-[#787b86]">P/E Ratio</div>
              <div className="font-bold text-[#131722]">{asset.peRatio || '—'}</div>
            </div>
          </div>

          {/* Buy & Sell Demo Actions */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              id="btn-chart-sell"
              onClick={() => handleOrder('SELL')}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-[#f23645] hover:bg-[#d32f2f] text-white font-bold text-xs shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              Sell ${asset.lastPrice.toFixed(2)}
            </button>
            <button
              id="btn-chart-buy"
              onClick={() => handleOrder('BUY')}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-[#089981] hover:bg-[#067a67] text-white font-bold text-xs shadow-xs hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              Buy ${(asset.lastPrice * 1.0005).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
