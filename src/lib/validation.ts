import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export const adminChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export const questionDifficultySchema = z.enum(["easy", "medium", "hard"]);

export const singleQuestionSchema = z.object({
  questionText: z.string().min(5, "Question text must be at least 5 characters"),
  options: z.array(z.string().min(1, "Option cannot be empty")).min(2, "At least 2 options required"),
  correctAnswerIndex: z.number().int().min(0),
  explanation: z.string().default(""),
  difficulty: questionDifficultySchema.default("medium"),
  topic: z.string().default("General"),
  sourceReference: z.string().optional(),
});

export const quizCreateSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().default(""),
  subject: z.string().min(2, "Subject is required"),
  category: z.string().default("Banking"),
  isDailyPaper: z.boolean().default(false),
  durationMinutes: z.number().int().min(1, "Duration must be at least 1 minute"),
  marksPerQuestion: z.number().min(0.5, "Marks per question must be positive"),
  negativeMarks: z.number().min(0, "Negative marks cannot be negative"),
  language: z.string().default("English"),
  reviewPolicy: z.enum(["immediate", "after_close", "never"]).default("immediate"),
  allowRandomization: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  questions: z.array(singleQuestionSchema).min(1, "Quiz must contain at least 1 question"),
});

export const quizUpdateSchema = quizCreateSchema.partial();

export const aiGenerationConfigSchema = z.object({
  title: z.string().optional(),
  subject: z.string().default("General"),
  numQuestions: z.number().int().min(1).max(50).default(5),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"]).default("mixed"),
  language: z.string().default("English"),
  customPrompt: z.string().optional(),
});

export const answerUpdateSchema = z.object({
  answers: z.record(
    z.string(),
    z.object({
      selectedOption: z.number().nullable(),
      status: z.enum([
        "not_visited",
        "not_answered",
        "answered",
        "marked_for_review",
        "answered_marked_for_review",
      ]),
    })
  ),
});

export const submitAttemptSchema = z.object({
  answers: z.record(
    z.string(),
    z.object({
      selectedOption: z.number().nullable(),
      status: z.enum([
        "not_visited",
        "not_answered",
        "answered",
        "marked_for_review",
        "answered_marked_for_review",
      ]),
    })
  ).optional(),
});
