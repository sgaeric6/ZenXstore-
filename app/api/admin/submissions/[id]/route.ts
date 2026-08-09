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

    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const action = body.action;

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    const submission =
      await prisma.sellSubmission.findUnique({
        where: {
          id,
        },
      });

    if (!submission) {
      return NextResponse.json(
        { error: "Submission not found." },
        { status: 404 }
      );
    }

    if (submission.status !== "PENDING") {
      return NextResponse.json(
        { error: "This submission has already been reviewed." },
        { status: 409 }
      );
    }

    if (action === "reject") {
      await prisma.sellSubmission.update({
        where: {
          id,
        },
        data: {
          status: "REJECTED",
        },
      });

      return NextResponse.json({
        success: true,
        status: "REJECTED",
      });
    }

    const account = await prisma.account.create({
      data: {
        title: submission.title,
        game: submission.game,
        platform: submission.platform,
        region: submission.region,
        level: submission.level,
        rank: submission.rank,
        description: submission.description,
        skins: submission.skins,
        image: submission.image,
        price: submission.price,
        status: "AVAILABLE",
      },
    });

    await prisma.sellSubmission.update({
      where: {
        id,
      },
      data: {
        status: "APPROVED",
        approvedAccountId: account.id,
      },
    });

    return NextResponse.json({
      success: true,
      status: "APPROVED",
      accountId: account.id,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to review submission." },
      { status: 500 }
    );
  }
}
