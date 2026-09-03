import React, { useState } from 'react';
import {
  Globe,
  User,
  Search,
  ChevronDown,
  TrendingUp,
  SlidersHorizontal,
  Compass,
  Briefcase,
  Check,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenGetStarted: () => void;
  onSelectCategory?: (category: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenGetStarted,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [selectedCurrency, setSelectedCurrency] = useState('USD ($)');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#e0e3eb] px-4 lg:px-7 h-16 flex items-center justify-between transition-shadow duration-200"
    >
      {/* Left: Logo & Search & Primary Navigation */}
      <div className="flex items-center space-x-6 lg:space-x-8">
        {/* TradingView Geometric "TV" Logo */}
        <a
          id="brand-logo"
          href="#"
          aria-label="TradingView Home"
          className="flex items-center group cursor-pointer"
        >
          <svg
            className="w-9 h-7 text-black transition-transform group-hover:scale-105"
            fill="currentColor"
            viewBox="0 0 36 28"
          >
            <path d="M4 3h7v6H7v16H0V3h4z" />
            <path d="M12 3h16v6h-5v16h-7V9h-4V3z" />
            <rect height="22" rx="0" width="7" x="29" y="3" />
          </svg>
        </a>

        {/* Quick Search Bar */}
        <div className="relative hidden sm:block w-56 lg:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#787b86]">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="header-search-input"
            type="text"
            readOnly
            onClick={onOpenSearch}
            className="w-full bg-[#f0f3fa] text-[#131722] placeholder-[#787b86] text-xs rounded-full pl-9 pr-8 py-2 border-none focus:outline-none focus:ring-2 focus:ring-[#2962ff] cursor-pointer transition-all hover:bg-[#e7ebf4]"
            placeholder="Search (Ctrl+K)"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-block text-[10px] font-semibold text-[#787b86] bg-white px-1.5 py-0.5 rounded border border-[#e0e3eb]">
            ⌘K
          </kbd>
        </div>

        {/* Main Navigation Links */}
        <nav
          id="main-nav"
          className="hidden md:flex items-center space-x-7 text-sm font-semibold tracking-tight relative"
        >
          {/* Products */}
          <div className="relative">
            <button
              id="nav-link-products"
              onClick={() => toggleDropdown('products')}
              className="text-[#131722] hover:text-[#2962ff] transition-colors flex items-center space-x-1 cursor-pointer py-5"
            >
              <span>Products</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#787b86]" />
            </button>
            {activeDropdown === 'products' && (
              <div
                id="products-dropdown"
                className="absolute top-full left-0 w-64 bg-white border border-[#e0e3eb] rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <a
                  href="#market-overview-table"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-[#f8f9fd] transition-colors"
                >
                  <TrendingUp className="w-4 h-4 text-[#2962ff]" />
                  <div>
                    <div className="text-xs font-bold text-[#131722]">Supercharts</div>
                    <div className="text-[11px] text-[#787b86]">Advanced real-time charting</div>
                  </div>
                </a>
                <a
                  href="#market-overview-table"
                  onClick={() => setActiveDropdown(null)}
                  className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-[#f8f9fd] transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-[#089981]" />
                  <div>
                    <div className="text-xs font-bold text-[#131722]">Stock Screener</div>
                    <div className="text-[11px] text-[#787b86]">Filter 50,000+ global assets</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* Community */}
          <div className="relative">
            <button
              id="nav-link-community"
              onClick={() => toggleDropdown('community')}
              className="text-[#131722] hover:text-[#2962ff] transition-colors flex items-center space-x-1 cursor-pointer py-5"
            >
              <span>Community</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#787b86]" />
            </button>
            {activeDropdown === 'community' && (
              <div
                id="community-dropdown"
                className="absolute top-full left-0 w-56 bg-white border border-[#e0e3eb] rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="p-2.5 text-xs text-[#787b86]">
                  <div className="font-bold text-[#131722] mb-1">Trading Community</div>
                  Share strategies, trade ideas, and custom indicators with over 50 million active traders worldwide.
                </div>
              </div>
            )}
          </div>

          {/* Markets (Active) */}
          <a
            id="nav-link-markets"
            href="#hero-section"
            className="text-[#2962ff] relative py-5 border-b-2 border-[#2962ff] font-bold"
          >
            Markets
          </a>

          {/* Brokers */}
          <a
            id="nav-link-brokers"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown('brokers');
            }}
            className="text-[#131722] hover:text-[#2962ff] transition-colors py-5"
          >
            Brokers
          </a>

          {/* More */}
          <div className="relative">
            <button
              id="nav-link-more"
              onClick={() => toggleDropdown('more')}
              className="text-[#131722] hover:text-[#2962ff] flex items-center space-x-1 transition-colors cursor-pointer py-5"
            >
              <span>More</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#787b86]" />
            </button>
            {activeDropdown === 'more' && (
              <div
                id="more-dropdown"
                className="absolute top-full right-0 w-48 bg-white border border-[#e0e3eb] rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenGetStarted();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#f8f9fd] text-xs font-semibold text-[#131722]"
                >
                  Economic Calendar
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenGetStarted();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#f8f9fd] text-xs font-semibold text-[#131722]"
                >
                  Market Heatmaps
                </button>
                <button
                  onClick={() => {
                    setActiveDropdown(null);
                    onOpenGetStarted();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-[#f8f9fd] text-xs font-semibold text-[#131722]"
                >
                  Desktop Apps
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Right: Language, Profile, Get Started CTA */}
      <div className="flex items-center space-x-3 sm:space-x-5 text-sm">
        {/* Mobile Search Button */}
        <button
          id="btn-mobile-search"
          onClick={onOpenSearch}
          className="sm:hidden p-2 text-[#131722] hover:text-[#2962ff] rounded-full hover:bg-gray-100"
          aria-label="Open Search"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Language Selector */}
        <div className="relative">
          <button
            id="btn-language-selector"
            aria-label="Select Language"
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center space-x-1.5 text-[#131722] hover:text-[#2962ff] font-semibold px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Globe className="w-5 h-5 text-[#131722]" />
            <span className="text-xs uppercase font-bold tracking-wider">{selectedLanguage}</span>
          </button>

          {showLangMenu && (
            <div
              id="language-dropdown-menu"
              className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#e0e3eb] rounded-xl shadow-lg p-2 z-50 animate-in fade-in"
            >
              <div className="text-[11px] font-bold text-[#787b86] px-2 py-1 uppercase">Language</div>
              {['EN (English)', 'ES (Español)', 'DE (Deutsch)', 'FR (Français)', 'JA (日本語)'].map((lang) => {
                const code = lang.substring(0, 2);
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      setSelectedLanguage(code);
                      setShowLangMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-[#f8f9fd] text-xs flex items-center justify-between"
                  >
                    <span>{lang}</span>
                    {selectedLanguage === code && <Check className="w-3.5 h-3.5 text-[#2962ff]" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* User Profile Icon Button */}
        <div className="relative">
          <button
            id="btn-user-menu"
            aria-label="User Menu"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="p-1.5 text-[#131722] hover:text-[#2962ff] rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <User className="w-6 h-6" />
          </button>

          {showUserMenu && (
            <div
              id="user-profile-menu"
              className="absolute top-full right-0 mt-2 w-60 bg-white border border-[#e0e3eb] rounded-xl shadow-lg p-3 z-50 animate-in fade-in"
            >
              <div className="flex items-center space-x-3 pb-3 border-b border-[#e0e3eb]">
                <div className="w-9 h-9 rounded-full bg-[#2962ff] text-white flex items-center justify-center font-bold text-sm">
                  TV
                </div>
                <div>
                  <div className="text-xs font-bold text-[#131722]">Guest Trader</div>
                  <div className="text-[11px] text-[#787b86]">Standard Basic Free Plan</div>
                </div>
              </div>
              <div className="pt-2 space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenGetStarted();
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-[#131722] hover:bg-[#f8f9fd] rounded font-medium"
                >
                  Upgrade to Pro (30-day Free Trial)
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 text-xs text-[#131722] hover:bg-[#f8f9fd] rounded font-medium"
                >
                  Account Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary Vibrant CTA Button */}
        <button
          id="btn-get-started-header"
          onClick={onOpenGetStarted}
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-medium text-xs sm:text-sm px-4 sm:px-5 py-2 rounded-full shadow-sm hover:shadow transition-all duration-200 active:scale-95 cursor-pointer"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
