"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/types";
import { getCollectionName } from "@/lib/collections";
import { track } from "@/lib/analytics";

interface ProductCardProps {
  product: Product;
  /** Pass to show the wishlist heart; omit to hide it. */
  wished?: boolean;
  onToggleWish?: (id: string) => void;
  /** Pass to show the quick-add overlay; omit to hide it. */
  onAdd?: (product: Product) => void;
}

/**
 * Canonical product grid card. Styles travel with the component (styled-jsx),
 * so it can be dropped into any grid. The parent supplies the data (a catalog
 * Product) and optional wishlist/add handlers; the "added ✓" flash is internal.
 */
export default function ProductCard({ product: p, wished = false, onToggleWish, onAdd }: ProductCardProps) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const href = `/product?id=${p.id}`;

  const handleAdd = () => {
    onAdd?.(p);
    track("add_to_cart", { id: p.id, price: p.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="p-card">
      {/* Image — clicking it opens the product page (the buttons inside stop
          propagation so they keep their own behaviour). */}
      <div
        className="p-img-wrap"
        onClick={() => router.push(href)}
      >
        <div className="p-placeholder">
          <div className="p-placeholder-circle">
            <div className="p-placeholder-hand-h" />
            <div className="p-placeholder-hand-m" />
          </div>
        </div>
        {!imgError && (
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(max-width: 480px) 50vw, (max-width: 1100px) 33vw, 25vw"
            className="p-img"
            style={{ objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        )}

        {p.badge && (
          <span className={`p-badge ${p.badge === "NEW" ? "p-badge-new" : "p-badge-limited"}`}>
            {p.badge}
          </span>
        )}

        {onToggleWish && (
          <button
            className={`p-wish ${wished ? "wished" : ""}`}
            onClick={(e) => { e.stopPropagation(); onToggleWish(p.id); }}
            aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
            aria-pressed={wished}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
        )}

        {onAdd && (
          <div className="p-overlay">
            <button
              className={`p-add-btn ${added ? "added" : ""}`}
              onClick={(e) => { e.stopPropagation(); handleAdd(); }}
            >
              {added ? "ADDED ✓" : "ADD TO CART"}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-body">
        <div className="p-collection">{getCollectionName(p.collection)} COLLECTION</div>
        <Link href={href} className="p-name">{p.name}</Link>
        <div className="p-footer">
          <div className="p-price">{p.price.toLocaleString("fr-DZ")} DA</div>
          <Link href={href} className="p-view-link">VIEW →</Link>
        </div>
      </div>

    </div>
  );
}