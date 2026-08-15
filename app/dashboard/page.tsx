"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../lib/api";
import {
  ShoppingBag,
  Tags,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  grossProfit: number;
}

interface RecentOrder {
  _id: string;
  orderId: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface RecentProduct {
  _id: string;
  id: string;
  title: string;
  category: string;
  price: number;
  status: string;
}

interface ChartItem {
  _id: string;
  orders: number;
  sales: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const loadStats = async () => {
      try {
        const res = await fetchAPI("/api/dashboard/stats");
        if (res.success) {
          setStats(res.stats);
          setRecentOrders(res.recentOrders);
          setRecentProducts(res.recentProducts);
          setChartData(res.chartData);
        }
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { title: "মোট প্রোডাক্ট", value: stats?.totalProducts || 0, icon: ShoppingBag, color: "bg-blue-500", text: "text-blue-500", href: "/dashboard/products" },
    { title: "মোট ক্যাটাগরি", value: stats?.totalCategories || 0, icon: Tags, color: "bg-purple-500", text: "text-purple-500", href: "/dashboard/categories" },
    { title: "মোট কাস্টমার", value: stats?.totalCustomers || 0, icon: Users, color: "bg-indigo-500", text: "text-indigo-500", href: "/dashboard/customers" },
    { title: "মোট অর্ডার", value: stats?.totalOrders || 0, icon: ShoppingCart, color: "bg-emerald-500", text: "text-emerald-500", href: "/dashboard/orders" },
    { title: "পেন্ডিং অর্ডার", value: stats?.pendingOrders || 0, icon: Clock, color: "bg-amber-500", text: "text-amber-500", href: "/dashboard/orders?status=pending" },
    { title: "মোট ডেলিভারি", value: stats?.completedOrders || 0, icon: CheckCircle, color: "bg-green-500", text: "text-green-500", href: "/dashboard/orders?status=delivered" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Pending</span>;
      case "confirmed":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Confirmed</span>;
      case "processing":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Processing</span>;
      case "shipped":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">Shipped</span>;
      case "delivered":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">Delivered</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">ড্যাশবোর্ড ওভারভিউ</h1>
        <p className="text-sm text-slate-400 font-semibold uppercase">ওয়েবসাইটের তাৎক্ষণিক পরিসংখ্যান ও বিক্রয় রিপোর্ট</p>
      </div>

      {/* Revenue Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 md:p-8 text-white shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="space-y-2">
          <p className="text-emerald-100 text-xs sm:text-sm font-extrabold uppercase tracking-wider">মোট বিক্রয় (ডেলিভারি ফিসহ)</p>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {stats?.totalRevenue.toLocaleString("bn-BD")}৳
          </h2>
          <p className="text-emerald-100/85 text-[10px] font-medium">* ক্যানসেল করা অর্ডার ব্যতীত মোট আয়</p>
        </div>

        <div className="space-y-2 md:border-l md:border-white/20 md:pl-6">
          <p className="text-emerald-100 text-xs sm:text-sm font-extrabold uppercase tracking-wider">গ্রস প্রফিট (ডেলিভারি ফি বাদে)</p>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
            {stats?.grossProfit !== undefined ? stats.grossProfit.toLocaleString("bn-BD") : "0"}৳
          </h2>
          <p className="text-emerald-100/85 text-[10px] font-medium">* মোট বিক্রয়মূল্য - ক্রয়মূল্য</p>
        </div>

        <div className="p-4 bg-white/10 rounded-2xl md:ml-auto shrink-0 backdrop-blur-md border border-white/10 flex items-center gap-3 w-fit">
          <TrendingUp className="w-8 h-8 text-emerald-200 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-emerald-100">লাইভ ট্র্যাকিং</p>
            <p className="text-sm font-black">অর্ডার প্রসেসিং একটিভ</p>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              href={card.href}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-300 group"
            >
              <div className={`p-2.5 rounded-xl w-10 h-10 ${card.color} text-white flex items-center justify-center shadow-xs shrink-0 mb-4 group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold block">{card.title}</p>
                <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{card.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recharts Chart Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xs">
        <h3 className="text-base font-extrabold text-slate-800 mb-6">গত ৭ দিনের বিক্রয় ও অর্ডার গ্রাফ</h3>
        <div className="h-72 w-full">
          {mounted && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0f172a",
                    border: "none",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                  itemStyle={{ color: "#34d399" }}
                  labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
                />
                <Area type="monotone" dataKey="sales" name="বিক্রয় (৳)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm font-semibold">
              গ্রাফ ডেটা লোড হচ্ছে অথবা গত ৭ দিনে কোনো নতুন অর্ডার আসেনি।
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Orders Table (7 Columns) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800">সাম্প্রতিক অর্ডারসমূহ</h3>
            <Link href="/dashboard/orders" className="text-xs font-bold text-emerald-600 hover:underline">
              সব অর্ডার দেখুন
            </Link>
          </div>
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                  <th className="py-2.5">অর্ডার ID</th>
                  <th className="py-2.5">গ্রাহক</th>
                  <th className="py-2.5">স্টেটাস</th>
                  <th className="py-2.5 text-right">মোট মূল্য</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-600">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-bold text-slate-800">
                        <Link href={`/dashboard/orders?id=${order.orderId}`} className="hover:underline">
                          {order.orderId}
                        </Link>
                      </td>
                      <td className="py-3 truncate max-w-[120px]">{order.customerName}</td>
                      <td className="py-3">{getStatusBadge(order.status)}</td>
                      <td className="py-3 text-right font-black text-slate-800">{order.total}৳</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400">
                      কোনো অর্ডার পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Products Table (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800">নতুন প্রোডাক্টস</h3>
            <Link href="/dashboard/products" className="text-xs font-bold text-emerald-600 hover:underline">
              সব প্রোডাক্ট দেখুন
            </Link>
          </div>
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold">
                  <th className="py-2.5">প্রোডাক্ট</th>
                  <th className="py-2.5">ক্যাটাগরি</th>
                  <th className="py-2.5 text-right">মূল্য</th>
                </tr>
              </thead>
              <tbody className="text-xs font-semibold text-slate-600">
                {recentProducts.length > 0 ? (
                  recentProducts.map((prod) => (
                    <tr key={prod._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 truncate max-w-[150px] font-bold text-slate-800">
                        <Link href={`/dashboard/products?search=${prod.title}`} className="hover:underline">
                          {prod.title}
                        </Link>
                      </td>
                      <td className="py-3">{prod.category}</td>
                      <td className="py-3 text-right font-black text-slate-800">{prod.price}৳</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      কোনো প্রোডাক্ট নেই।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
