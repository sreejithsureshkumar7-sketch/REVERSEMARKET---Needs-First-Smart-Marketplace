import React from 'react';
import { Offer, Requirement } from '../types';
import { X, CheckCircle2, TrendingUp, ShieldCheck, Clock, Award, Sparkles } from 'lucide-react';

interface ScoreBreakdownModalProps {
  offer: Offer | null;
  requirement: Requirement | null;
  onClose: () => void;
}

export const ScoreBreakdownModal: React.FC<ScoreBreakdownModalProps> = ({
  offer,
  requirement,
  onClose,
}) => {
  if (!offer || !requirement) return null;

  const factors = [
    {
      name: 'Budget Compatibility',
      weight: '30%',
      score: offer.scoreBreakdown.budget,
      color: 'bg-emerald-500',
      icon: TrendingUp,
      details: `Offered ₹${offer.price.toLocaleString('en-IN')} vs target ₹${requirement.budget.toLocaleString('en-IN')} (${requirement.budget - offer.price >= 0 ? `₹${(requirement.budget - offer.price).toLocaleString('en-IN')} under budget` : `₹${(offer.price - requirement.budget).toLocaleString('en-IN')} over budget`}).`,
    },
    {
      name: 'Deadline Compatibility',
      weight: '25%',
      score: offer.scoreBreakdown.deadline,
      color: 'bg-blue-500',
      icon: Clock,
      details: `Turnaround: ${offer.deliveryDays} days vs max limit ${requirement.deadlineDays} days (${requirement.deadlineDays - offer.deliveryDays >= 0 ? `${requirement.deadlineDays - offer.deliveryDays} days early delivery` : 'late delivery'}).`,
    },
    {
      name: 'Requirement Relevance',
      weight: '30%',
      score: offer.scoreBreakdown.relevance,
      color: 'bg-indigo-500',
      icon: CheckCircle2,
      details: `Technical keyword and skill alignment with required stack (${requirement.requiredSkills.join(', ')}).`,
    },
    {
      name: 'Provider Experience',
      weight: '10%',
      score: offer.scoreBreakdown.experience,
      color: 'bg-amber-500',
      icon: Award,
      details: `${offer.experienceYears} verified years in domain with documented portfolio work.`,
    },
    {
      name: 'Provider Trust Score',
      weight: '5%',
      score: offer.scoreBreakdown.trust,
      color: 'bg-purple-500',
      icon: ShieldCheck,
      details: `Holistic score (40% rating, 25% completed projects, 20% response speed, 15% verification status).`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
              {offer.matchScore}%
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Match Score Breakdown</h3>
              <p className="text-xs text-slate-400">Why {offer.providerName} received {offer.matchScore}% compatibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* AI Explanation Pill */}
          <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-200 leading-relaxed">
              <span className="font-semibold text-indigo-100">AI Match Assessment: </span>
              {offer.matchExplanation}
            </div>
          </div>

          {/* Factor Bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 uppercase tracking-wider font-semibold">
              <span>Scoring Factor</span>
              <span>Weight & Score</span>
            </div>

            {factors.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.name} className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-200">{f.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-slate-400">({f.weight} weight)</span>
                      <span className="font-bold text-white text-sm">{f.score}%</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${f.color} rounded-full transition-all duration-700`}
                      style={{ width: `${f.score}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400">{f.details}</p>
                </div>
              );
            })}
          </div>

          {/* Calculation Formula Note */}
          <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800 text-[11px] text-slate-400">
            <strong className="text-slate-300">Scoring Formula: </strong>
            Total Score = (Budget × 0.30) + (Deadline × 0.25) + (Relevance × 0.30) + (Experience × 0.10) + (Trust × 0.05).
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-semibold transition"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
