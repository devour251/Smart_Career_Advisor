import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { CAREER_BY_ID, CAREER_REPOSITORY, getRepositoryStatistics } from './src/data/careerRepository';
import { EDUCATION_PATHWAY_OPTIONS } from './src/data/educationPathways';
import { BEGINNER_STREAM_GUIDES } from './src/data/streamStudyGuide';
import {
  addSavedItemForUser,
  authenticateUser,
  createUserAccount,
  getAssessmentHistoryForUser,
  getLiveSystemAnalytics,
  getSavedItemsForUser,
  getUserBySessionToken,
  loadPersistedQSnapshot,
  logRecommendationRun,
  logUserFeedback,
  removeSavedItemForUser,
  revokeSessionToken,
  savePersistedQSnapshot,
  updateUserProfileRecord,
} from './src/db/database';
import { answerCareerAdvisorChat, type ChatAdvisorRequest } from './src/engine/chatAdvisorModule';
import { generateCareerRecommendations } from './src/engine/hybridRecommender';
import { imputeMissingProfileAttributes } from './src/engine/knowledgeGraphModule';
import {
  getQStateSnapshot,
  loadQStateSnapshot,
  updateQLearningFromFeedback,
} from './src/engine/qLearningModule';
import { ensureSbertInitialized } from './src/engine/sbertModule';
import { analyzeStudentEmotion } from './src/engine/vaderEmotionModule';
import type {
  EducationLevel,
  FeedbackPayload,
  ModelVariant,
  StudentProfile,
  SupportedLanguage,
} from './src/types/sankalp';

const DOC_FILES: Array<{ slug: string; title: string; filename: string; category: string }> = [
  { slug: 'laptop-setup-guide', title: 'Laptop Setup, Database & Login Guide', filename: 'LAPTOP_SETUP_GUIDE.md', category: 'Setup & Guide' },
  { slug: 'readme', title: 'Project Overview & Setup (README)', filename: 'README.md', category: 'Setup & Guide' },
  { slug: 'ieee-paper-analysis', title: 'IEEE Sankalp Paper Analysis', filename: 'IEEE_PAPER_ANALYSIS.md', category: 'Research Baseline' },
  { slug: 'limitations-and-improvements', title: 'Paper Limitations & Proposed Solutions', filename: 'LIMITATIONS_AND_IMPROVEMENTS.md', category: 'Methodology' },
  { slug: 'system-architecture', title: 'Three-Layer & Multi-Agent Architecture', filename: 'SYSTEM_ARCHITECTURE.md', category: 'Architecture' },
  { slug: 'dataset-and-methodology', title: 'Dataset Provenance & Evaluation Protocol', filename: 'DATASET_AND_METHODOLOGY.md', category: 'Evaluation' },
  { slug: 'paper-vs-proposed', title: 'Original Paper vs. Improved Engine', filename: 'PAPER_VS_PROPOSED_SYSTEM.md', category: 'Comparison' },
  { slug: 'experimental-results', title: 'Measured Experimental Results & Ablations', filename: 'EXPERIMENTAL_RESULTS.md', category: 'Evaluation' },
  { slug: 'project-report', title: 'Complete B.Tech Major Project Report', filename: 'PROJECT_REPORT.md', category: 'Academic Report' },
  { slug: 'viva-preparation', title: 'Viva-Voce Q&A Preparation Guide', filename: 'VIVA_PREPARATION.md', category: 'Viva Defense' },
];

function extractBearerToken(req: express.Request): string | null {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7).trim();
  }
  return null;
}

