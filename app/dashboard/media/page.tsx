"use client";

import React, { useEffect, useState } from "react";
import { getApiUrl, fetchAPI } from "../../../lib/api";
import { useModal } from "../../../context/ModalContext";
import {
  UploadCloud,
  Copy,
  Trash2,
  Check,
  Search,
  FileImage,
  ExternalLink,
} from "lucide-react";

interface MediaItem {
  _id: string;
  url: string;
  publicId: string;
  fileName: string;
  sizeBytes: number;
  format: string;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const { showAlert, showConfirm } = useModal();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalMedia, setTotalMedia] = useState(0);

  // File Upload states
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Pagination / Search
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI(`/api/media?page=${page}&limit=16`);
      if (res.success) {
        setMedia(res.media);
        setTotalMedia(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error("Error loading media library:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, [page]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("image", selectedFile);

    const token = localStorage.getItem("token") || "";

    try {
      const response = await fetch(`${getApiUrl()}/api/media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "ছবি আপলোড ব্যর্থ হয়েছে।");
      }

      if (data.success) {
        showAlert({
          title: "সফল হয়েছে",
          message: "ছবি সফলভাবে আপলোড করা হয়েছে।",
          type: "success",
        });
        setSelectedFile(null);
        setPage(1);
        loadMedia();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "আপলোড করতে সমস্যা হয়েছে। ফাইলের সাইজ চেক করুন।";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "ছবি ডিলিট করুন",
      message: "আপনি কি নিশ্চিতভাবে এই ছবিটি ডিলিট করতে চান? এটি প্রোডাক্টের ছবি থাকলে তা আর দেখা যাবে না।",
      type: "danger",
      confirmText: "হ্যাঁ, ডিলিট করুন",
      cancelText: "বাতিল",
    });
    if (!confirmed) return;
    try {
      const res = await fetchAPI(`/api/media/${id}`, { method: "DELETE" });
      if (res.success) {
        showAlert({ title: "সফল হয়েছে", message: "ছবি সফলভাবে ডিলিট করা হয়েছে।", type: "success" });
        loadMedia();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "ডিলিট ব্যর্থ হয়েছে।";
      showAlert({ title: "ত্রুটি", message, type: "error" });
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">মিডিয়া লাইব্রেরি</h1>
        <p className="text-sm text-slate-400 font-semibold uppercase">ওয়েবসাইটের জন্য নতুন ছবি আপলোড এবং ইমেজের ক্লাউড লিংক ডিরেক্টরি</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Upload Form Box (4 columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5">নতুন ছবি আপলোড করুন</h3>

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* Drag and Drop box */}
            <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all bg-slate-50 relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="w-10 h-10 text-slate-350 mx-auto group-hover:scale-105 transition-transform" />
              <p className="text-xs font-black text-slate-700 mt-3">ছবি সিলেক্ট করতে ক্লিক করুন</p>
              <p className="text-[10px] text-slate-400 font-semibold mt-1">সর্বোচ্চ ৫ মেগাবাইট ফাইল (JPG, PNG, WEBP)</p>
            </div>

            {selectedFile && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between gap-3 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2 truncate">
                  <FileImage className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="truncate">
                    <p className="truncate text-slate-800">{selectedFile.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{formatBytes(selectedFile.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 rounded bg-emerald-100/50 hover:bg-emerald-100 text-emerald-800 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}

            {uploadError && (
              <p className="text-[11px] font-bold text-red-650 bg-red-50 p-2.5 rounded-xl border border-red-150">
                {uploadError}
              </p>
            )}

            <button
              type="submit"
              disabled={!selectedFile || uploading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed active:scale-[0.98] text-white font-extrabold rounded-xl transition-all text-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>ক্লাউডে আপলোড হচ্ছে...</span>
                </>
              ) : (
                <span>ক্লাউড সার্ভারে আপলোড করুন</span>
              )}
            </button>
          </form>
        </div>

        {/* Media Grid Gallery (8 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-800">ইমেজ গ্যালারি</h3>
            <span className="text-xs font-bold text-slate-450">সর্বমোট: {totalMedia} টি ফাইল</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[250px]">
              <div className="w-7 h-7 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
            </div>
          ) : media.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {media.map((item) => (
                  <div
                    key={item._id}
                    className="group relative border border-slate-200 rounded-2xl overflow-hidden aspect-square bg-slate-50 flex flex-col justify-end"
                  >
                    {/* Hover controls overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 z-10">
                      <button
                        onClick={() => handleCopyUrl(item.url, item._id)}
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 shadow-md transition-transform active:scale-[0.95] cursor-pointer"
                        title="Copy Link URL"
                      >
                        {copiedId === item._id ? (
                          <Check className="w-4.5 h-4.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-4.5 h-4.5" />
                        )}
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 shadow-md transition-transform active:scale-[0.95]"
                        title="View Full Size"
                      >
                        <ExternalLink className="w-4.5 h-4.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md transition-transform active:scale-[0.95] cursor-pointer"
                        title="Delete from Cloud"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    <img src={item.url} className="object-cover w-full h-full absolute inset-0" alt={item.fileName} />

                    {/* Meta display inside thumbnail */}
                    <div className="p-2 bg-slate-900/75 text-white text-[8px] font-black w-full truncate z-5 backdrop-blur-xs select-none">
                      {item.fileName}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-bold">
                    পাতা {page} (মোট {totalPages} পাতাল মধ্যে)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1 border border-slate-200 disabled:opacity-50 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50"
                    >
                      পূর্ববর্তী
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-3 py-1 border border-slate-200 disabled:opacity-50 text-slate-500 text-xs font-bold rounded-lg hover:bg-slate-50"
                    >
                      পরবর্তী
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-black text-center py-12">কোনো ছবি আপলোড করা হয়নি। বামপাশের ফর্ম ব্যবহার করে প্রথম ছবি যুক্ত করুন।</p>
          )}
        </div>
      </div>
    </div>
  );
}
