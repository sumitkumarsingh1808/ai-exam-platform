"use client";

import { AnswerItem, ExamStatusSummary, QuestionStatus } from "@/lib/types";

interface QuestionPaletteProps {
  questionIds: string[];
  currentIndex: number;
  answers: Record<string, AnswerItem>;
  summary: ExamStatusSummary;
  candidateName: string;
  candidateRoll: string;
  candidatePhoto?: string;
  onSelectQuestion: (index: number) => void;
}

export function QuestionPalette({
  questionIds,
  currentIndex,
  answers,
  summary,
  candidateName,
  candidateRoll,
  candidatePhoto,
  onSelectQuestion,
}: QuestionPaletteProps) {
  const getQuestionStatus = (qId: string, idx: number): QuestionStatus => {
    const item = answers[qId];
    if (!item) return idx === currentIndex ? "not_answered" : "not_visited";
    return item.status;
  };

  const getStatusBadgeClasses = (status: QuestionStatus) => {
    switch (status) {
      case "answered":
        return "nta-badge-answered font-bold";
      case "not_answered":
        return "nta-badge-not-answered font-bold";
      case "marked_for_review":
        return "nta-badge-marked font-bold";
      case "answered_marked_for_review":
        return "nta-badge-answered-marked font-bold";
      case "not_visited":
      default:
        return "nta-badge-not-visited font-medium";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden text-xs">
      {/* Candidate Profile Header */}
      <div className="bg-slate-100 border-b border-slate-200 p-3 flex items-center space-x-3">
        <img
          src={
            candidatePhoto ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          }
          alt={candidateName}
          className="w-12 h-12 rounded border border-slate-300 object-cover shadow-sm"
        />
        <div>
          <p className="font-bold text-slate-900 text-sm">{candidateName}</p>
          <p className="text-slate-600 font-mono text-[11px]">Roll: {candidateRoll}</p>
          <span className="inline-block px-1.5 py-0.2 text-[10px] bg-green-100 text-green-800 rounded font-semibold">
            Status: Active
          </span>
        </div>
      </div>

      {/* Official NTA Status Legend Grid */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {/* Answered */}
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-answered text-[11px] shadow-sm">
              {summary.answered}
            </span>
            <span className="text-slate-700 font-medium">Answered</span>
          </div>

          {/* Not Answered */}
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-not-answered text-[11px] shadow-sm">
              {summary.notAnswered}
            </span>
            <span className="text-slate-700 font-medium">Not Answered</span>
          </div>

          {/* Not Visited */}
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 flex items-center justify-center font-semibold text-slate-800 nta-badge-not-visited text-[11px] border border-slate-300">
              {summary.notVisited}
            </span>
            <span className="text-slate-700 font-medium">Not Visited</span>
          </div>

          {/* Marked for Review */}
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-marked text-[11px] shadow-sm">
              {summary.markedForReview}
            </span>
            <span className="text-slate-700 font-medium">Marked for Review</span>
          </div>

          {/* Answered & Marked for Review */}
          <div className="col-span-2 flex items-center space-x-2 pt-1">
            <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-answered-marked text-[11px] shadow-sm flex-shrink-0">
              {summary.answeredAndMarkedForReview}
            </span>
            <span className="text-slate-700 text-[10px] leading-tight font-medium">
              Ans. & Marked for Review{" "}
              <span className="text-emerald-700 font-semibold">(Will be evaluated)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Palette Navigation Title */}
      <div className="px-3 py-2 bg-blue-900 text-white font-bold text-xs uppercase tracking-wide flex items-center justify-between">
        <span>Section: Part A</span>
        <span className="text-[10px] text-blue-200">Total: {questionIds.length} Questions</span>
      </div>

      {/* Numbered Question Grid */}
      <div className="flex-1 p-3 overflow-y-auto">
        <p className="text-[11px] font-semibold text-slate-500 mb-2 uppercase tracking-wider">
          Choose a question:
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {questionIds.map((qId, idx) => {
            const status = getQuestionStatus(qId, idx);
            const isCurrent = idx === currentIndex;
            const badgeClass = getStatusBadgeClasses(status);

            return (
              <button
                key={qId}
                onClick={() => onSelectQuestion(idx)}
                className={`h-9 w-full flex items-center justify-center text-xs transition-transform transform active:scale-95 shadow-sm ${badgeClass} ${
                  isCurrent ? "ring-2 ring-offset-2 ring-blue-600 scale-105" : ""
                }`}
                title={`Question ${idx + 1} (${status.replace(/_/g, " ")})`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
