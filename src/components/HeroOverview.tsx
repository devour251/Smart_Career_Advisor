import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Compass,
  GraduationCap,
  MessageCircle,
  PlayCircle,
} from 'lucide-react';
import heroCampusHub from '../assets/images/hero_campus_hub_1793547029602.jpg';
import stageAfterTenth from '../assets/images/stage_after_tenth_1793547030895.jpg';
import stageAfterTwelfth from '../assets/images/stage_after_twelfth_1793547032167.jpg';
import stageCollegeUg from '../assets/images/stage_college_ug_1793547031799.jpg';
import stageGraduatePro from '../assets/images/stage_graduate_pro_1793547032369.jpg';
import { UI_TRANSLATIONS } from '../engine/multilingualModule';
import type { EducationLevel, SupportedLanguage } from '../types/sankalp';

interface HeroOverviewProps {
  language: SupportedLanguage;
  onExploreStage: (stage: EducationLevel) => void;
  onStartFinder: (stage?: EducationLevel) => void;
  onOpenResources: () => void;
  onOpenChat: (initialQuestion?: string) => void;
}

const STAGE_CARDS: Array<{
  level: EducationLevel;
  stepLabel: string;
  title: string;
  question: string;
  highlights: string;
  image: string;
  imageAlt: string;
}> = [
  {
    level: 'after_10th',
    stepLabel: 'Stage 01 · Just Passed Class 10',
    title: 'After 10th — Choose Your Stream',
    question:
      'Not sure whether to pick Science (PCM / PCB), Commerce, Arts, Polytechnic Diploma, or ITI?',
    highlights: 'Subjects taught · Next degrees · Future jobs & salaries',
    image: stageAfterTenth,
    imageAlt: 'Sunlit study desk with optical prism, brass compass, microscope, and notebook',
  },
  {
    level: 'after_12th',
    stepLabel: 'Stage 02 · Completed Class 12 / PUC',
    title: 'After 12th — Pick Your Degree',
    question:
      'Comparing B.Tech, MBBS, BCA, B.Com, BBA, CA, Law (CLAT), Nursing, or Design?',
    highlights: 'Entrance exams · Eligibility · Backup routes · Salaries',
    image: stageAfterTwelfth,
    imageAlt: 'Indian college freshmen walking through a sunlit university courtyard',
  },
  {
    level: 'undergraduate',
    stepLabel: 'Stage 03 · Currently in College',
    title: 'In College — Plan What Comes Next',
    question:
      'Deciding between Campus Placements, MBA (CAT), M.Tech/MS (GATE), or UPSC?',
    highlights: 'Internships · Skill roadmaps · Job vs. Higher study',
    image: stageCollegeUg,
    imageAlt: 'Undergraduate students collaborating around laptops, electronics, and models',
  },
  {
    level: 'graduate',
    stepLabel: 'Stage 04 · Completed Degree',
    title: 'Graduated — Launch or Switch Careers',
    question:
      'Targeting high-growth roles in Software, Data, Finance, Management, or Government?',
    highlights: '6-month skill plans · Portfolio projects · Career switch',
    image: stageGraduatePro,
    imageAlt: 'Confident young graduate working in a sunlit glass skyline office',
  },
];

const POPULAR_ROADMAP_SNAPSHOTS = [
  {
    start: '10th → Science (PCM)',
    ug: 'B.Tech / BCA / B.Arch',
    pgOrNext: 'Tech Job, MBA, M.Tech, or PSU',
    roles: 'Software / AI Engineer, Product Manager, Architect',
    salary: '₹6 – ₹26 LPA (Entry) · ₹25 – ₹60+ LPA (Senior)',
  },
  {
    start: '10th → Science (PCB)',
    ug: 'MBBS / BDS / B.Sc Nursing / B.Pharm',
    pgOrNext: 'MD / MS, Hospital Practice, Clinical Research',
    roles: 'Doctor, Critical Care Nurse, Pharmacist, Biotech Scientist',
    salary: '₹5 – ₹14 LPA (Entry) · ₹18 – ₹48+ LPA (Senior)',
  },
  {
    start: '10th → Commerce',
    ug: 'B.Com / BBA / CA / Integrated MBA',
    pgOrNext: 'CA Final, CFA, MBA Finance',
    roles: 'Chartered Accountant, Financial Analyst, Investment Banker',
    salary: '₹6 – ₹18 LPA (Entry) · ₹20 – ₹55+ LPA (Senior)',
  },
  {
    start: '10th → Arts / Humanities',
    ug: 'BA + LLB (5-Yr Law) / BA Economics / Psychology / Design',
    pgOrNext: 'UPSC Civil Services, Corporate Law, MBA, Clinical Psych',
    roles: 'Corporate Lawyer, IAS/IPS Officer, UX Designer, Economist',
    salary: '₹5 – ₹16 LPA (Entry) · ₹18 – ₹45+ LPA (Senior)',
  },
  {
    start: '10th → Polytechnic Diploma',
    ug: '3-Year Practical Engineering Diploma',
    pgOrNext: 'Direct 2nd-Year B.Tech (Lateral Entry) or Junior Engineer',
    roles: 'Automation Engineer, EV Technician, Full-Stack Engineer',
    salary: '₹3.5 – ₹8 LPA (Diploma) · ₹8 – ₹24+ LPA (After B.Tech)',
  },
];

