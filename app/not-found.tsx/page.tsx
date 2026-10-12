import Link from "next/link";

export default function NotFound() {
  return (
    <section
      style={{
        paddingTop: "calc(var(--nav-h) + var(--space-24))",
        paddingBottom: "var(--space-24)",
        textAlign: "center",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="container" style={{ maxWidth: 520 }}>
        <p className="eyebrow" style={{ marginBottom: "var(--space-4)" }}>ERROR 404</p>
        <h1 style={{ fontSize: "var(--fs-hero)", marginBottom: "var(--space-6)" }}>PAGE NOT FOUND</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto var(--space-8)" }} />
        <p style={{ color: "var(--text-2)", lineHeight: 1.7, marginBottom: "var(--space-12)" }}>
          The page you&apos;re looking for has moved or never existed. Let&apos;s get you back to
          something timeless.
        </p>
        <div style={{ display: "flex", gap: "var(--space-4)", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-gold">RETURN HOME</Link>
          <Link href="/shop" className="btn-ghost">BROWSE THE COLLECTION</Link>
        </div>
      </div>
    </section>
  );
}