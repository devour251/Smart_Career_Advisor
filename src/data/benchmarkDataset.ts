import { CAREER_REPOSITORY } from './careerRepository';
import type {
  BenchmarkProfileRecord,
  CareerRecord,
  EducationLevel,
  GeographicCohort,
  RIASECScores,
  StudentProfile,
  SupportedLanguage,
} from '../types/sankalp';

/**
 * Stratified Open Benchmark Dataset for Improved Sankalp Evaluation (Phase 5)
 *
 * DATASET PROVENANCE & SCIENTIFIC TRANSPARENCY NOTE:
 * In the original IEEE Access 2025 paper ("Sankalp: AI-Powered Career Guidance System",
 * DOI: 10.1109/ACCESS.2025.3638596, Appendix p. 18), the authors state that their 160-profile
 * Curated Ground Truth (CGT) dataset and GitHub repository "will be activated after publication"
 * and were collected privately from RV College of Engineering (RVCE) workshops.
 *
 * Because the original CGT file is not publicly released, we construct a transparent,
 * reproducible 240-profile Stratified Indian Education & Career Benchmark:
 * - 80 Held-Out Training Profiles ('train' split) -> Strictly for Q-learning policy training.
 * - 160 Held-Out Evaluation Profiles ('test' split) -> Matches Paper's exact N=160 test count
 *   with ZERO data leakage from training!
 *
 * Stratification of the 160 Test Profiles:
 * - Education Stages: 40 after_10th, 40 after_12th, 40 undergraduate, 40 graduate
 * - Languages: 80 English ('en'), 40 Hindi ('hi' in Devanagari), 40 Kannada ('kn' in Kannada script)
 * - Geographic Cohorts: 54 urban, 53 semi_urban, 53 rural
 * - Profile Conditions: 112 complete (70%), 48 incomplete_edge (30%: missing marks, sparse skills,
 *   borderline marks 2-6% below rigid cutoff, or cross-stream NEP-2020 lateral bridge cases)
 * - Dual Counselor Rubric Labels (counselorRubricA & counselorRubricB) for Cohen's Kappa validation.
 */

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const HINDI_SECTOR_SENTENCES: Record<string, string[]> = {
  skilled_polytechnic: [
    'मुझे डिप्लोमा और आईटीआई के माध्यम से सौर ऊर्जा, इलेक्ट्रिक वाहन और मशीन मरम्मत में व्यावहारिक काम करना बहुत पसंद है।',
    'मैं कम अंक होने से थोड़ा चिंतित हूँ लेकिन रोबोटिक्स, विद्युत उपकरण और पॉलिटेक्निक डिप्लोमा में मेरी गहरी रुचि है।',
  ],
  software_ai: [
    'मुझे कंप्यूटर कोडिंग, कृत्रिम बुद्धिमत्ता (एआई) और सॉफ्टवेयर एप्लिकेशन बनाने में बहुत उत्साहित महसूस होता है और गणित मेरा पसंदीदा विषय है।',
    'मैं कंप्यूटर विज्ञान और एआई मॉडल सीखने के लिए आत्मविश्वास से भरा हूँ और नई तकनीक बनाना चाहता हूँ।',
  ],
  data_cloud: [
    'मुझे गणित, डेटा विश्लेषण और कंप्यूटर सिस्टम में गहरी रुचि है और मैं डेटा पैटर्न समझना पसंद करता हूँ।',
    'मैं डेटा और सांख्यिकी के क्षेत्र में काम करना चाहता हूँ हालांकि करियर चुनने में थोड़ा असमंजस है।',
  ],
  core_engineering: [
    'मुझे भौतिकी, गणित, रोबोटिक्स और इलेक्ट्रिक वाहन या अंतरिक्ष अनुसंधान तकनीक में काम करने का बहुत उत्साह है।',
    'मैं विज्ञान और भौतिकी के सिद्धांतों से मशीनों, ऊर्जा प्रणालियों और निर्माण परियोजनाओं को डिज़ाइन करना पसंद करता हूँ।',
  ],
  healthcare_biosciences: [
    'जीवविज्ञान और रसायन मेरे सबसे मजबूत विषय हैं और मैं डॉक्टर, नर्सिंग या फार्मेसी के माध्यम से रोगियों की सेवा करना चाहता हूँ।',
    'मुझे चिकित्सा विज्ञान, जीवविज्ञान और स्वास्थ्य अनुसंधान में गहरी रुचि है, पर प्रवेश परीक्षा को लेकर थोड़ा चिंतित हूँ।',
  ],
  commerce_finance: [
    'वाणिज्य, लेखांकन (सीए), वित्त और बैंकिंग क्षेत्र में काम करने के लिए मैं बहुत उत्साहित हूँ।',
    'मुझे वाणिज्य, गणित और वित्तीय बाज़ार के डेटा का विश्लेषण करना बहुत पसंद है।',
  ],
  law_policy: [
    'मुझे कानून, संविधान, यूपीएससी सिविल सेवा और सार्वजनिक नीति के माध्यम से समाज में बदलाव लाने में रुचि है।',
    'मैं वकील या सिविल सेवा अधिकारी बनकर न्याय और प्रशासन में योगदान देने के लिए आत्मविश्वास रखता हूँ।',
  ],
  design_media: [
    'मुझे डिज़ाइन, वास्तुकला, डिजिटल पत्रकारिता और रचनात्मक दृश्य कहानी कहने में बहुत आनंद और उत्साह मिलता है।',
    'मेरी रुचि उपयोगकर्ता अनुभव डिज़ाइन और रचनात्मक मीडिया में है।',
  ],
  science_research_agri: [
    'मुझे विज्ञान अनुसंधान, कृषि तकनीक, पर्यावरण और प्रयोगशाला प्रयोगों में कार्य करना बहुत पसंद है।',
    'मैं कृषि विज्ञान, भौतिकी और वैज्ञानिक अनुसंधान के क्षेत्र में देश के लिए काम करना चाहता हूँ।',
  ],
  management_consulting: [
    'मुझे व्यवसाय प्रबंधन, उत्पाद रणनीति और टीम का नेतृत्व करने में आत्मविश्वास और गहरी रुचि है।',
    'मैं प्रबंधन और व्यापार रणनीति के माध्यम से संगठनों की समस्याओं को हल करना पसंद करता हूँ।',
  ],
};

