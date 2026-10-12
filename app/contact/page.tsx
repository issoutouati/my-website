import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with ISSO TIME LUXURY — Bordj Bou Arreridj, Algeria.",
};

const DETAILS = [
  { label: "LOCATION", value: "Algeria, Bordj Bou Arreridj", href: null },
  { label: "PHONE", value: "+213 791 285 842", href: "tel:+213791285842" },
  { label: "EMAIL", value: "issoutouati@gmail.com", href: "mailto:issoutouati@gmail.com" },
  { label: "HOURS", value: "Sun–Thu · 9:00 – 18:00", href: null },
];

export default function ContactPage() {
  return (
    <section style={{ paddingTop: "calc(var(--nav-h) + var(--space-16))", paddingBottom: "var(--space-24)" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <p className="eyebrow">ISSO TIME LUXURY</p>
        <h1 style={{ fontSize: "var(--fs-h1)", margin: "var(--space-4) 0 var(--space-6)" }}>CONTACT</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto var(--space-8)" }} />
        <p style={{ color: "var(--text-2)", maxWidth: 520, margin: "0 auto var(--space-16)" }}>
          Questions about a piece, an order, or a private viewing? We respond personally.
        </p>
      </div>

      <div className="container" style={{ maxWidth: 560 }}>
        <div style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>
          {DETAILS.map((d, i) => (
            <div
              key={d.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "var(--space-6)",
                padding: "var(--space-6) var(--space-8)",
                borderBottom: i < DETAILS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <span className="eyebrow">{d.label}</span>
              {d.href ? (
                <a href={d.href} style={{ color: "var(--text)" }}>{d.value}</a>
              ) : (
                <span style={{ color: "var(--text-2)" }}>{d.value}</span>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "var(--space-12)" }}>
          <a href="mailto:issoutouati@gmail.com" className="btn-gold">SEND US AN EMAIL</a>
          <div style={{ marginTop: "var(--space-6)" }}>
            <Link href="/shop" style={{ color: "var(--text-muted)", fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "var(--track)" }}>
              ← BACK TO THE COLLECTION
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}