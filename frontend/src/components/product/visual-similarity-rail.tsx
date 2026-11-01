"use client";

import { motion } from "framer-motion";
import { ScanSearch } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/components/ui/product-image";
import { SectionHeader } from "@/components/ui/section-header";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

type VisualSimilarityRailProps = {
  sourceImage: string;
  items: Product[];
};

export function VisualSimilarityRail({ sourceImage, items }: VisualSimilarityRailProps) {
  if (!items.length) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Visual match"
        title="O'xshash mahsulotlar"
        description="Faqat yuklangan rasm va mahsulot fotosurati bo'yicha AI embedding natijalari."
        action={
          <span className="inline-flex items-center gap-1 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-400">
            <ScanSearch className="h-3.5 w-3.5" />
            Rasm bo'yicha
          </span>
        }
      />
      <div className="mb-5 flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface/70 p-3">
        <ProductImage
          images={[sourceImage]}
          alt="Asosiy rasm"
          fill
          wrapperClassName="h-16 w-16 rounded-xl border border-gold-500/30"
          className="object-cover"
          sizes="64px"
        />
        <p className="text-sm text-text-300">AI ushbu rasm silueti, rang palitrasi va mato teksturasiga eng yaqin tovarlarni tanladi.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/product/${item.id}`} className="group block overflow-hidden rounded-2xl border border-border-subtle bg-surface">
              <div className="relative aspect-square overflow-hidden bg-elevated">
                <ProductImage
                  images={item.images}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="25vw"
                />
                {typeof item.visual_match_pct === "number" && item.visual_match_pct > 0 ? (
                  <span className="absolute left-2 top-2 z-10 rounded bg-white px-2 py-0.5 text-xs font-semibold text-charcoal">
                    {Math.round(item.visual_match_pct)}% o&apos;xshash
                  </span>
                ) : null}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-text-100">{item.name}</p>
                <p className="price-mono mt-2 text-base font-semibold text-charcoal">{formatPrice(item.price)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
