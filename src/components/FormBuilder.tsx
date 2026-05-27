import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Laptop, 
  Layers, 
  Palette, 
  Settings2, 
  CheckCircle2, 
  Info,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { FormConfig, FormStepConfig, FormFieldConfig, ThemeConfig } from '../types';
import { THEMES, INDUSTRY_PRESETS, DEFAULT_FORM_CONFIG } from '../lib/presets';

interface FormBuilderProps {
  formConfig: FormConfig;
  onConfigChange: (newConfig: FormConfig) => void;
  activeTheme: ThemeConfig;
  onThemeChange: (themeId: string) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  formConfig,
  onConfigChange,
  activeTheme,
  onThemeChange
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'flow' | 'content'>('presets');
  const [expandedStep, setExpandedStep] = useState<string | null>('step-experience');

  const availableFieldIdOptions: Array<{ value: FormStepConfig['fieldId']; label: string; desc: string }> = [
    { value: 'rating', label: '⭐ Satisfaction Rating', desc: '1-5 Star Emoji selector' },
    { value: 'category', label: '📂 Category Classifier', desc: 'Shorthand feedback folder routing' },
    { value: 'message', label: '✍️ Experience Suggestions', desc: 'Multi-line detailed text prompt area' },
    { value: 'platform', label: '📱 Customer Device Type', desc: 'Identifies Mobile, Desktop, Tablet, Server' },
    { value: 'recommend', label: '👍 Advocacy Net Promoter', desc: 'Standard "Will recommendus" index' },
    { value: 'contact_info', label: '👤 Contact Verification', desc: 'Secure Google account validation or name fields' }
  ];

  // Change core brand properties
  const updateMetaProperty = (name: keyof Omit<FormConfig, 'steps' | 'fields'>, value: string) => {
    onConfigChange({
      ...formConfig,
      [name]: value
    });
  };

  // Select industry pre-defined template
  const handleApplyPreset = (industryKey: string) => {
    const preset = INDUSTRY_PRESETS[industryKey];
    if (preset) {
      onConfigChange(JSON.parse(JSON.stringify(preset.config)));
      onThemeChange(preset.config.themeId);
    }
  };

