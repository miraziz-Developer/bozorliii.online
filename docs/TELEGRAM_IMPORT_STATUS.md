# Telegram product import: current state and next step

## What exists today (verified in code)
- **Merchant bot (aiogram 3)**, `backend/app/infrastructure/bots/merchant_product_handlers.py`:
  1. A registered seller sends a product photo (with an optional caption) to the bot.
  2. The bot parses the price and stock from the caption (`_parse_price_from_caption`, `_parse_stock_from_caption`) and runs vision tagging.
  3. It stores a draft in `merchant_pending_products` (`telegram_file_id`, `vision_attributes`, `status=pending`).
  4. The seller picks a category and sizes with inline buttons, then publishes.
- **Review API**, `backend/app/interfaces/api/merchant_pending_routes.py` (`/merchant/pending-products`): `GET` lists drafts; `POST /{id}/publish`, `POST /{id}/reject` and `PATCH /{id}` handle each draft.
- The live product API returns a `source` of `crm` or `telegram` for products (seen in API responses, October 2026).

In short: the seller forwards posts to the bot, which creates drafts, and the seller confirms them. Nothing is published without the seller's confirmation.

## What does NOT exist
- No automatic import from a Telegram **channel**. There is no `channel_post` handler, and nothing reads a channel's history.

## How channel import could be added honestly (not implemented)
1. The seller adds the Bozorli merchant bot as an **administrator** of *their own* channel. Telegram only sends `channel_post` updates to bots that are channel admins. Private channels the bot is not in cannot be read, and this must not be worked around.
2. Add a `channel_post` handler. It maps `chat.id` to `shops.telegram_chat_id` (the column already exists) and creates `merchant_pending_products` drafts through the same code path as photo uploads.
3. Albums (`media_group_id`) become one draft with several images. A missing price or size stays empty and the draft is flagged "needs info", never guessed.
4. Telegram bots cannot fetch posts made **before** the bot was added. Older posts can only be imported if the seller forwards them to the bot by hand.
5. Drafts appear in the CRM review list (the existing API). The seller publishes them.

Environment needed: `TELEGRAM_BOT_TOKEN` (the merchant bot token already in `backend/app/core/config.py`), the bot set as channel admin, and a webhook or polling worker that receives `channel_post` updates.
