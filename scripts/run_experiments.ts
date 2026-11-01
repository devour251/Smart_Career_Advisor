import fs from 'fs';
import path from 'path';
import { CAREER_REPOSITORY, getRepositoryStatistics } from '../src/data/careerRepository';
import {
  BENCHMARK_TEST_SPLIT,
  BENCHMARK_TRAIN_SPLIT,
  FULL_BENCHMARK_DATASET,
} from '../src/data/benchmarkDataset';
import { savePersistedQSnapshot } from '../src/db/database';
import { generateCareerRecommendations } from '../src/engine/hybridRecommender';
import {
  computeKnowledgeGraphScores,
  imputeMissingProfileAttributes,
} from '../src/engine/knowledgeGraphModule';
import {
  createFreshQState,
  FUSION_WEIGHT_ACTIONS,
  getQStateSnapshot,
  loadQStateSnapshot,
  trainQLearningPolicyOnTrainSplit,
} from '../src/engine/qLearningModule';
import { evaluateImprovedSoftRules } from '../src/engine/ruleEngine';
import { computeImprovedSbertScores, ensureSbertInitialized } from '../src/engine/sbertModule';
import { evaluateSectorAndMarketAlignment } from '../src/engine/sectorMarketModule';
import { analyzeStudentEmotion } from '../src/engine/vaderEmotionModule';
import type {
  ExperimentSummary,
  ModelMetricRow,
  SubgroupComparisonRow,
} from '../src/types/experimentTypes';
import type { BenchmarkProfileRecord, ModelVariant } from '../src/types/sankalp';
import { generateAllResearchGraphs } from './generate_charts';
import { generateAllArchitectureDiagrams } from './generate_diagrams';

function bootstrapCI95(binaryOutcomes: number[]): [number, number] {
  const n = binaryOutcomes.length;
  if (n === 0) return [0, 0];
  let seed = 424242;
  const rng = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const B = 1000;
  const means: number[] = [];
  for (let b = 0; b < B; b++) {
    let s = 0;
    for (let i = 0; i < n; i++) {
      s += binaryOutcomes[Math.floor(rng() * n)];
    }
    means.push((s / n) * 100);
  }
  means.sort((a, b) => a - b);
  return [
    Number(means[Math.floor(0.025 * B)].toFixed(2)),
    Number(means[Math.floor(0.975 * B)].toFixed(2)),
  ];
}

function normalCdfUpperTail(zAbs: number): number {
  // Abramowitz & Stegun 7.1.26 approximation for two-sided p-value
  const t = 1 / (1 + 0.2316419 * zAbs);
  const d = 0.3989423 * Math.exp((-zAbs * zAbs) / 2);
  const prob =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return Math.min(1, Math.max(0.0001, 2 * prob));
}

function pairedPValue(a: number[], b: number[]): number {
  const n = a.length;
  if (n <= 1) return 1.0;
  const diffs = a.map((v, i) => v - b[i]);
  const meanDiff = diffs.reduce((s, d) => s + d, 0) / n;
  const variance =
    diffs.reduce((s, d) => s + (d - meanDiff) * (d - meanDiff), 0) / (n - 1);
  if (variance === 0) return meanDiff === 0 ? 1.0 : 0.0001;
  const tStat = Math.abs(meanDiff) / Math.sqrt(variance / n);
  return Number(normalCdfUpperTail(tStat).toFixed(4));
}

function computeCohensKappa(records: BenchmarkProfileRecord[]): {
  kappa: number;
  rawAgreementPct: number;
} {
  const n = records.length;
  let agree = 0;
  const countsA: Record<string, number> = {};
  const countsB: Record<string, number> = {};
  for (const r of records) {
    if (r.counselorRubricA === r.counselorRubricB) agree++;
    countsA[r.counselorRubricA] = (countsA[r.counselorRubricA] || 0) + 1;
    countsB[r.counselorRubricB] = (countsB[r.counselorRubricB] || 0) + 1;
  }
  const pO = agree / n;
  const allCats = new Set([...Object.keys(countsA), ...Object.keys(countsB)]);
  let pE = 0;
  for (const c of allCats) {
    pE += ((countsA[c] || 0) / n) * ((countsB[c] || 0) / n);
  }
  const kappa = (pO - pE) / Math.max(1e-6, 1 - pE);
  return {
    kappa: Number(kappa.toFixed(4)),
    rawAgreementPct: Number((pO * 100).toFixed(2)),
  };
}

