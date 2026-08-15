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
} from "lucide-react";

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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected Order details modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Deep-link tracker (if ?id=ESB-123456 is passed)
  const orderIdQuery = searchParams.get("id");

  const loadOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        status,
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
  }, [search, status, page, orderIdQuery]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setStatusUpdating(true);
    try {
      const res = await fetchAPI(`/api/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        alert(`অর্ডার স্ট্যাটাস সফলভাবে '${newStatus}' আপডেট করা হয়েছে।`);
        // Refresh details
        setSelectedOrder(res.order);
        loadOrders();
      }
    } catch (err: any) {
      alert(err.message || "স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।");
    } finally {
      setStatusUpdating(false);
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

  const closeDetails = () => {
    setSelectedOrder(null);
    if (orderIdQuery) {
      // Clear URL query param
      router.push("/dashboard/orders");
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">অর্ডার ট্র্যাকার</h1>
        <p className="text-sm text-slate-400 font-semibold uppercase">ক্যাশ অন ডেলিভারি (COD) প্রক্রিয়াকরণ ও বিলিং রিপোর্ট</p>
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

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none text-slate-600"
        >
          <option value="">সকল স্ট্যাটাস</option>
          <option value="pending">Pending (পেন্ডিং)</option>
          <option value="confirmed">Confirmed (নিশ্চিত)</option>
          <option value="processing">Processing (প্রক্রিয়াধীন)</option>
          <option value="shipped">Shipped (পাঠানো হয়েছে)</option>
          <option value="delivered">Delivered (সম্পন্ন)</option>
          <option value="cancelled">Cancelled (বাতিল)</option>
        </select>
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
                  <th className="py-4 px-4">তারিখ (Bengali)</th>
                  <th className="py-4 px-4">মোবাইল নম্বর</th>
                  <th className="py-4 px-4">ডেলিভারি এরিয়া</th>
                  <th className="py-4 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-4 px-4 text-right">মোট মূল্য</th>
                  <th className="py-4 px-6 text-center w-24">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold text-slate-600">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                      <td className="py-3.5 px-6 font-black text-slate-800">#{order.orderId}</td>
                      <td className="py-3.5 px-4">{order.customerName}</td>
                      <td className="py-3.5 px-4 text-slate-500 font-semibold">{order.dateString}</td>
                      <td className="py-3.5 px-4 font-mono">{order.phone}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                          order.deliveryArea === "inside"
                            ? "bg-slate-100 text-slate-700"
                            : "bg-emerald-50 text-emerald-800"
                        }`}>
                          {order.deliveryArea === "inside" ? "ঢাকার ভেতরে" : "ঢাকার বাইরে"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">{getStatusBadge(order.status)}</td>
                      <td className="py-3.5 px-4 text-right font-black text-slate-800">{order.total}৳</td>
                      <td className="py-3.5 px-6 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 hover:border-slate-350 transition-all text-[10px] font-black cursor-pointer flex items-center justify-center gap-1 mx-auto"
                        >
                          <span>বিস্তারিত</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-slate-400">
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

      {/* Order Details Sliding Drawer Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={closeDetails} />

          <div className="relative w-full max-w-xl h-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-slide-in-right">
            {/* Header */}
            <div className="h-20 border-b border-slate-150 px-6 sm:px-8 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="text-base font-black text-slate-800">অর্ডার ডিটেইলস</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">ID: #{selectedOrder.orderId}</p>
              </div>
              <button
                onClick={closeDetails}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Scroll Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
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
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}
