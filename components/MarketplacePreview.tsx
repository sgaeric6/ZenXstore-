import Link from "next/link";
import { prisma } from "../lib/prisma";

export default async function MarketplacePreview() {
  const accounts = await prisma.account.findMany({
    where: {
      status: "AVAILABLE",
    },
    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
    take: 6,
  });

  return (
    <section className="marketplaceSection">
      <div className="sectionHeader">
        <div>
          <span className="sectionEyebrow">MARKETPLACE</span>
          <h2>Available gaming accounts</h2>
          <p>
            Only accounts published by ZenXStore admin appear here.
          </p>
        </div>

        {accounts.length > 0 && (
          <Link href="/marketplace" className="sectionLink">
            View marketplace →
          </Link>
        )}
      </div>

      {accounts.length === 0 ? (
        <div className="emptyMarketplace">
          <div className="emptyIcon">⌁</div>

          <h3>Marketplace is currently empty</h3>

          <p>
            No gaming accounts have been published yet. Check back soon for
            new listings.
          </p>
        </div>
      ) : (
        <div className="accountGrid">
          {accounts.map((account) => (
            <Link
              href={`/account/${account.id}`}
              className="accountCard"
              key={account.id}
            >
              <div className="accountImage">
                {account.image ? (
                  <img src={account.image} alt={account.title} />
                ) : (
                  <div className="imagePlaceholder">ZENX</div>
                )}

                {account.featured && (
                  <span className="featuredBadge">FEATURED</span>
                )}
              </div>

              <div className="accountCardBody">
                <span className="accountGame">{account.game}</span>

                <h3>{account.title}</h3>

                <div className="accountMeta">
                  <span>{account.platform}</span>
                  <span>{account.region}</span>
                </div>

                <div className="accountBottom">
                  <strong>
                    ₦{Number(account.price).toLocaleString("en-NG")}
                  </strong>

                  <span>View →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
