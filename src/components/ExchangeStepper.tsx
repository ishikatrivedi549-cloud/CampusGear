"use client";

import React from "react";
import { Exchange, ExchangeStatus } from "@/types";
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Package,
  RotateCcw,
} from "lucide-react";

interface ExchangeStepperProps {
  exchange: Exchange;
}

export default function ExchangeStepper({ exchange }: ExchangeStepperProps) {
  const isLend = exchange.exchangeMode === "LEND";

  // Stages definition
  const stages = isLend
    ? [
        { key: "REQUESTED", title: "1. Requested", desc: "Borrower submitted meetup slot" },
        { key: "APPROVED", title: "2. Approved & Hold", desc: "24h reservation lock" },
        { key: "PICKED_UP", title: "3. Handover Confirmed", desc: "Dual inspection complete" },
        { key: "IN_USE", title: "4. In Use / Return Due", desc: "Gear actively lent" },
        { key: "COMPLETED", title: "5. Returned & Complete", desc: "Returned & rated" },
      ]
    : [
        { key: "REQUESTED", title: "1. Requested", desc: "Request submitted" },
        { key: "APPROVED", title: "2. Approved & Hold", desc: "24h reservation lock" },
        { key: "PICKED_UP", title: "3. Dual Handover", desc: "Inspection confirmed" },
        { key: "COMPLETED", title: "4. Completed", desc: "Exchange finalized & rated" },
      ];

  const getStepStatus = (index: number) => {
    // Determine active index
    let activeIdx = 0;
    if (exchange.status === "REQUESTED") activeIdx = 0;
    else if (exchange.status === "APPROVED") activeIdx = 1;
    else if (exchange.status === "PICKED_UP") activeIdx = isLend ? 2 : 2;
    else if (exchange.status === "RETURNED" || exchange.status === "COMPLETED") {
      activeIdx = isLend ? 4 : 3;
    }

    if (exchange.status === "CANCELLED" || exchange.status === "REJECTED") {
      return "failed";
    }

    if (index < activeIdx) return "completed";
    if (index === activeIdx) return "current";
    return "upcoming";
  };

  return (
    <div className="py-4">
      {/* Visual Step Progress Bar */}
      <div className="relative">
        <div className="hidden sm:flex items-center justify-between mb-4">
          {stages.map((step, idx) => {
            const status = getStepStatus(idx);
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center relative">
                {/* Horizontal connector line */}
                {idx !== 0 && (
                  <div
                    className={`absolute top-4 -left-1/2 w-full h-1 -z-0 transition-colors ${
                      status === "completed" || status === "current"
                        ? "bg-indigo-600"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                {/* Circle Icon Indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-all ${
                    status === "completed"
                      ? "bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100"
                      : status === "current"
                      ? "bg-indigo-600 text-white shadow-lg ring-4 ring-indigo-100 animate-pulse"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {status === "completed" ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                {/* Label */}
                <p className={`text-xs font-bold mt-2 text-center ${
                  status === "current"
                    ? "text-indigo-900"
                    : status === "completed"
                    ? "text-slate-800"
                    : "text-slate-400"
                }`}>
                  {step.title}
                </p>
                <p className="text-[10px] text-slate-500 text-center hidden md:block max-w-[100px]">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
