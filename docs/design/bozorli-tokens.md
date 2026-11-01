# Bozorli: marketplace design tokens

Source of truth: `frontend/tailwind.config.ts` and the `:root` block in `frontend/app/globals.css`.

## Colour

| Token | Hex | Use |
|---|---|---|
| `ivory` / `canvas` | `#F7F5F0` | page background |
| `brand-500` | `#76152F` | primary actions, active nav, links, sale badges |
| `brand-600` / `brand-700` | `#66122A` / `#5A0F23` | hover / pressed |
| `brand-100` | `#F3E6E9` | quiet tinted surfaces |
| `charcoal` / `ink-900` | `#202020` | text, prices, dark buttons |
| `ink-500` | `#6B6B6B` | secondary text (4.5:1 or better on white and ivory) |
| `sand` | `#D9C7B5` | optom / premium accents, sponsored frames |
| `line` | `#E8E8E8` | borders, dividers |

The legacy names `electric-*`, `neon-*`, `gold-*` and Tailwind's `blue`, `indigo`, `sky`, `violet` and `purple` now resolve to the burgundy scale. Older components therefore follow the new brand without a rewrite. New code should use `brand-*`, `charcoal`, `sand`, `line` and `ivory`.

Status colours stay as they are: green `#2F6B4F`, red `#B42318`, and Tailwind's amber and emerald.

## Type
- Inter (`--font-sans`) everywhere. Prices use sans with `tabular-nums`, not monospace.
- Minimum text size is 12px (`text-xs`). Arbitrary 7–11px sizes were raised.

## Shape and depth
- Radii: `--r-sm 6`, `--r-md 8` (`rounded-control`), `--r-lg 12` (`rounded-card`), `--r-xl 14`, `--r-2xl 16`.
- Shadows are neutral and low (`--shadow-card`, `--shadow-hover`). Coloured glows are gone.

## Removed on purpose
- Decorative gradients, radial "mesh" washes, grid-line textures, blurred colour blobs, and gradient text.
- Infinite pulse animations, the 3D tilt on product cards, and the clip-path page wipe.
- Gradient scrims over photos are **kept**, because they keep text readable on images.

## Honesty rules applied to the UI
- No fabricated metrics. Shop trust numbers, rating distributions and similarity percentages are shown only when the API provides them.
- Paid placements (`/home/premium-banners`) carry a visible "Reklama" label.
- "Kam qoldi" shows only for 1–3 units, because the backend default `stock_count` of 5 means "not tracked".
