"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  Printer,
  ChevronLeft,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { formatDurationHuman, formatDate } from "@/lib/utils";

export default function ExamResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;
  const attemptId = resolvedParams.attemptId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/attempts/${attemptId}/result`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load examination result");
        return res.json();
      })
      .then((data) => setResultData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Calculating Official Score &amp; Assessment Report...</p>
        </div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 max-w-md text-center">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Result Error</h2>
          <p className="text-xs text-slate-600 mb-6">{error || "Unable to display result."}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-700 text-white rounded-md text-xs font-bold inline-block"
          >
            Return to Examinations
          </Link>
        </div>
      </div>
    );
  }

  const { attempt, quiz, canReviewQuestions, reviewQuestions } = resultData;
  const isPassed = (attempt.percentage || 0) >= 40;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex-1">
        {/* Navigation & Print */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Candidate Dashboard</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Scorecard</span>
          </button>
        </div>

        {/* Scorecard Hero Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden border-b-4 border-amber-400 mb-8 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600 text-xs font-semibold text-blue-200 mb-3">
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Official NTA Score Card &amp; Analysis</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                {quiz.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300">
                Candidate: <strong className="text-white">{attempt.userName}</strong> • Roll:{" "}
                <span className="font-mono text-blue-300">{attempt.id.toUpperCase()}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Completed on {formatDate(attempt.submittedAt)}
              </p>
            </div>

            {/* Score Ring / Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center min-w-[200px] shadow-lg">
              <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                Total Score Obtained
              </span>
              <div className="text-4xl sm:text-5xl font-black text-amber-300 my-1 font-mono">
                {attempt.score ?? 0}
                <span className="text-xl font-normal text-slate-400">
                  /{attempt.maximumScore ?? 0}
                </span>
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-extrabold mt-1 uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {attempt.percentage ?? 0}% Percentage
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
            <div className="bg-white/5 p-3 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Correct Answers</span>
              <span className="text-lg font-bold text-emerald-400">
                {attempt.correctCount ?? 0}
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Incorrect Answers</span>
              <span className="text-lg font-bold text-rose-400">
                {attempt.incorrectCount ?? 0}
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Unanswered</span>
              <span className="text-lg font-bold text-slate-300">
                {attempt.unansweredCount ?? 0}
              </span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Time Taken</span>
              <span className="text-lg font-bold text-amber-300 font-mono">
                {formatDurationHuman(attempt.timeTakenSeconds ?? 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Question by Question Review */}
        {canReviewQuestions && reviewQuestions.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-700" />
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                  Question-by-Question Solution &amp; AI Explanations
                </h2>
              </div>
              <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full font-semibold">
                {reviewQuestions.length} Questions Reviewed
              </span>
            </div>

            <div className="space-y-5">
              {reviewQuestions.map((q: any, idx: number) => {
                const isCorrect = q.isCorrect;
                const isAnswered = q.isAnswered;

                return (
                  <div
                    key={q.id}
                    className={`bg-white rounded-xl border-2 shadow-sm p-5 sm:p-6 transition-all ${
                      !isAnswered
                        ? "border-slate-200"
                        : isCorrect
                        ? "border-emerald-300 bg-emerald-50/10"
                        : "border-rose-300 bg-rose-50/10"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-900">
                          Question {idx + 1}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          {q.topic}
                        </span>
                      </div>

                      {/* Status & Marks Awarded Badge */}
                      <div className="flex items-center space-x-2">
                        {!isAnswered ? (
                          <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md">
                            Unanswered (0.00)
                          </span>
                        ) : isCorrect ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-md">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Correct (+{q.marks.toFixed(2)})
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-rose-100 text-rose-800 rounded-md">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Incorrect ({q.marks.toFixed(2)})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <p className="text-sm sm:text-base font-semibold text-slate-900 mb-4 leading-relaxed">
                      {q.questionText}
                    </p>

                    {/* Options list */}
                    <div className="space-y-2 mb-5">
                      {q.options.map((opt: string, optIdx: number) => {
                        const isOfficialCorrect = optIdx === q.correctAnswerIndex;
                        const isStudentSelected = optIdx === q.selectedOption;

                        let rowStyle =
                          "border-slate-200 bg-slate-50/60 text-slate-700";

                        if (isOfficialCorrect) {
                          rowStyle =
                            "border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold shadow-sm";
                        } else if (isStudentSelected && !isOfficialCorrect) {
                          rowStyle =
                            "border-rose-400 bg-rose-50 text-rose-950 font-medium";
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start justify-between gap-3 ${rowStyle}`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="font-bold text-slate-500">
                                ({optIdx + 1})
                              </span>
                              <span>{opt}</span>
                            </div>

                            <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                              {isStudentSelected && (
                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                                  Your Choice
                                </span>
                              )}
                              {isOfficialCorrect && (
                                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Correct Key
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* AI Explanation Box */}
                    {q.explanation && (
                      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-4 text-xs">
                        <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                          <span>Gemini AI Detailed Explanation</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-normal">
                          {q.explanation}
                        </p>
                        {q.sourceReference && (
                          <span className="inline-block mt-2 text-[10px] text-blue-800 font-semibold bg-blue-100/60 px-2 py-0.5 rounded">
                            Reference: {q.sourceReference}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Footer Actions */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <span>Back to Candidate Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
