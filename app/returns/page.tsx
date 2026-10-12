import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return Policy",
  description: "Return or exchange your ISSO TIME LUXURY timepiece within 7 days of delivery.",
};

const SECTIONS = [
  {
    h: "Eligibility",
    p: "You may return a timepiece within one day of delivery, provided it is unworn, undamaged, and returned in its original packaging with all documentation.",
  },
  {
    h: "How to Start a Return",
    p: "Contact us with your order number and we will arrange the return with you directly. Please do not ship anything back before we confirm the process.",
  },
  {
    h: "Refunds & Exchanges",
    p: "Once we receive and inspect the piece, you may choose a full refund or an exchange for another model. Exchanges may involve a price difference.",
  },
  {
    h: "Non-Returnable Items",
    p: "Pieces that show signs of wear, damage, or missing packaging cannot be returned. Personalized or engraved items are final sale.",
  },
];

export default function ReturnsPage() {
  return (
    <section style={{ paddingTop: "calc(var(--nav-h) + var(--space-16))", paddingBottom: "var(--space-24)" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <p className="eyebrow">ISSO TIME LUXURY</p>
        <h1 style={{ fontSize: "var(--fs-h1)", margin: "var(--space-4) 0 var(--space-6)" }}>RETURNS</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto var(--space-16)" }} />
      </div>

      <div className="container" style={{ maxWidth: 720 }}>
        {SECTIONS.map((s) => (
          <div key={s.h} style={{ marginBottom: "var(--space-12)" }}>
            <h2 style={{ fontSize: "var(--fs-h3)", color: "var(--gold)", marginBottom: "var(--space-3)" }}>{s.h}</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{s.p}</p>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: "var(--space-8)" }}>
          <Link href="/contact" className="btn-ghost">CONTACT US TO START A RETURN</Link>
        </div>
      </div>
    </section>
  );
}