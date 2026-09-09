import type { Metadata } from "next";

import { StylistStudio } from "@/components/stylist/stylist-studio";

export const metadata: Metadata = {
  title: "Shaxsiy AI Stilist — Bozorliii.online",
  description:
    "O‘zbekiston bozorlaridagi katalogdan AI stilist: look, byudjet, xarita va haqiqiy mahsulotlar.",
};

export default function StylistPage() {
  return <StylistStudio />;
}
