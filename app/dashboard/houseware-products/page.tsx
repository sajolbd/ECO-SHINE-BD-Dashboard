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
  Home,
  Package,
} from "lucide-react";

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

export default function HousewareProductsPage() {
  const { showAlert, showConfirm } = useModal();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "images" | "details" | "seo">("general");

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const [formFeatures, setFormFeatures] = useState<string[]>([]);
  const [formSpecs, setFormSpecs] = useState<ProductSpecItem[]>([]);
  const [formSteps, setFormSteps] = useState<ProductFeatureStep[]>([]);
  const [formFaqs, setFormFaqs] = useState<ProductFaqItem[]>([]);
  const [formImages, setFormImages] = useState<string[]>([]);

  const [title, setTitle] = useState("");
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

  // Always filter by houseware
  const HOUSEWARE_CATEGORY_ID = "houseware";
  const HOUSEWARE_CATEGORY_NAME = "Houseware";

  const loadProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        search,
        categoryId: HOUSEWARE_CATEGORY_ID,
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
      console.error("Error loading houseware products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, status, page]);

  const resetForm = () => {
    setEditingProduct(null);
    setTitle("");
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
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setTitle(product.title);
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
      title: "Houseware \u09aa\u09cd\u09b0\u09cb\u09a1\u09be\u0995\u09cd\u099f \u09a1\u09bf\u09b2\u09bf\u099f \u0995\u09b0\u09c1\u09a8",
      message: "\u0986\u09aa\u09a8\u09bf \u0995\u09bf \u09a8\u09bf\u09b6\u09cd\u099a\u09bf\u09a4\u09ad\u09be\u09ac\u09c7 \u098f\u0987 Houseware \u09aa\u09cd\u09b0\u09cb\u09a1\u09be\u0995\u09cd\u099f\u099f\u09bf \u09a1\u09bf\u09b2\u09bf\u099f \u0995\u09b0\u09a4\u09c7 \u099a\u09be\u09a8?",
      type: "danger",
      confirmText: "\u09b9\u09cd\u09af\u09be\u0981, \u09a1\u09bf\u09b2\u09bf\u099f \u0995\u09b0\u09c1\u09a8",
      cancelText: "\u09ac\u09be\u09a4\u09bf\u09b2",
    });
    if (!confirmed) return;
    try {
      const res = await fetchAPI(`/api/products/${id}`, { method: "DELETE" });
      if (res.success) {
        showAlert({ title: "\u09b8\u09ab\u09b2 \u09b9\u09af\u09bc\u09c7\u099b\u09c7", message: "\u09aa\u09cd\u09b0\u09cb\u09a1\u09be\u0995\u09cd\u099f \u09b8\u09ab\u09b2\u09ad\u09be\u09ac\u09c7 \u09a1\u09bf\u09b2\u09bf\u099f \u0995\u09b0\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964", type: "success" });
        loadProducts();
      }
    } catch (err: any) {
      showAlert({ title: "\u09a4\u09cd\u09b0\u09c1\u099f\u09bf", message: err.message || "\u09a1\u09bf\u09b2\u09bf\u099f \u09ac\u09cd\u09af\u09b0\u09cd\u09a5 \u09b9\u09af\u09bc\u09c7\u099b\u09c7\u0964", type: "error" });
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
        if (data.success && data.media?.url) uploadedUrls.push(data.media.url);
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

  const addFeature = () => setFormFeatures((prev) => [...prev, ""]);
  const updateFeature = (i: number, val: string) => { const u = [...formFeatures]; u[i] = val; setFormFeatures(u); };
  const removeFeature = (i: number) => setFormFeatures((prev) => prev.filter((_, idx) => idx !== i));

  const addSpec = () => setFormSpecs((prev) => [...prev, { key: "", value: "" }]);
  const updateSpec = (i: number, field: "key" | "value", val: string) => { const u = [...formSpecs]; u[i][field] = val; setFormSpecs(u); };
  const removeSpec = (i: number) => setFormSpecs((prev) => prev.filter((_, idx) => idx !== i));

  const addStep = () => setFormSteps((prev) => [...prev, { step: prev.length + 1, title: "", desc: "" }]);
  const updateStep = (i: number, field: "title" | "desc", val: string) => { const u = [...formSteps]; if (field === "title") u[i].title = val; else u[i].desc = val; setFormSteps(u); };
  const removeStep = (i: number) => setFormSteps((prev) => prev.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, step: idx + 1 })));

  const addFaq = () => setFormFaqs((prev) => [...prev, { question: "", answer: "" }]);
  const updateFaq = (i: number, field: "question" | "answer", val: string) => { const u = [...formFaqs]; u[i][field] = val; setFormFaqs(u); };
  const removeFaq = (i: number) => setFormFaqs((prev) => prev.filter((_, idx) => idx !== i));

  const removeFormImage = (i: number) => setFormImages((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      title,
      category: HOUSEWARE_CATEGORY_NAME,
      categoryId: HOUSEWARE_CATEGORY_ID,
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
        res = await fetchAPI(`/api/products/${editingProduct.id}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        res = await fetchAPI("/api/products", { method: "POST", body: JSON.stringify(payload) });
      }
      if (res.success) {
        showAlert({
          title: "সফল হয়েছে",
          message: editingProduct ? "Houseware প্রোডাক্ট আপডেট হয়েছে।" : "নতুন Houseware প্রোডাক্ট যুক্ত হয়েছে।",
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

  // Orange accent classes
  const accent = {
    btn: "bg-orange-500 hover:bg-orange-600 text-white",
    tab: "border-orange-500 text-orange-600",
    spinner: "border-orange-200 border-t-orange-500",
    badge: "bg-orange-100 text-orange-700",
    input: "focus:border-orange-400 focus:ring-orange-100",
    link: "text-orange-500 hover:underline",
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shadow-sm">
            <Home className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Houseware Products</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-black border border-orange-200">Importers BD</span>
            </div>
            <p className="text-sm text-slate-400 font-semibold uppercase">শুধুমাত্র Houseware ক্যাটাগরির প্রোডাক্ট ব্যবস্থাপনা</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className={`flex items-center gap-2 px-5 py-3 ${accent.btn} font-extrabold rounded-xl transition-all shadow-md text-sm cursor-pointer shrink-0 active:scale-[0.98]`}
        >
          <Plus className="w-4 h-4" />
          <span>নতুন Houseware প্রোডাক্ট</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "মোট Houseware পণ্য", value: totalProducts, icon: Package },
          { label: "Active পণ্য", value: products.filter(p => p.status === "active").length, icon: CheckCircle },
          { label: "Stock Out", value: products.filter(p => !p.inStock).length, icon: AlertTriangle },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-orange-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-800">{value}</p>
              <p className="text-[11px] text-slate-400 font-semibold">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Panel */}
      <div className="bg-white border border-orange-100 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Houseware প্রোডাক্ট খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 transition-all`}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none text-slate-600"
          >
            <option value="">সকল স্ট্যাটাস</option>
            <option value="active">Active (সক্রিয়)</option>
            <option value="inactive">Inactive (নিষ্ক্রিয়)</option>
          </select>
          <span className="px-3 py-1.5 rounded-xl bg-orange-100 text-orange-700 text-xs font-black border border-orange-200 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />
            Houseware only
          </span>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className={`w-8 h-8 rounded-full border-4 ${accent.spinner} animate-spin`} />
        </div>
      ) : (
        <div className="bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto min-w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-orange-100 bg-orange-50/60 text-slate-400 text-xs font-black">
                  <th className="py-4 px-6 w-16">ছবি</th>
                  <th className="py-4 px-4">প্রোডাক্ট নাম</th>
                  <th className="py-4 px-4 text-center">স্টক</th>
                  <th className="py-4 px-4 text-center">স্টক স্ট্যাটাস</th>
                  <th className="py-4 px-4 text-center">স্ট্যাটাস</th>
                  <th className="py-4 px-4 text-center">মূল্য</th>
                  <th className="py-4 px-6 text-center w-24">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="text-xs font-bold text-slate-600">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id} className="border-b border-orange-50 hover:bg-orange-50/30 transition-colors">
                      <td className="py-3 px-6">
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-orange-100 bg-white">
                          <img src={product.images[0] || "/placeholder-image.png"} alt={product.title} className="object-cover w-full h-full" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm font-black text-slate-800 block line-clamp-1">{product.title}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 block">{product.id}</span>
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
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-100 text-orange-700 font-extrabold border border-orange-200">Active</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-500 font-extrabold">Inactive</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center font-black text-slate-800">{product.price}৳</td>
                      <td className="py-3 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg border border-orange-200 text-slate-500 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
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
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center">
                          <Home className="w-7 h-7 text-orange-300" />
                        </div>
                        <p className="text-slate-400 font-semibold text-sm">কোনো Houseware প্রোডাক্ট পাওয়া যায়নি।</p>
                        <button onClick={openAddModal} className={`px-4 py-2 ${accent.btn} rounded-xl text-xs font-bold transition-all`}>
                          প্রথম পণ্য যোগ করুন
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-5 border-t border-orange-100 bg-orange-50/30 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-bold">
                মোট {totalProducts} টি পণ্যের মধ্যে {(page - 1) * 10 + 1}–{Math.min(page * 10, totalProducts)} দেখাচ্ছে
              </span>
              <div className="flex items-center gap-2">
                <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 rounded-lg border border-orange-200 disabled:opacity-50 text-slate-500 text-xs font-bold hover:bg-white">পূর্ববর্তী</button>
                <span className="text-xs font-bold text-slate-600 px-3">{page}/{totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-3 py-1.5 rounded-lg border border-orange-200 disabled:opacity-50 text-slate-500 text-xs font-bold hover:bg-white">পরবর্তী</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs">
          <div className="absolute inset-0" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-3xl h-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-slide-in-right">

            {/* Modal Header */}
            <div className="h-20 border-b border-orange-100 px-6 sm:px-8 flex items-center justify-between bg-orange-50/60 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-800">
                    {editingProduct ? "Houseware প্রোডাক্ট এডিট" : "নতুন Houseware প্রোডাক্ট"}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black border border-orange-200">Importers BD</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
                  {editingProduct ? `ID: ${editingProduct.id}` : "Category: Houseware — সয়ংক্রিয়ভাবে সেট"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-xl border border-orange-200 hover:bg-orange-100 text-slate-500 hover:text-orange-700 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-orange-100 bg-orange-50/30 px-6 sm:px-8 shrink-0 overflow-x-auto">
              {(["general", "images", "details", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`py-3.5 px-4 text-xs font-black capitalize transition-all border-b-2 cursor-pointer ${
                    activeTab === tab ? "border-orange-500 text-orange-600" : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tab === "general" ? "সাধারন তথ্য" : tab === "images" ? "ছবি সমূহ" : tab === "details" ? "ডিটেইলস ও ফিচারস" : "SEO মেটা"}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 sm:p-8 space-y-6">

                {/* ── GENERAL TAB ── */}
                {activeTab === "general" && (
                  <div className="space-y-4">
                    {/* Category locked badge */}
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 border border-orange-200">
                      <Home className="w-4 h-4 text-orange-500 shrink-0" />
                      <span className="text-xs font-black text-orange-700">ক্যাটাগরি: <strong>Houseware</strong> — এই পেজে সব পণ্য স্বয়ংক্রিয়ভাবে Houseware ক্যাটাগরিতে সেভ হবে।</span>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">প্রোডাক্ট এর নাম <span className="text-red-500">*</span></label>
                      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: প্রিমিয়াম কিচেন টাওয়েল সেট" required className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">প্যাক সাইজ / ইউনিট <span className="text-red-500">*</span></label>
                      <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="যেমন: ৩ পিস সেট" required className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">বিক্রয় মূল্য (৳) <span className="text-red-500">*</span></label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="350" required className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">ক্রয়মূল্য (৳)</label>
                        <input type="number" value={costPrice} onChange={(e) => setCostPrice(e.target.value)} placeholder="200" className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">পূর্বের মূল্য (৳)</label>
                        <input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="450" className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">স্টক পরিমাণ</label>
                        <input type="number" value={stockCount} onChange={(e) => setStockCount(e.target.value)} placeholder="99" className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">ব্যাজ / অফার লেবেল</label>
                        <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="যেমন: হট ডিল, নতুন" className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">ফোন নম্বর</label>
                        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-black text-slate-700">হোয়াটসঅ্যাপ নম্বর</label>
                        <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
                        <span className="text-xs font-black text-slate-700">ইন স্টক</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
                        <span className="text-xs font-black text-slate-700">ফিচার্ড</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} className="w-4 h-4 accent-orange-500 rounded" />
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
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="পণ্যটি সম্পর্কে সংক্ষিপ্ত বিবরণ..." rows={3} required className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                    </div>
                  </div>
                )}

                {/* ── IMAGES TAB ── */}
                {activeTab === "images" && (
                  <div className="space-y-6">
                    <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5 space-y-4">
                      <h4 className="text-xs font-black text-slate-700">কভার ইমেজ (Main Image)</h4>
                      <div className="flex items-center gap-6">
                        <div className="relative w-28 h-28 border-2 border-dashed border-orange-200 rounded-xl overflow-hidden bg-white flex items-center justify-center shrink-0">
                          {formImages[0] ? (
                            <>
                              <img src={formImages[0]} className="object-cover w-full h-full" alt="Cover" />
                              <button type="button" onClick={() => removeFormImage(0)} className="absolute top-1 right-1 p-0.5 rounded-md bg-red-600 text-white cursor-pointer"><X className="w-3 h-3" /></button>
                            </>
                          ) : (
                            <ImageIcon className="w-8 h-8 text-orange-200" />
                          )}
                        </div>
                        <div className="space-y-3">
                          <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer shadow-xs ${uploadingMain ? "bg-slate-300 text-slate-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"}`}>
                            {uploadingMain ? (<><div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" /><span>আপলোড হচ্ছে...</span></>) : (<><ImageIcon className="w-3.5 h-3.5" /><span>ছবি আপলোড করুন</span></>)}
                            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploadingMain} onChange={(e) => handleDirectUpload(e.target.files, "main")} />
                          </label>
                          <p className="text-[10px] text-slate-400 font-semibold">অথবা ইমেজ URL পেস্ট করুন:</p>
                          <input type="text" value={formImages[0] || ""} onChange={(e) => { const u = [...formImages]; u[0] = e.target.value; setFormImages(u); }} placeholder="https://..." className="w-full max-w-md px-3 py-1.5 border border-orange-200 bg-white rounded-lg text-xs font-semibold focus:outline-none" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-orange-200 pb-2">
                        <h4 className="text-xs font-black text-slate-700">গ্যালারি ছবি</h4>
                        <label className={`inline-flex items-center gap-1.5 text-xs font-black cursor-pointer transition-all ${uploadingGallery ? "text-slate-400 cursor-not-allowed" : "text-orange-600 hover:underline"}`}>
                          {uploadingGallery ? (<><div className="w-3 h-3 rounded-full border-2 border-orange-300 border-t-orange-600 animate-spin" /><span>আপলোড হচ্ছে...</span></>) : (<span>+ গ্যালারি ছবি যোগ করুন</span>)}
                          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" disabled={uploadingGallery} onChange={(e) => handleDirectUpload(e.target.files, "gallery")} />
                        </label>
                      </div>
                      {formImages.slice(1).length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {formImages.slice(1).map((imgUrl, index) => (
                            <div key={index} className="relative group border border-orange-200 bg-white rounded-xl overflow-hidden aspect-square">
                              <img src={imgUrl} className="object-cover w-full h-full" alt="" />
                              <button type="button" onClick={() => removeFormImage(index + 1)} className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 font-semibold py-4 text-center">কোনো গ্যালারি ছবি যোগ হয়নি।</p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── DETAILS TAB ── */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    {/* Specifications */}
                    <div className="bg-orange-50/40 border border-orange-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                        <h4 className="text-xs font-black text-slate-700">স্পেসিফিকেশনস</h4>
                        <button type="button" onClick={addSpec} className={`text-xs font-black ${accent.link} flex items-center gap-1`}><PlusCircle className="w-4 h-4" /><span>স্পেস যোগ করুন</span></button>
                      </div>
                      {formSpecs.length > 0 ? (
                        <div className="space-y-3">
                          {formSpecs.map((spec, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <input type="text" value={spec.key} onChange={(e) => updateSpec(i, "key", e.target.value)} placeholder="Key" className="flex-1 px-3 py-2 border border-orange-200 bg-white rounded-lg text-xs font-semibold focus:outline-none" />
                              <input type="text" value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Value" className="flex-1 px-3 py-2 border border-orange-200 bg-white rounded-lg text-xs font-semibold focus:outline-none" />
                              <button type="button" onClick={() => removeSpec(i)} className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"><MinusCircle className="w-5 h-5" /></button>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-xs text-slate-400 font-semibold py-2 text-center">কোনো স্পেসিফিকেশন অ্যাড হয়নি।</p>}
                    </div>

                    {/* Features */}
                    <div className="bg-orange-50/40 border border-orange-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                        <h4 className="text-xs font-black text-slate-700">মূল ফিচারসমূহ</h4>
                        <button type="button" onClick={addFeature} className={`text-xs font-black ${accent.link} flex items-center gap-1`}><PlusCircle className="w-4 h-4" /><span>ফিচার যোগ করুন</span></button>
                      </div>
                      {formFeatures.length > 0 ? (
                        <div className="space-y-3">
                          {formFeatures.map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <input type="text" value={feat} onChange={(e) => updateFeature(i, e.target.value)} placeholder="ফিচারের বিবরণ..." className="flex-1 px-3 py-2 border border-orange-200 bg-white rounded-lg text-xs font-semibold focus:outline-none" />
                              <button type="button" onClick={() => removeFeature(i)} className="p-2 text-slate-400 hover:text-red-600 cursor-pointer"><MinusCircle className="w-5 h-5" /></button>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-xs text-slate-400 font-semibold py-2 text-center">কোনো ফিচার অ্যাড হয়নি।</p>}
                    </div>

                    {/* How To Use */}
                    <div className="bg-orange-50/40 border border-orange-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                        <h4 className="text-xs font-black text-slate-700">ব্যবহার বিধি (ধাপে ধাপে)</h4>
                        <button type="button" onClick={addStep} className={`text-xs font-black ${accent.link} flex items-center gap-1`}><PlusCircle className="w-4 h-4" /><span>ধাপ যোগ করুন</span></button>
                      </div>
                      {formSteps.length > 0 ? (
                        <div className="space-y-4">
                          {formSteps.map((step, i) => (
                            <div key={i} className="border border-orange-200 bg-white rounded-xl p-3.5 space-y-2 relative">
                              <span className="absolute top-3.5 right-3.5 px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-black rounded-lg">ধাপ - {step.step}</span>
                              <div className="space-y-2 max-w-[85%]">
                                <input type="text" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="ধাপের নাম" className="w-full px-3 py-1.5 border border-orange-200 bg-slate-50 rounded-lg text-xs font-bold focus:outline-none" />
                                <textarea value={step.desc} onChange={(e) => updateStep(i, "desc", e.target.value)} placeholder="ধাপের বিবরণী..." rows={2} className="w-full px-3 py-1.5 border border-orange-100 rounded-lg text-xs font-medium focus:outline-none" />
                              </div>
                              <button type="button" onClick={() => removeStep(i)} className="absolute bottom-3 right-3 text-red-600 hover:text-red-800 text-xs font-bold cursor-pointer">ধাপ ডিলিট</button>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-xs text-slate-400 font-semibold py-2 text-center">কোনো ধাপ অ্যাড হয়নি।</p>}
                    </div>

                    {/* FAQs */}
                    <div className="bg-orange-50/40 border border-orange-200 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                        <h4 className="text-xs font-black text-slate-700">সাধারণ প্রশ্নোত্তর (FAQ)</h4>
                        <button type="button" onClick={addFaq} className={`text-xs font-black ${accent.link} flex items-center gap-1`}><PlusCircle className="w-4 h-4" /><span>FAQ যোগ করুন</span></button>
                      </div>
                      {formFaqs.length > 0 ? (
                        <div className="space-y-4">
                          {formFaqs.map((faq, i) => (
                            <div key={i} className="border border-orange-200 bg-white rounded-xl p-3.5 space-y-2 relative">
                              <button type="button" onClick={() => removeFaq(i)} className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-xs font-bold cursor-pointer">মুছুন</button>
                              <input type="text" value={faq.question} onChange={(e) => updateFaq(i, "question", e.target.value)} placeholder="প্রশ্ন..." className="w-full px-3 py-1.5 border border-orange-200 bg-slate-50 rounded-lg text-xs font-bold focus:outline-none" />
                              <textarea value={faq.answer} onChange={(e) => updateFaq(i, "answer", e.target.value)} placeholder="উত্তর..." rows={2} className="w-full px-3 py-1.5 border border-orange-100 rounded-lg text-xs font-medium focus:outline-none" />
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-xs text-slate-400 font-semibold py-2 text-center">কোনো FAQ অ্যাড হয়নি।</p>}
                    </div>
                  </div>
                )}

                {/* ── SEO TAB ── */}
                {activeTab === "seo" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">SEO Title</label>
                      <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="SEO friendly title..." className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black text-slate-700">SEO Description</label>
                      <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="SEO meta description..." rows={4} className={`w-full px-4 py-2.5 border border-slate-200 ${accent.input} rounded-xl text-sm font-semibold focus:outline-none focus:ring-2`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 border-t border-orange-100 bg-orange-50/60 px-6 sm:px-8 py-4 flex items-center justify-between gap-4 shrink-0">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-sm font-bold transition-all cursor-pointer">
                  বাতিল করুন
                </button>
                <button type="submit" disabled={submitting} className={`px-6 py-2.5 ${accent.btn} rounded-xl text-sm font-extrabold transition-all cursor-pointer active:scale-[0.98] disabled:opacity-60 flex items-center gap-2`}>
                  {submitting ? (<><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" /><span>সংরক্ষণ হচ্ছে...</span></>) : (
                    <span>{editingProduct ? "আপডেট করুন" : "প্রোডাক্ট সেভ করুন"}</span>
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
