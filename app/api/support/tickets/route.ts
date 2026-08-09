import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";

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

    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.userId,
        subject,
        status: "OPEN",
        messages: {
          create: {
            senderId: session.userId,
            message,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to create support ticket." },
      { status: 500 }
    );
  }
}
