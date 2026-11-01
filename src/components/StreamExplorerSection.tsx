import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Compass,
  ExternalLink,
  MessageCircle,
  Youtube,
} from 'lucide-react';
import { BEGINNER_STREAM_GUIDES, type BeginnerStreamGuide } from '../data/streamStudyGuide';
import { EDUCATION_PATHWAY_OPTIONS } from '../data/educationPathways';
import type { SavedBookmarkItem } from '../types/authTypes';
import type { EducationLevel } from '../types/sankalp';

interface StreamExplorerSectionProps {
  initialStage: EducationLevel;
  savedItems: SavedBookmarkItem[];
  onToggleSaveStream: (streamId: string, title: string, subtitle: string) => void;
  onSelectStageForFinder: (stage: EducationLevel, streamName: string) => void;
  onAskMentorAboutStream: (streamTitle: string, streamId: string) => void;
}

const STAGE_TABS: Array<{ id: EducationLevel; label: string; subtitle: string }> = [
  { id: 'after_10th', label: '10th Passed', subtitle: 'Streams, Diploma & ITI' },
  { id: 'after_12th', label: '12th / PUC Passed', subtitle: 'Degrees & Entrance Exams' },
  { id: 'undergraduate', label: 'In College (UG)', subtitle: 'Jobs, MBA, GATE & UPSC' },
  { id: 'graduate', label: 'Graduated', subtitle: 'Upskilling & Career Switch' },
];

