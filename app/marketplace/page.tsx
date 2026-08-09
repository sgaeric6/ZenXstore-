import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { formatPrice } from "../../lib/utils";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const accounts = await prisma.account.findMany({
    where: {
      status: "AVAILABLE",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="pageSection">
      <div className="pageHeader">
        <span className="sectionEyebrow">ZENX MARKETPLACE</span>

        <h1>Gaming accounts</h1>

        <p>
          Browse available gaming accounts published by ZenXStore.
        </p>
      </div>

      {accounts.length === 0 ? (
        <div className="emptyMarketplace">
          <div className="emptyIcon">🎮</div>

          <h2>No accounts available yet</h2>

          <p>
            Our marketplace is waiting for its first approved listing.
            Check back soon.
          </p>
        </div>
      ) : (
        <div className="accountGrid">
          {accounts.map((account) => (
            <Link
              key={account.id}
              href={`/account/${account.id}`}
              className="accountCard"
            >
              <div className="accountImage">
                {account.image ? (
                  <img
                    src={account.image}
                    alt={account.title}
                  />
                ) : (
                  <div className="imagePlaceholder">
                    {account.game}
                  </div>
                )}

                <span className="availableBadge">
                  AVAILABLE
                </span>
              </div>

              <div className="accountCardBody">
                <span className="accountGame">
                  {account.game}
                </span>

                <h3>{account.title}</h3>

                <div className="accountMeta">
                  <span>{account.platform}</span>
                  <span>{account.region}</span>
                </div>

                <div className="accountBottom">
                  <strong>{formatPrice(Number(account.price))}</strong>
                  <span>View account →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
