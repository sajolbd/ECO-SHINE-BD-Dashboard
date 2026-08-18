"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useModal } from "../../../context/ModalContext";
import { Save, Globe, Eye, Search, Code, Check } from "lucide-react";

type Pages = "home" | "products" | "categories" | "about" | "contact";

export default function SEOCMSPage() {
  const { showAlert } = useModal();
  const [activePage, setActivePage] = useState<Pages>("home");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // SEO Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywordsText, setKeywordsText] = useState("");
  const [robots, setRobots] = useState("index, follow");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [ogImage, setOgImage] = useState("");

  const loadData = async (pageName: Pages) => {
    setLoading(true);
    try {
      const res = await fetchAPI(`/api/seo/${pageName}`);
      if (res.success && res.seo) {
        const s = res.seo;
        setTitle(s.title);
        setDescription(s.description);
        setKeywordsText(s.keywords ? s.keywords.join(", ") : "");
        setRobots(s.robots || "index, follow");
        setOgTitle(s.ogTitle || "");
        setOgDescription(s.ogDescription || "");
        setOgImage(s.ogImage || "");
      }
    } catch (err) {
      console.error("Error loading SEO configuration:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activePage);
  }, [activePage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      description,
      keywords: keywordsText
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== ""),
      robots,
      ogTitle: ogTitle || undefined,
      ogDescription: ogDescription || undefined,
      ogImage: ogImage || undefined,
    };

    try {
      const res = await fetchAPI(`/api/seo/${activePage}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        showAlert({ title: "সফল হয়েছে", message: `${activePage.toUpperCase()} পেজের SEO মেটা সফলভাবে সেভ করা হয়েছে।`, type: "success" });
        loadData(activePage);
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "সংরক্ষণ ব্যর্থ হয়েছে।", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">SEO কনফিগ</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">ওয়েবসাইটের পাতাও ভিত্তিক সার্চ ইঞ্জিন অপ্টিমাইজেশন মেটা ট্যাগ সেটিংস</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-450 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all shadow-md text-sm cursor-pointer shrink-0"
        >
          <Save className="w-4.5 h-4.5" />
          {saving ? <span>সংরক্ষণ হচ্ছে...</span> : <span>সেটিংস সেভ করুন</span>}
        </button>
      </div>

      {/* Pages selector tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-3xl px-6 py-2 overflow-x-auto shadow-2xs">
        {(["home", "products", "categories", "about", "contact"] as Pages[]).map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`py-3.5 px-5 text-xs font-black capitalize transition-all border-b-2 cursor-pointer ${
              activePage === page
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-400 hover:text-slate-650"
            }`}
          >
            {page === "home"
              ? "হোমপেজ (Home)"
              : page === "products"
              ? "প্রোডাক্টস (Products)"
              : page === "categories"
              ? "ক্যাটাগরি (Categories)"
              : page === "about"
              ? "আমাদের সম্পর্কে (About)"
              : "যোগাযোগ (Contact)"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
          {/* Main search tags */}
          <div className="bg-white border border-t-0 border-slate-200 rounded-b-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Globe className="w-4.5 h-4.5 text-slate-400" />
              <span>সার্চ মেটা ট্যাগস (Standard Meta Tags)</span>
            </h3>

            <div className="space-y-4">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">মেটা টাইটেল (Meta Title) <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: Eco Shine Bangladesh | Environment, Safety & Health"
                  required
                  maxLength={70}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 font-semibold">* গুগল সার্চ পেজে টাইটেল হিসেবে দেখাবে (সর্বোচ্চ ৭০ অক্ষর সুপারিশকৃত)</p>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">মেটা বিবরণী (Meta Description) <span className="text-red-500">*</span></label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="সার্চ পেজে টাইটেলের নিচে দেখানোর বিবরণী..."
                  required
                  rows={4}
                  maxLength={160}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 font-semibold">* সংক্ষিপ্ত বিবরণী (সর্বোচ্চ ১৬০ অক্ষর সুপারিশকৃত)</p>
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">সার্চ কিওয়ার্ডস (Keywords)</label>
                <input
                  type="text"
                  value={keywordsText}
                  onChange={(e) => setKeywordsText(e.target.value)}
                  placeholder="কমা দিয়ে আলাদা করুন, যেমন: car care shampoo, tiles cleaner, ecoshine"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400 font-semibold">* কমা ( , ) দিয়ে কিওয়ার্ডস গুলো আলাদা করে লিখুন</p>
              </div>

              {/* Robots */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">রোবটস নির্দেশাবলী (Robots Tag)</label>
                <select
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="index, follow">index, follow (সার্চে দেখাবে ও ক্রল হবে)</option>
                  <option value="noindex, nofollow">noindex, nofollow (সার্চে দেখাবে না ও ব্লক হবে)</option>
                  <option value="index, nofollow">index, nofollow (সার্চে দেখাবে কিন্তু লিংক অনুসরণ করবে না)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Social Open Graph cards */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
            <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-2.5 flex items-center gap-1.5">
              <Eye className="w-4.5 h-4.5 text-slate-400" />
              <span>সোশ্যাল মেটা ট্যাগস (Open Graph / Facebook Preview)</span>
            </h3>

            <div className="space-y-4">
              {/* OG Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">সোশ্যাল কার্ড টাইটেল (OG Title)</label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="লিংক শেয়ার করলে সোশ্যাল কার্ডে দেখানোর টাইটেল..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* OG Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">সোশ্যাল কার্ড বিবরণী (OG Description)</label>
                <textarea
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="সোশ্যাল কার্ডে দেখানোর বিবরণী..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* OG Image */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">সোশ্যাল প্রিভিউ ইমেজ URL (OG Image)</label>
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../og-preview.png"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 font-semibold">* রিকমেন্ডেড সাইজ: ১২০০ × ৬৩০ পিক্সেল (১.৯১:১ অনুপাত)</p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
