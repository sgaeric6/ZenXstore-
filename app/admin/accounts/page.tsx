import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import AdminSidebar from "../../../components/AdminSidebar";
import Link from "next/link";
import { formatPrice } from "../../../lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminAccountsPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const accounts = await prisma.account.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="adminLayout">
      <AdminSidebar />

      <main className="adminContent">
        <div className="adminPageHeader">
          <div>
            <span>MARKETPLACE</span>
            <h1>Gaming accounts</h1>
          </div>

          <Link
            href="/admin/accounts/new"
            className="primaryButton"
          >
            + Add account
          </Link>
        </div>

        {accounts.length === 0 ? (
          <div className="adminEmpty">
            <h2>No accounts yet</h2>
            <p>
              Upload the first gaming account to make it appear
              on the public marketplace.
            </p>
          </div>
        ) : (
          <div className="adminAccountList">
            {accounts.map((account) => (
              <div
                className="adminAccountRow"
                key={account.id}
              >
                {account.image ? (
                  <img
                    src={account.image}
                    alt={account.title}
                  />
                ) : (
                  <div className="adminImagePlaceholder">
                    {account.game}
                  </div>
                )}

                <div>
                  <strong>{account.title}</strong>
                  <span>{account.game}</span>
                </div>

                <span>
                  {account.status}
                </span>

                <strong>
                  {formatPrice(Number(account.price))}
                </strong>

                <Link
                  href={`/admin/accounts/${account.id}`}
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
