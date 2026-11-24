import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const branch = searchParams.get("branch");
    const semester = searchParams.get("semester");
    const category = searchParams.get("category");
    const exchangeMode = searchParams.get("exchangeMode");
    const condition = searchParams.get("condition");
    const availableOnly = searchParams.get("availableOnly") === "true";
    const search = searchParams.get("search");

    // Build filter query
    const where: any = {};

    if (branch && branch !== "All") {
      where.branch = branch;
    }

    if (semester && semester !== "All") {
      where.semester = parseInt(semester, 10);
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (exchangeMode && exchangeMode !== "All") {
      where.exchangeMode = exchangeMode;
    }

    if (condition && condition !== "All") {
      where.condition = condition;
    }

    if (availableOnly) {
      where.status = "AVAILABLE";
    }

    if (search && search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { title: { contains: q } },
        { description: { contains: q } },
        { subjectName: { contains: q } },
        { subjectCode: { contains: q } },
        { isbn: { contains: q } },
      ];
    }

    const listings = await prisma.listing.findMany({
      where,
      include: {
        owner: true,
        pickupSlots: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
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
      title,
      description,
      category,
      branch,
      semester,
      subjectName,
      subjectCode,
      isbn,
      edition,
      condition,
      exchangeMode,
      priceInr,
      lendDurationDays,
      lendRateText,
      depositInr,
      imageUrl,
      ownerId,
      pickupSlots,
    } = body;

    if (!title || !category || !branch || !semester || !condition || !exchangeMode || !ownerId) {
      return NextResponse.json(
        { error: "Missing required listing fields" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description: description || "",
        category,
        branch,
        semester: Number(semester),
        subjectName: subjectName || "General Coursework",
        subjectCode: subjectCode || "GEN101",
        isbn: isbn || null,
        edition: edition || null,
        condition,
        exchangeMode,
        priceInr: exchangeMode === "DONATE" ? 0 : Number(priceInr || 0),
        lendDurationDays: lendDurationDays ? Number(lendDurationDays) : null,
        lendRateText: lendRateText || null,
        depositInr: depositInr ? Number(depositInr) : 0,
        imageUrl: imageUrl || null,
        status: "AVAILABLE",
        ownerId,
        pickupSlots: {
          create: (pickupSlots && pickupSlots.length > 0)
            ? pickupSlots.map((slot: { locationName: string; timeWindow: string }) => ({
                locationName: slot.locationName,
                timeWindow: slot.timeWindow || "Mon-Fri 4:00 PM - 5:30 PM",
              }))
            : [
                {
                  locationName: "Central Library Entrance",
                  timeWindow: "Mon-Fri 4:00 PM - 5:30 PM",
                },
              ],
        },
      },
      include: {
        owner: true,
        pickupSlots: true,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