export function HeroOverview({
  language,
  onExploreStage,
  onStartFinder,
  onOpenResources,
  onOpenChat,
}: HeroOverviewProps) {
  const t = UI_TRANSLATIONS[language];

  return (
    <div className="space-y-20 pb-24">
      {/* Main Split Midnight Botanical Pavilion Hero Section */}
      <section className="hero-pavilion border-b border-white/10 text-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Hero Copy & Primary Focal CTA */}
            <div className="lg:col-span-7 space-y-7">
              <p className="text-sm sm:text-base font-bold tracking-wide text-teal-300">
                Complete Stream, Degree, Skill &amp; Career Guidance for Students
              </p>

              <h1 className="font-['Bricolage_Grotesque'] text-4xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight text-white lg:leading-[1.1] max-w-2xl">
                {t.heroTitle}
              </h1>

              <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-slate-200">
                {t.heroSubtitle}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => onExploreStage('after_10th')}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-teal-400 px-6 py-4 text-base font-bold text-slate-950 shadow-lg transition-all hover:bg-teal-300"
                >
                  <span>Explore All Streams &amp; Careers</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={() => onStartFinder()}
                  className="inline-flex items-center gap-2.5 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm px-6 py-4 text-base font-semibold text-white transition-colors hover:bg-white/18"
                >
                  <Compass className="h-5 w-5 text-teal-300" />
                  <span>{t.beginJourney}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 pt-2 text-sm font-medium text-slate-300">
                <span>85+ Detailed Careers</span>
                <span className="text-teal-400" aria-hidden="true">·</span>
                <span>Subjects &amp; Salary Insights</span>
                <span className="text-teal-400" aria-hidden="true">·</span>
                <span>Free Notes &amp; Top YouTube Channels</span>
                <span className="text-teal-400" aria-hidden="true">·</span>
                <span>English, हिन्दी &amp; ಕನ್ನಡ</span>
              </div>
            </div>

            {/* Right Hero Editorial Showcase + Quick Mentor Bar */}
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-3xl border border-white/18 bg-white/10 p-2.5 backdrop-blur-md shadow-2xl">
                <div className="overflow-hidden rounded-2xl bg-slate-900">
                  <img
                    src={heroCampusHub}
                    alt="Indian students collaborating in a sunlit modern university atrium"
                    referrerPolicy="no-referrer"
                    className="w-full h-auto aspect-video object-cover"
                  />
                </div>
                <div className="mt-2.5 rounded-2xl bg-white/95 p-5 text-slate-900 space-y-3">
                  <p className="text-sm font-bold text-teal-900">
                    Have a Doubt Right Now? Click Any Question to Ask Mentor
                  </p>
                  <div className="space-y-2">
                    {[
                      'I just passed 10th — explain Science, Commerce, Arts & Diploma simply.',
                      'If I take Science (PCM), what comes next — B.Tech, MBA, jobs & salary?',
                      'Where can I get free study notes & the best YouTube channels?',
                    ].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => onOpenChat(q)}
                        className="flex w-full items-center justify-between gap-3 rounded-xl border border-teal-900/12 bg-teal-50/55 px-4 py-2.5 text-left text-sm font-semibold text-slate-800 transition-colors hover:border-teal-700 hover:bg-white hover:text-slate-950"
                      >
                        <span>{q}</span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-teal-700" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Pick Your Current Stage (With Custom 4:3 Editorial Visuals) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-9">
        <div className="space-y-2.5">
          <p className="text-sm font-bold tracking-wide text-teal-800">
            Step-by-Step Clarity From Zero Prior Knowledge
          </p>
          <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl font-extrabold text-slate-950">
            Where Are You Studying Right Now?
          </h2>
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-slate-700">
            Pick your current class or degree to see every stream, exact subjects taught, what degrees follow next, job salaries, skills to build, and free study channels.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STAGE_CARDS.map((card) => (
            <article
              key={card.level}
              className="glass-card-interactive group flex flex-col justify-between overflow-hidden rounded-2xl"
            >
              <div>
                <div className="overflow-hidden border-b border-teal-900/10 bg-slate-900/5">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    referrerPolicy="no-referrer"
                    className="aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-6 space-y-2.5">
                  <p className="font-mono text-xs font-bold uppercase tracking-wide text-teal-800">
                    {card.stepLabel}
                  </p>
                  <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
                    {card.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-slate-600">{card.question}</p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 space-y-4">
                <div className="border-t border-teal-900/10 pt-4 space-y-3.5">
                  <p className="text-xs font-semibold text-slate-500">{card.highlights}</p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => onExploreStage(card.level)}
                      className="inline-flex items-center gap-1.5 text-[15px] font-bold text-teal-800 hover:text-teal-950 hover:underline"
                    >
                      <span>Explore Streams</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <span className="text-slate-300" aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => onStartFinder(card.level)}
                      className="text-[15px] font-semibold text-slate-700 hover:text-slate-950 hover:underline"
                    >
                      Find My Fit
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Section 2: Big-Picture Stream-to-Career Table */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-6 sm:p-10 space-y-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <p className="text-sm font-bold tracking-wide text-teal-800">
                Big-Picture Career Map
              </p>
              <h2 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl font-extrabold text-slate-950">
                If You Pick a Stream After 10th, What Comes Next?
              </h2>
              <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-slate-600">
                See at a glance how each stream connects to undergraduate degrees (B.Tech, MBBS, B.Com, Law, Diploma), postgraduation (MBA, M.Tech), careers, and realistic Indian salaries.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onExploreStage('after_10th')}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-800 shrink-0"
            >
              <span>Open Full Subject &amp; Roadmap Guide</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-teal-900/15 bg-white/95">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#082026] text-sm font-bold text-white">
                  <th className="py-4 px-5">Stream Chosen</th>
                  <th className="py-4 px-5">Next Degree (After 12th / 10th)</th>
                  <th className="py-4 px-5">Higher Studies / Next Step</th>
                  <th className="py-4 px-5">Popular Career Roles</th>
                  <th className="py-4 px-5">Typical Salary Range (India)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-900/10 text-[15px] text-slate-700">
                {POPULAR_ROADMAP_SNAPSHOTS.map((row) => (
                  <tr key={row.start} className="transition-colors hover:bg-teal-50/50">
                    <td className="py-4 px-5 font-bold text-slate-950 whitespace-nowrap">
                      {row.start}
                    </td>
                    <td className="py-4 px-5">{row.ug}</td>
                    <td className="py-4 px-5">{row.pgOrNext}</td>
                    <td className="py-4 px-5">{row.roles}</td>
                    <td className="py-4 px-5 font-mono text-sm font-semibold tabular-nums text-teal-900">
                      {row.salary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Section 3: Four Core Capabilities */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card-interactive rounded-2xl p-7 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700/12 text-teal-800">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              Clear Subjects &amp; Eligibility
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-600">
              Know every subject inside Science, Commerce, Arts, Diploma, and ITI before you enroll—plus backup routes if your marks are average.
            </p>
          </div>

          <div className="glass-card-interactive rounded-2xl p-7 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700/12 text-teal-800">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              Jobs, Salaries &amp; Skills
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-600">
              Compare entry and experienced salaries across Tech, Healthcare, Finance, Creative, and Government sectors along with exact skills to build.
            </p>
          </div>

          <div className="glass-card-interactive rounded-2xl p-7 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700/12 text-teal-800">
              <PlayCircle className="h-6 w-6" />
            </div>
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              YouTube, Notes &amp; Scholarships
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-600">
              Curated top YouTube teachers, official free textbooks (NCERT, NPTEL, ICAI, Bharat Skills), and government scholarship portals.
            </p>
            <button
              type="button"
              onClick={onOpenResources}
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-teal-800 hover:underline pt-1"
            >
              <span>Open Study Hub</span>
              <BookOpen className="h-4 w-4" />
            </button>
          </div>

          <div className="glass-card-interactive rounded-2xl p-7 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-700/12 text-teal-800">
              <MessageCircle className="h-6 w-6" />
            </div>
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              24/7 Career Mentor Chat
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-600">
              Ask any doubt about B.Tech vs BCA, MBA after engineering, CA preparation, or stream switching in English, Hindi, or Kannada.
            </p>
            <button
              type="button"
              onClick={() => onOpenChat()}
              className="inline-flex items-center gap-1.5 text-[15px] font-bold text-teal-800 hover:underline pt-1"
            >
              <span>Chat With Mentor</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Bottom Architectural Action Callout */}
        <div className="page-pavilion-banner rounded-3xl p-8 sm:p-11 text-white flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="space-y-2 max-w-2xl">
            <p className="text-sm font-bold tracking-wide text-teal-300">
              Takes Less Than 2 Minutes · Works Even Without Marks
            </p>
            <h2 className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl font-extrabold text-white">
              Ready to See Which Stream &amp; Career Suits You Best?
            </h2>
            <p className="text-base leading-relaxed text-slate-200">
              Select your favorite subjects and activities to unlock personalized career matches, backup bridge routes, and free study links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              type="button"
              onClick={() => onStartFinder()}
              className="inline-flex items-center gap-2.5 rounded-xl bg-teal-400 px-6 py-4 text-base font-bold text-slate-950 shadow-lg transition-all hover:bg-teal-300"
            >
              <Compass className="h-5 w-5" />
              <span>Launch 2-Minute Career Finder</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
