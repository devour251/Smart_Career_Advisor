import { CAREER_REPOSITORY } from '../data/careerRepository';
import type { SupportedLanguage, StudentProfile } from '../types/sankalp';

/**
 * Multilingual Processing Module (English, Hindi, Kannada)
 *
 * Implements:
 * 1. Baseline Translation-First Normalization (Original Sankalp Paper Section III-B5)
 * 2. Improved Native Academic & Sentiment Lexicon Preservation (Phase 4 Enhancement)
 *    Prevents semantic loss of regional Indian educational terminology (PUC, SSLC, डिप्लोमा,
 *    अभियांत्रिकी, ಗಣಿತ, ವಿಜ್ಞಾನ, ವಾಣಿಜ್ಯ) and native emotional valence words.
 */

let cachedNativeCareerGlossary: Record<string, string> | null = null;
function getNativeCareerGlossary(): Record<string, string> {
  if (cachedNativeCareerGlossary) return cachedNativeCareerGlossary;
  const glossary: Record<string, string> = {};
  const stopTokens = new Set(['इंजीनियर', 'विशेषज्ञ', 'अधिकारी', 'प्रबंधक', 'ವಿಶೇಷಜ್ಞ', 'ಅಧಿಕಾರಿ', 'ಇಂಜಿನಿಯರ್']);
  for (const c of CAREER_REPOSITORY) {
    const semTarget = `${c.keywords.slice(0, 3).join(' ')} ${c.requiredSkills.slice(0, 2).join(' ')}`;
    for (const rawTitle of [c.titleHi, c.titleKn]) {
      const parts = rawTitle
        .replace(/[()/-]/g, ' ')
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 4 && !/^[A-Za-z0-9]+$/.test(w) && !stopTokens.has(w));
      for (const p of parts) {
        if (!glossary[p]) {
          glossary[p] = semTarget;
        }
      }
    }
  }
  cachedNativeCareerGlossary = glossary;
  return glossary;
}

interface LexiconEntry {
  englishSemanticEquivalent: string;
  sentimentDelta: number; // Native emotional valence [-0.65, +0.65]
}

