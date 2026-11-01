import type { Product } from "@/types";

/**
 * stock_count=0 odatda "kuzatilmaydi". Backend default qiymati 5 (server_default="5"),
 * shuning uchun 4–10 oralig'i ko'pincha haqiqiy qoldiq emas — "Kam qoldi" faqat 1–3 dona qolganda.
 */
export function isLowStock(product: Pick<Product, "stock_count">): boolean {
  const n = product.stock_count;
  if (n == null || n === undefined) return false;
  return n >= 1 && n <= 3;
}
