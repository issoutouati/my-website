// lib/orderSchema.ts
import { z } from "zod";

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(40),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1, "Cart is empty")
    .max(20, "Too many line items"),
  customer: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(160).optional().or(z.literal("")),
    // Algerian mobile: 0(5|6|7)xxxxxxxx, or +213 / 00213 prefix.
    phone: z
      .string()
      .trim()
      .transform((s) => s.replace(/[\s-]/g, ""))
      .refine((v) => /^(?:(?:\+|00)213|0)(?:5|6|7)\d{8}$/.test(v), "Invalid Algerian phone"),
    wilaya: z.string().trim().min(1).max(60),
    address: z.string().trim().min(5).max(300),
  }),
  token: z.string().optional().default(""), // Turnstile token
});

export type OrderRequest = z.infer<typeof orderSchema>;