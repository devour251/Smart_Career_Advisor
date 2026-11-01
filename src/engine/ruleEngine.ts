import type { CareerRecord, StudentProfile, RIASECScores } from '../types/sankalp';

/**
 * Deterministic & Soft-Constraint Rule-Based Reasoning Engine
 *
 * Implements:
 * 1. Original Sankalp Rigid Rule Engine (IEEE Paper Section III-B4 & Section VII-A):
 *    Applies hard step-function cutoffs on academic percentage, stream, and required subjects.
 *    Demonstrates the exact "Rule-Model Rigidity" limitation discussed in Section VII-A.
 *
 * 2. Improved Soft Fuzzy-Constraint & NEP-2020 Bridge Reasoning Engine:
 *    Replaces brittle cliff-edge cutoffs with calibrated logistic/piecewise feasibility curves,
 *    recognizes NEP-2020 lateral/multidisciplinary bridges (e.g., Diploma -> B.Tech, BCA -> SDE,
 *    Commerce + Math -> Data/FinTech), and incorporates Holland's RIASEC cosine fit.
 */

export interface RuleEvaluationResult {
  score: number;              // [0, 1]
  riasecFit: number;          // [0, 1]
  matchedSubjects: string[];
  matchedSkills: string[];
  missingSkills: string[];
  softRuleRecovered: boolean;
  remediationAdvice: string | null;
}

function normalizeToken(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9+#]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function computeRIASECCosineFit(
  studentRIASEC: Partial<RIASECScores> | undefined,
  careerRIASEC: RIASECScores
): number {
  if (!studentRIASEC) return 0.65; // Neutral prior when psychometric slider is skipped
  const keys: Array<keyof RIASECScores> = ['R', 'I', 'A', 'S', 'E', 'C'];
  const provided = keys.filter((k) => typeof studentRIASEC[k] === 'number');
  if (provided.length === 0) return 0.65;

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const k of keys) {
    const rawVal = studentRIASEC[k];
    const a = typeof rawVal === 'number' ? (rawVal > 1 ? rawVal / 100 : rawVal) : 0.5;
    const b = careerRIASEC[k];
    dot += a * b;
    normA += a * a;
    normB += b * b;
  }
  if (normA === 0 || normB === 0) return 0.65;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function matchAttributes(studentItems: string[], requiredItems: string[]): {
  matched: string[];
  missing: string[];
} {
  const studentNorm = studentItems.map(normalizeToken).filter(Boolean);
  const matched: string[] = [];
  const missing: string[] = [];

  for (const req of requiredItems) {
    const reqNorm = normalizeToken(req);
    const reqWords = reqNorm.split(' ').filter((w) => w.length >= 3);
    const isHit = studentNorm.some(
      (st) =>
        st.includes(reqNorm) ||
        reqNorm.includes(st) ||
        reqWords.some((w) => st.split(' ').includes(w))
    );
    if (isHit) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  }
  return { matched, missing };
}

/**
 * 1. ORIGINAL SANKALP RIGID RULE ENGINE (Baseline)
 * Strict deterministic IF-THEN filters:
 * - Hard penalty if academicPercentage < minAcademicScore
 * - Hard penalty if student stream is not explicitly listed in eligibleStreams
 * - Strict fraction of matched subjects & skills
 */
