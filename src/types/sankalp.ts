/**
 * Core Type Definitions for Improved Sankalp: AI-Powered Education & Career Guidance System
 * Grounded in IEEE Access 2025 (DOI: 10.1109/ACCESS.2025.3638596) + Multi-Stage NEP 2020 Extensions
 */

export type EducationLevel = 'after_10th' | 'after_12th' | 'undergraduate' | 'graduate';

export type SupportedLanguage = 'en' | 'hi' | 'kn';

export type InputModality = 'text' | 'voice';

export type GeographicCohort = 'urban' | 'semi_urban' | 'rural';

export type ModelVariant =
  | 'rule_only'
  | 'sbert_only'
  | 'hybrid_base'
  | 'original_sankalp'
  | 'improved_no_soft_rules'
  | 'improved_no_imputation'
  | 'improved_no_contextual_rl'
  | 'improved_sankalp';

/**
 * Holland's RIASEC Vocational Personality Dimensions (Ref [27] in IEEE Paper)
 */
export interface RIASECScores {
  R: number; // Realistic (Practical, hands-on, mechanical/technical)
  I: number; // Investigative (Analytical, scientific, research)
  A: number; // Artistic (Creative, design, expressive)
  S: number; // Social (Empathetic, teaching, healthcare, counseling)
  E: number; // Enterprising (Leadership, business, persuasion)
  C: number; // Conventional (Structured, financial, detail-oriented)
}

export interface AptitudeScores {
  analytical: number;   // 0-100
  quantitative: number; // 0-100
  verbal: number;       // 0-100
  creative: number;     // 0-100
  practical: number;    // 0-100
}

export interface CourseResource {
  title: string;
  provider: 'NPTEL' | 'SWAYAM' | 'AICTE' | 'Coursera' | 'NCVET' | 'edX';
  duration: string;
  url: string;
  skillCovered: string;
}

export interface PathwayMilestone {
  stage: string;
  qualification: string;
  duration: string;
  keyFocus: string;
}

export interface CareerRecord {
  id: string;
  title: string;
  titleHi: string;
  titleKn: string;
  sectorId: string;
  sectorName: string;
  applicableLevels: EducationLevel[];
  eligibleStreams: string[];
  minAcademicScore: number; // Percentage threshold (e.g., 60)
  requiredSubjects: string[];
  requiredSkills: string[];
  personalityTraits: string[];
  riasecProfile: RIASECScores;
  keywords: string[];
  workEnvironment: string;
  educationRequired: string;
  entranceExams: string[];
  salaryRange: {
    entryLPA: string;
    midLPA: string;
    seniorLPA: string;
    medianNumericLPA: number;
  };
  jobOutlook: {
    demand: 'Very High' | 'High' | 'Growing' | 'Stable';
    growthRateYoY: number; // Percentage
    remoteOpportunities: 'High' | 'Moderate' | 'Low';
    topCompanies: string[];
  };
  pathwaySteps: PathwayMilestone[];
  bridgePathway: string; // Remediation route when rigid cutoff/stream is missed
  recommendedCourses: CourseResource[];
  alternativeCareerIds: string[];
  description: string;
}

export interface EducationOptionCard {
  id: string;
  level: EducationLevel;
  category: string;
  name: string;
  nameHi: string;
  nameKn: string;
  duration: string;
  eligibility: string;
  coreSubjects: string[];
  entranceExams: string[];
  targetCareerIds: string[];
  higherStudyOptions: string[];
  avgStartingSalary: string;
  demandLevel: 'Very High' | 'High' | 'Growing' | 'Stable';
  summary: string;
}

export interface StudentProfile {
  sessionId: string;
  language: SupportedLanguage;
  inputMode: InputModality;
  cohort: GeographicCohort;
  educationLevel: EducationLevel;
  currentStream: string;
  selectedPathwayId?: string;
  academicPercentage: number | null; // Nullable to test incomplete profiles
  subjectMarks: Record<string, number>;
  preferredSubjects: string[];
  interests: string[];
  skills: string[];
  aptitudeScores: Partial<AptitudeScores>;
  riasecScores: Partial<RIASECScores>;
  workEnvironmentPref: string;
  careerAspirationText: string; // Natural language reflection (used by SBERT + VADER)
  acceptedCareers: string[];
  rejectedCareers: string[];
}

export interface EmotionAnalysisResult {
  compound: number;
  positive: number;
  neutral: number;
  negative: number;
  state: 'confident_positive' | 'curious_positive' | 'neutral' | 'anxious_uncertain' | 'frustrated_negative';
  empatheticResponse: string;
  scctGuidanceNote: string;
  nativeLexiconMatched: string[];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  type: 'student' | 'career' | 'skill' | 'subject' | 'trait' | 'related_career';
}

export interface KnowledgeGraphEdge {
  source: string;
  target: string;
  relation: string;
  weight: number;
}

export interface ScoreBreakdown {
  sbertSimilarity: number;      // 0-1
  ruleFeasibility: number;      // 0-1
  knowledgeGraphScore: number;  // 0-1
  riasecFitScore: number;       // 0-1
  sectorMarketScore: number;    // 0-1
  emotionAdjustment: number;    // -0.05 to +0.08
  qLearningMultiplier: number;  // Learned adaptive factor
  imputationApplied: boolean;
  imputedAttributes: string[];
  softRuleRecovered: boolean;
}

export interface CareerRecommendationItem {
  rank: number;
  career: CareerRecord;
  finalScore: number;            // 0-100 (Improved Sankalp)
  originalSankalpScore: number;  // 0-100 (Baseline Original Paper comparison)
  confidenceInterval: [number, number];
  breakdown: ScoreBreakdown;
  whyRecommended: string[];
  matchedSkills: string[];
  missingSkills: string[];
  matchedSubjects: string[];
  remediationAdvice: string | null;
  knowledgeGraph: {
    nodes: KnowledgeGraphNode[];
    edges: KnowledgeGraphEdge[];
    relatedCareers: Array<{ id: string; title: string; sharedAttributes: string[] }>;
  };
}

export interface RecommendationResponse {
  sessionId: string;
  modelUsed: ModelVariant;
  latencyMs: number;
  emotionAnalysis: EmotionAnalysisResult;
  normalizedQueryPreview: string;
  profileCompleteness: number; // 0-100%
  recommendations: CareerRecommendationItem[];
  recommendedStreamsOrCourses: EducationOptionCard[];
}

export interface FeedbackPayload {
  sessionId: string;
  careerId: string;
  action: 'accept' | 'reject';
  feedbackText?: string;
  rating?: number; // 1-5 user satisfaction rating
  profile: StudentProfile;
}

export interface BenchmarkProfileRecord {
  id: string;
  split: 'train' | 'test';
  cohort: GeographicCohort;
  language: SupportedLanguage;
  completenessCondition: 'complete' | 'incomplete_edge';
  primaryTargetCareerId: string;
  acceptableSecondaryIds: string[];
  counselorRubricA: string; // Academic-eligibility counselor ground truth
  counselorRubricB: string; // Psychometric RIASEC counselor ground truth
  profile: StudentProfile;
}
