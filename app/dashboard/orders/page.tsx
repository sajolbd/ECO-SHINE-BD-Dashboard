"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchAPI } from "../../../lib/api";
import {
  Search,
  CheckCircle,
  Truck,
  AlertCircle,
  XCircle,
  ShoppingBag,
  ExternalLink,
  MapPin,
  Phone,
  Calendar,
  Layers,
  PhoneCall,
  PhoneOff,
  Clock,
  PlusCircle,
  History,
  AlertTriangle,
  HelpCircle,
  PowerOff,
  User,
  RefreshCw,
} from "lucide-react";

export type CallResult =
  | "confirmed"
  | "cancelled"
  | "no_answer"
  | "busy"
  | "wrong_number"
  | "phone_off"
  | "callback_requested";

interface CallLog {
  _id?: string;
  callerName: string;
  callerEmail?: string;
  callResult: CallResult;
  callTime: string;
  notes?: string;
  followUpDate?: string;
  orderStatusAtCall?: string;
}

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  deliveryArea: "inside" | "outside";
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  note?: string;
  dateString: string;
  callLogs?: CallLog[];
  lastCallStatus?: CallResult | "no_call";
  lastCallAt?: string;
  lastCalledBy?: string;
  nextFollowUpAt?: string;
  createdAt: string;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [callStatus, setCallStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected Order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Call tracking form states
  const [newCallResult, setNewCallResult] = useState<CallResult>("confirmed");
  const [newCallNotes, setNewCallNotes] = useState("");
  const [newFollowUpDate, setNewFollowUpDate] = useState("");
  const [syncOrderStatus, setSyncOrderStatus] = useState(true);
  const [submittingCall, setSubmittingCall] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "calls">("calls");

  // Deep-link tracker (if ?id=ESB-123456 is passed)
  const orderIdQuery = searchParams.get("id");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        status,
        callStatus,
        page: page.toString(),
        limit: "10",
      });

      const res = await fetchAPI(`/api/orders?${queryParams}`);
      if (res.success) {
        setOrders(res.orders);
        setTotalOrders(res.total);
        setTotalPages(res.totalPages);

        // Check if there's a deep-linked order to load
        if (orderIdQuery) {
          const match = res.orders.find((o: Order) => o.orderId === orderIdQuery);
          if (match) {
            setSelectedOrder(match);
          } else {
            // Fetch directly from server if not in current page list
            const directRes = await fetchAPI(`/api/orders/${orderIdQuery}`);
            if (directRes.success) {
              setSelectedOrder(directRes.order);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [search, status, callStatus, page, orderIdQuery]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetchAPI(`/api/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        alert(`অর্ডার স্ট্যাটাস সফলভাবে '${newStatus}' আপডেট করা হয়েছে।`);
        setSelectedOrder(res.order);
        loadOrders();
      }
    } catch (err: any) {
      alert(err.message || "স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleAddCallLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    if (newCallResult === "callback_requested" && !newFollowUpDate) {
      alert("ফলো-আপ কলের তারিখ ও সময় নির্বাচন করুন।");
      return;
    }

    setSubmittingCall(true);
    try {
      const res = await fetchAPI(`/api/orders/${selectedOrder.orderId}/calls`, {
        method: "POST",
        body: JSON.stringify({
          callResult: newCallResult,
          notes: newCallNotes,
          followUpDate: newFollowUpDate || undefined,
          syncOrderStatus,
        }),
      });

      if (res.success) {
        alert("কল ট্র্যাক রিকল সফলভাবে সেভ করা হয়েছে!");
        setSelectedOrder(res.order);
        setNewCallNotes("");
        setNewFollowUpDate("");
        loadOrders();
      }
    } catch (err: any) {
      alert(err.message || "কল রেকর্ড সংরক্ষণ করা সম্ভব হয়নি।");
    } finally {
      setSubmittingCall(false);
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "pending":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800">Pending</span>;
      case "confirmed":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">Confirmed</span>;
      case "processing":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800">Processing</span>;
      case "shipped":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800">Shipped</span>;
      case "delivered":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-green-100 text-green-800">Delivered</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-100 text-red-800">Cancelled</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-800">{s}</span>;
    }
  };

  const getCallStatusBadge = (cs?: string) => {
    switch (cs) {
      case "confirmed":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 flex items-center justify-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" />
            <span>কনফার্মড</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 flex items-center justify-center gap-1 w-fit">
            <XCircle className="w-3 h-3" />
            <span>বাতিল</span>
          </span>
        );
      case "no_answer":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 flex items-center justify-center gap-1 w-fit">
            <PhoneOff className="w-3 h-3" />
            <span>রিসিভ হয়নি</span>
          </span>
        );
      case "busy":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 flex items-center justify-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" />
            <span>ব্যস্ত</span>
          </span>
        );
      case "wrong_number":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 flex items-center justify-center gap-1 w-fit">
            <HelpCircle className="w-3 h-3" />
            <span>ভুল নম্বর</span>
          </span>
        );
      case "phone_off":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-700 flex items-center justify-center gap-1 w-fit">
            <PowerOff className="w-3 h-3" />
            <span>ফোন বন্ধ</span>
          </span>
        );
      case "callback_requested":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 flex items-center justify-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            <span>ফলো-আপ</span>
          </span>
        );
      case "no_call":
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 w-fit">
            কল করা হয়নি
          </span>
        );
    }
  };

  const getCallResultLabel = (res: CallResult) => {
    switch (res) {
      case "confirmed":
        return "অর্ডার নিশ্চিত (Confirmed)";
      case "cancelled":
        return "অর্ডার বাতিল (Cancelled)";
      case "no_answer":
        return "কল রিসিভ হয়নি (No Answer)";
      case "busy":
        return "লাইন ব্যস্ত (Busy)";
      case "wrong_number":
        return "ভুল নম্বর (Wrong Number)";
      case "phone_off":
        return "ফোন বন্ধ / সুইচ অফ (Phone Off)";
      case "callback_requested":
        return "পুনরায় কল দিতে বলেছেন (Callback)";
    }
  };

  const closeDetails = () => {
    setSelectedOrder(null);
    if (orderIdQuery) {
      router.push("/dashboard/orders");
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">অর্ডার ট্র্যাকার ও কল ট্র্যাকিং</h1>
        <p className="text-sm text-slate-400 font-semibold uppercase">ক্যাশ অন ডেলিভারি (COD) ভেরিফিকেশন ও কল হিস্ট্রি সার্ভিস</p>
      </div>

      {/* Filters Panel */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center gap-4 justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="অর্ডার ID, নাম, মোবাইল নম্বর দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Order Status Filter */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none text-slate-600 cursor-pointer"
          >
            <option value="">সকল অর্ডার স্ট্যাটাস</option>
            <option value="pending">Pending (পেন্ডিং)</option>
            <option value="confirmed">Confirmed (নিশ্চিত)</option>
            <option value="processing">Processing (প্রক্রিয়াধীন)</option>
            <option value="shipped">Shipped (পাঠানো হয়েছে)</option>
            <option value="delivered">Delivered (সম্পন্ন)</option>
            <option value="cancelled">Cancelled (বাতিল)</option>
          </select>

          {/* Call Status Filter */}
          <select
            value={callStatus}
            onChange={(e) => setCallStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none text-slate-600 cursor-pointer"
          >
            <option value="">সকল কল স্ট্যাটাস</option>
            <option value="no_call">কল করা হয়নি (No Call)</option>
            <option value="confirmed">কনফার্মড (Confirmed)</option>
            <option value="no_answer">কল রিসিভ হয়নি (No Answer)</option>
            <option value="callback_requested">ফলো-আপ (Callback)</option>
            <option value="phone_off">ফোন বন্ধ (Phone Off)</option>
            <option value="busy">ব্যস্ত (Busy)</option>
            <option value="wrong_number">ভুল নম্বর (Wrong Number)</option>
            <option value="cancelled">বাতিল (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
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
                  <th className="py-4 px-6">অর্ডার ID</th>
                  <th className="py-4 px-4">গ্রাহকের নাম</th>
                  <th className="py-4 px-4">মোবাইল নম্বর</th>
                  <th className="py-4 px-4 text-center">কল স্ট্যাটাস</th>
                  <th className="py-4 px-4 text-center">অর্ডার স্ট্যাটাস</th>
                  <th className="py-4 px-4 text-right">মোট মূল্য</th>
                  <th className="py-4 px-6 text-center w-24">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold text-slate-600">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                      <td className="py-3.5 px-6 font-black text-slate-800">
                        #{order.orderId}
                        {order.nextFollowUpAt && (
                          <div className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>ফলো-আপ শিডিউল</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-slate-800 font-bold">{order.customerName}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{order.dateString}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{order.phone}</td>
                      <td className="py-3.5 px-4 text-center">{getCallStatusBadge(order.lastCallStatus)}</td>
                      <td className="py-3.5 px-4 text-center">{getStatusBadge(order.status)}</td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-800">{order.total}৳</td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-600 hover:bg-slate-50 hover:border-slate-350 transition-all text-[10px] font-black cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <PhoneCall className="w-3 h-3" />
                          <span>কল / বিবরণ</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      কোনো অর্ডারের রেকর্ড পাওয়া যায়নি।
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
                মোট {totalOrders} টি অর্ডারের মধ্যে {(page - 1) * 10 + 1}-{Math.min(page * 10, totalOrders)} দেখাচ্ছে
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 text-slate-500 text-xs font-bold hover:bg-white cursor-pointer"
                >
                  পূর্ববর্তী
                </button>
                <span className="text-xs font-bold text-slate-600 px-3">{page}/{totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 text-slate-500 text-xs font-bold hover:bg-white cursor-pointer"
                >
                  পরবর্তী
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Order Details & Call Tracking Sliding Drawer Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={closeDetails} />

          <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-slide-in-right">
            {/* Header */}
            <div className="h-20 border-b border-slate-150 px-6 sm:px-8 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-800">অর্ডার ডিটেইলস ও কল ট্র্যাকিং</h3>
                  {getCallStatusBadge(selectedOrder.lastCallStatus)}
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID: #{selectedOrder.orderId}</p>
              </div>
              <button
                onClick={closeDetails}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/70 px-6">
              <button
                onClick={() => setActiveTab("calls")}
                className={`py-3 px-4 text-xs font-black border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === "calls"
                    ? "border-emerald-600 text-emerald-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <PhoneCall className="w-4 h-4" />
                <span>কল ট্র্যাকিং ও হিস্ট্রি</span>
                {selectedOrder.callLogs && selectedOrder.callLogs.length > 0 && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] rounded-full font-black">
                    {selectedOrder.callLogs.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`py-3 px-4 text-xs font-black border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
                  activeTab === "details"
                    ? "border-emerald-600 text-emerald-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>অর্ডার ও প্রোডাক্ট বিবরণী</span>
              </button>
            </div>

            {/* Scroll Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              {activeTab === "calls" && (
                <>
                  {/* Call Log Entry Form */}
                  <form onSubmit={handleAddCallLog} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-800 flex items-center gap-2">
                        <PlusCircle className="w-4.5 h-4.5 text-emerald-600" />
                        <span>নতুন কল চেকিং / চেষ্টা রেসপন্স যোগ করুন</span>
                      </h4>
                      <a
                        href={`tel:${selectedOrder.phone}`}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-black flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>কল দিন ({selectedOrder.phone})</span>
                      </a>
                    </div>

                    {/* Outcome Radio Buttons */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-2">কল করার ফলাফল নির্বাচন করুন *</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {(
                          [
                            { id: "confirmed", label: "অর্ডার নিশ্চিত", icon: CheckCircle, color: "emerald" },
                            { id: "no_answer", label: "কল ধরেননি", icon: PhoneOff, color: "amber" },
                            { id: "callback_requested", label: "ফলো-আপ / পরে কল", icon: Clock, color: "blue" },
                            { id: "phone_off", label: "ফোন বন্ধ/সুইচ অফ", icon: PowerOff, color: "slate" },
                            { id: "busy", label: "ব্যস্ত / কেটে দিয়েছেন", icon: AlertTriangle, color: "orange" },
                            { id: "wrong_number", label: "ভুল নম্বর", icon: HelpCircle, color: "purple" },
                            { id: "cancelled", label: "অর্ডার বাতিল", icon: XCircle, color: "rose" },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setNewCallResult(opt.id as CallResult)}
                            className={`p-2.5 rounded-xl border text-[11px] font-black flex items-center gap-2 transition-all cursor-pointer ${
                              newCallResult === opt.id
                                ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100/70"
                            }`}
                          >
                            <opt.icon className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Preset Remark Buttons */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1.5">দ্রুত নোট প্রি-সেট:</label>
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "অর্ডার কনফার্ম করেছেন",
                          "ফোন বন্ধ পাওয়া গেছে",
                          "কল রিসিভ করেননি",
                          "সন্ধ্যার পর কল দিতে বলেছেন",
                          "লোকেশন নিয়ে কনফিউশন",
                          "অর্ডার বাতিল করতে চান",
                        ].map((txt) => (
                          <button
                            key={txt}
                            type="button"
                            onClick={() => setNewCallNotes((prev) => (prev ? `${prev}, ${txt}` : txt))}
                            className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-[10px] font-semibold text-slate-600 cursor-pointer"
                          >
                            + {txt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Text Notes */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">কলের বিস্তারিত বিবরণ / কথা বলার সারসংক্ষেপ</label>
                      <textarea
                        rows={2}
                        value={newCallNotes}
                        onChange={(e) => setNewCallNotes(e.target.value)}
                        placeholder="গ্রাহকের সাথে কি কথা হয়েছে তা সংক্ষেপে লিখুন..."
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    </div>

                    {/* Follow up datepicker (if callback requested) */}
                    {newCallResult === "callback_requested" && (
                      <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl space-y-1">
                        <label className="block text-[11px] font-bold text-blue-900 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-700" />
                          <span>ফলো-আপ কলের তারিখ ও সময় নির্বাচন করুন *</span>
                        </label>
                        <input
                          type="datetime-local"
                          value={newFollowUpDate}
                          onChange={(e) => setNewFollowUpDate(e.target.value)}
                          className="w-full p-2 bg-white border border-blue-300 rounded-lg text-xs font-semibold focus:outline-none"
                          required
                        />
                      </div>
                    )}

                    {/* Auto status sync checkbox */}
                    {(newCallResult === "confirmed" || newCallResult === "cancelled") && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="syncStatus"
                          checked={syncOrderStatus}
                          onChange={(e) => setSyncOrderStatus(e.target.checked)}
                          className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                        />
                        <label htmlFor="syncStatus" className="text-xs font-bold text-slate-700 cursor-pointer">
                          অর্ডারের মূল স্ট্যাটাস স্বয়ংক্রিয়ভাবে &apos;{newCallResult === "confirmed" ? "Confirmed" : "Cancelled"}&apos; এ পরিবর্তন করুন
                        </label>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submittingCall}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                    >
                      {submittingCall ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>সংরক্ষণ করা হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <PhoneCall className="w-4 h-4" />
                          <span>কল রেকর্ড সেভ করুন</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Call History Timeline */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <History className="w-4 h-4 text-slate-400" />
                      <span>পূর্ববর্তী কলের ইতিহাস ও অডিট ট্রেইল</span>
                    </h4>

                    {selectedOrder.callLogs && selectedOrder.callLogs.length > 0 ? (
                      <div className="space-y-3">
                        {selectedOrder.callLogs
                          .slice()
                          .reverse()
                          .map((log, idx) => (
                            <div key={log._id || idx} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {getCallStatusBadge(log.callResult)}
                                  <span className="text-[10px] font-bold text-slate-400">
                                    {new Date(log.callTime).toLocaleString("bn-BD", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </span>
                                </div>
                                <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <User className="w-3 h-3 text-slate-400" />
                                  {log.callerName}
                                </span>
                              </div>

                              {log.notes && <p className="text-xs font-medium text-slate-800 leading-relaxed pl-1">{log.notes}</p>}

                              {log.followUpDate && (
                                <div className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>
                                    পরবর্তী ফলো-আপ:{" "}
                                    {new Date(log.followUpDate).toLocaleString("bn-BD", {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                        <PhoneOff className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-bold text-slate-500">এই অর্ডারে এখনো কোনো কল করা হয়নি।</p>
                        <p className="text-[11px] text-slate-400">উপরের ফর্ম ব্যবহার করে আপনার প্রথম কল প্রচেষ্টা রেকর্ড করুন।</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {activeTab === "details" && (
                <>
                  {/* Order Status Select Panel */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3">
                    <h4 className="text-xs font-black text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>অর্ডার প্রসেস স্ট্যাটাস আপডেট করুন</span>
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"] as const).map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={statusUpdating}
                          onClick={() => handleUpdateStatus(selectedOrder.orderId, s)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all cursor-pointer ${
                            selectedOrder.status === s
                              ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {s.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Coordinates */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">ডেলিভারি ঠিকানা ও গ্রাহক বিবরণী</h4>
                    <div className="bg-white border border-slate-200 rounded-2xl p-4.5 space-y-3.5 text-xs font-semibold text-slate-650 shadow-2xs">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">গ্রাহকের নাম</p>
                          <p className="text-slate-800 font-black mt-0.5">{selectedOrder.customerName}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">মোবাইল নম্বর</p>
                          <p className="text-slate-800 font-black mt-0.5 font-mono">{selectedOrder.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <MapPin className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">ডেলিভারি ঠিকানা</p>
                          <p className="text-slate-800 font-bold mt-0.5 leading-relaxed">{selectedOrder.address}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Calendar className="w-4.5 h-4.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold">অর্ডারের তারিখ</p>
                          <p className="text-slate-800 font-bold mt-0.5">{selectedOrder.dateString}</p>
                        </div>
                      </div>

                      {selectedOrder.note && (
                        <div className="flex items-start gap-3 p-3.5 bg-yellow-50 border border-yellow-100 rounded-xl">
                          <AlertCircle className="w-4.5 h-4.5 text-yellow-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] text-yellow-800 font-bold">অর্ডার নোট / বিশেষ বার্তা</p>
                            <p className="text-yellow-900 font-medium mt-0.5 leading-relaxed">{selectedOrder.note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cart Items Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">ক্রয়কৃত প্রোডাক্ট সমূহের তালিকা</h4>
                    <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-2xs divide-y divide-slate-100">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 shrink-0">
                              <img src={item.image} alt={item.title} className="object-cover w-full h-full" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-800 line-clamp-1">{item.title}</p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {item.price}৳ × {item.quantity} পিস
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-black text-slate-800 shrink-0">{item.price * item.quantity}৳</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Billing Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">বিলিং বিবরণী</h4>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2.5 text-xs font-bold text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>প্রোডাক্ট সাবটোটাল:</span>
                        <span>{selectedOrder.subtotal}৳</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>ডেলিভারি চার্জ ({selectedOrder.deliveryArea === "inside" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}):</span>
                        <span>{selectedOrder.deliveryFee}৳</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-sm text-slate-800 font-black">
                        <span>সর্বমোট বিল (৳):</span>
                        <span>{selectedOrder.total}৳</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="h-20 border-t border-slate-150 px-6 sm:px-8 flex items-center justify-end bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={closeDetails}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs cursor-pointer"
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

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