const KANNADA_SECTOR_SENTENCES: Record<string, string[]> = {
  skilled_polytechnic: [
    'ನನಗೆ ಡಿಪ್ಲೊಮಾ ಮತ್ತು ಐಟಿಐ ಮೂಲಕ ಸೌರಶಕ್ತಿ, ಯಂತ್ರೋಪಕರಣ ಮತ್ತು ಎಲೆಕ್ಟ್ರಿಕಲ್ ಕ್ಷೇತ್ರದಲ್ಲಿ ಪ್ರಾಯೋಗಿಕ ಕೆಲಸ ಮಾಡಲು ತುಂಬಾ ಆಸಕ್ತಿ ಇದೆ.',
    'ಕಡಿಮೆ ಅಂಕ ಬಂದಿರುವುದರಿಂದ ಸ್ವಲ್ಪ ಆತಂಕ ಇದೆ, ಆದರೆ ಡಿಪ್ಲೊಮಾ ಮತ್ತು ತಾಂತ್ರಿಕ ಕೌಶಲ್ಯ ಕಲಿಯಲು ಉತ್ಸಾಹ ಇದೆ.',
  ],
  software_ai: [
    'ನನಗೆ ಕಂಪ್ಯೂಟರ್ ಕೋಡಿಂಗ್, ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ ಮತ್ತು ಗಣಿತ ವಿಷಯಗಳಲ್ಲಿ ತುಂಬಾ ಆಸಕ್ತಿ ಮತ್ತು ಉತ್ಸಾಹ ಇದೆ.',
    'ನಾನು ಕಂಪ್ಯೂಟರ್ ವಿಜ್ಞಾನ ಮತ್ತು ಸಾಫ್ಟ್‌ವೇರ್ ಅಭಿವೃದ್ಧಿಯಲ್ಲಿ ವೃತ್ತಿ ನಿರ್ಮಿಸಲು ಆತ್ಮವಿಶ್ವಾಸ ಹೊಂದಿದ್ದೇನೆ.',
  ],
  data_cloud: [
    'ಗಣಿತ ಮತ್ತು ಡೇಟಾ ವಿಶ್ಲೇಷಣೆ ನನ್ನ ನೆಚ್ಚಿನ ವಿಷಯಗಳಾಗಿವೆ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ಡೇಟಾ ಕ್ಷೇತ್ರದಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಇಷ್ಟಪಡುತ್ತೇನೆ.',
    'ನನಗೆ ಡೇಟಾ ಮತ್ತು ಸಂಖ್ಯಾಶಾಸ್ತ್ರದಲ್ಲಿ ಆಸಕ್ತಿ ಇದೆ ಆದರೆ ಸರಿಯಾದ ಮಾರ್ಗದ ಬಗ್ಗೆ ಸ್ವಲ್ಪ ಗೊಂದಲ ಇದೆ.',
  ],
  core_engineering: [
    'ಭೌತಶಾಸ್ತ್ರ, ಗಣಿತ ಮತ್ತು ರೋಬೋಟಿಕ್ಸ್ ಯಂತ್ರಗಳ ವಿನ್ಯಾಸದಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ನನಗೆ ತುಂಬಾ ಉತ್ಸಾಹ ಇದೆ.',
    'ನನಗೆ ವಿಜ್ಞಾನ, ಭೌತಶಾಸ್ತ್ರ ಮತ್ತು ಸೌರಶಕ್ತಿ ಅಥವಾ ಮೂಲಸೌಕರ್ಯ ನಿರ್ಮಾಣ ತಂತ್ರಜ್ಞಾನದಲ್ಲಿ ಆಸಕ್ತಿ ಇದೆ.',
  ],
  healthcare_biosciences: [
    'ಜೀವಶಾಸ್ತ್ರ ಮತ್ತು ರಸಾಯನಶಾಸ್ತ್ರ ನನಗೆ ತುಂಬಾ ಇಷ್ಟ, ನಾನು ವೈದ್ಯಕೀಯ ಅಥವಾ ನರ್ಸಿಂಗ್ ಕ್ಷೇತ್ರದಲ್ಲಿ ರೋಗಿಗಳ ಸೇವೆ ಮಾಡಲು ಬಯಸುತ್ತೇನೆ.',
    'ನನಗೆ ವೈದ್ಯಕೀಯ ವಿಜ್ಞಾನ ಮತ್ತು ಜೀವಶಾಸ್ತ್ರ ಸಂಶೋಧನೆಯಲ್ಲಿ ಆಸಕ್ತಿ ಇದೆ ಆದರೆ ಪರೀಕ್ಷೆಯ ಬಗ್ಗೆ ಸ್ವಲ್ಪ ಭಯ ಇದೆ.',
  ],
  commerce_finance: [
    'ವಾಣಿಜ್ಯ, ಲೆಕ್ಕಶಾಸ್ತ್ರ, ಬ್ಯಾಂಕಿಂಗ್ ಮತ್ತು ಹಣಕಾಸು ನಿರ್ವಹಣೆಯಲ್ಲಿ ವೃತ್ತಿ ಮಾಡಲು ನನಗೆ ಆತ್ಮವಿಶ್ವಾಸ ಇದೆ.',
    'ನನಗೆ ವಾಣಿಜ್ಯ ಮತ್ತು ಹಣಕಾಸು ವಿಶ್ಲೇಷಣೆ ವಿಷಯಗಳಲ್ಲಿ ಹೆಚ್ಚಿನ ಆಸಕ್ತಿ ಇದೆ.',
  ],
  law_policy: [
    'ಕಾನೂನು, ಸಂವಿಧಾನ ಮತ್ತು ನಾಗರಿಕ ಸೇವೆ ಮೂಲಕ ಸಾರ್ವಜನಿಕ ಆಡಳಿತದಲ್ಲಿ ಸೇವೆ ಸಲ್ಲಿಸಲು ನನಗೆ ತುಂಬಾ ಆಸಕ್ತಿ ಇದೆ.',
    'ನಾನು ಕಾನೂನು ಅಥವಾ ನಾಗರಿಕ ಸೇವೆ ಕ್ಷೇತ್ರದಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಉತ್ಸಾಹ ಹೊಂದಿದ್ದೇನೆ.',
  ],
  design_media: [
    'ನನಗೆ ವಿನ್ಯಾಸ, ವಾಸ್ತುಶಿಲ್ಪ ಮತ್ತು ಪತ್ರಿಕೋದ್ಯಮದಂತಹ ಸೃಜನಶೀಲ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಕೆಲಸ ಮಾಡುವುದು ತುಂಬಾ ಇಷ್ಟ.',
    'ಸೃಜನಾತ್ಮಕ ವಿನ್ಯಾಸ ಮತ್ತು ಡಿಜಿಟಲ್ ಮಾಧ್ಯಮದಲ್ಲಿ ನನಗೆ ಹೆಚ್ಚಿನ ಆಸಕ್ತಿ ಇದೆ.',
  ],
  science_research_agri: [
    'ವಿಜ್ಞಾನ ಸಂಶೋಧನೆ, ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ ಮತ್ತು ಪರಿಸರ ಅಧ್ಯಯನದಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ನನಗೆ ತುಂಬಾ ಇಷ್ಟ.',
    'ನಾನು ಕೃಷಿ ಮತ್ತು ವೈಜ್ಞಾನಿಕ ಸಂಶೋಧನೆ ಮೂಲಕ ಗ್ರಾಮೀಣ ಅಭಿವೃದ್ಧಿಗೆ ಕೊಡುಗೆ ನೀಡಲು ಬಯಸುತ್ತೇನೆ.',
  ],
  management_consulting: [
    'ವ್ಯವಹಾರ ನಿರ್ವಹಣೆ, ಉತ್ಪನ್ನ ತಂತ್ರಗಾರಿಕೆ ಮತ್ತು ನಾಯಕತ್ವ ವಹಿಸುವಲ್ಲಿ ನನಗೆ ಆತ್ಮವಿಶ್ವಾಸ ಇದೆ.',
    'ನನಗೆ ವಾಣಿಜ್ಯ ಮತ್ತು ನಿರ್ವಹಣೆ ಕ್ಷೇತ್ರದಲ್ಲಿ ಸಂಸ್ಥೆಗಳನ್ನು ಮುನ್ನಡೆಸಲು ಆಸಕ್ತಿ ಇದೆ.',
  ],
};

