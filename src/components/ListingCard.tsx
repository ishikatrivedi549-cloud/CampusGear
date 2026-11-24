"use client";

import React from "react";
import NextLink from "next/link";
import { Listing } from "@/types";
import {
  BookOpen,
  Compass,
  Calculator,
  FileText,
  Cpu,
  Shirt,
  Layers,
  MapPin,
  Clock,
  UserCheck,
  Star,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

interface ListingCardProps {
  listing: Listing;
}

export function getCategoryIcon(category: string) {
  switch (category) {
    case "Lab Gear / Mini-Drafter":
      return <Compass className="w-4 h-4 text-indigo-600" />;
    case "Scientific Calculator":
      return <Calculator className="w-4 h-4 text-blue-600" />;
    case "Lab Coat":
      return <Shirt className="w-4 h-4 text-emerald-600" />;
    case "Handwritten Notes":
      return <FileText className="w-4 h-4 text-purple-600" />;
    case "Electronics Kit":
      return <Cpu className="w-4 h-4 text-amber-600" />;
    case "Textbook":
    case "Reference Book":
    default:
      return <BookOpen className="w-4 h-4 text-indigo-600" />;
  }
}

export function getConditionBadge(condition: string) {
  switch (condition) {
    case "NEW":
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Brand New
        </span>
      );
    case "LIKE_NEW":
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Like New
        </span>
      );
    case "GOOD":
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
          Good
        </span>
      );
    case "USABLE":
    default:
      return (
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Usable
        </span>
      );
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  // Format price & exchange badge
  const renderExchangeBadge = () => {
    if (listing.exchangeMode === "DONATE") {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white font-bold text-xs shadow-xs">
          <span>FREE</span>
          <span className="text-[10px] opacity-90 uppercase tracking-wide">• Pass-on</span>
        </div>
      );
    }
    if (listing.exchangeMode === "LEND") {
      return (
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-xs">
          <span>{listing.lendRateText || `₹${listing.priceInr}/wk`}</span>
          <span className="text-[10px] opacity-90 uppercase tracking-wide">• Lend</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-900 font-bold text-xs shadow-xs">
        <span>₹{listing.priceInr}</span>
        <span className="text-[10px] opacity-90 uppercase tracking-wide">• Sell</span>
      </div>
    );
  };

  // Status indicator
  const renderStatus = () => {
    if (listing.status === "AVAILABLE") {
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available Now</span>
        </div>
      );
    }
    if (listing.status === "RESERVED") {
      const timeLeft = listing.reservedUntil
        ? new Date(listing.reservedUntil).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "24h";
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Reserved (Hold til {timeLeft})</span>
        </div>
      );
    }
    if (listing.status === "LENT") {
      const returnDate = listing.lentUntil
        ? new Date(listing.lentUntil).toLocaleDateString([], { month: "short", day: "numeric" })
        : "Next week";
      return (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Lent until {returnDate}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
        <span>Completed</span>
      </div>
    );
  };

  const primaryLocation =
    listing.pickupSlots && listing.pickupSlots.length > 0
      ? listing.pickupSlots[0].locationName
      : "Central Library Entrance";

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden">
      {/* Top Banner / Image Area */}
      <div className="relative h-44 w-full bg-gradient-to-br from-slate-100 to-indigo-50/50 overflow-hidden flex items-center justify-center p-4">
        {listing.imageUrl ? (
          <img
            src={listing.imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center">
            {getCategoryIcon(listing.category)}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {renderExchangeBadge()}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {getConditionBadge(listing.condition)}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Academic Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold mb-1">
          <span className="px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100">
            {listing.branch}
          </span>
          <span>•</span>
          <span>Sem {listing.semester}</span>
          <span>•</span>
          <span className="font-mono text-slate-600">{listing.subjectCode}</span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-indigo-600 transition-colors">
          {listing.title}
        </h3>

        {/* Subject & Description */}
        <p className="text-xs text-slate-500 font-medium mt-1">
          {listing.subjectName}
        </p>

        <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
          {listing.description}
        </p>

        {/* Spacer */}
        <div className="my-3 border-t border-slate-100" />

        {/* Live Availability & Safe Pickup Spot */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">Status:</span>
            {renderStatus()}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">{primaryLocation}</span>
          </div>
        </div>

        {/* Footer: Owner Trust + Action Button */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={listing.owner?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=80"}
              alt={listing.owner?.name || "Peer"}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800">
                  {listing.owner?.name?.split(" ")[0]}
                </span>
                {listing.owner?.isVerified && (
                  <UserCheck className="w-3 h-3 text-blue-600" />
                )}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{listing.owner?.ratingAvg?.toFixed(1) || "5.0"}</span>
                <span className="text-slate-400 font-normal">
                  ({listing.owner?.completedExchanges || 0} exch)
                </span>
              </div>
            </div>
          </div>

          <NextLink
            href={`/listings/${listing.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white font-semibold text-xs transition-colors group/btn shadow-2xs"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </NextLink>
        </div>
      </div>
    </div>
  );
}