export function evaluateOriginalRigidRules(
  profile: StudentProfile,
  career: CareerRecord
): RuleEvaluationResult {
  // Stage alignment
  const levelMatch = career.applicableLevels.includes(profile.educationLevel) ? 1.0 : 0.35;

  // Hard stream check
  const streamNorm = normalizeToken(profile.currentStream || '');
  const streamExact =
    !streamNorm ||
    career.eligibleStreams.some((es) => {
      const e = normalizeToken(es);
      return streamNorm.includes(e) || e.includes(streamNorm);
    });
  const streamFactor = streamExact ? 1.0 : 0.20; // Rigid cliff penalty

  // Hard academic threshold check (Section III-B4 & VII-A rigidity)
  let academicFactor = 0.60; // Penalizes missing marks in baseline
  if (profile.academicPercentage !== null && profile.academicPercentage !== undefined) {
    academicFactor = profile.academicPercentage >= career.minAcademicScore ? 1.0 : 0.25;
  }

  const allStudentSubjects = [
    ...profile.preferredSubjects,
    ...Object.keys(profile.subjectMarks || {}),
  ];
  const subjectEval = matchAttributes(allStudentSubjects, career.requiredSubjects);
  const subjectRatio =
    career.requiredSubjects.length > 0
      ? subjectEval.matched.length / career.requiredSubjects.length
      : 1.0;

  const skillEval = matchAttributes(
    [...profile.skills, ...profile.interests],
    career.requiredSkills
  );
  const skillRatio =
    career.requiredSkills.length > 0
      ? skillEval.matched.length / career.requiredSkills.length
      : 0.5;

  const riasecFit = computeRIASECCosineFit(profile.riasecScores, career.riasecProfile);

  const rawRuleScore =
    levelMatch *
    streamFactor *
    academicFactor *
    (0.45 * subjectRatio + 0.35 * skillRatio + 0.20 * riasecFit);

  return {
    score: Math.max(0.02, Math.min(1.0, rawRuleScore)),
    riasecFit,
    matchedSubjects: subjectEval.matched,
    matchedSkills: skillEval.matched,
    missingSkills: skillEval.missing,
    softRuleRecovered: false,
    remediationAdvice: null,
  };
}

/**
 * 2. IMPROVED SOFT-CONSTRAINT & BRIDGE REASONING ENGINE
 * Overcomes Rule-Model Rigidity (Paper Section VII-A):
 * - Smooth logistic feasibility for borderline marks (within 1–10% of cutoff)
 * - NEP-2020 multidisciplinary & lateral-entry bridge pathways
 * - Graceful Bayesian neutral prior when academicPercentage is omitted (incomplete profile)
 */
const MULTIDISCIPLINARY_BRIDGES: Record<string, string[]> = {
  diploma: ['engineering', 'computing', 'skilled_polytechnic'],
  commerce: ['computing', 'data_cloud', 'management_consulting', 'law_policy', 'design_media'],
  'arts/humanities': ['law_policy', 'design_media', 'management_consulting', 'healthcare_biosciences'],
  science: ['engineering', 'medical', 'computing', 'commerce_finance', 'law_policy', 'design_media'],
  computing: ['software_ai', 'data_cloud', 'commerce_finance', 'design_media', 'management_consulting'],
  'iti/vocational': ['skilled_polytechnic', 'diploma'],
};

