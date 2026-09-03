import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, DollarSign, Globe, Layers, ArrowRight } from 'lucide-react';
import { MarketAsset } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'stocks' | 'indices' | 'crypto' | 'forex'>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global key listener for Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = assets.filter((asset) => {
    if (activeFilter !== 'all') {
      if (activeFilter === 'stocks' && asset.category !== 'stocks') return false;
      if (activeFilter === 'indices' && asset.category !== 'indices') return false;
      if (activeFilter === 'crypto' && asset.category !== 'crypto') return false;
      if (activeFilter === 'forex' && asset.category !== 'forex') return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      asset.symbol.toLowerCase().includes(q) ||
      asset.name.toLowerCase().includes(q) ||
      (asset.sector && asset.sector.toLowerCase().includes(q))
    );
  });

  return (
    <div
      id="search-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="search-modal-box"
        className="bg-white border border-[#e0e3eb] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#e0e3eb] flex items-center space-x-3 bg-white">
          <Search className="w-5 h-5 text-[#787b86]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, company, ETF, crypto..."
            className="flex-1 bg-transparent text-sm text-[#131722] placeholder-[#787b86] focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#787b86] hover:text-[#131722] p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-[#787b86] px-2 py-1 rounded font-semibold"
          >
            ESC
          </button>
        </div>

        {/* Quick Filter Pills */}
        <div className="px-4 py-2 border-b border-[#e0e3eb] bg-[#f8f9fd] flex items-center space-x-2 text-xs overflow-x-auto scrollbar-none">
          {(
            [
              { id: 'all', label: 'All Assets' },
              { id: 'stocks', label: 'Stocks' },
              { id: 'indices', label: 'Indices' },
              { id: 'crypto', label: 'Crypto' },
              { id: 'forex', label: 'Forex' },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-[#131722] text-white'
                  : 'bg-white border border-[#e0e3eb] text-[#787b86] hover:text-[#131722]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#e0e3eb]/60">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#787b86] text-xs">
              No matching assets found for "{query}". Try searching for SPY, NVDA, AAPL, or TSLA.
            </div>
          ) : (
            filtered.map((item) => {
              const isPos = item.changePercent >= 0;
              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onSelectAsset(item);
                    onClose();
                  }}
                  className="p-3.5 px-4 hover:bg-[#f8f9fd] transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-7 h-7 rounded-full text-white font-bold text-[10px] flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: item.logoBg }}
                    >
                      {item.symbol.substring(0, 4)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-[#131722] group-hover:text-[#2962ff] transition-colors">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-semibold text-[#787b86] bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                          {item.region}
                        </span>
                      </div>
                      <div className="text-xs text-[#787b86]">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right flex items-center space-x-3">
                    <div>
                      <div className="text-sm font-bold text-[#131722]">
                        ${item.lastPrice.toFixed(2)}
                      </div>
                      <div
                        className={`text-xs font-semibold ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {item.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#787b86] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
