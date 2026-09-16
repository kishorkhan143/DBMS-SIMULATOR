import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/curriculum';
import { QuizQuestion } from '../types/sql';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuizLab: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState<boolean>(false);

  const currentQ: QuizQuestion = QUIZ_QUESTIONS[currentIdx];
  const totalQ = QUIZ_QUESTIONS.length;
  const isAnswered = selectedAnswers[currentIdx] !== undefined;
  const selectedOption = selectedAnswers[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    return score;
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setShowResult(false);
  };

  const progressPercent = Math.round(((currentIdx + 1) / totalQ) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Liquid Glass Quiz Header with Deep Blur */}
      <div className="liquid-glass-card glass-sheen rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/85 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 backdrop-blur-xs">
              Knowledge Lab
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            MySQL DDL & DML Interactive Challenge
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Test your understanding of ALTER TABLE, WHERE filters, column projections, and NULL logic.
          </p>
        </div>

        <div className="sm:text-right">
          <div className="text-[11px] font-mono text-slate-500">Question</div>
          <div className="text-base font-bold text-emerald-700 font-mono">
            {currentIdx + 1} <span className="text-xs text-slate-400 font-normal">/ {totalQ}</span>
          </div>
        </div>
      </div>

      {/* Fluid Frosted Glass Progress Bar */}
      <div className="w-full h-2 rounded-full bg-white/50 overflow-hidden p-[1px] border border-white/80 shadow-inner backdrop-blur-md">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {!showResult ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="liquid-glass-card glass-sheen rounded-3xl p-6 sm:p-8 space-y-6 border border-white/85 shadow-md"
          >
            {/* Question Text */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                Question {currentIdx + 1}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h3>

              {currentQ.codeSnippet && (
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                  {currentQ.codeSnippet}
                </pre>
              )}
            </div>

            {/* Options List in Frosted Glass */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedOption === optIdx;
                const isCorrect = optIdx === currentQ.correctIndex;

                let optionStyle = 'bg-white/45 hover:bg-white/75 border-white/75 text-slate-800 shadow-2xs backdrop-blur-xl';

                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/40 shadow-sm font-semibold backdrop-blur-xl';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-500/20 border-rose-300 text-rose-950 ring-2 ring-rose-400/30 font-semibold backdrop-blur-xl';
                  } else {
                    optionStyle = 'bg-white/20 border-white/40 text-slate-400 opacity-50 backdrop-blur-sm';
                  }
                }

                return (
                  <motion.button
                    key={optIdx}
                    whileHover={{ scale: isAnswered ? 1 : 1.006 }}
                    whileTap={{ scale: isAnswered ? 1 : 0.99 }}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                        isAnswered && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isAnswered && isSelected && !isCorrect
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/80 text-slate-800 border border-white shadow-xs'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="leading-relaxed">{option}</span>
                    </div>

                    {isAnswered && (
                      <span className="shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : isSelected ? (
                          <XCircle className="w-5 h-5 text-rose-500" />
                        ) : null}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Explanation Box on Reveal */}
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 backdrop-blur-md ${
                  selectedOption === currentQ.correctIndex
                    ? 'bg-emerald-500/15 border-emerald-300 text-emerald-950'
                    : 'bg-amber-500/15 border-amber-300 text-amber-950'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>
                    {selectedOption === currentQ.correctIndex ? 'Correct Explanation:' : 'Concept Review:'}
                  </span>
                </div>
                <p className="text-slate-700">{currentQ.explanation}</p>
              </motion.div>
            )}

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/60">
              <button
                onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                disabled={currentIdx === 0}
                className="px-4 py-2 rounded-xl bg-white/50 hover:bg-white/80 disabled:opacity-30 text-slate-700 text-xs font-semibold border border-white/75 backdrop-blur-md transition-colors cursor-pointer shadow-2xs"
              >
                Previous
              </button>

              {currentIdx < totalQ - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  disabled={!isAnswered}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-30 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setShowResult(true)}
                  disabled={!isAnswered}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-30 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Quiz Score</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        /* Final Score Summary Screen in Ultra-Frosted Liquid Glass */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="liquid-glass-card glass-sheen rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-white/85"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20 backdrop-blur-md">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quiz Completed</h3>
            <p className="text-sm text-slate-600">
              You scored <span className="font-bold text-emerald-700 font-mono text-base">{calculateScore()}</span> out of <span className="font-mono font-bold text-slate-800">{totalQ}</span> ({Math.round((calculateScore() / totalQ) * 100)}%)
            </p>
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl liquid-glass-subtle border border-white/80 text-xs text-slate-700 space-y-2 text-left shadow-2xs">
            <div className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Core Knowledge Mastered:</span>
            </div>
            <p>&bull; Syntax for ADD, MODIFY, RENAME, and DROP COLUMN</p>
            <p>&bull; Column reordering with FIRST and AFTER join_date</p>
            <p>&bull; Database read-only protection with ALTER DATABASE READ ONLY = 1</p>
            <p>&bull; Multi-row batch INSERT & partial column ingestion</p>
            <p>&bull; SQL three-valued logic with IS NULL & IS NOT NULL</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold text-xs transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
