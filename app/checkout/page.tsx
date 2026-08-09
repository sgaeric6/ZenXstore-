import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { getSession } from "../../lib/auth";
import { formatPrice } from "../../lib/utils";
import CheckoutForm from "../../components/CheckoutForm";

type Props = {
  searchParams: Promise<{
    account?: string;
  }>;
};

export default async function CheckoutPage({
  searchParams,
}: Props) {
  const session = await getSession();

  if (!session) {
    redirect("/login?next=/checkout");
  }

  const params = await searchParams;
  const accountId = params.account;

  if (!accountId) {
    redirect("/marketplace");
  }

  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      status: "AVAILABLE",
    },
  });

  if (!account) {
    redirect("/marketplace");
  }

  return (
    <section className="pageSection">
      <div className="checkoutLayout">
        <div>
          <span className="sectionEyebrow">CHECKOUT</span>

          <h1>Complete your order</h1>

          <p>
            Review the account and submit your order.
          </p>

          <CheckoutForm
            accountId={account.id}
            price={Number(account.price)}
          />
        </div>

        <aside className="checkoutSummary">
          <span>ORDER SUMMARY</span>

          {account.image && (
            <img
              src={account.image}
              alt={account.title}
            />
          )}

          <h2>{account.title}</h2>

          <p>{account.game}</p>

          <div>
            <span>Total</span>
            <strong>
              {formatPrice(Number(account.price))}
            </strong>
          </div>
        </aside>
      </div>
    </section>
  );
}
