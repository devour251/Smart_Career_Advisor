import { CAREER_REPOSITORY, CAREER_BY_ID } from '../data/careerRepository';
import { processMultilingualImproved } from './multilingualModule';
import type {
  CareerRecord,
  KnowledgeGraphEdge,
  KnowledgeGraphNode,
  RIASECScores,
  StudentProfile,
} from '../types/sankalp';

/**
 * Knowledge Graph Explainability & Imputation Engine
 * Implements Section III-B8 of the IEEE Sankalp Paper + Phase 4 Graph Enhancements:
 * 1. Heterogeneous Career–Skill–Subject–Trait Graph construction
 * 2. Original 2-hop "neighbors-of-neighbors" unweighted discovery
 * 3. Improved Inverse-Degree-Frequency (IDF) weighted graph centrality (prevents generic skills
 *    from dominating rare specialist skills)
 * 4. Graph-prior imputation for incomplete student profiles
 */

interface AttributeGraphIndex {
  skillToCareers: Map<string, string[]>;
  subjectToCareers: Map<string, string[]>;
  traitToCareers: Map<string, string[]>;
  subjectToTopSkills: Map<string, string[]>;
  idfWeight: Map<string, number>;
}

let graphIndexCache: AttributeGraphIndex | null = null;

function normKey(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9+#]/g, ' ').replace(/\s+/g, ' ').trim();
}

function getGraphIndex(): AttributeGraphIndex {
  if (graphIndexCache) return graphIndexCache;

  const skillToCareers = new Map<string, string[]>();
  const subjectToCareers = new Map<string, string[]>();
  const traitToCareers = new Map<string, string[]>();
  const subjectSkillCounts = new Map<string, Map<string, number>>();
  const docFreq = new Map<string, number>();

  const totalDocs = CAREER_REPOSITORY.length;

  for (const c of CAREER_REPOSITORY) {
    for (const sk of c.requiredSkills) {
      const k = normKey(sk);
      skillToCareers.set(k, [...(skillToCareers.get(k) || []), c.id]);
      docFreq.set(`skill:${k}`, (docFreq.get(`skill:${k}`) || 0) + 1);
    }
    for (const sub of c.requiredSubjects) {
      const sKey = normKey(sub);
      subjectToCareers.set(sKey, [...(subjectToCareers.get(sKey) || []), c.id]);
      docFreq.set(`sub:${sKey}`, (docFreq.get(`sub:${sKey}`) || 0) + 1);

      if (!subjectSkillCounts.has(sKey)) subjectSkillCounts.set(sKey, new Map());
      const subMap = subjectSkillCounts.get(sKey)!;
      for (const sk of c.requiredSkills) {
        subMap.set(sk, (subMap.get(sk) || 0) + 1);
      }
    }
    for (const tr of c.personalityTraits) {
      const tKey = normKey(tr);
      traitToCareers.set(tKey, [...(traitToCareers.get(tKey) || []), c.id]);
      docFreq.set(`trait:${tKey}`, (docFreq.get(`trait:${tKey}`) || 0) + 1);
    }
  }

  const idfWeight = new Map<string, number>();
  for (const [key, df] of docFreq.entries()) {
    // Smooth IDF: log((N + 1) / (df + 1)) + 1
    idfWeight.set(key, Math.log((totalDocs + 1) / (df + 1)) + 1);
  }

  const subjectToTopSkills = new Map<string, string[]>();
  for (const [subKey, skMap] of subjectSkillCounts.entries()) {
    const sorted = [...skMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([sk]) => sk);
    subjectToTopSkills.set(subKey, sorted);
  }

  graphIndexCache = {
    skillToCareers,
    subjectToCareers,
    traitToCareers,
    subjectToTopSkills,
    idfWeight,
  };
  return graphIndexCache;
}

/**
 * Conditional Bipartite Knowledge-Graph Imputation (Phase 4 Incomplete Profile Enhancement)
 * When a student profile omits explicit skills or marks, traverses 2-hop paths from observed
 * (EducationStage + PreferredSubjects + Interests + RIASEC alignment) -> Candidate Careers -> Shared Skills
 * rather than injecting global unconditioned skills.
 */
