"use client";

import React, { useEffect, useState } from "react";
import { fetchAPI } from "../../../lib/api";
import { useModal } from "../../../context/ModalContext";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  PlusCircle,
  MinusCircle,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  Share2,
  Copy,
  ExternalLink,
  ShoppingBag,
  Check,
  Globe,
  RefreshCw,
} from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface ProductFeatureStep {
  step: number;
  title: string;
  desc: string;
}

interface ProductSpecItem {
  key: string;
  value: string;
}

interface ProductFaqItem {
  question: string;
  answer: string;
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
  howToUse: ProductFeatureStep[];
  specifications: ProductSpecItem[];
  faqs: ProductFaqItem[];
  inStock: boolean;
  stockCount: number;
  status: "active" | "inactive";
  featured: boolean;
  bestSeller: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export default function ProductsPage() {
  const { showAlert, showConfirm } = useModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter/Search states
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form Modal States
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "images" | "details" | "seo">("general");

  // Share Link Modal State
  const [shareProduct, setShareProduct] = useState<Product | null>(null);
  const [copiedType, setCopiedType] = useState<"standard" | "order" | null>(null);
  const [domainType, setDomainType] = useState<"vercel" | "custom">("vercel");

  // Direct Upload States
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Dynamic lists in forms
  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [formSpecs, setFormSpecs] = useState<ProductSpecItem[]>([]);
  const [formSteps, setFormSteps] = useState<ProductFeatureStep[]>([]);
  const [formFaqs, setFormFaqs] = useState<ProductFaqItem[]>([]);
  const [formImages, setFormImages] = useState<string[]>([]);

  // Form Fields
  const [title, setTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("cleaning-products");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("01958-058359");
  const [whatsapp, setWhatsapp] = useState("8801958058359");
  const [inStock, setInStock] = useState(true);
  const [stockCount, setStockCount] = useState("99");
  const [prodStatus, setProdStatus] = useState<"active" | "inactive">("active");
  const [featured, setFeatured] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  const loadProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        categoryId,
        status,
        page: page.toString(),
        limit: "10",
      });

      const res = await fetchAPI(`/api/products?${queryParams}`);
      if (res.success) {
        setProducts(res.products);
        setTotalProducts(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await fetchAPI("/api/categories");
      if (res.success) {
        setCategories(res.categories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, categoryId, status, page]);

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setTitle("");
    setSelectedCategoryId("cleaning-products");
    setPrice("");
    setCostPrice("");
    setOriginalPrice("");
    setUnit("");
    setBadge("");
    setDescription("");
    setPhone("01958-058359");
    setWhatsapp("8801958058359");
    setInStock(true);
    setStockCount("99");
    setProdStatus("active");
    setFeatured(false);
    setBestSeller(false);
    setSeoTitle("");
    setSeoDescription("");
    setFormFeatures([]);
    setFormSpecs([]);
    setFormSteps([]);
    setFormFaqs([]);
    setFormImages([]);
    setActiveTab("general");
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
    setSelectedCategoryId(product.categoryId);
    setPrice(product.price.toString());
    setCostPrice(product.costPrice?.toString() || "");
    setOriginalPrice(product.originalPrice?.toString() || "");
    setUnit(product.unit);
    setBadge(product.badge || "");
    setDescription(product.description);
    setPhone(product.phone);
    setWhatsapp(product.whatsapp);
    setInStock(product.inStock);
    setStockCount(product.stockCount.toString());
    setProdStatus(product.status);
    setFeatured(product.featured);
    setBestSeller(product.bestSeller);
    setSeoTitle(product.seoTitle || "");
    setSeoDescription(product.seoDescription || "");
    setFormFeatures(product.features || []);
    setFormSpecs(product.specifications || []);
    setFormSteps(product.howToUse || []);
    setFormFaqs(product.faqs || []);
    setFormImages(product.images || []);
    setActiveTab("general");
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm({
      title: "প্রোডাক্ট ডিলিট করুন",
      message: "আপনি কি নিশ্চিতভাবে এই প্রোডাক্টটি ডিলিট করতে চান?",
      type: "danger",
      confirmText: "হ্যাঁ, ডিলিট করুন",
      cancelText: "বাতিল",
    });
    if (!confirmed) return;
    try {
      const res = await fetchAPI(`/api/products/${id}`, { method: "DELETE" });
      if (res.success) {
        showAlert({ title: "সফল হয়েছে", message: "প্রোডাক্ট সফলভাবে ডিলিট করা হয়েছে।", type: "success" });
        loadProducts();
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "ডিলিট ব্যর্থ হয়েছে।", type: "error" });
    }
  };

