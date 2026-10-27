import fs from "fs";
import path from "path";
import { getFirebaseAdmin, isFirebaseAdminConfigured } from "./firebase-admin";
import {
  User,
  Quiz,
  Question,
  Attempt,
  Material,
  ClientExamQuestion,
} from "./types";
import { hashPassword } from "./auth";
import { SEED_CATEGORIES, SEED_QUIZZES, SEED_QUESTIONS } from "./seed-data";

// Database storage structure
interface DbSchema {
  admin: {
    username: string;
    passwordHash: string;
    isDefaultPassword: boolean;
    updatedAt: string;
  };
  users: Record<string, User>;
  quizzes: Record<string, Quiz>;
  questions: Record<string, Question>;
  attempts: Record<string, Attempt>;
  materials: Record<string, Material>;
  categories?: string[];
  deletedQuizIds?: string[];
}

// Memory / Local / Serverless fallback store
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const BUNDLED_DB_FILE = path.join(process.cwd(), ".data", "db.json");
const DATA_DIR = IS_SERVERLESS ? path.join("/tmp", ".data") : path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

let memoryDb: DbSchema | null = null;

async function getInitialSchema(): Promise<DbSchema> {
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || "sumit045";
  const defaultAdminUsername = process.env.ADMIN_USERNAME || "sumit045";
  const passwordHash = await hashPassword(initialPassword);

  return {
    admin: {
      username: defaultAdminUsername,
      passwordHash,
      isDefaultPassword: true,
      updatedAt: new Date().toISOString(),
    },
    users: {
      "demo-student-01": {
        uid: "demo-student-01",
        displayName: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        role: "user",
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        lastLoginAt: new Date().toISOString(),
      },
    },
    quizzes: { ...SEED_QUIZZES },
    questions: { ...SEED_QUESTIONS },
    categories: [...SEED_CATEGORIES],
    attempts: {},
    materials: {},
    deletedQuizIds: [],
  };
}

// Loads local JSON or memory store
async function loadStore(): Promise<DbSchema> {
  if (!memoryDb) {
    try {
      // 1. Check primary file location (including /tmp in serverless)
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        memoryDb = JSON.parse(data);
      } else if (IS_SERVERLESS && fs.existsSync(BUNDLED_DB_FILE)) {
        // 2. In Vercel serverless, seed /tmp from the bundled repository file if available
        const bundledData = fs.readFileSync(BUNDLED_DB_FILE, "utf-8");
        memoryDb = JSON.parse(bundledData);
      }
    } catch (err) {
      console.warn("Could not read local db.json file, initializing memory database.", err);
    }

    if (!memoryDb) {
      memoryDb = await getInitialSchema();
    }
  }

  // Ensure collections exist
  if (!memoryDb.deletedQuizIds) memoryDb.deletedQuizIds = [];
  if (!memoryDb.quizzes) memoryDb.quizzes = {};
  if (!memoryDb.questions) memoryDb.questions = {};
  if (!memoryDb.attempts) memoryDb.attempts = {};
  if (!memoryDb.materials) memoryDb.materials = {};

  const deletedSet = new Set(memoryDb.deletedQuizIds);

  // ALWAYS merge official SEED_QUIZZES as base, preserving custom quizzes and updates
  for (const [id, seedQuiz] of Object.entries(SEED_QUIZZES)) {
    if (!deletedSet.has(id) && !memoryDb.quizzes[id]) {
      memoryDb.quizzes[id] = { ...seedQuiz };
    }
  }

  // Strip any quiz that was explicitly deleted
  for (const id of memoryDb.deletedQuizIds) {
    delete memoryDb.quizzes[id];
  }

  // ALWAYS merge official SEED_QUESTIONS as base
  for (const [qId, seedQ] of Object.entries(SEED_QUESTIONS)) {
    if (!deletedSet.has(seedQ.quizId) && !memoryDb.questions[qId]) {
      memoryDb.questions[qId] = { ...seedQ };
    }
  }

  // Strip questions belonging to deleted quizzes
  for (const [qId, q] of Object.entries(memoryDb.questions)) {
    if (deletedSet.has(q.quizId)) {
      delete memoryDb.questions[qId];
    }
  }

  // Merge categories
  memoryDb.categories = Array.from(
    new Set([...SEED_CATEGORIES, ...(memoryDb.categories || [])])
  );

  return memoryDb;
}

