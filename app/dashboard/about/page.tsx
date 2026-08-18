"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useModal } from "../../../context/ModalContext";
import { Save, PlusCircle, MinusCircle } from "lucide-react";

export default function AboutCMSPage() {
  const { showAlert } = useModal();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // About fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/about");
      if (res.success && res.about) {
        const a = res.about;
        setTitle(a.title);
        setDescription(a.description);
        setImages(a.images || []);
        setMission(a.mission || "");
        setVision(a.vision || "");
        setHighlights(a.highlights || []);
      }
    } catch (err) {
      console.error("Error loading about page CMS:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Highlights checklists dynamics
  const addHighlight = () => setHighlights((prev) => [...prev, ""]);
  const updateHighlight = (index: number, val: string) => {
    const updated = [...highlights];
    updated[index] = val;
    setHighlights(updated);
  };
  const removeHighlight = (index: number) => setHighlights((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      description,
      images,
      mission,
      vision,
      highlights: highlights.filter((h) => h.trim() !== ""),
    };

    try {
      const res = await fetchAPI("/api/about", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        showAlert({ title: "সফল হয়েছে", message: "আমাদের সম্পর্কে পেজ সেটিংস সফলভাবে সেভ করা হয়েছে।", type: "success" });
        loadData();
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "সংরক্ষণ ব্যর্থ হয়েছে।", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">우리 সম্পর্কে (About Us)</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">কোম্পানির মিশন, ভিশন ও বুলেট পয়েন্ট পরিচিতি সেটিংস</p>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Description info */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">১. মূল পরিচিতি ও বর্ণনা</h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">পরিচিতি হেডিং <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: আমরা ইকো সাইন বাংলাদেশ"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">পরিচিতি ডেসক্রিপশন <span className="text-red-500">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="আমাদের সেবা ও লক্ষ্য নিয়ে বর্ণনা লিখুন..."
                rows={5}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">২. লক্ষ্য ও উদ্দেশ্য (Mission & Vision)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">আমাদের মিশন (Our Mission)</label>
              <textarea
                value={mission}
                onChange={(e) => setMission(e.target.value)}
                placeholder="মিশন প্যারাগ্রাফ..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">আমাদের ভিশন (Our Vision)</label>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                placeholder="ভিশন প্যারাগ্রাফ..."
                rows={4}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Highlight Bullets */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800">৩. পেজ কি হাইলাইটস (Bullet points)</h3>
            <button
              type="button"
              onClick={addHighlight}
              className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>হাইলাইট যোগ করুন</span>
            </button>
          </div>

          {highlights.length > 0 ? (
            <div className="space-y-3">
              {highlights.map((high, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={high}
                    onChange={(e) => updateHighlight(index, e.target.value)}
                    placeholder="যেমন: ১০০% পরিবেশবান্ধব লিকুইড কেমিক্যাল..."
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="p-2 text-slate-400 hover:text-red-650 cursor-pointer"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-bold py-2 text-center">কোনো হাইলাইট বুলেটস অ্যাড করা হয়নি।</p>
          )}
        </div>
      </form>
    </div>
  );
}
