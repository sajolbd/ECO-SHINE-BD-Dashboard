"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { Save, AlertTriangle, Settings, HelpCircle } from "lucide-react";

export default function SettingsCMSPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings fields
  const [websiteName, setWebsiteName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [currency, setCurrency] = useState("");
  const [deliveryChargeInside, setDeliveryChargeInside] = useState("");
  const [deliveryChargeOutside, setDeliveryChargeOutside] = useState("");
  const [codEnabled, setCodEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/settings");
      if (res.success && res.settings) {
        const s = res.settings;
        setWebsiteName(s.websiteName);
        setPhone(s.phone);
        setEmail(s.email);
        setWhatsapp(s.whatsapp);
        setCurrency(s.currency);
        setDeliveryChargeInside(s.deliveryChargeInside.toString());
        setDeliveryChargeOutside(s.deliveryChargeOutside.toString());
        setCodEnabled(s.codEnabled);
        setMaintenanceMode(s.maintenanceMode);
      }
    } catch (err) {
      console.error("Error loading global settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "super-admin") {
      loadData();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      websiteName,
      phone,
      email,
      whatsapp,
      currency,
      deliveryChargeInside: Number(deliveryChargeInside),
      deliveryChargeOutside: Number(deliveryChargeOutside),
      codEnabled,
      maintenanceMode,
    };

    try {
      const res = await fetchAPI("/api/settings", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        alert("গ্লোবাল সাইট সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে।");
        loadData();
      }
    } catch (err: any) {
      alert(err.message || "সংরক্ষণ ব্যর্থ হয়েছে।");
    } finally {
      setSaving(false);
    }
  };

  // Restrict to super admin
  if (user?.role !== "super-admin") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl space-y-2 max-w-lg">
        <h3 className="text-base font-black flex items-center gap-1.5">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>প্রবেশাধিকার নিষিদ্ধ</span>
        </h3>
        <p className="text-xs font-semibold">দুঃখিত, এই সেটিংস পাতাটি পরিবর্তন করার এক্সেস শুধুমাত্র সুপার এডমিনদের রয়েছে।</p>
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
    <div className="space-y-8 max-w-3xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">গ্লোবাল সেটিংস</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">ওয়েবসাইটের ডেলিভারি চার্জ, মুদ্রা ও মূল কনফিগারেশন সেটিংস</p>
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
        {/* Core Config */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-1.5">
            <Settings className="w-4.5 h-4.5 text-slate-400" />
            <span>১. সাধারণ সাইট কনফিগারেশন</span>
          </h3>

          <div className="space-y-4">
            {/* Website name & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">ওয়েবসাইটের নাম <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  placeholder="Eco Shine Bangladesh"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">কারেন্সি সাইন / মুদ্রা প্রতীক</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="৳"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Hotlines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">ফোন নম্বর</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">হোয়াটসঅ্যাপ নম্বর (লিংক এপিআই এর জন্য)</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">অফিসিয়াল ইমেইল</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Pricing Config */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">২. শিপিং ও ডেলিভারি চার্জ</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">ঢাকার ভেতরে ডেলিভারি চার্জ (৳) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={deliveryChargeInside}
                onChange={(e) => setDeliveryChargeInside(e.target.value)}
                placeholder="70"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700">ঢাকার বাইরে ডেলিভারি চার্জ (৳) <span className="text-red-500">*</span></label>
              <input
                type="number"
                value={deliveryChargeOutside}
                onChange={(e) => setDeliveryChargeOutside(e.target.value)}
                placeholder="130"
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Gateways & Modes */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">৩. গেটওয়ে ও রক্ষণাবেক্ষণ সেটিংস</h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pt-2">
            {/* COD Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={codEnabled}
                onChange={(e) => setCodEnabled(e.target.checked)}
                className="w-4.5 h-4.5 text-emerald-600 rounded-md border-slate-350 focus:ring-emerald-100"
              />
              <div>
                <span className="text-xs font-black text-slate-700 block">ক্যাশ অন ডেলিভারি (COD) সক্রিয় রাখুন</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">গ্রাহক চেকআউট পেজে ক্যাশ অন ডেলিভারি দেখতে পাবে</span>
              </div>
            </label>

            {/* Maintenance Checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                className="w-4.5 h-4.5 text-emerald-600 rounded-md border-slate-350 focus:ring-emerald-100"
              />
              <div>
                <span className="text-xs font-black text-red-600 block">রক্ষণাবেক্ষণ মোড (Maintenance Mode)</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">সক্রিয় করলে মেইন ওয়েবসাইট প্রদর্শন সাময়িক বন্ধ হবে</span>
              </div>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
