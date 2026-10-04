import { Requirement, Offer, ScoreBreakdown, ProviderStats } from '../types';

export function calculateProviderTrustScore(stats: ProviderStats): number {
  // Average rating: 40% (5.0 is 100)
  const ratingScore = Math.min(100, Math.max(0, (stats.avgRating / 5.0) * 100));

  // Completed projects: 25% (20+ projects is 100)
  const completedScore = Math.min(100, Math.max(0, (stats.completedCount / 20) * 100));

  // Response time: 20% (<15 mins = 100, 30 mins = 80, 60 mins = 60, >120 = 40)
  let responseScore = 60;
  if (stats.avgResponseMins <= 15) responseScore = 100;
  else if (stats.avgResponseMins <= 30) responseScore = 85;
  else if (stats.avgResponseMins <= 60) responseScore = 70;
  else if (stats.avgResponseMins <= 120) responseScore = 50;

  // Verified badge: 15%
  const verifiedScore = stats.verified ? 100 : 35;

  const total = ratingScore * 0.40 + completedScore * 0.25 + responseScore * 0.20 + verifiedScore * 0.15;
  return Math.round(total);
}

export function computeOfferMatch(
  requirement: Requirement,
  offerPrice: number,
  deliveryDays: number,
  proposalText: string,
  experienceYears: number,
  providerTrustScore: number
): { matchScore: number; scoreBreakdown: ScoreBreakdown; matchExplanation: string } {
  // 1. Budget Compatibility (30% weight)
  let budgetScore = 70;
  if (requirement.budget > 0) {
    if (offerPrice <= requirement.budget) {
      // Within budget: higher savings gives bonus up to 100
      const savingsRatio = (requirement.budget - offerPrice) / requirement.budget;
      budgetScore = Math.min(100, Math.round(85 + savingsRatio * 40));
    } else {
      // Over budget: penalty
      const overRatio = (offerPrice - requirement.budget) / requirement.budget;
      budgetScore = Math.max(20, Math.round(80 - overRatio * 100));
    }
  }

  // 2. Deadline Compatibility (25% weight)
  let deadlineScore = 70;
  if (requirement.deadlineDays > 0) {
    if (deliveryDays <= requirement.deadlineDays) {
      // Delivers on or before deadline
      const margin = (requirement.deadlineDays - deliveryDays) / requirement.deadlineDays;
      deadlineScore = Math.min(100, Math.round(85 + margin * 30));
    } else {
      const lateRatio = (deliveryDays - requirement.deadlineDays) / requirement.deadlineDays;
      deadlineScore = Math.max(10, Math.round(75 - lateRatio * 80));
    }
  }

  // 3. Requirement Relevance (30% weight)
  // Check skills and proposal keywords
  const requiredSkills = requirement.requiredSkills || [];
  const lowerProposal = proposalText.toLowerCase();
  const lowerDesc = requirement.description.toLowerCase();
  const lowerCat = requirement.category.toLowerCase();

  let matchedSkillsCount = 0;
  requiredSkills.forEach(skill => {
    if (lowerProposal.includes(skill.toLowerCase()) || lowerDesc.includes(skill.toLowerCase())) {
      matchedSkillsCount++;
    }
  });

  const skillMatchRatio = requiredSkills.length > 0 ? (matchedSkillsCount / requiredSkills.length) : 0.8;
  const hasCategoryKeyword = lowerProposal.includes(lowerCat.split(' ')[0]);
  let relevanceScore = Math.round(skillMatchRatio * 85 + (hasCategoryKeyword ? 15 : 5));
  relevanceScore = Math.min(100, Math.max(40, relevanceScore));

  // 4. Provider Experience (10% weight)
  let experienceScore = Math.min(100, Math.max(30, Math.round((experienceYears / 5) * 100)));

  // 5. Provider Trust (5% weight)
  const trustScore = Math.min(100, Math.max(30, providerTrustScore));

  // Final Weighted Match Score
  const totalScore = Math.round(
    budgetScore * 0.30 +
    deadlineScore * 0.25 +
    relevanceScore * 0.30 +
    experienceScore * 0.10 +
    trustScore * 0.05
  );

  const finalMatchScore = Math.min(99, Math.max(40, totalScore));

  // Formulate human/AI explanation
  const priceDiff = requirement.budget - offerPrice;
  const daysDiff = requirement.deadlineDays - deliveryDays;
  
  let explanation = '';
  if (priceDiff > 0 && daysDiff >= 0) {
    explanation = `Saves ₹${priceDiff.toLocaleString('en-IN')} vs budget and delivers ${daysDiff === 0 ? 'exactly on time' : `${daysDiff} days ahead of deadline`}. Strong alignment on ${requiredSkills.slice(0, 2).join(' & ')}.`;
  } else if (priceDiff > 0) {
    explanation = `Under budget by ₹${priceDiff.toLocaleString('en-IN')}, high relevance with ${experienceYears} yrs proven industry track record.`;
  } else if (daysDiff > 0) {
    explanation = `Rapid ${deliveryDays}-day turnaround (${daysDiff} days ahead). Premium proposal with ${trustScore}/100 Trust Score.`;
  } else {
    explanation = `Competitive technical proposal covering core requirements with ${experienceYears} years experience.`;
  }

  return {
    matchScore: finalMatchScore,
    scoreBreakdown: {
      budget: budgetScore,
      deadline: deadlineScore,
      relevance: relevanceScore,
      experience: experienceScore,
      trust: trustScore,
    },
    matchExplanation: explanation,
  };
}
