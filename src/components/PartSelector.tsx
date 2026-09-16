import React from 'react';
import { Part, Topic } from '../types/sql';
import { Database, Terminal, RotateCcw, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface PartSelectorProps {
  parts: Part[];
  selectedPart: Part;
  selectedTopic: Topic;
  onSelectPart: (part: Part) => void;
  onSelectTopic: (topic: Topic) => void;
}

export const PartSelector: React.FC<PartSelectorProps> = ({
  parts,
  selectedPart,
  selectedTopic,
  onSelectPart,
  onSelectTopic,
}) => {
  const visibleParts = parts.filter(p => ['part-1', 'part-2', 'part-3', 'part-4'].includes(p.id));

  const getPartIcon = (id: string) => {
    switch (id) {
      case 'part-1': return Database;
      case 'part-2': return Terminal;
      case 'part-3': return RotateCcw;
      case 'part-4': return ShieldCheck;
      default: return Database;
    }
  };

  const Icon = getPartIcon(selectedPart.id);

  return (
    <div className="liquid-glass glass-sheen rounded-3xl p-4 sm:p-5 border border-white/80 shadow-sm space-y-3">
      {/* Sleek Apple Header: Active Part Title & Segmented Track Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 border border-emerald-500/25 backdrop-blur-md">
                Part {selectedPart.number || selectedPart.id.replace('part-', '')}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {selectedPart.title}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
              {selectedPart.subtitle}
            </p>
          </div>
        </div>

        {/* Apple Segmented Pill Track Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white/45 border border-white/65 backdrop-blur-xl shadow-inner self-start sm:self-auto shrink-0">
          {visibleParts.map((p) => {
            const isCurrent = p.id === selectedPart.id;
            const partNum = p.number || p.id.replace('part-', '');
            return (
              <button
                key={p.id}
                onClick={() => {
                  onSelectPart(p);
                  if (p.topics.length > 0) onSelectTopic(p.topics[0]);
                }}
                className={`relative px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? 'text-slate-900 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isCurrent && (
                  <motion.div
                    layoutId="partTrackIndicator"
                    className="absolute inset-0 rounded-full bg-white/95 border border-white shadow-xs backdrop-blur-lg -z-10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                Part {partNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-Topics / Modules Pill Bar */}
      <div className="flex flex-wrap gap-2 pt-0.5">
        {selectedPart.topics.map((topic, index) => {
          const isTopicSelected = selectedTopic.id === topic.id;
          return (
            <motion.button
              key={topic.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelectTopic(topic)}
              className={`relative flex items-center gap-2.5 px-3.5 py-1.5 sm:py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer backdrop-blur-md ${
                isTopicSelected
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 border border-emerald-500/50'
                  : 'bg-white/45 text-slate-700 hover:text-slate-900 hover:bg-white/75 border border-white/70 shadow-2xs'
              }`}
            >
              <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
                isTopicSelected ? 'bg-white/25 text-white' : 'bg-white/80 text-slate-800 border border-white'
              }`}>
                {index + 1}
              </span>
              <span className="font-sans tracking-tight">{topic.title}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                isTopicSelected ? 'bg-black/20 text-white' : 'bg-slate-200/60 text-slate-700'
              }`}>
                {topic.commandCount} {topic.commandCount === 1 ? 'step' : 'steps'}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
