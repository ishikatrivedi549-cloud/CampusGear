"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import NextLink from "next/link";
import { useDemoUser } from "@/context/DemoUserContext";
import {
  GraduationCap,
  ArrowRightLeft,
  PlusCircle,
  ShieldCheck,
  Leaf,
  ChevronDown,
  UserCheck,
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    currentAccountId,
    switchUser,
    availableAccounts,
    logoutUser,
    isAuthenticated,
  } = useDemoUser();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeExchangesCount, setActiveExchangesCount] = useState<number>(0);

  // Fetch count of active exchanges for current user
  useEffect(() => {
    if (!currentUser) {
      setActiveExchangesCount(0);
      return;
    }
    const fetchActiveCount = async () => {
      try {
        const res = await fetch(`/api/exchanges?userId=${currentUser.id}`);
        if (res.ok) {
          const list = await res.json();
          const active = list.filter((e: any) =>
            ["REQUESTED", "APPROVED", "PICKED_UP"].includes(e.status)
          );
          setActiveExchangesCount(active.length);
        }
      } catch (e) {
        // quiet
      }
    };

    fetchActiveCount();
    const interval = setInterval(fetchActiveCount, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await logoutUser();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top micro-bar for quick demo context */}
      <div className="bg-indigo-900 text-indigo-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {currentUser ? (
            <span className="font-medium text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Active Student: <strong className="text-white">{currentUser.name}</strong> ({currentUser.branch} {currentUser.currentSemester > 0 ? `• Sem ${currentUser.currentSemester}` : "• Admin"})
            </span>
          ) : (
            <span className="font-medium text-indigo-200 flex items-center gap-1.5">
              <span>Visitor Mode: Sign in with your college institutional email or pick a demo persona.</span>
            </span>
          )}
          <span className="hidden sm:inline text-indigo-300 text-[11px] ml-auto">
            💡 Fast Demo Switcher available in top-right dropdown
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <NextLink href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Campus<span className="text-indigo-600">Gear</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                  Campus-P2P
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium -mt-0.5">
                Engineering Academic Gear & Book Exchange
              </p>
            </div>
          </NextLink>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NextLink
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                pathname === "/"
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              Catalog
            </NextLink>

            <NextLink
              href="/exchanges"
              className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                pathname.startsWith("/exchanges")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Exchanges</span>
              {activeExchangesCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-amber-500 text-white rounded-full">
                  {activeExchangesCount}
                </span>
              )}
            </NextLink>

            <NextLink
              href="/listings/new"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                pathname.startsWith("/listings/new")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <PlusCircle className="w-4 h-4 text-indigo-600" />
              <span>Post Gear</span>
            </NextLink>

            <NextLink
              href="/profile"
              className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                pathname.startsWith("/profile")
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span>Eco-Impact & Profile</span>
            </NextLink>

            <NextLink
              href="/admin"
              className={`px-3 py-1.5 ml-1 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
                pathname.startsWith("/admin")
                  ? "bg-slate-900 text-white border-slate-900"
                  : "text-slate-700 bg-slate-100 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              <span>Campus Admin</span>
            </NextLink>
          </nav>

          {/* Right Action: Logged In User Dropdown OR Sign In / Demo Switch Button */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all bg-white"
                >
                  <img
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80"}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="flex items-center gap-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                        {currentUser.name}
                      </p>
                      {currentUser.isVerified && (
                        <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {currentUser.branch} {currentUser.currentSemester > 0 ? `• Sem ${currentUser.currentSemester}` : "• Admin"}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Quick Demo Switch
                          </p>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                            Evaluator Mode
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Switch role to test lender & borrower handovers:
                        </p>
                      </div>

                      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                        {availableAccounts.map((account) => {
                          const isSelected = account.id === currentAccountId;
                          return (
                            <button
                              key={account.id}
                              onClick={() => {
                                switchUser(account.id);
                                setDropdownOpen(false);
                              }}
                              className={`w-full px-4 py-2 text-left flex items-start gap-3 hover:bg-indigo-50/60 transition-colors ${
                                isSelected ? "bg-indigo-50/80 font-medium" : ""
                              }`}
                            >
                              <img
                                src={account.user.avatarUrl || ""}
                                alt={account.label}
                                className={`w-8 h-8 rounded-full object-cover mt-0.5 ring-2 ${
                                  isSelected ? "ring-indigo-600" : "ring-slate-200"
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-900 truncate">
                                    {account.label}
                                  </span>
                                  {isSelected && (
                                    <span className="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-indigo-700 font-medium">
                                  {account.roleDescription}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Sign Out / Switch Account Button */}
                      <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-xl space-y-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center justify-center gap-2 transition-colors border border-rose-200/60"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out / Switch Account</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NextLink
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sign In</span>
                </NextLink>

                <NextLink
                  href="/signup"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </NextLink>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile navigation bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 py-2 bg-white text-xs font-medium text-slate-600">
        <NextLink href="/" className={`flex flex-col items-center gap-1 ${pathname === "/" ? "text-indigo-600 font-bold" : ""}`}>
          <GraduationCap className="w-5 h-5" />
          <span>Catalog</span>
        </NextLink>
        <NextLink href="/exchanges" className={`relative flex flex-col items-center gap-1 ${pathname.startsWith("/exchanges") ? "text-indigo-600 font-bold" : ""}`}>
          <ArrowRightLeft className="w-5 h-5" />
          <span>Exchanges</span>
          {activeExchangesCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeExchangesCount}
            </span>
          )}
        </NextLink>
        <NextLink href="/listings/new" className={`flex flex-col items-center gap-1 ${pathname.startsWith("/listings/new") ? "text-indigo-600 font-bold" : ""}`}>
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          <span>Post Gear</span>
        </NextLink>
        <NextLink href="/profile" className={`flex flex-col items-center gap-1 ${pathname.startsWith("/profile") ? "text-indigo-600 font-bold" : ""}`}>
          <Leaf className="w-5 h-5 text-emerald-600" />
          <span>Impact</span>
        </NextLink>
        <NextLink href="/admin" className={`flex flex-col items-center gap-1 ${pathname.startsWith("/admin") ? "text-indigo-600 font-bold" : ""}`}>
          <ShieldCheck className="w-5 h-5 text-slate-700" />
          <span>Admin</span>
        </NextLink>
      </div>
    </header>
  );
}
