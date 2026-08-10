import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { getSession } from "../../../../../lib/auth";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Props
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const price = Number(body.price);

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Invalid price." },
        { status: 400 }
      );
    }

    const account = await prisma.account.update({
      where: { id },
      data: {
        title: String(body.title ?? "").trim(),
        game: String(body.game ?? "").trim(),
        platform: String(body.platform ?? "").trim(),
        region: String(body.region ?? "").trim(),
        level: String(body.level ?? "").trim() || null,
        rank: String(body.rank ?? "").trim() || null,
        description: String(body.description ?? "").trim(),
        skins: String(body.skins ?? "").trim() || null,
        image: String(body.image ?? "").trim() || null,
        price,
        status: body.status === "SOLD"
          ? "SOLD"
          : "AVAILABLE",
      },
    });

    return NextResponse.json({
      success: true,
      account,
    });
  } catch (error) {
    console.error("Unable to update account:", error);

    return NextResponse.json(
      { error: "Unable to update account." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Props
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const { id } = await params;

    const account = await prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 }
      );
    }

    await prisma.account.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully.",
    });
  } catch (error) {
    console.error("Unable to delete account:", error);

    return NextResponse.json(
      { error: "Unable to delete account." },
      { status: 500 }
    );
  }
}
