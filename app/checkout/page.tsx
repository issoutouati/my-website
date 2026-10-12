"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { SHIPPING } from "@/lib/constans";
import { WILAYAS } from "@/lib/wilayas";
import { track } from "@/lib/analytics";
import Turnstile from "@/components/Turnstile";


export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    wilaya: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [token, setToken] = useState("");

  useEffect(() => { track("checkout_started"); }, []);

  const subtotal = getTotalPrice();
  const total = subtotal + SHIPPING;
  const isEmpty = items.length === 0;

  // Algerian mobile: 0(5|6|7)xxxxxxxx, or +213 / 00213 prefix. Spaces/dashes ok.
  const isValidDzPhone = (raw: string) => {
    const v = raw.replace(/[\s-]/g, "");
    return /^(?:(?:\+|00)213|0)(?:5|6|7)\d{8}$/.test(v);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    // Email is OPTIONAL — only validated if the customer provides one.
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Please enter a valid email address";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!isValidDzPhone(form.phone))
      newErrors.phone = "Enter a valid Algerian number (e.g. 0550 12 34 56)";
    if (!form.wilaya) newErrors.wilaya = "Please select your wilaya";
    if (!form.address.trim()) newErrors.address = "Address is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (isEmpty) {
      setSubmitError("Your cart is empty.");
      return;
    }
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Only identifiers + quantities leave the browser. No prices.
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          customer: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            wilaya: form.wilaya,
            address: form.address,
          },
          token,
        }),
      });

      if (res.ok) {
        const { orderNumber } = await res.json();
        track("order_completed", { orderNumber });
        clearCart();
        router.push(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
        return;
      }

      const data = await res.json().catch(() => ({}));
      let message = "We couldn't place your order right now. Please try again in a moment.";
      if (res.status === 429) message = "Too many attempts. Please wait a minute and try again.";
      else if (data.error === "out_of_stock" || data.error === "unavailable")
        message = "Sorry — one of your items just sold out. Please adjust your cart.";
      else if (data.error === "bot_check_failed") message = "Please complete the verification and try again.";
      else if (data.error === "invalid_request") message = "Please check your details and try again.";
      console.error("[checkout] order failed:", res.status, data);
      setSubmitError(message);
      setSubmitting(false);
    } catch (err) {
      console.error("[checkout] network error:", err);
      setSubmitError(
        typeof navigator !== "undefined" && navigator.onLine === false
          ? "You appear to be offline. Please check your connection and try again."
          : "We couldn't reach the server. Please try again in a moment."
      );
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <>
      <style>{`
        /* Global reset + fonts now come from globals.css / layout — not duplicated here. */

        .checkout-page {
          min-height: 100vh;
          background-color: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          display: flex;
          flex-direction: column;
          padding-top: var(--nav-h);   /* clear the fixed navbar */
        }

        /* ── Header ── */
        .checkout-header { text-align: center; padding: 56px 24px 40px; }
        .checkout-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--gold);
          margin-bottom: 16px;
        }
        .header-divider { display: flex; align-items: center; justify-content: center; gap: 12px; }
        .divider-line { width: 80px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .divider-line.right { background: linear-gradient(to left, transparent, var(--gold)); }
        .divider-diamond { width: 7px; height: 7px; background: var(--gold); transform: rotate(45deg); }

        /* ── Main grid ── */
        .checkout-main {
          flex: 1;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 24px 64px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 28px;
          align-items: start;
        }

        /* ── Card shared ── */
        .card { background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 36px 32px; }

        /* ── Customer Information ── */
        .section-header { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; }
        .step-badge {
          width: 38px; height: 38px; border-radius: 50%;
          border: 1.5px solid var(--gold);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-size: 1rem; color: var(--gold); flex-shrink: 0;
        }
        .section-title { font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.18em; color: var(--text); font-weight: 600; }

        /* ── Fields ── */
        .field-group { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }
        .field-wrapper { position: relative; }
        .field-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-2); width: 18px; height: 18px; pointer-events: none; }
        .field-input,
        .field-select {
          width: 100%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 16px 16px 16px 48px;
          color: var(--text);
          font-family: var(--font-ui);   /* utility face for form fields (design system) */
          font-size: 1rem;
          letter-spacing: 0.04em;
          outline: none;
          transition: border-color 0.2s;
          appearance: none;
        }
        .field-input::placeholder { color: var(--text-muted); }
        .field-input:focus,
        .field-select:focus { border-color: var(--gold); }
        .field-input.error,
        .field-select.error { border-color: var(--danger); }
        .error-text { font-size: 0.78rem; color: var(--danger); margin-top: 4px; padding-left: 4px; letter-spacing: 0.03em; }

        /* Select chevron */
        .select-wrapper { position: relative; }
        .select-chevron { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--text-2); pointer-events: none; width: 18px; height: 18px; }
        .field-select option { background: var(--surface); color: var(--text); }

        /* ── CTA Button ── */
        .cta-button {
          width: 100%;
          padding: 18px 24px;
          background: linear-gradient(135deg, var(--gold) 0%, var(--gold-deep) 50%, var(--gold) 100%);
          border: none;
          border-radius: 3px;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          font-family: var(--font-display);
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          color: var(--bg);
          transition: opacity 0.2s, transform 0.15s;
        }
        .cta-button:hover { opacity: 0.92; transform: translateY(-1px); }
        .cta-button:active { transform: translateY(0); }
        .cta-button:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .cta-arrow { font-size: 1.1rem; }

        .submit-error {
          background: rgba(192, 74, 74, 0.08);
          border: 1px solid rgba(192, 74, 74, 0.4);
          color: #d98a8a;
          font-size: 0.85rem;
          padding: 12px 14px;
          margin-bottom: 14px;
          letter-spacing: 0.02em;
        }

        .summary-items { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
        .summary-item { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-size: 0.92rem; }
        .summary-item-name { color: var(--text-2); }
        .summary-item-qty { color: var(--text-muted); font-size: 0.82rem; }
        .summary-item-price { color: var(--text); font-family: var(--font-display); font-size: 0.82rem; letter-spacing: 0.03em; white-space: nowrap; }

        .checkout-empty-note {
          text-align: center;
          color: var(--text-2);
          padding: 8px 0 24px;
          letter-spacing: 0.02em;
        }
        .checkout-empty-note a { color: var(--gold); border-bottom: 1px solid var(--border); }
        .checkout-empty-note a:hover { border-bottom-color: var(--gold); }

        .checkout-trust {
          display: flex; flex-wrap: wrap; gap: 8px 18px; justify-content: center;
          margin-top: 18px;
        }
        .checkout-trust span {
          font-family: var(--font-display);
          font-size: 0.52rem; letter-spacing: 0.16em;
          color: var(--text-muted);
          display: inline-flex; align-items: center; gap: 6px;
        }
        .checkout-trust span::before {
          content: "✓"; color: var(--gold); font-size: 0.7rem;
        }

        /* ── Order Summary ── */
        .summary-title { font-family: var(--font-display); font-size: 0.85rem; letter-spacing: 0.2em; color: var(--gold); text-align: center; margin-bottom: 12px; }
        .summary-divider { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 28px; }
        .summary-divider-line { flex: 1; height: 1px; background: linear-gradient(to right, transparent, var(--border)); }
        .summary-divider-line.r { background: linear-gradient(to left, transparent, var(--border)); }
        .summary-dot { width: 5px; height: 5px; background: var(--gold); border-radius: 50%; }
        .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 1rem; color: var(--text-2); letter-spacing: 0.03em; }
        .summary-row .value { color: var(--text); }
        .summary-separator { height: 1px; background: var(--border); margin: 20px 0; }
        .summary-total-label { font-family: var(--font-display); font-size: 0.85rem; letter-spacing: 0.14em; color: var(--text); margin-bottom: 8px; }
        .summary-total-amount { font-family: var(--font-display); font-size: 2.4rem; font-weight: 700; color: var(--gold); letter-spacing: 0.05em; }

        /* ── Responsive ── */
        @media (max-width: 820px) {
          .checkout-main { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .card { padding: 24px 18px; }
        }
      `}</style>

      <div className="checkout-page">
        {/* ── Header ── */}
        <header className="checkout-header">
          <h1 className="checkout-title">CHECKOUT</h1>
          <div className="header-divider">
            <span className="divider-line" />
            <span className="divider-diamond" />
            <span className="divider-line right" />
          </div>
        </header>

        {/* ── Main ── */}
        <main className="checkout-main">
          {isEmpty && (
            <p className="checkout-empty-note" style={{ gridColumn: "1 / -1" }}>
              Your cart is empty. <Link href="/shop">Browse the collection →</Link>
            </p>
          )}
          {/* Left – Customer Information */}
          <div className="card">
            <div className="section-header">
              <div className="step-badge">1</div>
              <span className="section-title">CUSTOMER INFORMATION</span>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} noValidate>
              <div className="field-group">
                {/* Full Name */}
                <div>
                  <label htmlFor="co-fullName" className="sr-only">Full name</label>
                  <div className="field-wrapper">
                    <svg className="field-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    <input
                      id="co-fullName"
                      className={`field-input${errors.fullName ? " error" : ""}`}
                      type="text"
                      placeholder="Full Name"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      aria-invalid={!!errors.fullName}
                      aria-describedby={errors.fullName ? "co-fullName-err" : undefined}
                    />
                  </div>
                  {errors.fullName && <p className="error-text" id="co-fullName-err">{errors.fullName}</p>}
                </div>

                {/* Email (optional) */}
                <div>
                  <label htmlFor="co-email" className="sr-only">Email address (optional)</label>
                  <div className="field-wrapper">
                    <svg className="field-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <input
                      id="co-email"
                      className={`field-input${errors.email ? " error" : ""}`}
                      type="email"
                      placeholder="Email Address (optional)"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "co-email-err" : undefined}
                    />
                  </div>
                  {errors.email && <p className="error-text" id="co-email-err">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="co-phone" className="sr-only">Phone number</label>
                  <div className="field-wrapper">
                    <svg className="field-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.338c0-1.007.75-1.88 1.75-1.993A48.348 48.348 0 018.25 4.05c1 0 1.825.702 1.994 1.695L11 9.2a1.994 1.994 0 01-.616 1.978l-.814.7a16.034 16.034 0 006.552 6.552l.7-.815a1.994 1.994 0 011.978-.615l3.455.756A1.994 1.994 0 0123.95 19.75c-.113 1-.987 1.75-1.994 1.75h-.006a48.348 48.348 0 01-4.887-.245C7.5 20.755 3.245 16.5 2.495 10.187A48.348 48.348 0 012.25 6.344v-.006z" />
                    </svg>
                    <input
                      id="co-phone"
                      className={`field-input${errors.phone ? " error" : ""}`}
                      type="tel"
                      inputMode="tel"
                      placeholder="Phone Number"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "co-phone-err" : undefined}
                    />
                  </div>
                  {errors.phone && <p className="error-text" id="co-phone-err">{errors.phone}</p>}
                </div>

                {/* Wilaya */}
                <div>
                  <label htmlFor="co-wilaya" className="sr-only">Wilaya</label>
                  <div className="field-wrapper select-wrapper">
                    <svg className="field-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <select
                      id="co-wilaya"
                      className={`field-select${errors.wilaya ? " error" : ""}`}
                      autoComplete="address-level1"
                      value={form.wilaya}
                      onChange={(e) => handleChange("wilaya", e.target.value)}
                      aria-invalid={!!errors.wilaya}
                      aria-describedby={errors.wilaya ? "co-wilaya-err" : undefined}
                    >
                      <option value="">Select Wilaya</option>
                      {WILAYAS.map((w) => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                    <svg className="select-chevron" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                  {errors.wilaya && <p className="error-text" id="co-wilaya-err">{errors.wilaya}</p>}
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="co-address" className="sr-only">Delivery address</label>
                  <div className="field-wrapper">
                    <svg className="field-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <input
                      id="co-address"
                      className={`field-input${errors.address ? " error" : ""}`}
                      type="text"
                      placeholder="Full Address (Yalidine)"
                      autoComplete="street-address"
                      value={form.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? "co-address-err" : undefined}
                    />
                  </div>
                  {errors.address && <p className="error-text" id="co-address-err">{errors.address}</p>}
                </div>
              </div>

              <Turnstile onToken={setToken} />

              {submitError && <p className="submit-error" role="alert">{submitError}</p>}

              <button type="submit" className="cta-button" disabled={submitting || isEmpty}>
                {submitting ? "PLACING ORDER…" : "PLACE ORDER"}
                {!submitting && <span className="cta-arrow">→</span>}
              </button>

              <div className="checkout-trust">
                <span>Cash on delivery</span>
                <span>2-year warranty</span>
                <span>Confirmed by phone before dispatch</span>
              </div>
            </form>
          </div>

          {/* Right – Order Summary */}
          <div className="card">
            <div className="summary-title">ORDER SUMMARY</div>
            <div className="summary-divider">
              <span className="summary-divider-line" />
              <span className="summary-dot" />
              <span className="summary-divider-line r" />
            </div>

            {items.length > 0 && (
              <div className="summary-items">
                {items.map((i) => (
                  <div key={i.id} className="summary-item">
                    <span className="summary-item-name">
                      {i.name} <span className="summary-item-qty">×{i.quantity}</span>
                    </span>
                    <span className="summary-item-price">{(i.price * i.quantity).toLocaleString("fr-DZ")} DA</span>
                  </div>
                ))}
              </div>
            )}

            <div className="summary-row">
              <span>Subtotal:</span>
              <span className="value">{subtotal.toLocaleString("fr-DZ")} DA</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              {/* FIX: previously showed "Paid" (styled like free) while the total
                  still added shipping — now shows the real fee, matching the total. */}
              <span className="value">{SHIPPING.toLocaleString("fr-DZ")} DA</span>
            </div>

            <div className="summary-separator" />

            <div className="summary-total-label">TOTAL:</div>
            <div className="summary-total-amount">
              {total.toLocaleString("fr-DZ")} DA
            </div>
          </div>
        </main>

        {/* Footer removed — it is now rendered globally from app/layout.tsx
            (the previous inline footer would have duplicated it). */}
      </div>
    </>
  );
}