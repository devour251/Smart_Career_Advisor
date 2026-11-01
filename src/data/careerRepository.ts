import type { CareerRecord } from '../types/sankalp';
import { CAREERS_VOCATIONAL_AND_TECH } from './careersVocationalTech';
import { CAREERS_ENGINEERING_CORE } from './careersEngineeringCore';
import { CAREERS_HEALTH_AND_COMMERCE } from './careersHealthCommerce';
import { CAREERS_HUMANITIES_DESIGN_GRAD } from './careersHumanitiesDesignGrad';

/**
 * Unified 85-Career Repository for Improved Sankalp
 * Matches Table 4 of the IEEE Sankalp Paper (85 Career Categories) while adding
 * multi-stage NEP-2020 education pathways, RIASEC vectors, and bridge remediation routes.
 */
export const CAREER_REPOSITORY: CareerRecord[] = [
  ...CAREERS_VOCATIONAL_AND_TECH,     // 22
  ...CAREERS_ENGINEERING_CORE,        // 21
  ...CAREERS_HEALTH_AND_COMMERCE,     // 21
  ...CAREERS_HUMANITIES_DESIGN_GRAD,  // 21
];

export const CAREER_BY_ID: Record<string, CareerRecord> = Object.fromEntries(
  CAREER_REPOSITORY.map((c) => [c.id, c])
);

export function getRepositoryStatistics() {
  const uniqueKeywords = new Set<string>();
  const uniqueSkills = new Set<string>();
  const uniqueSectors = new Set<string>();

  for (const c of CAREER_REPOSITORY) {
    c.keywords.forEach((k) => uniqueKeywords.add(k.toLowerCase()));
    c.requiredSkills.forEach((s) => {
      uniqueSkills.add(s.toLowerCase());
      uniqueKeywords.add(s.toLowerCase());
    });
    c.requiredSubjects.forEach((sub) => uniqueKeywords.add(sub.toLowerCase()));
    c.personalityTraits.forEach((t) => uniqueKeywords.add(t.toLowerCase()));
    uniqueSectors.add(c.sectorId);
  }

  const rawJsonLength = JSON.stringify(CAREER_REPOSITORY).length;

  return {
    careerCategories: CAREER_REPOSITORY.length,
    uniqueKeywords: uniqueKeywords.size,
    uniqueSkills: uniqueSkills.size,
    sectorCount: uniqueSectors.size,
    rawCharacters: rawJsonLength,
  };
}
