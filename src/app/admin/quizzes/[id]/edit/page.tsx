"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function EditQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [marksPerQuestion, setMarksPerQuestion] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(1);
  const [language, setLanguage] = useState("English");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/admin/quizzes/${quizId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load quiz details");
        return res.json();
      })
      .then((data) => {
        const q = data.quiz;
        setTitle(q.title);
        setSubject(q.subject);
        setDescription(q.description || "");
        setDurationMinutes(q.durationMinutes);
        setMarksPerQuestion(q.marksPerQuestion);
        setNegativeMarks(q.negativeMarks);
        setLanguage(q.language || "English");
        setStatus(q.status);
        setQuestions(data.questions || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [quizId]);

  const handleSave = async () => {
    setError(null);
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          description,
          durationMinutes: Number(durationMinutes),
          marksPerQuestion: Number(marksPerQuestion),
          negativeMarks: Number(negativeMarks),
          language,
          status,
          questions,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update quiz");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOption = (qIdx: number, optIdx: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].options[optIdx] = val;
      return copy;
    });
  };

  const handleSetCorrectOption = (qIdx: number, optIdx: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].correctAnswerIndex = optIdx;
      return copy;
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs font-bold text-slate-500">
        Loading quiz editor...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/quizzes"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Edit Examination</h1>
            <p className="text-xs text-slate-500 font-medium">Paper ID: {quizId}</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg p-3 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>Examination details updated successfully!</span>
        </div>
      )}

      {/* Config Form */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Paper Details &amp; Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Duration (Mins)</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Marks per Question</label>
            <input
              type="number"
              step="0.5"
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Negative Marks</label>
            <input
              type="number"
              step="0.25"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Questions list */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Questions List ({questions.length})
        </h2>

        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div
              key={q.id || qIdx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">
                  Question {qIdx + 1} of {questions.length}
                </span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold">
                  {q.difficulty}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prompt</label>
                <textarea
                  rows={2}
                  value={q.questionText}
                  onChange={(e) => {
                    const text = e.target.value;
                    setQuestions((prev) => {
                      const copy = [...prev];
                      copy[qIdx].questionText = text;
                      return copy;
                    });
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Options (Radio marks correct key):
                </label>
                <div className="space-y-2">
                  {q.options.map((opt: string, optIdx: number) => {
                    const isCorrect = q.correctAnswerIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center space-x-2.5 p-2 rounded-lg border ${
                          isCorrect ? "bg-emerald-50 border-emerald-500" : "bg-white border-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct-key-${qIdx}`}
                          checked={isCorrect}
                          onChange={() => handleSetCorrectOption(qIdx, optIdx)}
                          className="w-4 h-4 text-emerald-600 cursor-pointer"
                        />
                        <span className="font-bold text-slate-500 text-xs w-6">({optIdx + 1})</span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                          className="flex-1 px-2.5 py-1 text-xs border border-transparent hover:border-slate-300 focus:border-blue-600 rounded focus:outline-none font-medium text-slate-900"
                        />
                        {isCorrect && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                            Correct Key
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Explanation</label>
                <input
                  type="text"
                  value={q.explanation || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setQuestions((prev) => {
                      const copy = [...prev];
                      copy[qIdx].explanation = val;
                      return copy;
                    });
                  }}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