export function evaluateImprovedSoftRules(
  profile: StudentProfile,
  career: CareerRecord,
  imputedSkills: string[] = []
): RuleEvaluationResult {
  // Smooth stage progression alignment (After 10th students also plan toward After 12th/UG targets)
  let levelFactor = 1.0;
  if (!career.applicableLevels.includes(profile.educationLevel)) {
    if (profile.educationLevel === 'after_10th' && career.applicableLevels.includes('after_12th')) {
      levelFactor = 0.68; // Forward horizon planning without overriding current-stage targets
    } else if (profile.educationLevel === 'after_12th' && career.applicableLevels.includes('undergraduate')) {
      levelFactor = 0.70;
    } else {
      levelFactor = 0.50;
    }
  }

  let softRuleRecovered = false;
  const remediationNotes: string[] = [];

  // Smooth stream & NEP-2020 lateral bridge compatibility
  const streamNorm = normalizeToken(profile.currentStream || '');
  const directStreamMatch =
    !streamNorm ||
    career.eligibleStreams.some((es) => {
      const e = normalizeToken(es);
      return streamNorm.includes(e) || e.includes(streamNorm);
    });

  let streamFactor = 1.0;
  if (!directStreamMatch) {
    const bridgeSectors = Object.entries(MULTIDISCIPLINARY_BRIDGES).find(([k]) =>
      streamNorm.includes(normalizeToken(k))
    )?.[1];
    if (bridgeSectors && bridgeSectors.includes(career.sectorId)) {
      streamFactor = 0.84;
      softRuleRecovered = true;
      remediationNotes.push(career.bridgePathway);
    } else {
      streamFactor = 0.48;
    }
  }

  // Smooth logistic academic feasibility curve instead of step-cliff
  let academicFactor = 0.86; // Non-punitive neutral prior for incomplete profiles!
  if (profile.academicPercentage !== null && profile.academicPercentage !== undefined) {
    const delta = profile.academicPercentage - career.minAcademicScore;
    if (delta >= 0) {
      academicFactor = Math.min(1.0, 0.92 + 0.08 * Math.min(1, delta / 15));
    } else if (delta >= -8) {
      // Borderline zone (1% to 8% below cutoff): smooth logistic decay [0.72, 0.90] + bridge advice
      academicFactor = 0.90 / (1 + Math.exp(-0.28 * (delta + 4)));
      softRuleRecovered = true;
      remediationNotes.push(
        `Academic score (${profile.academicPercentage}%) is slightly below the standard ${career.minAcademicScore}% benchmark — feasible via: ${career.bridgePathway}`
      );
    } else {
      academicFactor = Math.max(0.42, 0.65 / (1 + Math.exp(-0.15 * (delta + 12))));
    }
  }

  const allStudentSubjects = [
    ...profile.preferredSubjects,
    ...Object.keys(profile.subjectMarks || {}),
  ];
  const subjectEval = matchAttributes(allStudentSubjects, career.requiredSubjects);
  const subjectRatio =
    career.requiredSubjects.length > 0
      ? subjectEval.matched.length / career.requiredSubjects.length
      : 0.85;

  // Include Knowledge-Graph imputed skills when profile is sparse
  const combinedSkills = [...new Set([...profile.skills, ...profile.interests, ...imputedSkills])];
  const skillEval = matchAttributes(combinedSkills, career.requiredSkills);
  const skillRatio =
    career.requiredSkills.length > 0
      ? skillEval.matched.length / career.requiredSkills.length
      : 0.65;

  // Aptitude alignment bonus if student completed aptitude sliders
  let aptitudeFit = 0.72;
  const apt = profile.aptitudeScores || {};
  if (Object.keys(apt).length > 0) {
    const quant = (apt.quantitative ?? 65) / 100;
    const anal = (apt.analytical ?? 65) / 100;
    const verb = (apt.verbal ?? 65) / 100;
    const crea = (apt.creative ?? 65) / 100;
    const prac = (apt.practical ?? 65) / 100;
    const r = career.riasecProfile;
    aptitudeFit =
      (r.R * prac + r.I * (0.5 * anal + 0.5 * quant) + r.A * crea + r.S * verb + r.E * verb + r.C * quant) /
      (r.R + r.I + r.A + r.S + r.E + r.C + 1e-6);
  }

  const riasecFit = computeRIASECCosineFit(profile.riasecScores, career.riasecProfile);

  const weightedCore =
    0.30 * subjectRatio +
    0.30 * skillRatio +
    0.25 * riasecFit +
    0.15 * aptitudeFit;

  const finalFeasibility = levelFactor * streamFactor * academicFactor * (0.32 + 0.68 * weightedCore);

  return {
    score: Math.max(0.05, Math.min(1.0, finalFeasibility)),
    riasecFit,
    matchedSubjects: subjectEval.matched,
    matchedSkills: skillEval.matched,
    missingSkills: skillEval.missing,
    softRuleRecovered,
    remediationAdvice: remediationNotes.length > 0 ? remediationNotes[0] : null,
  };
}
