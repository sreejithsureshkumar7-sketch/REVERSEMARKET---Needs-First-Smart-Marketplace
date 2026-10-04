export type UserRole = 'customer' | 'provider' | 'admin';
export type Language = 'en' | 'ta';
export type Theme = 'dark' | 'light';

export interface ProviderStats {
  avgRating: number;       // e.g. 4.8
  reviewCount: number;     // e.g. 18
  completedCount: number;  // e.g. 24
  avgResponseMins: number; // e.g. 15
  verified: boolean;
  trustScore: number;      // 0-100
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  title?: string;
  skills?: string[];
  providerStats?: ProviderStats;
}

export type RequirementCategory =
  | 'Web Development'
  | 'Design & Creative'
  | 'Video Editing'
  | 'Tutoring & Education'
  | 'Event Services'
  | 'Mobile App'
  | 'Content & Writing'
  | 'Other';

export type RequirementPriority = 'Low' | 'Medium' | 'High';

export type RequirementStatus = 'open' | 'reviewing' | 'matched' | 'completed' | 'cancelled';

export interface Requirement {
  id: string;
  userId: string;
  customerName: string;
  customerAvatar?: string;
  title: string;
  category: RequirementCategory;
  description: string;
  budget: number; // INR
  deadlineDays: number;
  requiredSkills: string[];
  priority: RequirementPriority;
  location?: string;
  status: RequirementStatus;
  createdAt: string;
  expiresAt: string; // ISO string
  lowestBid?: number;
  selectedOfferId?: string;
  selectedProviderId?: string;
  finalPrice?: number;
  budgetSaved?: number;
  isDemo?: boolean;
  reviewed?: boolean;
}

export type OfferStatus = 'pending' | 'countered' | 'accepted' | 'rejected';

export interface ScoreBreakdown {
  budget: number;      // 0 - 100
  deadline: number;    // 0 - 100
  relevance: number;   // 0 - 100
  experience: number;  // 0 - 100
  trust: number;       // 0 - 100
}

export interface PriceHistoryItem {
  price: number;
  timestamp: string;
  note?: string;
}

export interface CounterOffer {
  price: number;
  by: 'customer' | 'provider';
  at: string;
  note?: string;
}

export interface Offer {
  id: string;
  requirementId: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerTitle: string;
  providerVerified: boolean;
  providerTrustScore: number;
  providerRating: number;
  price: number; // Current bid price (INR)
  deliveryDays: number;
  proposal: string;
  experienceYears: number;
  portfolioUrl?: string;
  matchScore: number; // 0 - 100
  scoreBreakdown: ScoreBreakdown;
  matchExplanation: string;
  priceHistory: PriceHistoryItem[];
  revisionCount: number; // Max 3
  status: OfferStatus;
  counterOffer?: CounterOffer;
  flagged: boolean;
  flagReason?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  requirementId: string;
  providerId: string;
  customerId: string;
  senderId: string;
  senderName: string;
  senderRole: 'customer' | 'provider';
  text: string;
  timestamp: string;
}

export interface Review {
  id: string;
  requirementId: string;
  providerId: string;
  userId: string;
  userName: string;
  rating: number; // 1 - 5
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  role: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'offer' | 'price_drop' | 'counter' | 'chat' | 'matched' | 'alert';
}
