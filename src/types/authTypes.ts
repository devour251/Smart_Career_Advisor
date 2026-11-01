import type { EducationLevel, SupportedLanguage } from './sankalp';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  educationLevel: EducationLevel;
  currentStream: string;
  preferredLanguage: SupportedLanguage;
  createdAt: string;
}

export interface SavedBookmarkItem {
  id: number;
  userId: number;
  itemType: 'career' | 'stream';
  itemId: string;
  itemTitle: string;
  itemSubtitle: string;
  createdAt: string;
}

export interface AssessmentHistoryItem {
  id: number;
  sessionId: string;
  topCareerId: string;
  topScore: number;
  profileCompleteness: number;
  summaryItems: Array<{ id: string; title?: string; score: number }>;
  createdAt: string;
}