export function StreamExplorerSection({
  initialStage,
  savedItems,
  onToggleSaveStream,
  onSelectStageForFinder,
  onAskMentorAboutStream,
}: StreamExplorerSectionProps) {
  const [selectedStage, setSelectedStage] = useState<EducationLevel>(initialStage);
  const [selectedStreamId, setSelectedStreamId] = useState<string>('');
  const [showAllCoursesCatalog, setShowAllCoursesCatalog] = useState(false);

  useEffect(() => {
    setSelectedStage(initialStage);
  }, [initialStage]);

  const stageGuides = BEGINNER_STREAM_GUIDES.filter((g) => g.stage === selectedStage);
  const activeGuide: BeginnerStreamGuide =
    stageGuides.find((g) => g.id === selectedStreamId) ||
    stageGuides[0] ||
    BEGINNER_STREAM_GUIDES[0];

  useEffect(() => {
    const first = BEGINNER_STREAM_GUIDES.find((g) => g.stage === selectedStage);
    if (first) setSelectedStreamId(first.id);
  }, [selectedStage]);

  const additionalCatalogItems = EDUCATION_PATHWAY_OPTIONS.filter(
    (p) => p.level === selectedStage
  );

  const isStreamSaved = savedItems.some(
    (s) => s.itemType === 'stream' && s.itemId === activeGuide.id
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Midnight Botanical Pavilion Header & Stage Selector */}
      <section className="page-pavilion-banner rounded-3xl p-7 sm:p-10 space-y-7 text-white">
        <div className="space-y-2.5">
          <p className="text-sm font-bold tracking-wide text-teal-300">
            Complete Beginner Stream &amp; Degree Explorer
          </p>
          <h1 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl font-extrabold text-white">
            Understand Every Stream, Subject, Next Degree, Salary &amp; Study Channel
          </h1>
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-slate-200">
            Select your current stage below, then choose any stream to see what subjects are taught, what degrees follow next (B.Tech, MBBS, CA, Law, MBA), job salaries, skills to build, roadmaps, free notes, and top YouTube channels.
          </p>
        </div>

        {/* Stage Segmented Selector */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STAGE_TABS.map((tab) => {
            const active = selectedStage === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStage(tab.id)}
                className={`rounded-2xl border p-5 text-left transition-all ${
                  active
                    ? 'border-teal-300 bg-white text-slate-950 shadow-md'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/16'
                }`}
              >
                <p
                  className={`font-['Bricolage_Grotesque'] text-lg font-bold ${
                    active ? 'text-slate-950' : 'text-white'
                  }`}
                >
                  {tab.label}
                </p>
                <p className={`mt-1 text-sm ${active ? 'text-slate-600' : 'text-slate-200'}`}>
                  {tab.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Stream Selector Buttons within Stage */}
        {stageGuides.length > 1 && (
          <div className="space-y-3 border-t border-white/15 pt-5">
            <p className="text-sm font-bold text-teal-200">
              Select a Stream or Pathway ({stageGuides.length} options):
            </p>
            <div className="flex flex-wrap gap-3">
              {stageGuides.map((guide) => {
                const isSelected = activeGuide.id === guide.id;
                return (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => setSelectedStreamId(guide.id)}
                    className={`rounded-xl border px-5 py-3 text-[15px] font-bold transition-all ${
                      isSelected
                        ? 'border-teal-300 bg-teal-400 text-slate-950 shadow-sm'
                        : 'border-white/20 bg-white/10 text-white hover:bg-white/18'
                    }`}
                  >
                    {guide.title}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Main Active Stream Detailed Guide */}
      <section className="glass-card rounded-3xl p-7 sm:p-10 space-y-12">
        {/* 1. Overview & Action Buttons */}
        <div className="flex flex-col justify-between gap-6 border-b border-teal-900/10 pb-8 lg:flex-row lg:items-start">
          <div className="space-y-3 max-w-3xl">
            <p className="text-sm font-bold text-teal-800">{activeGuide.shortTagline}</p>
            <h2 className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl font-bold text-slate-950">
              {activeGuide.title}
            </h2>
            <p className="text-base sm:text-[17px] leading-relaxed text-slate-700">
              {activeGuide.simpleExplanation}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                onToggleSaveStream(
                  activeGuide.id,
                  activeGuide.title,
                  activeGuide.shortTagline
                )
              }
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-[15px] font-semibold transition-colors ${
                isStreamSaved
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Bookmark className="h-4 w-4" />
              <span>{isStreamSaved ? 'Saved' : 'Save Stream'}</span>
            </button>

            <button
              type="button"
              onClick={() => onAskMentorAboutStream(activeGuide.title, activeGuide.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-[15px] font-semibold text-slate-800 hover:bg-slate-50"
            >
              <MessageCircle className="h-4 w-4 text-teal-700" />
              <span>Ask Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectStageForFinder(selectedStage, activeGuide.title)}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-[15px] font-semibold text-white hover:bg-teal-800"
            >
              <Compass className="h-4 w-4" />
              <span>Check My Fit</span>
            </button>
          </div>
        </div>

        {/* 2. Subjects Studied & Who Should Choose */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              Subjects &amp; Topics You Will Study
            </h3>
            <ul className="space-y-3">
              {activeGuide.subjectsStudied.map((subj) => (
                <li
                  key={subj}
                  className="tinted-panel flex items-start gap-3 rounded-xl px-4 py-3.5 text-[15px] font-medium text-slate-800"
                >
                  <BookOpen className="h-5 w-5 shrink-0 text-teal-700 mt-0.5" />
                  <span>{subj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              Who Should Choose This Option?
            </h3>
            <ul className="space-y-3">
              {activeGuide.whoShouldChoose.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] leading-relaxed text-slate-700"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-700 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 3. Visual "What Comes Next?" Progression */}
        <div className="space-y-5 border-t border-slate-200 pt-10">
          <div className="space-y-1.5">
            <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-slate-950">
              If You Take This Stream, What Comes Next?
            </h3>
            <p className="text-base text-slate-600">
              See how this choice leads to undergraduate degrees, postgraduate qualifications, and key entrance exams.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="tinted-panel rounded-2xl p-6 space-y-3.5">
              <p className="text-sm font-bold text-teal-800">
                Step 1 · Immediate Next Courses / Degrees
              </p>
              <ul className="space-y-2.5 text-[15px] text-slate-800">
                {activeGuide.whatComesNext.immediateNextStep.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ArrowRight className="h-4 w-4 shrink-0 text-teal-700 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tinted-panel rounded-2xl p-6 space-y-3.5">
              <p className="text-sm font-bold text-teal-800">
                Step 2 · Higher Studies &amp; Growth Later
              </p>
              <ul className="space-y-2.5 text-[15px] text-slate-800">
                {activeGuide.whatComesNext.higherStudiesLater.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ArrowRight className="h-4 w-4 shrink-0 text-teal-700 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tinted-panel rounded-2xl p-6 space-y-3.5">
              <p className="text-sm font-bold text-teal-800">
                Key Entrance Exams to Keep in Mind
              </p>
              <ul className="space-y-2.5 text-[15px] text-slate-800">
                {activeGuide.whatComesNext.majorEntranceExams.map((exam) => (
                  <li key={exam} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-700 mt-1" />
                    <span>{exam}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Job Opportunities & Salary Packages */}
        <div className="space-y-5 border-t border-teal-900/10 pt-10">
          <div className="space-y-1.5">
            <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-slate-950">
              Job Opportunities &amp; Realistic Salary Packages (India)
            </h3>
            <p className="text-base text-slate-600">
              Salary figures are in Lakhs Per Annum (₹ LPA) across entry roles and 5–8+ years of experience.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-teal-900/15 bg-white/95">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#082026] text-sm font-bold text-white">
                  <th className="py-4 px-5">Career / Job Role</th>
                  <th className="py-4 px-5">Degree Progression Path</th>
                  <th className="py-4 px-5">Sector</th>
                  <th className="py-4 px-5">Starting Salary</th>
                  <th className="py-4 px-5">Experienced Salary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-900/10 text-[15px] text-slate-700">
                {activeGuide.careerAndSalary.map((job) => (
                  <tr key={job.role} className="transition-colors hover:bg-teal-50/50">
                    <td className="py-4 px-5 font-bold text-slate-950">{job.role}</td>
                    <td className="py-4 px-5">{job.degreePath}</td>
                    <td className="py-4 px-5 text-slate-600">{job.sectorType}</td>
                    <td className="py-4 px-5 font-mono font-semibold tabular-nums text-teal-800">
                      {job.entrySalary}
                    </td>
                    <td className="py-4 px-5 font-mono tabular-nums text-slate-900">
                      {job.experiencedSalary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. Skills You Need to Develop */}
        <div className="space-y-5 border-t border-slate-200 pt-10">
          <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-slate-950">
            Skills You Should Develop for This Stream
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-6 space-y-3">
              <p className="text-sm font-bold text-teal-800">Start Building Right Now</p>
              <ul className="space-y-2 text-[15px] text-slate-700">
                {activeGuide.skillsToDevelop.startNow.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 space-y-3">
              <p className="text-sm font-bold text-teal-800">Core Subject &amp; Technical Skills</p>
              <ul className="space-y-2 text-[15px] text-slate-700">
                {activeGuide.skillsToDevelop.coreSkills.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6 space-y-3">
              <p className="text-sm font-bold text-teal-800">Communication &amp; Career Habits</p>
              <ul className="space-y-2 text-[15px] text-slate-700">
                {activeGuide.skillsToDevelop.softSkills.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 6. Step-by-Step Stream Roadmap */}
        <div className="space-y-5 border-t border-slate-200 pt-10">
          <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-slate-950">
            Step-by-Step Roadmap for Students Choosing This Path
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {activeGuide.stepByStepRoadmap.map((step, index) => (
              <div
                key={step.phase}
                className="tinted-panel rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <p className="font-mono text-sm font-semibold text-teal-800">
                    0{index + 1} · {step.phase}
                  </p>
                  <h4 className="font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
                    {step.title}
                  </h4>
                </div>
                <p className="border-t border-teal-900/10 pt-3.5 text-[15px] leading-relaxed text-slate-600">
                  {step.actions}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Best YouTube Channels & Free Study Notes */}
        <div className="grid grid-cols-1 gap-8 border-t border-teal-900/10 pt-10 lg:grid-cols-2">
          {/* Best YouTube Channels */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-slate-950 flex items-center gap-2.5">
                <Youtube className="h-6 w-6 text-red-600" />
                <span>Best YouTube Channels to Study</span>
              </h3>
              <p className="text-[15px] text-slate-600">
                Trusted free YouTube educators recommended for students in this stream.
              </p>
            </div>

            <div className="space-y-3.5">
              {activeGuide.youtubeChannels.map((yt) => (
                <div
                  key={yt.name}
                  className="tinted-panel flex items-start justify-between gap-4 rounded-2xl p-5"
                >
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-950">{yt.name}</h4>
                    <p className="text-[15px] text-slate-600">{yt.bestFor}</p>
                    <p className="text-sm text-slate-500">Language: {yt.language}</p>
                  </div>
                  <a
                    href={yt.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-teal-800/20 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-teal-700 hover:text-teal-800 shrink-0"
                  >
                    <span>Watch</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Where to Find Free Notes & Textbooks */}
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-slate-950 flex items-center gap-2.5">
                <BookOpen className="h-6 w-6 text-teal-700" />
                <span>Where to Find Free Notes, Books &amp; Courses</span>
              </h3>
              <p className="text-[15px] text-slate-600">
                Official government portals, free textbooks, PDF notes, and open learning platforms.
              </p>
            </div>

            <div className="space-y-3.5">
              {activeGuide.notesAndResources.map((res) => (
                <div
                  key={res.title}
                  className="tinted-panel flex items-start justify-between gap-4 rounded-2xl p-5"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                      {res.type}
                    </p>
                    <h4 className="text-base font-bold text-slate-950">{res.title}</h4>
                    <p className="text-[15px] text-slate-600">{res.description}</p>
                  </div>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-teal-800/20 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-teal-700 hover:text-teal-800 shrink-0"
                  >
                    <span>Open</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Full Course & Specialization Catalog */}
      <section className="glass-card rounded-3xl p-7 space-y-6">
        <button
          type="button"
          onClick={() => setShowAllCoursesCatalog((v) => !v)}
          className="flex w-full items-center justify-between text-left"
        >
          <div>
            <p className="text-sm font-bold text-teal-800">
              Additional Degree &amp; Specialization Directory ({additionalCatalogItems.length} Tracks)
            </p>
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              View All Specific Courses, Durations &amp; Eligibility Rules for This Stage
            </h3>
          </div>
          {showAllCoursesCatalog ? (
            <ChevronUp className="h-6 w-6 text-slate-600" />
          ) : (
            <ChevronDown className="h-6 w-6 text-slate-600" />
          )}
        </button>

        {showAllCoursesCatalog && (
          <div className="grid grid-cols-1 gap-5 border-t border-teal-900/10 pt-6 md:grid-cols-2">
            {additionalCatalogItems.map((opt) => (
              <div
                key={opt.id}
                className="tinted-panel rounded-xl p-5 space-y-2.5 text-[15px]"
              >
                <p className="text-sm font-bold text-teal-800">
                  {opt.category} · {opt.duration}
                </p>
                <h4 className="font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
                  {opt.name}
                </h4>
                <p className="text-slate-600">{opt.summary}</p>
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-950">Eligibility:</span> {opt.eligibility}
                </p>
                <p className="text-slate-700">
                  <span className="font-semibold text-slate-950">Next Study Options:</span>{' '}
                  {opt.higherStudyOptions.join(' · ')}
                </p>
                <p className="font-mono text-sm font-semibold text-teal-900">
                  Avg. Starting Salary: {opt.avgStartingSalary}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
