import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information",
  description: "Delivery across all 58 wilayas of Algeria via Yalidine, with cash on delivery available.",
};

const SECTIONS = [
  {
    h: "Coverage",
    p: "We deliver to all 58 wilayas across Algeria through our partner Yalidine — to your address or to the nearest Yalidine stop desk, whichever you prefer.",
  },
  {
    h: "Delivery Time",
    p: "Most orders are delivered within 1 to 3 business days after your order is confirmed by phone. Remote wilayas may take slightly longer.",
  },
  {
    h: "Delivery Fees",
    p: "Fees are calculated at checkout based on your wilaya and chosen delivery method. The exact amount is always shown before you confirm.",
  },
  {
    h: "Cash on Delivery",
    p: "You can pay in cash when your order arrives. BaridiMob  is also accepted. You are never charged before your order is confirmed.",
  },
];

export default function ShippingPage() {
  return (
    <section style={{ paddingTop: "calc(var(--nav-h) + var(--space-16))", paddingBottom: "var(--space-24)" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <p className="eyebrow">ISSO TIME LUXURY</p>
        <h1 style={{ fontSize: "var(--fs-h1)", margin: "var(--space-4) 0 var(--space-6)" }}>SHIPPING</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto var(--space-16)" }} />
      </div>

      <div className="container" style={{ maxWidth: 720 }}>
        {SECTIONS.map((s) => (
          <div key={s.h} style={{ marginBottom: "var(--space-12)" }}>
            <h2 style={{ fontSize: "var(--fs-h3)", color: "var(--gold)", marginBottom: "var(--space-3)" }}>{s.h}</h2>
            <p style={{ color: "var(--text-2)", lineHeight: 1.7 }}>{s.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}