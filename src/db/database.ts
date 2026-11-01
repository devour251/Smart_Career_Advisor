import crypto from 'crypto';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import type { QTableSnapshot } from '../engine/qLearningModule';
import type {
  AssessmentHistoryItem,
  AuthUser,
  SavedBookmarkItem,
} from '../types/authTypes';
import type {
  EducationLevel,
  FeedbackPayload,
  RecommendationResponse,
  StudentProfile,
  SupportedLanguage,
} from '../types/sankalp';

/**
 * Relational Database Management Layer (SQLite via better-sqlite3)
 * Automatically creates data/sankalp.db locally on any laptop (Windows/macOS/Linux)
 * with zero external database server setup required.
 */

const DB_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'sankalp.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    education_level TEXT NOT NULL DEFAULT 'after_10th',
    current_stream TEXT NOT NULL DEFAULT 'Class 10 Completed',
    preferred_language TEXT NOT NULL DEFAULT 'en',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS auth_sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS saved_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    item_type TEXT NOT NULL CHECK(item_type IN ('career', 'stream')),
    item_id TEXT NOT NULL,
    item_title TEXT NOT NULL,
    item_subtitle TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, item_type, item_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS student_sessions (
    session_id TEXT PRIMARY KEY,
    education_level TEXT NOT NULL,
    current_stream TEXT,
    language TEXT NOT NULL,
    input_mode TEXT NOT NULL,
    cohort TEXT NOT NULL,
    academic_percentage REAL,
    profile_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS recommendation_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    user_id INTEGER,
    model_used TEXT NOT NULL,
    top_career_id TEXT NOT NULL,
    top_score REAL NOT NULL,
    latency_ms REAL NOT NULL,
    vader_compound REAL NOT NULL,
    profile_completeness INTEGER NOT NULL,
    recommendations_json TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES student_sessions(session_id)
  );

  CREATE TABLE IF NOT EXISTS user_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    career_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK(action IN ('accept', 'reject')),
    rating INTEGER,
    feedback_text TEXT,
    vader_compound REAL NOT NULL,
    reward_signal REAL NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (session_id) REFERENCES student_sessions(session_id)
  );

  CREATE TABLE IF NOT EXISTS q_learning_state (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    snapshot_json TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Safe migration if recommendation_logs was created before user_id column existed
const recCols = db.prepare('PRAGMA table_info(recommendation_logs)').all() as Array<{ name: string }>;
if (!recCols.some((c) => c.name === 'user_id')) {
  db.exec('ALTER TABLE recommendation_logs ADD COLUMN user_id INTEGER;');
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function mapUserRow(row: any): AuthUser {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    educationLevel: (row.education_level as EducationLevel) || 'after_10th',
    currentStream: row.current_stream || '',
    preferredLanguage: (row.preferred_language as SupportedLanguage) || 'en',
    createdAt: row.created_at,
  };
}

// Seed a ready-to-test Demo Student Account for quick laptop & Viva testing
(function ensureDemoStudentExists() {
  const existing = db
    .prepare('SELECT id FROM users WHERE email = ?')
    .get('demo@student.edu') as { id: number } | undefined;
  if (!existing) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = hashPassword('student123', salt);
    db.prepare(`
      INSERT INTO users (full_name, email, password_salt, password_hash, education_level, current_stream, preferred_language)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Arjun Sharma (Demo Student)',
      'demo@student.edu',
      salt,
      hash,
      'after_10th',
      'Class 10 Completed',
      'en'
    );
  }
})();

export function createUserAccount(params: {
  fullName: string;
  email: string;
  password: string;
  educationLevel?: EducationLevel;
  currentStream?: string;
  preferredLanguage?: SupportedLanguage;
}): { user: AuthUser; token: string } {
  const normalizedEmail = params.email.trim().toLowerCase();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existing) {
    throw new Error('An account with this email already exists. Please log in instead.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword(params.password, salt);

  const info = db
    .prepare(`
      INSERT INTO users (full_name, email, password_salt, password_hash, education_level, current_stream, preferred_language)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .run(
      params.fullName.trim(),
      normalizedEmail,
      salt,
      hash,
      params.educationLevel || 'after_10th',
      params.currentStream || 'Class 10 Completed',
      params.preferredLanguage || 'en'
    );

  const userId = Number(info.lastInsertRowid);
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  const token = issueSessionToken(userId);
  return { user: mapUserRow(row), token };
}

export function authenticateUser(email: string, password: string): { user: AuthUser; token: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail) as any;
  if (!row) {
    throw new Error('Invalid email or password.');
  }

  const candidateHash = hashPassword(password, row.password_salt);
  const a = Buffer.from(candidateHash, 'hex');
  const b = Buffer.from(row.password_hash, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    throw new Error('Invalid email or password.');
  }

  const token = issueSessionToken(row.id);
  return { user: mapUserRow(row), token };
}

function issueSessionToken(userId: number): string {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  db.prepare(`
    INSERT INTO auth_sessions (token, user_id, expires_at)
    VALUES (?, ?, ?)
  `).run(token, userId, expiresAt);
  return token;
}

export function getUserBySessionToken(token?: string | null): AuthUser | null {
  if (!token) return null;
  const row = db
    .prepare(`
      SELECT u.*, s.expires_at
      FROM auth_sessions s
      JOIN users u ON u.id = s.user_id
      WHERE s.token = ?
    `)
    .get(token) as any;

  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    db.prepare('DELETE FROM auth_sessions WHERE token = ?').run(token);
    return null;
  }
  return mapUserRow(row);
}

export function revokeSessionToken(token: string): void {
  db.prepare('DELETE FROM auth_sessions WHERE token = ?').run(token);
}

export function updateUserProfileRecord(
  userId: number,
  patch: {
    fullName?: string;
    educationLevel?: EducationLevel;
    currentStream?: string;
    preferredLanguage?: SupportedLanguage;
  }
): AuthUser {
  const current = db.prepare('SELECT * FROM users WHERE id = ?').get(userId) as any;
  if (!current) {
    throw new Error('User not found.');
  }
  db.prepare(`
    UPDATE users
    SET full_name = ?,
        education_level = ?,
        current_stream = ?,
        preferred_language = ?
    WHERE id = ?
  `).run(
    patch.fullName?.trim() || current.full_name,
    patch.educationLevel || current.education_level,
    patch.currentStream ?? current.current_stream,
    patch.preferredLanguage || current.preferred_language,
    userId
  );
  const updated = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  return mapUserRow(updated);
}

export function getSavedItemsForUser(userId: number): SavedBookmarkItem[] {
  const rows = db
    .prepare('SELECT * FROM saved_items WHERE user_id = ? ORDER BY id DESC')
    .all(userId) as any[];
  return rows.map((r) => ({
    id: r.id,
    userId: r.user_id,
    itemType: r.item_type,
    itemId: r.item_id,
    itemTitle: r.item_title,
    itemSubtitle: r.item_subtitle || '',
    createdAt: r.created_at,
  }));
}

export function addSavedItemForUser(params: {
  userId: number;
  itemType: 'career' | 'stream';
  itemId: string;
  itemTitle: string;
  itemSubtitle?: string;
}): SavedBookmarkItem[] {
  db.prepare(`
    INSERT INTO saved_items (user_id, item_type, item_id, item_title, item_subtitle)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, item_type, item_id) DO UPDATE SET
      item_title = excluded.item_title,
      item_subtitle = excluded.item_subtitle
  `).run(
    params.userId,
    params.itemType,
    params.itemId,
    params.itemTitle,
    params.itemSubtitle || ''
  );
  return getSavedItemsForUser(params.userId);
}

export function removeSavedItemForUser(
  userId: number,
  itemType: 'career' | 'stream',
  itemId: string
): SavedBookmarkItem[] {
  db.prepare('DELETE FROM saved_items WHERE user_id = ? AND item_type = ? AND item_id = ?').run(
    userId,
    itemType,
    itemId
  );
  return getSavedItemsForUser(userId);
}

export function getAssessmentHistoryForUser(userId: number): AssessmentHistoryItem[] {
  const rows = db
    .prepare(
      'SELECT * FROM recommendation_logs WHERE user_id = ? ORDER BY id DESC LIMIT 12'
    )
    .all(userId) as any[];

  return rows.map((r) => {
    let parsed: Array<{ id: string; title?: string; score: number }> = [];
    try {
      parsed = JSON.parse(r.recommendations_json || '[]');
    } catch {
      parsed = [];
    }
    return {
      id: r.id,
      sessionId: r.session_id,
      topCareerId: r.top_career_id,
      topScore: r.top_score,
      profileCompleteness: r.profile_completeness,
      summaryItems: parsed.slice(0, 3),
      createdAt: r.created_at,
    };
  });
}

export function upsertStudentSession(profile: StudentProfile): void {
  const stmt = db.prepare(`
    INSERT INTO student_sessions (
      session_id, education_level, current_stream, language, input_mode, cohort, academic_percentage, profile_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    ON CONFLICT(session_id) DO UPDATE SET
      education_level = excluded.education_level,
      current_stream = excluded.current_stream,
      language = excluded.language,
      input_mode = excluded.input_mode,
      cohort = excluded.cohort,
      academic_percentage = excluded.academic_percentage,
      profile_json = excluded.profile_json,
      updated_at = datetime('now')
  `);
  stmt.run(
    profile.sessionId,
    profile.educationLevel,
    profile.currentStream || '',
    profile.language,
    profile.inputMode,
    profile.cohort,
    profile.academicPercentage ?? null,
    JSON.stringify(profile)
  );
}

export function logRecommendationRun(
  profile: StudentProfile,
  response: RecommendationResponse,
  userId?: number | null
): void {
  upsertStudentSession(profile);
  const top1 = response.recommendations[0];
  if (!top1) return;

  const stmt = db.prepare(`
    INSERT INTO recommendation_logs (
      session_id, user_id, model_used, top_career_id, top_score, latency_ms, vader_compound, profile_completeness, recommendations_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    profile.sessionId,
    userId ?? null,
    response.modelUsed,
    top1.career.id,
    top1.finalScore,
    response.latencyMs,
    response.emotionAnalysis.compound,
    response.profileCompleteness,
    JSON.stringify(
      response.recommendations.map((r) => ({
        id: r.career.id,
        title: r.career.title,
        score: r.finalScore,
      }))
    )
  );
}

export function logUserFeedback(
  payload: FeedbackPayload,
  vaderCompound: number,
  rewardSignal: number
): void {
  upsertStudentSession(payload.profile);
  const stmt = db.prepare(`
    INSERT INTO user_feedback (
      session_id, career_id, action, rating, feedback_text, vader_compound, reward_signal
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    payload.sessionId,
    payload.careerId,
    payload.action,
    payload.rating ?? null,
    payload.feedbackText || '',
    vaderCompound,
    rewardSignal
  );
}

export function savePersistedQSnapshot(snapshot: QTableSnapshot): void {
  const stmt = db.prepare(`
    INSERT INTO q_learning_state (id, snapshot_json, updated_at)
    VALUES (1, ?, datetime('now'))
    ON CONFLICT(id) DO UPDATE SET
      snapshot_json = excluded.snapshot_json,
      updated_at = datetime('now')
  `);
  stmt.run(JSON.stringify(snapshot));
}

export function loadPersistedQSnapshot(): QTableSnapshot | null {
  const row = db
    .prepare('SELECT snapshot_json FROM q_learning_state WHERE id = 1')
    .get() as { snapshot_json: string } | undefined;
  if (!row) return null;
  try {
    return JSON.parse(row.snapshot_json) as QTableSnapshot;
  } catch {
    return null;
  }
}

export function getLiveSystemAnalytics() {
  const usersCount = (
    db.prepare('SELECT COUNT(*) as cnt FROM users').get() as { cnt: number }
  ).cnt;
  const savedCount = (
    db.prepare('SELECT COUNT(*) as cnt FROM saved_items').get() as { cnt: number }
  ).cnt;
  const sessions = (
    db.prepare('SELECT COUNT(*) as cnt FROM student_sessions').get() as { cnt: number }
  ).cnt;
  const recommendations = db
    .prepare('SELECT COUNT(*) as cnt, AVG(latency_ms) as avgLat FROM recommendation_logs')
    .get() as {
    cnt: number;
    avgLat: number | null;
  };
  const feedback = db
    .prepare(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN action = 'accept' THEN 1 ELSE 0 END) as accepts,
              AVG(rating) as avgRating
       FROM user_feedback`
    )
    .get() as { total: number; accepts: number | null; avgRating: number | null };

  return {
    totalRegisteredUsers: usersCount,
    totalSavedItems: savedCount,
    totalSessions: sessions,
    totalRecommendationsServed: recommendations.cnt,
    meanLiveLatencyMs: recommendations.avgLat ? Number(recommendations.avgLat.toFixed(2)) : null,
    totalFeedbackEvents: feedback.total,
    acceptanceCount: feedback.accepts ?? 0,
    meanLiveSatisfaction: feedback.avgRating ? Number(feedback.avgRating.toFixed(2)) : null,
    sqliteDbPath: 'data/sankalp.db',
  };
}
