"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import NextLink from "next/link";
import { useDemoUser } from "@/context/DemoUserContext";
import { Listing, PickupSlot } from "@/types";
import { getConditionBadge, getCategoryIcon } from "@/components/ListingCard";
import ListingCard from "@/components/ListingCard";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  UserCheck,
  Star,
  Layers,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Share2,
  Flag,
  Send,
  Leaf,
  Info,
} from "lucide-react";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useDemoUser();

  const [listing, setListing] = useState<Listing | null>(null);
  const [recommendations, setRecommendations] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Request modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [customSlot, setCustomSlot] = useState<string>("");
  const [intendedReturnDate, setIntendedReturnDate] = useState<string>("");
  const [borrowerNote, setBorrowerNote] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [requestSuccess, setRequestSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Report modal state
  const [reportOpen, setReportOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>("");
  const [reportSuccess, setReportSuccess] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/listings/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setListing(data);
          if (data.pickupSlots && data.pickupSlots.length > 0) {
            setSelectedSlot(data.pickupSlots[0].locationName);
          }

          // Fetch frequently needed together items
          const recRes = await fetch(`/api/listings/${params.id}/frequently-needed`);
          if (recRes.ok) {
            const recData = await recRes.json();
            setRecommendations(recData);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDetails();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-96 bg-slate-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
            <div className="h-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Listing not found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          The requested engineering gear or book may have been removed or completed.
        </p>
        <NextLink
          href="/"
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Return to Catalog
        </NextLink>
      </div>
    );
  }

  const isOwner = currentUser ? currentUser.id === listing.ownerId : false;

  const handleOpenRequestModal = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setModalOpen(true);
  };

  // Handle Request Submit
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setErrorMessage("");
    setSubmitting(true);

    try {
      const pickupLocation = selectedSlot === "Other" ? customSlot : selectedSlot;
      const res = await fetch("/api/exchanges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          borrowerId: currentUser.id,
          pickupLocation: pickupLocation || "Central Library Entrance",
          pickupTimeWindow: "Mon-Fri 4:00 PM - 5:30 PM",
          intendedReturnDate: listing.exchangeMode === "LEND" ? intendedReturnDate : null,
          borrowerNote,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to submit exchange request");
      }

      setRequestSuccess(true);
      setTimeout(() => {
        router.push("/exchanges");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Report Submit
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportReason.trim() || !currentUser) {
      if (!currentUser) router.push("/login");
      return;
    }

    try {
      await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing.id,
          reporterId: currentUser.id,
          reason: reportReason,
        }),
      });
      setReportSuccess(true);
      setTimeout(() => {
        setReportOpen(false);
        setReportSuccess(false);
        setReportReason("");
      }, 1800);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <NextLink
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </NextLink>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Academic Highlights */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {/* Visual Header */}
            <div className="relative h-80 sm:h-96 w-full bg-gradient-to-br from-slate-100 to-indigo-50/60 flex items-center justify-center p-6">
              {listing.imageUrl ? (
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  className="w-full h-full object-contain drop-shadow-md rounded-xl"
                />
              ) : (
                <div className="w-28 h-28 rounded-3xl bg-white shadow-md border border-slate-200/80 flex items-center justify-center">
                  {getCategoryIcon(listing.category)}
                </div>
              )}

              {/* Mode badge overlay */}
              <div className="absolute top-4 left-4">
                {listing.exchangeMode === "DONATE" && (
                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-sm shadow-md">
                    🎁 FREE PASS-ON
                  </span>
                )}
                {listing.exchangeMode === "LEND" && (
                  <span className="px-3.5 py-1.5 rounded-full bg-blue-600 text-white font-extrabold text-sm shadow-md">
                    ⏱️ LEND: {listing.lendRateText || `₹${listing.priceInr}/week`}
                  </span>
                )}
                {listing.exchangeMode === "SELL" && (
                  <span className="px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-sm shadow-md">
                    💰 ₹{listing.priceInr} (Direct Buy)
                  </span>
                )}
              </div>

              {/* Condition tag */}
              <div className="absolute top-4 right-4">
                {getConditionBadge(listing.condition)}
              </div>
            </div>

            {/* Description and Detailed Specs */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 mb-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
                    {listing.branch} Engineering
                  </span>
                  <span>•</span>
                  <span>Semester {listing.semester}</span>
                  <span>•</span>
                  <span className="font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                    {listing.subjectCode}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                  {listing.title}
                </h1>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  Coursework: {listing.subjectName}
                </p>
              </div>

              {/* Item Description */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Owner Description & Physical Condition Notes
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Specification Grid */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Academic Specifications
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-400 font-medium">Category</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{listing.category}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-400 font-medium">Target Semester</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">Sem {listing.semester}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[11px] text-slate-400 font-medium">Physical State</p>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{listing.condition}</p>
                  </div>
                  {listing.isbn && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[11px] text-slate-400 font-medium">ISBN / Code</p>
                      <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{listing.isbn}</p>
                    </div>
                  )}
                  {listing.edition && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[11px] text-slate-400 font-medium">Edition</p>
                      <p className="text-xs font-bold text-slate-800 mt-0.5">{listing.edition}</p>
                    </div>
                  )}
                  {listing.exchangeMode === "LEND" && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                      <p className="text-[11px] text-blue-600 font-medium">Rental Rate</p>
                      <p className="text-xs font-bold text-blue-900 mt-0.5">{listing.lendRateText}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Predefined Campus Pickup Locations */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>Designated Safe Campus Pickup Points</span>
                </div>
                <div className="space-y-2">
                  {listing.pickupSlots && listing.pickupSlots.length > 0 ? (
                    listing.pickupSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-slate-800">
                            {slot.locationName}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {slot.timeWindow}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                      Central Library Entrance • Mon-Fri 4:00 PM - 5:30 PM
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Owner Trust Profile & Action Card */}
        <div className="lg:col-span-5 space-y-6">
          {/* Action Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 font-semibold">Terms</p>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {listing.exchangeMode === "DONATE" && "FREE (₹0)"}
                  {listing.exchangeMode === "LEND" && (listing.lendRateText || `₹${listing.priceInr}/week`)}
                  {listing.exchangeMode === "SELL" && `₹${listing.priceInr}`}
                </div>
              </div>

              {/* Status pill */}
              <div>
                {listing.status === "AVAILABLE" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available Now
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {listing.status}
                  </span>
                )}
              </div>
            </div>

            {/* Primary Action Button */}
            {isOwner ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <p className="text-xs font-bold text-slate-700">
                  You are the owner of this gear listing
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  You can view and approve incoming requests in your Exchanges dashboard.
                </p>
                <NextLink
                  href="/exchanges"
                  className="mt-3 inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                >
                  View Incoming Requests
                </NextLink>
              </div>
            ) : listing.status === "AVAILABLE" ? (
              <button
                onClick={handleOpenRequestModal}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Request & Schedule Pickup</span>
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3.5 rounded-2xl bg-slate-200 text-slate-500 font-bold text-sm cursor-not-allowed"
              >
                Currently {listing.status}
              </button>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Zero-cloud Local P2P</span>
              </span>
              <button
                onClick={() => setReportOpen(true)}
                className="hover:text-rose-600 transition-colors flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Gear</span>
              </button>
            </div>
          </div>

          {/* Owner Trust & Verification Profile */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Owner Trust & Academic Verification
            </h3>

            <div className="flex items-center gap-3.5">
              <img
                src={listing.owner?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80"}
                alt={listing.owner?.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 text-base">
                    {listing.owner?.name}
                  </h4>
                  {listing.owner?.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <UserCheck className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-indigo-700 font-medium">
                  {listing.owner?.branch} • {listing.owner?.currentSemester ? `Semester ${listing.owner.currentSemester}` : "Campus Faculty"}
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  {listing.owner?.enrollmentNumber} • {listing.owner?.email}
                </p>
              </div>
            </div>

            {/* Trust Stats Bar */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
              <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center justify-center gap-1 text-amber-600 font-extrabold text-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{listing.owner?.ratingAvg?.toFixed(1) || "5.0"}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Peer Rating</p>
              </div>

              <div className="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span className="text-indigo-700 font-extrabold text-sm">
                  {listing.owner?.completedExchanges || 0}
                </span>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Exchanges</p>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span className="text-emerald-700 font-extrabold text-sm">
                  ₹{listing.owner?.estimatedSavingsInr || 0}
                </span>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">Peer Savings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Frequently Needed Together" Strip */}
      <div className="mt-16 pt-8 border-t border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <h3 className="text-xl font-bold text-slate-900">
                Frequently Needed Together
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Curated coursework gear for <strong className="text-slate-800">{listing.branch} • Semester {listing.semester}</strong>
            </p>
          </div>

          <NextLink
            href={`/?branch=${listing.branch}&semester=${listing.semester}`}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            View all for Sem {listing.semester} →
          </NextLink>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendations.map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-xs text-slate-500">
            No other active gear listed yet for {listing.branch} Sem {listing.semester}.
          </div>
        )}
      </div>

      {/* Request / Reserve Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Send className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Request & Reserve Gear
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  ✕
                </button>
              </div>

              {requestSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Request Sent Successfully!
                  </h4>
                  <p className="text-xs text-slate-500">
                    Redirecting you to your Exchanges dashboard...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Summary of Gear */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      {getCategoryIcon(listing.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {listing.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {listing.exchangeMode === "DONATE" && "FREE Pass-on"}
                        {listing.exchangeMode === "LEND" && `Lend: ${listing.lendRateText}`}
                        {listing.exchangeMode === "SELL" && `Sell: ₹${listing.priceInr}`}
                        {" • "}Lender: {listing.owner?.name}
                      </p>
                    </div>
                  </div>

                  {/* Safe Pickup Location Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Select Safe Campus Pickup Point
                    </label>
                    <select
                      value={selectedSlot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
                      required
                    >
                      {listing.pickupSlots?.map((slot) => (
                        <option key={slot.id} value={slot.locationName}>
                          {slot.locationName} ({slot.timeWindow})
                        </option>
                      ))}
                      <option value="Central Library Entrance">
                        Central Library Entrance (Default Campus Safe Spot)
                      </option>
                      <option value="Main Canteen">
                        Main Canteen (Covered Pavilion)
                      </option>
                    </select>
                  </div>

                  {/* Intended Return Date (if LEND) */}
                  {listing.exchangeMode === "LEND" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Intended Return Date</span>
                        <span className="text-[10px] text-blue-600 font-semibold">
                          Default: 7 days
                        </span>
                      </label>
                      <input
                        type="date"
                        value={intendedReturnDate}
                        onChange={(e) => setIntendedReturnDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
                        required
                      />
                    </div>
                  )}

                  {/* Message / Note to Lender */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Note to {listing.owner?.name?.split(" ")[0]}
                    </label>
                    <textarea
                      value={borrowerNote}
                      onChange={(e) => setBorrowerNote(e.target.value)}
                      rows={2}
                      placeholder="e.g. Hi bhaiya, I will bring exact cash / UPI. See you after 4 PM lab!"
                      className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5"
                    >
                      {submitting ? "Sending..." : "Confirm Request"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1">Report Listing</h3>
            <p className="text-xs text-slate-500 mb-4">
              Help us keep the campus exchange safe from spam, inappropriate content, or damaged items.
            </p>

            {reportSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 text-xs text-center font-bold">
                Report sent to Campus Administrators. Thank you!
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-3">
                <textarea
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  rows={3}
                  placeholder="Describe the issue (e.g., incorrect branch/sem info, commercial resale, duplicate)..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
