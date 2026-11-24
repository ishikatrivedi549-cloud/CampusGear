"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";

export interface DemoAccount {
  id: string;
  label: string;
  roleDescription: string;
  user: User;
}

export const PRESET_DEMO_USERS: DemoAccount[] = [
  {
    id: "usr_rohan_me2",
    label: "Rohan Sharma",
    roleDescription: "2nd-Sem Mechanical Junior",
    user: {
      id: "usr_rohan_me2",
      name: "Rohan Sharma",
      email: "rohan.me25@college.edu.in",
      enrollmentNumber: "2025ME042",
      branch: "Mechanical",
      currentSemester: 2,
      isVerified: true,
      ratingAvg: 4.9,
      ratingCount: 5,
      completedExchanges: 3,
      estimatedSavingsInr: 1200,
      role: "STUDENT",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "usr_aarav_me8",
    label: "Aarav Patel",
    roleDescription: "4th-Year Mechanical Senior",
    user: {
      id: "usr_aarav_me8",
      name: "Aarav Patel",
      email: "aarav.me22@college.edu.in",
      enrollmentNumber: "2022ME009",
      branch: "Mechanical",
      currentSemester: 8,
      isVerified: true,
      ratingAvg: 5.0,
      ratingCount: 14,
      completedExchanges: 14,
      estimatedSavingsInr: 9400,
      role: "STUDENT",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "usr_priya_cs3",
    label: "Priya Iyer",
    roleDescription: "3rd-Sem CSE Student",
    user: {
      id: "usr_priya_cs3",
      name: "Priya Iyer",
      email: "priya.cs24@college.edu.in",
      enrollmentNumber: "2024CS088",
      branch: "CSE",
      currentSemester: 3,
      isVerified: true,
      ratingAvg: 4.8,
      ratingCount: 7,
      completedExchanges: 6,
      estimatedSavingsInr: 3850,
      role: "STUDENT",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "usr_admin_fac0",
    label: "Prof. / Admin Sharma",
    roleDescription: "Campus Admin / Faculty Desk",
    user: {
      id: "usr_admin_fac0",
      name: "Prof. / Admin Sharma",
      email: "admin.gear@college.edu.in",
      enrollmentNumber: "FAC2021ADMIN",
      branch: "CSE",
      currentSemester: 0,
      isVerified: true,
      ratingAvg: 5.0,
      ratingCount: 42,
      completedExchanges: 42,
      estimatedSavingsInr: 25000,
      role: "ADMIN",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "usr_ananya_ec4",
    label: "Ananya Gupta",
    roleDescription: "4th-Sem ECE Student",
    user: {
      id: "usr_ananya_ec4",
      name: "Ananya Gupta",
      email: "ananya.ec24@college.edu.in",
      enrollmentNumber: "2024EC102",
      branch: "ECE",
      currentSemester: 4,
      isVerified: true,
      ratingAvg: 4.9,
      ratingCount: 6,
      completedExchanges: 5,
      estimatedSavingsInr: 3200,
      role: "STUDENT",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
    },
  },
  {
    id: "usr_vikram_ce6",
    label: "Vikram Singh",
    roleDescription: "6th-Sem Civil Senior",
    user: {
      id: "usr_vikram_ce6",
      name: "Vikram Singh",
      email: "vikram.ce23@college.edu.in",
      enrollmentNumber: "2023CE015",
      branch: "Civil",
      currentSemester: 6,
      isVerified: true,
      ratingAvg: 4.7,
      ratingCount: 8,
      completedExchanges: 8,
      estimatedSavingsInr: 5100,
      role: "STUDENT",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    },
  },
];

interface DemoUserContextType {
  currentUser: User | null;
  currentAccountId: string | null;
  isAuthenticated: boolean;
  switchUser: (id: string) => Promise<void>;
  loginUser: (user: User) => void;
  logoutUser: () => Promise<void>;
  availableAccounts: DemoAccount[];
  refreshUserStats: () => Promise<void>;
}

const DemoUserContext = createContext<DemoUserContextType | undefined>(undefined);

export function DemoUserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(PRESET_DEMO_USERS[0].user);
  const [currentAccountId, setCurrentAccountId] = useState<string | null>("usr_rohan_me2");

  useEffect(() => {
    const savedId = localStorage.getItem("campusgear_demo_user_id");
    const isLoggedOut = localStorage.getItem("campusgear_logged_out") === "true";

    if (isLoggedOut) {
      setCurrentUser(null);
      setCurrentAccountId(null);
      return;
    }

    if (savedId) {
      // First check preset accounts
      const match = PRESET_DEMO_USERS.find((a) => a.id === savedId);
      if (match) {
        setCurrentAccountId(savedId);
        setCurrentUser(match.user);
      } else {
        // Fetch custom signed up user from DB
        fetch(`/api/users/${savedId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((userData) => {
            if (userData) {
              setCurrentAccountId(userData.id);
              setCurrentUser(userData);
            }
          })
          .catch(() => {});
      }
    }
  }, []);

  const switchUser = async (id: string) => {
    localStorage.removeItem("campusgear_logged_out");
    const match = PRESET_DEMO_USERS.find((a) => a.id === id);
    if (match) {
      setCurrentAccountId(id);
      setCurrentUser(match.user);
      localStorage.setItem("campusgear_demo_user_id", id);
      try {
        const res = await fetch(`/api/users/${id}`);
        if (res.ok) {
          const freshUser = await res.json();
          setCurrentUser(freshUser);
        }
      } catch (err) {
        console.warn("Could not fetch user record:", err);
      }
    }
  };

  const loginUser = (user: User) => {
    localStorage.removeItem("campusgear_logged_out");
    localStorage.setItem("campusgear_demo_user_id", user.id);
    setCurrentUser(user);
    setCurrentAccountId(user.id);
  };

  const logoutUser = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout error:", err);
    }
    localStorage.setItem("campusgear_logged_out", "true");
    localStorage.removeItem("campusgear_demo_user_id");
    setCurrentUser(null);
    setCurrentAccountId(null);
  };

  const refreshUserStats = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/users/${currentUser.id}`);
      if (res.ok) {
        const freshUser = await res.json();
        setCurrentUser(freshUser);
      }
    } catch (err) {
      console.warn("Error refreshing user stats:", err);
    }
  };

  return (
    <DemoUserContext.Provider
      value={{
        currentUser,
        currentAccountId,
        isAuthenticated: currentUser !== null,
        switchUser,
        loginUser,
        logoutUser,
        availableAccounts: PRESET_DEMO_USERS,
        refreshUserStats,
      }}
    >
      {children}
    </DemoUserContext.Provider>
  );
}

export function useDemoUser() {
  const context = useContext(DemoUserContext);
  if (!context) {
    throw new Error("useDemoUser must be used within a DemoUserProvider");
  }
  return context;
}
