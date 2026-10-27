"use client";

import { useEffect, useState } from "react";
import { Users, Search, Award, TrendingUp, Clock, Eye, X } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUserAttempts, setSelectedUserAttempts] = useState<any[] | null>(null);
  const [selectedUserName, setSelectedUserName] = useState<string>("");

  const loadUsers = async (q = "") => {
    try {
      const res = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(searchQuery);
  };

  const handleViewAttempts = async (user: any) => {
    setSelectedUserName(user.displayName);
    try {
      const res = await fetch(`/api/admin/attempts?userId=${user.uid}`);
      const data = await res.json();
      setSelectedUserAttempts(data.attempts || []);
    } catch {
      setSelectedUserAttempts([]);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Candidate &amp; Examinee Management
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Registered candidates directory, overall performance aggregates, and historical examination attempts.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate by name or email address..."
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
          >
            Search
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-slate-500">
            Loading candidate directory...
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No candidates found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Total Attempts</th>
                  <th className="py-3 px-4">Average Score</th>
                  <th className="py-3 px-4">Highest Score</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                          {u.displayName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.displayName}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">
                      {u.totalAttempts} exams
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {u.averageScore}
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-600">
                      {u.highestScore}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(u.createdAt)}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleViewAttempts(u)}
                        className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 font-bold rounded text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View History</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Attempts Modal */}
      {selectedUserAttempts !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-sm font-bold">
                Examination History: {selectedUserName}
              </h3>
              <button
                onClick={() => setSelectedUserAttempts(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-xs space-y-3">
              {selectedUserAttempts.length === 0 ? (
                <p className="text-center text-slate-500 py-6">No examinations taken yet.</p>
              ) : (
                selectedUserAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{att.quizTitle}</p>
                      <p className="text-[11px] text-slate-500">
                        Date: {formatDate(att.submittedAt || att.startedAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-700">
                        Score: {att.score ?? 0} / {att.maximumScore ?? 0} ({att.percentage ?? 0}%)
                      </span>
                      <p className="text-[10px] text-slate-400 capitalize">{att.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedUserAttempts(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
