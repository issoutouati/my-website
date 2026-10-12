// lib/server/orderEmail.ts  (SERVER ONLY)
interface Item { name: string; price: number; quantity: number; }
export interface OrderEmailData {
  orderNumber: string; fullName: string; email: string;
  items: Item[]; subtotal: number; shipping: number; total: number;
}

const da = (n: number) => `${Number(n).toLocaleString("fr-DZ")} DA`;
const esc = (s: string) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function render(b: OrderEmailData): string {
  const rows = b.items.map((i) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #1f1a0a;color:#cdbd86;font-size:15px;">${esc(i.name)} <span style="color:#9a8757;">× ${i.quantity}</span></td>
      <td style="padding:10px 0;border-bottom:1px solid #1f1a0a;color:#e8d5a3;font-size:15px;text-align:right;white-space:nowrap;">${da(i.price * i.quantity)}</td>
    </tr>`).join("");
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f1ea;font-family:Georgia,serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea;padding:32px 16px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0b0b0b;border:1px solid #241d06;">
      <tr><td style="padding:36px 40px 24px;text-align:center;border-bottom:1px solid #1f1a0a;">
        <div style="font-size:20px;letter-spacing:6px;color:#e8d5a3;font-weight:bold;">ISSO TIME LUXURY</div>
        <div style="font-size:11px;letter-spacing:3px;color:#a8832e;margin-top:8px;">LUXURY TIMEPIECES · ALGERIA</div>
      </td></tr>
      <tr><td style="padding:32px 40px;">
        <p style="color:#e8d5a3;font-size:18px;margin:0 0 6px;">Thank you, ${esc(b.fullName)}.</p>
        <p style="color:#b8a574;font-size:15px;line-height:1.7;margin:0 0 24px;">Your order has been received successfully. Our team will review and confirm your order shortly by phone before dispatch.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;"><tr><td style="background:#111;border:1px solid #241d06;padding:14px 18px;">
          <div style="font-size:10px;letter-spacing:3px;color:#9a8757;">ORDER NUMBER</div>
          <div style="font-size:18px;letter-spacing:2px;color:#c9a84c;margin-top:4px;">${esc(b.orderNumber)}</div>
        </td></tr></table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}
          <tr><td style="padding:12px 0 4px;color:#9a8757;font-size:14px;">Subtotal</td><td style="padding:12px 0 4px;color:#b8a574;font-size:14px;text-align:right;">${da(b.subtotal)}</td></tr>
          <tr><td style="padding:4px 0;color:#9a8757;font-size:14px;">Delivery</td><td style="padding:4px 0;color:#b8a574;font-size:14px;text-align:right;">${da(b.shipping)}</td></tr>
          <tr><td style="padding:14px 0 0;border-top:1px solid #1f1a0a;color:#e8d5a3;font-size:16px;">Total</td><td style="padding:14px 0 0;border-top:1px solid #1f1a0a;color:#c9a84c;font-size:18px;text-align:right;font-weight:bold;">${da(b.total)}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:24px 40px 36px;text-align:center;border-top:1px solid #1f1a0a;">
        <p style="color:#9a8757;font-size:13px;line-height:1.7;margin:0;">Questions? Simply reply to this email and our team will assist you.</p>
        <p style="color:#6b5e38;font-size:11px;letter-spacing:1px;margin:16px 0 0;">ISSO TIME LUXURY · issotimeluxury.com</p>
      </td></tr>
    </table>
  </td></tr></table></body></html>`;
}

/** Best-effort; never throws. Returns true if sent. */
export async function sendOrderConfirmationEmail(b: OrderEmailData): Promise<boolean> {
  if (!b.email) return false;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_FROM_EMAIL ?? "ISSO TIME LUXURY <onboarding@resend.dev>";
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping confirmation email.");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [b.email], subject: `Your ISSO TIME LUXURY order ${b.orderNumber}`, html: render(b) }),
    });
    if (!res.ok) { console.error("[email] Resend error", res.status, await res.text()); return false; }
    return true;
  } catch (err) {
    console.error("[email] send failed", err);
    return false;
  }
}