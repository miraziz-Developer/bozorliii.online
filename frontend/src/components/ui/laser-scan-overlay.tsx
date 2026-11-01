"use client";

import { cn } from "@/lib/utils";

type LaserScanOverlayProps = {
  active?: boolean;
  className?: string;
};

/** Continuous vertical laser scan (up and down) for AI image ingestion. */
export function LaserScanOverlay({ active = true, className }: LaserScanOverlayProps) {
  if (!active) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}>
      <div className="laser-scan-line absolute inset-x-0 z-20 h-[3px] bg-electric-400" />
      <div className="laser-scan-beam absolute inset-x-0 z-10 h-24 bg-line " />
      <div className="absolute inset-0 bg-[size:18px_18px] opacity-80" />
    </div>
  );
}
