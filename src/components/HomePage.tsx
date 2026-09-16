import React, { useState } from 'react';
import { Part } from '../types/sql';
import { Database, ArrowRight, Terminal, RotateCcw, ShieldCheck, Play, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const visibleParts = parts.filter(p =>
    ['part-1', 'part-2', 'part-3', 'part-4'].includes(p.id)
  );

  const [hoveredPartId, setHoveredPartId] = useState<string | null>(null);
  const [clickedPartId, setClickedPartId] = useState<string | null>(null);
  const [isTerminalHovered, setIsTerminalHovered] = useState<boolean>(false);

  const handleCardClick = (part: Part) => {
    setClickedPartId(part.id);
    // Tactile Apple delay: allow tactile compress animation to play before transitioning
    setTimeout(() => {
      onSelectPart(part);
    }, 240);
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
      tagBg: 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30',
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
      tagBg: 'bg-teal-500/15 text-teal-800 border-teal-500/30',
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
      tagBg: 'bg-sky-500/15 text-sky-800 border-sky-500/30',
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
      tagBg: 'bg-indigo-500/15 text-indigo-800 border-indigo-500/30',
      actionText: 'Explore Part 4 — Constraints & Integrity',
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-3 sm:py-6 space-y-5 sm:space-y-6">
      {/* 4 Compact Apple Liquid Glass Cards that Elaborate on Hover */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 px-1 sm:px-0">
        {visibleParts.map((part, index) => {
          const meta = partMeta[part.id] || partMeta['part-1'];
          const Icon = meta.icon;
          const isHovered = hoveredPartId === part.id;
          const isClicked = clickedPartId === part.id;

          return (
            <motion.div
              layout
              key={part.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: isClicked ? 0.95 : isHovered ? 1.015 : 1,
              }}
              transition={{
                layout: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                duration: 0.45,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1]
              }}
              onMouseEnter={() => setHoveredPartId(part.id)}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => handleCardClick(part)}
              className={`liquid-glass-card glass-sheen rounded-3xl p-4 sm:p-5 flex flex-col justify-between group cursor-pointer transition-[border-color,box-shadow,background-color] duration-300 relative overflow-hidden ${
                isHovered
                  ? 'border-white shadow-2xl ring-2 ring-emerald-500/25 bg-white/70'
                  : 'border-white/80 hover:border-white'
              }`}
            >
              {/* Internal Glass Ambient Refraction Glow */}
              <div className={`absolute -top-14 -right-14 w-36 h-36 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-300/10 blur-2xl pointer-events-none transition-all duration-500 ${
                isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-60'
              }`} />
              <div className="absolute -bottom-14 -left-14 w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-400/15 to-sky-300/10 blur-2xl pointer-events-none" />

              {/* Click Ripple Indicator */}
              {isClicked && (
                <motion.div
                  initial={{ opacity: 0.6, scale: 0.8 }}
                  animate={{ opacity: 0, scale: 1.5 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-emerald-400/20 rounded-3xl pointer-events-none"
                />
              )}

              <div className="space-y-3 relative z-10">
                {/* Header: Badge & Module Stats */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md transition-colors ${meta.tagBg}`}>
                    {meta.badge}
                  </span>
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                    <span>{meta.modulesCount}</span>
                    <span>&bull;</span>
                    <span className="font-bold text-slate-800">{meta.stepsCount}</span>
                  </div>
                </div>

                {/* Compact Content: Icon & Title */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr ${meta.gradient} text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20 transition-transform duration-300 ${
                    isHovered ? 'scale-108 rotate-2' : ''
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight truncate">
                      {part.title}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {part.subtitle}
                    </p>
                  </div>

                  {/* Micro Indicator Icon */}
                  <motion.div
                    animate={{ rotate: isHovered ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-6 h-6 rounded-full bg-white/60 border border-white/80 flex items-center justify-center text-slate-400 group-hover:text-slate-700 shadow-2xs shrink-0"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.div>
                </div>

                {/* Smooth Elaborate Section (Unfolds on Hover, Compresses Smoothly on Leave) */}
                <AnimatePresence initial={false}>
                  {isHovered && (
                    <motion.div
                      key={`elaborate-${part.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        transition: {
                          height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.26, delay: 0.06 }
                        }
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                        transition: {
                          height: { duration: 0.34, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.18, ease: 'easeOut' }
                        }
                      }}
                      className="overflow-hidden space-y-3 pt-2 border-t border-white/60"
                    >
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {part.description}
                      </p>

                      {/* Concept Tags */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Core Concepts:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {meta.highlightTags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] sm:text-[11px] font-mono font-medium px-2 py-0.5 rounded-lg bg-white/60 text-slate-700 border border-white/80 backdrop-blur-md shadow-2xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Pill Button */}
                      <div className="pt-1.5">
                        <div className={`w-full py-2 px-3.5 rounded-xl bg-gradient-to-r ${meta.gradient} text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-between transition-all duration-200`}>
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

      {/* Quick Launch Terminal Pill Strip in Frosted Glass with Elaborate & Compress Animation */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          layout: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
          delay: 0.35,
          duration: 0.4
        }}
        onMouseEnter={() => setIsTerminalHovered(true)}
        onMouseLeave={() => setIsTerminalHovered(false)}
        className={`liquid-glass glass-sheen rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5 flex flex-col gap-3 max-w-4xl mx-auto border transition-[border-color,box-shadow,background-color] duration-300 shadow-sm ${
          isTerminalHovered ? 'border-white shadow-xl bg-white/70 ring-2 ring-emerald-500/20' : 'border-white/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/60 text-slate-800 flex items-center justify-center shrink-0 border border-white/80 shadow-xs backdrop-blur-md transition-transform duration-300 ${
              isTerminalHovered ? 'scale-108 rotate-2 text-emerald-700 bg-white/90' : ''
            }`}>
              <Terminal className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>Interactive SQL Sandbox Terminal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/25">
                  MySQL 8.0 Engine
                </span>
              </div>
              <div className="text-[11px] text-slate-500">
                Run custom MySQL statements anytime with live schema inspection.
              </div>
            </div>
          </div>

          <button
            onClick={onOpenQuickTerminal}
            className="shrink-0 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current text-emerald-400" />
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
                  height: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.24, delay: 0.05 }
                }
              }}
              exit={{
                opacity: 0,
                height: 0,
                transition: {
                  height: { duration: 0.32, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.16, ease: 'easeOut' }
                }
              }}
              className="overflow-hidden pt-2.5 border-t border-white/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-800">Features:</span>
                <span className="px-2 py-0.5 rounded-md bg-white/60 border border-white/80 font-mono text-[10px] text-slate-700">
                  Direct DDL & DML
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/60 border border-white/80 font-mono text-[10px] text-slate-700">
                  Auto-commit & RollBack
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/60 border border-white/80 font-mono text-[10px] text-slate-700">
                  pandiyan_store DB Preloaded
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[10px]">
                Click "Launch Terminal" or press anytime
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
