"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FileCheck2,
  FileText,
  Trophy,
  TrendingUp,
  Award,
  ArrowRight,
  PlusCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { formatDate, formatDurationHuman } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/admin/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setAnalytics(data);
      })
      .catch((err) => console.error("Error loading analytics:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Loading Administrative Metrics...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Registered Users",
      value: analytics?.totalUsers ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      title: "Total Quizzes",
      value: analytics?.totalQuizzes ?? 0,
      icon: FileText,
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Published Quizzes",
      value: analytics?.publishedQuizzes ?? 0,
      icon: FileCheck2,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Total Exam Attempts",
      value: analytics?.totalAttempts ?? 0,
      icon: Clock,
      color: "bg-purple-50 text-purple-700",
    },
    {
      title: "Average Score",
      value: analytics?.averageScore ?? 0,
      icon: TrendingUp,
      color: "bg-amber-50 text-amber-700",
    },
    {
      title: "Highest Score",
      value: analytics?.highestScore ?? 0,
      icon: Trophy,
      color: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Examination Controller Overview
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Monitor real-time candidate participations, test scores, and AI question authoring.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/quizzes/create"
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Create AI Quiz</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  {s.title}
                </span>
                <div className={`p-2 rounded-lg ${s.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Score Distribution Overview */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 mb-4 tracking-tight flex items-center justify-between">
          <span>Candidate Score Range Distribution</span>
          <span className="text-xs text-slate-400 font-normal">
            Based on {analytics?.submittedAttempts ?? 0} submitted attempts
          </span>
        </h2>

        <div className="space-y-3">
          {analytics?.scoreDistribution?.map((item: any) => {
            const count = item.count;
            const total = analytics?.submittedAttempts || 1;
            const pct = Math.round((count / total) * 100);

            return (
              <div key={item.range} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-700">{item.range} Score Bracket</span>
                  <span className="text-slate-900 font-mono">
                    {count} candidates ({pct}%)
                  </span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column: Recent Attempts & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attempts */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Examination Submissions
              </h2>
              <Link
                href="/admin/analytics"
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {analytics?.recentAttempts?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No attempts yet.</p>
              ) : (
                analytics?.recentAttempts?.slice(0, 5).map((att: any) => (
                  <div key={att.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{att.userName}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{att.quizTitle}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                          att.status === "submitted"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {att.status === "submitted"
                          ? `Score: ${att.score}/${att.maximumScore}`
                          : "In Progress"}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(att.startedAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Candidate Registrations
              </h2>
              <Link
                href="/admin/users"
                className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
              >
                Manage users &rarr;
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {analytics?.recentUsers?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No users registered yet.</p>
              ) : (
                analytics?.recentUsers?.slice(0, 5).map((u: any) => (
                  <div key={u.uid} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                        {u.displayName?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.displayName}</p>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold">
                        Role: {u.role}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {formatDate(u.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
