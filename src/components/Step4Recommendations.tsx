import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  GitCompare,
  MessageCircle,
} from 'lucide-react';
import { UI_TRANSLATIONS } from '../engine/multilingualModule';
import type { SavedBookmarkItem } from '../types/authTypes';
import type {
  CareerRecommendationItem,
  RecommendationResponse,
  StudentProfile,
} from '../types/sankalp';

interface Step4RecommendationsProps {
  profile: StudentProfile;
  response: RecommendationResponse;
  selectedRoadmapCareerId: string;
  comparedCareerIds: string[];
  savedItems: SavedBookmarkItem[];
  feedbackStatus: string | null;
  onSelectRoadmapCareer: (careerId: string) => void;
  onToggleCompareCareer: (careerId: string) => void;
  onToggleSaveCareer: (careerId: string, title: string, subtitle: string) => void;
  onFeedback: (careerId: string, action: 'accept' | 'reject', rating?: number) => Promise<void>;
  onBackToAssessment: () => void;
  onProceedToRoadmap: (careerId?: string) => void;
  onAskMentorQuestion: (question: string) => void;
}

export function Step4Recommendations({
  profile,
  response,
  selectedRoadmapCareerId,
  comparedCareerIds,
  savedItems,
  feedbackStatus,
  onSelectRoadmapCareer,
  onToggleCompareCareer,
  onToggleSaveCareer,
  onFeedback,
  onBackToAssessment,
  onProceedToRoadmap,
  onAskMentorQuestion,
}: Step4RecommendationsProps) {
  const t = UI_TRANSLATIONS[profile.language];
  const [busyCareerId, setBusyCareerId] = useState<string | null>(null);

  const speakSummary = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const top1 = response.recommendations[0];
    if (!top1) return;
    const text =
      profile.language === 'hi'
        ? `${response.emotionAnalysis.empatheticResponse} आपके लिए सबसे उपयुक्त करियर ${top1.career.titleHi} है, जिसका मैच स्कोर ${top1.finalScore} प्रतिशत है।`
        : profile.language === 'kn'
          ? `${response.emotionAnalysis.empatheticResponse} ನಿಮಗೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾದ ವೃತ್ತಿ ${top1.career.titleKn}, ಹೊಂದಾಣಿಕೆ ಅಂಕ ${top1.finalScore} ಪ್ರತಿಶತ.`
          : `${response.emotionAnalysis.empatheticResponse} Your top career match is ${top1.career.title} with a match score of ${top1.finalScore} percent.`;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang =
      profile.language === 'hi' ? 'hi-IN' : profile.language === 'kn' ? 'kn-IN' : 'en-IN';
    window.speechSynthesis.speak(utter);
  };

  const triggerFeedback = async (
    item: CareerRecommendationItem,
    action: 'accept' | 'reject',
    rating?: number
  ) => {
    setBusyCareerId(item.career.id);
    try {
      await onFeedback(item.career.id, action, rating);
    } finally {
      setBusyCareerId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Supportive Mentor Message */}
      <section className="glass-card rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-teal-900/10 pb-6 sm:flex-row sm:items-end">
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-teal-800">
              Personalized Guidance Results
            </p>
            <h2 className="font-['Bricolage_Grotesque'] text-2xl font-extrabold text-slate-950 sm:text-3xl">
              {t.step4Title}
            </h2>
            <p className="text-base text-slate-600">
              Matched across your stage, interests, favorite subjects, and long-term salary growth.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={speakSummary}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-800/20 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-teal-50/60"
            >
              <Volume2 className="h-4 w-4 text-teal-700" />
              <span>Listen to Summary</span>
            </button>

            <button
              type="button"
              onClick={() =>
                onAskMentorQuestion(
                  `My top recommended career is ${response.recommendations[0]?.career.title || 'this field'}. Can you explain step by step how I can prepare for it, what next degrees I should take, and the best YouTube channels?`
                )
              }
              className="inline-flex items-center gap-2 rounded-xl border border-teal-800/20 bg-teal-50/70 px-4 py-2.5 text-sm font-semibold text-teal-950 hover:bg-teal-100/70"
            >
              <MessageCircle className="h-4 w-4 text-teal-700" />
              <span>Ask Mentor About My Results</span>
            </button>
          </div>
        </div>

        {/* Encouraging Note */}
        <div className="tinted-panel rounded-2xl p-5 space-y-2">
          <p className="text-sm font-bold text-teal-800">Personal Mentor Note</p>
          <p className="text-base sm:text-[17px] font-semibold leading-relaxed text-slate-950">
            {response.emotionAnalysis.empatheticResponse}
          </p>
          <p className="text-[15px] leading-relaxed text-slate-600">
            {response.emotionAnalysis.scctGuidanceNote}
          </p>
        </div>

        {feedbackStatus && (
          <div className="rounded-xl border border-teal-300 bg-teal-50/90 px-5 py-3.5 text-[15px] font-medium text-teal-950">
            {feedbackStatus}
          </div>
        )}

        {/* Best Streams / Next Degrees for Current Stage */}
        {response.recommendedStreamsOrCourses.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950">
              Recommended Streams &amp; Next Courses for Your Current Stage
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {response.recommendedStreamsOrCourses.map((opt) => (
                <div
                  key={opt.id}
                  className="tinted-panel rounded-2xl p-5 space-y-2"
                >
                  <p className="text-sm font-bold text-teal-800">
                    {opt.category} · {opt.duration}
                  </p>
                  <h4 className="font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
                    {opt.name}
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-600">{opt.eligibility}</p>
                  <p className="text-sm leading-relaxed text-slate-700">
                    <span className="font-semibold text-slate-900">What Comes Next:</span>{' '}
                    {opt.higherStudyOptions.slice(0, 2).join(' · ')}
                  </p>
                  <p className="font-mono text-sm font-semibold text-teal-800 tabular-nums pt-1">
                    Starting Salary: {opt.avgStartingSalary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Top Ranked Career Recommendations */}
      <section className="space-y-6">
        {response.recommendations.map((item) => {
          const isRoadmapTarget = selectedRoadmapCareerId === item.career.id;
          const isCompared = comparedCareerIds.includes(item.career.id);
          const isSaved = savedItems.some(
            (s) => s.itemType === 'career' && s.itemId === item.career.id
          );
          const localizedTitle =
            profile.language === 'hi'
              ? `${item.career.titleHi} (${item.career.title})`
              : profile.language === 'kn'
                ? `${item.career.titleKn} (${item.career.title})`
                : item.career.title;

          return (
            <article
              key={item.career.id}
              className={`glass-card rounded-3xl p-6 sm:p-8 transition-all space-y-6 ${
                isRoadmapTarget ? 'ring-2 ring-teal-700/70' : ''
              }`}
            >
              {/* Top Row: Title & Match Score */}
              <div className="flex flex-col justify-between gap-5 border-b border-teal-900/10 pb-5 lg:flex-row lg:items-start">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5 text-sm text-slate-600">
                    <span className="font-mono font-bold text-teal-800">Match #{item.rank}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-800">{item.career.sectorName}</span>
                    <span aria-hidden="true">·</span>
                    <span>Job Demand: {item.career.jobOutlook.demand}</span>
                  </div>
                  <h3 className="font-['Bricolage_Grotesque'] text-xl sm:text-2xl font-extrabold text-slate-950">
                    {localizedTitle}
                  </h3>
                  <p className="max-w-3xl text-[15px] sm:text-base leading-relaxed text-slate-600">
                    {item.career.description}
                  </p>
                </div>

                <div className="tinted-panel shrink-0 rounded-2xl px-5 py-4 text-left sm:text-right space-y-2 min-w-[12.5rem]">
                  <p className="text-sm font-semibold text-slate-700">Overall Fit Score</p>
                  <p className="font-mono text-3xl font-bold tabular-nums text-teal-800">
                    {item.finalScore.toFixed(0)}%
                  </p>
                  <svg viewBox="0 0 100 6" className="h-2 w-full overflow-hidden rounded bg-teal-900/12">
                    <rect
                      x={0}
                      y={0}
                      width={Math.max(5, Math.min(100, item.finalScore))}
                      height={6}
                      fill="#0F766E"
                    />
                  </svg>
                </div>
              </div>

              {/* Qualification, Salary & Why It Fits */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <div className="lg:col-span-5 space-y-4 text-[15px]">
                  <div className="tinted-panel rounded-2xl p-5 space-y-2.5">
                    <p className="leading-relaxed text-slate-700">
                      <span className="font-bold text-slate-950">What to Study:</span>{' '}
                      {item.career.educationRequired}
                    </p>
                    <p className="leading-relaxed text-slate-700">
                      <span className="font-bold text-slate-950">Main Entrance Exams:</span>{' '}
                      {item.career.entranceExams.join(' · ')}
                    </p>
                    <p className="font-mono text-sm sm:text-[15px] tabular-nums text-slate-900">
                      <span className="font-sans font-bold text-slate-950">Salary Package:</span>{' '}
                      {item.career.salaryRange.entryLPA} (Entry) → {item.career.salaryRange.seniorLPA} (Senior)
                    </p>
                    <p className="leading-relaxed text-slate-700">
                      <span className="font-bold text-slate-950">Top Employers:</span>{' '}
                      {item.career.jobOutlook.topCompanies.slice(0, 4).join(' · ')}
                    </p>
                  </div>

                  {item.remediationAdvice && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-sm leading-relaxed text-amber-950">
                      <span className="font-bold">Flexible Alternative Entry Route: </span>
                      {item.remediationAdvice}
                    </div>
                  )}
                </div>

                <div className="lg:col-span-7 space-y-4 text-[15px]">
                  <div className="space-y-2">
                    <p className="font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
                      Why This Career Suits You:
                    </p>
                    <ul className="space-y-2 text-slate-700">
                      {item.whyRecommended.map((reason, idx) => (
                        <li key={idx} className="leading-relaxed">
                          • {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-950">Key Skills You Will Build: </span>
                    {item.career.requiredSkills.join(' · ')}
                  </div>
                </div>
              </div>

              {/* Action Footer: Save, Roadmap, Compare, Helpful/Skip */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      onToggleSaveCareer(
                        item.career.id,
                        item.career.title,
                        `${item.career.sectorName} · ${item.career.salaryRange.entryLPA} to ${item.career.salaryRange.seniorLPA}`
                      )
                    }
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isSaved
                        ? 'border-teal-700 bg-teal-50 text-teal-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-teal-700 hover:text-teal-800'
                    }`}
                  >
                    <Bookmark className="h-4 w-4 text-teal-700" />
                    <span>{isSaved ? 'Saved to Account' : 'Save Career'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={busyCareerId === item.career.id}
                    onClick={() => triggerFeedback(item, 'accept', 5)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-teal-700 hover:text-teal-800 disabled:opacity-50"
                  >
                    <ThumbsUp className="h-4 w-4 text-teal-700" />
                    <span>I Like This</span>
                  </button>

                  <button
                    type="button"
                    disabled={busyCareerId === item.career.id}
                    onClick={() => triggerFeedback(item, 'reject', 2)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400 disabled:opacity-50"
                  >
                    <ThumbsDown className="h-4 w-4 text-slate-500" />
                    <span>Show Different</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleCompareCareer(item.career.id)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${
                      isCompared
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <GitCompare className="h-4 w-4" />
                    <span>{isCompared ? 'Added to Compare' : 'Compare'}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onSelectRoadmapCareer(item.career.id);
                    onProceedToRoadmap(item.career.id);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm sm:text-[15px] font-bold text-white hover:bg-teal-800 transition-colors"
                >
                  <span>Full Roadmap, Free Notes &amp; YouTube</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {/* Bottom Step Navigation */}
      <div className="flex flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onBackToAssessment}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm sm:text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Edit My Interests &amp; Subjects</span>
        </button>

        <button
          type="button"
          onClick={() => onProceedToRoadmap()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-sm sm:text-[15px] font-bold text-white hover:bg-teal-800"
        >
          <span>Continue to Step-by-Step Roadmap &amp; Study Links</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
