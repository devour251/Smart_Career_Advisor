import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  ExternalLink,
  MessageCircle,
  Printer,
  Youtube,
} from 'lucide-react';
import { BEGINNER_STREAM_GUIDES, type BeginnerStreamGuide } from '../data/streamStudyGuide';
import { UI_TRANSLATIONS } from '../engine/multilingualModule';
import type {
  CareerRecommendationItem,
  CareerRecord,
  RecommendationResponse,
  StudentProfile,
} from '../types/sankalp';

interface Step5RoadmapAndGraphProps {
  profile: StudentProfile;
  response: RecommendationResponse;
  selectedCareerId: string;
  comparedCareerIds: string[];
  onSelectCareer: (careerId: string) => void;
  onBackToRecommendations: () => void;
  onAskMentorQuestion: (question: string) => void;
}

function matchBestStudyGuideForCareer(
  career: CareerRecord,
  profile: StudentProfile
): BeginnerStreamGuide {
  const sector = career.sectorName.toLowerCase();
  const title = career.title.toLowerCase();

  if (
    sector.includes('health') ||
    sector.includes('medical') ||
    sector.includes('biotech') ||
    title.includes('doctor') ||
    title.includes('nurs')
  ) {
    return (
      BEGINNER_STREAM_GUIDES.find((g) => g.id === '10th-science-pcb') ||
      BEGINNER_STREAM_GUIDES[0]
    );
  }
  if (
    sector.includes('finance') ||
    sector.includes('commerce') ||
    sector.includes('banking') ||
    title.includes('accountant')
  ) {
    return (
      BEGINNER_STREAM_GUIDES.find((g) => g.id === '10th-commerce') ||
      BEGINNER_STREAM_GUIDES[0]
    );
  }
  if (
    sector.includes('law') ||
    sector.includes('public') ||
    sector.includes('design') ||
    sector.includes('media') ||
    sector.includes('humanities')
  ) {
    return (
      BEGINNER_STREAM_GUIDES.find((g) => g.id === '10th-arts-humanities') ||
      BEGINNER_STREAM_GUIDES[0]
    );
  }
  if (
    sector.includes('vocational') ||
    title.includes('technician') ||
    title.includes('cnc') ||
    title.includes('solar')
  ) {
    return (
      BEGINNER_STREAM_GUIDES.find((g) => g.id === '10th-diploma-iti') ||
      BEGINNER_STREAM_GUIDES[0]
    );
  }
  if (profile.educationLevel === 'undergraduate') {
    return (
      BEGINNER_STREAM_GUIDES.find((g) => g.id === 'ug-job-vs-mba-vs-mtech-vs-govt') ||
      BEGINNER_STREAM_GUIDES[0]
    );
  }
  if (profile.educationLevel === 'graduate') {
    return (
      BEGINNER_STREAM_GUIDES.find((g) => g.id === 'grad-career-switch-upskill') ||
      BEGINNER_STREAM_GUIDES[0]
    );
  }
  if (profile.educationLevel === 'after_12th') {
    return (
      BEGINNER_STREAM_GUIDES.find((g) => g.id === '12th-engineering-computing') ||
      BEGINNER_STREAM_GUIDES[0]
    );
  }
  return BEGINNER_STREAM_GUIDES[0];
}

