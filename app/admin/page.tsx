import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { getSession } from "../../lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const [
    accounts,
    pendingSales,
    orders,
    supportTickets,
  ] = await Promise.all([
    prisma.account.count(),
    prisma.sellSubmission.count({
      where: { status: "PENDING" },
    }),
    prisma.order.count(),
    prisma.supportTicket.count({
      where: {
        status: {
          in: ["OPEN", "WAITING_FOR_SUPPORT"],
        },
      },
    }),
  ]);

  return (
    <section className="adminPage">
      <div className="adminHeader">
        <div>
          <span>ZENXSTORE ADMIN</span>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="adminStats">
        <div>
          <span>Published accounts</span>
          <strong>{accounts}</strong>
        </div>

        <div>
          <span>Pending submissions</span>
          <strong>{pendingSales}</strong>
        </div>

        <div>
          <span>Total orders</span>
          <strong>{orders}</strong>
        </div>

        <div>
          <span>Support tickets</span>
          <strong>{supportTickets}</strong>
        </div>
      </div>

      <div className="adminGrid">
        <Link href="/admin/accounts">
          Manage accounts →
        </Link>

        <Link href="/admin/submissions">
          Seller submissions →
        </Link>

        <Link href="/admin/orders">
          Orders →
        </Link>

        <Link href="/admin/support">
          Support →
        </Link>
      </div>
    </section>
  );
}
