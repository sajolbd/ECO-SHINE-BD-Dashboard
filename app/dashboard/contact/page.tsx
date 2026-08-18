"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useModal } from "../../../context/ModalContext";
import { Save, Phone, Mail, MapPin, Clock } from "lucide-react";

const Facebook = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Instagram = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
);

export default function ContactCMSPage() {
  const { showAlert } = useModal();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/contact");
      if (res.success && res.contact) {
        const c = res.contact;
        setPhone(c.phone);
        setWhatsapp(c.whatsapp);
        setEmail(c.email);
        setAddress(c.address);
        setBusinessHours(c.businessHours);
        setFacebook(c.facebook || "");
        setInstagram(c.instagram || "");
        setYoutube(c.youtube || "");
      }
    } catch (err) {
      console.error("Error loading contact coordinates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      phone,
      whatsapp,
      email,
      address,
      businessHours,
      facebook,
      instagram,
      youtube,
    };

    try {
      const res = await fetchAPI("/api/contact", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (res.success) {
        showAlert({ title: "সফল হয়েছে", message: "যোগাযোগ তথ্য সফলভাবে সেভ করা হয়েছে।", type: "success" });
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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">যোগাযোগ & সোশ্যাল</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">ওয়েবসাইটের ফোন নম্বর, হোয়াটসঅ্যাপ, অফিসের ঠিকানা ও সোশ্যাল মিডিয়া প্রোফাইল লিংক সেটিংস</p>
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
        {/* Coordinates */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">১. যোগাযোগ স্থানাঙ্ক</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-450" />
                  <span>হটলাইন ফোন নম্বর <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01958-058359"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Whatsapp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span>হোয়াটসঅ্যাপ চ্যানেল নম্বর <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="8801958058359"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 font-semibold">* কান্ট্রি কোড সহ (যেমন: 8801700000000)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-450" />
                  <span>কাস্টমার সাপোর্ট ইমেইল <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="support@ecoshine.com"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Hours */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-450" />
                  <span>খোলা থাকার সময়সূচী <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  placeholder="যেমন: শনিবার - বৃহস্পতিবার: সকাল ৯টা - রাত ৮টা"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-450" />
                <span>অফিস / শোরুম ঠিকানা <span className="text-red-500">*</span></span>
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="অফিসের পূর্ণ ঠিকানা লিখুন..."
                rows={3}
                required
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Accounts */}
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">
          <h3 className="text-base font-extrabold text-slate-800 border-b border-slate-100 pb-3">২. সোশ্যাল মিডিয়া লিংক</h3>

          <div className="space-y-4">
            {/* Facebook */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>ফেসবুক পেজ লিংক</span>
              </label>
              <input
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/ecoshinebd"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>

            {/* Instagram */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Instagram className="w-4 h-4 text-pink-600" />
                <span>ইনস্টাগ্রাম প্রোফাইল লিংক</span>
              </label>
              <input
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/ecoshinebd"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>

            {/* Youtube */}
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-700 flex items-center gap-1.5">
                <Youtube className="w-4 h-4 text-red-600" />
                <span>ইউটিউব চ্যানেল লিংক</span>
              </label>
              <input
                type="url"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/c/ecoshinebd"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
