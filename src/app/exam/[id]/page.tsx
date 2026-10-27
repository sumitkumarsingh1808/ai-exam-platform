"use client";

import { useEffect, useState, use, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ExamHeader } from "@/components/exam/ExamHeader";
import { QuestionPanel } from "@/components/exam/QuestionPanel";
import { QuestionPalette } from "@/components/exam/QuestionPalette";
import { SubmissionModal } from "@/components/exam/SubmissionModal";
import { InstructionModal } from "@/components/exam/InstructionModal";
import {
  ClientExamQuestion,
  AnswerItem,
  QuestionStatus,
  ExamStatusSummary,
} from "@/lib/types";
import { calculateExamSummary } from "@/lib/utils";
import { AlertTriangle, Grid, ChevronRight, X, FileText } from "lucide-react";

export default function ExamLivePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptIdParam = searchParams.get("attemptId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Exam Data
  const [quiz, setQuiz] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<ClientExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Candidate answers state: questionId -> AnswerItem
  const [answers, setAnswers] = useState<Record<string, AnswerItem>>({});
  const [candidate, setCandidate] = useState<any>({
    displayName: "Candidate Student",
    rollNo: "NTA-2026-9045",
  });

  // Timer state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(3600);
  const deadlineRef = useRef<number | null>(null);

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isQuestionPaperOpen, setIsQuestionPaperOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);
  const [language, setLanguage] = useState("English");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");

  // Load Exam and Attempt
  useEffect(() => {
    async function loadExam() {
      try {
        const url = `/api/quizzes/${quizId}/exam${
          attemptIdParam ? `?attemptId=${attemptIdParam}` : ""
        }`;
        let res = await fetch(url);

        let data = await res.json().catch(() => ({}));

        // Self-heal from local storage if needed on fresh serverless containers
        if (!res.ok || !data.questions || data.questions.length === 0) {
          try {
            const customObj = JSON.parse(localStorage.getItem("nta_custom_quizzes") || "{}");
            if (customObj[quizId]?.quiz) {
              await fetch("/api/quizzes/sync-custom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customObj[quizId]),
              });
              res = await fetch(url);
              data = await res.json().catch(() => ({}));
            }
          } catch {}
        }

        if (!res.ok) {
          throw new Error(data.error || "Failed to load examination");
        }

        if (!data.attempt) {
          router.push(`/exam/${quizId}/instructions`);
          return;
        }

        if (data.attempt.status === "submitted") {
          router.push(`/exam/${quizId}/result/${data.attempt.id}`);
          return;
        }

        setQuiz(data.quiz);
        setAttempt(data.attempt);
        setQuestions(data.questions);

        // Populate initial answers
        const existingAnswers = data.attempt.answers || {};
        const initialMap: Record<string, AnswerItem> = {};

        data.questions.forEach((q: ClientExamQuestion, idx: number) => {
          if (existingAnswers[q.id]) {
            initialMap[q.id] = existingAnswers[q.id];
          } else {
            initialMap[q.id] = {
              selectedOption: null,
              status: idx === 0 ? "not_answered" : "not_visited",
            };
          }
        });

        setAnswers(initialMap);

        // Candidate profile
        setCandidate({
          displayName: data.attempt.userName || "Candidate Student",
          rollNo: `NTA-${data.attempt.id.substring(data.attempt.id.length - 6).toUpperCase()}`,
        });

        // Set deadline
        const deadlineMs = new Date(data.attempt.deadlineAt).getTime();
        deadlineRef.current = deadlineMs;
        const remaining = Math.max(0, Math.floor((deadlineMs - Date.now()) / 1000));
        setTimeLeftSeconds(remaining);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadExam();
  }, [quizId, attemptIdParam, router]);

  // Periodic Auto-save answers to server
  const saveAnswersToServer = useCallback(
    async (updatedAnswers: Record<string, AnswerItem>) => {
      if (!attempt?.id) return;
      try {
        setSaveStatus("saving");
        const res = await fetch(`/api/attempts/${attempt.id}/answers`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: updatedAnswers, quizId }),
        });

        if (res.ok) {
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
      } catch {
        setSaveStatus("error");
      }
    },
    [attempt?.id, quizId]
  );

  // Auto-submit when countdown hits zero
  const autoSubmitOnExpiry = useCallback(async () => {
    if (!attempt?.id) return;
    try {
      await fetch(`/api/attempts/${attempt.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, quizId }),
      });
      router.push(`/exam/${quizId}/result/${attempt.id}`);
    } catch {
      router.push(`/exam/${quizId}/result/${attempt.id}`);
    }
  }, [attempt?.id, answers, quizId, router]);

  // Synchronized real-time countdown timer
  useEffect(() => {
    if (!attempt?.id) return;

    // Calculate deadline from attempt, storage, or duration
    let targetDeadlineMs: number;
    if (attempt.deadlineAt) {
      targetDeadlineMs = new Date(attempt.deadlineAt).getTime();
    } else {
      const storageKey = `nta_exam_deadline_${attempt.id}`;
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        targetDeadlineMs = parseInt(saved, 10);
      } else {
        const durationSec = (quiz?.durationMinutes || 60) * 60;
        targetDeadlineMs = Date.now() + durationSec * 1000;
        sessionStorage.setItem(storageKey, targetDeadlineMs.toString());
      }
    }

    deadlineRef.current = targetDeadlineMs;

    // Initial update
    const initialRemaining = Math.max(0, Math.floor((targetDeadlineMs - Date.now()) / 1000));
    setTimeLeftSeconds(initialRemaining);

    if (initialRemaining <= 0) {
      autoSubmitOnExpiry();
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((targetDeadlineMs - now) / 1000));
      setTimeLeftSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        autoSubmitOnExpiry();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [attempt?.id, attempt?.deadlineAt, quiz?.durationMinutes, autoSubmitOnExpiry]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Current question data
  const currentQuestion = questions[currentIndex];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;
  const currentSelectedOption = currentAnswer?.selectedOption ?? null;

  // Question IDs list
  const questionIds = questions.map((q) => q.id);
  const summary: ExamStatusSummary = calculateExamSummary(questionIds, answers);

  // Handlers
  const handleOptionSelect = (optionIndex: number) => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const prev = answers[qId];

    const nextState: AnswerItem = {
      selectedOption: optionIndex,
      // If was marked for review, keep marked state; else standard answered
      status:
        prev?.status === "marked_for_review" ||
        prev?.status === "answered_marked_for_review"
          ? "answered_marked_for_review"
          : "answered",
      updatedAt: new Date().toISOString(),
    };

    const nextAnswers = { ...answers, [qId]: nextState };
    setAnswers(nextAnswers);
  };

  const handleSaveAndNext = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const hasSelection = currentSelectedOption !== null;

    const nextStatus: QuestionStatus = hasSelection ? "answered" : "not_answered";
    const nextAnswers = {
      ...answers,
      [qId]: {
        selectedOption: currentSelectedOption,
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      },
    };

    // Mark next question as visited/not_answered if not already answered
    if (currentIndex < questions.length - 1) {
      const nextQId = questions[currentIndex + 1].id;
      if (!nextAnswers[nextQId] || nextAnswers[nextQId].status === "not_visited") {
        nextAnswers[nextQId] = {
          selectedOption: null,
          status: "not_answered",
        };
      }
      setCurrentIndex((prev) => prev + 1);
    }

    setAnswers(nextAnswers);
    saveAnswersToServer(nextAnswers);
  };

  const handleClearResponse = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;
    const nextAnswers = {
      ...answers,
      [qId]: {
        selectedOption: null,
        status: "not_answered" as QuestionStatus,
        updatedAt: new Date().toISOString(),
      },
    };
    setAnswers(nextAnswers);
    saveAnswersToServer(nextAnswers);
  };

  const handleSaveAndMarkForReview = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;

    const nextAnswers = {
      ...answers,
      [qId]: {
        selectedOption: currentSelectedOption,
        status:
          currentSelectedOption !== null
            ? ("answered_marked_for_review" as QuestionStatus)
            : ("marked_for_review" as QuestionStatus),
        updatedAt: new Date().toISOString(),
      },
    };

    if (currentIndex < questions.length - 1) {
      const nextQId = questions[currentIndex + 1].id;
      if (!nextAnswers[nextQId] || nextAnswers[nextQId].status === "not_visited") {
        nextAnswers[nextQId] = {
          selectedOption: null,
          status: "not_answered",
        };
      }
      setCurrentIndex((prev) => prev + 1);
    }

    setAnswers(nextAnswers);
    saveAnswersToServer(nextAnswers);
  };

  const handleMarkForReviewAndNext = () => {
    if (!currentQuestion) return;
    const qId = currentQuestion.id;

    const nextAnswers = {
      ...answers,
      [qId]: {
        selectedOption: null,
        status: "marked_for_review" as QuestionStatus,
        updatedAt: new Date().toISOString(),
      },
    };

    if (currentIndex < questions.length - 1) {
      const nextQId = questions[currentIndex + 1].id;
      if (!nextAnswers[nextQId] || nextAnswers[nextQId].status === "not_visited") {
        nextAnswers[nextQId] = {
          selectedOption: null,
          status: "not_answered",
        };
      }
      setCurrentIndex((prev) => prev + 1);
    }

    setAnswers(nextAnswers);
    saveAnswersToServer(nextAnswers);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      ensureVisitedStatus(currentIndex - 1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      ensureVisitedStatus(currentIndex + 1);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSelectQuestion = (index: number) => {
    ensureVisitedStatus(index);
    setCurrentIndex(index);
    setIsMobilePaletteOpen(false);
  };

  const ensureVisitedStatus = (targetIndex: number) => {
    const targetQ = questions[targetIndex];
    if (!targetQ) return;
    const current = answers[targetQ.id];
    if (!current || current.status === "not_visited") {
      setAnswers((prev) => ({
        ...prev,
        [targetQ.id]: {
          selectedOption: null,
          status: "not_answered",
        },
      }));
    }
  };

  const handleFinalSubmit = async () => {
    if (!attempt?.id) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/attempts/${attempt.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, quizId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      router.push(`/exam/${quizId}/result/${attempt.id}`);
    } catch (err: any) {
      alert("Submission error: " + err.message);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold tracking-wider uppercase text-blue-200">
            Initializing Secure Examination Environment...
          </p>
        </div>
      </div>
    );
  }

  if (error || !quiz || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Examination Error</h2>
          <p className="text-xs text-slate-600 mb-6">{error || "Unable to load paper questions."}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-700 text-white rounded-md text-xs font-bold"
          >
            Return to Examination Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 overflow-hidden">
      {/* 1. Header */}
      <ExamHeader
        quizTitle={quiz.title}
        subject={quiz.subject}
        candidateName={candidate.displayName}
        candidateRoll={candidate.rollNo}
        timeLeftSeconds={timeLeftSeconds}
        language={language}
        onLanguageChange={setLanguage}
        onViewInstructions={() => setIsInstructionsOpen(true)}
        onViewQuestionPaper={() => setIsQuestionPaperOpen(true)}
        onSubmitClick={() => setIsSubmitModalOpen(true)}
      />

      {/* Auto-save notification pill */}
      <div className="bg-slate-200/80 px-4 py-1 text-[11px] font-semibold text-slate-600 flex items-center justify-between border-b border-slate-300">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              saveStatus === "saved"
                ? "bg-emerald-500"
                : saveStatus === "saving"
                ? "bg-amber-500 animate-pulse"
                : "bg-rose-500"
            }`}
          />
          <span>
            {saveStatus === "saved"
              ? "All answers auto-saved"
              : saveStatus === "saving"
              ? "Auto-saving response..."
              : "Auto-save retry pending"}
          </span>
        </div>

        {/* Mobile toggle button for question palette */}
        <button
          onClick={() => setIsMobilePaletteOpen(true)}
          className="lg:hidden flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300 shadow-sm"
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Question Palette ({summary.answered}/{questions.length})</span>
        </button>
      </div>

      {/* 2. Main Examination Area (Two-column desktop layout) */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-4 flex gap-4 overflow-hidden">
        {/* Left Section — Question Panel (70%) */}
        <div className="flex-1 flex flex-col h-[calc(100vh-140px)] min-w-0">
          <QuestionPanel
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedOption={currentSelectedOption}
            marksPerQuestion={quiz.marksPerQuestion}
            negativeMarks={quiz.negativeMarks}
            onOptionSelect={handleOptionSelect}
            onSaveAndNext={handleSaveAndNext}
            onSaveAndMarkForReview={handleSaveAndMarkForReview}
            onMarkForReviewAndNext={handleMarkForReviewAndNext}
            onClearResponse={handleClearResponse}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={() => setIsSubmitModalOpen(true)}
            isFirst={currentIndex === 0}
            isLast={currentIndex === questions.length - 1}
          />
        </div>

        {/* Right Section — Question Palette (30% desktop) */}
        <div className="hidden lg:flex w-80 xl:w-96 flex-col h-[calc(100vh-140px)]">
          <QuestionPalette
            questionIds={questionIds}
            currentIndex={currentIndex}
            answers={answers}
            summary={summary}
            candidateName={candidate.displayName}
            candidateRoll={candidate.rollNo}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>
      </div>

      {/* Mobile Question Palette Drawer */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsMobilePaletteOpen(false)}
          />
          <div className="relative ml-auto w-80 max-w-full bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-3 bg-blue-900 text-white flex items-center justify-between font-bold text-xs">
              <span>Question Palette</span>
              <button
                onClick={() => setIsMobilePaletteOpen(false)}
                className="p-1 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <QuestionPalette
                questionIds={questionIds}
                currentIndex={currentIndex}
                answers={answers}
                summary={summary}
                candidateName={candidate.displayName}
                candidateRoll={candidate.rollNo}
                onSelectQuestion={handleSelectQuestion}
              />
            </div>
          </div>
        </div>
      )}

      {/* Submission Confirmation Modal */}
      <SubmissionModal
        isOpen={isSubmitModalOpen}
        summary={summary}
        isSubmitting={isSubmitting}
        onCancel={() => setIsSubmitModalOpen(false)}
        onConfirm={handleFinalSubmit}
      />

      {/* General Instructions Modal */}
      <InstructionModal
        isOpen={isInstructionsOpen}
        onClose={() => setIsInstructionsOpen(false)}
      />

      {/* Full Question Paper Overview Modal */}
      {isQuestionPaperOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-blue-900 text-white px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-200" />
                <h3 className="text-base font-bold">Complete Question Paper Preview</h3>
              </div>
              <button
                onClick={() => setIsQuestionPaperOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-800">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-800">Question {idx + 1}</span>
                    <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                      Topic: {q.topic}
                    </span>
                  </div>
                  <p className="font-medium text-slate-900 mb-3">{q.questionText}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                    {q.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="bg-white p-2 rounded border border-slate-200 flex items-start gap-1.5"
                      >
                        <span className="font-bold text-slate-500">({optIdx + 1})</span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
              <button
                onClick={() => setIsQuestionPaperOpen(false)}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded"
              >
                Close Question Paper
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
