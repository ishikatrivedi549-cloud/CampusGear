import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, validateCollegeEmail } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, enrollmentNumber, branch, currentSemester } = body;

    if (!name || !email || !password || !enrollmentNumber || !branch || !currentSemester) {
      return NextResponse.json(
        { error: "Please fill in all required onboarding fields." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Strict Institutional Domain Validation
    const emailValidation = validateCollegeEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          { enrollmentNumber: enrollmentNumber.trim().toUpperCase() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email.trim().toLowerCase()) {
        return NextResponse.json(
          { error: "An account with this college email already exists. Please sign in." },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "An account with this enrollment / roll number already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Random avatar for new student
    const avatarSeeds = [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80",
    ];
    const randomAvatar = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)];

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        passwordHash,
        enrollmentNumber: enrollmentNumber.trim().toUpperCase(),
        branch,
        currentSemester: Number(currentSemester),
        isVerified: true, // Auto-verified institutional ID
        ratingAvg: 5.0,
        ratingCount: 0,
        completedExchanges: 0,
        estimatedSavingsInr: 0,
        role: "STUDENT",
        avatarUrl: randomAvatar,
      },
    });

    const response = NextResponse.json(newUser, { status: 201 });
    response.cookies.set("campusgear_user_id", newUser.id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
