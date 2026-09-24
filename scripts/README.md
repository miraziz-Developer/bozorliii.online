# Operatsion skriptlar

Faqat deploy va production operatsiyalari uchun. Server o'rnatish/yangilash: repo ildizidagi
[`install.sh`](../install.sh) va [`update.sh`](./update.sh). Dev seed skriptlari `RUN_SEED=true` bilan `seed.py` orqali ishga tushadi.

## Deploy

| Skript | Vazifa |
|--------|--------|
| `../install.sh` | **Birinchi o'rnatish**: Docker, `.env`, SSL, build, ishga tushirish, backup cron |
| `update.sh` | Kodni yangilab qayta ishga tushirish (qo'lda yoki CI) |
| `preflight-deploy.sh` | `.env` va majburiy kalitlarni tekshirish |
| `deploy-prod.sh` | Preflight + build + health (qo'lda, `update.sh` dan soddaroq) |
| `generate-production-env.sh` | Mavjud `.env` dan production `.env` shablon |
| `smoke-prod.sh` | Health smoke test |

## Backup

`backup/` — server tomonidagi 6 soatlik dump (`stage-backup.sh`), Mac'ga tortib olish (`local-pull.sh`) va tiklash qo'llanmasi (`RESTORE.md`).

## Integratsiya va media

| Skript | Vazifa |
|--------|--------|
| `configure_production_integrations.sh` | Tashqi API kalitlarini `.env` ga yozish |
| `enable_r2_media.sh` | S3/R2 media backend yoqish |
| `migrate_local_uploads_to_s3.py` | Lokal uploadlarni S3 ga ko'chirish |
| `verify_integrations.py` | Tashqi servislar smoke |
| `verify_backend_core.py` | API endpoint smoke |
| `verify_media_storage.py` | Media storage tekshiruv |

## Ma'lumotlar

| Skript | Vazifa |
|--------|--------|
| `seed_categories.py` | Kategoriya katalogi (har startda) |
| `seed.py` | Demo ma'lumot (`RUN_SEED=true`) — **destruktiv**, productionda ishlatmang |
| `seed_shop_catalog.py`, `seed_shop_reels.py` | Bitta do'konga demo tovar va reels qo'shish (qo'shimcha, hech narsani o'chirmaydi) |
| `cleanup_demo_seed.py` | Demo ma'lumotni tozalash |
| `ensure_production_catalog.py` | Production katalog to'ldirish |
| `reembed_products.py` | Mahsulot embedding yangilash |
| `reembed_visual_batches.sh` | Batch embedding (cron) |

## Botlar va brend

| Skript | Vazifa |
|--------|--------|
| `run_merchant_bot.py`, `run_customer_bot.py` | Telegram botlar (compose ishga tushiradi) |
| `check_merchant_bot.py` | Bot healthcheck |
| `run_merchant_alerts.py` | Merchant alertlar |
| `sync-brand-assets.sh`, `generate-brand-assets.py` | Brend PNG sinxronlash / generatsiya |
| `generate_merchant_guide.py` | Do'konchilar uchun PDF qo'llanma |

## Media tuzatish (ops)

| Skript | Vazifa |
|--------|--------|
| `catalog_images.py` | Seed rasmlar pool (seed/fix skriptlari uchun) |
| `audit_product_images.py` | Mahsulot rasmlarini audit |
| `repair_broken_media.py` | Buzilgan media tuzatish |
| `fix_product_images.py` | Rasm URL tuzatish |
