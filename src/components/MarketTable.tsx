import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { FinancialTab, MarketAsset, RegionType } from '../types';

interface MarketTableProps {
  assets: MarketAsset[];
  selectedRegion: RegionType;
  onSelectRegion: (region: RegionType) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onOpenScreener: () => void;
}

type SortField =
  | 'symbol'
  | 'lastPrice'
  | 'changePercent'
  | 'changePrice'
  | 'volume'
  | 'marketCap'
  | 'peRatio'
  | 'divYield'
  | 'perf1M'
  | 'perfYTD';

export const MarketTable: React.FC<MarketTableProps> = ({
  assets,
  selectedRegion,
  onSelectRegion,
  onSelectAsset,
  onOpenScreener,
}) => {
  const [activeTab, setActiveTab] = useState<FinancialTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [hoveredTrend, setHoveredTrend] = useState<string | null>(null);

  const tabs: { id: FinancialTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance' },
    { id: 'valuation', label: 'Valuation' },
    { id: 'dividends', label: 'Dividends' },
    { id: 'margins', label: 'Margins' },
    { id: 'income', label: 'Income Statement' },
  ];

  const regions: RegionType[] = ['US', 'Europe', 'Asia', 'Global'];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortAsc) {
        setSortField(null);
        setSortAsc(false);
      } else {
        setSortAsc(true);
      }
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Filter and sort assets
  const filteredAssets = useMemo(() => {
    let result = assets.filter((item) => {
      // Region filter
      if (selectedRegion !== 'Global' && item.region !== selectedRegion) {
        return false;
      }
      // Query search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.symbol.toLowerCase().includes(q) ||
          item.name.toLowerCase().includes(q) ||
          (item.sector && item.sector.toLowerCase().includes(q))
        );
      }
      return true;
    });

    if (!sortField) {
      return result;
    }

    // Helper to parse market cap strings like "3.65T", "602.4B"
    const parseMktCap = (capStr: string) => {
      if (capStr.endsWith('T')) return parseFloat(capStr) * 1e12;
      if (capStr.endsWith('B')) return parseFloat(capStr) * 1e9;
      if (capStr.endsWith('M')) return parseFloat(capStr) * 1e6;
      return parseFloat(capStr) || 0;
    };

    result.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      switch (sortField) {
        case 'symbol':
          valA = a.symbol;
          valB = b.symbol;
          break;
        case 'lastPrice':
          valA = a.lastPrice;
          valB = b.lastPrice;
          break;
        case 'changePercent':
          valA = a.changePercent;
          valB = b.changePercent;
          break;
        case 'changePrice':
          valA = a.changePrice;
          valB = b.changePrice;
          break;
        case 'marketCap':
          valA = parseMktCap(a.marketCap);
          valB = parseMktCap(b.marketCap);
          break;
        case 'peRatio':
          valA = a.peRatio || 0;
          valB = b.peRatio || 0;
          break;
        case 'divYield':
          valA = a.divYield || 0;
          valB = b.divYield || 0;
          break;
        case 'perf1M':
          valA = a.perf1M || 0;
          valB = b.perf1M || 0;
          break;
        case 'perfYTD':
          valA = a.perfYTD || 0;
          valB = b.perfYTD || 0;
          break;
        default:
          valA = a.lastPrice;
          valB = b.lastPrice;
      }

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortAsc ? valA - valB : valB - valA;
    });

    return result;
  }, [assets, selectedRegion, searchQuery, sortField, sortAsc]);

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-70 inline ml-1" />;
    }
    return sortAsc ? (
      <ArrowUp className="w-3 h-3 text-[#2962ff] inline ml-1" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#2962ff] inline ml-1" />
    );
  };

  return (
    <section
      id="market-overview-section"
      className="border border-[#e0e3eb] rounded-2xl p-5 lg:p-6 bg-white shadow-xs transition-shadow duration-200"
    >
      {/* Table Header Bar: Tabs and Regional Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-[#e0e3eb] pb-4">
        {/* Financial View Tabs */}
        <div
          id="financial-view-tabs"
          className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto text-sm font-semibold pb-1 scrollbar-none"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer text-xs sm:text-sm ${
                activeTab === tab.id
                  ? 'bg-gray-100 text-[#131722] font-bold'
                  : 'text-[#787b86] hover:text-[#131722]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Regional Filter Pills & Quick Table Search */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Table Search */}
          <div className="relative w-40 sm:w-48">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#787b86]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter table..."
              className="w-full bg-[#f0f3fa] text-xs text-[#131722] placeholder-[#787b86] pl-8 pr-3 py-1.5 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-[#2962ff]"
            />
          </div>

          <div id="region-filter-group" className="flex items-center space-x-1.5 text-xs">
            <span className="text-[#787b86] mr-1 hidden sm:inline">Region:</span>
            {regions.map((reg) => (
              <button
                key={reg}
                id={`region-btn-${reg}`}
                onClick={() => onSelectRegion(reg)}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-[#131722] text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-[#787b86]'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Data Table Container */}
      <div className="overflow-x-auto mt-2">
        <table
          id="market-overview-table"
          className="w-full text-left border-collapse text-xs sm:text-sm whitespace-nowrap"
        >
          <thead>
            <tr className="text-[#787b86] text-[11px] font-semibold border-b border-[#e0e3eb] uppercase tracking-wider select-none">
              <th
                className="py-3 px-3 cursor-pointer group"
                onClick={() => handleSort('symbol')}
                scope="col"
              >
                <span>Symbol & Name</span>
                {renderSortIcon('symbol')}
              </th>

              {/* Dynamic Headers based on Active Tab */}
              {activeTab === 'overview' && (
                <>
                  <th
                    className="py-3 px-3 text-right cursor-pointer group"
                    onClick={() => handleSort('lastPrice')}
                    scope="col"
                  >
                    <span>Last</span>
                    {renderSortIcon('lastPrice')}
                  </th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer group"
                    onClick={() => handleSort('changePercent')}
                    scope="col"
                  >
                    <span>Chg %</span>
                    {renderSortIcon('changePercent')}
                  </th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer group"
                    onClick={() => handleSort('changePrice')}
                    scope="col"
                  >
                    <span>Chg</span>
                    {renderSortIcon('changePrice')}
                  </th>
                  <th className="py-3 px-3 text-right hidden md:table-cell" scope="col">
                    High
                  </th>
                  <th className="py-3 px-3 text-right hidden md:table-cell" scope="col">
                    Low
                  </th>
                  <th className="py-3 px-3 text-center" scope="col">
                    Tech Rating
                  </th>
                  <th className="py-3 px-3 text-right hidden lg:table-cell" scope="col">
                    Vol
                  </th>
                  <th
                    className="py-3 px-3 text-right hidden sm:table-cell cursor-pointer group"
                    onClick={() => handleSort('marketCap')}
                    scope="col"
                  >
                    <span>Mkt Cap</span>
                    {renderSortIcon('marketCap')}
                  </th>
                  <th className="py-3 px-3 text-center w-28" scope="col">
                    7D Trend
                  </th>
                </>
              )}

              {activeTab === 'performance' && (
                <>
                  <th className="py-3 px-3 text-right" scope="col">
                    Last Price
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    1W %
                  </th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer group"
                    onClick={() => handleSort('perf1M')}
                    scope="col"
                  >
                    <span>1M %</span>
                    {renderSortIcon('perf1M')}
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    3M %
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    6M %
                  </th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer group"
                    onClick={() => handleSort('perfYTD')}
                    scope="col"
                  >
                    <span>YTD %</span>
                    {renderSortIcon('perfYTD')}
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    1Y %
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    All-Time High
                  </th>
                </>
              )}

              {activeTab === 'valuation' && (
                <>
                  <th
                    className="py-3 px-3 text-right cursor-pointer group"
                    onClick={() => handleSort('marketCap')}
                    scope="col"
                  >
                    <span>Mkt Cap</span>
                    {renderSortIcon('marketCap')}
                  </th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer group"
                    onClick={() => handleSort('peRatio')}
                    scope="col"
                  >
                    <span>P/E (TTM)</span>
                    {renderSortIcon('peRatio')}
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Forward P/E
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    PEG Ratio
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Price/Sales
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Price/Book
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    EV/EBITDA
                  </th>
                </>
              )}

              {activeTab === 'dividends' && (
                <>
                  <th className="py-3 px-3 text-right" scope="col">
                    Last Price
                  </th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer group"
                    onClick={() => handleSort('divYield')}
                    scope="col"
                  >
                    <span>Div Yield %</span>
                    {renderSortIcon('divYield')}
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Annual Div
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Payout Ratio
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Ex-Div Date
                  </th>
                </>
              )}

              {activeTab === 'margins' && (
                <>
                  <th className="py-3 px-3 text-right" scope="col">
                    Gross Margin %
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Oper Margin %
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Net Profit Margin %
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Return on Equity (ROE)
                  </th>
                </>
              )}

              {activeTab === 'income' && (
                <>
                  <th className="py-3 px-3 text-right" scope="col">
                    Revenue (TTM)
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Rev Growth YoY %
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    EBITDA
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    Net Income
                  </th>
                  <th className="py-3 px-3 text-right" scope="col">
                    EPS (TTM)
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e0e3eb]/70 text-[#131722]">
            {filteredAssets.map((asset) => {
              const isPos = asset.changePercent >= 0;
              const trendPts = asset.trend7D;
              const stepX = 96 / (trendPts.length - 1);
              const strokeColor = isPos ? '#089981' : '#f23645';
              const trendPath = trendPts
                .map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i * stepX + 2).toFixed(1)} ${y}`)
                .join(' ');

              return (
                <tr
                  key={asset.symbol}
                  id={`row-${asset.symbol}`}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-[#f8f9fd] transition-colors cursor-pointer group"
                >
                  {/* Symbol & Name Column */}
                  <td className="py-3.5 px-3 flex items-center space-x-3">
                    <div
                      className="w-7 h-7 rounded-full text-white font-bold text-[10px] flex items-center justify-center flex-shrink-0 shadow-2xs"
                      style={{ backgroundColor: asset.logoBg }}
                    >
                      {asset.symbol.substring(0, 4)}
                    </div>
                    <div>
                      <div className="font-bold group-hover:text-[#2962ff] transition-colors flex items-center space-x-1.5">
                        <span>{asset.symbol}</span>
                        {asset.sector && (
                          <span className="hidden xl:inline text-[10px] font-normal text-[#787b86] bg-gray-100 px-1.5 py-0.5 rounded">
                            {asset.sector}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#787b86] truncate max-w-[150px] sm:max-w-none">
                        {asset.name}
                      </div>
                    </div>
                  </td>

                  {/* Dynamic Columns by Tab */}
                  {activeTab === 'overview' && (
                    <>
                      <td className="py-3.5 px-3 text-right font-bold">
                        {asset.lastPrice.toFixed(2)}
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-bold ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right ${
                          isPos ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.changePrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-right hidden md:table-cell text-[#787b86]">
                        {asset.high.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-right hidden md:table-cell text-[#787b86]">
                        {asset.low.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            asset.techRating.includes('Buy')
                              ? 'bg-[#e7f6f2] text-[#089981]'
                              : asset.techRating === 'Neutral'
                              ? 'bg-gray-100 text-[#787b86]'
                              : 'bg-[#fef0f1] text-[#f23645]'
                          }`}
                        >
                          {asset.techRating}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right hidden lg:table-cell text-[#787b86]">
                        {asset.volume}
                      </td>
                      <td className="py-3.5 px-3 text-right hidden sm:table-cell font-medium">
                        {asset.marketCap}
                      </td>
                      <td
                        className="py-3.5 px-3 text-center relative"
                        onMouseEnter={() => setHoveredTrend(asset.symbol)}
                        onMouseLeave={() => setHoveredTrend(null)}
                      >
                        <svg className="w-24 h-6 inline-block" fill="none" viewBox="0 0 100 24">
                          <path
                            d={trendPath}
                            stroke={strokeColor}
                            strokeLinecap="round"
                            strokeWidth="1.8"
                          />
                        </svg>
                        {hoveredTrend === asset.symbol && (
                          <div className="absolute right-0 bottom-full mb-1 bg-[#131722] text-white text-[10px] px-2 py-1 rounded shadow-lg z-20 pointer-events-none whitespace-nowrap">
                            7D Range: ${asset.low.toFixed(0)} - ${asset.high.toFixed(0)}
                          </div>
                        )}
                      </td>
                    </>
                  )}

                  {activeTab === 'performance' && (
                    <>
                      <td className="py-3.5 px-3 text-right font-bold">
                        {asset.lastPrice.toFixed(2)}
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-semibold ${
                          (asset.perf1W || 0) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {(asset.perf1W || 0) >= 0 ? '+' : ''}
                        {(asset.perf1W || 0).toFixed(2)}%
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-semibold ${
                          (asset.perf1M || 0) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {(asset.perf1M || 0) >= 0 ? '+' : ''}
                        {(asset.perf1M || 0).toFixed(2)}%
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-semibold ${
                          (asset.perf3M || 0) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {(asset.perf3M || 0) >= 0 ? '+' : ''}
                        {(asset.perf3M || 0).toFixed(2)}%
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-semibold ${
                          (asset.perf6M || 0) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {(asset.perf6M || 0) >= 0 ? '+' : ''}
                        {(asset.perf6M || 0).toFixed(2)}%
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-bold ${
                          (asset.perfYTD || 0) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {(asset.perfYTD || 0) >= 0 ? '+' : ''}
                        {(asset.perfYTD || 0).toFixed(2)}%
                      </td>
                      <td
                        className={`py-3.5 px-3 text-right font-semibold ${
                          (asset.perf1Y || 0) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {(asset.perf1Y || 0) >= 0 ? '+' : ''}
                        {(asset.perf1Y || 0).toFixed(2)}%
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium text-[#787b86]">
                        ${asset.allTimeHigh?.toFixed(2) || '—'}
                      </td>
                    </>
                  )}

                  {activeTab === 'valuation' && (
                    <>
                      <td className="py-3.5 px-3 text-right font-bold">{asset.marketCap}</td>
                      <td className="py-3.5 px-3 text-right font-medium">
                        {asset.peRatio?.toFixed(1) || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.forwardPE?.toFixed(1) || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.pegRatio?.toFixed(2) || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.priceToSales?.toFixed(1) || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.priceToBook?.toFixed(1) || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.evToEbitda?.toFixed(1) || '—'}
                      </td>
                    </>
                  )}

                  {activeTab === 'dividends' && (
                    <>
                      <td className="py-3.5 px-3 text-right font-bold">
                        {asset.lastPrice.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#089981]">
                        {asset.divYield ? `${asset.divYield.toFixed(2)}%` : '0.00%'}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.annualDiv ? `$${asset.annualDiv.toFixed(2)}` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.payoutRatio ? `${asset.payoutRatio.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.exDivDate || '—'}
                      </td>
                    </>
                  )}

                  {activeTab === 'margins' && (
                    <>
                      <td className="py-3.5 px-3 text-right font-semibold">
                        {asset.grossMargin ? `${asset.grossMargin.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold">
                        {asset.operMargin ? `${asset.operMargin.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold text-[#089981]">
                        {asset.netMargin ? `${asset.netMargin.toFixed(1)}%` : '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-semibold">
                        {asset.roe ? `${asset.roe.toFixed(1)}%` : '—'}
                      </td>
                    </>
                  )}

                  {activeTab === 'income' && (
                    <>
                      <td className="py-3.5 px-3 text-right font-bold">{asset.revenue || '—'}</td>
                      <td
                        className={`py-3.5 px-3 text-right font-semibold ${
                          (asset.revGrowthYoY || 0) >= 0 ? 'text-[#089981]' : 'text-[#f23645]'
                        }`}
                      >
                        {(asset.revGrowthYoY || 0) >= 0 ? '+' : ''}
                        {asset.revGrowthYoY?.toFixed(1) || '0.0'}%
                      </td>
                      <td className="py-3.5 px-3 text-right text-[#787b86]">
                        {asset.ebitda || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-medium text-[#089981]">
                        {asset.netIncome || '—'}
                      </td>
                      <td className="py-3.5 px-3 text-right font-bold">
                        ${asset.eps?.toFixed(2) || '—'}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination Link */}
      <div className="mt-4 pt-3 border-t border-[#e0e3eb] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#787b86]">
        <span>
          Showing {filteredAssets.length} of {assets.length} assets{' '}
          {selectedRegion !== 'Global' && `(${selectedRegion})`}
        </span>
        <button
          id="btn-explore-screener"
          onClick={onOpenScreener}
          className="text-[#2962ff] font-bold hover:underline inline-flex items-center space-x-1 cursor-pointer transition-colors"
        >
          <span>Explore all stocks in Screener</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
