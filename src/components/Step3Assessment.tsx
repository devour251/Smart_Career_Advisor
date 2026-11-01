import { useState } from 'react';
import { Mic, MicOff, Plus, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import { UI_TRANSLATIONS } from '../engine/multilingualModule';
import type {
  AptitudeScores,
  EducationLevel,
  RIASECScores,
  StudentProfile,
} from '../types/sankalp';

interface Step3AssessmentProps {
  profile: StudentProfile;
  isSubmitting: boolean;
  onUpdateProfile: (patch: Partial<StudentProfile>) => void;
  onExploreStreamsFirst: () => void;
  onSubmitAssessment: () => void;
}

const STAGE_OPTIONS: Array<{ id: EducationLevel; label: string; hint: string }> = [
  { id: 'after_10th', label: 'Just Passed 10th', hint: 'Choosing Class 11 Stream, Diploma, or ITI' },
  { id: 'after_12th', label: 'Completed 12th / PUC', hint: 'Choosing B.Tech, MBBS, BCA, B.Com, Law, etc.' },
  { id: 'undergraduate', label: 'In College (UG)', hint: 'Planning Jobs, MBA, M.Tech/GATE, or Govt Exams' },
  { id: 'graduate', label: 'Graduated', hint: 'Job Hunting, Upskilling, or Career Switch' },
];

const QUICK_SAMPLE_STUDENTS: Array<{
  id: string;
  title: string;
  subtitle: string;
  patch: Partial<StudentProfile>;
}> = [
  {
    id: 'sample_10th_unsure',
    title: '10th Student — Computers & Tech',
    subtitle: 'Just passed 10th, likes Maths & Computers, unsure between Science PCM and Diploma',
    patch: {
      educationLevel: 'after_10th',
      currentStream: 'Class 10 Completed',
      academicPercentage: 76,
      preferredSubjects: ['Mathematics', 'Computer Science', 'Physics'],
      interests: ['Software Engineering', 'Artificial Intelligence', 'Robotics & EVs'],
      skills: ['Python'],
      careerAspirationText:
        'I just passed 10th class. I enjoy computers and solving maths problems and want to know the best stream and future tech careers.',
      riasecScores: { R: 68, I: 82, A: 45, S: 45, E: 55, C: 60 },
      aptitudeScores: { analytical: 78, quantitative: 76, verbal: 62, creative: 58, practical: 72 },
    },
  },
  {
    id: 'sample_10th_bio',
    title: '12th Student — Healthcare & Biology',
    subtitle: 'Enjoys Biology & helping people, exploring MBBS, Nursing, Pharmacy & Biotech',
    patch: {
      educationLevel: 'after_12th',
      currentStream: 'Science (PCB)',
      academicPercentage: 74,
      preferredSubjects: ['Biology', 'Chemistry'],
      interests: ['Clinical Medicine & Nursing', 'Biotechnology & Pharma'],
      skills: ['Patient Counseling'],
      careerAspirationText:
        'I love biology and want a respected career in healthcare, medicine, pharmacy, or hospital care.',
      riasecScores: { R: 55, I: 80, A: 40, S: 88, E: 48, C: 62 },
      aptitudeScores: { analytical: 72, quantitative: 60, verbal: 74, creative: 55, practical: 75 },
    },
  },
  {
    id: 'sample_commerce',
    title: 'Commerce Student — Finance, CA & MBA',
    subtitle: 'Likes Accounts, Economics & business leadership without Physics/Chemistry',
    patch: {
      educationLevel: 'after_12th',
      currentStream: 'Commerce',
      academicPercentage: 78,
      preferredSubjects: ['Accountancy', 'Economics', 'Business Studies'],
      interests: ['Chartered Accountancy & Audit', 'Product Management', 'Data Analytics'],
      skills: ['Financial Modeling', 'GST Filing'],
      careerAspirationText:
        'I enjoy business, accounting, money management, and want to explore CA, BBA, finance, and MBA careers.',
      riasecScores: { R: 35, I: 65, A: 42, S: 58, E: 86, C: 88 },
      aptitudeScores: { analytical: 76, quantitative: 78, verbal: 74, creative: 52, practical: 55 },
    },
  },
  {
    id: 'sample_arts_law_design',
    title: 'Creative / Humanities — Law, Design or UPSC',
    subtitle: 'Enjoys reading, society, design, communication, or public service',
    patch: {
      educationLevel: 'after_12th',
      currentStream: 'Arts / Humanities',
      academicPercentage: 71,
      preferredSubjects: ['Political Science', 'Psychology', 'Design & Fine Arts'],
      interests: ['Civil Services & Public Policy', 'UX & Product Design'],
      skills: ['Legal Drafting', 'Figma'],
      careerAspirationText:
        'I like reading, creativity, law, and helping society. I want a strong career without heavy mathematics.',
      riasecScores: { R: 35, I: 62, A: 84, S: 82, E: 76, C: 52 },
      aptitudeScores: { analytical: 70, quantitative: 52, verbal: 86, creative: 84, practical: 55 },
    },
  },
];

const BEGINNER_ACTIVITY_CARDS: Array<{
  interestTag: string;
  title: string;
  desc: string;
  riasecBoost: Partial<RIASECScores>;
  aptitudeBoost: Partial<AptitudeScores>;
}> = [
  {
    interestTag: 'Software Engineering',
    title: 'Coding, Apps, Websites & Computers',
    desc: 'Building software, websites, games, or working with modern tech',
    riasecBoost: { I: 84, R: 65, C: 65 },
    aptitudeBoost: { analytical: 82, quantitative: 78 },
  },
  {
    interestTag: 'Artificial Intelligence',
    title: 'AI, Data Science & Smart Problem Solving',
    desc: 'Finding patterns in numbers, AI tools, mathematics, and analytics',
    riasecBoost: { I: 88, C: 70 },
    aptitudeBoost: { analytical: 85, quantitative: 84 },
  },
  {
    interestTag: 'Robotics & EVs',
    title: 'Machines, Electronics, EVs & Practical Work',
    desc: 'Hands-on engineering, hardware, workshops, vehicles, or renewable energy',
    riasecBoost: { R: 88, I: 72 },
    aptitudeBoost: { practical: 85, analytical: 74 },
  },
  {
    interestTag: 'Clinical Medicine & Nursing',
    title: 'Doctors, Healthcare, Biology & Helping Patients',
    desc: 'Hospitals, medicine, nursing, pharmacy, diagnostics, or mental wellness',
    riasecBoost: { S: 88, I: 80 },
    aptitudeBoost: { verbal: 74, practical: 78 },
  },
  {
    interestTag: 'Chartered Accountancy & Audit',
    title: 'Money, Accounting, Banking, Markets & CA',
    desc: 'Taxation, investments, auditing, company finance, and commerce',
    riasecBoost: { C: 88, E: 80 },
    aptitudeBoost: { quantitative: 82, analytical: 78 },
  },
  {
    interestTag: 'Product Management',
    title: 'Business Leadership, Startups, Marketing & MBA',
    desc: 'Leading teams, launching products, strategy, and management',
    riasecBoost: { E: 88, S: 72 },
    aptitudeBoost: { verbal: 82, analytical: 75 },
  },
  {
    interestTag: 'Civil Services & Public Policy',
    title: 'Law, IAS/IPS Civil Services & Governance',
    desc: 'Courts, public administration, journalism, economics, and policy',
    riasecBoost: { S: 84, E: 82 },
    aptitudeBoost: { verbal: 86, analytical: 74 },
  },
  {
    interestTag: 'UX & Product Design',
    title: 'UI/UX Design, Architecture, Media & Creativity',
    desc: 'Visual design, digital art, architecture, storytelling, and creative work',
    riasecBoost: { A: 90, I: 62 },
    aptitudeBoost: { creative: 88, verbal: 72 },
  },
];

const COMMON_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Accountancy',
  'Economics',
  'Business Studies',
  'Political Science',
  'Psychology',
  'Statistics',
  'Design & Fine Arts',
];