// Saves local JSON store
async function saveStore(): Promise<void> {
  if (!memoryDb) return;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
  } catch (err) {
    // Graceful fallback for read-only environments
  }
}

// ================= DATABASE OPERATIONS =================

export const db = {
  // Admin credentials
  async getAdminCredentials() {
    const store = await loadStore();
    return store.admin;
  },

  async updateAdminPassword(newHash: string) {
    const store = await loadStore();
    store.admin.passwordHash = newHash;
    store.admin.isDefaultPassword = false;
    store.admin.updatedAt = new Date().toISOString();
    await saveStore();
  },

  // Users
  async getUser(uid: string): Promise<User | null> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const doc = await adminFb.firestore.collection("users").doc(uid).get();
      return doc.exists ? (doc.data() as User) : null;
    }
    const store = await loadStore();
    return store.users[uid] || null;
  },

  async saveUser(user: User): Promise<void> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      await adminFb.firestore.collection("users").doc(user.uid).set(user, { merge: true });
      return;
    }
    const store = await loadStore();
    store.users[user.uid] = user;
    await saveStore();
  },

  async listUsers(): Promise<User[]> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const snapshot = await adminFb.firestore.collection("users").get();
      return snapshot.docs.map((d) => d.data() as User);
    }
    const store = await loadStore();
    return Object.values(store.users);
  },

  // Quizzes
  async listQuizzes(includeDrafts = false, category?: string): Promise<Quiz[]> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      let query: any = adminFb.firestore.collection("quizzes");
      if (!includeDrafts) {
        query = query.where("status", "==", "published");
      }
      if (category && category !== "all") {
        query = query.where("category", "==", category);
      }
      const snapshot = await query.get();
      return snapshot.docs.map((d: any) => d.data() as Quiz);
    }
    const store = await loadStore();
    const deletedSet = new Set(store.deletedQuizIds || []);
    return Object.values(store.quizzes).filter((q) => {
      if (deletedSet.has(q.id)) return false;
      if (q.status === "archived") return false;
      const statusMatch = includeDrafts || q.status === "published";
      const categoryMatch = !category || category === "all" || q.category?.toLowerCase() === category.toLowerCase();
      return statusMatch && categoryMatch;
    });
  },

  async getQuiz(id: string, includeArchived = false): Promise<Quiz | null> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const doc = await adminFb.firestore.collection("quizzes").doc(id).get();
      return doc.exists ? (doc.data() as Quiz) : null;
    }
    const store = await loadStore();
    if (store.deletedQuizIds?.includes(id)) return null;
    const quiz = store.quizzes[id] || null;
    if (!quiz) return null;
    if (!includeArchived && quiz.status === "archived") return null;
    return quiz;
  },

  async registerDeletedQuizzes(ids: string[]): Promise<void> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      for (const id of ids) {
        await this.deleteQuiz(id);
      }
      return;
    }
    const store = await loadStore();
    store.deletedQuizIds = store.deletedQuizIds || [];
    let changed = false;
    for (const id of ids) {
      if (!id) continue;
      if (!store.deletedQuizIds.includes(id)) {
        store.deletedQuizIds.push(id);
        changed = true;
      }
      if (store.quizzes[id]) {
        delete store.quizzes[id];
        changed = true;
      }
    }
    if (changed) {
      await saveStore();
    }
  },

  async syncCustomQuizzes(quizzes: Quiz[], questions: Question[] = []): Promise<void> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      for (const q of quizzes) {
        await this.createQuiz(q, questions.filter((item) => item.quizId === q.id));
      }
      return;
    }

    const store = await loadStore();
    const deletedSet = new Set(store.deletedQuizIds || []);
    let changed = false;

    for (const q of quizzes) {
      if (!q || !q.id || deletedSet.has(q.id)) continue;
      store.quizzes[q.id] = q;
      changed = true;
    }

    for (const qItem of questions) {
      if (!qItem || !qItem.id || !qItem.quizId || deletedSet.has(qItem.quizId)) continue;
      store.questions[qItem.id] = qItem;
      changed = true;
    }

    if (changed) {
      await saveStore();
    }
  },

  async createQuiz(quiz: Quiz, questions: Question[]): Promise<Quiz> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const batch = adminFb.firestore.batch();
      const quizRef = adminFb.firestore.collection("quizzes").doc(quiz.id);
      batch.set(quizRef, quiz);

      for (const q of questions) {
        const qRef = adminFb.firestore.collection("questions").doc(q.id);
        batch.set(qRef, q);
      }
      await batch.commit();
      return quiz;
    }
    const store = await loadStore();
    store.quizzes[quiz.id] = quiz;
    for (const q of questions) {
      store.questions[q.id] = q;
    }
    await saveStore();
    return quiz;
  },

  async updateQuiz(id: string, updates: Partial<Quiz>): Promise<Quiz | null> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const quizRef = adminFb.firestore.collection("quizzes").doc(id);
      await quizRef.update({ ...updates, updatedAt: new Date().toISOString() });
      const updated = await quizRef.get();
      return updated.data() as Quiz;
    }
    const store = await loadStore();
    if (!store.quizzes[id]) return null;
    store.quizzes[id] = {
      ...store.quizzes[id],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await saveStore();
    return store.quizzes[id];
  },

  async deleteQuiz(id: string): Promise<boolean> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      await adminFb.firestore.collection("quizzes").doc(id).delete();
      const qDocs = await adminFb.firestore.collection("questions").where("quizId", "==", id).get();
      for (const d of qDocs.docs) await d.ref.delete();
      const aDocs = await adminFb.firestore.collection("attempts").where("quizId", "==", id).get();
      for (const d of aDocs.docs) await d.ref.delete();
      return true;
    }
    const store = await loadStore();
    if (!store.deletedQuizIds) {
      store.deletedQuizIds = [];
    }
    if (!store.deletedQuizIds.includes(id)) {
      store.deletedQuizIds.push(id);
    }
    delete store.quizzes[id];
    // Delete associated questions
    for (const [qId, q] of Object.entries(store.questions)) {
      if (q.quizId === id) {
        delete store.questions[qId];
      }
    }
    // Delete associated attempts
    for (const [attId, att] of Object.entries(store.attempts)) {
      if (att.quizId === id) {
        delete store.attempts[attId];
      }
    }
    await saveStore();
    return true;
  },

  // Questions
  async getQuizQuestions(quizId: string, clientSafe = false): Promise<Question[] | ClientExamQuestion[]> {
    const adminFb = getFirebaseAdmin();
    let questions: Question[] = [];

    if (adminFb) {
      const snapshot = await adminFb.firestore
        .collection("questions")
        .where("quizId", "==", quizId)
        .get();
      questions = snapshot.docs.map((d) => d.data() as Question);
    } else {
      const store = await loadStore();
      questions = Object.values(store.questions).filter((q) => q.quizId === quizId);
    }

    questions.sort((a, b) => a.order - b.order);

    if (clientSafe) {
      return questions.map((q) => ({
        id: q.id,
        quizId: q.quizId,
        questionText: q.questionText,
        options: q.options,
        difficulty: q.difficulty,
        topic: q.topic,
        order: q.order,
      }));
    }

    return questions;
  },

  async updateQuestionsForQuiz(quizId: string, questions: Question[]): Promise<void> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const batch = adminFb.firestore.batch();
      // Remove old
      const oldSnapshot = await adminFb.firestore
        .collection("questions")
        .where("quizId", "==", quizId)
        .get();
      oldSnapshot.docs.forEach((doc) => batch.delete(doc.ref));

      // Add new
      for (const q of questions) {
        const qRef = adminFb.firestore.collection("questions").doc(q.id);
        batch.set(qRef, q);
      }
      await batch.commit();
      return;
    }

    const store = await loadStore();
    // Delete old questions for quiz
    for (const [qId, q] of Object.entries(store.questions)) {
      if (q.quizId === quizId) delete store.questions[qId];
    }
    // Add new questions
    for (const q of questions) {
      store.questions[q.id] = q;
    }
    await saveStore();
  },

  // Attempts
  async createAttempt(attempt: Attempt): Promise<Attempt> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      await adminFb.firestore.collection("attempts").doc(attempt.id).set(attempt);
      return attempt;
    }
    const store = await loadStore();
    store.attempts[attempt.id] = attempt;
    await saveStore();
    return attempt;
  },

  async getAttempt(id: string): Promise<Attempt | null> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const doc = await adminFb.firestore.collection("attempts").doc(id).get();
      return doc.exists ? (doc.data() as Attempt) : null;
    }
    const store = await loadStore();
    return store.attempts[id] || null;
  },

  async updateAttempt(id: string, updates: Partial<Attempt>): Promise<Attempt | null> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const ref = adminFb.firestore.collection("attempts").doc(id);
      await ref.update(updates);
      const updated = await ref.get();
      return updated.data() as Attempt;
    }
    const store = await loadStore();
    if (!store.attempts[id]) return null;
    store.attempts[id] = {
      ...store.attempts[id],
      ...updates,
    };
    await saveStore();
    return store.attempts[id];
  },

  async listAttempts(filter?: { userId?: string; quizId?: string }): Promise<Attempt[]> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      let query: any = adminFb.firestore.collection("attempts");
      if (filter?.userId) query = query.where("userId", "==", filter.userId);
      if (filter?.quizId) query = query.where("quizId", "==", filter.quizId);
      const snapshot = await query.get();
      return snapshot.docs.map((d: any) => d.data() as Attempt);
    }
    const store = await loadStore();
    let list = Object.values(store.attempts);
    if (filter?.userId) list = list.filter((a) => a.userId === filter.userId);
    if (filter?.quizId) list = list.filter((a) => a.quizId === filter.quizId);
    return list;
  },

  // Materials
  async createMaterial(material: Material): Promise<Material> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      await adminFb.firestore.collection("materials").doc(material.id).set(material);
      return material;
    }
    const store = await loadStore();
    store.materials[material.id] = material;
    await saveStore();
    return material;
  },

  async listMaterials(): Promise<Material[]> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const snapshot = await adminFb.firestore.collection("materials").get();
      return snapshot.docs.map((d) => d.data() as Material);
    }
    const store = await loadStore();
    return Object.values(store.materials);
  },

  async getMaterial(id: string): Promise<Material | null> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const doc = await adminFb.firestore.collection("materials").doc(id).get();
      return doc.exists ? (doc.data() as Material) : null;
    }
    const store = await loadStore();
    return store.materials[id] || null;
  },

  // Analytics Aggregation
  async getAdminAnalytics() {
    const quizzes = await this.listQuizzes(true);
    const users = await this.listUsers();
    const attempts = await this.listAttempts();

    const submittedAttempts = attempts.filter((a) => a.status === "submitted");

    let totalScore = 0;
    let highestScore = 0;
    const scoreRanges: Record<string, number> = {
      "0-20%": 0,
      "21-40%": 0,
      "41-60%": 0,
      "61-80%": 0,
      "81-100%": 0,
    };

    submittedAttempts.forEach((a) => {
      const score = a.score || 0;
      totalScore += score;
      if (score > highestScore) highestScore = score;

      const pct = a.percentage || 0;
      if (pct <= 20) scoreRanges["0-20%"]++;
      else if (pct <= 40) scoreRanges["21-40%"]++;
      else if (pct <= 60) scoreRanges["41-60%"]++;
      else if (pct <= 80) scoreRanges["61-80%"]++;
      else scoreRanges["81-100%"]++;
    });

    const averageScore =
      submittedAttempts.length > 0
        ? Number((totalScore / submittedAttempts.length).toFixed(1))
        : 0;

    return {
      totalUsers: users.length,
      totalQuizzes: quizzes.length,
      publishedQuizzes: quizzes.filter((q) => q.status === "published").length,
      totalAttempts: attempts.length,
      submittedAttempts: submittedAttempts.length,
      averageScore,
      highestScore,
      scoreDistribution: Object.entries(scoreRanges).map(([range, count]) => ({
        range,
        count,
      })),
      recentAttempts: attempts
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 10),
      recentUsers: users
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    };
  },

  // Categories / Examination Sections
  async getCategories(): Promise<string[]> {
    const defaultCategories = ["Banking", "UGC NET", "Engineering & GATE", "Civil Services / UPSC"];
    const store = await loadStore();
    if (!store.categories || !Array.isArray(store.categories) || store.categories.length === 0) {
      store.categories = defaultCategories;
      await saveStore();
    }
    return store.categories;
  },

  async addCategory(name: string): Promise<string[]> {
    const trimmed = name.trim();
    if (!trimmed) return this.getCategories();
    const store = await loadStore();
    if (!store.categories || !Array.isArray(store.categories)) {
      store.categories = ["Banking", "UGC NET", "Engineering & GATE", "Civil Services / UPSC"];
    }
    if (!store.categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      store.categories.push(trimmed);
      await saveStore();
    }
    return store.categories;
  },

  async deleteCategory(name: string): Promise<string[]> {
    const store = await loadStore();
    if (!store.categories) return [];
    store.categories = store.categories.filter((c) => c.toLowerCase() !== name.trim().toLowerCase());
    await saveStore();
    return store.categories;
  },
};
