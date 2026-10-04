import React from 'react';
import { useMarket } from '../context/MarketContext';
import {
  X,
  Play,
  TrendingDown,
  FileText,
  Languages,
  SunMoon,
  Sparkles,
  Award,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

interface JudgeDemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenScoreModal?: () => void;
  onOpenNegotiateModal?: () => void;
  onExportPdf?: () => void;
}

export const JudgeDemoGuideModal: React.FC<JudgeDemoGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenScoreModal,
  onOpenNegotiateModal,
  onExportPdf,
}) => {
  const {
    loadDemoMode,
    simulateReverseBidDrop,
    setActiveView,
    language,
    setLanguage,
    theme,
    setTheme,
  } = useMarket();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Play className="w-5 h-5 fill-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center space-x-2">
                <span>3-Minute Judge Evaluation Script</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-semibold">
                  PS 1 Hackathon Blueprint
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Follow this recommended walkthrough or trigger actions in 1 click
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  0:00–0:30 · Problem Statement & Landing Page
                </h4>
                <button
                  onClick={() => {
                    setActiveView('landing');
                    onClose();
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View Landing →
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Explain the paradigm flip: "Traditional marketplaces make users search through endless listings.
                ReverseMarket reverses it: buyers post needs, providers compete downwards with offers, and smart matching picks the best value."
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  0:30–1:15 · AI Requirement Generator & Live Timer
                </h4>
                <button
                  onClick={() => {
                    loadDemoMode();
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition"
                >
                  Load Demo Scenario
                </button>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demonstrate typing in the 1-line box: <em>"Need a college website, 10k, 1 week"</em>.
                AI extracts title, budget (₹10,000), deadline (7 days), skills, and starts the live countdown timer.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  1:15–2:15 · Reverse Bidding, Score Breakdown & Savings
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      simulateReverseBidDrop();
                    }}
                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold flex items-center space-x-1 transition"
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>Drop Bid to ₹8,200</span>
                  </button>
                  {onOpenScoreModal && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenScoreModal();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium"
                    >
                      Inspect Why 96%?
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Watch Provider C drop price live from ₹11,000 to ₹8,200. Inspect the "Why 96%?" breakdown chart showing budget (30%), deadline (25%), relevance (30%), experience (10%), and trust score (5%).
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  2:15–2:45 · Shortlist, Counter-Offer & Award
                </h4>
                {onOpenNegotiateModal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenNegotiateModal();
                    }}
                    className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-semibold"
                  >
                    Open Counter-Offer
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Smart negotiation suggests counter-offer ₹8,000 on Priya Web Studio. Send counter, accept it, and click "Select Provider" to celebrate with confetti and record ₹1,500+ budget saved!
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex items-start space-x-3.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              5
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                  2:45–3:00 · Polish: Tamil Toggle & PDF Export
                </h4>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                    className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium flex items-center space-x-1"
                  >
                    <Languages className="w-3 h-3" />
                    <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
                  </button>
                  {onExportPdf && (
                    <button
                      onClick={onExportPdf}
                      className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium flex items-center space-x-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>PDF</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Switch to Tamil (தமிழ்), toggle Dark/Light mode, and download the full executive PDF summary.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Final Presentation Core: <em>"Don't search for providers. Post your need. Let providers compete."</em>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
          >
            Got it, Let's Demo
          </button>
        </div>
      </div>
    </div>
  );
};
