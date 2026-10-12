// app/sitemap.ts
import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/products";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://issotimeluxury.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/shop", "/collections", "/about", "/contact", "/faq", "/shipping", "/returns", "/track"];

  const staticEntries = staticRoutes.map((r) => ({
    url: `${base}${r}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : 0.7,
  }));

  const productEntries = PRODUCTS.map((p) => ({
    url: `${base}/product?id=${p.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries];
}