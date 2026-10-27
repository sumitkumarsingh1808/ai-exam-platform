"use client";

import { useEffect, useState } from "react";
import {
  FileUp,
  FileText,
  Sparkles,
  Upload,
  CheckCircle2,
  AlertCircle,
  Eye,
  X,
  FileCode,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { safeParseJson } from "@/lib/api-client";
import { processFileForQuiz } from "@/lib/client-document-processor";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<any>(null);

  const loadMaterials = async () => {
    try {
      const res = await fetch("/api/admin/materials");
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const data = await res.json();
      setMaterials(data.materials || []);
    } catch (err) {
      console.error("Failed to load materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    if (selectedFile.size > 25 * 1024 * 1024) {
      setError(
        `"${selectedFile.name}" is ${(selectedFile.size / (1024 * 1024)).toFixed(1)}MB. Maximum supported file size is 25MB.`
      );
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const processed = await processFileForQuiz(selectedFile);
      let res: Response;

      if (processed.mode === "text") {
        res = await fetch("/api/admin/materials/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: selectedFile.type,
            extractedText: processed.extractedText,
          }),
        });
      } else if (processed.mode === "image") {
        res = await fetch("/api/admin/materials/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileType: "image/jpeg",
            isImage: true,
            imageBase64: processed.imageBase64,
          }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", selectedFile);
        res = await fetch("/api/admin/materials/upload", {
          method: "POST",
          body: formData,
        });
      }

      const parsed = await safeParseJson(res);
      if (!parsed.ok) throw new Error(parsed.error || "Upload failed");

      setSelectedFile(null);
      loadMaterials();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Upload Study Material &amp; Syllabus Repository
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Upload reference text, syllabus outlines, or textbook scans for automated AI question generation.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl p-4 flex items-start gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Dropzone Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-8 text-center bg-slate-50/50 transition-colors">
            <Upload className="w-10 h-10 mx-auto text-blue-600 mb-2" />
            <p className="text-sm font-bold text-slate-800">
              Select or Drop Syllabus File to Upload
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supported formats: PDF, PNG, JPG, JPEG, WebP (Up to 25MB supported with automatic browser optimization)
            </p>

            <input
              type="file"
              id="material-file"
              accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 25 * 1024 * 1024) {
                  setError(
                    `"${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum supported file size is 25MB.`
                  );
                  setSelectedFile(null);
                  e.target.value = "";
                  return;
                }
                setError(null);
                setSelectedFile(file);
              }}
              className="hidden"
            />

            <label
              htmlFor="material-file"
              className="mt-4 inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
            >
              {selectedFile ? `Selected: ${selectedFile.name}` : "Browse Local File"}
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing &amp; Extracting Text...</span>
                </>
              ) : (
                <>
                  <FileUp className="w-4 h-4" />
                  <span>Upload &amp; Extract Material</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Uploaded Materials List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Uploaded Materials ({materials.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 font-bold">
            Loading materials...
          </div>
        ) : materials.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-bold text-slate-700">No materials uploaded yet.</p>
            <p className="text-xs text-slate-400 mt-1">
              Upload a PDF syllabus or textbook page to begin AI quiz authoring.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Document Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Uploaded At</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {m.originalFileName}
                    </td>
                    <td className="py-3 px-4 text-slate-500 uppercase text-[10px]">
                      {m.fileType.split("/")[1]}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {(m.fileSize / 1024).toFixed(1)} KB
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        {m.processingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(m.createdAt)}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setPreviewMaterial(m)}
                        className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 font-bold rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview Text</span>
                      </button>

                      <Link
                        href={`/admin/quizzes/create?materialId=${m.id}`}
                        className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 font-bold rounded transition-colors inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Generate Quiz</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Text Preview Modal */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold">{previewMaterial.originalFileName}</h3>
              </div>
              <button
                onClick={() => setPreviewMaterial(null)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap bg-slate-50">
              {previewMaterial.extractedText || "No readable text extracted."}
            </div>

            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPreviewMaterial(null)}
                className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
