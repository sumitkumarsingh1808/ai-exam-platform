import Link from "next/link";
import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { db } from "@/lib/db";
import {
  Clock,
  FileText,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Award,
} from "lucide-react";
import { StreamExplorer } from "@/components/home/StreamExplorer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  try {
    const cookieStore = await cookies();
    const deletedCookie = cookieStore.get("nta_deleted_quizzes")?.value;
    if (deletedCookie) {
      const deletedList = deletedCookie.split(",").map((s) => s.trim()).filter(Boolean);
      if (deletedList.length > 0) {
        await db.registerDeletedQuizzes(deletedList);
      }
    }
  } catch {}

  const [quizzes, categories] = await Promise.all([
    db.listQuizzes(false),
    db.getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b-4 border-amber-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600 text-xs font-semibold text-blue-200 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Standardized Computer Based Test (CBT) System</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              AI-Powered Online Examination Platform
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-normal">
              Official NTA-inspired examination experience featuring Banking and UGC NET examination streams, live countdown timer, daily target tasks, candidate progress analytics, and AI question generation.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Candidate Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/admin/login"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-blue-300" />
                <span>Admin Controller</span>
              </Link>
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="w-full md:w-96 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-xs text-white shadow-xl">
            <div className="flex items-center gap-2 font-bold text-amber-300 mb-3 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Official Examination Guidelines</span>
            </div>
            <ul className="space-y-2 text-slate-200 text-xs">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Real-time countdown timer synchronized with examination servers.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Responses auto-save in background at every question transition.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>
                  &quot;Answered &amp; Marked for Review&quot; counts towards final score evaluation.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Negative marking applies for incorrect options.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stream Explorer Section */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <StreamExplorer initialQuizzes={quizzes} categories={categories} />
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-xs text-center border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 National Testing Agency • AI-Powered Online Examination Platform.</p>
          <div className="flex items-center space-x-4">
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Candidate Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
