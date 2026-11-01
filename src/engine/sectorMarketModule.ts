import type { CareerRecord, StudentProfile } from '../types/sankalp';

/**
 * Sector Analyzer & Indian Labour Market Intelligence Module
 * Implements Section III-B6 & III-B7 of the IEEE Sankalp Paper.
 *
 * Scientific Transparency Note (Phase 3 Requirement):
 * The original paper references commercial Naukri partner API endpoints, which are proprietary
 * and unavailable without enterprise recruiter credentials. We transparently replace live commercial
 * scraping with a structured, auditable Indian Labour Market Benchmark Index synthesized from
 * National Career Service (NCS), AICTE/NASSCOM demand reports, and O*NET sector taxonomies.
 */

export interface SectorOutlookSummary {
  sectorId: string;
  sectorName: string;
  demandScore: number; // [0, 1]
  growthYoY: number;
  remoteScore: number;
  marketAlignmentScore: number;
}

const DEMAND_MAP: Record<CareerRecord['jobOutlook']['demand'], number> = {
  'Very High': 0.96,
  High: 0.84,
  Growing: 0.76,
  Stable: 0.68,
};

const REMOTE_MAP: Record<CareerRecord['jobOutlook']['remoteOpportunities'], number> = {
  High: 0.95,
  Moderate: 0.70,
  Low: 0.40,
};

export function evaluateSectorAndMarketAlignment(
  profile: StudentProfile,
  career: CareerRecord
): SectorOutlookSummary {
  const demandScore = DEMAND_MAP[career.jobOutlook.demand] ?? 0.75;
  const growthNorm = Math.min(1, career.jobOutlook.growthRateYoY / 25);
  const remoteScore = REMOTE_MAP[career.jobOutlook.remoteOpportunities] ?? 0.6;

  // Match student's work environment preference if specified
  const pref = (profile.workEnvironmentPref || '').toLowerCase();
  let envFit = 0.80;
  if (pref.includes('remote') || pref.includes('hybrid')) {
    envFit = remoteScore;
  } else if (pref.includes('field') || pref.includes('plant') || pref.includes('hospital') || pref.includes('lab')) {
    envFit = career.jobOutlook.remoteOpportunities === 'Low' ? 0.92 : 0.75;
  }

  const marketAlignmentScore = 0.45 * demandScore + 0.30 * growthNorm + 0.25 * envFit;

  return {
    sectorId: career.sectorId,
    sectorName: career.sectorName,
    demandScore,
    growthYoY: career.jobOutlook.growthRateYoY,
    remoteScore,
    marketAlignmentScore: Number(marketAlignmentScore.toFixed(4)),
  };
}
