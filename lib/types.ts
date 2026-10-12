// lib/types.ts
// Shared catalog types — the single definition of what a product and a
// collection are across the whole store.

export type CollectionId = "classic" | "premium" | "elite";

export interface Spec {
  label: string;
  value: string;
}

export interface Collection {
  id: CollectionId;
  name: string;        // display name, e.g. "CLASSIC"
  tagline: string;     // 2-word line, used on the collections showcase
  blurb: string;       // one-line marketing line, used on home featured cards
  description: string; // paragraph, used on the collections showcase
  philosophy: string;  // the maxim quote
  pieces: number;
  priceFrom: number;
  image: string;
  accent: string;
  defaultSpecs: Spec[];        // inherited by products that don't override
  defaultHighlights: string[]; // inherited by products that don't override
}

export interface Product {
  id: string;                  // "w-02"
  collection: CollectionId;
  name: string;
  price: number;               // DA
  image: string;               // primary image
  badge?: string;              // "NEW" | "LIMITED" | ""
  images?: string[];           // gallery; falls back to [image]
  reference?: string;          // falls back to a generated ITL-XXX-NN
  available?: boolean | "last";
  deliveryDays?: string;
  bestSeller?: boolean;
  specs?: Spec[];              // overrides collection.defaultSpecs
  highlights?: string[];       // overrides collection.defaultHighlights
}

/** Lightweight product shape for related/listing cards (display-ready). */
export interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  collectionName: string;
  image: string;
}

/** Fully-resolved product consumed by the product detail page. */
export interface ProductDetail {
  id: string;
  name: string;
  price: number;
  image: string;
  collection: CollectionId;
  collectionName: string;
  brand: string;
  reference: string;
  images: string[];
  available: boolean | "last";
  deliveryDays: string;
  deliveryPrice: number;
  badge: string;
  specs: Spec[];
  highlights: string[];
  related: RelatedProduct[];
}