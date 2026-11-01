import type { EducationLevel } from '../types/sankalp';

export interface YouTubeChannelResource {
  name: string;
  bestFor: string;
  language: string;
  url: string;
}

export interface StudyNoteResource {
  title: string;
  type: 'Free Notes & PDFs' | 'Official Textbooks' | 'Free Online Courses' | 'Practice & Mock Tests';
  description: string;
  url: string;
}

export interface StreamCareerOutcome {
  role: string;
  degreePath: string;
  entrySalary: string;
  experiencedSalary: string;
  sectorType: 'Private & Tech' | 'Healthcare' | 'Finance & Corporate' | 'Government & Public' | 'Creative & Legal' | 'Core Industry';
}

export interface BeginnerStreamGuide {
  id: string;
  stage: EducationLevel;
  title: string;
  shortTagline: string;
  simpleExplanation: string;
  whoShouldChoose: string[];
  subjectsStudied: string[];
  whatComesNext: {
    immediateNextStep: string[];     // e.g. B.Tech, MBBS, B.Com, BCA
    higherStudiesLater: string[];    // e.g. MBA, M.Tech, MS Abroad, UPSC
    majorEntranceExams: string[];
  };
  careerAndSalary: StreamCareerOutcome[];
  skillsToDevelop: {
    startNow: string[];
    coreSkills: string[];
    softSkills: string[];
  };
  stepByStepRoadmap: Array<{
    phase: string;
    title: string;
    actions: string;
  }>;
  youtubeChannels: YouTubeChannelResource[];
  notesAndResources: StudyNoteResource[];
}

