/** Backend ``StoreRatingMetrics`` — aggregated CRM + reputation. */
export type StoreRatingMetrics = {
  store_id: string;
  average_rating: number;
  total_reviews_count: number;
  order_fulfillment_rate: number;
  product_match_rate: number;
  average_response_time_min: number;
  updated_at: string;
};

/** Backend ``StoreReviewPayload``. */
export type StoreReviewPayload = {
  id: string;
  user_id: string | null;
  store_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

/** Legacy storefront display (derived from store metrics). */
export type ShopTrustMetrics = {
  on_time_delivery_pct: number;
  quality_guarantee: boolean;
  response_time_hours?: number | null;
  return_rate_pct?: number | null;
  badges: string[];
  rating_distribution?: Record<string, number>;
};

export function trustMetricsFromStoreRating(metrics: StoreRatingMetrics): ShopTrustMetrics {
  return {
    on_time_delivery_pct: Math.round(metrics.order_fulfillment_rate),
    // no backend field backs a quality guarantee or a per-star distribution — do not invent them
    quality_guarantee: false,
    response_time_hours:
      metrics.average_response_time_min > 0 ? Math.round((metrics.average_response_time_min / 60) * 10) / 10 : null,
    badges: [],
    rating_distribution: {},
  };
}

/** Empty metrics — used when the shop has no measured data yet (nothing is displayed). */
export const DEFAULT_SHOP_TRUST_METRICS: ShopTrustMetrics = {
  on_time_delivery_pct: 0,
  quality_guarantee: false,
  response_time_hours: null,
  badges: [],
  rating_distribution: {},
};
