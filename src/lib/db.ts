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

  const initialQuizzes: Record<string, Quiz> = {
    "quiz-ugc-net-01": {
      id: "quiz-ugc-net-01",
      title: "UGC NET Paper 1: Teaching & Research Aptitude",
      description: "Official NTA pattern mock examination covering teaching methodology, research ethics, and logical reasoning.",
      subject: "Teaching & Research Aptitude",
      status: "published",
      durationMinutes: 60,
      totalQuestions: 5,
      marksPerQuestion: 4,
      negativeMarks: 1,
      language: "English",
      createdBy: "system",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      reviewPolicy: "immediate",
      allowRandomization: true,
    },
    "quiz-cs-gate-01": {
      id: "quiz-cs-gate-01",
      title: "Computer Science: Data Structures & Algorithms",
      description: "National Level CBT test covering asymptotic analysis, trees, graph algorithms, and dynamic programming.",
      subject: "Computer Science",
      status: "published",
      durationMinutes: 45,
      totalQuestions: 5,
      marksPerQuestion: 4,
      negativeMarks: 1,
      language: "English",
      createdBy: "system",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      reviewPolicy: "immediate",
      allowRandomization: true,
    },
  };

  const initialQuestions: Record<string, Question> = {
    "q-ugc-1": {
      id: "q-ugc-1",
      quizId: "quiz-ugc-net-01",
      questionText: "Which of the following evaluation systems belongs to the category of being continuous and comprehensive, focusing on cognitive, affective, and psychomotor domains?",
      options: [
        "Norm-referenced testing",
        "Criterion-referenced testing",
        "Continuous and Comprehensive Evaluation (CCE)",
        "Summative assessment only",
      ],
      correctAnswerIndex: 2,
      explanation: "Continuous and Comprehensive Evaluation (CCE) was formulated to assess all facets of a student's development holistically.",
      difficulty: "easy",
      topic: "Teaching Aptitude",
      sourceReference: "UGC NET Paper 1 Unit 1",
      order: 1,
    },
    "q-ugc-2": {
      id: "q-ugc-2",
      quizId: "quiz-ugc-net-01",
      questionText: "A researcher is conducting a study to determine the causal effect of instructional multimedia on student retention. Which research design is most scientifically rigorous?",
      options: [
        "Descriptive survey design",
        "True experimental design with random assignment",
        "Historical archival analysis",
        "Correlational case study",
      ],
      correctAnswerIndex: 1,
      explanation: "True experimental design with random assignment allows control over extraneous variables and establishes definitive cause-effect relationships.",
      difficulty: "medium",
      topic: "Research Aptitude",
      sourceReference: "UGC NET Paper 1 Unit 2",
      order: 2,
    },
    "q-ugc-3": {
      id: "q-ugc-3",
      quizId: "quiz-ugc-net-01",
      questionText: "Which of the following represents a valid deductive argument?",
      options: [
        "All humans are mortal; Socrates is a human; therefore, Socrates is mortal.",
        "Most birds can fly; penguins are birds; therefore, penguins can fly.",
        "The sun has risen every day; therefore, it might rise tomorrow.",
        "Some teachers are artists; some artists are poets; therefore, all teachers are poets.",
      ],
      correctAnswerIndex: 0,
      explanation: "The syllogism follows a standard classical valid deductive form: Major premise, Minor premise, Necessarily follows conclusion.",
      difficulty: "easy",
      topic: "Logical Reasoning",
      sourceReference: "UGC NET Paper 1 Unit 6",
      order: 3,
    },
    "q-ugc-4": {
      id: "q-ugc-4",
      quizId: "quiz-ugc-net-01",
      questionText: "In the context of the National Education Policy (NEP) 2020, what pedagogical structure replaces the 10+2 structure?",
      options: [
        "5 + 3 + 3 + 4",
        "5 + 4 + 3 + 2",
        "3 + 3 + 4 + 4",
        "4 + 4 + 3 + 3",
      ],
      correctAnswerIndex: 0,
      explanation: "NEP 2020 introduces the 5+3+3+4 design covering Foundational (5), Preparatory (3), Middle (3), and Secondary (4) stages.",
      difficulty: "medium",
      topic: "Higher Education System",
      sourceReference: "NEP 2020 Section 1.1",
      order: 4,
    },
    "q-ugc-5": {
      id: "q-ugc-5",
      quizId: "quiz-ugc-net-01",
      questionText: "Which protocol is utilized for securely encrypting data communicated between a web browser and an examination web application?",
      options: [
        "HTTP over SSL/TLS (HTTPS)",
        "Simple Mail Transfer Protocol (SMTP)",
        "File Transfer Protocol (FTP)",
        "Telnet terminal protocol",
      ],
      correctAnswerIndex: 0,
      explanation: "HTTPS (Hypertext Transfer Protocol Secure) encrypts bidirectional communications using Transport Layer Security (TLS).",
      difficulty: "easy",
      topic: "Information & Communication Technology (ICT)",
      sourceReference: "UGC NET Paper 1 Unit 8",
      order: 5,
    },
    "q-cs-1": {
      id: "q-cs-1",
      quizId: "quiz-cs-gate-01",
      questionText: "What is the worst-case time complexity of inserting an element into an AVL Tree with N elements?",
      options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
      correctAnswerIndex: 1,
      explanation: "Because an AVL tree remains strictly height-balanced with maximum height ~ 1.44 log2(N), insertion and rotation take O(log N).",
      difficulty: "medium",
      topic: "Self-Balancing Trees",
      sourceReference: "Algorithms & Data Structures",
      order: 1,
    },
    "q-cs-2": {
      id: "q-cs-2",
      quizId: "quiz-cs-gate-01",
      questionText: "Which algorithmic paradigm is employed in Dijkstra's single-source shortest path algorithm on non-negative weighted graphs?",
      options: [
        "Divide and Conquer",
        "Greedy approach",
        "Dynamic Programming",
        "Backtracking",
      ],
      correctAnswerIndex: 1,
      explanation: "Dijkstra's algorithm greedily chooses the unvisited vertex with the minimum tentative distance at each step.",
      difficulty: "easy",
      topic: "Graph Algorithms",
      sourceReference: "Network Analysis",
      order: 2,
    },
    "q-cs-3": {
      id: "q-cs-3",
      quizId: "quiz-cs-gate-01",
      questionText: "In a B+ Tree of order M, where are the actual data records or record pointers stored?",
      options: [
        "Exclusively in the leaf nodes",
        "In the root node only",
        "Evenly distributed across internal and leaf nodes",
        "In a separate non-indexed hash file",
      ],
      correctAnswerIndex: 0,
      explanation: "In a B+ Tree, internal nodes strictly store search keys and navigation pointers, while all data records reside in linked leaf nodes.",
      difficulty: "medium",
      topic: "Database Indexing",
      sourceReference: "Database System Concepts",
      order: 3,
    },
    "q-cs-4": {
      id: "q-cs-4",
      quizId: "quiz-cs-gate-01",
      questionText: "Which problem among the following is known to be NP-Complete?",
      options: [
        "Shortest path between two vertices with non-negative edge weights",
        "Finding minimum spanning tree using Kruskal's algorithm",
        "Traveling Salesperson Problem (Decision version)",
        "Sorting an array of numbers using Quicksort",
      ],
      correctAnswerIndex: 2,
      explanation: "The decision version of the Traveling Salesperson Problem (TSP) is NP-Complete, whereas MST and Shortest Path are polynomial time solvable.",
      difficulty: "hard",
      topic: "Complexity Theory",
      sourceReference: "Theory of Computation",
      order: 4,
    },
    "q-cs-5": {
      id: "q-cs-5",
      quizId: "quiz-cs-gate-01",
      questionText: "In hash table implementations, what mechanism resolves collisions by searching for the next open slot using secondary hash functions?",
      options: [
        "Separate Chaining with linked lists",
        "Double Hashing",
        "Binary heap restructuring",
        "Trie traversal",
      ],
      correctAnswerIndex: 1,
      explanation: "Double Hashing is an open addressing technique that uses a secondary hash function to calculate probing intervals.",
      difficulty: "medium",
      topic: "Hashing",
      sourceReference: "Data Structures",
      order: 5,
    },
  };

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
    quizzes: initialQuizzes,
    questions: initialQuestions,
    attempts: {},
    materials: {},
  };
}

