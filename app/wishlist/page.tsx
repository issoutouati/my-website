"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { getProductById } from "@/lib/products";
import { getCollectionName } from "@/lib/collections";
import ProductCard from "@/components/ProductCard";
import PageLoader from "@/components/PageLoader";

export default function WishlistPage() {
  const { ids, has, toggle, clear, count, hydrated } = useWishlist();
  const { addToCart } = useCart();

  // Avoid the empty-state flash before localStorage has been read.
  if (!hydrated) return <PageLoader />;

  // Resolve saved ids to catalog products (ignore any stale ids).
  const products = ids
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <section className="wish-page">
      <div className="wish-header">
        <p className="eyebrow">ISSO TIME LUXURY</p>
        <h1 className="wish-title">YOUR WISHLIST</h1>
        <div className="hairline" style={{ maxWidth: 160, margin: "0 auto" }} />
        {products.length > 0 && (
          <div className="wish-meta">
            <span className="wish-count">{count} {count === 1 ? "piece" : "pieces"} saved</span>
            <button type="button" className="wish-clear" onClick={clear}>CLEAR ALL</button>
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="wish-empty">
          <div className="wish-empty-ring">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <h2 className="wish-empty-title">YOUR WISHLIST IS EMPTY</h2>
          <p className="wish-empty-sub">Tap the heart on any timepiece to save it here.</p>
          <Link href="/shop" className="btn-gold">BROWSE THE COLLECTION</Link>
        </div>
      ) : (
        <div className="wish-grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              wished={has(p.id)}
              onToggleWish={toggle}
              onAdd={(prod) =>
                addToCart({
                  id: prod.id,
                  name: prod.name,
                  price: prod.price,
                  image: prod.image,
                  collection: getCollectionName(prod.collection),
                })
              }
            />
          ))}
        </div>
      )}

      <style>{`
        .wish-page {
          background: var(--bg);
          min-height: 100vh;
          padding-top: calc(var(--nav-h) + var(--space-16));
          padding-bottom: var(--space-24);
        }
        .wish-header { text-align: center; margin-bottom: var(--space-16); padding: 0 var(--space-6); }
        .wish-title {
          font-family: var(--font-display);
          font-size: var(--fs-h1);
          letter-spacing: 0.2em;
          color: var(--text);
          margin: var(--space-4) 0 var(--space-6);
        }
        .wish-meta {
          display: flex; align-items: center; justify-content: center; gap: 18px;
          margin-top: var(--space-6);
        }
        .wish-count { font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.22em; color: var(--text-muted); }
        .wish-clear {
          font-family: var(--font-display); font-size: 0.6rem; letter-spacing: 0.22em;
          color: var(--text-muted); background: none; border: none; cursor: pointer;
          border-bottom: 1px solid var(--border); padding-bottom: 2px; transition: color 0.2s, border-color 0.2s;
        }
        .wish-clear:hover { color: var(--gold); border-bottom-color: var(--gold); }
        .wish-clear:focus-visible { color: var(--gold); outline: 1px solid var(--gold); outline-offset: 3px; }
        .wish-grid {
          max-width: 1340px;
          margin: 0 auto;
          padding: 0 32px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: var(--border-soft);
          border: 1px solid var(--border-soft);
        }
        .wish-empty {
          text-align: center;
          padding: 80px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
        }
        .wish-empty-ring {
          width: 100px; height: 100px;
          border-radius: 50%;
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
        }
        .wish-empty-ring svg { width: 34px; height: 34px; stroke: var(--gold); fill: none; stroke-width: 1; opacity: 0.6; }
        .wish-empty-title { font-family: var(--font-display); font-size: clamp(1rem, 3vw, 1.5rem); letter-spacing: 0.2em; color: var(--text-2); }
        .wish-empty-sub { font-size: 1rem; color: var(--text-muted); font-style: italic; max-width: 320px; margin-bottom: 8px; }

        /* The grid wraps ProductCard, which carries its own card styles. */
        @media (max-width: 1100px) { .wish-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .wish-grid { grid-template-columns: repeat(2, 1fr); padding: 0 16px; } }
        @media (max-width: 480px)  { .wish-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </section>
  );
}