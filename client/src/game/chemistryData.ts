export type ElementSymbol = 
  | 'H' | 'He' | 'Li' | 'Be' | 'B' | 'C' | 'N' | 'O' | 'F' | 'Ne'
  | 'Na' | 'Mg' | 'Al' | 'Si' | 'P' | 'S' | 'Cl' | 'Ar' | 'K' | 'Ca';

export interface ElementInfo {
  symbol: ElementSymbol;
  name: string;
  chineseName: string;
  atomicNumber: number;
  electronArrangement: number[];
  valenceElectrons: number;
  period: number;
  group: number;
  isMetal: boolean;
  commonIonCharge: number; // e.g. +1, +2, -1, -2
  commonIonArrangement: number[];
}

export const ELEMENTS_DATA: Record<ElementSymbol, ElementInfo> = {
  H: { symbol: 'H', name: 'Hydrogen', chineseName: '氫', atomicNumber: 1, electronArrangement: [1], valenceElectrons: 1, period: 1, group: 1, isMetal: false, commonIonCharge: 1, commonIonArrangement: [0] },
  He: { symbol: 'He', name: 'Helium', chineseName: '氦', atomicNumber: 2, electronArrangement: [2], valenceElectrons: 2, period: 1, group: 8, isMetal: false, commonIonCharge: 0, commonIonArrangement: [2] },
  Li: { symbol: 'Li', name: 'Lithium', chineseName: '鋰', atomicNumber: 3, electronArrangement: [2, 1], valenceElectrons: 1, period: 2, group: 1, isMetal: true, commonIonCharge: 1, commonIonArrangement: [2] },
  Be: { symbol: 'Be', name: 'Beryllium', chineseName: '鈹', atomicNumber: 4, electronArrangement: [2, 2], valenceElectrons: 2, period: 2, group: 2, isMetal: true, commonIonCharge: 2, commonIonArrangement: [2] },
  B: { symbol: 'B', name: 'Boron', chineseName: '硼', atomicNumber: 5, electronArrangement: [2, 3], valenceElectrons: 3, period: 2, group: 3, isMetal: false, commonIonCharge: 3, commonIonArrangement: [2] },
  C: { symbol: 'C', name: 'Carbon', chineseName: '碳', atomicNumber: 6, electronArrangement: [2, 4], valenceElectrons: 4, period: 2, group: 4, isMetal: false, commonIonCharge: 0, commonIonArrangement: [2, 4] },
  N: { symbol: 'N', name: 'Nitrogen', chineseName: '氮', atomicNumber: 7, electronArrangement: [2, 5], valenceElectrons: 5, period: 2, group: 5, isMetal: false, commonIonCharge: -3, commonIonArrangement: [2, 8] },
  O: { symbol: 'O', name: 'Oxygen', chineseName: '氧', atomicNumber: 8, electronArrangement: [2, 6], valenceElectrons: 6, period: 2, group: 6, isMetal: false, commonIonCharge: -2, commonIonArrangement: [2, 8] },
  F: { symbol: 'F', name: 'Fluorine', chineseName: '氟', atomicNumber: 9, electronArrangement: [2, 7], valenceElectrons: 7, period: 2, group: 7, isMetal: false, commonIonCharge: -1, commonIonArrangement: [2, 8] },
  Ne: { symbol: 'Ne', name: 'Neon', chineseName: '氖', atomicNumber: 10, electronArrangement: [2, 8], valenceElectrons: 8, period: 2, group: 8, isMetal: false, commonIonCharge: 0, commonIonArrangement: [2, 8] },
  Na: { symbol: 'Na', name: 'Sodium', chineseName: '鈉', atomicNumber: 11, electronArrangement: [2, 8, 1], valenceElectrons: 1, period: 3, group: 1, isMetal: true, commonIonCharge: 1, commonIonArrangement: [2, 8] },
  Mg: { symbol: 'Mg', name: 'Magnesium', chineseName: '鎂', atomicNumber: 12, electronArrangement: [2, 8, 2], valenceElectrons: 2, period: 3, group: 2, isMetal: true, commonIonCharge: 2, commonIonArrangement: [2, 8] },
  Al: { symbol: 'Al', name: 'Aluminium', chineseName: '鋁', atomicNumber: 13, electronArrangement: [2, 8, 3], valenceElectrons: 3, period: 3, group: 3, isMetal: true, commonIonCharge: 3, commonIonArrangement: [2, 8] },
  Si: { symbol: 'Si', name: 'Silicon', chineseName: '矽', atomicNumber: 14, electronArrangement: [2, 8, 4], valenceElectrons: 4, period: 3, group: 4, isMetal: false, commonIonCharge: 0, commonIonArrangement: [2, 8, 4] },
  P: { symbol: 'P', name: 'Phosphorus', chineseName: '磷', atomicNumber: 15, electronArrangement: [2, 8, 5], valenceElectrons: 5, period: 3, group: 5, isMetal: false, commonIonCharge: -3, commonIonArrangement: [2, 8, 8] },
  S: { symbol: 'S', name: 'Sulphur', chineseName: '硫', atomicNumber: 16, electronArrangement: [2, 8, 6], valenceElectrons: 6, period: 3, group: 6, isMetal: false, commonIonCharge: -2, commonIonArrangement: [2, 8, 8] },
  Cl: { symbol: 'Cl', name: 'Chlorine', chineseName: '氯', atomicNumber: 17, electronArrangement: [2, 8, 7], valenceElectrons: 7, period: 3, group: 7, isMetal: false, commonIonCharge: -1, commonIonArrangement: [2, 8, 8] },
  Ar: { symbol: 'Ar', name: 'Argon', chineseName: '氬', atomicNumber: 18, electronArrangement: [2, 8, 8], valenceElectrons: 8, period: 3, group: 8, isMetal: false, commonIonCharge: 0, commonIonArrangement: [2, 8, 8] },
  K: { symbol: 'K', name: 'Potassium', chineseName: '鉀', atomicNumber: 19, electronArrangement: [2, 8, 8, 1], valenceElectrons: 1, period: 4, group: 1, isMetal: true, commonIonCharge: 1, commonIonArrangement: [2, 8, 8] },
  Ca: { symbol: 'Ca', name: 'Calcium', chineseName: '鈣', atomicNumber: 20, electronArrangement: [2, 8, 8, 2], valenceElectrons: 2, period: 4, group: 2, isMetal: true, commonIonCharge: 2, commonIonArrangement: [2, 8, 8] },
};

