import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import { formatPrice } from "../../../lib/utils";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  const account = await prisma.account.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: account
      ? `${account.title} | ZenXStore`
      : "Gaming Account | ZenXStore",
  };
}

export default async function AccountPage({ params }: Props) {
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: {
      id,
      status: "AVAILABLE",
    },
  });

  if (!account) {
    notFound();
  }

  return (
    <section className="accountDetailsPage">
      <div className="accountDetails">
        <div className="accountDetailsImage">
          {account.image ? (
            <img
              src={account.image}
              alt={account.title}
            />
          ) : (
            <div className="largeImagePlaceholder">
              {account.game}
            </div>
          )}
        </div>

        <div className="accountDetailsContent">
          <span className="accountGame">
            {account.game}
          </span>

          <h1>{account.title}</h1>

          <p className="accountDescription">
            {account.description}
          </p>

          <div className="detailsGrid">
            <div>
              <span>Platform</span>
              <strong>{account.platform}</strong>
            </div>

            <div>
              <span>Region</span>
              <strong>{account.region}</strong>
            </div>

            <div>
              <span>Level</span>
              <strong>{account.level || "—"}</strong>
            </div>

            <div>
              <span>Rank</span>
              <strong>{account.rank || "—"}</strong>
            </div>
          </div>

          {account.skins && (
            <div className="detailBlock">
              <span>Account highlights</span>
              <p>{account.skins}</p>
            </div>
          )}

          <div className="purchaseBox">
            <div>
              <span>Account price</span>
              <strong>
                {formatPrice(Number(account.price))}
              </strong>
            </div>

            <Link
              href={`/checkout?account=${account.id}`}
              className="primaryButton"
            >
              Continue to checkout →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
