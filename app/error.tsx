"use client";
// app/error.tsx — route-level error boundary (luxury fallback, no white screen).
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("[app error]", error); }, [error]);
  return (
    <div style={{ minHeight: "80vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: 460 }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem", letterSpacing: "0.32em", color: "var(--gold)" }}>ISSO TIME LUXURY</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.4rem,4vw,2rem)", letterSpacing: "0.12em", color: "var(--text)", margin: "16px 0" }}>SOMETHING WENT WRONG</h1>
        <p style={{ color: "var(--text-2)", lineHeight: 1.7, marginBottom: 28 }}>An unexpected error occurred. Your cart is safe. Please try again.</p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={reset} className="btn-gold">TRY AGAIN</button>
          <Link href="/" className="btn-ghost">RETURN HOME</Link>
        </div>
      </div>
    </div>
  );
}