// Loads local JSON or memory store
async function loadStore(): Promise<DbSchema> {
  if (memoryDb) return memoryDb;

  try {
    // 1. Check primary file location (including /tmp in serverless)
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      memoryDb = JSON.parse(data);
      return memoryDb!;
    }

    // 2. In Vercel serverless, seed /tmp from the bundled repository file if available
    if (IS_SERVERLESS && fs.existsSync(BUNDLED_DB_FILE)) {
      const bundledData = fs.readFileSync(BUNDLED_DB_FILE, "utf-8");
      memoryDb = JSON.parse(bundledData);
      try {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
      } catch (e) {
        // Fallback to in-memory if write is blocked
      }
      return memoryDb!;
    }
  } catch (err) {
    console.warn("Could not read local db.json file, initializing memory database.", err);
  }

  memoryDb = await getInitialSchema();
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), "utf-8");
  } catch {
    // If running in a read-only filesystem environment (e.g. edge or serverless tmp), memoryDb is retained in memory
  }
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
    return Object.values(store.quizzes).filter((q) => {
      const statusMatch = includeDrafts || q.status === "published";
      const categoryMatch = !category || category === "all" || q.category?.toLowerCase() === category.toLowerCase();
      return statusMatch && categoryMatch;
    });
  },

  async getQuiz(id: string): Promise<Quiz | null> {
    const adminFb = getFirebaseAdmin();
    if (adminFb) {
      const doc = await adminFb.firestore.collection("quizzes").doc(id).get();
      return doc.exists ? (doc.data() as Quiz) : null;
    }
    const store = await loadStore();
    return store.quizzes[id] || null;
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
      return true;
    }
    const store = await loadStore();
    if (!store.quizzes[id]) return false;
    delete store.quizzes[id];
    // Delete associated questions
    for (const [qId, q] of Object.entries(store.questions)) {
      if (q.quizId === id) {
        delete store.questions[qId];
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
