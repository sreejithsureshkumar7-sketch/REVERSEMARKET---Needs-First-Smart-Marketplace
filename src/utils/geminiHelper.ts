import { GoogleGenAI } from '@google/genai';
import { RequirementCategory, RequirementPriority } from '../types';

export interface GeneratedRequirementData {
  title: string;
  category: RequirementCategory;
  description: string;
  budget: number;
  deadlineDays: number;
  requiredSkills: string[];
  priority: RequirementPriority;
}

export async function parseOneLineRequirement(
  input: string
): Promise<GeneratedRequirementData> {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Input is empty');
  }

  // Attempt to use Gemini API if available in environment
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).__GEMINI_API_KEY__;

  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze this user request for a project requirement: "${trimmed}".
Return a clean JSON object with this exact structure:
{
  "title": "Concise professional title (3-6 words)",
  "category": "One of: Web Development, Design & Creative, Video Editing, Tutoring & Education, Event Services, Mobile App, Content & Writing, Other",
  "description": "2-3 sentences specifying clear project deliverables and scope",
  "budget": number (integer in INR rupees, e.g. 10000 for 10k or 10000),
  "deadlineDays": number (integer days, e.g. 7 for 1 week),
  "requiredSkills": ["Skill1", "Skill2", "Skill3"],
  "priority": "Low" or "Medium" or "High"
}
Output valid JSON only. Do not wrap in markdown or backticks.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const responseText = response.text?.trim() || '';
      const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const validCategories: RequirementCategory[] = [
        'Web Development',
        'Design & Creative',
        'Video Editing',
        'Tutoring & Education',
        'Event Services',
        'Mobile App',
        'Content & Writing',
        'Other',
      ];

      const category = validCategories.includes(parsed.category) ? parsed.category : 'Web Development';
      const priority = ['Low', 'Medium', 'High'].includes(parsed.priority) ? parsed.priority : 'Medium';

      return {
        title: parsed.title || 'Project Requirement',
        category,
        description: parsed.description || `Deliverable based on requirement: ${trimmed}`,
        budget: Number(parsed.budget) || 10000,
        deadlineDays: Number(parsed.deadlineDays) || 7,
        requiredSkills: Array.isArray(parsed.requiredSkills) && parsed.requiredSkills.length > 0 ? parsed.requiredSkills : ['Technical Expertise', 'Communication'],
        priority,
      };
    } catch (err) {
      console.warn('Gemini API call failed or timed out, falling back to instant heuristic NLP parser:', err);
      // Fall through to deterministic offline fallback
    }
  }

  // Robust Offline / Deterministic Heuristic Regex Parser
  return parseOfflineHeuristic(trimmed);
}

