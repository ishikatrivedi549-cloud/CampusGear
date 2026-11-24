"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useDemoUser } from "@/context/DemoUserContext";
import SemesterBanner from "@/components/SemesterBanner";
import CatalogFilters, { FilterState } from "@/components/CatalogFilters";
import ListingCard from "@/components/ListingCard";
import { Listing } from "@/types";
import {
  Sparkles,
  BookOpen,
  Compass,
  ArrowRight,
  PlusCircle,
  HelpCircle,
  PackageOpen,
} from "lucide-react";
import NextLink from "next/link";

export default function CatalogPage() {
  const { currentUser } = useDemoUser();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    branch: "All",
    semester: "All",
    category: "All",
    exchangeMode: "All",
    condition: "All",
    availableOnly: false,
    search: "",
  });

  const [isSemesterFiltered, setIsSemesterFiltered] = useState<boolean>(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize or update semester filter when demo user switches
  useEffect(() => {
    if (currentUser && currentUser.currentSemester > 0 && currentUser.role === "STUDENT") {
      setIsSemesterFiltered(true);
      setFilters((prev) => ({
        ...prev,
        branch: currentUser.branch,
        semester: String(currentUser.currentSemester),
      }));
    } else {
      setIsSemesterFiltered(false);
      setFilters((prev) => ({
        ...prev,
        branch: "All",
        semester: "All",
      }));
    }
  }, [currentUser?.id, currentUser?.branch, currentUser?.currentSemester, currentUser?.role]);

  // Fetch listings from API
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.branch !== "All") params.set("branch", filters.branch);
      if (filters.semester !== "All") params.set("semester", filters.semester);
      if (filters.category !== "All") params.set("category", filters.category);
      if (filters.exchangeMode !== "All") params.set("exchangeMode", filters.exchangeMode);
      if (filters.condition !== "All") params.set("condition", filters.condition);
      if (filters.availableOnly) params.set("availableOnly", "true");
      if (filters.search) params.set("search", filters.search);

      const res = await fetch(`/api/listings?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data);
      }
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Toggle semester intelligence filter
  const handleToggleSemesterFilter = () => {
    if (isSemesterFiltered) {
      // Toggle off to show all
      setIsSemesterFiltered(false);
      setFilters((prev) => ({
        ...prev,
        branch: "All",
        semester: "All",
      }));
    } else {
      // Toggle on to user's branch & sem
      if (!currentUser) return;
      setIsSemesterFiltered(true);
      setFilters((prev) => ({
        ...prev,
        branch: currentUser.branch,
        semester: String(currentUser.currentSemester || 1),
      }));
    }
  };

  const handleSelectQuickSubject = (subjectOrCode: string) => {
    setFilters((prev) => ({
      ...prev,
      search: subjectOrCode,
    }));
  };

  const handleResetFilters = () => {
    setIsSemesterFiltered(false);
    setFilters({
      branch: "All",
      semester: "All",
      category: "All",
      exchangeMode: "All",
      condition: "All",
      availableOnly: false,
      search: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Semester Intelligence Banner */}
      <SemesterBanner
        isSemesterFiltered={isSemesterFiltered}
        onToggleSemesterFilter={handleToggleSemesterFilter}
        onSelectQuickSubject={handleSelectQuickSubject}
      />

      {/* 2. Catalog Multi-Attribute Filter Bar */}
      <CatalogFilters
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        totalResults={listings.length}
      />

      {/* 3. Listings Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-80 bg-slate-200/60 rounded-2xl border border-slate-200"
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center mb-4">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            No matching campus gear found
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            Try adjusting your semester or branch filters, or be the first engineering student to post gear for this subject!
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Reset All Filters
            </button>
            <NextLink
              href="/listings/new"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-100 flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post This Gear</span>
            </NextLink>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <ListingCard key={item.id} listing={item} />
          ))}
        </div>
      )}

      {/* Bottom Academic Guide & Exchange Safeguards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <span className="text-lg font-bold">1</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">3 Exchange Modes</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Choose whether to <strong>Sell</strong> for cash/UPI, <strong>Lend</strong> for short-term lab sheet submissions, or <strong>Donate</strong> to pass on to juniors.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <span className="text-lg font-bold">2</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Predefined Safe Spots</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            All handovers take place exclusively at verified campus hubs (Central Library, Canteen, Dept Notice Boards) during daylight break windows.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <span className="text-lg font-bold">3</span>
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Dual Confirmation Stepper</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Both lender and borrower must physically inspect and acknowledge condition at handover. For lent items, returns are tracked until both confirm return.
          </p>
        </div>
      </div>
    </div>
  );
}
