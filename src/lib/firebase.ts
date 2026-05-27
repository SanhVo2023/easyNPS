/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App and Auth
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Auth Provider with requested Workspace Scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// Cache the access token in memory (never localStorage or cookies)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Monitor authentication state changes and cache token when valid
export const initAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If we have a user but no cached token, we can't communicate with Google APIs.
        // We'll require a fresh sign-in to get the token, or handle gracefully.
        cachedAccessToken = null;
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

// Trigger Google Sign-In via Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google access token from sign-in.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Auth Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve currently cached in-memory access token
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Reset Auth State and flush cached tokens
export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};
