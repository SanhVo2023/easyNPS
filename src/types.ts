/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface FeedbackEntry {
  timestamp: string;
  name: string;
  email: string;
  rating: number; // 1-5
  type: 'Bug' | 'Feature Request' | 'UI/UX Improvement' | 'Compliment' | 'Other';
  message: string;
  platform: 'Mobile' | 'Desktop' | 'Tablet' | 'Other';
  wouldRecommend: 'Yes' | 'No' | 'Maybe';
}

export interface SpreadsheetConfig {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  sheetName: string;
}

export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  accessToken: string | null;
}

export interface FormFieldConfig {
  id: 'rating' | 'category' | 'message' | 'platform' | 'recommend' | 'contact_info';
  title: string;
  subtitle?: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // Custom labels for categories/options
}

export interface FormStepConfig {
  id: string; // "step-1", "step-2", etc.
  title: string;
  description: string;
  fieldId: 'rating' | 'category' | 'message' | 'platform' | 'recommend' | 'contact_info';
}

export interface FormConfig {
  themeId: string;
  brandName: string;
  headerTitle: string;
  headerSubtitle: string;
  successTitle: string;
  successDescription: string;
  steps: FormStepConfig[];
  fields: Record<string, FormFieldConfig>;
}

export interface ThemeConfig {
  id: string;
  name: string;
  backgroundClass: string;
  cardClass: string;
  accentClass: string;
  textClass: string;
  subtextClass: string;
  buttonClass: string;
  borderClass: string;
  glowColor: string; // Hex or rgba for radial glow
  nebulaColor: string; // Hex or rgba for secondary glow
  isLight?: boolean;
}

