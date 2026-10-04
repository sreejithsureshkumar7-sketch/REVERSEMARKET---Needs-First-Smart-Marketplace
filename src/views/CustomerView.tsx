import React, { useState, useEffect } from 'react';
import { useMarket } from '../context/MarketContext';
import { translations } from '../utils/i18n';
import {
  Requirement,
  Offer,
  RequirementCategory,
  RequirementPriority,
} from '../types';
import { parseOneLineRequirement } from '../utils/geminiHelper';
import { exportComparisonPdf } from '../utils/pdfExport';
import {
  Sparkles,
  Plus,
  Clock,
  TrendingDown,
  Filter,
  CheckCircle2,
  ShieldCheck,
  MessageSquare,
  FileText,
  Star,
  Layers,
  ArrowUpDown,
  Search,
  Check,
  ChevronRight,
  AlertTriangle,
  Send,
  HelpCircle,
} from 'lucide-react';

interface CustomerViewProps {
  onOpenScoreModal: (offer: Offer, req: Requirement) => void;
  onOpenNegotiationModal: (offer: Offer, req: Requirement) => void;
  onOpenReviewModal: (offer: Offer, req: Requirement) => void;
  onOpenChat: (providerId: string) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  onOpenScoreModal,
  onOpenNegotiationModal,
  onOpenReviewModal,
  onOpenChat,
}) => {
  const {
    requirements,
    offers,
    shortlists,
    toggleShortlist,
    selectProvider,
    postRequirement,
    selectedRequirementId,
    setSelectedRequirementId,
    language,
    simulateReverseBidDrop,
  } = useMarket();

  const t = translations[language];

  // Active subtab: 'dashboard' | 'create'
  const [subTab, setSubTab] = useState<'dashboard' | 'create'>('dashboard');

  // AI 1-line prompt input
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Requirement form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<RequirementCategory>('Web Development');
  const [formBudget, setFormBudget] = useState<number>(10000);
  const [formDeadline, setFormDeadline] = useState<number>(7);
  const [formSkills, setFormSkills] = useState<string>('React, Responsive UI, Admin Panel');
  const [formPriority, setFormPriority] = useState<RequirementPriority>('Medium');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('Remote');

  // Filter & Sort
  const [sortBy, setSortBy] = useState<'best_match' | 'lowest_price' | 'fastest_delivery'>('best_match');
  const [filterVerifiedOnly, setFilterVerifiedOnly] = useState(false);
  const [filterMinTrust, setFilterMinTrust] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(50000);
  const [showFilters, setShowFilters] = useState(false);

  // Current active requirement
  const currentReq =
    requirements.find(r => r.id === selectedRequirementId) || requirements[0];

  // Offers for current requirement
  const currentOffers = currentReq
    ? offers.filter(o => o.requirementId === currentReq.id)
    : [];

  // Filter and sort offers
  const filteredOffers = currentOffers
    .filter(offer => {
      if (filterVerifiedOnly && !offer.providerVerified) return false;
      if (offer.providerTrustScore < filterMinTrust) return false;
      if (offer.price > filterMaxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'best_match') return b.matchScore - a.matchScore;
      if (sortBy === 'lowest_price') return a.price - b.price;
      if (sortBy === 'fastest_delivery') return a.deliveryDays - b.deliveryDays;
      return 0;
    });

  // Top/Best offer
  const bestOffer = currentOffers.reduce<Offer | undefined>((best, curr) => {
    if (!best || curr.matchScore > best.matchScore) return curr;
    return best;
  }, undefined);

  // Selected offer
  const selectedOffer = currentOffers.find(o => o.id === currentReq?.selectedOfferId);

  // Live timer formatter
  const [timeLeftStr, setTimeLeftStr] = useState<string>('2d 4h 12m');
  const [timerUrgency, setTimerUrgency] = useState<'green' | 'amber' | 'red'>('green');

  useEffect(() => {
    if (!currentReq?.expiresAt) return;

    const updateTimer = () => {
      const now = Date.now();
      const expires = new Date(currentReq.expiresAt).getTime();
      const diff = expires - now;

      if (diff <= 0) {
        setTimeLeftStr('Bidding Concluded (Review Offers)');
        setTimerUrgency('red');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const days = Math.floor(hours / 24);
      const remHours = hours % 24;

      if (hours > 24) {
        setTimeLeftStr(`${days}d ${remHours}h ${mins}m`);
        setTimerUrgency('green');
      } else if (hours > 2) {
        setTimeLeftStr(`${hours}h ${mins}m`);
        setTimerUrgency('amber');
      } else {
        setTimeLeftStr(`${hours}h ${mins}m`);
        setTimerUrgency('red');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 30000);
    return () => clearInterval(interval);
  }, [currentReq]);

  // AI 1-line handler
  const handleAiAutoFill = async () => {
    if (!aiInput.trim()) return;
    setIsAiLoading(true);
    try {
      const extracted = await parseOneLineRequirement(aiInput);
      setFormTitle(extracted.title);
      setFormCategory(extracted.category);
      setFormBudget(extracted.budget);
      setFormDeadline(extracted.deadlineDays);
      setFormSkills(extracted.requiredSkills.join(', '));
      setFormPriority(extracted.priority);
      setFormDescription(extracted.description);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCreateRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || formBudget <= 0) return;

    const skillsArray = formSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newReq = postRequirement({
      title: formTitle,
      category: formCategory,
      description: formDescription,
      budget: Number(formBudget),
      deadlineDays: Number(formDeadline),
      requiredSkills: skillsArray,
      priority: formPriority,
      location: formLocation,
    });

    setSubTab('dashboard');
    setSelectedRequirementId(newReq.id);
  };

  const handleExport = () => {
    if (!currentReq) return;
    exportComparisonPdf(currentReq, currentOffers, bestOffer);
  };

  // Best values for matrix highlighting
  const lowestPriceVal = Math.min(...currentOffers.map(o => o.price));
  const fastestDeliveryVal = Math.min(...currentOffers.map(o => o.deliveryDays));
  const highestRatingVal = Math.max(...currentOffers.map(o => o.providerRating));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Sub-Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-400 font-semibold mb-1">
            <span>Customer Dashboard</span>
            <span>·</span>
            <span>Needs-First Procurement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Requirement & Offer Hub
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSubTab('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
              subTab === 'dashboard'
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            My Requirements ({requirements.length})
          </button>

          <button
            onClick={() => setSubTab('create')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              subTab === 'create'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Need</span>
          </button>
        </div>
      </div>

      {subTab === 'create' ? (
        /* CREATE REQUIREMENT FORM WITH 1-LINE AI GENERATOR */
        <div className="max-w-3xl mx-auto space-y-6">
          {/* AI 1-Line Generator Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/40 space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h2 className="font-bold text-white text-base">
                1-Line AI Requirement Generator
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Type your requirement naturally. AI instantly extracts category, budget, timeline, and required skills.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAiAutoFill()}
                placeholder="e.g., Need a college website, 10k, 1 week..."
                className="flex-1 px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={isAiLoading || !aiInput.trim()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center space-x-1.5 transition shrink-0"
              >
                {isAiLoading ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Fill Form</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400 font-medium">Try clicking:</span>
              <button
                type="button"
                onClick={() => setAiInput('Need a college website, 10k, 1 week')}
                className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-indigo-300 hover:text-white hover:bg-slate-700 transition"
              >
                College Website 10k 1wk
              </button>
              <button
                type="button"
                onClick={() => setAiInput('Flutter grocery delivery app with cart and tracking, 25000, 14 days')}
                className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-indigo-300 hover:text-white hover:bg-slate-700 transition"
              >
                Flutter App 25k 14d
              </button>
              <button
                type="button"
                onClick={() => setAiInput('Minimalist brand logo and packaging for tea startup, 6k, 4 days')}
                className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-indigo-300 hover:text-white hover:bg-slate-700 transition"
              >
                Tea Brand Logo 6k 4d
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleCreateRequirement} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
            <h3 className="font-bold text-white text-base">Requirement Specification</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Project Title</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g., College Website with CMS & Student Portal"
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Category</label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as RequirementCategory)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Tutoring & Education">Tutoring & Education</option>
                  <option value="Event Services">Event Services</option>
                  <option value="Content & Writing">Content & Writing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Target Budget (₹ INR)</label>
                <input
                  type="number"
                  value={formBudget}
                  onChange={e => setFormBudget(Number(e.target.value))}
                  placeholder="10000"
                  min={500}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Deadline (in Days)</label>
                <input
                  type="number"
                  value={formDeadline}
                  onChange={e => setFormDeadline(Number(e.target.value))}
                  placeholder="7"
                  min={1}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Priority Level</label>
                <select
                  value={formPriority}
                  onChange={e => setFormPriority(e.target.value as RequirementPriority)}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Urgency</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Required Skills / Deliverables (comma separated)</label>
                <input
                  type="text"
                  value={formSkills}
                  onChange={e => setFormSkills(e.target.value)}
                  placeholder="React, Responsive UI, Admin Panel, Tailwind CSS"
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-medium text-slate-300">Scope & Deliverable Description</label>
                <textarea
                  rows={4}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Detail the technical expectations, deliverables, and expectations..."
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSubTab('dashboard')}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition"
              >
                Publish & Start Reverse Bidding
              </button>
            </div>
          </form>
        </div>
      ) : requirements.length === 0 ? (
        /* EMPTY STATE IN FULL WORKING MODEL MODE */
        <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Full Production Working Model (Demo OFF)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">No Requirements Published Yet</h3>
            <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
              Start by posting your custom project requirement with budget and deadline. Qualified providers will submit competitive bids with live reverse bidding!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSubTab('create')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Post Your First Project Need</span>
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE REQUIREMENTS & COMPARISON DASHBOARD */
        <div className="space-y-8">
          {/* Active Requirements Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center space-x-3 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs text-slate-400 font-semibold shrink-0">Active Needs:</span>
              {requirements.map(req => {
                const isSelected = req.id === selectedRequirementId;
                const reqOffers = offers.filter(o => o.requirementId === req.id);
                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequirementId(req.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition flex items-center space-x-2 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{req.title.split(' ')[0]} {req.title.split(' ')[1] || ''}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-900/60 font-semibold">
                      {reqOffers.length} offers
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Expiry Countdown Badge */}
            {currentReq && (
              <div className="flex items-center space-x-2 shrink-0">
                <Clock
                  className={`w-4 h-4 ${
                    timerUrgency === 'green'
                      ? 'text-emerald-400'
                      : timerUrgency === 'amber'
                      ? 'text-amber-400'
                      : 'text-rose-400 animate-pulse'
                  }`}
                />
                <span className="text-xs text-slate-300">
                  Offers close in:{' '}
                  <strong
                    className={`font-mono font-bold ${
                      timerUrgency === 'green'
                        ? 'text-emerald-400'
                        : timerUrgency === 'amber'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {timeLeftStr}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Current Requirement Hero Header */}
          {currentReq && (
            <div className="p-7 rounded-3xl bg-slate-900/90 border border-slate-700/80 shadow-2xl space-y-5 glow-primary backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      {currentReq.category}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-300 font-medium">Priority: {currentReq.priority}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">Location: {currentReq.location || 'Remote'}</span>
                    {currentReq.isDemo && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Demo Mode Active
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentReq.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    {currentReq.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {currentReq.requiredSkills.map(skill => (
                      <span
                        key={skill}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700/80 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Stat Card & Status */}
                <div className="flex flex-wrap lg:flex-col items-end gap-3 shrink-0">
                  <div className="flex items-center space-x-5 p-4 rounded-2xl bg-slate-800/80 border border-slate-700 text-right shadow-inner">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Target Budget</span>
                      <span className="text-xl font-black text-white">₹{currentReq.budget.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-l border-slate-700 pl-5">
                      <span className="text-[10px] text-emerald-400 block uppercase font-bold tracking-wider">Lowest Bid</span>
                      <span className="text-xl font-black text-emerald-400">
                        ₹{(currentReq.lowestBid || currentReq.budget).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleExport}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center space-x-1.5 transition shadow-sm cursor-pointer"
                      title="Download PDF Comparison Matrix"
                    >
                      <FileText className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t.exportPdf}</span>
                    </button>

                    {/* Interactive Price Drop Trigger for demo */}
                    {currentReq.isDemo && (
                      <button
                        onClick={simulateReverseBidDrop}
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold flex items-center space-x-1.5 transition cursor-pointer shadow-md"
                        title="Simulate live downward bid revision"
                      >
                        <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Simulate Live Bid Drop</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Banner if Matched */}
              {currentReq.status === 'matched' && selectedOffer && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Check className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-emerald-300">
                        Provider Successfully Selected & Matched
                      </h4>
                      <p className="text-xs text-emerald-400/90 mt-0.5">
                        Awarded to {selectedOffer.providerName} for ₹{selectedOffer.price.toLocaleString('en-IN')} (Saved ₹{(currentReq.budget - selectedOffer.price).toLocaleString('en-IN')} vs target budget).
                      </p>
                    </div>
                  </div>

                  {!currentReq.reviewed ? (
                    <button
                      onClick={() => onOpenReviewModal(selectedOffer, currentReq)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center space-x-1.5 transition shadow-lg shadow-emerald-600/30 cursor-pointer"
                    >
                      <Star className="w-3.5 h-3.5 fill-white" />
                      <span>Rate & Review Completion</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-300 flex items-center space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Review Recorded & Trust Score Updated</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* KPI Dashboard Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-card-mass border border-slate-800/80 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Offers Received</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="text-3xl font-black text-white mt-1.5 font-mono tabular-nums">{currentOffers.length}</div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
                <span>⚡ Live reverse bidding</span>
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-card-mass border border-slate-800/80 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Top Match Score</span>
                <span className="text-[10px] font-bold text-emerald-400 font-mono">WEIGHTED</span>
              </div>
              <div className="text-3xl font-black text-emerald-400 mt-1.5 font-mono tabular-nums">
                {bestOffer ? `${bestOffer.matchScore}%` : 'N/A'}
              </div>
              <p className="text-[11px] text-slate-300 font-medium mt-1 truncate">{bestOffer?.providerName || 'Evaluating'}</p>
            </div>

            <div className="p-5 rounded-2xl glass-card-mass border border-slate-800/80 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Max Budget Saved</span>
                <span className="text-[10px] font-bold text-teal-400 font-mono">CASH SAVED</span>
              </div>
              <div className="text-3xl font-black text-emerald-400 mt-1.5 font-mono tabular-nums">
                {currentReq && lowestPriceVal < currentReq.budget
                  ? `₹${(currentReq.budget - lowestPriceVal).toLocaleString('en-IN')}`
                  : '₹0'}
              </div>
              <p className="text-[11px] text-emerald-300 font-semibold mt-1">
                {currentReq && lowestPriceVal < currentReq.budget
                  ? `${Math.round(((currentReq.budget - lowestPriceVal) / currentReq.budget) * 100)}% savings vs budget`
                  : 'At budget'}
              </p>
            </div>

            <div className="p-5 rounded-2xl glass-card-mass border border-slate-800/80 shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fastest Delivery</span>
                <span className="text-[10px] font-bold text-indigo-400 font-mono">SLA</span>
              </div>
              <div className="text-3xl font-black text-indigo-400 mt-1.5 font-mono tabular-nums">
                {currentOffers.length > 0 ? `${fastestDeliveryVal} days` : 'N/A'}
              </div>
              <p className="text-[11px] text-indigo-300 font-medium mt-1">Guaranteed turnaround</p>
            </div>
          </div>

          {/* Sort & Filter Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Sort Toggles */}
              <div className="flex items-center space-x-1">
                <span className="text-xs text-slate-400 mr-2 font-medium flex items-center space-x-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>Sort by:</span>
                </span>
                <button
                  onClick={() => setSortBy('best_match')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    sortBy === 'best_match'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Best Match
                </button>
                <button
                  onClick={() => setSortBy('lowest_price')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    sortBy === 'lowest_price'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Lowest Price
                </button>
                <button
                  onClick={() => setSortBy('fastest_delivery')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    sortBy === 'fastest_delivery'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Fastest Delivery
                </button>
              </div>

              {/* Filter toggle button */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center space-x-1.5 transition ${
                    showFilters || filterVerifiedOnly || filterMinTrust > 0
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters {(filterVerifiedOnly || filterMinTrust > 0) && '•'}</span>
                </button>
              </div>
            </div>

            {/* Expanded Filter Panel */}
            {showFilters && (
              <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterVerifiedOnly}
                    onChange={e => setFilterVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-0 bg-slate-800"
                  />
                  <span className="text-slate-300">Verified Providers Only</span>
                </label>

                <div className="space-y-1">
                  <span className="text-slate-400 block">Min Trust Score: {filterMinTrust}/100</span>
                  <input
                    type="range"
                    min={0}
                    max={90}
                    step={10}
                    value={filterMinTrust}
                    onChange={e => setFilterMinTrust(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex justify-end items-center">
                  <button
                    onClick={() => {
                      setFilterVerifiedOnly(false);
                      setFilterMinTrust(0);
                    }}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SIDE-BY-SIDE COMPARISON TABLE MATRIX */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Comparison Matrix</h3>
                <p className="text-xs text-slate-400">Green cells indicate top value in each comparison row</p>
              </div>
              <button
                onClick={handleExport}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
              >
                <span>Export to PDF</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Metric</th>
                    {filteredOffers.map(o => (
                      <th key={o.id} className="py-3 px-4 min-w-[160px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-white font-bold">{o.providerName}</span>
                          {o.id === bestOffer?.id && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                              ★ Best
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {/* Price */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Offered Price</td>
                    {filteredOffers.map(o => {
                      const isBest = o.price === lowestPriceVal;
                      return (
                        <td
                          key={o.id}
                          className={`py-3 px-4 font-bold ${
                            isBest ? 'bg-emerald-500/10 text-emerald-400 font-black' : ''
                          }`}
                        >
                          ₹{o.price.toLocaleString('en-IN')}
                          {isBest && <span className="ml-1 text-[10px]">✓ lowest</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Delivery */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Delivery Timeline</td>
                    {filteredOffers.map(o => {
                      const isBest = o.deliveryDays === fastestDeliveryVal;
                      return (
                        <td
                          key={o.id}
                          className={`py-3 px-4 ${
                            isBest ? 'bg-emerald-500/10 text-emerald-400 font-bold' : ''
                          }`}
                        >
                          {o.deliveryDays} Days
                          {isBest && <span className="ml-1 text-[10px]">✓ fastest</span>}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Relevance */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Requirement Relevance</td>
                    {filteredOffers.map(o => (
                      <td key={o.id} className="py-3 px-4 font-semibold">
                        {o.scoreBreakdown.relevance}%
                      </td>
                    ))}
                  </tr>

                  {/* Experience */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Provider Experience</td>
                    {filteredOffers.map(o => (
                      <td key={o.id} className="py-3 px-4">
                        {o.experienceYears} Years
                      </td>
                    ))}
                  </tr>

                  {/* Rating */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Rating</td>
                    {filteredOffers.map(o => {
                      const isBest = o.providerRating === highestRatingVal;
                      return (
                        <td
                          key={o.id}
                          className={`py-3 px-4 ${
                            isBest ? 'bg-emerald-500/10 text-emerald-400 font-bold' : ''
                          }`}
                        >
                          ★ {o.providerRating}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Trust Score */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Trust Score (0-100)</td>
                    {filteredOffers.map(o => (
                      <td key={o.id} className="py-3 px-4 font-bold text-indigo-400">
                        {o.providerTrustScore}/100
                      </td>
                    ))}
                  </tr>

                  {/* Match Score */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">AI / Match Score</td>
                    {filteredOffers.map(o => (
                      <td key={o.id} className="py-3 px-4">
                        <button
                          onClick={() => currentReq && onOpenScoreModal(o, currentReq)}
                          className="font-black text-sm text-indigo-300 hover:text-indigo-200 underline decoration-indigo-500/50 underline-offset-4"
                        >
                          {o.matchScore}%
                        </button>
                      </td>
                    ))}
                  </tr>

                  {/* Budget Saved */}
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-400">Budget Saved</td>
                    {filteredOffers.map(o => {
                      const diff = (currentReq?.budget || 0) - o.price;
                      return (
                        <td
                          key={o.id}
                          className={`py-3 px-4 font-bold ${
                            diff >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {diff >= 0 ? `+₹${diff.toLocaleString('en-IN')}` : `-₹${Math.abs(diff).toLocaleString('en-IN')}`}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DETAILED OFFER CARDS GRID */}
          <div className="space-y-4">
            <h3 className="font-bold text-white text-base">Evaluated Provider Offers ({filteredOffers.length})</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOffers.map(offer => {
                const isShortlisted = shortlists.includes(offer.id);
                const isBestMatch = offer.id === bestOffer?.id;
                const savings = (currentReq?.budget || 0) - offer.price;
                const isSelected = currentReq?.selectedOfferId === offer.id;

                return (
                  <div
                    key={offer.id}
                    className={`rounded-2xl glass-card-mass border transition-all flex flex-col justify-between overflow-hidden relative ${
                      isSelected
                        ? 'border-emerald-500 shadow-xl shadow-emerald-500/20'
                        : isBestMatch
                        ? 'border-emerald-500/80 shadow-xl shadow-emerald-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top banner if best match or flagged */}
                    {offer.flagged ? (
                      <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-1.5 flex items-center space-x-2 text-[11px] text-amber-300 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Flagged by Fraud Filter: {offer.flagReason}</span>
                      </div>
                    ) : isBestMatch ? (
                      <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-indigo-500/20 border-b border-emerald-500/30 px-4 py-1.5 flex items-center justify-between text-[11px] text-emerald-300 font-extrabold">
                        <span className="flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                          <span>★ TOP VALUE MATCH · 15% SAVINGS</span>
                        </span>
                        <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                          ALGORITHM CHOICE
                        </span>
                      </div>
                    ) : null}

                    <div className="p-5 space-y-4">
                      {/* Provider Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={offer.providerAvatar}
                            alt={offer.providerName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="font-bold text-white text-sm">{offer.providerName}</h4>
                              {offer.providerVerified && (
                                <span title="Admin Verified Provider">
                                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 block truncate max-w-[160px]">
                              {offer.providerTitle}
                            </span>
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="text-right">
                          <button
                            onClick={() => currentReq && onOpenScoreModal(offer, currentReq)}
                            className={`px-2.5 py-1 rounded-xl text-xs font-black transition flex items-center space-x-1 ${
                              isBestMatch
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                            }`}
                            title="Click to view full factor breakdown"
                          >
                            <span>{offer.matchScore}%</span>
                            <span className="text-[10px] font-normal opacity-80">Match</span>
                          </button>
                        </div>
                      </div>

                      {/* Pricing and Turnaround */}
                      <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                          <span className="text-lg font-bold text-white">₹{offer.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase">Delivery</span>
                          <span className="text-sm font-semibold text-slate-200">{offer.deliveryDays} Days</span>
                        </div>
                      </div>

                      {/* Reverse Bidding Revisions History */}
                      {offer.priceHistory.length > 1 && (
                        <div className="text-[10px] text-slate-400 space-y-1">
                          <div className="flex items-center space-x-1 text-emerald-400 font-semibold">
                            <TrendingDown className="w-3 h-3" />
                            <span>Reverse Bid Revisions ({offer.revisionCount}/3):</span>
                          </div>
                          <div className="flex flex-wrap gap-1 font-mono">
                            {offer.priceHistory.map((item, idx) => (
                              <span
                                key={idx}
                                className={`px-1.5 py-0.5 rounded ${
                                  idx === offer.priceHistory.length - 1
                                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                                    : 'bg-slate-800 text-slate-400 line-through'
                                }`}
                              >
                                ₹{item.price.toLocaleString('en-IN')}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Budget Saved Badge */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Budget Comparison:</span>
                        <span
                          className={`font-semibold ${
                            savings >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {savings >= 0
                            ? `You save ₹${savings.toLocaleString('en-IN')} vs budget`
                            : `₹${Math.abs(savings).toLocaleString('en-IN')} over budget`}
                        </span>
                      </div>

                      {/* Trust Score & Rating Pill */}
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                        <div className="flex items-center space-x-1 text-slate-300">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold">{offer.providerRating}</span>
                          <span className="text-slate-400">({offer.experienceYears}y exp)</span>
                        </div>
                        <div className="text-indigo-400 font-semibold text-[11px]">
                          Trust Score: {offer.providerTrustScore}/100
                        </div>
                      </div>

                      {/* Proposal text preview */}
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                        {offer.proposal}
                      </p>

                      {/* Counter offer status if applicable */}
                      {offer.status === 'countered' && offer.counterOffer && (
                        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                          Counter-offer sent for ₹{offer.counterOffer.price.toLocaleString('en-IN')} (Awaiting provider response).
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Toolbar */}
                    <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => toggleShortlist(offer.id)}
                          className={`p-2 rounded-xl text-xs font-semibold transition ${
                            isShortlisted
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title={isShortlisted ? 'Shortlisted' : 'Shortlist Offer'}
                        >
                          <Star className={`w-3.5 h-3.5 ${isShortlisted ? 'fill-amber-400' : ''}`} />
                        </button>

                        <button
                          onClick={() => onOpenChat(offer.providerId)}
                          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition"
                          title="Message Provider"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {/* Smart Negotiate button */}
                        {currentReq?.status === 'open' && (
                          <button
                            onClick={() => currentReq && onOpenNegotiationModal(offer, currentReq)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold transition"
                            title="Propose AI-backed counter-offer"
                          >
                            Counter
                          </button>
                        )}
                      </div>

                      {/* Select Provider CTA */}
                      {isSelected ? (
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center space-x-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => currentReq && selectProvider(currentReq.id, offer.id)}
                          disabled={currentReq?.status === 'matched'}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition shadow-md shadow-indigo-600/20"
                        >
                          Select Provider
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
