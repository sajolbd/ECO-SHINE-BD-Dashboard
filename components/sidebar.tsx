"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Tags,
  ShoppingCart,
  Users,
  Home as HomeIcon,
  Images,
  BookOpen,
  PhoneCall,
  Globe,
  FolderOpen,
  Settings,
  UserCheck,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { name: "ওভারভিউ ড্যাশবোর্ড", href: "/dashboard", icon: LayoutDashboard, roles: ["super-admin", "admin", "editor"] },
    { name: "প্রোডাক্টস CRUD", href: "/dashboard/products", icon: ShoppingBag, roles: ["super-admin", "admin", "editor"] },
    { name: "ক্যাটাগরি CRUD", href: "/dashboard/categories", icon: Tags, roles: ["super-admin", "admin", "editor"] },
    { name: "অর্ডার ট্র্যাকার", href: "/dashboard/orders", icon: ShoppingCart, roles: ["super-admin", "admin", "editor"] },
    { name: "গ্রাহক তালিকা", href: "/dashboard/customers", icon: Users, roles: ["super-admin", "admin", "editor"] },
    { name: "হোমপেজ CMS", href: "/dashboard/homepage", icon: HomeIcon, roles: ["super-admin", "admin"] },
    { name: "ব্যানার স্লাইডার", href: "/dashboard/banners", icon: Images, roles: ["super-admin", "admin"] },
    { name: "আমাদের সম্পর্কে", href: "/dashboard/about", icon: BookOpen, roles: ["super-admin", "admin"] },
    { name: "যোগাযোগ & সোশ্যাল", href: "/dashboard/contact", icon: PhoneCall, roles: ["super-admin", "admin"] },
    { name: "SEO কনফিগ", href: "/dashboard/seo", icon: Globe, roles: ["super-admin", "admin"] },
    { name: "মিডিয়া লাইব্রেরি", href: "/dashboard/media", icon: FolderOpen, roles: ["super-admin", "admin", "editor"] },
    { name: "গ্লোবাল সেটিংস", href: "/dashboard/settings", icon: Settings, roles: ["super-admin"] },
    { name: "অ্যাডমিন ইউজারস", href: "/dashboard/admin-users", icon: UserCheck, roles: ["super-admin"] },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const filteredMenuItems = menuItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 w-64 shrink-0 shadow-xl border-r border-slate-800">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-20 px-6 bg-slate-950 border-b border-slate-800 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-emerald-500 font-black text-xl tracking-wider">ECO SHINE</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">CMS</span>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white lg:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {filteredMenuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/10"
                  : "hover:bg-slate-800 hover:text-slate-100"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${isActive ? "text-white" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile & Logout */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3 shrink-0">
        {user && (
          <div className="px-2">
            <p className="text-sm font-black text-slate-100 truncate">{user.name}</p>
            <p className="text-[10px] font-bold text-slate-500 truncate uppercase mt-0.5">
              {user.role === "super-admin" ? "Super Admin" : user.role === "admin" ? "Admin" : "Editor"}
            </p>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2.5 w-full py-2.5 bg-slate-800 hover:bg-red-950/40 hover:text-red-300 rounded-xl text-xs font-bold text-slate-400 transition-all cursor-pointer border border-slate-700/50"
        >
          <LogOut className="w-4 h-4" />
          <span>লগআউট করুন</span>
        </button>
      </div>
    </div>
  );
}
