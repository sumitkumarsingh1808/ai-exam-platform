import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnswerItem, ExamStatusSummary } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitizes a cell for CSV export to protect against CSV / Excel Formula Injection.
 * Prepends a single quote if the first character could be interpreted as a formula or execution.
 */
export function sanitizeCsvCell(cell: unknown): string {
  if (cell === null || cell === undefined) return '""';
  const str = String(cell);
  const dangerousPrefixes = ["=", "+", "-", "@", "\t", "\r", "|", "%"];

  let cleaned = str;
  if (dangerousPrefixes.some((p) => cleaned.startsWith(p))) {
    cleaned = `'${cleaned}`;
  }

  // Escape internal double quotes by doubling them
  return `"${cleaned.replace(/"/g, '""')}"`;
}

/**
 * Formats seconds into HH:MM:SS format
 */
export function formatTimeLeft(seconds: number): string {
  if (seconds < 0) return "00:00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/**
 * Formats seconds into a human readable duration (e.g. "12m 34s")
 */
export function formatDurationHuman(seconds: number): string {
  if (seconds <= 0) return "0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(" ");
}

/**
 * Formats ISO date string
 */
export function formatDate(isoString: string): string {
  if (!isoString) return "-";
  try {
    const d = new Date(isoString);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

/**
 * Computes exact count for the 5 NTA statuses across all questions
 */
export function calculateExamSummary(
  questionIds: string[],
  answers: Record<string, AnswerItem>
): ExamStatusSummary {
  let answered = 0;
  let notAnswered = 0;
  let notVisited = 0;
  let markedForReview = 0;
  let answeredAndMarkedForReview = 0;

  for (const qId of questionIds) {
    const item = answers[qId];
    if (!item || item.status === "not_visited") {
      notVisited++;
    } else if (item.status === "answered") {
      answered++;
    } else if (item.status === "not_answered") {
      notAnswered++;
    } else if (item.status === "marked_for_review") {
      markedForReview++;
    } else if (item.status === "answered_marked_for_review") {
      answeredAndMarkedForReview++;
    }
  }

  return {
    total: questionIds.length,
    answered,
    notAnswered,
    notVisited,
    markedForReview,
    answeredAndMarkedForReview,
  };
}
