"use client";

import { Suspense, useState } from "react";
import PageLoader from "@/components/PageLoader";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { trackOrder, type TrackResult } from "@/lib/orders";

const STATUS_META: Record<string, { label: string; color: string }> = {
  pending:   { label: "Pending confirmation", color: "var(--gold)" },
  confirmed: { label: "Confirmed",            color: "var(--gold-bright)" },
  shipped:   { label: "Shipped",              color: "#6fa8d6" },
  delivered: { label: "Delivered",            color: "#6cbf6c" },
  cancelled: { label: "Cancelled",            color: "var(--danger)" },
};

function TrackContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("order") ?? "");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);

  const handleTrack = async () => {
    setError(null);
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Please enter both your order number and phone number.");
      return;
    }
    setLoading(true);
    setSearched(false);
    try {
      const res = await trackOrder(orderNumber, phone);
      setResult(res);
      setSearched(true);
    } catch {
      setError("We couldn't check your order right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const meta = result ? STATUS_META[result.status] ?? { label: result.status, color: "var(--text-2)" } : null;

  return (
    <section className="track-page">
      <div className="track-head">
        <p className="eyebrow">ISSO TIME LUXURY</p>
        <h1 className="track-title">TRACK ORDER</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto var(--space-8)" }} />
        <p className="track-sub">Enter your order number and the phone number used at checkout.</p>
      </div>

      <div className="track-card">
        <label className="track-label" htmlFor="track-order">ORDER NUMBER</label>
        <input
          id="track-order"
          className="track-input"
          placeholder="ITL-20260101-AB12"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
        />

        <label className="track-label" htmlFor="track-phone">PHONE NUMBER</label>
        <input
          id="track-phone"
          className="track-input"
          type="tel"
          placeholder="+213 ..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {error && <p className="track-error" role="alert">{error}</p>}

        <button className="btn-gold track-btn" onClick={handleTrack} disabled={loading}>
          {loading ? "CHECKING…" : "TRACK ORDER"}
        </button>
      </div>

      {/* Result */}
      {searched && result && meta && (
        <div className="track-result">
          <div className="track-result-row">
            <span className="track-result-label">ORDER</span>
            <span className="track-result-value">{result.orderNumber}</span>
          </div>
          <div className="track-result-row">
            <span className="track-result-label">STATUS</span>
            <span className="track-status" style={{ color: meta.color }}>
              <span className="track-status-dot" style={{ background: meta.color }} />
              {meta.label}
            </span>
          </div>
          <div className="track-result-row">
            <span className="track-result-label">TOTAL</span>
            <span className="track-result-value">{result.total.toLocaleString("fr-DZ")} DA</span>
          </div>
          <div className="track-result-row">
            <span className="track-result-label">PLACED</span>
            <span className="track-result-value">{new Date(result.createdAt).toLocaleDateString("fr-DZ")}</span>
          </div>
        </div>
      )}

      {searched && !result && (
        <div className="track-empty">
          <p>No order matched that number and phone. Please double-check both, or <Link href="/contact" className="track-link">contact us</Link>.</p>
        </div>
      )}

      <style>{`
        .track-page { background: var(--bg); min-height: 100vh; padding-top: calc(var(--nav-h) + var(--space-16)); padding-bottom: var(--space-24); }
        .track-head { text-align: center; padding: 0 var(--space-6); margin-bottom: var(--space-12); }
        .track-title { font-family: var(--font-display); font-size: var(--fs-h1); letter-spacing: 0.2em; color: var(--text); margin: var(--space-4) 0 var(--space-6); }
        .track-sub { color: var(--text-2); max-width: 480px; margin: 0 auto; }

        .track-card { max-width: 460px; margin: 0 auto; padding: 0 var(--space-6); display: flex; flex-direction: column; }
        .track-label { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.22em; color: var(--text-muted); margin: var(--space-4) 0 8px; }
        .track-input {
          width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 3px;
          padding: 14px 16px; color: var(--text); font-family: var(--font-ui); font-size: 1rem; outline: none;
          transition: border-color 0.2s;
        }
        .track-input::placeholder { color: var(--text-muted); }
        .track-input:focus { border-color: var(--gold); }
        .track-btn { width: 100%; margin-top: var(--space-6); }
        .track-error { color: var(--danger); font-size: 0.85rem; margin-top: var(--space-4); }

        .track-result { max-width: 460px; margin: var(--space-12) auto 0; padding: 0 var(--space-6); }
        .track-result-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--border-soft); }
        .track-result-row:last-child { border-bottom: none; }
        .track-result-label { font-family: var(--font-display); font-size: 0.55rem; letter-spacing: 0.22em; color: var(--text-muted); }
        .track-result-value { color: var(--text); font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.04em; }
        .track-status { display: flex; align-items: center; gap: 8px; font-family: var(--font-display); font-size: 0.75rem; letter-spacing: 0.08em; }
        .track-status-dot { width: 7px; height: 7px; border-radius: 50%; }

        .track-empty { max-width: 460px; margin: var(--space-12) auto 0; padding: 0 var(--space-6); text-align: center; color: var(--text-2); line-height: 1.7; }
        .track-link { color: var(--gold); border-bottom: 1px solid var(--border); }
        .track-link:hover { border-bottom-color: var(--gold); }
      `}</style>
    </section>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <TrackContent />
    </Suspense>
  );
}