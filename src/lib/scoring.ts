import { Question, AnswerItem } from "./types";

export interface ScoreResult {
  score: number;
  maximumScore: number;
  percentage: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  accuracy: number;
  questionResults: {
    questionId: string;
    selectedOption: number | null;
    correctAnswerIndex: number;
    isCorrect: boolean;
    isAnswered: boolean;
    marksAwarded: number;
  }[];
}

/**
 * Calculates score according to NTA examination rules:
 * - Questions with status 'answered' OR 'answered_marked_for_review' with selectedOption != null are evaluated.
 * - Correct answer: +marksPerQuestion
 * - Incorrect answer: -negativeMarks
 * - Unanswered / marked without answer: 0 marks
 */
export function calculateQuizScore(
  questions: Question[],
  answers: Record<string, AnswerItem>,
  marksPerQuestion: number,
  negativeMarks: number
): ScoreResult {
  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const questionResults = questions.map((question) => {
    const userAns = answers[question.id];
    const isEvaluated =
      userAns &&
      (userAns.status === "answered" ||
        userAns.status === "answered_marked_for_review") &&
      userAns.selectedOption !== null;

    if (!isEvaluated) {
      unansweredCount++;
      return {
        questionId: question.id,
        selectedOption: null,
        correctAnswerIndex: question.correctAnswerIndex,
        isCorrect: false,
        isAnswered: false,
        marksAwarded: 0,
      };
    }

    const isCorrect = userAns.selectedOption === question.correctAnswerIndex;
    let marksAwarded = 0;

    if (isCorrect) {
      correctCount++;
      marksAwarded = marksPerQuestion;
      score += marksPerQuestion;
    } else {
      incorrectCount++;
      marksAwarded = -negativeMarks;
      score -= negativeMarks;
    }

    return {
      questionId: question.id,
      selectedOption: userAns.selectedOption,
      correctAnswerIndex: question.correctAnswerIndex,
      isCorrect,
      isAnswered: true,
      marksAwarded,
    };
  });

  const totalQuestions = questions.length;
  const maximumScore = Math.max(0, totalQuestions * marksPerQuestion);
  const percentage =
    maximumScore > 0 ? Number(((score / maximumScore) * 100).toFixed(2)) : 0;

  const totalAttempted = correctCount + incorrectCount;
  const accuracy =
    totalAttempted > 0
      ? Number(((correctCount / totalAttempted) * 100).toFixed(2))
      : 0;

  return {
    score: Number(score.toFixed(2)),
    maximumScore,
    percentage,
    correctCount,
    incorrectCount,
    unansweredCount,
    accuracy,
    questionResults,
  };
}
