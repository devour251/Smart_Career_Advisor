import { useMemo, useState } from 'react';
import { Award, BookOpen, Calendar, ExternalLink, Search, Youtube } from 'lucide-react';
import { BEGINNER_STREAM_GUIDES } from '../data/streamStudyGuide';
import type { EducationLevel } from '../types/sankalp';

type StageFilter = 'all' | EducationLevel;
type ResourceFormatFilter = 'all' | 'youtube' | 'notes';

const SCHOLARSHIPS_AND_EXAMS = [
  {
    category: 'Central Government Scholarship',
    title: 'National Scholarship Portal (NSP)',
    whoFor: 'Class 11–12, Diploma, UG & PG students across all streams (Post-Matric & Merit-cum-Means)',
    url: 'https://scholarships.gov.in/',
  },
  {
    category: 'Technical & Diploma Scholarship',
    title: 'AICTE Pragati (Girls) & Saksham Scholarship',
    whoFor: '₹50,000/year tuition & study support for B.Tech / Polytechnic Diploma first- & lateral-entry students',
    url: 'https://www.aicte-india.org/schemes/students-development-schemes',
  },
  {
    category: 'Education Loan & Financial Aid',
    title: 'PM-Vidyalaxmi Education Loan Portal',
    whoFor: 'Official single-window government portal for collateral-free student education loans & interest subsidies',
    url: 'https://pmvidyalaxmi.co.in/',
  },
  {
    category: 'Engineering & Science Entrance',
    title: 'NTA JEE Main & CUET (UG) Official Portal',
    whoFor: 'Admissions to NITs, IIITs, Central Universities (B.Sc, BA, B.Com, BBA) & engineering colleges',
    url: 'https://nta.ac.in/',
  },
  {
    category: 'Medical & Allied Healthcare Entrance',
    title: 'NEET (UG) Official Information Portal',
    whoFor: 'Single entrance exam for MBBS, BDS, AYUSH, Veterinary & B.Sc Nursing admissions across India',
    url: 'https://neet.nta.nic.in/',
  },
  {
    category: 'PG Engineering, MBA & Law Portals',
    title: 'GATE · CAT (IIMs) · CLAT Consortium',
    whoFor: 'Official portals for M.Tech/PSU recruitment (GATE), MBA at IIMs (CAT), and 5-Year NLUs Law (CLAT)',
    url: 'https://gate2025.iitr.ac.in/',
  },
];

