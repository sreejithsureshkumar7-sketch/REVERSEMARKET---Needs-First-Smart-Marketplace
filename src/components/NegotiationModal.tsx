import React, { useState } from 'react';
import { Offer, Requirement } from '../types';
import { suggestCounterOfferPrice } from '../utils/geminiHelper';
import { X, Sparkles, Send, ArrowRight, ShieldAlert, Check } from 'lucide-react';

interface NegotiationModalProps {
  offer: Offer | null;
  requirement: Requirement | null;
  onClose: () => void;
  onSendCounter: (offerId: string, counterPrice: number) => void;
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
  offer,
  requirement,
  onClose,
  onSendCounter,
}) => {
  if (!offer || !requirement) return null;

  const suggestion = suggestCounterOfferPrice(offer.price, requirement.category);
  const [customPrice, setCustomPrice] = useState<number>(suggestion.suggestedPrice);
  const [isSent, setIsSent] = useState(false);

  const handleApplySuggestion = () => {
    setCustomPrice(suggestion.suggestedPrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrice >= offer.price) {
      alert('Counter offer must be lower than the current offer price.');
      return;
    }
    if (customPrice <= 0) {
      alert('Please enter a valid counter offer price.');
      return;
    }
    onSendCounter(offer.id, customPrice);
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const potentialSavings = requirement.budget - customPrice;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Smart Negotiation Engine</h3>
              <p className="text-xs text-slate-400">Propose an optimal counter-offer to {offer.providerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Counter-Offer Dispatched!</h4>
            <p className="text-xs text-slate-400">
              {offer.providerName} has been notified with your proposed price of ₹{customPrice.toLocaleString('en-IN')}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Offer Comparison row */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Current Offered Price</span>
                <span className="text-base font-bold text-slate-200">₹{offer.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">Your Target Budget</span>
                <span className="text-base font-bold text-slate-200">₹{requirement.budget.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* AI Suggestion Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-semibold text-amber-300">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Recommended Counter</span>
                </div>
                <button
                  type="button"
                  onClick={handleApplySuggestion}
                  className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-medium transition"
                >
                  Apply ₹{suggestion.suggestedPrice.toLocaleString('en-IN')}
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{suggestion.rationale}</p>
            </div>

            {/* Input Price */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Your Counter-Offer (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">₹</span>
                <input
                  type="number"
                  value={customPrice}
                  onChange={e => setCustomPrice(Number(e.target.value))}
                  min={100}
                  max={offer.price - 1}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Summary preview */}
            <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs">
              <span className="text-emerald-300 font-medium">New Projected Buyer Savings:</span>
              <span className="font-bold text-emerald-400 text-sm">
                ₹{potentialSavings > 0 ? potentialSavings.toLocaleString('en-IN') : 0}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition"
              >
                <span>Dispatch Counter-Offer</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
