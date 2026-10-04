/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MarketProvider, useMarket } from './context/MarketContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingView } from './views/LandingView';
import { CustomerView } from './views/CustomerView';
import { ProviderView } from './views/ProviderView';
import { AdminView } from './views/AdminView';
import { ScoreBreakdownModal } from './components/ScoreBreakdownModal';
import { NegotiationModal } from './components/NegotiationModal';
import { ReviewModal } from './components/ReviewModal';
import { ChatDrawer } from './components/ChatDrawer';
import { JudgeDemoGuideModal } from './components/JudgeDemoGuideModal';
import { AuthModal } from './components/AuthModal';
import { WorkingModelGuideModal } from './components/WorkingModelGuideModal';
import { Offer, Requirement } from './types';
import { exportComparisonPdf } from './utils/pdfExport';

const AppContent: React.FC = () => {
  const {
    activeView,
    judgeGuideOpen,
    setJudgeGuideOpen,
    isGuideModalOpen,
    setGuideModalOpen,
    sendCounterOffer,
    requirements,
    offers,
    selectedRequirementId,
  } = useMarket();

  // Modals state
  const [scoreOffer, setScoreOffer] = useState<Offer | null>(null);
  const [scoreReq, setScoreReq] = useState<Requirement | null>(null);

  const [negotiateOffer, setNegotiateOffer] = useState<Offer | null>(null);
  const [negotiateReq, setNegotiateReq] = useState<Requirement | null>(null);

  const [reviewOffer, setReviewOffer] = useState<Offer | null>(null);
  const [reviewReq, setReviewReq] = useState<Requirement | null>(null);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatTargetProviderId, setChatTargetProviderId] = useState<string>('user_provider_b');

  const handleOpenScoreModal = (offer: Offer, req: Requirement) => {
    setScoreOffer(offer);
    setScoreReq(req);
  };

  const handleOpenNegotiationModal = (offer: Offer, req: Requirement) => {
    setNegotiateOffer(offer);
    setNegotiateReq(req);
  };

  const handleOpenReviewModal = (offer: Offer, req: Requirement) => {
    setReviewOffer(offer);
    setReviewReq(req);
  };

  const handleOpenChat = (providerId?: string) => {
    if (providerId) {
      setChatTargetProviderId(providerId);
    }
    setChatOpen(true);
  };

  const handleExportPdfCurrent = () => {
    const curReq = requirements.find(r => r.id === selectedRequirementId) || requirements[0];
    if (!curReq) return;
    const reqOffers = offers.filter(o => o.requirementId === curReq.id);
    const best = reqOffers.reduce<Offer | undefined>((top, c) => {
      if (!top || c.matchScore > top.matchScore) return c;
      return top;
    }, undefined);
    exportComparisonPdf(curReq, reqOffers, best);
  };

  // Pre-load default offer for judge guide quick inspection
  const demoReq = requirements.find(r => r.id === selectedRequirementId) || requirements[0];
  const demoBestOffer = offers.find(o => o.id === 'off_provider_b') || offers[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar
        onOpenChat={() => handleOpenChat()}
        onOpenJudgeGuide={() => setJudgeGuideOpen(true)}
      />

      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingView onOpenJudgeGuide={() => setJudgeGuideOpen(true)} />
        )}
        {activeView === 'customer' && (
          <CustomerView
            onOpenScoreModal={handleOpenScoreModal}
            onOpenNegotiationModal={handleOpenNegotiationModal}
            onOpenReviewModal={handleOpenReviewModal}
            onOpenChat={handleOpenChat}
          />
        )}
        {activeView === 'provider' && (
          <ProviderView onOpenChat={handleOpenChat} />
        )}
        {activeView === 'admin' && <AdminView />}
      </main>

      <Footer />

      {/* Score Breakdown Modal ("Why 96%?") */}
      <ScoreBreakdownModal
        offer={scoreOffer}
        requirement={scoreReq}
        onClose={() => {
          setScoreOffer(null);
          setScoreReq(null);
        }}
      />

      {/* Smart Negotiation Modal */}
      <NegotiationModal
        offer={negotiateOffer}
        requirement={negotiateReq}
        onClose={() => {
          setNegotiateOffer(null);
          setNegotiateReq(null);
        }}
        onSendCounter={(offerId, price) => sendCounterOffer(offerId, price)}
      />

      {/* Review & Rate Modal */}
      <ReviewModal
        offer={reviewOffer}
        requirement={reviewReq}
        onClose={() => {
          setReviewOffer(null);
          setReviewReq(null);
        }}
      />

      {/* In-App Chat Drawer */}
      <ChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        targetProviderId={chatTargetProviderId}
      />

      {/* 3-Minute Judge Evaluation Walkthrough Modal */}
      <JudgeDemoGuideModal
        isOpen={judgeGuideOpen}
        onClose={() => setJudgeGuideOpen(false)}
        onOpenScoreModal={() => {
          if (demoReq && demoBestOffer) {
            handleOpenScoreModal(demoBestOffer, demoReq);
          }
        }}
        onOpenNegotiateModal={() => {
          if (demoReq && demoBestOffer) {
            handleOpenNegotiationModal(demoBestOffer, demoReq);
          }
        }}
        onExportPdf={handleExportPdfCurrent}
      />

      {/* Authentication Modal (Sign In / Register) */}
      <AuthModal />

      {/* Full Working Model vs Demo Mode Explanation Guide */}
      <WorkingModelGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <MarketProvider>
      <AppContent />
    </MarketProvider>
  );
}
