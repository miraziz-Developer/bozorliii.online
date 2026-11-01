"use client";

import { Crosshair, LocateFixed } from "lucide-react";

import { cn } from "@/lib/utils";

type NavigationFollowControlProps = {
  active: boolean;
  onToggle: () => void;
  className?: string;
};

/** Yandex Navigator uslubidagi «meni kuzat» tugmasi. */
export function NavigationFollowControl({
  active,
  onToggle,
  className,
}: NavigationFollowControlProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? "Kuzatish yoqilgan" : "Meni kuzatishni yoqish"}
      className={cn(
        "pointer-events-auto flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold shadow-xl backdrop-blur-md transition",
        active
          ? "border-[#76152F] bg-[#76152F] text-white shadow-[#76152F]/35"
          : "border-white/80 bg-white/95 text-ink-800 hover:border-[#76152F]/40 hover:text-[#76152F]",
        className,
      )}
    >
      <span
        className={cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full",
          active ? "bg-white/20" : "bg-[#76152F]/10 text-[#76152F]",
        )}
      >
        {active ? (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-white/30" />
            <Crosshair className="relative h-5 w-5" />
          </>
        ) : (
          <LocateFixed className="h-5 w-5" />
        )}
      </span>
      <span className="text-left leading-tight">
        <span className="block">{active ? "Kuzatilmoqda" : "Meni kuzatish"}</span>
        <span className={cn("block text-xs font-medium", active ? "text-white/85" : "text-ink-500")}>
          {active ? "Xarita siz bilan harakatlanadi" : "Joylashuv bo‘yicha yaqinlashtirish"}
        </span>
      </span>
    </button>
  );
}
