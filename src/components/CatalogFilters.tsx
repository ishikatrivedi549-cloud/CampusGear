"use client";

import React from "react";
import { Search, Filter, RotateCcw, Check, Sparkles } from "lucide-react";

export interface FilterState {
  branch: string;
  semester: string;
  category: string;
  exchangeMode: string;
  condition: string;
  availableOnly: boolean;
  search: string;
}

interface CatalogFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const BRANCHES = ["All", "CSE", "Mechanical", "Civil", "ECE", "EEE", "IT"];
export const SEMESTERS = ["All", "1", "2", "3", "4", "5", "6", "7", "8"];
export const CATEGORIES = [
  "All",
  "Textbook",
  "Reference Book",
  "Lab Gear / Mini-Drafter",
  "Scientific Calculator",
  "Lab Coat",
  "Handwritten Notes",
  "Electronics Kit",
];
export const CONDITIONS = ["All", "NEW", "LIKE_NEW", "GOOD", "USABLE"];

export default function CatalogFilters({
  filters,
  onChange,
  onReset,
  totalResults,
}: CatalogFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const isAnyFilterActive =
    filters.branch !== "All" ||
    filters.semester !== "All" ||
    filters.category !== "All" ||
    filters.exchangeMode !== "All" ||
    filters.condition !== "All" ||
    filters.availableOnly ||
    filters.search !== "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs mb-8 space-y-5">
      {/* Search Bar + Available Now Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            placeholder="Search by title, subject (e.g. DBMS, Engineering Drawing), code (ME202, CS301), or ISBN..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50/50 hover:bg-white transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter("search", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Available Now Toggle Switch */}
        <label className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 cursor-pointer select-none hover:bg-slate-100 transition-colors">
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) => updateFilter("availableOnly", e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <span className="text-xs font-bold text-slate-800">
            Available Now Only
          </span>
        </label>

        {isAnyFilterActive && (
          <button
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Exchange Mode Selector Pills */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Exchange Mode
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => updateFilter("exchangeMode", "All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.exchangeMode === "All"
                ? "bg-slate-900 text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Modes
          </button>

          <button
            onClick={() => updateFilter("exchangeMode", "SELL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.exchangeMode === "SELL"
                ? "bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50"
                : "bg-amber-50 text-amber-800 border border-amber-200/60 hover:bg-amber-100"
            }`}
          >
            <span>💰 Sell</span>
            <span className="text-[10px] opacity-80">(Cash / UPI)</span>
          </button>

          <button
            onClick={() => updateFilter("exchangeMode", "LEND")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.exchangeMode === "LEND"
                ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-500/50"
                : "bg-blue-50 text-blue-800 border border-blue-200/60 hover:bg-blue-100"
            }`}
          >
            <span>⏱️ Lend / Rent</span>
            <span className="text-[10px] opacity-80">(Short-term)</span>
          </button>

          <button
            onClick={() => updateFilter("exchangeMode", "DONATE")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filters.exchangeMode === "DONATE"
                ? "bg-emerald-600 text-white shadow-md ring-2 ring-emerald-500/50"
                : "bg-emerald-50 text-emerald-800 border border-emerald-200/60 hover:bg-emerald-100"
            }`}
          >
            <span>🎁 Donate / Pass-on</span>
            <span className="text-[10px] opacity-80">(FREE for Juniors)</span>
          </button>
        </div>
      </div>

      {/* Grid of Multi-Attribute Dropdowns */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        {/* Branch Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Engineering Branch
          </label>
          <select
            value={filters.branch}
            onChange={(e) => updateFilter("branch", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {BRANCHES.map((b) => (
              <option key={b} value={b}>
                {b === "All" ? "All Branches" : `${b} Dept`}
              </option>
            ))}
          </select>
        </div>

        {/* Semester Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Semester (1–8)
          </label>
          <select
            value={filters.semester}
            onChange={(e) => updateFilter("semester", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {SEMESTERS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Semesters" : `Semester ${s}`}
              </option>
            ))}
          </select>
        </div>

        {/* Item Type / Category */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Gear / Item Type
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Item Types" : c}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Physical Condition
          </label>
          <select
            value={filters.condition}
            onChange={(e) => updateFilter("condition", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="All">Any Condition</option>
            <option value="NEW">Brand New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good Condition</option>
            <option value="USABLE">Usable</option>
          </select>
        </div>
      </div>

      {/* Results Count & Active Tags Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>
          Showing <strong className="text-slate-900 font-bold">{totalResults}</strong> campus gear listings
        </span>
        {isAnyFilterActive && (
          <span className="text-indigo-600 font-medium">
            Filters applied
          </span>
        )}
      </div>
    </div>
  );
}
