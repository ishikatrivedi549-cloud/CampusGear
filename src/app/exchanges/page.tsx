"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDemoUser } from "@/context/DemoUserContext";
import { Exchange, ExchangeStatus } from "@/types";
import ExchangeStepper from "@/components/ExchangeStepper";
import RatingModal from "@/components/RatingModal";
import { getCategoryIcon } from "@/components/ListingCard";
import NextLink from "next/link";
import {
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  ThumbsUp,
  Star,
  ShieldCheck,
  RotateCcw,
  User,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

export default function ExchangesPage() {
  const { currentUser, refreshUserStats } = useDemoUser();

  const [activeTab, setActiveTab] = useState<"all" | "borrowing" | "lending">("all");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Condition checklist states per exchange
  const [checklistAcknowledge, setChecklistAcknowledge] = useState<Record<string, boolean>>({});

  // Rating modal state
  const [ratingExchange, setRatingExchange] = useState<Exchange | null>(null);

  // Fetch exchanges for the active demo user
  const fetchExchanges = useCallback(async () => {
    if (!currentUser) {
      setExchanges([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/exchanges?userId=${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setExchanges(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchExchanges();
  }, [fetchExchanges]);

  // Handle State Machine Actions
  const handleAction = async (exchangeId: string, action: string, extraData: any = {}) => {
    if (!currentUser) return;
    setActionLoadingId(exchangeId);
    try {
      const res = await fetch(`/api/exchanges/${exchangeId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          userId: currentUser.id,
          ...extraData,
        }),
      });

      if (res.ok) {
        await fetchExchanges();
        await refreshUserStats();
      }
    } catch (err) {
      console.error("Action failed:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Submit Rating
  const handleRatingSubmit = async (score: number, comment: string) => {
    if (!ratingExchange || !currentUser) return;
    try {
      await fetch(`/api/exchanges/${ratingExchange.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "RATE",
          userId: currentUser.id,
          score,
          comment,
        }),
      });
      await fetchExchanges();
      await refreshUserStats();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter exchanges by active tab
  const filteredExchanges = currentUser
    ? exchanges.filter((ex) => {
        if (activeTab === "borrowing") return ex.borrowerId === currentUser.id;
        if (activeTab === "lending") return ex.lenderId === currentUser.id;
        return true;
      })
    : [];

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4">
          <ArrowRightLeft className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">Sign In to Track Exchanges</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Sign in with your college email or choose a demo persona to view and confirm peer-to-peer handovers.
        </p>
        <NextLink
          href="/login"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-100"
        >
          Sign In / Demo Login
        </NextLink>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Campus Handover & Return Tracker
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Dual-confirmation state machine ensuring safe handovers and punctual returns across campus.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Switcher Quick Tip */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2 text-xs text-amber-900 max-w-md">
          <p className="font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Testing Dual Confirmation?
          </p>
          <p className="text-[11px] text-amber-800 mt-0.5">
            Confirm on this account, then use the top navbar to switch to the peer account and confirm their side!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "all"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          All Activity ({exchanges.length})
        </button>
        <button
          onClick={() => setActiveTab("borrowing")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "borrowing"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Borrowing / Buying ({exchanges.filter((e) => e.borrowerId === currentUser.id).length})
        </button>
        <button
          onClick={() => setActiveTab("lending")}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === "lending"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Lending / Passing On ({exchanges.filter((e) => e.lenderId === currentUser.id).length})
        </button>
      </div>

      {/* Exchanges List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-slate-200/60 rounded-3xl border border-slate-200" />
          ))}
        </div>
      ) : filteredExchanges.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-3">
            <ArrowRightLeft className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No exchanges found in this tab</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Request an engineering textbook or mini-drafter from the catalog to see live lifecycle progress here.
          </p>
          <NextLink
            href="/"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
          >
            Browse Campus Catalog
          </NextLink>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExchanges.map((exchange) => {
            const isLender = exchange.lenderId === currentUser.id;
            const isBorrower = exchange.borrowerId === currentUser.id;
            const peer = isLender ? exchange.borrower : exchange.lender;
            const isLendMode = exchange.exchangeMode === "LEND";
            const isLoading = actionLoadingId === exchange.id;
            const checklistChecked = checklistAcknowledge[exchange.id] ?? false;

            // Check if user already rated
            const userAlreadyRated = exchange.ratings?.some(
              (r) => r.raterId === currentUser.id
            );

            return (
              <div
                key={exchange.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-all space-y-5"
              >
                {/* Header Row: Gear Title + Role Badge + Status Tag */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0">
                      {getCategoryIcon(exchange.listing?.category || "")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <NextLink
                          href={`/listings/${exchange.listingId}`}
                          className="font-extrabold text-slate-900 text-base hover:text-indigo-600 transition-colors flex items-center gap-1"
                        >
                          <span>{exchange.listing?.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </NextLink>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                        <span className="font-semibold text-indigo-700">
                          {exchange.listing?.branch} • Sem {exchange.listing?.semester}
                        </span>
                        <span>•</span>
                        <span>
                          {exchange.exchangeMode === "DONATE" && "FREE Pass-on"}
                          {exchange.exchangeMode === "LEND" && `Lend: ${exchange.listing?.lendRateText || "₹50/wk"}`}
                          {exchange.exchangeMode === "SELL" && `Sell: ₹${exchange.listing?.priceInr}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Role indicator */}
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isLender
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {isLender ? "You are Lender / Owner" : "You are Borrower / Buyer"}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-slate-900 text-white">
                      {exchange.status}
                    </span>
                  </div>
                </div>

                {/* 5-Step Visual Stepper */}
                <ExchangeStepper exchange={exchange} />

                {/* Handover Details Strip (Pickup Location & Meeting Time) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Safe Pickup Spot</p>
                      <p className="font-bold text-slate-800">{exchange.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">Meeting Window</p>
                      <p className="font-bold text-slate-800">{exchange.pickupTimeWindow}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-slate-400 text-[10px] uppercase font-bold">
                        {isLender ? "Borrower" : "Lender"}
                      </p>
                      <p className="font-bold text-slate-800">
                        {peer?.name} ({peer?.branch} Sem {peer?.currentSemester})
                      </p>
                    </div>
                  </div>
                </div>

                {/* If there's an intended return date for LEND */}
                {isLendMode && exchange.intendedReturnDate && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>
                        Return Due Date:{" "}
                        <strong>
                          {new Date(exchange.intendedReturnDate).toLocaleDateString([], {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </strong>
                      </span>
                    </div>
                    {exchange.status === "PICKED_UP" && (
                      <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                        Active In-Use
                      </span>
                    )}
                  </div>
                )}

                {/* Note from Borrower */}
                {exchange.borrowerNote && (
                  <div className="text-xs text-slate-600 italic bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                    &ldquo;{exchange.borrowerNote}&rdquo;
                  </div>
                )}

                {/* State Machine Action Console */}
                <div className="pt-2 border-t border-slate-100">
                  {/* STAGE 1: REQUESTED */}
                  {exchange.status === "REQUESTED" && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      {isLender ? (
                        <>
                          <div className="text-xs text-slate-600">
                            <strong>{peer?.name}</strong> has requested this gear. Approving will lock a <strong>24-hour reservation hold</strong> so no one else can request it.
                          </div>
                          <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleAction(exchange.id, "DECLINE")}
                              disabled={isLoading}
                              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50"
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAction(exchange.id, "APPROVE")}
                              disabled={isLoading}
                              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100"
                            >
                              {isLoading ? "Locking..." : "Approve & Reserve (24h)"}
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          <p className="text-xs text-slate-500">
                            ⏳ Waiting for lender <strong>{peer?.name}</strong> to approve your meetup request...
                          </p>
                          <button
                            onClick={() => handleAction(exchange.id, "CANCEL")}
                            disabled={isLoading}
                            className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                          >
                            Cancel Request
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STAGE 2: APPROVED / RESERVED (24h Hold) -> DUAL CONFIRMATION HANDOVER */}
                  {exchange.status === "APPROVED" && (
                    <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-indigo-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          Dual-Confirmation Handover Protocol
                        </span>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          24h Reservation Active
                        </span>
                      </div>

                      {/* Confirmation checklist status */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          exchange.lenderConfirmedHandover
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}>
                          <CheckCircle2 className={`w-4 h-4 ${
                            exchange.lenderConfirmedHandover ? "text-emerald-600" : "text-slate-300"
                          }`} />
                          <span>
                            Lender ({exchange.lender?.name?.split(" ")[0]}):{" "}
                            {exchange.lenderConfirmedHandover ? "Confirmed Handover" : "Pending Confirmation"}
                          </span>
                        </div>

                        <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          exchange.borrowerConfirmedHandover
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}>
                          <CheckCircle2 className={`w-4 h-4 ${
                            exchange.borrowerConfirmedHandover ? "text-emerald-600" : "text-slate-300"
                          }`} />
                          <span>
                            Borrower ({exchange.borrower?.name?.split(" ")[0]}):{" "}
                            {exchange.borrowerConfirmedHandover ? "Confirmed Received" : "Pending Confirmation"}
                          </span>
                        </div>
                      </div>

                      {/* Interactive confirmation button for active user */}
                      {((isLender && !exchange.lenderConfirmedHandover) ||
                        (isBorrower && !exchange.borrowerConfirmedHandover)) ? (
                        <div className="pt-2 space-y-2">
                          <label className="flex items-start gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checklistChecked}
                              onChange={(e) =>
                                setChecklistAcknowledge((prev) => ({
                                  ...prev,
                                  [exchange.id]: e.target.checked,
                                }))
                              }
                              className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300"
                            />
                            <span className="text-xs text-slate-700 leading-snug">
                              I have met up at <strong>{exchange.pickupLocation}</strong>, physically inspected the physical condition, and acknowledge handover.
                            </span>
                          </label>

                          <button
                            onClick={() =>
                              handleAction(exchange.id, "CONFIRM_HANDOVER", {
                                conditionAcknowledged: checklistChecked,
                              })
                            }
                            disabled={!checklistChecked || isLoading}
                            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 ${
                              checklistChecked
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>
                              {isLender
                                ? "Confirm Handover & Release to Junior"
                                : "Confirm Received Gear & Condition OK"}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-indigo-800 font-medium">
                          ✓ You have confirmed your side. Waiting for {peer?.name} to tap confirm on their account.
                        </p>
                      )}
                    </div>
                  )}

                  {/* STAGE 3: PICKED_UP (For Lend items) -> RETURN DUAL CONFIRMATION */}
                  {exchange.status === "PICKED_UP" && isLendMode && (
                    <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-blue-900 flex items-center gap-1.5">
                          <RotateCcw className="w-4 h-4 text-blue-600" />
                          Return & Inspection Dual-Confirmation
                        </span>
                        <span className="text-[11px] font-bold text-blue-800 bg-white px-2 py-0.5 rounded shadow-2xs">
                          Lend in Progress
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          exchange.lenderConfirmedReturn
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}>
                          <CheckCircle2 className={`w-4 h-4 ${
                            exchange.lenderConfirmedReturn ? "text-emerald-600" : "text-slate-300"
                          }`} />
                          <span>
                            Lender ({exchange.lender?.name?.split(" ")[0]}):{" "}
                            {exchange.lenderConfirmedReturn ? "Return Confirmed" : "Pending Return Inspection"}
                          </span>
                        </div>

                        <div className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                          exchange.borrowerConfirmedReturn
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold"
                            : "bg-white border-slate-200 text-slate-600"
                        }`}>
                          <CheckCircle2 className={`w-4 h-4 ${
                            exchange.borrowerConfirmedReturn ? "text-emerald-600" : "text-slate-300"
                          }`} />
                          <span>
                            Borrower ({exchange.borrower?.name?.split(" ")[0]}):{" "}
                            {exchange.borrowerConfirmedReturn ? "Returned to Lender" : "Pending Handback"}
                          </span>
                        </div>
                      </div>

                      {/* Action to confirm return */}
                      {((isLender && !exchange.lenderConfirmedReturn) ||
                        (isBorrower && !exchange.borrowerConfirmedReturn)) ? (
                        <div className="pt-2">
                          <button
                            onClick={() => handleAction(exchange.id, "CONFIRM_RETURN")}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-100 flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {isLender
                                ? "Confirm Gear Returned in Good Condition"
                                : "Confirm Handed Back to Owner"}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-blue-800 font-medium">
                          ✓ You confirmed return. Waiting for {peer?.name} to confirm inspection.
                        </p>
                      )}
                    </div>
                  )}

                  {/* STAGE 4: COMPLETED -> RATING & SAVINGS BANNER */}
                  {exchange.status === "COMPLETED" && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <div>
                        <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Exchange Successfully Completed!</span>
                        </p>
                        <p className="text-[11px] text-emerald-700 mt-0.5">
                          Eco-Impact updated: Added ₹{exchange.listing?.priceInr || 450} to community campus savings.
                        </p>
                      </div>

                      <div>
                        {userAlreadyRated ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>Rated ★</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setRatingExchange(exchange)}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                            <span>Rate {peer?.name?.split(" ")[0]}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STAGE: CANCELLED OR REJECTED */}
                  {(exchange.status === "CANCELLED" || exchange.status === "REJECTED") && (
                    <div className="p-3 rounded-2xl bg-slate-100 text-slate-600 text-xs">
                      Exchange was {exchange.status.toLowerCase()}. Item was automatically restored to the campus catalog.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Peer Rating Modal */}
      {ratingExchange && (
        <RatingModal
          isOpen={Boolean(ratingExchange)}
          onClose={() => setRatingExchange(null)}
          onSubmit={handleRatingSubmit}
          targetUserName={
            ratingExchange.lenderId === currentUser.id
              ? ratingExchange.borrower?.name || "Peer"
              : ratingExchange.lender?.name || "Peer"
          }
          itemTitle={ratingExchange.listing?.title || "Gear"}
        />
      )}
    </div>
  );
}
