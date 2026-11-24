import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exchangeId = params.id;
    const body = await req.json();
    const { action, userId, conditionAcknowledged, score, comment } = body;

    const exchange = await prisma.exchange.findUnique({
      where: { id: exchangeId },
      include: {
        listing: true,
        borrower: true,
        lender: true,
      },
    });

    if (!exchange) {
      return NextResponse.json({ error: "Exchange not found" }, { status: 404 });
    }

    // 1. APPROVE (by Lender)
    if (action === "APPROVE") {
      if (exchange.lenderId !== userId) {
        return NextResponse.json({ error: "Only the lender can approve this request" }, { status: 403 });
      }

      const holdExpiresAt = new Date();
      holdExpiresAt.setHours(holdExpiresAt.getHours() + 24);

      const updatedExchange = await prisma.exchange.update({
        where: { id: exchangeId },
        data: {
          status: "APPROVED",
          holdExpiresAt,
        },
        include: { listing: true, borrower: true, lender: true },
      });

      // Lock listing to RESERVED for 24 hours
      await prisma.listing.update({
        where: { id: exchange.listingId },
        data: {
          status: "RESERVED",
          reservedUntil: holdExpiresAt,
        },
      });

      return NextResponse.json(updatedExchange);
    }

    // 2. DECLINE (by Lender) or CANCEL (by Borrower)
    if (action === "DECLINE" || action === "CANCEL") {
      const newStatus = action === "DECLINE" ? "REJECTED" : "CANCELLED";
      const updatedExchange = await prisma.exchange.update({
        where: { id: exchangeId },
        data: {
          status: newStatus,
        },
        include: { listing: true, borrower: true, lender: true },
      });

      // Free up listing back to AVAILABLE
      await prisma.listing.update({
        where: { id: exchange.listingId },
        data: {
          status: "AVAILABLE",
          reservedUntil: null,
        },
      });

      return NextResponse.json(updatedExchange);
    }

    // 3. CONFIRM_HANDOVER (Dual Confirmation Stepper)
    if (action === "CONFIRM_HANDOVER") {
      const isLender = exchange.lenderId === userId;
      const isBorrower = exchange.borrowerId === userId;

      if (!isLender && !isBorrower) {
        return NextResponse.json({ error: "User is not a participant in this exchange" }, { status: 403 });
      }

      const updateData: any = {};
      if (isLender) {
        updateData.lenderConfirmedHandover = true;
        updateData.conditionChecklistLender = conditionAcknowledged ?? true;
      }
      if (isBorrower) {
        updateData.borrowerConfirmedHandover = true;
        updateData.conditionChecklistBorrower = conditionAcknowledged ?? true;
      }

      const willBothBeConfirmed =
        (isLender && exchange.borrowerConfirmedHandover) ||
        (isBorrower && exchange.lenderConfirmedHandover);

      if (willBothBeConfirmed) {
        updateData.handoverCompletedAt = new Date();

        if (exchange.exchangeMode === "LEND") {
          updateData.status = "PICKED_UP";
          // Update listing to LENT
          const returnDue = exchange.intendedReturnDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await prisma.listing.update({
            where: { id: exchange.listingId },
            data: {
              status: "LENT",
              lentUntil: returnDue,
            },
          });
        } else {
          // SELL or DONATE completes immediately upon handover
          updateData.status = "COMPLETED";
          await prisma.listing.update({
            where: { id: exchange.listingId },
            data: {
              status: "COMPLETED",
            },
          });

          // Award Eco-Impact savings
          const itemVal = exchange.listing.priceInr > 0 ? exchange.listing.priceInr : 450;
          await prisma.user.update({
            where: { id: exchange.borrowerId },
            data: {
              completedExchanges: { increment: 1 },
              estimatedSavingsInr: { increment: itemVal },
            },
          });
          await prisma.user.update({
            where: { id: exchange.lenderId },
            data: {
              completedExchanges: { increment: 1 },
              estimatedSavingsInr: { increment: Math.floor(itemVal * 0.75) },
            },
          });
        }
      }

      const updatedExchange = await prisma.exchange.update({
        where: { id: exchangeId },
        data: updateData,
        include: { listing: true, borrower: true, lender: true },
      });

      return NextResponse.json(updatedExchange);
    }

    // 4. CONFIRM_RETURN (Dual Confirmation for LEND items)
    if (action === "CONFIRM_RETURN") {
      const isLender = exchange.lenderId === userId;
      const isBorrower = exchange.borrowerId === userId;

      if (!isLender && !isBorrower) {
        return NextResponse.json({ error: "User is not a participant in this exchange" }, { status: 403 });
      }

      const updateData: any = {};
      if (isLender) {
        updateData.lenderConfirmedReturn = true;
      }
      if (isBorrower) {
        updateData.borrowerConfirmedReturn = true;
      }

      const willBothBeConfirmed =
        (isLender && exchange.borrowerConfirmedReturn) ||
        (isBorrower && exchange.lenderConfirmedReturn);

      if (willBothBeConfirmed) {
        updateData.status = "COMPLETED";
        updateData.returnCompletedAt = new Date();

        // Listing resets back to AVAILABLE so others can borrow!
        await prisma.listing.update({
          where: { id: exchange.listingId },
          data: {
            status: "AVAILABLE",
            lentUntil: null,
            reservedUntil: null,
          },
        });

        // Add Eco-Impact savings (retail replacement value saved)
        const savedAmount = 500;
        await prisma.user.update({
          where: { id: exchange.borrowerId },
          data: {
            completedExchanges: { increment: 1 },
            estimatedSavingsInr: { increment: savedAmount },
          },
        });
        await prisma.user.update({
          where: { id: exchange.lenderId },
          data: {
            completedExchanges: { increment: 1 },
            estimatedSavingsInr: { increment: 300 },
          },
        });
      }

      const updatedExchange = await prisma.exchange.update({
        where: { id: exchangeId },
        data: updateData,
        include: { listing: true, borrower: true, lender: true },
      });

      return NextResponse.json(updatedExchange);
    }

    // 5. RATE (1-5 Star Peer Rating)
    if (action === "RATE") {
      const targetUserId = exchange.lenderId === userId ? exchange.borrowerId : exchange.lenderId;

      const newRating = await prisma.rating.create({
        data: {
          exchangeId,
          raterId: userId,
          targetUserId,
          score: Math.min(5, Math.max(1, Number(score || 5))),
          comment: comment || "Great campus exchange, very cooperative!",
        },
      });

      // Recalculate target user's ratingAvg and ratingCount
      const allRatings = await prisma.rating.findMany({
        where: { targetUserId },
      });
      const avg =
        allRatings.reduce((sum, r) => sum + r.score, 0) / (allRatings.length || 1);

      await prisma.user.update({
        where: { id: targetUserId },
        data: {
          ratingAvg: Math.round(avg * 10) / 10,
          ratingCount: allRatings.length,
        },
      });

      const updatedExchange = await prisma.exchange.findUnique({
        where: { id: exchangeId },
        include: { listing: true, borrower: true, lender: true, ratings: true },
      });

      return NextResponse.json(updatedExchange);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing exchange state transition:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
