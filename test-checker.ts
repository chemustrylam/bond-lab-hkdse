import { evaluateDiagram } from './client/src/game/autoChecker';
import { QUESTS, ELEMENTS_DATA, DiagramAtom, DiagramBond } from './client/src/game/chemistryData';

console.log("=== Testing AutoChecker Engine ===");

// Test 1: Empty canvas
const r1 = evaluateDiagram([], [], QUESTS[0]);
console.log("Test 1 (Empty):", r1.isCorrect === false ? "PASS" : "FAIL");

// Test 2: Sodium atom with correct electrons
const naAtom: DiagramAtom = {
  id: 'a1',
  symbol: 'Na',
  x: 260,
  y: 220,
  numShells: 3,
  electrons: [
    // Shell 1: 2 electrons
    { id: 'e1', shellIndex: 0, position: 'custom', angleDeg: 90, marker: 'cross' },
    { id: 'e2', shellIndex: 0, position: 'custom', angleDeg: 270, marker: 'cross' },
    // Shell 2: 8 electrons
    { id: 'e3', shellIndex: 1, position: 'custom', angleDeg: 0, marker: 'cross' },
    { id: 'e4', shellIndex: 1, position: 'custom', angleDeg: 16, marker: 'cross' },
    { id: 'e5', shellIndex: 1, position: 'custom', angleDeg: 90, marker: 'cross' },
    { id: 'e6', shellIndex: 1, position: 'custom', angleDeg: 106, marker: 'cross' },
    { id: 'e7', shellIndex: 1, position: 'custom', angleDeg: 180, marker: 'cross' },
    { id: 'e8', shellIndex: 1, position: 'custom', angleDeg: 196, marker: 'cross' },
    { id: 'e9', shellIndex: 1, position: 'custom', angleDeg: 270, marker: 'cross' },
    { id: 'e10', shellIndex: 1, position: 'custom', angleDeg: 286, marker: 'cross' },
    // Shell 3: 1 electron
    { id: 'e11', shellIndex: 2, position: 'custom', angleDeg: 270, marker: 'cross' }
  ],
  hasBracket: false,
  charge: 0,
  coefficient: 1
};

const r2 = evaluateDiagram([naAtom], [], QUESTS[0]);
console.log("Test 2 (Na Atom Ground State):", r2.isCorrect ? "PASS (Score 100%)" : "FAIL", r2.grade);

// Test 3: Sodium ion Na+
const naIon: DiagramAtom = {
  id: 'a1',
  symbol: 'Na',
  x: 260,
  y: 220,
  numShells: 2,
  electrons: naAtom.electrons.slice(0, 10),
  hasBracket: true,
  charge: 1,
  coefficient: 1
};
const r3 = evaluateDiagram([naIon], [], QUESTS[1]);
console.log("Test 3 (Na+ Cation):", r3.isCorrect ? "PASS (Score 100%)" : "FAIL", r3.grade);

// Test 4: O2 double bond
const o1: DiagramAtom = {
  id: 'o1',
  symbol: 'O',
  x: 200,
  y: 220,
  numShells: 2,
  electrons: [
    // 2 in inner shell
    { id: 'e1', shellIndex: 0, angleDeg: 90, marker: 'dot', position: 'custom' },
    { id: 'e2', shellIndex: 0, angleDeg: 270, marker: 'dot', position: 'custom' },
    // 4 non-bonding in valence shell (2 lone pairs)
    { id: 'e3', shellIndex: 1, angleDeg: 90, marker: 'dot', position: 'custom' },
    { id: 'e4', shellIndex: 1, angleDeg: 106, marker: 'dot', position: 'custom' },
    { id: 'e5', shellIndex: 1, angleDeg: 270, marker: 'dot', position: 'custom' },
    { id: 'e6', shellIndex: 1, angleDeg: 286, marker: 'dot', position: 'custom' },
  ],
  hasBracket: false,
  charge: 0,
  coefficient: 1
};
const o2: DiagramAtom = {
  id: 'o2',
  symbol: 'O',
  x: 360,
  y: 220,
  numShells: 2,
  electrons: [
    { id: 'e7', shellIndex: 0, angleDeg: 90, marker: 'cross', position: 'custom' },
    { id: 'e8', shellIndex: 0, angleDeg: 270, marker: 'cross', position: 'custom' },
    { id: 'e9', shellIndex: 1, angleDeg: 90, marker: 'cross', position: 'custom' },
    { id: 'e10', shellIndex: 1, angleDeg: 106, marker: 'cross', position: 'custom' },
    { id: 'e11', shellIndex: 1, angleDeg: 270, marker: 'cross', position: 'custom' },
    { id: 'e12', shellIndex: 1, angleDeg: 286, marker: 'cross', position: 'custom' },
  ],
  hasBracket: false,
  charge: 0,
  coefficient: 1
};
const bondO2: DiagramBond = {
  id: 'b1',
  atom1Id: 'o1',
  atom2Id: 'o2',
  bondOrder: 2,
  markerType1: 'dot',
  markerType2: 'cross'
};
const r4 = evaluateDiagram([o1, o2], [bondO2], QUESTS[7]); // quest-8-o2-double
console.log("Test 4 (O2 Double Bond Molecule):", r4.isCorrect ? "PASS (Score 100%)" : "FAIL", r4.grade);
