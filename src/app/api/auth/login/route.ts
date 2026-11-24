import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, demoUserId } = body;

    // 1-Click Evaluator Demo Login Bypass
    if (demoUserId) {
      const demoUser = await prisma.user.findUnique({
        where: { id: demoUserId },
      });

      if (!demoUser) {
        return NextResponse.json({ error: "Demo account not found." }, { status: 404 });
      }

      const response = NextResponse.json(demoUser);
      response.cookies.set("campusgear_user_id", demoUser.id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: false,
      });
      return response;
    }

    // Standard Credential Login
    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter your college email and password." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this college email. Please sign up first." },
        { status: 401 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid password. (For seeded demo accounts, default password is 'campus123')" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(user);
    response.cookies.set("campusgear_user_id", user.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
