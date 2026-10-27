"use client";

import { useState } from "react";
import {
  Shield,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Database,
  Server,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setSuccess("Administrative password updated securely. Default password is now replaced.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Controller Security &amp; Platform Configuration
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage administrative credentials, rotate passwords, and review backend integration parameters.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl p-4 flex items-start gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl p-4 flex items-start gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Change Admin Password Form */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-blue-700" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Change Administrative Password
            </h2>
            <p className="text-xs text-slate-500">
              Required: If using the default password (&quot;sumit045&quot;), update it before deploying to production.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Current Password (Default: sumit045)
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Enter current password"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">New Secure Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </section>

      {/* 2. Platform Integrations Status */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Platform Integrations &amp; Telemetry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Gemini AI Status */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Google Gemini AI Engine</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Model: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold">gemini-2.5-flash</code>
            </p>
            <p className="text-[11px] text-slate-500">
              API key securely loaded from server-side environment variable{" "}
              <code className="text-blue-700 font-mono">GEMINI_API_KEY</code>.
            </p>
          </div>

          {/* Database & Storage */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Database Persistence</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Provider: <strong className="text-slate-900">Firebase Firestore / Cloud Datastore</strong>
            </p>
            <p className="text-[11px] text-slate-500">
              Atomic fallback active for local testing and CI verification before cloud credentials are bound.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
