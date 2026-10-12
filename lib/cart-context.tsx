"use client";

/**
 * ISSO TIME LUXURY — Cart Context
 * Path: src/lib/cart-context.tsx  (imported as "@/lib/cart-context")
 *
 * WHY THIS FILE EXISTS / WHAT IT FIXES
 * ------------------------------------
 * 1. cart/page.tsx destructured `{ cart, ... }` while checkout/page.tsx
 *    destructured `{ items, ... }` from the SAME hook. One of them was
 *    reading `undefined`, so the checkout total silently broke.
 *    -> This file exposes a canonical `items` AND a deprecated `cart`
 *       alias so neither page crashes while you migrate to `items`.
 * 2. The product page "ADD TO CART" button only flipped local state and
 *    never touched the cart -> nothing was ever actually added.
 *    -> `addToCart(item, qty)` is the real entry point. Wire every
 *       "ADD TO CART" / cart-icon button to it.
 * 3. The cart did not survive a refresh. For a Cash-on-Delivery flow that
 *    spans cart -> checkout that is fatal.
 *    -> State is persisted to localStorage and rehydrated on mount.
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;            // product id, e.g. "w-02"
  name: string;
  price: number;         // unit price in DA
  quantity: number;
  image?: string;
  collection?: string;   // "CLASSIC" | "PREMIUM" | "ELITE"
  reference?: string;    // e.g. "ITL-PRE-002"
}

type AddPayload = Omit<CartItem, "quantity"> & { quantity?: number };

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "ADD"; item: AddPayload }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; quantity: number }
  | { type: "CLEAR" };

interface CartContextValue {
  items: CartItem[];
  /** @deprecated kept only so the existing cart page keeps working — migrate to `items`. */
  cart: CartItem[];
  addToCart: (item: AddPayload) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  /** Derived count for the navbar badge. */
  totalItems: number;
  /** True if a product id is already in the cart. */
  isInCart: (id: string) => boolean;
}

// ─── Reducer (single source of truth for mutations) ─────────────────────────
const MAX_QTY = 10; // a luxury store rarely needs more; also guards typos

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.items };

    case "ADD": {
      const qty = Math.min(Math.max(1, action.item.quantity ?? 1), MAX_QTY);
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, quantity: Math.min(i.quantity + qty, MAX_QTY) }
              : i
          ),
        };
      }
      const { quantity: _omit, ...rest } = action.item;
      return { items: [...state.items, { ...rest, quantity: qty }] };
    }

    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };

    case "SET_QTY": {
      // qty <= 0 removes the line item (matches the −/+ controls in the UI)
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id
            ? { ...i, quantity: Math.min(action.quantity, MAX_QTY) }
            : i
        ),
      };
    }

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

// ─── Context ────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "isso-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // Rehydrate once on mount (client only — avoids SSR hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) dispatch({ type: "HYDRATE", items: parsed });
      }
    } catch {
      /* corrupted storage — start clean */
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      /* storage full / disabled — non-fatal */
    }
  }, [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      cart: state.items, // deprecated alias
      addToCart: (item) => dispatch({ type: "ADD", item }),
      removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
      updateQuantity: (id, quantity) => dispatch({ type: "SET_QTY", id, quantity }),
      clearCart: () => dispatch({ type: "CLEAR" }),
      getTotalPrice: () =>
        state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      getTotalItems: () =>
        state.items.reduce((sum, i) => sum + i.quantity, 0),
      totalItems: state.items.reduce((sum, i) => sum + i.quantity, 0),
      isInCart: (id: string) => state.items.some((i) => i.id === id),
    }),
    [state.items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error(
      "useCart must be used inside <CartProvider>. Wrap your app in app/layout.tsx."
    );
  }
  return ctx;
}