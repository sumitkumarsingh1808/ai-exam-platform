"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  Trophy,
  FileText,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  ExternalLink,
  Flame,
  Target,
  Sparkles,
  Building2,
  GraduationCap,
  Layers,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Compass,
  Check,
  ChevronRight,
  Calculator,
  Brain,
  Languages,
  BookCheck,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type StreamType = "Banking" | "UGC NET";

export default function StudentDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [activeStream, setActiveStream] = useState<StreamType>("Banking");
  const [loading, setLoading] = useState(true);

  // Load candidate profile, quizzes, and past attempts
  useEffect(() => {
    async function loadData() {
      try {
        let storedDeleted: string[] = [];
        try {
          storedDeleted = JSON.parse(localStorage.getItem("nta_deleted_quiz_ids") || "[]");
          if (Array.isArray(storedDeleted) && storedDeleted.length > 0) {
            document.cookie = `nta_deleted_quizzes=${storedDeleted.join(",")}; path=/; max-age=31536000; SameSite=Lax`;
          }
        } catch {}

        const [meRes, quizRes] = await Promise.all([
          fetch("/api/me"),
          fetch("/api/quizzes", {
            headers: storedDeleted.length > 0 ? { "x-deleted-quizzes": storedDeleted.join(",") } : {},
          }),
        ]);

        const meData = await meRes.json();
        const quizData = await quizRes.json();

        const candidateUser = meData.user || {
          displayName: "Candidate Student",
          email: "student@nta.ac.in",
          targetExam: "Banking",
        };

        setUser(candidateUser);

        let candidateQuizzes = quizData.quizzes || [];

        // Check for local published custom quizzes
        try {
          const customObj = JSON.parse(localStorage.getItem("nta_custom_quizzes") || "{}");
          for (const item of Object.values(customObj) as any[]) {
            const cq = item?.quiz;
            if (cq && cq.status === "published" && !storedDeleted.includes(cq.id)) {
              if (!candidateQuizzes.some((q: any) => q.id === cq.id)) {
                candidateQuizzes.push(cq);
              }
            }
          }
        } catch {}

        if (storedDeleted.length > 0) {
          candidateQuizzes = candidateQuizzes.filter((q: any) => !storedDeleted.includes(q.id));
        }
        candidateQuizzes = candidateQuizzes.filter((q: any) => q.status === "published");
        setQuizzes(candidateQuizzes);

        // Restore saved candidate stream preference
        const savedStream =
          localStorage.getItem("nta_target_stream") ||
          candidateUser.targetExam ||
          "Banking";

        if (savedStream === "UGC NET" || savedStream === "Banking") {
          setActiveStream(savedStream as StreamType);
        }

        if (candidateUser.uid) {
          const attemptsRes = await fetch(`/api/admin/attempts?userId=${candidateUser.uid}`);
          if (attemptsRes.ok) {
            const attData = await attemptsRes.json();
            setAttempts(attData.attempts || []);
          }
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleStreamChange = async (stream: StreamType) => {
    setActiveStream(stream);
    localStorage.setItem("nta_target_stream", stream);

    try {
      await fetch("/api/me/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetExam: stream }),
      });
    } catch {}
  };

  // Completed Attempts
  const completedAttempts = useMemo(
    () => attempts.filter((a) => a.status === "submitted"),
    [attempts]
  );

  const attemptedQuizIds = useMemo(
    () => new Set(completedAttempts.map((a) => a.quizId)),
    [completedAttempts]
  );

  // Filter quizzes by active stream
  const streamQuizzes = useMemo(() => {
    return quizzes.filter(
      (q) => (q.category || "Banking").toLowerCase() === activeStream.toLowerCase()
    );
  }, [quizzes, activeStream]);

  // Today's Live Mock for the Active Stream
  const todaysLiveMock = useMemo(() => {
    // Priority: marked as isDailyPaper within the stream, or the primary live_mock
    const daily = streamQuizzes.find((q) => q.isDailyPaper || q.paperType === "live_mock");
    return daily || streamQuizzes[0] || null;
  }, [streamQuizzes]);

  const isLiveMockAttempted = useMemo(() => {
    return todaysLiveMock ? attemptedQuizIds.has(todaysLiveMock.id) : false;
  }, [todaysLiveMock, attemptedQuizIds]);

  const liveMockAttempt = useMemo(() => {
    return todaysLiveMock ? completedAttempts.find((a) => a.quizId === todaysLiveMock.id) : null;
  }, [todaysLiveMock, completedAttempts]);

  // Stream-Specific Paper Types / Sub-sections
  const paperSubSections = useMemo(() => {
    if (activeStream === "Banking") {
      return [
        {
          id: "quant",
          title: "Quantitative Aptitude",
          icon: Calculator,
          description: "Data Interpretation, Arithmetic, Profit & Loss, Speed Math",
          papers: streamQuizzes.filter(
            (q) =>
              q.subject.toLowerCase().includes("quant") ||
              q.title.toLowerCase().includes("profit") ||
              q.title.toLowerCase().includes("math")
          ),
        },
        {
          id: "reasoning",
          title: "Reasoning Ability & Puzzles",
          icon: Brain,
          description: "Circular Seating, Syllogisms, Blood Relations, Coding-Decoding",
          papers: streamQuizzes.filter(
            (q) =>
              q.subject.toLowerCase().includes("reasoning") ||
              q.title.toLowerCase().includes("reasoning") ||
              q.paperType === "sectional_reasoning"
          ),
        },
        {
          id: "english",
          title: "English Language & Comprehension",
          icon: Languages,
          description: "Reading Comprehension, Cloze Tests, Error Spotting, Vocabulary",
          papers: streamQuizzes.filter(
            (q) =>
              q.subject.toLowerCase().includes("english") ||
              q.title.toLowerCase().includes("english") ||
              q.paperType === "sectional_english"
          ),
        },
        {
          id: "full_mocks",
          title: "Full-Length SBI & IBPS Mocks",
          icon: BookCheck,
          description: "Complete authentic memory-based examination shift papers",
          papers: streamQuizzes.filter(
            (q) =>
              q.isDailyPaper ||
              q.title.toLowerCase().includes("sbi po") ||
              q.title.toLowerCase().includes("live mock")
          ),
        },
      ];
    } else {
      // UGC NET Stream
      return [
        {
          id: "teaching",
          title: "Teaching & Research Aptitude",
          icon: GraduationCap,
          description: "Teaching Methods, Evaluation Systems, Research Design & Hypothesis",
          papers: streamQuizzes.filter(
            (q) =>
              q.subject.toLowerCase().includes("teaching") ||
              q.title.toLowerCase().includes("teaching") ||
              q.id === "quiz-ugc-net-01"
          ),
        },
        {
          id: "research",
          title: "Research Methodology & Ethics",
          icon: BookOpen,
          description: "Quantitative & Qualitative Research, Sampling, Plagiarism & Integrity",
          papers: streamQuizzes.filter(
            (q) =>
              q.subject.toLowerCase().includes("research") ||
              q.title.toLowerCase().includes("research") ||
              q.paperType === "sectional_research"
          ),
        },
        {
          id: "communication",
          title: "Communication, ICT & Higher Ed",
          icon: Layers,
          description: "Classroom Barriers, SWAYAM, NEP 2020 & University Governance",
          papers: streamQuizzes.filter(
            (q) =>
              q.subject.toLowerCase().includes("communication") ||
              q.title.toLowerCase().includes("communication") ||
              q.id === "quiz-ugc-net-02"
          ),
        },
        {
          id: "net_full",
          title: "Full-Length Paper 1 National Shifts",
          icon: BookCheck,
          description: "Official National UGC NET 50-Questions simulation shifts",
          papers: streamQuizzes.filter(
            (q) =>
              q.isDailyPaper ||
              q.title.toLowerCase().includes("live mock") ||
              q.title.toLowerCase().includes("shift")
          ),
        },
      ];
    }
  }, [activeStream, streamQuizzes]);

  // Stream Progress Calculation
  const streamCompletedCount = useMemo(() => {
    return streamQuizzes.filter((q) => attemptedQuizIds.has(q.id)).length;
  }, [streamQuizzes, attemptedQuizIds]);

  const streamProgressPercent = useMemo(() => {
    if (streamQuizzes.length === 0) return 0;
    return Math.round((streamCompletedCount / streamQuizzes.length) * 100);
  }, [streamCompletedCount, streamQuizzes.length]);

  const streamAttempts = useMemo(() => {
    return completedAttempts.filter((a) => {
      const q = quizzes.find((quiz) => quiz.id === a.quizId);
      return (q?.category || "Banking").toLowerCase() === activeStream.toLowerCase();
    });
  }, [completedAttempts, quizzes, activeStream]);

  const streamAvgScore = useMemo(() => {
    if (streamAttempts.length === 0) return 0;
    const total = streamAttempts.reduce((acc, a) => acc + (a.score || 0), 0);
    return Number((total / streamAttempts.length).toFixed(1));
  }, [streamAttempts]);

  const streamAccuracy = useMemo(() => {
    if (streamAttempts.length === 0) return 0;
    const max = streamAttempts.reduce((acc, a) => acc + (a.maxScore || 1), 0);
    const scored = streamAttempts.reduce((acc, a) => acc + Math.max(0, a.score || 0), 0);
    return Math.round((scored / max) * 100);
  }, [streamAttempts]);

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        {/* 🎯 PREPARATION STREAM SELECTOR BAR */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Your Target Examination
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Preparing for:{" "}
                <span className={activeStream === "Banking" ? "text-emerald-700" : "text-indigo-700"}>
                  {activeStream === "Banking" ? "Banking (SBI / IBPS / RBI)" : "UGC NET (Teaching & Research)"}
                </span>
              </h2>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            <button
              onClick={() => handleStreamChange("Banking")}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-extrabold transition-all ${
                activeStream === "Banking"
                  ? "bg-white text-emerald-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Banking Section</span>
            </button>

            <button
              onClick={() => handleStreamChange("UGC NET")}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg text-xs font-extrabold transition-all ${
                activeStream === "UGC NET"
                  ? "bg-white text-indigo-900 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span>UGC NET Section</span>
            </button>
          </div>
        </div>

        {/* 🌟 STREAM WELCOME & HERO BANNER */}
        <div
          className={`text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all ${
            activeStream === "Banking"
              ? "bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border-b-4 border-emerald-500"
              : "bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 border-b-4 border-indigo-500"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                  {activeStream === "Banking" ? "Banking Portal" : "UGC NET Portal"}
                </span>
                <span className="text-xs text-slate-300">• {todayFormatted}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {activeStream === "Banking"
                  ? "Banking Examination Preparation Hub"
                  : "UGC NET Examination Preparation Hub"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {activeStream === "Banking"
                  ? "Access authentic SBI PO, IBPS Clerk, and RBI Grade B mock papers, sectional tests, and today's live shift."
                  : "Access NTA UGC NET Paper 1 Teaching Aptitude, Research Ethics, ICT, Higher Education, and today's live shift."}
              </p>
            </div>

            {/* Stream Quick Metric */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-xs flex items-center space-x-4">
              <div>
                <span className="text-[10px] text-slate-300 block font-semibold">Your Stream Progress</span>
                <strong className="text-xl font-black text-amber-300">
                  {streamProgressPercent}%
                </strong>
                <span className="text-[10px] text-slate-300 block">
                  {streamCompletedCount}/{streamQuizzes.length} Papers Completed
                </span>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-white/30 border-t-amber-400 animate-spin" />
            </div>
          </div>
        </div>

        {/* 🔴 STREAM-SPECIFIC TODAY'S LIVE MOCK */}
        {todaysLiveMock && (
          <section className="bg-white rounded-2xl border-2 border-rose-300 p-6 sm:p-7 shadow-md relative overflow-hidden">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2 text-rose-700 font-extrabold text-xs uppercase tracking-wider mb-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
                  <span>
                    TODAY&apos;S LIVE MOCK • EXCLUSIVE FOR{" "}
                    {activeStream === "Banking" ? "BANKING" : "UGC NET"} CANDIDATES
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {todaysLiveMock.title}
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  {todaysLiveMock.description}
                </p>
              </div>

              {/* Status Badge */}
              <div>
                {isLiveMockAttempted ? (
                  <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-800 px-3.5 py-1.5 rounded-xl font-bold text-xs border border-emerald-300">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Completed (Score: {liveMockAttempt?.score} pts)</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-xl font-bold text-xs border border-amber-300 animate-pulse">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Today&apos;s Live Task: Action Required</span>
                  </div>
                )}
              </div>
            </div>

            {/* Exam Parameters Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5 text-xs text-slate-700 font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">DURATION</span>
                <strong className="text-slate-900 text-sm font-extrabold">
                  {todaysLiveMock.durationMinutes} Minutes
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">TOTAL QUESTIONS</span>
                <strong className="text-slate-900 text-sm font-extrabold">
                  {todaysLiveMock.totalQuestions} Questions
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">MAX MARKS</span>
                <strong className="text-blue-700 text-sm font-extrabold">
                  {todaysLiveMock.totalQuestions * todaysLiveMock.marksPerQuestion} Marks
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">MARKING SCHEME</span>
                <strong className="text-emerald-700 text-sm font-extrabold">
                  +{todaysLiveMock.marksPerQuestion} / -{todaysLiveMock.negativeMarks}
                </strong>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">
                {activeStream === "Banking"
                  ? "Standard SBI/IBPS pattern with negative marking"
                  : "Standard UGC NET Paper 1 pattern without negative marking"}
              </span>

              {isLiveMockAttempted ? (
                <Link
                  href={`/exam/${todaysLiveMock.id}/result/${liveMockAttempt?.id}`}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-2"
                >
                  <span>Review Solution &amp; Explanations</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  href={`/exam/${todaysLiveMock.id}/instructions`}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Attempt Today&apos;s Live Mock &rarr;</span>
                </Link>
              )}
            </div>
          </section>
        )}

        {/* 📚 ALL QUESTION PAPERS OF THIS SECTION (SUB-SECTIONS) */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              All Examination Question Papers in {activeStream}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive paper bank organized by test format, subject sections, and full-length mocks.
            </p>
          </div>

          <div className="space-y-8">
            {paperSubSections.map((section) => {
              const Icon = section.icon;

              return (
                <div key={section.id} className="space-y-4">
                  {/* Sub-Section Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">
                          {section.title}
                        </h3>
                        <p className="text-[11px] text-slate-500">{section.description}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {section.papers.length} Papers
                    </span>
                  </div>

                  {/* Paper Cards in this sub-section */}
                  {section.papers.length === 0 ? (
                    <div className="bg-slate-100/60 rounded-xl p-4 text-center text-xs text-slate-500 border border-slate-200/60">
                      More {section.title} practice sets are being compiled by the examination controller.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {section.papers.map((paper) => {
                        const isDone = attemptedQuizIds.has(paper.id);
                        const userAtt = completedAttempts.find((a) => a.quizId === paper.id);

                        return (
                          <div
                            key={paper.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded border border-slate-200">
                                  {paper.subject}
                                </span>
                                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  {paper.durationMinutes} mins
                                </span>
                              </div>

                              <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug line-clamp-2">
                                {paper.title}
                              </h4>

                              <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                                {paper.description}
                              </p>

                              <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 font-semibold text-slate-700">
                                <div>
                                  Questions: <strong className="text-slate-900">{paper.totalQuestions}</strong>
                                </div>
                                <div>
                                  Max Marks:{" "}
                                  <strong className="text-slate-900">
                                    {paper.totalQuestions * paper.marksPerQuestion}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                              {isDone && userAtt ? (
                                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Score: {userAtt.score} pts
                                </span>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-medium">Ready</span>
                              )}

                              {isDone ? (
                                <Link
                                  href={`/exam/${paper.id}/result/${userAtt?.id}`}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
                                >
                                  <span>Review</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              ) : (
                                <Link
                                  href={`/exam/${paper.id}/instructions`}
                                  className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1 shadow-xs"
                                >
                                  <span>Attempt Test</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 📊 STREAM PERFORMANCE & PROGRESS METRICS */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-5">
            <h3 className="font-extrabold text-slate-900 text-base">
              Your Performance Analytics in {activeStream}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live feedback grounded in your submitted tests for this stream.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Stream Papers Completed
              </span>
              <strong className="text-2xl font-black text-slate-900">
                {streamCompletedCount} / {streamQuizzes.length}
              </strong>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Stream Progress
              </span>
              <strong className="text-2xl font-black text-blue-700">
                {streamProgressPercent}%
              </strong>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Average Score
              </span>
              <strong className="text-2xl font-black text-emerald-700">
                {streamAvgScore} pts
              </strong>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Accuracy Rate
              </span>
              <strong className="text-2xl font-black text-amber-600">
                {streamAccuracy}%
              </strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
