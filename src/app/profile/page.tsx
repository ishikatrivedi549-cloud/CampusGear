"use client";

import React, { useState, useEffect } from "react";
import { useDemoUser } from "@/context/DemoUserContext";
import { Listing, Exchange } from "@/types";
import ListingCard from "@/components/ListingCard";
import NextLink from "next/link";
import {
  Leaf,
  ShieldCheck,
  UserCheck,
  Star,
  Calendar,
  Layers,
  ArrowRightLeft,
  Sparkles,
  BookOpen,
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export default function ProfilePage() {
  const { currentUser } = useDemoUser();

  const [userProfile, setUserProfile] = useState<any>(null);
  const [activeExchanges, setActiveExchanges] = useState<Exchange[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!currentUser) return;
    const loadProfile = async () => {
      setLoading(true);
      try {
        const [userRes, exchRes] = await Promise.all([
          fetch(`/api/users/${currentUser.id}`),
          fetch(`/api/exchanges?userId=${currentUser.id}`),
        ]);

        if (userRes.ok) {
          const u = await userRes.json();
          setUserProfile(u);
        }

        if (exchRes.ok) {
          const ex = await exchRes.json();
          setActiveExchanges(ex);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <h2 className="text-lg font-bold text-slate-800">Please Sign In</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Sign in with your institutional college email or pick a demo student to view your Eco-Impact profile.
        </p>
        <NextLink
          href="/login"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Go to Sign In / Demo Login
        </NextLink>
      </div>
    );
  }

  const activeUser = userProfile || currentUser;

  // Calculate environmental and campus circular metrics
  const itemsReused = activeUser.completedExchanges || 0;
  const totalSavedInr = activeUser.estimatedSavingsInr || 0;
  const treesSavedEstimate = (itemsReused * 0.4).toFixed(1);
  const co2AvoidedKg = (itemsReused * 3.8).toFixed(1);

  // Lend items return schedule
  const lendSchedule = activeExchanges.filter(
    (e) => e.exchangeMode === "LEND" && e.status === "PICKED_UP"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Verified Student ID Card & Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={activeUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80"}
              alt={activeUser.name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/10 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  {activeUser.name}
                </h1>
                {activeUser.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                    <UserCheck className="w-3.5 h-3.5" />
                    Verified Student ID
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    Verification Pending
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-indigo-700 mt-0.5">
                {activeUser.branch} Engineering • {activeUser.currentSemester > 0 ? `Semester ${activeUser.currentSemester}` : "Campus Faculty/Admin"}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-mono">
                <span>ID: {activeUser.enrollmentNumber}</span>
                <span>•</span>
                <span>{activeUser.email}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NextLink
              href="/listings/new"
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-100 transition-colors"
            >
              + Post More Gear
            </NextLink>
          </div>
        </div>
      </div>

      {/* 2. Eco-Impact Dashboard Strip */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-emerald-400/10 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-bold text-xs uppercase tracking-wider border border-emerald-400/20 flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" />
              Circular Campus Eco-Impact
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Your Contribution to Campus Gear Reusability
          </h2>
          <p className="text-xs text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            By passing on drafters, notes, and technical textbooks instead of letting them sit in hostel lockers, you reduce campus waste and make engineering education affordable.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <p className="text-emerald-300 text-xs font-semibold">Total ₹ Saved</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                ₹{totalSavedInr.toLocaleString("en-IN")}
              </p>
              <p className="text-[11px] text-emerald-200 mt-1">Saved for juniors</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <p className="text-emerald-300 text-xs font-semibold">Gear Reused</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                {itemsReused} items
              </p>
              <p className="text-[11px] text-emerald-200 mt-1">Kept in circulation</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <p className="text-emerald-300 text-xs font-semibold">CO₂ Offset</p>
              <p className="text-2xl sm:text-3xl font-black text-white mt-1">
                ~{co2AvoidedKg} kg
              </p>
              <p className="text-[11px] text-emerald-200 mt-1">Paper & metal savings</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
              <p className="text-emerald-300 text-xs font-semibold">Campus Trust</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {activeUser.ratingAvg?.toFixed(1) || "5.0"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 mt-1">From {activeUser.ratingCount || 0} peer reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Lending Return Calendar / Schedule */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Lending Return Calendar
              </h3>
              <p className="text-xs text-slate-500">
                Track return schedules for gear you are currently lending or borrowing
              </p>
            </div>
          </div>

          <NextLink
            href="/exchanges"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Manage in Exchanges →
          </NextLink>
        </div>

        {lendSchedule.length > 0 ? (
          <div className="space-y-3">
            {lendSchedule.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-blue-950 text-sm">
                      {item.listing?.title}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-200/60 text-blue-900 text-[10px] font-bold">
                      {item.lenderId === currentUser.id ? "Lent to Junior" : "Borrowed from Peer"}
                    </span>
                  </div>
                  <p className="text-blue-800 text-xs mt-1">
                    Meetup spot: {item.pickupLocation} ({item.pickupTimeWindow})
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] text-blue-600 font-bold uppercase">Return Due Date</p>
                    <p className="font-black text-blue-900 text-sm">
                      {item.intendedReturnDate
                        ? new Date(item.intendedReturnDate).toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Due next week"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
            No active gear currently pending return. You are all settled up!
          </div>
        )}
      </div>

      {/* 4. Peer Reviews & Received Ratings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Peer Reviews & Campus Endorsements</span>
        </h3>

        {activeUser.ratingsReceived && activeUser.ratingsReceived.length > 0 ? (
          <div className="space-y-3">
            {activeUser.ratingsReceived.map((rev: any) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.rater?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=80"}
                      alt={rev.rater?.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      {rev.rater?.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({rev.rater?.branch} Sem {rev.rater?.currentSemester})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.score}.0</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-2xl">
            No written peer reviews yet. Complete exchanges to build your campus trust profile!
          </p>
        )}
      </div>

      {/* 5. My Listed Gear */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-lg">
            My Gear Listings ({activeUser.listings?.length || 0})
          </h3>
          <NextLink
            href="/listings/new"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            + Post New Gear
          </NextLink>
        </div>

        {activeUser.listings && activeUser.listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeUser.listings.map((item: any) => (
              <ListingCard key={item.id} listing={{ ...item, owner: activeUser }} />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
            You haven&apos;t listed any gear yet. Have old mini-drafters, textbooks, or notes? Post them now!
          </div>
        )}
      </div>
    </div>
  );
}
