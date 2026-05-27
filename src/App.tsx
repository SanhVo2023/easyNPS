/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Database, 
  Eye, 
  BarChart3, 
  Share2,
  Info
} from 'lucide-react';
import { SparklesBg } from './components/SparklesBg';
import { FeedbackForm } from './components/FeedbackForm';
import { CreatorDashboard } from './components/CreatorDashboard';
import { 
  initAuth, 
  googleSignIn, 
  logoutUser 
} from './lib/firebase';
import { 
  findFeedbackSpreadsheets, 
  createFeedbackSpreadsheet, 
  appendFeedbackEntry, 
  fetchFeedbackEntries 
} from './lib/sheets';
import { FeedbackEntry, SpreadsheetConfig } from './types';

export default function App() {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  
  // App views: 'form' (Feedback Landing Page) or 'dashboard' (Database Admin Deck)
  const [viewMode, setViewMode] = useState<'form' | 'dashboard'>('form');

  // Spreadsheet Configuration & Synchronization states
  const [config, setConfig] = useState<SpreadsheetConfig | null>(null);
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);
  const [availableSheets, setAvailableSheets] = useState<Array<{ id: string; name: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load configuration and init Auth observers on layout mount
  useEffect(() => {
    // 1. Read stored sheet configurations from local storage to keep persists
    const storedConfig = localStorage.getItem('gemini_feedback_sheet_config');
    if (storedConfig) {
      try {
        setConfig(JSON.parse(storedConfig));
      } catch (e) {
        console.error('Error reading saved sheets config:', e);
      }
    }

    // 2. Initialize Firebase authentication state transitions
    const unsubscribe = initAuth(
      async (firebaseUser, accessToken) => {
        setUser(firebaseUser);
        setToken(accessToken);
        setAuthChecked(true);

        // Fetch user files in drive to link existing databases
        try {
          const files = await findFeedbackSpreadsheets(accessToken);
          setAvailableSheets(files);
        } catch (err) {
          console.warn('Failed to pre-query user sheets list from Drive:', err);
        }
      },
      () => {
        setUser(null);
        setToken(null);
        setAuthChecked(true);
      }
    );

    return () => unsubscribe();
  }, []);

  // Synchronize rows whenever the config change or OAuth tokens update
  useEffect(() => {
    if (token && config?.spreadsheetId) {
      syncWithSpreadsheet(token, config.spreadsheetId, config.sheetName);
    }
  }, [config?.spreadsheetId, token]);

  // Read raw lines from connected workspace spreadsheet
  const syncWithSpreadsheet = async (useToken: string, sheetId: string, sheetName: string) => {
    setIsSyncing(true);
    try {
      const rows = await fetchFeedbackEntries(useToken, sheetId, sheetName);
      setFeedbackEntries(rows);
    } catch (err: any) {
      console.error('Failed to sync entries from Google Sheet:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Google Login popup trigger
  const handleGoogleSignIn = async () => {
    try {
      const authResult = await googleSignIn();
      if (authResult) {
        setUser(authResult.user);
        setToken(authResult.accessToken);
        
        // Search Drive for spreadsheets
        const files = await findFeedbackSpreadsheets(authResult.accessToken);
        setAvailableSheets(files);
      }
    } catch (err) {
      console.error('Sign-in cancelled or failed:', err);
    }
  };

  // Log currently connected developer out
  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out of Google Workspace? This disconnects feedback streams until signed in again.');
    if (!confirmLogout) return;

    try {
      await logoutUser();
      setUser(null);
      setToken(null);
      setFeedbackEntries([]);
      setAvailableSheets([]);
      // Preserve sheet config in local storage so guests can submit, but clear credentials
    } catch (err) {
      console.error('Log out failed:', err);
    }
  };

  // Auto create feedback database in User's Google Drive
  const handleCreateAutoSheet = async () => {
    if (!token) {
      alert('Authentication required! Register with Google first to authorize space in your Drive.');
      return;
    }

    setIsSyncing(true);
    try {
      const newSheetConfig = await createFeedbackSpreadsheet(token);
      setConfig(newSheetConfig);
      localStorage.setItem('gemini_feedback_sheet_config', JSON.stringify(newSheetConfig));
      setFeedbackEntries([]); // New sheet is empty
      alert(`Success! "${newSheetConfig.title}" was safely created in your Google Drive folder.`);
    } catch (err: any) {
      alert(`Error creating feedback database sheet: ${err.message || err}`);
    } finally {
      setIsSyncing(false);
    }
  };

  // Connect spreadsheet listed in user's Drive folder
  const handleSelectExistingSheet = async (id: string, name: string) => {
    if (!token) return;

    const newConfig: SpreadsheetConfig = {
      spreadsheetId: id,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${id}`,
      title: name,
      sheetName: 'Sheet1' // Default target
    };

    setConfig(newConfig);
    localStorage.setItem('gemini_feedback_sheet_config', JSON.stringify(newConfig));
    syncWithSpreadsheet(token, id, 'Sheet1');
  };

  // Add standard feedback entry directly into connected Google Spreadsheet
  const handleFeedbackSubmit = async (formData: Omit<FeedbackEntry, 'timestamp'>): Promise<boolean> => {
    // 1. Prepare submission parameters
    // Format timestamp inside the app for complete transparency
    const appTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const finalRowEntry: FeedbackEntry = {
      ...formData,
      timestamp: appTimestamp
    };

    setIsSubmitting(true);

    try {
      // 2. Identify the active Access Token
      // Case A: A token exists (currently logged in user).
      // Case B: No active token. (The form is a guest). Guest submissions must utilize the connected config's session.
      // In client-only deployment on workspace framework, writing rows to standard sheet with OAuth requires a token.
      // Therefore, if guest does not have profile verification, they provide verification or write to the config owner's sheet.
      // If the owner has disconnected, they'll need Google approval first. We gracefully manage this in the form UI!
      const activeAccessToken = token;
      
      if (!activeAccessToken) {
        // If they are submitting as guest but nobody is signed in, we can prompt google sign in. 
        // This is highly secure, prevents anonymous spam and keeps database authentic!
        alert('Verified identity is required to complete submission. Connecting to Google Auth...');
        await handleGoogleSignIn();
        return false;
      }

      if (!config) {
        alert('Hold on! No target database sheet has been connected yet. Please toggle to "Creator Console" to initialize your target Spreadsheet database.');
        setIsSubmitting(false);
        return false;
      }

      // Write directly to Google Sheets database!
      await appendFeedbackEntry(activeAccessToken, config.spreadsheetId, finalRowEntry, config.sheetName);
      
      // Update local state to immediately show updates inside dashboard
      setFeedbackEntries(prev => [...prev, finalRowEntry]);
      return true;

    } catch (err: any) {
      console.error('Spreadsheet write failed:', err);
      alert(`Database rejected submission. Make sure you have authorized access to modify this file! Detail: ${err.message || err}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-100 relative bg-[#050505] flex flex-col justify-between selection:bg-blue-500/25 selection:text-white">
      
      {/* Animated Glowing Nebula space background */}
      <SparklesBg />

      {/* Primary Container */}
      <div className="flex-1 w-full flex flex-col relative z-10 px-4 md:px-0 mt-8 md:mt-12">
        <header className="mb-8 text-center max-w-lg mx-auto space-y-4 shrink-0 px-2">
          {/* Brand Pill */}
          <div className="inline-flex items-center justify-center gap-1.5 p-1 px-3.5 rounded-full bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-mono font-medium tracking-wide text-zinc-400">
              Gemini Direct Sync Engine
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight pb-0.5">
            Give us your take.
          </h1>
          <p className="text-xs md:text-sm text-zinc-400 font-normal max-w-sm mx-auto">
            Help us build the next generation of generative features. Your suggestions are securely recorded in real time.
          </p>
        </header>

        {/* View Mode Swapper Toggle (Only available when logged in with Google) */}
        {user && (
          <div className="max-w-sm mx-auto w-full p-1 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/80 rounded-2xl mb-8 flex transition-all">
            <button
              onClick={() => setViewMode('form')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer ${
                viewMode === 'form' 
                  ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-350'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Public Form View
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer ${
                viewMode === 'dashboard' 
                  ? 'bg-zinc-800 text-white border border-zinc-700/60 shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-350'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Creator Console
            </button>
          </div>
        )}

        {/* Main Interface Router with Slide animations */}
        <main className="flex-1 w-full max-w-5xl mx-auto flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {viewMode === 'form' ? (
              <motion.div
                key="feedback-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="w-full flex flex-col items-center justify-center flex-1"
              >
                <FeedbackForm
                  user={user}
                  onSignIn={handleGoogleSignIn}
                  onSubmit={handleFeedbackSubmit}
                  isSubmitting={isSubmitting}
                  spreadsheetUrl={config?.spreadsheetUrl || null}
                />

                {/* Switch to login prompt for app owners/creators */}
                {!user && (
                  <div className="mt-8 flex flex-col items-center gap-1.5 text-center">
                    <button
                      onClick={handleGoogleSignIn}
                      className="px-4 py-2.5 bg-zinc-900/40 hover:bg-zinc-900/90 text-zinc-400 hover:text-white border border-zinc-800/80 hover:border-zinc-700 rounded-2xl transition-all cursor-pointer text-xs font-semibold inline-flex items-center gap-1.5 shadow-md"
                    >
                      <Database className="w-3.5 h-3.5 text-blue-400" />
                      App Creator: Access Analytics Console
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
              >
                <CreatorDashboard
                  user={user}
                  config={config}
                  entries={feedbackEntries}
                  availableSheets={availableSheets}
                  onSelectExistingSheet={handleSelectExistingSheet}
                  onCreateNewSheet={handleCreateAutoSheet}
                  onRefresh={() => config && syncWithSpreadsheet(token!, config.spreadsheetId, config.sheetName)}
                  isSyncing={isSyncing}
                  onLogout={handleLogout}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Tiny descriptive safety footer */}
      <footer className="py-6 border-t border-zinc-900 mt-12 shrink-0 z-10 w-full bg-[#050505]/80 backdrop-blur-sm select-none">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-[10px] text-zinc-500 font-light flex items-center gap-1.5 flex-wrap justify-center">
            <Info className="w-3 h-3 text-zinc-650" />
            <span>Connected to verified Google Drive Spreadsheet files with active oauth security scopes.</span>
          </div>
          <span className="text-[10px] text-zinc-650 font-medium tracking-wide">
            Verified OAuth Flow Active
          </span>
        </div>
      </footer>
    </div>
  );
}
