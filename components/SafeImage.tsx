"use client";
// components/SafeImage.tsx — optimized next/image that fills its (relative) parent
// and hides itself on error so a CSS placeholder behind it shows instead of a
// broken-image icon. Keeps the graceful fallback the plain <img onError> had.
import { useState } from "react";
import Image from "next/image";

export default function SafeImage({
  src, alt, className, sizes = "100vw", priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [err, setErr] = useState(false);
  if (err || !src) return null;
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ objectFit: "cover" }}
      onError={() => setErr(true)}
    />
  );
}