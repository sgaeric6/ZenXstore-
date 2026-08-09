import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import { createTrackingId } from "../../../lib/utils";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const accountId = String(body.accountId ?? "");
    const deliveryEmail = String(
      body.deliveryEmail ?? ""
    ).trim();

    if (!accountId || !deliveryEmail) {
      return NextResponse.json(
        { error: "Account and delivery email are required." },
        { status: 400 }
      );
    }

    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        status: "AVAILABLE",
      },
    });

    if (!account) {
      return NextResponse.json(
        { error: "This account is no longer available." },
        { status: 404 }
      );
    }

    const order = await prisma.order.create({
      data: {
        trackingId: createTrackingId(),
        userId: session.userId,
        accountId: account.id,
        amount: account.price,
        deliveryEmail,
        status: "PENDING_PAYMENT",
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        trackingId: order.trackingId,
        amount: Number(order.amount),
        status: order.status,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create order." },
      { status: 500 }
    );
  }
}
