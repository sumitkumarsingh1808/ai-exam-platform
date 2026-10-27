"use client";

import { ClientExamQuestion } from "@/lib/types";
import { Check, Bookmark, RefreshCw, ChevronLeft, ChevronRight, Send } from "lucide-react";

interface QuestionPanelProps {
  question: ClientExamQuestion;
  currentIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  marksPerQuestion: number;
  negativeMarks: number;
  onOptionSelect: (optionIndex: number) => void;
  onSaveAndNext: () => void;
  onSaveAndMarkForReview: () => void;
  onMarkForReviewAndNext: () => void;
  onClearResponse: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export function QuestionPanel({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  marksPerQuestion,
  negativeMarks,
  onOptionSelect,
  onSaveAndNext,
  onSaveAndMarkForReview,
  onMarkForReviewAndNext,
  onClearResponse,
  onPrevious,
  onNext,
  onSubmit,
  isFirst,
  isLast,
}: QuestionPanelProps) {
  const optionLabels = ["(1)", "(2)", "(3)", "(4)"];

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      {/* Question Header Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm sm:text-base font-bold text-slate-900">
            Question No. {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
            Type: MCQ
          </span>
        </div>

        {/* Marking Scheme Indicators */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-semibold">
            Marks for correct answer: +{marksPerQuestion.toFixed(2)}
          </span>
          <span className="bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded font-semibold">
            Negative mark: -{negativeMarks.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Question Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {/* Question Topic & Difficulty Pill */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            Topic: {question.topic}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Level: {question.difficulty}
          </span>
        </div>

        {/* Question Text */}
        <div className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed mb-6 whitespace-pre-wrap select-text">
          {question.questionText}
        </div>

        {/* Four Selectable Options */}
        <div className="space-y-3 max-w-3xl">
          {question.options.map((optText, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <label
                key={idx}
                onClick={() => onOptionSelect(idx)}
                className={`flex items-start space-x-3.5 p-3.5 sm:p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? "bg-blue-50 border-blue-600 text-blue-950 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-800"
                }`}
              >
                <div className="pt-0.5 flex items-center justify-center">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    checked={isSelected}
                    onChange={() => onOptionSelect(idx)}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <div className="flex-1 flex items-start gap-2 text-sm sm:text-base font-normal">
                  <span className="font-bold text-slate-600">{optionLabels[idx]}</span>
                  <span className="leading-snug">{optText}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Button Bar (Authentic NTA Layout) */}
      <div className="bg-slate-50 border-t border-slate-200 p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Save & Next */}
          <button
            onClick={onSaveAndNext}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded shadow-sm transition-all"
            title="Save selected answer and navigate to next question"
          >
            <Check className="w-4 h-4" />
            Save & Next
          </button>

          {/* Clear Response */}
          <button
            onClick={onClearResponse}
            disabled={selectedOption === null}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            title="Clear the selected answer for this question"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear Response
          </button>

          {/* Save & Mark for Review */}
          <button
            onClick={onSaveAndMarkForReview}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded shadow-sm transition-all"
            title="Save answer and mark for evaluation review"
          >
            <Bookmark className="w-4 h-4" />
            Save & Mark for Review
          </button>

          {/* Mark for Review & Next */}
          <button
            onClick={onMarkForReviewAndNext}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold text-purple-800 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded transition-all"
            title="Mark for review without answering and move to next"
          >
            Mark for Review & Next
          </button>
        </div>

        {/* Right navigation & Submit */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <button
            onClick={onPrevious}
            disabled={isFirst}
            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <button
            onClick={onNext}
            disabled={isLast}
            className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Final Submit Button */}
          <button
            onClick={onSubmit}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-md shadow-md hover:shadow-lg transition-all"
          >
            <Send className="w-4 h-4" />
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
