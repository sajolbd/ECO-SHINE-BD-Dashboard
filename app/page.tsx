"use client";

import { useAuth } from "../context/AuthContext";
import LoginPage from "./login/page";
import DashboardPage from "./dashboard/page";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        <p className="text-slate-500 font-bold text-xs mt-3">অপেক্ষা করুন...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <DashboardPage />;
}
