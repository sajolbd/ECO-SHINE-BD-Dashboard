"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useModal } from "../../../context/ModalContext";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: "active" | "inactive";
  displayOrder: number;
}

export default function CategoriesPage() {
  const { showAlert, showConfirm } = useModal();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Media Picker States
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaLibrary, setMediaLibrary] = useState<{ url: string }[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [displayOrder, setDisplayOrder] = useState("0");

  const loadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/categories");
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setStatus("active");
    setDisplayOrder("0");
    setShowModal(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setStatus(cat.status);
    setDisplayOrder(cat.displayOrder.toString());
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "\u0995\u09cd\u09af\u09be\u099f\u09be\u0997\u09b0\u09bf \u09a1\u09bf\u09b2\u09bf\u099f \u0995\u09b0\u09c1\u09a8",
      message: "\u0986\u09aa\u09a8\u09bf \u0995\u09bf \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4\u09ad\u09be\u09ac\u09c7 \u098f\u0987 \u0995\u09cd\u09af\u09be\u099f\u09be\u0997\u09b0\u09bf \u09a1\u09bf\u09b2\u09bf\u099f \u0995\u09b0\u09a4\u09c7 \u099a\u09be\u09a8?",
      type: "danger",
      confirmText: "\u09b9\u09cd\u09af\u09be\u0981, \u09a1\u09bf\u09b2\u09bf\u099f \u0995\u09b0\u09c1\u09a8",
      cancelText: "\u09ac\u09be\u09a4\u09bf\u09b2",
    });
    if (!confirmed) return;
    try {
      const res = await fetchAPI(`/api/categories/${id}`, { method: "DELETE" });
      if (res.success) {
        showAlert({ title: "\u09b8\u09ab\u09b2 \u09b9\u09af\u09bc\u09c7\u099b\u09c7", message: "\u0995\u09cd\u09af\u09be\u099f\u09be\u0997\u09b0\u09bf \u09b8\u09ab\u09b2\u09ad\u09be\u09ac\u09c7 \u09a1\u09bf\u09b2\u09bf\u099f \u0995\u09b0\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964", type: "success" });
        loadCategories();
      }
    } catch (err: any) {
      showAlert({ title: "\u09a4\u09cd\u09b0\u09c1\u099f\u09bf", message: err.message || "\u09a1\u09bf\u09b2\u09bf\u099f \u09ac\u09cd\u09af\u09b0\u09cd\u09a5 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964", type: "error" });
    }
  };

  const handleOpenMediaPicker = async () => {
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

  const handleSelectMedia = (url: string) => {
    setImage(url);
    setShowMediaPicker(false);
  };

  const handleDirectUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);
    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://ua-engineering-pte-ltd-backend-production.up.railway.app"}/api/media`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
          body: formData,
        }
      );
      const data = await res.json();
      if (data.success && data.media?.url) {
        setImage(data.media.url);
        showAlert({
          title: "সফল হয়েছে",
          message: "ছবি সফলভাবে আপলোড করা হয়েছে।",
          type: "success",
        });
      } else {
        showAlert({
          title: "ত্রুটি",
          message: data.message || "আপলোড ব্যর্থ হয়েছে।",
          type: "error",
        });
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      showAlert({
        title: "ত্রুটি",
        message: err.message || "আপলোড ব্যর্থ হয়েছে।",
        type: "error",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      showAlert({
        title: "সতর্কতা",
        message: "নাম এবং স্ল্যাগ আবশ্যক।",
        type: "warning",
      });
      return;
    }

    setSubmitting(true);

    const payload = {
      name,
      slug: slug.toLowerCase().trim(),
      description,
      image,
      status,
      displayOrder: Number(displayOrder),
    };

    try {
      let res;
      if (editingCategory) {
        res = await fetchAPI(`/api/categories/${editingCategory.slug}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetchAPI("/api/categories", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        showAlert({
          title: "সফল হয়েছে",
          message: editingCategory ? "ক্যাটাগরি আপডেট হয়েছে।" : "নতুন ক্যাটাগরি যুক্ত হয়েছে।",
          type: "success",
        });
        setShowModal(false);
        loadCategories();
      }
    } catch (err: any) {
      showAlert({
        title: "ত্রুটি",
        message: err.message || "সংরক্ষণ ব্যর্থ হয়েছে।",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">ক্যাটাগরি CRUD</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">প্রোডাক্ট ক্যাটাগরি সমূহ এবং শর্ট অর্ডার সেটিংস</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all shadow-md text-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন ক্যাটাগরি যোগ করুন</span>
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div
                key={cat._id}
                className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {/* Category Image */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200/85 shrink-0 bg-slate-50 flex items-center justify-center">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="object-cover w-full h-full" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-350" />
                      )}
                    </div>
                    {/* Category name & slug */}
                    <div>
                      <h3 className="text-base font-black text-slate-800 leading-tight">{cat.name}</h3>
                      <p className="text-[10px] font-bold text-slate-450 uppercase mt-1">{cat.slug}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                    {cat.description || "কোনো বিবরণী নেই।"}
                  </p>

                  {/* Meta items */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-450 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div>
                      <span>Display Order:</span>{" "}
                      <span className="text-slate-800 font-black">{cat.displayOrder}</span>
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div>
                      <span>Status:</span>{" "}
                      {cat.status === "active" ? (
                        <span className="text-emerald-600 font-black">Active</span>
                      ) : (
                        <span className="text-slate-400 font-black">Inactive</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit & Delete Action Panel */}
                <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-5">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-700 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>এডিট</span>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.slug)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-650 active:scale-[0.98] text-slate-600 font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>ডিলিট</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-slate-400 font-bold text-sm bg-white border border-slate-200 rounded-3xl shadow-2xs">
              কোনো ক্যাটাগরি পাওয়া যায়নি।
            </div>
          )}
        </div>
      )}

      {/* CRUD Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col justify-between z-10 overflow-hidden mx-4 animate-scale-up">
            {/* Modal Header */}
            <div className="h-16 border-b border-slate-150 px-6 sm:px-8 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                {editingCategory ? "ক্যাটাগরি এডিট করুন" : "নতুন ক্যাটাগরি যোগ করুন"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 flex-1">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">ক্যাটাগরির নাম <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: Cleaning products, Houseware"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Category Slug */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">স্ল্যাগ / Slug Handle <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="যেমন: cleaning-products, houseware"
                  required
                  disabled={!!editingCategory} // lock slugs on edit to prevent broken links
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                />
                <p className="text-[10px] text-slate-400 font-semibold">* URL তৈরিতে ব্যবহৃত হবে (যেমন: /products/autocare)</p>
              </div>

              {/* Display Order & Status */}
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

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">স্ট্যাটাস</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Category Image picker */}
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-700">ক্যাটাগরি ছবি</label>
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                    {image ? (
                      <img src={image} className="object-cover w-full h-full" alt="Category Cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-350" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleOpenMediaPicker}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-all cursor-pointer"
                      >
                        মিডিয়া লাইব্রেরি
                      </button>
                      <label className={`inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-lg transition-all cursor-pointer ${uploadingImage ? "opacity-50 cursor-not-allowed" : ""}`}>
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
                          onChange={(e) => handleDirectUpload(e.target.files)}
                        />
                      </label>
                    </div>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="অথবা সরাসরি ইমেজ URL পেস্ট করুন..."
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">ক্যাটাগরি বিবরণী</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ক্যাটাগরি সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
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
                <X className="w-4 h-4" />
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
                      <img src={media.url} className="object-cover w-full h-full" alt="Media item asset" />
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
