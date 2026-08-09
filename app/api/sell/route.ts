import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";

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

    const game = String(body.game ?? "").trim();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    const accountNumber = String(body.accountNumber ?? "").trim();

    const images = Array.isArray(body.images)
      ? body.images
          .map((image: unknown) => String(image).trim())
          .filter(Boolean)
      : [];

    if (
      !game ||
      !title ||
      !description ||
      !accountNumber ||
      images.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Please provide the game, title, account details, and at least one image.",
        },
        { status: 400 }
      );
    }

    const submission = await prisma.sellRequest.create({
      data: {
        userId: session.userId,
        game,
        title,
        description,
        accountNumber,
        images,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
    });
  } catch (error) {
    console.error("Sell submission error:", error);

    return NextResponse.json(
      { error: "Unable to submit account." },
      { status: 500 }
    );
  }
}
