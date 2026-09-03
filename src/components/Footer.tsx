import React from 'react';

interface FooterProps {
  onOpenScreener?: () => void;
  onOpenCharts?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenScreener,
  onOpenCharts,
}) => {
  return (
    <footer id="main-footer" className="mt-16 border-t border-[#e0e3eb] bg-white text-[#787b86] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Col 1: Products */}
          <div>
            <h4 className="font-bold text-[#131722] mb-3 text-sm">Products</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenCharts}
                  className="hover:text-[#2962ff] transition-colors cursor-pointer text-left"
                >
                  Supercharts
                </button>
              </li>
              <li>
                <a href="#market-overview-table" className="hover:text-[#2962ff] transition-colors">
                  Pine Script™
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenScreener}
                  className="hover:text-[#2962ff] transition-colors cursor-pointer text-left"
                >
                  Stock Screener
                </button>
              </li>
              <li>
                <a href="#hero-section" className="hover:text-[#2962ff] transition-colors">
                  Crypto Screener
                </a>
              </li>
              <li>
                <a href="#indices-cards-section" className="hover:text-[#2962ff] transition-colors">
                  Economic Calendar
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2: Company */}
          <div>
            <h4 className="font-bold text-[#131722] mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Community */}
          <div>
            <h4 className="font-bold text-[#131722] mb-3 text-sm">Community</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Refer a friend
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Ideas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Scripts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  House Rules
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Moderators
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: For Business */}
          <div>
            <h4 className="font-bold text-[#131722] mb-3 text-sm">For Business</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Widgets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Advertising
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Charting Solutions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#2962ff] transition-colors">
                  Brokerage Integration
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: TradingView Description */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="font-bold text-[#131722] mb-3 text-sm">TradingView</h4>
            <p className="text-xs text-[#787b86] mb-4 leading-relaxed">
              Look first / Then leap. Real-time market insights and data for traders &amp; investors globally.
            </p>
            <div className="text-[11px] text-[#b2b5be]">
              © 2025 TradingView, Inc.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
