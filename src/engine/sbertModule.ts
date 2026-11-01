import { pipeline, env } from '@huggingface/transformers';
import { CAREER_REPOSITORY } from '../data/careerRepository';
import type { CareerRecord, StudentProfile } from '../types/sankalp';
import { normalizeProfileForNLP } from './multilingualModule';

// Cache models locally inside .cache/transformers for fast offline-ready reuse
env.cacheDir = './.cache/transformers';

type FeatureExtractor = any;

interface CareerEmbeddingCacheEntry {
  careerId: string;
  flatVector: Float32Array;
  skillsVector: Float32Array;
  domainVector: Float32Array;
  academicVector: Float32Array;
}

let extractorInstance: FeatureExtractor | null = null;
let careerEmbeddingCache: Map<string, CareerEmbeddingCacheEntry> | null = null;
let initializationPromise: Promise<void> | null = null;

function cosineSimilarity(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function encodeText(extractor: FeatureExtractor, text: string): Promise<Float32Array> {
  const safeText = (text || '').trim() || 'general education and career exploration';
  const output = await extractor(safeText, { pooling: 'mean', normalize: true });
  return Float32Array.from(output.data as Float32Array);
}

function buildCareerStrings(c: CareerRecord) {
  // Paper Section III-B3: Flat concatenation of all career attributes
  const flat = [
    c.title,
    c.description,
    c.requiredSkills.join(', '),
    c.requiredSubjects.join(', '),
    c.personalityTraits.join(', '),
    c.keywords.join(', '),
    c.workEnvironment,
  ].join('. ');

  // Improved Multi-Facet decomposition
  const skillsFacet = `${c.title}. Skills: ${c.requiredSkills.join(', ')}. Keywords: ${c.keywords.join(', ')}.`;
  const domainFacet = `${c.title}. ${c.description} Sector: ${c.sectorName}. Environment: ${c.workEnvironment}. Traits: ${c.personalityTraits.join(', ')}.`;
  const academicFacet = `Education: ${c.educationRequired}. Streams: ${c.eligibleStreams.join(', ')}. Subjects: ${c.requiredSubjects.join(', ')}.`;

  return { flat, skillsFacet, domainFacet, academicFacet };
}

/**
 * Initializes Sentence-BERT ('Xenova/all-MiniLM-L6-v2' — exact architecture specified
 * in IEEE Sankalp Paper Section III-B3) and precomputes embeddings for all 85 careers.
 */
export async function ensureSbertInitialized(): Promise<void> {
  if (extractorInstance && careerEmbeddingCache) return;
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    extractorInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'fp32',
    });

    const cache = new Map<string, CareerEmbeddingCacheEntry>();
    for (const career of CAREER_REPOSITORY) {
      const strs = buildCareerStrings(career);
      const [flatVector, skillsVector, domainVector, academicVector] = await Promise.all([
        encodeText(extractorInstance, strs.flat),
        encodeText(extractorInstance, strs.skillsFacet),
        encodeText(extractorInstance, strs.domainFacet),
        encodeText(extractorInstance, strs.academicFacet),
      ]);
      cache.set(career.id, {
        careerId: career.id,
        flatVector,
        skillsVector,
        domainVector,
        academicVector,
      });
    }
    careerEmbeddingCache = cache;
  })();

  return initializationPromise;
}

export function isSbertReady(): boolean {
  return Boolean(extractorInstance && careerEmbeddingCache);
}

export async function embedArbitraryText(text: string): Promise<Float32Array> {
  await ensureSbertInitialized();
  return encodeText(extractorInstance, text);
}

export async function rankCareersByQueryText(text: string): Promise<Map<string, number>> {
  await ensureSbertInitialized();
  const qVec = await encodeText(extractorInstance, text);
  const scores = new Map<string, number>();
  for (const career of CAREER_REPOSITORY) {
    const entry = careerEmbeddingCache!.get(career.id)!;
    scores.set(career.id, cosineSimilarity(qVec, entry.flatVector));
  }
  return scores;
}

/**
 * Algorithm 2 of IEEE Sankalp Paper: Baseline Single-String SBERT Cosine Similarity
 */
export async function computeOriginalSbertScores(
  profile: StudentProfile
): Promise<Map<string, number>> {
  await ensureSbertInitialized();
  const normalized = normalizeProfileForNLP(profile, 'baseline');
  const userVec = await encodeText(extractorInstance, normalized.flatText);

  const results = new Map<string, number>();
  for (const career of CAREER_REPOSITORY) {
    const entry = careerEmbeddingCache!.get(career.id)!;
    const rawCos = cosineSimilarity(userVec, entry.flatVector);
    // Rescale typical SBERT cosine range [0.05, 0.75] smoothly into [0, 1]
    const calibrated = Math.max(0, Math.min(1, (rawCos - 0.05) / 0.65));
    results.set(career.id, calibrated);
  }
  return results;
}

/**
 * Improved Multi-Facet Attention SBERT Scoring (Phase 4 Enhancement)
 * Encodes separate semantic facets (Skills, Domain Interests, Academic Context)
 * and dynamically re-weights available facets so missing/incomplete student fields
 * do not dilute semantic retrieval quality.
 */
export async function computeImprovedSbertScores(
  profile: StudentProfile,
  imputedTerms: string[] = []
): Promise<Map<string, number>> {
  await ensureSbertInitialized();

  const enrichedProfile: StudentProfile = {
    ...profile,
    skills: [...new Set([...profile.skills, ...imputedTerms])],
  };
  const normalized = normalizeProfileForNLP(enrichedProfile, 'improved');

  const hasSkills = enrichedProfile.skills.length > 0 || (profile.careerAspirationText || '').trim().length > 12;
  const hasInterests = profile.interests.length > 0 || (profile.careerAspirationText || '').trim().length > 0;
  const hasAcademic = profile.preferredSubjects.length > 0 || Boolean(profile.currentStream);

  const [skillsVec, interestsVec, academicVec] = await Promise.all([
    encodeText(extractorInstance, normalized.skillsFacet || normalized.flatText),
    encodeText(extractorInstance, normalized.interestsFacet || normalized.flatText),
    encodeText(extractorInstance, normalized.academicFacet || normalized.flatText),
  ]);

  // Dynamic confidence-weighted attention across available facets
  const wSkills = hasSkills ? 0.44 : 0.15;
  const wInterests = hasInterests ? 0.36 : 0.20;
  const wAcademic = hasAcademic ? 0.20 : 0.15;
  const wSum = wSkills + wInterests + wAcademic;

  const results = new Map<string, number>();
  for (const career of CAREER_REPOSITORY) {
    const entry = careerEmbeddingCache!.get(career.id)!;
    const simSkills = cosineSimilarity(skillsVec, entry.skillsVector);
    const simDomain = cosineSimilarity(interestsVec, entry.domainVector);
    const simAcademic = cosineSimilarity(academicVec, entry.academicVector);

    const fusedCos =
      (wSkills * simSkills + wInterests * simDomain + wAcademic * simAcademic) / wSum;
    const calibrated = Math.max(0, Math.min(1, (fusedCos - 0.06) / 0.62));
    results.set(career.id, calibrated);
  }
  return results;
}
