import React from 'react';
import { CheckResult } from '../game/autoChecker';
import { ChallengeQuest } from '../game/chemistryData';
import { CheckCircle2, XCircle, Award, AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CheckResult | null;
  currentQuest?: ChallengeQuest;
  onNextQuest?: () => void;
  onRetry?: () => void;
}

export const GradeModal: React.FC<GradeModalProps> = ({
  isOpen,
  onClose,
  result,
  currentQuest,
  onNextQuest,
  onRetry,
}) => {
  if (!isOpen || !result) return null;

  // Trigger celebration confetti on perfect 5** score
  React.useEffect(() => {
    if (result.isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result]);

  const gradeColors: Record<string, string> = {
    '5**': 'from-amber-400 via-yellow-300 to-amber-500 text-slate-950',
    '5*': 'from-cyan-400 to-blue-500 text-white',
    '5': 'from-emerald-400 to-teal-600 text-white',
    '4': 'from-blue-400 to-indigo-600 text-white',
    'Level 3': 'from-purple-400 to-pink-600 text-white',
    'Needs Practice': 'from-rose-500 to-red-700 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Ribbon */}
        <div className={`p-6 bg-gradient-to-r ${gradeColors[result.grade] || 'from-slate-700 to-slate-800'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-black/20 rounded-xl backdrop-blur-sm">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest opacity-80">HKDSE Chemistry Assessment</span>
              <h2 className="text-2xl font-black leading-tight">
                {result.isCorrect ? 'Score: 100% Correct!' : 'Mark Breakdown & Feedback'}
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider opacity-75">Estimated DSE Grade</span>
            <span className="text-3xl font-black">{result.grade}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Summary Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            result.isCorrect 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
              : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          }`}>
            {result.isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium leading-relaxed">{result.summary}</p>
          </div>

          {/* Criteria Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Marking Scheme Criteria:</h4>
            <div className="space-y-1.5">
              {result.criteria.map((c) => (
                <div 
                  key={c.id}
                  className={`flex items-start justify-between p-2.5 rounded-lg border text-xs ${
                    c.passed 
                      ? 'bg-slate-800/40 border-slate-700/60 text-slate-200' 
                      : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {c.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold block">{c.label}</span>
                      <span className="text-slate-400">{c.message}</span>
                    </div>
                  </div>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
                    c.passed ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                  }`}>
                    {c.passed ? '+1 Mark' : '0 Mark'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* HKDSE Syllabus & Past Paper Advice */}
          {currentQuest && (
            <div className="p-3.5 bg-cyan-950/30 border border-cyan-800/50 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold text-xs uppercase tracking-wider">
                <span>HKDSE Exam Reference: {currentQuest.hkdseYearRef}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {currentQuest.explanation}
              </p>
              <div className="pt-1.5 border-t border-cyan-900/60 text-xs text-cyan-200">
                <strong className="text-cyan-400">Examiner’s Tip: </strong>
                {currentQuest.hkdseTip}
              </div>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Review Canvas
          </button>

          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                onClick={() => {
                  onRetry();
                  onClose();
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retry Diagram
              </button>
            )}

            {result.isCorrect && onNextQuest && (
              <button
                onClick={() => {
                  onNextQuest();
                  onClose();
                }}
                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                Next Challenge <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
