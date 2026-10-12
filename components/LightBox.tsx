"use client";

/**
 * components/Lightbox.tsx
 * Premium fullscreen image viewer for ISSO TIME LUXURY.
 *
 * Features: smooth open/close animation, dark blurred backdrop, pinch-to-zoom
 * and double-tap/double-click zoom, drag-to-pan when zoomed, swipe to change
 * image, desktop prev/next + close controls, ESC to close, click-outside to
 * close, focus management + body scroll lock, graceful broken-image fallback.
 *
 * Styling lives in globals.css (.lb-*) — NOT styled-jsx — so it renders
 * reliably on real iOS Safari. Rendered through a portal to <body> so no
 * transformed ancestor can break the fixed overlay.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface LightboxProps {
  images: string[];
  startIndex: number;
  open: boolean;
  onClose: () => void;
  alt?: string;
  /** Notified when the viewer changes image, so the page thumbnail can sync. */
  onIndexChange?: (index: number) => void;
}

const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const SWIPE_THRESHOLD = 50;

export default function Lightbox({
  images,
  startIndex,
  open,
  onClose,
  alt = "",
  onIndexChange,
}: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [shown, setShown] = useState(false); // drives the enter animation
  const [zoomed, setZoomed] = useState(false);
  const [canPortal, setCanPortal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  // Imperative gesture state (refs avoid re-renders during a gesture).
  const g = useRef({
    scale: 1,
    tx: 0,
    ty: 0,
    startDist: 0,
    startScale: 1,
    panX: 0,
    panY: 0,
    baseTx: 0,
    baseTy: 0,
    swipeX: 0,
    swipeY: 0,
    swiping: false,
    lastTap: 0,
  });

  useEffect(() => setCanPortal(true), []);

  const applyTransform = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    const { scale, tx, ty } = g.current;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }, []);

  const resetTransform = useCallback(() => {
    g.current.scale = 1;
    g.current.tx = 0;
    g.current.ty = 0;
    setZoomed(false);
    applyTransform();
  }, [applyTransform]);

  // When opened: set start image, lock scroll, animate in, focus close, save focus.
  useEffect(() => {
    if (!open) return;
    setIndex(startIndex);
    setImgError(false);
    restoreFocus.current = (document.activeElement as HTMLElement) ?? null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => setShown(true));
    const focusT = window.setTimeout(() => closeRef.current?.focus(), 60);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(focusT);
      document.body.style.overflow = prevOverflow;
      setShown(false);
      restoreFocus.current?.focus?.();
    };
  }, [open, startIndex]);

  // Reset zoom/pan whenever the image changes; notify parent.
  useEffect(() => {
    resetTransform();
    setImgError(false);
    if (open) onIndexChange?.(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const go = useCallback(
    (dir: number) => {
      if (images.length < 2) return;
      setIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length]
  );

  // Keyboard: ESC closes, arrows navigate (desktop).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  if (!open || !canPortal) return null;

  const touchDist = (t: React.TouchList) => {
    const dx = t[0].clientX - t[1].clientX;
    const dy = t[0].clientY - t[1].clientY;
    return Math.hypot(dx, dy);
  };

  // Zoom toward a point, keeping that point under the finger/cursor.
  const zoomToPoint = (clientX: number, clientY: number) => {
    if (g.current.scale > 1) {
      resetTransform();
      return;
    }
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const s = DOUBLE_TAP_SCALE;
    g.current.scale = s;
    g.current.tx = -(clientX - cx) * (s - 1);
    g.current.ty = -(clientY - cy) * (s - 1);
    setZoomed(true);
    applyTransform();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches;
    if (t.length === 2) {
      g.current.startDist = touchDist(t);
      g.current.startScale = g.current.scale;
      g.current.swiping = false;
    } else if (t.length === 1) {
      const now = Date.now();
      if (now - g.current.lastTap < 300) {
        zoomToPoint(t[0].clientX, t[0].clientY);
        g.current.lastTap = 0;
        return;
      }
      g.current.lastTap = now;
      if (g.current.scale > 1) {
        g.current.panX = t[0].clientX;
        g.current.panY = t[0].clientY;
        g.current.baseTx = g.current.tx;
        g.current.baseTy = g.current.ty;
      } else {
        g.current.swipeX = t[0].clientX;
        g.current.swipeY = t[0].clientY;
        g.current.swiping = true;
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const t = e.touches;
    if (t.length === 2) {
      const d = touchDist(t);
      if (g.current.startDist > 0) {
        let s = g.current.startScale * (d / g.current.startDist);
        s = Math.max(1, Math.min(MAX_SCALE, s));
        g.current.scale = s;
        setZoomed(s > 1.02);
        applyTransform();
      }
    } else if (t.length === 1 && g.current.scale > 1) {
      g.current.tx = g.current.baseTx + (t[0].clientX - g.current.panX);
      g.current.ty = g.current.baseTy + (t[0].clientY - g.current.panY);
      applyTransform();
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (g.current.scale <= 1.02 && g.current.scale !== 1) resetTransform();
    if (g.current.swiping && g.current.scale <= 1 && e.changedTouches.length) {
      const dx = e.changedTouches[0].clientX - g.current.swipeX;
      const dy = e.changedTouches[0].clientY - g.current.swipeY;
      if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        go(dx < 0 ? 1 : -1);
      }
      g.current.swiping = false;
    }
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();
  const multi = images.length > 1;

  return createPortal(
    <div
      className={`lb-overlay ${shown ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Product image viewer"
      onClick={onClose}
    >
      <div className="lb-backdrop" />

      <button ref={closeRef} className="lb-close" onClick={onClose} aria-label="Close image viewer">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {multi && (
        <>
          <button
            className="lb-nav lb-prev"
            onClick={(e) => { stop(e); go(-1); }}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            className="lb-nav lb-next"
            onClick={(e) => { stop(e); go(1); }}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <div
        className={`lb-stage ${zoomed ? "is-zoomed" : ""}`}
        onClick={stop}
        onDoubleClick={(e) => { stop(e); zoomToPoint(e.clientX, e.clientY); }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {imgError ? (
          <div className="lb-fallback" aria-hidden="true">
            <div className="lb-fallback-mark">ISSO</div>
            <span>Image unavailable</span>
          </div>
        ) : (
          // Plain <img> (not next/image) — full-resolution source for zoom.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            className="lb-img"
            src={images[index]}
            alt={alt ? `${alt} — image ${index + 1}` : `Image ${index + 1}`}
            draggable={false}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {multi && <div className="lb-counter">{index + 1} / {images.length}</div>}
    </div>,
    document.body
  );
}