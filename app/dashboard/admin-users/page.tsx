"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { useModal } from "../../../context/ModalContext";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "super-admin" | "admin" | "editor";
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const { showAlert, showConfirm } = useModal();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"super-admin" | "admin" | "editor">("editor");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/admin-users");
      if (res.success) {
        setUsers(res.users);
      }
    } catch (error) {
      console.error("Error loading admin users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "super-admin") {
      loadUsers();
    }
  }, [currentUser]);

  const openAddModal = () => {
    setEditingUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("editor");
    setShowModal(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(""); // leave blank unless changing
    setRole(user.role);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (currentUser?.id === id) {
      showAlert({ title: "সতর্কতা", message: "আপনি নিজের অ্যাকাউন্ট ডিলিট করতে পারবেন না।", type: "warning" });
      return;
    }

    const confirmed = await showConfirm({
      title: "ইউজার ডিলিট",
      message: "আপনি কি নিশ্চিতভাবে এই অ্যাডমিন ইউজারটি ডিলিট করতে চান?",
      confirmText: "হ্যাঁ, ডিলিট করুন",
      cancelText: "বাতিল",
      type: "danger",
    });
    if (!confirmed) return;

    try {
      const res = await fetchAPI(`/api/admin-users/${id}`, { method: "DELETE" });
      if (res.success) {
        showAlert({ title: "সফল হয়েছে", message: "অ্যাডমিন ইউজার সফলভাবে ডিলিট করা হয়েছে।", type: "success" });
        loadUsers();
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "ডিলিট ব্যর্থ হয়েছে।", type: "error" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showAlert({ title: "তথ্য প্রয়োজন", message: "নাম এবং ইমেইল প্রদান করা আবশ্যক।", type: "warning" });
      return;
    }

    if (!editingUser && !password) {
      showAlert({ title: "তথ্য প্রয়োজন", message: "নতুন ইউজারের জন্য পাসওয়ার্ড প্রদান করা আবশ্যক।", type: "warning" });
      return;
    }

    setSubmitting(true);

    const payload: any = {
      name,
      email: email.toLowerCase().trim(),
      role,
    };

    if (password) {
      payload.password = password;
    }

    try {
      let res;
      if (editingUser) {
        res = await fetchAPI(`/api/admin-users/${editingUser._id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetchAPI("/api/admin-users", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        showAlert({ title: "সফল হয়েছে", message: editingUser ? "অ্যাডমিন অ্যাকাউন্ট সফলভাবে আপডেট হয়েছে।" : "নতুন অ্যাডমিন সফলভাবে যুক্ত হয়েছে।", type: "success" });
        setShowModal(false);
        loadUsers();
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "সংরক্ষণ ব্যর্থ হয়েছে।", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  // Restrict to super admin
  if (currentUser?.role !== "super-admin") {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-3xl space-y-2 max-w-lg">
        <h3 className="text-base font-black flex items-center gap-1.5">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>প্রবেশাধিকার নিষিদ্ধ</span>
        </h3>
        <p className="text-xs font-semibold">দুঃখিত, এই অ্যাডমিন অ্যাকাউন্ট সেটিংস পাতাটি দেখার অধিকার শুধুমাত্র সুপার এডমিনদের রয়েছে।</p>
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
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">অ্যাডমিন ইউজারস</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">ড্যাশবোর্ড ব্যবহারের অনুমতি ও পদবী নির্ধারণ সেটিংস</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all shadow-md text-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন অ্যাডমিন যোগ করুন</span>
        </button>
      </div>

      {/* Users table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto min-w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-400 text-xs font-black">
                <th className="py-4 px-6">নাম</th>
                <th className="py-4 px-4">ইমেইল</th>
                <th className="py-4 px-4 text-center">পদবী (Role)</th>
                <th className="py-4 px-4 text-center">যোগদানের তারিখ</th>
                <th className="py-4 px-6 text-center w-24">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="text-xs font-bold text-slate-650">
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                  <td className="py-3.5 px-6 font-black text-slate-800">{u.name}</td>
                  <td className="py-3.5 px-4 font-semibold">{u.email}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      u.role === "super-admin"
                        ? "bg-red-100 text-red-800"
                        : u.role === "admin"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString("bn-BD")}
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={currentUser?.id === u._id}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col justify-between z-10 overflow-hidden mx-4 animate-scale-up">
            {/* Modal Header */}
            <div className="h-16 border-b border-slate-150 px-6 sm:px-8 flex items-center justify-between bg-slate-50 shrink-0">
              <h3 className="text-sm sm:text-base font-black text-slate-800">
                {editingUser ? "অ্যাডমিন ইউজার এডিট করুন" : "নতুন অ্যাডমিন ইউজার যোগ করুন"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 flex-1">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">নাম <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: সজল আহমেদ"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">ইমেইল <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="যেমন: sajol@ecoshine.com"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">
                  পাসওয়ার্ড {editingUser ? "(পরিবর্তন করতে চাইলে লিখুন)" : <span className="text-red-500">*</span>}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required={!editingUser}
                  className="w-full px-4 py-2.5 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-slate-700">পদবী (Role Permissions) <span className="text-red-500">*</span></label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                >
                  <option value="editor">Editor (শুধুমাত্র অর্ডার ও প্রোডাক্ট মডিফাই)</option>
                  <option value="admin">Admin (সেটিংস ব্যতীত সকল CMS ম্যানেজ)</option>
                  <option value="super-admin">Super Admin (সম্পূর্ণ এক্সেস ও ইউজার্স কন্ট্রোল)</option>
                </select>
              </div>

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold text-xs cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-450 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5"
                >
                  {submitting ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
