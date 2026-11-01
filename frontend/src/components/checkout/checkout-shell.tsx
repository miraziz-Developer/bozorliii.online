"use client";

import type { ReactNode } from "react";

import { PremiumTrustStrip } from "@/components/ui/premium-trust-strip";
import { cn } from "@/lib/utils";

/** Checkout / bron — premium marketplace scope */
export function CheckoutShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "checkout-bozor relative min-h-[calc(100dvh-var(--app-header-h))] overflow-hidden",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-100",
        "",
        className,
      )}
      data-brand="bozorliii-uz"
    >
      <div className="market-container relative py-6 sm:py-10">
        <PremiumTrustStrip className="mb-6" />
        {children}
      </div>
    </div>
  );
}