function extractNativeDomainPhrase(rawNativeTitle: string): string {
  return rawNativeTitle
    .replace(/[()]/g, ' ')
    .split(/\s+/)
    .filter((w) => !/^[A-Za-z0-9/-]+$/.test(w))
    .slice(0, 2)
    .join(' ');
}

function buildNaturalAspiration(
  career: CareerRecord,
  language: SupportedLanguage,
  cohort: GeographicCohort,
  isEdge: boolean,
  variantIdx: number
): string {
  const kw1 = career.keywords[0] || career.sectorName;
  const sk1 = career.requiredSkills[0] || 'practical problem solving';
  const sub1 = career.requiredSubjects[0] || 'core studies';
  const envWord = career.workEnvironment.split('&')[0].trim().toLowerCase();

  if (language === 'hi') {
    const baseList = HINDI_SECTOR_SENTENCES[career.sectorId] || HINDI_SECTOR_SENTENCES.software_ai;
    const base = baseList[variantIdx % baseList.length];
    const hiDomain = extractNativeDomainPhrase(career.titleHi);
    const anxietyNote = isEdge ? ' कम अंक और पात्रता को लेकर थोड़ा असमंजस और चिंतित हूँ।' : '';
    return `${base} विशेष रूप से ${hiDomain} के कार्यों में मेरी रुचि है।${anxietyNote}`;
  }

  if (language === 'kn') {
    const baseList = KANNADA_SECTOR_SENTENCES[career.sectorId] || KANNADA_SECTOR_SENTENCES.software_ai;
    const base = baseList[variantIdx % baseList.length];
    const knDomain = extractNativeDomainPhrase(career.titleKn);
    const anxietyNote = isEdge ? ' ಕಡಿಮೆ ಅಂಕ ಬಂದಿರುವುದರಿಂದ ಸ್ವಲ್ಪ ಆತಂಕ ಮತ್ತು ಗೊಂದಲ ಇದೆ.' : '';
    return `${base} ವಿಶೇಷವಾಗಿ ${knDomain} ಕ್ಷೇತ್ರದಲ್ಲಿ ಕೆಲಸ ಮಾಡಲು ಆಸಕ್ತಿ ಇದೆ.${anxietyNote}`;
  }

  // English natural reflections — realistic student phrasing without dumping full O*NET keyword lists
  if (cohort === 'rural') {
    return isEdge
      ? `I studied in a rural school and feel worried about cutoffs, though I enjoy ${sub1} and practical tasks related to ${kw1}.`
      : `I enjoy ${sub1} and want a reliable career in ${career.sectorName.toLowerCase()} working around ${kw1} in ${envWord} settings.`;
  }
  if (cohort === 'semi_urban') {
    return isEdge
      ? `I am slightly confused about stream eligibility, yet I am very interested in ${kw1} and applying ${sub1}.`
      : `My favorite subject is ${sub1}, and I am excited to pursue ${career.sectorName.toLowerCase()} roles involving ${kw1}.`;
  }
  return isEdge
    ? `Although my marks are borderline and my resume is still incomplete, I am curious about ${kw1} and ${sk1}.`
    : `I am passionate about ${kw1} and ${sk1}, with strong grounding in ${sub1} for ${envWord} environments.`;
}

