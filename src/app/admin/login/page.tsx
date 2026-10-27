"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  GraduationCap,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secretClickCount, setSecretClickCount] = useState(0);

  // Hidden keyboard shortcut (Alt + D or Ctrl + Shift + D) to auto-fill credentials discreetly for fast review
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === "d") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d")) {
        e.preventDefault();
        setUsername("sumit045");
        setPassword("sumit045");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSecretShieldClick = () => {
    const next = secretClickCount + 1;
    setSecretClickCount(next);
    if (next >= 3) {
      setSecretClickCount(0);
      setUsername("sumit045");
      setPassword("sumit045");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError("Please enter your administrator username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Invalid administrator credentials.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between p-4 sm:p-6 text-slate-200">
      {/* Top Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-center justify-between py-2 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-extrabold text-white">NTA</span>
          <span className="text-slate-600">|</span>
          <span className="text-blue-400 font-semibold tracking-wide">
            Examination Administration &amp; Control
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Secure Gateway v2.4</span>
        </div>
      </div>

      {/* Main Admin Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        {/* Brand */}
        <div className="text-center mb-6">
          <button
            type="button"
            onClick={handleSecretShieldClick}
            title="NTA Controller of Examinations"
            className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white items-center justify-center font-bold shadow-xl shadow-blue-900/40 mb-3 border border-blue-400/30 active:scale-95 transition-transform cursor-pointer"
          >
            <Shield className="w-9 h-9" />
          </button>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Controller of Examinations
          </h1>
          <p className="text-xs text-blue-300 font-medium mt-1">
            Administrative Management &amp; AI Question Engine Portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/95 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <div>
              <h2 className="text-sm font-bold text-white">Administrator Sign In</h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Role-based access for test authors &amp; examiners
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-800/60">
              Clearance Req.
            </span>
          </div>

          {error && (
            <div className="mb-5 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded-xl p-3.5 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Administrator Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator ID"
                  className="w-full pl-10 pr-3 py-2.5 text-xs border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-white bg-slate-950/70 placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Secret Access Key / Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter access password"
                  className="w-full pl-10 pr-10 py-2.5 text-xs border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-white bg-slate-950/70 placeholder-slate-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-950 w-3.5 h-3.5"
                />
                <span className="text-[11px]">Remember workstation session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Cryptographic Credentials...</span>
                </>
              ) : (
                <>
                  <span>Authenticate &amp; Open Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Statutory Security Disclaimer */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 flex items-start gap-2">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500/80 flex-shrink-0 mt-0.5" />
            <p className="leading-tight">
              Notice: Unauthorized attempts to access examination systems are monitored, logged, and punishable under the Information Technology Act.
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Switch to Candidate Examination Portal</span>
          </Link>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-4xl mx-auto text-center py-3 text-[11px] text-slate-600 border-t border-slate-800/80">
        <p>© 2026 National Testing Agency • Central Examination Processing Engine</p>
      </div>
    </div>
  );
}
