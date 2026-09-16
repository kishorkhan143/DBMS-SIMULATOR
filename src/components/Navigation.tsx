import React from 'react';
import { Database, Terminal, CheckCircle2, RotateCcw, Lock, Unlock, Layers, ArrowLeft, Sparkles, Sun, Moon } from 'lucide-react';
import { SystemCatalog } from '../types/sql';
import { motion } from 'motion/react';

interface NavigationProps {
  viewMode: 'home' | 'workspace';
  onNavigateHome: () => void;
  activeTab: 'learn' | 'practice' | 'quiz';
  setActiveTab: (tab: 'learn' | 'practice' | 'quiz') => void;
  selectedPartId: string;
  onSelectPart: (partId: string) => void;
  catalog: SystemCatalog;
  onResetDatabase: () => void;
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  viewMode,
  onNavigateHome,
  activeTab,
  setActiveTab,
  selectedPartId,
  onSelectPart,
  catalog,
  onResetDatabase,
  theme,
  onSetTheme,
}) => {
  const currentDb = catalog.currentDatabase ? catalog.databases[catalog.currentDatabase] : null;

  const tabs = [
    { id: 'learn' as const, label: 'Visual Lessons', icon: Layers },
    { id: 'practice' as const, label: 'SQL Terminal', icon: Terminal },
    { id: 'quiz' as const, label: 'Quiz Lab', icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3 pb-2 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="liquid-glass-dock glass-sheen rounded-2xl sm:rounded-full px-3.5 sm:px-6 py-2.5 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300">
          
          {/* Logo & Brand / Back to Home Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {viewMode === 'workspace' && (
              <motion.button
                whileHover={{ scale: 1.04, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateHome}
                title="Return to Home"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/50 hover:bg-white/80 text-slate-800 text-xs font-semibold border border-white/70 shadow-xs backdrop-blur-md transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">All Parts</span>
                <span className="sm:hidden">Home</span>
              </motion.button>
            )}

            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none cursor-pointer"
            >
              <div className="relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-[1px] shadow-md shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-shadow">
                  <div className="w-full h-full rounded-[11px] bg-white/75 backdrop-blur-md flex items-center justify-center">
                    <Database className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-bold text-slate-900 text-sm sm:text-base tracking-tight font-sans">
                    SQL Visualizer
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Apple-style Segmented Glass Control (Visible in Workspace Mode) */}
          {viewMode === 'workspace' && (
            <nav className="flex items-center p-1 rounded-full bg-white/40 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 backdrop-blur-xl relative shadow-inner">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors z-10 cursor-pointer ${
                      isActive ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navTabIndicator"
                        className="absolute inset-0 rounded-full bg-white/90 dark:bg-slate-800 border border-white dark:border-slate-700 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.3)] backdrop-blur-lg -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'text-emerald-600 dark:text-emerald-400 scale-110' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="tracking-tight hidden sm:inline">{tab.label}</span>
                    <span className="tracking-tight sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Status Capsule, Theme Changer & Reset */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Changer Switcher Capsule */}
            <div className="flex items-center p-1 rounded-full bg-white/45 dark:bg-slate-800/60 border border-white/65 dark:border-white/15 backdrop-blur-xl shadow-inner transition-colors duration-300">
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`relative px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                  theme === 'light'
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Switch to Clean Light Theme"
                aria-label="Light Theme"
              >
                {theme === 'light' && (
                  <motion.div
                    layoutId="themeCapsuleIndicator"
                    className="absolute inset-0 rounded-full bg-white shadow-xs border border-white/80 -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Sun className={`w-3.5 h-3.5 transition-transform duration-300 ${theme === 'light' ? 'text-amber-500 rotate-0 scale-105' : 'text-slate-400'}`} />
                <span className="hidden md:inline text-[11px] tracking-tight">Light</span>
              </button>

              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`relative px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none ${
                  theme === 'dark'
                    ? 'text-white font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Switch to Midnight Dark Theme"
                aria-label="Dark Theme"
              >
                {theme === 'dark' && (
                  <motion.div
                    layoutId="themeCapsuleIndicator"
                    className="absolute inset-0 rounded-full bg-slate-900/90 shadow-xs border border-slate-700/80 -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Moon className={`w-3.5 h-3.5 transition-transform duration-300 ${theme === 'dark' ? 'text-sky-400 -rotate-12 scale-105' : 'text-slate-400'}`} />
                <span className="hidden md:inline text-[11px] tracking-tight">Dark</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/45 dark:bg-slate-800/50 border border-white/65 dark:border-white/15 text-xs backdrop-blur-md shadow-2xs transition-colors duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">DB:</span>
              <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 text-xs">
                {catalog.currentDatabase || 'None'}
              </span>

              {currentDb && (
                <span
                  title={currentDb.isReadOnly ? 'Database is READ ONLY (Protected)' : 'Database is READ/WRITE'}
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    currentDb.isReadOnly
                      ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {currentDb.isReadOnly ? (
                    <>
                      <Lock className="w-2.5 h-2.5" />
                      <span>RO</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-2.5 h-2.5" />
                      <span>RW</span>
                    </>
                  )}
                </span>
              )}
            </div>

            <button
              onClick={onResetDatabase}
              title="Reset in-memory database to initial clean state"
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-full bg-white/50 dark:bg-slate-800/60 hover:bg-white/80 dark:hover:bg-slate-700 active:scale-95 text-slate-700 dark:text-slate-200 hover:text-slate-900 border border-white/70 dark:border-white/15 shadow-xs backdrop-blur-md transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
              <span className="hidden sm:inline text-[11px]">Reset DB</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
