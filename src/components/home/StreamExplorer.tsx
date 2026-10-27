"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Building2,
  GraduationCap,
  FileText,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Quiz } from "@/lib/types";

interface StreamExplorerProps {
  initialQuizzes: Quiz[];
  categories: string[];
}

export function StreamExplorer({ initialQuizzes, categories }: StreamExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Client-side tombstone filtering
  const activeQuizzes = useMemo(() => {
    if (typeof window === "undefined") return initialQuizzes;
    try {
      const stored = JSON.parse(localStorage.getItem("nta_deleted_quiz_ids") || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        return initialQuizzes.filter((q) => !stored.includes(q.id));
      }
    } catch {}
    return initialQuizzes;
  }, [initialQuizzes]);

  // Today's target papers
  const todaysPapers = useMemo(() => {
    return activeQuizzes.filter((q) => q.isDailyPaper);
  }, [activeQuizzes]);

  const filteredQuizzes = useMemo(() => {
    if (selectedCategory === "all") return activeQuizzes;
    return activeQuizzes.filter(
      (q) => (q.category || "Banking").toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [activeQuizzes, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* 🌟 TODAY'S TARGET PAPERS SPOTLIGHT */}
      {todaysPapers.length > 0 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-1">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Live Daily Target Paper • {todayFormatted}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Today&apos;s Featured National Mocks
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Active examination shifts configured for Banking (SBI PO) and UGC NET candidates today.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Official Live Mocks
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {todaysPapers.map((paper) => {
              const isBanking = (paper.category || "").toLowerCase().includes("bank");

              return (
                <div
                  key={paper.id}
                  className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/40 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Today&apos;s Paper
                        </span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 flex items-center gap-1">
                          {isBanking ? (
                            <Building2 className="w-3 h-3" />
                          ) : (
                            <GraduationCap className="w-3 h-3" />
                          )}
                          {paper.category || "General"}
                        </span>
                      </div>

                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        {paper.durationMinutes} Mins
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-lg mb-2 leading-snug">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                      {paper.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white p-3 rounded-xl border border-slate-200/80 mb-5 font-semibold text-slate-700 shadow-2xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Questions</span>
                        <strong className="text-slate-900 text-sm">{paper.totalQuestions} Qs</strong>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Max Marks</span>
                        <strong className="text-blue-700 text-sm">
                          {paper.totalQuestions * paper.marksPerQuestion} pts
                        </strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-bold">Marking</span>
                        <strong className="text-emerald-700 text-sm">+{paper.marksPerQuestion}/-{paper.negativeMarks}</strong>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/exam/${paper.id}/instructions`}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-xl text-xs shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Attempt Today&apos;s Paper Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 📚 ALL MOCK PAPERS BY STREAM */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Standardized Examination Streams
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Filter by stream to practice specialized papers created by the Examination Controller.
            </p>
          </div>

          {/* Stream Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto text-xs py-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Streams ({initialQuizzes.length})
            </button>

            {categories.map((cat) => {
              const count = initialQuizzes.filter(
                (q) => (q.category || "Banking").toLowerCase() === cat.toLowerCase()
              ).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No papers found for {selectedCategory}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group p-5"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                        {quiz.category || "Banking"}
                      </span>
                      {quiz.isDailyPaper && (
                        <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          Today&apos;s Task
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {quiz.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {quiz.description || "Official computer based mock assessment on NTA pattern."}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-4 font-medium text-slate-700">
                    <div>
                      Questions: <strong className="text-slate-900">{quiz.totalQuestions}</strong>
                    </div>
                    <div>
                      Max Marks:{" "}
                      <strong className="text-slate-900">
                        {quiz.totalQuestions * quiz.marksPerQuestion}
                      </strong>
                    </div>
                    <div>
                      Marks / Q: <strong className="text-emerald-700">+{quiz.marksPerQuestion}</strong>
                    </div>
                    <div>
                      Negative: <strong className="text-rose-700">-{quiz.negativeMarks}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <Link
                    href={`/exam/${quiz.id}/instructions`}
                    className="w-full text-center py-2.5 px-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Attempt Exam (CBT Screen)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
