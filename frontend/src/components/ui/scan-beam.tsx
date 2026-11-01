"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type ScanBeamProps = {
  active: boolean;
  variant?: "gold" | "electric";
  className?: string;
};

export function ScanBeam({ active, variant = "electric", className }: ScanBeamProps) {
  if (!active) return null;

  const isElectric = variant === "electric";

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}>
      <motion.div
        className={cn(
          "absolute inset-x-0 h-24 bg-gradient-to-b from-transparent to-transparent",
          isElectric ? "via-electric-500/40" : "via-gold-500/35",
        )}
        initial={{ top: "-20%" }}
        animate={{ top: ["-20%", "110%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className={cn(
          "absolute inset-0 rounded-[inherit] border",
          isElectric ? "border-electric-500/45" : "border-gold-500/40",
        )}
        animate={{ opacity: [0.35, 0.95, 0.35] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <motion.div
        className={cn(
          "absolute inset-x-0 z-10 h-[2px]",
          isElectric
            ? "bg-electric-400"
            : "bg-gold-400",
        )}
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      <div
        className={cn(
          "absolute inset-0 bg-[size:24px_24px]",
          isElectric
            ? ""
            : "",
        )}
      />
    </div>
  );
}
