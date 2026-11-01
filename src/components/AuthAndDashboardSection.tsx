import { useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Compass,
  History,
  LogOut,
  Trash2,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import type {
  AssessmentHistoryItem,
  AuthUser,
  SavedBookmarkItem,
} from '../types/authTypes';
import type { EducationLevel, SupportedLanguage } from '../types/sankalp';

interface AuthAndDashboardSectionProps {
  currentUser: AuthUser | null;
  savedItems: SavedBookmarkItem[];
  assessmentHistory: AssessmentHistoryItem[];
  onAuthSuccess: (payload: {
    user: AuthUser;
    token: string;
    savedItems: SavedBookmarkItem[];
    assessmentHistory: AssessmentHistoryItem[];
  }) => void;
  onLogout: () => void;
  onProfileUpdated: (user: AuthUser) => void;
  onRemoveSavedItem: (itemType: 'career' | 'stream', itemId: string) => void;
  onOpenStreams: (stage?: EducationLevel) => void;
  onOpenFinder: (stage?: EducationLevel, stream?: string) => void;
}

export function AuthAndDashboardSection({
  currentUser,
  savedItems,
  assessmentHistory,
  onAuthSuccess,
  onLogout,
  onProfileUpdated,
  onRemoveSavedItem,
  onOpenStreams,
  onOpenFinder,
}: AuthAndDashboardSectionProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('after_10th');
  const [currentStream, setCurrentStream] = useState('Class 10 Completed');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Profile edit state for logged-in user
  const [editName, setEditName] = useState(currentUser?.fullName || '');
  const [editStage, setEditStage] = useState<EducationLevel>(
    currentUser?.educationLevel || 'after_10th'
  );
  const [editStream, setEditStream] = useState(currentUser?.currentStream || '');
  const [editLang, setEditLang] = useState<SupportedLanguage>(
    currentUser?.preferredLanguage || 'en'
  );
  const [saveProfileMsg, setSaveProfileMsg] = useState<string | null>(null);

  const handleFillDemoAccount = () => {
    setMode('login');
    setEmail('demo@student.edu');
    setPassword('student123');
    setAuthError(null);
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const body =
        mode === 'login'
          ? { email, password }
          : {
              fullName,
              email,
              password,
              educationLevel,
              currentStream,
            };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed.');
      }
      onAuthSuccess(data);
      setEditName(data.user.fullName);
      setEditStage(data.user.educationLevel);
      setEditStream(data.user.currentStream);
      setEditLang(data.user.preferredLanguage);
    } catch (err: any) {
      setAuthError(err?.message || 'Unable to sign in right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveProfileMsg(null);
    const token = localStorage.getItem('sca_auth_token');
    if (!token) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editName,
          educationLevel: editStage,
          currentStream: editStream,
          preferredLanguage: editLang,
        }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onProfileUpdated(data.user);
        setSaveProfileMsg('Your student profile has been saved.');
      }
    } catch {
      setSaveProfileMsg('Could not update profile.');
    }
  };

  // ==================== SIGNED-OUT VIEW: LOGIN & SIGN UP ====================
  if (!currentUser) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
          {/* Left Midnight Botanical Showcase Column */}
          <div className="page-pavilion-banner lg:col-span-6 rounded-3xl p-8 sm:p-10 text-white flex flex-col justify-between space-y-8">
            <div className="space-y-5">
              <p className="text-sm font-bold tracking-wide text-teal-300">
                Personal Student Account · Saved Locally &amp; Securely
              </p>
              <h1 className="font-['Bricolage_Grotesque'] text-3xl sm:text-4xl font-extrabold text-white">
                Save Your Favorite Streams, Career Matches &amp; Roadmaps
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-slate-200">
                Create a free student account to bookmark streams after 10th or 12th, keep track of your Career Finder assessments, and pick up right where you left off.
              </p>

              <ul className="space-y-3.5 text-[15px] text-slate-100 pt-1">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-300 mt-0.5" />
                  <span>Bookmark Science, Commerce, Arts, Diploma, or Degree tracks for easy comparison with parents.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-300 mt-0.5" />
                  <span>Save top career matches along with salary ranges, required exams, and study links.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-teal-300 mt-0.5" />
                  <span>View your complete past Career Finder history anytime.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-sm p-5 space-y-2.5">
              <p className="text-sm font-bold text-teal-200">
                Testing or Demonstrating the Project?
              </p>
              <p className="text-sm text-slate-200 leading-relaxed">
                Click below to auto-fill our pre-seeded Demo Student account (<code className="font-mono text-teal-200">demo@student.edu</code> / <code className="font-mono text-teal-200">student123</code>), or create your own new account in seconds.
              </p>
              <button
                type="button"
                onClick={handleFillDemoAccount}
                className="mt-1 inline-flex items-center gap-2 rounded-xl bg-teal-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-teal-300"
              >
                <UserCheck className="h-4 w-4" />
                <span>Fill Demo Student Login</span>
              </button>
            </div>
          </div>

          {/* Right Frosted Glass Auth Form Card */}
          <div className="lg:col-span-6 flex">
            <div className="glass-card w-full rounded-3xl p-7 sm:p-10 space-y-6 flex flex-col justify-center">
              {/* Segmented Toggle: Log In vs Sign Up */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-teal-900/8 p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setAuthError(null);
                  }}
                  className={`rounded-lg py-2.5 text-[15px] font-semibold transition-colors ${
                    mode === 'login'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setAuthError(null);
                  }}
                  className={`rounded-lg py-2.5 text-[15px] font-semibold transition-colors ${
                    mode === 'signup'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <div>
                <h2 className="font-['Bricolage_Grotesque'] text-2xl font-bold text-slate-950">
                  {mode === 'login' ? 'Welcome Back' : 'Create Your Student Account'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {mode === 'login'
                    ? 'Enter your email and password to access your saved careers and history.'
                    : 'Takes less than 30 seconds—stored directly in the project database.'}
                </p>
              </div>

              {authError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                  {authError}
                </div>
              )}

              <form onSubmit={handleSubmitAuth} className="space-y-4">
                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-800">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g., Priya Verma"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-teal-700 focus:outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-800">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-teal-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-slate-800">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base text-slate-900 focus:border-teal-700 focus:outline-none"
                  />
                </div>

                {mode === 'signup' && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-800">
                        Current Class / Stage
                      </label>
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-[15px] text-slate-900"
                      >
                        <option value="after_10th">Just Passed 10th</option>
                        <option value="after_12th">Completed 12th / PUC</option>
                        <option value="undergraduate">In College (UG)</option>
                        <option value="graduate">Graduated</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-slate-800">
                        Current / Interested Stream
                      </label>
                      <input
                        type="text"
                        value={currentStream}
                        onChange={(e) => setCurrentStream(e.target.value)}
                        placeholder="e.g., Science PCM, Commerce"
                        className="w-full rounded-xl border border-slate-300 px-3.5 py-3 text-[15px] text-slate-900"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-teal-700 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-teal-800 disabled:opacity-50"
                >
                  {isLoading
                    ? 'Please wait...'
                    : mode === 'login'
                      ? 'Sign In to My Account'
                      : 'Create Student Account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SIGNED-IN VIEW: STUDENT DASHBOARD ====================
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      {/* Top Midnight Botanical Profile Banner */}
      <section className="page-pavilion-banner rounded-3xl p-7 sm:p-10 text-white">
        <div className="flex flex-col justify-between gap-6 border-b border-white/15 pb-6 sm:flex-row sm:items-center">
          <div className="space-y-1.5">
            <p className="text-sm font-bold tracking-wide text-teal-300">Student Account Dashboard</p>
            <h1 className="font-['Bricolage_Grotesque'] text-2xl sm:text-3xl font-extrabold text-white">
              Welcome, {currentUser.fullName}
            </h1>
            <p className="text-[15px] text-slate-200">
              {currentUser.email} · Stage: {currentUser.educationLevel.replace('_', ' ')} ·{' '}
              {currentUser.currentStream || 'Exploring Streams'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onOpenFinder(currentUser.educationLevel, currentUser.currentStream)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-5 py-3 text-[15px] font-bold text-slate-950 hover:bg-teal-300"
            >
              <Compass className="h-4 w-4" />
              <span>Start Career Finder</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-[15px] font-semibold text-white hover:bg-white/18"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Update Profile Details Form */}
        <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
          <h2 className="font-['Bricolage_Grotesque'] text-lg font-bold text-teal-200">
            Update Your Academic Stage &amp; Preferences
          </h2>

          {saveProfileMsg && (
            <div className="rounded-xl border border-teal-300/40 bg-teal-400/20 px-4 py-2.5 text-sm font-semibold text-white">
              {saveProfileMsg}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-200">Full Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white px-3.5 py-2.5 text-[15px] text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-200">Current Stage</label>
              <select
                value={editStage}
                onChange={(e) => setEditStage(e.target.value as EducationLevel)}
                className="w-full rounded-xl border border-white/20 bg-white px-3.5 py-2.5 text-[15px] text-slate-900"
              >
                <option value="after_10th">Just Passed 10th</option>
                <option value="after_12th">Completed 12th / PUC</option>
                <option value="undergraduate">In College (UG)</option>
                <option value="graduate">Graduated</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-200">Stream / Degree</label>
              <input
                type="text"
                value={editStream}
                onChange={(e) => setEditStream(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white px-3.5 py-2.5 text-[15px] text-slate-900"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-white px-4 py-2.5 text-[15px] font-bold text-slate-950 hover:bg-teal-50"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* Saved Bookmarks & Past Assessment History */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Saved Streams & Careers */}
        <section className="glass-card rounded-3xl p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950 flex items-center gap-2.5">
              <Bookmark className="h-5 w-5 text-teal-700" />
              <span>Saved Streams &amp; Careers ({savedItems.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => onOpenStreams(currentUser.educationLevel)}
              className="text-sm font-semibold text-teal-800 hover:underline"
            >
              Browse More →
            </button>
          </div>

          {savedItems.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-[15px] text-slate-600 space-y-3">
              <p>You have not bookmarked any streams or careers yet.</p>
              <button
                type="button"
                onClick={() => onOpenStreams(currentUser.educationLevel)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:underline"
              >
                <span>Explore Streams &amp; Click &ldquo;Save&rdquo;</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                      Saved {item.itemType}
                    </p>
                    <h3 className="text-base font-bold text-slate-950">{item.itemTitle}</h3>
                    {item.itemSubtitle && (
                      <p className="text-sm text-slate-600">{item.itemSubtitle}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveSavedItem(item.itemType, item.itemId)}
                    title="Remove bookmark"
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:border-red-300 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past Career Finder Assessments */}
        <section className="glass-card rounded-3xl p-7 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-['Bricolage_Grotesque'] text-xl font-bold text-slate-950 flex items-center gap-2.5">
              <History className="h-5 w-5 text-teal-700" />
              <span>Past Career Finder Runs ({assessmentHistory.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => onOpenFinder(currentUser.educationLevel)}
              className="text-sm font-semibold text-teal-800 hover:underline"
            >
              New Assessment →
            </button>
          </div>

          {assessmentHistory.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-[15px] text-slate-600 space-y-3">
              <p>
                Whenever you run the Career Finder while signed in, your matched careers and scores are saved automatically here.
              </p>
              <button
                type="button"
                onClick={() => onOpenFinder(currentUser.educationLevel)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 hover:underline"
              >
                <span>Take the 2-Minute Career Finder Now</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {assessmentHistory.map((h) => (
                <div
                  key={h.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-900">
                      Top Match: {h.summaryItems[0]?.title || h.topCareerId}
                    </span>
                    <span className="font-mono font-bold text-teal-800 tabular-nums">
                      {h.topScore.toFixed(0)}% Fit
                    </span>
                  </div>
                  {h.summaryItems.length > 1 && (
                    <p className="text-sm text-slate-600">
                      Also matched:{' '}
                      {h.summaryItems
                        .slice(1)
                        .map((s) => `${s.title || s.id} (${s.score.toFixed(0)}%)`)
                        .join(' · ')}
                    </p>
                  )}
                  <p className="text-xs text-slate-500">Recorded on {h.createdAt} UTC</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
