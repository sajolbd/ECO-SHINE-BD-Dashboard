"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import {
  Save,
  ImageIcon,
  PlusCircle,
  MinusCircle,
  HelpCircle,
  Award,
  Truck,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface Product {
  id: string;
  title: string;
}

interface Category {
  slug: string;
  name: string;
}

interface WhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
  displayOrder: number;
  status: "active" | "inactive";
}

export default function HomepageCMSPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Available lists for selections
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  // Homepage document fields
  const [heroHeading, setHeroHeading] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroBadge, setHeroBadge] = useState("");
  const [heroButtonText, setHeroButtonText] = useState("");
  const [heroButtonUrl, setHeroButtonUrl] = useState("");
  const [heroDesktopImage, setHeroDesktopImage] = useState("");
  const [heroMobileImage, setHeroMobileImage] = useState("");
  const [heroEnabled, setHeroEnabled] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState<string[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<string[]>([]);
  const [whyChooseUs, setWhyChooseUs] = useState<WhyChooseUsItem[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load products & categories first for references
      const pRes = await fetchAPI("/api/products?limit=100");
      if (pRes.success) setProductList(pRes.products);

      const cRes = await fetchAPI("/api/categories");
      if (cRes.success) setCategoryList(cRes.categories);

      // Load homepage details
      const hRes = await fetchAPI("/api/homepage");
      if (hRes.success && hRes.homepage) {
        const h = hRes.homepage;
        setHeroHeading(h.heroHeading);
        setHeroDescription(h.heroDescription);
        setHeroBadge(h.heroBadge || "");
        setHeroButtonText(h.heroButtonText || "");
        setHeroButtonUrl(h.heroButtonUrl || "");
        setHeroDesktopImage(h.heroDesktopImage);
        setHeroMobileImage(h.heroMobileImage);
        setHeroEnabled(h.heroEnabled !== undefined ? h.heroEnabled : true);
        setFeaturedProducts(h.featuredProducts || []);
        setFeaturedCategories(h.featuredCategories || []);
        setWhyChooseUs(h.whyChooseUs || []);
      }
    } catch (error) {
      console.error("Error loading homepage CMS:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProductToggle = (id: string) => {
    setFeaturedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleCategoryToggle = (slug: string) => {
    setFeaturedCategories((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Why choose us dynamics
  const addWhyChooseItem = () => {
    setWhyChooseUs((prev) => [
      ...prev,
      { icon: "Award", title: "", description: "", displayOrder: prev.length + 1, status: "active" },
    ]);
  };

  const updateWhyChooseItem = (index: number, field: keyof WhyChooseUsItem, val: any) => {
    const updated = [...whyChooseUs];
    updated[index] = { ...updated[index], [field]: val };
    setWhyChooseUs(updated);
  };

  const removeWhyChooseItem = (index: number) => {
    setWhyChooseUs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      heroHeading,
      heroDescription,
      heroBadge,
      heroButtonText,
      heroButtonUrl,
      heroDesktopImage,
      heroMobileImage,
      heroEnabled,
      featuredProducts,
      featuredCategories,
      whyChooseUs: whyChooseUs.filter((item) => item.title.trim() !== ""),
    };

    try {
      const res = await fetchAPI("/api/homepage", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        alert("হোমপেজ সেটিংস সফলভাবে সেভ করা হয়েছে।");
        loadData();
      }
    } catch (err: any) {
      alert(err.message || "সংরক্ষণ ব্যর্থ হয়েছে।");
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
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">হোমপেজ CMS</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">ওয়েবসাইটের হিরো ব্যানার, আমাদের বৈশিষ্ট্যসমূহ ও ফিচারড প্রোডাক্ট সেটিংস</p>
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
        {/* Hero Section settings */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800">১. হিরো সেকশন সেটিংস (Hero Banner)</h3>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={heroEnabled}
                onChange={(e) => setHeroEnabled(e.target.checked)}
                className="w-4.5 h-4.5 text-emerald-600 rounded-md border-slate-350 focus:ring-emerald-100"
              />
              <span className="text-xs font-black text-slate-700">হিরো সেকশন অন রাখুন</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Badge */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">হিরো লেবেল ব্যাজ</label>
                <input
                  type="text"
                  value={heroBadge}
                  onChange={(e) => setHeroBadge(e.target.value)}
                  placeholder="যেমন: Bangladesh's #1 Car Care Solutions"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">হিরো মেইন হেডিং <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  placeholder="যেমন: Shine Your World With Eco Shine"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">হিরো বর্ণনা (Description Text) <span className="text-red-500">*</span></label>
              <textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="হেডিং এর নিচে দেখানোর জন্য টেক্সট লিখুন..."
                rows={3}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>

            {/* Button texts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">CTA বাটন টেক্সট</label>
                <input
                  type="text"
                  value={heroButtonText}
                  onChange={(e) => setHeroButtonText(e.target.value)}
                  placeholder="যেমন: প্রোডাক্টস দেখুন"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">CTA বাটন লিংক URL</label>
                <input
                  type="text"
                  value={heroButtonUrl}
                  onChange={(e) => setHeroButtonUrl(e.target.value)}
                  placeholder="যেমন: #products"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Background Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">ডেস্কটপ হিরো ব্যাকগ্রাউন্ড ইমেজ URL <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={heroDesktopImage}
                  onChange={(e) => setHeroDesktopImage(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../img.png"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">মোবাইল হিরো ব্যাকগ্রাউন্ড ইমেজ URL <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={heroMobileImage}
                  onChange={(e) => setHeroMobileImage(e.target.value)}
                  placeholder="https://res.cloudinary.com/.../img-mobile.png"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">২. ফিচারড প্রোডাক্টস নির্বাচন (Homepage Carousel Grid)</h3>
          <p className="text-xs text-slate-400 font-semibold uppercase">ওয়েবসাইটের মূল হোমপেজে যেসব প্রোডাক্টস সাজিয়ে দেখাতে চান তা টিক দিন:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-2 bg-slate-50 border border-slate-150 rounded-2xl">
            {productList.map((prod) => {
              const isChecked = featuredProducts.includes(prod.id);
              return (
                <label
                  key={prod.id}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer select-none transition-all ${
                    isChecked
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-white border-slate-200 hover:bg-slate-50/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleProductToggle(prod.id)}
                    className="w-4 h-4 text-emerald-600 rounded-md mt-0.5"
                  />
                  <span>{prod.title} ({prod.id})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">৩. হোমপেজ ক্যাটাগরি প্যানেল</h3>
          <p className="text-xs text-slate-400 font-semibold uppercase">হোমপেজে শর্টকাট ক্যাটাগরি মেনু হিসেবে দেখানোর জন্য নির্বাচন করুন:</p>
          <div className="grid grid-cols-2 gap-3 p-2 bg-slate-50 border border-slate-150 rounded-2xl">
            {categoryList.map((cat) => {
              const isChecked = featuredCategories.includes(cat.slug);
              return (
                <label
                  key={cat.slug}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer select-none transition-all ${
                    isChecked
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCategoryToggle(cat.slug)}
                    className="w-4 h-4 text-emerald-600 rounded-md"
                  />
                  <span>{cat.name} ({cat.slug})</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Why Choose Us Items */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800">৪. বৈশিষ্ট্যসমূহ (Why Choose Us Grid)</h3>
            <button
              type="button"
              onClick={addWhyChooseItem}
              className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>বৈশিষ্ট্য যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-4">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4.5 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeWhyChooseItem(index)}
                  className="absolute top-4.5 right-4.5 text-slate-400 hover:text-red-650 cursor-pointer"
                  title="Remove"
                >
                  <MinusCircle className="w-5 h-5" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Icon select */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700">আইকন</label>
                    <select
                      value={item.icon}
                      onChange={(e) => updateWhyChooseItem(index, "icon", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-none"
                    >
                      <option value="Award">🏆 Award (কোয়ালিটি)</option>
                      <option value="Truck">🚚 Truck (ডেলিভারি)</option>
                      <option value="ShieldCheck">🛡️ ShieldCheck (নিরাপত্তা)</option>
                      <option value="Zap">⚡ Zap (দ্রুততা)</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs font-black text-slate-700">শিরোনাম</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateWhyChooseItem(index, "title", e.target.value)}
                      placeholder="যেমন: ১০০% প্রিমিয়াম কোয়ালিটি"
                      className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700">উপশিরোনাম / বিবরণী</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateWhyChooseItem(index, "description", e.target.value)}
                    placeholder="যেমন: আমাদের সব প্রোডাক্টের গুণগত মান নিশ্চিত করা।"
                    className="w-full px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}
