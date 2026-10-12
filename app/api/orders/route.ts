// app/api/orders/route.ts  — SERVER-AUTHORITATIVE order creation.
// The browser sends ONLY { productId, quantity } + customer info + bot token.
// Prices/totals are recomputed here from the trusted server catalog; the client
// can never influence money. Stock is decremented atomically in the DB.
import { NextResponse } from "next/server";
import { orderSchema } from "@/lib/orderSchema";
import { getProductById } from "@/lib/products";
import { SHIPPING } from "@/lib/constans";
import { getAdminClient } from "@/lib/supabaseAdmin";
import { verifyTurnstile } from "@/lib/turnstile";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { sendOrderConfirmationEmail } from "@/lib/server/orderEmail";

export const runtime = "nodejs";

function makeOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ITL-${ymd}-${rand}`;
}

export async function POST(req: Request) {
  // 1) Rate limit per IP
  const ip = clientIp(req);
  const rl = await rateLimit(ip, "orders");
  if (!rl.success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  // 2) Parse + validate shape (Zod)
  let parsed;
  try {
    parsed = orderSchema.parse(await req.json());
  } catch (err) {
    return NextResponse.json({ error: "invalid_request", details: String(err) }, { status: 400 });
  }

  // 3) Bot protection
  const human = await verifyTurnstile(parsed.token ?? "", ip);
  if (!human) {
    return NextResponse.json({ error: "bot_check_failed" }, { status: 400 });
  }

  // 4) SERVER-SIDE price resolution (never trust the client)
  const priced: { id: string; name: string; price: number; quantity: number }[] = [];
  let subtotal = 0;
  for (const line of parsed.items) {
    const p = getProductById(line.productId);
    if (!p) {
      return NextResponse.json({ error: "invalid_item", productId: line.productId }, { status: 400 });
    }
    if (p.available === false) {
      return NextResponse.json({ error: "unavailable", productId: line.productId }, { status: 409 });
    }
    priced.push({ id: p.id, name: p.name, price: p.price, quantity: line.quantity });
    subtotal += p.price * line.quantity;
  }
  const shipping = SHIPPING;          // H5 excluded → flat stub for now
  const total = subtotal + shipping;

  // 5) Atomic insert + stock decrement via service-role RPC (with collision retry)
  const admin = getAdminClient();
  const c = parsed.customer;
  let orderNumber = "";

  for (let attempt = 0; attempt < 3; attempt++) {
    orderNumber = makeOrderNumber();
    const { error } = await admin.rpc("place_order", {
      p_order_number: orderNumber,
      p_full_name: c.fullName,
      p_email: c.email || null,
      p_phone: c.phone,
      p_wilaya: c.wilaya,
      p_address: c.address,
      p_items: priced,
      p_subtotal: subtotal,
      p_shipping: shipping,
      p_total: total,
    });

    if (!error) break;

    const msg = error.message || "";
    if (msg.includes("INSUFFICIENT_STOCK")) {
      const productId = msg.split("INSUFFICIENT_STOCK:")[1]?.trim();
      return NextResponse.json({ error: "out_of_stock", productId }, { status: 409 });
    }
    if ((error as { code?: string }).code === "23505") continue; // order_number collision → retry
    console.error("[api/orders] place_order failed", error);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  // 6) Confirmation email — server-side, only for an order we just created
  if (c.email) {
    await sendOrderConfirmationEmail({
      orderNumber, fullName: c.fullName, email: c.email,
      items: priced, subtotal, shipping, total,
    });
  }

  return NextResponse.json({ orderNumber, total }, { status: 200 });
}