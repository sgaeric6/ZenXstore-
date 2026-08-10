import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import AdminSidebar from "../../../components/AdminSidebar";
import { formatPrice } from "../../../lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const submissions = await prisma.sellRequest.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return (
    <div className="adminLayout">
      <AdminSidebar />

      <main className="adminContent">
        <div className="adminPageHeader">
          <div>
            <span>SELLER MANAGEMENT</span>
            <h1>Pending submissions</h1>
            <p>
              Review gaming accounts before they become visible
              on ZenXStore.
            </p>
          </div>

          <div className="adminCount">
            {submissions.length} pending
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="adminEmpty">
            <h2>No pending submissions</h2>
            <p>
              New seller submissions will appear here for review.
            </p>
          </div>
        ) : (
          <div className="submissionList">
            {submissions.map((submission) => (
              <article
                className="submissionCard"
                key={submission.id}
              >
                <div className="submissionImage">
                  {submission.image ? (
                    <img
                      src={submission.image}
                      alt={submission.title}
                    />
                  ) : (
                    <span>{submission.game}</span>
                  )}
                </div>

                <div className="submissionInfo">
                  <span className="submissionGame">
                    {submission.game}
                  </span>

                  <h2>{submission.title}</h2>

                  <div className="submissionMeta">
                    <span>
                      Platform: {submission.platform}
                    </span>

                    <span>
                      Region: {submission.region}
                    </span>

                    {submission.level && (
                      <span>
                        Level: {submission.level}
                      </span>
                    )}

                    {submission.rank && (
                      <span>
                        Rank: {submission.rank}
                      </span>
                    )}
                  </div>

                  <p>{submission.description}</p>

                  {submission.skins && (
                    <p>
                      <strong>Skins / Items:</strong>{" "}
                      {submission.skins}
                    </p>
                  )}

                  <div className="submissionSeller">
                    <strong>Seller</strong>

                    <span>
                      {submission.user.name}
                    </span>

                    <span>
                      {submission.user.email}
                    </span>
                  </div>
                </div>

                <div className="submissionSide">
                  <strong>
                    {formatPrice(Number(submission.price))}
                  </strong>

                  <span>PENDING REVIEW</span>

                  <Link
                    href={`/admin/submissions/${submission.id}`}
                    className="primaryButton"
                  >
                    Review account
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
