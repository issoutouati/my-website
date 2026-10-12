import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timepieces",
  description: "Discover ISSO TIME LUXURY timepieces — authenticated, with 2-year warranty and nationwide delivery.",
};

export default function RouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}