"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GraduationCap, Shield, User as UserIcon, LogOut, CheckCircle2 } from "lucide-react";

export function Navbar() {
  const [authStatus, setAuthStatus] = useState<{
    authenticated: boolean;
    role: "admin" | "user" | null;
    user: any;
  }>({ authenticated: false, role: null, user: null });

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setAuthStatus(data))
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    if (authStatus.role === "admin") {
      await fetch("/api/auth/admin-logout", { method: "POST" });
      window.location.href = "/admin/login";
    } else {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xl shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-blue-900 tracking-tight text-lg">
                  NTA CBT PORTAL
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-800 rounded-full uppercase tracking-wider">
                  AI Powered
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                National Online Examination & Assessment Platform
              </p>
            </div>
          </Link>

          {/* Nav links & actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors hidden md:inline-block px-3 py-2 rounded-md hover:bg-slate-50"
            >
              Examinations
            </Link>

            {authStatus.authenticated && authStatus.role === "user" && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-700 hover:text-blue-700 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
              >
                My Dashboard
              </Link>
            )}

            {authStatus.authenticated && authStatus.role === "admin" && (
              <Link
                href="/admin"
                className="text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors flex items-center gap-1.5 px-3 py-2 rounded-md bg-blue-50 border border-blue-200"
              >
                <Shield className="w-4 h-4 text-blue-600" />
                Admin Panel
              </Link>
            )}

            {/* Auth Buttons */}
            {authStatus.authenticated ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
                <div className="flex items-center space-x-2 text-xs text-slate-600">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    {authStatus.user?.displayName?.charAt(0) || "U"}
                  </div>
                  <span className="hidden sm:inline font-medium text-slate-800">
                    {authStatus.user?.displayName || authStatus.user?.username}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-sm transition-all"
                >
                  Candidate Sign In
                </Link>
                <Link
                  href="/admin/login"
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-all flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
