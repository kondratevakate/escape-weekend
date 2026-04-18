/**
 * Internal "Kickstarter" for AI-features.
 * All state lives in localStorage — no backend.
 */

export type LabCategory = 'ai' | 'content' | 'service';

export interface LabIdea {
  id: string;
  emoji: string;
  category: LabCategory;
  title: { ru: string; en: string };
  description: { ru: string; en: string };
  /** Goal in RUB */
  goal: number;
  /** Synthetic baseline votes (for visual liveliness). */
  baseVotes: number;
  /** Synthetic baseline pledged amount in RUB. */
  basePledged: number;
  /** Default support amount per click (RUB). */
  supportAmount: number;
}

export interface UserSubmission {
  id: string;
  title: string;
  description: string;
  expectedPrice: string;
  createdAt: number;
}
