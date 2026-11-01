"use client";

import { motion } from "framer-motion";
import { Film, Home, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", icon: Home, label: "Bosh sahifa" },
  { href: "/reels", icon: Film, label: "Reels" },
  { href: "/search", icon: Search, label: "Qidiruv" },
  { href: "/checkout", icon: ShoppingBag, label: "Savatcha" },
  { href: "/profile", icon: User, label: "Profil" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.totalItems());
  const totalItems = mounted ? cartItems : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav aria-label="Asosiy menyu" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="mx-auto grid w-full max-w-lg grid-cols-5">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-cart-anchor={item.href === "/checkout" ? true : undefined}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex min-h-[56px] min-w-0 flex-col items-center justify-center gap-1 px-0.5 text-xs font-medium transition-colors",
                isActive ? "font-semibold text-brand-500" : "text-ink-500 hover:text-charcoal",
              )}
            >
              <span className="relative">
                <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} aria-hidden />
                {item.href === "/checkout" && totalItems > 0 ? (
                  <span className="absolute -right-2.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-500 px-1 text-xs font-bold text-white ring-2 ring-white" aria-label={`Savatchada ${totalItems} ta mahsulot`}>
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                ) : null}
              </span>
              <span className="max-w-full whitespace-nowrap tracking-[-0.02em]">{item.label}</span>
              {isActive ? (
                <motion.div
                  layoutId="bottomnav-indicator"
                  className="absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 bg-brand-500"
                  transition={{ type: "spring", damping: 28, stiffness: 380 }}
                />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
