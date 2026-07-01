"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { uploadPdf } from "@/lib/api";

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
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-medium mb-4">Upload a paper</h1>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="text-sm"
        />
        {file && <p className="text-sm text-gray-500 mt-2">{file.name}</p>}
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="mt-4 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload & Summarize"}
      </button>

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </main>
  );
}