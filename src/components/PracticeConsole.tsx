import React, { useState, useRef, useEffect } from 'react';
import { SystemCatalog, QueryExecutionResult, TableState } from '../types/sql';
import { executeQuery } from '../engine/sqlEngine';
import { PRESET_PRACTICE_QUERIES } from '../data/curriculum';
import {
  Terminal,
  Play,
  Trash2,
  Database,
  Table as TableIcon,
  Sparkles,
  Lock,
  Unlock,
  CornerDownLeft,
  Copy,
  Check,
  Code2,
  HelpCircle,
  Search,
  Layers,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PracticeConsoleProps {
  catalog: SystemCatalog;
  onUpdateCatalog: (newCatalog: SystemCatalog) => void;
  initialQuery?: string;
}

interface ConsoleHistoryItem {
  id: string;
  query: string;
  result: QueryExecutionResult;
  timestamp: string;
}

export const PracticeConsole: React.FC<PracticeConsoleProps> = ({
  catalog,
  onUpdateCatalog,
  initialQuery,
}) => {
  const [queryInput, setQueryInput] = useState<string>(
    initialQuery || 'show databases;'
  );
  const [history, setHistory] = useState<ConsoleHistoryItem[]>([
    {
      id: 'init-1',
      query: 'show databases;',
      result: {
        success: true,
        message: '5 rows in set (0.001 sec)',
        columns: ['Database'],
        rows: [['information_schema'], ['july'], ['mysql'], ['performance_schema'], ['sys']],
        timeMs: 1.2
      },
      timestamp: 'Session Started'
    }
  ]);
  const [presetFilter, setPresetFilter] = useState<'all' | 'p1' | 'p2' | 'p3' | 'p4'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const historyBottomRef = useRef<HTMLDivElement>(null);

  // Update query input if initialQuery changes
  useEffect(() => {
    if (initialQuery) {
      setQueryInput(initialQuery);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [initialQuery]);

  const handleRunQuery = (customSql?: string) => {
    const sqlToRun = customSql !== undefined ? customSql : queryInput;
    if (!sqlToRun.trim()) return;

    const { result, updatedCatalog } = executeQuery(sqlToRun, catalog);
    onUpdateCatalog(updatedCatalog);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setHistory(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        query: sqlToRun.trim(),
        result,
        timestamp: timeStr
      }
    ]);

    setTimeout(() => {
      historyBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleRunQuery();
    }
  };

  const currentDb = catalog.currentDatabase ? catalog.databases[catalog.currentDatabase] : null;
  const currentDbTables: TableState[] = currentDb ? (Object.values(currentDb.tables) as TableState[]) : [];

  const filteredPresets = PRESET_PRACTICE_QUERIES.filter(item => {
    const matchesFilter =
      presetFilter === 'all'
        ? true
        : presetFilter === 'p1'
        ? item.label.startsWith('P1')
        : presetFilter === 'p2'
        ? item.label.startsWith('P2')
        : presetFilter === 'p3'
        ? item.label.startsWith('P3')
        : item.label.startsWith('P4');
    const matchesSearch =
      searchQuery === '' ||
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.query.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Main Terminal Section */}
      <div className="lg:col-span-8 space-y-4">
        {/* Apple macOS style Ultra-Frosted Liquid Glass Window */}
        <div className="liquid-glass-card glass-sheen rounded-3xl overflow-hidden shadow-2xl border border-white/85">
          {/* Window Header */}
          <div className="bg-white/55 px-5 py-3 border-b border-white/70 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {/* macOS Traffic Light Dots */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/90 border border-rose-600/30" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90 border border-amber-600/30" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90 border border-emerald-600/30" />
              </div>
              <div className="h-4 w-px bg-slate-300 mx-1" />
              <Terminal className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-xs font-mono font-bold text-slate-800">
                mysql&gt; interactive-terminal
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-500 hidden sm:inline">
                ⌘ + ↵ to run
              </span>
              <button
                onClick={() => setHistory([])}
                title="Clear console output"
                className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Console History Output */}
          <div className="p-5 max-h-[360px] overflow-y-auto font-mono text-xs space-y-4 bg-slate-950 text-slate-200 custom-scrollbar shadow-inner">
            {history.length === 0 ? (
              <div className="text-slate-500 italic text-center py-10">
                Terminal cleared. Type an SQL query below or pick a preset query to execute.
              </div>
            ) : (
              history.map((item) => (
                <div key={item.id} className="space-y-2">
                  {/* Command Line */}
                  <div className="flex items-start gap-2.5 text-slate-200">
                    <span className="text-emerald-400 font-bold select-none">mysql&gt;</span>
                    <span className="text-emerald-300 font-semibold break-all whitespace-pre-wrap">
                      {item.query}
                    </span>
                    <span className="ml-auto text-[10px] text-slate-500 select-none">
                      {item.timestamp}
                    </span>
                  </div>

                  {/* Result Output */}
                  <div className="pl-6">
                    {item.result.success ? (
                      <div>
                        {/* Tabular result */}
                        {item.result.columns && item.result.rows && (
                          <div className="overflow-x-auto my-2.5 rounded-xl border border-slate-800 bg-black/40 backdrop-blur-sm inline-block max-w-full custom-scrollbar">
                            <table className="text-left border-collapse font-mono text-xs">
                              <thead>
                                <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-200">
                                  {item.result.columns.map((col, cIdx) => (
                                    <th
                                      key={cIdx}
                                      className="px-3.5 py-1.5 border-r border-slate-800 font-semibold text-[11px]"
                                    >
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {item.result.rows.length === 0 ? (
                                  <tr>
                                    <td
                                      colSpan={item.result.columns.length}
                                      className="px-3 py-2.5 text-slate-500 italic text-center"
                                    >
                                      Empty set (0 records)
                                    </td>
                                  </tr>
                                ) : (
                                  item.result.rows.map((row, rIdx) => (
                                    <tr
                                      key={rIdx}
                                      className="border-b border-slate-900 hover:bg-slate-900/60 text-slate-200 transition-colors"
                                    >
                                      {row.map((cell, cellIdx) => (
                                        <td
                                          key={cellIdx}
                                          className="px-3.5 py-1.5 border-r border-slate-900 whitespace-nowrap"
                                        >
                                          {cell === null || cell === 'NULL' ? (
                                            <span className="text-amber-400 italic font-bold text-[10px]">NULL</span>
                                          ) : (
                                            String(cell)
                                          )}
                                        </td>
                                      ))}
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <div className="text-emerald-400 text-xs font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span>{item.result.message}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-rose-300 text-xs font-mono bg-rose-950/60 p-2.5 rounded-xl border border-rose-800/60">
                        {item.result.message}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={historyBottomRef} />
          </div>

          {/* Interactive SQL Input Box */}
          <div className="p-4 sm:p-5 liquid-glass-subtle border-t border-white/70 backdrop-blur-xl">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
                placeholder="Type any SQL query (e.g. SHOW DATABASES; USE pandiyan_store; SELECT * FROM emp;)"
                className="w-full bg-white/75 text-slate-900 font-mono text-xs sm:text-sm rounded-2xl p-4 border border-white/90 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none transition-all placeholder:text-slate-400 shadow-sm backdrop-blur-md"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-mono">
                <span>Active DB:</span>
                <span className="font-bold text-emerald-900 bg-emerald-500/15 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 backdrop-blur-xs">
                  {catalog.currentDatabase || 'None (USE db;)'}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  onClick={() => setQueryInput('')}
                  className="px-3.5 py-1.5 text-xs text-slate-700 hover:text-slate-900 bg-white/60 hover:bg-white/90 rounded-xl transition-all cursor-pointer font-medium border border-white/80 shadow-2xs backdrop-blur-md"
                >
                  Clear
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRunQuery()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Query</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Apple-style Preset Queries Strip in Liquid Glass */}
        <div className="liquid-glass-card glass-sheen rounded-3xl p-5 space-y-3 border border-white/85 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Preset Quick-Run Queries
              </h3>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-white/45 border border-white/70 backdrop-blur-md shadow-inner">
              {(['all', 'p1', 'p2', 'p3', 'p4'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPresetFilter(filter)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                    presetFilter === filter
                      ? 'bg-white text-slate-900 shadow-xs border border-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {filter === 'all'
                    ? 'All'
                    : filter === 'p1'
                    ? 'P1 (DDL)'
                    : filter === 'p2'
                    ? 'P2 (DML)'
                    : filter === 'p3'
                    ? 'P3 (Tx/Rollback)'
                    : 'P4 (Constraints)'}
                </button>
              ))}
            </div>
          </div>

          {/* Quick-Run Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
            {filteredPresets.map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setQueryInput(item.query);
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }}
                className="text-left p-2.5 rounded-2xl bg-white/50 hover:bg-white/80 border border-white/70 hover:border-white text-slate-700 transition-all group flex items-center justify-between gap-2 cursor-pointer shadow-2xs backdrop-blur-md"
              >
                <div className="truncate min-w-0">
                  <div className="text-[11px] font-bold text-slate-900 group-hover:text-emerald-700 truncate">
                    {item.label}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 truncate">
                    {item.query.replace(/\n/g, ' ')}
                  </div>
                </div>
                <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Live System State & Schema Inspector Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="liquid-glass-card glass-sheen rounded-3xl p-5 shadow-sm space-y-4 border border-white/85">
          <div className="flex items-center justify-between pb-3 border-b border-white/60">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Live Schema Inspector</h3>
            </div>
            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-900 border border-emerald-500/25 font-bold backdrop-blur-xs">
              Live
            </span>
          </div>

          {/* Current Database Capsule */}
          <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/75 space-y-2 shadow-2xs">
            <div className="text-[11px] font-medium text-slate-500">Target Schema:</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-sm font-bold text-slate-900">
                  {catalog.currentDatabase || 'None'}
                </span>
              </div>
              {currentDb && (
                <span
                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    currentDb.isReadOnly
                      ? 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
                  }`}
                >
                  {currentDb.isReadOnly ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                  {currentDb.isReadOnly ? 'READ ONLY' : 'R/W'}
                </span>
              )}
            </div>

            {catalog.autocommit === false && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-[10px] font-mono font-bold">
                <RotateCcw className="w-3 h-3 text-amber-700" />
                <span>autocommit=0 &bull; Uncommitted Tx</span>
              </div>
            )}
          </div>

          {/* Database Catalog List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-700">
              Server Databases ({Object.keys(catalog.databases).length}):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(catalog.databases).map((dbName) => {
                const isActive = catalog.currentDatabase === dbName;
                return (
                  <button
                    key={dbName}
                    onClick={() => handleRunQuery(`use ${dbName};`)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-mono border transition-all cursor-pointer backdrop-blur-md ${
                      isActive
                        ? 'bg-emerald-500/20 border-emerald-400/60 text-emerald-950 font-bold shadow-xs'
                        : 'bg-white/50 text-slate-700 border-white/75 hover:text-slate-900 hover:bg-white/80 shadow-2xs'
                    }`}
                  >
                    {dbName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tables in Database */}
          <div className="space-y-3 pt-3 border-t border-white/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Tables in {catalog.currentDatabase || 'current DB'}:
              </span>
              <span className="text-xs font-mono text-slate-500">
                {currentDbTables.length} table{currentDbTables.length === 1 ? '' : 's'}
              </span>
            </div>

            {currentDbTables.length === 0 ? (
              <div className="p-5 rounded-2xl liquid-glass-subtle border border-dashed border-white/80 text-center text-xs text-slate-500">
                No tables defined. Run <code>create table employee(...);</code> to initialize schema.
              </div>
            ) : (
              currentDbTables.map((table) => (
                <div
                  key={table.name}
                  className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/80 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {table.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/60 text-slate-700 border border-white/80">
                      {table.rows.length} {table.rows.length === 1 ? 'row' : 'rows'}
                    </span>
                  </div>

                  {/* Columns */}
                  <div className="space-y-1">
                    {table.columns.map((col, idx) => (
                      <div
                        key={col.name}
                        className="flex flex-wrap items-center justify-between gap-1 text-xs font-mono bg-white/50 px-2.5 py-1 rounded-lg border border-white/70"
                      >
                        <span className="text-slate-800 font-medium">
                          {idx + 1}. {col.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {col.isPrimaryKey && (
                            <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-800 px-1.5 py-0.5 rounded font-bold border border-indigo-500/30">
                              PK
                            </span>
                          )}
                          {col.nullable === false && (
                            <span className="text-[9px] font-mono bg-rose-500/20 text-rose-800 px-1.5 py-0.5 rounded font-bold border border-rose-500/30">
                              NOT NULL
                            </span>
                          )}
                          {col.isUnique && (
                            <span className="text-[9px] font-mono bg-purple-500/20 text-purple-800 px-1.5 py-0.5 rounded font-bold border border-purple-500/30">
                              UNIQUE
                            </span>
                          )}
                          {col.defaultValue !== undefined && (
                            <span className="text-[9px] font-mono bg-sky-500/20 text-sky-800 px-1.5 py-0.5 rounded font-bold border border-sky-500/30">
                              DEF: {col.defaultValue}
                            </span>
                          )}
                          {col.checkConstraint && (
                            <span className="text-[9px] font-mono bg-amber-500/20 text-amber-800 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">
                              CHK: {col.checkConstraint}
                            </span>
                          )}
                          <span className="text-[10px] text-emerald-800 bg-emerald-500/15 px-1.5 py-0.5 rounded-md font-bold border border-emerald-500/30">
                            {col.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleRunQuery(`select * from ${table.name};`)}
                      className="flex-1 py-1 text-[11px] font-mono bg-white/60 hover:bg-white/90 text-slate-700 hover:text-slate-900 rounded-xl border border-white/80 transition-colors text-center cursor-pointer font-semibold shadow-2xs"
                    >
                      SELECT *
                    </button>
                    <button
                      onClick={() => handleRunQuery(`desc ${table.name};`)}
                      className="flex-1 py-1 text-[11px] font-mono bg-white/60 hover:bg-white/90 text-slate-700 hover:text-slate-900 rounded-xl border border-white/80 transition-colors text-center cursor-pointer font-semibold shadow-2xs"
                    >
                      DESCRIBE
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