export function StudyResourcesHub() {
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');
  const [formatFilter, setFormatFilter] = useState<ResourceFormatFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BEGINNER_STREAM_GUIDES.filter((guide) => {
      if (stageFilter !== 'all' && guide.stage !== stageFilter) return false;
      if (!q) return true;
      const haystack = [
        guide.title,
        guide.subjectsStudied.join(' '),
        guide.youtubeChannels.map((y) => `${y.name} ${y.bestFor} ${y.language}`).join(' '),
        guide.notesAndResources.map((n) => `${n.title} ${n.type} ${n.description}`).join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [stageFilter, searchQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Midnight Botanical Pavilion Header & Search Controls */}
      <section className="page-pavilion-banner rounded-3xl p-7 sm:p-10 space-y-7 text-white">
        <div className="space-y-2.5">
          <p className="text-sm font-bold tracking-wide text-teal-300">
            100% Free Notes, Textbooks, Scholarships &amp; YouTube Study Channels
          </p>
          <h1 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl font-extrabold text-white">
            Student Study Resources, Scholarships &amp; Best YouTube Directory
          </h1>
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed text-slate-200">
            Find official free textbooks (NCERT, ICAI, Bharat Skills, AICTE e-Kumbh), IIT/IIM free courses (NPTEL &amp; SWAYAM), government scholarships, and India&apos;s best YouTube study channels.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-center">
          {/* Search Input */}
          <div className="relative lg:col-span-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Physics, CA, Python, NCERT, UPSC..."
              className="w-full rounded-xl border border-white/25 bg-white py-3 pl-11 pr-4 text-[15px] text-slate-900 placeholder:text-slate-500 focus:border-teal-400 focus:outline-none"
            />
          </div>

          {/* Stage Segmented Filter */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 p-1.5 lg:col-span-5">
            {[
              { id: 'all' as StageFilter, label: 'All Stages' },
              { id: 'after_10th' as StageFilter, label: 'After 10th' },
              { id: 'after_12th' as StageFilter, label: 'After 12th' },
              { id: 'undergraduate' as StageFilter, label: 'College' },
              { id: 'graduate' as StageFilter, label: 'Graduate' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStageFilter(item.id)}
                className={`rounded-lg px-3.5 py-2 text-sm font-bold transition-colors ${
                  stageFilter === item.id
                    ? 'bg-teal-400 text-slate-950 shadow-xs'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Format Segmented Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 p-1.5 lg:col-span-2">
            {[
              { id: 'all' as ResourceFormatFilter, label: 'All' },
              { id: 'youtube' as ResourceFormatFilter, label: 'YouTube' },
              { id: 'notes' as ResourceFormatFilter, label: 'Notes' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setFormatFilter(fmt.id)}
                className={`flex-1 rounded-lg px-2.5 py-2 text-sm font-bold transition-colors ${
                  formatFilter === fmt.id
                    ? 'bg-teal-400 text-slate-950 shadow-xs'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Scholarships & National Exam Portals Section */}
      <section className="glass-card rounded-3xl p-7 sm:p-10 space-y-6">
        <div className="space-y-1.5">
          <p className="text-sm font-bold text-teal-800 flex items-center gap-2">
            <Award className="h-4 w-4" />
            <span>Financial Support &amp; Official Exam Registration</span>
          </p>
          <h2 className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl font-bold text-slate-950">
            Government Scholarships, Education Loans &amp; National Exam Portals
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SCHOLARSHIPS_AND_EXAMS.map((item) => (
            <div
              key={item.title}
              className="tinted-panel flex flex-col justify-between rounded-2xl p-5 space-y-4"
            >
              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{item.category}</span>
                </p>
                <h3 className="font-['Bricolage_Grotesque'] text-lg font-bold text-slate-950">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-slate-600">{item.whoFor}</p>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-800 hover:underline"
              >
                <span>Visit Official Portal</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Filtered Resource Cards by Stream */}
      {filteredGuides.length === 0 ? (
        <div className="glass-card rounded-3xl p-10 text-center text-base text-slate-600">
          No study resources matched &ldquo;{searchQuery}&rdquo;. Try clearing your search filter.
        </div>
      ) : (
        <div className="space-y-8">
          {filteredGuides.map((guide) => (
            <section
              key={guide.id}
              className="glass-card rounded-3xl p-7 sm:p-9 space-y-6"
            >
              <div className="border-b border-teal-900/10 pb-5">
                <p className="text-sm font-bold text-teal-800">
                  {guide.stage === 'after_10th'
                    ? 'After 10th (Class 11–12 / Diploma / ITI)'
                    : guide.stage === 'after_12th'
                      ? 'After 12th (UG Degrees & Entrance Prep)'
                      : guide.stage === 'undergraduate'
                        ? 'College / Undergraduate'
                        : 'Graduate & Career Transition'}
                </p>
                <h2 className="mt-1 font-['Bricolage_Grotesque'] text-2xl font-bold text-slate-950">
                  {guide.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {formatFilter !== 'notes' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                      <Youtube className="h-5 w-5 text-red-600" />
                      <span>Best YouTube Study Channels ({guide.youtubeChannels.length})</span>
                    </h3>
                    <div className="space-y-3.5">
                      {guide.youtubeChannels.map((ch) => (
                        <div
                          key={ch.name}
                          className="tinted-panel flex items-start justify-between gap-4 rounded-xl p-5"
                        >
                          <div className="space-y-1">
                            <p className="text-base font-bold text-slate-950">{ch.name}</p>
                            <p className="text-[15px] text-slate-600">{ch.bestFor}</p>
                            <p className="text-sm text-slate-500">Language: {ch.language}</p>
                          </div>
                          <a
                            href={ch.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-teal-800/20 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:border-teal-700 hover:text-teal-800 shrink-0"
                          >
                            <span>Channel</span>
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formatFilter !== 'youtube' && (
                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-950">
                      <BookOpen className="h-5 w-5 text-teal-700" />
                      <span>Free Notes, Books &amp; Courses ({guide.notesAndResources.length})</span>
                    </h3>
                    <div className="space-y-3.5">
                      {guide.notesAndResources.map((nr) => (
                        <div
                          key={nr.title}
                          className="tinted-panel flex items-start justify-between gap-4 rounded-xl p-5"
                        >
                          <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                              {nr.type}
                            </p>
                            <p className="text-base font-bold text-slate-950">{nr.title}</p>
                            <p className="text-[15px] text-slate-600">{nr.description}</p>
                          </div>
                          <a
                            href={nr.url}
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
                )}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
