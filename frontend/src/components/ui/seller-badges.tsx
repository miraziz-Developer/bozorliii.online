import { ShieldCheck } from "lucide-react";

import type { Product } from "@/types";

type SellerBadgesProps = {
  product: Product;
};

/**
 * Seller badges are shown only when backed by real data.
 * (Previously "Ishonchli sotuvchi" / "Eng tez javob beradigan" were derived from
 * shop-name length or always shown — removed as misleading.)
 */
export function SellerBadges({ product }: SellerBadgesProps) {
  if (!product.shop?.is_verified) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="inline-flex items-center gap-1 rounded border border-line bg-white px-2 py-0.5 text-xs font-medium text-charcoal">
        <ShieldCheck className="h-3.5 w-3.5 text-brand-500" aria-hidden />
        Tasdiqlangan do‘kon
      </span>
    </div>
  );
}
