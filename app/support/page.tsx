import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { getSession } from "../../lib/auth";
import SupportClient from "../../components/SupportClient";

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/support");
  }

  const tickets = await prisma.supportTicket.findMany({
    where: {
      userId: session.userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          sender: {
            select: {
              name: true,
              role: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <section className="pageSection">
      <div className="pageHeader">
        <span className="sectionEyebrow">
          ZENX SUPPORT
        </span>

        <h1>How can we help?</h1>

        <p>
          Start a conversation with the ZenXStore support team.
        </p>
      </div>

      <SupportClient tickets={tickets} />
    </section>
  );
}
