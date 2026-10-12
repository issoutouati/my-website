"use client";
import { useState } from "react";
import Link from "next/link";
import { COLLECTIONS, collectionHref } from "@/lib/collections";

// COLLECTIONS now comes from the shared catalog (lib/collections) — full
// descriptions live there, so the earlier PDF-truncation note no longer applies.


// ─────────────────────────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const [active, setActive] = useState("classic");
  // Safe lookup (was a non-null assertion `!`)
  const col = COLLECTIONS.find((c) => c.id === active) ?? COLLECTIONS[0];

  return (
    <>
      <style>{`
        /* Global reset + fonts now come from globals.css / layout — not duplicated here. */

        .col-page {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          min-height: 100vh;
          overflow-x: hidden;
          padding-top: var(--nav-h);   /* clear the fixed navbar */
        }

        /* ══ HERO ══ */
        .col-hero { position: relative; height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; overflow: hidden; }
        .col-hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 100% 120% at 50% 0%, #1a1200 0%, var(--bg) 65%); }
        .col-hero-grid {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(201,168,76,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(ellipse 90% 100% at 50% 0%, black 20%, transparent 100%);
        }
        .col-hero-ring { position: absolute; width: 520px; height: 520px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.06); top: -240px; left: 50%; transform: translateX(-50%); pointer-events: none; }
        .col-hero-ring2 { position: absolute; width: 760px; height: 760px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.03); top: -360px; left: 50%; transform: translateX(-50%); pointer-events: none; }
        .col-hero-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .col-hero-eyebrow { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.38em; color: var(--gold); opacity: 0.7; }
        .col-hero-title { font-family: var(--font-display); font-size: clamp(2.2rem, 6vw, 4rem); font-weight: 700; letter-spacing: 0.22em; color: var(--text); line-height: 1; }
        .col-hero-div { display: flex; align-items: center; gap: 12px; }
        .ch-line { width: 56px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .ch-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .ch-dia { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); }
        .col-hero-sub { font-size: 0.88rem; color: var(--text-2); letter-spacing: 0.1em; font-style: italic; }  /* was #5a4e2c */

        /* ══ TAB NAV ══ */
        .col-tabs {
          position: sticky;
          top: var(--nav-h);   /* dock below the fixed navbar */
          z-index: 30;
          background: rgba(8,8,8,0.97);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border-soft);
          display: flex; justify-content: center; gap: 0;
        }
        .col-tab {
          font-family: var(--font-display); font-size: 0.65rem; letter-spacing: 0.28em;
          color: var(--text-muted); background: none; border: none; border-bottom: 2px solid transparent;  /* was #3a3018 (near-invisible) */
          padding: 22px 48px; cursor: pointer; transition: color 0.25s, border-color 0.25s; position: relative; white-space: nowrap;
        }
        .col-tab:hover { color: var(--gold); }
        .col-tab.active { color: var(--gold); border-bottom-color: var(--gold); }
        .col-tab-dot { display: inline-block; width: 4px; height: 4px; background: var(--gold); border-radius: 50%; margin-right: 10px; opacity: 0; transition: opacity 0.25s; vertical-align: middle; position: relative; top: -1px; }
        .col-tab.active .col-tab-dot { opacity: 1; }

        /* ══ MAIN LAYOUT ══ */
        .col-main { max-width: 1340px; margin: 0 auto; padding: 0 40px 120px; }

        /* ══ SHOWCASE ══ */
        .col-showcase { display: grid; grid-template-columns: 1fr 1fr; min-height: 600px; border: 1px solid var(--border-soft); margin-top: 64px; overflow: hidden; transition: all 0.4s; }
        .col-showcase-img { position: relative; background: linear-gradient(145deg, #0e0e0e, #0a0800); overflow: hidden; min-height: 500px; }
        .col-showcase-placeholder { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
        .csp-outer { width: 260px; height: 260px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.15); display: flex; align-items: center; justify-content: center; animation: rotateSlow 18s linear infinite; }
        .csp-inner { width: 200px; height: 200px; border-radius: 50%; border: 1px solid rgba(201,168,76,0.1); display: flex; align-items: center; justify-content: center; position: relative; }
        .csp-inner::before {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
          background: repeating-conic-gradient(rgba(201,168,76,0.25) 0deg, rgba(201,168,76,0.25) 1deg, transparent 1deg, transparent 30deg);
          mask-image: radial-gradient(circle, transparent 88%, black 88%);
        }
        .csp-logo { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.2em; color: var(--gold); opacity: 0.3; text-align: center; line-height: 1.6; }
        .csp-hand-h { position: absolute; width: 2px; height: 52px; background: linear-gradient(to top, var(--gold), transparent); bottom: 50%; left: 50%; transform-origin: bottom center; transform: translateX(-50%) rotate(-60deg); opacity: 0.4; }
        .csp-hand-m { position: absolute; width: 1px; height: 70px; background: linear-gradient(to top, #c9a84c80, transparent); bottom: 50%; left: 50%; transform-origin: bottom center; transform: translateX(-50%) rotate(120deg); opacity: 0.3; }
        @keyframes rotateSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .col-showcase-real-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; }
        .col-showcase-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to right, transparent 60%, var(--bg) 100%); pointer-events: none; }

        .col-showcase-content { padding: 64px 56px 64px 48px; display: flex; flex-direction: column; gap: 28px; justify-content: center; border-left: 1px solid var(--border-soft); }
        .csc-eyebrow { font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.36em; color: var(--gold); opacity: 0.65; }
        .csc-name { font-family: var(--font-display); font-size: clamp(2.4rem, 5vw, 3.8rem); font-weight: 700; letter-spacing: 0.18em; color: var(--text); line-height: 1; }
        .csc-tagline { font-size: 1.2rem; font-style: italic; color: var(--text-2); letter-spacing: 0.06em; }  /* was #9a8242 */
        .csc-divider { width: 48px; height: 1px; background: var(--gold); }
        .csc-desc { font-size: 1.05rem; color: var(--text-2); line-height: 1.85; font-weight: 300; max-width: 440px; }  /* was #6a5a2a */
        .csc-philosophy { font-size: 1rem; font-style: italic; color: var(--text-muted); border-left: 2px solid var(--border); padding-left: 18px; line-height: 1.6; }  /* was #4a3e1e */

        .csc-specs { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); max-width: 380px; }
        .csc-spec { background: var(--surface); padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
        .csc-spec-label { font-family: var(--font-display); font-size: 0.5rem; letter-spacing: 0.22em; color: var(--text-muted); }  /* was #4a3e1e */
        .csc-spec-value { font-size: 0.88rem; color: var(--text-2); letter-spacing: 0.04em; }  /* was #c8b87a */

        .csc-cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .csc-cta-primary { font-family: var(--font-display); font-size: 0.65rem; letter-spacing: 0.22em; font-weight: 700; padding: 15px 40px; background: var(--gold-grad); color: var(--bg); text-decoration: none; display: inline-block; transition: opacity 0.2s, transform 0.2s; }
        .csc-cta-primary:hover { opacity: 0.88; transform: scale(1.02); }
        .csc-cta-ghost { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.22em; color: var(--gold); text-decoration: none; border-bottom: 1px solid var(--border); padding-bottom: 3px; transition: border-color 0.2s; }
        .csc-cta-ghost:hover { border-color: var(--gold); }

        .csc-meta { display: flex; gap: 32px; }
        .csc-meta-item { display: flex; flex-direction: column; gap: 4px; }
        .csc-meta-num { font-family: var(--font-display); font-size: 1.5rem; color: var(--gold); font-weight: 700; line-height: 1; }
        .csc-meta-label { font-family: var(--font-display); font-size: 0.5rem; letter-spacing: 0.22em; color: var(--text-muted); }  /* was #4a3e1e */

        /* ══ OVERVIEW ══ */
        .col-overview { margin-top: 96px; }
        .col-overview-head { text-align: center; margin-bottom: 56px; }
        .co-eyebrow { font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.34em; color: var(--text-muted); margin-bottom: 12px; }  /* was #4a3e1e */
        .co-title { font-family: var(--font-display); font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 700; letter-spacing: 0.2em; color: var(--gold); margin-bottom: 20px; }
        .co-divider { display: flex; align-items: center; gap: 12px; justify-content: center; }
        .cod-line { width: 60px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .cod-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .cod-dia { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); }

        .col-cards { display: flex; flex-direction: column; gap: 1px; background: var(--border-soft); border: 1px solid var(--border-soft); }
        .col-card { background: var(--bg); display: grid; grid-template-columns: 280px 1fr auto; align-items: center; gap: 0; transition: background 0.3s; cursor: pointer; text-decoration: none; color: inherit; }
        .col-card:hover { background: #0d0b05; }
        .col-card-img { height: 180px; position: relative; overflow: hidden; background: linear-gradient(145deg, #0e0e0e, #0a0800); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .col-card-img img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .col-card:hover .col-card-img img { transform: scale(1.06); }
        .col-card-ph { opacity: 0.1; display: flex; align-items: center; justify-content: center; }
        .col-card-ph svg { width: 48px; height: 48px; stroke: var(--gold); fill: none; stroke-width: 1; }
        .col-card-body { padding: 32px 40px; border-left: 1px solid var(--border-soft); border-right: 1px solid var(--border-soft); }
        .col-card-label { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.3em; color: var(--gold); opacity: 0.6; margin-bottom: 8px; }
        .col-card-name { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; letter-spacing: 0.16em; color: var(--text); margin-bottom: 10px; }
        .col-card-desc { font-size: 0.9rem; color: var(--text-2); line-height: 1.7; font-style: italic; max-width: 480px; }  /* was #5a4e2c */
        .col-card-action { padding: 32px 40px; display: flex; flex-direction: column; align-items: flex-end; gap: 16px; flex-shrink: 0; }
        .col-card-pieces { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.22em; color: var(--text-muted); text-align: right; }  /* was #3a3018 */
        .col-card-price { font-family: var(--font-display); font-size: 1rem; color: var(--gold); text-align: right; letter-spacing: 0.06em; }
        .col-card-price span { display: block; font-size: 0.5rem; letter-spacing: 0.22em; color: var(--text-muted); margin-bottom: 4px; font-family: var(--font-display); }  /* was #3a3018 */
        .col-card-btn { font-family: var(--font-display); font-size: 0.58rem; letter-spacing: 0.2em; padding: 10px 24px; border: 1px solid var(--gold); color: var(--gold); background: transparent; transition: background 0.25s, color 0.25s; white-space: nowrap; }
        .col-card:hover .col-card-btn { background: var(--gold); color: var(--bg); }

        /* ══ BOTTOM CTA ══ */
        .col-bottom-cta { margin-top: 96px; text-align: center; padding: 80px 24px; border: 1px solid var(--border-soft); position: relative; overflow: hidden; }
        .col-bottom-cta::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%); pointer-events: none; }
        .cbc-title { font-family: var(--font-display); font-size: clamp(1.4rem, 3vw, 2.4rem); font-weight: 700; letter-spacing: 0.16em; color: var(--text); margin-bottom: 14px; position: relative; }
        .cbc-sub { font-size: 1rem; font-style: italic; color: var(--text-2); margin-bottom: 40px; position: relative; }  /* was #5a4e2c */
        .cbc-btn { font-family: var(--font-display); font-size: 0.68rem; letter-spacing: 0.24em; font-weight: 700; padding: 16px 52px; background: var(--gold-grad); color: var(--bg); text-decoration: none; display: inline-block; transition: opacity 0.2s, transform 0.2s; position: relative; }
        .cbc-btn:hover { opacity: 0.88; transform: scale(1.02); }

        /* ══ RESPONSIVE ══ */
        @media (max-width: 900px) {
          .col-showcase { grid-template-columns: 1fr; }
          .col-showcase-img { min-height: 320px; }
          .col-showcase-img::after { background: linear-gradient(to bottom, transparent 60%, var(--bg) 100%); }
          .col-showcase-content { padding: 40px 28px; border-left: none; border-top: 1px solid var(--border-soft); }
          .col-card { grid-template-columns: 1fr; }
          .col-card-img { height: 220px; width: 100%; }
          .col-card-action { align-items: flex-start; padding: 0 28px 28px; }
          .col-main { padding: 0 20px 80px; }
          .col-tab { padding: 18px 24px; font-size: 0.6rem; }
        }
        @media (max-width: 600px) {
          .csc-specs { grid-template-columns: 1fr 1fr; }
          .col-tabs { overflow-x: auto; justify-content: flex-start; }
          .col-card-body { padding: 24px 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .csp-outer { animation: none; }
        }
      `}</style>

      <div className="col-page">
        {/* ══ HERO ══ */}
        <div className="col-hero">
          <div className="col-hero-bg" />
          <div className="col-hero-grid" />
          <div className="col-hero-ring" />
          <div className="col-hero-ring2" />
          <div className="col-hero-content">
            <p className="col-hero-eyebrow">ISSO TIME LUXURY</p>
            <h1 className="col-hero-title">COLLECTIONS</h1>
            <div className="col-hero-div">
              <span className="ch-line" /><span className="ch-dia" /><span className="ch-line r" />
            </div>
            <p className="col-hero-sub">Three universes. One standard of excellence.</p>
          </div>
        </div>

        {/* ══ TAB NAV ══ */}
        <div className="col-tabs">
          {COLLECTIONS.map((c) => (
            <button
              key={c.id}
              className={`col-tab ${active === c.id ? "active" : ""}`}
              onClick={() => setActive(c.id)}
            >
              <span className="col-tab-dot" />
              {c.name}
            </button>
          ))}
        </div>

        <div className="col-main">
          {/* ══ SHOWCASE ══ */}
          <div className="col-showcase">
            {/* Image panel */}
            <div className="col-showcase-img">
              <div className="col-showcase-placeholder">
                <div className="csp-outer">
                  <div className="csp-inner">
                    <div className="csp-hand-h" />
                    <div className="csp-hand-m" />
                    <div className="csp-logo">ISSO TIME<br/>LUXURY</div>
                  </div>
                </div>
              </div>
              <img
                src={col.image}
                alt={col.name}
                className="col-showcase-real-img"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>

            {/* Content panel */}
            <div className="col-showcase-content">
              <p className="csc-eyebrow">THE {col.name} COLLECTION</p>
              <h2 className="csc-name">{col.name}</h2>
              <p className="csc-tagline">{col.tagline}</p>
              <div className="csc-divider" />
              <p className="csc-desc">{col.description}</p>
              <blockquote className="csc-philosophy">&ldquo;{col.philosophy}&rdquo;</blockquote>

              {/* Specs */}
              <div className="csc-specs">
                {col.defaultSpecs.map((s) => (
                  <div key={s.label} className="csc-spec">
                    <span className="csc-spec-label">{s.label}</span>
                    <span className="csc-spec-value">{s.value}</span>
                  </div>
                ))}
              </div>

              {/* Meta */}
              <div className="csc-meta">
                <div className="csc-meta-item">
                  <span className="csc-meta-num">{col.pieces}</span>
                  <span className="csc-meta-label">TIMEPIECES</span>
                </div>
                <div className="csc-meta-item">
                  <span className="csc-meta-num">{col.priceFrom.toLocaleString("fr-DZ")}</span>
                  <span className="csc-meta-label">STARTING DA</span>
                </div>
              </div>

              {/* CTA */}
              <div className="csc-cta-row">
                <Link href={collectionHref(col.id)} className="csc-cta-primary">SHOP {col.name}</Link>
                <Link href="/contact" className="csc-cta-ghost">REQUEST A VIEWING</Link>
              </div>
            </div>
          </div>

          {/* ══ ALL COLLECTIONS OVERVIEW ══ */}
          <div className="col-overview">
            <div className="col-overview-head">
              <p className="co-eyebrow">EXPLORE</p>
              <h2 className="co-title">ALL COLLECTIONS</h2>
              <div className="co-divider">
                <span className="cod-line" /><span className="cod-dia" /><span className="cod-line r" />
              </div>
            </div>

            <div className="col-cards">
              {COLLECTIONS.map((c) => (
                <Link key={c.id} href={collectionHref(c.id)} className="col-card">
                  {/* Image */}
                  <div className="col-card-img">
                    <div className="col-card-ph">
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="6" x2="12" y2="12"/>
                        <line x1="12" y1="12" x2="16" y2="14"/>
                      </svg>
                    </div>
                    <img
                      src={`/images/collections/${c.id}-hero.jpg`}
                      alt={c.name}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>

                  {/* Body */}
                  <div className="col-card-body">
                    <div className="col-card-label">COLLECTION</div>
                    <div className="col-card-name">{c.name}</div>
                    <p className="col-card-desc">{c.tagline} — {c.description.slice(0, 90)}…</p>
                  </div>

                  {/* Action */}
                  <div className="col-card-action">
                    <span className="col-card-pieces">{c.pieces} PIECES</span>
                    <div className="col-card-price">
                      <span>FROM</span>
                      {c.priceFrom.toLocaleString("fr-DZ")} DA
                    </div>
                    <span className="col-card-btn">EXPLORE →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ══ BOTTOM CTA ══ */}
          <div className="col-bottom-cta">
            <h2 className="cbc-title">FIND YOUR TIMEPIECE</h2>
            <p className="cbc-sub">Browse the full catalogue or visit us for a private viewing.</p>
            <Link href="/shop" className="cbc-btn">BROWSE ALL WATCHES</Link>
          </div>
        </div>
      </div>
    </>
  );
}