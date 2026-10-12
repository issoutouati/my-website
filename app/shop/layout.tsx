import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the full ISSO TIME LUXURY collection of authenticated luxury timepieces, with delivery across Algeria.",
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}