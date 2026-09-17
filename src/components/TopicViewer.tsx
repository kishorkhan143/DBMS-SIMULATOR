import React, { useState } from 'react';
import { Topic, CommandStep, ColumnSchema } from '../types/sql';
import { useIsMobile } from '../utils/useIsMobile';
import {
  Play,
  RotateCcw,
  Terminal,
  Database,
  Table as TableIcon,
  HelpCircle,
  Copy,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Info,
  Layers,
  BookOpen,
  ArrowRight,
  Lock,
  Unlock,
  CornerDownRight,
  Key,
  AlertTriangle,
  Link2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopicViewerProps {
  topic: Topic;
  onSendToTerminal: (sql: string) => void;
  onOpenQuiz: () => void;
}

export const TopicViewer: React.FC<TopicViewerProps> = ({
  topic,
  onSendToTerminal,
  onOpenQuiz,
}) => {
  const isMobile = useIsMobile();
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [isShowingAfterState, setIsShowingAfterState] = useState<boolean>(true);
  const [animationPlaying, setAnimationPlaying] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [activeViewTab, setActiveViewTab] = useState<'visualizer' | 'concepts'>('visualizer');

  // Keep step index valid if topic changes
  const currentStep: CommandStep = topic.steps[selectedStepIndex] || topic.steps[0];

  const handleCopy = (sqlText: string) => {
    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handlePlayAnimation = () => {
    setIsShowingAfterState(false);
    setAnimationPlaying(true);
    setTimeout(() => {
      setIsShowingAfterState(true);
      setAnimationPlaying(false);
    }, 600);
  };

  const activeState = (isShowingAfterState ? currentStep.afterState : currentStep.beforeState) || currentStep.afterState;
  const columnsToRender: ColumnSchema[] = activeState?.columns || [];
  const rowsToRender = activeState?.rows || [];
  const explanations = Array.isArray(currentStep.explanation)
    ? currentStep.explanation
    : [currentStep.explanation];
  const takeaways = currentStep.keyTakeaways || [];

  return (
    <div className="space-y-5">
      {/* Module Overview Header in Ultra-Frosted Liquid Glass */}
      <div className="liquid-glass glass-sheen rounded-3xl p-5 sm:p-6 border border-white/85 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/25 backdrop-blur-md">
                Active Module
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {topic.steps.length} sequential execution stages
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {topic.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {topic.description}
            </p>
          </div>

          {/* Module Controls Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="inline-flex rounded-full p-1 bg-white/45 border border-white/70 backdrop-blur-xl shadow-inner">
              <button
                onClick={() => setActiveViewTab('visualizer')}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewTab === 'visualizer' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeViewTab === 'visualizer' && (
                  <motion.div
                    layoutId="viewTabIndicator"
                    className="absolute inset-0 rounded-full bg-white/90 border border-white shadow-xs backdrop-blur-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Visual Engine</span>
                </span>
              </button>

              <button
                onClick={() => setActiveViewTab('concepts')}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  activeViewTab === 'concepts' ? 'text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeViewTab === 'concepts' && (
                  <motion.div
                    layoutId="viewTabIndicator"
                    className="absolute inset-0 rounded-full bg-white/90 border border-white shadow-xs backdrop-blur-md -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Syntax & Concepts</span>
                </span>
              </button>
            </div>

            <button
              onClick={onOpenQuiz}
              title="Take Quick Knowledge Check"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/50 hover:bg-white/80 active:scale-95 text-slate-700 hover:text-slate-900 border border-white/75 text-xs font-semibold backdrop-blur-md shadow-2xs transition-all cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quiz Lab</span>
            </button>
          </div>
        </div>
      </div>

      {activeViewTab === 'visualizer' ? (
        /* INTERACTIVE VISUALIZER STAGE */
        <div className="space-y-4">
          {/* Step Timeline Carousel in Liquid Glass */}
          <div className="liquid-glass-dock glass-sheen rounded-2xl sm:rounded-3xl p-4 border border-white/80 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-800">
                  Execution Sequence
                </span>
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (selectedStepIndex > 0) {
                      setSelectedStepIndex(selectedStepIndex - 1);
                      setIsShowingAfterState(true);
                    }
                  }}
                  disabled={selectedStepIndex === 0}
                  className="p-1.5 rounded-xl bg-white/50 hover:bg-white/80 disabled:opacity-30 text-slate-700 text-xs border border-white/75 backdrop-blur-md transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-slate-600 px-2 font-semibold">
                  {selectedStepIndex + 1} / {topic.steps.length}
                </span>
                <button
                  onClick={() => {
                    if (selectedStepIndex < topic.steps.length - 1) {
                      setSelectedStepIndex(selectedStepIndex + 1);
                      setIsShowingAfterState(true);
                    }
                  }}
                  disabled={selectedStepIndex === topic.steps.length - 1}
                  className="p-1.5 rounded-xl bg-white/50 hover:bg-white/80 disabled:opacity-30 text-slate-700 text-xs border border-white/75 backdrop-blur-md transition-colors cursor-pointer shadow-2xs"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Step Capsules */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
              {topic.steps.map((step, sIdx) => {
                const isSelected = selectedStepIndex === sIdx;
                return (
                  <button
                    key={step.id}
                    onClick={() => {
                      setSelectedStepIndex(sIdx);
                      setIsShowingAfterState(true);
                    }}
                    className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer backdrop-blur-md ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 border border-emerald-500/50'
                        : 'bg-white/50 text-slate-700 hover:text-slate-900 hover:bg-white/80 border border-white/70 shadow-2xs'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-white text-emerald-800' : 'bg-slate-200/70 text-slate-800'
                    }`}>
                      {sIdx + 1}
                    </span>
                    <span className="tracking-tight whitespace-nowrap">{step.title || step.actionLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Liquid Glass Command Console Banner */}
          <div className="liquid-glass-card glass-sheen rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-white/85 shadow-sm">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/30 backdrop-blur-sm">
                  {currentStep.commandType || 'SQL'}
                </span>
                <span className="text-xs text-slate-700 font-medium truncate">
                  {currentStep.description || currentStep.actionLabel}
                </span>
              </div>
              <div className="relative group">
                <pre className="font-mono text-xs sm:text-sm text-emerald-400 bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {currentStep.sql}
                </pre>
                <button
                  onClick={() => handleCopy(currentStep.sql)}
                  title="Copy SQL"
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-xs"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handlePlayAnimation}
                disabled={animationPlaying}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer disabled:opacity-60"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{animationPlaying ? 'Morphing...' : 'Replay Animation'}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSendToTerminal(currentStep.sql)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/60 hover:bg-white/90 text-slate-800 font-semibold text-xs border border-white/80 shadow-xs backdrop-blur-md transition-all cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Run in Terminal</span>
              </motion.button>
            </div>
          </div>

          {/* Liquid Glass Interactive Visual Stage with Deep Blur */}
          <div className="liquid-glass-card glass-sheen rounded-3xl p-5 sm:p-6 space-y-5 border border-white/85 shadow-md">
            {/* State Switcher & Environment Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-600 text-[11px] font-semibold">Rendered State:</span>
                <div className="inline-flex rounded-full border border-white/70 bg-white/40 p-0.5 backdrop-blur-md shadow-inner">
                  <button
                    onClick={() => setIsShowingAfterState(false)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      !isShowingAfterState
                        ? 'bg-white text-slate-900 shadow-xs border border-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Before Query
                  </button>
                  <button
                    onClick={() => setIsShowingAfterState(true)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                      isShowingAfterState
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    After Execution
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 font-mono text-slate-600 text-xs">
                <Database className="w-3.5 h-3.5 text-emerald-600" />
                <span>DB: <strong className="text-slate-800">{activeState.databaseName || 'None'}</strong></span>
                {activeState.isReadOnly && (
                  <span className="flex items-center gap-1 text-[10px] text-amber-800 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold backdrop-blur-sm">
                    <Lock className="w-2.5 h-2.5" />
                    READ ONLY
                  </span>
                )}
              </div>
            </div>

            {/* Database Catalog Representation (SHOW/CREATE/DROP DB) */}
            {activeState.availableDatabases && (
              <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/70 space-y-3 shadow-2xs">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>MySQL Storage Catalogs</span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <AnimatePresence>
                    {activeState.availableDatabases.map((dbName) => {
                      const isTarget = currentStep.highlightDetails?.databaseName === dbName;
                      const isNew = isTarget && isShowingAfterState && currentStep.animationType === 'create_db';

                      return (
                        <motion.div
                          key={dbName}
                          layout={!isMobile}
                          initial={isMobile ? false : { opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.6 }}
                          transition={isMobile ? { duration: 0.15 } : { type: 'spring', stiffness: 350, damping: 25 }}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono border backdrop-blur-md transition-all ${
                            isNew
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20 font-bold'
                              : isTarget
                              ? 'bg-emerald-500/10 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-white/60 border-white/80 text-slate-700 shadow-2xs'
                          }`}
                        >
                          <Database className="w-3 h-3 text-emerald-600" />
                          <span className="font-semibold">{dbName}</span>
                          {dbName === 'pandiyan_store' && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-800 px-1.5 py-0.5 rounded-full font-bold">
                              target
                            </span>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Engine Response Message (e.g. Query OK, ERROR 1062, etc.) */}
            {currentStep.statusMessage && (
              <div className={`p-3.5 rounded-2xl border text-xs font-mono flex items-start gap-2.5 shadow-2xs backdrop-blur-md ${
                currentStep.statusMessage.startsWith('ERROR')
                  ? 'bg-rose-500/15 border-rose-500/35 text-rose-950 dark:text-rose-200'
                  : 'bg-emerald-500/15 border-emerald-500/35 text-emerald-950 dark:text-emerald-200'
              }`}>
                {currentStep.statusMessage.startsWith('ERROR') ? (
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : (
                  <Terminal className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 whitespace-pre-wrap leading-relaxed">
                  {currentStep.statusMessage}
                </div>
              </div>
            )}

            {/* Table Morphing Grid Stage in Ultra-Frosted Liquid Glass */}
            {activeState.tableName ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs text-slate-500">Active View:</span>
                    <motion.span
                      key={activeState.tableName}
                      initial={isMobile ? false : { scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-mono text-xs font-bold text-emerald-800 bg-emerald-500/15 px-2.5 py-1 rounded-xl border border-emerald-500/30 backdrop-blur-sm"
                    >
                      {activeState.tableName}
                    </motion.span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono font-medium">
                    {columnsToRender.length} Columns &bull; {rowsToRender.length} Rows
                  </span>
                </div>

                {/* Active Foreign Key Constraints Info */}
                {activeState.foreignKeys && activeState.foreignKeys.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/25 backdrop-blur-md">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 dark:text-blue-300 flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      Foreign Key Constraints:
                    </span>
                    {activeState.foreignKeys.map((fk) => (
                      <span key={fk.name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-500/20 text-blue-900 dark:text-blue-200 text-xs font-mono font-semibold">
                        <span className="font-bold">{fk.name}:</span>
                        <span>{fk.column} &rarr; {fk.referencedTable}({fk.referencedColumn})</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Frosted Table Grid */}
                <div className="overflow-x-auto rounded-2xl border border-white/80 bg-white/40 backdrop-blur-xl shadow-xs custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/70 bg-white/60 backdrop-blur-md">
                        {columnsToRender.map((col, idx) => {
                          const isHighlighted =
                            currentStep.highlightDetails?.columnName === col.name ||
                            currentStep.highlightDetails?.newColumnName === col.name;

                          return (
                            <motion.th
                              key={col.name}
                              layout={!isMobile}
                              transition={isMobile ? { duration: 0.15 } : { type: 'spring', stiffness: 350, damping: 28 }}
                              className={`p-3.5 text-xs font-semibold font-mono border-r border-white/60 transition-colors ${
                                isHighlighted && isShowingAfterState
                                  ? 'bg-emerald-500/20 text-emerald-950 ring-2 ring-emerald-400/50 backdrop-blur-md'
                                  : 'text-slate-800'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="font-bold truncate">{col.name}</span>
                                  {col.isPrimary && (
                                    <span title="Primary Key" className="inline-flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/40 font-bold shrink-0">
                                      <Key className="w-2.5 h-2.5" />
                                      PK
                                    </span>
                                  )}
                                  {col.autoIncrement && (
                                    <span title="Auto Increment" className="inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-900 dark:text-purple-300 border border-purple-500/40 font-bold shrink-0">
                                      AUTO
                                    </span>
                                  )}
                                  {col.isForeignKey && (
                                    <span title={`Foreign Key referencing ${col.referencesTable}(${col.referencesColumn})`} className="inline-flex items-center gap-0.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-900 dark:text-blue-300 border border-blue-500/40 font-bold shrink-0">
                                      <Link2 className="w-2.5 h-2.5" />
                                      FK
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 border border-slate-300/60 font-semibold shrink-0">
                                  {col.type}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                                Pos #{idx + 1} {col.nullable === false && '• NOT NULL'}
                              </div>
                            </motion.th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {rowsToRender.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columnsToRender.length || 1}
                            className="p-8 text-center text-xs text-slate-500 italic font-mono"
                          >
                            Empty set (0 records). Execute INSERT statements to populate rows into this schema.
                          </td>
                        </tr>
                      ) : (
                        rowsToRender.map((row, rIdx) => {
                          const hasRowFiltering = currentStep.highlightDetails?.highlightedRowIndices !== undefined;
                          const isRowHighlighted = currentStep.highlightDetails?.highlightedRowIndices?.includes(rIdx);

                          let rowStyle = 'border-b border-white/50 hover:bg-white/50 font-mono text-xs text-slate-800 transition-all';
                          if (hasRowFiltering) {
                            if (isRowHighlighted) {
                              rowStyle = 'border-b border-emerald-300/70 bg-emerald-500/15 hover:bg-emerald-500/25 font-mono text-xs text-emerald-950 border-l-4 border-l-emerald-600 font-bold backdrop-blur-sm';
                            } else {
                              rowStyle = 'border-b border-white/40 bg-white/20 font-mono text-xs text-slate-400 opacity-50';
                            }
                          }

                          return (
                            <motion.tr
                              key={rIdx}
                              initial={isMobile ? false : { opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={isMobile ? { duration: 0.15 } : { duration: 0.2, delay: rIdx * 0.03 }}
                              className={rowStyle}
                            >
                              {columnsToRender.map((col) => {
                                const val = row[col.name];
                                const isNullVal = val === undefined || val === null;

                                return (
                                  <td
                                    key={col.name}
                                    className="p-3.5 border-r border-white/50"
                                  >
                                    {isNullVal ? (
                                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-900 font-mono text-[10px] font-bold backdrop-blur-xs">
                                        NULL
                                      </span>
                                    ) : (
                                      <span>{String(val)}</span>
                                    )}
                                  </td>
                                );
                              })}
                            </motion.tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Referenced Secondary Table (e.g. Parent Table in Foreign Keys) */}
                {activeState.secondaryTable && (
                  <div className="mt-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/30 dark:bg-slate-900/30 border border-blue-500/30 backdrop-blur-xl shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Link2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-slate-500">Referenced Parent Table:</span>
                        <span className="font-mono text-xs font-bold text-blue-900 dark:text-blue-200 bg-blue-500/15 px-2.5 py-0.5 rounded-lg border border-blue-500/30">
                          {activeState.secondaryTable.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {activeState.secondaryTable.columns.length} Columns &bull; {activeState.secondaryTable.rows.length} Rows
                      </span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-white/70 dark:border-slate-800/70 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md custom-scrollbar">
                      <table className="w-full text-left border-collapse font-mono text-xs">
                        <thead>
                          <tr className="border-b border-white/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-800/80">
                            {activeState.secondaryTable.columns.map((col) => (
                              <th key={col.name} className="p-3 text-slate-800 dark:text-slate-200 font-semibold border-r border-white/50 dark:border-slate-700/50">
                                <div className="flex items-center gap-1.5">
                                  <span>{col.name}</span>
                                  {col.isPrimary && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold border border-amber-500/30">
                                      PK
                                    </span>
                                  )}
                                  <span className="text-[10px] text-slate-500 font-normal">
                                    {col.type}
                                  </span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {activeState.secondaryTable.rows.length === 0 ? (
                            <tr>
                              <td colSpan={activeState.secondaryTable.columns.length} className="p-4 text-center text-xs text-slate-500 italic">
                                Empty table.
                              </td>
                            </tr>
                          ) : (
                            activeState.secondaryTable.rows.map((row, idx) => (
                              <tr key={idx} className="border-b border-white/40 dark:border-slate-800/40 hover:bg-white/40 dark:hover:bg-slate-800/40 text-slate-800 dark:text-slate-200">
                                {activeState.secondaryTable!.columns.map((col) => (
                                  <td key={col.name} className="p-3 border-r border-white/40 dark:border-slate-800/40">
                                    {String(row[col.name] ?? 'NULL')}
                                  </td>
                                ))}
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              !activeState.availableDatabases && (
                <div className="p-8 text-center border border-dashed border-white/80 rounded-3xl liquid-glass-subtle">
                  <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    No table currently active. Execute a <code>CREATE TABLE</code> statement to instantiate table storage.
                  </p>
                </div>
              )
            )}

            {/* Apple-style Glass Engine Explanation */}
            <div className="p-4 sm:p-5 rounded-2xl liquid-glass-subtle border border-white/75 space-y-2.5 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-emerald-600" />
                <span>Internal MySQL Engine Execution Analysis:</span>
              </h4>
              <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                {explanations.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">&bull;</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {takeaways.length > 0 && (
                <div className="pt-2 border-t border-white/60 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">Key Takeaway:</span>
                  {takeaways.map((takeaway, tIdx) => (
                    <span key={tIdx} className="bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80 text-slate-700 font-medium backdrop-blur-xs shadow-2xs">
                      {takeaway}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* SYNTAX & CONCEPTS TAB */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topic.steps.map((step, idx) => (
              <motion.div
                layout
                key={step.id}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className="liquid-glass-card glass-sheen rounded-3xl p-5 sm:p-6 space-y-3 border border-white/85 shadow-xs transition-[border-color,box-shadow,background-color] duration-300 hover:border-white hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-800 border border-emerald-500/25 flex items-center justify-center text-xs font-mono font-bold">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{step.title || step.actionLabel}</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/60 text-slate-700 border border-white/80 font-bold">
                    {step.commandType || 'SQL'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {step.description || step.actionLabel}
                </p>

                <div className="relative">
                  <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                    {step.sql}
                  </pre>
                  <button
                    onClick={() => handleCopy(step.sql)}
                    className="absolute top-2 right-2 p-1 rounded-md bg-slate-800/80 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                <div className="pt-2 border-t border-white/60 flex items-center justify-between">
                  <button
                    onClick={() => onSendToTerminal(step.sql)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Send to Terminal</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedStepIndex(idx);
                      setActiveViewTab('visualizer');
                    }}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    View in Visualizer
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