  const handleDirectUpload = async (files: FileList | null, target: "main" | "gallery") => {
    if (!files || files.length === 0) return;
    if (target === "main") setUploadingMain(true);
    else setUploadingGallery(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/media`,
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
      if (target === "main") {
        setFormImages((prev) => [uploadedUrls[0] || prev[0] || "", ...prev.slice(1)]);
      } else {
        setFormImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      if (target === "main") setUploadingMain(false);
      else setUploadingGallery(false);
    }
  };

  // Form dynamics helpers
  const addFeature = () => setFormFeatures((prev) => [...prev, ""]);
  const updateFeature = (index: number, val: string) => {
    const updated = [...formFeatures];
    updated[index] = val;
    setFormFeatures(updated);
  };
  const removeFeature = (index: number) => setFormFeatures((prev) => prev.filter((_, i) => i !== index));

  const addSpec = () => setFormSpecs((prev) => [...prev, { key: "", value: "" }]);
  const updateSpec = (index: number, field: "key" | "value", val: string) => {
    const updated = [...formSpecs];
    updated[index][field] = val;
    setFormSpecs(updated);
  };
  const removeSpec = (index: number) => setFormSpecs((prev) => prev.filter((_, i) => i !== index));

  const addStep = () => setFormSteps((prev) => [...prev, { step: prev.length + 1, title: "", desc: "" }]);
  const updateStep = (index: number, field: "title" | "desc", val: string) => {
    const updated = [...formSteps];
    if (field === "title") updated[index].title = val;
    else updated[index].desc = val;
    setFormSteps(updated);
  };
  const removeStep = (index: number) =>
    setFormSteps((prev) => prev.filter((_, i) => i !== index).map((s, idx) => ({ ...s, step: idx + 1 })));

  const addFaq = () => setFormFaqs((prev) => [...prev, { question: "", answer: "" }]);
  const updateFaq = (index: number, field: "question" | "answer", val: string) => {
    const updated = [...formFaqs];
    updated[index][field] = val;
    setFormFaqs(updated);
  };
  const removeFaq = (index: number) => setFormFaqs((prev) => prev.filter((_, i) => i !== index));

  const removeFormImage = (index: number) => setFormImages((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const categoryName = categories.find((c) => c.slug === selectedCategoryId)?.name || "অনির্দিষ্ট";

    const payload = {
      title,
      category: categoryName,
      categoryId: selectedCategoryId,
      price: Number(price),
      costPrice: Number(costPrice),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      images: formImages.filter((img) => img.trim() !== ""),
      phone,
      whatsapp,
      unit,
      badge,
      description,
      features: formFeatures.filter((f) => f.trim() !== ""),
      howToUse: formSteps.filter((s) => s.title.trim() !== ""),
      specifications: formSpecs.filter((s) => s.key.trim() !== ""),
      faqs: formFaqs.filter((f) => f.question.trim() !== ""),
      inStock,
      stockCount: Number(stockCount),
      status: prodStatus,
      featured,
      bestSeller,
      seoTitle,
      seoDescription,
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetchAPI(`/api/products/${editingProduct.id}`, {
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
          title: "সফল হয়েছে",
          message: editingProduct ? "প্রোডাক্ট সফলভাবে আপডেট হয়েছে।" : "নতুন প্রোডাক্ট সফলভাবে যুক্ত হয়েছে।",
          type: "success",
        });
        setShowModal(false);
        loadProducts();
      }
    } catch (err: any) {
      showAlert({ title: "ত্রুটি", message: err.message || "সংরক্ষণ ব্যর্থ হয়েছে।", type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">প্রোডাক্টস CRUD</h1>
          <p className="text-sm text-slate-400 font-semibold uppercase">পাবলিক ওয়েবসাইটের সকল প্রোডাক্টের তালিকা ও ব্যবস্থাপনা</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all shadow-md text-sm cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন প্রোডাক্ট যোগ করুন</span>
        </button>
      </div>

      {/* Filter Panel */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-2xs flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4.5 h-4.5" />
          </div>
          <input
            type="text"
            placeholder="প্রোডাক্ট নাম, ক্যাটাগরি দিয়ে খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none text-slate-600"
          >
            <option value="">সকল ক্যাটাগরি</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none text-slate-600"
          >
            <option value="">সকল স্ট্যাটাস</option>
            <option value="active">Active (সক্রিয়)</option>
            <option value="inactive">Inactive (নিষ্ক্রিয়)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
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
                  <th className="py-4 px-4">প্রোডাক্ট নাম</th>
                  <th className="py-4 px-4">ক্যাটাগরি</th>
                  <th className="py-4 px-4 text-center">স্টক কাউন্ট</th>
                  <th className="py-4 px-4 text-center">স্টক স্ট্যাটাস</th>
                  <th className="py-4 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-4 px-4 text-center">মূল্য</th>
                  <th className="py-4 px-6 text-center w-24">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold text-slate-600">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="border-b border-slate-100 hover:bg-slate-50/20 transition-colors">
                      <td className="py-3 px-6">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200/80 bg-white">
                          <img src={product.images[0] || "/placeholder-image.png"} alt={product.title} className="object-cover w-full h-full" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-black text-slate-800 block line-clamp-1">{product.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 block">{product.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px]">{product.category}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-black text-slate-700">{product.stockCount}</td>
                      <td className="py-3 px-4 text-center">
                        {product.inStock ? (
                          <span className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-0.5 rounded-full text-[10px]">
                            <CheckCircle className="w-3 h-3" /><span>In Stock</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-0.5 rounded-full text-[10px]">
                            <AlertTriangle className="w-3 h-3" /><span>Stock Out</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {product.status === "active" ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-500 font-extrabold">Inactive</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-black text-slate-800">{product.price}৳</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setShareProduct(product)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
                            title="ফেসবুক শেয়ার ও লিংক তৈরি করুন"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
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
                    <td colSpan={8} className="py-10 text-center text-slate-400">কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি।</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-5 border-t border-slate-150 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">
                মোট {totalProducts} টি প্রোডাক্ট এর মধ্যে {(page - 1) * 10 + 1}-{Math.min(page * 10, totalProducts)} দেখাচ্ছে
              </span>
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 text-slate-500 text-xs font-bold hover:bg-white">পূর্ববর্তী</button>
                <span className="text-xs font-bold text-slate-600 px-3">{page}/{totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1.5 rounded-lg border border-slate-200 disabled:opacity-50 text-slate-500 text-xs font-bold hover:bg-white">পরবর্তী</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CRUD Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-slide-in-right">
            {/* Modal Header */}
            <div className="h-20 border-b border-slate-150 px-6 sm:px-8 flex items-center justify-between bg-slate-50 shrink-0">
              <div>
                <h3 className="text-lg font-black text-slate-800">
                  {editingProduct ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট যোগ করুন"}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {editingProduct ? `ID: ${editingProduct.id}` : "প্রোডাক্ট ডাটাবেস ফর্ম"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-slate-150 bg-slate-50/50 px-6 sm:px-8 shrink-0 overflow-x-auto">
              {(["general", "images", "details", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 px-4 text-xs font-black capitalize transition-all border-b-2 cursor-pointer ${
                    activeTab === tab ? "border-emerald-600 text-emerald-700" : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab === "general" ? "সাধারন তথ্য" : tab === "images" ? "ছবি সমূহ" : tab === "details" ? "ডিটেইলস ও ফিচারস" : "SEO মেটা"}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

              {/* ── GENERAL TAB ── */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700">প্রোডাক্ট এর নাম <span className="text-red-500">*</span></label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: বাবল বস কালার গার্ড ফোমিং জেল (৫৫০ মিলি)" required className="w-full px-4 py-2.5 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">ক্যাটাগরি <span className="text-red-500">*</span></label>
                      <select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none">
                        {categories.map((cat) => (<option key={cat._id} value={cat.slug}>{cat.name}</option>))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">প্যাক সাইজ / ইউনিট <span className="text-red-500">*</span></label>
                      <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="যেমন: ৫৫০ মিলি বোটল (১টি মাইক্রোফাইবার ফ্রি)" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">বিক্রয় মূল্য (৳) <span className="text-red-500">*</span></label>
                      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="350" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">ক্রয়মূল্য (৳) <span className="text-red-500">*</span></label>
                      <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="200" required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">পূর্বের মূল্য / ডিসকাউন্ট মূল্য (৳)</label>
                      <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="450" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">স্টক পরিমাণ</label>
                      <input type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} placeholder="99" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">ব্যাজ / অফার লেবেল</label>
                      <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="যেমন: হট ডিল, বেস্ট সেলার, পপুলার" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">অর্ডার হটলাইন ফোন</label>
                      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01958-058359" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">অর্ডার হোয়াটসঅ্যাপ নম্বর</label>
                      <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="8801958058359" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="text-xs font-black text-slate-700">ইন স্টক</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="text-xs font-black text-slate-700">ফিচার্ড</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded" />
                      <span className="text-xs font-black text-slate-700">বেস্ট সেলার</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-700 shrink-0">স্ট্যাটাস:</span>
                      <select value={prodStatus} onChange={(e) => setProdStatus(e.target.value as any)} className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold focus:outline-none">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="block text-xs font-black text-slate-700">প্রোডাক্ট বিবরণী <span className="text-red-500">*</span></label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="প্রোডাক্টটি সম্পর্কে ১-২ লাইনের বিবরণী প্রদান করুন..." rows={3} required className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                  </div>
                </div>
              )}

              {/* ── IMAGES TAB ── */}
              {activeTab === "images" && (
                <div className="space-y-6">
                  {/* Main Image */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black text-slate-700">প্রোডাক্ট কভার ইমেজ (Main Image)</h4>
                    <div className="flex items-center gap-6">
                      <div className="relative w-28 h-28 border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
                        {formImages[0] ? (
                          <>
                            <img src={formImages[0]} className="object-cover w-full h-full" alt="Cover" />
                            <button type="button" onClick={() => removeFormImage(0)} className="absolute top-1 right-1 p-0.5 rounded-md bg-red-600 text-white cursor-pointer">
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-slate-300" />
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs ${uploadingMain ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800 text-white"}`}>
                          {uploadingMain ? (
                            <><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /><span>আপলোড হচ্ছে...</span></>
                          ) : (
                            <><ImageIcon className="w-3.5 h-3.5" /><span>ছবি আপলোড করুন</span></>
                          )}
                          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploadingMain} onChange={(e) => handleDirectUpload(e.target.files, "main")} />
                        </label>
                        <p className="text-[10px] text-slate-400 font-semibold">অথবা সরাসরি ইমেজ URL পেস্ট করুন:</p>
                        <input
                          type="text"
                          value={formImages[0] || ""}
                          onChange={(e) => { const u = [...formImages]; u[0] = e.target.value; setFormImages(u); }}
                          placeholder="https://res.cloudinary.com/.../img.jpg"
                          className="w-full max-w-md px-3 py-1.5 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="text-xs font-black text-slate-700">অতিরিক্ত গ্যালারি ইমেজেস</h4>
                      <label className={`inline-flex items-center gap-1.5 text-xs font-black cursor-pointer transition-all ${uploadingGallery ? "text-slate-400 cursor-not-allowed" : "text-emerald-600 hover:underline"}`}>
                        {uploadingGallery ? (
                          <><div className="w-3 h-3 rounded-full border-2 border-emerald-300 border-t-emerald-600 animate-spin" /><span>আপলোড হচ্ছে...</span></>
                        ) : (
                          <span>+ গ্যালারি ছবি যোগ করুন</span>
                        )}
                        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" disabled={uploadingGallery} onChange={(e) => handleDirectUpload(e.target.files, "gallery")} />
                      </label>
                    </div>

