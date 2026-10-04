import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import {
  X,
  Play,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  PlusCircle,
  TrendingDown,
  Award,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface WorkingModelGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkingModelGuideModal: React.FC<WorkingModelGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isDemoMode, setIsDemoMode, setAuthModalOpen, setAuthMode, setActiveView } = useMarket();
  const [activeGuideTab, setActiveGuideTab] = useState<'working_model' | 'demo_mode'>('working_model');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                How to Use ReverseMarket: Complete Working Guide
              </h3>
              <p className="text-xs text-slate-400">
                Full Production Working Model vs One-Click Demo Mode
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

        {/* Mode Switcher Banner */}
        <div className="p-4 bg-slate-800/40 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-300 font-semibold">Active Marketplace Mode:</span>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition ${
                isDemoMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {isDemoMode ? <ToggleRight className="w-4 h-4 text-amber-400" /> : <ToggleLeft className="w-4 h-4 text-emerald-400" />}
              <span>{isDemoMode ? 'Demo Mode is ON (Mock Preset)' : 'Full Working Model is ON (Real Production)'}</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-400 hidden sm:block">
            {isDemoMode ? 'Displays College Website test scenario' : 'Empty live canvas for real user needs'}
          </span>
        </div>

        {/* Tab buttons */}
        <div className="flex border-b border-slate-800 bg-slate-900 text-xs font-semibold">
          <button
            onClick={() => setActiveGuideTab('working_model')}
            className={`flex-1 py-3 text-center transition ${
              activeGuideTab === 'working_model'
                ? 'bg-slate-800 text-emerald-400 border-b-2 border-emerald-500 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🚀 Full Working Model Flow (Real End-to-End)
          </button>
          <button
            onClick={() => setActiveGuideTab('demo_mode')}
            className={`flex-1 py-3 text-center transition ${
              activeGuideTab === 'demo_mode'
                ? 'bg-slate-800 text-amber-400 border-b-2 border-amber-500 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Demo Mode (3-Min Hackathon Presentation)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs leading-relaxed">
          {activeGuideTab === 'working_model' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                <strong>Full Working Model Mode:</strong> You can register brand new accounts, create real custom requirements from scratch, switch to provider accounts to submit offers, execute real live reverse bidding, chat, negotiate, and review!
              </div>

              {/* Step 1 */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">1</span>
                    <span>Sign In or Register (Authentication)</span>
                  </span>
                  <button
                    onClick={() => {
                      onClose();
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="text-[11px] text-indigo-400 hover:underline font-semibold"
                  >
                    Open Register Modal →
                  </button>
                </div>
                <p className="text-slate-300">
                  Click the <strong>Sign In</strong> or <strong>Register</strong> button in the top navigation. Create a new account with your name, email, password, and select your role: <strong>Buyer / Customer</strong> or <strong>Provider / Specialist</strong>.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
                <span className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">2</span>
                  <span>Buyer: Post Your Custom Need</span>
                </span>
                <p className="text-slate-300">
                  Go to <strong>Buyer Hub ➔ Post New Need</strong>. Either type naturally in the <em>1-Line AI Requirement Generator</em> (e.g. <code>"Need a Flutter e-commerce app, 25k, 2 weeks"</code>) or fill in the structured form. Your requirement will be published live with a countdown timer!
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
                <span className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">3</span>
                  <span>Provider: Browse Needs & Submit Proposal</span>
                </span>
                <p className="text-slate-300">
                  Switch to <strong>Provider Studio</strong> (or log in with a provider account like Priya or DevStudio). Click <strong>"Submit Proposal & Bid"</strong> on the newly created need. Enter price, turnaround days, and technical proposal. The system instantly runs spam filters and calculates match compatibility!
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
                <span className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">4</span>
                  <span>Live Reverse Bidding & Rank Competition</span>
                </span>
                <p className="text-slate-300">
                  In <strong>My Submitted Offers</strong>, providers see their rank (e.g. <em>#2 on Price</em>) and the live lowest bid. Providers can click <strong>"Revise Bid Downward"</strong> up to 3 times to drop price and climb to #1!
                </p>
              </div>

              {/* Step 5 */}
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800 space-y-1.5">
                <span className="font-bold text-white text-sm flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">5</span>
                  <span>Compare, Negotiate, Select Provider & Review</span>
                </span>
                <p className="text-slate-300">
                  Switch back to Buyer Hub. View the Comparison Matrix, inspect <strong>"Why 96%?"</strong> breakdown, send an AI counter-offer, chat directly via the shortlisted channel, and click <strong>"Select Provider"</strong> to award the contract with confetti. Finally, submit a 1–5 star review to update the provider's Trust Score live!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300">
                <strong>Demo Mode:</strong> Pre-populates the complete ready-made Hackathon Scenario ("College Website with CMS", ₹10,000 budget, 7 days) and 3 competing providers (Apex Tech, Priya Web Studio 96% Best Match, DevStudio Pro).
              </div>

              <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 space-y-2">
                <span className="font-bold text-white block">How to Present in 3 Minutes:</span>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                  <li>Keep <strong>Demo Mode ON</strong> in the navbar toggle.</li>
                  <li>Open the <strong>"Judge Script"</strong> button in the navbar for step-by-step cue cards.</li>
                  <li>Click <strong>"Simulate Live Bid Drop"</strong> to watch Provider C drop price from ₹11,000 to ₹8,200.</li>
                  <li>Click <strong>"Why 96%?"</strong> to show the mathematical scoring breakdown.</li>
                  <li>Click <strong>"Counter"</strong> to send an AI-suggested counter-offer ₹8,000.</li>
                  <li>Click <strong>"Select Provider"</strong> to finalize the contract and record ₹1,500+ budget saved!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={() => {
              setIsDemoMode(false);
              onClose();
              setActiveView('customer');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
          >
            Start with Full Working Model (Demo OFF)
          </button>

          <button
            onClick={() => {
              setIsDemoMode(true);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
          >
            Run Demo Preset (Demo ON)
          </button>
        </div>
      </div>
    </div>
  );
};
