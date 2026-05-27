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