export function Step5RoadmapAndGraph({
  profile,
  response,
  selectedCareerId,
  comparedCareerIds,
  onSelectCareer,
  onBackToRecommendations,
  onAskMentorQuestion,
}: Step5RoadmapAndGraphProps) {
  const t = UI_TRANSLATIONS[profile.language];

  const activeItem: CareerRecommendationItem =
    response.recommendations.find((r) => r.career.id === selectedCareerId) ||
    response.recommendations[0];

  const comparisonItems = response.recommendations.filter((r) =>
    comparedCareerIds.length > 0
      ? comparedCareerIds.includes(r.career.id)
      : r.rank <= 3
  );

  if (!activeItem) return null;

  const { career, knowledgeGraph } = activeItem;
  const matchedGuide = matchBestStudyGuideForCareer(career, profile);
  const skillNodes = knowledgeGraph.nodes.filter((n) => n.type === 'skill' || n.type === 'subject');
  const neighborNodes = knowledgeGraph.nodes.filter((n) => n.type === 'related_career');

  return (
    <div className="space-y-10">
      {/* 1. Roadmap Header & Step-by-Step Timeline */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="flex flex-col justify-between gap-5 border-b border-teal-900/10 pb-6 lg:flex-row lg:items-end">
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-teal-800">
              Complete Step-by-Step Action Plan
            </p>
            <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-slate-950 sm:text-3xl">
              {t.step5Title}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 no-print">
            <label htmlFor="roadmap-select" className="text-sm font-semibold text-slate-700">
              Viewing Roadmap For:
            </label>
            <select
              id="roadmap-select"
              value={activeItem.career.id}
              onChange={(e) => onSelectCareer(e.target.value)}
              className="rounded-xl border border-teal-800/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
            >
              {response.recommendations.map((r) => (
                <option key={r.career.id} value={r.career.id}>
                  #{r.rank} {r.career.title} ({r.finalScore.toFixed(0)}% Match)
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-800/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-teal-50/60"
            >
              <Printer className="h-4 w-4 text-teal-700" />
              <span>Print / Save PDF</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onAskMentorQuestion(
                  `Give me a beginner week-by-week study plan and top books/channels to become a ${career.title}.`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-800"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Ask Mentor</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Milestone Timeline */}
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              How to Reach {career.title} Step by Step
            </h3>
            <p className="text-sm font-medium text-slate-600">
              Qualification: {career.educationRequired} · Exams: {career.entranceExams.join(' · ')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {career.pathwaySteps.map((step, idx) => (
              <div
                key={idx}
                className="tinted-panel rounded-2xl p-5 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <p className="font-mono text-sm font-bold text-teal-800">
                    Stage 0{idx + 1} · {step.duration}
                  </p>
                  <h4 className="font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
                    {step.stage}
                  </h4>
                  <p className="text-[15px] font-semibold text-slate-800">{step.qualification}</p>
                </div>
                <p className="border-t border-teal-900/10 pt-3 text-sm leading-relaxed text-slate-600">
                  Focus: {step.keyFocus}
                </p>
              </div>
            ))}
          </div>

          <div className="tinted-panel rounded-2xl p-5 text-[15px] leading-relaxed text-slate-700">
            <span className="font-bold text-slate-950">
              Backup &amp; Alternative Entry Route (If You Miss an Exam or Switch Later):
            </span>{' '}
            {career.bridgePathway}
          </div>
        </div>

        {/* Skills Checklist & Free Government/University Courses */}
        <div className="grid grid-cols-1 gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              Skills Checklist for {career.title}
            </h3>
            <div className="space-y-2.5">
              {career.requiredSkills.map((sk) => {
                const isMatched = activeItem.matchedSkills.includes(sk);
                return (
                  <div
                    key={sk}
                    className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-[15px]"
                  >
                    <div className="flex items-center gap-2.5">
                      {isMatched ? (
                        <CheckCircle2 className="h-5 w-5 text-teal-700 shrink-0" />
                      ) : (
                        <Circle className="h-5 w-5 text-amber-600 shrink-0" />
                      )}
                      <span className="font-semibold text-slate-900">{sk}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      {isMatched ? 'Matches Your Profile' : 'Skill to Learn'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              Free Online Courses to Build These Skills (NPTEL &amp; SWAYAM)
            </h3>
            <div className="space-y-3">
              {career.recommendedCourses.map((course, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-[15px]"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-950">{course.title}</p>
                    <p className="text-sm text-slate-600">
                      {course.provider} · {course.duration} · Teaches: {course.skillCovered}
                    </p>
                  </div>
                  <a
                    href={course.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-teal-800 hover:border-teal-700 shrink-0"
                  >
                    <span>Open</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matched Best YouTube Channels & Free Study Notes */}
        <div className="grid grid-cols-1 gap-8 border-t border-slate-200 pt-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2.5 font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              <Youtube className="h-5 w-5 text-red-600" />
              <span>Best YouTube Channels to Study for This Track</span>
            </h3>
            <div className="space-y-3">
              {matchedGuide.youtubeChannels.map((yt) => (
                <div
                  key={yt.name}
                  className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-[15px]"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-slate-950">{yt.name}</p>
                    <p className="text-sm leading-relaxed text-slate-600">{yt.bestFor}</p>
                    <p className="text-sm font-medium text-slate-500">Language: {yt.language}</p>
                  </div>
                  <a
                    href={yt.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:border-teal-700 shrink-0"
                  >
                    <span>Watch</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2.5 font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              <BookOpen className="h-5 w-5 text-teal-700" />
              <span>Where to Find Free Notes &amp; Textbooks</span>
            </h3>
            <div className="space-y-3">
              {matchedGuide.notesAndResources.map((nr) => (
                <div
                  key={nr.title}
                  className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-[15px]"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-800">{nr.type}</p>
                    <p className="font-bold text-slate-950">{nr.title}</p>
                    <p className="text-sm leading-relaxed text-slate-600">{nr.description}</p>
                  </div>
                  <a
                    href={nr.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:border-teal-700 shrink-0"
                  >
                    <span>Notes</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visual Career & Backup Connection Map */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 space-y-5">
        <div className="space-y-1.5">
          <p className="text-sm font-bold text-teal-800">Visual Career Connection Map</p>
          <h3 className="font-['Bricolage_Grotesque'] text-xl sm:text-2xl font-bold text-slate-950">
            How Your Subjects &amp; Skills Connect to {career.title} and Similar Careers
          </h3>
          <p className="text-[15px] text-slate-600">
            Shows how your interests link to this career and closely related Plan-B career options on the right.
          </p>
        </div>

        <div className="tinted-panel overflow-x-auto rounded-2xl p-5">
          <svg
            viewBox="0 0 920 350"
            className="mx-auto w-full max-w-4xl h-auto"
            role="img"
            aria-label={`Career Connection Map for ${career.title}`}
          >
            {skillNodes.map((node, idx) => {
              const y = 45 + idx * (255 / Math.max(1, skillNodes.length - 1 || 1));
              return (
                <g key={`edge-${node.id}`}>
                  <line x1="150" y1="175" x2="305" y2={y} stroke="#94A3B8" strokeWidth="1.8" />
                  <line x1="475" y1={y} x2="555" y2="175" stroke="#0D9488" strokeWidth="2.2" />
                </g>
              );
            })}

            {neighborNodes.map((nNode, idx) => {
              const y = 85 + idx * 90;
              return (
                <line
                  key={`nedge-${nNode.id}`}
                  x1="720"
                  y1="175"
                  x2="755"
                  y2={y}
                  stroke="#0284C7"
                  strokeWidth="2"
                  strokeDasharray="5,4"
                />
              );
            })}

            <rect x="20" y="145" width="130" height="60" rx="10" fill="#0F172A" />
            <text x="85" y="172" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="700">
              You
            </text>
            <text x="85" y="191" textAnchor="middle" fill="#CBD5E1" fontSize="11">
              {profile.educationLevel.replace('_', ' ')}
            </text>

            {skillNodes.map((node, idx) => {
              const y = 45 + idx * (255 / Math.max(1, skillNodes.length - 1 || 1));
              const isSubject = node.type === 'subject';
              return (
                <g key={node.id}>
                  <rect
                    x="305"
                    y={y - 19}
                    width="170"
                    height="38"
                    rx="8"
                    fill={isSubject ? '#EFF6FF' : '#F0FDFA'}
                    stroke={isSubject ? '#2563EB' : '#0D9488'}
                    strokeWidth="1.6"
                  />
                  <text
                    x="390"
                    y={y + 4}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="12"
                    fontWeight="600"
                  >
                    {node.label.slice(0, 23)}
                  </text>
                </g>
              );
            })}

            <rect x="555" y="138" width="165" height="74" rx="10" fill="#0F766E" />
            <text x="637" y="169" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700">
              {career.title.slice(0, 22)}
            </text>
            <text x="637" y="189" textAnchor="middle" fill="#CCFBF1" fontSize="11">
              {activeItem.finalScore.toFixed(0)}% Match
            </text>

            {neighborNodes.map((nNode, idx) => {
              const y = 85 + idx * 90;
              return (
                <g key={nNode.id}>
                  <rect
                    x="755"
                    y={y - 24}
                    width="150"
                    height="48"
                    rx="8"
                    fill="#FFFFFF"
                    stroke="#0284C7"
                    strokeWidth="1.6"
                  />
                  <text
                    x="830"
                    y={y - 2}
                    textAnchor="middle"
                    fill="#0F172A"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {nNode.label.slice(0, 21)}
                  </text>
                  <text x="830" y={y + 14} textAnchor="middle" fill="#64748B" fontSize="10">
                    Similar Backup Option
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* 3. Side-by-Side Career Comparison Table */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 space-y-5">
        <div className="space-y-1">
          <p className="text-sm font-bold text-teal-800">Side-by-Side Comparison</p>
          <h3 className="font-['Bricolage_Grotesque'] text-xl sm:text-2xl font-bold text-slate-950">
            Compare Qualifications, Exams &amp; Salaries Across Your Top Options
          </h3>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-teal-900/15 bg-white/95">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#082026] text-sm font-bold text-white">
                <th className="py-4 px-5">Feature</th>
                {comparisonItems.map((ci) => (
                  <th key={ci.career.id} className="py-4 px-5 text-white">
                    {ci.career.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-900/10 text-sm sm:text-[15px] text-slate-700">
              <tr>
                <td className="py-3.5 px-5 font-bold text-slate-950">Match Score</td>
                {comparisonItems.map((ci) => (
                  <td key={ci.career.id} className="py-3.5 px-5 font-mono font-bold text-teal-800 tabular-nums">
                    {ci.finalScore.toFixed(0)}%
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-bold text-slate-950">Required Qualification</td>
                {comparisonItems.map((ci) => (
                  <td key={ci.career.id} className="py-3.5 px-5">
                    {ci.career.educationRequired}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-bold text-slate-950">Entrance Exams</td>
                {comparisonItems.map((ci) => (
                  <td key={ci.career.id} className="py-3.5 px-5">
                    {ci.career.entranceExams.join(' · ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-bold text-slate-950">Starting Salary</td>
                {comparisonItems.map((ci) => (
                  <td key={ci.career.id} className="py-3.5 px-5 font-mono font-semibold tabular-nums text-slate-900">
                    {ci.career.salaryRange.entryLPA}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-bold text-slate-950">Experienced Salary</td>
                {comparisonItems.map((ci) => (
                  <td key={ci.career.id} className="py-3.5 px-5 font-mono font-semibold tabular-nums text-slate-900">
                    {ci.career.salaryRange.seniorLPA}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-bold text-slate-950">Job Demand</td>
                {comparisonItems.map((ci) => (
                  <td key={ci.career.id} className="py-3.5 px-5">
                    {ci.career.jobOutlook.demand} ({ci.career.jobOutlook.growthRateYoY}% YoY)
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3.5 px-5 font-bold text-slate-950">Backup Route</td>
                {comparisonItems.map((ci) => (
                  <td key={ci.career.id} className="py-3.5 px-5 text-slate-600 leading-relaxed">
                    {ci.career.bridgePathway}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="no-print">
        <button
          type="button"
          onClick={onBackToRecommendations}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm sm:text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to My Career Matches</span>
        </button>
      </div>
    </div>
  );
}
