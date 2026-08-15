"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/sidebar";
import { Menu, User, Bell } from "lucide-react";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
          <p className="text-slate-500 font-extrabold text-sm tracking-wide">
            লোডিং তথ্য...
          </p>
        </div>
      </div>
    );
  }

  // Redirect handles unauthenticated users in AuthContext, so we just render null here safely
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans">
      {/* 1. Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* 2. Mobile Drawer Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs">
          <div className="relative animate-slide-in-left">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
          {/* Close overlay */}
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* 3. Main Workspace Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-2xs shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 lg:hidden hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-lg font-black text-slate-800 tracking-tight">Eco Shine Bangladesh</h2>
              <p className="text-xs text-slate-400 font-semibold uppercase">অ্যাডমিন কন্ট্রোল প্যানেল</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Badge */}
            <button className="relative p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full" />
            </button>

            {/* Profile Avatar Card */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center shadow-2xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-bold text-slate-800 leading-tight">{user.name}</p>
                <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">{user.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
