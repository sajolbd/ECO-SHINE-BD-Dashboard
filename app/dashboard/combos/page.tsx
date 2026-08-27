"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI, compressImageFile } from "../../../lib/api";
import { useModal } from "../../../context/ModalContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Image as ImageIcon,
  Truck,
  Package,
  Sparkles,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ComboItem {
  productId: string;
  title: string;
  quantity: number;
}

interface Product {
  _id: string;
  id: string;
  title: string;
  category: string;
  categoryId: string;
  price: number;
  costPrice: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  images: string[];
  phone: string;
  whatsapp: string;
  unit: string;
  badge?: string;
  description: string;
  features: string[];
  inStock: boolean;
  stockCount: number;
  status: "active" | "inactive";
  featured: boolean;
  bestSeller: boolean;
  freeDelivery?: boolean;
  freeDeliveryMinQty?: number;
  isCombo?: boolean;
  comboItems?: ComboItem[];
  seoTitle?: string;
  seoDescription?: string;
}

export default function CombosPage() {
  const { showAlert, showConfirm } = useModal();
  const [combos, setCombos] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [search, setSearch] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("cleaning-products");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [badge, setBadge] = useState("কম্বো অফার");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("01958-058359");
  const [whatsapp, setWhatsapp] = useState("8801958058359");
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState("99");
  const [freeDelivery, setFreeDelivery] = useState(true);
  const [freeDeliveryMinQty, setFreeDeliveryMinQty] = useState("1");
  const [comboItems, setComboItems] = useState<ComboItem[]>([]);
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formFeatures, setFormFeatures] = useState<string[]>([]);

  // Direct Upload State
  const [uploadingMain, setUploadingMain] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchAPI("/api/products?limit=200");
      if (res.success && res.products) {
        setAllProducts(res.products);
        // Filter combo products
        const comboList = res.products.filter(
          (p: Product) => p.isCombo || p.badge?.includes("কম্বো") || p.unit?.includes("কম্বো")
        );
        setCombos(comboList);
      }
      const catRes = await fetchAPI("/api/categories");
      if (catRes.success && catRes.categories) {
        setCategories(catRes.categories);
      }
    } catch (err) {
      console.error("Error loading combos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingCombo(null);
    setTitle("");
    setSelectedCategoryId("cleaning-products");
    setPrice("");
    setCostPrice("");
    setOriginalPrice("");
    setBadge("কম্বো অফার");
    setDescription("");
    setPhone("01958-058359");
    setWhatsapp("8801958058359");
    setInStock(true);
    setStockCount("99");
    setFreeDelivery(true);
    setFreeDeliveryMinQty("1");
    setComboItems([]);
    setFormImages([]);
    setFormFeatures(["ফ্রি হোম ডেলিভারি", "১০০% প্রিমিয়াম কোয়ালিটি"]);
    setShowModal(true);
  };

  const openEditModal = (combo: Product) => {
    setEditingCombo(combo);
    setTitle(combo.title);
    setSelectedCategoryId(combo.categoryId);
    setPrice(combo.price.toString());
    setCostPrice(combo.costPrice?.toString() || "");
    setOriginalPrice(combo.originalPrice?.toString() || "");
    setBadge(combo.badge || "কম্বো অফার");
    setDescription(combo.description);
    setPhone(combo.phone);
    setWhatsapp(combo.whatsapp);
    setInStock(combo.inStock);
    setStockCount(combo.stockCount.toString());
    setFreeDelivery(combo.freeDelivery ?? true);
    setFreeDeliveryMinQty(combo.freeDeliveryMinQty?.toString() || "1");
    setComboItems(combo.comboItems || []);
    setFormImages(combo.images || []);
    setFormFeatures(combo.features || []);
    setShowModal(true);
  };

  const handleToggleFreeDelivery = async (combo: Product) => {
    const updatedStatus = !combo.freeDelivery;
    try {
      const res = await fetchAPI(`/api/products/${combo.id}`, {
        method: "PUT",
        body: JSON.stringify({ freeDelivery: updatedStatus }),
      });
      if (res.success) {
        setCombos((prev) =>
          prev.map((c) => (c._id === combo._id ? { ...c, freeDelivery: updatedStatus } : c))
        );
        showAlert({
          title: "আপডেট সফল",
          message: `"${combo.title}" কম্বোর ফ্রি ডেলিভারি ${updatedStatus ? "চালু" : "বন্ধ"} করা হয়েছে।`,
          type: "success",
        });
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "ফ্রি ডেলিভারি আপডেট করা ব্যর্থ হয়েছে।", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "কম্বো ডিলিট করুন",
      message: "আপনি কি নিশ্চিতভাবে এই কম্বো অফারটি ডিলিট করতে চান?",
      type: "danger",
    });
    if (!confirmed) return;
    try {
      const res = await fetchAPI(`/api/products/${id}`, { method: "DELETE" });
      if (res.success) {
        showAlert({ title: "সফল হয়েছে", message: "কম্বো সফলতা সহ ডিলিট করা হয়েছে।", type: "success" });
        loadData();
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "ডিলিট ব্যর্থ হয়েছে।", type: "error" });
    }
  };

  const addComboItem = (productId: string) => {
    const prod = allProducts.find((p) => p.id === productId || p._id === productId);
    if (!prod) return;
    if (comboItems.some((item) => item.productId === prod.id)) return;
    setComboItems((prev) => [...prev, { productId: prod.id, title: prod.title, quantity: 1 }]);
  };

  const removeComboItem = (productId: string) => {
    setComboItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateComboItemQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeComboItem(productId);
      return;
    }
    setComboItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleDirectUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingMain(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const compressedFile = await compressImageFile(file);
        const formData = new FormData();
        formData.append("image", compressedFile);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "https://backend-eco-shine-bd.vercel.app"}/api/media`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` },
            body: formData,
          }
        );
        const data = await res.json();
        if (data.success && data.media?.url) {
          uploadedUrls.push(data.media.url);
        }
      }
      setFormImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploadingMain(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price || formImages.length === 0) {
      showAlert({
        title: "তথ্য অসম্পূর্ণ",
        message: "কম্বোর নাম, মূল্য এবং অন্তত ১টি ছবি প্রদান করুন।",
        type: "warning",
      });
      return;
    }

    setSubmitting(true);
    const categoryObj = categories.find((c) => c.slug === selectedCategoryId);
    const categoryName = categoryObj ? categoryObj.name : "Cleaning products";

    const payload = {
      title,
      category: categoryName,
      categoryId: selectedCategoryId,
      price: Number(price),
      costPrice: costPrice ? Number(costPrice) : 0,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: formImages.filter((img) => img.trim() !== ""),
      phone,
      whatsapp,
      unit: "কম্বো প্যাক",
      badge: badge || "কম্বো অফার",
      description,
      features: formFeatures.filter((f) => f.trim() !== ""),
      inStock,
      stockCount: Number(stockCount),
      status: "active",
      featured: true,
      bestSeller: true,
      freeDelivery,
      freeDeliveryMinQty: Number(freeDeliveryMinQty) || 1,
      isCombo: true,
      comboItems,
    };

    try {
      let res;
      if (editingCombo) {
        res = await fetchAPI(`/api/products/${editingCombo.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetchAPI("/api/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      if (res.success) {
        showAlert({
          title: "সফল হয়েছে",
          message: editingCombo ? "কম্বো প্যাক সফলভাবে আপডেট হয়েছে।" : "নতুন কম্বো প্যাক সফলভাবে যুক্ত হয়েছে।",
          type: "success",
        });
        setShowModal(false);
        loadData();
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "সংরক্ষণ ব্যর্থ হয়েছে।", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCombos = combos.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">কম্বো অফার CRUD</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
            একাধিক প্রোডাক্ট দিয়ে আকর্ষণীয় কম্বো প্যাক তৈরি করুন (ফ্রি ডেলিভারি সহ)
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all shadow-md text-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কম্বো প্যাক তৈরি করুন</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="কম্বোর নাম দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
          মোট কম্বো: {filteredCombos.length}টি
        </span>
      </div>

      {/* Combos Table */}
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
                  <th className="py-4 px-6 w-16">ছবি</th>
                  <th className="py-4 px-4">কম্বোর নাম</th>
                  <th className="py-4 px-4">অন্তর্ভুক্ত পণ্যসমূহ</th>
                  <th className="py-4 px-4 text-center">মূল্য</th>
                  <th className="py-4 px-4 text-center">ডেলিভারি</th>
                  <th className="py-4 px-6 text-center w-24">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold text-slate-600">
                {filteredCombos.length > 0 ? (
                  filteredCombos.map((combo) => (
                    <tr key={combo._id} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                      <td className="py-3 px-6">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200/80 bg-white">
                          <img src={combo.images[0] || "/placeholder-image.png"} alt={combo.title} className="object-cover w-full h-full" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-black text-slate-800 block line-clamp-1">{combo.title}</span>
                        <span className="text-[10px] text-emerald-600 font-extrabold uppercase mt-0.5 block">{combo.badge || "কম্বো প্যাক"}</span>
                      </td>
                      <td className="py-3 px-4">
                        {combo.comboItems && combo.comboItems.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {combo.comboItems.map((item, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                                {item.title} ({item.quantity}টি)
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">কম্বো সেট</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-sm font-black text-emerald-700 block">{combo.price}৳</span>
                        {combo.originalPrice && (
                          <span className="text-[11px] text-slate-400 line-through block">{combo.originalPrice}৳</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleToggleFreeDelivery(combo)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold transition-all cursor-pointer border ${
                            combo.freeDelivery
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200 shadow-2xs"
                              : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{combo.freeDelivery ? "ফ্রি (০৳)" : "সাধারণ"}</span>
                        </button>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(combo)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(combo.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-slate-50 transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      কোনো কম্বো প্যাকেজ পাওয়া যায়নি।
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Combo Builder Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-700 to-emerald-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <h3 className="text-lg font-black">{editingCombo ? "কম্বো অফার এডিট করুন" : "নতুন কম্বো প্যাকেজ তৈরি করুন"}</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-full hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">কম্বো প্যাকেজের নাম <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="যেমন: আল্ট্রা সাইন ৪-ইন-১ ফ্রি ডেলিভারি কম্বো"
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Category & Badge */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">ক্যাটাগরি</label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">ব্যাজ / অফার লেবেল</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="যেমন: কম্বো অফার, ফ্রি ডেলিভারি"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">কম্বো অফার মূল্য (৳) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="890"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-emerald-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-1">পূর্বের মূল্য (৳)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="1100"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                {/* --- COMBO INCLUDED PRODUCTS SELECTOR --- */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-emerald-600" />
                      <span>কম্বোতে অন্তর্ভুক্ত প্রোডাক্টসমূহ নির্বাচন করুন</span>
                    </label>
                    <span className="text-[11px] font-bold text-slate-500">
                      ({comboItems.length}টি যুক্ত করা হয়েছে)
                    </span>
                  </div>

                  {/* Add Product Dropdown */}
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addComboItem(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none bg-white"
                    >
                      <option value="">+ প্রোডাক্ট নির্বাচন করে কম্বোতে যুক্ত করুন...</option>
                      {allProducts
                        .filter((p) => !p.isCombo)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.price}৳)
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Selected Combo Items List */}
                  {comboItems.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {comboItems.map((item) => (
                        <div key={item.productId} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs font-bold">
                          <span className="text-slate-800">{item.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 text-[11px]">পরিমাণ:</span>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateComboItemQty(item.productId, Number(e.target.value))}
                              className="w-12 px-2 py-0.5 border border-slate-300 rounded text-center text-xs font-black"
                            />
                            <button
                              type="button"
                              onClick={() => removeComboItem(item.productId)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Free Delivery Box */}
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={freeDelivery}
                      onChange={(e) => setFreeDelivery(e.target.checked)}
                      className="w-5 h-5 text-emerald-600 rounded cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-emerald-600" />
                        <span>ফ্রি ডেলিভারি অপশন (ডেলিভারি চার্জ ০৳)</span>
                      </span>
                      <p className="text-[11px] text-emerald-700 font-medium">
                        কম্বো প্যাকেজ অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি থাকবে (০৳)।
                      </p>
                    </div>
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">কম্বো বিবরণী <span className="text-red-500">*</span></label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="কম্বো প্যাকেজটি সম্পর্কে বিস্তারিত বিবরণ লিখুন..."
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">কম্বো ছবি (কমপক্ষে ১টি) <span className="text-red-500">*</span></label>
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      <span>{uploadingMain ? "আপলোড হচ্ছে..." : "ছবি সিলেক্ট করুন"}</span>
                      <input type="file" accept="image/*" multiple onChange={(e) => handleDirectUpload(e.target.files)} className="hidden" />
                    </label>
                  </div>

                  {formImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3">
                      {formImages.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                          <img src={img} alt="combo preview" className="object-cover w-full h-full" />
                          <button
                            type="button"
                            onClick={() => setFormImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 p-0.5 rounded-full bg-black/60 text-white hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  {submitting ? "সংরক্ষণ হচ্ছে..." : editingCombo ? "আপডেট করুন" : "কম্বো সংরক্ষণ করুন"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
