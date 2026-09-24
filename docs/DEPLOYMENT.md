# Production deploy

Production — **bitta server** (Ubuntu 22.04/24.04, 16GB RAM tavsiya; minimum 8GB + swap), hammasi Docker'da.
Barcha servislar `docker-compose.prod.yml` da: PostgreSQL+pgvector, Redis, API, Celery, ikkita bot,
mijoz sayti, Merchant CRM, Platform admin va Nginx.

## Birinchi o'rnatish (bitta buyruq)

```bash
git clone https://github.com/miraziz-Developer/bozorliii.online.git /opt/bozorliii
cd /opt/bozorliii
sudo bash install.sh      # 1-marta: .env yaratadi, parollarni o'zi generatsiya qiladi, kalitlarni so'raydi
nano .env                 # faqat majburiy kalitlarni to'ldiring (pastda)
sudo bash install.sh      # 2-marta: hammasini o'zi qiladi
```

`install.sh` idempotent — istalgan payt qayta ishga tushirsa bo'ladi. U quyidagilarni bajaradi:

| # | Bosqich | Izoh |
|---|---------|------|
| 1 | Paketlar | curl, git, openssl, dnsutils, ufw, cron |
| 2 | Docker | yo'q bo'lsa `deploy/install-docker.sh` |
| 3 | Swap | OOM himoyasi (`deploy/setup-swap.sh`) |
| 4 | `.env` | `.env.production.example` dan yaratadi; `CHANGE_ME_*` parollarni (DB, JWT, admin) o'zi generatsiya qiladi |
| 5 | Preflight | `scripts/preflight-deploy.sh` — majburiy kalitlar va xavfsiz qiymatlar |
| 6 | Firewall | ufw: 22, 80, 443 |
| 7 | SSL | Let's Encrypt (DNS tayyor bo'lsa), aks holda vaqtinchalik self-signed; haftalik avto-yangilash cron |
| 8 | Build + ishga tushirish | `docker compose -f docker-compose.prod.yml up -d --build --wait` |
| 9 | Backup cron va tekshiruv | har 6 soatda DB dump; health tekshiruvi |

Flaglar: `--check` (hech narsani o'zgartirmaydi, faqat tekshiradi), `--no-ssl`, `--no-firewall`.

### `.env` da siz to'ldiradigan majburiy qiymatlar

| O'zgaruvchi | Nima uchun |
|-------------|-----------|
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME` | Merchant OTP va bot |
| `GROQ_API_KEY` **yoki** `AZURE_OPENAI_API_KEY` + `AZURE_OPENAI_ENDPOINT` | AI stilist va vizual qidiruv |
| `GOOGLE_API_KEY` **yoki** `OPENAI_API_KEY` | Katalog embedding |

Qolgani (`POSTGRES_PASSWORD`, `JWT_SECRET`, `ADMIN_*`) avtomatik generatsiya qilinadi. Ixtiyoriy:
`RESEND_API_KEY` (email OTP), `ESKIZ_*` (SMS), `CLICK_*` (to'lov), `NEXT_PUBLIC_YANDEX_MAPS_API_KEY` (xarita),
`SENTRY_DSN`. To'liq ro'yxat izohlari bilan: `.env.production.example`.

## DNS

Hamma domenlar bitta server IP'siga qaraydi:

| Type | Host | Value |
|------|------|-------|
| A | `@`, `www`, `api`, `crm`, `admin` | server IP |
| A | `media` | server IP (faqat S3/R2 CDN ishlatsangiz) |

DNS tayyor bo'lguncha `install.sh` self-signed sertifikat qo'yadi; DNS yangilangach qayta ishga tushirsangiz
haqiqiy Let's Encrypt sertifikatiga almashtiradi. Tekshirish: `bash deploy/check-dns.sh`.
Firewall / Security Group: **22, 80, 443** ochiq.

## Yangilash

```bash
cd /opt/bozorliii
bash scripts/update.sh              # origin dagi oxirgi commit
bash scripts/update.sh <sha>        # aniq commit
bash scripts/update.sh <sha> frontend   # faqat bitta servisni qayta build qilish
```

Skript: kodni yangilaydi → preflight → `docker compose up -d --build --wait` → health tekshiruvi.
Faqat `docker-compose.prod.yml` ishlatiladi.

### Avtomatik deploy (GitHub Actions)

`main` ga push → **CI** o'tadi → **Deploy** workflow serverga SSH qilib `scripts/update.sh <sha>` ni ishga tushiradi,
so'ng `smoke-test` saytni tekshiradi. GitHub → Settings → Secrets → Actions da kerak:

| Secret | Qiymat |
|--------|--------|
| `SSH_HOST` | server IP |
| `SSH_USER` | SSH foydalanuvchi (masalan `bozorliii`; Docker guruhida bo'lishi kerak) |
| `SSH_PRIVATE_KEY` | shu foydalanuvchining deploy kaliti (`ssh-keygen -t ed25519 -f deploy_key`, ochiq qismi serverning `authorized_keys` ida) |
| `SSH_KNOWN_HOSTS` | `ssh-keyscan -t ed25519 <server IP>` natijasi |
| `DEPLOY_ALERT_WEBHOOK_URL` | ixtiyoriy — xato haqida xabar |

## Tekshirish

```bash
docker compose -f docker-compose.prod.yml ps
curl -sf https://api.bozorliii.online/api/v1/health/live
make prod-smoke
```

## Backup

`install.sh` har 6 soatda `scripts/backup/stage-backup.sh` ni cron'ga qo'yadi (DB dump + yuklangan media).
Kompyuterga tortib olish va butun serverni tiklash: [scripts/backup/RESTORE.md](../scripts/backup/RESTORE.md).

## Media (S3 / R2)

Boshlash uchun mahalliy disk (`MEDIA_STORAGE_BACKEND=local`) yetarli. Trafik o'sganda Cloudflare R2 ga o'ting:
[MEDIA_S3_CDN.md](./MEDIA_S3_CDN.md), `bash scripts/enable_r2_media.sh`.
