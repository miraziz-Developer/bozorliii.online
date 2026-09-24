# Bozorliii.online

[![CI](https://github.com/miraziz-Developer/bozorliii.online/actions/workflows/ci.yml/badge.svg)](https://github.com/miraziz-Developer/bozorliii.online/actions/workflows/ci.yml)

**Mahalliy bozorlar uchun AI marketplace** — kiyim-kechak katalogi, rasm bilan qidiruv, AI stilist, onlayn bron,
xarita, do'konchilar uchun CRM va Telegram botlar.

| | |
|---|---|
| Do'kon | https://bozorliii.online |
| Merchant CRM | https://crm.bozorliii.online |
| API | https://api.bozorliii.online/api/v1/health/live |

## Texnologiyalar

| Qism | Stack |
|------|-------|
| **API** | Python 3.11, FastAPI, SQLAlchemy (async), Alembic, PostgreSQL 16 + pgvector, Redis, Celery |
| **Mijoz web** | Next.js 14 (PWA), Tailwind |
| **Merchant CRM / Platforma admin** | Next.js 14 |
| **Mobil** | Capacitor (Android / iOS) |
| **Botlar** | aiogram 3 — `@Bozorliiicrm_bot` (do'konchi), `@Bozorliii_bot` (mijoz, telefon tasdiqlash) |
| **AI** | Azure AI Foundry yoki Groq (chat/vision), CLIP (rasm qidiruv, lokal), embedding — Google/OpenAI |
| **Infra** | Docker Compose, Nginx (HTTP/2), Let's Encrypt, Sentry |
| **To'lov / logistika** | Click, BTS Express |

## Serverga o'rnatish — bitta buyruq

Ubuntu 22.04/24.04, 16GB RAM tavsiya (minimum 8GB):

```bash
git clone https://github.com/miraziz-Developer/bozorliii.online.git /opt/bozorliii
cd /opt/bozorliii
sudo bash install.sh     # .env yaratadi, parollarni o'zi generatsiya qiladi
nano .env                # TELEGRAM_BOT_TOKEN, AI kalit, embedding kalit
sudo bash install.sh     # Docker, SSL, build, ishga tushirish, backup — hammasi avtomatik
```

Yangilash: `bash scripts/update.sh`. Batafsil, DNS va GitHub Actions: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Lokal ishlab chiqish

```bash
cp .env.example .env
docker compose up -d --build
```

| URL | |
|-----|---|
| Do'kon | http://localhost:3002 |
| CRM | http://localhost:3003 |
| API | http://localhost:8000/health |

```bash
make dev-up          # docker compose
make test-backend    # pytest
```

## Loyiha tuzilmasi

```
backend/               FastAPI API + botlar + Celery
frontend/              Mijoz web (Next.js PWA)
merchant-crm/          Do'konchi paneli
platform-admin/        Platforma admin paneli
frontend-mobile/       Mijoz Android ilovasi (Capacitor)
merchant-crm-mobile/   Do'konchi mobil ilovasi (Capacitor)
brand/                 Brend manba fayllari
deploy/                Nginx, SSL, server yordamchi skriptlari
scripts/               Operatsion skriptlar (update, backup, seed, tekshiruv)
docs/                  Hujjatlar
install.sh             Bitta buyruqli server o'rnatuvchi
docker-compose.yml         Lokal dev
docker-compose.prod.yml    Production (bitta server)
```

## Hujjatlar

- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — o'rnatish, yangilash, DNS, CI/CD
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — texnik arxitektura
- [docs/STRUCTURE.md](docs/STRUCTURE.md) — loyiha tuzilmasi
- [docs/CONFIGURATION_POLICY.md](docs/CONFIGURATION_POLICY.md) — `.env` siyosati
- [scripts/backup/RESTORE.md](scripts/backup/RESTORE.md) — server yo'qolsa tiklash
- [docs/EXECUTIVE_SUMMARY.md](docs/EXECUTIVE_SUMMARY.md) — biznes ko'rinishi

## CI

GitHub Actions: frontend build, Playwright E2E, backend pytest, Alembic migratsiya, production Docker build va skript sintaksisi.
`main` ga push → CI → avtomatik deploy.

## License

Proprietary — [LICENSE](LICENSE) (Bozorliii © 2026).
