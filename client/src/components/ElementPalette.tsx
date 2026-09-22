import React from 'react';
import { ElementSymbol, ELEMENTS_DATA, ElementInfo } from '../game/chemistryData';
import { Sparkles } from 'lucide-react';

interface ElementPaletteProps {
  onSelectElement: (symbol: ElementSymbol) => void;
  selectedSymbol?: ElementSymbol;
}

export const ElementPalette: React.FC<ElementPaletteProps> = ({
  onSelectElement,
  selectedSymbol,
}) => {
  // Elements arranged by HKDSE syllabus (Periods 1 to 4, Groups I to VIII)
  const commonElements: ElementSymbol[] = [
    'H', 'He',
    'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar',
    'K', 'Ca'
  ];

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          HKDSE Syllabus Elements (H to Ca)
        </span>
        <span className="text-[11px] text-slate-500">Click to add onto canvas</span>
      </div>

      <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
        {commonElements.map(sym => {
          const info = ELEMENTS_DATA[sym];
          const isSelected = selectedSymbol === sym;

          return (
            <button
              key={sym}
              onClick={() => onSelectElement(sym)}
              className={`group relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all ${
                isSelected
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/30 scale-105 ring-2 ring-cyan-300'
                  : info.isMetal
                    ? 'bg-amber-950/40 hover:bg-amber-900/60 text-amber-200 border border-amber-500/30'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60'
              }`}
            >
              <span className="text-[10px] font-mono opacity-60 leading-none">{info.atomicNumber}</span>
              <span className="text-sm font-black leading-tight tracking-tight">{sym}</span>
              <span className="text-[9px] opacity-75">{info.chineseName}</span>

              {/* Hover Tooltip card with electronic configuration */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-slate-950 text-cyan-300 border border-cyan-500/40 rounded-lg px-2 py-1 text-[10px] shadow-xl z-50 pointer-events-none whitespace-nowrap">
                <span className="font-bold">{info.name} ({info.symbol})</span>
                <span className="text-slate-400 font-mono">Config: {info.electronArrangement.join(', ')}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
