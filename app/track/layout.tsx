import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track your ISSO TIME LUXURY order using your order number and phone.",
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}