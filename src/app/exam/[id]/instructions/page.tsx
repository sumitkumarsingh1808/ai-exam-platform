"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Clock,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

export default function ExamInstructionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [candidate, setCandidate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [declared, setDeclared] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function loadQuizData() {
      try {
        let res = await fetch(`/api/quizzes/${quizId}`);

        // If not found on this serverless instance, attempt self-healing from local storage
        if (!res.ok) {
          try {
            const customObj = JSON.parse(localStorage.getItem("nta_custom_quizzes") || "{}");
            if (customObj[quizId]?.quiz) {
              await fetch("/api/quizzes/sync-custom", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customObj[quizId]),
              });
              // Retry fetching after sync
              res = await fetch(`/api/quizzes/${quizId}`);
            }
          } catch {}
        }

        if (!res.ok) {
          try {
            const customObj = JSON.parse(localStorage.getItem("nta_custom_quizzes") || "{}");
            if (customObj[quizId]?.quiz) {
              setQuiz(customObj[quizId].quiz);
              return;
            }
          } catch {}

          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Examination paper not found");
        }

        const data = await res.json();
        setQuiz(data.quiz);
      } catch (err: any) {
        setError(err.message || "Examination paper not found");
      }
    }

    loadQuizData();

    // Fetch user info
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setCandidate(data.user);
        } else {
          // Provide fallback candidate
          setCandidate({
            displayName: "Candidate Student",
            email: "student@nta.ac.in",
          });
        }
      })
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleStartExam = async () => {
    if (!declared) return;
    setStarting(true);

    try {
      const customPayload = (() => {
        try {
          const customObj = JSON.parse(localStorage.getItem("nta_custom_quizzes") || "{}");
          return customObj[quizId] || null;
        } catch {
          return null;
        }
      })();

      let res = await fetch(`/api/quizzes/${quizId}/attempts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizSnapshot: quiz,
          customQuizData: customPayload,
        }),
      });

      // If attempt creation failed due to serverless cold-start, sync and retry
      if (!res.ok && customPayload) {
        try {
          await fetch("/api/quizzes/sync-custom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customPayload),
          });
          res = await fetch(`/api/quizzes/${quizId}/attempts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              quizSnapshot: quiz,
              customQuizData: customPayload,
            }),
          });
        } catch {}
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize examination");
      }

      router.push(`/exam/${quizId}?attemptId=${data.attempt.id}`);
    } catch (err: any) {
      alert("Error starting exam: " + err.message);
      setStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Loading Examination Paper Instructions...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">Examination Unavailable</h2>
          <p className="text-xs text-slate-600 mb-6">{error || "Unable to load paper."}</p>
          <Link
            href="/"
            className="px-4 py-2 bg-blue-700 text-white rounded-md text-xs font-bold hover:bg-blue-800 transition-colors inline-block"
          >
            &larr; Back to Examinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Banner */}
      <div className="bg-blue-900 text-white py-4 px-6 shadow-md border-b-2 border-amber-400">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="p-1.5 bg-blue-800 hover:bg-blue-700 rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold">{quiz.title}</h1>
              <p className="text-xs text-blue-200">
                Subject: {quiz.subject} • Language: {quiz.language}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-950/60 px-3 py-1.5 rounded-lg border border-blue-700 text-xs font-mono">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Duration: {quiz.durationMinutes} Minutes</span>
          </div>
        </div>
      </div>

      {/* Main Instructions Body */}
      <main className="max-w-5xl mx-auto w-full p-4 sm:p-6 flex-1">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              General Instructions for Candidate
            </h2>
            <span className="text-xs bg-blue-100 text-blue-900 px-2.5 py-1 rounded font-semibold">
              Paper Code: {quizId.toUpperCase()}
            </span>
          </div>

          <div className="p-6 space-y-6 text-xs text-slate-700 leading-relaxed max-h-[60vh] overflow-y-auto">
            {/* Quick Scheme Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/60 p-3.5 rounded-lg border border-blue-200">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Total Questions
                </span>
                <span className="text-base font-extrabold text-slate-900">
                  {quiz.totalQuestions}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Total Duration
                </span>
                <span className="text-base font-extrabold text-blue-700">
                  {quiz.durationMinutes} mins
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Marks per Correct
                </span>
                <span className="text-base font-extrabold text-emerald-700">
                  +{quiz.marksPerQuestion}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold">
                  Negative Marking
                </span>
                <span className="text-base font-extrabold text-rose-700">
                  -{quiz.negativeMarks}
                </span>
              </div>
            </div>

            {/* Instruction list */}
            <section className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                1. General Guidelines
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>
                  Total duration of examination is <strong>{quiz.durationMinutes} minutes</strong>.
                </li>
                <li>
                  The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.
                </li>
                <li>
                  When the timer reaches zero, the examination will end by itself automatically. You will not be required to end or submit your examination manually.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                2. Status Palette Indicators
              </h3>
              <p className="text-slate-600">
                The Question Palette displayed on the right side of the screen will show the status of each question using the official NTA symbols:
              </p>
              <div className="space-y-2 border border-slate-200 p-3 rounded-lg bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-answered text-[11px]">
                    1
                  </span>
                  <span>You have answered the question. (Evaluated)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-not-answered text-[11px]">
                    2
                  </span>
                  <span>You have not answered the question.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center font-semibold text-slate-800 nta-badge-not-visited text-[11px] border border-slate-300">
                    3
                  </span>
                  <span>You have not visited the question yet.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-marked text-[11px]">
                    4
                  </span>
                  <span>You have marked the question for review without answering.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-answered-marked text-[11px]">
                    5
                  </span>
                  <span>
                    You have answered and marked for review.{" "}
                    <strong className="text-emerald-700">(Will be considered for evaluation)</strong>
                  </span>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                3. Answering Procedure
              </h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>To select your answer, click on the button of one of the options.</li>
                <li>To deselect your chosen answer, click on the &quot;Clear Response&quot; button.</li>
                <li>To save your answer, you MUST click on the &quot;Save &amp; Next&quot; button.</li>
                <li>To mark the question for review, click on the &quot;Mark for Review &amp; Next&quot; button.</li>
              </ul>
            </section>
          </div>

          {/* Declaration Checkbox */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={declared}
                onChange={(e) => setDeclared(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs text-slate-800 font-semibold leading-relaxed">
                I have read and understood all the instructions above. All computer hardware and internet connectivity allotted to me are in proper working condition. I agree that in case of any unauthorized activity, my candidature will be cancelled.
              </span>
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
          >
            Cancel &amp; Return to Home
          </Link>

          <button
            onClick={handleStartExam}
            disabled={!declared || starting}
            className="px-6 py-3 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-extrabold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {starting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Launching Examination Environment...</span>
              </>
            ) : (
              <>
                <span>I Am Ready to Begin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
