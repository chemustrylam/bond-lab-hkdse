import React, { useRef, useState, useEffect } from 'react';
import { DiagramAtom, DiagramBond, DiagramElectron, ElementSymbol, ELEMENTS_DATA, ElectronMarker } from '../game/chemistryData';
import { soundFX } from '../game/soundFX';
import { Plus, Minus, Trash2, Eye, Shield, Zap, Sparkles } from 'lucide-react';

interface DiagramCanvasProps {
  atoms: DiagramAtom[];
  bonds: DiagramBond[];
  selectedAtomId: string | null;
  onSelectAtom: (atomId: string | null) => void;
  onUpdateAtom: (atom: DiagramAtom) => void;
  onRemoveAtom: (atomId: string) => void;
  onAddBond: (atom1Id: string, atom2Id: string) => void;
  onRemoveBond: (bondId: string) => void;
  onAddAtom: (symbol: ElementSymbol, x: number, y: number) => void;
  readOnly?: boolean;
  activeMarker: ElectronMarker;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  atoms,
  bonds,
  selectedAtomId,
  onSelectAtom,
  onUpdateAtom,
  onRemoveAtom,
  onAddBond,
  onRemoveBond,
  readOnly = false,
  activeMarker,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingAtomId, setDraggingAtomId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [bondSourceAtomId, setBondSourceAtomId] = useState<string | null>(null);

  const selectedAtom = atoms.find(a => a.id === selectedAtomId) || null;

