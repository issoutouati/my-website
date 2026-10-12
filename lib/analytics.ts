// lib/analytics.ts — lightweight, provider-agnostic event layer.
// Wraps Plausible or GA4 if present; no-ops (with a dev log) otherwise.
type Props = Record<string, string | number | boolean | undefined>;

export function track(event: string, props: Props = {}): void {
  if (typeof window === "undefined") return;
  try {
    const w = window as unknown as {
      plausible?: (e: string, o?: { props: Props }) => void;
      gtag?: (...args: unknown[]) => void;
    };
    if (w.plausible) w.plausible(event, { props });
    else if (w.gtag) w.gtag("event", event, props);
    else if (process.env.NODE_ENV !== "production") console.debug("[analytics]", event, props);
  } catch {
    /* analytics must never break UX */
  }
}