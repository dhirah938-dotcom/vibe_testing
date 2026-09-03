import React from 'react';
import { X, Clock, ExternalLink, Bookmark, Share2 } from 'lucide-react';
import { NewsStory } from '../types';

interface NewsModalProps {
  story: NewsStory | null;
  onClose: () => void;
  onSelectSymbol?: (symbol: string) => void;
}

export const NewsModal: React.FC<NewsModalProps> = ({
  story,
  onClose,
  onSelectSymbol,
}) => {
  if (!story) return null;

  return (
    <div
      id="news-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="news-modal-content"
        className="bg-white border border-[#e0e3eb] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 border-b border-[#e0e3eb] flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-bold text-[#131722]">{story.source}</span>
            <span className="text-[#b2b5be]">•</span>
            <span className="text-[#787b86] flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{story.timeAgo}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[#787b86] text-[10px] font-medium">
              {story.tag}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-[#e0e3eb] hover:bg-gray-100 text-[#787b86] hover:text-[#131722] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#131722] leading-snug">
            {story.title}
          </h2>

          <p className="text-sm font-medium text-[#787b86] italic border-l-2 border-[#2962ff] pl-3 py-0.5 bg-[#f8f9fd] rounded-r">
            {story.snippet}
          </p>

          <div className="text-sm text-[#131722] leading-relaxed space-y-3">
            <p>{story.fullContent || story.snippet}</p>
            <p>
              Market analysts emphasized that recent earnings reports and macroeconomic data prints have supported risk asset flows. Investors will be closely watching upcoming consumer price index metrics and sovereign bond auctions later in the week for additional confirmation of current interest rate expectations.
            </p>
          </div>

          {/* Related Symbols */}
          {story.relatedSymbols && story.relatedSymbols.length > 0 && (
            <div className="pt-4 border-t border-[#e0e3eb]">
              <div className="text-xs font-bold text-[#787b86] mb-2 uppercase tracking-wider">
                Related Symbols
              </div>
              <div className="flex flex-wrap gap-2">
                {story.relatedSymbols.map((sym) => (
                  <button
                    key={sym}
                    onClick={() => {
                      if (onSelectSymbol) onSelectSymbol(sym);
                      onClose();
                    }}
                    className="px-3 py-1 bg-[#f0f3fa] hover:bg-[#e0e3eb] text-[#2962ff] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    ${sym}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-[#e0e3eb] bg-[#f8f9fd] flex items-center justify-between text-xs text-[#787b86]">
          <span>Verified wire report via Financial Markets Feed</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#131722] text-white rounded-lg font-semibold hover:bg-black transition-colors"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
};
