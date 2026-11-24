"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useDemoUser, PRESET_DEMO_USERS } from "@/context/DemoUserContext";
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, switchUser } = useDemoUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      loginUser(data);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (userId: string) => {
    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ demoUserId: userId }),
      });

      const data = await res.json();
      if (res.ok) {
        loginUser(data);
        await switchUser(userId);
        router.push("/");
      } else {
        throw new Error(data.error || "Demo login failed");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Could not log in as demo user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Branding & 1-Click Evaluator Hub */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl border border-indigo-800/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Campus<span className="text-indigo-400">Gear</span>
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 w-max">
                <Sparkles className="w-3 h-3" />
                Evaluator Demo Switch
              </span>
              <h2 className="text-2xl font-black text-white mt-2 leading-tight">
                Peer-to-Peer Academic Lab-Gear Exchange
              </h2>
              <p className="text-xs text-indigo-200 mt-2 leading-relaxed">
                Experience curriculum-aware filtering, 3 mini-drafter exchange modes, dual-confirmation handovers, and return flows.
              </p>
            </div>

            {/* 1-Click Demo Logins */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>1-Click Evaluator Access</span>
              </p>
              <div className="space-y-2">
                {PRESET_DEMO_USERS.slice(0, 4).map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleDemoLogin(account.id)}
                    className="w-full p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-left flex items-center gap-3 transition-colors group"
                  >
                    <img
                      src={account.user.avatarUrl || ""}
                      alt={account.label}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-400"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          {account.label}
                        </span>
                        <ArrowRight className="w-3 h-3 text-indigo-300 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[10px] text-indigo-200 truncate">
                        {account.roleDescription}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-indigo-800/60 relative z-10 text-[11px] text-indigo-300">
            First time student?{" "}
            <NextLink href="/signup" className="text-white font-bold underline underline-offset-2">
              Create College Account
            </NextLink>
          </div>
        </div>

        {/* Right: Standard College Credential Login */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sign In to CampusGear
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Enter your college email address to manage your exchanges and gear.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 mb-5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleStandardLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                College Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rohan.me25@college.edu.in"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password (default: campus123)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>For pre-seeded student accounts, the default password is <strong>campus123</strong>.</span>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Student Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New engineering student joining campus?{" "}
              <NextLink
                href="/signup"
                className="text-indigo-600 hover:text-indigo-800 font-bold underline underline-offset-2"
              >
                Sign Up with College Email
              </NextLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
