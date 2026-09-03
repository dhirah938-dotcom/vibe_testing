import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CategoryType } from '../types';

interface HeroHeadlineProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const CATEGORIES: { id: CategoryType; label: string }[] = [
  { id: 'indices', label: 'Indices' },
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'forex', label: 'Forex' },
  { id: 'futures', label: 'Futures' },
  { id: 'bonds', label: 'Bonds' },
];

export const HeroHeadline: React.FC<HeroHeadlineProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <section id="hero-section" className="pt-10 pb-6 px-4 max-w-7xl mx-auto w-full text-center relative">
      {/* Centered bold header with dropdown chevron */}
      <div className="relative inline-block">
        <div
          id="hero-title-group"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center justify-center space-x-3 group cursor-pointer select-none"
        >
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#131722]">
            Markets, everywhere
          </h1>
          <button
            id="btn-toggle-market-dropdown"
            aria-label="Toggle market selector"
            className="mt-1 p-1 text-[#131722] group-hover:translate-y-0.5 transition-transform"
          >
            <ChevronDown className="w-7 h-7 sm:w-10 sm:h-10 stroke-[2.5]" />
          </button>
        </div>

        {/* Dropdown for market selector */}
        {dropdownOpen && (
          <div
            id="market-category-menu"
            className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white border border-[#e0e3eb] rounded-2xl shadow-xl p-2 z-30 text-left animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-3 py-2 text-[11px] font-bold text-[#787b86] uppercase tracking-wider">
              Select Market View
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#f0f3fa] text-[#2962ff]'
                    : 'text-[#131722] hover:bg-gray-50'
                }`}
              >
                <span>{cat.label} Overview</span>
                {selectedCategory === cat.id && <Check className="w-4 h-4 text-[#2962ff]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sub-navigation Category Filter Pills */}
      <div
        id="category-filter-pills"
        className="mt-8 flex items-center justify-center overflow-x-auto space-x-2 sm:space-x-3 pb-2 scrollbar-none"
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`category-pill-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#131722] text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-[#131722] font-medium'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
