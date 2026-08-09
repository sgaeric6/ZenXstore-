"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const games = [
  "FC 26",
  "Call of Duty",
  "PUBG",
  "Fortnite",
  "Free Fire",
  "GTA",
];

export default function Hero() {
  const [gameIndex, setGameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setGameIndex((current) => (current + 1) % games.length);
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="heroSection">
      <div className="heroGlow heroGlowOne" />
      <div className="heroGlow heroGlowTwo" />

      <div className="heroInner">
        <div className="heroCopy">
          <div className="heroEyebrow">
            <span className="statusDot" />
            PREMIUM GAMING MARKETPLACE
          </div>

          <h1>
            Find your next
            <span> gaming account.</span>
          </h1>

          <p className="heroDescription">
            A focused marketplace for premium gaming accounts. Browse
            verified listings, view the full account details and purchase
            securely.
          </p>

          <div className="heroActions">
            <Link href="/marketplace" className="primaryButton">
              Browse Accounts
              <span>→</span>
            </Link>

            <Link href="/sell" className="secondaryButton">
              Sell an Account
            </Link>
          </div>

          <div className="heroTrust">
            <div>
              <strong>Secure</strong>
              <span>Transactions</span>
            </div>

            <div>
              <strong>Verified</strong>
              <span>Listings</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>Support</span>
            </div>
          </div>
        </div>

        <div className="heroVisual">
          <div className="gameOrb">
            <div className="orbRing orbRingOne" />
            <div className="orbRing orbRingTwo" />

            <div className="orbContent">
              <span className="orbLabel">LOOKING FOR</span>
              <strong>{games[gameIndex]}</strong>
              <span className="orbSubtext">Premium accounts</span>
            </div>
          </div>

          <div className="floatingCard floatingCardTop">
            <span>ACCOUNT STATUS</span>
            <strong>
              <i /> Available
            </strong>
          </div>

          <div className="floatingCard floatingCardBottom">
            <span>ZENX PROTECTION</span>
            <strong>Secure checkout</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
