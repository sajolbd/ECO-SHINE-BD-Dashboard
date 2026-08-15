"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import {
  Search,
  Users,
  ShoppingBag,
  TrendingUp,
  XCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  totalOrders: number;
  totalSpending: number;
  lastOrderDate?: string;
}

interface OrderHistoryItem {
  _id: string;
  orderId: string;
  dateString: string;
  status: string;
  total: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Customer history modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        page: page.toString(),
        limit: "10",
      });

      const res = await fetchAPI(`/api/customers?${queryParams}`);
      if (res.success) {
        setCustomers(res.customers);
        setTotalCustomers(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search, page]);

  const handleViewHistory = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setHistoryLoading(true);
    try {
      const res = await fetchAPI(`/api/customers/history/${customer.phone}`);
      if (res.success) {
        setOrderHistory(res.orders);
      }
    } catch (err) {
      console.error("Error loading customer history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "pending":
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-100 text-amber-800">Pending</span>;
      case "delivered":
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-green-100 text-green-800">Delivered</span>;
      case "cancelled":
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-100 text-slate-800">{s}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">গ্রাহক তালিকা</h1>
        <p className="text-sm text-slate-400 font-semibold uppercase">ক্রয় ইতিহাস ও গ্রাহক ডাটাবেস এনালাইটিক্স</p>
      </div>

      {/* Filter Panel */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="গ্রাহকের নাম, মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>
      </div>

      {/* Customers Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50/50 text-slate-400 text-xs font-black">
                  <th className="py-4 px-6">গ্রাহক</th>
                  <th className="py-4 px-4">মোবাইল নম্বর</th>
                  <th className="py-4 px-4 text-center">মোট অর্ডার সংখ্যা</th>
                  <th className="py-4 px-4 text-right">মোট খরচের পরিমাণ</th>
                  <th className="py-4 px-4 text-center">সর্বশেষ অর্ডারের তারিখ</th>
                  <th className="py-4 px-6 text-center w-24">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold text-slate-600">
                {customers.length > 0 ? (
                  customers.map((cust) => (
                    <tr key={cust._id} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                      <td className="py-4 px-6">
                        <span className="text-sm font-black text-slate-800 block">{cust.name}</span>
                        {cust.email && <span className="text-[10px] text-slate-450 block font-medium mt-0.5">{cust.email}</span>}
                      </td>
                      <td className="py-4 px-4 font-mono">{cust.phone}</td>
                      <td className="py-4 px-4 text-center font-black text-slate-700">{cust.totalOrders}</td>
                      <td className="py-4 px-4 text-right font-black text-emerald-600">{cust.totalSpending}৳</td>
                      <td className="py-4 px-4 text-center text-slate-400">
                        {cust.lastOrderDate ? new Date(cust.lastOrderDate).toLocaleDateString("bn-BD") : "অজানা"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleViewHistory(cust)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 hover:border-slate-300 transition-all text-[10px] font-black cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <span>ক্রয় ইতিহাস</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-400">
                      কোনো গ্রাহকের বিবরণী পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-5 border-t border-slate-150 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">
                মোট {totalCustomers} জন গ্রাহকের মধ্যে {(page - 1) * 10 + 1}-{Math.min(page * 10, totalCustomers)} দেখাচ্ছে
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 text-slate-500 text-xs font-bold hover:bg-white"
                >
                  পূর্ববর্তী
                </button>
                <span className="text-xs font-bold text-slate-600 px-3">{page}/{totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 text-slate-500 text-xs font-bold hover:bg-white"
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Customer Purchase History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setSelectedCustomer(null)} />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col justify-between z-10 overflow-hidden mx-4 animate-scale-up">
            {/* Header */}
            <div className="h-16 border-b border-slate-150 px-6 sm:px-8 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-800">অর্ডার হিস্টোরি</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{selectedCustomer.name}</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <XCircle className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Scrolling Body */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[350px] space-y-4">
              {/* Stat Summary Box */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">মোট প্রোডাক্টস অর্ডার</span>
                    <span className="text-sm font-black text-slate-800">{selectedCustomer.totalOrders} টি</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">সর্বমোট স্পেন্ডিং</span>
                    <span className="text-sm font-black text-emerald-600">{selectedCustomer.totalSpending}৳</span>
                  </div>
                </div>
              </div>

              {/* Order List */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">অর্ডার তালিকা</h4>
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-200 border-t-emerald-600 animate-spin" />
                  </div>
                ) : orderHistory.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    {orderHistory.map((order) => (
                      <div key={order._id} className="p-4 flex items-center justify-between text-xs font-bold text-slate-650 hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-black text-slate-800">
                            <Link href={`/dashboard/orders?id=${order.orderId}`} className="hover:underline text-emerald-600">
                              #{order.orderId}
                            </Link>
                          </p>
                          <p className="text-[10px] text-slate-450 mt-0.5">{order.dateString}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(order.status)}
                          <span className="font-black text-slate-800">{order.total}৳</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 font-bold text-center py-6">কোনো অর্ডারের ইতিহাস পাওয়া যায়নি।</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="h-16 border-t border-slate-100 px-6 sm:px-8 flex items-center justify-end bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