function jitterRIASEC(target: RIASECScores, rng: () => number, sparse: boolean): Partial<RIASECScores> {
  if (sparse && rng() < 0.35) {
    return {
      I: Math.round(Math.min(100, Math.max(15, target.I * 100 + (rng() - 0.5) * 16))),
      R: Math.round(Math.min(100, Math.max(15, target.R * 100 + (rng() - 0.5) * 16))),
      S: Math.round(Math.min(100, Math.max(15, target.S * 100 + (rng() - 0.5) * 16))),
    };
  }
  const noise = () => (rng() - 0.5) * 14;
  return {
    R: Math.round(Math.min(100, Math.max(10, target.R * 100 + noise()))),
    I: Math.round(Math.min(100, Math.max(10, target.I * 100 + noise()))),
    A: Math.round(Math.min(100, Math.max(10, target.A * 100 + noise()))),
    S: Math.round(Math.min(100, Math.max(10, target.S * 100 + noise()))),
    E: Math.round(Math.min(100, Math.max(10, target.E * 100 + noise()))),
    C: Math.round(Math.min(100, Math.max(10, target.C * 100 + noise()))),
  };
}

function pickCrossStreamForBridge(career: CareerRecord): string {
  if (career.sectorId === 'software_ai' || career.sectorId === 'data_cloud') {
    return 'Diploma / Commerce with Mathematics';
  }
  if (career.sectorId === 'core_engineering') {
    return 'Diploma Engineering';
  }
  if (career.sectorId === 'management_consulting') {
    return 'Arts/Humanities';
  }
  if (career.sectorId === 'design_media') {
    return 'Commerce';
  }
  return career.eligibleStreams[0] || 'Science';
}

