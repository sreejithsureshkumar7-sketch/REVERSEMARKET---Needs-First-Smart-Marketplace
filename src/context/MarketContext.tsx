import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Language,
  Theme,
  Requirement,
  Offer,
  ChatMessage,
  Review,
  Notification,
  RequirementCategory,
  RequirementPriority,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_REQUIREMENTS,
  INITIAL_OFFERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_CHAT_MESSAGES,
  DEMO_REQUIREMENT_ID,
} from '../data/demoData';
import { computeOfferMatch, calculateProviderTrustScore } from '../utils/matchingEngine';
import { checkForSpamOrLowball } from '../utils/spamDetector';
import confetti from 'canvas-confetti';

interface MarketContextType {
  currentUser: User;
  users: User[];
  requirements: Requirement[];
  offers: Offer[];
  shortlists: string[]; // offer IDs
  notifications: Notification[];
  chatMessages: ChatMessage[];
  reviews: Review[];
  language: Language;
  theme: Theme;
  activeView: 'landing' | 'customer' | 'provider' | 'admin';
  selectedRequirementId: string;
  judgeGuideOpen: boolean;
  isDemoMode: boolean;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authMode: 'login' | 'register';
  isGuideModalOpen: boolean;

  setIsDemoMode: (val: boolean) => void;
  toggleDemoMode: () => void;
  setAuthModalOpen: (val: boolean) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
  setGuideModalOpen: (val: boolean) => void;
  login: (email: string, password: string) => { success: boolean; message?: string };
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    title?: string;
    skills?: string[];
  }) => { success: boolean; message?: string };
  logout: () => void;

  setRole: (role: UserRole, specificUserId?: string) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (t: Theme) => void;
  setActiveView: (view: 'landing' | 'customer' | 'provider' | 'admin') => void;
  setSelectedRequirementId: (id: string) => void;
  setJudgeGuideOpen: (open: boolean) => void;

  postRequirement: (data: {
    title: string;
    category: RequirementCategory;
    description: string;
    budget: number;
    deadlineDays: number;
    requiredSkills: string[];
    priority: RequirementPriority;
    location?: string;
  }) => Requirement;

  submitOffer: (data: {
    requirementId: string;
    price: number;
    deliveryDays: number;
    proposal: string;
    experienceYears: number;
    portfolioUrl?: string;
  }) => { offer: Offer; flagged: boolean; reason?: string };

  reverseBidDropPrice: (offerId: string, newPrice: number) => { success: boolean; message: string };

  sendCounterOffer: (offerId: string, counterPrice: number) => void;
  respondToCounterOffer: (offerId: string, accept: boolean, revisedPrice?: number) => void;

  selectProvider: (requirementId: string, offerId: string) => void;
  toggleShortlist: (offerId: string) => void;
  sendChatMessage: (requirementId: string, providerId: string, text: string) => void;
  submitReview: (requirementId: string, providerId: string, rating: number, comment: string) => void;

  loadDemoMode: () => void;
  resetDemoData: () => void;
  simulateReverseBidDrop: () => void;

  dismissFlag: (offerId: string) => void;
  suspendOffer: (offerId: string) => void;
  verifyProvider: (providerId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

const STORAGE_KEY = 'reversemarket_state_v1';

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from local storage or fallback to defaults
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => users[0]);

  const [requirements, setRequirements] = useState<Requirement[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_requirements`);
    return saved ? JSON.parse(saved) : INITIAL_REQUIREMENTS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [shortlists, setShortlists] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_shortlists`);
    return saved ? JSON.parse(saved) : ['off_provider_b'];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_chats`);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [activeView, setActiveView] = useState<'landing' | 'customer' | 'provider' | 'admin'>('landing');
  const [selectedRequirementId, setSelectedRequirementId] = useState<string>(DEMO_REQUIREMENT_ID);
  const [judgeGuideOpen, setJudgeGuideOpen] = useState<boolean>(false);

  const [isDemoMode, setIsDemoModeState] = useState<boolean>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_demo_mode`);
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isGuideModalOpen, setGuideModalOpen] = useState<boolean>(false);

  const setIsDemoMode = (val: boolean) => {
    setIsDemoModeState(val);
    localStorage.setItem(`${STORAGE_KEY}_demo_mode`, JSON.stringify(val));
    if (!val) {
      const nonDemo = requirements.filter(r => !r.isDemo);
      setSelectedRequirementId(nonDemo[0]?.id || '');
    } else {
      setSelectedRequirementId(DEMO_REQUIREMENT_ID);
    }
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  const login = (email: string, password: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { success: false, message: 'User with this email not found.' };
    }
    if (found.password && found.password !== password) {
      return { success: false, message: 'Incorrect password. (Default is password123)' };
    }
    setCurrentUser(found);
    setIsAuthenticated(true);
    setRole(found.role, found.id);
    return { success: true };
  };

  const register = (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: UserRole;
    title?: string;
    skills?: string[];
  }) => {
    const existing = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      role: data.role,
      avatar:
        data.role === 'customer'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      title: data.title || (data.role === 'customer' ? 'Buyer / Client' : 'Independent Specialist'),
      skills: data.skills || [],
      providerStats:
        data.role === 'provider'
          ? {
              avgRating: 5.0,
              reviewCount: 0,
              completedCount: 0,
              avgResponseMins: 10,
              verified: false,
              trustScore: 70,
            }
          : undefined,
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    setRole(newUser.role, newUser.id);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveView('landing');
  };

  // Sync theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_requirements`, JSON.stringify(requirements));
      localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offers));
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_shortlists`, JSON.stringify(shortlists));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_chats`, JSON.stringify(chatMessages));
    } catch (e) {
      // Local storage quota or security
    }
  }, [requirements, offers, users, shortlists, notifications, chatMessages]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
  };

  const setRole = (role: UserRole, specificUserId?: string) => {
    if (specificUserId) {
      const found = users.find(u => u.id === specificUserId);
      if (found) {
        setCurrentUser(found);
        return;
      }
    }
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
    if (role === 'customer') setActiveView('customer');
    else if (role === 'provider') setActiveView('provider');
    else if (role === 'admin') setActiveView('admin');
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const postRequirement = (data: {
    title: string;
    category: RequirementCategory;
    description: string;
    budget: number;
    deadlineDays: number;
    requiredSkills: string[];
    priority: RequirementPriority;
    location?: string;
  }): Requirement => {
    const expiresHours = data.deadlineDays * 24;
    const expiresAt = new Date(Date.now() + expiresHours * 3600 * 1000).toISOString();

    const newReq: Requirement = {
      id: `req_${Date.now()}`,
      userId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.avatar,
      title: data.title,
      category: data.category,
      description: data.description,
      budget: data.budget,
      deadlineDays: data.deadlineDays,
      requiredSkills: data.requiredSkills,
      priority: data.priority,
      location: data.location || 'Remote',
      status: 'open',
      createdAt: new Date().toISOString(),
      expiresAt,
      isDemo: false,
    };

    setRequirements(prev => [newReq, ...prev]);
    setSelectedRequirementId(newReq.id);

    addNotification({
      userId: currentUser.id,
      role: 'customer',
      title: 'Requirement Published',
      message: `Your requirement "${data.title}" is now open. Providers can submit smart offers with live reverse bidding.`,
      type: 'offer',
    });

    return newReq;
  };

  const submitOffer = (data: {
    requirementId: string;
    price: number;
    deliveryDays: number;
    proposal: string;
    experienceYears: number;
    portfolioUrl?: string;
  }) => {
    const req = requirements.find(r => r.id === data.requirementId);
    if (!req) throw new Error('Requirement not found');

    const providerTrustScore = currentUser.providerStats?.trustScore || 75;
    const matchData = computeOfferMatch(
      req,
      data.price,
      data.deliveryDays,
      data.proposal,
      data.experienceYears,
      providerTrustScore
    );

    // Spam / Lowball check
    const spamCheck = checkForSpamOrLowball(req, data.price, data.proposal);

    const newOffer: Offer = {
      id: `off_${Date.now()}`,
      requirementId: data.requirementId,
      providerId: currentUser.id,
      providerName: currentUser.name,
      providerAvatar: currentUser.avatar,
      providerTitle: currentUser.title || 'Independent Specialist',
      providerVerified: currentUser.providerStats?.verified ?? false,
      providerTrustScore,
      providerRating: currentUser.providerStats?.avgRating ?? 4.5,
      price: data.price,
      deliveryDays: data.deliveryDays,
      proposal: data.proposal,
      experienceYears: data.experienceYears,
      portfolioUrl: data.portfolioUrl,
      matchScore: matchData.matchScore,
      scoreBreakdown: matchData.scoreBreakdown,
      matchExplanation: matchData.matchExplanation,
      priceHistory: [{ price: data.price, timestamp: new Date().toISOString(), note: 'Initial Quote' }],
      revisionCount: 0,
      status: 'pending',
      flagged: spamCheck.flagged,
      flagReason: spamCheck.reason,
      createdAt: new Date().toISOString(),
    };

    setOffers(prev => [newOffer, ...prev]);

    // Update requirement lowestBid
    setRequirements(prev =>
      prev.map(r => {
        if (r.id === data.requirementId) {
          const currentLowest = r.lowestBid ? Math.min(r.lowestBid, data.price) : data.price;
          return { ...r, lowestBid: currentLowest };
        }
        return r;
      })
    );

    // Notify Customer
    addNotification({
      userId: req.userId,
      role: 'customer',
      title: 'New Offer Received',
      message: `${currentUser.name} offered ₹${data.price.toLocaleString('en-IN')} with ${matchData.matchScore}% Match Score.`,
      type: 'offer',
    });

    if (spamCheck.flagged) {
      addNotification({
        userId: 'user_admin',
        role: 'admin',
        title: '⚠️ Offer Flagged for Review',
        message: `${currentUser.name}'s offer on "${req.title}" was flagged: ${spamCheck.reason}`,
        type: 'alert',
      });
    }

    return { offer: newOffer, flagged: spamCheck.flagged, reason: spamCheck.reason };
  };

  const reverseBidDropPrice = (offerId: string, newPrice: number) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return { success: false, message: 'Offer not found' };

    if (newPrice >= offer.price) {
      return { success: false, message: 'In Reverse Bidding, new bid must be strictly lower than your current bid.' };
    }

    if (offer.revisionCount >= 3) {
      return { success: false, message: 'Maximum 3 reverse bidding price revisions reached for this requirement.' };
    }

    const req = requirements.find(r => r.id === offer.requirementId);
    if (!req) return { success: false, message: 'Requirement not found' };

    const updatedMatch = computeOfferMatch(
      req,
      newPrice,
      offer.deliveryDays,
      offer.proposal,
      offer.experienceYears,
      offer.providerTrustScore
    );

    const updatedPriceHistory = [
      ...offer.priceHistory,
      {
        price: newPrice,
        timestamp: new Date().toISOString(),
        note: `Price dropped to ₹${newPrice.toLocaleString('en-IN')}`,
      },
    ];

    setOffers(prev =>
      prev.map(o => {
        if (o.id === offerId) {
          return {
            ...o,
            price: newPrice,
            matchScore: updatedMatch.matchScore,
            scoreBreakdown: updatedMatch.scoreBreakdown,
            matchExplanation: updatedMatch.matchExplanation,
            priceHistory: updatedPriceHistory,
            revisionCount: o.revisionCount + 1,
          };
        }
        return o;
      })
    );

    // Update requirement lowest bid
    setRequirements(prev =>
      prev.map(r => {
        if (r.id === offer.requirementId) {
          const currentLowest = r.lowestBid ? Math.min(r.lowestBid, newPrice) : newPrice;
          return { ...r, lowestBid: currentLowest };
        }
        return r;
      })
    );

    // Notify customer
    addNotification({
      userId: req.userId,
      role: 'customer',
      title: '📉 Reverse Bid Price Drop!',
      message: `${offer.providerName} lowered their bid from ₹${offer.price.toLocaleString('en-IN')} to ₹${newPrice.toLocaleString('en-IN')} (saves ₹${(req.budget - newPrice).toLocaleString('en-IN')} vs your budget).`,
      type: 'price_drop',
    });

    return { success: true, message: `Price revised successfully to ₹${newPrice.toLocaleString('en-IN')}!` };
  };

  const sendCounterOffer = (offerId: string, counterPrice: number) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    setOffers(prev =>
      prev.map(o => {
        if (o.id === offerId) {
          return {
            ...o,
            status: 'countered',
            counterOffer: {
              price: counterPrice,
              by: 'customer',
              at: new Date().toISOString(),
              note: `Customer proposed ₹${counterPrice.toLocaleString('en-IN')}`,
            },
          };
        }
        return o;
      })
    );

    addNotification({
      userId: offer.providerId,
      role: 'provider',
      title: '🤝 Counter-Offer Received',
      message: `The customer proposed a counter-offer of ₹${counterPrice.toLocaleString('en-IN')} for your bid.`,
      type: 'counter',
    });
  };

  const respondToCounterOffer = (offerId: string, accept: boolean, revisedPrice?: number) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    const req = requirements.find(r => r.id === offer.requirementId);
    if (!req) return;

    if (accept) {
      const finalPrice = offer.counterOffer?.price || offer.price;
      const budgetSaved = Math.max(0, req.budget - finalPrice);

      const updatedMatch = computeOfferMatch(
        req,
        finalPrice,
        offer.deliveryDays,
        offer.proposal,
        offer.experienceYears,
        offer.providerTrustScore
      );

      setOffers(prev =>
        prev.map(o => {
          if (o.id === offerId) {
            return {
              ...o,
              price: finalPrice,
              status: 'accepted',
              matchScore: updatedMatch.matchScore,
              scoreBreakdown: updatedMatch.scoreBreakdown,
              priceHistory: [
                ...o.priceHistory,
                {
                  price: finalPrice,
                  timestamp: new Date().toISOString(),
                  note: `Counter-offer accepted at ₹${finalPrice.toLocaleString('en-IN')}`,
                },
              ],
            };
          }
          return o;
        })
      );

      // Auto-update requirement
      setRequirements(prev =>
        prev.map(r => {
          if (r.id === req.id) {
            return {
              ...r,
              status: 'matched',
              selectedOfferId: offer.id,
              selectedProviderId: offer.providerId,
              finalPrice,
              budgetSaved,
            };
          }
          return r;
        })
      );

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}

      addNotification({
        userId: req.userId,
        role: 'customer',
        title: '🎉 Counter-Offer Accepted!',
        message: `${offer.providerName} accepted your counter-offer at ₹${finalPrice.toLocaleString('en-IN')}. Match finalized!`,
        type: 'matched',
      });
    } else {
      setOffers(prev =>
        prev.map(o => {
          if (o.id === offerId) {
            return {
              ...o,
              status: 'rejected',
            };
          }
          return o;
        })
      );

      addNotification({
        userId: req.userId,
        role: 'customer',
        title: 'Counter-Offer Declined',
        message: `${offer.providerName} was unable to accept the counter-offer at this time.`,
        type: 'counter',
      });
    }
  };

  const selectProvider = (requirementId: string, offerId: string) => {
    const req = requirements.find(r => r.id === requirementId);
    const offer = offers.find(o => o.id === offerId);
    if (!req || !offer) return;

    const budgetSaved = Math.max(0, req.budget - offer.price);

    setRequirements(prev =>
      prev.map(r => {
        if (r.id === requirementId) {
          return {
            ...r,
            status: 'matched',
            selectedOfferId: offer.id,
            selectedProviderId: offer.providerId,
            finalPrice: offer.price,
            budgetSaved,
          };
        }
        return r;
      })
    );

    setOffers(prev =>
      prev.map(o => {
        if (o.requirementId === requirementId) {
          return {
            ...o,
            status: o.id === offerId ? 'accepted' : 'rejected',
          };
        }
        return o;
      })
    );

    // Confetti celebration
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (e) {}

    addNotification({
      userId: offer.providerId,
      role: 'provider',
      title: '🏆 Contract Awarded!',
      message: `Congratulations! ${req.customerName} selected your proposal for "${req.title}".`,
      type: 'matched',
    });

    addNotification({
      userId: req.userId,
      role: 'customer',
      title: 'Provider Selected & Matched',
      message: `You selected ${offer.providerName} for ₹${offer.price.toLocaleString('en-IN')} (Saved ₹${budgetSaved.toLocaleString('en-IN')} vs budget).`,
      type: 'matched',
    });
  };

  const toggleShortlist = (offerId: string) => {
    setShortlists(prev =>
      prev.includes(offerId) ? prev.filter(id => id !== offerId) : [...prev, offerId]
    );
  };

  const sendChatMessage = (requirementId: string, providerId: string, text: string) => {
    if (!text.trim()) return;

    const isCustomer = currentUser.role === 'customer';
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      requirementId,
      providerId,
      customerId: isCustomer ? currentUser.id : 'user_customer_1',
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: isCustomer ? 'customer' : 'provider',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, newMsg]);

    // Simulated responsive reply if user is customer chatting with Priya
    if (isCustomer && providerId === 'user_provider_b') {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: `msg_${Date.now() + 1}`,
          requirementId,
          providerId,
          customerId: currentUser.id,
          senderId: 'user_provider_b',
          senderName: 'Priya Web Studio',
          senderRole: 'provider',
          text: 'Thanks for reaching out! We can start immediately upon approval and share a staging URL on Day 2.',
          timestamp: new Date().toISOString(),
        };
        setChatMessages(curr => [...curr, autoReply]);
      }, 1200);
    }
  };

  const submitReview = (requirementId: string, providerId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev_${Date.now()}`,
      requirementId,
      providerId,
      userId: currentUser.id,
      userName: currentUser.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    setReviews(prev => [newReview, ...prev]);

    // Mark requirement as reviewed and completed
    setRequirements(prev =>
      prev.map(r => (r.id === requirementId ? { ...r, status: 'completed', reviewed: true } : r))
    );

    // Update provider's stats and trust score immediately
    setUsers(prev =>
      prev.map(u => {
        if (u.id === providerId && u.providerStats) {
          const newReviewCount = u.providerStats.reviewCount + 1;
          const newAvgRating = Number(
            (
              (u.providerStats.avgRating * u.providerStats.reviewCount + rating) /
              newReviewCount
            ).toFixed(1)
          );
          const newCompletedCount = u.providerStats.completedCount + 1;

          const updatedStats = {
            ...u.providerStats,
            avgRating: newAvgRating,
            reviewCount: newReviewCount,
            completedCount: newCompletedCount,
          };
          const newTrustScore = calculateProviderTrustScore(updatedStats);

          return {
            ...u,
            providerStats: {
              ...updatedStats,
              trustScore: newTrustScore,
            },
          };
        }
        return u;
      })
    );

    addNotification({
      userId: providerId,
      role: 'provider',
      title: '🌟 New Review & Rating Received',
      message: `${currentUser.name} rated your work ${rating}/5: "${comment.slice(0, 45)}..."`,
      type: 'matched',
    });
  };

  const loadDemoMode = () => {
    setRequirements(INITIAL_REQUIREMENTS);
    setOffers(INITIAL_OFFERS);
    setShortlists(['off_provider_b']);
    setSelectedRequirementId(DEMO_REQUIREMENT_ID);
    setRole('customer', 'user_customer_1');
    setActiveView('customer');
    setJudgeGuideOpen(true);
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_requirements`);
    localStorage.removeItem(`${STORAGE_KEY}_offers`);
    localStorage.removeItem(`${STORAGE_KEY}_users`);
    localStorage.removeItem(`${STORAGE_KEY}_shortlists`);
    localStorage.removeItem(`${STORAGE_KEY}_notifications`);
    localStorage.removeItem(`${STORAGE_KEY}_chats`);
    setRequirements(INITIAL_REQUIREMENTS);
    setOffers(INITIAL_OFFERS);
    setUsers(INITIAL_USERS);
    setShortlists(['off_provider_b']);
    setNotifications(INITIAL_NOTIFICATIONS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setSelectedRequirementId(DEMO_REQUIREMENT_ID);
    setRole('customer', 'user_customer_1');
  };

  const simulateReverseBidDrop = () => {
    // Provider C drops price from 11000 down to 8200
    const devStudioOffer = offers.find(o => o.providerId === 'user_provider_c' && o.requirementId === selectedRequirementId);
    if (!devStudioOffer) return;

    reverseBidDropPrice(devStudioOffer.id, 8200);
  };

  const dismissFlag = (offerId: string) => {
    setOffers(prev => prev.map(o => (o.id === offerId ? { ...o, flagged: false } : o)));
  };

  const suspendOffer = (offerId: string) => {
    setOffers(prev => prev.map(o => (o.id === offerId ? { ...o, status: 'rejected' } : o)));
  };

  const verifyProvider = (providerId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === providerId && u.providerStats) {
          const updated = { ...u.providerStats, verified: true };
          return {
            ...u,
            providerStats: {
              ...updated,
              trustScore: calculateProviderTrustScore(updated),
            },
          };
        }
        return u;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const visibleRequirements = isDemoMode
    ? requirements
    : requirements.filter(r => !r.isDemo);

  const visibleOffers = isDemoMode
    ? offers
    : offers.filter(o => {
        const req = requirements.find(r => r.id === o.requirementId);
        return req ? !req.isDemo : false;
      });

  return (
    <MarketContext.Provider
      value={{
        currentUser,
        users,
        requirements: visibleRequirements,
        offers: visibleOffers,
        shortlists,
        notifications,
        chatMessages,
        reviews,
        language,
        theme,
        activeView,
        selectedRequirementId,
        judgeGuideOpen,
        isDemoMode,
        isAuthenticated,
        isAuthModalOpen,
        authMode,
        isGuideModalOpen,
        setIsDemoMode,
        toggleDemoMode,
        setAuthModalOpen,
        setAuthMode,
        setGuideModalOpen,
        login,
        register,
        logout,
        setRole,
        setLanguage,
        setTheme,
        setActiveView,
        setSelectedRequirementId,
        setJudgeGuideOpen,
        postRequirement,
        submitOffer,
        reverseBidDropPrice,
        sendCounterOffer,
        respondToCounterOffer,
        selectProvider,
        toggleShortlist,
        sendChatMessage,
        submitReview,
        loadDemoMode,
        resetDemoData,
        simulateReverseBidDrop,
        dismissFlag,
        suspendOffer,
        verifyProvider,
        markNotificationAsRead,
        markAllNotificationsRead,
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  const context = useContext(MarketContext);
  if (!context) throw new Error('useMarket must be used within a MarketProvider');
  return context;
};
