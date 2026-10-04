import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { translations } from '../utils/i18n';
import heroVisual from '../assets/images/hero_marketplace_visual_1791107194693.jpg';
import avatarPriya from '../assets/images/avatar_priya_studio_1791107228022.jpg';
import avatarDevStudio from '../assets/images/avatar_devstudio_founder_1791107245511.jpg';
import avatarApex from '../assets/images/avatar_apex_tech_1791107295155.jpg';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Play,
  Layers,
  Code,
  Palette,
  Video,
  GraduationCap,
  Calendar,
  Smartphone,
  PenTool,
  Clock,
  Award,
  HelpCircle,
  Star,
  Check,
  ChevronRight,
  Lock,
  Flame,
  FileText,
  DollarSign,
  Search,
  MessageSquare,
} from 'lucide-react';

interface LandingViewProps {
  onOpenJudgeGuide: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onOpenJudgeGuide }) => {
  const {
    setActiveView,
    setRole,
    loadDemoMode,
    language,
    setGuideModalOpen,
    isDemoMode,
    toggleDemoMode,
  } = useMarket();

  const t = translations[language];

  // Interactive Live Reverse Bidding Hero Widget state
  const [heroBidC, setHeroBidC] = useState(11000);
  const [heroBidDropped, setHeroBidDropped] = useState(false);

  const handleSimulateHeroDrop = () => {
    if (heroBidDropped) {
      setHeroBidC(11000);
      setHeroBidDropped(false);
    } else {
      setHeroBidC(8200);
      setHeroBidDropped(true);
    }
  };

  const categories = [
    { name: 'Web Development', icon: Code, count: '142 Needs Live', desc: 'React, Next.js, full-stack portals & responsive CMS' },
    { name: 'Mobile App', icon: Smartphone, count: '89 Needs Live', desc: 'Flutter, React Native, iOS & Android prototypes' },
    { name: 'Design & Creative', icon: Palette, count: '115 Needs Live', desc: 'Brand identity, UI/UX systems, vector illustration' },
    { name: 'Video Editing', icon: Video, count: '64 Needs Live', desc: 'Short-form reels, explainers & post-production' },
    { name: 'Tutoring & Education', icon: GraduationCap, count: '78 Needs Live', desc: 'Coding bootcamps, mathematics & exam preparation' },
    { name: 'Event Services', icon: Calendar, count: '45 Needs Live', desc: 'Symposium logistics, sound/stage & registration' },
  ];

  return (
    <div className="relative overflow-hidden space-y-20 pb-28">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-600/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Primary Calls to Action */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs shadow-lg backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-slate-200">Problem Statement 1</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-400 font-semibold">Live Reverse Bidding Marketplace</span>
            </div>

            {/* Mass Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Don’t Search for Offers.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
                  Let Offers Find You.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed pt-2 max-w-2xl">
                Post your custom project requirement with budget and deadline. Qualified providers compete downwards on price with live reverse bidding, while our smart matching engine finds your best value.
              </p>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setRole('customer');
                  setActiveView('customer');
                }}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{t.postRequirement}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setRole('provider', 'user_provider_b');
                  setActiveView('provider');
                }}
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-100 font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer backdrop-blur-md"
              >
                {t.becomeProvider}
              </button>

              <button
                onClick={loadDemoMode}
                className="px-5 py-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-sm flex items-center space-x-2 transition-all duration-200 cursor-pointer"
                title="Load ready-made 3-minute hackathon judge demo"
              >
                <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                <span>{t.tryDemoMode}</span>
              </button>
            </div>

            {/* Judge Evaluation & Guide Links */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
              <button
                onClick={onOpenJudgeGuide}
                className="inline-flex items-center space-x-1.5 text-amber-300 hover:text-amber-200 font-semibold underline underline-offset-4 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>3-Minute Judge Script & Evaluation Guide →</span>
              </button>

              <span className="text-slate-600">|</span>

              <button
                onClick={() => setGuideModalOpen(true)}
                className="inline-flex items-center space-x-1.5 text-indigo-300 hover:text-indigo-200 font-semibold transition cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span>How to Use Full Working Model</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Craft "Live Reverse Bidding" Interactive Hero Showcase */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl p-6 bg-slate-900/80 border border-slate-700/80 shadow-2xl backdrop-blur-xl space-y-4 glow-primary">
              {/* Widget Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Live Reverse Bidding Desk
                  </span>
                </div>
                <span className="text-[11px] font-mono font-semibold text-emerald-400">
                  Offers close in 2d 4h
                </span>
              </div>

              {/* Requirement Preview Card */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-indigo-400 font-bold">Web Development</span>
                  <span className="text-slate-400">Anna University Symposium</span>
                </div>
                <h4 className="font-bold text-white text-sm">
                  College Website with CMS & Student Portal
                </h4>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-slate-400">Buyer Target Budget:</span>
                  <span className="font-black text-white">₹10,000 INR</span>
                </div>
              </div>

              {/* Live Competing Bids Stream */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
                  <span>Provider Proposal</span>
                  <span>Match & Bid</span>
                </div>

                {/* Provider B (Top Match) */}
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={avatarPriya}
                      alt="Priya Web Studio"
                      className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-white text-xs">Priya Web Studio</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="text-[10px] text-emerald-300 font-semibold">
                        ★ Best Match (96%) · 5 Days
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-emerald-400 text-sm block">₹8,500</span>
                    <span className="text-[10px] text-emerald-400/90 font-medium">Saves ₹1,500</span>
                  </div>
                </div>

                {/* Provider C (Live Dropping Bid) */}
                <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/80 flex items-center justify-between transition-all duration-500">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={avatarDevStudio}
                      alt="DevStudio Pro"
                      className="w-8 h-8 rounded-full object-cover border border-slate-600"
                    />
                    <div>
                      <span className="font-bold text-white text-xs block">DevStudio Pro</span>
                      <span className="text-[10px] text-slate-400">
                        {heroBidDropped ? '🔥 Price Dropped Live!' : 'Turnaround: 4 Days'}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-black text-sm block transition-all duration-500 ${
                        heroBidDropped ? 'text-emerald-400 scale-110 font-extrabold' : 'text-slate-200'
                      }`}
                    >
                      ₹{heroBidC.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {heroBidDropped ? 'Was ₹11,000 (Saved ₹1,800)' : 'Over budget by ₹1,000'}
                    </span>
                  </div>
                </div>

                {/* Provider A */}
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={avatarApex}
                      alt="Apex Tech"
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <span className="font-bold text-white text-xs block">Apex Tech</span>
                      <span className="text-[10px] text-slate-400">89% Match · 6 Days</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-200 text-sm block">₹9,000</span>
                    <span className="text-[10px] text-emerald-400">Saves ₹1,000</span>
                  </div>
                </div>
              </div>

              {/* Interactive Simulator Button */}
              <button
                onClick={handleSimulateHeroDrop}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
              >
                <TrendingDown className="w-4 h-4" />
                <span>
                  {heroBidDropped
                    ? 'Reset DevStudio Bid to ₹11,000'
                    : 'Click to Simulate Live Price Drop (₹11,000 ➔ ₹8,200)'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-white">{t.statSaved}</span>
            <p className="text-xs text-slate-400">{t.statSavedSub}</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{t.statMatches}</span>
            <p className="text-xs text-slate-400">{t.statMatchesSub}</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-indigo-400">{t.statProviders}</span>
            <p className="text-xs text-slate-400">{t.statProvidersSub}</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{t.statSpeed}</span>
            <p className="text-xs text-slate-400">{t.statSpeedSub}</p>
          </div>
        </div>
      </section>

      {/* How It Works 4-Step Architecture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">
            The Reverse Marketplace Paradigm
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {t.howItWorks}
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Traditional marketplaces force you to search for providers. ReverseMarket flips the model: users post what they need, providers compete with relevant offers, and smart matching helps you choose.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center font-black text-base">
              1
            </div>
            <h3 className="font-extrabold text-white text-base">{t.step1Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.step1Desc}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all duration-300 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black text-base">
              2
            </div>
            <h3 className="font-extrabold text-white text-base">{t.step2Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.step2Desc}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center font-black text-base">
              3
            </div>
            <h3 className="font-extrabold text-white text-base">{t.step3Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.step3Desc}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 space-y-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black text-base">
              4
            </div>
            <h3 className="font-extrabold text-white text-base">{t.step4Title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{t.step4Desc}</p>
          </div>
        </div>
      </section>

      {/* The Paradigm Shift: Traditional Marketplaces vs REVERSEMARKET */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Problem Statement 1 Breakthrough</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Traditional Marketplaces vs. ReverseMarket
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Why traditional freelance portals fail buyers and why a needs-first reverse auction model wins.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60">
                <th className="py-4 px-6 text-slate-400 font-bold uppercase tracking-wider text-[11px]">Workflow Dimension</th>
                <th className="py-4 px-6 text-rose-400/90 font-bold uppercase tracking-wider text-[11px] bg-rose-950/10">Traditional Portals (Upwork / Fiverr)</th>
                <th className="py-4 px-6 text-emerald-400 font-extrabold uppercase tracking-wider text-[11px] bg-emerald-950/20">REVERSEMARKET (Smart Reverse Bidding)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr className="hover:bg-slate-800/30 transition">
                <td className="py-4 px-6 font-bold text-white">1. Discovery Workflow</td>
                <td className="py-4 px-6 text-slate-400 bg-rose-950/5">
                  Buyer searches through 1,000s of generic profiles, filters endlessly, and chases unresponsive freelancers.
                </td>
                <td className="py-4 px-6 font-semibold text-emerald-300 bg-emerald-950/10">
                  <span className="text-emerald-400 font-bold">Needs-First:</span> Post project requirement in 30 seconds. Verified providers come to you.
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition">
                <td className="py-4 px-6 font-bold text-white">2. Price Dynamics</td>
                <td className="py-4 px-6 text-slate-400 bg-rose-950/5">
                  Fixed or inflating rates; providers bid high expecting painful manual haggling.
                </td>
                <td className="py-4 px-6 font-semibold text-emerald-300 bg-emerald-950/10">
                  <span className="text-emerald-400 font-bold">Live Reverse Bidding:</span> Providers revise bids downward (up to 3 times) to win the project.
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition">
                <td className="py-4 px-6 font-bold text-white">3. Decision Making</td>
                <td className="py-4 px-6 text-slate-400 bg-rose-950/5">
                  Manual spreadsheet comparison; buyers get overwhelmed by conflicting quotes.
                </td>
                <td className="py-4 px-6 font-semibold text-emerald-300 bg-emerald-950/10">
                  <span className="text-emerald-400 font-bold">Multi-Factor Engine:</span> 0-100% weighted match score with clear transparent factor math.
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition">
                <td className="py-4 px-6 font-bold text-white">4. Bot & Spam Protection</td>
                <td className="py-4 px-6 text-slate-400 bg-rose-950/5">
                  Rampant copy-pasted bot spam, fake lowball offers, and unverified accounts.
                </td>
                <td className="py-4 px-6 font-semibold text-emerald-300 bg-emerald-950/10">
                  <span className="text-emerald-400 font-bold">Automated Fraud Filter:</span> Flags &lt;30% lowball pricing, short copy, &amp; unverified bots automatically.
                </td>
              </tr>
              <tr className="hover:bg-slate-800/30 transition">
                <td className="py-4 px-6 font-bold text-white">5. Negotiation Speed</td>
                <td className="py-4 px-6 text-slate-400 bg-rose-950/5">
                  Slow emails back and forth with endless delays and ghosting.
                </td>
                <td className="py-4 px-6 font-semibold text-emerald-300 bg-emerald-950/10">
                  <span className="text-emerald-400 font-bold">Smart Counter-Offer &amp; Chat:</span> AI-guided counter-offer suggestions + direct in-app messaging.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Active Service Categories</h2>
            <p className="text-xs text-slate-400 mt-1">Post any requirement across active digital and campus categories</p>
          </div>
          <button
            onClick={() => {
              setRole('customer');
              setActiveView('customer');
            }}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
          >
            <span>Post in any category →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(c => {
            const Icon = c.icon;
            return (
              <div
                key={c.name}
                onClick={() => {
                  setRole('customer');
                  setActiveView('customer');
                }}
                className="p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer transition-all duration-300 group shadow-md"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">{c.count}</span>
                </div>
                <h4 className="font-extrabold text-slate-100 text-base group-hover:text-white transition">
                  {c.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 15 Extended Innovations Showcase Card */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-2xl space-y-6 glow-primary">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-indigo-400 block">
                15 Extended Winning Innovations Built-In
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Beyond Standard Marketplaces
              </h3>
            </div>
            <button
              onClick={loadDemoMode}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-xl shadow-indigo-600/30 shrink-0 cursor-pointer"
            >
              Launch Live Demonstration
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-slate-300 pt-2">
            <div className="space-y-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <strong className="text-indigo-300 font-bold block text-sm">Must-Add High Impact:</strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Match Score Breakdown bar chart ("Why 96%?"), Budget Saved badge, Sort & Filter bar, Offer Expiry Timer, 1-Click Demo Mode button.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <strong className="text-emerald-300 font-bold block text-sm">Standout Memorables:</strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                1-Line AI Requirement Generator, Smart Negotiation Counter-Offer, 0-100 Provider Trust Score, In-App Shortlist Chat, Live Reverse Bidding.
              </p>
            </div>
            <div className="space-y-2 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
              <strong className="text-amber-300 font-bold block text-sm">Finishing Polish:</strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Dark/Light mode + Tamil/English toggle, Reviews after completion, Rule-based fake/lowball offer detection, Instant PDF export.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
