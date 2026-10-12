"use client";

import Link from "next/link";
import Image from "next/image";
import SafeImage from "@/components/SafeImage";
import { useCart } from "@/lib/cart-context";
import { getBestSellers } from "@/lib/products";
import { getFeaturedCollections, getCollectionName, collectionHref } from "@/lib/collections";

// FEATURED collections and BEST_SELLERS are derived from the shared catalog
// inside the component (below). Only the assurance copy lives here.

const ASSURANCES = [
  { label: "AUTHENTICATED", sub: "Every piece verified", icon: (<svg className="assure-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>) },
  { label: "FREE DELIVERY", sub: "Across all 58 wilayas", icon: (<svg className="assure-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>) },
  { label: "2-YEAR WARRANTY", sub: "On every timepiece", icon: (<svg className="assure-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>) },
  { label: "CASH ON DELIVERY", sub: "Pay when it arrives", icon: (<svg className="assure-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>) },
];

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function HomePage() {
  const { addToCart } = useCart();

  const FEATURED = getFeaturedCollections().map((c) => ({
    id: c.id,
    title: c.name,
    subtitle: "COLLECTION",
    desc: c.blurb,
    image: c.image,
    href: collectionHref(c.id),
  }));
  const BEST_SELLERS = getBestSellers(4);

  return (
    <>
      <style>{`
        /* Global reset + fonts + button primitives come from globals.css / layout. */

        .home { background: var(--bg); color: var(--text); font-family: var(--font-body); }

        /* ════ HERO ════ */
        .hero {
          position: relative;
          width: 100%;
          height: 100svh;
          min-height: 640px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-fallback {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 50% 30%, #1a1200 0%, var(--bg) 70%),
            repeating-linear-gradient(-45deg, transparent, transparent 60px, rgba(201,168,76,0.025) 60px, rgba(201,168,76,0.025) 61px);
        }
        .hero-ring { position: absolute; width: min(70vw, 600px); height: min(70vw, 600px); border-radius: 50%; border: 1px solid rgba(201,168,76,0.12); box-shadow: 0 0 0 20px rgba(201,168,76,0.04), 0 0 80px 0 rgba(201,168,76,0.08); pointer-events: none; }
        .hero-ring-2 { position: absolute; width: min(85vw, 750px); height: min(85vw, 750px); border-radius: 50%; border: 1px solid rgba(201,168,76,0.06); pointer-events: none; }
        .hero-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; display: block; }
        .hero-overlay {
          position: absolute; inset: 0; z-index: 2;
          background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.05) 40%, rgba(8,8,8,0.92) 100%);
        }
        .hero-content {
          position: relative; z-index: 3; text-align: center; padding: 0 24px;
          display: flex; flex-direction: column; align-items: center; gap: 20px;
          animation: heroRise 1s var(--ease) both;
        }
        @keyframes heroRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .hero-eyebrow { font-family: var(--font-display); font-size: 0.65rem; letter-spacing: 0.35em; color: var(--gold); opacity: 0.85; }
        .hero-title { font-family: var(--font-display); font-size: clamp(2.4rem, 8vw, 5.5rem); font-weight: 700; letter-spacing: 0.18em; color: var(--text); line-height: 1.05; text-shadow: 0 2px 40px rgba(0,0,0,0.7); }
        .hero-title span { display: block; color: var(--gold); font-size: 0.55em; letter-spacing: 0.38em; font-weight: 400; margin-top: 6px; }
        .hero-tagline { font-size: clamp(0.95rem, 2.5vw, 1.25rem); color: var(--text-2); letter-spacing: 0.04em; font-style: italic; max-width: 480px; }
        .hero-cta-group { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; margin-top: 12px; }

        .hero-scroll { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); z-index: 4; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .hero-scroll-text { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.28em; color: var(--gold); opacity: 0.55; }
        .hero-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--gold), transparent); opacity: 0.5; }

        /* ════ SECTION SHARED ════ */
        .home-section { padding: var(--space-30) var(--space-6); }
        .home-head { text-align: center; max-width: 640px; margin: 0 auto var(--space-16); }
        .home-eyebrow { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.32em; color: var(--gold); opacity: 0.7; margin-bottom: 14px; }
        .home-title { font-family: var(--font-display); font-size: clamp(1.5rem, 4vw, 2.6rem); font-weight: 700; letter-spacing: 0.2em; color: var(--gold); margin-bottom: 20px; }
        .home-divider { display: flex; align-items: center; justify-content: center; gap: 12px; }
        .gold-line { width: 70px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .gold-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .gold-diamond { width: 6px; height: 6px; background: var(--gold); transform: rotate(45deg); }

        /* ════ ASSURANCE STRIP (replaces vanity stats) ════ */
        .assure { background: var(--surface-deep); border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); padding: 40px 24px; }
        .assure-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .assure-item { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 0 12px; }
        .assure-item + .assure-item { border-left: 1px solid var(--border-soft); }
        .assure-icon { width: 26px; height: 26px; stroke: var(--gold); fill: none; stroke-width: 1.3; opacity: 0.8; }
        .assure-label { font-family: var(--font-display); font-size: 0.62rem; letter-spacing: 0.2em; color: var(--text); }
        .assure-sub { font-size: 0.85rem; color: var(--text-muted); font-style: italic; }

        /* ════ FEATURED COLLECTIONS ════ */
        .featured-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .feat-card { border: 1px solid var(--border); background: var(--surface); display: flex; flex-direction: column; overflow: hidden; transition: border-color 0.35s, transform 0.35s, box-shadow 0.35s; text-decoration: none; color: inherit; }
        .feat-card:hover { border-color: var(--gold); transform: translateY(-6px); box-shadow: 0 20px 60px rgba(201,168,76,0.1); }
        .feat-img-wrap { width: 100%; aspect-ratio: 3/4; position: relative; overflow: hidden; background: linear-gradient(135deg, #111 0%, #0d0900 100%); display: flex; align-items: center; justify-content: center; }
        .feat-img-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; opacity: 0.18; }
        .feat-ph-ring { width: 80px; height: 80px; border-radius: 50%; border: 2px solid var(--gold); }
        .feat-ph-text { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--gold); }
        .feat-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.65s var(--ease); }
        .feat-card:hover .feat-img { transform: scale(1.05); }
        .feat-body { padding: 32px 28px 30px; text-align: center; flex: 1; display: flex; flex-direction: column; gap: 10px; }
        .feat-title { font-family: var(--font-display); font-size: 1.6rem; font-weight: 700; letter-spacing: 0.14em; color: var(--gold); line-height: 1; }
        .feat-subtitle { font-family: var(--font-display); font-size: 0.66rem; letter-spacing: 0.32em; color: var(--text-muted); }
        .feat-card-divider { width: 36px; height: 1px; background: var(--gold); margin: 6px auto; transition: width 0.3s; }
        .feat-card:hover .feat-card-divider { width: 64px; }
        .feat-desc { font-size: 0.95rem; color: var(--text-2); line-height: 1.65; flex: 1; font-style: italic; }
        .feat-link { display: inline-block; font-family: var(--font-display); font-size: 0.62rem; letter-spacing: 0.22em; color: var(--gold); margin-top: 10px; border-bottom: 1px solid transparent; padding-bottom: 3px; transition: border-color 0.25s; }
        .feat-card:hover .feat-link { border-bottom-color: var(--gold); }

        /* ════ MAISON STATEMENT (replaces marquee) ════ */
        .maison { position: relative; text-align: center; padding: var(--space-24) var(--space-6); border-top: 1px solid var(--border-soft); border-bottom: 1px solid var(--border-soft); background: var(--surface-deep); overflow: hidden; }
        .maison::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 90% at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 70%); pointer-events: none; }
        .maison-inner { position: relative; max-width: 760px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 24px; }
        .maison-eyebrow { font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.34em; color: var(--gold); opacity: 0.7; }
        .maison-quote { font-family: var(--font-body); font-size: clamp(1.4rem, 3.2vw, 2.1rem); font-style: italic; line-height: 1.5; color: var(--text); }
        .maison-quote em { color: var(--gold); font-style: italic; }
        .maison-link { font-family: var(--font-display); font-size: 0.62rem; letter-spacing: 0.22em; color: var(--gold); border-bottom: 1px solid var(--border); padding-bottom: 4px; transition: border-color 0.25s; }
        .maison-link:hover { border-bottom-color: var(--gold); }

        /* ════ BEST SELLERS ════ */
        .sellers-bg { background: var(--bg); }
        .sellers-grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .seller-card { background: var(--surface); border: 1px solid var(--border-soft); overflow: hidden; position: relative; transition: border-color 0.3s, transform 0.3s, box-shadow 0.3s; display: flex; flex-direction: column; }
        .seller-card:hover { border-color: rgba(201,168,76,0.45); transform: translateY(-5px); box-shadow: 0 16px 48px rgba(201,168,76,0.07); }
        .seller-img-wrap { width: 100%; aspect-ratio: 1/1; position: relative; overflow: hidden; background: linear-gradient(135deg, #111 0%, #0d0900 100%); display: flex; align-items: center; justify-content: center; }
        .seller-img-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; opacity: 0.12; }
        .seller-img-placeholder svg { width: 48px; height: 48px; stroke: var(--gold); fill: none; stroke-width: 1.2; }
        .seller-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s var(--ease); }
        .seller-card:hover .seller-img { transform: scale(1.06); }
        .seller-badge { position: absolute; top: 14px; left: 14px; background: var(--gold-grad); color: var(--bg); font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.18em; font-weight: 700; padding: 5px 10px; z-index: 5; }
        .quick-view-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; z-index: 4; }
        .seller-card:hover .quick-view-overlay { opacity: 1; }
        .quick-view-btn { background: var(--gold-grad); color: var(--bg); font-family: var(--font-display); font-size: 0.66rem; letter-spacing: 0.16em; font-weight: 700; padding: 12px 24px; text-decoration: none; display: inline-block; transition: opacity 0.2s; }
        .quick-view-btn:hover { opacity: 0.88; }
        .seller-body { padding: 20px 18px 22px; border-top: 1px solid var(--border-soft); flex: 1; display: flex; flex-direction: column; }
        .seller-collection { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--gold); opacity: 0.8; margin-bottom: 6px; }
        .seller-model { font-size: 0.92rem; color: var(--text-2); margin-bottom: 14px; font-style: italic; flex: 1; }
        .seller-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .seller-price { font-family: var(--font-display); font-size: 1rem; color: var(--text); letter-spacing: 0.05em; }
        .seller-cart-btn { width: 36px; height: 36px; border: 1px solid var(--border); background: transparent; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.2s, background 0.2s; flex-shrink: 0; }
        .seller-cart-btn:hover { border-color: var(--gold); background: rgba(201,168,76,0.08); }
        .seller-cart-btn.added { border-color: #5a9a5a; background: rgba(90,154,90,0.12); }
        .seller-cart-btn svg { width: 16px; height: 16px; stroke: var(--gold); fill: none; stroke-width: 1.5; }
        .seller-cart-btn.added svg { stroke: #6cbf6c; }

        /* ════ CLOSING CTA ════ */
        .cta-band { padding: var(--space-30) var(--space-6); background: var(--bg); text-align: center; border-top: 1px solid var(--border-soft); position: relative; overflow: hidden; }
        .cta-band::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%); pointer-events: none; }
        .cta-band-title { font-family: var(--font-display); font-size: clamp(1.6rem, 4vw, 3rem); color: var(--text); font-weight: 700; letter-spacing: 0.14em; margin-bottom: 16px; position: relative; }
        .cta-band-sub { color: var(--text-2); font-style: italic; font-size: 1.05rem; margin-bottom: 40px; position: relative; }
        .cta-band .btn-gold { position: relative; }

        /* ════ RESPONSIVE ════ */
        @media (max-width: 1024px) { .sellers-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .home-section { padding: var(--space-24) var(--space-4); }
          .featured-grid { grid-template-columns: 1fr; max-width: 400px; }
          .assure-inner { grid-template-columns: repeat(2, 1fr); gap: 28px 16px; }
          .assure-item:nth-child(3) { border-left: none; }
          .assure-item:nth-child(odd) { border-left: none; }
          .hero-cta-group { flex-direction: column; align-items: center; width: 100%; max-width: 280px; }
          .hero-cta-group .btn-gold, .hero-cta-group .btn-ghost { width: 100%; }
        }
        @media (max-width: 480px) {
          .sellers-grid { grid-template-columns: 1fr; max-width: 340px; }
        }
      `}</style>

      <div className="home">

        {/* ════ HERO ════ */}
        <section className="hero">
          <div className="hero-fallback" />
          <div className="hero-ring" />
          <div className="hero-ring-2" />
          <Image
            className="hero-img"
            src="/images/hero/watchhero1.jpg"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="100vw"
            quality={70}
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
          <div className="hero-overlay" />

          <div className="hero-content">
            <p className="hero-eyebrow">ESTABLISHED 2020 · ALGERIA</p>
            <h1 className="hero-title">
              ISSO TIME
              <span>LUXURY</span>
            </h1>
            <p className="hero-tagline">
              A curated maison of fine timepieces, delivered across Algeria.
            </p>
            <div className="hero-cta-group">
              <Link href="/shop" className="btn-gold">SHOP THE COLLECTION</Link>
              <Link href="/collections" className="btn-ghost">EXPLORE COLLECTIONS</Link>
            </div>
          </div>

          <div className="hero-scroll" aria-hidden="true">
            <span className="hero-scroll-text">DISCOVER</span>
            <span className="hero-scroll-line" />
          </div>
        </section>

        {/* ════ ASSURANCE STRIP ════ */}
        <section className="assure" aria-label="Our promise">
          <div className="assure-inner">
            {ASSURANCES.map((a) => (
              <div key={a.label} className="assure-item">
                {a.icon}
                <span className="assure-label">{a.label}</span>
                <span className="assure-sub">{a.sub}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ════ FEATURED COLLECTIONS ════ */}
        <section className="home-section">
          <div className="home-head">
            <p className="home-eyebrow">OUR UNIVERSE</p>
            <h2 className="home-title">THE COLLECTIONS</h2>
            <div className="home-divider"><span className="gold-line" /><span className="gold-diamond" /><span className="gold-line r" /></div>
          </div>

          <div className="featured-grid">
            {FEATURED.map((col) => (
              <Link key={col.id} href={col.href} className="feat-card">
                <div className="feat-img-wrap">
                  <div className="feat-img-placeholder">
                    <div className="feat-ph-ring" />
                    <span className="feat-ph-text">{col.title}</span>
                  </div>
                  <SafeImage
                    src={col.image}
                    alt={`${col.title} collection`}
                    className="feat-img"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="feat-body">
                  <div className="feat-title">{col.title}</div>
                  <div className="feat-subtitle">{col.subtitle}</div>
                  <div className="feat-card-divider" />
                  <p className="feat-desc">{col.desc}</p>
                  <span className="feat-link">VIEW COLLECTION →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ════ MAISON STATEMENT ════ */}
        <section className="maison" aria-label="Our philosophy">
          <div className="maison-inner">
            <p className="maison-eyebrow">THE MAISON</p>
            <p className="maison-quote">
              Time is the one luxury that cannot be remade. We exist to help you wear it <em>well</em>.
            </p>
            <Link href="/about" className="maison-link">OUR STORY →</Link>
          </div>
        </section>

        {/* ════ BEST SELLERS ════ */}
        <section className="home-section sellers-bg">
          <div className="home-head">
            <p className="home-eyebrow">MOST COVETED</p>
            <h2 className="home-title">BEST SELLERS</h2>
            <div className="home-divider"><span className="gold-line" /><span className="gold-diamond" /><span className="gold-line r" /></div>
          </div>

          <div className="sellers-grid">
            {BEST_SELLERS.map((p) => (
              <div key={p.id} className="seller-card">
                <div className="seller-img-wrap">
                  <div className="seller-img-placeholder">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="6" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="14"/></svg>
                  </div>
                  <SafeImage
                    src={p.image}
                    alt={p.name}
                    className="seller-img"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {p.badge && <span className="seller-badge">{p.badge}</span>}
                  <div className="quick-view-overlay">
                    <Link href={`/product?id=${p.id}`} className="quick-view-btn">QUICK VIEW</Link>
                  </div>
                </div>

                <div className="seller-body">
                  <div className="seller-collection">{getCollectionName(p.collection)} COLLECTION</div>
                  <div className="seller-model">{p.name}</div>
                  <div className="seller-footer">
                    <div className="seller-price">{p.price.toLocaleString("fr-DZ")} DA</div>
                    <button
                      className="seller-cart-btn"
                      aria-label={`Add ${p.name} to cart`}
                      onClick={(e) => {
                        addToCart({ id: p.id, name: p.name, price: p.price, image: p.image, collection: getCollectionName(p.collection) });
                        const btn = e.currentTarget;
                        btn.classList.add("added");
                        setTimeout(() => btn.classList.remove("added"), 1200);
                      }}
                    >
                      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <path d="M16 10a4 4 0 01-8 0"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ════ CLOSING CTA ════ */}
        <section className="cta-band">
          <h2 className="cta-band-title">DISCOVER YOUR TIMEPIECE</h2>
          <p className="cta-band-sub">Every second deserves to be measured in gold.</p>
          <Link href="/shop" className="btn-gold">EXPLORE THE FULL COLLECTION</Link>
        </section>

      </div>
    </>
  );
}