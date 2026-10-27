"use client";

import { ExamStatusSummary } from "@/lib/types";
import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface SubmissionModalProps {
  isOpen: boolean;
  summary: ExamStatusSummary;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SubmissionModal({
  isOpen,
  summary,
  isSubmitting,
  onCancel,
  onConfirm,
}: SubmissionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-blue-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-blue-200" />
            <h3 className="text-base font-bold">Examination Summary & Submission</h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Table */}
        <div className="p-6">
          <p className="text-xs text-slate-600 mb-4 font-medium">
            Please review your question attempt summary before finalizing your submission.
          </p>

          {/* Official Summary Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden mb-5 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Status Category</th>
                  <th className="py-2.5 px-3 text-right">No. of Questions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium">
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                    <span>Answered (Evaluated)</span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-emerald-700">
                    {summary.answered}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span>Not Answered</span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-rose-700">
                    {summary.notAnswered}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
                    <span>Marked for Review</span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-purple-700">
                    {summary.markedForReview}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                    <span>Answered & Marked for Review (Evaluated)</span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-indigo-700">
                    {summary.answeredAndMarkedForReview}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2 px-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" />
                    <span>Not Visited</span>
                  </td>
                  <td className="py-2 px-3 text-right font-bold text-slate-700">
                    {summary.notVisited}
                  </td>
                </tr>
                <tr className="bg-slate-100/80 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td className="py-2.5 px-3">Total Questions</td>
                  <td className="py-2.5 px-3 text-right text-sm">{summary.total}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-2.5 bg-amber-50 border border-amber-300 p-3 rounded-lg text-amber-900 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Important:</strong> Once you click &quot;Yes, Submit Final Examination&quot;, your answers will be locked and automatically evaluated. You cannot return or edit responses.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded shadow-sm transition-all"
          >
            No, Return to Examination
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded shadow-sm transition-all flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Yes, Submit Final Examination"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
