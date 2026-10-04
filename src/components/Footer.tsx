import React from 'react';
import { useMarket } from '../context/MarketContext';
import { translations } from '../utils/i18n';
import { Layers, Github, ExternalLink, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language } = useMarket();
  const t = translations[language];

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">{t.brandName}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              Extended Edition
            </span>
          </div>

          <div className="text-center md:text-right text-[11px] text-slate-400">
            <p className="font-semibold text-slate-300">
              Hackathon Problem Statement: PS 1 — REVERSEMARKET
            </p>
            <p className="mt-0.5">
              Needs-First Smart Marketplace with Multi-Factor Compatibility & Live Reverse Bidding
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center text-slate-300 text-xs leading-relaxed italic">
          “Traditional marketplaces make users search for providers. ReverseMarket reverses the process: users post what they need, providers compete with relevant offers, and the platform helps the user choose the best match.”
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
          <div>
            Built with React, Vite, Tailwind CSS, Google Gemini 2.5 Flash, and jsPDF.
          </div>
          <div className="flex items-center space-x-4">
            <span>Client State Persisted Locally</span>
            <span>·</span>
            <span>PWA & Offline Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