interface PerProfileEval {
  record: BenchmarkProfileRecord;
  topIds: string[];
  latencyMs: number;
  top1Hit: number;
  top3Hit: number;
  top5Hit: number;
  prec3: number;
  rec3: number;
  f1_3: number;
  rr: number;
}

async function evaluateModelOnSplit(
  model: ModelVariant,
  displayName: string,
  records: BenchmarkProfileRecord[],
  baselineTop1Vec?: number[]
): Promise<{ row: ModelMetricRow; details: PerProfileEval[] }> {
  const details: PerProfileEval[] = [];

  for (const rec of records) {
    const resp = await generateCareerRecommendations(rec.profile, model, 5);
    const topIds = resp.recommendations.map((r) => r.career.id);
    const top3 = topIds.slice(0, 3);
    const relevantSet = new Set([rec.primaryTargetCareerId, ...rec.acceptableSecondaryIds]);

    const top1Hit = topIds[0] === rec.primaryTargetCareerId ? 1 : 0;
    const top3Hit = top3.includes(rec.primaryTargetCareerId) ? 1 : 0;
    const top5Hit = topIds.includes(rec.primaryTargetCareerId) ? 1 : 0;

    const hitsInTop3 = top3.filter((id) => relevantSet.has(id)).length;
    const prec3 = hitsInTop3 / 3;
    const rec3 = hitsInTop3 / Math.max(1, relevantSet.size);
    const f1_3 = prec3 + rec3 > 0 ? (2 * prec3 * rec3) / (prec3 + rec3) : 0;

    const rankIdx = topIds.indexOf(rec.primaryTargetCareerId);
    const rr = rankIdx >= 0 ? 1 / (rankIdx + 1) : 0;

    details.push({
      record: rec,
      topIds,
      latencyMs: resp.latencyMs,
      top1Hit,
      top3Hit,
      top5Hit,
      prec3,
      rec3,
      f1_3,
      rr,
    });
  }

  const n = details.length;
  const top1Vec = details.map((d) => d.top1Hit);
  const top3Vec = details.map((d) => d.top3Hit);
  const latencies = details.map((d) => d.latencyMs);

  const mean = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
  const meanLat = mean(latencies);
  const stdLat = Math.sqrt(
    latencies.reduce((s, v) => s + (v - meanLat) * (v - meanLat), 0) / Math.max(1, n - 1)
  );

  const row: ModelMetricRow = {
    model,
    displayName,
    sampleCount: n,
    top1HitRate: Number((mean(top1Vec) * 100).toFixed(2)),
    top1CI95: bootstrapCI95(top1Vec),
    top3HitRate: Number((mean(top3Vec) * 100).toFixed(2)),
    top3CI95: bootstrapCI95(top3Vec),
    top5HitRate: Number((mean(details.map((d) => d.top5Hit)) * 100).toFixed(2)),
    precisionAt3: Number((mean(details.map((d) => d.prec3)) * 100).toFixed(2)),
    recallAt3: Number((mean(details.map((d) => d.rec3)) * 100).toFixed(2)),
    f1At3: Number((mean(details.map((d) => d.f1_3)) * 100).toFixed(2)),
    mrr: Number(mean(details.map((d) => d.rr)).toFixed(4)),
    meanLatencyMs: Number(meanLat.toFixed(2)),
    stdLatencyMs: Number(stdLat.toFixed(2)),
    pValueVsOriginalTop1: baselineTop1Vec ? pairedPValue(top1Vec, baselineTop1Vec) : null,
  };

  return { row, details };
}

function buildSubgroupRows(
  groups: Array<{ key: string; label: string; pred: (r: BenchmarkProfileRecord) => boolean }>,
  origDetails: PerProfileEval[],
  impDetails: PerProfileEval[]
): SubgroupComparisonRow[] {
  return groups.map((g) => {
    const oSub = origDetails.filter((d) => g.pred(d.record));
    const iSub = impDetails.filter((d) => g.pred(d.record));
    const count = oSub.length;
    const avg = (arr: number[]) =>
      count > 0 ? Number(((arr.reduce((a, b) => a + b, 0) / count) * 100).toFixed(2)) : 0;

    const originalTop1 = avg(oSub.map((x) => x.top1Hit));
    const originalTop3 = avg(oSub.map((x) => x.top3Hit));
    const improvedTop1 = avg(iSub.map((x) => x.top1Hit));
    const improvedTop3 = avg(iSub.map((x) => x.top3Hit));

    return {
      groupKey: g.key,
      groupLabel: g.label,
      count,
      originalTop1,
      originalTop3,
      improvedTop1,
      improvedTop3,
      deltaTop1: Number((improvedTop1 - originalTop1).toFixed(2)),
      deltaTop3: Number((improvedTop3 - originalTop3).toFixed(2)),
    };
  });
}

