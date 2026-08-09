import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Props
) {
  try {
    const session = await getSession();

    if (
      !session ||
      (session.role !== "ADMIN" &&
        session.role !== "SUPPORT")
    ) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const message = String(
      body.message ?? ""
    ).trim();

    if (!message) {
      return NextResponse.json(
        { error: "Message cannot be empty." },
        { status: 400 }
      );
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: {
        id,
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Support ticket not found." },
        { status: 404 }
      );
    }

    const newMessage = await prisma.supportMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: session.userId,
        message,
      },
    });

    await prisma.supportTicket.update({
      where: {
        id: ticket.id,
      },
      data: {
        status: "WAITING_FOR_USER",
      },
    });

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to send support reply." },
      { status: 500 }
    );
  }
}
