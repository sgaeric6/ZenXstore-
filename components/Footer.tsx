import Link from "next/link";

export default function Footer() {
  return (
    <footer className="siteFooter">
      <div className="footerMain">
        <div className="footerBrand">
          <div className="brand">
            <span className="brandMark">ZX</span>
            <span className="brandText">
              ZEN<span>X</span>STORE
            </span>
          </div>

          <p>
            Premium gaming accounts for players who want a simple and secure
            marketplace experience.
          </p>
        </div>

        <div className="footerColumn">
          <h4>Marketplace</h4>
          <Link href="/marketplace">Browse Accounts</Link>
          <Link href="/sell">Sell Account</Link>
        </div>

        <div className="footerColumn">
          <h4>Support</h4>
          <Link href="/support">Contact Support</Link>
          <Link href="/orders">My Orders</Link>
        </div>

        <div className="footerColumn">
          <h4>Account</h4>
          <Link href="/login">Login</Link>
          <Link href="/signup">Create Account</Link>
        </div>
      </div>

      <div className="footerBottom">
        <span>© {new Date().getFullYear()} ZenXStore</span>
        <span>Gaming accounts marketplace</span>
      </div>
    </footer>
  );
}
