import { useEffect, useState } from 'react';
import { Globe, MessageCircle, Palette } from 'lucide-react';
import { Navbar, type ActiveTab } from './components/Navbar';
import { HeroOverview } from './components/HeroOverview';
import { StreamExplorerSection } from './components/StreamExplorerSection';
import { Step3Assessment } from './components/Step3Assessment';
import { Step4Recommendations } from './components/Step4Recommendations';
import { Step5RoadmapAndGraph } from './components/Step5RoadmapAndGraph';
import { StudyResourcesHub } from './components/StudyResourcesHub';
import { ProjectShowcaseForGuide } from './components/ProjectShowcaseForGuide';
import { AuthAndDashboardSection } from './components/AuthAndDashboardSection';
import { CareerChatbot } from './components/CareerChatbot';
import { DEMO_STUDENT_PERSONAS } from './data/samplePersonas';
import type {
  AssessmentHistoryItem,
  AuthUser,
  SavedBookmarkItem,
} from './types/authTypes';
import type { ExperimentSummary } from './types/experimentTypes';
import type {
  EducationLevel,
  RecommendationResponse,
  StudentProfile,
  SupportedLanguage,
} from './types/sankalp';

type FinderStageView = 'assessment' | 'results' | 'roadmap';
type CanvasAmbience = 'aurora' | 'sapphire' | 'sunlit';

