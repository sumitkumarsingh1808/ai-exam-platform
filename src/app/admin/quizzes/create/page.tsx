"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  Upload,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Save,
  Send,
  ArrowLeft,
  Key,
} from "lucide-react";
import Link from "next/link";
import { safeParseJson } from "@/lib/api-client";
import { processFileForQuiz } from "@/lib/client-document-processor";

interface EditableQuestion {
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  sourceReference?: string;
}

function CreateQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const materialIdParam = searchParams.get("materialId");

  // Basic Quiz Metadata
  const [title, setTitle] = useState("SBI PO Prelims 2025 Mock Examination");
  const [subject, setSubject] = useState("Banking Aptitude & Reasoning");
  const [category, setCategory] = useState("Banking");
  const [isDailyPaper, setIsDailyPaper] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>(["Banking", "UGC NET", "Engineering & GATE", "Civil Services / UPSC"]);
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [description, setDescription] = useState(
    "Official memory-based practice assessment generated from SBI PO Prelims paper."
  );
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [marksPerQuestion, setMarksPerQuestion] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0.25);
  const [language, setLanguage] = useState("English");
  const [reviewPolicy, setReviewPolicy] = useState<"immediate" | "after_close" | "never">("immediate");

  // AI Generation Controls
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "mixed">("mixed");
  const [customPrompt, setCustomPrompt] = useState("");
  const [studyText, setStudyText] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [userApiKey, setUserApiKey] = useState("");

  // Status & Generated Questions
  const [generating, setGenerating] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [questions, setQuestions] = useState<EditableQuestion[]>([
    {
      questionText:
        "In the given question, two words are omitted, which are replaced by blanks. Choose the best combination of the words that can fit into the given blank at the same order so to make a grammatically and logically correct statement.\n\nThe company’s sudden announcement of layoffs was seen as _______ by many employees, who did not feel the decision had been _______ from the beginning.",
      options: [
        "abrupt, predetermined",
        "strategic, unexpected",
        "transparent, concealed",
        "calculated, improvised",
      ],
      correctAnswerIndex: 0,
      explanation:
        "Option (a) 'abrupt, predetermined' appropriately fills both blanks, establishing a logical cause-and-effect relationship.",
      difficulty: "medium",
      topic: "English Comprehension",
      sourceReference: "Question 1",
    },
    {
      questionText:
        "In the given question, two words are omitted, which are replaced by blanks. Choose the best combination of the words that can fit into the given blank at the same order so to make a grammatically and logically correct statement.\n\nThe government’s response to the economic crisis was widely criticized as _______ and only served to _______ public frustration.",
      options: [
        "deliberate, intensify",
        "prudent, alleviate",
        "swift, suppress",
        "ineffectual, exacerbate",
      ],
      correctAnswerIndex: 3,
      explanation:
        "Option (d) 'ineffectual, exacerbate' perfectly matches the critical context where inadequate action worsens frustration.",
      difficulty: "medium",
      topic: "English Comprehension",
      sourceReference: "Question 2",
    },
  ]);

  // Load material if passed via query param
  useEffect(() => {
    if (materialIdParam) {
      fetch(`/api/admin/materials`)
        .then((res) => res.json())
        .then((data) => {
          const mat = data.materials?.find((m: any) => m.id === materialIdParam);
          if (mat) {
            setTitle(mat.originalFileName.replace(/\.[^/.]+$/, ""));
            if (mat.extractedText) {
              setStudyText(mat.extractedText.substring(0, 15000));
            }
          }
        })
        .catch(() => {});
    }

    // Load available examination streams/categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories && Array.isArray(data.categories)) {
          setAvailableCategories(data.categories);
        }
      })
      .catch(() => {});
  }, [materialIdParam]);

  const handleAddNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      const data = await res.json();
      if (data.categories) {
        setAvailableCategories(data.categories);
        setCategory(newCategoryName.trim());
        setNewCategoryName("");
        setIsAddingNewCategory(false);
      }
    } catch {
      alert("Failed to create new category.");
    }
  };

  // Handle AI Quiz Generation from Uploaded File or Text (Supports up to 25MB)
  const handleGenerateWithAI = async () => {
    setError(null);
    setSuccessMsg(null);
    setGenerating(true);
    setProcessingStatus("Initializing AI Generation Engine...");

    try {
      let bodyData: any = null;
      let isJson = true;

      if (uploadedFile) {
        setProcessingStatus(`Processing ${uploadedFile.name} (${(uploadedFile.size / (1024 * 1024)).toFixed(1)}MB)...`);
        const processed = await processFileForQuiz(uploadedFile, (msg) => setProcessingStatus(msg));

        if (processed.mode === "text") {
          bodyData = {
            content: processed.extractedText,
            title,
            subject,
            numQuestions,
            difficulty,
            language,
            customPrompt,
            apiKey: userApiKey || undefined,
          };
        } else if (processed.mode === "scanned_pdf") {
          bodyData = {
            images: processed.images,
            title,
            subject,
            numQuestions,
            difficulty,
            language,
            customPrompt,
            apiKey: userApiKey || undefined,
          };
        } else if (processed.mode === "image") {
          bodyData = {
            imageBase64: processed.imageBase64,
            imageMimeType: processed.imageMimeType,
            content: studyText,
            title,
            subject,
            numQuestions,
            difficulty,
            language,
            customPrompt,
            apiKey: userApiKey || undefined,
          };
        } else {
          // Raw small file
          isJson = false;
          const formData = new FormData();
          formData.append("title", title);
          formData.append("subject", subject);
          formData.append("numQuestions", numQuestions.toString());
          formData.append("difficulty", difficulty);
          formData.append("language", language);
          formData.append("customPrompt", customPrompt);
          formData.append("textNotes", studyText);
          if (userApiKey) formData.append("apiKey", userApiKey);
          formData.append("file", uploadedFile);
          bodyData = formData;
        }
      } else {
        bodyData = {
          content: studyText,
          title,
          subject,
          numQuestions,
          difficulty,
          language,
          customPrompt,
          apiKey: userApiKey || undefined,
        };
      }

      setProcessingStatus("Generating questions via Gemini AI...");

      const res = await fetch("/api/admin/materials/generate-direct", {
        method: "POST",
        headers: isJson ? { "Content-Type": "application/json" } : undefined,
        body: isJson ? JSON.stringify(bodyData) : bodyData,
      });

      const parsed = await safeParseJson(res);
      if (!parsed.ok) {
        throw new Error(parsed.error || "Failed to generate questions");
      }

      const data = parsed.data;
      if (data?.quiz) {
        if (data.quiz.title) setTitle(data.quiz.title);
        if (data.quiz.description) setDescription(data.quiz.description);
        if (data.quiz.questions && data.quiz.questions.length > 0) {
          setQuestions(data.quiz.questions);
          setSuccessMsg(`Successfully generated and extracted ${data.quiz.questions.length} questions from the document!`);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
      setProcessingStatus(null);
    }
  };

  // Question editing helpers
  const handleUpdateQuestionText = (index: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index].questionText = text;
      return copy;
    });
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

  const handleUpdateExplanation = (qIdx: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIdx].explanation = val;
      return copy;
    });
  };

  const handleDeleteQuestion = (index: number) => {
    if (questions.length <= 1) {
      alert("A quiz must have at least one question.");
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddBlankQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        questionText: "New question prompt here...",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswerIndex: 0,
        explanation: "Explanation of why Option 1 is correct.",
        difficulty: "medium",
        topic: subject,
      },
    ]);
  };

  // Save Quiz to Database (Draft or Published)
  const handleSaveQuiz = async (status: "draft" | "published") => {
    setError(null);
    setSaving(true);

    try {
      if (questions.length === 0) {
        throw new Error("Please add at least 1 question before saving.");
      }

      const payload = {
        title,
        description,
        subject,
        category,
        isDailyPaper,
        durationMinutes: Number(durationMinutes),
        marksPerQuestion: Number(marksPerQuestion),
        negativeMarks: Number(negativeMarks),
        language,
        reviewPolicy,
        allowRandomization: true,
        status,
        questions,
      };

      const res = await fetch("/api/admin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const parsed = await safeParseJson(res);
      if (!parsed.ok) {
        throw new Error(parsed.error || "Failed to create quiz");
      }

      router.push("/admin/quizzes");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/quizzes"
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Create Examination Paper (AI Question Engine)
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Upload study material or syllabus documents to automatically generate questions via Gemini AI.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleSaveQuiz("draft")}
            disabled={saving}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>
          <button
            onClick={() => handleSaveQuiz("published")}
            disabled={saving}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-extrabold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Examination</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl p-4 flex items-start gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl p-4 flex items-start gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. Paper Details Form */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. Examination Paper Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Examination Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="e.g. SBI PO Prelims 2025"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Subject / Domain</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="e.g. Banking Aptitude, English Comprehension"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Examination Stream / Category</label>
              <button
                type="button"
                onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                className="text-[11px] text-blue-700 hover:underline font-bold"
              >
                {isAddingNewCategory ? "Cancel" : "+ Add New Stream"}
              </button>
            </div>
            {isAddingNewCategory ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Engineering &amp; GATE"
                  className="flex-1 px-3 py-2 border border-blue-400 rounded-lg text-slate-900 font-medium text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="px-3 py-2 bg-blue-700 text-white rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                {availableCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-bold text-xs bg-amber-50/80 border border-amber-200 p-2.5 rounded-lg w-full">
              <input
                type="checkbox"
                checked={isDailyPaper}
                onChange={(e) => setIsDailyPaper(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
              />
              <span>🌟 Set as &quot;Today&apos;s Target Paper / Daily Task&quot; for this stream</span>
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block font-bold text-slate-700 mb-1">Description / Guidelines</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
              placeholder="Brief overview of syllabus coverage"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Duration (Minutes)</label>
            <input
              type="number"
              min={1}
              max={360}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Marks for Correct Answer</label>
            <input
              type="number"
              step="0.25"
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Negative Marks (Deduction)</label>
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

      {/* 2. Upload Material & AI Generator Section */}
      <section className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl shadow-lg p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight">
                2. AI Question Generation from Study Material
              </h2>
              <p className="text-xs text-blue-200">
                Powered by Google Gemini official multimodal AI engine &amp; intelligent document parser
              </p>
            </div>
          </div>
        </div>

        {/* File Dropzone */}
        <div className="border-2 border-dashed border-blue-400/50 hover:border-amber-400/80 rounded-xl p-6 text-center bg-white/5 transition-colors">
          <Upload className="w-8 h-8 mx-auto text-blue-300 mb-2" />
          <p className="text-sm font-bold text-white">
            {uploadedFile ? `Selected: ${uploadedFile.name}` : "Upload Study Material (PDF or Image)"}
          </p>
          <p className="text-[11px] text-blue-200 mt-0.5">
            Supported formats: PDF, PNG, JPG, JPEG, WebP (Up to 25MB — automatically processed and optimized)
          </p>

          <input
            type="file"
            id="file-upload"
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 25 * 1024 * 1024) {
                setError(
                  `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum supported file size is 25MB.`
                );
                setUploadedFile(null);
                e.target.value = "";
                return;
              }
              setError(null);
              setUploadedFile(file);
            }}
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              {uploadedFile ? "Change Selected File" : "Choose File from Computer"}
            </label>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-blue-200">
            Or Paste Study Notes / Chapter Text:
          </label>
          <textarea
            rows={3}
            value={studyText}
            onChange={(e) => setStudyText(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800/80 border border-slate-700 text-white text-xs font-normal focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder-slate-400"
            placeholder="Paste syllabus text, paper questions, formulas, or notes here..."
          />
        </div>

        {/* AI Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
          <div>
            <label className="block font-semibold text-blue-200 mb-1">Questions to Generate</label>
            <input
              type="number"
              min={1}
              max={50}
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-blue-200 mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <option value="mixed">Mixed (Balanced)</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-blue-200 mb-1">Custom Directives</label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g. Focus on vocabulary, reasoning & DI"
              className="w-full px-3 py-1.5 rounded bg-slate-800/80 border border-slate-700 text-white font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Optional Gemini API Key Override */}
        <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-xs">
          <Key className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="text-slate-300 font-semibold text-[11px] whitespace-nowrap">
            Gemini API Key (Optional):
          </span>
          <input
            type="password"
            value={userApiKey}
            onChange={(e) => setUserApiKey(e.target.value)}
            placeholder="Paste Gemini API key to override, or leave blank to use intelligent document engine"
            className="flex-1 px-2.5 py-1 rounded bg-slate-800/90 border border-slate-700 text-white text-[11px] focus:outline-none focus:ring-1 focus:ring-amber-400 placeholder-slate-500"
          />
        </div>

        {/* Generate Button */}
        <div className="space-y-1.5">
          <button
            onClick={handleGenerateWithAI}
            disabled={generating}
            className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 font-black text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>{processingStatus || "Analyzing Document & Extracting Questions..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Questions from Document</span>
              </>
            )}
          </button>
          {generating && processingStatus && (
            <p className="text-center text-[11px] text-amber-300 font-medium animate-pulse">
              {processingStatus}
            </p>
          )}
        </div>
      </section>

      {/* 3. Interactive Question Editor */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Review &amp; Edit Questions ({questions.length})
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Review generated questions. Select the radio button to designate the correct answer key.
            </p>
          </div>

          <button
            onClick={handleAddBlankQuestion}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Manual Question</span>
          </button>
        </div>

        <div className="space-y-6">
          {questions.map((q, qIdx) => (
            <div
              key={qIdx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-blue-900 text-xs">
                  Question {qIdx + 1} of {questions.length}
                </span>

                <div className="flex items-center space-x-2">
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded text-slate-700 font-semibold">
                    {q.difficulty}
                  </span>
                  <button
                    onClick={() => handleDeleteQuestion(qIdx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question Prompt</label>
                <textarea
                  rows={2}
                  value={q.questionText}
                  onChange={(e) => handleUpdateQuestionText(qIdx, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              {/* 4 Options with Radio Key Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Answer Options (Select the correct option key):
                </label>
                <div className="space-y-2">
                  {q.options.map((optText, optIdx) => {
                    const isCorrect = q.correctAnswerIndex === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center space-x-2.5 p-2 rounded-lg border transition-all ${
                          isCorrect
                            ? "bg-emerald-50 border-emerald-500 shadow-sm"
                            : "bg-white border-slate-200"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`correct-key-${qIdx}`}
                          checked={isCorrect}
                          onChange={() => handleSetCorrectOption(qIdx, optIdx)}
                          className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className="font-bold text-slate-500 text-xs w-6">
                          ({optIdx + 1})
                        </span>
                        <input
                          type="text"
                          value={optText}
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

              {/* Explanation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Explanation / Solution
                </label>
                <input
                  type="text"
                  value={q.explanation}
                  onChange={(e) => handleUpdateExplanation(qIdx, e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 text-xs font-normal focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Why is this answer correct?"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Save Action Bar */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
        <button
          onClick={() => handleSaveQuiz("draft")}
          disabled={saving}
          className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save as Draft</span>
        </button>
        <button
          onClick={() => handleSaveQuiz("published")}
          disabled={saving}
          className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-extrabold text-xs rounded-lg shadow-md transition-all flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Publish Paper for Candidates</span>
        </button>
      </div>
    </div>
  );
}

export default function CreateQuizPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-500">Loading editor...</div>}>
      <CreateQuizContent />
    </Suspense>
  );
}
