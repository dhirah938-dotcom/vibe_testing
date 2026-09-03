import React, { useState } from 'react';
import { X, Check, Shield, Zap, Sparkles, TrendingUp } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
        onClose();
      }, 2500);
    }
  };

  return (
    <div
      id="get-started-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="get-started-modal-content"
        className="bg-white border border-[#e0e3eb] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-[#e0e3eb] hover:bg-gray-100 text-[#787b86] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#e7f6f2] text-[#089981] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-lg font-bold text-[#131722]">Welcome to TradingView Pro!</h3>
            <p className="text-xs text-[#787b86]">
              Your 30-day free trial has been activated. Enjoy zero-latency live data feeds and unlimited indicators.
            </p>
          </div>
        ) : (
          <div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white flex items-center justify-center mb-4 shadow-sm">
              <TrendingUp className="w-5 h-5" />
            </div>

            <h3 className="text-xl font-bold text-[#131722] mb-1">
              Start your 30-day free trial
            </h3>
            <p className="text-xs text-[#787b86] mb-5">
              Unlock over 100+ technical indicators, multiple chart layouts, and institutional-grade real-time market data.
            </p>

            <div className="space-y-2 mb-6 text-xs text-[#131722]">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Real-time continuous server streaming</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Up to 8 interactive chart layouts per tab</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Custom Pine Script™ indicators & backtesting</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-[#089981]" />
                <span>Zero banner advertisements or distractions</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work or personal email"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#e0e3eb] text-xs text-[#131722] placeholder-[#787b86] focus:outline-none focus:ring-2 focus:ring-[#2962ff]"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-xs shadow-sm hover:opacity-95 transition-all cursor-pointer"
              >
                Claim 30 Days Free
              </button>
            </form>

            <div className="mt-4 text-[10px] text-[#787b86] text-center">
              No credit card required. Cancel anytime with one click.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
