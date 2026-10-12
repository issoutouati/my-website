// lib/orders.ts
// All order reads/writes go through here, so the rest of the app never touches
// Supabase directly. Errors are logged with their PostgREST code + details so a
// failure can be diagnosed precisely, and a typed OrderError carries the code to
// the UI for customer-safe messaging.

import { supabase } from "./supabase";

export interface OrderItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderInput {
  fullName: string;
  email: string;
  phone: string;
  wilaya: string;
  address: string;
  items: OrderItemInput[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface OrderResult {
  orderNumber: string;
}

export interface TrackResult {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

/** Typed error so the checkout can map a DB code to a customer-safe message. */
export class OrderError extends Error {
  code?: string;
  constructor(message: string, code?: string) {
    super(message);
    this.name = "OrderError";
    this.code = code;
  }
}

/** Human-friendly, reasonably-unique order number: ITL-YYYYMMDD-XXXX */
function makeOrderNumber(): string {
  const d = new Date();
  const ymd =
    `${d.getFullYear()}` +
    `${String(d.getMonth() + 1).padStart(2, "0")}` +
    `${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ITL-${ymd}-${rand}`;
}

export async function createOrder(input: OrderInput): Promise<OrderResult> {
  const MAX_ATTEMPTS = 3;
  let lastError:
    | { code?: string; message?: string; details?: string; hint?: string }
    | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const order_number = makeOrderNumber();

    const { error } = await supabase.from("orders").insert({
      order_number,
      full_name: input.fullName,
      email: input.email || null,
      phone: input.phone,
      wilaya: input.wilaya,
      address: input.address,
      items: input.items,
      subtotal: input.subtotal,
      shipping: input.shipping,
      total: input.total,
    });

    if (!error) return { orderNumber: order_number };

    lastError = error;

    // The only UNIQUE column is order_number — on a (very rare) collision,
    // regenerate and retry. Any other error is not retryable.
    if (error.code === "23505") continue;

    console.error("[orders] insert failed", {
      code: error.code,
      message: error.message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
    });
    throw new OrderError(error.message, error.code);
  }

  console.error("[orders] insert failed after retries", lastError);
  throw new OrderError(
    lastError?.message ?? "Order could not be created.",
    lastError?.code
  );
}

export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<TrackResult | null> {
  const { data, error } = await supabase.rpc("track_order", {
    p_order_number: orderNumber.trim(),
    p_phone: phone.trim(),
  });

  if (error) {
    console.error("[orders] track failed", {
      code: error.code,
      message: error.message,
    });
    throw new Error(error.message);
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  return {
    orderNumber: row.order_number,
    status: row.status,
    total: row.total,
    createdAt: row.created_at,
  };
}