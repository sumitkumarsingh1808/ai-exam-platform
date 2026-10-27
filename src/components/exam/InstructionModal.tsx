"use client";

import { X, CheckCircle, Info } from "lucide-react";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="bg-blue-800 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Info className="w-5 h-5 text-blue-200" />
            <h3 className="text-base font-bold">General Instructions — NTA CBT Mode</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          <section>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">1. General Overview</h4>
            <p>
              The clock will be set at the server. The countdown timer in the top header will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end automatically by itself.
            </p>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">2. Question Palette Symbols</h4>
            <p className="mb-2">
              The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:
            </p>
            <div className="space-y-2 border border-slate-200 p-3 rounded-lg bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-answered text-[11px] shadow-sm">
                  1
                </span>
                <span>You have answered the question. (Evaluated)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-not-answered text-[11px] shadow-sm">
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
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-marked text-[11px] shadow-sm">
                  4
                </span>
                <span>You have marked the question for review without answering.</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-white nta-badge-answered-marked text-[11px] shadow-sm">
                  5
                </span>
                <span>
                  You have answered and marked for review.{" "}
                  <strong className="text-emerald-700">This will be considered for evaluation.</strong>
                </span>
              </div>
            </div>
          </section>

          <section>
            <h4 className="font-bold text-slate-900 text-sm mb-1.5">3. Answering Procedure</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Click on the ball/circle of your chosen option to select an answer.</li>
              <li>To deselect your chosen answer, click on the &quot;Clear Response&quot; button.</li>
              <li>To save your answer, you MUST click on the &quot;Save &amp; Next&quot; button.</li>
              <li>To mark a question for review, you can click on &quot;Mark for Review &amp; Next&quot; or &quot;Save &amp; Mark for Review&quot;.</li>
            </ul>
          </section>
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-sm transition-all"
          >
            Close Instructions
          </button>
        </div>
      </div>
    </div>
  );
}
