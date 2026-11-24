import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [totalUsers, verifiedStudents, totalListings, availableListings, activeExchanges, completedExchanges, reports] =
      await Promise.all([
        prisma.user.count({ where: { role: "STUDENT" } }),
        prisma.user.count({ where: { role: "STUDENT", isVerified: true } }),
        prisma.listing.count(),
        prisma.listing.count({ where: { status: "AVAILABLE" } }),
        prisma.exchange.count({
          where: {
            status: { in: ["REQUESTED", "APPROVED", "PICKED_UP"] },
          },
        }),
        prisma.exchange.count({ where: { status: "COMPLETED" } }),
        prisma.report.count({ where: { status: "PENDING" } }),
      ]);

    const users = await prisma.user.findMany({
      select: { estimatedSavingsInr: true },
    });
    const totalSavings = users.reduce((acc, u) => acc + (u.estimatedSavingsInr || 0), 0);

    return NextResponse.json({
      totalUsers,
      verifiedStudents,
      totalListings,
      availableListings,
      activeExchanges,
      completedExchanges,
      pendingReports: reports,
      totalSavingsInr: totalSavings,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
