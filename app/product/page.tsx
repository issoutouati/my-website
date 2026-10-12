"use client";

import { useState, Suspense } from "react";
import PageLoader from "@/components/PageLoader";
import Lightbox from "@/components/LightBox";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { getProductDetail, PRODUCTS } from "@/lib/products";

// ─────────────────────────────────────────────────────────────────────────────
function ProductContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, isInCart } = useCart();
  const { has: isWished, toggle: toggleWish } = useWishlist();

  // Resolve the product from ?id= (falls back to the first product in the catalog).
  const id = searchParams.get("id") ?? PRODUCTS[0].id;
  const p = getProductDetail(id);

  const [activeImg,  setActiveImg]  = useState(0);
  const [lightbox,   setLightbox]   = useState(false);
  const [activeTab,  setActiveTab]  = useState<"specs" | "delivery" | "payment">("specs");
  const [payModal,   setPayModal]   = useState(false);
  const [cartAdded,  setCartAdded]  = useState(false);

  // Unknown id → graceful not-found instead of a blank page.
  if (!p) {
    return (
      <section style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "calc(var(--nav-h) + var(--space-24)) var(--space-6) var(--space-24)" }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: "var(--space-4)" }}>NOT FOUND</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "var(--fs-h2)", color: "var(--text)", marginBottom: "var(--space-6)" }}>This timepiece is unavailable</h1>
          <Link href="/shop" className="btn-gold">BROWSE THE COLLECTION</Link>
        </div>
      </section>
    );
  }

  // Real add-to-cart (collection stored as its display name for the cart UI)
  const addItem = () =>
    addToCart({ id: p.id, name: p.name, price: p.price, image: p.images[0], collection: p.collectionName });

  const handleAddCart = () => {
    addItem();
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2200);
  };

  // Buy now: ensure the item is in the cart, then go straight to checkout
  const handleBuyNow = () => {
    if (!isInCart(p.id)) addItem();
    setPayModal(false);
    router.push("/checkout");
  };

  const statusLabel =
    p.available === "last" ? "LAST PIECE"
    : p.available           ? "IN STOCK"
    :                         "OUT OF STOCK";

  const statusColor =
    p.available === "last" ? "#e8a020"
    : p.available           ? "#5a9a5a"
    :                         "#8a3a3a";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            image: p.images,
            sku: p.reference,
            brand: { "@type": "Brand", name: "ISSO TIME LUXURY" },
            offers: {
              "@type": "Offer",
              priceCurrency: "DZD",
              price: p.price,
              availability:
                p.available === false
                  ? "https://schema.org/OutOfStock"
                  : "https://schema.org/InStock",
            },
          }),
        }}
      />
      <style>{`
        /* Global reset + fonts now come from globals.css / layout — not duplicated here. */

        .pp { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; padding-top: var(--nav-h); }

        /* ── BREADCRUMB ── */
        .pp-bread {
          padding: 20px 48px;
          border-bottom: 1px solid var(--border-soft);
          display: flex; align-items: center; gap: 10px;
          background: var(--surface-deep);
        }
        .pp-bread a, .pp-bread span {
          font-family: var(--font-display);
          font-size: 0.55rem;
          letter-spacing: 0.22em;
          color: var(--text-muted);   /* was #3a3018 (near-invisible) */
          text-decoration: none;
          transition: color 0.2s;
        }
        .pp-bread a:hover { color: var(--gold); }
        .pp-bread-sep { color: var(--text-muted); }
        .pp-bread span:last-child { color: var(--text-2); }

        /* ── MAIN GRID ── */
        .pp-grid {
          max-width: 1340px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          min-height: calc(100vh - 60px);
        }

        /* ── LEFT — GALLERY ── */
        .pp-gallery {
          position: sticky;
          top: var(--nav-h);                       /* stick below the fixed navbar */
          height: calc(100vh - var(--nav-h));
          display: flex;
          flex-direction: column;
          gap: 0;
          border-right: 1px solid var(--border-soft);
          overflow: hidden;
        }
        .pp-main-img {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #0e0e0e, #0a0800);
          display: flex; align-items: center; justify-content: center;
        }
        .pp-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.08; pointer-events: none; }
        .pp-ph-outer { width: 220px; height: 220px; border-radius: 50%; border: 1px solid var(--gold); display: flex; align-items: center; justify-content: center; animation: ppRotate 20s linear infinite; }
        .pp-ph-inner { width: 160px; height: 160px; border-radius: 50%; border: 1px solid var(--gold); position: relative; display: flex; align-items: center; justify-content: center; }
        .pp-ph-inner::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          background: repeating-conic-gradient(rgba(201,168,76,0.6) 0deg, rgba(201,168,76,0.6) 1deg, transparent 1deg, transparent 30deg);
          mask-image: radial-gradient(circle, transparent 86%, black 86%);
        }
        .pp-ph-hh { position: absolute; width: 2px; height: 44px; background: linear-gradient(to top, var(--gold), transparent); bottom: 50%; left: 50%; transform-origin: bottom center; transform: translateX(-50%) rotate(-60deg); }
        .pp-ph-mm { position: absolute; width: 1px; height: 60px; background: linear-gradient(to top, #c9a84c80, transparent); bottom: 50%; left: 50%; transform-origin: bottom center; transform: translateX(-50%) rotate(120deg); }
        @keyframes ppRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .pp-main-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease); }
        .pp-main-img:hover img { transform: scale(1.04); }

        .pp-wish-btn {
          position: absolute; top: 20px; right: 20px; z-index: 5;
          width: 40px; height: 40px;
          background: rgba(8,8,8,0.8);
          border: 1px solid var(--border);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: border-color 0.2s;
        }
        .pp-wish-btn:hover { border-color: var(--gold); }
        .pp-wish-btn svg { width: 16px; height: 16px; stroke-width: 1.5; transition: fill 0.2s, stroke 0.2s; }
        .pp-wish-btn.on svg { fill: var(--gold); stroke: var(--gold); }
        .pp-wish-btn:not(.on) svg { fill: none; stroke: var(--gold); }

        .pp-thumbs { display: flex; gap: 1px; background: var(--border-soft); border-top: 1px solid var(--border-soft); height: 100px; flex-shrink: 0; }
        .pp-thumb { flex: 1; position: relative; overflow: hidden; cursor: pointer; background: #0a0800; transition: opacity 0.2s; opacity: 0.45; }
        .pp-thumb.active { opacity: 1; }
        .pp-thumb::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--gold); opacity: 0; transition: opacity 0.2s; }
        .pp-thumb.active::after { opacity: 1; }
        .pp-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .pp-thumb-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.15; }
        .pp-thumb-ph svg { width: 24px; height: 24px; stroke: var(--gold); fill: none; stroke-width: 1.2; }

        /* ── RIGHT — INFO ── */
        .pp-info { padding: 52px 52px 80px; display: flex; flex-direction: column; gap: 24px; overflow-y: auto; }

        .pp-eyebrow { font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.32em; color: var(--gold); opacity: 0.8; }
        .pp-name { font-family: var(--font-display); font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 700; letter-spacing: 0.14em; color: var(--text); line-height: 1.1; }
        .pp-brand { font-size: 0.88rem; color: var(--text-2); letter-spacing: 0.1em; font-style: italic; }  /* was #5a4e2c */

        .pp-price-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); gap: 16px; flex-wrap: wrap; }
        .pp-price { font-family: var(--font-display); font-size: 2rem; color: var(--text); letter-spacing: 0.08em; font-weight: 700; }
        .pp-price-sub { font-family: var(--font-display); font-size: 0.5rem; letter-spacing: 0.22em; color: var(--text-muted); margin-top: 4px; }  /* was #4a3e1e */
        .pp-status { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.2em; }
        .pp-status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

        .pp-highlights { display: flex; flex-direction: column; gap: 10px; }
        .pp-hl-title { font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.26em; color: var(--text-muted); margin-bottom: 4px; }  /* was #4a3e1e */
        .pp-hl-item { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: var(--text-2); font-style: italic; }  /* was #7a6a3a */
        .pp-hl-item::before { content: ''; width: 18px; height: 1px; background: var(--gold); opacity: 0.5; flex-shrink: 0; }

        .pp-delivery { background: #0a0800; border: 1px solid var(--border-soft); padding: 18px 20px; display: flex; gap: 16px; align-items: flex-start; }
        .pp-del-icon svg { width: 20px; height: 20px; stroke: var(--gold); fill: none; stroke-width: 1.2; opacity: 0.7; }
        .pp-del-label { font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.2em; color: var(--gold); margin-bottom: 5px; }
        .pp-del-detail { font-size: 0.85rem; color: var(--text-2); line-height: 1.6; font-style: italic; }  /* was #5a4e2c */

        /* CTA BUTTONS */
        .pp-cta-group { display: flex; flex-direction: column; gap: 12px; }
        .pp-btn-cart {
          font-family: var(--font-display); font-size: 0.68rem; letter-spacing: 0.22em; font-weight: 700;
          padding: 17px 32px; background: var(--gold-grad); color: var(--bg);
          border: none; cursor: pointer; transition: opacity 0.2s, transform 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 12px; width: 100%;
        }
        .pp-btn-cart:hover:not(:disabled) { opacity: 0.88; transform: scale(1.01); }
        .pp-btn-cart:disabled { opacity: 0.4; cursor: not-allowed; }
        .pp-btn-cart.added { background: linear-gradient(135deg, #5a9a5a, #3a6a3a); color: #fff; }

        .pp-btn-pay {
          font-family: var(--font-display); font-size: 0.65rem; letter-spacing: 0.2em; font-weight: 700;
          padding: 16px 32px; background: transparent; color: var(--gold); border: 1px solid var(--gold);
          cursor: pointer; transition: background 0.25s, color 0.25s; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .pp-btn-pay:hover:not(:disabled) { background: rgba(201,168,76,0.08); }
        .pp-btn-pay:disabled { opacity: 0.4; cursor: not-allowed; }

        .pp-btn-viewing {
          font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.2em;
          color: var(--text-muted); background: none; border: none; cursor: pointer;  /* was #3a3018 */
          text-align: center; padding: 8px; transition: color 0.2s; text-decoration: none; display: block;
        }
        .pp-btn-viewing:hover { color: var(--gold); }

        .pp-pay-icons { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
        .pp-pay-label { font-family: var(--font-display); font-size: 0.5rem; letter-spacing: 0.2em; color: var(--text-muted); }  /* was #3a3018 */
        .pp-pay-icon { font-family: var(--font-display); font-size: 0.5rem; letter-spacing: 0.14em; padding: 5px 10px; border: 1px solid var(--border); color: var(--text-muted); }  /* was #4a3e1e */

        /* ── TABS ── */
        .pp-tabs { border-top: 1px solid var(--border-soft); margin-top: 4px; }
        .pp-tab-nav { display: flex; border-bottom: 1px solid var(--border-soft); gap: 0; }
        .pp-tab-btn {
          font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.2em;
          color: var(--text-muted); background: none; border: none; border-bottom: 2px solid transparent;  /* was #3a3018 */
          padding: 16px 24px; cursor: pointer; transition: color 0.2s, border-color 0.2s; white-space: nowrap;
        }
        .pp-tab-btn:hover { color: var(--gold); }
        .pp-tab-btn.active { color: var(--gold); border-bottom-color: var(--gold); }
        .pp-tab-content { padding: 28px 0; }

        .pp-spec-table { display: flex; flex-direction: column; gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); }
        .pp-spec-row { display: grid; grid-template-columns: 160px 1fr; background: var(--bg); transition: background 0.2s; }
        .pp-spec-row:hover { background: #0d0b05; }
        .pp-spec-key { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.2em; color: var(--text-muted); padding: 14px 16px; border-right: 1px solid var(--border-soft); display: flex; align-items: center; }  /* was #4a3e1e */
        .pp-spec-val { font-size: 0.9rem; color: var(--text-2); padding: 14px 16px; display: flex; align-items: center; font-style: italic; }  /* was #c8b87a */

        .pp-del-tab, .pp-pay-tab { display: flex; flex-direction: column; gap: 16px; }
        .pp-del-card, .pp-pay-card { background: #0a0800; border: 1px solid var(--border-soft); padding: 20px 22px; display: flex; gap: 16px; align-items: flex-start; }
        .pp-del-card svg, .pp-pay-card svg { width: 22px; height: 22px; stroke: var(--gold); fill: none; stroke-width: 1.2; opacity: 0.65; flex-shrink: 0; margin-top: 2px; }
        .pp-del-card-title, .pp-pay-card-title { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--gold); margin-bottom: 6px; }
        .pp-del-card-body, .pp-pay-card-body { font-size: 0.88rem; color: var(--text-2); line-height: 1.7; font-style: italic; }  /* was #5a4e2c */

        /* ── RELATED ── */
        .pp-related { max-width: 1340px; margin: 0 auto; padding: 80px 48px 100px; border-top: 1px solid var(--border-soft); }
        .pp-rel-head { text-align: center; margin-bottom: 48px; }
        .pp-rel-eyebrow { font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.32em; color: var(--text-muted); margin-bottom: 12px; }  /* was #4a3e1e */
        .pp-rel-title { font-family: var(--font-display); font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 700; letter-spacing: 0.2em; color: var(--gold); margin-bottom: 18px; }
        .pp-rel-div { display: flex; align-items: center; gap: 12px; justify-content: center; }
        .prd-l { width: 56px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .prd-l.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .prd-d { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); }

        .pp-rel-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); }
        .pp-rel-card { background: var(--bg); text-decoration: none; color: inherit; display: flex; flex-direction: column; transition: background 0.3s; }
        .pp-rel-card:hover { background: #0d0b05; }
        .pp-rel-img { aspect-ratio: 1/1; position: relative; overflow: hidden; background: linear-gradient(145deg, #0e0e0e, #0a0800); }
        .pp-rel-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.55s; }
        .pp-rel-card:hover .pp-rel-img img { transform: scale(1.06); }
        .pp-rel-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.1; }
        .pp-rel-ph svg { width: 40px; height: 40px; stroke: var(--gold); fill: none; stroke-width: 1; }
        .pp-rel-body { padding: 18px 16px 20px; border-top: 1px solid var(--border-soft); }
        .pp-rel-col { font-family: var(--font-display); font-size: 0.52rem; letter-spacing: 0.22em; color: var(--gold); opacity: 0.8; margin-bottom: 5px; }
        .pp-rel-name { font-size: 0.92rem; color: var(--text-2); font-style: italic; margin-bottom: 10px; }  /* was #c8b87a */
        .pp-rel-price { font-family: var(--font-display); font-size: 0.95rem; color: var(--text); }

        /* ── PAYMENT MODAL ── */
        .pp-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,0.88); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .pp-modal { background: var(--surface); border: 1px solid var(--border); max-width: 480px; width: 100%; padding: 48px 40px; position: relative; display: flex; flex-direction: column; gap: 20px; }
        .pp-modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: var(--text-muted); font-family: var(--font-display); font-size: 0.65rem; letter-spacing: 0.16em; cursor: pointer; transition: color 0.2s; }  /* was #4a3e1e */
        .pp-modal-close:hover { color: var(--gold); }
        .pp-modal-title { font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; letter-spacing: 0.16em; color: var(--text); }
        .pp-modal-div { width: 36px; height: 1px; background: var(--gold); }
        .pp-modal-method { background: #0a0800; border: 1px solid var(--border-soft); padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; }
        .pp-modal-method-title { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--gold); }
        .pp-modal-method-desc { font-size: 0.85rem; color: var(--text-2); line-height: 1.6; font-style: italic; }  /* was #5a4e2c */
        .pp-modal-total { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-top: 1px solid var(--border-soft); }
        .pp-modal-total-label { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--text-muted); }  /* was #4a3e1e */
        .pp-modal-total-note { font-size: 0.75rem; color: var(--text-muted); font-style: italic; margin-top: 4px; }  /* was #3a3018 */
        .pp-modal-total-price { font-family: var(--font-display); font-size: 1.2rem; color: var(--text); font-weight: 700; }
        .pp-modal-confirm { font-family: var(--font-display); font-size: 0.65rem; letter-spacing: 0.22em; font-weight: 700; padding: 15px; background: var(--gold-grad); color: var(--bg); border: none; cursor: pointer; width: 100%; transition: opacity 0.2s; }
        .pp-modal-confirm:hover { opacity: 0.88; }

        /* ── RESPONSIVE ── */
        @media (max-width: 960px) {
          .pp-grid { grid-template-columns: 1fr; }
          .pp-gallery { position: relative; top: 0; height: auto; }
          /* flex:1 (flex-basis 0) collapses to 0 once the gallery is
             auto-height. Pin the main image so it shows above the thumbnails;
             min() keeps it near-square on phones, capped on tablets. */
          .pp-main-img { flex: 0 0 auto; height: min(440px, 92vw); }
          .pp-info { padding: 36px 24px 60px; }
          .pp-related { padding: 60px 20px 80px; }
          .pp-bread { padding: 16px 20px; }
        }
        @media (max-width: 640px) {
          .pp-rel-grid { grid-template-columns: 1fr; }
          .pp-spec-row { grid-template-columns: 120px 1fr; }
          .pp-modal { padding: 36px 24px; }
          /* Slightly shorter thumbnail strip on small phones */
          .pp-thumbs { height: 84px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pp-ph-outer { animation: none; }
        }
      `}</style>

      <div className="pp">

        {/* ── BREADCRUMB ── */}
        <nav className="pp-bread" aria-label="Breadcrumb">
          <Link href="/">HOME</Link>
          <span className="pp-bread-sep">›</span>
          <Link href="/shop">SHOP</Link>
          <span className="pp-bread-sep">›</span>
          <Link href={`/shop?collection=${p.collection}`}>{p.collectionName}</Link>
          <span className="pp-bread-sep">›</span>
          <span>{p.name.toUpperCase()}</span>
        </nav>

        {/* ── MAIN GRID ── */}
        <div className="pp-grid">

          {/* ═══ LEFT — GALLERY ═══ */}
          <div className="pp-gallery">
            <div className="pp-main-img">
              <div className="pp-ph">
                <div className="pp-ph-outer">
                  <div className="pp-ph-inner">
                    <div className="pp-ph-hh" />
                    <div className="pp-ph-mm" />
                  </div>
                </div>
              </div>
              <img
                src={p.images[activeImg]}
                alt={p.name}
                onClick={() => setLightbox(true)}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <button
                className="pp-expand"
                onClick={() => setLightbox(true)}
                aria-label="Open image full screen"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M8 3H4a1 1 0 00-1 1v4M16 3h4a1 1 0 011 1v4M8 21H4a1 1 0 01-1-1v-4M16 21h4a1 1 0 001-1v-4"
                        stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className={`pp-wish-btn ${isWished(p.id) ? "on" : ""}`}
                onClick={() => toggleWish(p.id)}
                aria-label="Wishlist"
                aria-pressed={isWished(p.id)}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            <div className="pp-thumbs">
              {p.images.map((img, i) => (
                <button
                  key={i}
                  className={`pp-thumb ${activeImg === i ? "active" : ""}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <div className="pp-thumb-ph">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="7" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="14"/></svg>
                  </div>
                  <img src={img} alt={`${p.name} view ${i + 1}`} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </button>
              ))}
            </div>
          </div>

          {/* ═══ RIGHT — INFO ═══ */}
          <div className="pp-info">

            <div>
              <p className="pp-eyebrow">{p.collectionName} COLLECTION</p>
              <h1 className="pp-name">{p.name}</h1>
              <p className="pp-brand">{p.brand}</p>
            </div>

            <div className="pp-price-row">
              <div>
                <div className="pp-price">{p.price.toLocaleString("fr-DZ")} DA</div>
                <div className="pp-price-sub">PRIX TTC · LIVRAISON EN SUS</div>
              </div>
              <div className="pp-status">
                <div className="pp-status-dot" style={{ background: statusColor }} />
                <span style={{ color: statusColor }}>{statusLabel}</span>
              </div>
            </div>

            <div className="pp-highlights">
              <p className="pp-hl-title">KEY FEATURES</p>
              {p.highlights.map((h, i) => (
                <div key={i} className="pp-hl-item">{h}</div>
              ))}
            </div>

            <div className="pp-delivery">
              <div className="pp-del-icon">
                <svg viewBox="0 0 24 24">
                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                  <path d="M16 8h4l3 3v5h-7V8z"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              </div>
              <div className="pp-del-text">
                <div className="pp-del-label">LIVRAISON</div>
                <div className="pp-del-detail">
                  Délai de {p.deliveryDays} jours ouvrables · Frais de livraison : {p.deliveryPrice.toLocaleString("fr-DZ")} DA
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pp-cta-group">
              <button
                className={`pp-btn-cart ${cartAdded ? "added" : ""}`}
                onClick={handleAddCart}
                disabled={!p.available}
              >
                {cartAdded ? (
                  <><span>✓</span> ADDED TO CART</>
                ) : p.available ? (
                  <><svg style={{ width: 16, height: 16, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }} viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg> ADD TO CART</>
                ) : (
                  "OUT OF STOCK"
                )}
              </button>

              <button className="pp-btn-pay" onClick={() => setPayModal(true)} disabled={!p.available}>
                <svg style={{ width: 16, height: 16, stroke: "currentColor", fill: "none", strokeWidth: 1.8 }} viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                BUY NOW — CASH ON DELIVERY / BARIDIMOB
              </button>

              <Link href="/contact" className="pp-btn-viewing">
                REQUEST A PRIVATE VIEWING →
              </Link>
            </div>

            <div className="pp-pay-icons">
              <span className="pp-pay-label">PAYMENT</span>
              <span className="pp-pay-icon">CASH ON DELIVERY</span>
              <span className="pp-pay-icon">BARIDIMOB</span>
              <span className="pp-pay-icon">CIB</span>
            </div>

            {/* Tabs */}
            <div className="pp-tabs">
              <div className="pp-tab-nav">
                {(["specs", "delivery", "payment"] as const).map((t) => (
                  <button
                    key={t}
                    className={`pp-tab-btn ${activeTab === t ? "active" : ""}`}
                    onClick={() => setActiveTab(t)}
                  >
                    {t === "specs" ? "SPECIFICATIONS" : t === "delivery" ? "DELIVERY" : "PAYMENT"}
                  </button>
                ))}
              </div>

              <div className="pp-tab-content">
                {activeTab === "specs" && (
                  <div className="pp-spec-table">
                    {p.specs.map((s) => (
                      <div key={s.label} className="pp-spec-row">
                        <div className="pp-spec-key">{s.label}</div>
                        <div className="pp-spec-val">{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "delivery" && (
                  <div className="pp-del-tab">
                    <div className="pp-del-card">
                      <svg viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                      <div>
                        <div className="pp-del-card-title">DÉLAI DE LIVRAISON</div>
                        <div className="pp-del-card-body">
                          Votre commande sera livrée dans un délai de <strong style={{ color: "var(--gold)" }}>{p.deliveryDays} jours ouvrables</strong> après confirmation du paiement. Livraison disponible à travers tout le territoire algérien.
                        </div>
                      </div>
                    </div>
                    <div className="pp-del-card">
                      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                      <div>
                        <div className="pp-del-card-title">FRAIS DE LIVRAISON</div>
                        <div className="pp-del-card-body">
                          Frais de livraison : <strong style={{ color: "var(--gold)" }}>{p.deliveryPrice.toLocaleString("fr-DZ")} DA</strong>. Votre montre sera emballée dans un coffret de luxe ISSO TIME.
                        </div>
                      </div>
                    </div>
                    <div className="pp-del-card">
                      <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                      <div>
                        <div className="pp-del-card-title">EMBALLAGE LUXE</div>
                        <div className="pp-del-card-body">
                          Chaque montre est livrée dans un coffret signature ISSO TIME avec pochette en velours et carte d&apos;authenticité.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "payment" && (
                  <div className="pp-pay-tab">
                    <div className="pp-pay-card">
                      <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                      <div>
                        <div className="pp-pay-card-title">PAIEMENT À LA LIVRAISON</div>
                        <div className="pp-pay-card-body">
                          Réglez en espèces directement à la réception de votre commande. Aucune information bancaire requise.
                        </div>
                      </div>
                    </div>
                    <div className="pp-pay-card">
                      <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" strokeWidth="2"/></svg>
                      <div>
                        <div className="pp-pay-card-title">BARIDIMOB / CIB</div>
                        <div className="pp-pay-card-body">
                          Paiement sécurisé via BaridiMob (Algérie Poste) ou votre carte CIB. Rapide, simple et 100% sécurisé.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        <div className="pp-related">
          <div className="pp-rel-head">
            <p className="pp-rel-eyebrow">DISCOVER MORE</p>
            <h2 className="pp-rel-title">YOU MAY ALSO LIKE</h2>
            <div className="pp-rel-div">
              <span className="prd-l" /><span className="prd-d" /><span className="prd-l r" />
            </div>
          </div>
          <div className="pp-rel-grid">
            {p.related.map((r) => (
              <Link key={r.id} href={`/product?id=${r.id}`} className="pp-rel-card">
                <div className="pp-rel-img">
                  <div className="pp-rel-ph">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><line x1="12" y1="7" x2="12" y2="12"/><line x1="12" y1="12" x2="15" y2="14"/></svg>
                  </div>
                  <img src={r.image} alt={r.name} onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
                <div className="pp-rel-body">
                  <div className="pp-rel-col">{r.collectionName} COLLECTION</div>
                  <div className="pp-rel-name">{r.name}</div>
                  <div className="pp-rel-price">{r.price.toLocaleString("fr-DZ")} DA</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── PAYMENT MODAL ── */}
        {payModal && (
          <div className="pp-modal-bg" onClick={() => setPayModal(false)} role="dialog" aria-modal="true" aria-label="Complete your order">
            <div className="pp-modal" onClick={(e) => e.stopPropagation()}>
              <button className="pp-modal-close" onClick={() => setPayModal(false)}>✕ CLOSE</button>
              <h2 className="pp-modal-title">COMPLETE YOUR ORDER</h2>
              <div className="pp-modal-div" />

              <div className="pp-modal-method">
                <div className="pp-modal-method-title">CASH ON DELIVERY</div>
                <div className="pp-modal-method-desc">
                  Payez en espèces à la livraison. Notre équipe vous contactera sous 24h pour confirmer votre commande et coordonner la livraison.
                </div>
              </div>

              <div className="pp-modal-method">
                <div className="pp-modal-method-title">BARIDIMOB / CIB</div>
                <div className="pp-modal-method-desc">
                  Paiement en ligne via BaridiMob ou carte CIB. Après confirmation, votre montre sera expédiée sous {p.deliveryDays} jours ouvrables.
                </div>
              </div>

              <div className="pp-modal-total">
                <div>
                  <div className="pp-modal-total-label">SOUS-TOTAL</div>
                  <div className="pp-modal-total-note">+ {p.deliveryPrice.toLocaleString("fr-DZ")} DA livraison</div>
                </div>
                <div className="pp-modal-total-price">
                  {(p.price + p.deliveryPrice).toLocaleString("fr-DZ")} DA
                </div>
              </div>

              <button className="pp-modal-confirm" onClick={handleBuyNow}>
                CONFIRM ORDER →
              </button>
            </div>
          </div>
        )}

      </div>

      <Lightbox
        images={p.images}
        startIndex={activeImg}
        open={lightbox}
        onClose={() => setLightbox(false)}
        onIndexChange={setActiveImg}
        alt={p.name}
      />
    </>
  );
}

// useSearchParams requires a Suspense boundary in the App Router.
export default function ProductPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProductContent />
    </Suspense>
  );
}