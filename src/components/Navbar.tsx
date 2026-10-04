import React, { useState } from 'react';
import { useMarket } from '../context/MarketContext';
import { translations } from '../utils/i18n';
import { UserRole } from '../types';
import {
  Sparkles,
  Bell,
  Sun,
  Moon,
  Languages,
  RotateCcw,
  Play,
  MessageSquare,
  Shield,
  Layers,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  TrendingDown,
  HelpCircle,
  LogIn,
  LogOut,
  UserPlus,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface NavbarProps {
  onOpenChat: () => void;
  onOpenJudgeGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenChat, onOpenJudgeGuide }) => {
  const {
    currentUser,
    users,
    setRole,
    activeView,
    setActiveView,
    language,
    setLanguage,
    theme,
    setTheme,
    notifications,
    markAllNotificationsRead,
    markNotificationAsRead,
    loadDemoMode,
    resetDemoData,
    isDemoMode,
    toggleDemoMode,
    isAuthenticated,
    setAuthModalOpen,
    setAuthMode,
    setGuideModalOpen,
    logout,
  } = useMarket();

  const t = translations[language];
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleColors = {
    customer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    provider: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
      {/* Live Activity Ticker Ribbon */}
      <div className="w-full bg-slate-900/90 border-b border-white/5 py-1 px-4 overflow-hidden text-[11px] text-slate-300 flex items-center justify-between">
        <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold text-[10px] tracking-wider uppercase text-emerald-400 font-mono">
            REVERSE TICKER
          </span>
        </div>
        <div className="overflow-hidden flex-1 relative h-5 flex items-center ml-3">
          <div className="animate-ticker flex items-center space-x-8 text-[11px] font-mono whitespace-nowrap">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold">REQ-01:</span>
              <span>College Website (₹10,000 Budget)</span>
              <span className="text-slate-500">➔</span>
              <span className="text-emerald-300 font-bold">Priya Web Studio bid ₹8,500</span>
              <span className="text-xs text-emerald-400">(Saved ₹1,500 · 96% Match)</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="text-indigo-400 font-bold">REVERSE BID:</span>
              <span>DevStudio Pro ready to drop bid from ₹11,000 to ₹8,200</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="text-amber-400 font-bold">INTEGRITY:</span>
              <span>AI Fraud Guard auto-flagged 1 suspicious lowball bot proposal</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="text-emerald-400 font-bold">MATCH ENGINE:</span>
              <span>Multi-Factor Compatibility Formula active (Budget 30% · Deadline 25% · Relevance 30%)</span>
            </span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 shrink-0 pl-3 text-[10px] text-slate-400 font-mono">
          <span>HACKATHON PS-1</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setActiveView('landing')}
            className="flex items-center space-x-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-base tracking-tight text-white group-hover:text-indigo-300 transition">
                  {t.brandName}
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 text-indigo-300 border border-indigo-500/30">
                  SMART
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 ml-3 pl-3 border-l border-slate-800/80">
            <button
              onClick={() => setActiveView('customer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeView === 'customer'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{t.navCustomer}</span>
            </button>
            <button
              onClick={() => setActiveView('provider')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeView === 'provider'
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{t.navProvider}</span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeView === 'admin'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{t.navAdmin}</span>
            </button>
          </nav>
        </div>

        {/* Right Tools & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Demo Mode ON / OFF Switch */}
          <button
            onClick={toggleDemoMode}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm cursor-pointer ${
              isDemoMode
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                : 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/25'
            }`}
            title={
              isDemoMode
                ? 'Demo Mode is ON (showing pre-filled scenario). Click to toggle to Full Working Model'
                : 'Full Working Model is ON (real projects). Click to toggle Demo Mode'
            }
          >
            {isDemoMode ? (
              <ToggleRight className="w-4 h-4 text-amber-400" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-emerald-400" />
            )}
            <span className="font-mono">{isDemoMode ? 'Demo: ON' : 'Model: LIVE'}</span>
          </button>

          {/* How to Use Guide Button */}
          <button
            onClick={() => setGuideModalOpen(true)}
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-slate-200 text-xs font-bold transition cursor-pointer"
            title="How to use Full Working Model & Demo Mode"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>How to Use</span>
          </button>

          {/* 3-Min Judge Script Guide */}
          <button
            onClick={onOpenJudgeGuide}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/50 text-amber-300 text-xs font-extrabold transition shadow-sm shadow-amber-500/10 cursor-pointer"
            title="Open 3-Minute Hackathon Evaluation Checklist"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30" />
            <span className="hidden sm:inline">🏆 Judge Showcase</span>
            <span className="sm:hidden">Judges</span>
          </button>

          {/* Language Switch */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 text-xs font-medium flex items-center space-x-1 transition"
            title="Switch Language (English / தமிழ்)"
          >
            <Languages className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">{language === 'en' ? 'தமிழ்' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition"
            title="Toggle Dark / Light Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          {/* In-app Chat Button */}
          <button
            onClick={onOpenChat}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition relative"
            title="Direct Chat with Shortlisted Providers"
          >
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden text-slate-100">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-800/50">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xs text-white">{t.notifications}</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 transition"
                    >
                      {t.markAllRead}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      {t.noNotifications}
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`p-3.5 text-xs cursor-pointer hover:bg-slate-800/60 transition ${
                          !notif.read ? 'bg-indigo-950/20' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-2.5">
                          {notif.type === 'price_drop' ? (
                            <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : notif.type === 'alert' ? (
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-slate-200">{notif.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-600"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-white block leading-none">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider capitalize">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 overflow-hidden text-slate-100 p-2 space-y-1">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Current Persona
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser.title || currentUser.email}</p>
                </div>

                <div className="pt-1">
                  <p className="px-3 py-1 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Switch Test Persona
                  </p>
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setRole(u.role, u.id);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition ${
                        currentUser.id === u.id
                          ? 'bg-slate-800 text-white font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <div>
                          <span>{u.name}</span>
                          <span className="block text-[10px] text-slate-400 capitalize">{u.role}</span>
                        </div>
                      </div>
                      {currentUser.id === u.id && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] text-indigo-300 hover:text-white hover:bg-indigo-600/20 transition"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Switch / Sign In with Credentials</span>
                  </button>

                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] text-emerald-300 hover:text-white hover:bg-emerald-600/20 transition"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create New Account</span>
                  </button>

                  <button
                    onClick={() => {
                      resetDemoData();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t.resetDemo}</span>
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[11px] text-rose-400 hover:bg-rose-500/15 transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
