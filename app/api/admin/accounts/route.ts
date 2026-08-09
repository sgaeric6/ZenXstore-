import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const title = String(body.title ?? "").trim();
    const game = String(body.game ?? "").trim();
    const platform = String(body.platform ?? "").trim();
    const region = String(body.region ?? "").trim();
    const level = String(body.level ?? "").trim();
    const rank = String(body.rank ?? "").trim();
    const description = String(body.description ?? "").trim();
    const skins = String(body.skins ?? "").trim();
    const image = String(body.image ?? "").trim();
    const price = Number(body.price);

    if (
      !title ||
      !game ||
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

    const account = await prisma.account.create({
      data: {
        title,
        game,
        platform,
        region,
        level: level || null,
        rank: rank || null,
        description,
        skins: skins || null,
        image: image || null,
        price,
        status: "AVAILABLE",
      },
    });

    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        title: account.title,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to publish account." },
      { status: 500 }
    );
  }
}
