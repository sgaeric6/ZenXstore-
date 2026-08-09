import { redirect, notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import { getSession } from "../../../../lib/auth";
import AdminSidebar from "../../../../components/AdminSidebar";
import SubmissionReview from "../../../../components/SubmissionReview";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export const dynamic = "force-dynamic";

export default async function ReviewSubmissionPage({
  params,
}: Props) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;

  const submission = await prisma.sellSubmission.findUnique({
    where: {
      id,
    },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!submission) {
    notFound();
  }

  return (
    <div className="adminLayout">
      <AdminSidebar />

      <main className="adminContent">
        <div className="adminPageHeader">
          <div>
            <span>SUBMISSION REVIEW</span>
            <h1>{submission.title}</h1>
          </div>
        </div>

        <SubmissionReview
          submission={{
            id: submission.id,
            title: submission.title,
            game: submission.game,
            platform: submission.platform,
            region: submission.region,
            level: submission.level,
            rank: submission.rank,
            description: submission.description,
            skins: submission.skins,
            image: submission.image,
            price: Number(submission.price),
            status: submission.status,
            seller: submission.seller,
          }}
        />
      </main>
    </div>
  );
}
