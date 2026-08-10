```tsx
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import AdminSidebar from "../../../components/AdminSidebar";
import { formatPrice } from "../../../lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      account: {
        select: {
          title: true,
          game: true,
          image: true,
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
            <span>SALES</span>
            <h1>Orders</h1>
            <p>View customer purchases and payment status.</p>
          </div>

          <div className="adminCount">
            {orders.length} orders
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="adminEmpty">
            <h2>No orders yet</h2>
            <p>
              Customer purchases will appear here after checkout.
            </p>
          </div>
        ) : (
          <div className="orderTable">
            <div className="orderTableHeader">
              <span>ACCOUNT</span>
              <span>CUSTOMER</span>
              <span>AMOUNT</span>
              <span>PAYMENT</span>
              <span>ORDER</span>
            </div>

            {orders.map((order) => (
              <div
                className="orderTableRow"
                key={order.id}
              >
                <div className="orderAccount">
                  {order.account.image ? (
                    <img
                      src={order.account.image}
                      alt={order.account.title}
                    />
                  ) : (
                    <div className="orderImageFallback">
                      {order.account.game}
                    </div>
                  )}

                  <div>
                    <strong>
                      {order.account.title}
                    </strong>

                    <span>
                      {order.account.game}
                    </span>
                  </div>
                </div>

                <div className="orderCustomer">
                  <strong>
                    {order.user.name}
                  </strong>

                  <span>
                    {order.user.email}
                  </span>
                </div>

                <strong>
                  {formatPrice(Number(order.amount))}
                </strong>

                <span
                  className={`statusBadge status-${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>

                <div>
                  <span>
                    #{order.id.slice(-8).toUpperCase()}
                  </span>

                  <span>
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-NG")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```
