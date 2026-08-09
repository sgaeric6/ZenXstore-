"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const [showAdminShortcut, setShowAdminShortcut] = useState(false);

  useEffect(() => {
    if (logoTaps >= 10) {
      setShowAdminShortcut(true);
      setLogoTaps(0);
    }
  }, [logoTaps]);

  return (
    <>
      <header className="navbar">
        <div className="navContainer">
          <button
            className="brand"
            onClick={() => setLogoTaps((value) => value + 1)}
            aria-label="ZenXStore"
          >
            <span className="brandMark">ZX</span>
            <span className="brandText">
              ZEN<span>X</span>STORE
            </span>
          </button>

          <nav className={`navLinks ${menuOpen ? "mobileOpen" : ""}`}>
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>

            <Link href="/marketplace" onClick={() => setMenuOpen(false)}>
              Marketplace
            </Link>

            <Link href="/sell" onClick={() => setMenuOpen(false)}>
              Sell
            </Link>

            <Link href="/support" onClick={() => setMenuOpen(false)}>
              Support
            </Link>
          </nav>

          <div className="navActions">
            <Link href="/login" className="navLogin">
              Login
            </Link>

            <Link href="/signup" className="navSignup">
              Get Started
            </Link>
          </div>

          <button
            className="menuButton"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </header>

      {showAdminShortcut && (
        <div className="adminShortcut">
          <span>Admin access unlocked</span>
          <Link href="/admin/login">Open Admin</Link>
          <button onClick={() => setShowAdminShortcut(false)}>×</button>
        </div>
      )}
    </>
  );
}
