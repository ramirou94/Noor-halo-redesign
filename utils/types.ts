export interface Habit {
  id: string;
  name: string;
  icon: string;
  frequency: 'daily' | 'weekly' | 'custom';
  completedDates: string[]; // ISO date strings
  createdAt: string;
  streak: number;
}

export interface RitualContent {
  title: string;
  intention: string;
  description: string;
  durationMinutes: number;
  steps: string[];
}

export interface Ritual {
  id: number;
  key: string;
  en: RitualContent;
  fr: RitualContent;
  ar: RitualContent;
}

export interface Quote {
  id: number;
  en: string;
  fr: string;
  ar: string;
}

export interface ChallengeDay {
  day: number;
  title: string;
  content: string;
}

export interface ChallengeContent {
  title: string;
  description: string;
  days: ChallengeDay[];
}

export interface Challenge {
  id: number;
  key: string;
  durationDays: number;
  isPremium: boolean;
  en: ChallengeContent;
  fr: ChallengeContent;
  ar: ChallengeContent;
}

export interface UserChallenge {
  challengeId: number;
  startDate: string;
  currentDay: number;
  completed: boolean;
  completedDays: number[];
}

export interface MoodEntry {
  id: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1 = very bad, 5 = very good
  note?: string;
  date: string;
}

export interface UserPreferences {
  language: 'en' | 'fr' | 'ar';
  theme: 'light' | 'dark';
  notifications: {
    enabled: boolean;
    morningReminder: boolean;
    eveningReminder: boolean;
    dailyQuote: boolean;
    habits: boolean;
  };
}

export interface AudioContent {
  title: string;
  description: string;
  file: string | null;
}

export interface AudioTrack {
  id: number;
  key: string;
  isPremium: boolean;
  durationSeconds: number;
  en: AudioContent;
  fr: AudioContent;
  ar: AudioContent;
}