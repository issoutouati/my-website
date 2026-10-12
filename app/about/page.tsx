import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "ISSO TIME LUXURY — a curator of authenticated luxury timepieces, delivered across Algeria.",
};

const VALUES = [
  { title: "AUTHENTICATED", text: "Every timepiece is inspected and verified before it reaches you." },
  { title: "NATIONWIDE DELIVERY", text: "Discreet, insured delivery to all 58 wilayas with cash on delivery." },
  { title: "2-YEAR WARRANTY", text: "Each piece is covered, with attentive after-sale service." },
];

export default function AboutPage() {
  return (
    <section style={{ paddingTop: "calc(var(--nav-h) + var(--space-16))", paddingBottom: "var(--space-24)" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <p className="eyebrow">ISSO TIME LUXURY</p>
        <h1 style={{ fontSize: "var(--fs-h1)", margin: "var(--space-4) 0 var(--space-6)" }}>OUR STORY</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto var(--space-16)" }} />
      </div>

      <div className="container" style={{ maxWidth: 720 }}>
        <p style={{ color: "var(--text-2)", marginBottom: "var(--space-6)" }}>
          ISSO TIME LUXURY was founded to bring the world&apos;s most coveted timepieces to
          discerning collectors across Algeria. We believe a watch is never only an
          instrument — it is a statement of taste, kept close for a lifetime.
        </p>
        <p style={{ color: "var(--text-2)", marginBottom: "var(--space-16)" }}>
          Each piece in our collection is chosen for its craftsmanship, its presence on the
          wrist, and its ability to outlast trends. We obsess over the details so you can
          simply enjoy the result.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "var(--space-6)",
            marginBottom: "var(--space-16)",
          }}
        >
          {VALUES.map((v) => (
            <div key={v.title} style={{ border: "1px solid var(--border)", padding: "var(--space-8)", background: "var(--surface)" }}>
              <div className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>{v.title}</div>
              <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-small)", lineHeight: 1.6 }}>{v.text}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/shop" className="btn-gold">EXPLORE THE COLLECTION</Link>
        </div>
      </div>
    </section>
  );
}