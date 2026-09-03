import React, { useState } from 'react';
import { X, Filter, Download, ArrowUpDown, ChevronRight, Check } from 'lucide-react';
import { MarketAsset } from '../types';

interface ScreenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const ScreenerModal: React.FC<ScreenerModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  if (!isOpen) return null;

  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  const sectors = ['All', 'Technology', 'Consumer Discretionary', 'Financials', 'Communication Services', 'ETF Index', 'ETF Tech'];
  const ratings = ['All', 'Strong Buy', 'Buy', 'Neutral'];

  const filtered = assets.filter((a) => {
    if (selectedSector !== 'All' && a.sector !== selectedSector) return false;
    if (selectedRating !== 'All' && a.techRating !== selectedRating) return false;
    if (a.lastPrice < minPrice || a.lastPrice > maxPrice) return false;
    return true;
  });

  const exportCSV = () => {
    const header = 'Symbol,Name,Last,Change%,TechRating,MarketCap,PE\n';
    const rows = filtered
      .map(
        (a) =>
          `"${a.symbol}","${a.name}",${a.lastPrice},${a.changePercent},"${a.techRating}","${a.marketCap}",${a.peRatio || ''}`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tradingview_screener_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="screener-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="screener-modal-content"
        className="bg-white border border-[#e0e3eb] rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-[#e0e3eb] flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#131722] flex items-center space-x-2">
              <span>Stock Screener</span>
              <span className="text-xs font-normal text-[#787b86] bg-gray-100 px-2 py-0.5 rounded-full">
                {filtered.length} matches
              </span>
            </h2>
            <p className="text-xs text-[#787b86]">
              Filter global securities with fundamental and technical conditions.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportCSV}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-[#f0f3fa] hover:bg-[#e7ebf4] text-[#131722] rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[#e0e3eb] hover:bg-gray-100 text-[#787b86] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters bar */}
        <div className="p-4 border-b border-[#e0e3eb] bg-[#f8f9fd] flex flex-wrap items-center gap-3 text-xs">
          {/* Sector filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#787b86] font-medium">Sector:</span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-white border border-[#e0e3eb] rounded-lg px-2.5 py-1 text-xs text-[#131722] focus:outline-none focus:ring-1 focus:ring-[#2962ff]"
            >
              {sectors.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Rating filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[#787b86] font-medium">Rating:</span>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="bg-white border border-[#e0e3eb] rounded-lg px-2.5 py-1 text-xs text-[#131722] focus:outline-none focus:ring-1 focus:ring-[#2962ff]"
            >
              {ratings.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          {(selectedSector !== 'All' || selectedRating !== 'All') && (
            <button
              onClick={() => {
                setSelectedSector('All');
                setSelectedRating('All');
              }}
              className="text-[#2962ff] hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Results Table */}
        <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead className="bg-[#f8f9fd] sticky top-0 border-b border-[#e0e3eb] text-[#787b86] font-semibold text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-4">Symbol</th>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">Chg %</th>
                <th className="py-2.5 px-3 text-center">Tech Rating</th>
                <th className="py-2.5 px-3 text-right">Mkt Cap</th>
                <th className="py-2.5 px-3 text-right">P/E Ratio</th>
                <th className="py-2.5 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3eb]/70 text-[#131722]">
              {filtered.map((asset) => {
                const isPos = asset.changePercent >= 0;
                return (
                  <tr
                    key={asset.symbol}
                    className="hover:bg-[#f8f9fd] transition-colors cursor-pointer"
                    onClick={() => {
                      onSelectAsset(asset);
                      onClose();
                    }}
                  >
                    <td className="py-3 px-4 font-bold text-[#131722]">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                          style={{ backgroundColor: asset.logoBg }}
                        >
                          {asset.symbol.substring(0, 3)}
                        </span>
                        <span className="text-[#2962ff] hover:underline">{asset.symbol}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#787b86]">{asset.name}</td>
                    <td className="py-3 px-3">{asset.sector || '—'}</td>
                    <td className="py-3 px-3 text-right font-bold">${asset.lastPrice.toFixed(2)}</td>
                    <td
                      className={`py-3 px-3 text-right font-bold ${
                        isPos ? 'text-[#089981]' : 'text-[#f23645]'
                      }`}
                    >
                      {isPos ? '+' : ''}
                      {asset.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          asset.techRating.includes('Buy')
                            ? 'bg-[#e7f6f2] text-[#089981]'
                            : 'bg-gray-100 text-[#787b86]'
                        }`}
                      >
                        {asset.techRating}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium">{asset.marketCap}</td>
                    <td className="py-3 px-3 text-right text-[#787b86]">{asset.peRatio || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-xs text-[#2962ff] hover:underline font-semibold flex items-center justify-center space-x-1 mx-auto">
                        <span>Chart</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
