import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about orders, delivery, payment, and warranty at ISSO TIME LUXURY.",
};

const FAQS = [
  {
    q: "How do I place an order?",
    a: "Add a timepiece to your cart, go to checkout, and enter your delivery details. You will receive a call to confirm before dispatch.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cash on delivery, BaridiMob. You only pay once your order is confirmed.",
  },
  {
    q: "Where do you deliver?",
    a: "To all 58 wilayas across Algeria, through Yalidine. Delivery fees are calculated at checkout based on your wilaya.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders arrive within 1 to 3 business days after confirmation, depending on your location.",
  },
  {
    q: "Are the watches covered by a warranty?",
    a: "Yes. Every timepiece includes a 2-year warranty, with after-sale support available by phone or email.",
  },
  {
    q: "Can I return or exchange a watch?",
    a: "Yes, within one day of delivery if the piece is unworn and in its original packaging. See our Return Policy for details.",
  },
];

export default function FaqPage() {
  return (
    <section style={{ paddingTop: "calc(var(--nav-h) + var(--space-16))", paddingBottom: "var(--space-24)" }}>
      <div className="container" style={{ textAlign: "center" }}>
        <p className="eyebrow">ISSO TIME LUXURY</p>
        <h1 style={{ fontSize: "var(--fs-h1)", margin: "var(--space-4) 0 var(--space-6)" }}>FAQ</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto var(--space-16)" }} />
      </div>

      <div className="container faq-list" style={{ maxWidth: 720 }}>
        {FAQS.map((f) => (
          <details key={f.q} className="faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>

      <style>{`
        .faq-item {
          border-bottom: 1px solid var(--border);
        }
        .faq-item summary {
          list-style: none;
          cursor: pointer;
          padding: var(--space-6) 0;
          font-family: var(--font-display);
          font-size: 0.85rem;
          letter-spacing: 0.06em;
          color: var(--text);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: var(--space-4);
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after {
          content: "+";
          color: var(--gold);
          font-family: var(--font-display);
          font-size: 1.2rem;
          transition: transform 0.2s;
        }
        .faq-item[open] summary::after { content: "−"; }
        .faq-item p {
          color: var(--text-2);
          font-size: var(--fs-small);
          line-height: 1.7;
          padding: 0 0 var(--space-6);
        }
        .faq-item summary:focus-visible {
          outline: 1px solid var(--gold);
          outline-offset: 4px;
        }
      `}</style>
    </section>
  );
}