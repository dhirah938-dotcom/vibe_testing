/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroHeadline } from './components/HeroHeadline';
import { IndicesCards } from './components/IndicesCards';
import { MarketTable } from './components/MarketTable';
import { SectorPerformance } from './components/SectorPerformance';
import { MarketNewsAndSentiment } from './components/MarketNewsAndSentiment';
import { Footer } from './components/Footer';
import { InteractiveChartModal } from './components/InteractiveChartModal';
import { SearchModal } from './components/SearchModal';
import { NewsModal } from './components/NewsModal';
import { ScreenerModal } from './components/ScreenerModal';
import { GetStartedModal } from './components/GetStartedModal';

import {
  CategoryType,
  IndexCardData,
  MarketAsset,
  NewsStory,
  RegionType,
} from './types';
import {
  INITIAL_CATEGORY_CARDS,
  MARKET_ASSETS,
  SECTOR_PERFORMANCE,
  MARKET_NEWS,
  MARKET_SENTIMENT,
} from './data/mockData';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('indices');
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('US');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Dynamic card data with live tick state
  const [cardsByCategory, setCardsByCategory] = useState<Record<CategoryType, IndexCardData[]>>(
    INITIAL_CATEGORY_CARDS
  );
  const [assets, setAssets] = useState<MarketAsset[]>(MARKET_ASSETS);
  const [isLiveUpdating, setIsLiveUpdating] = useState<boolean>(true);

  // Modals state
  const [chartAsset, setChartAsset] = useState<MarketAsset | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsStory | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isGetStartedOpen, setIsGetStartedOpen] = useState(false);
  const [bookmarkedSymbols, setBookmarkedSymbols] = useState<Set<string>>(
    new Set(['SPY', 'NVDA'])
  );

  // Global Keyboard listener for Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulated live ticker updates (when enabled)
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      // 1. Update one of the top cards randomly
      setCardsByCategory((prev) => {
        const categoryCards = [...prev[selectedCategory]];
        if (categoryCards.length === 0) return prev;

        const randomIndex = Math.floor(Math.random() * categoryCards.length);
        const target = { ...categoryCards[randomIndex] };

        const priceShift = (Math.random() - 0.48) * (target.lastPrice * 0.001);
        const newPrice = Math.max(0.01, target.lastPrice + priceShift);
        const newChangePrice = target.changePrice + priceShift;
        const newChangePercent = (newChangePrice / (newPrice - newChangePrice)) * 100;

        target.lastPrice = newPrice;
        target.changePrice = newChangePrice;
        target.changePercent = newChangePercent;
        target.isPositive = newChangePercent >= 0;
        target.flashState = priceShift >= 0 ? 'up' : 'down';

        categoryCards[randomIndex] = target;

        return {
          ...prev,
          [selectedCategory]: categoryCards,
        };
      });

      // 2. Also update one of the main table assets randomly
      setAssets((prev) => {
        const next = [...prev];
        const randomIdx = Math.floor(Math.random() * next.length);
        const item = { ...next[randomIdx] };

        const delta = (Math.random() - 0.48) * (item.lastPrice * 0.0015);
        item.lastPrice = Math.max(0.1, item.lastPrice + delta);
        item.changePrice += delta;
        item.changePercent = (item.changePrice / (item.lastPrice - item.changePrice)) * 100;

        next[randomIdx] = item;
        return next;
      });

      // Clear flash after 1.2s
      setTimeout(() => {
        setCardsByCategory((prev) => {
          const catCards = prev[selectedCategory].map((c) => ({
            ...c,
            flashState: null,
          }));
          return { ...prev, [selectedCategory]: catCards };
        });
      }, 1200);
    }, 3000);

    return () => clearInterval(interval);
  }, [isLiveUpdating, selectedCategory]);

  const handleSelectCard = (card: IndexCardData) => {
    // Find matching asset or construct a temporary asset representation for the chart modal
    const found = assets.find((a) => a.symbol === card.symbol);
    if (found) {
      setChartAsset(found);
    } else {
      const syntheticAsset: MarketAsset = {
        symbol: card.symbol,
        name: card.name,
        category: selectedCategory,
        region: 'US',
        logoBg: card.badgeBg,
        lastPrice: card.lastPrice,
        changePercent: card.changePercent,
        changePrice: card.changePrice,
        high: card.lastPrice * 1.008,
        low: card.lastPrice * 0.992,
        techRating: card.changePercent >= 0 ? 'Strong Buy' : 'Neutral',
        volume: '45.8M',
        marketCap: '12.4T',
        trend7D: card.sparkline,
        peRatio: 24.5,
      };
      setChartAsset(syntheticAsset);
    }
  };

  const handleBookmarkToggle = (symbol: string) => {
    setBookmarkedSymbols((prev) => {
      const next = new Set(prev);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  // Filter assets when a sector is selected from the heatmap
  const displayedAssets = selectedSector
    ? assets.filter(
        (a) =>
          a.sector?.toLowerCase() === selectedSector.toLowerCase() ||
          (selectedSector === 'Technology' && (a.symbol === 'NVDA' || a.symbol === 'AAPL' || a.symbol === 'MSFT' || a.symbol === 'TSM' || a.symbol === 'ASML')) ||
          (selectedSector === 'Consumer Disc.' && (a.symbol === 'TSLA' || a.symbol === 'AMZN' || a.symbol === 'MC' || a.symbol === 'BABA')) ||
          (selectedSector === 'Financials' && (a.symbol === 'JPM' || a.symbol === 'V'))
      )
    : assets;

  return (
    <div className="min-h-screen bg-white text-[#131722] font-sans antialiased flex flex-col selection:bg-blue-100">
      {/* 1. Main Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGetStarted={() => setIsGetStartedOpen(true)}
      />

      {/* 2. Hero Headline Section */}
      <HeroHeadline
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* 3. Main Content Container */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* Indices Cards Row */}
        <IndicesCards
          category={selectedCategory}
          cards={cardsByCategory[selectedCategory]}
          onSelectCard={handleSelectCard}
          isLiveUpdating={isLiveUpdating}
          onToggleLive={() => setIsLiveUpdating(!isLiveUpdating)}
        />

        {/* Market Overview Financial Table */}
        <MarketTable
          assets={displayedAssets}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          onSelectAsset={(asset) => setChartAsset(asset)}
          onOpenScreener={() => setIsScreenerOpen(true)}
        />

        {/* Sector Performance 1D Heatmap */}
        <SectorPerformance
          sectors={SECTOR_PERFORMANCE}
          selectedSector={selectedSector}
          onSelectSector={(sec) => setSelectedSector(sec)}
        />

        {/* Market News and Market Sentiment */}
        <MarketNewsAndSentiment
          newsStories={MARKET_NEWS}
          sentiment={MARKET_SENTIMENT}
          onSelectStory={(story) => setSelectedNews(story)}
          onOpenAllNews={() => {
            if (MARKET_NEWS.length > 0) setSelectedNews(MARKET_NEWS[0]);
          }}
          onOpenCharts={() => {
            // Open first asset (SPY) in Supercharts modal
            if (assets.length > 0) setChartAsset(assets[0]);
          }}
        />
      </main>

      {/* 4. Footer */}
      <Footer
        onOpenScreener={() => setIsScreenerOpen(true)}
        onOpenCharts={() => {
          if (assets.length > 0) setChartAsset(assets[0]);
        }}
      />

      {/* Modals & Drawers */}
      <InteractiveChartModal
        asset={chartAsset}
        onClose={() => setChartAsset(null)}
        onBookmarkToggle={handleBookmarkToggle}
        isBookmarked={chartAsset ? bookmarkedSymbols.has(chartAsset.symbol) : false}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => {
          setChartAsset(asset);
          setIsSearchOpen(false);
        }}
      />

      <NewsModal
        story={selectedNews}
        onClose={() => setSelectedNews(null)}
        onSelectSymbol={(sym) => {
          const match = assets.find((a) => a.symbol === sym);
          if (match) setChartAsset(match);
        }}
      />

      <ScreenerModal
        isOpen={isScreenerOpen}
        onClose={() => setIsScreenerOpen(false)}
        assets={assets}
        onSelectAsset={(asset) => {
          setChartAsset(asset);
        }}
      />

      <GetStartedModal
        isOpen={isGetStartedOpen}
        onClose={() => setIsGetStartedOpen(false)}
      />
    </div>
  );
}