const HINDI_DOMAIN_LEXICON: Record<string, LexiconEntry> = {
  'गणित': { englishSemanticEquivalent: 'mathematics quantitative calculus algebra', sentimentDelta: 0 },
  'विज्ञान': { englishSemanticEquivalent: 'science physics chemistry research', sentimentDelta: 0 },
  'जीवविज्ञान': { englishSemanticEquivalent: 'biology medical healthcare genetics', sentimentDelta: 0 },
  'भौतिकी': { englishSemanticEquivalent: 'physics mechanics electronics energy', sentimentDelta: 0 },
  'रसायन': { englishSemanticEquivalent: 'chemistry chemical pharmaceutical lab', sentimentDelta: 0 },
  'कंप्यूटर': { englishSemanticEquivalent: 'computer science programming software coding', sentimentDelta: 0 },
  'कोडिंग': { englishSemanticEquivalent: 'software programming algorithms web development', sentimentDelta: 0 },
  'कृत्रिम बुद्धिमत्ता': { englishSemanticEquivalent: 'artificial intelligence machine learning neural networks', sentimentDelta: 0 },
  'एआई': { englishSemanticEquivalent: 'artificial intelligence machine learning data science', sentimentDelta: 0 },
  'डेटा': { englishSemanticEquivalent: 'data science statistics analytics sql python', sentimentDelta: 0 },
  'डिप्लोमा': { englishSemanticEquivalent: 'polytechnic diploma practical engineering technician', sentimentDelta: 0 },
  'आईटीआई': { englishSemanticEquivalent: 'iti vocational cnc solar electrical technician trade', sentimentDelta: 0 },
  'सौर ऊर्जा': { englishSemanticEquivalent: 'solar pv renewable energy technician green grid', sentimentDelta: 0 },
  'रोबोटिक्स': { englishSemanticEquivalent: 'robotics mechatronics automation sensors ros2', sentimentDelta: 0 },
  'इलेक्ट्रिक वाहन': { englishSemanticEquivalent: 'electric vehicles ev battery powertrain motor', sentimentDelta: 0 },
  'डॉक्टर': { englishSemanticEquivalent: 'clinical physician mbbs medicine hospital patient care', sentimentDelta: 0 },
  'नर्सिंग': { englishSemanticEquivalent: 'critical care nursing officer hospital patient care', sentimentDelta: 0 },
  'फार्मेसी': { englishSemanticEquivalent: 'clinical pharmacist drug safety pharmacology', sentimentDelta: 0 },
  'वाणिज्य': { englishSemanticEquivalent: 'commerce accounting finance taxation business', sentimentDelta: 0 },
  'लेखांकन': { englishSemanticEquivalent: 'chartered accountant accounting audit gst tally', sentimentDelta: 0 },
  'सीए': { englishSemanticEquivalent: 'chartered accountant statutory audit taxation icai', sentimentDelta: 0 },
  'वित्त': { englishSemanticEquivalent: 'financial analyst investment banking portfolio risk', sentimentDelta: 0 },
  'बैंकिंग': { englishSemanticEquivalent: 'banking credit officer rbi monetary finance', sentimentDelta: 0 },
  'कानून': { englishSemanticEquivalent: 'corporate constitutional lawyer clat legal advocacy', sentimentDelta: 0 },
  'वकील': { englishSemanticEquivalent: 'corporate lawyer litigation legal counsel', sentimentDelta: 0 },
  'यूपीएससी': { englishSemanticEquivalent: 'civil services officer ias public administration policy', sentimentDelta: 0 },
  'सिविल सेवा': { englishSemanticEquivalent: 'civil services public governance district administration', sentimentDelta: 0 },
  'मनोविज्ञान': { englishSemanticEquivalent: 'clinical counseling psychology mental health therapy', sentimentDelta: 0 },
  'डिज़ाइन': { englishSemanticEquivalent: 'ux ui product graphic visual communication design', sentimentDelta: 0 },
  'वास्तुकला': { englishSemanticEquivalent: 'sustainable architecture 3d visualizer bim building', sentimentDelta: 0 },
  'कृषि': { englishSemanticEquivalent: 'precision agri tech horticulture soil drone farming', sentimentDelta: 0 },
  'पत्रकारिता': { englishSemanticEquivalent: 'digital data journalist media reporting storytelling', sentimentDelta: 0 },
  'अनुसंधान': { englishSemanticEquivalent: 'scientific research isro drdo phd professor', sentimentDelta: 0 },
  'प्रबंधन': { englishSemanticEquivalent: 'management strategy product manager mba operations', sentimentDelta: 0 },
  // Native Hindi Sentiment & Self-Efficacy Markers
  'उत्साहित': { englishSemanticEquivalent: 'excited passionate enthusiastic', sentimentDelta: 0.55 },
  'आत्मविश्वास': { englishSemanticEquivalent: 'confident capable determined', sentimentDelta: 0.50 },
  'रुचि': { englishSemanticEquivalent: 'strong interest curious', sentimentDelta: 0.35 },
  'पसंद': { englishSemanticEquivalent: 'enjoy love prefer', sentimentDelta: 0.40 },
  'चिंतित': { englishSemanticEquivalent: 'anxious worried uncertain', sentimentDelta: -0.45 },
  'परेशान': { englishSemanticEquivalent: 'stressed overwhelmed confused', sentimentDelta: -0.52 },
  'डर': { englishSemanticEquivalent: 'afraid fearful hesitant', sentimentDelta: -0.48 },
  'असमंजस': { englishSemanticEquivalent: 'confused unsure undecided', sentimentDelta: -0.38 },
  'कम अंक': { englishSemanticEquivalent: 'lower marks borderline score need alternative bridge', sentimentDelta: -0.30 },
};

