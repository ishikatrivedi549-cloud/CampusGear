"use client";

import React from "react";
import { useDemoUser } from "@/context/DemoUserContext";
import { Sparkles, GraduationCap, Compass, BookOpen, Layers, CheckCircle, ArrowRight } from "lucide-react";

interface SemesterBannerProps {
  isSemesterFiltered: boolean;
  onToggleSemesterFilter: () => void;
  onSelectQuickSubject: (subject: string) => void;
}

export default function SemesterBanner({
  isSemesterFiltered,
  onToggleSemesterFilter,
  onSelectQuickSubject,
}: SemesterBannerProps) {
  const { currentUser } = useDemoUser();

  // If visitor is not logged in
  if (!currentUser) {
    return (
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-2xl p-6 mb-8 shadow-xl border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
            College Academic Exchange
          </span>
          <h2 className="text-2xl font-black text-white mt-1">
            Welcome to CampusGear
          </h2>
          <p className="text-xs text-indigo-200 mt-1 max-w-xl">
            Sign in with your official college email or use the 1-Click Demo Switcher in the navbar to test peer-to-peer exchanges for textbooks, mini-drafters, and lab essentials.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-colors"
          >
            Sign In / Demo Login
          </a>
          <a
            href="/signup"
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs border border-indigo-400/40 hover:bg-indigo-500 transition-colors"
          >
            Register Student ID
          </a>
        </div>
      </div>
    );
  }

  // If user is Admin (sem 0), show general campus admin overview banner
  if (currentUser.role === "ADMIN" || currentUser.currentSemester === 0) {
    return (
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 mb-8 shadow-lg border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold bg-indigo-500/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/20">
                  Campus Administrator View
                </span>
                <span className="text-xs text-slate-400">Faculty Desk</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-0.5">
                Campus-Wide Engineering Exchange Moderation
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Overseeing textbook reuse and engineering lab equipment handovers across all 8 semesters.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Branch & Semester specific hints
  const getSubjectTips = () => {
    if (currentUser.branch === "Mechanical" && currentUser.currentSemester === 2) {
      return {
        focus: "Engineering Drawing (ME202), Workshop Practice, & Applied Mathematics II",
        chips: ["Engineering Drawing", "Mini-Drafter", "Lab Coat", "ME202", "MA201"],
        highlight: "⚠️ Drafting sheet submissions require mini-drafters and imperial sheet containers this week!",
      };
    }
    if (currentUser.branch === "CSE" && currentUser.currentSemester === 3) {
      return {
        focus: "Database Management Systems (CS301) & Data Structures in C (CS302)",
        chips: ["DBMS", "CS301", "Korth", "Data Structures", "Handwritten Notes"],
        highlight: "💡 Senior toppers have uploaded complete handwritten notes & PYQ solutions for DBMS.",
      };
    }
    if (currentUser.branch === "ECE") {
      return {
        focus: "Digital Logic Design (EC301) & Microcontrollers (EC402)",
        chips: ["Digital Design", "Arduino Kit", "Soldering Kit", "EC301"],
        highlight: "⚡ Hardware breadboard kits and Arduino prototyping shields are available for 2-week lending.",
      };
    }
    return {
      focus: `${currentUser.branch} Department • Semester ${currentUser.currentSemester}`,
      chips: ["Textbooks", "Calculators", "Handwritten Notes"],
      highlight: "♻️ Reusing lab-gear directly saves your junior peers ₹2,000+ per semester.",
    };
  };

  const tips = getSubjectTips();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white rounded-2xl p-6 mb-8 shadow-xl border border-indigo-700/50">
      {/* Background decoration elements */}
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-6 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3" />
              Semester Intelligence
            </span>
            <span className="text-xs font-semibold text-indigo-200">
              Curated for {currentUser.name}
            </span>
          </div>

          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            Recommended for {currentUser.branch} • Semester {currentUser.currentSemester}
          </h2>

          <p className="text-sm text-indigo-100 font-medium leading-relaxed">
            {tips.focus}. {tips.highlight}
          </p>

          {/* Quick Subject Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs text-indigo-300 font-medium mr-1">Quick Filters:</span>
            {tips.chips.map((chip) => (
              <button
                key={chip}
                onClick={() => onSelectQuickSubject(chip)}
                className="text-xs px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-indigo-100 font-medium transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Action Toggle Button */}
        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onToggleSemesterFilter}
            className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md ${
              isSemesterFiltered
                ? "bg-white text-indigo-900 hover:bg-slate-100 ring-2 ring-white/50"
                : "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-400/30"
            }`}
          >
            {isSemesterFiltered ? (
              <>
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Showing My Semester Gear</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4 text-amber-300" />
                <span>Filter for My Semester</span>
              </>
            )}
          </button>

          {isSemesterFiltered && (
            <button
              onClick={onToggleSemesterFilter}
              className="text-xs text-indigo-200 hover:text-white underline underline-offset-4 font-semibold px-2"
            >
              View All Campus Gear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
