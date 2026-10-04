import React from 'react';
import { useMarket } from '../context/MarketContext';
import { translations } from '../utils/i18n';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Users,
  Briefcase,
  Layers,
  Award,
  AlertTriangle,
  XCircle,
  Check,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const {
    users,
    requirements,
    offers,
    dismissFlag,
    suspendOffer,
    verifyProvider,
    language,
  } = useMarket();

  const t = translations[language];

  const providers = users.filter(u => u.role === 'provider');
  const customers = users.filter(u => u.role === 'customer');
  const matchedRequirements = requirements.filter(r => r.status === 'matched' || r.status === 'completed');
  const flaggedOffers = offers.filter(o => o.flagged);

  // Total savings across platform
  const totalBudgetSaved = requirements.reduce(
    (acc, r) => acc + (r.budgetSaved || 0),
    0
  );

  // Calculate average reverse bidding discount
  let totalRevisions = 0;
  let totalDiscountRupees = 0;
  offers.forEach(o => {
    if (o.priceHistory.length > 1) {
      const initial = o.priceHistory[0].price;
      const final = o.price;
      if (initial > final) {
        totalDiscountRupees += initial - final;
        totalRevisions++;
      }
    }
  });

  const avgDiscountRupees = totalRevisions > 0 ? Math.round(totalDiscountRupees / totalRevisions) : 1200;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-xs text-purple-400 font-semibold mb-1">
          <span>Platform Operations & Integrity</span>
          <span>·</span>
          <span>Admin Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Marketplace Health & Anti-Spam Control
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Real-time oversight of requirements, competitive reverse bidding, and automated fraud filtering.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl glass-card-mass border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Users</span>
          <div className="text-2xl font-black text-white font-mono tabular-nums">{users.length}</div>
          <span className="text-[10px] text-slate-400 font-medium">{customers.length} Buyers registered</span>
        </div>

        <div className="p-4 rounded-2xl glass-card-mass border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Verified Pool</span>
          <div className="text-2xl font-black text-blue-400 font-mono tabular-nums">{providers.length}</div>
          <span className="text-[10px] text-blue-300 font-medium">Specialist providers</span>
        </div>

        <div className="p-4 rounded-2xl glass-card-mass border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Active Needs</span>
          <div className="text-2xl font-black text-white font-mono tabular-nums">{requirements.length}</div>
          <span className="text-[10px] text-slate-400 font-medium">Live requirements</span>
        </div>

        <div className="p-4 rounded-2xl glass-card-mass border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Proposals</span>
          <div className="text-2xl font-black text-indigo-400 font-mono tabular-nums">{offers.length}</div>
          <span className="text-[10px] text-indigo-300 font-medium">Reverse bids logged</span>
        </div>

        <div className="p-4 rounded-2xl glass-card-mass border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Matches Closed</span>
          <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">{matchedRequirements.length}</div>
          <span className="text-[10px] text-emerald-300 font-medium">Successful awards</span>
        </div>

        <div className="p-4 rounded-2xl glass-card-mass border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Buyer Savings</span>
          <div className="text-2xl font-black text-emerald-400 font-mono tabular-nums">₹{totalBudgetSaved.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-emerald-400 font-medium">Cash saved vs budget</span>
        </div>
      </div>

      {/* Flagged Offers Moderation Queue */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Flagged / Spam Offers Moderation Queue ({flaggedOffers.length})
              </h3>
              <p className="text-xs text-slate-400">
                Rule-based fraud detection triggers on bids &lt;30% of budget, short text, or rapid rate limits.
              </p>
            </div>
          </div>
        </div>

        {flaggedOffers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs rounded-xl bg-slate-800/40 border border-slate-800">
            ✓ All proposals verified. No suspicious lowball or spam offers currently pending review.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {flaggedOffers.map(offer => {
              const req = requirements.find(r => r.id === offer.requirementId);
              return (
                <div key={offer.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{offer.providerName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-semibold">
                        Flagged
                      </span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Offered: <strong className="text-rose-400">₹{offer.price.toLocaleString('en-IN')}</strong> for requirement "{req?.title}" (Budget: ₹{req?.budget.toLocaleString('en-IN')})
                    </p>
                    <p className="text-[11px] text-amber-300/90 flex items-center space-x-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 inline mr-1" />
                      <span>{offer.flagReason}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => dismissFlag(offer.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Dismiss Flag</span>
                    </button>
                    <button
                      onClick={() => suspendOffer(offer.id)}
                      className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center space-x-1"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Suspend Offer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Provider Verification & Trust Score Manager */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h3 className="font-bold text-white text-base">Provider Pool & Verification Management</h3>
          <p className="text-xs text-slate-400">
            Grant verified badges to boost provider Trust Scores by +15 points and ensure marketplace authenticity.
          </p>
        </div>

        <div className="divide-y divide-slate-800">
          {providers.map(prov => {
            const stats = prov.providerStats;
            const isVerified = stats?.verified ?? false;

            return (
              <div key={prov.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={prov.avatar}
                    alt={prov.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h4 className="font-bold text-white text-sm">{prov.name}</h4>
                      {isVerified ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                          Unverified
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">{prov.title}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Trust Score</span>
                    <span className="font-bold text-indigo-400 text-sm">{stats?.trustScore || 70}/100</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Client Rating</span>
                    <span className="font-bold text-white text-sm">★ {stats?.avgRating || 4.5}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Completed</span>
                    <span className="font-bold text-white text-sm">{stats?.completedCount || 0} projects</span>
                  </div>

                  {!isVerified ? (
                    <button
                      onClick={() => verifyProvider(prov.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center space-x-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify (+15 Pts)</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-semibold text-xs flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Certified</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
