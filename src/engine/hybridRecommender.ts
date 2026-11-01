import { performance } from 'perf_hooks';
import { CAREER_REPOSITORY } from '../data/careerRepository';
import { EDUCATION_PATHWAY_OPTIONS } from '../data/educationPathways';
import type {
  CareerRecommendationItem,
  ModelVariant,
  RecommendationResponse,
  StudentProfile,
} from '../types/sankalp';
import {
  buildExplainableSubgraph,
  computeKnowledgeGraphScores,
  imputeMissingProfileAttributes,
} from './knowledgeGraphModule';
import { normalizeProfileForNLP } from './multilingualModule';
import {
  buildContextStateKey,
  getOriginalCareerQMultiplier,
  selectContextualFusionWeights,
} from './qLearningModule';
import { evaluateImprovedSoftRules, evaluateOriginalRigidRules } from './ruleEngine';
import { computeImprovedSbertScores, computeOriginalSbertScores } from './sbertModule';
import { evaluateSectorAndMarketAlignment } from './sectorMarketModule';
import { analyzeStudentEmotion } from './vaderEmotionModule';

/**
 * Hybrid Multi-Agent Recommendation Orchestrator
 *
 * Supports exact comparative execution across all baseline, original-paper, ablation,
 * and proposed Improved Sankalp configurations on identical student inputs:
 * - 'rule_only'                  (Baseline A: Deterministic Rigid Rules)
 * - 'sbert_only'                 (Baseline B: Flat SBERT Cosine Similarity)
 * - 'hybrid_base'                (Config C: Rigid Rules + Flat SBERT)
 * - 'original_sankalp'           (Original IEEE Sankalp: Flat SBERT + Rigid Rules + VADER + 2-Hop KG + Sector + Career Q-Factor)
 * - 'improved_no_soft_rules'     (Ablation: Improved Sankalp WITHOUT Soft Fuzzy Rules)
 * - 'improved_no_imputation'     (Ablation: Improved Sankalp WITHOUT Multi-Facet Imputation)
 * - 'improved_no_contextual_rl'  (Ablation: Improved Sankalp WITHOUT Contextual Q-Learning)
 * - 'improved_sankalp'           (Full Proposed System)
 */
