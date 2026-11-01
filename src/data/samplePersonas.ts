import type { StudentProfile } from '../types/sankalp';

export interface DemoPersona {
  id: string;
  label: string;
  researchFocus: string;
  profile: StudentProfile;
}

export const DEMO_STUDENT_PERSONAS: DemoPersona[] = [
  {
    id: 'borderline_12th_ai',
    label: 'After 12th · Borderline Marks (62%) · AI Aspirant',
    researchFocus: 'Demonstrates Soft Fuzzy Rules overcoming Original Sankalp Rule Rigidity',
    profile: {
      sessionId: 'demo_borderline_12th',
      language: 'en',
      inputMode: 'text',
      cohort: 'semi_urban',
      educationLevel: 'after_12th',
      currentStream: 'Science (PCM)',
      academicPercentage: 62,
      subjectMarks: { Mathematics: 68, Physics: 60, 'Computer Science': 74 },
      preferredSubjects: ['Mathematics', 'Computer Science'],
      interests: ['Machine Learning', 'Deep Learning', 'Coding'],
      skills: ['Python', 'Linear Algebra'],
      aptitudeScores: { analytical: 86, quantitative: 82, verbal: 68, creative: 70, practical: 75 },
      riasecScores: { R: 55, I: 92, A: 48, S: 42, E: 52, C: 76 },
      workEnvironmentPref: 'Product Engineering & AI Labs',
      careerAspirationText:
        'My 12th board overall percentage is 62% so I am slightly worried about rigid engineering cutoffs, yet I love Python programming, neural networks, and building machine learning models.',
      acceptedCareers: [],
      rejectedCareers: [],
    },
  },
  {
    id: 'rural_kannada_10th',
    label: 'After 10th · Rural Kannada · Solar & Polytechnic',
    researchFocus: 'Demonstrates Native Kannada Lexicon + SCCT Anxiety Empathy + Rural Fairness',
    profile: {
      sessionId: 'demo_rural_kn_10th',
      language: 'kn',
      inputMode: 'voice',
      cohort: 'rural',
      educationLevel: 'after_10th',
      currentStream: 'SSLC / 10th Completed',
      academicPercentage: 54,
      subjectMarks: { Science: 58, Mathematics: 55 },
      preferredSubjects: ['Physics', 'Mathematics'],
      interests: ['ಸೌರಶಕ್ತಿ', 'ಡಿಪ್ಲೊಮಾ'],
      skills: [],
      aptitudeScores: { analytical: 64, quantitative: 62, verbal: 58, creative: 55, practical: 88 },
      riasecScores: { R: 90, I: 65, A: 35, S: 48, E: 45, C: 68 },
      workEnvironmentPref: 'Field & Workshop',
      careerAspirationText:
        'ಕಡಿಮೆ ಅಂಕ ಬಂದಿರುವುದರಿಂದ ಸ್ವಲ್ಪ ಆತಂಕ ಇದೆ, ಆದರೆ ನನಗೆ ಡಿಪ್ಲೊಮಾ ಮತ್ತು ಐಟಿಐ ಮೂಲಕ ಸೌರಶಕ್ತಿ ಹಾಗೂ ಎಲೆಕ್ಟ್ರಿಕಲ್ ಕ್ಷೇತ್ರದಲ್ಲಿ ಪ್ರಾಯೋಗಿಕ ಕೆಲಸ ಮಾಡಲು ತುಂಬಾ ಆಸಕ್ತಿ ಇದೆ.',
      acceptedCareers: [],
      rejectedCareers: [],
    },
  },
  {
    id: 'incomplete_ug_cs',
    label: 'Undergraduate · Incomplete Profile (Missing Marks & Skills)',
    researchFocus: 'Demonstrates Knowledge Graph Attribute Imputation + Multi-Facet SBERT',
    profile: {
      sessionId: 'demo_incomplete_ug',
      language: 'en',
      inputMode: 'text',
      cohort: 'urban',
      educationLevel: 'undergraduate',
      currentStream: 'Computing / BCA',
      academicPercentage: null,
      subjectMarks: {},
      preferredSubjects: ['Computer Science', 'Statistics'],
      interests: ['Cloud Architecture', 'Cybersecurity'],
      skills: [],
      aptitudeScores: { analytical: 84 },
      riasecScores: { R: 68, I: 88, A: 40, S: 38, E: 50, C: 80 },
      workEnvironmentPref: '',
      careerAspirationText:
        'I have not entered my semester CGPA or full resume yet, and I want to secure cloud infrastructure, containers, and enterprise networks against cyber threats.',
      acceptedCareers: [],
      rejectedCareers: [],
    },
  },
  {
    id: 'hindi_grad_commerce',
    label: 'Graduate · Hindi Devanagari · FinTech & Analytics Bridge',
    researchFocus: 'Demonstrates Hindi Academic Lexicon + NEP-2020 Cross-Stream Bridge',
    profile: {
      sessionId: 'demo_hindi_grad',
      language: 'hi',
      inputMode: 'text',
      cohort: 'semi_urban',
      educationLevel: 'graduate',
      currentStream: 'Commerce (B.Com with Mathematics)',
      academicPercentage: 74,
      subjectMarks: { Economics: 78, Mathematics: 76, Accountancy: 80 },
      preferredSubjects: ['Economics', 'Mathematics', 'Accountancy'],
      interests: ['वित्त', 'डेटा'],
      skills: ['Financial Modeling', 'SQL'],
      aptitudeScores: { analytical: 85, quantitative: 88, verbal: 74, creative: 58, practical: 64 },
      riasecScores: { R: 32, I: 84, A: 35, S: 48, E: 78, C: 90 },
      workEnvironmentPref: 'Financial & Analytics Advisory',
      careerAspirationText:
        'मुझे वाणिज्य, वित्त, बैंकिंग और डेटा विश्लेषण के माध्यम से निवेश और जोखिम मॉडल बनाने में बहुत उत्साहित और आत्मविश्वास महसूस होता है।',
      acceptedCareers: [],
      rejectedCareers: [],
    },
  },
];
