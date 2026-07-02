"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPdf } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = (await uploadPdf(file)) as { paper_id: string };
      router.push(`/paper/${data.paper_id}`);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Make sure it's a valid PDF with extractable text.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50/30 py-16 px-4">
        <div className="max-w-xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Upload a paper</h1>
            <p className="mt-2 text-sm text-gray-500">
              Upload your PDF to get an instant AI-powered summary.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-10 hover:border-slate-400 transition-colors group">
              <svg className="w-12 h-12 text-gray-300 group-hover:text-slate-400 transition-colors mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              
              <label className="cursor-pointer">
                <span className="text-sm font-semibold text-slate-900 hover:text-slate-700 underline">
                  {file ? "Change file" : "Browse files"}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
              </label>
              
              {file ? (
                <div className="mt-4 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[200px]">{file.name}</span>
                </div>
              ) : (
                <p className="text-xs text-gray-400 mt-2">Maximum file size: 10MB (PDF only)</p>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-slate-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Analyzing PDF...
                </>
              ) : (
                "Upload & Summarize"
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100">
              <p className="text-sm text-red-600 font-medium text-center">{error}</p>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}