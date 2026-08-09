import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { getSession } from "../../../lib/auth";
import { formatPrice } from "../../../lib/utils";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function OrderPage({ params }: Props) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId: session.userId,
    },
    include: {
      account: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <section className="pageSection">
      <div className="orderPage">
        <span className="sectionEyebrow">
          ORDER {order.trackingId}
        </span>

        <h1>Complete your payment</h1>

        <div className="orderStatus">
          <span>Status</span>
          <strong>{order.status.replaceAll("_", " ")}</strong>
        </div>

        <div className="paymentInstructions">
          <h2>Bank transfer payment</h2>

          <p>
            Use the payment account shown below to make your transfer.
            After payment, submit your payment proof so the admin can
            review and confirm the transaction.
          </p>

          <div className="paymentNotice">
            <strong>
              Payment account details
            </strong>

            <p>
              Payment details are configured securely through the
              application's environment variables.
            </p>
          </div>
        </div>

        <div className="orderSummaryCard">
          <span>Gaming account</span>
          <h2>{order.account.title}</h2>

          <div>
            <span>Amount</span>
            <strong>
              {formatPrice(Number(order.amount))}
            </strong>
          </div>
        </div>

        <Link
          href={`/orders/${order.id}/payment`}
          className="primaryButton"
        >
          Submit payment proof →
        </Link>
      </div>
    </section>
  );
}