const AUTH_TOKEN_STORAGE_KEY = 'sca_auth_token';
const CANVAS_THEME_STORAGE_KEY = 'sca_canvas_theme';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [explorerStage, setExplorerStage] = useState<EducationLevel>('after_10th');
  const [finderView, setFinderView] = useState<FinderStageView>('assessment');
  const [canvasTheme, setCanvasTheme] = useState<CanvasAmbience>(() => {
    try {
      const saved = localStorage.getItem(CANVAS_THEME_STORAGE_KEY);
      if (saved === 'aurora' || saved === 'sapphire' || saved === 'sunlit') {
        return saved;
      }
    } catch {
      // Ignore storage read error
    }
    return 'aurora';
  });

  // Student Authentication & SQLite Persistence State
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [savedItems, setSavedItems] = useState<SavedBookmarkItem[]>([]);
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentHistoryItem[]>([]);
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const [profile, setProfile] = useState<StudentProfile>(() => ({
    ...DEMO_STUDENT_PERSONAS[0].profile,
    educationLevel: 'after_10th',
    currentStream: 'Class 10 Completed',
    sessionId: `sess_${Date.now()}`,
  }));

  const [recommendationResponse, setRecommendationResponse] =
    useState<RecommendationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRoadmapCareerId, setSelectedRoadmapCareerId] = useState<string>('');
  const [comparedCareerIds, setComparedCareerIds] = useState<string[]>([]);
  const [feedbackStatus, setFeedbackStatus] = useState<string | null>(null);

  // Career Mentor Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatStreamId, setActiveChatStreamId] = useState<string | undefined>(undefined);
  const [queuedChatQuestion, setQueuedChatQuestion] = useState<string | null>(null);

  // Research & Guide Showcase state
  const [experimentData, setExperimentData] = useState<ExperimentSummary | null>(null);
  const [liveAnalytics, setLiveAnalytics] = useState<any>(null);

  const refreshResearchData = () => {
    fetch('/api/research-results')
      .then((res) => res.json())
      .then((data) => {
        if (data.experimentData) setExperimentData(data.experimentData);
        if (data.liveAnalytics) setLiveAnalytics(data.liveAnalytics);
      })
      .catch(() => {});
  };

  const fetchAccountSession = async (tokenToUse: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      if (!res.ok) {
        localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
        setAuthToken(null);
        setCurrentUser(null);
        return;
      }
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setSavedItems(data.savedItems || []);
        setAssessmentHistory(data.assessmentHistory || []);
      }
    } catch {
      // Keep current state if network transiently busy
    }
  };

  useEffect(() => {
    refreshResearchData();
    if (authToken) {
      fetchAccountSession(authToken);
    }
  }, []);

  const showTemporaryNotice = (msg: string) => {
    setBannerNotice(msg);
    window.setTimeout(() => {
      setBannerNotice((prev) => (prev === msg ? null : prev));
    }, 4500);
  };

  const updateProfile = (patch: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  };

  const handleLanguageChange = (lang: SupportedLanguage) => {
    updateProfile({ language: lang });
  };

  const handleCanvasThemeChange = (theme: CanvasAmbience) => {
    setCanvasTheme(theme);
    try {
      localStorage.setItem(CANVAS_THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage write error
    }
  };

  const handleAuthSuccess = (payload: {
    user: AuthUser;
    token: string;
    savedItems: SavedBookmarkItem[];
    assessmentHistory: AssessmentHistoryItem[];
  }) => {
    try {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, payload.token);
    } catch {
      // Ignore storage quota issues
    }
    setAuthToken(payload.token);
    setCurrentUser(payload.user);
    setSavedItems(payload.savedItems);
    setAssessmentHistory(payload.assessmentHistory);
    updateProfile({
      educationLevel: payload.user.educationLevel,
      currentStream: payload.user.currentStream,
      language: payload.user.preferredLanguage,
    });
    showTemporaryNotice(`Welcome, ${payload.user.fullName}! Your account is active.`);
    refreshResearchData();
  };

  const handleLogout = async () => {
    if (authToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch {
        // Ignore network error on logout
      }
    }
    try {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    setAuthToken(null);
    setCurrentUser(null);
    setSavedItems([]);
    setAssessmentHistory([]);
    showTemporaryNotice('Signed out cleanly.');
  };

  const handleToggleSaveItem = async (
    itemType: 'career' | 'stream',
    itemId: string,
    itemTitle: string,
    itemSubtitle: string
  ) => {
    if (!authToken || !currentUser) {
      setBannerNotice(
        'Sign in (or click "Fill Demo Student Login") to save streams and careers to your student dashboard.'
      );
      setActiveTab('account');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const exists = savedItems.some(
      (item) => item.itemType === itemType && item.itemId === itemId
    );

    try {
      if (exists) {
        const res = await fetch(
          `/api/saved-items/${itemType}/${encodeURIComponent(itemId)}`,
          {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const data = await res.json();
        if (res.ok && data.savedItems) {
          setSavedItems(data.savedItems);
          showTemporaryNotice(`Removed "${itemTitle}" from your saved bookmarks.`);
          refreshResearchData();
        }
      } else {
        const res = await fetch('/api/saved-items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            itemType,
            itemId,
            itemTitle,
            itemSubtitle,
          }),
        });
        const data = await res.json();
        if (res.ok && data.savedItems) {
          setSavedItems(data.savedItems);
          showTemporaryNotice(`Saved "${itemTitle}" to your student account!`);
          refreshResearchData();
        }
      }
    } catch {
      showTemporaryNotice('Unable to update bookmark right now.');
    }
  };

  const handleRemoveSavedItem = async (itemType: 'career' | 'stream', itemId: string) => {
    if (!authToken) return;
    try {
      const res = await fetch(
        `/api/saved-items/${itemType}/${encodeURIComponent(itemId)}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      if (res.ok && data.savedItems) {
        setSavedItems(data.savedItems);
        refreshResearchData();
      }
    } catch {
      // Ignore transient error
    }
  };

  const handleExploreStage = (stage: EducationLevel) => {
    setExplorerStage(stage);
    setActiveTab('streams');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFinder = (stage?: EducationLevel, streamName?: string) => {
    if (stage || streamName) {
      updateProfile({
        ...(stage ? { educationLevel: stage } : {}),
        ...(streamName ? { currentStream: streamName } : {}),
      });
    }
    setActiveTab('finder');
    setFinderView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenChat = (initialQuestion?: string, streamId?: string) => {
    if (streamId) setActiveChatStreamId(streamId);
    if (initialQuestion) setQueuedChatQuestion(initialQuestion);
    setIsChatOpen(true);
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setFeedbackStatus(null);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
      }
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          profile,
          modelVariant: 'improved_sankalp',
          topN: 6,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to compute recommendations.');
      }
      const typed = data as RecommendationResponse;
      setRecommendationResponse(typed);
      if (typed.recommendations.length > 0) {
        setSelectedRoadmapCareerId(typed.recommendations[0].career.id);
        setComparedCareerIds(typed.recommendations.slice(0, 3).map((r) => r.career.id));
      }
      setFinderView('results');
      refreshResearchData();
      if (authToken) {
        fetchAccountSession(authToken);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Unable to generate recommendations.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedback = async (
    careerId: string,
    action: 'accept' | 'reject',
    rating?: number
  ) => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: profile.sessionId,
          careerId,
          action,
          rating,
          profile,
        }),
      });
      const data = await res.json();
      if (res.ok && data.refreshedRecommendations) {
        setProfile(data.updatedProfile);
        setRecommendationResponse(data.refreshedRecommendations);
        setFeedbackStatus(
          action === 'accept'
            ? 'Saved to your liked options! Your career recommendations have been tailored further to match this preference.'
            : 'Got it! Similar options were adjusted and fresh career matches have been prioritized for you.'
        );
        refreshResearchData();
      }
    } catch {
      setFeedbackStatus('Could not save your preference right now.');
    }
  };

  const toggleCompareCareer = (careerId: string) => {
    setComparedCareerIds((prev) => {
      if (prev.includes(careerId)) {
        return prev.filter((id) => id !== careerId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), careerId];
      }
      return [...prev, careerId];
    });
  };

  return (
    <div data-canvas={canvasTheme} className="app-canvas min-h-screen flex flex-col text-slate-900">
      <div className="no-print">
        <Navbar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentUser={currentUser}
        />

        {/* Frosted Utility Strip: Language + Background Ambience + Quick Mentor Trigger */}
        <div className="frosted-utility">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-700">
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-teal-700 shrink-0" />
                <span className="font-semibold text-slate-800">Language:</span>
                {(
                  [
                    { code: 'en', label: 'English' },
                    { code: 'hi', label: 'हिन्दी' },
                    { code: 'kn', label: 'ಕನ್ನಡ' },
                  ] as Array<{ code: SupportedLanguage; label: string }>
                ).map((langOpt) => (
                  <button
                    key={langOpt.code}
                    type="button"
                    onClick={() => handleLanguageChange(langOpt.code)}
                    className={`rounded-lg px-2.5 py-1 text-sm font-semibold transition-colors ${
                      profile.language === langOpt.code
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white/80 hover:text-slate-950'
                    }`}
                  >
                    {langOpt.label}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-1.5 border-l border-teal-900/15 pl-5">
                <Palette className="h-4 w-4 text-teal-700 shrink-0" />
                <span className="font-semibold text-slate-800">Theme:</span>
                {(
                  [
                    { id: 'aurora', label: 'Aurora Mint' },
                    { id: 'sapphire', label: 'Sky Sapphire' },
                    { id: 'sunlit', label: 'Sunlit Sand' },
                  ] as Array<{ id: CanvasAmbience; label: string }>
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleCanvasThemeChange(opt.id)}
                    className={`rounded-lg px-2.5 py-1 text-sm font-semibold transition-colors ${
                      canvasTheme === opt.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-white/80 hover:text-slate-950'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {bannerNotice && (
                <p className="text-sm font-semibold text-teal-900">{bannerNotice}</p>
              )}

              <button
                type="button"
                onClick={() => handleOpenChat()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-900/8 px-3 py-1 text-sm font-bold text-teal-900 transition-colors hover:bg-teal-900/15 hover:text-teal-950"
              >
                <MessageCircle className="h-4 w-4 text-teal-700" />
                <span>Ask AI Career Mentor</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        {activeTab === 'home' && (
          <HeroOverview
            language={profile.language}
            onExploreStage={handleExploreStage}
            onStartFinder={(stage) => handleStartFinder(stage)}
            onOpenResources={() => {
              setActiveTab('resources');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenChat={(q) => handleOpenChat(q)}
          />
        )}

        {activeTab === 'streams' && (
          <StreamExplorerSection
            initialStage={explorerStage}
            savedItems={savedItems}
            onToggleSaveStream={(streamId, title, subtitle) =>
              handleToggleSaveItem('stream', streamId, title, subtitle)
            }
            onSelectStageForFinder={(stage, streamTitle) => handleStartFinder(stage, streamTitle)}
            onAskMentorAboutStream={(streamTitle, streamId) =>
              handleOpenChat(
                `Can you explain ${streamTitle} simply — subjects, next degrees like B.Tech or MBA, job salaries, and how I should start preparing?`,
                streamId
              )
            }
          />
        )}

        {activeTab === 'finder' && (
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
            {/* Architectural Pavilion Header + 3-Step Career Finder Progress Bar */}
            <div className="page-pavilion-banner rounded-3xl p-7 sm:p-9 space-y-6 text-white no-print">
              <div className="space-y-2">
                <p className="text-sm font-bold tracking-wide text-teal-300">
                  Personalized AI Stream, Degree &amp; Career Discovery
                </p>
                <h1 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl font-extrabold text-white">
                  Find Your Best-Fit Stream, Career &amp; Step-by-Step Study Plan
                </h1>
                <p className="max-w-3xl text-base leading-relaxed text-slate-200">
                  Complete three simple steps to match your stage, interests, and favorite subjects with realistic salaries, backup routes, free notes, and top YouTube educators.
                </p>
              </div>

              <nav
                aria-label="Career Finder Progress"
                className="grid grid-cols-1 gap-4 sm:grid-cols-3"
              >
                {[
                  {
                    id: 'assessment' as FinderStageView,
                    step: 'Step 01',
                    label: 'Your Stage, Interests & Subjects',
                    enabled: true,
                  },
                  {
                    id: 'results' as FinderStageView,
                    step: 'Step 02',
                    label: 'Best Streams & Career Matches',
                    enabled: Boolean(recommendationResponse),
                  },
                  {
                    id: 'roadmap' as FinderStageView,
                    step: 'Step 03',
                    label: 'Roadmap, Free Notes & YouTube',
                    enabled: Boolean(recommendationResponse),
                  },
                ].map((item) => {
                  const current = finderView === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!item.enabled}
                      onClick={() => setFinderView(item.id)}
                      className={`rounded-2xl border px-5 py-4 text-left transition-all disabled:opacity-40 ${
                        current
                          ? 'border-teal-300 bg-white text-slate-950 shadow-md'
                          : 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                      }`}
                    >
                      <p
                        className={`font-mono text-sm font-bold ${
                          current ? 'text-teal-800' : 'text-teal-300'
                        }`}
                      >
                        {item.step}
                      </p>
                      <p
                        className={`mt-0.5 font-['Bricolage_Grotesque'] text-base font-bold ${
                          current ? 'text-slate-950' : 'text-white'
                        }`}
                      >
                        {item.label}
                      </p>
                    </button>
                  );
                })}
              </nav>
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50/95 px-5 py-4 text-[15px] font-medium text-red-800">
                {errorMessage}
              </div>
            )}

            {finderView === 'assessment' && (
              <Step3Assessment
                profile={profile}
                isSubmitting={isSubmitting}
                onUpdateProfile={updateProfile}
                onExploreStreamsFirst={() => handleExploreStage(profile.educationLevel)}
                onSubmitAssessment={handleSubmitAssessment}
              />
            )}

            {finderView === 'results' && recommendationResponse && (
              <Step4Recommendations
                profile={profile}
                response={recommendationResponse}
                selectedRoadmapCareerId={selectedRoadmapCareerId}
                comparedCareerIds={comparedCareerIds}
                savedItems={savedItems}
                feedbackStatus={feedbackStatus}
                onSelectRoadmapCareer={setSelectedRoadmapCareerId}
                onToggleCompareCareer={toggleCompareCareer}
                onToggleSaveCareer={(careerId, title, subtitle) =>
                  handleToggleSaveItem('career', careerId, title, subtitle)
                }
                onFeedback={handleFeedback}
                onBackToAssessment={() => setFinderView('assessment')}
                onProceedToRoadmap={(careerId) => {
                  if (careerId) setSelectedRoadmapCareerId(careerId);
                  setFinderView('roadmap');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onAskMentorQuestion={(q) => handleOpenChat(q)}
              />
            )}

            {finderView === 'roadmap' && recommendationResponse && (
              <Step5RoadmapAndGraph
                profile={profile}
                response={recommendationResponse}
                selectedCareerId={selectedRoadmapCareerId}
                comparedCareerIds={comparedCareerIds}
                onSelectCareer={setSelectedRoadmapCareerId}
                onBackToRecommendations={() => setFinderView('results')}
                onAskMentorQuestion={(q) => handleOpenChat(q)}
              />
            )}
          </div>
        )}

        {activeTab === 'resources' && <StudyResourcesHub />}

        {activeTab === 'guide_report' && (
          <ProjectShowcaseForGuide
            experimentData={experimentData}
            liveAnalytics={liveAnalytics}
          />
        )}

        {activeTab === 'account' && (
          <AuthAndDashboardSection
            currentUser={currentUser}
            savedItems={savedItems}
            assessmentHistory={assessmentHistory}
            onAuthSuccess={handleAuthSuccess}
            onLogout={handleLogout}
            onProfileUpdated={(updatedUser) => {
              setCurrentUser(updatedUser);
              updateProfile({
                educationLevel: updatedUser.educationLevel,
                currentStream: updatedUser.currentStream,
                language: updatedUser.preferredLanguage,
              });
            }}
            onRemoveSavedItem={handleRemoveSavedItem}
            onOpenStreams={(stage) => {
              if (stage) setExplorerStage(stage);
              setActiveTab('streams');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFinder={(stage, stream) => handleStartFinder(stage, stream)}
          />
        )}
      </main>

      {/* Midnight Botanical Architectural Footer */}
      <footer className="footer-pavilion border-t border-white/10 py-12 text-slate-300 no-print">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-4 text-sm sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="space-y-1">
            <p className="font-['Bricolage_Grotesque'] text-lg font-bold text-white">
              Smart Career Advisor
            </p>
            <p className="text-sm text-slate-300">
              Stream, Degree, Skill &amp; Career Guidance Platform for Indian Students
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-200">
            <button
              type="button"
              onClick={() => {
                setActiveTab('streams');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-teal-300 hover:underline"
            >
              Explore Streams
            </button>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setActiveTab('finder');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-teal-300 hover:underline"
            >
              Career Finder
            </button>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setActiveTab('resources');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-teal-300 hover:underline"
            >
              Study Hub &amp; Scholarships
            </button>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setActiveTab('account');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-teal-300 hover:underline"
            >
              {currentUser ? 'My Account' : 'Sign In / Sign Up'}
            </button>
            <span className="text-slate-500" aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => {
                setActiveTab('guide_report');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="font-bold text-teal-300 hover:text-teal-200 hover:underline"
            >
              Project Report (For Guide)
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Career Mentor Chatbot */}
      <div className="no-print">
        <CareerChatbot
          isOpen={isChatOpen}
          onToggleOpen={setIsChatOpen}
          language={profile.language}
          profile={profile}
          activeStreamId={activeChatStreamId}
          queuedQuestion={queuedChatQuestion}
          onClearQueuedQuestion={() => setQueuedChatQuestion(null)}
        />
      </div>
    </div>
  );
}
