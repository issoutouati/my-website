"use client";
// components/Turnstile.tsx — Cloudflare Turnstile widget.
// Renders only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so dev works without keys.
import { useEffect, useRef } from "react";

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => void } }
}

export default function Turnstile({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    const id = "cf-turnstile-script";
    const renderWidget = () => {
      if (window.turnstile && ref.current) {
        ref.current.innerHTML = "";
        window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: (token: string) => onToken(token),
          "error-callback": () => onToken(""),
          "expired-callback": () => onToken(""),
          theme: "dark",
        });
      }
    };
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      s.async = true; s.defer = true;
      s.onload = renderWidget;
      document.head.appendChild(s);
    } else {
      renderWidget();
    }
  }, [siteKey, onToken]);

  if (!siteKey) return null;
  return <div ref={ref} style={{ marginTop: 12 }} />;
}