export const BEGINNER_STREAM_GUIDES: BeginnerStreamGuide[] = [
  // ==================== AFTER 10TH STREAMS ====================
  {
    id: '10th-science-pcm',
    stage: 'after_10th',
    title: 'Science with Maths (PCM — Physics, Chemistry, Maths)',
    shortTagline: 'Opens doors to B.Tech Engineering, Computer Science, AI, Architecture, Pilot, Defence & even MBA/Commerce later.',
    simpleExplanation:
      'PCM is the most flexible stream after 10th. You study how nature, machines, electricity, numbers, and computers work. Even if you later decide not to do engineering, a PCM student is allowed to switch into BCA, BBA, B.Com, Law, Design, or MBA after 12th!',
    whoShouldChoose: [
      'Students curious about computers, coding, apps, cars, rockets, buildings, or electronics.',
      'Students comfortable practicing Mathematics and logical problem solving.',
      'Anyone who wants maximum career options kept open after 12th.',
    ],
    subjectsStudied: [
      'Physics',
      'Chemistry',
      'Mathematics',
      'English',
      'Optional 5th Subject: Computer Science (Python) / Electronics / Physical Education / Economics',
    ],
    whatComesNext: {
      immediateNextStep: [
        'B.Tech / B.E. (CSE, AI & ML, ECE, Mechanical, Civil, Electrical, Aerospace)',
        'BCA (Bachelor of Computer Applications) or B.Sc Computer Science / Data Science',
        'B.Arch (5-Year Architecture) or B.Des (Product / UI-UX Design)',
        'NDA (Indian Army, Navy, Air Force Officer) or Commercial Pilot (CPL)',
      ],
      higherStudiesLater: [
        'MBA (IIMs / Top B-Schools — huge numbers of B.Tech students do MBA!)',
        'M.Tech (IITs/NITs via GATE) or MS Abroad (USA, Germany, UK)',
        'UPSC Civil Services (IAS / IPS / IFS) or PSU Engineering Jobs (ISRO, DRDO, BHEL)',
      ],
      majorEntranceExams: ['JEE Main & Advanced', 'State CET (KCET / MHT-CET / WBJEE / EAMCET)', 'BITSAT / VITEEE', 'NATA (Architecture)', 'NDA'],
    },
    careerAndSalary: [
      {
        role: 'Software / AI & Machine Learning Engineer',
        degreePath: '12th PCM → B.Tech CSE/AI or BCA+MCA',
        entrySalary: '₹6 – ₹18 LPA',
        experiencedSalary: '₹22 – ₹55+ LPA',
        sectorType: 'Private & Tech',
      },
      {
        role: 'Product Manager / Management Consultant',
        degreePath: '12th PCM → B.Tech → MBA',
        entrySalary: '₹12 – ₹26 LPA',
        experiencedSalary: '₹30 – ₹65+ LPA',
        sectorType: 'Finance & Corporate',
      },
      {
        role: 'Electronics, VLSI, EV or Mechanical Engineer',
        degreePath: '12th PCM → B.Tech ECE / EEE / Mech',
        entrySalary: '₹5.5 – ₹14 LPA',
        experiencedSalary: '₹18 – ₹42 LPA',
        sectorType: 'Core Industry',
      },
      {
        role: 'ISRO / DRDO Scientist or PSU Officer',
        degreePath: '12th PCM → B.Tech → GATE / ICRB Exam',
        entrySalary: '₹9 – ₹14 LPA (Govt Grade-A)',
        experiencedSalary: '₹20 – ₹32 LPA + Benefits',
        sectorType: 'Government & Public',
      },
    ],
    skillsToDevelop: {
      startNow: ['Strong Class 11 Algebra, Trigonometry & Calculus basics', 'Basic Python programming', 'Understanding concepts instead of rote memorization'],
      coreSkills: ['Logical Problem Solving', 'Coding & Data Literacy', 'Physics & Numerical Modeling'],
      softSkills: ['Time Management', 'Analytical Thinking', 'Asking Questions Without Hesitation'],
    },
    stepByStepRoadmap: [
      {
        phase: 'Class 11 (Foundation Year)',
        title: 'Build Strong NCERT Concepts in Physics, Chemistry & Maths',
        actions: 'Do not panic if Class 11 feels bigger than Class 10. Focus daily on NCERT examples, basic vectors, calculus, and chemical bonding.',
      },
      {
        phase: 'Class 12 (Board + Entrance Prep)',
        title: 'Balance 12th Board Marks (75%+ Target) with JEE / State CET',
        actions: 'Solve previous 10 years question papers, take weekly mock tests, and register for JEE Main AND your State CET exam.',
      },
      {
        phase: 'Undergraduate (4 Years)',
        title: 'Pursue B.Tech / BCA / B.Sc / B.Arch & Build Real Projects',
        actions: 'Learn coding or core lab tools, complete 2 summer internships, and build a GitHub/project portfolio.',
      },
      {
        phase: 'Career Launch or Post-Graduation',
        title: 'Campus Placement, MBA (CAT), M.Tech (GATE), or Government R&D',
        actions: 'Start working in tech/core industry or write CAT/GATE/UPSC based on whether you prefer management, research, or public service.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Physics Wallah — Alakh Pandey',
        bestFor: 'Class 11 & 12 Physics, Chemistry & JEE Foundation from zero level',
        language: 'Hindi + English (Hinglish)',
        url: 'https://www.youtube.com/@PhysicsWallah',
      },
      {
        name: 'Mohit Tyagi (Competishun)',
        bestFor: 'Complete free Kota-level Mathematics, Physics & Chemistry lectures',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@MohitTyagi',
      },
      {
        name: 'Bharat Panchal — Chemistry Guruji',
        bestFor: 'Easy Class 11 & 12 Board Chemistry one-shots and free revision notes',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@BharatPanchalChemistryGuruji',
      },
      {
        name: 'Khan Academy India (English / Hindi)',
        bestFor: 'Visual, crystal-clear Physics, Calculus & Chemistry fundamentals',
        language: 'English & Hindi',
        url: 'https://www.youtube.com/@KhanAcademyIndiaEnglish',
      },
    ],
    notesAndResources: [
      {
        title: 'NCERT Official ePathshala (Free Class 11–12 Textbooks)',
        type: 'Official Textbooks',
        description: 'Download official NCERT Physics, Chemistry, Maths & Computer Science PDFs free.',
        url: 'https://ncert.nic.in/textbook.php',
      },
      {
        title: 'NPTEL & IIT PAL (Professor Assisted Learning for Class 11–12)',
        type: 'Free Online Courses',
        description: 'Free video lectures and notes by IIT professors specifically made for Class 11 & 12 science students.',
        url: 'https://swayam.gov.in/',
      },
      {
        title: 'National Test Abhyas / NTA Mock Portal',
        type: 'Practice & Mock Tests',
        description: 'Official free chapter-wise and full-length JEE Main practice tests.',
        url: 'https://www.nta.ac.in/Quiz',
      },
    ],
  },

  {
    id: '10th-science-pcb',
    stage: 'after_10th',
    title: 'Science with Biology (PCB — Physics, Chemistry, Biology)',
    shortTagline: 'Gateway to Doctor (MBBS/BDS), Nursing, Pharmacy, Biotechnology, Psychology, Agriculture & Healthcare.',
    simpleExplanation:
      'PCB focuses on living organisms, human anatomy, medicine, genetics, and chemistry. Many students think PCB only means MBBS — in reality, there are 20+ rewarding careers in Nursing, Clinical Research, Pharmacy, Physiotherapy, Biotech, Food Science, and Hospital Management (MBA Healthcare)!',
    whoShouldChoose: [
      'Students interested in human health, hospitals, biology, genetics, nature, or helping patients.',
      'Students who dislike heavy higher Mathematics (you can take PCB without Maths, or take PCMB to keep both open!).',
      'Students aiming for stable, respected healthcare and life-science careers in India and abroad.',
    ],
    subjectsStudied: [
      'Biology (Botany & Zoology)',
      'Chemistry',
      'Physics',
      'English',
      'Optional 5th Subject: Psychology / Biotechnology / Mathematics (PCMB) / Physical Education',
    ],
    whatComesNext: {
      immediateNextStep: [
        'MBBS (Doctor) / BDS (Dentistry) / BAMS / BHMS',
        'B.Sc Nursing (High global demand in UK, Australia, Germany & AIIMS India)',
        'B.Pharm / Pharm.D (Clinical Pharmacy & Drug R&D)',
        'B.Tech / B.Sc Biotechnology, Forensic Science, Agriculture (ICAR), or Physiotherapy (BPT)',
      ],
      higherStudiesLater: [
        'MD / MS Medical Specialization (via NEET-PG)',
        'MBA in Hospital & Healthcare Management or Pharmaceutical Management',
        'M.Sc / Ph.D. in Genetics, Bioinformatics, Clinical Psychology, or Public Health (MPH)',
      ],
      majorEntranceExams: ['NEET-UG', 'CUET-UG (B.Sc / Biotech / Agri)', 'AIIMS Nursing & Paramedical Exams', 'State CET (Pharmacy / Agri / Nursing)'],
    },
    careerAndSalary: [
      {
        role: 'Doctor / Clinical Physician & Specialist (MBBS / MD)',
        degreePath: '12th PCB → MBBS (5.5 Yrs) → MD/MS',
        entrySalary: '₹8 – ₹15 LPA',
        experiencedSalary: '₹24 – ₹60+ LPA',
        sectorType: 'Healthcare',
      },
      {
        role: 'Clinical Pharmacist / Pharmacovigilance Scientist',
        degreePath: '12th PCB → B.Pharm / Pharm.D → M.Pharm',
        entrySalary: '₹4.5 – ₹9 LPA',
        experiencedSalary: '₹14 – ₹28 LPA',
        sectorType: 'Healthcare',
      },
      {
        role: 'AIIMS / International Critical Care Nursing Officer',
        degreePath: '12th PCB → B.Sc Nursing (NORCET / IELTS)',
        entrySalary: '₹6 – ₹12 LPA (₹28+ LPA Abroad)',
        experiencedSalary: '₹15 – ₹35+ LPA',
        sectorType: 'Healthcare',
      },
      {
        role: 'Biotech / Bioinformatics Scientist & Hospital MBA Manager',
        degreePath: '12th PCB → B.Tech Biotech or B.Sc → MBA Healthcare',
        entrySalary: '₹6 – ₹14 LPA',
        experiencedSalary: '₹18 – ₹40 LPA',
        sectorType: 'Private & Tech',
      },
    ],
    skillsToDevelop: {
      startNow: ['Reading NCERT Biology line-by-line with diagrams', 'Basic Chemistry reactions', 'Empathy and calm observation'],
      coreSkills: ['Human Physiology & Biology', 'Laboratory Safety & Observation', 'Scientific Reading'],
      softSkills: ['Patience & Compassion', 'Attention to Detail', 'Clear Communication with People'],
    },
    stepByStepRoadmap: [
      {
        phase: 'Class 11',
        title: 'Master NCERT Biology Diagrams & Basic Physics Mechanics',
        actions: '90% of NEET Biology comes directly from NCERT Class 11 & 12 textbooks. Make short diagram notebooks.',
      },
      {
        phase: 'Class 12',
        title: 'Appear for Board Exams + NEET-UG + CUET-UG Backup',
        actions: 'Always fill BOTH NEET-UG and CUET-UG / State Pharmacy-Agri CET forms so you have multiple top college options.',
      },
      {
        phase: 'Undergraduate Degree',
        title: 'Clinical Rotations, Lab Internships & Licensure',
        actions: 'Gain hands-on hospital ward, clinical lab, or pharma R&D training during your degree.',
      },
      {
        phase: 'Specialization / Hospital Leadership',
        title: 'PG Residency (MD), Clinical Practice, Abroad Licensing, or Healthcare MBA',
        actions: 'Specialize clinically or transition into healthcare management, public health, or biotech research.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Competition Wallah (PW NEET)',
        bestFor: 'Complete NCERT line-by-line Biology, Physics & Chemistry for Class 11, 12 & NEET',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@CompetitionWallah',
      },
      {
        name: 'Seep Pahuja / Garima Goel Biology',
        bestFor: 'Easy-to-remember Biology diagrams, flowcharts, and NCERT mastery',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/results?search_query=NCERT+Biology+Class+11+12+NEET',
      },
      {
        name: 'Amoeba Sisters & Osmosis',
        bestFor: 'Animated visual explanations of cells, genetics, and human diseases',
        language: 'English',
        url: 'https://www.youtube.com/@AmoebaSisters',
      },
    ],
    notesAndResources: [
      {
        title: 'NCERT Biology & Chemistry Official PDFs',
        type: 'Official Textbooks',
        description: 'The single most important textbook resource for 11th, 12th Boards and NEET-UG.',
        url: 'https://ncert.nic.in/textbook.php',
      },
      {
        title: 'DIKSHA Government Portal (Chapter Notes & Videos)',
        type: 'Free Notes & PDFs',
        description: 'Ministry of Education portal with QR-linked chapter notes, question banks, and explanations.',
        url: 'https://diksha.gov.in/',
      },
    ],
  },

  {
    id: '10th-commerce',
    stage: 'after_10th',
    title: 'Commerce Stream (Business, Accounts, Economics & Finance)',
    shortTagline: 'Ideal for future Chartered Accountants (CA), MBA Leaders, Investment Bankers, FinTech Analysts & Entrepreneurs.',
    simpleExplanation:
      'Commerce teaches you how money, banks, companies, stock markets, taxes, and businesses operate. Every single company—whether Google, Tata, or a hospital—needs finance leaders, chartered accountants, analysts, and managers!',
    whoShouldChoose: [
      'Students curious about business, startups, banking, stock markets, management, or how companies make profit.',
      'Students who want high-earning corporate careers without studying Physics or Chemistry.',
      'Pro Tip: Choose "Commerce with Maths" if you want top Economics Honours, Investment Banking, or FinTech Analytics; "Commerce without Maths" is also great for CA, BBA, Law, and B.Com!',
    ],
    subjectsStudied: [
      'Accountancy (How company finances & balance sheets work)',
      'Business Studies (How companies are managed & marketed)',
      'Economics (Microeconomics, Macroeconomics & Indian Economy)',
      'English',
      'Optional 5th Subject: Applied Mathematics / Informatics Practices (IP) / Entrepreneurship',
    ],
    whatComesNext: {
      immediateNextStep: [
        'B.Com (Honours) / BBA / BMS / B.A. Economics (Honours)',
        'IPMAT (5-Year Integrated BBA + MBA directly at IIM Indore, IIM Rohtak, IIM Ranchi after 12th!)',
        'CA (Chartered Accountancy) / CS (Company Secretary) / ACCA / CFA',
        'BCA (Many universities allow Commerce + IP/Maths students!) or B.Com LL.B. (Corporate Law)',
      ],
      higherStudiesLater: [
        'MBA in Finance, Marketing, Strategy, or Business Analytics (via CAT / XAT / GMAT)',
        'CFA (Chartered Financial Analyst) or M.Sc Finance / Economics',
        'RBI Grade B Officer, SEBI, Bank PO, or UPSC Civil Services',
      ],
      majorEntranceExams: ['CUET-UG (SRCC / DU / BHU)', 'IPMAT (IIMs after 12th)', 'CA Foundation (ICAI)', 'CLAT (Corporate Law)', 'NPAT / SET'],
    },
    careerAndSalary: [
      {
        role: 'Chartered Accountant (CA) & Statutory Auditor',
        degreePath: '12th Commerce → CA Foundation → Inter → Articleship → CA Final',
        entrySalary: '₹9 – ₹16 LPA',
        experiencedSalary: '₹22 – ₹50+ LPA',
        sectorType: 'Finance & Corporate',
      },
      {
        role: 'Investment Banker / Financial Analyst (MBA / CFA)',
        degreePath: '12th Commerce → B.Com/BBA/Eco → MBA Finance / CFA',
        entrySalary: '₹10 – ₹25 LPA',
        experiencedSalary: '₹28 – ₹65+ LPA',
        sectorType: 'Finance & Corporate',
      },
      {
        role: 'FinTech / Business Data Analyst',
        degreePath: '12th Commerce + Maths/IP → B.Com/BBA/Eco + SQL/Excel',
        entrySalary: '₹6 – ₹13 LPA',
        experiencedSalary: '₹16 – ₹35 LPA',
        sectorType: 'Private & Tech',
      },
      {
        role: 'RBI Grade B / Banking Credit Officer',
        degreePath: '12th Commerce → Graduation → RBI / IBPS Exam',
        entrySalary: '₹8 – ₹16 LPA',
        experiencedSalary: '₹20 – ₹32 LPA',
        sectorType: 'Government & Public',
      },
    ],
    skillsToDevelop: {
      startNow: ['Understanding debit/credit & percentage calculations', 'Reading basic business news', 'MS Excel / Google Sheets basics'],
      coreSkills: ['Accounting & Financial Literacy', 'Excel & Data Interpretation', 'Economic Reasoning'],
      softSkills: ['Business Communication', 'Presentation & Negotiation', 'Leadership'],
    },
    stepByStepRoadmap: [
      {
        phase: 'Class 11',
        title: 'Master Golden Rules of Accounting & Microeconomics',
        actions: 'Accountancy is a brand-new subject for everyone in Class 11—practice journal entries and ledgers regularly from day one.',
      },
      {
        phase: 'Class 12',
        title: 'Target Top Board Score + CUET-UG / IPMAT / CA Foundation',
        actions: 'Prepare for CUET-UG (for top colleges like SRCC/DU) or IPMAT (for direct IIM admission after 12th) or register with ICAI for CA Foundation.',
      },
      {
        phase: 'College / Articleship (3–4 Years)',
        title: 'B.Com / BBA / Eco (Hons) + Practical Finance Skills',
        actions: 'Learn Advanced Excel, Financial Modeling, PowerBI/SQL, or complete CA Intermediate + Articleship.',
      },
      {
        phase: 'Career Acceleration',
        title: 'Corporate Placement, MBA (CAT), CA Qualification, or Central Banking',
        actions: 'Join Big-4 firms (Deloitte, PwC, EY, KPMG), banks, or pursue an MBA from IIMs/top B-schools.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Rajat Arora',
        bestFor: 'Most loved Class 11 & 12 Accountancy, Economics & Business Studies explanations',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@Rajataroraofficial',
      },
      {
        name: 'Sunil Panda — The Educator',
        bestFor: 'Class 12 Commerce Board + CUET-UG revision, mock papers & notes',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@SunilPanda11-12Commerce',
      },
      {
        name: 'CA Parag Gupta',
        bestFor: 'Deep conceptual clarity in Accountancy & Economics',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@CAParagGupta',
      },
    ],
    notesAndResources: [
      {
        title: 'ICAI BoS Knowledge Portal (Official Free CA Study Material)',
        type: 'Free Notes & PDFs',
        description: '100% free study modules, RTPs, and mock papers directly from the Institute of Chartered Accountants of India.',
        url: 'https://boslive.icai.org/',
      },
      {
        title: 'NCERT Accountancy, Business Studies & Economics Textbooks',
        type: 'Official Textbooks',
        description: 'Official Class 11 & 12 Commerce books used for Boards and CUET-UG.',
        url: 'https://ncert.nic.in/textbook.php',
      },
      {
        title: 'Zerodha Varsity (Free Personal Finance & Stock Market Modules)',
        type: 'Free Online Courses',
        description: 'Simple, jargon-free chapters on markets, corporate finance, and economics.',
        url: 'https://zerodha.com/varsity/',
      },
    ],
  },

  {
    id: '10th-arts-humanities',
    stage: 'after_10th',
    title: 'Arts / Humanities Stream (Law, Design, UPSC, Psychology & Media)',
    shortTagline: 'Powerhouse stream for Civil Services (IAS/IPS), Corporate Law, UI/UX Design, Psychology, Journalism & Policy.',
    simpleExplanation:
      'Forget the outdated myth that Arts is only for low marks! Today, top scorers intentionally pick Humanities to crack CLAT (National Law Universities), NID/UCEED (Product & UX Design), Psychology, International Relations, Journalism, and UPSC Civil Services.',
    whoShouldChoose: [
      'Students who enjoy reading, writing, debating, human psychology, history, politics, or creative design.',
      'Future IAS/IPS officers, lawyers, psychologists, UX designers, journalists, or policy makers.',
      'Students who thrive in communication, creativity, social understanding, and leadership.',
    ],
    subjectsStudied: [
      'Political Science & History',
      'Psychology / Sociology',
      'Economics / Geography',
      'English & Literature',
      'Optional: Fine Arts / Legal Studies / Mass Media',
    ],
    whatComesNext: {
      immediateNextStep: [
        'B.A. LL.B. (5-Year Integrated Corporate & Constitutional Law via CLAT)',
        'B.Des (UI/UX, Product, Communication, Animation or Fashion Design via NID/UCEED)',
        'B.A. (Honours) in Psychology, Economics, Political Science, English, or International Relations',
        'BMM / BJMC (Digital Media, Journalism & Mass Communication)',
      ],
      higherStudiesLater: [
        'UPSC Civil Services (IAS, IPS, IFS) — Humanities subjects cover 70%+ of UPSC GS syllabus!',
        'MBA (IIMs actively give academic diversity bonus points to Humanities & Non-Engineering students!)',
        'M.A. / M.Sc Clinical Psychology (RCI License), LL.M., or Master of Public Policy (MPP)',
      ],
      majorEntranceExams: ['CLAT / AILET (Law)', 'NID DAT / UCEED (Design)', 'CUET-UG (DU / JNU / TISS / BHU)', 'IPMAT (IIM Management)'],
    },
    careerAndSalary: [
      {
        role: 'Corporate Lawyer / Legal Counsel (NLU)',
        degreePath: '12th Arts → 5-Yr B.A. LL.B. (via CLAT)',
        entrySalary: '₹8 – ₹18 LPA',
        experiencedSalary: '₹24 – ₹55+ LPA',
        sectorType: 'Creative & Legal',
      },
      {
        role: 'UI/UX & Digital Product Designer',
        degreePath: '12th Any Stream → B.Des (UCEED/NID) or Design Portfolio',
        entrySalary: '₹6.5 – ₹15 LPA',
        experiencedSalary: '₹20 – ₹45 LPA',
        sectorType: 'Private & Tech',
      },
      {
        role: 'IAS / IPS / State Civil Services Officer',
        degreePath: '12th Arts → B.A. → UPSC CSE / State PSC',
        entrySalary: '₹9 – ₹14 LPA (Pay Level 10 + Perks)',
        experiencedSalary: 'Senior Govt Leadership',
        sectorType: 'Government & Public',
      },
      {
        role: 'Clinical / Organizational Psychologist & Media Strategist',
        degreePath: '12th Arts → B.A. Psychology / Media → M.A. / MBA',
        entrySalary: '₹5 – ₹11 LPA',
        experiencedSalary: '₹15 – ₹32 LPA',
        sectorType: 'Healthcare',
      },
    ],
    skillsToDevelop: {
      startNow: ['Reading newspapers editorials', 'Clear essay writing & public speaking', 'Creative sketching or Figma basics (for Design)'],
      coreSkills: ['Critical Reading & Research', 'Legal / Policy Reasoning or Visual Design', 'Structured Writing'],
      softSkills: ['Empathy & Active Listening', 'Public Speaking & Debate', 'Social Awareness'],
    },
    stepByStepRoadmap: [
      {
        phase: 'Class 11',
        title: 'Explore Core Humanities & Identify Your Track (Law / Design / UPSC / Psych)',
        actions: 'Build strong reading habits in Polity, History, Economics, or Psychology and participate in debates or design projects.',
      },
      {
        phase: 'Class 12',
        title: 'Prepare for CLAT (Law), UCEED/NID (Design), or CUET-UG (Top Universities)',
        actions: 'CLAT and UCEED are taken right alongside Class 12! Solving reading comprehension and reasoning papers early gives a huge advantage.',
      },
      {
        phase: 'Undergraduate (3–5 Years)',
        title: 'Intern at Law Firms, Design Studios, Media Houses, Policy Think-Tanks, or Clinics',
        actions: 'Build real case experience, a Figma UX portfolio, or start structured NCERT+Standard Book UPSC notes.',
      },
      {
        phase: 'Launch Career or Competitive Exam',
        title: 'Law Firm / Tech Design Job, UPSC Attempt, Clinical License, or MBA',
        actions: 'Enter corporate law, UX design, journalism, clinical practice, MBA, or public administration.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Magnet Brains (Humanities Class 11 & 12)',
        bestFor: 'Complete chapter-by-chapter History, Political Science, Geography & Sociology',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@MagnetBrainsEducation',
      },
      {
        name: 'StudyIQ IAS / Mrunal Patel',
        bestFor: 'Current Affairs, Indian Polity, Economy & UPSC/Public Policy foundation',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@StudyIQIAS',
      },
      {
        name: 'LegalEdge by Toprankers',
        bestFor: 'CLAT & Law career guidance after 10th and 12th',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@LegalEdgeTutorials',
      },
    ],
    notesAndResources: [
      {
        title: 'NCERT History, Polity, Geography, Sociology & Psychology PDFs',
        type: 'Official Textbooks',
        description: 'Essential foundation for Class 11–12 Boards, CUET-UG, and UPSC Civil Services.',
        url: 'https://ncert.nic.in/textbook.php',
      },
      {
        title: 'National Digital Library of India (NDLI — IIT Kharagpur)',
        type: 'Free Notes & PDFs',
        description: 'Millions of free books, humanities lectures, law primers, and past exam papers.',
        url: 'https://ndl.iitkgp.ac.in/',
      },
    ],
  },

  {
    id: '10th-polytechnic-iti',
    stage: 'after_10th',
    title: 'Polytechnic Diploma (3 Years) & ITI Practical Skill Trades',
    shortTagline: 'Hands-on technical route right after 10th — get a job at age 18–19 OR jump directly into 2nd Year B.Tech!',
    simpleExplanation:
      'If you prefer practical workshop/lab learning over heavy 11th–12th board theory—or want an affordable, job-ready technical qualification sooner—a 3-Year Government/AICTE Polytechnic Diploma lets you either start earning as a Junior Engineer (Railways, SSC-JE, Tata, L&T) OR enter directly into 2nd Year B.Tech via Lateral Entry!',
    whoShouldChoose: [
      'Students who love practical machines, computers, electrical wiring, solar panels, EVs, or civil construction.',
      'Students looking for a low-fee, job-oriented technical path right after Class 10.',
      'Students worried about JEE pressure who still want to earn a full B.Tech degree via Diploma Lateral Entry!',
    ],
    subjectsStudied: [
      'Diploma Computer Science / IT (Coding, Web, Networking, Databases)',
      'Diploma Mechanical / Automobile / EV / CNC Automation',
      'Diploma Electrical, Electronics & Solar Renewable Energy',
      'Diploma Civil Engineering (CAD, Surveying, Construction)',
    ],
    whatComesNext: {
      immediateNextStep: [
        'Direct 2nd-Year B.Tech / B.E. Admission (Lateral Entry via DCET / LEET)',
        'Government Junior Engineer Exams (SSC-JE, RRB Railway JE, State PWD/Electricity Board)',
        'Private Industry Technician / Supervisor (Tata Motors, L&T, Bosch, Mahindra, Infosys Diploma Roles)',
      ],
      higherStudiesLater: [
        'Complete B.Tech (3 Years after Diploma) → Eligible for M.Tech, MBA, PSU & Software Engineer roles!',
        'AMIE / Work-Integrated B.Tech while earning a salary',
      ],
      majorEntranceExams: ['State Polytechnic CET (DCET / JEECUP / JEXPO / POLYCET)', 'NCVET ITI Merit Admission'],
    },
    careerAndSalary: [
      {
        role: 'Lateral-Entry B.Tech Software / Core Engineer',
        degreePath: '10th → 3-Yr Diploma → 3-Yr B.Tech',
        entrySalary: '₹5 – ₹14 LPA',
        experiencedSalary: '₹16 – ₹38 LPA',
        sectorType: 'Private & Tech',
      },
      {
        role: 'SSC / Railway / State Govt Junior Engineer (JE)',
        degreePath: '10th → 3-Yr Polytechnic Diploma → SSC-JE / RRB-JE',
        entrySalary: '₹5.5 – ₹8.5 LPA (Govt Job)',
        experiencedSalary: '₹12 – ₹20 LPA + Pension/Perks',
        sectorType: 'Government & Public',
      },
      {
        role: 'EV, Solar PV & CNC Automation Specialist',
        degreePath: '10th → Diploma / ITI + Skill Certification',
        entrySalary: '₹3.2 – ₹6.0 LPA',
        experiencedSalary: '₹8 – ₹16 LPA',
        sectorType: 'Core Industry',
      },
    ],
    skillsToDevelop: {
      startNow: ['Basic Class 10 Maths & Science', 'Curiosity about how gadgets, motors, or computers work'],
      coreSkills: ['AutoCAD / Workshop Tools / Practical Coding', 'Electrical & Hardware Troubleshooting', 'Industrial Safety'],
      softSkills: ['Teamwork on Shopfloor/Projects', 'Discipline & Punctuality', 'Practical Problem Solving'],
    },
    stepByStepRoadmap: [
      {
        phase: 'After 10th Admission',
        title: 'Apply for Government / Aided Polytechnic Diploma or ITI',
        actions: 'Government polytechnics have very low annual fees (often ₹5,000–₹15,000/year) and strong workshop labs.',
      },
      {
        phase: 'Diploma Years 1–3',
        title: 'Focus on Lab Skills, CAD/Coding & Final-Year Industrial Project',
        actions: 'Build a working project and complete a 4–6 week industrial apprenticeship.',
      },
      {
        phase: 'Decision Point at Age 18–19',
        title: 'Choose Direct Job (SSC-JE / Industry) OR Lateral Entry 2nd-Yr B.Tech',
        actions: 'Write your state Lateral Entry CET (like DCET/LEET) to join top engineering colleges directly in 2nd year!',
      },
      {
        phase: 'Long-Term Growth',
        title: 'Senior Engineer, Project Manager, or Technical Entrepreneur',
        actions: 'Combine hands-on diploma skills with degree/management credentials for rapid career growth.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Gate Smashers (CS/IT Fundamentals)',
        bestFor: 'Easy Hindi+English explanations of Computer Networks, DBMS, OS & Coding',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@GateSmashers',
      },
      {
        name: 'ITI Study / Global iTi',
        bestFor: 'NCVET ITI Electrician, Fitter, Solar & Apprentice exam preparation',
        language: 'Hindi',
        url: 'https://www.youtube.com/@GlobaliTi',
      },
      {
        name: 'Learn Engineering (Lesics)',
        bestFor: '3D animated videos explaining how motors, EVs, turbines, and electronics actually work',
        language: 'English & Hindi',
        url: 'https://www.youtube.com/@Lesics',
      },
    ],
    notesAndResources: [
      {
        title: 'Bharat Skills Portal (Official Govt ITI & Polytechnic PDFs)',
        type: 'Official Textbooks',
        description: 'Free e-books, mock tests, and trade practical manuals from Directorate General of Training (DGT).',
        url: 'https://bharatskills.gov.in/',
      },
      {
        title: 'AICTE e-Kumbh Portal (Free Engineering & Diploma Books in Indian Languages)',
        type: 'Free Notes & PDFs',
        description: 'Official AICTE technical textbooks in English, Hindi, Kannada, Tamil, and Telugu.',
        url: 'https://ekumbh.aicte-india.org/',
      },
    ],
  },

  // ==================== AFTER 12TH GUIDES ====================
  {
    id: '12th-btech-computing',
    stage: 'after_12th',
    title: 'B.Tech Engineering, BCA & Computer Science Degrees',
    shortTagline: 'Compare CSE, AI/ML, Data Science, ECE, Mechanical, Civil & BCA — and what comes after graduation.',
    simpleExplanation:
      'After 12th PCM (or Commerce/Any stream for BCA in many colleges), technical degrees train you to build software, AI systems, semiconductors, electric vehicles, or smart infrastructure. Even if you take Mechanical, Civil, or BCA, you can enter IT/AI or pursue MBA/M.Tech later!',
    whoShouldChoose: [
      '12th PCM students aiming for B.Tech / B.E., or 12th students from any stream aiming for BCA / B.Sc IT.',
      'Students looking for high campus-placement demand and global remote/tech opportunities.',
    ],
    subjectsStudied: [
      'Programming (Python, C++, Java, JavaScript)',
      'Data Structures & Algorithms (DSA), Databases (SQL) & Operating Systems',
      'AI, Machine Learning, Cloud Computing & Cybersecurity (in CS/IT tracks)',
      'VLSI, Robotics, Power Systems, CAD, or Structural Design (in Core branches)',
    ],
    whatComesNext: {
      immediateNextStep: [
        'B.Tech CSE / AI & Data Science / Information Science (4 Years)',
        'B.Tech ECE / EEE / Mechanical / Civil / Aerospace (4 Years)',
        'BCA or B.Sc Computer Science (3–4 Years)',
      ],
      higherStudiesLater: [
        'Direct High-Paying Tech/Core Placement right after 4th year',
        'MBA (Product, Finance, Consulting via CAT/GMAT)',
        'M.Tech at IITs/IISc (via GATE) or MS in CS/Robotics Abroad',
      ],
      majorEntranceExams: ['JEE Main & Advanced', 'KCET / MHT-CET / COMEDK / WBJEE / TNEA', 'CUET-UG (BCA / B.Sc CS)'],
    },
    careerAndSalary: [
      {
        role: 'Full-Stack Software / Cloud Engineer',
        degreePath: 'B.Tech / BCA + Strong DSA & Projects',
        entrySalary: '₹6 – ₹20 LPA',
        experiencedSalary: '₹22 – ₹55+ LPA',
        sectorType: 'Private & Tech',
      },
      {
        role: 'Data Scientist / AI Engineer',
        degreePath: 'B.Tech AI/CS/Stats or M.Tech',
        entrySalary: '₹8 – ₹22 LPA',
        experiencedSalary: '₹25 – ₹60+ LPA',
        sectorType: 'Private & Tech',
      },
      {
        role: 'Semiconductor VLSI / Embedded & EV Engineer',
        degreePath: 'B.Tech ECE / EEE / Mechanical',
        entrySalary: '₹6.5 – ₹18 LPA',
        experiencedSalary: '₹20 – ₹48 LPA',
        sectorType: 'Core Industry',
      },
    ],
    skillsToDevelop: {
      startNow: ['Learn 1 language well (Python or C++/Java)', 'Build small real websites or mini-projects'],
      coreSkills: ['Data Structures & Algorithms', 'SQL & Git/GitHub', 'Domain Specialization (Web / AI / VLSI / CAD)'],
      softSkills: ['Problem Decomposition', 'Technical Interview Communication', 'Team Collaboration'],
    },
    stepByStepRoadmap: [
      {
        phase: 'Year 1',
        title: 'Learn Programming Basics (C++/Python) & Explore Clubs',
        actions: 'Maintain 7.5+ CGPA and build your first 2 simple projects on GitHub.',
      },
      {
        phase: 'Year 2',
        title: 'Master Data Structures (DSA) & Core Branch Fundamentals',
        actions: 'Practice 150–250 quality coding problems or CAD/Embedded lab designs; participate in hackathons.',
      },
      {
        phase: 'Year 3',
        title: 'Summer Internship + Specialization (AI / Cloud / VLSI) or GATE/CAT Prep',
        actions: 'Apply for internships early and decide whether you want immediate placement, M.Tech, or MBA.',
      },
      {
        phase: 'Year 4',
        title: 'Campus & Off-Campus Placements / Higher Study Admissions',
        actions: 'Convert internships to full-time offers or join top PG programs.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Apna College (Shradha Khapra)',
        bestFor: 'Beginner-friendly C++, Java, DSA, Web Development & B.Tech roadmap',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@ApnaCollegeOfficial',
      },
      {
        name: 'take U forward (Striver)',
        bestFor: 'Best structured A2Z Data Structures & Algorithms sheet for placements',
        language: 'English',
        url: 'https://www.youtube.com/@takeUforward',
      },
      {
        name: 'Gate Smashers & Neso Academy',
        bestFor: 'B.Tech semester exams (DBMS, OS, CN, Digital Electronics) & GATE',
        language: 'Hindi + English / English',
        url: 'https://www.youtube.com/@nesoacademy',
      },
      {
        name: 'freeCodeCamp.org / CS50 (Harvard)',
        bestFor: 'World-class full courses on Python, Web Dev, AI & Computer Science',
        language: 'English',
        url: 'https://www.youtube.com/@freecodecamp',
      },
    ],
    notesAndResources: [
      {
        title: 'NPTEL Official Portal (IIT Video Lectures & Free Course Notes)',
        type: 'Free Online Courses',
        description: 'Free downloadable PDF transcripts and IIT lectures across CSE, ECE, Mech, Civil & AI.',
        url: 'https://nptel.ac.in/',
      },
      {
        title: 'Striver A2Z DSA & CS Core Notes / GeeksforGeeks',
        type: 'Free Notes & PDFs',
        description: 'Structured topic-wise notes and practice sheets for coding & CS subjects.',
        url: 'https://takeuforward.org/',
      },
      {
        title: 'roadmap.sh (Interactive Tech Career Roadmaps)',
        type: 'Free Notes & PDFs',
        description: 'Step-by-step skill checklists for Frontend, Backend, AI, DevOps, and Cybersecurity.',
        url: 'https://roadmap.sh/',
      },
    ],
  },

  {
    id: '12th-medical-commerce-law-design',
    stage: 'after_12th',
    title: 'Medical, Commerce, Management (BBA/CA), Law & Design Degrees',
    shortTagline: 'High-growth non-engineering degrees after 12th: MBBS, Nursing, B.Com/BBA, CA, 5-Yr Law & B.Des.',
    simpleExplanation:
      'Not doing B.Tech? You have tremendous career options! Healthcare (MBBS, Nursing, Pharma), Finance & Management (BBA, B.Com Hons, CA, IPMAT), Corporate Law (B.A. LL.B.), and UI/UX Product Design (B.Des) offer top salaries and leadership growth.',
    whoShouldChoose: [
      '12th PCB, Commerce, Arts, or PCM students looking for clear non-engineering professional degrees.',
      'Students aiming for Healthcare, Finance/CA, Management, Law, Civil Services, or Creative Tech.',
    ],
    subjectsStudied: [
      'Clinical Sciences, Anatomy, Pharmacology, or Genetics (Medical/Allied)',
      'Corporate Accounting, Taxation, Financial Markets & Marketing (B.Com/BBA/CA)',
      'Constitutional Law, Contract Law, IP Law, or Interaction Design (Law/Design)',
    ],
    whatComesNext: {
      immediateNextStep: [
        'MBBS / BDS / B.Sc Nursing / B.Pharm / BPT',
        'B.Com (Hons) / BBA / BMS / Integrated 5-Yr MBA (IPMAT) / CA',
        '5-Year B.A. LL.B. / BBA LL.B. or 4-Year B.Des (UI/UX & Product Design)',
      ],
      higherStudiesLater: [
        'MBA at IIMs / ISB (CAT / GMAT)',
        'MD / MS / MPH / M.Pharm (Healthcare PG)',
        'UPSC Civil Services, Judiciary, RBI Grade B, or CFA Charter',
      ],
      majorEntranceExams: ['NEET-UG', 'CUET-UG', 'IPMAT', 'CLAT', 'NID / UCEED', 'CA Foundation'],
    },
    careerAndSalary: [
      {
        role: 'Management Consultant / Brand & Product Manager',
        degreePath: 'BBA / B.Com / B.A. → MBA',
        entrySalary: '₹10 – ₹26 LPA',
        experiencedSalary: '₹28 – ₹60+ LPA',
        sectorType: 'Finance & Corporate',
      },
      {
        role: 'Doctor / Pharmacist / Nursing Specialist',
        degreePath: 'MBBS / B.Pharm / B.Sc Nursing',
        entrySalary: '₹5.5 – ₹14 LPA',
        experiencedSalary: '₹18 – ₹50+ LPA',
        sectorType: 'Healthcare',
      },
      {
        role: 'Corporate Lawyer or Senior UX Product Designer',
        degreePath: 'B.A. LL.B. (NLU) or B.Des',
        entrySalary: '₹7 – ₹18 LPA',
        experiencedSalary: '₹22 – ₹50+ LPA',
        sectorType: 'Creative & Legal',
      },
    ],
    skillsToDevelop: {
      startNow: ['Strong communication & reading comprehension', 'Spreadsheet/data literacy or domain portfolio'],
      coreSkills: ['Financial Analysis / Clinical Knowledge / Legal Drafting / Figma UX'],
      softSkills: ['Client & Stakeholder Communication', 'Critical Thinking', 'Ethical Judgment'],
    },
    stepByStepRoadmap: [
      {
        phase: 'Entrance & College Selection',
        title: 'Target Top Public/Private Colleges via CUET, NEET, CLAT, IPMAT or UCEED',
        actions: 'Good college peer groups and internships dramatically boost starting packages.',
      },
      {
        phase: 'Degree Years 1–2',
        title: 'Build Domain Credentials & Practical Exposure',
        actions: 'Clear CA Inter / CFA L1, build a Figma portfolio, moot court, or clinical internships.',
      },
      {
        phase: 'Final Year',
        title: 'Campus Placements + CAT / NEET-PG / UPSC Preparation',
        actions: 'Convert corporate/hospital placements or enter premier postgraduate institutes.',
      },
      {
        phase: 'Long-Term Career',
        title: 'Partner, Specialist Doctor, VP Finance, Design Lead, or Civil Servant',
        actions: 'Grow into leadership or independent practice.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Rodha (Ravi Prakash) / MBA Wallah',
        bestFor: 'Free top-quality Quantitative Aptitude & Logical Reasoning for IPMAT & CAT (MBA)',
        language: 'English + Hindi',
        url: 'https://www.youtube.com/@Rodha',
      },
      {
        name: 'DesignPilot / Ansh Mehra',
        bestFor: 'UI/UX Design, Figma tutorials & Product Design careers in India',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@AnshMehraUX',
      },
      {
        name: 'Finology Legal / Priya Jain',
        bestFor: 'Indian Law concepts, CLAT & Judiciary explained simply',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@FinologyLegal',
      },
    ],
    notesAndResources: [
      {
        title: 'SWAYAM Central (Free Govt Certificates from IIMs, NLUs & AIIMS)',
        type: 'Free Online Courses',
        description: 'Free courses in Management, Law, Psychology, Finance, and Healthcare.',
        url: 'https://swayam.gov.in/',
      },
      {
        title: 'e-PG Pathshala (UGC Official University Notes)',
        type: 'Free Notes & PDFs',
        description: '20,000+ free downloadable PDF modules for Commerce, Arts, Law, Economics & Sciences.',
        url: 'https://epgp.inflibnet.ac.in/',
      },
    ],
  },

  // ==================== UNDERGRADUATE & GRADUATE GUIDES ====================
  {
    id: 'ug-what-next-job-mba-mtech',
    stage: 'undergraduate',
    title: 'In College Now: Job Placement vs. MBA vs. M.Tech / MS vs. Govt Exams',
    shortTagline: 'Clear comparison for B.Tech, B.Com, B.Sc, BCA & B.A. students wondering what to focus on before graduation.',
    simpleExplanation:
      'College students often get stuck trying to prepare for placements, CAT (MBA), GATE (M.Tech/PSU), and UPSC all at once. This guide helps you pick ONE clear primary track plus a smart backup based on your strengths.',
    whoShouldChoose: [
      '1st to 4th year B.Tech, BCA, B.Sc, B.Com, BBA, or B.A. students planning their career launch.',
    ],
    subjectsStudied: [
      'Track A (Tech Placement): DSA, SQL, Full-Stack / AI / Cloud / Core Branch Projects',
      'Track B (MBA — CAT/XAT/GMAT): Quant, Data Interpretation & Logical Reasoning (DILR), Verbal (VARC)',
      'Track C (M.Tech / PSU — GATE): Core Engineering / CS Subjects + Engineering Maths',
      'Track D (UPSC / Banking / SSC): Polity, Economy, History, Reasoning & Current Affairs',
    ],
    whatComesNext: {
      immediateNextStep: [
        'Campus / Off-Campus Industry Role (₹5 – ₹24 LPA) to gain 1–2 years work experience',
        'Direct Admission to IIMs / Top MBA Colleges (CAT) or IIT M.Tech / PSU Officer (GATE)',
      ],
      higherStudiesLater: [
        'Executive / Global MBA after 2–3 years of work experience (ISB, IIMs, Abroad)',
        'MS / Ph.D. Research Fellowship (PMRF / Foreign Universities)',
      ],
      majorEntranceExams: ['CAT / XAT / GMAT', 'GATE', 'GRE / IELTS / TOEFL', 'UPSC CSE / SSC CGL / RBI Grade B'],
    },
    careerAndSalary: [
      {
        role: 'Software / Data / Core Engineer (Direct Placement)',
        degreePath: 'UG Degree + Internships & Portfolio',
        entrySalary: '₹6 – ₹20 LPA',
        experiencedSalary: '₹22 – ₹50+ LPA',
        sectorType: 'Private & Tech',
      },
      {
        role: 'MBA Product Manager / Strategy Consultant / Finance Associate',
        degreePath: 'Any UG Degree → CAT/GMAT → Top MBA',
        entrySalary: '₹15 – ₹32 LPA',
        experiencedSalary: '₹35 – ₹75+ LPA',
        sectorType: 'Finance & Corporate',
      },
      {
        role: 'IIT M.Tech Specialist (VLSI / AI) or PSU Officer (ONGC/NTPC/ISRO)',
        degreePath: 'B.Tech / M.Sc → GATE Top Rank',
        entrySalary: '₹12 – ₹26 LPA',
        experiencedSalary: '₹25 – ₹55 LPA',
        sectorType: 'Core Industry',
      },
    ],
    skillsToDevelop: {
      startNow: ['Build a clean 1-page resume', 'Complete at least 1 real internship', 'Master SQL/Excel or Coding'],
      coreSkills: ['Domain Depth + 2 End-to-End Portfolio Projects', 'Aptitude & Analytical Speed'],
      softSkills: ['Group Discussion & Interview Storytelling', 'LinkedIn Networking'],
    },
    stepByStepRoadmap: [
      {
        phase: 'Pre-Final Year',
        title: 'Lock Your Primary Goal (Job vs. MBA vs. GATE vs. Govt)',
        actions: 'Secure a summer internship; start 90 minutes/day prep for DSA, CAT, or GATE.',
      },
      {
        phase: 'Final Year Sem 7',
        title: 'Appear for Campus Placements + November/February Exams (CAT / GATE)',
        actions: 'Always secure a placement offer in hand if possible—work experience even gives extra points in IIM MBA admissions!',
      },
      {
        phase: 'Final Year Sem 8',
        title: 'Capstone Project, Interviews & Offer Selection',
        actions: 'Compare job learning curve vs. top-tier PG admit before deciding.',
      },
      {
        phase: 'First 3 Years Post-UG',
        title: 'Build Deep Industry Credibility',
        actions: 'Transition into senior specialist, product, or leadership roles.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Gate Smashers & Kreatryx / PW GATE',
        bestFor: 'GATE CS/ECE/EE/ME preparation & PSU exam strategies',
        language: 'Hindi + English',
        url: 'https://www.youtube.com/@GateSmashers',
      },
      {
        name: 'Rodha (CAT Quant & DILR)',
        bestFor: 'Complete free CAT MBA preparation from basics to 99+ percentile',
        language: 'English + Hindi',
        url: 'https://www.youtube.com/@Rodha',
      },
      {
        name: 'harkirat singh / Chai aur Code (Hitesh Choudhary)',
        bestFor: 'Modern Web Development, JavaScript, Python, DevOps & Open Source jobs',
        language: 'English / Hindi',
        url: 'https://www.youtube.com/@chaiaurcode',
      },
    ],
    notesAndResources: [
      {
        title: 'NPTEL GATE Preparation Portal (Free IIT Video Solutions & Past Papers)',
        type: 'Practice & Mock Tests',
        description: 'Official IIT initiative solving past GATE questions with concept links.',
        url: 'https://gate.nptel.ac.in/',
      },
      {
        title: '2IIM Free CAT Question Bank & Concept Notes',
        type: 'Practice & Mock Tests',
        description: 'Previous year CAT papers and topic-wise Quant, DILR & VARC explanations.',
        url: 'https://questions.2iim.com/',
      },
    ],
  },

  {
    id: 'grad-career-switch-upskill',
    stage: 'graduate',
    title: 'Graduated: Job Hunting, Career Switch (Tech/Data/Management) & Higher Studies',
    shortTagline: 'Practical action plan for fresh graduates looking for high-paying jobs, domain switches, or specialization.',
    simpleExplanation:
      'Already graduated and unsure of your next move—or stuck in a role you do not enjoy? You do not need another 4-year degree to pivot. Targeted 4–6 month skill portfolios (Data Analytics, Full-Stack, UI/UX, Digital Finance) or structured PG programs (MBA, M.Tech, UPSC/RBI) create clear breakthroughs.',
    whoShouldChoose: [
      'Recent graduates seeking their first strong job offer.',
      'Graduates from Commerce, Science, Arts, or Core Engineering switching into Data, Product, Finance, or Public Service.',
    ],
    subjectsStudied: [
      'Data Analytics Switch: SQL, Python, Excel, PowerBI/Tableau & Business Statistics',
      'Software / AI Switch: JavaScript/TypeScript, React, Node.js, Applied GenAI & APIs',
      'Management / Finance Switch: Financial Modeling, Product Metrics, CAT/GMAT',
      'Public / Research Track: UPSC / State PSC / CSIR-NET / Ph.D.',
    ],
    whatComesNext: {
      immediateNextStep: [
        '6-Month Portfolio + Direct Industry Roles (Data Analyst, SDE, UX Designer, Financial Analyst)',
        '1–2 Year MBA / M.Tech / Master of Public Policy / Clinical PG',
      ],
      higherStudiesLater: [
        'Senior Architect, Product Director, Principal Scientist, or Civil Administrator',
      ],
      majorEntranceExams: ['Direct Skill/Portfolio Interviews', 'CAT / GMAT', 'GATE / CSIR-NET', 'UPSC / RBI Grade B'],
    },
    careerAndSalary: [
      {
        role: 'Data Analyst / Business Intelligence Specialist',
        degreePath: 'Any Graduate + SQL, Python & PowerBI Portfolio',
        entrySalary: '₹5.5 – ₹12 LPA',
        experiencedSalary: '₹16 – ₹35 LPA',
        sectorType: 'Private & Tech',
      },
      {
        role: 'Product Manager / Strategy & Operations Lead',
        degreePath: 'Graduate + Work Exp / MBA',
        entrySalary: '₹12 – ₹28 LPA',
        experiencedSalary: '₹32 – ₹65+ LPA',
        sectorType: 'Finance & Corporate',
      },
      {
        role: 'Research Scientist / Assistant Professor',
        degreePath: 'Postgrad + GATE / CSIR-UGC NET / Ph.D.',
        entrySalary: '₹8 – ₹16 LPA',
        experiencedSalary: '₹18 – ₹36 LPA',
        sectorType: 'Government & Public',
      },
    ],
    skillsToDevelop: {
      startNow: ['Pick ONE target role instead of applying randomly everywhere', 'Build 3 proof-of-work case studies/projects'],
      coreSkills: ['Role-Specific Tooling (SQL/Python, Full-Stack, Figma, or Financial Modeling)'],
      softSkills: ['Cold Outreach & Referrals', 'Case-Study Presentation'],
    },
    stepByStepRoadmap: [
      {
        phase: 'Month 1–2',
        title: 'Master Core Tools for One Specific Target Role',
        actions: 'Study daily from structured free courses (NPTEL, freeCodeCamp, CS50) and take notes.',
      },
      {
        phase: 'Month 3–4',
        title: 'Build 3 Real-World Portfolio Projects (Not Toy Clones)',
        actions: 'Publish live demos, dashboards, or financial/design case studies with clear documentation.',
      },
      {
        phase: 'Month 5–6',
        title: 'Targeted Applications, Referrals & Mock Interviews',
        actions: 'Apply with tailored resumes and reach out to alumni/hiring managers with your project links.',
      },
      {
        phase: 'Year 1–3',
        title: 'Scale Into Senior Individual Contributor or Management',
        actions: 'Compound domain expertise or pursue an executive/top-tier MBA.',
      },
    ],
    youtubeChannels: [
      {
        name: 'Codebasics (Dhaval Patel)',
        bestFor: 'Practical Data Analytics, SQL, Python, PowerBI & career transition for any graduate',
        language: 'English & Hindi',
        url: 'https://www.youtube.com/@codebasics',
      },
      {
        name: 'StatQuest with Josh Starmer',
        bestFor: 'Simplest visual explanations of Statistics, Data Science & Machine Learning',
        language: 'English',
        url: 'https://www.youtube.com/@statquest',
      },
      {
        name: 'MIT OpenCourseWare / Stanford Online',
        bestFor: 'Free graduate-level Computer Science, AI, Economics & Management lectures',
        language: 'English',
        url: 'https://www.youtube.com/@mitocw',
      },
    ],
    notesAndResources: [
      {
        title: 'SWAYAM & NPTEL Domain Certification Tracks',
        type: 'Free Online Courses',
        description: 'Structured IIT/IIM specialization tracks in Data Science, Cloud, Finance & Management.',
        url: 'https://nptel.ac.in/domains',
      },
      {
        title: 'Kaggle Learn (Free Hands-On Python, SQL & ML Micro-Courses)',
        type: 'Free Online Courses',
        description: 'Short, interactive browser exercises for building data skills fast.',
        url: 'https://www.kaggle.com/learn',
      },
    ],
  },
];