function restoreLearnedQPolicy(): void {
  const persisted = loadPersistedQSnapshot();
  if (persisted) {
    loadQStateSnapshot(persisted);
    return;
  }
  const snapshotPath = path.resolve(process.cwd(), 'src/data/trainedQSnapshot.json');
  if (fs.existsSync(snapshotPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(snapshotPath, 'utf-8'));
      loadQStateSnapshot(parsed);
      savePersistedQSnapshot(getQStateSnapshot());
    } catch (err) {
      console.warn('Could not parse trainedQSnapshot.json:', err);
    }
  }
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  restoreLearnedQPolicy();

  let sbertReady = false;
  ensureSbertInitialized()
    .then(() => {
      sbertReady = true;
      console.log('[Smart Career Advisor] Semantic career embeddings (85 careers) ready.');
    })
    .catch((err) => {
      console.error('[Smart Career Advisor] Embedding warm-up error:', err);
    });

  const publicResultsDir = path.resolve(process.cwd(), 'public/results');
  if (fs.existsSync(publicResultsDir)) {
    app.use('/results', express.static(publicResultsDir));
  }

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      sbertReady,
      repository: getRepositoryStatistics(),
      pathwayCount: EDUCATION_PATHWAY_OPTIONS.length,
      streamGuideCount: BEGINNER_STREAM_GUIDES.length,
      liveAnalytics: getLiveSystemAnalytics(),
    });
  });

  // ==================== AUTHENTICATION & STUDENT DASHBOARD API ====================
  app.post('/api/auth/signup', (req, res) => {
    try {
      const { fullName, email, password, educationLevel, currentStream, preferredLanguage } = req.body || {};
      if (!fullName || String(fullName).trim().length < 2) {
        res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
        return;
      }
      if (!email || !String(email).includes('@')) {
        res.status(400).json({ error: 'Please enter a valid email address.' });
        return;
      }
      if (!password || String(password).length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long.' });
        return;
      }

      const { user, token } = createUserAccount({
        fullName: String(fullName),
        email: String(email),
        password: String(password),
        educationLevel: educationLevel as EducationLevel,
        currentStream: currentStream ? String(currentStream) : undefined,
        preferredLanguage: preferredLanguage as SupportedLanguage,
      });

      res.json({
        user,
        token,
        savedItems: [],
        assessmentHistory: [],
      });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Unable to create account.' });
    }
  });

  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body || {};
      if (!email || !password) {
        res.status(400).json({ error: 'Please enter both email and password.' });
        return;
      }
      const { user, token } = authenticateUser(String(email), String(password));
      res.json({
        user,
        token,
        savedItems: getSavedItemsForUser(user.id),
        assessmentHistory: getAssessmentHistoryForUser(user.id),
      });
    } catch (err: any) {
      res.status(401).json({ error: err?.message || 'Invalid login credentials.' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = extractBearerToken(req);
    if (token) revokeSessionToken(token);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const token = extractBearerToken(req);
    const user = getUserBySessionToken(token);
    if (!user) {
      res.json({ user: null, savedItems: [], assessmentHistory: [] });
      return;
    }
    res.json({
      user,
      savedItems: getSavedItemsForUser(user.id),
      assessmentHistory: getAssessmentHistoryForUser(user.id),
    });
  });

  app.patch('/api/auth/profile', (req, res) => {
    const token = extractBearerToken(req);
    const user = getUserBySessionToken(token);
    if (!user) {
      res.status(401).json({ error: 'Please sign in to update your profile.' });
      return;
    }
    try {
      const updated = updateUserProfileRecord(user.id, req.body || {});
      res.json({ user: updated });
    } catch (err: any) {
      res.status(400).json({ error: err?.message || 'Could not update profile.' });
    }
  });

  app.post('/api/saved-items', (req, res) => {
    const token = extractBearerToken(req);
    const user = getUserBySessionToken(token);
    if (!user) {
      res.status(401).json({ error: 'Please sign in to save bookmarks to your account.' });
      return;
    }
    const { itemType, itemId, itemTitle, itemSubtitle } = req.body || {};
    if (!itemType || !itemId || !itemTitle) {
      res.status(400).json({ error: 'itemType, itemId, and itemTitle are required.' });
      return;
    }
    const savedItems = addSavedItemForUser({
      userId: user.id,
      itemType,
      itemId,
      itemTitle,
      itemSubtitle,
    });
    res.json({ savedItems });
  });

  app.delete('/api/saved-items/:itemType/:itemId', (req, res) => {
    const token = extractBearerToken(req);
    const user = getUserBySessionToken(token);
    if (!user) {
      res.status(401).json({ error: 'Please sign in first.' });
      return;
    }
    const itemType = req.params.itemType as 'career' | 'stream';
    const itemId = req.params.itemId;
    const savedItems = removeSavedItemForUser(user.id, itemType, itemId);
    res.json({ savedItems });
  });

  // ==================== STREAM GUIDES, CHAT & CAREER ENGINE API ====================
  app.get('/api/pathways', (req, res) => {
    const level = req.query.level as EducationLevel | undefined;
    const items = level
      ? EDUCATION_PATHWAY_OPTIONS.filter((p) => p.level === level)
      : EDUCATION_PATHWAY_OPTIONS;
    res.json({ pathways: items });
  });

  app.get('/api/stream-guides', (req, res) => {
    const stage = req.query.stage as EducationLevel | undefined;
    const guides = stage
      ? BEGINNER_STREAM_GUIDES.filter((g) => g.stage === stage)
      : BEGINNER_STREAM_GUIDES;
    res.json({ guides });
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const payload = req.body as ChatAdvisorRequest;
      if (!payload || !payload.message || !payload.message.trim()) {
        res.status(400).json({ error: 'Please enter a question.' });
        return;
      }
      const chatReply = await answerCareerAdvisorChat(payload);
      res.json(chatReply);
    } catch (err: any) {
      console.error('Error in /api/chat:', err);
      res.status(500).json({
        error: err?.message || 'Unable to generate mentor response right now. Please try again.',
      });
    }
  });

  app.get('/api/careers', (_req, res) => {
    res.json({
      stats: getRepositoryStatistics(),
      careers: CAREER_REPOSITORY,
    });
  });

  app.post('/api/recommend', async (req, res) => {
    try {
      const profile = req.body.profile as StudentProfile;
      const modelVariant = (req.body.modelVariant as ModelVariant) || 'improved_sankalp';
      const topN = Number(req.body.topN) || 6;

      if (!profile || !profile.educationLevel) {
        res.status(400).json({ error: 'Valid student profile with educationLevel is required.' });
        return;
      }

      const authUser = getUserBySessionToken(extractBearerToken(req));

      const safeProfile: StudentProfile = {
        ...profile,
        sessionId: profile.sessionId || `sess_${Date.now()}`,
        language: profile.language || 'en',
        inputMode: profile.inputMode || 'text',
        cohort: profile.cohort || 'urban',
        preferredSubjects: profile.preferredSubjects || [],
        interests: profile.interests || [],
        skills: profile.skills || [],
        subjectMarks: profile.subjectMarks || {},
        aptitudeScores: profile.aptitudeScores || {},
        riasecScores: profile.riasecScores || {},
        acceptedCareers: profile.acceptedCareers || [],
        rejectedCareers: profile.rejectedCareers || [],
      };

      const recommendationResponse = await generateCareerRecommendations(
        safeProfile,
        modelVariant,
        topN
      );
      logRecommendationRun(safeProfile, recommendationResponse, authUser?.id ?? null);
      res.json(recommendationResponse);
    } catch (err: any) {
      console.error('Error in /api/recommend:', err);
      res.status(500).json({ error: err?.message || 'Failed to compute career recommendations.' });
    }
  });

  app.post('/api/compare-models', async (req, res) => {
    try {
      const profile = req.body.profile as StudentProfile;
      if (!profile || !profile.educationLevel) {
        res.status(400).json({ error: 'Valid student profile is required.' });
        return;
      }
      const variants: ModelVariant[] = [
        'rule_only',
        'sbert_only',
        'original_sankalp',
        'improved_sankalp',
      ];
      const comparisons = await Promise.all(
        variants.map(async (v) => {
          const out = await generateCareerRecommendations(profile, v, 3);
          return {
            model: v,
            latencyMs: out.latencyMs,
            top3: out.recommendations.map((r) => ({
              rank: r.rank,
              id: r.career.id,
              title: r.career.title,
              score: r.finalScore,
              sbert: r.breakdown.sbertSimilarity,
              rule: r.breakdown.ruleFeasibility,
              kg: r.breakdown.knowledgeGraphScore,
            })),
          };
        })
      );
      res.json({ comparisons });
    } catch (err: any) {
      console.error('Error in /api/compare-models:', err);
      res.status(500).json({ error: err?.message || 'Model comparison failed.' });
    }
  });

  app.post('/api/feedback', async (req, res) => {
    try {
      const payload = req.body as FeedbackPayload;
      if (!payload || !payload.careerId || !payload.action || !payload.profile) {
        res.status(400).json({ error: 'careerId, action, and profile are required.' });
        return;
      }

      const career = CAREER_BY_ID[payload.careerId];
      const textForEmotion =
        payload.feedbackText && payload.feedbackText.trim().length > 0
          ? payload.feedbackText
          : payload.profile.careerAspirationText || '';
      const emo = analyzeStudentEmotion(textForEmotion, payload.profile.language, 'improved');
      const { completenessRatio } = imputeMissingProfileAttributes(payload.profile);

      let missingSkillRatio = 0.3;
      if (career && career.requiredSkills.length > 0) {
        const lowerSkills = new Set(payload.profile.skills.map((s) => s.toLowerCase()));
        const missing = career.requiredSkills.filter(
          (reqSkill) => !lowerSkills.has(reqSkill.toLowerCase())
        ).length;
        missingSkillRatio = missing / career.requiredSkills.length;
      }

      const updatedProfile: StudentProfile = {
        ...payload.profile,
        acceptedCareers:
          payload.action === 'accept'
            ? [...new Set([...(payload.profile.acceptedCareers || []), payload.careerId])]
            : payload.profile.acceptedCareers || [],
        rejectedCareers:
          payload.action === 'reject'
            ? [...new Set([...(payload.profile.rejectedCareers || []), payload.careerId])]
            : payload.profile.rejectedCareers || [],
      };

      const rlUpdate = updateQLearningFromFeedback({
        profile: updatedProfile,
        careerId: payload.careerId,
        accepted: payload.action === 'accept',
        vaderCompound: emo.compound,
        missingSkillRatio,
        completenessRatio,
      });

      savePersistedQSnapshot(getQStateSnapshot());
      logUserFeedback(
        { ...payload, profile: updatedProfile },
        emo.compound,
        rlUpdate.rewardSignal
      );

      const refreshed = await generateCareerRecommendations(updatedProfile, 'improved_sankalp', 6);

      res.json({
        rlUpdate,
        updatedProfile,
        refreshedRecommendations: refreshed,
      });
    } catch (err: any) {
      console.error('Error in /api/feedback:', err);
      res.status(500).json({ error: err?.message || 'Feedback processing failed.' });
    }
  });

  app.get('/api/research-results', (_req, res) => {
    const expPath = path.resolve(process.cwd(), 'src/data/experimentalResults.json');
    let experimentData = null;
    if (fs.existsSync(expPath)) {
      try {
        experimentData = JSON.parse(fs.readFileSync(expPath, 'utf-8'));
      } catch {
        experimentData = null;
      }
    }
    const qSnap = getQStateSnapshot();
    res.json({
      experimentData,
      liveAnalytics: getLiveSystemAnalytics(),
      qLearningSummary: {
        alpha: qSnap.alpha,
        gamma: qSnap.gamma,
        epsilon: qSnap.epsilon,
        episodesTrained: qSnap.episodesTrained,
        learnedContextStates: Object.keys(qSnap.contextualPolicyQ).length,
      },
    });
  });

  app.get('/api/docs', (_req, res) => {
    const available = DOC_FILES.map((d) => ({
      ...d,
      exists: fs.existsSync(path.resolve(process.cwd(), d.filename)),
    }));
    res.json({ documents: available });
  });

  app.get('/api/docs/:slug', (req, res) => {
    const docMeta = DOC_FILES.find((d) => d.slug === req.params.slug);
    if (!docMeta) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }
    const fullPath = path.resolve(process.cwd(), docMeta.filename);
    if (!fs.existsSync(fullPath)) {
      res.status(404).json({ error: `${docMeta.filename} has not been generated yet.` });
      return;
    }
    const content = fs.readFileSync(fullPath, 'utf-8');
    res.json({ ...docMeta, content });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Career Advisor Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
