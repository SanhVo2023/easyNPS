/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  Database,
  ExternalLink,
  PlusCircle,
  FolderOpen,
  Search,
  Filter,
  Star,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  Settings,
  RefreshCw,
  Copy,
  Check,
  Activity,
  Layers,
  AlertTriangle,
  Lightbulb,
  Heart,
  HelpCircle
} from 'lucide-react';
import { FeedbackEntry, SpreadsheetConfig } from '../types';

interface CreatorDashboardProps {
  user: any;
  config: SpreadsheetConfig | null;
  entries: FeedbackEntry[];
  availableSheets: Array<{ id: string; name: string }>;
  onSelectExistingSheet: (id: string, name: string) => void;
  onCreateNewSheet: () => void;
  onRefresh: () => void;
  isSyncing: boolean;
  onLogout: () => void;
}

export const CreatorDashboard: React.FC<CreatorDashboardProps> = ({
  user,
  config,
  entries,
  availableSheets,
  onSelectExistingSheet,
  onCreateNewSheet,
  onRefresh,
  isSyncing,
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRating, setSelectedRating] = useState<string>('All');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [clipboardCopied, setClipboardCopied] = useState(false);

  // Stats derivations
  const stats = useMemo(() => {
    if (entries.length === 0) {
      return { total: 0, average: 0, recommendPercentage: 0 };
    }
    const total = entries.length;
    const totalRating = entries.reduce((sum, item) => sum + item.rating, 0);
    const yesRecommend = entries.filter(item => item.wouldRecommend === 'Yes').length;
    return {
      total,
      average: Number((totalRating / total).toFixed(1)),
      recommendPercentage: Math.round((yesRecommend / total) * 100)
    };
  }, [entries]);

  // Recharts Rating Data derivation
  const ratingChartData = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    entries.forEach(entry => {
      const r = entry.rating as 1 | 2 | 3 | 4 | 5;
      if (counts[r] !== undefined) {
        counts[r]++;
      }
    });
    return [
      { name: '1 ★', count: counts[1], fill: '#ef4444' },
      { name: '2 ★', count: counts[2], fill: '#f97316' },
      { name: '3 ★', count: counts[3], fill: '#f59e0b' },
      { name: '4 ★', count: counts[4], fill: '#10b981' },
      { name: '5 ★', count: counts[5], fill: '#8b5cf6' },
    ];
  }, [entries]);

  // Recharts Category Data derivation
  const categoryChartData = useMemo(() => {
    const types: Record<string, number> = {};
    entries.forEach(entry => {
      types[entry.type] = (types[entry.type] || 0) + 1;
    });

    const categoryGradients = {
      'UI/UX Improvement': '#8b5cf6', // Indigo
      'Bug': '#ef4444', // Red
      'Feature Request': '#f59e0b', // Amber
      'Compliment': '#ec4899', // Pink
      'Other': '#3b82f6' // Blue
    };

    return Object.entries(types).map(([name, val]) => ({
      name,
      value: val,
      color: (categoryGradients as any)[name] || '#6b7280'
    }));
  }, [entries]);

  // Filter entries
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchSearch = 
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        entry.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
        entry.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchType = selectedType === 'All' || entry.type === selectedType;
      const matchRating = selectedRating === 'All' || entry.rating.toString() === selectedRating;

      return matchSearch && matchType && matchRating;
    }).reverse(); // Latest feedback first
  }, [entries, searchTerm, selectedType, selectedRating]);

  // Handle HTML Embed Snippet Copy
  const copyEmbedSnippet = () => {
    const iframeCode = `<iframe src="${window.location.href}" width="100%" height="700" style="border:none; border-radius: 16px;" allow="geolocation; microphone; camera"></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    setClipboardCopied(true);
    setTimeout(() => setClipboardCopied(false), 2000);
  };

  const getCategoryBadgeColor = (typeStr: string) => {
    switch (typeStr) {
      case 'Bug': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'Feature Request': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'UI/UX Improvement': return 'bg-violet-500/10 text-violet-400 border-violet-500/20';
      case 'Compliment': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'Mobile': return <Smartphone className="w-3.5 h-3.5 mr-1" />;
      case 'Desktop': return <Laptop className="w-3.5 h-3.5 mr-1" />;
      case 'Tablet': return <Tablet className="w-3.5 h-3.5 mr-1" />;
      default: return <Globe className="w-3.5 h-3.5 mr-1" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 md:px-0 relative z-10 select-none pb-20">
      
      {/* Top Banner / Navbar */}
      <div className="p-4 md:p-6 bg-[#111111]/85 backdrop-blur-2xl rounded-3xl border border-zinc-800/60 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="w-11 h-11 rounded-full border border-zinc-800"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center font-bold text-white uppercase shadow-inner">
              {user.displayName?.[0] || 'C'}
            </div>
          )}
          <div className="text-left">
            <h1 className="text-base md:text-lg font-sans font-semibold tracking-tight text-white">
              {user.displayName || 'Creator Console'}
            </h1>
            <p className="text-xs text-zinc-400 leading-normal">
              Managing feedback databases for {user.email}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
          <button
            onClick={onRefresh}
            disabled={isSyncing || !config}
            className="p-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800/80 text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          <button
            onClick={() => setShowConfigModal(true)}
            className="p-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-800/80 text-zinc-300 hover:bg-zinc-800 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            Switch Sheet
          </button>

          <button
            onClick={onLogout}
            className="p-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-950/10 border border-rose-900/35 text-rose-400 hover:bg-rose-900/25 active:scale-95 transition-all cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>

      {config ? (
        /* DATABASE & CHART METRICS BOARD */
        <div className="space-y-6">
          
          {/* Active Database Card */}
          <div className="p-5 md:p-6 bg-gradient-to-br from-[#111111]/90 to-[#0a0a0a]/95 backdrop-blur-2xl rounded-3xl border border-zinc-800/80 flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-4 text-left w-full md:w-auto">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Database className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm md:text-base font-bold text-white tracking-wide">{config.title}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Syncing
                  </span>
                </div>
                <div className="text-xs text-zinc-450 font-light flex items-center flex-wrap gap-x-3">
                  <span>Tab: <code className="bg-zinc-900/80 p-0.5 py-0 px-1 rounded text-[10px] text-zinc-200">{config.sheetName}</code></span>
                  <span>ID: <code className="text-[10px] text-zinc-550">{config.spreadsheetId.substring(0, 12)}...</code></span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto justify-end">
              <a 
                href={config.spreadsheetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-2xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 active:scale-95 transition-all inline-flex items-center gap-1.5 shadow-lg shadow-black/20 cursor-pointer text-center"
              >
                Open in Google Sheets <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Metrics Widget Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-5 bg-[#111111]/80 backdrop-blur-2xl rounded-2xl border border-zinc-800/50 text-left flex flex-col justify-between h-[100px] md:h-[110px]">
              <span className="text-xs text-zinc-400">Total Submissions</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold font-sans text-white">{stats.total}</span>
                <span className="text-[10px] text-zinc-500 font-mono">rows active</span>
              </div>
            </div>

            <div className="p-5 bg-[#111111]/80 backdrop-blur-2xl rounded-2xl border border-zinc-800/50 text-left flex flex-col justify-between h-[100px] md:h-[110px]">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Average Rating</span>
                <Sparkles className="w-4 h-4 text-purple-450" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold font-sans text-white">{stats.average}</span>
                <span className="text-[10px] text-zinc-500">/ 5.0 score</span>
              </div>
            </div>

            <div className="p-5 bg-[#111111]/80 backdrop-blur-2xl rounded-2xl border border-zinc-800/50 text-left flex flex-col justify-between h-[100px] md:h-[110px] col-span-2 md:col-span-1">
              <span className="text-xs text-zinc-400">Recommendation Index</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-bold font-sans text-white">{stats.recommendPercentage}%</span>
                <span className="text-[10px] text-purple-400 font-mono">advocacy percentage</span>
              </div>
            </div>
          </div>

          {/* Graphical Analytics Dashboard Section */}
          {entries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Star Ratings Curve */}
              <div className="p-5 bg-[#111111]/80 backdrop-blur-2xl rounded-3xl border border-zinc-800/50 flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Ratings Spread</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white">{stats.average} / 5</span>
                  </div>
                </div>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#52525b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#52525b" fontSize={11} allowDecimals={false} tickLine={false} />
                      <Tooltip 
                        cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} 
                        contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff', fontSize: 11 }}
                      />
                      <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                        {ratingChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Feedback Category Mix */}
              <div className="p-5 bg-[#111111]/80 backdrop-blur-2xl rounded-3xl border border-zinc-800/50 flex flex-col justify-between space-y-4">
                <h3 className="text-xs font-bold uppercase text-zinc-400 tracking-wider text-left">Feedback Mix</h3>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="h-[180px] w-[50%] md:w-[200px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xl font-bold text-white">{entries.length}</span>
                      <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Inputs</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2 text-left w-full">
                    {categoryChartData.map((cat, i) => (
                      <div key={i} className="flex items-center justify-between p-1 px-2 rounded hover:bg-zinc-900/50 transition-colors">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                          <span className="text-xs text-zinc-300 font-medium truncate max-w-[110px] sm:max-w-none">{cat.name}</span>
                        </div>
                        <div className="text-xs font-semibold text-white">
                          {cat.value} <span className="text-[10px] text-zinc-500 font-light">({Math.round((cat.value / entries.length) * 100)}%)</span>
                        </div>
                      </div>
                    ))}
                    {categoryChartData.length === 0 && (
                      <div className="text-xs text-center text-zinc-500 w-full py-2">No mix metrics computed.</div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-[#111111]/80 backdrop-blur-2xl rounded-3xl border border-zinc-800/50">
              <span className="text-xs font-mono text-zinc-500 uppercase block mb-1">Spreadsheet Mounted</span>
              <p className="text-sm font-medium text-zinc-400">The spreadsheet database is empty. Submit a response using the form to populate analytics!</p>
            </div>
          )}

          {/* Table Feed view containing items */}
          <div className="p-5 md:p-6 bg-[#111111]/80 backdrop-blur-2xl rounded-3xl border border-zinc-800/50 text-left space-y-5">
            
            {/* Headers, Filters, Search tools */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
              <div>
                <h3 className="text-sm md:text-base font-semibold text-white tracking-wide">Entries Database Raw Stream</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Filter, search, or view parsed spreadsheet lines</p>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search Text field */}
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="w-4 h-4 text-zinc-550 absolute left-3 top-[11px]" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search responses..."
                    className="w-full bg-zinc-900/60 text-white border border-zinc-800/80 hover:border-zinc-700 focus:border-blue-500/50 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none transition-all placeholder:text-zinc-650"
                  />
                </div>

                {/* Feedback Type Filter */}
                <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
                  <Filter className="w-3.5 h-3.5 text-zinc-450" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-zinc-900/60 text-xs text-zinc-300 border border-zinc-800/80 hover:border-zinc-700 rounded-xl px-2.5 py-2 focus:outline-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="All">All Types</option>
                    <option value="UI/UX Improvement">UI/UX Only</option>
                    <option value="Bug">Bugs Only</option>
                    <option value="Feature Request">Requests Only</option>
                    <option value="Compliment">Compliments Only</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                {/* Rating Filter selector */}
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="bg-zinc-900/60 text-xs text-zinc-300 border border-zinc-800/80 hover:border-zinc-700 rounded-xl px-2.5 py-2 focus:outline-none cursor-pointer w-full sm:w-auto"
                >
                  <option value="All">All Scores</option>
                  <option value="5">5 Emojis</option>
                  <option value="4">4 Emojis</option>
                  <option value="3">3 Emojis</option>
                  <option value="2">2 Emojis</option>
                  <option value="1">1 Emoji</option>
                </select>
              </div>
            </div>

            {/* Entries Feed Grid/List */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredEntries.map((entry, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-2xl bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800/50 flex flex-col md:flex-row justify-between items-start gap-4 transition-colors"
                >
                  <div className="space-y-2 text-left flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-white tracking-wide">{entry.name}</span>
                      {entry.email && (
                        <span className="text-[10px] text-zinc-500 font-mono">({entry.email})</span>
                      )}
                      <span className="text-[10px] font-mono text-zinc-500 ml-auto md:ml-0">{entry.timestamp}</span>
                    </div>

                    <p className="text-xs text-zinc-300 font-light leading-relaxed break-words">{entry.message}</p>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${getCategoryBadgeColor(entry.type)}`}>
                        {entry.type}
                      </span>
                      <span className="p-1 px-2.5 text-[9px] font-mono bg-zinc-900 text-zinc-400 rounded-md inline-flex items-center border border-zinc-800/60">
                        {getPlatformIcon(entry.platform)}
                        {entry.platform}
                      </span>
                      <span className="p-1 px-2.5 text-[9px] font-mono bg-zinc-900 text-zinc-400 rounded-md border border-zinc-800/60">
                        Recommend: {entry.wouldRecommend}
                      </span>
                    </div>
                  </div>

                  {/* Rating Badge Display */}
                  <div className="flex items-center gap-1.5 bg-zinc-900 p-1.5 px-3 rounded-xl border border-zinc-800 self-end md:self-center">
                    <span className="text-xs font-bold text-white">
                      {entry.rating === 5 ? '🤩' : entry.rating === 4 ? '😊' : entry.rating === 3 ? '😐' : entry.rating === 2 ? '😕' : '😞'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">Score {entry.rating}</span>
                  </div>
                </div>
              ))}

              {filteredEntries.length === 0 && (
                <div className="py-12 text-center text-zinc-500">
                  No submissions match the current search or filters.
                </div>
              )}
            </div>

          </div>

          {/* IFrame Embedded Snippets Widget Block */}
          <div className="p-5 md:p-6 bg-[#111111]/80 backdrop-blur-2xl rounded-3xl border border-zinc-800/50 text-left space-y-4">
            <div>
              <h3 className="text-sm md:text-base font-semibold text-white tracking-wide">Embed This Feedback Form</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Integrate this interactive form on any HTML webpage or CMS site</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest block">HTML IFRAME EXPORT</span>
              <div className="flex items-center gap-3">
                <code className="text-[10px] md:text-xs text-zinc-400 font-mono bg-black/40 p-2.5 rounded-xl flex-1 truncate block text-left border border-zinc-900">
                  {`<iframe src="${window.location.href}" width="100%" height="700" style="border:none; border-radius: 16px;" allow="geolocation; microphone; camera"></iframe>`}
                </code>
                <button
                  onClick={copyEmbedSnippet}
                  className="p-3 px-4 bg-white hover:bg-zinc-200 active:scale-95 text-black rounded-xl transition-all outline-none cursor-pointer flex items-center justify-center gap-1.5 font-semibold text-xs min-w-[100px]"
                >
                  {clipboardCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* SPREADSHEET INITIALIZATION REQUIRED */
        <div className="p-8 md:p-14 text-center bg-[#111111]/85 backdrop-blur-2xl rounded-[40px] border border-zinc-800/60 space-y-8 animate-fade-in relative z-10 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mx-auto">
            <Database className="w-8 h-8 animate-pulse text-blue-405" />
          </div>

          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-sans font-semibold text-white tracking-tight">Mount Database Spreadsheet</h2>
            <p className="text-xs md:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              We did not detect an active target feedback spreadsheet. Initialize a new feedback database or link an existing file in your Drive.
            </p>
          </div>

          <div className="space-y-4 max-w-xs mx-auto">
            <button
              onClick={onCreateNewSheet}
              disabled={isSyncing}
              className="w-full py-3.5 rounded-2xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:opacity-90 active:scale-95 transition-all text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {isSyncing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Creating in Drive...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Create Auto-Sheet
                </>
              )}
            </button>

            {availableSheets.length > 0 && (
              <div className="space-y-2 text-left pt-2">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Found in your Google Drive:</span>
                <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
                  {availableSheets.map((sh) => (
                    <button
                      key={sh.id}
                      onClick={() => onSelectExistingSheet(sh.id, sh.name)}
                      className="w-full p-3 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800 transition-all text-left truncate flex items-center text-xs font-semibold text-zinc-350 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5 mr-2 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{sh.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL VIEW TO RESET/MODIFY THE TARGET SHEET CONFIG */}
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop cover filter */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfigModal(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md cursor-pointer"
            />

            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0b0b]/95 border border-zinc-800 rounded-[30px] p-6 w-full max-w-md relative z-10 space-y-6 text-left shadow-3xl"
            >
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">Spreadsheet Database Switch</h3>
                <p className="text-xs text-zinc-400 leading-normal mt-0.5">Switch feedback lists or select alternate files in Drive</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowConfigModal(false);
                    onCreateNewSheet();
                  }}
                  className="w-full py-3 rounded-2xl text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Create New Feedback Sheet
                </button>

                <div className="border-t border-zinc-900 pt-4 space-y-2.5">
                  <span className="text-[10px] font-mono text-zinc-550 uppercase block">Link spreadsheets in Google Drive</span>
                  {availableSheets.length > 0 ? (
                    <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
                      {availableSheets.map((sh) => (
                        <button
                          key={sh.id}
                          onClick={() => {
                            onSelectExistingSheet(sh.id, sh.name);
                            setShowConfigModal(false);
                          }}
                          className="w-full p-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-800 transition-all text-left truncate flex items-center text-xs font-medium text-zinc-350 cursor-pointer"
                        >
                          <FolderOpen className="w-3.5 h-3.5 mr-2 text-blue-400 flex-shrink-0" />
                          <span className="truncate">{sh.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs text-zinc-550 py-3 text-center">
                      No matching sheets found. Existing sheets will display here when scanned.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900 flex justify-end">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold rounded-xl text-white cursor-pointer border border-zinc-800"
                >
                  Close Settings
                </button>
              </div>
            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
