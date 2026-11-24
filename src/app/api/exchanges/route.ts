import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role"); // "borrower" | "lender" | "all"

    const where: any = {};

    if (userId) {
      if (role === "borrower") {
        where.borrowerId = userId;
      } else if (role === "lender") {
        where.lenderId = userId;
      } else {
        where.OR = [{ borrowerId: userId }, { lenderId: userId }];
      }
    }

    const exchanges = await prisma.exchange.findMany({
      where,
      include: {
        listing: {
          include: {
            owner: true,
          },
        },
        borrower: true,
        lender: true,
        ratings: {
          include: {
            rater: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(exchanges);
  } catch (error) {
    console.error("Error fetching exchanges:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      listingId,
      borrowerId,
      pickupLocation,
      pickupTimeWindow,
      intendedReturnDate,
      borrowerNote,
    } = body;

    if (!listingId || !borrowerId || !pickupLocation || !pickupTimeWindow) {
      return NextResponse.json(
        { error: "Missing required exchange parameters" },
        { status: 400 }
      );
    }

    // Fetch listing
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.ownerId === borrowerId) {
      return NextResponse.json(
        { error: "You cannot request your own gear" },
        { status: 400 }
      );
    }

    if (listing.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: `This item is currently ${listing.status.toLowerCase()}` },
        { status: 400 }
      );
    }

    // Create exchange request
    const exchange = await prisma.exchange.create({
      data: {
        listingId,
        borrowerId,
        lenderId: listing.ownerId,
        exchangeMode: listing.exchangeMode,
        status: "REQUESTED",
        pickupLocation,
        pickupTimeWindow,
        intendedReturnDate: intendedReturnDate ? new Date(intendedReturnDate) : null,
        borrowerNote: borrowerNote || null,
      },
      include: {
        listing: true,
        borrower: true,
        lender: true,
      },
    });

    return NextResponse.json(exchange, { status: 201 });
  } catch (error) {
    console.error("Error creating exchange request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
