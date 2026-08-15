"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Check,
  Calendar,
} from "lucide-react";

interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  url?: string;
  imageDesktop: string;
  imageMobile: string;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  displayOrder: number;
}

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Media Picker States
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<{ url: string }[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"desktop" | "mobile">("desktop");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [url, setUrl] = useState("");
  const [imageDesktop, setImageDesktop] = useState("");
  const [imageMobile, setImageMobile] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/banners");
      if (res.success) {
        setBanners(res.banners);
      }
    } catch (error) {
      console.error("Error loading banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setTitle("");
    setSubtitle("");
    setCtaText("");
    setUrl("");
    setImageDesktop("");
    setImageMobile("");
    setIsActive(true);
    setStartDate("");
    setEndDate("");
    setDisplayOrder("0");
    setShowModal(true);
  };

  const openEditModal = (ban: Banner) => {
    setEditingBanner(ban);
    setTitle(ban.title || "");
    setSubtitle(ban.subtitle || "");
    setCtaText(ban.ctaText || "");
    setUrl(ban.url || "");
    setImageDesktop(ban.imageDesktop);
    setImageMobile(ban.imageMobile);
    setIsActive(ban.isActive);
    setStartDate(ban.startDate ? new Date(ban.startDate).toISOString().split("T")[0] : "");
    setEndDate(ban.endDate ? new Date(ban.endDate).toISOString().split("T")[0] : "");
    setDisplayOrder(ban.displayOrder.toString());
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ব্যানারটি ডিলিট করতে চান?")) return;
    try {
      const res = await fetchAPI(`/api/banners/${id}`, { method: "DELETE" });
      if (res.success) {
        alert("ব্যানার সফলভাবে ডিলিট করা হয়েছে।");
        loadBanners();
      }
    } catch (err: any) {
      alert(err.message || "ডিলিট ব্যর্থ হয়েছে।");
    }
  };

  const handleOpenMediaPicker = async (target: "desktop" | "mobile") => {
    setPickerTarget(target);
    setShowMediaPicker(true);
    setMediaLoading(true);
    try {
      const res = await fetchAPI("/api/media?limit=100");
      if (res.success) {
        setMediaLibrary(res.media);
      }
    } catch (err) {
      console.error("Error loading media:", err);
    } finally {
      setMediaLoading(false);
    }
  };

  const handleSelectMedia = (selectedUrl: string) => {
    if (pickerTarget === "desktop") {
      setImageDesktop(selectedUrl);
    } else {
      setImageMobile(selectedUrl);
    }
    setShowMediaPicker(false);
  };

  const handleDirectUpload = async (files: FileList | null, target: "desktop" | "mobile") => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/media`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success && data.media?.url) {
        if (target === "desktop") {
          setImageDesktop(data.media.url);
        } else {
          setImageMobile(data.media.url);
        }
        alert("ছবি সফলভাবে আপলোড করা হয়েছে।");
      } else {
        alert(data.message || "আপলোড ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      alert(err.message || "আপলোড ব্যর্থ হয়েছে।");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageDesktop.trim() || !imageMobile.trim()) {
      alert("ডেস্কটপ এবং মোবাইল ব্যানার ইমেজ আবশ্যক।");
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title || undefined,
      subtitle: subtitle || undefined,
      ctaText: ctaText || undefined,
      url: url || undefined,
      imageDesktop,
      imageMobile,
      isActive,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      displayOrder: Number(displayOrder),
    };

    try {
      let res;
      if (editingBanner) {
        res = await fetchAPI(`/api/banners/${editingBanner._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetchAPI("/api/banners", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        alert(editingBanner ? "ব্যানার সফলভাবে আপডেট হয়েছে।" : "নতুন ব্যানার সফলভাবে যুক্ত হয়েছে।");
        setShowModal(false);
        loadBanners();
      }
    } catch (err: any) {
      alert(err.message || "সংরক্ষণ ব্যর্থ হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">ব্যানার স্লাইডার</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">ওয়েবসাইটের প্রধান স্লাইডশোর ব্যানার ইমেজ ও কন্টেন্ট সেটিংস</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all shadow-md text-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ব্যানার যোগ করুন</span>
        </button>
      </div>

      {/* Banners List Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.length > 0 ? (
            banners.map((ban) => (
              <div
                key={ban._id}
                className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Banner image desktop preview */}
                  <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-100 flex items-center justify-center">
                    <img src={ban.imageDesktop} alt={ban.title || "Banner"} className="object-cover w-full h-full" />
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/60 text-white text-[9px] font-bold">
                      Desktop View
                    </div>
                  </div>

                  {/* Header / Info details */}
                  <div>
                    <h3 className="text-sm font-black text-slate-800 truncate">{ban.title || "শিরোনামহীন ব্যানার"}</h3>
                    <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">{ban.subtitle || "কোনো সাব-টাইটেল নেই"}</p>
                    {ban.url && <p className="text-[10px] text-emerald-600 font-bold mt-1.5 truncate">Redirect URL: {ban.url}</p>}
                  </div>

                  {/* Status & Display stats */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-450 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span>Display Order:</span>{" "}
                      <span className="text-slate-800 font-black">{ban.displayOrder}</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-350 rounded-full" />
                    <div>
                      <span>Status:</span>{" "}
                      {ban.isActive ? (
                        <span className="text-emerald-600 font-black">Active (সক্রিয়)</span>
                      ) : (
                        <span className="text-slate-400 font-black">Inactive (লুকানো)</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-5">
                  <button
                    onClick={() => openEditModal(ban)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-700 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>এডিট</span>
                  </button>
                  <button
                    onClick={() => handleDelete(ban._id)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-red-55 hover:text-red-650 active:scale-[0.98] text-slate-650 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ডিলিট</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-slate-400 font-bold text-sm bg-white border border-slate-200 rounded-3xl shadow-2xs">
              কোনো ব্যানার ইমেজ স্লাইড পাওয়া যায়নি।
            </div>
          )}
        </div>
      )}

      {/* CRUD Banner Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl flex flex-col justify-between z-10 overflow-hidden mx-4 animate-scale-up">
            {/* Modal Header */}
            <div className="h-16 border-b border-slate-150 px-6 sm:px-8 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                {editingBanner ? "ব্যানার এডিট করুন" : "নতুন ব্যানার যোগ করুন"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 flex-1 overflow-y-auto max-h-[480px]">
              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">ব্যানার মেইন টাইটেল</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="যেমন: Bubble Boss Foaming Gel"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">ব্যানার সাব-টাইটেল</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="যেমন: ১টি কিনলে ১টি মাইক্রোফাইবার ফ্রী!"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Redirect Action URL & CTA text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">অ্যাকশন বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    placeholder="যেমন: এখনই কিনুন, অর্ডার করুন"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">বাটন লিংক (Redirect Link URL)</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="যেমন: /products/auto-1"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Desktop Image Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">ডেস্কটপ ব্যানার ইমেজ <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-12 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                    {imageDesktop ? (
                      <img src={imageDesktop} className="object-cover w-full h-full" alt="Desktop Preview" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-350" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenMediaPicker("desktop")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        মিডিয়া লাইব্রেরি
                      </button>
                      <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer ${uploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {uploadingImage ? (
                          <><div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /><span>আপলোড হচ্ছে...</span></>
                        ) : (
                          <><span>ছবি আপলোড করুন</span></>
                        )}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(e) => handleDirectUpload(e.target.files, "desktop")}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={imageDesktop}
                      onChange={(e) => setImageDesktop(e.target.value)}
                      placeholder="অথবা সরাসরি ডেস্কটপ ব্যানার ইমেজ URL..."
                      required
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile Image Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">মোবাইল ব্যানার ইমেজ <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-12 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                    {imageMobile ? (
                      <img src={imageMobile} className="object-cover w-full h-full" alt="Mobile Preview" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-350" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenMediaPicker("mobile")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        মিডিয়া লাইব্রেরি
                      </button>
                      <label className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer ${uploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}>
                        {uploadingImage ? (
                          <><div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" /><span>আপলোড হচ্ছে...</span></>
                        ) : (
                          <><span>ছবি আপলোড করুন</span></>
                        )}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          disabled={uploadingImage}
                          onChange={(e) => handleDirectUpload(e.target.files, "mobile")}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={imageMobile}
                      onChange={(e) => setImageMobile(e.target.value)}
                      placeholder="অথবা সরাসরি মোবাইল ব্যানার ইমেজ URL..."
                      required
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Dates & Sort Display */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">ক্রমিক নম্বর (Display Order)</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4.5 h-4.5 text-emerald-600 rounded-md border-slate-300"
                  />
                  <label htmlFor="isActive" className="text-xs font-black text-slate-700 cursor-pointer select-none">
                    ব্যানারটি সক্রিয় রাখুন (Show Banner)
                  </label>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">শুরুর তারিখ (Start Display Date)</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">শেষের তারিখ (End Display Date)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Overlay Popup */}
      {showMediaPicker && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xl h-[420px] shadow-2xl p-6 flex flex-col justify-between mx-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
              <h4 className="text-sm font-extrabold text-slate-800">মিডিয়া লাইব্রেরি থেকে ছবি নির্বাচন করুন</h4>
              <button onClick={() => setShowMediaPicker(false)} className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              {mediaLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="w-5 h-5 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
                </div>
              ) : mediaLibrary.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {mediaLibrary.map((media, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectMedia(media.url)}
                      className="border border-slate-200 hover:border-emerald-500 bg-slate-50 cursor-pointer aspect-square rounded-xl overflow-hidden flex items-center justify-center transition-all"
                    >
                      <img src={media.url} className="object-cover w-full h-full" alt="Banners picker preview" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 font-bold text-center py-10">কোনো মিডিয়া ছবি নেই।</p>
              )}
            </div>

            <div className="flex items-center justify-end border-t border-slate-100 pt-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
