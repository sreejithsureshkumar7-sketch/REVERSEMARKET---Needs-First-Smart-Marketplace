import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { translations } from '../utils/i18n';
import { Requirement, Offer } from '../types';
import {
  ShieldCheck,
  Star,
  Clock,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowRight,
  Send,
  AlertCircle,
  FileCheck,
  Sparkles,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';

interface ProviderViewProps {
  onOpenChat: (customerId: string) => void;
}

export const ProviderView: React.FC<ProviderViewProps> = ({ onOpenChat }) => {
  const {
    currentUser,
    requirements,
    offers,
    submitOffer,
    reverseBidDropPrice,
    respondToCounterOffer,
    language,
    selectedRequirementId,
    setSelectedRequirementId,
  } = useMarket();

  const t = translations[language];

  // Active tab: 'browse' | 'my_offers'
  const [subTab, setSubTab] = useState<'browse' | 'my_offers'>('browse');

  // Submit Offer Modal State
  const [biddingReq, setBiddingReq] = useState<Requirement | null>(null);
  const [offerPrice, setOfferPrice] = useState<number>(8500);
  const [deliveryDays, setDeliveryDays] = useState<number>(5);
  const [proposal, setProposal] = useState<string>('');
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [portfolioUrl, setPortfolioUrl] = useState<string>('https://github.com/my-portfolio');
  const [offerError, setOfferError] = useState<string>('');

  // Reverse Bidding Revision State
  const [revisingOffer, setRevisingOffer] = useState<Offer | null>(null);
  const [newLowerPrice, setNewLowerPrice] = useState<number>(0);
  const [revisionMessage, setRevisionMessage] = useState<string>('');

  // Provider's submitted offers
  const myOffers = offers.filter(o => o.providerId === currentUser.id);

  // Requirements open for bidding
  const openRequirements = requirements.filter(r => r.status === 'open');

  const providerStats = currentUser.providerStats || {
    avgRating: 4.8,
    reviewCount: 20,
    completedCount: 24,
    avgResponseMins: 15,
    verified: true,
    trustScore: 92,
  };

  const handleOpenSubmitOffer = (req: Requirement) => {
    setBiddingReq(req);
    setOfferPrice(Math.round(req.budget * 0.9));
    setDeliveryDays(Math.max(1, req.deadlineDays - 2));
    setProposal(`We can deliver high quality ${req.category} matching all required skills (${req.requiredSkills.slice(0, 3).join(', ')}). Full documentation and warranty included.`);
    setOfferError('');
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!biddingReq) return;

    if (offerPrice <= 0) {
      setOfferError('Price must be greater than 0.');
      return;
    }

    const res = submitOffer({
      requirementId: biddingReq.id,
      price: Number(offerPrice),
      deliveryDays: Number(deliveryDays),
      proposal,
      experienceYears: Number(experienceYears),
      portfolioUrl,
    });

    if (res.flagged) {
      alert(`Notice: Your offer was flagged by the system fraud filter (${res.reason}). An admin will review it.`);
    }

    setBiddingReq(null);
    setSubTab('my_offers');
  };

  const handleOpenRevision = (offer: Offer) => {
    setRevisingOffer(offer);
    setNewLowerPrice(Math.round(offer.price * 0.95)); // 5% lower suggested
    setRevisionMessage('');
  };

  const handleExecutePriceDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisingOffer) return;

    const res = reverseBidDropPrice(revisingOffer.id, Number(newLowerPrice));
    if (!res.success) {
      setRevisionMessage(res.message);
    } else {
      setRevisingOffer(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold mb-1">
            <span>Provider Studio</span>
            <span>·</span>
            <span>Live Reverse Bidding & Match Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentUser.name}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">{currentUser.title || 'Independent Specialist'}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSubTab('browse')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              subTab === 'browse'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            Browse Open Needs ({openRequirements.length})
          </button>
          <button
            onClick={() => setSubTab('my_offers')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              subTab === 'my_offers'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            My Submitted Offers ({myOffers.length})
          </button>
        </div>
      </div>

      {/* Provider Trust Score & Metric Showcase Card */}
      <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-6 glow-primary backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Trust Score Hero */}
          <div className="flex items-center space-x-5">
            <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/10">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-300">
                {providerStats.trustScore}
              </span>
              <span className="text-[10px] text-slate-300 font-bold absolute -bottom-2 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 font-mono shadow">
                /100
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-extrabold text-white text-lg">Verified Provider Trust Index</h3>
                {providerStats.verified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin Certified (+15 pts)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Empowers your match engine priority (5% overall score). Autonomously calculated from post-job reviews (40%), completed projects (25%), response speed (20%), and identity KYC (15%).
              </p>
            </div>
          </div>

          {/* 4 Factor Pills with visual bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs w-full lg:w-auto">
            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1 shadow-sm">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Avg Rating (40%)</span>
              <div className="flex items-center space-x-1 font-black text-white text-base">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{providerStats.avgRating}</span>
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
              <span className="text-[10px] text-slate-400 block">{providerStats.reviewCount} verified reviews</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1 shadow-sm">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Completed (25%)</span>
              <div className="font-black text-white text-base">
                {providerStats.completedCount} Projects
              </div>
              <span className="text-[10px] text-emerald-400 block font-semibold">100% handover rate</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1 shadow-sm">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Response (20%)</span>
              <div className="font-black text-indigo-400 text-base">
                ~{providerStats.avgResponseMins} Mins
              </div>
              <span className="text-[10px] text-indigo-300 block font-semibold">Fast response badge</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-1 shadow-sm">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">KYC Status (15%)</span>
              <div className="font-black text-emerald-400 text-base">
                {providerStats.verified ? 'Verified ✓' : 'Pending'}
              </div>
              <span className="text-[10px] text-slate-400 block">ID & Skill audited</span>
            </div>
          </div>
        </div>
      </div>

      {subTab === 'browse' ? (
        /* BROWSE REQUIREMENTS LIST */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">Open Buyer Requirements for Reverse Bidding</h3>
              <p className="text-xs text-slate-400">Submit competitive proposals to win matching placement</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {openRequirements.map(req => {
              const myOfferForReq = offers.find(
                o => o.requirementId === req.id && o.providerId === currentUser.id
              );
              const totalOffers = offers.filter(o => o.requirementId === req.id).length;

              return (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-semibold text-[10px] border border-indigo-500/20">
                        {req.category}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Deadline: {req.deadlineDays}d</span>
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-base leading-snug">{req.title}</h4>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {req.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {req.requiredSkills.map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Buyer Budget</span>
                        <span className="font-bold text-white text-sm">₹{req.budget.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase block">Current Lowest Bid</span>
                        <span className="font-bold text-emerald-400 text-sm">
                          ₹{(req.lowestBid || req.budget).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {myOfferForReq ? (
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="text-[10px] text-slate-400 block">Your Active Bid</span>
                          <span className="font-bold text-white">₹{myOfferForReq.price.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          onClick={() => handleOpenRevision(myOfferForReq)}
                          disabled={myOfferForReq.revisionCount >= 3}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center space-x-1 transition"
                        >
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>Drop Bid</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenSubmitOffer(req)}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20"
                      >
                        Submit Proposal & Bid
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MY SUBMITTED OFFERS & REVERSE BIDDING STATUS */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">My Active Bids & Reverse Bidding Revisions</h3>
              <p className="text-xs text-slate-400">
                You can lower your bid up to 3 times to outperform competitors while requirements are open.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {myOffers.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400">
                <p className="text-sm">You haven't submitted any offers yet. Check "Browse Open Needs" to bid!</p>
              </div>
            ) : (
              myOffers.map(offer => {
                const req = requirements.find(r => r.id === offer.requirementId);
                const reqOffers = offers.filter(o => o.requirementId === offer.requirementId);
                // Sort by price to determine rank
                const sortedByPrice = [...reqOffers].sort((a, b) => a.price - b.price);
                const myRank = sortedByPrice.findIndex(o => o.id === offer.id) + 1;
                const lowestPrice = sortedByPrice[0]?.price || offer.price;

                return (
                  <div
                    key={offer.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center space-x-2 text-xs">
                          <span className="font-bold text-white text-base">{req?.title || 'Project'}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                            {req?.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Target Budget: ₹{req?.budget.toLocaleString('en-IN')} · Deadline: {req?.deadlineDays} days
                        </p>
                      </div>

                      {/* Rank & Match Score Indicators */}
                      <div className="flex items-center space-x-2">
                        <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                          <span className="text-slate-400">Live Rank: </span>
                          <span className={`font-black ${myRank === 1 ? 'text-emerald-400' : 'text-amber-400'}`}>
                            #{myRank} on Price
                          </span>
                        </div>

                        <div className="px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                          {offer.matchScore}% Match
                        </div>
                      </div>
                    </div>

                    {/* Offer Pricing Details & Reverse Bidding History */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Your Current Bid</span>
                        <span className="text-lg font-bold text-white">₹{offer.price.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Current Lowest Bid</span>
                        <span className="text-lg font-bold text-emerald-400">₹{lowestPrice.toLocaleString('en-IN')}</span>
                        {myRank > 1 && (
                          <span className="text-[10px] text-amber-400 block">
                            (Drop by ₹{(offer.price - lowestPrice + 100).toLocaleString('en-IN')} to take #1)
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Revisions Used</span>
                        <span className="text-sm font-semibold text-slate-200">{offer.revisionCount} of 3 revisions</span>
                      </div>
                    </div>

                    {/* Counter Offer Alert if received */}
                    {offer.status === 'countered' && offer.counterOffer && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1.5 text-amber-300 font-bold text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>Customer Counter-Offer Received: ₹{offer.counterOffer.price.toLocaleString('en-IN')}</span>
                          </div>
                          <p className="text-slate-300 text-xs">
                            The buyer proposes sealing the contract at ₹{offer.counterOffer.price.toLocaleString('en-IN')}.
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => respondToCounterOffer(offer.id, true)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                          >
                            Accept & Finalize Contract
                          </button>
                          <button
                            onClick={() => respondToCounterOffer(offer.id, false)}
                            className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Status Badge & Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="text-xs text-slate-400">
                        Status: <strong className="capitalize text-slate-200">{offer.status}</strong>
                      </span>

                      <div className="flex items-center space-x-2">
                        {req && (
                          <button
                            onClick={() => onOpenChat(req.userId)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                          >
                            Chat with Buyer
                          </button>
                        )}

                        {req?.status === 'open' && (
                          <button
                            onClick={() => handleOpenRevision(offer)}
                            disabled={offer.revisionCount >= 3}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold flex items-center space-x-1 transition shadow"
                          >
                            <TrendingDown className="w-3.5 h-3.5" />
                            <span>Revise Bid Downward</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUBMIT OFFER MODAL */}
      {biddingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Submit Competitive Offer</h3>
                <p className="text-xs text-slate-400">For: {biddingReq.title}</p>
              </div>
              <button
                onClick={() => setBiddingReq(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendOffer} className="p-6 space-y-4 text-xs">
              {offerError && (
                <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 font-medium">
                  {offerError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Offer Price (₹ INR)</label>
                  <input
                    type="number"
                    value={offerPrice}
                    onChange={e => setOfferPrice(Number(e.target.value))}
                    min={100}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Buyer budget: ₹{biddingReq.budget.toLocaleString('en-IN')}</span>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Delivery Time (Days)</label>
                  <input
                    type="number"
                    value={deliveryDays}
                    onChange={e => setDeliveryDays(Number(e.target.value))}
                    min={1}
                    max={biddingReq.deadlineDays}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold"
                    required
                  />
                  <span className="text-[10px] text-slate-400">Max allowed: {biddingReq.deadlineDays} days</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Technical Proposal</label>
                <textarea
                  rows={4}
                  value={proposal}
                  onChange={e => setProposal(e.target.value)}
                  placeholder="Outline your architecture, deliverable milestones, and relevant past work..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Experience (Years)</label>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={e => setExperienceYears(Number(e.target.value))}
                    min={0}
                    max={25}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Portfolio / GitHub Link</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={e => setPortfolioUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setBiddingReq(null)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Submit Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REVERSE BIDDING DOWNWARD REVISION MODAL */}
      {revisingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-400">
                <TrendingDown className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Live Reverse Bidding Revision</h3>
              </div>
              <button
                onClick={() => setRevisingOffer(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecutePriceDrop} className="p-6 space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Bid:</span>
                  <span className="font-bold text-white">₹{revisingOffer.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Revisions Left:</span>
                  <span className="font-bold text-amber-400">{3 - revisingOffer.revisionCount} of 3</span>
                </div>
              </div>

              {revisionMessage && (
                <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 font-semibold">
                  {revisionMessage}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">New Strictly Lower Bid (₹ INR)</label>
                <input
                  type="number"
                  value={newLowerPrice}
                  onChange={e => setNewLowerPrice(Number(e.target.value))}
                  min={100}
                  max={revisingOffer.price - 1}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-sm"
                  required
                />
                <span className="text-[11px] text-slate-400 block">
                  Must be lower than ₹{revisingOffer.price.toLocaleString('en-IN')}.
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRevisingOffer(null)}
                  className="px-4 py-2 rounded-xl text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1.5 shadow-lg shadow-emerald-600/20"
                >
                  <TrendingDown className="w-3.5 h-3.5" />
                  <span>Execute Price Drop</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
