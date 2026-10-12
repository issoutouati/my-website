// lib/products.ts
// Single source of truth for the product catalog, plus the accessor functions
// every page uses. If products later move to Supabase, only the bodies of these
// accessors change — call sites stay the same.

import type { Product, ProductDetail, RelatedProduct, CollectionId } from "../lib/types";
import { getCollection, getCollectionName } from "./collections";
import { SHIPPING } from "../lib/constans";

const BRAND = "ISSO TIME LUXURY";

export const PRODUCTS: Product[] = [
  {
    id: "w-01",
    collection: "classic",
    name: "ISSO Heritage Diver",
    price: 95000,
    image: "/images/products/watch1.jpg",
    bestSeller: true,
    images: [
      "/images/products/watch1.jpg",
      "/images/products/watch1.jpg",
      "/images/products/watch1.jpg",
      "/images/products/watch1.jpg",
    ],
  },
  {
    id: "w-02",
    collection: "premium",
    name: "ISSO Noir Chronograph",
    price: 130000,
    badge: "NEW",
    image: "/images/products/watch7.jpg",
    bestSeller: true,
    reference: "ITL-PRE-002",
    images: [
      "/images/products/watch7.jpg",
      "/images/products/w-02-2.jpg",
      "/images/products/w-02-3.jpg",
      "/images/products/w-02-4.jpg",
    ],
    // Fully-specified hero product — overrides the collection defaults.
    specs: [
      { label: "BRAND", value: "ISSO TIME LUXURY" },
      { label: "COLLECTION", value: "Premium Collection" },
      { label: "MOVEMENT", value: "Automatic Chronograph" },
      { label: "CASE MATERIAL", value: "316L Stainless Steel — PVD Black" },
      { label: "CASE DIAMETER", value: "42mm" },
      { label: "DIAL COLOR", value: "Matte Black" },
      { label: "GLASS", value: "Sapphire Crystal Anti-Reflective" },
      { label: "WATER RESIST.", value: "200 metres" },
      { label: "STRAP", value: "Genuine Leather / Steel Bracelet" },
      { label: "FUNCTIONS", value: "Hours · Minutes · Seconds · Chronograph · Date" },
      { label: "POWER RESERVE", value: "48 Hours" },
      { label: "FINISH", value: "Premium Hand-Finished" },
    ],
    highlights: [
      "Sapphire crystal anti-reflective glass",
      "Automatic chronograph movement",
      "200m water resistance",
      "PVD black coating — scratch resistant",
      "Exhibition caseback",
    ],
  },
  {
    id: "w-03",
    collection: "elite",
    name: "ISSO Azur Tourbillon",
    price: 290000,
    image: "/images/products/w-03.jpg",
    bestSeller: true,
    //badge: "NEW",
    images: [
      "/images/products/watch.jpg",
      "/images/products/w-02-2.jpg",
      "/images/products/w-02-3.jpg",
      "/images/products/w-02-4.jpg",
    ],
  },
  {
    id: "w-04",
    collection: "classic",
    name: "ISSO Classic Brossé",
    price: 75000,
    image: "/images/products/w-04.jpg",
    bestSeller: true,
    //badge:"NEW",
    images: [
      "/images/products/watch.jpg",
      "/images/products/w-02-2.jpg",
      "/images/products/w-02-3.jpg",
      "/images/products/w-02-4.jpg",
    ],
  },
  {
    id: "w-05",
    collection: "premium",
    name: "ISSO Méridien Or Rose",
    price: 160000,
    badge: "LIMITED",
    image: "/images/products/w-05.jpg",
    images: [
      "/images/products/watch.jpg",
      "/images/products/w-02-2.jpg",
      "/images/products/w-02-3.jpg",
      "/images/products/w-02-4.jpg",
    ],
  },
  {
    id: "w-06",
    collection: "elite",
    name: "ISSO Squelette Perpétuel",
    price: 350000,
    image: "/images/products/w-06.jpg",
    images: [
      "/images/products/watch.jpg",
      "/images/products/w-02-2.jpg",
      "/images/products/w-02-3.jpg",
      "/images/products/w-02-4.jpg",
    ],
  },
  {
    id: "w-07",
    collection: "classic",
    name: "ISSO Héritage Phase de Lune",
    price: 88000,
    image: "/images/products/w-07.jpg",
    images: [
      "/images/products/watch.jpg",
      "/images/products/w-02-2.jpg",
      "/images/products/w-02-3.jpg",
      "/images/products/w-02-4.jpg",
    ],
  },
  {
    id: "w-08",
    collection: "premium",
    name: "ISSO Carbone Sport",
    price: 145000,
    badge: "NEW",
    image: "/images/products/w-08.jpg",
    images: [
      "/images/products/watch.jpg",
      "/images/products/w-02-2.jpg",
      "/images/products/w-02-3.jpg",
      "/images/products/w-02-4.jpg",
    ],
  },
];

// ── Accessors (the swappable seam) ──────────────────────────────────────────

export const getProducts = (): Product[] => PRODUCTS;

export const getProductById = (id: string): Product | undefined =>
  PRODUCTS.find((p) => p.id === id);

export const getProductsByCollection = (collection: CollectionId): Product[] =>
  PRODUCTS.filter((p) => p.collection === collection);

export const getBestSellers = (limit = 4): Product[] =>
  PRODUCTS.filter((p) => p.bestSeller).slice(0, limit);

/** Same collection first, then fill from the rest of the catalog. */
export const getRelatedProducts = (id: string, limit = 3): RelatedProduct[] => {
  const current = getProductById(id);
  const sameCollection = PRODUCTS.filter(
    (p) => p.id !== id && current && p.collection === current.collection
  );
  const others = PRODUCTS.filter(
    (p) => p.id !== id && (!current || p.collection !== current.collection)
  );
  return [...sameCollection, ...others].slice(0, limit).map(toRelated);
};

const toRelated = (p: Product): RelatedProduct => ({
  id: p.id,
  name: p.name,
  price: p.price,
  collectionName: getCollectionName(p.collection),
  image: p.image,
});

const makeReference = (p: Product): string => {
  const col = getCollection(p.collection);
  const prefix = (col?.name ?? "ITL").slice(0, 3).toUpperCase();
  const num = p.id.split("-")[1] ?? "000";
  return `ITL-${prefix}-${num.padStart(3, "0")}`;
};

/** Resolve a product into the full shape the product detail page needs,
 *  inheriting specs/highlights from its collection when not overridden. */
export const getProductDetail = (id: string): ProductDetail | undefined => {
  const p = getProductById(id);
  if (!p) return undefined;
  const col = getCollection(p.collection);

  const specs =
    p.specs ??
    [
      { label: "BRAND", value: BRAND },
      { label: "COLLECTION", value: `${col?.name ?? ""} Collection` },
      ...(col?.defaultSpecs ?? []),
    ];

  return {
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.image,
    collection: p.collection,
    collectionName: getCollectionName(p.collection),
    brand: BRAND,
    reference: p.reference ?? makeReference(p),
    images: p.images && p.images.length ? p.images : [p.image],
    available: p.available ?? true,
    deliveryDays: p.deliveryDays ?? "3 à 5",
    deliveryPrice: SHIPPING,
    badge: p.badge ?? "",
    specs,
    highlights: p.highlights ?? col?.defaultHighlights ?? [],
    related: getRelatedProducts(p.id, 3),
  };
};