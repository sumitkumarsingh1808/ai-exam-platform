"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  FileUp,
  FileCheck2,
  Users,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
  Bot,
  Sparkles,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "AI Agent Chat", href: "/admin/agent-chat", icon: Bot, isNew: true },
    { name: "Create Quiz (AI)", href: "/admin/quizzes/create", icon: PlusCircle },
    { name: "Upload Study Material", href: "/admin/materials", icon: FileUp },
    { name: "Quiz Management", href: "/admin/quizzes", icon: FileCheck2 },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Results & Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/admin-logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800">
      {/* Brand */}
      <div className="h-16 px-6 flex items-center space-x-3 border-b border-slate-800 bg-slate-950">
        <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center font-bold">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <span className="font-extrabold text-white text-base tracking-tight">NTA ADMIN</span>
          <p className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">
            Controller of Exams
          </p>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-900/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  NEW
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-white hover:bg-rose-950/40 border border-rose-900/40 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
}