  // Re-order steps: shift step item up
  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...formConfig.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index - 1];
    newSteps[index - 1] = temp;
    onConfigChange({
      ...formConfig,
      steps: newSteps
    });
  };

  // Re-order steps: shift step item down
  const moveStepDown = (index: number) => {
    if (index === formConfig.steps.length - 1) return;
    const newSteps = [...formConfig.steps];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1];
    newSteps[index + 1] = temp;
    onConfigChange({
      ...formConfig,
      steps: newSteps
    });
  };

  // Update a single step configuration property
  const updateStepInfo = (stepId: string, updates: Partial<FormStepConfig>) => {
    const newSteps = formConfig.steps.map(s => {
      if (s.id === stepId) {
        return { ...s, ...updates };
      }
      return s;
    });
    onConfigChange({
      ...formConfig,
      steps: newSteps
    });
  };

  // Update customizable field prompt titles and placeholders
  const updateFieldInfo = (fieldId: FormFieldConfig['id'], updates: Partial<FormFieldConfig>) => {
    onConfigChange({
      ...formConfig,
      fields: {
        ...formConfig.fields,
        [fieldId]: {
          ...formConfig.fields[fieldId],
          ...updates
        }
      }
    });
  };

  // Append new step block
  const handleAddStep = () => {
    const defaultAvailable = availableFieldIdOptions.find(opt => 
      !formConfig.steps.some(s => s.fieldId === opt.value)
    ) || availableFieldIdOptions[0];

    const newId = `step-custom-${Date.now()}`;
    const newStep: FormStepConfig = {
      id: newId,
      title: `Custom Form Step`,
      description: 'Fill in specialized suggestion details',
      fieldId: defaultAvailable.value
    };

    onConfigChange({
      ...formConfig,
      steps: [...formConfig.steps, newStep]
    });
    setExpandedStep(newId);
  };

  // Remove a step item from workflow
  const handleRemoveStep = (stepId: string) => {
    if (formConfig.steps.length <= 1) {
      alert('Your form must have at least one workflow step screen active!');
      return;
    }
    const filtered = formConfig.steps.filter(s => s.id !== stepId);
    onConfigChange({
      ...formConfig,
      steps: filtered
    });
  };

  // Reset to default configuration
  const handleResetToDefault = () => {
    const confirmReset = window.confirm('Are you sure you want to restore default templates? This discards your custom steps list editing.');
    if (!confirmReset) return;
    onConfigChange(JSON.parse(JSON.stringify(DEFAULT_FORM_CONFIG)));
    onThemeChange(DEFAULT_FORM_CONFIG.themeId);
  };

  return (
    <div className="w-full bg-[#0d0d12]/90 border border-zinc-800/80 rounded-[32px] p-6 text-left shadow-2xl backdrop-blur-3xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-zinc-900 mb-6">
        <div>
          <h2 className="text-xl font-bold font-sans text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            No-Code Flow Designer
          </h2>
          <p className="text-xs text-zinc-400">Drag, reorder, swap themes, and edit form copy instantly as a child</p>
        </div>

        <button
          onClick={handleResetToDefault}
          className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Settings
        </button>
      </div>

      {/* Tabs list switch */}
      <div className="flex p-1 bg-zinc-950/80 rounded-2xl border border-zinc-900 mb-6">
        {[
          { tab: 'presets', label: '🎒 Industry Presets', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { tab: 'flow', label: '⛓️ Step Flows', icon: <Layers className="w-3.5 h-3.5" /> },
          { tab: 'content', label: '🎨 Style & Texts', icon: <Palette className="w-3.5 h-3.5" /> }
        ].map((item) => {
          const isSelected = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer ${
                isSelected 
                  ? 'bg-zinc-900 text-white border border-zinc-800' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panel contents */}
      <div className="space-y-6">
        
        {/* PRESETS TAB PANEL */}
        {activeTab === 'presets' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Select Industry Presets</h3>
              <p className="text-[11px] text-zinc-550 leading-relaxed">Swap the form structure to templates tailored for multiple professional verticals instantly.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(INDUSTRY_PRESETS).map(([key, item]) => {
                const isActive = formConfig.brandName === item.config.brandName || 
                                (key === 'saas' && formConfig.brandName.includes('SaaS'));
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleApplyPreset(key)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer group active:scale-98 ${
                      isActive 
                        ? 'bg-white/5 border-zinc-300 text-white' 
                        : 'bg-zinc-950/40 border-zinc-900 text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-100'
                    }`}
                  >
                    <span className="text-3xl bg-zinc-900 p-2 rounded-xl group-hover:scale-105 transition-transform" role="img" aria-label={item.name}>
                      {item.icon}
                    </span>
                    <div className="space-y-0.5 truncate">
                      <h4 className="text-xs font-bold font-sans text-white group-hover:text-blue-400 transition-colors">{item.name}</h4>
                      <p className="text-[10.5px] text-zinc-500 leading-normal line-clamp-2 pr-2 whitespace-normal">{item.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-905 flex items-center gap-3.5">
              <Info className="w-5 h-5 text-purple-400 flex-shrink-0" />
              <p className="text-[10.5px] text-zinc-500 leading-relaxed">
                <strong>Child-Simple Tip:</strong> Selecting as simple as a click completely reforms the questionnaire and modifies the text fields without breaking any database connections!
              </p>
            </div>
          </div>
        )}

        {/* STEP FLOWS PANEL */}
        {activeTab === 'flow' && (
          <div className="space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Reorder & Configure Form Screens</h3>
                <p className="text-[11px] text-zinc-550">Click up ⬆️ and down ⬇️ to change flow. Drag items or customize each page header.</p>
              </div>

              <button
                onClick={handleAddStep}
                className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[11px] font-bold rounded-xl flex items-center gap-1 transition-all hover:scale-102 active:scale-98"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Step
              </button>
            </div>

            {/* Vertical Flow Steps List */}
            <div className="space-y-2.5">
              {formConfig.steps.map((stepItem, index) => {
                const isExpanded = expandedStep === stepItem.id;
                const fieldConfig = formConfig.fields[stepItem.fieldId] || { title: stepItem.title, placeholder: '', required: true };
                
                return (
                  <motion.div
                    key={stepItem.id}
                    layoutId={stepItem.id}
                    className={`rounded-2xl border ${
                      isExpanded 
                        ? 'bg-zinc-900 border-zinc-700/60 shadow-lg' 
                        : 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800'
                    } transition-colors`}
                  >
                    {/* Step bar header item */}
                    <div className="p-3.5 flex items-center justify-between gap-2.5">
                      <div className="flex items-center gap-3 truncate">
                        <span className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 text-[10.5px] font-mono font-bold text-zinc-400 flex items-center justify-center">
                          {index + 1}
                        </span>

                        <div 
                          onClick={() => setExpandedStep(isExpanded ? null : stepItem.id)}
                          className="cursor-pointer text-left truncate flex-1 min-w-[120px]"
                        >
                          <div className="text-xs font-bold text-white truncate flex items-center gap-2">
                            {stepItem.title || 'Untitled Step Screen'}
                            <span className="text-[9px] bg-zinc-800 p-0.5 px-2 rounded-full font-mono text-zinc-400">
                              {stepItem.fieldId}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 truncate mt-0.5">{stepItem.description || 'No description set'}</p>
                        </div>
                      </div>

                      {/* Controls Area */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Shifter up */}
                        <button
                          type="button"
                          onClick={() => moveStepUp(index)}
                          disabled={index === 0}
                          className="p-1 px-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-20 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800"
                          title="Move step screen up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Shifter down */}
                        <button
                          type="button"
                          onClick={() => moveStepDown(index)}
                          disabled={index === formConfig.steps.length - 1}
                          className="p-1 px-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-20 text-zinc-400 hover:text-white rounded-lg transition-colors border border-zinc-800"
                          title="Move step screen down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Toggle expand information */}
                        <button
                          onClick={() => setExpandedStep(isExpanded ? null : stepItem.id)}
                          className="p-1.5 text-zinc-500 hover:text-zinc-300"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {/* Deleter */}
                        <button
                          onClick={() => handleRemoveStep(stepItem.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete this screen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Step expand fields details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-zinc-900"
                        >
                          <div className="p-4 space-y-3 text-xs bg-zinc-950/40 rounded-b-2xl">
                            
                            {/* Form Input selector */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Screen Content & Input Goal</label>
                                <select
                                  value={stepItem.fieldId}
                                  onChange={(e) => updateStepInfo(stepItem.id, { fieldId: e.target.value as any })}
                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-zinc-700 text-white"
                                >
                                  {availableFieldIdOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="space-y-1 text-left">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Form Validation Status</label>
                                <div className="flex items-center gap-2 pt-2 text-zinc-400 font-semibold">
                                  <input 
                                    type="checkbox" 
                                    id={`req-${stepItem.id}`}
                                    checked={fieldConfig.required}
                                    onChange={(e) => updateFieldInfo(stepItem.fieldId, { required: e.target.checked })}
                                    className="w-4 h-4 rounded text-indigo-500 focus:ring-0 cursor-pointer"
                                  />
                                  <label htmlFor={`req-${stepItem.id}`} className="cursor-pointer select-none">Mark input as mandatory / required</label>
                                </div>
                              </div>
                            </div>

                            {/* Editing labels */}
                            <div className="space-y-1.5 text-left">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Step Header Screen Title</label>
                              <input
                                type="text"
                                value={stepItem.title}
                                onChange={(e) => updateStepInfo(stepItem.id, { title: e.target.value })}
                                placeholder="E.g. Table Service Food Satisfaction"
                                className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none placeholder:text-zinc-650"
                              />
                            </div>

                            <div className="space-y-1.5 text-left">
                              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Step Screen Short Instruction</label>
                              <input
                                type="text"
                                value={stepItem.description}
                                onChange={(e) => updateStepInfo(stepItem.id, { description: e.target.value })}
                                placeholder="Provide brief instructions..."
                                className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none placeholder:text-zinc-650"
                              />
                            </div>

                            {/* Conditional option: placeholder edit if text input message or rating */}
                            {stepItem.fieldId === 'message' && (
                              <div className="space-y-1.5 text-left animate-fadeIn">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Message Textbox Placeholder</label>
                                <input
                                  type="text"
                                  value={fieldConfig.placeholder || ''}
                                  onChange={(e) => updateFieldInfo('message', { placeholder: e.target.value })}
                                  placeholder="Input helpful tips..."
                                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none placeholder:text-zinc-650"
                                />
                              </div>
                            )}

                            {/* Conditional option: dynamic category chips list edit options */}
                            {stepItem.fieldId === 'category' && (
                              <div className="space-y-2 text-left animate-fadeIn">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Category options tags (Comma-separated)</label>
                                <input
                                  type="text"
                                  value={fieldConfig.options?.join(', ') || ''}
                                  onChange={(e) => updateFieldInfo('category', { options: e.target.value.split(',').map(s => s.trim().substring(0, 32)).filter(Boolean) as any })}
                                  placeholder="E.g. Food, Wait Staff, Ambience, Waiting Times"
                                  className="w-full bg-zinc-900 text-white border border-zinc-800 rounded-xl px-3 py-2 text-xs focus:outline-none placeholder:text-zinc-650"
                                />
                                <span className="text-[9px] text-zinc-600 block leading-tight">These custom suggestion folder values will map seamlessly into the dynamic categories column inside the spreadsheet!</span>
                              </div>
                            )}

                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* STYLE AND TEXTS STUDIO PANEL */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Visual Studio Theme circles selection */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Dynamic App Themes Studio</h3>
                <p className="text-[11px] text-zinc-550">Click on any visual environment presets below to morph colors instantly.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEMES.map((theme) => {
                  const isActive = activeTheme.id === theme.id;
                  
                  // Extract preview highlights
                  let dotColorGradient = "from-[#7c3aed] to-[#3b82f6]";
                  if (theme.id === 'forest-zen') dotColorGradient = "from-[#10b981] to-[#06b6d4]";
                  if (theme.id === 'sunset-amber') dotColorGradient = "from-[#f97316] to-[#ef4444]";
                  if (theme.id === 'cyberpunk-fever' || theme.id === 'cyberpunk-neon') dotColorGradient = "from-[#ec4899] to-[#06b6d2]";
                  if (theme.id === 'bubblegum-sky') dotColorGradient = "from-[#f472b6] to-[#60a5fa]";
                  if (theme.id === 'slate-minimal') dotColorGradient = "from-[#a1a1aa] to-[#3f3f46]";

                  return (
                    <button
                      key={theme.id}
                      onClick={() => onThemeChange(theme.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer hover:bg-zinc-900/60 active:scale-95 transition-all outline-none ${
                        isActive 
                          ? 'bg-zinc-900 border-zinc-300 text-white' 
                          : 'bg-zinc-950/40 border-zinc-900 text-zinc-400'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-tr ${dotColorGradient} flex-shrink-0`} />
                      <span className="text-[11px] font-semibold truncate leading-none">{theme.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Brand Header Form copywriting */}
            <div className="space-y-4 border-t border-zinc-900 pt-4 text-left">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Custom Header Copywriting & Branding</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Brand / Company Name</label>
                  <input
                    type="text"
                    value={formConfig.brandName}
                    onChange={(e) => updateMetaProperty('brandName', e.target.value)}
                    placeholder="Enter brand name..."
                    className="w-full bg-zinc-905 text-white border border-zinc-805 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Public Hero Title Header</label>
                  <input
                    type="text"
                    value={formConfig.headerTitle}
                    onChange={(e) => updateMetaProperty('headerTitle', e.target.value)}
                    placeholder="E.g. Share your critique."
                    className="w-full bg-zinc-905 text-white border border-zinc-805 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Header Paragraph Subtitle</label>
                  <input
                    type="text"
                    value={formConfig.headerSubtitle}
                    onChange={(e) => updateMetaProperty('headerSubtitle', e.target.value)}
                    placeholder="Write beautiful subtext..."
                    className="w-full bg-zinc-905 text-white border border-zinc-805 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>
            </div>

            {/* Success screens copywriting */}
            <div className="space-y-4 border-t border-zinc-900 pt-4 text-left">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Form Completion Screen Thank-You Copy</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Completion Header</label>
                  <input
                    type="text"
                    value={formConfig.successTitle}
                    onChange={(e) => updateMetaProperty('successTitle', e.target.value)}
                    placeholder="E.g. Suggestion recorded!"
                    className="w-full bg-zinc-905 text-white border border-zinc-805 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Completion Paragraph Description</label>
                  <input
                    type="text"
                    value={formConfig.successDescription}
                    onChange={(e) => updateMetaProperty('successDescription', e.target.value)}
                    placeholder="Describe next reward steps..."
                    className="w-full bg-zinc-905 text-white border border-zinc-805 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
