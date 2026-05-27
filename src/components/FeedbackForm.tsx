/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Layers, 
  Send,
  HelpCircle,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Heart,
  Globe
} from 'lucide-react';
import { FeedbackEntry, FormConfig, ThemeConfig } from '../types';
import { DEFAULT_FORM_CONFIG, THEMES } from '../lib/presets';

interface FeedbackFormProps {
  user: any | null;
  onSignIn: () => void;
  onSubmit: (entry: Omit<FeedbackEntry, 'timestamp'>) => Promise<boolean>;
  isSubmitting: boolean;
  spreadsheetUrl: string | null;
  formConfig?: FormConfig;
  theme?: ThemeConfig;
  isPreviewMode?: boolean;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  user,
  onSignIn,
  onSubmit,
  isSubmitting,
  spreadsheetUrl,
  formConfig = DEFAULT_FORM_CONFIG,
  theme = THEMES[0],
  isPreviewMode = false
}) => {
  const [step, setStep] = useState(1);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [type, setType] = useState<FeedbackEntry['type']>('UI/UX Improvement');
  const [message, setMessage] = useState('');
  const [platform, setPlatform] = useState<FeedbackEntry['platform']>('Mobile');
  const [wouldRecommend, setWouldRecommend] = useState<FeedbackEntry['wouldRecommend']>('Yes');
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Reset steps if form configuration properties list changes
  useEffect(() => {
    setStep(1);
    setIsSuccess(false);
  }, [formConfig.steps.length, formConfig.brandName]);

  // Derive Platform Icon
  const getPlatformIcon = (plat: FeedbackEntry['platform']) => {
    switch (plat) {
      case 'Mobile': return <Smartphone className="w-5 h-5 flex-shrink-0" />;
      case 'Desktop': return <Laptop className="w-5 h-5 flex-shrink-0" />;
      case 'Tablet': return <Tablet className="w-5 h-5 flex-shrink-0" />;
      default: return <Globe className="w-5 h-5 flex-shrink-0" />;
    }
  };

  // Human descriptive text for star ratings
  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return { text: 'Disappointing', color: 'text-rose-400' };
      case 2: return { text: 'Needs Work', color: 'text-orange-400' };
      case 3: return { text: 'Satisfactory', color: 'text-yellow-400' };
      case 4: return { text: 'Great Experience', color: 'text-emerald-400' };
      case 5: return { text: 'Absolutely Stellar', color: 'text-violet-400', special: true };
      default: return { text: 'Select feedback score', color: 'text-zinc-500' };
    }
  };

  // Pre-configured categorizations
  const getCategoryIcon = (catVal: string) => {
    const norm = catVal.toLowerCase();
    if (norm.includes('ux') || norm.includes('design') || norm.includes('ui')) {
      return <Layers className="w-5 h-5 text-indigo-400" />;
    }
    if (norm.includes('bug') || norm.includes('error') || norm.includes('glitch')) {
      return <AlertTriangle className="w-5 h-5 text-rose-400" />;
    }
    if (norm.includes('feature') || norm.includes('idea') || norm.includes('request')) {
      return <Lightbulb className="w-5 h-5 text-amber-400" />;
    }
    if (norm.includes('compliment') || norm.includes('love') || norm.includes('like')) {
      return <Heart className="w-5 h-5 text-pink-400" />;
    }
    return <HelpCircle className="w-5 h-5 text-blue-400" />;
  };

  const activeStepsList = formConfig.steps;
  const totalStepCount = activeStepsList.length;

  const currentStepItem = activeStepsList[step - 1];
  const isLastStep = step === totalStepCount;

  // Active theme parameters
  const isLightMode = theme.isLight || false;

  const handleNext = () => {
    if (!currentStepItem) return;

    // Run active stage validation
    if (currentStepItem.fieldId === 'rating' && rating === 0) {
      alert('Please select an experience rating before moving forward!');
      return;
    }
    if (currentStepItem.fieldId === 'message' && message.trim().length === 0) {
      alert('Please fill out the detailed critique message box before moving forward!');
      return;
    }

    if (isLastStep) {
      handleFormSubmit();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFormSubmit = async () => {
    const finalName = user ? (user.displayName || 'Google Verified User') : manualName.trim();
    const finalEmail = user ? (user.email || '') : manualEmail.trim();

    // Secondary contact validators
    const contactStep = activeStepsList.find(s => s.fieldId === 'contact_info');
    if (contactStep && !user && !finalName) {
      alert('Please fill in your name so we know who corresponds to this suggestion!');
      return;
    }

    if (isPreviewMode) {
      setIsSuccess(true);
      return;
    }

    const success = await onSubmit({
      name: finalName || 'Guest User',
      email: finalEmail || 'anonymous@guest.com',
      rating,
      type,
      message: message || 'Integrated rating submission',
      platform,
      wouldRecommend
    });

    if (success) {
      setIsSuccess(true);
    }
  };

  const handleReset = () => {
    setStep(1);
    setRating(0);
    setType('UI/UX Improvement');
    setMessage('');
    setPlatform('Mobile');
    setWouldRecommend('Yes');
    setManualName('');
    setManualEmail('');
    setIsSuccess(false);
  };

  // Progress Bar percentage calculation
  const progressPercent = (step / totalStepCount) * 100;

  return (
    <div className={`w-full max-w-lg mx-auto rounded-[36px] overflow-hidden relative z-10 transition-all duration-300 border ${theme.cardClass} text-left`}>
      
      {/* Decorative top energetic gradient ribbon bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${theme.accentClass}`} />

      {/* Header Info Block */}
      <div className="p-6 md:p-8 pb-4 border-b border-zinc-900/10">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${theme.accentClass} flex items-center justify-center`}>
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className={`font-sans font-bold tracking-tight text-sm md:text-base truncate ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
              {formConfig.brandName}
            </span>
          </div>
          <div className={`text-[10px] font-mono uppercase tracking-widest ${isLightMode ? 'text-indigo-650/60' : 'text-zinc-550'}`}>
            Step {isSuccess ? totalStepCount : step} of {totalStepCount}
          </div>
        </div>

        {/* Multi-step progress linear timeline */}
        <div className="w-full h-1 bg-zinc-950/40 rounded-full mt-5 overflow-hidden">
          <motion.div 
            className={`h-full bg-gradient-to-r ${theme.accentClass}`}
            initial={{ width: '0%' }}
            animate={{ width: `${isSuccess ? 100 : progressPercent}%` }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          />
        </div>
      </div>

      {/* Primary interactive form segment */}
      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* THANK-YOU SUCCESS NOTIFIER SCREEN */
            <motion.div
              key="success"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="text-center py-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 mb-6">
                <CheckCircle2 className="w-9 h-9 text-violet-400 animate-bounce" />
              </div>
              
              <h2 className={`text-xl md:text-2xl font-sans font-bold tracking-tight mb-3 ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                {formConfig.successTitle || 'Feedback Catalogued!'}
              </h2>
              
              <p className={`text-xs md:text-sm leading-relaxed max-w-sm mx-auto mb-8 ${isLightMode ? 'text-slate-650' : 'text-zinc-400'}`}>
                {formConfig.successDescription || 'Description completion updated.'}
              </p>

              {spreadsheetUrl && !isPreviewMode && (
                <div className="mb-8 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 max-w-sm mx-auto text-left">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-1">Spreadsheet Live Host</span>
                  <a 
                    href={spreadsheetUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer break-all"
                  >
                    Open Live Sync GSheet ↗
                  </a>
                </div>
              )}

              <button
                onClick={handleReset}
                className={`py-2.5 px-6 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 cursor-pointer ${theme.buttonClass}`}
              >
                Submit New suggestion
              </button>
            </motion.div>
          ) : (
            /* PREVIEW-ACTIVE VIEW SWITCHER */
            <div className="space-y-6">
              {currentStepItem && (
                <motion.div
                  key={currentStepItem.id}
                  initial={{ x: 15, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -15, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  {/* Step Title Header block inside Step screen */}
                  <div className="space-y-1.5 text-left pb-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider font-mono ${isLightMode ? 'text-indigo-600' : 'text-indigo-400'}`}>
                      {currentStepItem.title}
                    </span>
                    <p className={`text-xs ${isLightMode ? 'text-slate-550' : 'text-zinc-400'} font-normal leading-relaxed`}>
                      {currentStepItem.description}
                    </p>
                  </div>

                  {/* FIELD SELECTORS RENDER ROUTER */}
                  
                  {/* Rating emoji scores */}
                  {currentStepItem.fieldId === 'rating' && (
                    <div className="space-y-4 pt-1 animate-fadeIn">
                      <div className={`flex justify-between items-center p-4 rounded-[26px] border ${isLightMode ? 'bg-slate-50 border-indigo-100' : 'bg-black/40 border-zinc-900'}`}>
                        {[
                          { val: 1, symbol: '😞' },
                          { val: 2, symbol: '😕' },
                          { val: 3, symbol: '😐' },
                          { val: 4, symbol: '😊' },
                          { val: 5, symbol: '🤩' }
                        ].map((item) => {
                          const isSelected = rating === item.val;
                          const isHovered = hoverRating === item.val;
                          return (
                            <button
                              key={item.val}
                              type="button"
                              onClick={() => setRating(item.val)}
                              onMouseEnter={() => setHoverRating(item.val)}
                              onMouseLeave={() => setHoverRating(0)}
                              className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl transition-all duration-150 cursor-pointer ${
                                isSelected 
                                  ? 'bg-zinc-800 border border-zinc-700 scale-115 filter drop-shadow-md opacity-100' 
                                  : isHovered
                                  ? 'bg-zinc-950 scale-105 opacity-90'
                                  : 'opacity-40 hover:opacity-100'
                              }`}
                            >
                              {item.symbol}
                            </button>
                          );
                        })}
                      </div>
                      
                      <div className={`text-xs font-mono font-bold text-center transition-all ${getRatingLabel(hoverRating || rating).color}`}>
                        {getRatingLabel(hoverRating || rating).text}
                        {getRatingLabel(hoverRating || rating).special && (
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 inline ml-1.5 animate-spin" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Dynamic Category tag options chips list */}
                  {currentStepItem.fieldId === 'category' && (
                    <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1 text-left animate-fadeIn">
                      {(formConfig.fields.category.options || ['UI/UX Improvement', 'Bug', 'Feature Request', 'Compliment', 'Other']).map((catName) => {
                        const isSelected = type === catName;
                        return (
                          <button
                            key={catName}
                            type="button"
                            onClick={() => setType(catName as any)}
                            className={`flex items-center gap-3.5 p-3 rounded-2xl text-left border cursor-pointer outline-none transition-all duration-150 ${
                              isSelected
                                ? 'bg-[#1a73e8]/10 border-blue-500/40 text-white font-semibold'
                                : isLightMode
                                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                                : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:bg-zinc-900'
                            }`}
                          >
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-[#1a73e8]/20' : 'bg-black/30'}`}>
                              {getCategoryIcon(catName)}
                            </div>
                            <div>
                              <div className={`text-xs font-bold ${isLightMode ? 'text-slate-800' : 'text-white'}`}>{catName}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggestion message texts prompt */}
                  {currentStepItem.fieldId === 'message' && (
                    <div className="space-y-2 text-left animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <label className={`text-[10px] uppercase tracking-widest font-bold ${isLightMode ? 'text-indigo-650' : 'text-zinc-550'}`}>
                          Detailed Description Log
                        </label>
                        <span className="text-[9px] font-mono text-zinc-500">
                          {message.length} / 500
                        </span>
                      </div>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                        placeholder={formConfig.fields.message.placeholder || "Describe specific suggestions or findings..."}
                        rows={4}
                        required
                        className={`w-full text-xs font-normal rounded-2xl p-4 focus:outline-none focus:border-indigo-500/50 resize-none transition-all placeholder:text-zinc-650 ${
                          isLightMode 
                            ? 'bg-slate-50 border border-slate-200 text-slate-800' 
                            : 'bg-black/40 border border-zinc-900 text-white focus:bg-zinc-950/70'
                        }`}
                      />
                    </div>
                  )}

                  {/* Platforms selectors chips */}
                  {currentStepItem.fieldId === 'platform' && (
                    <div className="space-y-2 animate-fadeIn text-left">
                      <label className={`text-[10px] uppercase font-bold tracking-wider ${isLightMode ? 'text-indigo-650' : 'text-zinc-550'}`}>Operating OS Medium</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['Mobile', 'Desktop', 'Tablet', 'Other'] as FeedbackEntry['platform'][]).map((p) => {
                          const isActive = platform === p;
                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setPlatform(p)}
                              className={`flex flex-col items-center justify-center py-3.5 px-2 rounded-2xl border text-[10px] font-bold transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-[#1a73e8]/10 text-blue-400 border-blue-500/30'
                                  : isLightMode
                                  ? 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                  : 'bg-zinc-950/40 hover:bg-zinc-900 text-zinc-400 border-zinc-900'
                              }`}
                            >
                              {getPlatformIcon(p)}
                              <span className="mt-1.5">{p}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recommendation index ratio options */}
                  {currentStepItem.fieldId === 'recommend' && (
                    <div className="space-y-2 animate-fadeIn text-left">
                      <label className={`text-[10px] uppercase font-bold tracking-wider ${isLightMode ? 'text-indigo-650' : 'text-zinc-550'}`}>Loyalty Advocacy Percentage</label>
                      <div className="flex flex-col gap-2">
                        {(['Yes', 'No', 'Maybe'] as FeedbackEntry['wouldRecommend'][]).map((rec) => {
                          const isActive = wouldRecommend === rec;
                          return (
                            <button
                              key={rec}
                              type="button"
                              onClick={() => setWouldRecommend(rec)}
                              className={`w-full py-3 px-4 rounded-xl border text-[11px] font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                                isActive
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                                  : isLightMode
                                  ? 'bg-white hover:bg-slate-50 text-slate-500 border-slate-200'
                                  : 'bg-zinc-950/40 hover:bg-zinc-900 text-zinc-450 border-zinc-900'
                              }`}
                            >
                              <span>{rec === 'Yes' ? 'Yes, absolutely refer' : rec === 'No' ? 'Not planning referral' : 'Maybe refer under conditions'}</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-purple-400' : 'bg-transparent'}`} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Client Identification step */}
                  {currentStepItem.fieldId === 'contact_info' && (
                    <div className="space-y-4 animate-fadeIn text-left">
                      {user ? (
                        /* Authenticated checks info */
                        <div className={`p-4 border rounded-2xl space-y-3 ${isLightMode ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-zinc-900'}`}>
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img 
                                src={user.photoURL} 
                                alt="Profile Avatar" 
                                className="w-10 h-10 rounded-full border border-zinc-700"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white uppercase">
                                {user.displayName?.[0] || 'U'}
                              </div>
                            )}
                            <div>
                              <div className={`text-xs font-bold leading-none ${isLightMode ? 'text-slate-800' : 'text-white'}`}>
                                {user.displayName || 'Authorized Contributor'}
                              </div>
                              <div className="text-[10px] text-zinc-500 mt-1">
                                {user.email || 'Google active sync'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1.5 pt-1 border-t border-zinc-900/10">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                            Secure Google certified identity sealed
                          </div>
                        </div>
                      ) : (
                        /* Guest Manual inputs */
                        <div className="space-y-4">
                          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
                            isLightMode ? 'bg-slate-55/40 border-slate-100' : 'bg-zinc-950/40 border-zinc-900'
                          }`}>
                            <div className="text-left">
                              <span className={`text-[11px] font-bold block ${isLightMode ? 'text-slate-850' : 'text-white'}`}>Auto-fill and verify via Google</span>
                              <span className="text-[10px] text-zinc-500 leading-snug block mt-0.5">Secure validation speeds up submissions and verification badges.</span>
                            </div>
                            <button
                              type="button"
                              onClick={onSignIn}
                              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold hover:scale-102 cursor-pointer ${theme.buttonClass}`}
                            >
                              Google Auth
                            </button>
                          </div>

                          <div className="space-y-3">
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${isLightMode ? 'text-slate-450' : 'text-zinc-500'}`}>Or fill details manually</span>
                            
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Your Name</label>
                              <input
                                type="text"
                                value={manualName}
                                onChange={(e) => setManualName(e.target.value)}
                                placeholder="E.g. Alexis Carter"
                                required
                                className={`w-full text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50 ${
                                  isLightMode ? 'bg-slate-50 border border-slate-200 text-slate-800' : 'bg-black/30 border border-zinc-900 text-white'
                                }`}
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase">Email Address (Optional)</label>
                              <input
                                type="email"
                                value={manualEmail}
                                onChange={(e) => setManualEmail(e.target.value)}
                                placeholder="alexis@example.com"
                                className={`w-full text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-indigo-500/50 ${
                                  isLightMode ? 'bg-slate-50 border border-slate-200 text-slate-800' : 'bg-black/30 border border-zinc-900 text-white'
                                }`}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Control Toolbar at footer of step cards */}
                  <div className="pt-4 flex justify-between gap-3 border-t border-zinc-900/10">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={step === 1}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border ${
                        step === 1
                          ? 'opacity-10 cursor-not-allowed border-zinc-800 text-zinc-650'
                          : isLightMode 
                          ? 'bg-white hover:bg-slate-50 border-slate-200 text-slate-650 active:scale-95 transition-all'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all'
                      }`}
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold shadow-lg transition-all active:scale-95 cursor-pointer border ${theme.buttonClass}`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className={`w-3 h-3 rounded-full border-2 border-slate-900 border-t-transparent animate-spin`} />
                          Saving...
                        </>
                      ) : isLastStep ? (
                        <>
                          Save in Sheets <Send className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          Continue <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>

                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};
