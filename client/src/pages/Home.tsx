import React, { useState, useEffect } from 'react';
import { DiagramCanvas } from '../components/DiagramCanvas';
import { ElementPalette } from '../components/ElementPalette';
import { GradeModal } from '../components/GradeModal';
import { TeacherGuideModal } from '../components/TeacherGuideModal';
import { 
  DiagramAtom, 
  DiagramBond, 
  ElementSymbol, 
  ELEMENTS_DATA, 
  QUESTS, 
  ChallengeQuest, 
  ElectronMarker 
} from '../game/chemistryData';
import { evaluateDiagram, CheckResult } from '../game/autoChecker';
import { soundFX } from '../game/soundFX';
import { 
  Sparkles, 
  GraduationCap, 
  FlaskConical, 
  Volume2, 
  VolumeX, 
  CheckCircle, 
  RotateCcw, 
  Download, 
  HelpCircle, 
  Play, 
  ChevronRight, 
  Share2, 
  Award,
  Layers,
  Atom,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  // Navigation & mode
  const [activeTab, setActiveTab] = useState<'quest' | 'sandbox'>('quest');
  const [currentQuestIndex, setCurrentQuestIndex] = useState<number>(0);
  
  // Game diagram state
  const [atoms, setAtoms] = useState<DiagramAtom[]>([]);
  const [bonds, setBonds] = useState<DiagramBond[]>([]);
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  const [activeMarker, setActiveMarker] = useState<ElectronMarker>('cross');
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals & Evaluation
  const [evalResult, setEvalResult] = useState<CheckResult | null>(null);
  const [isGradeModalOpen, setIsGradeModalOpen] = useState<boolean>(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState<boolean>(false);

  // Quest progress tracking
  const [completedQuests, setCompletedQuests] = useState<Record<string, boolean>>({});

  const currentQuest: ChallengeQuest | undefined = activeTab === 'quest' ? QUESTS[currentQuestIndex] : undefined;

  // Initialize canvas based on active mode / quest
  const loadQuest = (questIndex: number) => {
    const q = QUESTS[questIndex];
    if (!q) return;

    setCurrentQuestIndex(questIndex);
    setSelectedAtomId(null);
    setBonds([]);

    // Populate initial atoms for this quest
    const newAtoms: DiagramAtom[] = q.initialAtoms.map((init, idx) => {
      const elem = ELEMENTS_DATA[init.symbol];
      return {
        id: `atom-${Date.now()}-${idx}`,
        symbol: init.symbol,
        x: init.x,
        y: init.y,
        numShells: Math.min(elem.electronArrangement.length, 3),
        electrons: [],
        hasBracket: !!init.hasBracket,
        charge: init.charge || 0,
        coefficient: 1,
      };
    });

    setAtoms(newAtoms);
    soundFX.playPop();
  };

  // Load first quest on mount
  useEffect(() => {
    if (activeTab === 'quest') {
      loadQuest(currentQuestIndex);
    }
  }, [activeTab]);

  // Audio mute toggle
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFX.setMuted(nextMuted);
    toast.info(nextMuted ? 'Sound muted' : 'Sound enabled');
  };

  // Canvas Actions
  const handleAddAtom = (symbol: ElementSymbol, x = 280, y = 220) => {
    const elem = ELEMENTS_DATA[symbol];
    const newAtom: DiagramAtom = {
      id: `atom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      symbol,
      x,
      y,
      numShells: elem.electronArrangement.length,
      electrons: [],
      hasBracket: false,
      charge: 0,
      coefficient: 1,
    };
    setAtoms(prev => [...prev, newAtom]);
    setSelectedAtomId(newAtom.id);
    soundFX.playPop();
    toast.success(`Added ${elem.name} (${symbol}) atom to canvas`);
  };

  const handleUpdateAtom = (updated: DiagramAtom) => {
    setAtoms(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  const handleRemoveAtom = (atomId: string) => {
    setAtoms(prev => prev.filter(a => a.id !== atomId));
    setBonds(prev => prev.filter(b => b.atom1Id !== atomId && b.atom2Id !== atomId));
    if (selectedAtomId === atomId) setSelectedAtomId(null);
  };

  const handleAddBond = (atom1Id: string, atom2Id: string) => {
    // Check if bond already exists between these atoms
    const existing = bonds.find(
      b => (b.atom1Id === atom1Id && b.atom2Id === atom2Id) || (b.atom1Id === atom2Id && b.atom2Id === atom1Id)
    );

    if (existing) {
      if (existing.bondOrder < 3) {
        // Upgrade single -> double -> triple
        setBonds(prev => prev.map(b => b.id === existing.id ? { ...b, bondOrder: (b.bondOrder + 1) as 1 | 2 | 3 } : b));
        toast.info(`Increased bond order to ${existing.bondOrder + 1} shared pair(s)`);
      } else {
        toast.info('Maximum 3 shared bond pairs (triple bond) reached');
      }
    } else {
      const newBond: DiagramBond = {
        id: `bond-${Date.now()}`,
        atom1Id,
        atom2Id,
        bondOrder: 1,
        markerType1: 'dot',
        markerType2: 'cross',
      };
      setBonds(prev => [...prev, newBond]);
      toast.success('Formed covalent bond! Shared 1 pair of electrons');
    }
  };

  const handleRemoveBond = (bondId: string) => {
    setBonds(prev => prev.filter(b => b.id !== bondId));
  };

  // Grade & Check Diagram
  const handleCheckAnswers = () => {
    const result = evaluateDiagram(atoms, bonds, currentQuest);
    setEvalResult(result);
    setIsGradeModalOpen(true);

    if (result.isCorrect) {
      soundFX.playSuccess();
      if (currentQuest) {
        setCompletedQuests(prev => ({ ...prev, [currentQuest.id]: true }));
      }
    } else {
      soundFX.playError();
    }
  };

  // Advance to next mission
  const handleNextQuest = () => {
    if (currentQuestIndex < QUESTS.length - 1) {
      loadQuest(currentQuestIndex + 1);
    } else {
      toast.success('Congratulations! You completed all HKDSE electron diagram missions!');
    }
  };

  // Clear or reset canvas
  const handleResetCanvas = () => {
    if (activeTab === 'quest') {
      loadQuest(currentQuestIndex);
      toast.info('Canvas reset to initial quest setup');
    } else {
      setAtoms([]);
      setBonds([]);
      setSelectedAtomId(null);
      toast.info('Canvas cleared');
    }
    soundFX.playPop();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-300">
            <Atom className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                BOND LAB <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">HKDSE Edition</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Topic II: Microscopic World I — Electron Diagram Game</p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              setActiveTab('quest');
              loadQuest(currentQuestIndex);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quest' 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            HKDSE Exam Quests
          </button>
          <button
            onClick={() => setActiveTab('sandbox')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sandbox' 
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            Free Sandbox Lab
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTeacherGuideOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-lg border border-slate-700 transition-colors"
            title="Open HKDSE Teacher Marking Rubric"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Teacher Guide</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mission / Quest Selector or Sandbox Controls */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {activeTab === 'quest' && currentQuest ? (
            /* Quest Mission Card */
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800">
                  Mission {currentQuestIndex + 1} of {QUESTS.length}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  currentQuest.difficulty === 'Foundation' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  currentQuest.difficulty === 'Core' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                  'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {currentQuest.difficulty}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-white leading-tight mb-1">{currentQuest.title}</h2>
                <p className="text-xs text-cyan-300/80 font-mono">{currentQuest.subtitle}</p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Exam Instruction</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentQuest.prompt}</p>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-cyan-950/20 border border-cyan-900/40 rounded-xl text-xs">
                <span className="text-slate-400">Target Formula:</span>
                <span className="font-mono font-black text-cyan-300 text-sm tracking-wider">{currentQuest.targetFormula}</span>
              </div>

              {/* Quest List Selector Dropdown / Carousel */}
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  All HKDSE Missions
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {QUESTS.map((q, idx) => {
                    const isCurrent = idx === currentQuestIndex;
                    const isDone = completedQuests[q.id];

                    return (
                      <button
                        key={q.id}
                        onClick={() => loadQuest(idx)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isCurrent 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                            : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-mono text-[10px] opacity-60">#{idx + 1}</span>
                          <span className="truncate">{q.title.split(':')[1] || q.title}</span>
                        </div>
                        {isDone ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Sandbox Mode Info & Quick Actions */
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4 backdrop-blur-md">
              <div>
                <h2 className="text-xl font-black text-white leading-tight mb-1">Sandbox Free Lab</h2>
                <p className="text-xs text-cyan-300/80">Full creative freedom for classroom demonstration & custom compounds</p>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-2 text-xs text-slate-300 leading-relaxed">
                <p>
                  Build any molecule or ionic lattice unit from the periodic table. Connect atoms to share bond pairs, or wrap with square brackets <code className="text-cyan-300 font-mono">[ ]</code> and assign charges for ionic species.
                </p>
              </div>

              <div className="p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-xs space-y-1">
                <span className="font-bold text-indigo-300 block">Teacher Demonstration Tip:</span>
                <p className="text-slate-300">
                  Ask students to predict the formula of magnesium nitride (Mg²⁺ and N³⁻) or sulfur hexafluoride, and build it step-by-step on this canvas.
                </p>
              </div>
            </div>
          )}

          {/* Quick Periodic Table Selector for adding elements */}
          <ElementPalette onSelectElement={(sym) => handleAddAtom(sym)} />
        </div>

        {/* Right Column: Interactive Diagram Canvas & Tools */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Canvas Top Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
            {/* Active Drawing Marker Choice */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Electron Marker:</span>
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => {
                    setActiveMarker('cross');
                    soundFX.playPop();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    activeMarker === 'cross' 
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="font-mono text-sm leading-none">×</span> Cross
                </button>
                <button
                  onClick={() => {
                    setActiveMarker('dot');
                    soundFX.playPop();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black transition-all ${
                    activeMarker === 'dot' 
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-current" /> Dot (•)
                </button>
              </div>
            </div>

            {/* Canvas Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetCanvas}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
                title="Reset or clear canvas"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>

              <button
                onClick={handleCheckAnswers}
                className="px-5 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5 animate-pulse"
              >
                <CheckCircle className="w-4 h-4" />
                Check Answers
              </button>
            </div>
          </div>

          {/* Interactive Electron Diagram Canvas */}
          <DiagramCanvas
            atoms={atoms}
            bonds={bonds}
            selectedAtomId={selectedAtomId}
            onSelectAtom={setSelectedAtomId}
            onUpdateAtom={handleUpdateAtom}
            onRemoveAtom={handleRemoveAtom}
            onAddBond={handleAddBond}
            onRemoveBond={handleRemoveBond}
            onAddAtom={handleAddAtom}
            activeMarker={activeMarker}
          />

          {/* Fast Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Atoms Drawn</span>
              <span className="text-lg font-black text-white" style={{backgroundColor: '#353f4f'}}>{atoms.length}</span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Electrons</span>
              <span className="text-lg font-black text-cyan-400">
                {atoms.reduce((sum, a) => sum + a.electrons.length, 0)}
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Shared Bond Pairs</span>
              <span className="text-lg font-black text-blue-400">
                {bonds.reduce((sum, b) => sum + b.bondOrder, 0)}
              </span>
            </div>

            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Net Charge</span>
              <span className={`text-lg font-black ${
                atoms.reduce((sum, a) => sum + a.charge * (a.coefficient || 1), 0) === 0 
                  ? 'text-emerald-400' 
                  : 'text-amber-400'
              }`}>
                {atoms.reduce((sum, a) => sum + a.charge * (a.coefficient || 1), 0)}
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Grade and Feedback Assessment Modal */}
      <GradeModal
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        result={evalResult}
        currentQuest={currentQuest}
        onNextQuest={handleNextQuest}
        onRetry={handleResetCanvas}
      />

      {/* Teacher Guide & DSE Rubric Modal */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
      />
    </div>
  );
}
