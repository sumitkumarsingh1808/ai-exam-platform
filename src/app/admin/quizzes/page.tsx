"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  Globe,
  Archive,
  ExternalLink,
  Sparkles,
  Layers,
  FolderPlus,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Quiz } from "@/lib/types";

export default function QuizManagementPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["Banking", "UGC NET"]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      let storedDeleted: string[] = [];
      try {
        storedDeleted = JSON.parse(localStorage.getItem("nta_deleted_quiz_ids") || "[]");
        if (Array.isArray(storedDeleted) && storedDeleted.length > 0) {
          document.cookie = `nta_deleted_quizzes=${storedDeleted.join(",")}; path=/; max-age=31536000; SameSite=Lax`;
        }
      } catch {}

      const [resQ, resC] = await Promise.all([
        fetch("/api/admin/quizzes", {
          headers: storedDeleted.length > 0 ? { "x-deleted-quizzes": storedDeleted.join(",") } : {},
        }),
        fetch("/api/categories"),
      ]);

      if (resQ.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const dataQ = await resQ.json();
      const dataC = await resC.json();

      let list = dataQ.quizzes || [];
      if (storedDeleted.length > 0) {
        list = list.filter((q: Quiz) => !storedDeleted.includes(q.id));
      }

      // Check for locally saved custom quizzes and sync if needed
      try {
        const customObj = JSON.parse(localStorage.getItem("nta_custom_quizzes") || "{}");
        const customQuizzes = Object.values(customObj).map((item: any) => item?.quiz).filter(Boolean);
        const missingOnServer: any[] = [];

        for (const cq of customQuizzes) {
          if (!storedDeleted.includes(cq.id)) {
            if (!list.some((sq: any) => sq.id === cq.id)) {
              list.push(cq);
              missingOnServer.push(customObj[cq.id]);
            }
          }
        }

        // Background sync to server if any were missing on this server instance
        if (missingOnServer.length > 0) {
          for (const item of missingOnServer) {
            fetch("/api/quizzes/sync-custom", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            }).catch(() => {});
          }
        }
      } catch {}

      setQuizzes(list);
      if (dataC.categories && Array.isArray(dataC.categories)) {
        setCategories(dataC.categories);
      }
    } catch (err) {
      console.error("Failed to load quizzes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const handleTogglePublish = async (id: string) => {
    try {
      // Optimistically toggle state immediately in UI
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === id
            ? { ...q, status: q.status === "published" ? "draft" : "published" }
            : q
        )
      );

      // Update in localStorage custom quizzes and construct payload
      let customPayload: any = {};
      try {
        const customObj = JSON.parse(localStorage.getItem("nta_custom_quizzes") || "{}");
        if (customObj[id]?.quiz) {
          customObj[id].quiz.status = customObj[id].quiz.status === "published" ? "draft" : "published";
          localStorage.setItem("nta_custom_quizzes", JSON.stringify(customObj));
          customPayload = customObj[id];
        }
      } catch {}

      const res = await fetch(`/api/admin/quizzes/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customPayload),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to toggle publish status on server");
        loadQuizzes();
      } else {
        loadQuizzes();
      }
    } catch (err: any) {
      alert("Failed to toggle publish status: " + err.message);
      loadQuizzes();
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsAddingCat(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCatName.trim() }),
      });
      const data = await res.json();
      if (data.categories) {
        setCategories(data.categories);
        setNewCatName("");
        setIsCategoryModalOpen(false);
      }
    } catch {
      alert("Failed to create new category");
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteQuiz = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete the examination: "${title}"?\n\nThis will remove it completely from candidate dashboards and the server.`)) {
      return;
    }

    try {
      // Optimistically remove from state immediately
      setQuizzes((prev) => prev.filter((q) => q.id !== id));

      // Save to localStorage and cookie
      let storedList: string[] = [];
      try {
        storedList = JSON.parse(localStorage.getItem("nta_deleted_quiz_ids") || "[]");
        if (!storedList.includes(id)) {
          storedList.push(id);
          localStorage.setItem("nta_deleted_quiz_ids", JSON.stringify(storedList));
        }
        document.cookie = `nta_deleted_quizzes=${storedList.join(",")}; path=/; max-age=31536000; SameSite=Lax`;
      } catch {}

      const res = await fetch(`/api/admin/quizzes/${id}`, {
        method: "DELETE",
        headers: {
          "x-deleted-quizzes": storedList.join(","),
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to delete quiz on server");
        loadQuizzes();
      }
    } catch {
      alert("Failed to delete quiz");
      loadQuizzes();
    }
  };

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || q.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" ||
      (q.category || "Banking").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Examination Papers Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage Banking, UGC NET, and custom examination streams, question sets, and daily target papers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-600" />
            <span>Manage Streams</span>
          </button>

          <Link
            href="/admin/quizzes/create"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Create New Paper (AI)</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, subject..."
            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Stream Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-500">Stream:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none bg-slate-50"
            >
              <option value="all">All Streams</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:outline-none bg-slate-50"
            >
              <option value="all">All Statuses ({quizzes.length})</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-slate-500">
            Loading examination records...
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No examinations found.</p>
            <p className="text-xs text-slate-400 mt-1">
              Create a new examination or adjust your search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Examination Paper</th>
                  <th className="py-3 px-4">Stream / Category</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Questions</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredQuizzes.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-900">{q.title}</p>
                        {q.isDailyPaper && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                            Daily Task
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {q.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {q.category || "Banking"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{q.subject}</td>
                    <td className="py-3 px-4 font-bold text-slate-800">{q.totalQuestions} Qs</td>
                    <td className="py-3 px-4 text-slate-600 font-mono">{q.durationMinutes} mins</td>
                    <td className="py-3 px-4">
                      {q.status === "published" ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                          Published
                        </span>
                      ) : q.status === "draft" ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                          Draft
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                          Archived
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {/* Toggle publish button */}
                      <button
                        onClick={() => handleTogglePublish(q.id)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded border transition-colors ${
                          q.status === "published"
                            ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                        }`}
                        title={q.status === "published" ? "Unpublish to Draft" : "Publish to Candidates"}
                      >
                        {q.status === "published" ? "Unpublish" : "Publish"}
                      </button>

                      {/* Edit button */}
                      <Link
                        href={`/admin/quizzes/${q.id}/edit`}
                        className="p-1.5 text-slate-500 hover:text-blue-700 rounded hover:bg-slate-100 transition-colors inline-block"
                        title="Edit Quiz and Questions"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      {/* Candidate preview */}
                      <Link
                        href={`/exam/${q.id}/instructions`}
                        target="_blank"
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors inline-block"
                        title="Test Exam in Candidate Mode"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteQuiz(q.id, q.title)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50 transition-colors"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stream / Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2 text-slate-900">
                <FolderPlus className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-base">Manage Examination Streams</h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Active Examination Categories / Streams:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-3 pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700">
                  Create New Stream (e.g. Engineering, Law, Civil Services):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Enter new stream name..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="submit"
                    disabled={isAddingCat || !newCatName.trim()}
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isAddingCat ? "Saving..." : "Add Stream"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
