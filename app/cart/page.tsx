"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { SHIPPING } from "@/lib/constans";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [removing, setRemoving] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const total = subtotal + (cart.length > 0 ? SHIPPING : 0);

  const handleRemove = (id: string) => {
    setRemoving(id);
    setTimeout(() => {
      removeFromCart(id);
      setRemoving(null);
    }, 300);
  };

  return (
    <>
      <style>{`
        /* Global reset + fonts now come from globals.css / layout — not duplicated here. */

        .cart-page {
          background: var(--bg);
          color: var(--text);
          font-family: var(--font-body);
          min-height: 100vh;
          padding-top: var(--nav-h);   /* clear the fixed navbar */
        }

        /* ── HEADER ── */
        .cart-header {
          text-align: center;
          padding: 72px 24px 48px;
          border-bottom: 1px solid var(--border-soft);
          position: relative;
          overflow: hidden;
        }
        .cart-header::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 70% 100% at 50% 0%, #1a1200 0%, var(--bg) 70%);
        }
        .cart-header-eyebrow {
          font-family: var(--font-display);
          font-size: 0.58rem;
          letter-spacing: 0.36em;
          color: var(--gold);
          opacity: 0.8;
          position: relative;
          margin-bottom: 14px;
        }
        .cart-header-title {
          font-family: var(--font-display);
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          letter-spacing: 0.2em;
          color: var(--text);
          position: relative;
          margin-bottom: 18px;
          line-height: 1;
        }
        .cart-header-div {
          display: flex; align-items: center; gap: 12px; justify-content: center;
          position: relative;
        }
        .chd-line { width: 60px; height: 1px; background: linear-gradient(to right, transparent, var(--gold)); }
        .chd-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .chd-dia { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); }

        /* ── BODY ── */
        .cart-body {
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 32px 120px;
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 32px;
          align-items: start;
        }

        /* ── ITEMS LIST ── */
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: var(--border-soft);
          border: 1px solid var(--border-soft);
        }
        .cart-item {
          background: var(--bg);
          display: grid;
          grid-template-columns: 100px 1fr auto;
          gap: 0;
          transition: background 0.3s, opacity 0.3s;
        }
        .cart-item.removing { opacity: 0; }
        .cart-item:hover { background: #0d0b05; }

        .cart-item-img {
          width: 100px;
          height: 100px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #0e0e0e, #0a0800);
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .cart-item-img img { width: 100%; height: 100%; object-fit: cover; }
        .cart-item-img-ph {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          opacity: 0.12;
        }
        .cart-item-img-ph svg { width: 32px; height: 32px; stroke: var(--gold); fill: none; stroke-width: 1; }

        .cart-item-info {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          justify-content: center;
          border-left: 1px solid var(--border-soft);
        }
        .cart-item-collection {
          font-family: var(--font-display);
          font-size: 0.5rem;
          letter-spacing: 0.24em;
          color: var(--gold);
          opacity: 0.8;
        }
        .cart-item-name {
          font-size: 1.05rem;
          color: var(--text-2);
          font-style: italic;
          letter-spacing: 0.02em;
          line-height: 1.3;
        }
        .cart-item-price {
          font-family: var(--font-display);
          font-size: 0.9rem;
          color: var(--text);
          letter-spacing: 0.05em;
        }

        .cart-item-actions {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          gap: 14px;
          border-left: 1px solid var(--border-soft);
          flex-shrink: 0;
        }

        .cart-qty {
          display: flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--border);
        }
        .cart-qty-btn {
          width: 32px; height: 32px;
          background: none;
          border: none;
          color: var(--gold);
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.2s;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          flex-shrink: 0;
        }
        .cart-qty-btn:hover { background: rgba(201,168,76,0.08); }
        .cart-qty-num {
          width: 36px;
          text-align: center;
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--text);
          border-left: 1px solid var(--border);
          border-right: 1px solid var(--border);
          padding: 6px 4px;
        }

        .cart-item-total {
          font-family: var(--font-display);
          font-size: 0.95rem;
          color: var(--gold);
          letter-spacing: 0.05em;
          text-align: right;
        }
        .cart-item-total-label {
          font-family: var(--font-display);
          font-size: 0.45rem;
          letter-spacing: 0.2em;
          color: var(--text-muted);   /* was #3a3018 (near-invisible) */
          text-align: right;
          margin-bottom: 2px;
        }

        .cart-remove-btn {
          background: none; border: none; cursor: pointer;
          font-family: var(--font-display); font-size: 0.48rem;
          letter-spacing: 0.18em; color: var(--text-muted);  /* was #3a3018 */
          transition: color 0.2s;
          padding: 4px 0;
          display: flex; align-items: center; gap: 6px;
        }
        .cart-remove-btn:hover { color: var(--danger); }
        .cart-remove-btn svg { width: 12px; height: 12px; stroke: currentColor; fill: none; stroke-width: 2; }

        /* ── SUMMARY CARD ── */
        .cart-summary {
          background: var(--surface);
          border: 1px solid var(--border-soft);
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
          gap: 0;
          position: sticky;
          top: calc(var(--nav-h) + 20px);
        }
        .cart-summary-title {
          font-family: var(--font-display);
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          color: var(--gold);
          margin-bottom: 20px;
        }
        .cart-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-soft);
          font-size: 0.88rem;
          color: var(--text-2);   /* was #5a4e2c */
        }
        .cart-summary-row:last-of-type { border-bottom: none; }
        .cart-summary-row .val { color: var(--text); font-family: var(--font-display); font-size: 0.82rem; letter-spacing: 0.04em; }
        .cart-summary-separator { height: 1px; background: var(--border); margin: 16px 0; }
        .cart-summary-total-label {
          font-family: var(--font-display);
          font-size: 0.6rem;
          letter-spacing: 0.28em;
          color: var(--text-muted);   /* was #4a3e1e */
          margin-bottom: 8px;
        }
        .cart-summary-total-amount {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text);
          letter-spacing: 0.06em;
          margin-bottom: 6px;
        }
        .cart-summary-total-note {
          font-size: 0.78rem;
          color: var(--text-muted);   /* was #3a3018 */
          font-style: italic;
          margin-bottom: 28px;
        }

        .cart-checkout-btn {
          font-family: var(--font-display);
          font-size: 0.68rem;
          letter-spacing: 0.22em;
          font-weight: 700;
          padding: 17px 32px;
          background: var(--gold-grad);
          color: var(--bg);
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: block;
          text-align: center;
          transition: opacity 0.2s, transform 0.2s;
          margin-bottom: 14px;
        }
        .cart-checkout-btn:hover { opacity: 0.88; transform: scale(1.01); }

        .cart-continue-link {
          font-family: var(--font-display);
          font-size: 0.58rem;
          letter-spacing: 0.2em;
          color: var(--text-muted);   /* was #3a3018 */
          text-decoration: none;
          text-align: center;
          display: block;
          transition: color 0.2s;
          padding: 8px 0;
        }
        .cart-continue-link:hover { color: var(--gold); }

        .cart-pay-icons {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border-soft);
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .cart-pay-icon {
          font-family: var(--font-display);
          font-size: 0.45rem;
          letter-spacing: 0.14em;
          padding: 5px 10px;
          border: 1px solid var(--border);
          color: var(--text-muted);   /* was #3a3018 */
        }

        /* ── EMPTY STATE ── */
        .cart-empty {
          grid-column: 1 / -1;
          text-align: center;
          padding: 120px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .cart-empty-ring {
          width: 100px; height: 100px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .cart-empty-ring::before {
          content: '';
          position: absolute; inset: 8px;
          border-radius: 50%;
          border: 1px solid var(--border-soft);
        }
        .cart-empty-ring svg { width: 32px; height: 32px; stroke: var(--gold); fill: none; stroke-width: 1; opacity: 0.5; }
        .cart-empty-title {
          font-family: var(--font-display);
          font-size: clamp(1rem, 3vw, 1.5rem);
          letter-spacing: 0.2em;
          color: var(--text-2);   /* was #4a3e1e */
        }
        .cart-empty-sub {
          font-size: 1rem;
          color: var(--text-muted);   /* was #2a2200 — completely invisible */
          font-style: italic;
          max-width: 300px;
        }
        .cart-empty-btn {
          font-family: var(--font-display);
          font-size: 0.65rem;
          letter-spacing: 0.22em;
          font-weight: 700;
          padding: 15px 40px;
          background: var(--gold-grad);
          color: var(--bg);
          text-decoration: none;
          display: inline-block;
          margin-top: 8px;
          transition: opacity 0.2s;
        }
        .cart-empty-btn:hover { opacity: 0.88; }

        .cart-clear-btn {
          background: none; border: none; cursor: pointer;
          font-family: var(--font-display); font-size: 0.52rem;
          letter-spacing: 0.18em; color: var(--text-muted);   /* was #2a2200 */
          transition: color 0.2s;
          margin-bottom: 16px;
          align-self: flex-end;
          padding: 6px 0;
        }
        .cart-clear-btn:hover { color: var(--danger); }

        @media (max-width: 900px) {
          .cart-body { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
        @media (max-width: 600px) {
          .cart-body { padding: 32px 16px 80px; }
          /* FIX: previously .cart-item-actions { display: none } hid the qty
             stepper, remove button, and subtotal on mobile. Now restacked as a
             full-width row so mobile users can actually manage the cart. */
          .cart-item { grid-template-columns: 80px 1fr; }
          .cart-item-info { border-left: none; }
          .cart-item-actions {
            grid-column: 1 / -1;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            border-left: none;
            border-top: 1px solid var(--border-soft);
            padding: 16px 20px;
          }
        }
      `}</style>

      <div className="cart-page">

        {/* HEADER */}
        <div className="cart-header">
          <p className="cart-header-eyebrow">ISSO TIME LUXURY</p>
          <h1 className="cart-header-title">YOUR CART</h1>
          <div className="cart-header-div">
            <span className="chd-line" /><span className="chd-dia" /><span className="chd-line r" />
          </div>
        </div>

        <div className="cart-body">

          {cart.length === 0 ? (

            /* EMPTY */
            <div className="cart-empty">
              <div className="cart-empty-ring">
                <svg viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <h2 className="cart-empty-title">YOUR CART IS EMPTY</h2>
              <p className="cart-empty-sub">Discover our exceptional timepieces and add your favourites.</p>
              <Link href="/shop" className="cart-empty-btn">BROWSE THE COLLECTION</Link>
            </div>

          ) : (
            <>
              {/* LEFT — ITEMS */}
              <div>
                {cart.length > 1 && (
                  <button className="cart-clear-btn" onClick={clearCart}>
                    CLEAR ALL ✕
                  </button>
                )}

                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className={`cart-item ${removing === item.id ? "removing" : ""}`}>

                      {/* Image */}
                      <div className="cart-item-img">
                        <div className="cart-item-img-ph">
                          <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="9"/>
                            <line x1="12" y1="7" x2="12" y2="12"/>
                            <line x1="12" y1="12" x2="15" y2="14"/>
                          </svg>
                        </div>
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="cart-item-info">
                        {item.collection && (
                          <div className="cart-item-collection">{item.collection} COLLECTION</div>
                        )}
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">{item.price.toLocaleString("fr-DZ")} DA</div>
                      </div>

                      {/* Actions */}
                      <div className="cart-item-actions">
                        <div>
                          <div className="cart-item-total-label">SUBTOTAL</div>
                          <div className="cart-item-total">
                            {(item.price * item.quantity).toLocaleString("fr-DZ")} DA
                          </div>
                        </div>

                        <div className="cart-qty">
                          <button
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >−</button>
                          <div className="cart-qty-num">{item.quantity}</div>
                          <button
                            className="cart-qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >+</button>
                        </div>

                        <button
                          className="cart-remove-btn"
                          onClick={() => handleRemove(item.id)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          REMOVE
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT — SUMMARY */}
              <div className="cart-summary">
                <div className="cart-summary-title">ORDER SUMMARY</div>

                <div className="cart-summary-row">
                  <span>{cart.reduce((s, i) => s + i.quantity, 0)} item{cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}</span>
                  <span className="val">{subtotal.toLocaleString("fr-DZ")} DA</span>
                </div>
                <div className="cart-summary-row">
                  <span>Delivery</span>
                  <span className="val">{SHIPPING.toLocaleString("fr-DZ")} DA</span>
                </div>

                <div className="cart-summary-separator" />

                <div className="cart-summary-total-label">TOTAL</div>
                <div className="cart-summary-total-amount">{total.toLocaleString("fr-DZ")} DA</div>
                <div className="cart-summary-total-note">Taxes incluses · Livraison Yalidine</div>

                <Link href="/checkout" className="cart-checkout-btn">
                  PROCEED TO CHECKOUT →
                </Link>
                <Link href="/shop" className="cart-continue-link">
                  ← CONTINUE SHOPPING
                </Link>

                <div className="cart-pay-icons">
                  <span className="cart-pay-icon">CASH ON DELIVERY</span>
                  <span className="cart-pay-icon">BARIDIMOB</span>
                  <span className="cart-pay-icon">CIB</span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}