"use client";

import React, { useState, useEffect } from "react";
import { useDemoUser } from "@/context/DemoUserContext";
import {
  ShieldCheck,
  UserCheck,
  Flag,
  AlertTriangle,
  Check,
  X,
  Layers,
  Sparkles,
  MapPin,
  TrendingUp,
  RotateCcw,
  BookOpen,
} from "lucide-react";

export default function AdminPage() {
  const { currentUser, switchUser } = useDemoUser();

  const [stats, setStats] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string>("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, reportsRes, studentsRes, locRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/reports"),
        fetch("/api/admin/verify"),
        fetch("/api/pickup-locations"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
      if (studentsRes.ok) setStudents(await studentsRes.json());
      if (locRes.ok) setPickupLocations(await locRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isVerified: !currentStatus }),
      });
      if (res.ok) {
        setActionMessage("Student verification badge updated!");
        setTimeout(() => setActionMessage(""), 2000);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportAction = async (reportId: string, action: "DISMISS" | "REMOVE_LISTING") => {
    try {
      const res = await fetch("/api/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      });
      if (res.ok) {
        setActionMessage(
          action === "REMOVE_LISTING"
            ? "Listing removed and report resolved"
            : "Report dismissed"
        );
        setTimeout(() => setActionMessage(""), 2000);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/20">
                Campus Admin Console
              </span>
              <span className="text-xs text-slate-400 font-medium">Faculty Desk</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">
              CampusGear Administration & Safety Hub
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Verify student institutional IDs, monitor designated safe pickup points, and moderate gear listings.
            </p>
          </div>
        </div>

        {currentUser?.role !== "ADMIN" && (
          <button
            onClick={() => switchUser("usr_admin_fac0")}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900 flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Switch to Admin Account</span>
          </button>
        )}
      </div>

      {actionMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 1. Platform Statistics */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Total Listings</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {stats.totalListings}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {stats.availableListings} Available Now
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Active Exchanges</p>
            <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">
              {stats.activeExchanges}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {stats.completedExchanges} Completed
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Verified Students</p>
            <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {stats.verifiedStudents}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Out of {stats.totalUsers} registered
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-xs font-bold text-slate-400">Campus Savings</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              ₹{stats.totalSavingsInr?.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
              Saved for junior batches
            </p>
          </div>
        </div>
      )}

      {/* 2. Student ID Verification Management */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Student ID Verification Queue
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {students.filter((s) => s.isVerified).length} / {students.length} verified
          </span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {students.map((stu) => (
            <div
              key={stu.id}
              className="py-3 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <img
                  src={stu.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=80"}
                  alt={stu.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900 text-sm">{stu.name}</span>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({stu.enrollmentNumber})
                    </span>
                  </div>
                  <p className="text-slate-500">
                    {stu.branch} • Sem {stu.currentSemester} • {stu.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  stu.isVerified
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {stu.isVerified ? "Verified ID" : "Unverified"}
                </span>

                <button
                  onClick={() => handleToggleVerification(stu.id, stu.isVerified)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                    stu.isVerified
                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-xs"
                  }`}
                >
                  {stu.isVerified ? "Revoke Badge" : "Verify Student"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Reported Listings & Moderation */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Moderation & Reported Listings
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            {reports.filter((r) => r.status === "PENDING").length} pending reviews
          </span>
        </div>

        {reports.length === 0 ? (
          <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-2xl text-center">
            No reported listings currently in the queue. All campus gear adheres to guidelines.
          </p>
        ) : (
          <div className="space-y-3">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl border border-rose-100 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {rep.listing?.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold">
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Reported by: <strong>{rep.reporter?.name}</strong> • Reason: &ldquo;{rep.reason}&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Owner: {rep.listing?.owner?.name} ({rep.listing?.branch} Sem {rep.listing?.semester})
                  </p>
                </div>

                {rep.status === "PENDING" && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleReportAction(rep.id, "DISMISS")}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleReportAction(rep.id, "REMOVE_LISTING")}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs"
                    >
                      Remove Listing
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Predefined Safe Campus Pickup Points */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Approved Campus Safe Exchange Spots
            </h2>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            6 Designated Locations
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pickupLocations.map((loc) => (
            <div
              key={loc.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <p className="font-bold text-slate-900">{loc.name}</p>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px] pl-4">
                {loc.landmark}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
