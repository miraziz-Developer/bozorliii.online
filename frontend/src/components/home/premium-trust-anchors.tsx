"use client";

import { ArrowRight, MapPin, MessageCircle, Sparkles } from "lucide-react";
import Link from "next/link";

import { useT } from "@/i18n/locale-provider";
import type { HomeMessageKey } from "@/i18n/home-messages";

type TrustAnchor = {
  icon: typeof MapPin;
  titleKey: HomeMessageKey;
  descKey: HomeMessageKey;
  stylistCard?: boolean;
};

const ANCHORS: TrustAnchor[] = [
  {
    icon: MapPin,
    titleKey: "home.trust.pricing.title",
    descKey: "home.trust.pricing.desc",
  },
  {
    icon: MessageCircle,
    titleKey: "home.trust.direct.title",
    descKey: "home.trust.direct.desc",
  },
  {
    icon: Sparkles,
    titleKey: "home.trust.stylist.title",
    descKey: "home.trust.stylist.desc",
    stylistCard: true,
  },
];

export function PremiumTrustAnchors() {
  const t = useT();

  return (
    <ul
      className="mx-auto mb-8 grid max-w-7xl grid-cols-1 divide-y divide-line rounded-card border border-line bg-white md:grid-cols-3 md:divide-x md:divide-y-0"
      aria-label={t("home.trust.aria")}
    >
      {ANCHORS.map((anchor) => {
        const Icon = anchor.icon;
        return (
          <li key={anchor.titleKey} className="flex gap-3 p-5">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" aria-hidden />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-charcoal">{t(anchor.titleKey)}</h3>
              <p className="mt-1 text-sm leading-6 text-ink-500">{t(anchor.descKey)}</p>
              {anchor.stylistCard ? (
                <Link
                  href="/stylist"
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-700"
                >
                  {t("home.trust.stylist.cta")} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
