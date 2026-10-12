"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { getProducts } from "@/lib/products";
import { COLLECTIONS as CATALOG_COLLECTIONS, getCollectionName } from "@/lib/collections";
import ProductCard from "@/components/ProductCard";

// Products + collections now come from the shared catalog (lib/products, lib/collections).
// Filter options: an "ALL" pill plus one per collection (id used for filtering, name shown).
const FILTERS = [{ id: "all", name: "ALL" }, ...CATALOG_COLLECTIONS.map((c) => ({ id: c.id, name: c.name }))];
const COLLECTION_IDS = FILTERS.map((f) => f.id);
const SORTS = [
  { label: "FEATURED", value: "featured" },
  { label: "PRICE ↑", value: "asc" },
  { label: "PRICE ↓", value: "desc" },
];

// ─────────────────────────────────────────────────────────────────────────────
function ShopContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();

  // Read ?collection= from the URL (home & collections link here, e.g. ?collection=classic)
  const resolveCol = (raw: string | null) => {
    const c = raw?.toLowerCase();
    return c && COLLECTION_IDS.includes(c) ? c : "all";
  };

  const [activeCol, setActiveCol] = useState(() => resolveCol(searchParams.get("collection")));
  const [activeSort, setActiveSort] = useState("featured");

  // Keep the active filter in sync if the URL param changes (e.g. arriving from
  // a "Shop Classic" link while already on /shop). Manual filter clicks don't
  // change the URL, so they aren't overridden by this effect.
  useEffect(() => {
    setActiveCol(resolveCol(searchParams.get("collection")));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const products = useMemo(() => {
    const all = getProducts();
    let list = activeCol === "all" ? all : all.filter((p) => p.collection === activeCol);
    if (activeSort === "asc") list = [...list].sort((a, b) => a.price - b.price);
    if (activeSort === "desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [activeCol, activeSort]);

  return (
    <>
      <style>{`
        /* Global reset + fonts now come from globals.css / layout — not duplicated here. */

        .shop-page {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          min-height: 100vh;
          padding-top: var(--nav-h);   /* clear the fixed navbar */
        }

        /* ── HERO BANNER ── */
        .shop-hero { position: relative; height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; overflow: hidden; padding: 0 24px; }
        .shop-hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 90% 100% at 50% 0%, #1a1200 0%, var(--bg) 70%); }
        .shop-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 80% 100% at 50% 0%, black 30%, transparent 100%);
        }
        .shop-hero-ring { position: absolute; width: 480px; height: 480px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.07); top: -180px; left: 50%; transform: translateX(-50%); pointer-events: none; }
        .shop-hero-ring-2 { position: absolute; width: 680px; height: 680px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.04); top: -280px; left: 50%; transform: translateX(-50%); pointer-events: none; }
        .shop-hero-eyebrow { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.38em; color: var(--gold); opacity: 0.8; position: relative; z-index: 2; margin-bottom: 14px; }
        .shop-hero-title { font-family: var(--font-display); font-size: clamp(2rem, 6vw, 3.8rem); font-weight: 700; letter-spacing: 0.22em; color: var(--text); position: relative; z-index: 2; margin-bottom: 18px; line-height: 1.05; }
        .shop-hero-divider { display: flex; align-items: center; gap: 12px; position: relative; z-index: 2; }
        .sh-line { width: 60px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .sh-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .sh-diamond { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); }
        .shop-hero-count { position: relative; z-index: 2; margin-top: 18px; font-size: 0.78rem; color: var(--text-2); letter-spacing: 0.12em; font-style: italic; }  /* was #5a4e2c */

        /* ── TOOLBAR ── */
        .shop-toolbar {
          position: sticky;
          top: var(--nav-h);   /* stick below the fixed navbar */
          z-index: 20;
          background: rgba(8,8,8,0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-soft);
          padding: 0 32px;
          display: flex; align-items: stretch; justify-content: space-between; gap: 16px; flex-wrap: wrap;
        }
        .shop-filters { display: flex; align-items: center; gap: 0; }
        .filter-btn {
          font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.24em;
          color: var(--text-muted); background: none; border: none; border-bottom: 2px solid transparent;  /* was #4a3e1e */
          padding: 20px 20px; cursor: pointer; transition: color 0.2s, border-color 0.2s; white-space: nowrap;
        }
        .filter-btn:hover { color: var(--gold); }
        .filter-btn.active { color: var(--gold); border-bottom-color: var(--gold); }

        .shop-sort { display: flex; align-items: center; gap: 8px; }
        .sort-label { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.22em; color: var(--text-muted); }  /* was #3a3018 */
        .sort-btn {
          font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.18em;
          color: var(--text-muted); background: none; border: 1px solid transparent; padding: 6px 12px; cursor: pointer; transition: all 0.2s;  /* was #4a3e1e */
        }
        .sort-btn:hover { color: var(--gold); border-color: var(--border); }
        .sort-btn.active { color: var(--gold); border-color: var(--gold); background: rgba(201,168,76,0.06); }

        /* ── PRODUCT GRID ── */
        .shop-body { max-width: 1340px; margin: 0 auto; padding: 56px 32px 100px; }
        .products-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); }

        /* Product card styles now live in components/ProductCard.tsx */

        /* ── EMPTY STATE ── */
        .shop-empty { text-align: center; padding: 100px 24px; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .shop-empty-icon { width: 60px; height: 60px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
        .shop-empty-icon svg { width: 24px; height: 24px; stroke: var(--gold); fill: none; stroke-width: 1.2; opacity: 0.5; }
        .shop-empty-title { font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.2em; color: var(--text-2); }  /* was #4a3e1e */

        /* ── FOOTER BAND ── */
        .shop-footer-band { border-top: 1px solid var(--border-soft); padding: 40px 32px; display: flex; align-items: center; justify-content: center; gap: 48px; flex-wrap: wrap; background: var(--surface-deep); }
        .sfb-item { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
        .sfb-icon { width: 32px; height: 32px; stroke: var(--gold); fill: none; stroke-width: 1.2; opacity: 0.7; }
        .sfb-label { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.22em; color: var(--text-muted); }  /* was #4a3e1e */

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .shop-body { padding: 40px 16px 80px; }
          .shop-toolbar { padding: 0 16px; gap: 0; }
          .filter-btn { padding: 16px 12px; font-size: 0.55rem; }
        }
        @media (max-width: 480px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          /* Was display:none — sorting is now kept, wrapped onto its own row. */
          .shop-toolbar { flex-direction: column; align-items: stretch; gap: 0; }
          .shop-filters { overflow-x: auto; }
          .shop-sort { justify-content: center; padding: 10px 0 14px; border-top: 1px solid var(--border-soft); }
        }

      `}</style>

      <div className="shop-page">
        {/* ══ HERO BANNER ══ */}
        <div className="shop-hero">
          <div className="shop-hero-bg" />
          <div className="shop-hero-grid" />
          <div className="shop-hero-ring" />
          <div className="shop-hero-ring-2" />
          <p className="shop-hero-eyebrow">ISSO TIME LUXURY</p>
          <h1 className="shop-hero-title">THE COLLECTION</h1>
          <div className="shop-hero-divider">
            <span className="sh-line" />
            <span className="sh-diamond" />
            <span className="sh-line r" />
          </div>
          <p className="shop-hero-count">
            {products.length} timepiece{products.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* ══ STICKY TOOLBAR ══ */}
        <div className="shop-toolbar">
          <div className="shop-filters">
            {FILTERS.map((c) => (
              <button
                key={c.id}
                className={`filter-btn ${activeCol === c.id ? "active" : ""}`}
                onClick={() => setActiveCol(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="shop-sort">
            <span className="sort-label">SORT</span>
            {SORTS.map((s) => (
              <button
                key={s.value}
                className={`sort-btn ${activeSort === s.value ? "active" : ""}`}
                onClick={() => setActiveSort(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ PRODUCT GRID ══ */}
        <div className="shop-body">
          {products.length === 0 ? (
            <div className="shop-empty">
              <div className="shop-empty-icon">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
              </div>
              <p className="shop-empty-title">NO TIMEPIECES IN THIS COLLECTION</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  wished={isWished(p.id)}
                  onToggleWish={toggleWish}
                  onAdd={(prod) =>
                    addToCart({
                      id: prod.id,
                      name: prod.name,
                      price: prod.price,
                      image: prod.image,
                      collection: getCollectionName(prod.collection),
                    })
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* ══ TRUST STRIP ══ */}
        <div className="shop-footer-band">
          {[
            { label: "PAID DELIVERY",   icon: (<svg className="sfb-icon" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>) },
            { label: "2 YEAR WARRANTY", icon: (<svg className="sfb-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>) },
            { label: "SECURE PAYMENT",  icon: (<svg className="sfb-icon" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>) },
            { label: "AUTHENTIC SWISS", icon: (<svg className="sfb-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>) },
          ].map((item) => (
            <div key={item.label} className="sfb-item">
              {item.icon}
              <span className="sfb-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// useSearchParams requires a Suspense boundary in the App Router.
export default function ShopPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ShopContent />
    </Suspense>
  );
}