"use client";

import { ArrowRight, MapPinned, Search, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { useFeaturedProducts } from "@/hooks/useFeaturedProducts";
import { productImage } from "@/lib/media";

function formatUzs(value: number): string {
  return `${value.toLocaleString("uz-UZ")} so‘m`;
}

/**
 * Homepage hero — editorial split layout: copy + primary actions on the left,
 * a collage of real featured products on the right (no mock data; shows neutral
 * placeholders while loading and hides the collage when there are no products).
 */
export function HomeSaleHero() {
  const { data, isLoading } = useFeaturedProducts();
  const products = useMemo(() => (data?.items ?? []).slice(0, 3), [data?.items]);
  const showCollage = isLoading || products.length > 0;

  return (
    <section className="px-[var(--page-gutter)] pb-6 pt-4 sm:pb-10 sm:pt-6" aria-labelledby="home-hero-title">
      <div className="mx-auto grid max-w-7xl items-center gap-8 rounded-card border border-line bg-white px-5 py-8 sm:px-10 sm:py-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-12 lg:px-14 lg:py-14">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-500">
            <Store className="h-4 w-4" aria-hidden /> Mahalliy bozorlar — endi onlayn
          </p>
          <h1
            id="home-hero-title"
            className="mt-4 text-balance text-[2rem] font-bold leading-[1.1] tracking-[-0.02em] text-charcoal sm:text-5xl lg:text-[3.25rem]"
          >
            Bozordagi kiyimlarni uydan turib tanlang
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-ink-500 sm:text-lg sm:leading-8">
            Do‘konlar, real narxlar va o‘lchamlar bitta joyda. Qidiring, taqqoslang va sotuvchidan oldindan band qiling.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/search"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control bg-brand-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <Search className="h-4 w-4" aria-hidden /> Mahsulot qidirish
            </Link>
            <Link
              href="/map"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-control border border-line bg-white px-6 text-sm font-semibold text-charcoal transition-colors hover:border-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
            >
              <MapPinned className="h-4 w-4" aria-hidden /> Bozor xaritasi
            </Link>
          </div>
        </div>

        {showCollage ? (
          <div className="hidden grid-cols-3 gap-3 sm:grid" aria-label="Tavsiya etilgan mahsulotlar">
            {products.length > 0
              ? products.map((product, index) => (
                  <Link
                    key={product.id}
                    href={product.detail_path ?? `/product/${product.id}`}
                    className={`group block ${index === 1 ? "translate-y-6" : ""}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-[#F1EEE7]">
                      <Image
                        src={productImage(product.images)}
                        alt={product.name}
                        fill
                        sizes="(min-width: 1024px) 180px, 30vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="mt-2 truncate text-sm font-medium text-charcoal">{product.name}</p>
                    <p className="text-sm font-semibold tabular-nums text-charcoal">{formatUzs(product.price_uzs ?? product.price)}</p>
                  </Link>
                ))
              : [0, 1, 2].map((index) => (
                  <div key={index} className={index === 1 ? "translate-y-6" : ""} aria-hidden>
                    <div className="aspect-[4/5] animate-pulse rounded-card bg-[#F1EEE7]" />
                    <div className="mt-2 h-3 w-3/4 animate-pulse rounded bg-[#F1EEE7]" />
                  </div>
                ))}
            <Link
              href="#catalog"
              className="col-span-3 mt-8 inline-flex items-center justify-end gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700"
            >
              Katalogni ko‘rish <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
