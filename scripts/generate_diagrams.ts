import path from 'path';
import { saveSvgAndPng } from './generate_charts';

function xmlEsc(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function box(
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  sub: string,
  fill: string,
  stroke: string,
  titleColor = '#0F172A'
): string {
  const subLines = sub.split('\n');
  const subSvg = subLines
    .map(
      (line, i) =>
        `<text x="${x + w / 2}" y="${y + 42 + i * 16}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11.5" fill="#475569">${xmlEsc(line)}</text>`
    )
    .join('');
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>
    <text x="${x + w / 2}" y="${y + 23}" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="${titleColor}">${xmlEsc(title)}</text>
    ${subSvg}
  `;
}

function arrowDefs(): string {
  return `<defs>
    <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#475569"/>
    </marker>
    <marker id="arrTeal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0D9488"/>
    </marker>
  </defs>`;
}

export function generateAllArchitectureDiagrams(): void {
  const outDirs = [path.resolve('docs/diagrams'), path.resolve('public/results')];

  // 1. Original Sankalp Architecture (IEEE Paper Fig. 1 / Section III-A)
  const origArch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 540" width="1000" height="540">
    ${arrowDefs()}
    <rect width="1000" height="540" fill="#FFFFFF"/>
    <text x="40" y="36" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Original IEEE Sankalp Three-Layer System Architecture (Baseline)</text>
    <text x="40" y="56" font-family="Arial, sans-serif" font-size="13" fill="#64748B">Nandi et al., IEEE Access 2025 (DOI: 10.1109/ACCESS.2025.3638596) — Single-Stage Career Matcher</text>

    <rect x="35" y="75" width="930" height="105" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="55" y="98" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#334155">LAYER 1: PRESENTATION &amp; MULTIMODAL INTERFACE</text>
    ${box(60, 108, 260, 58, 'Text & Voice Input', 'Whisper STT + gTTS (EN / HI / KN)', '#EFF6FF', '#93C5FD')}
    ${box(370, 108, 260, 58, 'Literal Translation Step', 'Google Translate -> Flat English String', '#EFF6FF', '#93C5FD')}
    ${box(680, 108, 260, 58, 'Streamlit Single-View UI', 'Accept / Reject Binary Buttons', '#EFF6FF', '#93C5FD')}

    <rect x="35" y="205" width="930" height="175" rx="10" fill="#FFFBEB" stroke="#FCD34D" stroke-width="1.5"/>
    <text x="55" y="228" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#92400E">LAYER 2: HYBRID CORE AI ENGINE (MULTIPLICATIVE RIGID GATE)</text>
    ${box(55, 242, 200, 72, 'Flat SBERT Encoder', 'all-MiniLM-L6-v2\nSingle Concatenated String', '#FFFFFF', '#F59E0B')}
    ${box(280, 242, 200, 72, 'Rigid IF-THEN Rules', 'Hard Cutoff on Marks/Stream\n(Rule Rigidity Bottleneck)', '#FFFFFF', '#EF4444', '#991B1B')}
    ${box(505, 242, 200, 72, 'VADER Sentiment', 'Post-Translation Polarity\nBasic Tone Tweak', '#FFFFFF', '#F59E0B')}
    ${box(730, 242, 210, 72, 'Scalar Q-Learning', 'Binary +1/-1 Career Multiplier\nNo Contextual State Generalization', '#FFFFFF', '#F59E0B')}
    <text x="500" y="355" text-anchor="middle" font-family="Arial, sans-serif" font-size="12.5" font-weight="700" fill="#92400E">Final Score = RigidGate x (SBERT + RigidRule + 2-Hop KG + Market) x CareerQ</text>

    <rect x="35" y="405" width="930" height="110" rx="10" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="1.5"/>
    <text x="55" y="428" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#334155">LAYER 3: DATA &amp; KNOWLEDGE REPOSITORY</text>
    ${box(60, 440, 270, 58, '85 Career JSON Profiles', 'Skills, Subjects, Traits, Environment', '#FFFFFF', '#94A3B8')}
    ${box(365, 440, 270, 58, 'NetworkX 2-Hop Graph', 'Unweighted Overlap Links', '#FFFFFF', '#94A3B8')}
    ${box(670, 440, 270, 58, 'External Naukri API', 'Proprietary Live Job Feed Dependency', '#FFFFFF', '#94A3B8')}

    <line x1="320" y1="137" x2="370" y2="137" stroke="#475569" stroke-width="2" marker-end="url(#arr)"/>
    <line x1="500" y1="180" x2="500" y2="205" stroke="#475569" stroke-width="2" marker-end="url(#arr)"/>
    <line x1="500" y1="380" x2="500" y2="405" stroke="#475569" stroke-width="2" marker-end="url(#arr)"/>
  </svg>`;
  saveSvgAndPng(origArch, 'original_sankalp_architecture', outDirs);

  // 2. Improved Sankalp Architecture
  const impArch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 580" width="1040" height="580">
    ${arrowDefs()}
    <rect width="1040" height="580" fill="#FFFFFF"/>
    <text x="40" y="34" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Proposed Improved Sankalp Multi-Stage Hybrid Architecture</text>
    <text x="40" y="54" font-family="Arial, sans-serif" font-size="13" fill="#0F766E">NEP-2020 Multi-Stage Pathways + Multi-Facet SBERT + Soft-Constraint Bridges + Contextual RL + KG Imputation</text>

    <rect x="30" y="70" width="980" height="105" rx="10" fill="#F0FDFA" stroke="#5EEAD4" stroke-width="1.6"/>
    <text x="50" y="92" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#0F766E">1. PRESENTATION &amp; MULTILINGUAL ACADEMIC LEXICON LAYER (REACT + WEB SPEECH API)</text>
    ${box(50, 102, 220, 58, '5-Step Guided Website', '10th / 12th / UG / Graduate', '#FFFFFF', '#14B8A6')}
    ${box(290, 102, 230, 58, 'Native Lexicon NLP', 'EN / HI / KN Stream & Valence', '#FFFFFF', '#14B8A6')}
    ${box(540, 102, 220, 58, 'Voice STT & TTS', 'Zero-Latency Browser Speech', '#FFFFFF', '#14B8A6')}
    ${box(780, 102, 210, 58, 'Roadmap & Comparison', 'Interactive SVG Pathway & Diff', '#FFFFFF', '#14B8A6')}

    <rect x="30" y="195" width="980" height="215" rx="10" fill="#F8FAFC" stroke="#93C5FD" stroke-width="1.6"/>
    <text x="50" y="218" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#1D4ED8">2. IMPROVED MULTI-AGENT HYBRID AI ENGINE (EXPRESS + TRANSFORMERS.JS ONNX)</text>
    ${box(50, 232, 220, 74, 'KG Profile Imputation', 'Infers Missing Skills from\nSubjects & RIASEC Priors', '#EFF6FF', '#3B82F6')}
    ${box(290, 232, 225, 74, 'Multi-Facet SBERT', '384-d Facet Attention:\nSkills + Interests + Academic', '#EFF6FF', '#3B82F6')}
    ${box(535, 232, 225, 74, 'Soft-Constraint & Bridge', 'Logistic Cutoff Curve +\nNEP-2020 Lateral Remediation', '#EFF6FF', '#3B82F6')}
    ${box(780, 232, 210, 74, 'VADER + SCCT Empathy', 'Multilingual Valence +\nAnxiety-Safe Attainability', '#EFF6FF', '#3B82F6')}
    ${box(140, 322, 350, 72, 'Contextual Sentiment Q-Learning Policy', 'State=(Stage, RIASEC, Completeness, Emotion)\nSelects Optimal Dynamic Fusion Weight Vector w*', '#ECFDF5', '#10B981', '#065F46')}
    ${box(530, 322, 370, 72, 'Fairness-Calibrated Hybrid Scorer + CI', 'Eliminates Urban Buzzword Bias +\nOutputs [Low, High] Confidence Intervals & Plan-B', '#ECFDF5', '#10B981', '#065F46')}

    <rect x="30" y="430" width="980" height="125" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.6"/>
    <text x="50" y="452" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#334155">3. PERSISTENT STORAGE, KNOWLEDGE GRAPH &amp; BENCHMARK VERIFICATION LAYER</text>
    ${box(50, 466, 220, 72, '85-Career + 21-Pathway DB', 'NPTEL/SWAYAM Courses,\nSalaries, Exams & Bridges', '#FFFFFF', '#64748B')}
    ${box(290, 466, 225, 72, 'Heterogeneous KG', 'IDF-Weighted Career-Skill-\nSubject-Trait Centrality', '#FFFFFF', '#64748B')}
    ${box(535, 466, 225, 72, 'SQLite Persistence', 'Sessions, Logs, Feedback,\nLearned Q-Table Snapshots', '#FFFFFF', '#64748B')}
    ${box(780, 466, 210, 72, '240-Profile Benchmark', '80 Train / 160 Held-Out Test\nDual Rubric Cohen Kappa', '#FFFFFF', '#64748B')}

    <line x1="520" y1="175" x2="520" y2="195" stroke="#0D9488" stroke-width="2.2" marker-end="url(#arrTeal)"/>
    <line x1="520" y1="410" x2="520" y2="430" stroke="#0D9488" stroke-width="2.2" marker-end="url(#arrTeal)"/>
  </svg>`;
  saveSvgAndPng(impArch, 'improved_sankalp_architecture', outDirs);

  // 3. Complete 5-Step Application Workflow
  const appWorkflow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 360" width="1040" height="360">
    ${arrowDefs()}
    <rect width="1040" height="360" fill="#FFFFFF"/>
    <text x="40" y="36" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">End-to-End 5-Step Student Guidance Website Workflow</text>
    <text x="40" y="58" font-family="Arial, sans-serif" font-size="13" fill="#64748B">Seamless progression from academic stage selection to explainable multi-stage career roadmaps and Q-learning feedback</text>

    ${box(35, 105, 172, 130, 'Step 1: Stage', 'After 10th\nAfter 12th\nUndergraduate\nGraduate\n+ EN / HI / KN', '#EFF6FF', '#3B82F6')}
    ${box(237, 105, 172, 130, 'Step 2: Pathways', 'Science / Commerce\nArts / Diploma / ITI\nUG Specializations\nHigher Studies & Jobs', '#F0FDFA', '#14B8A6')}
    ${box(439, 105, 172, 130, 'Step 3: Assessment', 'Marks & Subjects\nSkills & Interests\nAptitude & RIASEC\nText / Voice Reflection', '#FEF3C7', '#F59E0B')}
    ${box(641, 105, 172, 130, 'Step 4: AI Ranking', 'Improved vs Original\nConfidence Intervals\nSCCT Empathy Note\nAccept/Reject Feedback', '#EEF2FF', '#6366F1')}
    ${box(843, 105, 165, 130, 'Step 5: Roadmap', 'Why Recommended\nSkill Gap & NPTEL\nCourse Comparison\nSVG Knowledge Graph', '#ECFDF5', '#10B981')}

    <line x1="207" y1="170" x2="237" y2="170" stroke="#475569" stroke-width="2.2" marker-end="url(#arr)"/>
    <line x1="409" y1="170" x2="439" y2="170" stroke="#475569" stroke-width="2.2" marker-end="url(#arr)"/>
    <line x1="611" y1="170" x2="641" y2="170" stroke="#475569" stroke-width="2.2" marker-end="url(#arr)"/>
    <line x1="813" y1="170" x2="843" y2="170" stroke="#475569" stroke-width="2.2" marker-end="url(#arr)"/>

    <path d="M 727 235 L 727 305 L 525 305 L 525 235" fill="none" stroke="#0D9488" stroke-width="2" stroke-dasharray="6,4" marker-end="url(#arrTeal)"/>
    <text x="626" y="325" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#0F766E">Live Q-Learning Feedback Loop Updates Policy &amp; Re-Ranks Candidates</text>
  </svg>`;
  saveSvgAndPng(appWorkflow, 'application_workflow', outDirs);

  // 4. AI Recommendation Engine Scoring Workflow
  const engineWorkflow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1020 460" width="1020" height="460">
    ${arrowDefs()}
    <rect width="1020" height="460" fill="#FFFFFF"/>
    <text x="40" y="36" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Hybrid Multi-Agent Recommendation Scoring Pipeline</text>
    <text x="40" y="56" font-family="Arial, sans-serif" font-size="13" fill="#64748B">Parallel feature extraction, missing-attribute KG imputation, and contextual Q-learning weight fusion</text>

    ${box(35, 180, 175, 95, 'Student Profile', 'Stage, Marks, Stream,\nSkills, RIASEC,\nEN/HI/KN Text', '#F8FAFC', '#64748B')}
    ${box(250, 90, 210, 75, 'Native Lexicon + KG Impute', 'Expands HI/KN academic terms\n& imputes missing skills', '#EFF6FF', '#3B82F6')}
    ${box(250, 190, 210, 75, 'Soft-Rule & Bridge Engine', 'Logistic mark feasibility +\nNEP-2020 cross-stream bridge', '#F0FDFA', '#14B8A6')}
    ${box(250, 290, 210, 75, 'VADER + SCCT Analyzer', 'Detects anxiety/confidence &\ncomputes empathy adjustment', '#FFFBEB', '#F59E0B')}

    ${box(505, 90, 215, 75, 'Multi-Facet SBERT (384-d)', 'Facet attention over Skills,\nInterests & Academic vectors', '#EEF2FF', '#6366F1')}
    ${box(505, 190, 215, 75, 'IDF Knowledge Graph', 'Weighted Career-Skill-Subject\ncentrality + subgraph paths', '#F0FDFA', '#14B8A6')}
    ${box(505, 290, 215, 75, 'Contextual Q-Policy', 'Selects optimal w*=[w_sbert,\nw_rule, w_kg, w_riasec, w_mkt]', '#ECFDF5', '#10B981')}

    ${box(765, 165, 220, 125, 'Ranked Recommendations', 'Top-N Careers + Streams\n95% Confidence Interval\nSide-by-Side Baseline Diff\nExplainable KG Subgraph', '#ECFDF5', '#059669', '#065F46')}

    <line x1="210" y1="210" x2="250" y2="130" stroke="#475569" stroke-width="1.8" marker-end="url(#arr)"/>
    <line x1="210" y1="227" x2="250" y2="227" stroke="#475569" stroke-width="1.8" marker-end="url(#arr)"/>
    <line x1="210" y1="245" x2="250" y2="325" stroke="#475569" stroke-width="1.8" marker-end="url(#arr)"/>
    <line x1="460" y1="127" x2="505" y2="127" stroke="#475569" stroke-width="1.8" marker-end="url(#arr)"/>
    <line x1="460" y1="227" x2="505" y2="227" stroke="#475569" stroke-width="1.8" marker-end="url(#arr)"/>
    <line x1="460" y1="327" x2="505" y2="327" stroke="#475569" stroke-width="1.8" marker-end="url(#arr)"/>
    <line x1="720" y1="127" x2="765" y2="205" stroke="#0D9488" stroke-width="2" marker-end="url(#arrTeal)"/>
    <line x1="720" y1="227" x2="765" y2="227" stroke="#0D9488" stroke-width="2" marker-end="url(#arrTeal)"/>
    <line x1="720" y1="327" x2="765" y2="250" stroke="#0D9488" stroke-width="2" marker-end="url(#arrTeal)"/>
  </svg>`;
  saveSvgAndPng(engineWorkflow, 'recommendation_engine_workflow', outDirs);

  // 5. Q-Learning Feedback Mechanism Diagram
  const rlDiagram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 980 420" width="980" height="420">
    ${arrowDefs()}
    <rect width="980" height="420" fill="#FFFFFF"/>
    <text x="40" y="36" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Sentiment-Augmented Contextual Q-Learning Feedback Mechanism</text>
    <text x="40" y="56" font-family="Arial, sans-serif" font-size="13" fill="#64748B">Bellman Policy Optimization: Q(s,a) &lt;- Q(s,a) + alpha [ R_shaped + gamma max Q(s',a') - Q(s,a) ]</text>

    ${box(50, 105, 250, 95, 'Context State S_t', 'EducationLevel x DominantRIASEC\nx CompletenessTier x EmotionBucket\n(Generalizes across similar students)', '#EFF6FF', '#3B82F6')}
    ${box(365, 105, 250, 95, 'Epsilon-Greedy Action A_t', 'Selects Fusion Weight Profile:\nBalanced | Semantic | Eligibility\nKG-Pathway | Empathetic-Support', '#F0FDFA', '#14B8A6')}
    ${box(680, 105, 250, 95, 'Student Interaction', 'Accept (+1) / Reject (-0.85)\n+ Optional Natural Language\nFeedback & Star Rating (1-5)', '#FEF3C7', '#F59E0B')}
    ${box(340, 265, 300, 100, 'Shaped Reward & Q-Table Persistence', 'R_t = r_explicit + 0.35*VADER - 0.15*SkillGap\nUpdates SQLite q_learning_snapshots +\nFilters Rejected Careers Immediately', '#ECFDF5', '#10B981', '#065F46')}

    <line x1="300" y1="152" x2="365" y2="152" stroke="#475569" stroke-width="2" marker-end="url(#arr)"/>
    <line x1="615" y1="152" x2="680" y2="152" stroke="#475569" stroke-width="2" marker-end="url(#arr)"/>
    <path d="M 805 200 L 805 315 L 640 315" fill="none" stroke="#0D9488" stroke-width="2.2" marker-end="url(#arrTeal)"/>
    <path d="M 340 315 L 175 315 L 175 200" fill="none" stroke="#0D9488" stroke-width="2.2" marker-end="url(#arrTeal)"/>
  </svg>`;
  saveSvgAndPng(rlDiagram, 'qlearning_feedback_loop', outDirs);

  // 6. Education-to-Career Pathway Diagram (Phase 2 Novel Contribution)
  const pathwayDiagram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 480" width="1040" height="480">
    ${arrowDefs()}
    <rect width="1040" height="480" fill="#FFFFFF"/>
    <text x="40" y="36" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Multi-Stage Indian Education-to-Career Pathway Graph (NEP-2020 Aligned)</text>
    <text x="40" y="56" font-family="Arial, sans-serif" font-size="13" fill="#64748B">Key structural contribution extending Sankalp from flat job matching to longitudinal academic pathway planning</text>

    ${box(35, 95, 195, 330, 'After 10th (SSLC)', '1. Science (PCM/PCB)\n2. Commerce + Math\n3. Arts / Humanities\n4. Polytechnic Diploma\n5. ITI / NCVET Trades', '#EFF6FF', '#3B82F6')}
    ${box(280, 95, 205, 330, 'After 12th / Diploma', '1. B.Tech / B.E. (JEE/CET)\n2. MBBS / B.Sc Nursing\n3. B.Com / BBA / CA Found.\n4. B.A. / Integrated LL.B.\n5. BCA / B.Sc Data Science\n6. Lateral Entry B.Tech', '#F0FDFA', '#14B8A6')}
    ${box(535, 95, 205, 330, 'Undergraduate Focus', '1. AI, Cloud & Cyber Tracks\n2. Core EV, VLSI, Civil, Aero\n3. Clinical, Pharma, Biotech\n4. Audit, FinTech & Policy\n5. UX Design & Media\n+ NPTEL Skill Bridges', '#FEF3C7', '#F59E0B')}
    ${box(790, 95, 215, 330, 'Graduate & Careers', '1. Direct Industry Roles (85)\n2. M.Tech / MS Research\n3. MBA Product & Strategy\n4. UPSC / State Civil Services\n5. Ph.D. / Scientist (ISRO)\n+ Plan-B Alternative Routes', '#ECFDF5', '#10B981')}

    <line x1="230" y1="260" x2="280" y2="260" stroke="#0D9488" stroke-width="2.5" marker-end="url(#arrTeal)"/>
    <line x1="485" y1="260" x2="535" y2="260" stroke="#0D9488" stroke-width="2.5" marker-end="url(#arrTeal)"/>
    <line x1="740" y1="260" x2="790" y2="260" stroke="#0D9488" stroke-width="2.5" marker-end="url(#arrTeal)"/>
  </svg>`;
  saveSvgAndPng(pathwayDiagram, 'education_to_career_pathway', outDirs);

  // 7. Database Entity-Relationship (ER) Diagram
  const erDiagram = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 480" width="1000" height="480">
    ${arrowDefs()}
    <rect width="1000" height="480" fill="#FFFFFF"/>
    <text x="40" y="36" font-family="Arial, sans-serif" font-size="20" font-weight="700" fill="#0F172A">Database &amp; Knowledge Repository Entity-Relationship (ER) Diagram</text>
    <text x="40" y="56" font-family="Arial, sans-serif" font-size="13" fill="#64748B">SQLite relational tables (data/sankalp.db) linked with typed Career &amp; Pathway repositories</text>

    ${box(45, 95, 260, 145, 'student_sessions (SQLite)', 'PK session_id TEXT\neducation_level TEXT\nlanguage TEXT (en|hi|kn)\ncohort TEXT (urban|rural)\nprofile_json TEXT\ncreated_at DATETIME', '#EFF6FF', '#3B82F6')}
    ${box(370, 95, 260, 145, 'recommendation_logs (SQLite)', 'PK id INTEGER\nFK session_id TEXT\nmodel_variant TEXT\nlatency_ms REAL\ntop_career_id TEXT\nrecommendations_json TEXT', '#F0FDFA', '#14B8A6')}
    ${box(695, 95, 260, 145, 'user_feedback (SQLite)', 'PK id INTEGER\nFK session_id TEXT\nFK career_id TEXT\naction TEXT (accept|reject)\nrating INTEGER (1..5)\nvader_compound REAL', '#FEF3C7', '#F59E0B')}

    ${box(170, 295, 290, 140, 'CAREER_REPOSITORY (85 Records)', 'PK id TEXT\ntitle, title_hi, title_kn\nmin_academic_score, riasec_profile\nrequired_skills[], required_subjects[]\npathway_steps[], bridge_pathway', '#F8FAFC', '#64748B')}
    ${box(540, 295, 310, 140, 'q_learning_state (SQLite)', 'PK id INTEGER (Singleton=1)\nsnapshot_json (originalCareerQ +\ncontextualPolicyQ tables,\nepsilon, episodes_trained)\nupdated_at DATETIME', '#ECFDF5', '#10B981')}

    <line x1="305" y1="165" x2="370" y2="165" stroke="#475569" stroke-width="2" marker-end="url(#arr)"/>
    <line x1="630" y1="165" x2="695" y2="165" stroke="#475569" stroke-width="2" marker-end="url(#arr)"/>
    <line x1="500" y1="240" x2="360" y2="295" stroke="#475569" stroke-width="1.8" marker-end="url(#arr)"/>
    <line x1="825" y1="240" x2="720" y2="295" stroke="#0D9488" stroke-width="2" marker-end="url(#arrTeal)"/>
  </svg>`;
  saveSvgAndPng(erDiagram, 'database_er_diagram', outDirs);
}
