import type { Metadata } from "next";
import "./globals.css";
import { DemoUserProvider } from "@/context/DemoUserContext";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CampusGear | Campus-First Engineering Textbook & Lab Gear Exchange",
  description:
    "Semester-aware peer-to-peer textbook and engineering lab-gear exchange for Indian engineering colleges. Sell, lend, or donate mini-drafters, textbooks, notes, and lab tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        <DemoUserProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="bg-white border-t border-slate-200 py-6 mt-16 text-center text-xs text-slate-500">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">CampusGear</span>
                  <span>•</span>
                  <span>Campus-First Peer-to-Peer Academic Exchange</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <span>Semester-Aware Filtering</span>
                  <span>•</span>
                  <span>Safe Campus Pickup Points</span>
                  <span>•</span>
                  <span>Verified Student Trust Badges</span>
                </div>
              </div>
            </footer>
          </div>
        </DemoUserProvider>
      </body>
    </html>
  );
}
