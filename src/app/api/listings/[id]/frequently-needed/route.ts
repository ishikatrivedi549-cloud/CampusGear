import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentListing = await prisma.listing.findUnique({
      where: { id: params.id },
      select: { id: true, branch: true, semester: true },
    });

    if (!currentListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Query other available gear from the exact same branch and semester
    const recommendations = await prisma.listing.findMany({
      where: {
        id: { not: currentListing.id },
        branch: currentListing.branch,
        semester: currentListing.semester,
        status: "AVAILABLE",
      },
      include: {
        owner: true,
      },
      take: 4,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error("Error fetching frequently needed items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
