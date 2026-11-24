import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      include: {
        listing: {
          include: {
            owner: true,
          },
        },
        reporter: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { listingId, reporterId, reason } = body;

    if (!listingId || !reporterId || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const report = await prisma.report.create({
      data: {
        listingId,
        reporterId,
        reason,
        status: "PENDING",
      },
      include: {
        listing: true,
        reporter: true,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { reportId, action } = body; // action: "DISMISS" | "REMOVE_LISTING"

    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (action === "REMOVE_LISTING") {
      await prisma.listing.delete({
        where: { id: report.listingId },
      });
      await prisma.report.update({
        where: { id: reportId },
        data: { status: "RESOLVED" },
      });
      return NextResponse.json({ message: "Listing removed and report resolved" });
    } else {
      // DISMISS
      await prisma.report.update({
        where: { id: reportId },
        data: { status: "DISMISSED" },
      });
      return NextResponse.json({ message: "Report dismissed" });
    }
  } catch (error) {
    console.error("Error updating report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
