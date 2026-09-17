import React, { useState } from 'react';
import { Part } from '../types/sql';
import { Database, ArrowRight, Terminal, RotateCcw, ShieldCheck, Play, ChevronDown, KeyRound, Sparkles, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useIsMobile } from '../utils/useIsMobile';

interface HomePageProps {
  parts: Part[];
  onSelectPart: (part: Part) => void;
  onOpenQuickTerminal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  parts,
  onSelectPart,
  onOpenQuickTerminal,
}) => {
  const isMobile = useIsMobile();
  const visibleParts = parts;

  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [clickedPartId, setClickedPartId] = useState<string | null>(null);
  const [isTerminalHovered, setIsTerminalHovered] = useState<boolean>(false);

  const handleCardClick = (part: Part) => {
    setClickedPartId(part.id);
    // Tactile inward press animation with delay before entering
    setTimeout(() => {
      onSelectPart(part);
    }, 220);
  };

  const partMeta: Record<string, {
    color: string;
    badge: string;
    icon: React.ComponentType<{ className?: string }>;
    highlightTags: string[];
    stepsCount: string;
    modulesCount: string;
    gradient: string;
    tagBg: string;
    actionText: string;
  }> = {
    'part-1': {
      color: 'emerald',
      badge: 'Part 1 • DDL Basics',
      icon: Database,
      highlightTags: [
        'CREATE / DROP DATABASE',
        'READ ONLY Protection',
        'CREATE TABLE Schema',
        'RENAME TABLE',
        'ADD / MODIFY / DROP Column',
        'FIRST & AFTER Column Morphing'
      ],
      stepsCount: '16 Steps',
      modulesCount: '3 Modules',
      gradient: 'from-emerald-600 to-teal-600',
      tagBg: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
      actionText: 'Explore Part 1 — DDL Operations',
    },
    'part-2': {
      color: 'teal',
      badge: 'Part 2 • DML & Queries',
      icon: Terminal,
      highlightTags: [
        'Single & Multi-Row INSERT',
        'Partial Column & NULL',
        'SELECT Projections',
        'Column Aliases with AS',
        'WHERE Filter Predicates',
        'IS NULL & IS NOT NULL'
      ],
      stepsCount: '15 Steps',
      modulesCount: '2 Modules',
      gradient: 'from-teal-600 to-cyan-600',
      tagBg: 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30',
      actionText: 'Explore Part 2 — Insert & Where',
    },
    'part-3': {
      color: 'sky',
      badge: 'Part 3 • DML & Transactions',
      icon: RotateCcw,
      highlightTags: [
        'UPDATE Query (1:18:29)',
        'SET sql_safe_updates = 0',
        'DELETE Query (1:21:46)',
        'DELETE WHERE ph_no IS NULL',
        'SET autocommit = 0',
        'ROLLBACK & COMMIT Safety',
        'CURRENT_DATE(), NOW(), TIME'
      ],
      stepsCount: '17 Steps',
      modulesCount: '4 Modules',
      gradient: 'from-sky-600 to-blue-600',
      tagBg: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30',
      actionText: 'Explore Part 3 — Update, Delete & RollBack',
    },
    'part-4': {
      color: 'indigo',
      badge: 'Part 4 • Constraints',
      icon: ShieldCheck,
      highlightTags: [
        'NOT NULL Constraint',
        'UNIQUE Key Constraints',
        'Duplicate Value Rejection',
        'CHECK Constraint (price <= 200)',
        'DROP & ADD Constraint',
        'DEFAULT Values (price 5.0)',
        'ALTER COLUMN SET DEFAULT'
      ],
      stepsCount: '21 Steps',
      modulesCount: '3 Modules',
      gradient: 'from-indigo-600 to-purple-600',
      tagBg: 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 border-indigo-500/30',
      actionText: 'Explore Part 4 — Constraints & Integrity',
    },
    'part-5': {
      color: 'violet',
      badge: 'Part 5 • Primary Keys & Auto Increment',
      icon: KeyRound,
      highlightTags: [
        'PRIMARY KEY Definition',
        'Duplicate Rejection (Error 1062)',
        'NULL Key Rejection (Error 1048)',
        'Column Count Check (Error 1136)',
        'AUTO_INCREMENT Column',
        'Multiple PK Defined (Error 1068)',
        'MODIFY col AUTO_INCREMENT',
        'AUTO_INCREMENT = 200 Seed'
      ],
      stepsCount: '18 Steps',
      modulesCount: '3 Modules',
      gradient: 'from-violet-600 to-fuchsia-600',
      tagBg: 'bg-violet-500/15 text-violet-800 dark:text-violet-300 border-violet-500/30',
      actionText: 'Explore Part 5 — Primary Keys & Auto Increment',
    },
    'part-6': {
      color: 'teal',
      badge: 'Part 6 • Foreign Keys & Referential Integrity',
      icon: Link2,
      highlightTags: [
        'Parent Table (customers)',
        'AUTO_INCREMENT c_id',
        'FOREIGN KEY (customer_id)',
        'REFERENCES customers(c_id)',
        'Child Table (transactions)',
        'DROP FOREIGN KEY transactions_ibfk_1',
        'ADD CONSTRAINT fk_c_id',
        'Protected Deletion (Error 1451)'
      ],
      stepsCount: '10 Steps',
      modulesCount: '3 Modules',
      gradient: 'from-emerald-600 to-teal-600',
      tagBg: 'bg-teal-500/15 text-teal-800 dark:text-teal-300 border-teal-500/30',
      actionText: 'Explore Part 6 — Foreign Keys & Referential Integrity',
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2 sm:py-5 space-y-4 sm:space-y-5">
      {/* Compact Interactive Curriculum Cards with Smooth Hover Elaborate & Smooth Compression */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 px-1 sm:px-0">
        {visibleParts.map((part, index) => {
          const meta = partMeta[part.id] || partMeta['part-5'];
          const Icon = meta.icon;
          const isHovered = !isMobile && hoveredPartId === part.id;
          const isClicked = clickedPartId === part.id;

          return (
            <motion.div
              layout={!isMobile}
              key={part.id}
              initial={isMobile ? false : { opacity: 0, y: 16 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isClicked ? 0.94 : isHovered ? 1.012 : 1,
              }}
              transition={
                isMobile
                  ? { duration: 0.16, ease: 'easeOut' }
                  : {
                      scale: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                      layout: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                      duration: 0.35,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1]
                    }
              }
              onMouseEnter={() => setHoveredPartId(part.id)}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => handleCardClick(part)}
              className={`liquid-glass-card glass-sheen rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 flex flex-col justify-between group cursor-pointer transition-[border-color,box-shadow,background-color] duration-300 relative overflow-hidden ${
                isHovered
                  ? 'border-white shadow-xl ring-2 ring-emerald-500/25 bg-white/80 dark:bg-slate-900/85'
                  : 'border-white/80 hover:border-white bg-white/60 dark:bg-slate-900/60'
              }`}
            >
              {/* Internal Glass Ambient Refraction Glow - Hidden on mobile to prevent GPU lag */}
              <div className={`hidden md:block absolute -top-14 -right-14 w-36 h-36 rounded-full bg-gradient-to-br from-emerald-400/15 to-teal-300/10 blur-2xl pointer-events-none transition-all duration-500 ${
                isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-50'
              }`} />
              <div className="hidden md:block absolute -bottom-14 -left-14 w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400/15 to-sky-300/10 blur-2xl pointer-events-none" />

              {/* Click Ripple / Tactile Inward Press Indicator */}
              {isClicked && (
                <motion.div
                  initial={{ opacity: 0.5, scale: 0.9 }}
                  animate={{ opacity: 0, scale: 1.3 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-2xl sm:rounded-3xl pointer-events-none"
                />
              )}

              <div className="space-y-2.5 relative z-10">
                {/* Header: Badge & Module Stats */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md transition-colors ${meta.tagBg}`}>
                    {meta.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
                    <span>{meta.modulesCount}</span>
                    <span>&bull;</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{meta.stepsCount}</span>
                  </div>
                </div>

                {/* Compact Content: Icon & Title */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${meta.gradient} text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20 transition-transform duration-300 ${
                    isHovered ? 'scale-105 rotate-1' : ''
                  }`}>
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug truncate">
                      {part.title}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                      {part.subtitle}
                    </p>
                  </div>

                  {/* Micro Expansion Indicator */}
                  <motion.div
                    animate={{ rotate: isHovered ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-5.5 h-5.5 rounded-full bg-white/60 dark:bg-slate-800/70 border border-white/80 dark:border-slate-700/80 flex items-center justify-center text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 shadow-2xs shrink-0"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                </div>

                {/* Smooth Elaborate Section (Unfolds on Hover, Compresses Smoothly on Mouse Leave) */}
                <AnimatePresence initial={false}>
                  {isHovered && (
                    <motion.div
                      key={`elaborate-${part.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        transition: {
                          height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.22, delay: 0.05 }
                        }
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: {
                          height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.16, ease: 'easeOut' }
                        }
                      }}
                      className="overflow-hidden space-y-2.5 pt-2 border-t border-white/60 dark:border-slate-800/60"
                    >
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {part.description}
                      </p>

                      {/* Concept Tags */}
                      <div className="space-y-1">
                        <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          Core Concepts:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {meta.highlightTags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/60 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border border-white/80 dark:border-slate-700/80 backdrop-blur-md shadow-2xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Pill Button */}
                      <div className="pt-1">
                        <div className={`w-full py-1.5 px-3 rounded-xl bg-gradient-to-r ${meta.gradient} text-white font-bold text-xs shadow-sm shadow-emerald-600/20 flex items-center justify-between transition-all duration-200`}>
                          <span>{meta.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Launch Terminal Pill Strip in Frosted Glass */}
      <motion.div
        layout={!isMobile}
        initial={isMobile ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          isMobile
            ? { duration: 0.16 }
            : {
                layout: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                delay: 0.25,
                duration: 0.35
              }
        }
        onMouseEnter={() => !isMobile && setIsTerminalHovered(true)}
        onMouseLeave={() => !isMobile && setIsTerminalHovered(false)}
        className={`liquid-glass glass-sheen rounded-2xl sm:rounded-3xl p-3 sm:p-4 flex flex-col gap-2.5 max-w-4xl mx-auto border transition-[border-color,box-shadow,background-color] duration-300 shadow-sm ${
          isTerminalHovered
            ? 'border-white shadow-lg bg-white/80 dark:bg-slate-900/80 ring-2 ring-emerald-500/20'
            : 'border-white/80 dark:border-slate-800/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 text-center sm:text-left">
            <div className={`w-8 h-8 rounded-xl bg-white/60 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 flex items-center justify-center shrink-0 border border-white/80 dark:border-slate-700/80 shadow-xs backdrop-blur-md transition-transform duration-300 ${
              isTerminalHovered ? 'scale-105 rotate-1 text-emerald-700 dark:text-emerald-400 bg-white/90' : ''
            }`}>
              <Terminal className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>Interactive SQL Sandbox Terminal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25">
                  MySQL 8.0 Engine
                </span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Execute live MySQL DDL & DML statements with real-time visual schema state inspection.
              </div>
            </div>
          </div>

          <button
            onClick={onOpenQuickTerminal}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <Play className="w-3 h-3 fill-current text-emerald-400 dark:text-white" />
            <span>Launch Terminal</span>
          </button>
        </div>

        {/* Terminal Elaborate Section on Hover */}
        <AnimatePresence initial={false}>
          {isTerminalHovered && (
            <motion.div
              key="terminal-elaborate"
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: 1,
                height: 'auto',
                transition: {
                  height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.2, delay: 0.05 }
                }
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  height: { duration: 0.26, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.14, ease: 'easeOut' }
                }
              }}
              className="overflow-hidden pt-2 border-t border-white/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2"
            >
              <span>Instant playground for DDL, INSERTs, Transactions, Constraints, and Primary Keys.</span>
              <span className="text-[10px] font-mono text-emerald-800 dark:text-emerald-300 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                Active Catalog: pandiyan_store
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