const KANNADA_DOMAIN_LEXICON: Record<string, LexiconEntry> = {
  'ಗಣಿತ': { englishSemanticEquivalent: 'mathematics quantitative calculus statistics', sentimentDelta: 0 },
  'ವಿಜ್ಞಾನ': { englishSemanticEquivalent: 'science physics chemistry biology research', sentimentDelta: 0 },
  'ಜೀವಶಾಸ್ತ್ರ': { englishSemanticEquivalent: 'biology medicine healthcare biotechnology', sentimentDelta: 0 },
  'ಭೌತಶಾಸ್ತ್ರ': { englishSemanticEquivalent: 'physics electronics mechanics energy', sentimentDelta: 0 },
  'ರಸಾಯನಶಾಸ್ತ್ರ': { englishSemanticEquivalent: 'chemistry pharmaceutical process lab', sentimentDelta: 0 },
  'ಕಂಪ್ಯೂಟರ್': { englishSemanticEquivalent: 'computer science software programming coding', sentimentDelta: 0 },
  'ಕೋಡಿಂಗ್': { englishSemanticEquivalent: 'software engineering web programming algorithms', sentimentDelta: 0 },
  'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ': { englishSemanticEquivalent: 'artificial intelligence machine learning deep learning', sentimentDelta: 0 },
  'ಡೇಟಾ': { englishSemanticEquivalent: 'data science analytics sql python statistics', sentimentDelta: 0 },
  'ಡಿಪ್ಲೊಮಾ': { englishSemanticEquivalent: 'polytechnic diploma practical engineering technician', sentimentDelta: 0 },
  'ಐಟಿಐ': { englishSemanticEquivalent: 'iti vocational cnc solar electrical machinist', sentimentDelta: 0 },
  'ಸೌರಶಕ್ತಿ': { englishSemanticEquivalent: 'solar pv renewable energy technician microgrid', sentimentDelta: 0 },
  'ರೋಬೋಟಿಕ್ಸ್': { englishSemanticEquivalent: 'robotics mechatronics autonomous control sensors', sentimentDelta: 0 },
  'ವೈದ್ಯಕೀಯ': { englishSemanticEquivalent: 'clinical physician mbbs healthcare hospital', sentimentDelta: 0 },
  'ನರ್ಸಿಂಗ್': { englishSemanticEquivalent: 'critical care nursing officer hospital icu', sentimentDelta: 0 },
  'ವಾಣಿಜ್ಯ': { englishSemanticEquivalent: 'commerce accounting finance economics business', sentimentDelta: 0 },
  'ಲೆಕ್ಕಶಾಸ್ತ್ರ': { englishSemanticEquivalent: 'chartered accountant accounting audit gst tally', sentimentDelta: 0 },
  'ಹಣಕಾಸು': { englishSemanticEquivalent: 'financial analyst investment banking wealth risk', sentimentDelta: 0 },
  'ಬ್ಯಾಂಕಿಂಗ್': { englishSemanticEquivalent: 'banking credit officer rbi finance', sentimentDelta: 0 },
  'ಕಾನೂನು': { englishSemanticEquivalent: 'corporate constitutional lawyer clat legal counsel', sentimentDelta: 0 },
  'ನಾಗರಿಕ ಸೇವೆ': { englishSemanticEquivalent: 'civil services officer ias kas public governance', sentimentDelta: 0 },
  'ಮನಃಶಾಸ್ತ್ರ': { englishSemanticEquivalent: 'clinical counseling psychologist mental health', sentimentDelta: 0 },
  'ವಿನ್ಯಾಸ': { englishSemanticEquivalent: 'ux ui product graphic visual design', sentimentDelta: 0 },
  'ವಾಸ್ತುಶಿಲ್ಪ': { englishSemanticEquivalent: 'sustainable architecture 3d visualizer bim', sentimentDelta: 0 },
  'ಕೃಷಿ': { englishSemanticEquivalent: 'precision agri tech horticulture drone farming', sentimentDelta: 0 },
  'ಪತ್ರಿಕೋದ್ಯಮ': { englishSemanticEquivalent: 'digital data journalist media storytelling', sentimentDelta: 0 },
  'ಸಂಶೋಧನೆ': { englishSemanticEquivalent: 'scientific research isro drdo professor phd', sentimentDelta: 0 },
  'ನಿರ್ವಹಣೆ': { englishSemanticEquivalent: 'management strategy product manager mba operations', sentimentDelta: 0 },
  // Native Kannada Sentiment & Self-Efficacy Markers
  'ಉತ್ಸಾಹ': { englishSemanticEquivalent: 'excited enthusiastic passionate', sentimentDelta: 0.55 },
  'ಆತ್ಮವಿಶ್ವಾಸ': { englishSemanticEquivalent: 'confident determined strong', sentimentDelta: 0.50 },
  'ಆಸಕ್ತಿ': { englishSemanticEquivalent: 'interested curious keen', sentimentDelta: 0.38 },
  'ಇಷ್ಟ': { englishSemanticEquivalent: 'like enjoy love', sentimentDelta: 0.42 },
  'ಗೊಂದಲ': { englishSemanticEquivalent: 'confused uncertain unsure', sentimentDelta: -0.42 },
  'ಆತಂಕ': { englishSemanticEquivalent: 'anxious worried stressed', sentimentDelta: -0.48 },
  'ಭಯ': { englishSemanticEquivalent: 'afraid nervous hesitant', sentimentDelta: -0.46 },
  'ಕಡಿಮೆ ಅಂಕ': { englishSemanticEquivalent: 'lower marks borderline score bridge option', sentimentDelta: -0.30 },
};

