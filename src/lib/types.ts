export type UserRole = "admin" | "user";

export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  targetExam?: string; // "Banking" | "UGC NET"
  createdAt: string;
  lastLoginAt: string;
}

export type QuizStatus = "draft" | "published" | "archived";
export type ReviewPolicy = "immediate" | "after_close" | "never";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  category?: string; // e.g. "Banking", "UGC NET", "Engineering", etc.
  paperType?: string; // e.g. "live_mock" | "sectional" | "topic_test" | "full_mock"
  isDailyPaper?: boolean; // Marks as "Today's Paper / Daily Task"
  status: QuizStatus;
  durationMinutes: number;
  totalQuestions: number;
  marksPerQuestion: number;
  negativeMarks: number;
  language: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  reviewPolicy: ReviewPolicy;
  allowRandomization?: boolean;
}

export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty;
  topic: string;
  sourceReference?: string;
  order: number;
}

// Client-safe version of Question (hides correct answer and explanation during exam)
export interface ClientExamQuestion {
  id: string;
  quizId: string;
  questionText: string;
  options: string[];
  difficulty: QuestionDifficulty;
  topic: string;
  order: number;
}

export type QuestionStatus =
  | "not_visited"
  | "not_answered"
  | "answered"
  | "marked_for_review"
  | "answered_marked_for_review";

export interface AnswerItem {
  selectedOption: number | null; // index 0, 1, 2, 3 or null
  status: QuestionStatus;
  updatedAt?: string;
}

export type AttemptStatus = "in_progress" | "submitted" | "expired";

export interface Attempt {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: AttemptStatus;
  startedAt: string;
  deadlineAt: string;
  submittedAt?: string;
  answers: Record<string, AnswerItem>; // questionId -> AnswerItem
  score?: number;
  maximumScore?: number;
  percentage?: number;
  correctCount?: number;
  incorrectCount?: number;
  unansweredCount?: number;
  timeTakenSeconds?: number;
}

export interface Material {
  id: string;
  uploadedBy: string;
  originalFileName: string;
  storagePath: string;
  fileType: string;
  fileSize: number;
  processingStatus: "uploaded" | "processing" | "processed" | "failed";
  extractedText?: string;
  createdAt: string;
}

export interface GeneratedQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: QuestionDifficulty;
  topic: string;
  sourceReference?: string;
}

export interface QuizGenerationResponse {
  title: string;
  description: string;
  questions: GeneratedQuestion[];
}

export interface ExamStatusSummary {
  total: number;
  answered: number;
  notAnswered: number;
  notVisited: number;
  markedForReview: number;
  answeredAndMarkedForReview: number;
}
