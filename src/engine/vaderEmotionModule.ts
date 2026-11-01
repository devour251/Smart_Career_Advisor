import vader from 'vader-sentiment';
import type { EmotionAnalysisResult, SupportedLanguage } from '../types/sankalp';
import { processMultilingualBaseline, processMultilingualImproved } from './multilingualModule';

/**
 * VADER Sentiment Analysis & SCCT Empathetic Feedback Module
 * Implements Section III-B5 of the IEEE Sankalp Paper + Improved Native Valence Calibration.
 *
 * Uses Hutto & Gilbert's Valence Aware Dictionary and Sentiment Reasoner (VADER)
 * coupled with Social Cognitive Career Theory (SCCT) self-efficacy adaptation.
 */
export function analyzeStudentEmotion(
  rawText: string,
  language: SupportedLanguage,
  mode: 'baseline' | 'improved' = 'improved'
): EmotionAnalysisResult {
  const cleaned = (rawText || '').trim();
  if (!cleaned) {
    return {
      compound: 0,
      positive: 0,
      neutral: 1,
      negative: 0,
      state: 'neutral',
      empatheticResponse:
        'Your structured academic and skill inputs have been analyzed objectively to map optimal pathways.',
      scctGuidanceNote:
        'Balanced exploration mode: presenting both high-attainability core pathways and aspirational growth options.',
      nativeLexiconMatched: [],
    };
  }

  const processed =
    mode === 'improved'
      ? processMultilingualImproved(cleaned, language)
      : processMultilingualBaseline(cleaned, language);

  const scores = vader.SentimentIntensityAnalyzer.polarity_scores(processed.normalizedEnglishText);

  // In Improved mode, blend VADER English compound score with native Hindi/Kannada sentiment delta
  // to eliminate translation-induced sentiment attenuation reported in Paper Section III-B5.
  let compound = scores.compound;
  if (mode === 'improved' && processed.nativeSentimentDelta !== 0) {
    compound = Math.max(-1, Math.min(1, 0.65 * scores.compound + 0.55 * processed.nativeSentimentDelta));
  }

  let state: EmotionAnalysisResult['state'] = 'neutral';
  let empatheticResponse = '';
  let scctGuidanceNote = '';

  if (compound >= 0.45) {
    state = 'confident_positive';
    empatheticResponse =
      'It is encouraging to see your clear enthusiasm and strong sense of direction. We have prioritized high-growth specializations and stretch R&D/leadership pathways that match your momentum.';
    scctGuidanceNote =
      'High self-efficacy signal (SCCT): slight upward calibration (+0.04) applied toward specialized, high-growth trajectories.';
  } else if (compound >= 0.12) {
    state = 'curious_positive';
    empatheticResponse =
      'Your curiosity across subjects gives you strong flexibility. Below is an explainable breakdown connecting your current strengths to concrete degrees and careers.';
    scctGuidanceNote =
      'Constructive exploratory signal: balanced weighting across core eligibility and multidisciplinary discovery.';
  } else if (compound <= -0.40) {
    state = 'frustrated_negative';
    empatheticResponse =
      'Feeling overwhelmed or worried about marks and cutoffs is completely normal. Every recommendation below includes step-by-step bridge pathways and Plan-B alternatives so no single exam defines your future.';
    scctGuidanceNote =
      'Elevated stress/hesitation detected (SCCT): prioritizing attainable, high-support pathways with clear bridge remediation.';
  } else if (compound <= -0.10) {
    state = 'anxious_uncertain';
    empatheticResponse =
      'Choosing between streams and careers can feel uncertain at first. We have highlighted transparent reasons, foundational courses, and safe parallel options to build confidence step by step.';
    scctGuidanceNote =
      'Moderate uncertainty detected: boosting structured, step-wise pathways with transparent skill-building milestones.';
  } else {
    state = 'neutral';
    empatheticResponse =
      'We have evaluated your academic profile, subject strengths, and preferences to rank feasible and rewarding career trajectories.';
    scctGuidanceNote = 'Neutral affective tone: standard hybrid weighting applied.';
  }

  return {
    compound: Number(compound.toFixed(4)),
    positive: Number(scores.pos.toFixed(3)),
    neutral: Number(scores.neu.toFixed(3)),
    negative: Number(scores.neg.toFixed(3)),
    state,
    empatheticResponse,
    scctGuidanceNote,
    nativeLexiconMatched: processed.matchedNativeTerms,
  };
}