export function parseOfflineHeuristic(input: string): GeneratedRequirementData {
  const lower = input.toLowerCase();

  // 1. Budget extraction (₹, Rs, k, numbers)
  let budget = 10000;
  // Match patterns like "10k", "10,000", "₹12000", "rs 8500", "15000"
  const kMatch = lower.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  const rsMatch = lower.match(/(?:₹|rs\.?|inr)\s*(\d+(?:,\d+)*(?:\.\d+)?)/i);
  const plainNumMatch = lower.match(/\b(\d{4,7})\b/);

  if (kMatch) {
    budget = Math.round(parseFloat(kMatch[1]) * 1000);
  } else if (rsMatch) {
    budget = parseInt(rsMatch[1].replace(/,/g, ''), 10);
  } else if (plainNumMatch) {
    budget = parseInt(plainNumMatch[1], 10);
  }

  // 2. Deadline extraction (days, weeks, months)
  let deadlineDays = 7;
  const weekMatch = lower.match(/(\d+)\s*(?:week|wk)s?/i);
  const dayMatch = lower.match(/(\d+)\s*days?/i);
  const monthMatch = lower.match(/(\d+)\s*(?:month|mo)s?/i);

  if (weekMatch) {
    deadlineDays = parseInt(weekMatch[1], 10) * 7;
  } else if (dayMatch) {
    deadlineDays = parseInt(dayMatch[1], 10);
  } else if (monthMatch) {
    deadlineDays = parseInt(monthMatch[1], 10) * 30;
  } else if (lower.includes('urgent') || lower.includes('asap')) {
    deadlineDays = 3;
  }

  // 3. Category & Skills detection
  let category: RequirementCategory = 'Web Development';
  let skills: string[] = ['React', 'Responsive UI', 'Frontend'];
  let title = 'Custom Project Development';

  if (lower.includes('website') || lower.includes('web') || lower.includes('frontend') || lower.includes('fullstack') || lower.includes('portal')) {
    category = 'Web Development';
    skills = ['React', 'Responsive UI', 'Admin Panel', 'Tailwind CSS'];
    title = lower.includes('college') ? 'College Website Portal' : 'Modern Responsive Website';
  } else if (lower.includes('app') || lower.includes('flutter') || lower.includes('android') || lower.includes('ios') || lower.includes('mobile')) {
    category = 'Mobile App';
    skills = ['Flutter / React Native', 'Mobile UI', 'API Integration', 'Push Notifications'];
    title = 'Mobile Application Development';
  } else if (lower.includes('logo') || lower.includes('design') || lower.includes('brand') || lower.includes('ui/ux') || lower.includes('figma')) {
    category = 'Design & Creative';
    skills = ['Figma', 'UI/UX Design', 'Brand Identity', 'Vector Graphics'];
    title = 'Brand Identity & Visual Design';
  } else if (lower.includes('video') || lower.includes('edit') || lower.includes('reels') || lower.includes('youtube') || lower.includes('animation')) {
    category = 'Video Editing';
    skills = ['Premiere Pro', 'Motion Graphics', 'Color Grading', 'Audio Sync'];
    title = 'Professional Video Production & Editing';
  } else if (lower.includes('tutor') || lower.includes('math') || lower.includes('physics') || lower.includes('teach') || lower.includes('class')) {
    category = 'Tutoring & Education';
    skills = ['Curriculum Planning', 'Concept Clarification', 'Exam Prep', 'Interactive Sessions'];
    title = 'Specialized Academic Tutoring';
  } else if (lower.includes('event') || lower.includes('wedding') || lower.includes('catering') || lower.includes('party') || lower.includes('stage')) {
    category = 'Event Services';
    skills = ['Event Coordination', 'Vendor Management', 'Logistics', 'Decor'];
    title = 'Complete Event Management & Coordination';
  } else if (lower.includes('content') || lower.includes('write') || lower.includes('seo') || lower.includes('blog') || lower.includes('copy')) {
    category = 'Content & Writing';
    skills = ['SEO Copywriting', 'Editorial Research', 'Tone of Voice', 'Proofreading'];
    title = 'High-Impact Content Writing & Copy';
  }

  // Capitalize title cleanly if input had specific subject
  if (lower.includes('college website')) {
    title = 'College Website with CMS & Portal';
  }

  const priority: RequirementPriority = deadlineDays <= 4 ? 'High' : deadlineDays <= 10 ? 'Medium' : 'Low';

  const description = `Looking for an experienced provider to deliver high-quality ${category.toLowerCase()} work. Scope includes initial consultation, iterative milestones, comprehensive testing, and handover within ${deadlineDays} days under ₹${budget.toLocaleString('en-IN')} budget.`;

  return {
    title,
    category,
    description,
    budget,
    deadlineDays,
    requiredSkills: skills,
    priority,
  };
}

export function suggestCounterOfferPrice(bestOfferPrice: number, category: RequirementCategory): { suggestedPrice: number; savingsPct: number; rationale: string } {
  // Suggest 6% to 10% lower, rounded cleanly to nearest ₹250 or ₹500
  const discountRate = 0.08; // 8% average discount
  const rawDiscount = bestOfferPrice * discountRate;
  const roundedDiscount = Math.round(rawDiscount / 250) * 250 || 500;
  const suggestedPrice = Math.max(1000, bestOfferPrice - roundedDiscount);
  const savingsPct = Math.round(((bestOfferPrice - suggestedPrice) / bestOfferPrice) * 100);

  return {
    suggestedPrice,
    savingsPct,
    rationale: `Smart counter suggestion based on competitive benchmarks for ${category}. Saves an additional ₹${roundedDiscount.toLocaleString('en-IN')} (${savingsPct}%) while remaining well within provider margin.`,
  };
}
