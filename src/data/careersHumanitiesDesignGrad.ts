import type { CareerRecord } from '../types/sankalp';

export const CAREERS_HUMANITIES_DESIGN_GRAD: CareerRecord[] = [
  // ==================== LAW, PUBLIC POLICY & HUMANITIES (9) ====================
  {
    id: 'corporate-lawyer',
    title: 'Corporate, Technology & Constitutional Legal Counsel (B.A. LL.B.)',
    titleHi: 'कॉर्पोरेट, टेक्नोलॉजी और संवैधानिक वकील (LL.B.)',
    titleKn: 'ಕಾರ್ಪೊರೇಟ್ ಮತ್ತು ಸಾಂವಿಧಾನಿಕ ವಕೀಲರು (LL.B.)',
    sectorId: 'law_policy',
    sectorName: 'Law, Governance & Public Policy',
    applicableLevels: ['after_10th', 'after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Commerce', 'Science'],
    minAcademicScore: 50,
    requiredSubjects: ['English', 'Political Science', 'History', 'Economics'],
    requiredSkills: ['Contract Drafting & M&A Law', 'Constitutional & Tech Privacy Law (DPDP)', 'Legal Research & Moot Advocacy', 'Arbitration', 'Regulatory Compliance'],
    personalityTraits: ['articulate', 'logical', 'persuasive', 'principled'],
    riasecProfile: { R: 0.15, I: 0.82, A: 0.45, S: 0.68, E: 0.92, C: 0.78 },
    keywords: ['clat', 'nlu', 'corporate lawyer', 'llb', 'litigation', 'intellectual property', 'tech privacy law'],
    workEnvironment: 'Tier-1 corporate law firms, High Courts & Supreme Court, tech general counsel teams',
    educationRequired: '5-Year Integrated B.A./BBA LL.B. (after 12th) or 3-Year LL.B. (after Graduation)',
    entranceExams: ['CLAT', 'AILET (NLU Delhi)', 'MH-CET Law', 'NLSAT (3-Year LLB)'],
    salaryRange: { entryLPA: '₹6.5 – ₹16.0 LPA', midLPA: '₹18.0 – ₹38.0 LPA', seniorLPA: '₹45.0 – ₹100.0 LPA', medianNumericLPA: 18.5 },
    jobOutlook: { demand: 'Very High', growthRateYoY: 13.4, remoteOpportunities: 'Moderate', topCompanies: ['Shardul Amarchand Mangaldas', 'Cyril Amarchand', 'AZB & Partners', 'Khaitan & Co', 'Trilegal'] },
    pathwaySteps: [
      { stage: 'After 12th / Grad', qualification: '5-Year B.A. LL.B. (CLAT) or 3-Year LL.B.', duration: '3–5 Years', keyFocus: 'Contracts, Corporate Law, IPR, Moot Courts' },
      { stage: 'Bar & Practice', qualification: 'AIBE Bar Enrollment + Law Firm / Chambers', duration: '2 Years', keyFocus: 'M&A Deal Diligence, Arbitration & AI/Data Law' },
      { stage: 'Career Growth', qualification: 'Equity Partner / Senior Advocate / General Counsel', duration: 'Ongoing', keyFocus: 'High-Stakes Corporate & Constitutional Law' }
    ],
    bridgePathway: 'Graduates from Engineering, Commerce, or Arts can enter top law schools via 3-Year LL.B. (NLSAT / CUET-PG Law).',
    recommendedCourses: [
      { title: 'Intellectual Property Rights and Competition Law (IIT Kharagpur)', provider: 'NPTEL', duration: '8 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Constitutional & Tech Privacy Law (DPDP)' }
    ],
    alternativeCareerIds: ['civil-services-officer', 'economic-policy-researcher', 'tax-audit-consultant'],
    description: 'Advises corporations on mergers, intellectual property, AI/data regulation, and argues constitutional and commercial disputes.'
  },
  {
    id: 'civil-services-officer',
    title: 'Civil Services & Public Governance Administrator (IAS / IFS / State PSC)',
    titleHi: 'सिविल सेवा और लोक प्रशासन अधिकारी (IAS / KAS)',
    titleKn: 'ನಾಗರಿಕ ಸೇವೆಗಳು ಮತ್ತು ಸಾರ್ವಜನಿಕ ಆಡಳಿತ ಅಧಿಕಾರಿ (IAS / KAS)',
    sectorId: 'law_policy',
    sectorName: 'Law, Governance & Public Policy',
    applicableLevels: ['after_10th', 'after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Science', 'Commerce', 'Engineering'],
    minAcademicScore: 50,
    requiredSubjects: ['Political Science', 'History', 'Economics', 'Geography'],
    requiredSkills: ['Public Policy Execution', 'Indian Polity & Constitution', 'Development Economics', 'Ethical Decision-Making', 'Crisis District Leadership'],
    personalityTraits: ['public_spirited', 'resilient', 'ethical', 'decisive'],
    riasecProfile: { R: 0.35, I: 0.80, A: 0.35, S: 0.90, E: 0.92, C: 0.80 },
    keywords: ['upsc', 'ias', 'ips', 'ifs', 'kas state psc', 'public administration', 'district collector'],
    workEnvironment: 'District Collectorates, Union & State Ministries, Embassies, Regulatory Authorities',
    educationRequired: 'Bachelor’s Degree in any discipline from a recognized university',
    entranceExams: ['UPSC Civil Services Examination (CSE)', 'State PSC (KAS / UPPSC / MPSC / BPSC)'],
    salaryRange: { entryLPA: '₹10.0 – ₹14.5 LPA (7th CPC Level-10 + Official Infrastructure)', midLPA: '₹16.0 – ₹24.0 LPA', seniorLPA: '₹28.0 – ₹36.0 LPA', medianNumericLPA: 16.0 },
    jobOutlook: { demand: 'Stable', growthRateYoY: 6.5, remoteOpportunities: 'Low', topCompanies: ['Government of India (IAS/IFS/IPS/IRS)', 'State Governments', 'NITI Aayog', 'UN Agencies'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.A. (Pol Sci/Eco/History) or any Bachelor’s Degree', duration: '3–4 Years', keyFocus: 'NCERT Mastery, Optional Subject Depth, Answer Writing' },
      { stage: 'Selection & LBSNAA', qualification: 'UPSC CSE / State PSC + Foundation Training', duration: '1–2 Years', keyFocus: 'District Governance, Welfare Delivery, Law & Order' },
      { stage: 'Plan-B Parallel', qualification: 'Master of Public Policy / RBI Grade B / State Services', duration: 'Parallel', keyFocus: 'Zero-Gap Policy Career Security' }
    ],
    bridgePathway: 'Always pair UPSC preparation with an actionable Plan-B in Public Policy, Law, Economics, or RBI/NABARD.',
    recommendedCourses: [
      { title: 'Public Policy and Governance in India', provider: 'SWAYAM', duration: '12 Weeks', url: 'https://swayam.gov.in', skillCovered: 'Public Policy Execution' }
    ],
    alternativeCareerIds: ['economic-policy-researcher', 'banking-credit-officer', 'ngo-social-director'],
    description: 'Leads district administration, national welfare implementation, diplomacy, and ministerial policy formulation.'
  },
  {
    id: 'economic-policy-researcher',
    title: 'Development Economist & Public Policy Quantitative Researcher',
    titleHi: 'विकास अर्थशास्त्री और लोक नीति शोधकर्ता',
    titleKn: 'ಅಭಿವೃದ್ಧಿ ಅರ್ಥಶಾಸ್ತ್ರಜ್ಞ ಮತ್ತು ಸಾರ್ವಜನಿಕ ನೀತಿ ಸಂಶೋಧಕ',
    sectorId: 'law_policy',
    sectorName: 'Law, Governance & Public Policy',
    applicableLevels: ['after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Commerce', 'Science'],
    minAcademicScore: 60,
    requiredSubjects: ['Economics', 'Mathematics', 'Statistics'],
    requiredSkills: ['Econometrics (Stata / R / Python)', 'Randomized Control Trials (RCTs)', 'Macroeconomic Policy Modeling', 'Fiscal Budget Analysis', 'Policy Brief Writing'],
    personalityTraits: ['analytical', 'curious', 'socially_conscious', 'rigorous'],
    riasecProfile: { R: 0.20, I: 0.94, A: 0.42, S: 0.76, E: 0.58, C: 0.76 },
    keywords: ['economist', 'ies indian economic service', 'public policy', 'jpal', 'niti aayog', 'dse isi economics'],
    workEnvironment: 'NITI Aayog, RBI DEPR, J-PAL, World Bank, policy think-tanks (NCAER, Takshashila, CPR)',
    educationRequired: 'B.A./B.Sc (Hons) Economics + M.A./M.Sc Economics or Master of Public Policy (MPP)',
    entranceExams: ['CUET-PG (DSE / JNU / IGIDR)', 'IIT GATE XH-C1 (Economics)', 'UPSC IES'],
    salaryRange: { entryLPA: '₹7.0 – ₹15.0 LPA', midLPA: '₹16.0 – ₹30.0 LPA', seniorLPA: '₹32.0 – ₹60.0 LPA', medianNumericLPA: 16.5 },
    jobOutlook: { demand: 'High', growthRateYoY: 13.0, remoteOpportunities: 'Moderate', topCompanies: ['J-PAL South Asia', 'RBI DEPR', 'World Bank India', 'NCAER', 'IDinsight', 'EY Government Advisory'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.A./B.Sc (Hons) Economics', duration: '3–4 Years', keyFocus: 'Micro/Macroeconomics, Econometrics, R/Stata' },
      { stage: 'Postgraduate', qualification: 'M.A. Economics (DSE/IGIDR/IITs) or MPP', duration: '2 Years', keyFocus: 'Causal Impact Evaluation & Fiscal Policy' },
      { stage: 'Career Growth', qualification: 'Lead Economist / Indian Economic Service Officer', duration: 'Ongoing', keyFocus: 'Evidence-Based National Policy' }
    ],
    bridgePathway: 'IITs now admit all graduates into M.Sc Economics & MPP via GATE Humanities & Social Sciences (XH).',
    recommendedCourses: [
      { title: 'Econometric Modeling (IIT Roorkee)', provider: 'NPTEL', duration: '8 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Econometrics (Stata / R / Python)' }
    ],
    alternativeCareerIds: ['civil-services-officer', 'data-scientist', 'public-health-epidemiologist'],
    description: 'Uses causal econometrics and field experiments to evaluate poverty reduction, education, trade, and macroeconomic policies.'
  },
  {
    id: 'digital-journalist',
    title: 'Data Journalist, Broadcast Editor & Multimedia Storyteller',
    titleHi: 'डेटा पत्रकार और डिजिटल मीडिया संपादक',
    titleKn: 'ಡೇಟಾ ಪತ್ರಕರ್ತ ಮತ್ತು ಡಿಜಿಟಲ್ ಮೀಡಿಯಾ ಸಂಪಾದಕ',
    sectorId: 'law_policy',
    sectorName: 'Law, Governance & Public Policy',
    applicableLevels: ['after_10th', 'after_12th', 'undergraduate'],
    eligibleStreams: ['Arts/Humanities', 'Commerce', 'Science'],
    minAcademicScore: 48,
    requiredSubjects: ['English', 'Political Science', 'History'],
    requiredSkills: ['Investigative Reporting', 'Data Visualization & Fact-Checking', 'Podcast & Documentary Scripting', 'Media Ethics & Law', 'Digital Audience Strategy'],
    personalityTraits: ['curious', 'expressive', 'courageous', 'observant'],
    riasecProfile: { R: 0.28, I: 0.72, A: 0.88, S: 0.75, E: 0.68, C: 0.45 },
    keywords: ['journalism', 'bjmc', 'iimc', 'acj', 'mass communication', 'digital media', 'data journalism'],
    workEnvironment: 'Digital newsrooms, business media channels, documentary studios, fact-checking labs',
    educationRequired: 'B.A. Journalism & Mass Communication (BJMC) + PG Diploma (IIMC / ACJ)',
    entranceExams: ['CUET-UG / PG (IIMC)', 'ACJ Entrance'],
    salaryRange: { entryLPA: '₹4.0 – ₹8.0 LPA', midLPA: '₹9.5 – ₹18.0 LPA', seniorLPA: '₹22.0 – ₹45.0 LPA', medianNumericLPA: 9.8 },
    jobOutlook: { demand: 'Growing', growthRateYoY: 9.5, remoteOpportunities: 'High', topCompanies: ['The Hindu', 'Indian Express', 'Scroll / Ken', 'Reuters India', 'NDTV / Network18'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.A. Journalism / Literature / Political Science', duration: '3 Years', keyFocus: 'Reporting, Fact-Checking, Multimedia Production' },
      { stage: 'Specialization', qualification: 'PG Diploma in Digital & Data Journalism (IIMC / ACJ)', duration: '1 Year', keyFocus: 'Public Records Investigation & Data Storytelling' },
      { stage: 'Career Growth', qualification: 'Managing Editor / Documentary Director', duration: 'Ongoing', keyFocus: 'High-Trust Public Interest Media' }
    ],
    bridgePathway: 'Published investigative articles and data-story blogs build immediate newsroom credibility.',
    recommendedCourses: [
      { title: 'Media, Information and Empowerment', provider: 'SWAYAM', duration: '8 Weeks', url: 'https://swayam.gov.in', skillCovered: 'Investigative Reporting' }
    ],
    alternativeCareerIds: ['content-strategist', 'foreign-language-specialist', 'brand-comm-designer'],
    description: 'Investigates public-interest stories, verifies open-source data, and produces incisive text, podcast, and video journalism.'
  },
  {
    id: 'ngo-social-director',
    title: 'CSR Sustainability & Social Development Program Director (MSW)',
    titleHi: 'सीएसआर (CSR) और सामाजिक विकास निदेशक (MSW)',
    titleKn: 'ಸಿಎಸ್‌ಆರ್ ಮತ್ತು ಸಾಮಾಜಿಕ ಅಭಿವೃದ್ಧಿ ನಿರ್ದೇಶಕ (MSW)',
    sectorId: 'law_policy',
    sectorName: 'Law, Governance & Public Policy',
    applicableLevels: ['after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Commerce', 'Science'],
    minAcademicScore: 48,
    requiredSubjects: ['Sociology', 'Economics', 'Psychology'],
    requiredSkills: ['CSR Impact Assessment (SROI)', 'Rural Livelihood Design', 'Grant Writing & M&E', 'Community Mobilization', 'SDG Program Governance'],
    personalityTraits: ['compassionate', 'collaborative', 'mission_driven', 'resilient'],
    riasecProfile: { R: 0.35, I: 0.65, A: 0.42, S: 0.96, E: 0.74, C: 0.60 },
    keywords: ['tiss', 'social work', 'msw', 'csr manager', 'rural development', 'irma', 'ngo leadership'],
    workEnvironment: 'Corporate CSR foundations (Tata Trusts, Azim Premji, Reliance Foundation), UNICEF/UNDP, rural collectives',
    educationRequired: 'BSW / B.A. + M.A. Social Work (TISS) / PGDM Rural Management (IRMA)',
    entranceExams: ['CUET-PG (TISS)', 'CAT / XAT (IRMA)'],
    salaryRange: { entryLPA: '₹5.0 – ₹10.5 LPA (₹14+ LPA from IRMA/TISS CSR)', midLPA: '₹12.0 – ₹22.0 LPA', seniorLPA: '₹25.0 – ₹45.0 LPA', medianNumericLPA: 12.2 },
    jobOutlook: { demand: 'Growing', growthRateYoY: 11.8, remoteOpportunities: 'Low', topCompanies: ['Tata Trusts', 'Azim Premji Foundation', 'Piramal Foundation', 'UNDP India', 'HCLFoundation'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.A. Social Sciences / BSW / Any Degree', duration: '3 Years', keyFocus: 'Sociology, Grassroots Field Internships' },
      { stage: 'Postgraduate', qualification: 'M.A. Social Work / Development Studies (TISS) or IRMA', duration: '2 Years', keyFocus: 'CSR Monitoring & Evaluation, Rural Enterprises' },
      { stage: 'Career Growth', qualification: 'Head of Corporate CSR / Foundation CEO', duration: 'Ongoing', keyFocus: 'Large-Scale Education & Livelihood Transformation' }
    ],
    bridgePathway: 'Grassroots fellowships (Gandhi Fellowship, Teach For India, SBI Youth for India) provide funded hands-on entry.',
    recommendedCourses: [
      { title: 'Corporate Social Responsibility (IIT Kharagpur)', provider: 'NPTEL', duration: '8 Weeks', url: 'https://nptel.ac.in', skillCovered: 'CSR Impact Assessment (SROI)' }
    ],
    alternativeCareerIds: ['public-health-epidemiologist', 'civil-services-officer', 'clinical-psychologist'],
    description: 'Designs and evaluates corporate CSR initiatives, rural women’s livelihood cooperatives, and SDG social impact programs.'
  },
  {
    id: 'content-strategist',
    title: 'Technical Documentation Architect & UX Content Strategist',
    titleHi: 'टेक्निकल राइटर और यूएक्स कंटेंट स्ट्रैटेजिस्ट',
    titleKn: 'ಟೆಕ್ನಿಕಲ್ ರೈಟರ್ ಮತ್ತು ಯುಎಕ್ಸ್ ಕಂಟೆಂಟ್ ಸ್ಟ್ರಾಟೆಜಿಸ್ಟ್',
    sectorId: 'design_media',
    sectorName: 'Design, Architecture & Creative Media',
    applicableLevels: ['undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Computing', 'Science', 'Commerce'],
    minAcademicScore: 50,
    requiredSubjects: ['English', 'Computer Science'],
    requiredSkills: ['Docs-as-Code (Markdown / Git)', 'API Documentation (OpenAPI)', 'UX Microcopy', 'Information Architecture', 'Clear Technical Prose'],
    personalityTraits: ['empathetic', 'clear_thinker', 'detail_oriented', 'curious'],
    riasecProfile: { R: 0.25, I: 0.74, A: 0.84, S: 0.65, E: 0.52, C: 0.72 },
    keywords: ['technical writer', 'ux writer', 'content strategy', 'english literature tech jobs', 'api docs'],
    workEnvironment: 'Global SaaS & cloud developer-experience teams, AI product companies',
    educationRequired: 'B.A. English / Journalism / BCA / B.Tech',
    entranceExams: ['Writing & Documentation Portfolio'],
    salaryRange: { entryLPA: '₹5.0 – ₹10.5 LPA', midLPA: '₹12.0 – ₹24.0 LPA', seniorLPA: '₹26.0 – ₹48.0 LPA', medianNumericLPA: 13.8 },
    jobOutlook: { demand: 'High', growthRateYoY: 12.6, remoteOpportunities: 'High', topCompanies: ['Postman', 'Google', 'Salesforce India', 'Red Hat', 'Atlassian', 'Zoho'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.A. English / Journalism or BCA / B.Tech', duration: '3–4 Years', keyFocus: 'Clear Exposition, Developer Empathy, Git Markdown' },
      { stage: 'Portfolio', qualification: 'Google Season of Docs / Open-Source Guides', duration: '6 Months', keyFocus: 'API Reference & UX Content Systems' },
      { stage: 'Career Growth', qualification: 'Principal Documentation & DX Strategist', duration: 'Ongoing', keyFocus: 'Developer Experience & Information Design' }
    ],
    bridgePathway: 'High-salary tech pathway for English/Humanities students who learn basic Git and REST APIs!',
    recommendedCourses: [
      { title: 'Technical English for Engineers', provider: 'NPTEL', duration: '8 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Clear Technical Prose' }
    ],
    alternativeCareerIds: ['ux-ui-designer', 'digital-journalist', 'tech-product-manager'],
    description: 'Translates complex APIs, AI tools, and enterprise workflows into crystal-clear developer documentation and UX microcopy.'
  },
  {
    id: 'urban-policy-planner',
    title: 'Urban Transit, Smart Cities & Regional Housing Planner',
    titleHi: 'अर्बन प्लानर और स्मार्ट सिटी ट्रांजिट विशेषज्ञ',
    titleKn: 'ನಗರ ಯೋಜನೆ ಮತ್ತು ಸ್ಮಾರ್ಟ್ ಸಿಟಿ ಸಾರಿಗೆ ತಜ್ಞ',
    sectorId: 'law_policy',
    sectorName: 'Law, Governance & Public Policy',
    applicableLevels: ['after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Science', 'Engineering'],
    minAcademicScore: 55,
    requiredSubjects: ['Geography', 'Mathematics', 'Economics'],
    requiredSkills: ['GIS Spatial Urban Modeling', 'Transit-Oriented Development (TOD)', 'Affordable Housing Policy', 'Climate-Resilient Zoning', 'Stakeholder Consultation'],
    personalityTraits: ['visionary', 'analytical', 'civic_minded', 'collaborative'],
    riasecProfile: { R: 0.50, I: 0.82, A: 0.68, S: 0.74, E: 0.60, C: 0.68 },
    keywords: ['bplan', 'mplan', 'spa delhi', 'cept', 'urban planning', 'smart cities', 'geography gis'],
    workEnvironment: 'SPA / CEPT urban consultancies, Metro & Urban Development Authorities, WRI India',
    educationRequired: '4-Year B.Plan or B.Arch/Civil/Geography + 2-Year M.Plan (SPA / CEPT / IIT Kharagpur)',
    entranceExams: ['JEE Main Paper 2B (B.Plan)', 'GATE AR / CE / XH', 'CEPT Admission'],
    salaryRange: { entryLPA: '₹5.5 – ₹10.5 LPA', midLPA: '₹12.0 – ₹22.0 LPA', seniorLPA: '₹25.0 – ₹46.0 LPA', medianNumericLPA: 13.0 },
    jobOutlook: { demand: 'Growing', growthRateYoY: 12.2, remoteOpportunities: 'Low', topCompanies: ['WRI India', 'Janaagraha', 'PwC Urban Infrastructure', 'NIUA', 'AECOM'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.Plan / B.Arch / B.A. Geography / B.Tech Civil', duration: '3–5 Years', keyFocus: 'Urban Spatial Systems, GIS, Transport Economics' },
      { stage: 'Postgraduate', qualification: 'M.Plan (Urban / Transport / Housing)', duration: '2 Years', keyFocus: 'Metro Mobility & Sustainable Master Plans' },
      { stage: 'Career Growth', qualification: 'Chief Town Planner / Urban Mobility Director', duration: 'Ongoing', keyFocus: 'Livable & Low-Carbon Indian Cities' }
    ],
    bridgePathway: 'B.A./B.Sc Geography and Sociology graduates are directly eligible for M.Plan at SPA and CEPT!',
    recommendedCourses: [
      { title: 'Urban Land Use and Transportation Planning', provider: 'NPTEL', duration: '12 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Transit-Oriented Development (TOD)' }
    ],
    alternativeCareerIds: ['architect-visualizer', 'geomatics-mining-engineer', 'environmental-engineer'],
    description: 'Shapes master plans for metro transit corridors, walkable neighborhoods, affordable housing, and urban flood resilience.'
  },
  {
    id: 'org-psychologist',
    title: 'Organizational Psychologist & People Analytics Partner',
    titleHi: 'ऑर्गनाइजेशनल मनोवैज्ञानिक और पीपल एनालिटिक्स लीड',
    titleKn: 'ಸಾಂಸ್ಥಿಕ ಮನಃಶಾಸ್ತ್ರಜ್ಞ ಮತ್ತು ಪೀಪಲ್ ಅನಾಲಿಟಿಕ್ಸ್ ತಜ್ಞ',
    sectorId: 'management_consulting',
    sectorName: 'Management, Operations & Hospitality',
    applicableLevels: ['undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Commerce', 'Science'],
    minAcademicScore: 55,
    requiredSubjects: ['Psychology', 'Business Studies', 'Statistics'],
    requiredSkills: ['Psychometric Talent Assessment', 'People Analytics & Attrition Modeling', 'Organizational Design', 'Leadership Coaching', 'Labor Law Compliance'],
    personalityTraits: ['empathetic', 'perceptive', 'diplomatic', 'analytical'],
    riasecProfile: { R: 0.15, I: 0.76, A: 0.40, S: 0.90, E: 0.82, C: 0.72 },
    keywords: ['industrial psychology', 'hr analytics', 'xlri hrm', 'tiss hrm', 'organizational behavior'],
    workEnvironment: 'Tech & MNC leadership teams, HR consulting firms (Korn Ferry, Mercer), GCCs',
    educationRequired: 'B.A./BBA/B.Sc + MBA HRM (XLRI / TISS HRM&LR / MDI) or M.A. I/O Psychology',
    entranceExams: ['XAT (XLRI)', 'CAT', 'CUET-PG (TISS HRM)'],
    salaryRange: { entryLPA: '₹6.5 – ₹16.0 LPA (₹25+ LPA from XLRI/TISS)', midLPA: '₹16.0 – ₹32.0 LPA', seniorLPA: '₹35.0 – ₹70.0 LPA', medianNumericLPA: 17.5 },
    jobOutlook: { demand: 'High', growthRateYoY: 12.8, remoteOpportunities: 'Moderate', topCompanies: ['Mercer', 'Korn Ferry', 'Unilever', 'Tata Sons', 'Accenture Talent & Org'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.A. Psychology / BBA / Any Degree', duration: '3 Years', keyFocus: 'Behavioral Science, Statistics, Workplace Dynamics' },
      { stage: 'Postgraduate', qualification: 'M.A. HRM&LR (TISS) / PGDM HRM (XLRI)', duration: '2 Years', keyFocus: 'Compensation Science, Org Transformation & Analytics' },
      { stage: 'Career Growth', qualification: 'Chief Human Resources Officer (CHRO)', duration: 'Ongoing', keyFocus: 'High-Trust Culture & Talent Strategy' }
    ],
    bridgePathway: 'High-compensation corporate pathway specifically valuing Psychology & Humanities graduates.',
    recommendedCourses: [
      { title: 'HR Analytics (IIT Roorkee)', provider: 'NPTEL', duration: '12 Weeks', url: 'https://nptel.ac.in', skillCovered: 'People Analytics & Attrition Modeling' }
    ],
    alternativeCareerIds: ['clinical-psychologist', 'strategy-consultant', 'ngo-social-director'],
    description: 'Applies behavioral science and people analytics to design fair hiring assessments, leadership culture, and organizational effectiveness.'
  },
  {
    id: 'foreign-language-specialist',
    title: 'International Localization, Diplomacy & AI Linguistic Specialist',
    titleHi: 'विदेशी भाषा, अनुवाद और एआई भाषा विशेषज्ञ',
    titleKn: 'ವಿದೇಶಿ ಭಾಷೆ ಮತ್ತು ಎಐ ಭಾಷಾಶಾಸ್ತ್ರ ತಜ್ಞ',
    sectorId: 'law_policy',
    sectorName: 'Law, Governance & Public Policy',
    applicableLevels: ['after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Commerce', 'Science'],
    minAcademicScore: 50,
    requiredSubjects: ['English'],
    requiredSkills: ['JLPT N2/N1 Japanese or C1 German/French/Mandarin', 'Technical Interpretation', 'Multilingual LLM Evaluation', 'Cross-Border Business Etiquette'],
    personalityTraits: ['linguistically_curious', 'culturally_adaptable', 'expressive', 'accurate'],
    riasecProfile: { R: 0.18, I: 0.68, A: 0.78, S: 0.82, E: 0.62, C: 0.68 },
    keywords: ['foreign languages', 'jnu', 'eflu', 'japanese interpreter', 'german translator', 'ai linguistic annotator'],
    workEnvironment: 'Japanese/German automotive & tech MNCs, embassies, global AI localization teams',
    educationRequired: 'B.A. (Hons) Foreign Languages (JNU / EFLU) + JLPT / Goethe / DELF Levels',
    entranceExams: ['CUET-UG (JNU / EFLU)', 'JLPT / TestDaF'],
    salaryRange: { entryLPA: '₹5.5 – ₹12.0 LPA', midLPA: '₹13.0 – ₹24.0 LPA', seniorLPA: '₹26.0 – ₹45.0 LPA', medianNumericLPA: 13.5 },
    jobOutlook: { demand: 'High', growthRateYoY: 13.2, remoteOpportunities: 'High', topCompanies: ['Sony / Rakuten / Suzuki', 'SAP / Bosch', 'Amazon Localization', 'Ministry of External Affairs'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.A. Honours Japanese / German / French / Korean', duration: '3–4 Years', keyFocus: 'Fluency, Simultaneous Interpretation, Technical Vocabulary' },
      { stage: 'Domain Pairing', qualification: 'Bilingual IT / Supply Chain / AI RLHF Specialist', duration: '1–2 Years', keyFocus: 'Bilingual Bridge Project Management' },
      { stage: 'Career Growth', qualification: 'Global Localization Lead / Diplomatic Attaché', duration: 'Ongoing', keyFocus: 'Cross-Border Tech & Trade Operations' }
    ],
    bridgePathway: 'JLPT N2 (Japanese) or C1 (German) certification delivers strong MNC salaries without requiring STEM entrance exams.',
    recommendedCourses: [
      { title: 'Introduction to Linguistics & Translation Studies', provider: 'SWAYAM', duration: '8 Weeks', url: 'https://swayam.gov.in', skillCovered: 'Multilingual LLM Evaluation' }
    ],
    alternativeCareerIds: ['nlp-researcher', 'content-strategist', 'hospitality-associate'],
    description: 'Bridges global engineering, trade, diplomacy, and multilingual AI training across Japanese, German, French, and Indian languages.'
  },

  // ==================== DESIGN, ARCHITECTURE & CREATIVE MEDIA (5) ====================
  {
    id: 'ux-ui-designer',
    title: 'Product UX/UI Designer & Human-Computer Interaction Specialist',
    titleHi: 'प्रोडक्ट यूएक्स/यूआई (UX/UI) डिज़ाइनर',
    titleKn: 'ಪ್ರಾಡಕ್ಟ್ ಯುಎಕ್ಸ್/ಯುಐ (UX/UI) ಡಿಸೈನರ್',
    sectorId: 'design_media',
    sectorName: 'Design, Architecture & Creative Media',
    applicableLevels: ['after_10th', 'after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Arts/Humanities', 'Science', 'Commerce', 'Computing', 'Engineering'],
    minAcademicScore: 50,
    requiredSubjects: ['English', 'Arts'],
    requiredSkills: ['User Research & Usability Testing', 'Figma & Design Systems', 'Interaction Prototyping', 'WCAG Accessibility', 'Information Architecture'],
    personalityTraits: ['empathetic', 'creative', 'observant', 'collaborative'],
    riasecProfile: { R: 0.35, I: 0.76, A: 0.95, S: 0.78, E: 0.58, C: 0.58 },
    keywords: ['ux design', 'ui design', 'uceed', 'nid', 'bdes', 'mdes', 'human computer interaction', 'figma'],
    workEnvironment: 'Consumer apps, SaaS design studios, IIT IDC / NID labs, global tech product teams',
    educationRequired: '4-Year B.Des (IITs via UCEED / NID) or Any Degree + M.Des (CEED) / UX Portfolio',
    entranceExams: ['UCEED', 'CEED', 'NID DAT', 'NIFT'],
    salaryRange: { entryLPA: '₹6.5 – ₹15.0 LPA', midLPA: '₹16.0 – ₹34.0 LPA', seniorLPA: '₹38.0 – ₹70.0 LPA', medianNumericLPA: 17.5 },
    jobOutlook: { demand: 'Very High', growthRateYoY: 16.8, remoteOpportunities: 'High', topCompanies: ['Microsoft Design', 'Google UX', 'Swiggy', 'CRED', 'Airbnb India', 'Razorpay'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.Des Interaction Design or B.Tech/B.A. + HCI', duration: '4 Years', keyFocus: 'Cognitive Ergonomics, Prototyping, Design Systems' },
      { stage: 'Case Studies', qualification: '3 End-to-End Measured UX Case Studies / M.Des', duration: '1–2 Years', keyFocus: 'Accessibility, Research Rigor & Conversion Metrics' },
      { stage: 'Career Growth', qualification: 'VP of Product Design', duration: 'Ongoing', keyFocus: 'Human-Centered Digital Ecosystems' }
    ],
    bridgePathway: 'UCEED and CEED at IIT Bombay/Delhi/Guwahati/Hyderabad are open to Science, Commerce, AND Arts students!',
    recommendedCourses: [
      { title: 'Design, Technology and Innovation (IIT Bombay IDC)', provider: 'NPTEL', duration: '8 Weeks', url: 'https://nptel.ac.in', skillCovered: 'User Research & Usability Testing' }
    ],
    alternativeCareerIds: ['industrial-product-designer', 'content-strategist', 'ar-vr-developer'],
    description: 'Researches human needs and crafts accessible, intuitive digital interfaces and design systems.'
  },
  {
    id: 'architect-visualizer',
    title: 'Sustainable Architect & Parametric 3D Architectural Visualizer (B.Arch)',
    titleHi: 'सस्टेनेबल आर्किटेक्ट और 3D विज़ुअलाइज़र (B.Arch)',
    titleKn: 'ಸಸ್ಟೈನಬಲ್ ಆರ್ಕಿಟೆಕ್ಟ್ ಮತ್ತು 3D ವಿಜುಯಲೈಸರ್ (B.Arch)',
    sectorId: 'design_media',
    sectorName: 'Design, Architecture & Creative Media',
    applicableLevels: ['after_10th', 'after_12th', 'undergraduate'],
    eligibleStreams: ['Science', 'Diploma'],
    minAcademicScore: 55,
    requiredSubjects: ['Mathematics', 'Physics', 'Arts'],
    requiredSkills: ['BIM Revit & Rhino Grasshopper', 'Photorealistic 3D Rendering (Twinmotion/V-Ray)', 'Passive Solar & GRIHA Green Building', 'Spatial Drafting'],
    personalityTraits: ['creative', 'spatial_thinker', 'detail_oriented', 'visionary'],
    riasecProfile: { R: 0.68, I: 0.72, A: 0.94, S: 0.52, E: 0.60, C: 0.65 },
    keywords: ['architecture', 'barch', 'nata', 'architectural renderer visualizer', 'sustainable buildings', 'bim'],
    workEnvironment: 'Architectural practices, urban design studios, parametric visualization firms',
    educationRequired: '5-Year B.Arch (Council of Architecture registered) or 3-Year Architectural Assistantship Diploma',
    entranceExams: ['NATA', 'JEE Main Paper 2A'],
    salaryRange: { entryLPA: '₹4.5 – ₹9.5 LPA', midLPA: '₹11.0 – ₹22.0 LPA', seniorLPA: '₹25.0 – ₹55.0 LPA', medianNumericLPA: 12.2 },
    jobOutlook: { demand: 'High', growthRateYoY: 11.5, remoteOpportunities: 'Moderate', topCompanies: ['Hafeez Contractor', 'CP Kukreja', 'Morphogenesis', 'Gensler India', 'RSP Design'] },
    pathwaySteps: [
      { stage: 'After 12th PCM / Diploma', qualification: '5-Year B.Arch via NATA / JEE Paper 2A', duration: '5 Years', keyFocus: 'Architectural Studio, Structures, BIM & Green Building' },
      { stage: 'Specialization', qualification: 'COA Registration + Parametric / Urban Design', duration: '2 Years', keyFocus: 'Net-Zero Campuses & Real-Time 3D Visualization' },
      { stage: 'Career Growth', qualification: 'Principal Architect / Studio Partner', duration: 'Ongoing', keyFocus: 'Sustainable Civic & Commercial Landmarks' }
    ],
    bridgePathway: 'Directly models the "Architectural Renderer/Visualizer" career showcased in Figure 8 & Figure 9 of the IEEE Sankalp paper!',
    recommendedCourses: [
      { title: 'Sustainable Architecture & Green Building', provider: 'NPTEL', duration: '8 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Passive Solar & GRIHA Green Building' }
    ],
    alternativeCareerIds: ['urban-policy-planner', 'structural-civil-engineer', 'industrial-product-designer'],
    description: 'Conceives sustainable buildings, bioclimatic spaces, BIM digital models, and photorealistic 3D architectural visualizations.'
  },
  {
    id: 'industrial-product-designer',
    title: 'Industrial, Mobility & Ergonomic Hardware Product Designer',
    titleHi: 'इंडस्ट्रियल और एर्गोनॉमिक प्रोडक्ट डिज़ाइनर',
    titleKn: 'ಇಂಡಸ್ಟ್ರಿಯಲ್ ಮತ್ತು ಎರ್ಗೊನಾಮಿಕ್ ಪ್ರಾಡಕ್ಟ್ ಡಿಸೈನರ್',
    sectorId: 'design_media',
    sectorName: 'Design, Architecture & Creative Media',
    applicableLevels: ['after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Science', 'Engineering', 'Arts/Humanities', 'Diploma'],
    minAcademicScore: 52,
    requiredSubjects: ['Physics', 'Arts', 'Mathematics'],
    requiredSkills: ['Industrial Sketching & Clay/3D Printing', 'Fusion 360 / Alias Surfacing', 'Human Factors & Ergonomics', 'CMF (Color, Material, Finish)', 'Design for Manufacturability'],
    personalityTraits: ['inventive', 'tactile', 'aesthetic', 'problem_solver'],
    riasecProfile: { R: 0.78, I: 0.70, A: 0.92, S: 0.55, E: 0.55, C: 0.52 },
    keywords: ['industrial design', 'product design', 'mobility design', 'nid', 'idc iit', '3d printing prototyping'],
    workEnvironment: 'EV & automotive styling studios, medical device design labs, consumer appliance brands',
    educationRequired: 'B.Des Industrial Design or B.Tech/B.Arch + M.Des Industrial/Mobility Design (CEED)',
    entranceExams: ['UCEED', 'CEED', 'NID DAT'],
    salaryRange: { entryLPA: '₹6.0 – ₹13.0 LPA', midLPA: '₹14.0 – ₹28.0 LPA', seniorLPA: '₹30.0 – ₹58.0 LPA', medianNumericLPA: 15.0 },
    jobOutlook: { demand: 'High', growthRateYoY: 13.0, remoteOpportunities: 'Low', topCompanies: ['Ather Design', 'Titan Design Studio', 'Tata Motors Design', 'Godrej', 'Foley Designs'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.Des Product Design or B.Tech Mechanical', duration: '4 Years', keyFocus: 'Form Studies, Ergonomics, Rapid 3D Prototyping' },
      { stage: 'Master’s Studio', qualification: 'M.Des Mobility / Industrial Design (IIT IDC / NID)', duration: '2 Years', keyFocus: 'EV Styling, Medical Hardware & DFM' },
      { stage: 'Career Growth', qualification: 'Head of Industrial Design', duration: 'Ongoing', keyFocus: 'Iconic Physical-Digital Consumer Hardware' }
    ],
    bridgePathway: 'Mechanical engineers with sketching passion thrive in M.Des Mobility & Product Design via CEED.',
    recommendedCourses: [
      { title: 'Product Design and Manufacturing (IIT Kanpur)', provider: 'NPTEL', duration: '12 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Design for Manufacturability' }
    ],
    alternativeCareerIds: ['automotive-design-engineer', 'ux-ui-designer', 'architect-visualizer'],
    description: 'Shapes the form, ergonomics, materials, and manufacturability of electric vehicles, wearables, and medical devices.'
  },
  {
    id: 'motion-3d-artist',
    title: '3D Technical Artist, VFX & Animation Pipeline Specialist',
    titleHi: '3D टेक्निकल आर्टिस्ट और वीएफएक्स (VFX) विशेषज्ञ',
    titleKn: '3D ಟೆಕ್ನಿಕಲ್ ಆರ್ಟಿಸ್ಟ್ ಮತ್ತು ವಿಎಫ್‌ಎಕ್ಸ್ ತಜ್ಞ',
    sectorId: 'design_media',
    sectorName: 'Design, Architecture & Creative Media',
    applicableLevels: ['after_10th', 'after_12th', 'undergraduate'],
    eligibleStreams: ['Arts/Humanities', 'Science', 'Commerce', 'Diploma'],
    minAcademicScore: 45,
    requiredSubjects: ['Arts', 'English'],
    requiredSkills: ['Blender / Maya / Houdini', 'Procedural Rigging & Shaders', 'Unreal Engine Virtual Production', 'Python Pipeline Scripting', 'Lighting & Compositing'],
    personalityTraits: ['artistic', 'imaginative', 'technical', 'collaborative'],
    riasecProfile: { R: 0.55, I: 0.60, A: 0.95, S: 0.40, E: 0.45, C: 0.50 },
    keywords: ['vfx', 'animation', '3d artist', 'blender', 'houdini', 'avc gaming', 'virtual production'],
    workEnvironment: 'Global VFX houses (DNEG, Technicolor), animation studios, virtual production stages',
    educationRequired: 'B.Des Animation / B.Sc VFX & Multimedia + Showreel',
    entranceExams: ['NID Animation', 'UCEED', 'Showreel Evaluation'],
    salaryRange: { entryLPA: '₹4.0 – ₹8.5 LPA', midLPA: '₹10.0 – ₹22.0 LPA', seniorLPA: '₹25.0 – ₹50.0 LPA', medianNumericLPA: 11.5 },
    jobOutlook: { demand: 'Growing', growthRateYoY: 13.8, remoteOpportunities: 'High', topCompanies: ['DNEG India', 'Framestore Mumbai', 'Technicolor', 'Rockstar India', 'Redchillies.vfx'] },
    pathwaySteps: [
      { stage: 'Foundation', qualification: 'B.Des / B.Sc Animation & VFX', duration: '3–4 Years', keyFocus: '3D Modeling, Rigging, Lighting, Cinematography' },
      { stage: 'Technical Art', qualification: 'Houdini Procedural FX & Python Tooling', duration: '1–2 Years', keyFocus: 'Real-Time Virtual Production' },
      { stage: 'Career Growth', qualification: 'VFX Supervisor / Principal Technical Artist', duration: 'Ongoing', keyFocus: 'Feature Film & Interactive Worlds' }
    ],
    bridgePathway: 'Strong 90-second Blender/Unreal demo reel outweighs formal entrance exam ranks.',
    recommendedCourses: [
      { title: '3D Animation & Visual Storytelling', provider: 'SWAYAM', duration: '12 Weeks', url: 'https://swayam.gov.in', skillCovered: 'Blender / Maya / Houdini' }
    ],
    alternativeCareerIds: ['game-simulation-dev', 'graphic-dtp-designer', 'ar-vr-developer'],
    description: 'Builds 3D characters, procedural physics effects, shaders, and virtual-production environments for cinema and games.'
  },
  {
    id: 'brand-comm-designer',
    title: 'Brand Strategy, Packaging & Visual Communication Designer',
    titleHi: 'ब्रांड स्ट्रैटेजी और विजुअल कम्युनिकेशन डिज़ाइनर',
    titleKn: 'ಬ್ರ್ಯಾಂಡ್ ಸ್ಟ್ರಾಟಜಿ ಮತ್ತು ವಿಶುವಲ್ ಕಮ್ಯುನಿಕೇಷನ್ ಡಿಸೈನರ್',
    sectorId: 'design_media',
    sectorName: 'Design, Architecture & Creative Media',
    applicableLevels: ['after_12th', 'undergraduate'],
    eligibleStreams: ['Arts/Humanities', 'Commerce', 'Science'],
    minAcademicScore: 48,
    requiredSubjects: ['English', 'Arts'],
    requiredSkills: ['Brand Identity Systems', 'Sustainable Packaging Design', 'Editorial Typography', 'Consumer Semiotics', 'Art Direction'],
    personalityTraits: ['creative', 'expressive', 'culturally_aware', 'persuasive'],
    riasecProfile: { R: 0.35, I: 0.55, A: 0.94, S: 0.65, E: 0.74, C: 0.48 },
    keywords: ['nift', 'nid', 'communication design', 'brand identity', 'packaging design', 'advertising art'],
    workEnvironment: 'Brand consultancies, D2C consumer startups, global design agencies',
    educationRequired: '4-Year B.Des Communication Design (NID / NIFT / MITID / Srishti)',
    entranceExams: ['NID DAT', 'NIFT Entrance', 'UCEED'],
    salaryRange: { entryLPA: '₹5.0 – ₹10.5 LPA', midLPA: '₹12.0 – ₹24.0 LPA', seniorLPA: '₹26.0 – ₹52.0 LPA', medianNumericLPA: 13.0 },
    jobOutlook: { demand: 'High', growthRateYoY: 12.0, remoteOpportunities: 'High', topCompanies: ['Landor', 'Elephant Design', 'Pentagram Partners', 'Unilever Brands', 'Titan'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.Des Visual Communication', duration: '4 Years', keyFocus: 'Typography, Semiotics, Packaging & Motion Systems' },
      { stage: 'Agency / Brand', qualification: 'Senior Brand Designer', duration: '2 Years', keyFocus: 'D2C Identity & Sustainable Packaging' },
      { stage: 'Career Growth', qualification: 'Creative Director / Design Studio Founder', duration: 'Ongoing', keyFocus: 'Iconic Consumer Brand Narratives' }
    ],
    bridgePathway: 'Open to all streams after Class 12.',
    recommendedCourses: [
      { title: 'Graphic Design and Visual Identity', provider: 'SWAYAM', duration: '8 Weeks', url: 'https://swayam.gov.in', skillCovered: 'Brand Identity Systems' }
    ],
    alternativeCareerIds: ['graphic-dtp-designer', 'ux-ui-designer', 'quant-marketing-lead'],
    description: 'Shapes brand identity architectures, sustainable consumer packaging, and cross-media visual storytelling.'
  },

  // ==================== GRADUATE MANAGEMENT, R&D & ACADEMIA (7) ====================
  {
    id: 'tech-product-manager',
    title: 'Technology & AI Product Manager (PM)',
    titleHi: 'टेक्नोलॉजी और एआई प्रोडक्ट मैनेजर (PM)',
    titleKn: 'ಟೆಕ್ನಾಲಜಿ ಮತ್ತು ಎಐ ಪ್ರಾಡಕ್ಟ್ ಮ್ಯಾನೇಜರ್ (PM)',
    sectorId: 'management_consulting',
    sectorName: 'Management, Operations & Hospitality',
    applicableLevels: ['undergraduate', 'graduate'],
    eligibleStreams: ['Engineering', 'Computing', 'Commerce', 'Arts/Humanities'],
    minAcademicScore: 60,
    requiredSubjects: ['Mathematics', 'Economics', 'Computer Science'],
    requiredSkills: ['Product Discovery & Roadmapping', 'SQL & Funnel Experimentation', 'UX & Technical Trade-off Reasoning', 'Stakeholder Alignment', 'Go-To-Market Strategy'],
    personalityTraits: ['empathetic', 'strategic', 'decisive', 'communicative'],
    riasecProfile: { R: 0.30, I: 0.82, A: 0.60, S: 0.76, E: 0.94, C: 0.72 },
    keywords: ['product manager', 'apm', 'mba tech', 'iim', 'product analytics', 'roadmap'],
    workEnvironment: 'Consumer & SaaS product companies, FinTech unicorns, global tech leaders',
    educationRequired: 'B.Tech / BBA / Economics (+ MBA from IIMs / ISB / SPJIMR optional)',
    entranceExams: ['CAT / GMAT', 'APM Product Case Loops'],
    salaryRange: { entryLPA: '₹10.0 – ₹22.0 LPA', midLPA: '₹24.0 – ₹48.0 LPA', seniorLPA: '₹55.0 – ₹110.0 LPA', medianNumericLPA: 26.0 },
    jobOutlook: { demand: 'Very High', growthRateYoY: 17.8, remoteOpportunities: 'Moderate', topCompanies: ['Google', 'Microsoft', 'Flipkart', 'Razorpay', 'Atlassian', 'Uber'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.Tech / Economics / BBA + Side Products', duration: '3–4 Years', keyFocus: 'SQL, UX Sense, Engineering Fundamentals' },
      { stage: 'Entry / MBA', qualification: 'Associate Product Manager (APM) or Tier-1 MBA', duration: '2 Years', keyFocus: 'Metrics Ownership, A/B Testing & AI Product Strategy' },
      { stage: 'Career Growth', qualification: 'Chief Product Officer (CPO)', duration: 'Ongoing', keyFocus: 'Multi-Product Platform Leadership' }
    ],
    bridgePathway: 'Engineers, designers, and analysts can transition laterally into APM roles via shipped product teardowns without mandatory MBA.',
    recommendedCourses: [
      { title: 'Product Management: Foundations & Analytics', provider: 'SWAYAM', duration: '8 Weeks', url: 'https://swayam.gov.in', skillCovered: 'Product Discovery & Roadmapping' }
    ],
    alternativeCareerIds: ['strategy-consultant', 'fintech-analyst', 'ux-ui-designer'],
    description: 'Defines product vision, aligns engineering and UX teams, and prioritizes features that solve high-value user problems.'
  },
  {
    id: 'strategy-consultant',
    title: 'Management Strategy & Digital Transformation Consultant (MBA)',
    titleHi: 'मैनेजमेंट स्ट्रैटेजी कंसल्टेंट (MBA)',
    titleKn: 'ಮ್ಯಾನೇಜ್‌ಮೆಂಟ್ ಸ್ಟ್ರಾಟಜಿ ಸಲಹೆಗಾರ (MBA)',
    sectorId: 'management_consulting',
    sectorName: 'Management, Operations & Hospitality',
    applicableLevels: ['undergraduate', 'graduate'],
    eligibleStreams: ['Commerce', 'Engineering', 'Arts/Humanities', 'Science'],
    minAcademicScore: 65,
    requiredSubjects: ['Economics', 'Mathematics', 'Business Studies'],
    requiredSkills: ['Structured MECE Problem Solving', 'Financial & Market Sizing', 'Corporate Growth Strategy', 'Executive Storytelling', 'Change Management'],
    personalityTraits: ['analytical', 'articulate', 'adaptable', 'driven'],
    riasecProfile: { R: 0.20, I: 0.84, A: 0.38, S: 0.68, E: 0.95, C: 0.78 },
    keywords: ['management consulting', 'mckinsey bcg bain', 'cat mba', 'iim', 'corporate strategy'],
    workEnvironment: 'Global strategy consulting firms, conglomerate CEO strategy cells',
    educationRequired: 'Top Undergraduate (SRCC/IIT/St. Stephen’s/NIT) + MBA (IIMs / ISB / FMS / XLRI)',
    entranceExams: ['CAT', 'XAT', 'GMAT'],
    salaryRange: { entryLPA: '₹12.0 – ₹28.0 LPA', midLPA: '₹30.0 – ₹55.0 LPA', seniorLPA: '₹65.0 – ₹130.0 LPA', medianNumericLPA: 28.0 },
    jobOutlook: { demand: 'High', growthRateYoY: 13.5, remoteOpportunities: 'Low', topCompanies: ['McKinsey & Co', 'BCG', 'Bain & Co', 'Kearney', 'Accenture Strategy', 'TAS (Tata Administrative Services)'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'Strong Academics + Leadership & Case Competitions', duration: '3–4 Years', keyFocus: 'Business Acumen & Quantitative Analysis' },
      { stage: 'Postgraduate', qualification: 'MBA / PGDM via CAT / GMAT', duration: '1–2 Years', keyFocus: 'Competitive Strategy, M&A & Turnarounds' },
      { stage: 'Career Growth', qualification: 'Managing Director & Partner / CXO', duration: 'Ongoing', keyFocus: 'Industry-Wide Transformation' }
    ],
    bridgePathway: 'Academic diversity points at IIMs give non-engineers (Arts, Commerce, Pure Science) an explicit selection advantage!',
    recommendedCourses: [
      { title: 'Strategic Management (IIM Bangalore)', provider: 'SWAYAM', duration: '8 Weeks', url: 'https://swayam.gov.in', skillCovered: 'Corporate Growth Strategy' }
    ],
    alternativeCareerIds: ['tech-product-manager', 'financial-analyst', 'operations-director'],
    description: 'Advises enterprise boards and public institutions on market entry, cost turnarounds, digital transformation, and M&A.'
  },
  {
    id: 'operations-director',
    title: 'Global Operations, Logistics & Manufacturing Excellence Manager',
    titleHi: 'ग्लोबल ऑपरेशंस और लॉजिस्टिक्स मैनेजर',
    titleKn: 'ಗ್ಲೋಬಲ್ ಆಪರೇಷನ್ಸ್ ಮತ್ತು ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮ್ಯಾನೇಜರ್',
    sectorId: 'management_consulting',
    sectorName: 'Management, Operations & Hospitality',
    applicableLevels: ['undergraduate', 'graduate'],
    eligibleStreams: ['Engineering', 'Commerce', 'Diploma'],
    minAcademicScore: 55,
    requiredSubjects: ['Mathematics', 'Business Studies'],
    requiredSkills: ['Lean Six Sigma Black Belt', 'Global Procurement & S&OP', 'Warehouse Automation', 'Cost & SLA Governance', 'Cross-Functional Team Leadership'],
    personalityTraits: ['organized', 'decisive', 'pragmatic', 'collaborative'],
    riasecProfile: { R: 0.60, I: 0.72, A: 0.18, S: 0.62, E: 0.88, C: 0.88 },
    keywords: ['operations management', 'logistics', 'nitie iim mumbai', 'six sigma', 'procurement'],
    workEnvironment: 'Global manufacturing plants, 3PL logistics giants, aviation & retail operations hubs',
    educationRequired: 'B.Tech / BBA / B.Com + MBA Operations',
    entranceExams: ['CAT', 'GATE (for IIM Mumbai SM/Ops)'],
    salaryRange: { entryLPA: '₹7.5 – ₹16.0 LPA', midLPA: '₹18.0 – ₹34.0 LPA', seniorLPA: '₹38.0 – ₹75.0 LPA', medianNumericLPA: 18.0 },
    jobOutlook: { demand: 'High', growthRateYoY: 13.2, remoteOpportunities: 'Low', topCompanies: ['Maersk', 'Delhivery', 'Amazon India', 'Asian Paints', 'ITC', 'DHL'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'B.Tech / BBA / B.Com', duration: '3–4 Years', keyFocus: 'Process Optimization, Inventory & Quality' },
      { stage: 'PG / Certification', qualification: 'MBA Operations + Six Sigma', duration: '2 Years', keyFocus: 'Global Supply Network Resilience' },
      { stage: 'Career Growth', qualification: 'Chief Operating Officer (COO)', duration: 'Ongoing', keyFocus: 'Enterprise Execution Excellence' }
    ],
    bridgePathway: 'Shopfloor engineers with 2+ years of plant experience command top placements in 1-Year Executive MBA Ops.',
    recommendedCourses: [
      { title: 'Six Sigma (IIT Kharagpur)', provider: 'NPTEL', duration: '12 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Lean Six Sigma Black Belt' }
    ],
    alternativeCareerIds: ['industrial-supply-chain-eng', 'ecommerce-scm-analyst', 'strategy-consultant'],
    description: 'Orchestrates end-to-end production, global procurement, automated fulfillment centers, and operational margins.'
  },
  {
    id: 'quant-marketing-lead',
    title: 'Growth Marketing, MarTech & Consumer Insights Strategist',
    titleHi: 'ग्रोथ मार्केटिंग और कंज्यूमर इनसाइट्स स्ट्रैटेजिस्ट',
    titleKn: 'ಗ್ರೋತ್ ಮಾರ್ಕೆಟಿಂಗ್ ಮತ್ತು ಗ್ರಾಹಕ ಒಳನೋಟ ತಜ್ಞ',
    sectorId: 'management_consulting',
    sectorName: 'Management, Operations & Hospitality',
    applicableLevels: ['undergraduate', 'graduate'],
    eligibleStreams: ['Commerce', 'Arts/Humanities', 'Computing'],
    minAcademicScore: 52,
    requiredSubjects: ['Business Studies', 'English', 'Economics'],
    requiredSkills: ['Performance Attribution & SEO/SEM', 'Consumer Behavior Research', 'CRM Lifecycle Automation', 'A/B Conversion Optimization', 'Brand Storytelling'],
    personalityTraits: ['creative', 'persuasive', 'data_curious', 'energetic'],
    riasecProfile: { R: 0.20, I: 0.68, A: 0.76, S: 0.74, E: 0.92, C: 0.65 },
    keywords: ['digital marketing', 'growth marketing', 'mica', 'brand management', 'fmcg marketing', 'martech'],
    workEnvironment: 'FMCG brand powerhouses, D2C consumer startups, SaaS global growth teams',
    educationRequired: 'BBA / BMS / B.A. + MBA Marketing (IIMs / MICA / IMT)',
    entranceExams: ['CAT', 'MICAT', 'CUET'],
    salaryRange: { entryLPA: '₹5.5 – ₹13.0 LPA', midLPA: '₹15.0 – ₹28.0 LPA', seniorLPA: '₹32.0 – ₹65.0 LPA', medianNumericLPA: 15.0 },
    jobOutlook: { demand: 'High', growthRateYoY: 14.0, remoteOpportunities: 'High', topCompanies: ['Hindustan Unilever', 'P&G', 'Zomato', 'Mamaearth', 'Google Marketing Solutions'] },
    pathwaySteps: [
      { stage: 'Undergraduate', qualification: 'BBA / BMS / B.Com / Media', duration: '3 Years', keyFocus: 'Consumer Psychology, Digital Analytics, Copywriting' },
      { stage: 'Specialization', qualification: 'MBA Marketing / Growth Portfolio', duration: '2 Years', keyFocus: 'CAC/LTV Unit Economics & Category Creation' },
      { stage: 'Career Growth', qualification: 'Chief Marketing Officer (CMO)', duration: 'Ongoing', keyFocus: 'Revenue & Brand Equity Leadership' }
    ],
    bridgePathway: 'Blends creative storytelling (Artistic) with funnel data analytics (Enterprising/Investigative).',
    recommendedCourses: [
      { title: 'Marketing Analytics (IIT Kharagpur)', provider: 'NPTEL', duration: '12 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Performance Attribution & SEO/SEM' }
    ],
    alternativeCareerIds: ['brand-comm-designer', 'ecommerce-scm-analyst', 'tech-product-manager'],
    description: 'Combines behavioral consumer research, creative positioning, and quantitative attribution to scale brand adoption.'
  },
  {
    id: 'university-professor-researcher',
    title: 'University Professor & Principal Academic Researcher (M.Tech / PhD)',
    titleHi: 'विश्वविद्यालय प्रोफेसर और अकादमिक शोधकर्ता (PhD)',
    titleKn: 'ವಿಶ್ವವಿದ್ಯಾಲಯದ ಪ್ರಾಧ್ಯಾಪಕರು ಮತ್ತು ಸಂಶೋಧಕರು (PhD)',
    sectorId: 'education_research',
    sectorName: 'Higher Education, Academia & National R&D',
    applicableLevels: ['undergraduate', 'graduate'],
    eligibleStreams: ['Science', 'Engineering', 'Arts/Humanities', 'Commerce', 'Computing'],
    minAcademicScore: 65,
    requiredSubjects: ['Mathematics', 'English'],
    requiredSkills: ['Peer-Reviewed Scientific Publishing (IEEE/ACM)', 'Pedagogy & Curriculum Design', 'Research Grant Proposal Writing', 'Statistical Experimental Rigor', 'Doctoral Mentorship'],
    personalityTraits: ['scholarly', 'articulate', 'patient', 'intellectual'],
    riasecProfile: { R: 0.28, I: 0.96, A: 0.55, S: 0.90, E: 0.48, C: 0.70 },
    keywords: ['professor', 'phd', 'ugc net jrf', 'gate mtech', 'pmrf', 'academic research', 'teaching'],
    workEnvironment: 'IITs, NITs, IISc, Central & State Universities, autonomous research universities',
    educationRequired: 'Master’s Degree (M.Tech / M.Sc / M.A. / M.Com) + UGC-CSIR NET / GATE + PhD',
    entranceExams: ['GATE', 'UGC-NET / CSIR-NET JRF', 'PMRF Direct PhD'],
    salaryRange: { entryLPA: '₹9.5 – ₹15.0 LPA (UGC Academic Level-10 Assistant Professor)', midLPA: '₹18.0 – ₹26.0 LPA', seniorLPA: '₹28.0 – ₹42.0 LPA', medianNumericLPA: 16.5 },
    jobOutlook: { demand: 'High', growthRateYoY: 10.2, remoteOpportunities: 'Low', topCompanies: ['IITs / NITs / IIITs', 'IISc Bengaluru', 'Central Universities', 'BITS Pilani', 'Ashoka / RVCE / Manipal'] },
    pathwaySteps: [
      { stage: 'Postgraduate', qualification: 'M.Tech / M.Sc / M.A. with GATE or NET-JRF Fellowship', duration: '2 Years', keyFocus: 'Thesis Research & Journal Publications' },
      { stage: 'Doctoral', qualification: 'PhD (with ₹37k–₹80k/month JRF/PMRF Stipend)', duration: '4 Years', keyFocus: 'Novel Methodology & International Conferences' },
      { stage: 'Faculty Career', qualification: 'Assistant -> Associate -> Full Professor', duration: 'Ongoing', keyFocus: 'Sponsored Labs, Teaching & Nation-Building' }
    ],
    bridgePathway: '4-Year NEP Honours/B.Tech graduates with 75%+ CGPA are now directly eligible for NET-JRF and Direct PhD!',
    recommendedCourses: [
      { title: 'Research Methodology & Scientific Writing', provider: 'NPTEL', duration: '8 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Peer-Reviewed Scientific Publishing (IEEE/ACM)' }
    ],
    alternativeCareerIds: ['rd-scientist-isro-drdo', 'nlp-researcher', 'economic-policy-researcher'],
    description: 'Advances frontier knowledge through funded laboratory research, peer-reviewed publications, and mentoring future scholars.'
  },
  {
    id: 'rd-scientist-isro-drdo',
    title: 'National Strategic R&D Scientist (ISRO / DRDO / BARC / CSIR)',
    titleHi: 'राष्ट्रीय अनुसंधान वैज्ञानिक (ISRO / DRDO / BARC)',
    titleKn: 'ರಾಷ್ಟ್ರೀಯ ಬಾಹ್ಯಾಕಾಶ ಮತ್ತು ರಕ್ಷಣಾ ವಿಜ್ಞಾನಿ (ISRO / DRDO)',
    sectorId: 'education_research',
    sectorName: 'Higher Education, Academia & National R&D',
    applicableLevels: ['after_12th', 'undergraduate', 'graduate'],
    eligibleStreams: ['Science', 'Engineering'],
    minAcademicScore: 65,
    requiredSubjects: ['Physics', 'Mathematics', 'Chemistry'],
    requiredSkills: ['First-Principles Mathematical Modeling', 'Mission-Critical Systems Verification', 'Cryogenics / Radar / Nuclear / AI Systems', 'Technical Failure Analysis'],
    personalityTraits: ['patriotic', 'scientific', 'rigorous', 'persistent'],
    riasecProfile: { R: 0.76, I: 0.98, A: 0.25, S: 0.38, E: 0.42, C: 0.80 },
    keywords: ['isro scientist', 'drdo scientist b', 'barc oces', 'csir', 'national research lab', 'gate'],
    workEnvironment: 'ISRO centres, DRDO defence labs, BARC atomic research, CSIR national laboratories',
    educationRequired: 'B.Tech / B.E. (First Class 65%+) or M.Sc Physics/Chemistry/Math',
    entranceExams: ['ISRO ICRB', 'GATE (for DRDO RAC & BARC)', 'BARC OCES Exam'],
    salaryRange: { entryLPA: '₹10.5 – ₹14.5 LPA (Gazetted Scientist-B/SC Level-10 + Allowances)', midLPA: '₹16.5 – ₹25.0 LPA', seniorLPA: '₹28.0 – ₹42.0 LPA', medianNumericLPA: 16.8 },
    jobOutlook: { demand: 'High', growthRateYoY: 9.8, remoteOpportunities: 'Low', topCompanies: ['ISRO', 'DRDO', 'BARC', 'CSIR-NAL', 'C-DAC'] },
    pathwaySteps: [
      { stage: 'Undergraduate / PG', qualification: 'B.Tech (CS/EC/ME/EE) or M.Sc Physics', duration: '4–5 Years', keyFocus: 'Core Fundamentals & High GATE Rank' },
      { stage: 'Selection & Training', qualification: 'BARC Training School / ISRO ICRB / DRDO RAC Interview', duration: '1 Year', keyFocus: 'Deep First-Principles Engineering' },
      { stage: 'Career Growth', qualification: 'Scientist-B to Distinguished Scientist', duration: 'Ongoing', keyFocus: 'Indigenous Space, Quantum, Radar & Clean Nuclear Tech' }
    ],
    bridgePathway: 'ISRO ICRB conducts its own open exam where Tier-3 college B.Tech students with 65%+ compete on completely equal footing!',
    recommendedCourses: [
      { title: 'Space Technology & Satellite Systems', provider: 'NPTEL', duration: '8 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Mission-Critical Systems Verification' }
    ],
    alternativeCareerIds: ['aerospace-engineer', 'vlsi-engineer', 'university-professor-researcher'],
    description: 'Leads sovereign mission-critical research in planetary exploration, radar defence, quantum computing, and clean energy.'
  },
  {
    id: 'deeptech-entrepreneur',
    title: 'Deep-Tech & Venture-Backed Startup Founder',
    titleHi: 'डीप-टेक और स्टार्टअप उद्यमी (Founder)',
    titleKn: 'ಡೀಪ್-ಟೆಕ್ ಮತ್ತು ಸ್ಟಾರ್ಟ್‌ಅಪ್ ಉದ್ಯಮಿ (Founder)',
    sectorId: 'management_consulting',
    sectorName: 'Management, Operations & Hospitality',
    applicableLevels: ['undergraduate', 'graduate'],
    eligibleStreams: ['Engineering', 'Computing', 'Commerce', 'Science'],
    minAcademicScore: 50,
    requiredSubjects: ['Mathematics', 'Economics'],
    requiredSkills: ['Zero-to-One MVP Engineering', 'Customer Discovery', 'Unit Economics & Venture Fundraising', 'Team Building', 'IP Commercialization'],
    personalityTraits: ['resilient', 'bold', 'visionary', 'adaptable'],
    riasecProfile: { R: 0.55, I: 0.80, A: 0.65, S: 0.65, E: 0.98, C: 0.55 },
    keywords: ['entrepreneurship', 'startup founder', 'venture capital', 'incubator', 'nidhi prayas', 'innovation'],
    workEnvironment: 'University technology business incubators (IIT/IISc/DST), startup ecosystems',
    educationRequired: 'Any Undergraduate / Postgraduate + Validated Problem-Solution Prototype',
    entranceExams: ['DST NIDHI-PRAYAS Grants', 'Startup India Seed Fund', 'Y Combinator / Peak XV Surge'],
    salaryRange: { entryLPA: '₹6.0 – ₹15.0 LPA (Founder Fellowship / Seed Runway)', midLPA: '₹18.0 – ₹45.0 LPA', seniorLPA: 'Equity-Driven Upside', medianNumericLPA: 18.0 },
    jobOutlook: { demand: 'Growing', growthRateYoY: 16.0, remoteOpportunities: 'Moderate', topCompanies: ['IIT Madras Incubation Cell', 'SINE IIT Bombay', 'NSRCEL IIM-B', 'T-Hub', 'C-CAMP'] },
    pathwaySteps: [
      { stage: 'Campus Validation', qualification: 'Student Innovator + DST NIDHI-PRAYAS ₹10L Prototype Grant', duration: '1 Year', keyFocus: '50+ Customer Interviews & Working Prototype' },
      { stage: 'Incubation', qualification: 'Seed Funding & Early Enterprise Pilots', duration: '1–2 Years', keyFocus: 'Product-Market Fit & Repeatable Revenue' },
      { stage: 'Scale', qualification: 'Series-A+ Venture Leader', duration: 'Ongoing', keyFocus: 'Category-Defining Employment Creation' }
    ],
    bridgePathway: 'Government grants (NIDHI-EIR, Startup Karnataka Elevate, BIRAC BIG) provide non-dilutive capital regardless of academic grades.',
    recommendedCourses: [
      { title: 'Entrepreneurship Essentials (IIT Kharagpur)', provider: 'NPTEL', duration: '12 Weeks', url: 'https://nptel.ac.in', skillCovered: 'Customer Discovery' }
    ],
    alternativeCareerIds: ['tech-product-manager', 'strategy-consultant', 'ai-ml-engineer'],
    description: 'Transforms scientific, software, or social innovations into scalable enterprises generating jobs and economic impact.'
  }
];
