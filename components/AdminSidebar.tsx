import Link from "next/link";

export default function AdminSidebar() {
  return (
    <aside className="adminSidebar">
      <div className="adminBrand">
        <div className="adminLogo">Z</div>

        <div>
          <strong>ZenXStore</strong>
          <span>ADMIN</span>
        </div>
      </div>

      <nav>
        <Link href="/admin">
          Dashboard
        </Link>

        <Link href="/admin/accounts">
          Accounts
        </Link>

        <Link href="/admin/submissions">
          Seller submissions
        </Link>

        <Link href="/admin/orders">
          Orders
        </Link>

        <Link href="/admin/support">
          Support
        </Link>
      </nav>

      <Link href="/">
        ← Back to store
      </Link>
    </aside>
  );
}
