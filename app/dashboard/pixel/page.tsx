"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import {
  Share2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Key,
  Activity,
  Plus,
  Trash2,
  Play,
  Copy,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Radio,
} from "lucide-react";

interface CustomPixel {
  id: string;
  name: string;
  pixelId: string;
  enabled: boolean;
}

export default function PixelCMSPage() {
  const { user } = useAuth();
  const { showAlert } = useModal();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [pixelId, setPixelId] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [capiAccessToken, setCapiAccessToken] = useState("");
  const [testEventCode, setTestEventCode] = useState("");
  const [enableCapi, setEnableCapi] = useState(false);

  // Tracking Event Toggles
  const [trackPageView, setTrackPageView] = useState(true);
  const [trackViewContent, setTrackViewContent] = useState(true);
  const [trackAddToCart, setTrackAddToCart] = useState(true);
  const [trackInitiateCheckout, setTrackInitiateCheckout] = useState(true);
  const [trackPurchase, setTrackPurchase] = useState(true);
  const [trackContact, setTrackContact] = useState(true);

  // Custom secondary pixels
  const [customPixels, setCustomPixels] = useState<CustomPixel[]>([]);
  const [newPixelName, setNewPixelName] = useState("");
  const [newPixelIdVal, setNewPixelIdVal] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/pixel");
      if (res.success && res.settings) {
        const s = res.settings;
        setPixelId(s.pixelId || "");
        setEnabled(s.enabled ?? true);
        setCapiAccessToken(s.capiAccessToken || "");
        setTestEventCode(s.testEventCode || "");
        setEnableCapi(s.enableCapi ?? false);
        setTrackPageView(s.trackPageView ?? true);
        setTrackViewContent(s.trackViewContent ?? true);
        setTrackAddToCart(s.trackAddToCart ?? true);
        setTrackInitiateCheckout(s.trackInitiateCheckout ?? true);
        setTrackPurchase(s.trackPurchase ?? true);
        setTrackContact(s.trackContact ?? true);
        setCustomPixels(s.customPixels || []);
      }
    } catch (err) {
      console.error("Error loading pixel settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "super-admin" || user?.role === "admin") {
      loadData();
    }
  }, [user]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);

    const payload = {
      pixelId: pixelId.trim(),
      enabled,
      capiAccessToken: capiAccessToken.trim(),
      testEventCode: testEventCode.trim(),
      enableCapi,
      trackPageView,
      trackViewContent,
      trackAddToCart,
      trackInitiateCheckout,
      trackPurchase,
      trackContact,
      customPixels,
    };

    try {
      const res = await fetchAPI("/api/pixel", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        showAlert({
          title: "সফল হয়েছে",
          message: "ফেসবুক পিক্সেল ও Conversions API সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে।",
          type: "success",
        });
        loadData();
      }
    } catch (err: any) {
      showAlert({
        title: "ত্রুটি",
        message: err.message || "পিক্সেল সেটিংস সেভ করতে সমস্যা হয়েছে।",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCopyPixelId = () => {
    if (!pixelId) return;
    navigator.clipboard.writeText(pixelId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCustomPixel = () => {
    if (!newPixelName.trim() || !newPixelIdVal.trim()) {
      showAlert({
        title: "ইনপুট প্রয়োজন",
        message: "দয়া করে সেকেন্ডারি পিক্সেলের নাম এবং পিক্সেল আইডি প্রদান করুন।",
        type: "warning",
      });
      return;
    }

    const newObj: CustomPixel = {
      id: `px_${Date.now()}`,
      name: newPixelName.trim(),
      pixelId: newPixelIdVal.trim(),
      enabled: true,
    };

    setCustomPixels([...customPixels, newObj]);
    setNewPixelName("");
    setNewPixelIdVal("");
  };

  const handleRemoveCustomPixel = (id: string) => {
    setCustomPixels(customPixels.filter((p) => p.id !== id));
  };

  const handleToggleCustomPixel = (id: string) => {
    setCustomPixels(
      customPixels.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleTestCAPI = async () => {
    if (!pixelId) {
      showAlert({
        title: "পিক্সেল আইডি নেই",
        message: "দয়া করে প্রথমে ফেসবুক পিক্সেল আইডি প্রদান ও সেভ করুন।",
        type: "warning",
      });
      return;
    }

    setTesting(true);
    try {
      const res = await fetchAPI("/api/pixel/capi-event", {
        method: "POST",
        body: JSON.stringify({
          eventName: "PageView",
          eventId: `test_${Date.now()}`,
          eventSourceUrl: typeof window !== "undefined" ? window.location.href : "https://www.ecoshinebd.com",
          userData: {
            phone: "01900000000",
            email: "test@ecoshinebd.com",
            name: "Eco Shine Admin Test",
          },
          customData: {
            source: "Dashboard Live Tester",
            test_mode: true,
          },
        }),
      });

      if (res.success && res.result?.success) {
        showAlert({
          title: "টেস্ট সফল হয়েছে!",
          message: `Meta Events Manager-এ সফলভাবে টেস্ট পেজভিউ ইভেন্ট পাঠানো হয়েছে। ${
            testEventCode ? `(Test Code: ${testEventCode})` : ""
          }`,
          type: "success",
        });
      } else {
        const reason = res.result?.reason || res.result?.response?.error?.message || "CAPI টেস্ট রেসপন্স পাওয়া যায়নি।";
        showAlert({
          title: "CAPI টেস্ট সতর্কবার্তা",
          message: `টেস্ট ইভেন্ট সাবমিশন: ${reason}`,
          type: "warning",
        });
      }
    } catch (err: any) {
      showAlert({
        title: "টেস্ট ব্যর্থ",
        message: err.message || "CAPI টেস্ট ইভেন্ট পাঠাতে সমস্যা হয়েছে।",
        type: "error",
      });
    } finally {
      setTesting(false);
    }
  };

  if (user?.role !== "super-admin" && user?.role !== "admin") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl space-y-2 max-w-lg">
        <h3 className="text-base font-black flex items-center gap-1.5">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>প্রবেশাধিকার নিষিদ্ধ</span>
        </h3>
        <p className="text-xs font-semibold">
          দুঃখিত, এই সেটিংস পাতাটি পরিবর্তন করার এক্সেস শুধুমাত্র এডমিনদের রয়েছে।
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <Share2 className="w-7 h-7 text-blue-600" />
            <span>ফেসবুক পিক্সেল & CAPI ট্র্যাকিং</span>
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Meta Pixel (Browser) এবং Conversions API (Server-side) ই-কমার্স ট্র্যাক কনফিগারেশন
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleTestCAPI}
            disabled={testing}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs transition-all border border-blue-200 active:scale-95 cursor-pointer"
          >
            <Play className={`w-4 h-4 ${testing ? "animate-spin" : ""}`} />
            <span>{testing ? "টেস্ট হচ্ছে..." : "CAPI টেস্ট ট্রাই"}</span>
          </button>

          <button
            onClick={() => handleSubmit()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all shadow-md text-xs cursor-pointer shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "সেভ হচ্ছে..." : "সেটিংস সেভ করুন"}</span>
          </button>
        </div>
      </div>

      {/* Live Status Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${enabled && pixelId ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold">পিক্সেল স্ট্যাটাস:</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${enabled && pixelId ? "bg-emerald-400 text-emerald-950" : "bg-red-500 text-white"}`}>
                  {enabled && pixelId ? "Active & Tracking" : "Disabled / Not Set"}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {pixelId ? `Pixel ID: ${pixelId}` : "কোন পিক্সেল আইডি যুক্ত করা হয়নি"}
              </p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none bg-white/10 px-4 py-2.5 rounded-2xl border border-white/10 hover:bg-white/15 transition-all">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="w-4.5 h-4.5 text-emerald-500 rounded border-slate-600 focus:ring-emerald-400 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-100">গ্লোবাল পিক্সেল চালু রাখুন</span>
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Browser Tracking</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Client (fbq) Ready
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Meta CAPI (Server)</span>
            <span className={enableCapi && capiAccessToken ? "text-emerald-400 font-bold flex items-center gap-1.5" : "text-amber-400 font-bold flex items-center gap-1.5"}>
              <ShieldCheck className="w-4 h-4" /> {enableCapi && capiAccessToken ? "Server CAPI Active" : "CAPI Off / Needs Token"}
            </span>
          </div>

          <div className="bg-white/5 p-3.5 rounded-2xl border border-white/5 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Test Mode Code</span>
            <span className="text-amber-300 font-mono font-bold truncate block">
              {testEventCode || "No Test Code (Live)"}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: Primary Facebook Pixel */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-600" />
              <span>১. প্রাইমারি ফেসবুক পিক্সেল আইডি</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
              Meta Pixel Base Script
            </span>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black text-slate-700">
              ফেসবুক পিক্সেল আইডি (Pixel ID) <span className="text-red-500">*</span>
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                value={pixelId}
                onChange={(e) => setPixelId(e.target.value)}
                placeholder="উদাহরণ: 123456789012345"
                required
                className="w-full pl-4 pr-24 py-3 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="button"
                onClick={handleCopyPixelId}
                disabled={!pixelId}
                className="absolute right-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? "কপি হয়েছে!" : "কপি"}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold">
              Meta Events Manager থেকে ১৫ ডিজিটের Pixel ID কন্টেন্ট দিন। এটি সাইটের ক্লায়েন্ট সাইডে অটোমেটিক সংযুক্ত হবে।
            </p>
          </div>
        </div>

        {/* Card 2: Meta Conversions API (CAPI) */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <span>২. Meta Conversions API (CAPI - సర్వర్-సైడ్)</span>
            </h3>

            <label className="flex items-center gap-2.5 cursor-pointer select-none bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
              <input
                type="checkbox"
                checked={enableCapi}
                onChange={(e) => setEnableCapi(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-100 cursor-pointer"
              />
              <span className="text-xs font-black text-indigo-900">CAPI সার্ভার ট্র্যাকিং সক্রিয়</span>
            </label>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            iOS 14+ এবং এড-ব্লকার বাইপাস করে ১০০% সঠিক কনভার্সন ডাটা ফেচ করার জন্য CAPI অত্যন্ত প্রয়োজনীয়। অর্ডারের ক্ষেত্রে ব্যাকএন্ড সার্ভার সরাসরি Meta Graph API-তে ডাটা পাঠাবে।
          </p>

          <div className="space-y-4">
            {/* Access Token */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">
                CAPI Access Token (Meta System User Token)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showAccessToken ? "text" : "password"}
                  value={capiAccessToken}
                  onChange={(e) => setCapiAccessToken(e.target.value)}
                  placeholder="EAAG... (Meta Events Manager > Settings > Generate Access Token)"
                  className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAccessToken(!showAccessToken)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  {showAccessToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Test Event Code */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">
                Test Event Code (Meta Test Events Tab code)
              </label>
              <input
                type="text"
                value={testEventCode}
                onChange={(e) => setTestEventCode(e.target.value)}
                placeholder="উদাহরণ: TEST12345 (লাইভ ট্র্যাকিংয়ের জন্য খালি রাখুন)"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[10px] text-slate-400 font-semibold">
                Meta Events Manager &gt; Test Events ট্যাব থেকে কোড নিয়ে টেস্ট করতে পারেন। টেস্ট শেষে খালি করে সেভ করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Standard Event Tracking Toggles */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600" />
            <span>৩. ই-কমার্স স্ট্যান্ডার্ড ইভেন্ট ট্র্যাকিং</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* PageView */}
            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200/70 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-all">
              <input
                type="checkbox"
                checked={trackPageView}
                onChange={(e) => setTrackPageView(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 text-emerald-600 rounded border-slate-350 focus:ring-emerald-100 cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-slate-800 block">PageView</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                  সাইটের প্রতিটি পেজ ভিজিট অটোমেটিক ট্র্যাক করবে
                </span>
              </div>
            </label>

            {/* ViewContent */}
            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200/70 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-all">
              <input
                type="checkbox"
                checked={trackViewContent}
                onChange={(e) => setTrackViewContent(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 text-emerald-600 rounded border-slate-350 focus:ring-emerald-100 cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-slate-800 block">ViewContent</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                  প্রোডাক্ট ডিটেইলস পেজ দেখার ডাটা (আইডি, মূল্য) পাঠাবে
                </span>
              </div>
            </label>

            {/* AddToCart */}
            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200/70 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-all">
              <input
                type="checkbox"
                checked={trackAddToCart}
                onChange={(e) => setTrackAddToCart(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 text-emerald-600 rounded border-slate-350 focus:ring-emerald-100 cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-slate-800 block">AddToCart</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                  কার্টে প্রোডাক্ট যুক্ত করার ইভেন্ট ট্র্যাক করবে
                </span>
              </div>
            </label>

            {/* InitiateCheckout */}
            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200/70 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-all">
              <input
                type="checkbox"
                checked={trackInitiateCheckout}
                onChange={(e) => setTrackInitiateCheckout(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 text-emerald-600 rounded border-slate-350 focus:ring-emerald-100 cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-slate-800 block">InitiateCheckout</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                  চেকআউট ফর্ম বা মোডাল খোলার সময় ইভেন্ট ফায়ার করবে
                </span>
              </div>
            </label>

            {/* Purchase */}
            <label className="flex items-start gap-3 p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl cursor-pointer hover:bg-emerald-100/60 transition-all">
              <input
                type="checkbox"
                checked={trackPurchase}
                onChange={(e) => setTrackPurchase(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 text-emerald-600 rounded border-slate-350 focus:ring-emerald-100 cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-emerald-950 block">Purchase (High Priority)</span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                  সফলভাবে অর্ডার সম্পূর্ণ হলে টোটাল কারেন্সি ভ্যালু সহ ট্র্যাক করবে
                </span>
              </div>
            </label>

            {/* Contact */}
            <label className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200/70 rounded-2xl cursor-pointer hover:bg-slate-100/70 transition-all">
              <input
                type="checkbox"
                checked={trackContact}
                onChange={(e) => setTrackContact(e.target.checked)}
                className="w-4.5 h-4.5 mt-0.5 text-emerald-600 rounded border-slate-350 focus:ring-emerald-100 cursor-pointer"
              />
              <div>
                <span className="text-xs font-black text-slate-800 block">Contact</span>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">
                  যোগাযোগ বা হোয়াটসঅ্যাপ মেসেজ ক্লিকের তথ্য ট্র্যাক করবে
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Card 4: Additional Pixels (Agency / Backup Multi-Pixel) */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-800">
                ৪. অতিরিক্ত ফেসবুক পিক্সেল (Multi-Pixel Support)
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                বিজ্ঞাপন এজেন্সি বা ব্যাকআপ এড অ্যাকাউন্টের অতিরিক্ত পিক্সেল যুক্ত করুন
              </p>
            </div>
          </div>

          {/* New Pixel Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="sm:col-span-5 space-y-1">
              <label className="block text-[11px] font-bold text-slate-600">পিক্সেলের নাম / ডেসক্রিপশন</label>
              <input
                type="text"
                value={newPixelName}
                onChange={(e) => setNewPixelName(e.target.value)}
                placeholder="যেমন: Agency Marketing Pixel"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
              />
            </div>

            <div className="sm:col-span-5 space-y-1">
              <label className="block text-[11px] font-bold text-slate-600">পিক্সেল আইডি</label>
              <input
                type="text"
                value={newPixelIdVal}
                onChange={(e) => setNewPixelIdVal(e.target.value)}
                placeholder="987654321098765"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-semibold focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="button"
                onClick={handleAddCustomPixel}
                className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>যুক্ত করুন</span>
              </button>
            </div>
          </div>

          {/* List of Custom Pixels */}
          {customPixels.length > 0 ? (
            <div className="space-y-2">
              {customPixels.map((pixel) => (
                <div
                  key={pixel.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={pixel.enabled}
                      onChange={() => handleToggleCustomPixel(pixel.id)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-slate-800 block">{pixel.name}</span>
                      <span className="font-mono text-slate-500 font-semibold">{pixel.pixelId}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveCustomPixel(pixel.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic text-center py-2">
              কোন অতিরিক্ত পিক্সেল যুক্ত করা হয়নি।
            </p>
          )}
        </div>

        {/* Integration Quick Guide & Meta Links */}
        <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 border border-slate-800">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <span>৫. ট্র্যাকিং টেস্ট নির্দেশিকা</span>
          </h3>

          <ul className="text-xs space-y-2 text-slate-300 list-disc pl-4 font-semibold">
            <li>
              ব্রাউজারে <strong>Meta Pixel Helper</strong> ক্রোম এক্সটেনশন ইনস্টল করে ইভেন্ট ট্র্যাকিং লাইভ চেক করুন।
            </li>
            <li>
              Meta Events Manager-এ প্রবেশ করে <strong>Test Events</strong> ট্যাবে টেস্ট পেজভিউ বা পারচেজ ইভেন্ট মিলছে কিনা দেখুন।
            </li>
            <li>
              উপরে <strong>"CAPI টেস্ট ট্রাই"</strong> বাটন চেপে সার্ভার থেকে টেস্ট মেসেজ পাঠিয়ে চ্যানেল চেক করুন।
            </li>
          </ul>

          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="https://business.facebook.com/events_manager2"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 underline"
            >
              <span>Meta Events Manager খুলুন</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
