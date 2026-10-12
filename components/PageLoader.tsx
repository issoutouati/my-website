// components/PageLoader.tsx
// Minimal, on-brand loading state for Suspense fallbacks (replaces a blank screen).
export default function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading"
      style={{
        minHeight: "70vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            border: "1px solid var(--border)",
            borderTopColor: "var(--gold)",
            animation: "itlSpin 0.9s linear infinite",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            color: "var(--text-muted)",
          }}
        >
          ISSO TIME LUXURY
        </span>
      </div>
      <style>{`
        @keyframes itlSpin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) {
          [role="status"] div { animation: none !important; }
        }
      `}</style>
    </div>
  );
}