  // Dragging atom around canvas
  const handleMouseDownAtom = (e: React.MouseEvent, atom: DiagramAtom) => {
    e.stopPropagation();
    onSelectAtom(atom.id);
    if (readOnly) return;

    if (bondSourceAtomId && bondSourceAtomId !== atom.id) {
      onAddBond(bondSourceAtomId, atom.id);
      setBondSourceAtomId(null);
      soundFX.playBond();
      return;
    }

    setDraggingAtomId(atom.id);
    setDragOffset({
      x: e.clientX - atom.x,
      y: e.clientY - atom.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingAtomId || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(60, Math.min(rect.width - 60, e.clientX - dragOffset.x));
    const newY = Math.max(60, Math.min(rect.height - 60, e.clientY - dragOffset.y));

    const atom = atoms.find(a => a.id === draggingAtomId);
    if (atom) {
      onUpdateAtom({ ...atom, x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDraggingAtomId(null);
  };

  // Shell & electron interaction
  const handleAddShell = (atom: DiagramAtom) => {
    if (atom.numShells >= 4) return;
    onUpdateAtom({ ...atom, numShells: atom.numShells + 1 });
    soundFX.playPop();
  };

  const handleRemoveShell = (atom: DiagramAtom) => {
    if (atom.numShells <= 1) return;
    const newShellCount = atom.numShells - 1;
    // remove electrons in dropped shell
    const newElectrons = atom.electrons.filter(e => e.shellIndex < newShellCount);
    onUpdateAtom({ ...atom, numShells: newShellCount, electrons: newElectrons });
    soundFX.playPop();
  };

  // Add electron on specific shell quadrant
  const handleQuadrantClick = (atom: DiagramAtom, shellIdx: number, angleDeg: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectAtom(atom.id);

    // Check if an electron already exists near this angle (within 20 deg)
    const existingIdx = atom.electrons.findIndex(
      el => el.shellIndex === shellIdx && Math.abs(el.angleDeg - angleDeg) < 18
    );

    if (existingIdx >= 0) {
      // Toggle or remove
      const updated = [...atom.electrons];
      // If clicking with different marker, change marker; otherwise remove
      if (updated[existingIdx].marker !== activeMarker) {
        updated[existingIdx].marker = activeMarker;
        soundFX.playElectronAdd();
      } else {
        updated.splice(existingIdx, 1);
        soundFX.playPop();
      }
      onUpdateAtom({ ...atom, electrons: updated });
    } else {
      // Add new electron
      const newElectron: DiagramElectron = {
        id: `e-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        shellIndex: shellIdx,
        position: 'custom',
        angleDeg: angleDeg,
        marker: activeMarker,
      };
      onUpdateAtom({ ...atom, electrons: [...atom.electrons, newElectron] });
      soundFX.playElectronAdd();
    }
  };

  // Helper to quickly auto-populate neutral or ion electrons
  const handleAutoFillOctet = (atom: DiagramAtom, mode: 'neutral' | 'octet') => {
    const elem = ELEMENTS_DATA[atom.symbol];
    let config: number[];
    if (mode === 'neutral') {
      config = elem.electronArrangement;
    } else {
      config = elem.commonIonArrangement;
    }

    const newElectrons: DiagramElectron[] = [];
    config.forEach((count, sIdx) => {
      // Standard pairing angles: 0 (right), 90 (bottom), 180 (left), 270 (top)
      // For pairs: offset by ±10 degrees
      for (let i = 0; i < count; i++) {
        let angle = 0;
        if (sIdx === 0) {
          // 1st shell (max 2)
          angle = i === 0 ? 90 : 270;
        } else {
          // 2nd/3rd shells (paired in 4 quadrants)
          const quadrant = i % 4; // 0: top, 1: right, 2: bottom, 3: left
          const pairIndex = Math.floor(i / 4); // 0 or 1
          const baseAngles = [270, 0, 90, 180];
          angle = baseAngles[quadrant] + (pairIndex === 1 ? 16 : -16);
        }
        newElectrons.push({
          id: `e-auto-${sIdx}-${i}-${Date.now()}`,
          shellIndex: sIdx,
          position: 'custom',
          angleDeg: (angle + 360) % 360,
          marker: (atom.charge < 0 && sIdx === config.length - 1 && i >= elem.valenceElectrons) ? 'dot' : 'cross',
        });
      }
    });

    onUpdateAtom({
      ...atom,
      numShells: config.length,
      electrons: newElectrons,
      hasBracket: mode === 'octet' && elem.commonIonCharge !== 0,
      charge: mode === 'octet' ? elem.commonIonCharge : 0,
    });
    soundFX.playSuccess();
  };

  // Helper: toggle charge
  const cycleCharge = (atom: DiagramAtom) => {
    const charges = [0, 1, 2, 3, -1, -2, -3];
    const nextIdx = (charges.indexOf(atom.charge) + 1) % charges.length;
    const nextCharge = charges[nextIdx];
    onUpdateAtom({
      ...atom,
      charge: nextCharge,
      hasBracket: nextCharge !== 0
    });
    soundFX.playPop();
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => onSelectAtom(null)}
      className="relative w-full h-[520px] bg-slate-950/80 rounded-2xl border border-cyan-500/20 shadow-2xl overflow-hidden select-none cursor-crosshair backdrop-blur-md"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.08) 0%, transparent 80%),
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 32px 32px, 32px 32px', backgroundColor: '#dd7936'
      }}
    >
      {/* SVG Layer for Bonds, Shells and Overlaps */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
          </radialGradient>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Render Covalent Bonds Between Atoms */}
        {bonds.map(bond => {
          const a1 = atoms.find(a => a.id === bond.atom1Id);
          const a2 = atoms.find(a => a.id === bond.atom2Id);
          if (!a1 || !a2) return null;

          const midX = (a1.x + a2.x) / 2;
          const midY = (a1.y + a2.y) / 2;
          const dx = a2.x - a1.x;
          const dy = a2.y - a1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);

          return (
            <g key={bond.id} className="pointer-events-auto">
              {/* Overlap connection line / aura */}
              <line
                x1={a1.x}
                y1={a1.y}
                x2={a2.x}
                y2={a2.y}
                stroke="#38bdf8"
                strokeWidth={bond.bondOrder * 3}
                strokeDasharray="6 4"
                opacity={0.4}
                className="animate-pulse"
              />
              
              {/* Shared bond pair marker visual at midpoint */}
              <g transform={`translate(${midX}, ${midY}) rotate(${(angle * 180) / Math.PI + 90})`}>
                <rect
                  x="-22"
                  y="-14"
                  width="44"
                  height="28"
                  rx="14"
                  fill="#0f172a"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                  opacity={0.9}
                />
                {/* Draw bond pairs as dots & crosses */}
                {Array.from({ length: bond.bondOrder }).map((_, i) => {
                  const offsetY = (i - (bond.bondOrder - 1) / 2) * 8;
                  return (
                    <g key={i} transform={`translate(0, ${offsetY})`}>
                      {/* Dot */}
                      <circle cx="-6" cy="0" r="3" fill="#38bdf8" />
                      {/* Cross */}
                      <line x1="3" y1="-3" x2="9" y2="3" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                      <line x1="9" y1="-3" x2="3" y2="3" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
                    </g>
                  );
                })}
              </g>

              {/* Delete bond button */}
              <circle
                cx={midX + Math.sin(angle) * 22}
                cy={midY - Math.cos(angle) * 22}
                r="10"
                fill="#ef4444"
                className="cursor-pointer hover:scale-125 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBond(bond.id);
                  soundFX.playPop();
                }}
              />
              <text
                x={midX + Math.sin(angle) * 22}
                y={midY - Math.cos(angle) * 22 + 4}
                textAnchor="middle"
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                className="pointer-events-none"
              >
                ×
              </text>
            </g>
          );
        })}
      </svg>

      {/* Render Each Atom Structure */}
      {atoms.map(atom => {
        const isSelected = selectedAtomId === atom.id;
        const elem = ELEMENTS_DATA[atom.symbol];
        const baseRadius = 38;
        const shellStep = 24;
        const maxRadius = baseRadius + (atom.numShells - 1) * shellStep;

        // Formatted charge display: e.g. 1 -> +, 2 -> 2+, -1 -> -, -2 -> 2-
        const chargeStr = atom.charge > 0 
          ? (atom.charge === 1 ? '⁺' : `${atom.charge}+`)
          : atom.charge < 0 
            ? (atom.charge === -1 ? '⁻' : `${Math.abs(atom.charge)}-`)
            : '';

        return (
          <div
            key={atom.id}
            style={{
              left: `${atom.x}px`,
              top: `${atom.y}px`,
              transform: 'translate(-50%, -50%)',
              width: `${(maxRadius + 30) * 2}px`,
              height: `${(maxRadius + 30) * 2}px`,
            }}
            onMouseDown={(e) => handleMouseDownAtom(e, atom)}
            className={`absolute flex items-center justify-center cursor-move transition-shadow ${
              isSelected ? 'z-20' : 'z-10'
            }`}
          >
            {/* Square Bracket for Ions (HKDSE requirement) */}
            {atom.hasBracket && (
              <div 
                className="absolute border-2 border-cyan-400 pointer-events-none rounded-xl"
                style={{
                  width: `${(maxRadius + 18) * 2}px`,
                  height: `${(maxRadius + 18) * 2}px`,
                  boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)'
                }}
              >
                {/* Charge badge at top-right outside the bracket */}
                {atom.charge !== 0 && (
                  <div className="absolute -top-4 -right-4 px-2 py-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-extrabold text-sm rounded-full shadow-lg border border-cyan-200 pointer-events-none animate-pulse">
                    {chargeStr}
                  </div>
                )}
                {/* Coefficient indicator if > 1 */}
                {atom.coefficient > 1 && (
                  <div className="absolute -top-4 -left-3 px-2 py-0.5 bg-emerald-600 text-white font-black text-sm rounded-full shadow-lg border border-emerald-300">
                    {atom.coefficient}
                  </div>
                )}
              </div>
            )}

            {/* Electron Shells (Circles) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-auto"
              style={{ width: '100%', height: '100%' }}
            >
              {Array.from({ length: atom.numShells }).map((_, sIdx) => {
                const radius = baseRadius + sIdx * shellStep;
                const center = maxRadius + 30;
                const isOutermost = sIdx === atom.numShells - 1;

                // Clickable hot-spots around the shell ring in 4 quadrants (paired: 8 spots)
                // Angles: 0, 16, 90, 106, 180, 196, 270, 286 degrees
                const spotAngles = [
                  270 - 12, 270 + 12, // top pair
                  0 - 12, 0 + 12,     // right pair
                  90 - 12, 90 + 12,   // bottom pair
                  180 - 12, 180 + 12  // left pair
                ];

                return (
                  <g key={sIdx}>
                    {/* Shell Orbit Circle */}
                    <circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke={isOutermost ? (isSelected ? '#38bdf8' : '#0284c7') : '#334155'}
                      strokeWidth={isOutermost ? 2 : 1.2}
                      strokeDasharray={isOutermost ? 'none' : '4 3'}
                      opacity={0.85}
                    />

                    {/* Interactive electron snap slots along shell */}
                    {spotAngles.map((ang, spotIdx) => {
                      const rad = (ang * Math.PI) / 180;
                      const spotX = center + radius * Math.cos(rad);
                      const spotY = center + radius * Math.sin(rad);

                      return (
                        <circle
                          key={spotIdx}
                          cx={spotX}
                          cy={spotY}
                          r="6"
                          fill="transparent"
                          className="cursor-pointer hover:fill-cyan-400/40 transition-colors"
                          onClick={(e) => handleQuadrantClick(atom, sIdx, ang, e)}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* Render Placed Electrons */}
              {atom.electrons.map(e => {
                const radius = baseRadius + e.shellIndex * shellStep;
                const center = maxRadius + 30;
                const rad = (e.angleDeg * Math.PI) / 180;
                const ex = center + radius * Math.cos(rad);
                const ey = center + radius * Math.sin(rad);

                return (
                  <g
                    key={e.id}
                    transform={`translate(${ex}, ${ey})`}
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={(ev) => handleQuadrantClick(atom, e.shellIndex, e.angleDeg, ev)}
                  >
                    {e.marker === 'dot' ? (
                      /* Dot Marker (Solid Cyan Circle with outer glow) */
                      <>
                        <circle cx="0" cy="0" r="6" fill="#38bdf8" filter="url(#neonGlow)" />
                        <circle cx="0" cy="0" r="4.5" fill="#e0f2fe" />
                      </>
                    ) : (
                      /* Cross Marker (Red/Rose Cross ×) */
                      <>
                        <line x1="-4.5" y1="-4.5" x2="4.5" y2="4.5" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                        <line x1="4.5" y1="-4.5" x2="-4.5" y2="4.5" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Atomic Core Nucleus */}
            <div
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold shadow-lg transition-transform ${
                isSelected 
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-600 text-white scale-110 ring-4 ring-cyan-300/60'
                  : elem.isMetal
                    ? 'bg-gradient-to-br from-amber-500 to-orange-700 text-white border border-amber-300'
                    : 'bg-gradient-to-br from-slate-700 to-slate-900 text-cyan-200 border border-slate-600'
              }`}
            >
              <span className="text-lg leading-none font-black tracking-tight">{atom.symbol}</span>
              <span className="text-[10px] font-mono text-cyan-100 opacity-90">{elem.atomicNumber}</span>
            </div>

            {/* Selection HUD Halo Ring */}
            {isSelected && (
              <div 
                className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/50 pointer-events-none animate-spin"
                style={{ animationDuration: '24s' }}
              />
            )}
          </div>
        );
      })}

      {/* Floating Canvas Controls for Selected Atom */}
      {selectedAtom && !readOnly && (
        <div 
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-slate-900/90 border border-cyan-500/40 rounded-xl shadow-2xl backdrop-blur-md z-30"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5 px-2 border-r border-slate-700">
            <span className="text-xs font-bold text-cyan-300">{selectedAtom.symbol} Controls:</span>
          </div>

          {/* Add / Remove Shells */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleRemoveShell(selectedAtom)}
              title="Remove Outer Shell"
              disabled={selectedAtom.numShells <= 1}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Minus className="w-3.5 h-3.5" /> Shell
            </button>
            <span className="text-xs font-mono text-cyan-400 px-1 font-bold">
              {selectedAtom.numShells} Shell{selectedAtom.numShells > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => handleAddShell(selectedAtom)}
              title="Add Outer Shell"
              disabled={selectedAtom.numShells >= 4}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-cyan-300 rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Shell
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Bracket and Charge Controls */}
          <button
            onClick={() => cycleCharge(selectedAtom)}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
              selectedAtom.hasBracket 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            {selectedAtom.hasBracket 
              ? `[ ] ${selectedAtom.charge > 0 ? `+${selectedAtom.charge}` : selectedAtom.charge}`
              : 'Add [ ] Ion'}
          </button>

          {/* Auto fill helpers */}
          <button
            onClick={() => handleAutoFillOctet(selectedAtom, 'neutral')}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1"
            title="Auto-place ground state electrons"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Ground (2,8...)
          </button>

          <button
            onClick={() => handleAutoFillOctet(selectedAtom, 'octet')}
            className="px-2 py-1 bg-cyan-900/50 hover:bg-cyan-800/60 text-cyan-200 rounded-lg text-xs font-medium flex items-center gap-1"
            title="Auto-form stable noble gas ion"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Stable Ion
          </button>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Connect Covalent Bond Mode */}
          <button
            onClick={() => {
              if (bondSourceAtomId === selectedAtom.id) {
                setBondSourceAtomId(null);
              } else {
                setBondSourceAtomId(selectedAtom.id);
              }
            }}
            className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
              bondSourceAtomId === selectedAtom.id
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {bondSourceAtomId === selectedAtom.id ? 'Click 2nd Atom...' : 'Share Bond Pair'}
          </button>

          {/* Delete Atom */}
          <button
            onClick={() => {
              onRemoveAtom(selectedAtom.id);
              onSelectAtom(null);
              soundFX.playPop();
            }}
            className="p-1.5 bg-rose-950/40 hover:bg-rose-900/70 text-rose-300 rounded-lg text-xs ml-1"
            title="Delete this atom"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Instructions / Status Legend */}
      <div className="absolute top-3 left-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-800 pointer-events-none">
        <span className="flex items-center gap-1 font-semibold text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400" /> Dot (•)
        </span>
        <span>/</span>
        <span className="flex items-center gap-1 font-semibold text-rose-400">
          <span className="font-mono text-sm leading-none">×</span> Cross
        </span>
        <span className="text-slate-600">|</span>
        <span>Click orbits to toggle electrons. Drag atom core to move.</span>
      </div>
    </div>
  );
};