export function imputeMissingProfileAttributes(profile: StudentProfile): {
  imputedTerms: string[];
  completenessRatio: number;
} {
  let filledFields = 0;
  const totalFields = 6;
  if (profile.academicPercentage !== null && profile.academicPercentage !== undefined) filledFields++;
  if (profile.preferredSubjects.length > 0 || Object.keys(profile.subjectMarks || {}).length > 0) filledFields++;
  if (profile.interests.length > 0) filledFields++;
  if (profile.skills.length > 0) filledFields++;
  if (Object.keys(profile.riasecScores || {}).length >= 4) filledFields++;
  if ((profile.careerAspirationText || '').trim().length > 5) filledFields++;

  const completenessRatio = filledFields / totalFields;

  // Only impute if explicit skills are sparse (< 2) or profile completeness < 75%
  if (profile.skills.length >= 2 && completenessRatio >= 0.75) {
    return { imputedTerms: [], completenessRatio };
  }

  const obsSubjects = [
    ...profile.preferredSubjects,
    ...Object.keys(profile.subjectMarks || {}),
  ].map(normKey).filter(Boolean);

  const mlExpanded = processMultilingualImproved(
    `${profile.interests.join(' ')} ${profile.careerAspirationText || ''}`,
    profile.language
  ).normalizedEnglishText;

  const obsInterests = [
    ...profile.interests,
    ...mlExpanded.split(/[,.;\s]+/).filter((w) => w.length >= 4),
  ].map(normKey).filter(Boolean);

  // Rank local Knowledge Graph career neighborhood using observed stage, subjects, interests & RIASEC
  const scoredNeighborhood = CAREER_REPOSITORY.map((c) => {
    let affinity = c.applicableLevels.includes(profile.educationLevel) ? 1.5 : 0.3;

    for (const sub of c.requiredSubjects) {
      const sk = normKey(sub);
      if (obsSubjects.some((os) => os.includes(sk) || sk.includes(os))) {
        affinity += 1.4;
      }
    }
    for (const kw of [...c.keywords, ...c.requiredSkills]) {
      const kk = normKey(kw);
      if (obsInterests.some((oi) => kk.includes(oi) || oi.includes(kk))) {
        affinity += 1.8;
      }
    }
    if (profile.riasecScores && Object.keys(profile.riasecScores).length > 0) {
      let dot = 0;
      let nA = 0;
      let nB = 0;
      for (const dim of ['R', 'I', 'A', 'S', 'E', 'C'] as const) {
        const raw = profile.riasecScores[dim];
        const a = typeof raw === 'number' ? (raw > 1 ? raw / 100 : raw) : 0.5;
        const b = c.riasecProfile[dim];
        dot += a * b;
        nA += a * a;
        nB += b * b;
      }
      if (nA > 0 && nB > 0) {
        affinity += 1.6 * (dot / (Math.sqrt(nA) * Math.sqrt(nB)));
      }
    }
    return { career: c, affinity };
  })
    .filter((x) => x.affinity >= 2.6)
    .sort((a, b) => b.affinity - a.affinity)
    .slice(0, 3);

  const skillVote = new Map<string, number>();
  for (let rank = 0; rank < scoredNeighborhood.length; rank++) {
    const weight = 1 / (rank + 1);
    for (const sk of scoredNeighborhood[rank].career.requiredSkills.slice(0, 3)) {
      skillVote.set(sk, (skillVote.get(sk) || 0) + weight);
    }
  }

  const imputedTerms = [...skillVote.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([sk]) => sk);

  return {
    imputedTerms,
    completenessRatio,
  };
}

/**
 * Computes Knowledge Graph proximity score for all careers:
 * - baseline: Unweighted overlap count normalized by total career attributes
 * - improved: IDF-weighted bipartite path activation + 2-hop neighbor reinforcement
 */
export function computeKnowledgeGraphScores(
  profile: StudentProfile,
  mode: 'baseline' | 'improved',
  imputedTerms: string[] = []
): Map<string, number> {
  const idx = getGraphIndex();
  const aspirationSource =
    mode === 'improved'
      ? processMultilingualImproved(profile.careerAspirationText || '', profile.language).normalizedEnglishText
      : profile.careerAspirationText || '';

  const studentTokens = [
    ...profile.skills,
    ...profile.interests,
    ...(mode === 'improved' ? imputedTerms : []),
    ...aspirationSource.split(/[,.;\s]+/),
  ]
    .map(normKey)
    .filter((t) => t.length >= 3);

  const studentSubjects = [
    ...profile.preferredSubjects,
    ...Object.keys(profile.subjectMarks || {}),
  ]
    .map(normKey)
    .filter(Boolean);

  const directScores = new Map<string, number>();

  for (const career of CAREER_REPOSITORY) {
    let numerator = 0;
    let denominator = 0;

    for (const sk of career.requiredSkills) {
      const k = normKey(sk);
      const w = mode === 'improved' ? idx.idfWeight.get(`skill:${k}`) || 1.5 : 1.0;
      denominator += w;
      const hit = studentTokens.some(
        (st) => st.includes(k) || k.includes(st) || k.split(' ').some((wrd) => wrd.length >= 4 && st.includes(wrd))
      );
      if (hit) numerator += w;
    }

    for (const sub of career.requiredSubjects) {
      const sKey = normKey(sub);
      const w = mode === 'improved' ? (idx.idfWeight.get(`sub:${sKey}`) || 1.2) * 0.75 : 1.0;
      denominator += w;
      const hit = studentSubjects.some((ss) => ss.includes(sKey) || sKey.includes(ss));
      if (hit) numerator += w;
    }

    for (const kw of career.keywords) {
      const kwKey = normKey(kw);
      const w = mode === 'improved' ? 1.1 : 0.6;
      denominator += w;
      const hit = studentTokens.some((st) => st.includes(kwKey) || kwKey.includes(st));
      if (hit) numerator += w;
    }

    const baseScore = denominator > 0 ? numerator / denominator : 0;
    directScores.set(career.id, Math.min(1, baseScore * 1.45));
  }

  // 2-hop "neighbors-of-neighbors" propagation across alternativeCareerIds
  const propagated = new Map<string, number>();
  for (const career of CAREER_REPOSITORY) {
    const selfScore = directScores.get(career.id) || 0;
    const neighborScores = career.alternativeCareerIds
      .map((nid) => directScores.get(nid) || 0)
      .filter((v) => v > 0);
    const avgNeighbor =
      neighborScores.length > 0
        ? neighborScores.reduce((a, b) => a + b, 0) / neighborScores.length
        : 0;

    const finalKg = mode === 'improved' ? 0.80 * selfScore + 0.20 * avgNeighbor : 0.90 * selfScore + 0.10 * avgNeighbor;
    propagated.set(career.id, Math.max(0, Math.min(1, finalKg)));
  }

  return propagated;
}

