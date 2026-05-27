/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
import { FeedbackEntry } from '../types';

interface FeedbackFormProps {
  user: any | null;
  onSignIn: () => void;
  onSubmit: (entry: Omit<FeedbackEntry, 'timestamp'>) => Promise<boolean>;
  isSubmitting: boolean;
  spreadsheetUrl: string | null;
}

export const FeedbackForm: React.FC<FeedbackFormProps> = ({
  user,
  onSignIn,
  onSubmit,
  isSubmitting,
  spreadsheetUrl
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

  // Derive Platform Icon
  const getPlatformIcon = (plat: FeedbackEntry['platform']) => {
    switch (plat) {
      case 'Mobile': return <Smartphone className="w-5 h-5" />;
      case 'Desktop': return <Laptop className="w-5 h-5" />;
      case 'Tablet': return <Tablet className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  // Human descriptive text for star ratings
  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return { text: 'Disappointing', color: 'text-red-400' };
      case 2: return { text: 'Needs Work', color: 'text-orange-400' };
      case 3: return { text: 'Satisfactory', color: 'text-yellow-400' };
      case 4: return { text: 'Great Experience', color: 'text-emerald-400' };
      case 5: return { text: 'Absolutely Stellar', color: 'text-violet-400', special: true };
      default: return { text: 'Select a score', color: 'text-gray-400' };
    }
  };

  const categories: Array<{ value: FeedbackEntry['type']; icon: React.ReactNode; label: string; desc: string }> = [
    { 
      value: 'UI/UX Improvement', 
      icon: <Layers className="w-5 h-5 text-indigo-400" />, 
      label: 'UI / Design', 
      desc: 'Layouts, colors, polish' 
    },
    { 
      value: 'Bug', 
      icon: <AlertTriangle className="w-5 h-5 text-rose-400" />, 
      label: 'Bug Report', 
      desc: 'Errors or glitchy logic' 
    },
    { 
      value: 'Feature Request', 
      icon: <Lightbulb className="w-5 h-5 text-amber-400" />, 
      label: 'New Feature', 
      desc: 'Ideas / enhancements' 
    },
    { 
      value: 'Compliment', 
      icon: <Heart className="w-5 h-5 text-pink-400" />, 
      label: 'Compliment', 
      desc: 'Things you adored' 
    },
    { 
      value: 'Other', 
      icon: <HelpCircle className="w-5 h-5 text-blue-400" />, 
      label: 'General / Other', 
      desc: 'Miscellaneous questions' 
    }
  ];

  const handleNext = () => {
    if (step === 1 && rating === 0) {
      alert('Please select an experience rating before moving forward!');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalName = user ? (user.displayName || 'Google Verified User') : manualName.trim();
    const finalEmail = user ? (user.email || '') : manualEmail.trim();

    if (!finalName) {
      alert('Please fill in your name so we know who is sending this!');
      return;
    }

    const success = await onSubmit({
      name: finalName,
      email: finalEmail,
      rating,
      type,
      message,
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

  // Progress Bar percentage helper
  const progressPercent = (step / 3) * 100;

  return (
    <div className="w-full max-w-lg mx-auto bg-[#111111]/85 backdrop-blur-3xl rounded-[40px] border border-zinc-800/50 outline-none shadow-3xl relative overflow-hidden z-10">
      
      {/* Decorative colored bar replicating Gemini's dynamic energy gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-[#1a73e8] via-[#d62b39] to-[#9334e6] absolute top-0 left-0" />

      {/* Header Area */}
      <div className="p-6 md:p-8 pb-4 border-b border-zinc-900/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1a73e8] via-[#d62b39] to-[#9334e6] flex items-center justify-center blur-[0.2px]">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <span className="font-sans font-medium tracking-tight text-white text-base">
              Gemini<span className="text-zinc-500 font-normal">Feedback</span>
            </span>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            Step {isSuccess ? '3' : step} of 3
          </div>
        </div>

        {/* Dynamic Progress Loader */}
        <div className="w-full h-1 bg-zinc-900 rounded-full mt-5 overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            initial={{ width: '0%' }}
            animate={{ width: `${isSuccess ? 100 : progressPercent}%` }}
            transition={{ ease: 'easeInOut', duration: 0.3 }}
          />
        </div>
      </div>

      <div className="p-6 md:p-8">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            /* SUCCESS VIEWER */
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
              <h2 className="text-xl md:text-2xl font-sans font-medium tracking-tight text-white mb-3">
                Feedback Recorded Directly!
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto mb-8">
                Your response was appended in real-time to the secure Google Sheets feedback database.
              </p>

              {spreadsheetUrl && (
                <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/5 max-w-sm mx-auto">
                  <span className="text-xs text-gray-400 block mb-1">Target Google Sheet Connected:</span>
                  <a 
                    href={spreadsheetUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs md:text-sm font-medium text-indigo-400 hover:text-indigo-300 underline cursor-pointer break-all"
                  >
                    Open Live Sheet View ↗
                  </a>
                </div>
              )}

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-xl text-xs md:text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 active:scale-95 transition-all outline-none duration-150 cursor-pointer"
              >
                Submit Reset Feed
              </button>
            </motion.div>
          ) : (
            /* MULTISTEP CONTENT */
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Rating Selector */}
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold ml-1 block text-left">
                      Satisfaction
                    </label>
                    <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-[28px] border border-zinc-800/80">
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
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl transition-all duration-200 cursor-pointer ${
                              isSelected 
                                ? 'bg-zinc-800 border border-zinc-700 scale-115 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.06)] opacity-100' 
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
                    {/* Display Human Sentiment Label */}
                    <div className={`text-xs font-mono font-medium text-center py-1 transition-all duration-300 ${getRatingLabel(hoverRating || rating).color}`}>
                      {getRatingLabel(hoverRating || rating).text}
                      {getRatingLabel(hoverRating || rating).special && (
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 inline ml-1.5 animate-spin" />
                      )}
                    </div>
                  </div>

                  {/* Category Grid */}
                  <div className="space-y-3">
                    <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold ml-1 block text-left">
                      Category
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {categories.map((cat) => {
                        const isSelected = type === cat.value;
                        return (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => setType(cat.value)}
                            className={`flex items-center gap-4 p-3 rounded-2xl text-left border cursor-pointer outline-none transition-all duration-150 ${
                              isSelected
                                ? 'bg-[#1a73e8]/10 border-blue-500/40 text-white font-medium'
                                : 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 hover:bg-zinc-800'
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-[#1a73e8]/15' : 'bg-zinc-950/80'}`}>
                              {cat.icon}
                            </div>
                            <div>
                              <div className="text-xs md:text-sm font-medium text-white">{cat.label}</div>
                              <div className="text-[11px] text-zinc-400 font-normal mt-0.5">{cat.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Move on step button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={rating === 0}
                      className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs md:text-sm font-semibold tracking-wide transition-all ${
                        rating > 0 
                          ? 'bg-white text-black hover:bg-zinc-200 active:scale-95 duration-100 cursor-pointer shadow-lg' 
                          : 'bg-zinc-900 border border-zinc-800/60 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="space-y-5"
                >
                  {/* Detailed Message Textbox */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold ml-1 block text-left">
                        Describe your experience
                      </label>
                      <span className="text-[10px] font-mono text-zinc-650">
                        {message.length} / 500
                      </span>
                    </div>
                    <div className="relative">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                        placeholder="What's on your mind? What went well or what could be improved?"
                        rows={4}
                        required
                        className="w-full bg-zinc-900/50 text-white border border-zinc-800 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500/50 resize-none transition-all placeholder:text-zinc-600 leading-relaxed focus:bg-zinc-900/80 focus:shadow-[0_0_15px_rgba(26,115,232,0.06)]"
                      />
                    </div>
                  </div>

                  {/* Demographics / Details */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Platform Selector */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold ml-1 block text-left">
                        Device Type
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                        {(['Mobile', 'Desktop', 'Tablet', 'Other'] as FeedbackEntry['platform'][]).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPlatform(p)}
                            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl border text-[10px] font-medium transition-all cursor-pointer ${
                              platform === p
                                ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 font-semibold'
                                : 'bg-zinc-900/40 hover:bg-zinc-800/80 text-zinc-400 border-zinc-800/80'
                            }`}
                          >
                            {getPlatformIcon(p)}
                            <span className="mt-1">{p}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Highly Recommend Selector */}
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold ml-1 block text-left">
                        Recommend?
                      </label>
                      <div className="flex flex-col gap-1.5 pt-0.5">
                        {(['Yes', 'No', 'Maybe'] as FeedbackEntry['wouldRecommend'][]).map((rec) => (
                          <button
                            key={rec}
                            type="button"
                            onClick={() => setWouldRecommend(rec)}
                            className={`w-full py-2 px-3 rounded-xl border text-[10px] font-medium text-left transition-all flex items-center justify-between cursor-pointer ${
                              wouldRecommend === rec
                                ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 font-semibold'
                                : 'bg-zinc-900/40 hover:bg-zinc-800/80 text-zinc-400 border-zinc-800/80'
                            }`}
                          >
                            <span>{rec === 'Yes' ? 'Absolutely' : rec === 'No' ? 'Not really' : 'Maybe'}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${wouldRecommend === rec ? 'bg-purple-400' : 'bg-transparent'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium border border-zinc-805 bg-zinc-900/30 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer transition-all active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={message.trim().length === 0}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs md:text-sm font-semibold tracking-wide transition-all ${
                        message.trim().length > 0 
                          ? 'bg-white text-black hover:bg-zinc-200 active:scale-95 duration-100 cursor-pointer shadow-lg' 
                          : 'bg-zinc-900 border border-zinc-800/60 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center p-4 rounded-3xl bg-zinc-900/50 border border-zinc-800/80 space-y-1.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> Secure Database Integration
                    </h3>
                    <p className="text-[11px] text-zinc-400 max-w-xs mx-auto leading-relaxed">
                      We secure database targets and sign submissions with standard Google authorization seals.
                    </p>
                  </div>

                  {user ? (
                    /* Authenticated Pre-pop Check */
                    <div className="p-4 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-zinc-900/50 border border-zinc-800/80 rounded-2xl space-y-3.5">
                      <div className="flex items-center gap-3">
                        {user.photoURL ? (
                          <img 
                            src={user.photoURL} 
                            alt="User Profile" 
                            className="w-10 h-10 rounded-full border border-zinc-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white text-sm uppercase">
                            {user.displayName?.[0] || 'G'}
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-semibold text-white tracking-wide">
                            {user.displayName || 'Google Verified Sender'}
                          </div>
                          <div className="text-[10px] text-zinc-450 mt-0.5">
                            {user.email || 'Authorizing Account'}
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        Verified Google OAuth seal approved
                      </div>
                    </div>
                  ) : (
                    /* Guest Mode manual inputs with choice to Auth */
                    <div className="space-y-4">
                      <div className="p-4 bg-zinc-900/60 rounded-2xl border border-zinc-800/85 flex flex-col md:flex-row justify-between items-center gap-3">
                        <div className="text-left">
                          <span className="text-[11px] font-semibold text-white block">Auto-fill via Google</span>
                          <span className="text-[10px] text-zinc-450 leading-normal block max-w-[240px]">
                            Connect Google profile to verify details instantly and securely.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={onSignIn}
                          className="px-4 py-2 text-[10px] font-semibold bg-white text-gray-900 hover:bg-zinc-200 rounded-xl transition-all outline-none active:scale-95 cursor-pointer shadow-sm text-center"
                        >
                          Google Auth
                        </button>
                      </div>

                      <div className="space-y-3 text-left">
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest block border-b border-zinc-900 pb-1 select-none">
                          Or complete manually
                        </span>
                        
                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider ml-1">Name</label>
                          <input
                            type="text"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                            placeholder="John Doe"
                            required={!user}
                            className="w-full bg-zinc-900/40 text-white border border-zinc-805 focus:border-blue-500/50 rounded-2xl px-4 py-3 text-xs focus:outline-none transition-all placeholder:text-zinc-650"
                          />
                        </div>

                        <div className="space-y-1 text-left">
                          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider ml-1">Email (Optional)</label>
                          <input
                            type="email"
                            value={manualEmail}
                            onChange={(e) => setManualEmail(e.target.value)}
                            placeholder="johndoe@example.com"
                            className="w-full bg-zinc-900/40 text-white border border-zinc-805 focus:border-blue-500/50 rounded-2xl px-4 py-3 text-xs focus:outline-none transition-all placeholder:text-zinc-650"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium border border-zinc-805 bg-zinc-900/30 text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer transition-all active:scale-95"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-xs md:text-sm font-semibold tracking-wide bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 transition-all`}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          Save in Sheets <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