                    {formImages.slice(1).length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {formImages.slice(1).map((imgUrl, index) => (
                          <div key={index} className="relative group border border-slate-200 bg-white rounded-xl overflow-hidden aspect-square flex items-center justify-center">
                            <img src={imgUrl} className="object-cover w-full h-full" alt="Gallery item" />
                            <button type="button" onClick={() => removeFormImage(index + 1)} className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" title="Delete">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-semibold py-4 text-center">কোনো অতিরিক্ত গ্যালারি ছবি যোগ করা হয়নি।</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── DETAILS TAB ── */}
              {activeTab === "details" && (
                <div className="space-y-6">
                  {/* Specifications */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="text-xs font-black text-slate-700">টেকনিক্যাল স্পেসিফিকেশনস</h4>
                      <button type="button" onClick={addSpec} className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1"><PlusCircle className="w-4 h-4" /><span>স্পেস যোগ করুন</span></button>
                    </div>
                    {formSpecs.length > 0 ? (
                      <div className="space-y-3">
                        {formSpecs.map((spec, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input type="text" value={spec.key} onChange={(e) => updateSpec(index, "key", e.target.value)} placeholder="যেমন: প্যাকেজিং" className="flex-1 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-none" />
                            <input type="text" value={spec.value} onChange={(e) => updateSpec(index, "value", e.target.value)} placeholder="যেমন: ২৫০ গ্রাম" className="flex-1 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-none" />
                            <button type="button" onClick={() => removeSpec(index)} className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"><MinusCircle className="w-5 h-5" /></button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-semibold py-2 text-center">কোনো স্পেসিফিকেশন অ্যাড করা হয়নি।</p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="text-xs font-black text-slate-700">প্রোডাক্ট এর মূল ফিচারসমূহ</h4>
                      <button type="button" onClick={addFeature} className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1"><PlusCircle className="w-4 h-4" /><span>ফিচার যোগ করুন</span></button>
                    </div>
                    {formFeatures.length > 0 ? (
                      <div className="space-y-3">
                        {formFeatures.map((feat, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input type="text" value={feat} onChange={(e) => updateFeature(index, e.target.value)} placeholder="যেমন: গাড়ির মেটাল কালার প্রটেক্ট করবে..." className="flex-1 px-3 py-2 border border-slate-200 bg-white rounded-lg text-xs font-semibold focus:outline-none" />
                            <button type="button" onClick={() => removeFeature(index)} className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"><MinusCircle className="w-5 h-5" /></button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-semibold py-2 text-center">কোনো ফিচার অ্যাড করা হয়নি।</p>
                    )}
                  </div>

                  {/* How To Use */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="text-xs font-black text-slate-700">ব্যবহার বিধি (ধাপে ধাপে)</h4>
                      <button type="button" onClick={addStep} className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1"><PlusCircle className="w-4 h-4" /><span>ধাপ যোগ করুন</span></button>
                    </div>
                    {formSteps.length > 0 ? (
                      <div className="space-y-4">
                        {formSteps.map((step, index) => (
                          <div key={index} className="border border-slate-200 bg-white rounded-xl p-3.5 space-y-2 relative">
                            <span className="absolute top-3.5 right-3.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg">ধাপ - {step.step}</span>
                            <div className="space-y-2 max-w-[85%]">
                              <input type="text" value={step.title} onChange={(e) => updateStep(index, "title", e.target.value)} placeholder="ধাপের সংক্ষিপ্ত নাম" className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-xs font-bold focus:outline-none" />
                              <textarea value={step.desc} onChange={(e) => updateStep(index, "desc", e.target.value)} placeholder="ধাপের বিস্তারিত বিবরণী..." rows={2} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none" />
                            </div>
                            <button type="button" onClick={() => removeStep(index)} className="absolute bottom-3 right-3 text-red-600 hover:text-red-800 text-xs font-bold cursor-pointer">ধাপ ডিলিট করুন</button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-semibold py-2 text-center">কোনো ব্যবহার বিধি অ্যাড করা হয়নি।</p>
                    )}
                  </div>

                  {/* FAQs */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="text-xs font-black text-slate-700">সচরাচর জিজ্ঞাসা (FAQ)</h4>
                      <button type="button" onClick={addFaq} className="text-xs font-black text-emerald-600 hover:underline flex items-center gap-1"><PlusCircle className="w-4 h-4" /><span>FAQ যোগ করুন</span></button>
                    </div>
                    {formFaqs.length > 0 ? (
                      <div className="space-y-3">
                        {formFaqs.map((faq, index) => (
                          <div key={index} className="border border-slate-200 bg-white rounded-xl p-3 space-y-2 relative">
                            <input type="text" value={faq.question} onChange={(e) => updateFaq(index, "question", e.target.value)} placeholder="প্রশ্ন লিখুন..." className="w-full px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-lg text-xs font-bold focus:outline-none" />
                            <textarea value={faq.answer} onChange={(e) => updateFaq(index, "answer", e.target.value)} placeholder="উত্তর লিখুন..." rows={2} className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none" />
                            <button type="button" onClick={() => removeFaq(index)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-semibold py-2 text-center">কোনো FAQ অ্যাড করা হয়নি।</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── SEO TAB ── */}
              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700">SEO মেটা টাইটেল</label>
                    <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="সার্চ ইঞ্জিনের জন্য টাইটেল..." className="w-full px-4 py-2.5 border border-slate-200 focus:border-emerald-500 rounded-xl text-sm font-semibold focus:outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700">SEO মেটা ডেসক্রিপশন</label>
                    <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="সার্চ রেজাল্ট পাতায় দেখানোর জন্য বিবরণী..." rows={4} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none" />
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="h-20 border-t border-slate-150 px-6 sm:px-8 flex items-center justify-end bg-slate-50 gap-3 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer">
                বাতিল করুন
              </button>
              <button type="button" onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all text-xs cursor-pointer flex items-center gap-1.5">
                {submitting ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /><span>সংরক্ষণ হচ্ছে...</span></>
                ) : (
                  <span>সংরক্ষণ করুন</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Facebook Share & Link Generator Modal */}
      {shareProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">ফেসবুক পেজ / পোস্ট লিংক জেনারেটর</h3>
                  <p className="text-xs text-blue-100 font-medium">ইনডিভিজুয়াল প্রোডাক্টের জন্য অটো-অর্ডার লিংক তৈরি করুন</p>
                </div>
              </div>
              <button
                onClick={() => setShareProduct(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Domain Switcher */}
              <div className="space-y-1">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider">ডোমেইন নির্বাচন করুন (Select Domain):</label>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setDomainType("vercel")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      domainType === "vercel" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>⚡ Vercel Domain</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDomainType("custom")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      domainType === "custom" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>🌐 ecoshinebd.com</span>
                  </button>
                </div>
              </div>

              {/* Product Info Card */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-white border border-slate-200 shrink-0">
                  <img
                    src={shareProduct.images[0] || "/placeholder-image.png"}
                    alt={shareProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{shareProduct.title}</h4>
                  <p className="text-xs text-slate-500 font-semibold">{shareProduct.category} • {shareProduct.unit}</p>
                  <p className="text-sm font-black text-emerald-600 mt-0.5">{shareProduct.price}৳</p>
                </div>
              </div>

              {/* Link Option 1: Standard Product Landing Page */}
              {(() => {
                const siteBase = domainType === "vercel" ? "https://eco-shine-bd.vercel.app" : "https://ecoshinebd.com";
                const path = shareProduct.categoryId === "houseware" ? "/houseware" : "";
                const standardUrl = `${siteBase}${path}/products/${shareProduct.id}`;
                const autoOrderUrl = `${siteBase}${path}/products/${shareProduct.id}?order=true`;

                return (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700 flex items-center justify-between">
                        <span>১. সাধারণ প্রোডাক্ট পেজ লিংক (Standard Landing Page)</span>
                        <span className="text-[10px] text-slate-400 font-medium">ভিজিটর পেজে গিয়ে অর্ডার বাটন চাপবে</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={standardUrl}
                          className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(standardUrl);
                            setCopiedType("standard");
                            setTimeout(() => setCopiedType(null), 2500);
                          }}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          {copiedType === "standard" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedType === "standard" ? "কপি হয়েছে!" : "কপি করুন"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Link Option 2: Direct Order Form Auto-Open Link */}
                    <div className="space-y-1.5 pt-1">
                      <label className="block text-xs font-black text-emerald-700 flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                          ২. ডিরেক্ট অটো-অর্ডার ফরম লিংক (High Converting 🔥)
                        </span>
                        <span className="text-[10px] text-emerald-600 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">সুপার ফাস্ট অর্ডার</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={autoOrderUrl}
                          className="flex-1 px-3 py-2 bg-emerald-50/60 border border-emerald-300 rounded-xl text-xs font-mono text-emerald-900 font-bold select-all focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(autoOrderUrl);
                            setCopiedType("order");
                            setTimeout(() => setCopiedType(null), 2500);
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
                        >
                          {copiedType === "order" ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedType === "order" ? "কপি হয়েছে!" : "কপি করুন"}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight pt-0.5">
                        💡 কাস্টমার ফেসবুকে লিংকটি ক্লিক করলেই সাথে সাথে প্রোডাক্ট পেজে অর্ডার ফর্ম পপআপ ওপেন হবে।
                      </p>
                    </div>

                    {/* Action Buttons: FB Direct Share & Debugger */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch gap-2">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(autoOrderUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 px-4 bg-[#1877F2] hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold rounded-xl transition-all text-xs flex items-center justify-center gap-2 shadow-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>ফেসবুকে পোস্ট করুন</span>
                      </a>
                      <a
                        href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(autoOrderUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
                        title="Facebook Sharing Debugger — ফেসবুক লিঙ্ক প্রিভিউ রিফ্রেশ করুন"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>FB ক্যাশ রিফ্রেশ</span>
                      </a>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
