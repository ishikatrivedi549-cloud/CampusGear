"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDemoUser } from "@/context/DemoUserContext";
import { BRANCHES, CATEGORIES, CONDITIONS } from "@/components/CatalogFilters";
import ListingCard from "@/components/ListingCard";
import { Listing } from "@/types";
import {
  PlusCircle,
  Sparkles,
  BookOpen,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
} from "lucide-react";

const PRESET_IMAGES = [
  { label: "Mini Drafter", url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80" },
  { label: "Engineering Book", url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80" },
  { label: "Scientific Calculator", url: "https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80" },
  { label: "White Lab Coat", url: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=600&q=80" },
  { label: "Arduino / Electronics Kit", url: "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80" },
  { label: "Handwritten Spiral Notes", url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80" },
  { label: "Drawing Sheet Tube", url: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80" },
  { label: "Soldering Kit", url: "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=600&q=80" },
];

const SAFE_SPOTS = [
  "Central Library Entrance",
  "Main Canteen",
  "Mechanical Dept Notice Board",
  "CSE Block Foyer",
  "Hostel Common Room",
  "Faculty Exchange Desk",
];

export default function NewListingPage() {
  const router = useRouter();
  const { currentUser } = useDemoUser();

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Lab Gear / Mini-Drafter");
  const [branch, setBranch] = useState(currentUser?.branch || "Mechanical");
  const [semester, setSemester] = useState(currentUser?.currentSemester || 2);
  const [subjectName, setSubjectName] = useState("Engineering Drawing");
  const [subjectCode, setSubjectCode] = useState("ME202");
  const [isbn, setIsbn] = useState("");
  const [edition, setEdition] = useState("");
  const [condition, setCondition] = useState<any>("LIKE_NEW");
  const [exchangeMode, setExchangeMode] = useState<any>("SELL");
  const [priceInr, setPriceInr] = useState("350");
  const [lendRateText, setLendRateText] = useState("₹50 / week");
  const [lendDurationDays, setLendDurationDays] = useState(7);
  const [depositInr, setDepositInr] = useState("100");
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);

  // Safe Pickup Spots Selected
  const [selectedSpots, setSelectedSpots] = useState<string[]>([
    "Mechanical Dept Notice Board",
    "Central Library Entrance",
  ]);
  const [timeWindow, setTimeWindow] = useState("Mon-Fri 4:00 PM - 5:30 PM");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <p className="text-xs text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  const isBook = category === "Textbook" || category === "Reference Book";

  const handleSpotToggle = (spot: string) => {
    if (selectedSpots.includes(spot)) {
      if (selectedSpots.length > 1) {
        setSelectedSpots(selectedSpots.filter((s) => s !== spot));
      }
    } else {
      setSelectedSpots([...selectedSpots, spot]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        title,
        description,
        category,
        branch,
        semester: Number(semester),
        subjectName,
        subjectCode,
        isbn: isBook ? isbn : null,
        edition: isBook ? edition : null,
        condition,
        exchangeMode,
        priceInr: exchangeMode === "DONATE" ? 0 : Number(priceInr),
        lendRateText: exchangeMode === "LEND" ? lendRateText : null,
        lendDurationDays: exchangeMode === "LEND" ? Number(lendDurationDays) : null,
        depositInr: exchangeMode === "LEND" ? Number(depositInr) : 0,
        imageUrl,
        ownerId: currentUser.id,
        pickupSlots: selectedSpots.map((spot) => ({
          locationName: spot,
          timeWindow,
        })),
      };

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create listing");
      }

      const created = await res.json();
      router.push(`/listings/${created.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to publish listing");
      setLoading(false);
    }
  };

  // Live preview mockup object
  const previewListing: Listing = {
    id: "preview",
    title: title || "Your Academic Gear Title",
    description: description || "Detailed condition description will appear here as you type...",
    category,
    branch,
    semester: Number(semester),
    subjectName: subjectName || "Subject Name",
    subjectCode: subjectCode || "SUB101",
    condition,
    exchangeMode,
    priceInr: exchangeMode === "DONATE" ? 0 : Number(priceInr || 0),
    lendRateText,
    imageUrl,
    status: "AVAILABLE",
    ownerId: currentUser?.id || "preview-owner",
    createdAt: new Date(),
    owner: currentUser || undefined,
    pickupSlots: selectedSpots.map((s) => ({
      id: s,
      listingId: "preview",
      locationName: s,
      timeWindow,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Post Gear or Textbook
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Share semester tools with juniors or batchmates. Zero platform fees, direct campus handovers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1. Exchange Mode Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Exchange Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setExchangeMode("SELL")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    exchangeMode === "SELL"
                      ? "border-amber-400 bg-amber-50 ring-2 ring-amber-400/30"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <p className="font-bold text-xs text-amber-900">💰 Sell</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Permanent sale for cash or UPI</p>
                </button>

                <button
                  type="button"
                  onClick={() => setExchangeMode("LEND")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    exchangeMode === "LEND"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/30"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <p className="font-bold text-xs text-blue-900">⏱️ Lend / Rent</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Returns to you after lab/exam</p>
                </button>

                <button
                  type="button"
                  onClick={() => setExchangeMode("DONATE")}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    exchangeMode === "DONATE"
                      ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <p className="font-bold text-xs text-emerald-900">🎁 Donate</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pass on free (₹0) to a junior</p>
                </button>
              </div>
            </div>

            {/* Price / Rate inputs */}
            {exchangeMode === "SELL" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Selling Price (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={priceInr}
                    onChange={(e) => setPriceInr(e.target.value)}
                    placeholder="e.g. 350"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            )}

            {exchangeMode === "LEND" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Rental Rate Label
                  </label>
                  <input
                    type="text"
                    value={lendRateText}
                    onChange={(e) => setLendRateText(e.target.value)}
                    placeholder="e.g. ₹50 / week"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Default Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={lendDurationDays}
                    onChange={(e) => setLendDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            )}

            {exchangeMode === "DONATE" && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You are passing this on for FREE (₹0). You will earn community Eco-Impact credit!</span>
              </div>
            )}

            {/* 2. Basic Info */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Item & Academic Curriculum Details
              </label>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Omega Mini-Drafter with Dual Protractor Clamps"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    <option value="NEW">Brand New</option>
                    <option value="LIKE_NEW">Like New</option>
                    <option value="GOOD">Good Condition</option>
                    <option value="USABLE">Usable</option>
                  </select>
                </div>
              </div>

              {/* Branch & Semester */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {BRANCHES.filter((b) => b !== "All").map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Semester
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="Engineering Drawing"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="ME202"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Conditional Book ISBN & Edition */}
              {isBook && (
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1">
                      ISBN (10 or 13 digit)
                    </label>
                    <input
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      placeholder="978-0073523323"
                      className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs font-mono bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-indigo-950 mb-1">
                      Book Edition
                    </label>
                    <input
                      type="text"
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                      placeholder="6th Edition"
                      className="w-full px-3 py-2 rounded-xl border border-indigo-200 text-xs bg-white"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Condition Details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Detail clamp tightness, sheet marks, pencil notes, or accessories included..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* 3. Image Selection */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Choose Illustration / Photo
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {PRESET_IMAGES.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setImageUrl(img.url)}
                    className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      imageUrl === img.url
                        ? "border-indigo-600 ring-2 ring-indigo-400"
                        : "border-slate-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Campus Pickup Slot Builder */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  4. Predefined Safe Pickup Spots
                </label>
                <span className="text-[11px] text-slate-400">Select 2+ safe campus spots</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SAFE_SPOTS.map((spot) => {
                  const isChecked = selectedSpots.includes(spot);
                  return (
                    <button
                      key={spot}
                      type="button"
                      onClick={() => handleSpotToggle(spot)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 text-xs transition-all ${
                        isChecked
                          ? "bg-indigo-50/80 border-indigo-300 font-bold text-indigo-900"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded flex items-center justify-center text-white ${
                        isChecked ? "bg-indigo-600" : "border border-slate-300"
                      }`}>
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>
                      <span className="truncate">{spot}</span>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meetup Time Window
                </label>
                <input
                  type="text"
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value)}
                  placeholder="e.g. Mon-Fri 4:00 PM - 5:30 PM (after labs)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Publishing to Campus Catalog...</span>
                ) : (
                  <>
                    <PlusCircle className="w-4 h-4" />
                    <span>Publish Gear Listing</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Card Preview Column */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Live Catalog Preview</span>
          </div>

          <div className="max-w-md mx-auto">
            <ListingCard listing={previewListing} />
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-1.5">
            <p className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Campus Safety & Verified Student ID</span>
            </p>
            <p className="text-[11px] text-indigo-800 leading-relaxed">
              Your listing will be linked with your verified college enrollment number (<strong>{currentUser?.enrollmentNumber}</strong>). All handovers occur exclusively inside official campus zones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