const COMMON_SKILLS = [
  'Python',
  'SQL',
  'JavaScript / TypeScript',
  'Machine Learning',
  'AutoCAD',
  'Embedded C',
  'Financial Modeling',
  'GST Filing',
  'Patient Counseling',
  'Legal Drafting',
  'Figma',
  'CNC Programming',
  'Solar PV Sizing',
];

export function Step3Assessment({
  profile,
  isSubmitting,
  onUpdateProfile,
  onExploreStreamsFirst,
  onSubmitAssessment,
}: Step3AssessmentProps) {
  const t = UI_TRANSLATIONS[profile.language];
  const [customSkill, setCustomSkill] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<string>('');
  const [showAdvancedSliders, setShowAdvancedSliders] = useState(false);

  const toggleItem = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  const handleToggleActivityCard = (card: (typeof BEGINNER_ACTIVITY_CARDS)[number]) => {
    const alreadySelected = profile.interests.includes(card.interestTag);
    const nextInterests = toggleItem(profile.interests, card.interestTag);
    if (!alreadySelected) {
      onUpdateProfile({
        interests: nextInterests,
        riasecScores: { ...profile.riasecScores, ...card.riasecBoost },
        aptitudeScores: { ...profile.aptitudeScores, ...card.aptitudeBoost },
      });
    } else {
      onUpdateProfile({ interests: nextInterests });
    }
  };

  const handleVoiceCapture = () => {
    const SpeechRecognitionCtor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      setVoiceStatus(
        'Voice input is not supported in this browser. You can type your thoughts directly below.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang =
      profile.language === 'hi' ? 'hi-IN' : profile.language === 'kn' ? 'kn-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsListening(true);
    setVoiceStatus(`Listening (${recognition.lang})... Speak naturally about what you enjoy.`);

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript) {
        const merged = [profile.careerAspirationText, transcript].filter(Boolean).join(' ');
        onUpdateProfile({
          inputMode: 'voice',
          careerAspirationText: merged,
        });
        setVoiceStatus('Captured your voice note successfully.');
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceStatus('Could not access microphone. Feel free to type your goals below.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    if (!profile.skills.includes(trimmed)) {
      onUpdateProfile({ skills: [...profile.skills, trimmed] });
    }
    setCustomSkill('');
  };

  return (
    <div className="space-y-8">
      {/* Quick Sample Profiles for Instant Trying */}
      <section className="glass-card rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="text-sm font-bold text-teal-800">Want to See How It Works First?</p>
            <p className="text-[15px] text-slate-600">
              Click any sample student profile below to auto-fill the form, or enter your own details directly.
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreStreamsFirst}
            className="text-sm font-bold text-teal-800 hover:underline text-left shrink-0"
          >
            Don&apos;t know stream names yet? Explore Streams first →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {QUICK_SAMPLE_STUDENTS.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onUpdateProfile(sample.patch)}
              className="tinted-panel rounded-2xl p-4 text-left transition-all hover:border-teal-700 hover:bg-white hover:shadow-sm"
            >
              <p className="font-['Bricolage_Grotesque'] text-base font-bold text-slate-950">
                {sample.title}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{sample.subtitle}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Main Beginner-Friendly Career Finder Form */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 space-y-9">
        <div className="border-b border-teal-900/10 pb-6 space-y-2">
          <p className="text-sm font-bold text-teal-800">2-Minute Personalized Career Finder</p>
          <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-slate-950 sm:text-3xl">
            {t.step3Title}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-slate-600">
            No complicated questions—just select your current class, what kind of work sounds interesting, and your favorite subjects. Even if you leave marks blank, we will still guide you accurately.
          </p>
        </div>

        {/* 1. Select Current Stage */}
        <div className="space-y-4">
          <label className="block font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
            1. Where Are You Studying Right Now?
          </label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAGE_OPTIONS.map((st) => {
              const selected = profile.educationLevel === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onUpdateProfile({ educationLevel: st.id })}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    selected
                      ? 'border-teal-700 bg-teal-50/70 text-slate-950 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-['Bricolage_Grotesque'] text-base font-bold text-slate-950">
                    {st.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{st.hint}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Basic Stream & Marks (Optional) */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              Current Class / Stream (or Considering)
            </label>
            <input
              type="text"
              value={profile.currentStream}
              onChange={(e) => onUpdateProfile({ currentStream: e.target.value })}
              placeholder="e.g., 10th Passed, Science PCM, Commerce, B.Tech"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-[15px] text-slate-900 focus:border-teal-700 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-sm font-bold text-slate-900">
                Recent Marks / % (Optional)
              </label>
              <button
                type="button"
                onClick={() =>
                  onUpdateProfile({
                    academicPercentage: profile.academicPercentage === null ? 72 : null,
                  })
                }
                className="text-sm font-semibold text-teal-700 hover:underline"
              >
                {profile.academicPercentage === null ? 'Enter Marks' : 'Skip Marks'}
              </button>
            </div>
            <input
              type="number"
              min={35}
              max={100}
              disabled={profile.academicPercentage === null}
              value={profile.academicPercentage ?? ''}
              onChange={(e) =>
                onUpdateProfile({
                  academicPercentage: e.target.value === '' ? null : Number(e.target.value),
                })
              }
              placeholder="Marks skipped — we will still match you!"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-[15px] tabular-nums text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900">
              Preferred Work Style
            </label>
            <select
              value={profile.workEnvironmentPref}
              onChange={(e) => onUpdateProfile({ workEnvironmentPref: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 focus:border-teal-700 focus:outline-none"
            >
              <option value="Software & Remote-Friendly Tech">Computers, Tech &amp; Flexible Office</option>
              <option value="Hands-On Lab, Field & Engineering">Hands-On Workshop, Machines &amp; Field</option>
              <option value="Hospital, Clinical & Patient Care">Hospitals, Healthcare &amp; Helping People</option>
              <option value="Corporate Finance, Law & Strategy">Business, Finance, Law &amp; Management</option>
              <option value="Public Service, Governance & Academia">Government Service, Teaching &amp; Research</option>
              <option value="Creative Studio & Product Design">Design, Media &amp; Creative Work</option>
            </select>
          </div>
        </div>

        {/* 3. Beginner-Friendly Activity Cards */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
              2. Which Areas Sound Interesting to You? (Pick 1 to 4)
            </label>
            <p className="text-[15px] text-slate-600">
              Pick whatever genuinely excites you—no prior technical knowledge required.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BEGINNER_ACTIVITY_CARDS.map((card) => {
              const active = profile.interests.includes(card.interestTag);
              return (
                <button
                  key={card.interestTag}
                  type="button"
                  onClick={() => handleToggleActivityCard(card)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    active
                      ? 'border-teal-700 bg-teal-50/75 text-slate-950 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-['Bricolage_Grotesque'] text-base font-bold text-slate-950">
                    {card.title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{card.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Favorite Subjects */}
        <div className="space-y-3">
          <label className="block font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
            3. Subjects You Enjoy in School or College
          </label>
          <div className="flex flex-wrap gap-2.5">
            {COMMON_SUBJECTS.map((subj) => {
              const selected = profile.preferredSubjects.includes(subj);
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() =>
                    onUpdateProfile({
                      preferredSubjects: toggleItem(profile.preferredSubjects, subj),
                    })
                  }
                  className={`rounded-xl border px-4 py-2 text-sm sm:text-[15px] font-semibold transition-colors ${
                    selected
                      ? 'border-teal-700 bg-teal-700 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {subj}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Speak or Type in Your Own Words */}
        <div className="space-y-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <label className="block font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
                4. Tell Us About Your Dreams or Doubts (English, हिन्दी, or ಕನ್ನಡ)
              </label>
              <p className="text-[15px] text-slate-600">
                Write a sentence or use the microphone—tell us if you feel confused, worried about marks, or excited about a goal.
              </p>
            </div>
            <button
              type="button"
              onClick={handleVoiceCapture}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors shrink-0 ${
                isListening
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-teal-700" />}
              <span>{isListening ? 'Stop Listening' : 'Speak With Mic'}</span>
            </button>
          </div>

          {voiceStatus && <p className="text-sm font-medium text-teal-800">{voiceStatus}</p>}

          <textarea
            rows={3}
            value={profile.careerAspirationText}
            onChange={(e) => onUpdateProfile({ careerAspirationText: e.target.value })}
            placeholder={t.voicePromptHint}
            className="w-full rounded-xl border border-slate-300 p-4 text-base text-slate-900 leading-relaxed focus:border-teal-700 focus:outline-none"
          />
        </div>

        {/* 6. Optional Skills Accordion */}
        <div className="tinted-panel rounded-2xl p-5 space-y-4">
          <button
            type="button"
            onClick={() => setShowAdvancedSliders((v) => !v)}
            className="flex w-full items-center justify-between text-left gap-4"
          >
            <div className="space-y-0.5">
              <p className="text-[15px] font-bold text-slate-950">
                Optional: Add Specific Skills You Already Know (For College / Senior Students)
              </p>
              <p className="text-sm text-slate-600">
                Skip this if you are in 10th or 12th! Click to add skills like Python, Tally, Figma, AutoCAD, etc.
              </p>
            </div>
            {showAdvancedSliders ? (
              <ChevronUp className="h-5 w-5 text-slate-600 shrink-0" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-600 shrink-0" />
            )}
          </button>

          {showAdvancedSliders && (
            <div className="space-y-4 border-t border-slate-200 pt-4">
              <div className="flex flex-wrap gap-2.5">
                {COMMON_SKILLS.map((sk) => {
                  const selected = profile.skills.includes(sk);
                  return (
                    <button
                      key={sk}
                      type="button"
                      onClick={() =>
                        onUpdateProfile({ skills: toggleItem(profile.skills, sk) })
                      }
                      className={`rounded-xl border px-3.5 py-2 text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {sk}
                    </button>
                  );
                })}
              </div>

              <div className="flex max-w-md gap-2.5">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  placeholder="Add another skill..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Action */}
        <div className="flex flex-col-reverse justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-[15px] text-slate-600">
            Generates personalized stream recommendations, top careers, salaries, roadmaps &amp; study channels.
          </p>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={onSubmitAssessment}
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-teal-700 px-7 py-4 text-base font-bold text-white transition-colors hover:bg-teal-800 disabled:opacity-50 shrink-0 shadow-xs"
          >
            <Compass className="h-5 w-5" />
            <span>
              {isSubmitting ? 'Finding Your Best Career Matches...' : 'Show My Best Streams & Careers'}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
