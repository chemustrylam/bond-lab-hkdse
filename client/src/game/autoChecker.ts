import { DiagramAtom, DiagramBond, ChallengeQuest, ELEMENTS_DATA } from './chemistryData';

export interface CheckCriterion {
  id: string;
  label: string;
  passed: boolean;
  message: string;
  penaltyOrNote?: string;
}

export interface CheckResult {
  isCorrect: boolean;
  scorePercent: number;
  grade: '5**' | '5*' | '5' | '4' | 'Level 3' | 'Needs Practice';
  summary: string;
  criteria: CheckCriterion[];
  hkdseFeedback: string[];
}

export function evaluateDiagram(
  atoms: DiagramAtom[],
  bonds: DiagramBond[],
  quest?: ChallengeQuest
): CheckResult {
  const criteria: CheckCriterion[] = [];
  const feedback: string[] = [];

  if (atoms.length === 0) {
    return {
      isCorrect: false,
      scorePercent: 0,
      grade: 'Needs Practice',
      summary: 'Canvas is empty! Add at least one atom to start drawing.',
      criteria: [{ id: 'empty', label: 'Canvas content', passed: false, message: 'No atoms on canvas' }],
      hkdseFeedback: ['Place an atom (e.g., Na, Cl, O) from the periodic selector onto the canvas.']
    };
  }

  // 1. If in Quest mode, evaluate against target quest specifications
  if (quest) {
    // Check required atom count and element identity
    let atomTypesMatch = true;
    for (const exp of quest.expectedAtoms) {
      const matched = atoms.filter(a => a.symbol === exp.symbol);
      const totalCount = matched.reduce((sum, a) => sum + (a.coefficient || 1), 0);
      if (totalCount !== exp.count) {
        atomTypesMatch = false;
        feedback.push(`Expected ${exp.count} of ${exp.symbol}, but found ${totalCount}.`);
      }
    }
    criteria.push({
      id: 'atom_types',
      label: 'Correct Chemical Elements & Ratios',
      passed: atomTypesMatch,
      message: atomTypesMatch ? 'Chemical elements and stoichiometric ratios are correct.' : 'Atom count or element selection differs from target formula.'
    });

    // Check Ionic Brackets and Charges
    let bracketsAndChargePass = true;
    for (const exp of quest.expectedAtoms) {
      const matched = atoms.filter(a => a.symbol === exp.symbol);
      for (const atom of matched) {
        if (exp.hasBracket && !atom.hasBracket) {
          bracketsAndChargePass = false;
          feedback.push(`HKDSE Rule M1: Ion [${atom.symbol}] must be enclosed in square brackets [ ]!`);
        }
        if (!exp.hasBracket && atom.hasBracket) {
          bracketsAndChargePass = false;
          feedback.push(`Neutral atom or covalent molecule [${atom.symbol}] should NOT have square brackets!`);
        }
        if (atom.charge !== exp.charge) {
          bracketsAndChargePass = false;
          const expSign = exp.charge > 0 ? (exp.charge === 1 ? '⁺' : `${exp.charge}+`) : exp.charge < 0 ? (exp.charge === -1 ? '⁻' : `${Math.abs(exp.charge)}-`) : '0';
          const actSign = atom.charge > 0 ? (atom.charge === 1 ? '⁺' : `${atom.charge}+`) : atom.charge < 0 ? (atom.charge === -1 ? '⁻' : `${Math.abs(atom.charge)}-`) : '0';
          feedback.push(`Charge mismatch on ${atom.symbol}: expected ${expSign}, but received ${actSign}.`);
        }
      }
    }
    criteria.push({
      id: 'bracket_charge',
      label: 'Square Brackets & Charge Convention',
      passed: bracketsAndChargePass,
      message: bracketsAndChargePass ? 'Square brackets and ionic charge superscripts match HKDSE standards.' : 'Charge or bracket notation has errors.'
    });

    // Check valence electrons / octet-duplet rule
    let octetPass = true;
    for (const atom of atoms) {
      const exp = quest.expectedAtoms.find(e => e.symbol === atom.symbol);
      const expectedValence = exp?.expectedValenceElectrons ?? 8;
      
      // Calculate effective valence electrons: non-bonding valence shell + shared in bonds
      const valenceShellIndex = Math.max(0, atom.numShells - 1);
      const nonBondingValence = atom.electrons.filter(e => e.shellIndex === valenceShellIndex).length;
      
      // Calculate shared electrons from bonds connected to this atom
      let sharedCount = 0;
      for (const b of bonds) {
        if (b.atom1Id === atom.id || b.atom2Id === atom.id) {
          sharedCount += b.bondOrder * 2; // each bond order contributes 2 electrons
        }
      }

      const totalValence = nonBondingValence + sharedCount;
      if (totalValence !== expectedValence) {
        octetPass = false;
        feedback.push(`${atom.symbol} has ${totalValence} valence electrons (expected ${expectedValence} for noble gas stability / octet rule).`);
      }
    }
    criteria.push({
      id: 'valence_octet',
      label: 'Octet / Duplet Stability (Outer Shell)',
      passed: octetPass,
      message: octetPass ? 'All atoms attained stable noble gas electronic arrangements!' : 'Outer electron counts do not satisfy octet/duplet requirements.'
    });

    // Check Covalent Bonds if expected
    if (quest.expectedBonds && quest.expectedBonds.length > 0) {
      let bondsPass = true;
      for (const expBond of quest.expectedBonds) {
        const found = bonds.some(b => {
          const a1 = atoms.find(a => a.id === b.atom1Id);
          const a2 = atoms.find(a => a.id === b.atom2Id);
          if (!a1 || !a2) return false;
          const matchSymbols = (a1.symbol === expBond.symbolA && a2.symbol === expBond.symbolB) ||
                               (a1.symbol === expBond.symbolB && a2.symbol === expBond.symbolA);
          return matchSymbols && b.bondOrder === expBond.bondOrder;
        });
        if (!found) {
          bondsPass = false;
          feedback.push(`Missing bond between ${expBond.symbolA} and ${expBond.symbolB} (Order: ${expBond.bondOrder === 1 ? 'Single Bond (1 pair)' : expBond.bondOrder === 2 ? 'Double Bond (2 pairs)' : 'Triple Bond (3 pairs)'}).`);
        }
      }
      criteria.push({
        id: 'covalent_bonds',
        label: 'Covalent Bond Pairs Sharing',
        passed: bondsPass,
        message: bondsPass ? 'Correct number of shared electron pairs between bonded atoms.' : 'Shared bond pairs missing or incorrect bond multiplicity.'
      });
    }

    // Check Overall Electrical Neutrality
    const netCharge = atoms.reduce((acc, a) => acc + (a.charge * (a.coefficient || 1)), 0);
    const expectedNetCharge = quest.category.includes('ion') && !quest.category.includes('compound') ? (quest.expectedAtoms[0]?.charge || 0) : 0;
    const isNeutralOrCorrectNet = netCharge === expectedNetCharge;
    criteria.push({
      id: 'net_charge',
      label: quest.category.includes('ion') && !quest.category.includes('compound') ? 'Net Ion Charge' : 'Overall Compound Neutrality',
      passed: isNeutralOrCorrectNet,
      message: isNeutralOrCorrectNet 
        ? `Net charge correctly equals ${expectedNetCharge >= 0 ? '+' : ''}${expectedNetCharge}.` 
        : `Net charge is ${netCharge >= 0 ? '+' : ''}${netCharge}, but expected ${expectedNetCharge}. Compounds must be electrically neutral!`
    });

  } else {
    // Free Sandbox Evaluation: General Chemistry Rules
    // 1. Octet Check for each atom
    let allOctetsValid = true;
    for (const atom of atoms) {
      const elem = ELEMENTS_DATA[atom.symbol];
      const targetElectrons = elem.symbol === 'H' ? 2 : 8;
      const valenceShellIndex = Math.max(0, atom.numShells - 1);
      const nonBonding = atom.electrons.filter(e => e.shellIndex === valenceShellIndex).length;
      let shared = 0;
      for (const b of bonds) {
        if (b.atom1Id === atom.id || b.atom2Id === atom.id) shared += b.bondOrder * 2;
      }
      const total = nonBonding + shared;
      // Allow neutral atom ground state OR stable ion
      const isGroundState = total === elem.valenceElectrons && atom.charge === 0;
      const isNobleGasOctet = total === targetElectrons;
      if (!isGroundState && !isNobleGasOctet) {
        allOctetsValid = false;
        feedback.push(`${atom.symbol} has ${total} valence electrons. Expected ground state (${elem.valenceElectrons}) or stable octet (${targetElectrons}).`);
      }
    }
    criteria.push({
      id: 'free_octet',
      label: 'Electron Configuration Stability',
      passed: allOctetsValid,
      message: allOctetsValid ? 'All atoms have valid ground state or stable noble gas valence counts.' : 'Some atoms have unstable valence electron arrangements.'
    });

    // 2. Net charge check
    const netCharge = atoms.reduce((acc, a) => acc + (a.charge * (a.coefficient || 1)), 0);
    const isNeutral = netCharge === 0;
    criteria.push({
      id: 'free_neutrality',
      label: 'Electrical Charge Balance',
      passed: isNeutral,
      message: isNeutral ? 'System is electrically neutral (Net charge = 0).' : `Non-zero net charge (${netCharge > 0 ? '+' : ''}${netCharge}). If this is a neutral compound, charges must cancel.`
    });

    // 3. Dot and cross differentiation check
    let hasBothMarkers = false;
    if (atoms.length > 1) {
      const markers = new Set(atoms.flatMap(a => a.electrons.map(e => e.marker)));
      hasBothMarkers = markers.has('dot') && markers.has('cross');
      criteria.push({
        id: 'dot_cross_contrast',
        label: 'DSE Dot (•) & Cross (×) Contrast',
        passed: hasBothMarkers,
        message: hasBothMarkers ? 'Good practice! Different electron markers used to distinguish electron sources.' : 'Recommendation: In HKDSE, use dots (•) for one atom and crosses (×) for the other to show origin of electrons.',
        penaltyOrNote: hasBothMarkers ? undefined : 'Minor HKDSE Presentation Tip'
      });
    }
  }

  const passedCount = criteria.filter(c => c.passed).length;
  const scorePercent = Math.round((passedCount / criteria.length) * 100);
  const isCorrect = scorePercent === 100;

  let grade: '5**' | '5*' | '5' | '4' | 'Level 3' | 'Needs Practice' = 'Needs Practice';
  if (scorePercent === 100) grade = '5**';
  else if (scorePercent >= 80) grade = '5*';
  else if (scorePercent >= 60) grade = '5';
  else if (scorePercent >= 40) grade = '4';
  else if (scorePercent >= 20) grade = 'Level 3';

  return {
    isCorrect,
    scorePercent,
    grade,
    summary: isCorrect 
      ? 'Excellent! Meets 100% of HKDSE electron diagram marking criteria.' 
      : `Scored ${scorePercent}% (${passedCount}/${criteria.length} criteria passed). Review teacher tips below.`,
    criteria,
    hkdseFeedback: feedback.length > 0 ? feedback : ['All representations follow HKDSE standard chemistry syllabus guidelines!']
  };
}