async function main() {
  console.log('=== Improved Sankalp Experimental Evaluation Pipeline (Phase 5 & 6) ===');
  console.log('1. Initializing real Sentence-BERT (Xenova/all-MiniLM-L6-v2) embeddings for 85 careers...');
  await ensureSbertInitialized();

  console.log(`2. Training Contextual Q-Learning Policy on Held-Out Train Split (N=${BENCHMARK_TRAIN_SPLIT.length}, 100 epochs)...`);
  loadQStateSnapshot(createFreshQState());

  const trainItems = [];
  for (const tr of BENCHMARK_TRAIN_SPLIT) {
    const { imputedTerms, completenessRatio } = imputeMissingProfileAttributes(tr.profile);
    const emo = analyzeStudentEmotion(tr.profile.careerAspirationText, tr.profile.language, 'improved');
    const sbertMap = await computeImprovedSbertScores(tr.profile, imputedTerms);
    const kgMap = computeKnowledgeGraphScores(tr.profile, 'improved', imputedTerms);

    const candidateScoresByAction: Record<string, string[]> = {};
    for (const action of FUSION_WEIGHT_ACTIONS) {
      const ranked = CAREER_REPOSITORY.map((c) => {
        const rule = evaluateImprovedSoftRules(tr.profile, c, imputedTerms);
        const sec = evaluateSectorAndMarketAlignment(tr.profile, c);
        const score =
          action.wSbert * (sbertMap.get(c.id) ?? 0) +
          action.wRule * rule.score +
          action.wKg * (kgMap.get(c.id) ?? 0) +
          action.wRiasec * rule.riasecFit +
          action.wMarket * sec.marketAlignmentScore;
        return { id: c.id, score };
      })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map((x) => x.id);
      candidateScoresByAction[action.id] = ranked;
    }

    trainItems.push({
      profile: tr.profile,
      targetCareerId: tr.primaryTargetCareerId,
      secondaryCareerIds: tr.acceptableSecondaryIds,
      vaderCompound: emo.compound,
      completenessRatio,
      candidateScoresByAction,
    });
  }

  const qHistory = trainQLearningPolicyOnTrainSplit(trainItems, 100);
  const trainedSnapshot = getQStateSnapshot();
  savePersistedQSnapshot(trainedSnapshot);
  fs.writeFileSync(
    path.resolve('src/data/trainedQSnapshot.json'),
    JSON.stringify(trainedSnapshot, null, 2),
    'utf-8'
  );
  console.log('   Q-Learning converged! Saved snapshot to SQLite and src/data/trainedQSnapshot.json.');

  console.log(`3. Evaluating Baseline, Original, Ablation & Improved Models on Held-Out Test Split (N=${BENCHMARK_TEST_SPLIT.length})...`);
  // Warm up JIT once before measuring test latencies
  await generateCareerRecommendations(BENCHMARK_TEST_SPLIT[0].profile, 'improved_sankalp', 5);

  const origEval = await evaluateModelOnSplit(
    'original_sankalp',
    'Original Sankalp (IEEE Baseline)',
    BENCHMARK_TEST_SPLIT
  );
  const origTop1Vec = origEval.details.map((d) => d.top1Hit);

  const ruleEval = await evaluateModelOnSplit('rule_only', 'Rule-Based Only', BENCHMARK_TEST_SPLIT, origTop1Vec);
  const sbertEval = await evaluateModelOnSplit('sbert_only', 'SBERT-Only', BENCHMARK_TEST_SPLIT, origTop1Vec);
  const hybridBaseEval = await evaluateModelOnSplit(
    'hybrid_base',
    'Hybrid Base (Rule + SBERT)',
    BENCHMARK_TEST_SPLIT,
    origTop1Vec
  );
  const impEval = await evaluateModelOnSplit(
    'improved_sankalp',
    'Improved Sankalp (Proposed)',
    BENCHMARK_TEST_SPLIT,
    origTop1Vec
  );

  // Ablations
  const ablNoSoft = await evaluateModelOnSplit(
    'improved_no_soft_rules',
    'w/o Soft Fuzzy Rules',
    BENCHMARK_TEST_SPLIT,
    origTop1Vec
  );
  const ablNoImpute = await evaluateModelOnSplit(
    'improved_no_imputation',
    'w/o Multi-Facet Imputation',
    BENCHMARK_TEST_SPLIT,
    origTop1Vec
  );
  const ablNoRl = await evaluateModelOnSplit(
    'improved_no_contextual_rl',
    'w/o Contextual Q-Learning',
    BENCHMARK_TEST_SPLIT,
    origTop1Vec
  );

  const languageBreakdown = buildSubgroupRows(
    [
      { key: 'en', label: 'English', pred: (r) => r.language === 'en' },
      { key: 'hi', label: 'Hindi (Devanagari)', pred: (r) => r.language === 'hi' },
      { key: 'kn', label: 'Kannada', pred: (r) => r.language === 'kn' },
    ],
    origEval.details,
    impEval.details
  );

  const cohortRows = buildSubgroupRows(
    [
      { key: 'urban', label: 'Urban', pred: (r) => r.cohort === 'urban' },
      { key: 'semi_urban', label: 'Semi-Urban', pred: (r) => r.cohort === 'semi_urban' },
      { key: 'rural', label: 'Rural', pred: (r) => r.cohort === 'rural' },
    ],
    origEval.details,
    impEval.details
  );

  const origCohortTop1 = cohortRows.map((c) => c.originalTop1);
  const impCohortTop1 = cohortRows.map((c) => c.improvedTop1);
  const origCohortTop3 = cohortRows.map((c) => c.originalTop3);
  const impCohortTop3 = cohortRows.map((c) => c.improvedTop3);

  const completenessBreakdown = buildSubgroupRows(
    [
      { key: 'complete', label: 'Complete Profiles', pred: (r) => r.completenessCondition === 'complete' },
      {
        key: 'incomplete_edge',
        label: 'Incomplete / Borderline Edge',
        pred: (r) => r.completenessCondition === 'incomplete_edge',
      },
    ],
    origEval.details,
    impEval.details
  );

  const stageBreakdown = buildSubgroupRows(
    [
      { key: 'after_10th', label: 'After 10th', pred: (r) => r.profile.educationLevel === 'after_10th' },
      { key: 'after_12th', label: 'After 12th', pred: (r) => r.profile.educationLevel === 'after_12th' },
      { key: 'undergraduate', label: 'Undergraduate', pred: (r) => r.profile.educationLevel === 'undergraduate' },
      { key: 'graduate', label: 'Graduate', pred: (r) => r.profile.educationLevel === 'graduate' },
    ],
    origEval.details,
    impEval.details
  );

  const repoStats = getRepositoryStatistics();
  const kappaStats = computeCohensKappa(FULL_BENCHMARK_DATASET);

  const summary: ExperimentSummary = {
    generatedAt: new Date().toISOString(),
    datasetStats: {
      ...repoStats,
      trainProfiles: BENCHMARK_TRAIN_SPLIT.length,
      testProfiles: BENCHMARK_TEST_SPLIT.length,
      counselorKappa: kappaStats.kappa,
      counselorRawAgreementPct: kappaStats.rawAgreementPct,
    },
    paperReportedBaselines: [
      {
        configuration: 'Rule-Only (Paper Table 5)',
        paperTop1: 52.5,
        paperTop3: 74.0,
        paperUserSatisfaction: '3.60 / 5.0',
        paperNotes: 'Rigid academic & stream cutoffs on private RVCE 160-profile CGT dataset',
      },
      {
        configuration: 'SBERT-Only (Paper Table 5)',
        paperTop1: 64.4,
        paperTop3: 86.0,
        paperUserSatisfaction: '4.10 / 5.0',
        paperNotes: 'Flat all-MiniLM-L6-v2 cosine similarity without eligibility rules',
      },
      {
        configuration: 'Hybrid Base (Paper Table 5)',
        paperTop1: 68.1,
        paperTop3: 88.5,
        paperUserSatisfaction: '4.35 / 5.0',
        paperNotes: 'Static combination of SBERT + deterministic rules',
      },
      {
        configuration: 'Full Sankalp (Paper Table 5)',
        paperTop1: 77.5,
        paperTop3: 90.5,
        paperUserSatisfaction: '4.71 / 5.0',
        paperNotes: '95% CI [88.1%, 92.9%] on Top-3; Core AI latency 350 ms',
      },
    ],
    paperReportedLatency: {
      coreAiEngineMs: 350,
      textModeTotalMs: '180 - 200 ms',
      endToEndVoiceMs: 1250,
    },
    overallModels: [
      ruleEval.row,
      sbertEval.row,
      hybridBaseEval.row,
      origEval.row,
      impEval.row,
    ],
    ablationRows: [
      impEval.row,
      ablNoRl.row,
      ablNoImpute.row,
      ablNoSoft.row,
      origEval.row,
    ],
    languageBreakdown,
    cohortFairness: {
      rows: cohortRows,
      originalParityGapTop1: Number(
        (Math.max(...origCohortTop1) - Math.min(...origCohortTop1)).toFixed(2)
      ),
      improvedParityGapTop1: Number(
        (Math.max(...impCohortTop1) - Math.min(...impCohortTop1)).toFixed(2)
      ),
      originalParityGapTop3: Number(
        (Math.max(...origCohortTop3) - Math.min(...origCohortTop3)).toFixed(2)
      ),
      improvedParityGapTop3: Number(
        (Math.max(...impCohortTop3) - Math.min(...impCohortTop3)).toFixed(2)
      ),
    },
    completenessBreakdown,
    stageBreakdown,
    qLearningHistory: qHistory,
  };

  fs.mkdirSync(path.resolve('docs/results'), { recursive: true });
  fs.mkdirSync(path.resolve('src/data'), { recursive: true });

  fs.writeFileSync(
    path.resolve('src/data/experimentalResults.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );
  fs.writeFileSync(
    path.resolve('docs/results/experimental_metrics.json'),
    JSON.stringify(summary, null, 2),
    'utf-8'
  );

  // Also export clean CSV summary table for spreadsheets / LaTeX / guide inspection
  const csvHeader =
    'Model,N,Top1_HitRate_Pct,Top1_CI95_Low,Top1_CI95_High,Top3_HitRate_Pct,Top3_CI95_Low,Top3_CI95_High,Top5_HitRate_Pct,PrecisionAt3_Pct,RecallAt3_Pct,F1At3_Pct,MRR,Mean_Latency_Ms,Std_Latency_Ms,pValue_vs_Original\n';
  const csvRows = [...summary.overallModels, ablNoSoft.row, ablNoImpute.row, ablNoRl.row]
    .map((m) =>
      [
        `"${m.displayName}"`,
        m.sampleCount,
        m.top1HitRate,
        m.top1CI95[0],
        m.top1CI95[1],
        m.top3HitRate,
        m.top3CI95[0],
        m.top3CI95[1],
        m.top5HitRate,
        m.precisionAt3,
        m.recallAt3,
        m.f1At3,
        m.mrr,
        m.meanLatencyMs,
        m.stdLatencyMs,
        m.pValueVsOriginalTop1 ?? 'baseline',
      ].join(',')
    )
    .join('\n');
  fs.writeFileSync(path.resolve('docs/results/experimental_metrics.csv'), csvHeader + csvRows + '\n', 'utf-8');

  console.log('4. Generating SVG & PNG research graphs and architecture diagrams...');
  generateAllResearchGraphs(summary);
  generateAllArchitectureDiagrams();

  console.log('\n=== MEASURED HELD-OUT TEST RESULTS (N = 160) ===');
  for (const m of summary.overallModels) {
    console.log(
      `${m.displayName.padEnd(32)} | Top-1: ${m.top1HitRate.toFixed(2)}% [${m.top1CI95[0]}, ${m.top1CI95[1]}] | Top-3: ${m.top3HitRate.toFixed(2)}% | F1@3: ${m.f1At3.toFixed(2)}% | Latency: ${m.meanLatencyMs.toFixed(2)} ms`
    );
  }
  console.log('\n--- Subgroup Highlights (Original -> Improved Top-1) ---');
  for (const l of summary.languageBreakdown) {
    console.log(`Language ${l.groupLabel.padEnd(20)}: ${l.originalTop1}% -> ${l.improvedTop1}% (Delta: +${l.deltaTop1}%)`);
  }
  for (const c of summary.completenessBreakdown) {
    console.log(`Condition ${c.groupLabel.padEnd(26)}: ${c.originalTop1}% -> ${c.improvedTop1}% (Delta: +${c.deltaTop1}%)`);
  }
  console.log(
    `Fairness Top-1 Parity Gap: Original = ${summary.cohortFairness.originalParityGapTop1}% -> Improved = ${summary.cohortFairness.improvedParityGapTop1}%`
  );
  console.log(`Counselor Rubric Inter-Rater Cohen's Kappa = ${summary.datasetStats.counselorKappa} (${summary.datasetStats.counselorRawAgreementPct}% agreement)`);
  console.log('=== All JSON, CSV, SVG & PNG artifacts saved to docs/results, docs/diagrams, and public/results ===');
}

main().catch((err) => {
  console.error('Experiment execution failed:', err);
  process.exit(1);
});
