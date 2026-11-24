"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useDemoUser } from "@/context/DemoUserContext";
import { BRANCHES } from "@/components/CatalogFilters";
import { validateCollegeEmail } from "@/lib/auth";
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Hash,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { loginUser } = useDemoUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [branch, setBranch] = useState("Mechanical");
  const [currentSemester, setCurrentSemester] = useState("2");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailDomainWarning, setEmailDomainWarning] = useState("");

  // Live real-time check when student types email
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val || !val.includes("@")) {
      setEmailDomainWarning("");
      return;
    }
    const check = validateCollegeEmail(val);
    if (!check.isValid) {
      setEmailDomainWarning(check.error || "Please use your institutional college email.");
    } else {
      setEmailDomainWarning("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    // Client-side domain check
    const check = validateCollegeEmail(email);
    if (!check.isValid) {
      setErrorMessage(check.error || "Please provide an official college email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          enrollmentNumber,
          branch,
          currentSemester: Number(currentSemester),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      // Log in user and redirect to catalog
      loginUser(data);
      router.push("/");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Side: Educational Trust Context */}
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
              <span className="text-[11px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-400/20">
                Institutional Access Only
              </span>
              <h2 className="text-2xl font-black text-white mt-2 leading-tight">
                Join Your College Academic Reuse Network
              </h2>
              <p className="text-xs text-indigo-200 mt-2 leading-relaxed">
                CampusGear requires verified engineering student credentials to keep textbooks, mini-drafters, and lab gear safe from commercial resellers.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Automatic Verification</p>
                  <p className="text-[11px] text-indigo-300">
                    Signing up with your institutional email grants immediate verified student ID status.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Safe Campus Spots Only</p>
                  <p className="text-[11px] text-indigo-300">
                    All handovers occur exclusively at Central Library, Canteen, or Dept notice boards.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">3 Exchange Modes</p>
                  <p className="text-[11px] text-indigo-300">
                    Sell, lend for weekly submissions, or donate free to juniors.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-indigo-800/60 relative z-10 text-[11px] text-indigo-300">
            Already registered?{" "}
            <NextLink href="/login" className="text-white font-bold underline underline-offset-2">
              Sign In to Your Account
            </NextLink>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
          <div className="mb-6">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Student Account
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Onboard with your college roll number and academic branch.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-start gap-2.5 mb-5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* College Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>College Email</span>
                <span className="text-[10px] text-indigo-600 font-semibold">
                  Must end in @college.edu.in or .ac.in
                </span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="e.g. yourname.me25@college.edu.in"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs font-medium focus:ring-2 focus:ring-indigo-500 ${
                    emailDomainWarning
                      ? "border-amber-400 bg-amber-50/30"
                      : "border-slate-200"
                  }`}
                  required
                />
              </div>

              {/* Dynamic warning banner if user types @gmail.com or @yahoo.com */}
              {emailDomainWarning && (
                <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-snug flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{emailDomainWarning}</span>
                </div>
              )}
            </div>

            {/* Enrollment / Roll Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Enrollment / Roll Number
              </label>
              <div className="relative">
                <Hash className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  placeholder="e.g. 2025ME042 or 24CS109"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-medium focus:ring-2 focus:ring-indigo-500 uppercase"
                  required
                />
              </div>
            </div>

            {/* Branch & Current Semester */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Engineering Branch
                </label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {BRANCHES.filter((b) => b !== "All").map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Semester
                </label>
                <select
                  value={currentSemester}
                  onChange={(e) => setCurrentSemester(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-2 gap-3">
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
                    placeholder="Min. 6 chars"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Registering Student Account...</span>
                ) : (
                  <>
                    <span>Complete Onboarding & Join CampusGear</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