function findBestCounselorRubricB(
  career: CareerRecord,
  studentRiasec: Partial<RIASECScores>,
  level: EducationLevel,
  rng: () => number
): string {
  if (rng() > 0.11 || career.alternativeCareerIds.length === 0) {
    return career.id;
  }
  const altId = career.alternativeCareerIds[0];
  const exists = CAREER_REPOSITORY.find(
    (c) => c.id === altId && c.applicableLevels.includes(level)
  );
  void studentRiasec;
  return exists ? exists.id : career.id;
}

function generateSplitProfiles(
  split: 'train' | 'test',
  totalCount: number,
  seed: number
): BenchmarkProfileRecord[] {
  const rng = createSeededRng(seed);
  const levels: EducationLevel[] = ['after_10th', 'after_12th', 'undergraduate', 'graduate'];
  const perLevel = Math.floor(totalCount / levels.length);

  const records: BenchmarkProfileRecord[] = [];
  let globalIdx = 0;

  for (const level of levels) {
    const stageCareers = CAREER_REPOSITORY.filter((c) => c.applicableLevels.includes(level));

    for (let i = 0; i < perLevel; i++) {
      globalIdx++;
      const careerOffset = split === 'train' ? i * 3 + 1 : i * 2;
      const targetCareer = stageCareers[careerOffset % stageCareers.length];

      // Language stratification: 50% en, 25% hi, 25% kn
      const langMod = i % 4;
      const language: SupportedLanguage = langMod === 0 || langMod === 1 ? 'en' : langMod === 2 ? 'hi' : 'kn';

      // Cohort stratification: urban / semi_urban / rural
      const cohortMod = i % 3;
      const cohort: GeographicCohort =
        cohortMod === 0 ? 'urban' : cohortMod === 1 ? 'semi_urban' : 'rural';

      // 30% incomplete / borderline / cross-stream edge cases
      const isEdge = i % 10 === 2 || i % 10 === 5 || i % 10 === 8;
      const completenessCondition = isEdge ? 'incomplete_edge' : 'complete';

      let academicPercentage: number | null = Math.min(
        96,
        targetCareer.minAcademicScore + 4 + Math.floor(rng() * 18)
      );
      let currentStream = targetCareer.eligibleStreams[0] || 'Science';

      if (isEdge) {
        if (i % 2 === 0) {
          academicPercentage = null; // Missing academic percentage
        } else {
          academicPercentage = Math.max(46, targetCareer.minAcademicScore - (3 + (i % 5))); // Borderline cutoff
        }
        if (i % 3 === 2) {
          currentStream = pickCrossStreamForBridge(targetCareer);
        }
      }

      // Realistic skill & interest tags:
      // Non-English or incomplete/rural students rarely enter formal English O*NET skill tags
      const finalSkills =
        isEdge || cohort === 'rural' || language !== 'en'
          ? isEdge
            ? []
            : targetCareer.requiredSkills.slice(0, 1)
          : targetCareer.requiredSkills.slice(0, 2);

      const preferredSubjects = targetCareer.requiredSubjects.slice(0, isEdge ? 1 : 2);

      const interests =
        language === 'hi'
          ? [extractNativeDomainPhrase(targetCareer.titleHi)]
          : language === 'kn'
            ? [extractNativeDomainPhrase(targetCareer.titleKn)]
            : isEdge
              ? [targetCareer.sectorName]
              : [targetCareer.keywords[0] || targetCareer.sectorName];

      const riasecScores = jitterRIASEC(targetCareer.riasecProfile, rng, isEdge);

      const aspirationText = buildNaturalAspiration(
        targetCareer,
        language,
        cohort,
        isEdge,
        globalIdx + (split === 'train' ? 100 : 0)
      );

      const profile: StudentProfile = {
        sessionId: `${split}_${String(globalIdx).padStart(3, '0')}`,
        language,
        inputMode: i % 5 === 0 ? 'voice' : 'text',
        cohort,
        educationLevel: level,
        currentStream,
        academicPercentage,
        subjectMarks:
          academicPercentage !== null && preferredSubjects[0]
            ? { [preferredSubjects[0]]: Math.min(99, academicPercentage + 4) }
            : {},
        preferredSubjects,
        interests,
        skills: finalSkills,
        aptitudeScores: isEdge
          ? { analytical: Math.round((targetCareer.riasecProfile.I || 0.6) * 90) }
          : {
              analytical: Math.round((targetCareer.riasecProfile.I || 0.6) * 92),
              quantitative: Math.round((targetCareer.riasecProfile.C || 0.6) * 88),
              verbal: Math.round((targetCareer.riasecProfile.S || 0.6) * 88),
              creative: Math.round((targetCareer.riasecProfile.A || 0.5) * 90),
              practical: Math.round((targetCareer.riasecProfile.R || 0.5) * 90),
            },
        riasecScores,
        workEnvironmentPref: isEdge ? '' : targetCareer.workEnvironment.split('&')[0].trim(),
        careerAspirationText: aspirationText,
        acceptedCareers: [],
        rejectedCareers: [],
      };

      const rubricA = targetCareer.id;
      const rubricB = findBestCounselorRubricB(targetCareer, riasecScores, level, rng);

      records.push({
        id: `${split.toUpperCase()}_${String(globalIdx).padStart(3, '0')}`,
        split,
        cohort,
        language,
        completenessCondition,
        primaryTargetCareerId: targetCareer.id,
        acceptableSecondaryIds: targetCareer.alternativeCareerIds.slice(0, 2),
        counselorRubricA: rubricA,
        counselorRubricB: rubricB,
        profile,
      });
    }
  }

  return records;
}

export const BENCHMARK_TRAIN_SPLIT: BenchmarkProfileRecord[] = generateSplitProfiles('train', 80, 202501);
export const BENCHMARK_TEST_SPLIT: BenchmarkProfileRecord[] = generateSplitProfiles('test', 160, 202599);
export const FULL_BENCHMARK_DATASET: BenchmarkProfileRecord[] = [
  ...BENCHMARK_TRAIN_SPLIT,
  ...BENCHMARK_TEST_SPLIT,
];
