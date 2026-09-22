import React from 'react';
import { X, BookOpen, Check, AlertTriangle } from 'lucide-react';

interface TeacherGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherGuideModal: React.FC<TeacherGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 text-cyan-300 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">HKDSE Chemistry Teacher Guide & Marking Rubric</h2>
              <span className="text-xs text-cyan-200 font-medium">Topic II: Microscopic World I — Electron Diagrams</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-slate-300 text-sm">
          {/* Section 1: Standard Conventions */}
          <div>
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              1. HKDSE Electron Diagram Conventions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="font-bold text-white block mb-1">Electron Pairing:</span>
                Electrons should be drawn in pairs at the four quadrants (top, bottom, left, right) whenever possible. This avoids ambiguous electron counts during HKDSE marking.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="font-bold text-white block mb-1">Dot (•) & Cross (×):</span>
                Students must distinguish electrons originating from different elements by using dots for one element and crosses for another.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="font-bold text-white block mb-1">Ionic Brackets [ ]:</span>
                Every simple or polyatomic ion must be enclosed in square brackets with the overall charge indicated at the upper right outside the bracket.
              </div>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="font-bold text-white block mb-1">Charge Sign Convention:</span>
                In DSE chemistry, charges are written with magnitude before sign: e.g. <code className="text-amber-300">2+</code>, <code className="text-amber-300">2-</code>, not +2 or -2.
              </div>
            </div>
          </div>

          {/* Section 2: Frequent Student Pitfalls */}
          <div>
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              2. Top 5 Pitfalls in HKDSE Past Papers
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-lg flex items-start gap-2">
                <span className="font-bold text-rose-400 shrink-0">Pitfall 1:</span>
                <span><strong>Forgetting Lone Pairs:</strong> In covalent molecules like Cl₂, H₂O, NH₃, students often draw shared bond pairs correctly but omit lone pairs on outer atoms, losing marks.</span>
              </li>
              <li className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-lg flex items-start gap-2">
                <span className="font-bold text-rose-400 shrink-0">Pitfall 2:</span>
                <span><strong>Missing Brackets on Ions:</strong> In compounds like NaCl or MgCl₂, drawing naked circles with charges without square brackets is heavily penalized.</span>
              </li>
              <li className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-lg flex items-start gap-2">
                <span className="font-bold text-rose-400 shrink-0">Pitfall 3:</span>
                <span><strong>Ignoring Stoichiometry:</strong> Drawing only one Cl⁻ ion for MgCl₂ instead of two Cl⁻ ions (or writing a coefficient of 2).</span>
              </li>
              <li className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-lg flex items-start gap-2">
                <span className="font-bold text-rose-400 shrink-0">Pitfall 4:</span>
                <span><strong>Hydrogen Octet Confusion:</strong> Drawing 8 electrons for Hydrogen instead of a stable duplet of 2 electrons.</span>
              </li>
              <li className="p-2.5 bg-rose-950/20 border border-rose-900/40 rounded-lg flex items-start gap-2">
                <span className="font-bold text-rose-400 shrink-0">Pitfall 5:</span>
                <span><strong>Metallic Bonding Misunderstanding:</strong> Describing metallic bonds as attractions between electrons and "metal atoms" rather than "metal ions" (Coursebook Chapter 7.1 M1).</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Classroom Game Ideas */}
          <div>
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider mb-2">
              3. Classroom Teaching Suggestions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Use <strong>Exam Quests Mode</strong> as a 10-minute warm-up starter or exit ticket in your double lesson.
              Project the <strong>Free Sandbox</strong> on the interactive whiteboard for students to volunteer and construct molecules in front of the class. Students can also download their completed diagrams as clean PNGs to paste directly into Google Classroom or e-worksheets!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors"
          >
            Got it, Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
