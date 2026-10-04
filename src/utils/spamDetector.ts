import { Requirement, Offer } from '../types';

export function checkForSpamOrLowball(
  requirement: Requirement,
  price: number,
  proposal: string,
  providerRecentOffersCount: number = 0
): { flagged: boolean; reason?: string } {
  // 1. Price below 30% of the requirement budget (unrealistic lowball)
  if (requirement.budget > 0 && price < requirement.budget * 0.30) {
    return {
      flagged: true,
      reason: `Unrealistically low bid (₹${price.toLocaleString('en-IN')} is under 30% of ₹${requirement.budget.toLocaleString('en-IN')} budget).`,
    };
  }

  // 2. Proposal text under 30 characters
  const trimmed = proposal.trim();
  if (trimmed.length < 30) {
    return {
      flagged: true,
      reason: 'Proposal description is too brief (under 30 characters) to verify scope understanding.',
    };
  }

  // 3. Repeated template / generic text check
  const genericShortKeywords = ['i can do this', 'contact me', 'call me', 'hire me pls', 'lowest price guarantee'];
  if (genericShortKeywords.some(kw => trimmed.toLowerCase() === kw)) {
    return {
      flagged: true,
      reason: 'Proposal appears to be a generic automated placeholder template.',
    };
  }

  // 4. Rate-limit / rapid fire spam submissions (>5 within short window)
  if (providerRecentOffersCount >= 5) {
    return {
      flagged: true,
      reason: 'Excessive high-frequency offer submissions detected for this provider account.',
    };
  }

  return { flagged: false };
}
