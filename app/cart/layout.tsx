import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your ISSO TIME LUXURY shopping cart.",
  robots: { index: false, follow: false },
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}