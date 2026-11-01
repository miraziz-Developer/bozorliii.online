"use client";

import { Clock, ShieldCheck, Sparkles, Truck } from "lucide-react";

import { salesBadgeClass } from "@/components/brand/sales-ui";
import { DEFAULT_SHOP_TRUST_METRICS } from "@/types/shop-trust";
import { cn } from "@/lib/utils";
import type { ShopProfile } from "@/types";

type Props = {
  shop: ShopProfile;
  className?: string;
};

export function ShopTrustStrip({ shop, className }: Props) {
  const metrics = shop.trust_metrics ?? DEFAULT_SHOP_TRUST_METRICS;
  const fulfillment = metrics.on_time_delivery_pct ?? 0;
  const responseHours = metrics.response_time_hours ?? null;

  // Only measured metrics are shown; missing values are hidden instead of using placeholder numbers.
  const items: Array<{ icon: typeof Truck; label: string; sub: string; badge: "trust" | "deal" | "hot" }> = [];
  if (fulfillment > 0) {
    items.push({ icon: Truck, label: `${fulfillment}% vaqtida`, sub: "Buyurtma bajariladi", badge: "trust" });
  }
  if (metrics.quality_guarantee) {
    items.push({ icon: ShieldCheck, label: "Sifat kafolati", sub: "Do‘kon tomonidan", badge: "trust" });
  }
  if (responseHours != null && responseHours > 0) {
    items.push({
      icon: Clock,
      label: responseHours < 1 ? `${Math.round(responseHours * 60)} daqiqada javob` : `${responseHours.toFixed(1)} soatda javob`,
      sub: "O‘rtacha javob vaqti",
      badge: "deal",
    });
  }
  items.push({ icon: Sparkles, label: "Bron bepul", sub: "Do'konda to'lang", badge: "hot" });

  return (
    <div
      className={cn("shop-trust-strip", className)}
      role="list"
      aria-label="Do'kon ishonchliligi"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} role="listitem" className="shop-trust-strip__item">
            <span className={cn("shop-trust-strip__icon", salesBadgeClass[item.badge])}>
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="shop-trust-strip__label">{item.label}</p>
              <p className="shop-trust-strip__sub">{item.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