export type ElectronMarker = 'dot' | 'cross';

export interface DiagramElectron {
  id: string;
  shellIndex: number; // 0 is innermost shell
  position: 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left' | 'custom';
  angleDeg: number; // 0 to 360 deg
  marker: ElectronMarker;
  isBondPair?: boolean;
  partnerAtomId?: string;
}

export interface DiagramAtom {
  id: string;
  symbol: ElementSymbol;
  x: number;
  y: number;
  numShells: number; // number of circular shells drawn
  electrons: DiagramElectron[];
  hasBracket: boolean;
  charge: number; // 0, 1, 2, 3, -1, -2, -3
  coefficient: number; // e.g. 2 in 2 Cl-
  showOutermostOnly?: boolean;
}

export interface DiagramBond {
  id: string;
  atom1Id: string;
  atom2Id: string;
  bondOrder: 1 | 2 | 3; // single, double, triple
  markerType1: ElectronMarker;
  markerType2: ElectronMarker;
}

export interface ChallengeQuest {
  id: string;
  title: string;
  subtitle: string;
  category: 'neutral' | 'cation' | 'anion' | 'ionic_compound' | 'covalent_single' | 'covalent_multiple' | 'hkdse_exam';
  difficulty: 'Foundation' | 'Core' | 'HKDSE Master';
  prompt: string;
  hkdseYearRef?: string;
  targetFormula: string;
  targetDescription: string;
  initialAtoms: { symbol: ElementSymbol; x: number; y: number; charge?: number; hasBracket?: boolean }[];
  expectedAtoms: {
    symbol: ElementSymbol;
    count: number;
    charge: number;
    hasBracket: boolean;
    requiredShellCount?: number;
    expectedValenceElectrons: number;
  }[];
  expectedBonds?: {
    symbolA: ElementSymbol;
    symbolB: ElementSymbol;
    bondOrder: number;
  }[];
  explanation: string;
  hkdseTip: string;
  defaultOutermostOnly?: boolean;
}