export interface MultilingualProcessedInput {
  originalText: string;
  normalizedEnglishText: string;
  nativeSentimentDelta: number;
  matchedNativeTerms: string[];
}

/**
 * Baseline Translation-First Processor (simulates basic literal dictionary translation
 * where domain idioms and multi-word compound sentiments suffer partial loss).
 */
export function processMultilingualBaseline(
  text: string,
  language: SupportedLanguage
): MultilingualProcessedInput {
  if (!text || language === 'en') {
    return {
      originalText: text,
      normalizedEnglishText: text,
      nativeSentimentDelta: 0,
      matchedNativeTerms: [],
    };
  }

  // Baseline only translates top-level basic nouns without compound academic or sentiment calibration
  const basicMap: Record<string, string> = {
    'गणित': 'math',
    'विज्ञान': 'science',
    'कंप्यूटर': 'computer',
    'वाणिज्य': 'commerce',
    'कानून': 'law',
    'डॉक्टर': 'doctor',
    'ಗಣಿತ': 'math',
    'ವಿಜ್ಞಾನ': 'science',
    'ಕಂಪ್ಯೂಟರ್': 'computer',
    'ವಾಣಿಜ್ಯ': 'commerce',
    'ಕಾನೂನು': 'law',
    'ವೈದ್ಯಕೀಯ': 'medical',
  };

  let translated = text;
  for (const [nativeWord, enWord] of Object.entries(basicMap)) {
    if (translated.includes(nativeWord)) {
      translated += ` ${enWord}`;
    }
  }

  return {
    originalText: text,
    normalizedEnglishText: translated,
    nativeSentimentDelta: 0,
    matchedNativeTerms: [],
  };
}

/**
 * Improved Native-Lexicon & Domain Concept Expander
 * Preserves Indian educational stream terminology + native Hindi/Kannada sentiment intensity.
 */
