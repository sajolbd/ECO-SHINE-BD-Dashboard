"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useModal } from "../../../context/ModalContext";
import {
  Save,
  PlusCircle,
  MinusCircle,
  Award,
  Truck,
  ShieldCheck,
  Zap,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Eye,
  Megaphone,
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

const DEFAULT_ANNOUNCEMENTS_PREVIEW = [
  "স্বাগতম ইকো সাইন বাংলাদেশে — পরিবেশবান্ধব ক্লিনিং ও কালার গার্ড ফোমিং সলিউশন!",
  "সারা বাংলাদেশে ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে মূল্য পরিশোধের সুবিধা!",
  "১০০% অরিজিনাল ও প্রিমিয়াম কোয়ালিটি গ্যারান্টিযুক্ত প্রোডাক্টস!",
  "জরুরি অর্ডারের জন্য কল করুন: 01958-058359 | হোয়াটসঅ্যাপেও মেসেজ দেওয়া যাবে।"
];

export default function HomepageCMSPage() {
  const { showAlert } = useModal();
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
  const [announcements, setAnnouncements] = useState<string[]>([]);

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
        setHeroHeading(h.heroHeading || "Shine Your World With Eco Shine");
        setHeroDescription(
          h.heroDescription ||
            "গাড়ির কালার গার্ড ফোমিং জেল, শাইনিং ওয়াক্স ও মেটাল প্রটেক্টর সহ আমাদের সেরা মানের পরিবেশবান্ধব প্রোডাক্টস।"
        );
        setHeroBadge(h.heroBadge || "Bangladesh's #1 Eco-Shine & Renovation Hub");
        setHeroButtonText(h.heroButtonText || "প্রোডাক্ট দেখুন");
        setHeroButtonUrl(h.heroButtonUrl || "#products");
        setHeroDesktopImage(h.heroDesktopImage || "/images/home/hero/hero-bg.png");
        setHeroMobileImage(h.heroMobileImage || "/images/home/hero/hero-bg-mobile.png");
        setHeroEnabled(h.heroEnabled !== undefined ? h.heroEnabled : true);
        const loadedAnnouncements = (h.announcements || []).filter((a: string) => a && a.trim() !== "");
        setAnnouncements(loadedAnnouncements.length > 0 ? loadedAnnouncements : DEFAULT_ANNOUNCEMENTS_PREVIEW);
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

  const addAnnouncement = () => {
    setAnnouncements((prev) => [...prev, ""]);
  };

  const updateAnnouncement = (index: number, val: string) => {
    const updated = [...announcements];
    updated[index] = val;
    setAnnouncements(updated);
  };

  const removeAnnouncement = (index: number) => {
    setAnnouncements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      heroHeading: heroHeading.trim() || "Shine Your World With Eco Shine",
      heroDescription:
        heroDescription.trim() ||
        "গাড়ির কালার গার্ড ফোমিং জেল, শাইনিং ওয়াক্স ও মেটাল প্রটেক্টর সহ আমাদের সেরা মানের পরিবেশবান্ধব প্রোডাক্টস।",
      heroBadge,
      heroButtonText,
      heroButtonUrl,
      heroDesktopImage: heroDesktopImage.trim() || "/images/home/hero/hero-bg.png",
      heroMobileImage: heroMobileImage.trim() || "/images/home/hero/hero-bg-mobile.png",
      heroEnabled,
      announcements: announcements.filter((a) => a.trim() !== ""),
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
        showAlert({
          title: "সফল হয়েছে",
          message: "হোমপেজ সেটিংস সফলভাবে সেভ করা হয়েছে।",
          type: "success",
        });
        loadData();
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "সংরক্ষণ ব্যর্থ হয়েছে।", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Award":
        return <Award className="w-4 h-4 text-amber-500" />;
      case "Truck":
        return <Truck className="w-4 h-4 text-emerald-500" />;
      case "ShieldCheck":
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      case "Zap":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    }
  };

  const effectiveAnnouncements =
    announcements.filter((a) => a.trim() !== "").length > 0
      ? announcements.filter((a) => a.trim() !== "")
      : DEFAULT_ANNOUNCEMENTS_PREVIEW;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Keyframe animation for marquee inside input card preview */}
      <style jsx global>{`
        @keyframes inline-marquee-ltr {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-inline-marquee-ltr {
          display: flex;
          width: max-content;
          animation: inline-marquee-ltr 22s linear infinite;
        }
        .animate-inline-marquee-ltr:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            হোমপেজ CMS সেটিংস
          </h1>
          <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">
            ওয়েবসাইটের হিরো ব্যানার, টপ এনাউন্সমেন্ট বার ও ক্যাটাগরি সেটিংস (ইনপুট বক্সে লাইভ প্রিভিউ সহ)
          </p>
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
        {/* ========================================================================= */}
        {/* 1. HERO BANNER CARD (With Inline Live Preview inside card)                 */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span>১. হিরো সেকশন সেটিংস (Hero Banner)</span>
            </h3>
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
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">হিরো মেইন হেডিং</label>
                <input
                  type="text"
                  value={heroHeading}
                  onChange={(e) => setHeroHeading(e.target.value)}
                  placeholder="যেমন: Shine Your World With Eco Shine"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">
                হিরো বর্ণনা (Description Text)
              </label>
              <textarea
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="হেডিং এর নিচে দেখানোর জন্য টেক্সট লিখুন..."
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
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
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">CTA বাটন লিংক URL</label>
                <input
                  type="text"
                  value={heroButtonUrl}
                  onChange={(e) => setHeroButtonUrl(e.target.value)}
                  placeholder="যেমন: #products"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Background Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">
                  ডেস্কটপ হিরো ব্যাকগ্রাউন্ড ইমেজ URL
                </label>
                <input
                  type="text"
                  value={heroDesktopImage}
                  onChange={(e) => setHeroDesktopImage(e.target.value)}
                  placeholder="/images/home/hero/hero-bg.png"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">
                  মোবাইল হিরো ব্যাকগ্রাউন্ড ইমেজ URL
                </label>
                <input
                  type="text"
                  value={heroMobileImage}
                  onChange={(e) => setHeroMobileImage(e.target.value)}
                  placeholder="/images/home/hero/hero-bg-mobile.png"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* EMBEDDED INLINE LIVE PREVIEW FOR HERO SECTION */}
          <div className="border border-slate-200 bg-slate-900 rounded-2xl p-5 text-white space-y-3 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Eye className="w-3.5 h-3.5" />
                <span>হিরো ব্যানার লাইভ প্রিভিউ (Hero Banner Live Preview)</span>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-mono">Real-time</span>
            </div>

            {heroEnabled ? (
              <div className="space-y-2.5 pt-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>{heroBadge || "Bangladesh's #1 Eco-Shine & Renovation Hub"}</span>
                </div>

                <h4 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {heroHeading || "Shine Your World With Eco Shine"}
                </h4>

                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">
                  {heroDescription ||
                    "গাড়ির কালার গার্ড ফোমিং জেল, শাইনিং ওয়াক্স ও মেটাল প্রটেক্টর সহ আমাদের সেরা মানের পরিবেশবান্ধব প্রোডাক্টস।"}
                </p>

                <div className="pt-1 flex items-center gap-3">
                  <span className="px-3.5 py-1.5 bg-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-md">
                    {heroButtonText || "প্রোডাক্ট দেখুন"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    (লিংক: {heroButtonUrl || "#products"})
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                (হিরো সেকশন বন্ধ রাখা হয়েছে)
              </p>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TOP ANNOUNCEMENT BAR CARD (With Moving Ticker Preview inside card)     */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                ২. টপ এনাউন্সমেন্ট বার (Continuous Moving Top Ticker)
              </h3>
              <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">
                ওয়েবসাইটের একদম উপরে অনবরত স্ক্রোলিং এনাউন্সমেন্ট টেক্সট যোগ বা এডিট করুন:
              </p>
            </div>
            <button
              type="button"
              onClick={addAnnouncement}
              className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>ঘোষণা যোগ করুন</span>
            </button>
          </div>

          {/* Form Input fields list */}
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-xs text-slate-400 font-medium italic p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                কোনো কাস্টম এনাউন্সমেন্ট যুক্ত করা হয়নি। খালি রাখলে ডিফল্ট অফার ও নোটিশসমূহ সচল থাকবে।
              </p>
            ) : (
              announcements.map((text, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-500 w-6 text-center">{idx + 1}.</span>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => updateAnnouncement(idx, e.target.value)}
                    placeholder="যেমন: সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা!"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeAnnouncement(idx)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <MinusCircle className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* EMBEDDED INLINE LIVE MOVING TICKER PREVIEW */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>টপ এনাউন্সমেন্ট বার অনবরত স্ক্রোলিং লাইভ প্রিভিউ (Moving Marquee Live Preview):</span>
            </div>

            <div className="relative w-full overflow-hidden text-xs py-2 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white rounded-2xl shadow-sm select-none border border-emerald-500/30">
              <div className="relative flex overflow-hidden w-full items-center">
                {/* Set 1 */}
                <div className="animate-inline-marquee-ltr flex shrink-0 items-center gap-8 pr-8">
                  {effectiveAnnouncements.map((text, idx) => (
                    <div key={`m1-${idx}`} className="inline-flex items-center gap-2 font-bold text-xs">
                      <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-emerald-400 text-emerald-950 font-black">
                        ঘোষণা
                      </span>
                      <span>{text}</span>
                      <Sparkles className="w-3 h-3 text-amber-300 ml-2" />
                    </div>
                  ))}
                </div>

                {/* Set 2 (Clone for infinite loop) */}
                <div className="animate-inline-marquee-ltr flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
                  {effectiveAnnouncements.map((text, idx) => (
                    <div key={`m2-${idx}`} className="inline-flex items-center gap-2 font-bold text-xs">
                      <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider bg-emerald-400 text-emerald-950 font-black">
                        ঘোষণা
                      </span>
                      <span>{text}</span>
                      <Sparkles className="w-3 h-3 text-amber-300 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. FEATURED PRODUCTS SELECTION (With Product Grid Preview inside card)   */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">
              ৩. ফিচারড প্রোডাক্টস নির্বাচন (Homepage Carousel Grid)
            </h3>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-1">
              ওয়েবসাইটের মূল হোমপেজে যেসব প্রোডাক্টস সাজিয়ে দেখাতে চান তা টিক দিন:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-3 bg-slate-50 border border-slate-150 rounded-2xl">
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

          {/* EMBEDDED INLINE LIVE PREVIEW FOR FEATURED PRODUCTS */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>ফিচারড প্রোডাক্টস লাইভ প্রিভিউ (Selected Products Preview):</span>
              </div>
              <span className="text-emerald-700 font-black">
                {featuredProducts.length} টি প্রোডাক্ট সিলেক্টেড
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-slate-100 rounded-2xl border border-slate-200">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((pId) => {
                  const prodObj = productList.find((p) => p.id === pId);
                  return (
                    <div
                      key={pId}
                      className="bg-white border border-slate-200 rounded-xl p-3 space-y-1.5 shadow-2xs"
                    >
                      <div className="w-full h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                        <ShoppingBag className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                        {prodObj ? prodObj.title : pId}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                        <span className="text-amber-500">★ 4.9</span>
                        <span className="text-emerald-600">অর্ডার করুন</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-4 text-center text-xs font-semibold text-slate-400">
                  কোনো নির্দিষ্ট প্রোডাক্টস টিক দেওয়া হয়নি (সব প্রোডাক্টস গ্রিডে দেখাবে)
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. FEATURED CATEGORIES (With Pills Preview inside card)                  */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">
              ৪. হোমপেজ ক্যাটাগরি প্যানেল
            </h3>
            <p className="text-xs text-slate-400 font-semibold uppercase mt-1">
              হোমপেজে শর্টকাট ক্যাটাগরি মেনু হিসেবে দেখানোর জন্য নির্বাচন করুন:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
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

          {/* EMBEDDED INLINE LIVE PREVIEW FOR CATEGORIES */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>ক্যাটাগরি মেনু লাইভ প্রিভিউ:</span>
            </div>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-100 rounded-2xl border border-slate-200">
              {featuredCategories.length > 0 ? (
                featuredCategories.map((slug) => {
                  const catObj = categoryList.find((c) => c.slug === slug);
                  return (
                    <span
                      key={slug}
                      className="px-3.5 py-1.5 bg-white text-emerald-800 border border-emerald-300 rounded-xl text-xs font-extrabold shadow-2xs"
                    >
                      {catObj ? catObj.name : slug}
                    </span>
                  );
                })
              ) : (
                <span className="text-xs font-medium text-slate-400 italic">
                  কোনো ক্যাটাগরি নির্বাচিত করা নেই
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 5. WHY CHOOSE US GRID (With Feature Cards Preview inside card)           */}
        {/* ========================================================================= */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800">
              ৫. বৈশিষ্ট্যসমূহ (Why Choose Us Grid)
            </h3>
            <button
              type="button"
              onClick={addWhyChooseItem}
              className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              <span>বৈশিষ্ট্য যোগ করুন</span>
            </button>
          </div>

          <div className="space-y-4">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="border border-slate-200 bg-slate-50/50 rounded-2xl p-4.5 space-y-3 relative"
              >
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

          {/* EMBEDDED INLINE LIVE PREVIEW FOR WHY CHOOSE US */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Eye className="w-3.5 h-3.5 text-emerald-600" />
              <span>বৈশিষ্ট্যসমূহ লাইভ প্রিভিউ (Why Choose Us Live Preview):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-100 rounded-2xl border border-slate-200">
              {whyChooseUs.length > 0 ? (
                whyChooseUs.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-xl p-3 space-y-1 text-center flex flex-col items-center justify-center shadow-2xs"
                  >
                    <div className="p-2 bg-slate-50 rounded-full mb-1">
                      {getIconComponent(item.icon)}
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">
                      {item.title || "শিরোনাম"}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-2">
                      {item.description || "বিবরণী..."}
                    </p>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-4 text-center text-xs text-slate-400 italic">
                  কোনো বৈশিষ্ট্য যুক্ত করা হয়নি
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
