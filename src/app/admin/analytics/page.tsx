"use client";

import { useEffect, useState } from "react";
import { BarChart3, Download, Search, Filter, CheckCircle2, Clock } from "lucide-react";
import { formatDate, formatDurationHuman } from "@/lib/utils";

export default function AnalyticsPage() {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuizId, setSelectedQuizId] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadData = async () => {
    try {
      const [attRes, quizRes] = await Promise.all([
        fetch(`/api/admin/attempts${selectedQuizId ? `?quizId=${selectedQuizId}` : ""}`),
        fetch("/api/admin/quizzes"),
      ]);

      if (attRes.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const attData = await attRes.json();
      const quizData = await quizRes.json();

      setAttempts(attData.attempts || []);
      setQuizzes(quizData.quizzes || []);
    } catch (err) {
      console.error("Failed to load analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedQuizId]);

  const handleExportCsv = () => {
    const url = `/api/admin/exports/results${selectedQuizId ? `?quizId=${selectedQuizId}` : ""}`;
    window.open(url, "_blank");
  };

  const filteredAttempts = attempts.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Results &amp; Assessment Telemetry
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Detailed examination attempt logs, score analytics, and sanitized CSV exports.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Results (Sanitized CSV)</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 text-xs">
        <div className="flex-1 w-full sm:w-auto">
          <label className="block font-bold text-slate-700 mb-1">Filter by Examination:</label>
          <select
            value={selectedQuizId}
            onChange={(e) => setSelectedQuizId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none"
          >
            <option value="">All Examinations ({quizzes.length})</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-48">
          <label className="block font-bold text-slate-700 mb-1">Filter Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none"
          >
            <option value="all">All ({attempts.length})</option>
            <option value="submitted">Submitted Only</option>
            <option value="in_progress">In Progress</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-slate-500">
            Loading attempt logs...
          </div>
        ) : filteredAttempts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <BarChart3 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No attempts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Examination Paper</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Percentage</th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Time Taken</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Submitted At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAttempts.map((att) => (
                  <tr key={att.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{att.userName}</p>
                      <p className="text-[11px] text-slate-500">{att.userEmail}</p>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {att.quizTitle}
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-700">
                      {att.score ?? "-"} / {att.maximumScore ?? "-"}
                    </td>
                    <td className="py-3 px-4">
                      {att.percentage !== undefined ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                          {att.percentage}%
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {att.correctCount !== undefined && att.incorrectCount !== undefined
                        ? `${att.correctCount}C / ${att.incorrectCount}I`
                        : "-"}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatDurationHuman(att.timeTakenSeconds || 0)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          att.status === "submitted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {formatDate(att.submittedAt || att.startedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
