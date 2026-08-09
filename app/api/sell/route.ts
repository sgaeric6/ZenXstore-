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
    const platform = String(body.platform ?? "").trim();
    const region = String(body.region ?? "").trim();
    const level = String(body.level ?? "").trim();
    const rank = String(body.rank ?? "").trim();
    const description = String(body.description ?? "").trim();
    const image = String(body.image ?? "").trim();
    const price = Number(body.price);

    if (
      !game ||
      !title ||
      !platform ||
      !region ||
      !description ||
      !Number.isFinite(price) ||
      price <= 0
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const submission = await prisma.sellSubmission.create({
      data: {
        sellerId: session.userId,
        game,
        title,
        platform,
        region,
        level: level || null,
        rank: rank || null,
        description,
        image: image || null,
        price,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      submissionId: submission.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to submit account." },
      { status: 500 }
    );
  }
}
