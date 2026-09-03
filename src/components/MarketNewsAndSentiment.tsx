import React, { useState } from 'react';
import { Newspaper, TrendingUp, ThumbsUp, ThumbsDown, BarChart2 } from 'lucide-react';
import { MarketSentimentData, NewsStory } from '../types';

interface MarketNewsAndSentimentProps {
  newsStories: NewsStory[];
  sentiment: MarketSentimentData;
  onSelectStory: (story: NewsStory) => void;
  onOpenAllNews: () => void;
  onOpenCharts: () => void;
}

export const MarketNewsAndSentiment: React.FC<MarketNewsAndSentimentProps> = ({
  newsStories,
  sentiment,
  onSelectStory,
  onOpenAllNews,
  onOpenCharts,
}) => {
  const [userVotes, setUserVotes] = useState<Record<string, 'bull' | 'bear' | null>>({
    SPX: null,
    BTC: null,
    DXY: null,
  });

  const [liveSentiment, setLiveSentiment] = useState(sentiment);

  const handleVote = (ticker: string, stance: 'bull' | 'bear') => {
    setUserVotes((prev) => ({
      ...prev,
      [ticker]: prev[ticker] === stance ? null : stance,
    }));

    // Increment simulated sentiment counter
    if (userVotes[ticker] !== stance) {
      setLiveSentiment((prev) => {
        if (ticker === 'SPX') {
          return { ...prev, spxBullish: stance === 'bull' ? Math.min(99, prev.spxBullish + 1) : Math.max(1, prev.spxBullish - 1) };
        } else if (ticker === 'BTC') {
          return { ...prev, btcBullish: stance === 'bull' ? Math.min(99, prev.btcBullish + 1) : Math.max(1, prev.btcBullish - 1) };
        } else if (ticker === 'DXY') {
          return { ...prev, dxyBullish: stance === 'bull' ? Math.min(99, prev.dxyBullish + 1) : Math.max(1, prev.dxyBullish - 1) };
        }
        return prev;
      });
    }
  };

  return (
    <section id="market-news-sentiment-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Market Stories (2 columns) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-[#131722]">
            Market News &amp; Top Stories
          </h2>
          <button
            id="btn-see-all-news"
            onClick={onOpenAllNews}
            className="text-xs text-[#2962ff] font-semibold hover:underline cursor-pointer"
          >
            See all news
          </button>
        </div>

        <div className="space-y-3">
          {newsStories.slice(0, 2).map((story) => (
            <article
              key={story.id}
              id={`story-${story.id}`}
              onClick={() => onSelectStory(story)}
              className="p-4 rounded-xl border border-[#e0e3eb] hover:border-gray-300 hover:shadow-2xs transition-all flex flex-col sm:flex-row gap-4 items-start cursor-pointer bg-white group"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-xs mb-1.5">
                  <span className="font-bold text-[#131722]">{story.source}</span>
                  <span className="text-[#b2b5be]">•</span>
                  <span className="text-[#787b86]">{story.timeAgo}</span>
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[#787b86] text-[10px] font-medium">
                    {story.tag}
                  </span>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#131722] group-hover:text-[#2962ff] leading-snug transition-colors">
                  {story.title}
                </h3>

                <p className="text-xs text-[#787b86] mt-1.5 line-clamp-2">
                  {story.snippet}
                </p>
              </div>

              {/* Story Thumbnail Placeholder */}
              <div className="w-full sm:w-28 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center text-[#787b86] group-hover:bg-[#f0f3fa] transition-colors">
                {story.iconType === 'article' ? (
                  <svg
                    className="w-8 h-8 opacity-40 group-hover:opacity-70 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8 opacity-40 group-hover:opacity-70 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Market Sentiment / Ideas Snapshot (1 column) */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight text-[#131722]">Market Sentiment</h2>

        <div
          id="sentiment-card"
          className="p-5 rounded-xl border border-[#e0e3eb] bg-[#f8f9fd] space-y-4 shadow-2xs"
        >
          {/* Fear & Greed Gauge */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#787b86]">Fear &amp; Greed Index</span>
              <span className="font-bold text-[#089981]">
                {liveSentiment.fearAndGreedScore} — {liveSentiment.fearAndGreedLabel}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 via-emerald-500 to-green-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${liveSentiment.fearAndGreedScore}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-[#787b86] mt-1">
              <span>Extreme Fear</span>
              <span>Neutral</span>
              <span>Extreme Greed</span>
            </div>
          </div>

          <hr className="border-[#e0e3eb]/80" />

          {/* Community Consensus */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#131722]">Community Consensus</span>
              <span className="text-[10px] text-[#787b86]">Tap to vote</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* SPX Bullish */}
              <div className="flex justify-between items-center group">
                <span className="text-[#787b86] group-hover:text-[#131722]">SPX Bullish</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#089981]">{liveSentiment.spxBullish}%</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleVote('SPX', 'bull')}
                      title="Vote Bullish"
                      className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                        userVotes.SPX === 'bull' ? 'bg-[#089981] text-white' : 'hover:bg-gray-200 text-[#787b86]'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleVote('SPX', 'bear')}
                      title="Vote Bearish"
                      className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                        userVotes.SPX === 'bear' ? 'bg-[#f23645] text-white' : 'hover:bg-gray-200 text-[#787b86]'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* BTC Bullish */}
              <div className="flex justify-between items-center group">
                <span className="text-[#787b86] group-hover:text-[#131722]">BTC Bullish</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#089981]">{liveSentiment.btcBullish}%</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleVote('BTC', 'bull')}
                      title="Vote Bullish"
                      className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                        userVotes.BTC === 'bull' ? 'bg-[#089981] text-white' : 'hover:bg-gray-200 text-[#787b86]'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleVote('BTC', 'bear')}
                      title="Vote Bearish"
                      className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                        userVotes.BTC === 'bear' ? 'bg-[#f23645] text-white' : 'hover:bg-gray-200 text-[#787b86]'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* DXY Bullish */}
              <div className="flex justify-between items-center group">
                <span className="text-[#787b86] group-hover:text-[#131722]">DXY Bullish</span>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#f23645]">{liveSentiment.dxyBullish}%</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleVote('DXY', 'bull')}
                      title="Vote Bullish"
                      className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                        userVotes.DXY === 'bull' ? 'bg-[#089981] text-white' : 'hover:bg-gray-200 text-[#787b86]'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleVote('DXY', 'bear')}
                      title="Vote Bearish"
                      className={`p-1 rounded text-xs transition-colors cursor-pointer ${
                        userVotes.DXY === 'bear' ? 'bg-[#f23645] text-white' : 'hover:bg-gray-200 text-[#787b86]'
                      }`}
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Interactive Charts Button */}
          <div className="pt-2">
            <button
              id="btn-open-interactive-charts"
              onClick={onOpenCharts}
              className="block text-center w-full py-2.5 bg-white hover:bg-gray-50 border border-[#e0e3eb] rounded-lg text-xs font-bold text-[#131722] transition-colors shadow-2xs hover:shadow-xs cursor-pointer active:scale-[0.99]"
            >
              Open Interactive Charts
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
