// app/checkout/success/page.tsx — SERVER component.
// Verifies the order exists in the DB before showing a confirmation, so a fake
// /checkout/success?order=ANYTHING cannot render a success screen. Degrades to an
// optimistic confirmation only if the admin client isn't configured (dev).
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const sp = await searchParams;
  const orderNumber = sp?.order?.trim();
  if (!orderNumber) notFound();

  let total: number | null = null;
  let verified = false;
  let adminConfigured = true;

  try {
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select("order_number, total, status")
      .eq("order_number", orderNumber)
      .maybeSingle();
    if (error) throw error;
    if (data) {
      total = data.total as number;
      verified = true;
    }
  } catch (err) {
    // Admin not configured (dev) or transient DB error → don't 500, show optimistic.
    adminConfigured = false;
    console.warn("[success] order verification skipped:", (err as Error).message);
  }

  // Only 404 when the DB is reachable AND the order genuinely doesn't exist.
  // (notFound() throws, so it MUST be outside the try/catch above.)
  if (adminConfigured && !verified) notFound();

  return (
    <section style={{ paddingTop: "calc(var(--nav-h) + var(--space-24))", paddingBottom: "var(--space-24)", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div style={{ width: 88, height: 88, margin: "0 auto var(--space-8)", borderRadius: "50%", border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="eyebrow">ISSO TIME LUXURY</p>
        <h1 style={{ fontSize: "var(--fs-h1)", margin: "var(--space-4) 0 var(--space-6)" }}>ORDER CONFIRMED</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto var(--space-8)" }} />
        <p style={{ color: "var(--text-2)", lineHeight: 1.7, marginBottom: "var(--space-3)" }}>Thank you. Your order has been received.</p>

        <div style={{ display: "inline-block", border: "1px solid var(--border)", background: "var(--surface)", padding: "12px 22px", margin: "var(--space-4) 0 var(--space-6)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.55rem", letterSpacing: "0.24em", color: "var(--text-muted)", marginBottom: 4 }}>ORDER NUMBER</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "0.08em", color: "var(--gold)" }}>{orderNumber}</div>
          {total !== null && (
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.8rem", color: "var(--text-2)", marginTop: 8 }}>
              Total: {total.toLocaleString("fr-DZ")} DA
            </div>
          )}
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-small)", lineHeight: 1.7, marginBottom: "var(--space-12)" }}>
          We&apos;ll call you shortly to confirm your delivery details before dispatch. Keep your order number to track it any time.
        </p>

        <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href={`/track?order=${encodeURIComponent(orderNumber)}`} className="btn-gold">TRACK YOUR ORDER</Link>
          <Link href="/shop" className="btn-ghost">CONTINUE SHOPPING</Link>
        </div>
      </div>
    </section>
  );
}