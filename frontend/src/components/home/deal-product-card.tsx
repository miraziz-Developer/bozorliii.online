"use client";

import Link from "next/link";

import { ProductRatingStars } from "@/components/product/product-rating-stars";
import { useCurrency } from "@/components/providers/currency-provider";
import { productDiscountPercent, formatSoldCount } from "@/lib/deal-pricing";
import { ProductPinImage } from "@/components/ui/product-pin-image";
import { isLowStock } from "@/lib/product-stock";
import { productPriceUzs } from "@/lib/product-price";
import { isOptomProduct, optomCardHint, priceUnitSuffix } from "@/lib/wholesale";
import type { Product } from "@/types";

type Props = {
  product: Product;
  variant?: "lightning" | "clearance";
};

export function DealProductCard({ product, variant = "lightning" }: Props) {
  const { formatPrice } = useCurrency();
  const base = productPriceUzs(product);
  const discount = productDiscountPercent(product);
  const sold = formatSoldCount(product.sold_count ?? 0);
  const reviews = product.review_summary?.review_count ?? 0;
  const rating = product.review_summary?.average_rating ?? 0;
  const lowStock = isLowStock(product);
  const optomHint = optomCardHint(product, formatPrice);
  const unitSuffix = priceUnitSuffix(product);
  const isOptom = isOptomProduct(product);

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex w-[min(42vw,160px)] min-w-[120px] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-line bg-white transition-colors hover:border-charcoal/30"
    >
      <div className="relative overflow-hidden bg-elevated">
        <ProductPinImage
          images={product.images}
          alt={product.name}
          aspectClass="aspect-square w-full"
          sizes="152px"
        />
        {discount != null && discount > 0 && variant === "lightning" ? (
          <span className="absolute left-2 top-2 rounded bg-brand-500 px-1.5 py-0.5 text-xs font-semibold text-white">
            -{discount}%
          </span>
        ) : null}
        {isOptom ? (
          <span className="absolute right-2 top-2 rounded bg-charcoal px-1.5 py-0.5 text-xs font-semibold text-white">
            Optom
          </span>
        ) : null}
        {variant === "clearance" && lowStock ? (
          <span className="absolute bottom-2 left-2 z-10 rounded bg-white px-1.5 py-0.5 text-xs font-semibold text-charcoal">
            Kam qoldi ({product.stock_count})
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-2.5">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-charcoal">{product.name}</p>
        <div className="mt-1.5 flex items-baseline gap-0.5">
          <span className="price-mono text-sm font-semibold text-charcoal">{formatPrice(base)}</span>
          {unitSuffix ? <span className="text-xs font-medium text-ink-500">{unitSuffix}</span> : null}
        </div>
        {optomHint ? (
          <p className="mt-0.5 line-clamp-2 text-xs font-semibold leading-snug text-electric-600">{optomHint}</p>
        ) : null}
        <div className="mt-1 flex min-h-[14px] items-center gap-1">
          {reviews > 0 ? (
            <>
              <ProductRatingStars rating={rating} size="sm" />
              <span className="text-xs text-ink-500">({reviews})</span>
            </>
          ) : sold ? (
            <p className="text-xs text-ink-500">{sold} sotilgan</p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