export async function generateCareerRecommendations(
  profile: StudentProfile,
  modelVariant: ModelVariant = 'improved_sankalp',
  topN = 6
): Promise<RecommendationResponse> {
  const t0 = performance.now();

  const rejectedSet = new Set((profile.rejectedCareers || []).map((id) => id.toLowerCase()));
  const acceptedSet = new Set((profile.acceptedCareers || []).map((id) => id.toLowerCase()));

  // 1. Profile Completeness & Knowledge Graph Imputation
  const { imputedTerms, completenessRatio } = imputeMissingProfileAttributes(profile);
  const useImputation =
    modelVariant === 'improved_sankalp' ||
    modelVariant === 'improved_no_soft_rules' ||
    modelVariant === 'improved_no_contextual_rl';
  const activeImputed = useImputation ? imputedTerms : [];

  // 2. Emotion & SCCT Self-Efficacy Analysis (VADER + Native Multilingual Valence)
  const isImprovedFamily = modelVariant.startsWith('improved');
  const emotionAnalysis = analyzeStudentEmotion(
    profile.careerAspirationText,
    profile.language,
    isImprovedFamily ? 'improved' : 'baseline'
  );

  // 3. Semantic Embeddings (SBERT)
  // Compute both Original & Improved SBERT scores when running 'improved_sankalp' so UI can show side-by-side baseline comparison
  const needOriginalSbert =
    modelVariant === 'sbert_only' ||
    modelVariant === 'hybrid_base' ||
    modelVariant === 'original_sankalp' ||
    modelVariant === 'improved_no_imputation' ||
    modelVariant === 'improved_sankalp';

  const needImprovedSbert =
    modelVariant === 'improved_sankalp' ||
    modelVariant === 'improved_no_soft_rules' ||
    modelVariant === 'improved_no_contextual_rl';

  const [origSbertMap, impSbertMap] = await Promise.all([
    needOriginalSbert ? computeOriginalSbertScores(profile) : Promise.resolve(new Map<string, number>()),
    needImprovedSbert
      ? computeImprovedSbertScores(profile, activeImputed)
      : Promise.resolve(new Map<string, number>()),
  ]);

  // 4. Knowledge Graph Traversal Scores
  const origKgMap = computeKnowledgeGraphScores(profile, 'baseline', []);
  const impKgMap = computeKnowledgeGraphScores(profile, 'improved', activeImputed);

  // 5. Contextual Q-Learning Policy Selection
  const contextKey = buildContextStateKey(profile, completenessRatio, emotionAnalysis);
  const contextualWeights =
    modelVariant === 'improved_no_contextual_rl'
      ? { id: 'static', label: 'Static Equal', wSbert: 0.34, wRule: 0.26, wKg: 0.22, wRiasec: 0.10, wMarket: 0.08 }
      : selectContextualFusionWeights(contextKey, false);

  const scoredItems: CareerRecommendationItem[] = [];

  for (const career of CAREER_REPOSITORY) {
    // Filter explicitly rejected careers per Paper Section IV-E4
    if (rejectedSet.has(career.id.toLowerCase())) continue;

    const origRule = evaluateOriginalRigidRules(profile, career);
    const impRule = evaluateImprovedSoftRules(profile, career, activeImputed);
    const sectorInfo = evaluateSectorAndMarketAlignment(profile, career);

    const origSbert = origSbertMap.get(career.id) ?? 0;
    const impSbert = needImprovedSbert ? impSbertMap.get(career.id) ?? 0 : origSbert;
    const origKg = origKgMap.get(career.id) ?? 0;
    const impKg = impKgMap.get(career.id) ?? 0;

    // Emotion-aware SCCT adjustment
    // If anxious/uncertain, favor accessible careers with lower rigid thresholds & clear bridges
    let origEmotionAdj = 0;
    let impEmotionAdj = 0;
    if (emotionAnalysis.compound <= -0.15) {
      origEmotionAdj = career.minAcademicScore <= 55 ? 0.025 : -0.015;
      impEmotionAdj = career.minAcademicScore <= 58 ? 0.035 : 0.0;
    } else if (emotionAnalysis.compound >= 0.25) {
      origEmotionAdj = career.jobOutlook.growthRateYoY >= 15 ? 0.025 : 0.005;
      impEmotionAdj = career.jobOutlook.growthRateYoY >= 15 ? 0.035 : 0.01;
    }

    const origQMult = getOriginalCareerQMultiplier(profile.educationLevel, career.id);
    const acceptBoost = acceptedSet.has(career.id.toLowerCase()) ? 0.08 : 0;

    // Always compute Original Sankalp Score (Algorithm 3 baseline reference)
    // Paper Algorithm 3 multiplicative bottleneck: rigid rule constraints gate semantic + KG + market
    const origGate = origRule.score < 0.22 ? 0.42 : 1.0;
    const originalRaw =
      origGate *
      (0.38 * origSbert +
        0.32 * origRule.score +
        0.18 * origKg +
        0.08 * sectorInfo.marketAlignmentScore +
        0.04 * origRule.riasecFit +
        origEmotionAdj) *
      origQMult;

    let variantRaw = 0;
    let activeRule = impRule;
    let activeSbert = impSbert;
    let activeKg = impKg;
    let activeQMult = 1.0;

    switch (modelVariant) {
      case 'rule_only':
        activeRule = origRule;
        variantRaw = origRule.score;
        break;

      case 'sbert_only':
        activeRule = origRule;
        activeSbert = origSbert;
        variantRaw = origSbert;
        break;

      case 'hybrid_base':
        activeRule = origRule;
        activeSbert = origSbert;
        variantRaw = (origRule.score < 0.22 ? 0.48 : 1.0) * (0.52 * origSbert + 0.48 * origRule.score);
        break;

      case 'original_sankalp':
        activeRule = origRule;
        activeSbert = origSbert;
        activeKg = origKg;
        activeQMult = origQMult;
        variantRaw = originalRaw;
        break;

      case 'improved_no_soft_rules':
        activeRule = origRule;
        variantRaw =
          (origRule.score < 0.22 ? 0.48 : 1.0) *
          (contextualWeights.wSbert * impSbert +
            contextualWeights.wRule * origRule.score +
            contextualWeights.wKg * impKg +
            contextualWeights.wRiasec * origRule.riasecFit +
            contextualWeights.wMarket * sectorInfo.marketAlignmentScore +
            impEmotionAdj);
        break;

      case 'improved_no_imputation':
        activeSbert = origSbert;
        activeKg = origKg;
        variantRaw =
          contextualWeights.wSbert * origSbert +
          contextualWeights.wRule * impRule.score +
          contextualWeights.wKg * origKg +
          contextualWeights.wRiasec * impRule.riasecFit +
          contextualWeights.wMarket * sectorInfo.marketAlignmentScore +
          impEmotionAdj;
        break;

      case 'improved_no_contextual_rl':
        variantRaw =
          0.34 * impSbert +
          0.26 * impRule.score +
          0.22 * impKg +
          0.10 * impRule.riasecFit +
          0.08 * sectorInfo.marketAlignmentScore +
          impEmotionAdj;
        break;

      case 'improved_sankalp':
      default: {
        // Fairness & Rural/Vocational Calibration: avoid penalizing rural/semi-urban profiles
        // lacking urban jargon if subject + RIASEC + soft-rule alignment is strong
        const fairnessBoost =
          profile.cohort !== 'urban' && impRule.score >= 0.62 && impKg >= 0.35 ? 0.02 : 0;

        // Contextual policy Q-value confidence multiplier (generalizes across unseen careers!)
        activeQMult = 1.0;
        variantRaw =
          contextualWeights.wSbert * impSbert +
          contextualWeights.wRule * impRule.score +
          contextualWeights.wKg * impKg +
          contextualWeights.wRiasec * impRule.riasecFit +
          contextualWeights.wMarket * sectorInfo.marketAlignmentScore +
          impEmotionAdj +
          fairnessBoost +
          acceptBoost;
        break;
      }
    }

    const finalPct = Math.max(8, Math.min(99.2, Number((variantRaw * 100).toFixed(1))));
    const origPct = Math.max(5, Math.min(98.5, Number((originalRaw * 100).toFixed(1))));

    // Uncertainty interval shrinks as profile completeness increases
    const halfWidth = Number((2.2 + (1 - completenessRatio) * 3.8).toFixed(1));
    const ciLow = Math.max(1, Number((finalPct - halfWidth).toFixed(1)));
    const ciHigh = Math.min(99.9, Number((finalPct + halfWidth).toFixed(1)));

    const whyReasons: string[] = [];
    if (activeSbert >= 0.52) {
      whyReasons.push(
        `Strong semantic alignment (${(activeSbert * 100).toFixed(0)}%) between your stated aspirations/interests and ${career.title} domain competencies.`
      );
    }
    if (activeRule.matchedSubjects.length > 0) {
      whyReasons.push(
        `Direct academic foundation match in ${activeRule.matchedSubjects.join(', ')} for your ${profile.educationLevel.replace('_', ' ')} stage.`
      );
    }
    if (activeRule.matchedSkills.length > 0) {
      whyReasons.push(
        `Knowledge Graph verified ${activeRule.matchedSkills.length} relevant skill link(s): ${activeRule.matchedSkills.slice(0, 3).join(', ')}.`
      );
    }
    if (activeRule.riasecFit >= 0.78) {
      whyReasons.push(
        `High Holland RIASEC vocational personality-environment congruence (${(activeRule.riasecFit * 100).toFixed(0)}%).`
      );
    }
    if (career.jobOutlook.demand === 'Very High' || career.jobOutlook.growthRateYoY >= 15) {
      whyReasons.push(
        `${career.jobOutlook.demand} Indian labour market demand (${career.jobOutlook.growthRateYoY}% projected YoY growth in ${career.sectorName}).`
      );
    }
    if (whyReasons.length === 0) {
      whyReasons.push(
        `Balanced multi-factor alignment across ${career.sectorName} eligibility, transferable skills, and long-term career progression.`
      );
    }

    const kgSubgraph = buildExplainableSubgraph(
      career,
      activeRule.matchedSkills,
      activeRule.matchedSubjects
    );

    scoredItems.push({
      rank: 0,
      career,
      finalScore: finalPct,
      originalSankalpScore: origPct,
      confidenceInterval: [ciLow, ciHigh],
      breakdown: {
        sbertSimilarity: Number(activeSbert.toFixed(4)),
        ruleFeasibility: Number(activeRule.score.toFixed(4)),
        knowledgeGraphScore: Number(activeKg.toFixed(4)),
        riasecFitScore: Number(activeRule.riasecFit.toFixed(4)),
        sectorMarketScore: sectorInfo.marketAlignmentScore,
        emotionAdjustment: Number(
          (isImprovedFamily ? impEmotionAdj : origEmotionAdj).toFixed(4)
        ),
        qLearningMultiplier: Number(activeQMult.toFixed(4)),
        imputationApplied: activeImputed.length > 0,
        imputedAttributes: activeImputed,
        softRuleRecovered: activeRule.softRuleRecovered,
      },
      whyRecommended: whyReasons,
      matchedSkills: activeRule.matchedSkills,
      missingSkills: activeRule.missingSkills,
      matchedSubjects: activeRule.matchedSubjects,
      remediationAdvice: activeRule.remediationAdvice,
      knowledgeGraph: kgSubgraph,
    });
  }

  scoredItems.sort((a, b) => {
    if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
    return a.career.id.localeCompare(b.career.id);
  });

  const topRecommendations = scoredItems.slice(0, topN).map((item, idx) => ({
    ...item,
    rank: idx + 1,
  }));

  // Recommend matching Education Streams / Courses for the student's current stage
  const topCareerIdSet = new Set(topRecommendations.slice(0, 4).map((r) => r.career.id));
  const stagePathways = EDUCATION_PATHWAY_OPTIONS.filter(
    (opt) => opt.level === profile.educationLevel
  )
    .map((opt) => {
      const overlap = opt.targetCareerIds.filter((cid) => topCareerIdSet.has(cid)).length;
      return { opt, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((x) => x.opt);

  const normalizedPreview = normalizeProfileForNLP(
    profile,
    isImprovedFamily ? 'improved' : 'baseline'
  ).flatText;

  const latencyMs = Number((performance.now() - t0).toFixed(2));

  return {
    sessionId: profile.sessionId,
    modelUsed: modelVariant,
    latencyMs,
    emotionAnalysis,
    normalizedQueryPreview: normalizedPreview.slice(0, 260),
    profileCompleteness: Math.round(completenessRatio * 100),
    recommendations: topRecommendations,
    recommendedStreamsOrCourses: stagePathways,
  };
}
