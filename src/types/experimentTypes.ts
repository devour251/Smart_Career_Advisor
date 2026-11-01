import type { GeographicCohort, ModelVariant, SupportedLanguage } from './sankalp';

export interface ModelMetricRow {
  model: ModelVariant;
  displayName: string;
  sampleCount: number;
  top1HitRate: number;            // Percentage [0, 100]
  top1CI95: [number, number];     // Bootstrap 95% CI
  top3HitRate: number;            // Percentage [0, 100]
  top3CI95: [number, number];     // Bootstrap 95% CI
  top5HitRate: number;            // Percentage [0, 100]
  precisionAt3: number;           // Percentage [0, 100]
  recallAt3: number;              // Percentage [0, 100]
  f1At3: number;                  // Percentage [0, 100]
  mrr: number;                    // Mean Reciprocal Rank [0, 1]
  meanLatencyMs: number;
  stdLatencyMs: number;
  pValueVsOriginalTop1: number | null;
}

export interface SubgroupComparisonRow {
  groupKey: string;
  groupLabel: string;
  count: number;
  originalTop1: number;
  originalTop3: number;
  improvedTop1: number;
  improvedTop3: number;
  deltaTop1: number;
  deltaTop3: number;
}

export interface PaperReferenceRow {
  configuration: string;
  paperTop1: number;
  paperTop3: number;
  paperUserSatisfaction: string;
  paperNotes: string;
}

export interface ExperimentSummary {
  generatedAt: string;
  datasetStats: {
    careerCategories: number;
    uniqueKeywords: number;
    uniqueSkills: number;
    sectorCount: number;
    rawCharacters: number;
    trainProfiles: number;
    testProfiles: number;
    counselorKappa: number;
    counselorRawAgreementPct: number;
  };
  paperReportedBaselines: PaperReferenceRow[];
  paperReportedLatency: {
    coreAiEngineMs: number;
    textModeTotalMs: string;
    endToEndVoiceMs: number;
  };
  overallModels: ModelMetricRow[];
  ablationRows: ModelMetricRow[];
  languageBreakdown: SubgroupComparisonRow[];
  cohortFairness: {
    rows: SubgroupComparisonRow[];
    originalParityGapTop1: number;
    improvedParityGapTop1: number;
    originalParityGapTop3: number;
    improvedParityGapTop3: number;
  };
  completenessBreakdown: SubgroupComparisonRow[];
  stageBreakdown: SubgroupComparisonRow[];
  qLearningHistory: Array<{
    epoch: number;
    epsilon: number;
    avgReward: number;
    top1TrainAcc: number;
  }>;
}