/**
 * Extracts an explainable local subgraph (Nodes + Edges + 2-Hop Neighbor Careers)
 * for visual Knowledge Graph rendering on the Personalized Career Roadmap.
 */
export function buildExplainableSubgraph(
  career: CareerRecord,
  matchedSkills: string[],
  matchedSubjects: string[]
): {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
  relatedCareers: Array<{ id: string; title: string; sharedAttributes: string[] }>;
} {
  const nodes: KnowledgeGraphNode[] = [
    { id: 'student-node', label: 'Student Profile', type: 'student' },
    { id: `career:${career.id}`, label: career.title, type: 'career' },
  ];
  const edges: KnowledgeGraphEdge[] = [];

  const skillsToShow = (matchedSkills.length > 0 ? matchedSkills : career.requiredSkills.slice(0, 3)).slice(0, 4);
  for (const sk of skillsToShow) {
    const skId = `skill:${normKey(sk)}`;
    nodes.push({ id: skId, label: sk, type: 'skill' });
    const isMatched = matchedSkills.includes(sk);
    if (isMatched) {
      edges.push({ source: 'student-node', target: skId, relation: 'possesses_skill', weight: 1.0 });
    }
    edges.push({
      source: skId,
      target: `career:${career.id}`,
      relation: isMatched ? 'validates_skill' : 'requires_skill',
      weight: isMatched ? 1.0 : 0.65,
    });
  }

  const subjectsToShow = (matchedSubjects.length > 0 ? matchedSubjects : career.requiredSubjects.slice(0, 2)).slice(0, 3);
  for (const sub of subjectsToShow) {
    const subId = `sub:${normKey(sub)}`;
    nodes.push({ id: subId, label: sub, type: 'subject' });
    if (matchedSubjects.includes(sub)) {
      edges.push({ source: 'student-node', target: subId, relation: 'strong_in_subject', weight: 0.9 });
    }
    edges.push({ source: subId, target: `career:${career.id}`, relation: 'academic_foundation', weight: 0.85 });
  }

  for (const tr of career.personalityTraits.slice(0, 2)) {
    const trId = `trait:${normKey(tr)}`;
    nodes.push({ id: trId, label: tr.replace(/_/g, ' '), type: 'trait' });
    edges.push({ source: trId, target: `career:${career.id}`, relation: 'suits_trait', weight: 0.75 });
  }

  const relatedCareers: Array<{ id: string; title: string; sharedAttributes: string[] }> = [];
  for (const altId of career.alternativeCareerIds) {
    const alt = CAREER_BY_ID[altId];
    if (!alt) continue;
    const shared = [
      ...alt.requiredSubjects.filter((s) => career.requiredSubjects.includes(s)),
      ...alt.requiredSkills.filter((sk) =>
        career.requiredSkills.some((csk) => normKey(csk) === normKey(sk))
      ),
    ].slice(0, 3);
    const relNodeId = `rel:${alt.id}`;
    nodes.push({ id: relNodeId, label: alt.title, type: 'related_career' });
    edges.push({
      source: `career:${career.id}`,
      target: relNodeId,
      relation: '2_hop_pathway_neighbor',
      weight: 0.7,
    });
    relatedCareers.push({
      id: alt.id,
      title: alt.title,
      sharedAttributes: shared.length > 0 ? shared : [alt.sectorName],
    });
  }

  return { nodes, edges, relatedCareers };
}