export const QUESTS: ChallengeQuest[] = [
  {
    id: 'quest-1-na-atom',
    title: 'Mission 1: Neutral Sodium Atom (Na)',
    subtitle: 'Electronic configuration 2,8,1',
    category: 'neutral',
    difficulty: 'Foundation',
    prompt: 'Construct the electron diagram for a neutral sodium atom (Na). Add 3 electron shells and place all 11 electrons correctly (2 in 1st shell, 8 in 2nd shell, 1 in outermost shell).',
    hkdseYearRef: 'HKCEE 2004 / DSE Sample',
    targetFormula: 'Na',
    targetDescription: 'Sodium atom with 3 shells and 11 electrons (2, 8, 1)',
    initialAtoms: [{ symbol: 'Na', x: 260, y: 220 }],
    expectedAtoms: [
      { symbol: 'Na', count: 1, charge: 0, hasBracket: false, requiredShellCount: 3, expectedValenceElectrons: 1 }
    ],
    explanation: 'Sodium (atomic number 11) has 11 protons and 11 electrons. The electronic arrangement is 2,8,1 across three electron shells. In neutral atoms, no charge brackets are used.',
    hkdseTip: 'In HKDSE questions asking for an "electron diagram of an atom", remember to count total electrons. Pairing electrons in twos (at top, bottom, left, right) makes counting easy for examiners!'
  },
  {
    id: 'quest-2-na-cation',
    title: 'Mission 2: Formation of Sodium Ion (Na⁺)',
    subtitle: 'Losing 1 electron to attain octet',
    category: 'cation',
    difficulty: 'Foundation',
    prompt: 'Convert the sodium atom into a sodium ion (Na⁺). Remove the outermost electron, enclose in square brackets [ ], and set the charge to +1.',
    hkdseYearRef: 'DSE 2016 Paper 1A Q20',
    targetFormula: 'Na⁺',
    targetDescription: 'Sodium cation [Na]⁺ with electronic arrangement 2,8',
    initialAtoms: [{ symbol: 'Na', x: 260, y: 220 }],
    expectedAtoms: [
      { symbol: 'Na', count: 1, charge: 1, hasBracket: true, expectedValenceElectrons: 8 }
    ],
    explanation: 'A sodium atom (2,8,1) easily loses 1 outermost shell electron to attain the stable noble gas electronic arrangement of Neon (2,8). It now has 11 protons and 10 electrons, giving an overall net charge of 1+.',
    hkdseTip: 'DSE Marking Key: An ion MUST be enclosed in square brackets [ ] with the charge written as a superscript at the top right: write "⁺" or "1+", NEVER just a naked circle!'
  },
  {
    id: 'quest-3-mg-cation',
    title: 'Mission 3: Magnesium Ion (Mg²⁺)',
    subtitle: 'Losing 2 electrons to form 2+ cation',
    category: 'cation',
    difficulty: 'Core',
    prompt: 'Draw the electron diagram for magnesium ion (Mg²⁺). Add brackets and assign the 2+ charge.',
    hkdseYearRef: 'DSE 2018 Paper 1B',
    targetFormula: 'Mg²⁺',
    targetDescription: 'Magnesium cation [Mg]²⁺ with 2,8 arrangement',
    initialAtoms: [{ symbol: 'Mg', x: 260, y: 220 }],
    expectedAtoms: [
      { symbol: 'Mg', count: 1, charge: 2, hasBracket: true, expectedValenceElectrons: 8 }
    ],
    explanation: 'Magnesium (2,8,2) has 2 outermost shell electrons. It loses both electrons to form Mg²⁺, attaining the 2,8 neon configuration.',
    hkdseTip: 'Notice the HKDSE convention: write "2+", number before sign, NOT "+2".'
  },
  {
    id: 'quest-4-cl-anion',
    title: 'Mission 4: Chloride Ion (Cl⁻)',
    subtitle: 'Gaining 1 electron to complete octet',
    category: 'anion',
    difficulty: 'Core',
    prompt: 'Draw the electron diagram of a chloride ion (Cl⁻). Chlorine atom (2,8,7) gains 1 electron to form 2,8,8. Distinguish the gained electron using a different marker (dot vs cross)! Enclose in brackets [ ] and set charge -1.',
    hkdseYearRef: 'HKDSE Practice Paper',
    targetFormula: 'Cl⁻',
    targetDescription: 'Chloride anion [Cl]⁻ with octet 2,8,8 and 1 gained electron marked distinctly',
    initialAtoms: [{ symbol: 'Cl', x: 260, y: 220 }],
    expectedAtoms: [
      { symbol: 'Cl', count: 1, charge: -1, hasBracket: true, expectedValenceElectrons: 8 }
    ],
    explanation: 'Chlorine (2,8,7) needs 1 electron to achieve the noble gas arrangement of Argon (2,8,8). When it gains 1 electron, it forms Cl⁻ with 17 protons and 18 electrons (charge 1-).',
    hkdseTip: 'In HKDSE, marking schemes reward clearly showing the gained electron with a contrasting symbol (e.g., 7 crosses and 1 dot).'
  },
  {
    id: 'quest-5-nacl',
    title: 'Mission 5: Sodium Chloride (NaCl)',
    subtitle: 'The classic 1:1 ionic compound',
    category: 'ionic_compound',
    difficulty: 'Core',
    prompt: 'Build the electron diagram of sodium chloride (NaCl) showing both [Na]⁺ and [Cl]⁻ ions. Set their charges and brackets correctly.',
    hkdseYearRef: 'DSE 2013 Paper 1B',
    targetFormula: 'NaCl',
    targetDescription: 'Ionic pair [Na]⁺ and [Cl]⁻',
    initialAtoms: [
      { symbol: 'Na', x: 180, y: 220 },
      { symbol: 'Cl', x: 380, y: 220 }
    ],
    expectedAtoms: [
      { symbol: 'Na', count: 1, charge: 1, hasBracket: true, expectedValenceElectrons: 8 },
      { symbol: 'Cl', count: 1, charge: -1, hasBracket: true, expectedValenceElectrons: 8 }
    ],
    explanation: 'Sodium loses 1 electron to chlorine. Electrostatic attraction between Na⁺ and Cl⁻ forms the ionic bond. Total compound is electrically neutral (1+ + 1- = 0).',
    hkdseTip: 'Place the cation on the left and the anion on the right. Both must have their own square brackets with charges outside!'
  },
  {
    id: 'quest-6-mgcl2',
    title: 'Mission 6: Magnesium Chloride (MgCl₂)',
    subtitle: '1:2 stoichiometric ionic ratio',
    category: 'ionic_compound',
    difficulty: 'HKDSE Master',
    prompt: 'Construct the electron diagram for magnesium chloride (MgCl₂). One Mg atom loses 2 electrons, which are accepted by two Cl atoms. Arrange as [Cl]⁻ [Mg]²⁺ [Cl]⁻ or 2[Cl]⁻ [Mg]²⁺.',
    hkdseYearRef: 'DSE 2017 Paper 1A Q8',
    targetFormula: 'MgCl₂',
    targetDescription: 'One [Mg]²⁺ ion balanced by two [Cl]⁻ ions',
    initialAtoms: [
      { symbol: 'Cl', x: 130, y: 220 },
      { symbol: 'Mg', x: 280, y: 220 },
      { symbol: 'Cl', x: 430, y: 220 }
    ],
    expectedAtoms: [
      { symbol: 'Mg', count: 1, charge: 2, hasBracket: true, expectedValenceElectrons: 8 },
      { symbol: 'Cl', count: 2, charge: -1, hasBracket: true, expectedValenceElectrons: 8 }
    ],
    explanation: 'Mg²⁺ has a 2+ charge while each Cl⁻ has 1-. Therefore, two chloride ions are required for each magnesium ion to maintain electrical neutrality.',
    hkdseTip: 'Students frequently forget the second Cl⁻ ion in DSE. Always verify the sum of charges: (+2) + 2×(-1) = 0.'
  },
  {
    id: 'quest-7-cl2-covalent',
    title: 'Mission 7: Chlorine Molecule (Cl₂)',
    subtitle: 'Single covalent bond by sharing 1 pair of electrons',
    category: 'covalent_single',
    difficulty: 'Core',
    prompt: 'Draw the electron diagram of a chlorine molecule (Cl₂). Overlap their outermost shells to share 1 bond pair (• ×), leaving 3 lone pairs (6 non-bonding electrons) on each Cl atom.',
    hkdseYearRef: 'DSE 2015 Paper 1B',
    targetFormula: 'Cl₂',
    targetDescription: 'Cl-Cl single covalent bond with 1 shared pair and 3 lone pairs on each atom',
    initialAtoms: [
      { symbol: 'Cl', x: 200, y: 220 },
      { symbol: 'Cl', x: 360, y: 220 }
    ],
    expectedAtoms: [
      { symbol: 'Cl', count: 2, charge: 0, hasBracket: false, expectedValenceElectrons: 8 }
    ],
    expectedBonds: [
      { symbolA: 'Cl', symbolB: 'Cl', bondOrder: 1 }
    ],
    explanation: 'Each Cl atom contributes 1 electron to form 1 shared pair (covalent bond). Both chlorine atoms achieve an octet configuration (8 outermost electrons).',
    hkdseTip: 'DSE mark penalty: Common student mistake is drawing the shared bond pair but FORGETTING the lone pairs on the outer chlorine atoms! Lone pairs must be drawn unless the question explicitly asks for "bond pairs only".'
  },
  {
    id: 'quest-8-o2-double',
    title: 'Mission 8: Oxygen Molecule (O₂)',
    subtitle: 'Double covalent bond (2 shared pairs: 4 electrons)',
    category: 'covalent_multiple',
    difficulty: 'HKDSE Master',
    prompt: 'Draw the electron diagram of an oxygen molecule (O₂). Share 2 pairs of electrons (4 electrons total in overlap: •• ××), and include 2 lone pairs on each O atom.',
    hkdseYearRef: 'DSE 2019 Paper 1B Q3',
    targetFormula: 'O₂',
    targetDescription: 'O=O double bond with 2 shared pairs and 2 lone pairs per O',
    initialAtoms: [
      { symbol: 'O', x: 200, y: 220 },
      { symbol: 'O', x: 360, y: 220 }
    ],
    expectedAtoms: [
      { symbol: 'O', count: 2, charge: 0, hasBracket: false, expectedValenceElectrons: 8 }
    ],
    expectedBonds: [
      { symbolA: 'O', symbolB: 'O', bondOrder: 2 }
    ],
    explanation: 'Oxygen has 6 valence electrons (needs 2 to reach 8). Two oxygen atoms share 2 pairs of electrons, forming an O=O double covalent bond.',
    hkdseTip: 'Make sure 4 electrons appear in the intersection, and 4 non-bonding electrons remain on each oxygen atom.'
  },
  {
    id: 'quest-9-h2o',
    title: 'Mission 9: Water Molecule (H₂O)',
    subtitle: 'V-shaped molecule with 2 single bonds & 2 lone pairs',
    category: 'covalent_single',
    difficulty: 'Core',
    prompt: 'Draw the electron diagram for water (H₂O). Oxygen shares 1 electron pair with each of two Hydrogen atoms. Hydrogen attains a stable duplet (2 electrons) while Oxygen attains an octet (8 electrons).',
    hkdseYearRef: 'DSE 2021 Paper 1A',
    targetFormula: 'H₂O',
    targetDescription: 'Oxygen with two O-H single bonds and 2 lone pairs',
    initialAtoms: [
      { symbol: 'H', x: 140, y: 260 },
      { symbol: 'O', x: 280, y: 190 },
      { symbol: 'H', x: 420, y: 260 }
    ],
    expectedAtoms: [
      { symbol: 'O', count: 1, charge: 0, hasBracket: false, expectedValenceElectrons: 8 },
      { symbol: 'H', count: 2, charge: 0, hasBracket: false, expectedValenceElectrons: 2 }
    ],
    expectedBonds: [
      { symbolA: 'O', symbolB: 'H', bondOrder: 1 },
      { symbolA: 'O', symbolB: 'H', bondOrder: 1 }
    ],
    explanation: 'Hydrogen only needs 2 electrons (duplet of Helium). Oxygen has 2 bond pairs and 2 lone pairs.',
    hkdseTip: 'Notice Hydrogen only has 1 electron shell with 2 electrons. Do not give Hydrogen 8 electrons!'
  },
  {
    id: 'quest-10-co2',
    title: 'Mission 10: Carbon Dioxide (CO₂)',
    subtitle: 'Linear molecule with two C=O double bonds',
    category: 'covalent_multiple',
    difficulty: 'HKDSE Master',
    prompt: 'Construct carbon dioxide (CO₂). Carbon is the central atom sharing 2 pairs of electrons with each oxygen atom (two C=O double bonds). Do not forget oxygen’s lone pairs!',
    hkdseYearRef: 'DSE 2023 Paper 1B',
    targetFormula: 'CO₂',
    targetDescription: 'Linear O=C=O with two double bonds and lone pairs on both oxygens',
    initialAtoms: [
      { symbol: 'O', x: 120, y: 220 },
      { symbol: 'C', x: 280, y: 220 },
      { symbol: 'O', x: 440, y: 220 }
    ],
    expectedAtoms: [
      { symbol: 'C', count: 1, charge: 0, hasBracket: false, expectedValenceElectrons: 8 },
      { symbol: 'O', count: 2, charge: 0, hasBracket: false, expectedValenceElectrons: 8 }
    ],
    expectedBonds: [
      { symbolA: 'C', symbolB: 'O', bondOrder: 2 },
      { symbolA: 'C', symbolB: 'O', bondOrder: 2 }
    ],
    explanation: 'Carbon has 4 valence electrons and forms 4 covalent bonds. In CO₂, it forms 2 double bonds, one to each oxygen atom.',
    hkdseTip: 'Central carbon has 0 lone pairs. Both oxygens have 2 lone pairs each. Total valence electrons = 4 + 6×2 = 16.'
  }
];