export function processMultilingualImproved(
  text: string,
  language: SupportedLanguage
): MultilingualProcessedInput {
  if (!text) {
    return {
      originalText: '',
      normalizedEnglishText: '',
      nativeSentimentDelta: 0,
      matchedNativeTerms: [],
    };
  }

  const matchedTerms: string[] = [];
  const expansions: string[] = [text];
  let sentimentSum = 0;
  let sentimentHits = 0;

  // Scan both Hindi and Kannada lexicons automatically (handles code-mixed input seamlessly)
  const combinedLexicon =
    language === 'hi'
      ? { ...HINDI_DOMAIN_LEXICON, ...KANNADA_DOMAIN_LEXICON }
      : language === 'kn'
        ? { ...KANNADA_DOMAIN_LEXICON, ...HINDI_DOMAIN_LEXICON }
        : { ...HINDI_DOMAIN_LEXICON, ...KANNADA_DOMAIN_LEXICON };

  // Boundary-aware matching so 2-char Hindi words (like डर inside डॉक्टर) never misfire
  const tokens = new Set(text.split(/[\s,.;:!?()[\]"'/-]+/).filter(Boolean));

  for (const [term, meta] of Object.entries(combinedLexicon)) {
    const isMatch = term.length <= 3 ? tokens.has(term) : text.includes(term);
    if (isMatch) {
      matchedTerms.push(term);
      expansions.push(meta.englishSemanticEquivalent);
      if (meta.sentimentDelta !== 0) {
        sentimentSum += meta.sentimentDelta;
        sentimentHits += 1;
      }
    }
  }

  const dynamicGlossary = getNativeCareerGlossary();
  for (const [nativeWord, semEq] of Object.entries(dynamicGlossary)) {
    if (text.includes(nativeWord)) {
      if (!matchedTerms.includes(nativeWord)) matchedTerms.push(nativeWord);
      expansions.push(semEq);
    }
  }

  // Also normalize common Indian educational abbreviations in English/Hinglish/Kanglish
  const lower = text.toLowerCase();
  if (lower.includes('pcm')) expansions.push('physics chemistry mathematics engineering architecture');
  if (lower.includes('pcb')) expansions.push('physics chemistry biology medical healthcare biotechnology');
  if (lower.includes('puc') || lower.includes('sslc')) expansions.push('secondary school higher secondary stream pathway');
  if (lower.includes('cet') || lower.includes('jee')) expansions.push('engineering technology admission');
  if (lower.includes('neet')) expansions.push('medical dental healthcare admission');

  const avgNativeDelta = sentimentHits > 0 ? Math.max(-0.7, Math.min(0.7, sentimentSum / sentimentHits)) : 0;

  return {
    originalText: text,
    normalizedEnglishText: expansions.join(' '),
    nativeSentimentDelta: avgNativeDelta,
    matchedNativeTerms: matchedTerms,
  };
}

export function normalizeProfileForNLP(
  profile: StudentProfile,
  mode: 'baseline' | 'improved'
): {
  flatText: string;
  skillsFacet: string;
  interestsFacet: string;
  academicFacet: string;
  nativeSentimentDelta: number;
  matchedNativeTerms: string[];
} {
  const processor = mode === 'improved' ? processMultilingualImproved : processMultilingualBaseline;

  const aspirationProcessed = processor(profile.careerAspirationText || '', profile.language);
  const interestsRaw = profile.interests.join(', ');
  const skillsRaw = profile.skills.join(', ');
  const subjectsRaw = profile.preferredSubjects.join(', ');

  const interestsProcessed = processor(interestsRaw, profile.language);
  const skillsProcessed = processor(skillsRaw, profile.language);
  const subjectsProcessed = processor(subjectsRaw, profile.language);

  const flatText = [
    skillsProcessed.normalizedEnglishText,
    interestsProcessed.normalizedEnglishText,
    subjectsProcessed.normalizedEnglishText,
    profile.currentStream,
    profile.workEnvironmentPref,
    aspirationProcessed.normalizedEnglishText,
  ]
    .filter(Boolean)
    .join('. ');

  return {
    flatText,
    skillsFacet: [skillsProcessed.normalizedEnglishText, aspirationProcessed.normalizedEnglishText]
      .filter(Boolean)
      .join('. '),
    interestsFacet: [
      interestsProcessed.normalizedEnglishText,
      profile.workEnvironmentPref,
      aspirationProcessed.normalizedEnglishText,
    ]
      .filter(Boolean)
      .join('. '),
    academicFacet: [
      profile.educationLevel.replace('_', ' '),
      profile.currentStream,
      subjectsProcessed.normalizedEnglishText,
    ]
      .filter(Boolean)
      .join('. '),
    nativeSentimentDelta: aspirationProcessed.nativeSentimentDelta,
    matchedNativeTerms: [
      ...new Set([
        ...aspirationProcessed.matchedNativeTerms,
        ...interestsProcessed.matchedNativeTerms,
        ...skillsProcessed.matchedNativeTerms,
        ...subjectsProcessed.matchedNativeTerms,
      ]),
    ],
  };
}

export const UI_TRANSLATIONS: Record<
  SupportedLanguage,
  {
    heroTitle: string;
    heroSubtitle: string;
    beginJourney: string;
    step1Title: string;
    step2Title: string;
    step3Title: string;
    step4Title: string;
    step5Title: string;
    voicePromptHint: string;
  }
> = {
  en: {
    heroTitle: 'Confused About What to Study Next? Discover Your Best Stream, Degree & Career Path',
    heroSubtitle:
      'Whether you just passed 10th, completed 12th, or are in college — explore every stream, subjects taught, next degrees (B.Tech, MBBS, BCA, CA, Law, MBA), real salaries, step-by-step roadmaps, free study notes, and top YouTube channels.',
    beginJourney: 'Find My Best Career Path',
    step1Title: 'Step 1. Select Your Current Class or Stage',
    step2Title: 'Step 2. Understand Available Streams & Degrees',
    step3Title: 'Tell Us What You Enjoy & Your Favorite Subjects',
    step4Title: 'Your Personalized Stream & Career Matches',
    step5Title: 'Your Step-by-Step Career Roadmap, Skills & Free Study Links',
    voicePromptHint: 'Type or speak in your own words (e.g., "I passed 10th, I like computers and business, not sure what stream to pick")...',
  },
  hi: {
    heroTitle: 'आगे क्या पढ़ें? अपनी सही स्ट्रीम, डिग्री और करियर राह आसानी से चुनें',
    heroSubtitle:
      'चाहे आपने 10वीं पास की हो, 12वीं पूरी की हो या कॉलेज में हों — हर स्ट्रीम के विषय, अगली डिग्री (B.Tech, MBBS, BCA, CA, MBA), सैलरी पैकेज, रोडमैप, मुफ़्त नोट्स और बेस्ट यूट्यूब चैनल एक ही जगह जानें।',
    beginJourney: 'अपना सही करियर खोजें',
    step1Title: 'चरण 1. अपनी वर्तमान कक्षा या स्तर चुनें',
    step2Title: 'चरण 2. उपलब्ध स्ट्रीम और कोर्स समझें',
    step3Title: 'अपनी पसंद, विषय और रुचियाँ बताएं',
    step4Title: 'आपके लिए सर्वोत्तम करियर और स्ट्रीम सुझाव',
    step5Title: 'आपका पूरा करियर रोडमैप, कौशल और मुफ़्त अध्ययन स्रोत',
    voicePromptHint: 'अपनी रुचियाँ, पसंदीदा विषय या करियर के सवाल हिंदी या अंग्रेजी में लिखें या बोलकर बताएं...',
  },
  kn: {
    heroTitle: 'ಮುಂದೆ ಏನು ಓದಬೇಕು ಎಂಬ ಗೊಂದಲವಿದೆಯೇ? ನಿಮಗೆ ಸೂಕ್ತವಾದ ಸ್ಟ್ರೀಮ್, ಪದವಿ ಮತ್ತು ವೃತ್ತಿಯನ್ನು ಕಂಡುಕೊಳ್ಳಿ',
    heroSubtitle:
      'ನೀವು 10ನೇ ತರಗತಿ, 12ನೇ ತರಗತಿ ಅಥವಾ ಕಾಲೇಜು ವಿದ್ಯಾರ್ಥಿಯಾಗಿರಲಿ — ಪ್ರತಿ ಸ್ಟ್ರೀಮ್ ವಿಷಯಗಳು, ಮುಂದಿನ ಕೋರ್ಸ್‌ಗಳು (B.Tech, MBBS, BCA, CA, MBA), ಸಂಬಳ, ಮಾರ್ಗಸೂಚಿ, ಉಚಿತ ನೋಟ್ಸ್ ಮತ್ತು ಯೂಟ್ಯೂಬ್ ಚಾನೆಲ್‌ಗಳನ್ನು ಸರಳವಾಗಿ ತಿಳಿಯಿರಿ.',
    beginJourney: 'ನನ್ನ ವೃತ್ತಿ ಮಾರ್ಗ ಹುಡುಕಿ',
    step1Title: 'ಹಂತ 1. ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಶಿಕ್ಷಣ ಹಂತ ಆಯ್ಕೆಮಾಡಿ',
    step2Title: 'ಹಂತ 2. ಲಭ್ಯವಿರುವ ಸ್ಟ್ರೀಮ್ ಮತ್ತು ಕೋರ್ಸ್‌ಗಳನ್ನು ತಿಳಿಯಿರಿ',
    step3Title: 'ನಿಮ್ಮ ನೆಚ್ಚಿನ ವಿಷಯಗಳು ಮತ್ತು ಆಸಕ್ತಿಗಳನ್ನು ತಿಳಿಸಿ',
    step4Title: 'ನಿಮಗೆ ಸೂಕ್ತವಾದ ಸ್ಟ್ರೀಮ್ ಮತ್ತು ವೃತ್ತಿ ಶಿಫಾರಸುಗಳು',
    step5Title: 'ನಿಮ್ಮ ಸಂಪೂರ್ಣ ವೃತ್ತಿ ಮಾರ್ಗಸೂಚಿ, ಕೌಶಲ್ಯ ಮತ್ತು ಉಚಿತ ನೋಟ್ಸ್',
    voicePromptHint: 'ನಿಮ್ಮ ಆಸಕ್ತಿಗಳು, ನೆಚ್ಚಿನ ವಿಷಯಗಳು ಅಥವಾ ವೃತ್ತಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕನ್ನಡ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ...',
  },
};
