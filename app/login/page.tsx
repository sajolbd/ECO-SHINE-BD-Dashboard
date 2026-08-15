"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Mail, Lock, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("ইমেইল এবং পাসওয়ার্ড প্রদান করুন।");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      setError(err.message || "লগইন ব্যর্থ হয়েছে। ক্রেডেনশিয়াল চেক করুন।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden">
        {/* Top brand header */}
        <div className="p-8 text-center bg-slate-50 border-b border-slate-100 space-y-4">
          <div className="flex justify-center">
            <Image
              src="/images/logo.png"
              alt="Eco Shine Bangladesh"
              width={180}
              height={50}
              className="h-10 w-auto object-contain"
              priority
              onError={(e) => {
                // Fallback if image doesn't load
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>অ্যাডমিন প্যানেল (CMS)</span>
          </div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">
            লগইন করুন
          </h1>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              ইমেইল
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ecoshine.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-slate-700">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {submitting ? (
              <>
                <div className="w-4.5 h-4.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span>অপেক্ষা করুন...</span>
              </>
            ) : (
              <span>প্রবেশ করুন</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
