"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";

/**
 * NOTE: /contact does not exist yet (404). Kept because it's intended nav.
 */
const LINKS = [
  { href: "/", label: "HOME" },
  { href: "/shop", label: "SHOP" },
  { href: "/collections", label: "COLLECTIONS" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { count: wishCount } = useWishlist();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll-aware: transparent over the hero at the top, refined solid panel once
  // you scroll. Only flips state at the threshold crossing — not every frame.
  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 16;
      setScrolled((prev) => (prev === s ? prev : s));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile menu while it's open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className={`nav${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="nav-row">

        {/* Wordmark */}
        <Link href="/" className="nav-logo" aria-label="ISSO TIME LUXURY — home" onClick={() => setOpen(false)}>
          <span className="nav-logo-main">ISSO TIME</span>
          <span className="nav-logo-accent">LUXURY</span>
        </Link>

        {/* Desktop nav — optically centered via the 3-column grid */}
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link${isActive(href) ? " active" : ""}`}
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="nav-actions">
          <Link
            href="/wishlist"
            className="nav-icon"
            style={{ color: "#e8d5a3" }}
            aria-label={`Wishlist, ${wishCount} item${wishCount === 1 ? "" : "s"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8d5a3" strokeWidth="1.5" style={{ display: "block" }}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            {wishCount > 0 && <span className="nav-badge">{wishCount > 9 ? "9+" : wishCount}</span>}
          </Link>

          <Link
            href="/cart"
            className="nav-icon"
            style={{ color: "#e8d5a3" }}
            aria-label={`Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8d5a3" strokeWidth="1.5" style={{ display: "block" }}>
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {totalItems > 0 && <span className="nav-badge">{totalItems > 9 ? "9+" : totalItems}</span>}
          </Link>

          <button
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8d5a3" strokeWidth="1.4"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8d5a3" strokeWidth="1.4"><line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="17" x2="21" y2="17" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="nav-mobile">
        <nav aria-label="Mobile">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-mobile-link${isActive(href) ? " active" : ""}`}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

    </header>
  );
}