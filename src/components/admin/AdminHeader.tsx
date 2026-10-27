"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Key, ExternalLink } from "lucide-react";

export function AdminHeader() {
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.role === "admin") {
          setAdminUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Admin Portal
        </span>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-bold text-slate-800">
          Examination Control & Management System
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {/* Default Password Warning */}
        {adminUser?.isDefaultPassword && (
          <Link
            href="/admin/settings"
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-md text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Default Password In Use — Update Password</span>
          </Link>
        )}

        <div className="flex items-center space-x-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-1 text-xs text-blue-700 hover:text-blue-900 font-semibold px-2.5 py-1.5 rounded border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <span>Live Student Portal</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center space-x-2 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            A
          </div>
          <div className="text-xs">
            <p className="font-bold text-slate-900 leading-none">
              {adminUser?.username || "sumit045"}
            </p>
            <span className="text-[10px] text-emerald-700 font-semibold">Authorized</span>
          </div>
        </div>
      </div>
    </header>
  );
}
