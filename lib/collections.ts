// lib/collections.ts
// Single source of truth for the three collections. The collections page and
// the home "featured" cards both read from here.

import type { Collection, CollectionId } from "./types";

export const COLLECTIONS: Collection[] = [
  {
    id: "classic",
    name: "CLASSIC",
    tagline: "Timeless Mastery",
    blurb: "Timeless design for the modern connoisseur.",
    description:
      "Born from decades of horological tradition, the Classic Collection is restraint made tangible — clean lines, enduring proportions, and movements built to outlive trends.",
    philosophy: "Elegance is the only beauty that never fades.",
    pieces: 12,
    priceFrom: 75000,
    image: "/images/collections/classic-hero.jpg",
    accent: "#c9a84c",
    defaultSpecs: [
      { label: "MOVEMENT", value: "Automatic" },
      { label: "CASE", value: "316L Stainless Steel" },
      { label: "WATER RES.", value: "100m" },
      { label: "WARRANTY", value: "2 Years" },
    ],
    defaultHighlights: [
      "Automatic movement",
      "316L stainless steel case",
      "100m water resistance",
      "Sapphire crystal glass",
      "2-year international warranty",
    ],
  },
  {
    id: "premium",
    name: "PREMIUM",
    tagline: "Elevated Precision",
    blurb: "Elevated craftsmanship and precision.",
    description:
      "The Premium Collection bridges artistry and engineering. Chronograph complications and refined materials, for those who notice the details others miss.",
    philosophy: "Precision is not a detail. It is everything.",
    pieces: 8,
    priceFrom: 130000,
    image: "/images/collections/premium-hero.jpg",
    accent: "#c9a84c",
    defaultSpecs: [
      { label: "MOVEMENT", value: "Chronograph" },
      { label: "CASE", value: "Rose Gold PVD" },
      { label: "WATER RES.", value: "200m" },
      { label: "WARRANTY", value: "2 Years" },
    ],
    defaultHighlights: [
      "Chronograph movement",
      "Rose gold PVD coating",
      "200m water resistance",
      "Sapphire crystal anti-reflective",
      "2-year international warranty",
    ],
  },
  {
    id: "elite",
    name: "ELITE",
    tagline: "The Pinnacle",
    blurb: "The pinnacle of luxury timepieces.",
    description:
      "Reserved for those who accept nothing less than extraordinary. The Elite Collection is the summit of the maison — rare, hand-finished, and uncompromising.",
    philosophy: "A masterpiece is not made. It is revealed.",
    pieces: 5,
    priceFrom: 290000,
    image: "/images/collections/elite-hero.jpg",
    accent: "#c9a84c",
    defaultSpecs: [
      { label: "MOVEMENT", value: "Tourbillon Manual" },
      { label: "CASE", value: "18K Solid Gold" },
      { label: "WATER RES.", value: "50m" },
      { label: "WARRANTY", value: "5 Years" },
    ],
    defaultHighlights: [
      "Hand-finished tourbillon movement",
      "18K solid gold case",
      "Exhibition caseback",
      "Alligator leather strap",
      "5-year international warranty",
    ],
  },
];

export const getCollection = (id: CollectionId | string): Collection | undefined =>
  COLLECTIONS.find((c) => c.id === id);

export const getCollectionName = (id: CollectionId | string): string =>
  getCollection(id)?.name ?? String(id).toUpperCase();

/** Link to the shop filtered by a collection. */
export const collectionHref = (id: CollectionId): string => `/shop?collection=${id}`;

/** Collections shown in the home "featured" section (currently all of them). */
export const getFeaturedCollections = (): Collection[] => COLLECTIONS;