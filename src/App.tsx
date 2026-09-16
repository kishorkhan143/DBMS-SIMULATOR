import React, { useState, useEffect } from 'react';
import { CURRICULUM_PARTS } from './data/curriculum';
import { Part, Topic, SystemCatalog } from './types/sql';
import { createInitialCatalog } from './engine/sqlEngine';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { PartSelector } from './components/PartSelector';
import { TopicViewer } from './components/TopicViewer';
import { PracticeConsole } from './components/PracticeConsole';
import { QuizLab } from './components/QuizLab';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [viewMode, setViewMode] = useState<'home' | 'workspace'>('home');
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'quiz'>('learn');
  const [selectedPartId, setSelectedPartId] = useState<string>('part-1');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('topic-1-1');
  const [catalog, setCatalog] = useState<SystemCatalog>(createInitialCatalog());
  const [terminalInitialQuery, setTerminalInitialQuery] = useState<string>('show databases;');

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sql_app_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('sql_app_theme', theme);
    } catch {
      // Ignore quota/private mode errors
    }
  }, [theme]);

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
  };

  const currentPart = CURRICULUM_PARTS.find(p => p.id === selectedPartId) || CURRICULUM_PARTS[0];
  const currentTopic = currentPart.topics.find(t => t.id === selectedTopicId) || currentPart.topics[0];

  // Selecting a part transitions from Home to Workspace
  const handleSelectPart = (part: Part) => {
    setSelectedPartId(part.id);
    if (part.topics.length > 0) {
      setSelectedTopicId(part.topics[0].id);
    }
    setViewMode('workspace');
    setActiveTab('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopic = (topic: Topic) => {
    setSelectedTopicId(topic.id);
  };

  const handleSendToTerminal = (sql: string) => {
    setTerminalInitialQuery(sql);
    setViewMode('workspace');
    setActiveTab('practice');
  };

  const handleOpenQuickTerminal = () => {
    setViewMode('workspace');
    setActiveTab('practice');
  };

  const handleResetDatabase = () => {
    setCatalog(createInitialCatalog());
  };

  return (
    <div className={`min-h-screen relative flex flex-col transition-colors duration-500 overflow-x-hidden selection:bg-emerald-500 selection:text-white font-['Plus_Jakarta_Sans',sans-serif] ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-[#090d16] via-[#0d1424] to-[#070a12] text-slate-100 dark'
        : 'bg-gradient-to-br from-[#f3f7fc] via-[#edf3fa] to-[#f6f9fd] text-slate-900'
    }`}>
      {/* Dynamic Ambient Liquid Mesh - High Chroma Under Glass for Maximum Refraction */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-opacity duration-700">
        {/* Glowing Emerald / Mint Top-Left Liquid Aura */}
        <div className={`absolute -top-24 -left-24 w-[620px] h-[620px] rounded-full blur-[110px] transition-all duration-700 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-emerald-500/22 via-teal-500/15 to-cyan-400/10'
            : 'bg-gradient-to-br from-emerald-400/30 via-teal-400/20 to-cyan-300/10'
        }`} />
        
        {/* Deep Sky / Azure Top-Right Liquid Orb */}
        <div className={`absolute top-12 -right-24 w-[680px] h-[680px] rounded-full blur-[120px] transition-all duration-700 ${
          theme === 'dark'
            ? 'bg-gradient-to-bl from-cyan-500/20 via-sky-500/20 to-blue-600/15'
            : 'bg-gradient-to-bl from-cyan-400/30 via-sky-400/25 to-blue-400/15'
        }`} />
        
        {/* Soft Indigo / Purple Center-Right Light Orb */}
        <div className={`absolute top-1/2 -right-32 w-[580px] h-[580px] rounded-full blur-[130px] transition-all duration-700 ${
          theme === 'dark'
            ? 'bg-gradient-to-tl from-indigo-500/20 via-purple-600/15 to-transparent'
            : 'bg-gradient-to-tl from-indigo-300/20 via-purple-300/15 to-transparent'
        }`} />
        
        {/* Radiant Emerald-Teal Center-Left Orb */}
        <div className={`absolute top-1/3 -left-32 w-[550px] h-[550px] rounded-full blur-[120px] transition-all duration-700 ${
          theme === 'dark'
            ? 'bg-gradient-to-tr from-teal-500/20 via-emerald-600/15 to-transparent'
            : 'bg-gradient-to-tr from-teal-400/25 via-emerald-300/20 to-transparent'
        }`} />

        {/* Bottom Ambient Aurora Wave */}
        <div className={`absolute -bottom-36 left-1/4 w-[700px] h-[700px] rounded-full blur-[130px] transition-all duration-700 ${
          theme === 'dark'
            ? 'bg-gradient-to-t from-cyan-500/15 via-teal-600/15 to-emerald-500/10'
            : 'bg-gradient-to-t from-cyan-300/25 via-teal-300/20 to-emerald-300/10'
        }`} />
      </div>

      {/* Floating Ultra-Frosted Glass Navigation Bar with Theme Changer at Top */}
      <Navigation
        viewMode={viewMode}
        onNavigateHome={() => setViewMode('home')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPartId={selectedPartId}
        onSelectPart={(partId) => {
          setSelectedPartId(partId);
          setViewMode('workspace');
          setActiveTab('learn');
        }}
        catalog={catalog}
        onResetDatabase={handleResetDatabase}
        theme={theme}
        onSetTheme={handleSetTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          {viewMode === 'home' ? (
            /* HOME VIEW: STRICTLY PART 1 & PART 2 ONLY */
            <motion.div
              key="home-view"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <HomePage
                parts={CURRICULUM_PARTS}
                onSelectPart={handleSelectPart}
                onOpenQuickTerminal={handleOpenQuickTerminal}
              />
            </motion.div>
          ) : (
            /* WORKSPACE VIEW: DISPLAYED AFTER USER TOUCHES ANY PART */
            <motion.div
              key="workspace-view"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'learn' && (
                  <motion.div
                    key="learn"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="space-y-5"
                  >
                    {/* Part Selector & Module Switcher */}
                    <PartSelector
                      parts={CURRICULUM_PARTS}
                      selectedPart={currentPart}
                      selectedTopic={currentTopic}
                      onSelectPart={(part) => {
                        setSelectedPartId(part.id);
                        if (part.topics.length > 0) {
                          setSelectedTopicId(part.topics[0].id);
                        }
                      }}
                      onSelectTopic={handleSelectTopic}
                    />

                    {/* Selected Topic: Definitions & Interactive Table Animation Move */}
                    <TopicViewer
                      topic={currentTopic}
                      onSendToTerminal={handleSendToTerminal}
                      onOpenQuiz={() => setActiveTab('quiz')}
                    />
                  </motion.div>
                )}

                {activeTab === 'practice' && (
                  <motion.div
                    key="practice"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="space-y-5"
                  >
                    <div className="liquid-glass glass-sheen rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/80 shadow-sm">
                      <div>
                        <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                          Interactive MySQL Practice Terminal & Engine
                        </h1>
                        <p className="text-xs text-slate-600">
                          Execute MySQL DDL, DML, column aliases, projections, and WHERE clauses in real time.
                        </p>
                      </div>
                      <span className="self-start sm:self-auto text-[11px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 border border-emerald-500/25 font-semibold backdrop-blur-md">
                        Engine Ready
                      </span>
                    </div>

                    <PracticeConsole
                      catalog={catalog}
                      onUpdateCatalog={setCatalog}
                      initialQuery={terminalInitialQuery}
                    />
                  </motion.div>
                )}

                {activeTab === 'quiz' && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    className="py-2"
                  >
                    <QuizLab />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
