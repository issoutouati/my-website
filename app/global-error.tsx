"use client";
// app/global-error.tsx — catches errors in the root layout itself.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#080808", color: "#e8d5a3", fontFamily: "Georgia, serif", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: 24, maxWidth: 460 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.32em", color: "#c9a84c" }}>ISSO TIME LUXURY</p>
          <h1 style={{ fontSize: 26, letterSpacing: "0.12em", margin: "16px 0" }}>SOMETHING WENT WRONG</h1>
          <p style={{ color: "#b8a574", lineHeight: 1.7, marginBottom: 28 }}>Please refresh the page or try again shortly.</p>
          <button onClick={reset} style={{ fontFamily: "Georgia, serif", letterSpacing: "0.2em", fontSize: 12, padding: "12px 26px", background: "#c9a84c", color: "#080808", border: "none", cursor: "pointer" }}>TRY AGAIN</button>
        </div>
      </body>
    </html>
  );
}