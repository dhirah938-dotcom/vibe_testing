export type CategoryType = 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';

export type RegionType = 'US' | 'Europe' | 'Asia' | 'Global';

export type FinancialTab =
  | 'overview'
  | 'performance'
  | 'valuation'
  | 'dividends'
  | 'margins'
  | 'income';

export interface IndexCardData {
  id: string;
  name: string;
  symbol: string;
  typeDesc: string;
  badgeText: string;
  badgeBg: string;
  lastPrice: number;
  changePrice: number;
  changePercent: number;
  sparkline: number[];
  isPositive: boolean;
  flashState?: 'up' | 'down' | null;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: CategoryType;
  region: RegionType;
  logoBg: string;
  lastPrice: number;
  changePercent: number;
  changePrice: number;
  high: number;
  low: number;
  techRating: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  volume: string;
  marketCap: string;
  trend7D: number[];
  sector?: string;

  // Performance Tab
  perf1W?: number;
  perf1M?: number;
  perf3M?: number;
  perf6M?: number;
  perfYTD?: number;
  perf1Y?: number;
  allTimeHigh?: number;

  // Valuation Tab
  peRatio?: number;
  forwardPE?: number;
  pegRatio?: number;
  priceToSales?: number;
  priceToBook?: number;
  evToEbitda?: number;

  // Dividends Tab
  divYield?: number;
  annualDiv?: number;
  payoutRatio?: number;
  exDivDate?: string;

  // Margins Tab
  grossMargin?: number;
  operMargin?: number;
  netMargin?: number;
  roe?: number;

  // Income Tab
  revenue?: string;
  netIncome?: string;
  eps?: number;
  ebitda?: string;
  revGrowthYoY?: number;
}

export interface SectorData {
  id: string;
  name: string;
  changePercent: number;
  status: 'Leading' | 'Lagging';
  tickers: string;
  barWidthPercent: number;
  isPositive: boolean;
}

export interface NewsStory {
  id: string;
  source: string;
  timeAgo: string;
  tag: string;
  title: string;
  snippet: string;
  iconType: 'article' | 'chart' | 'trending' | 'globe';
  fullContent?: string;
  relatedSymbols?: string[];
}

export interface MarketSentimentData {
  fearAndGreedScore: number;
  fearAndGreedLabel: string;
  spxBullish: number;
  btcBullish: number;
  dxyBullish: number;
}
