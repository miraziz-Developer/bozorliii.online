# Konfiguratsiya siyosati

Bu loyiha uchun **asosiy source of truth — root `.env`**.

## Qoidalar

- `docker-compose.yml` (lokal dev) va `docker-compose.prod.yml` (production) faqat root `.env` dan foydalanadi.
- `backend/.env` va `frontend/.env.local` tarixiy/mahalliy yordamchi fayllar bo'lishi mumkin, lekin deploy uchun authoritative emas.
- Namunaviy fayllar:
  - `.env.example` — lokal development
  - `.env.production.example` — production (`install.sh` shundan `.env` yaratadi)
- `.env` hech qachon commit qilinmaydi (`.gitignore` da).

## Majburiy xavfsizlik qoidalari

- Production compose faylda secretlar uchun default fallback bo'lmasligi kerak.
- `ADMIN_PANEL_PASSWORD`, `ADMIN_PANEL_SECRET`, `ADMIN_SESSION_SECRET`, `ADMIN_API_KEY`, `POSTGRES_PASSWORD`, `JWT_SECRET` aniq berilishi shart. `install.sh` ularni birinchi o'rnatishda xavfsiz tasodifiy qiymat bilan o'zi to'ldiradi.
- Hardcoded credential yoki remote hotfix skriptlar taqiqlanadi.

## Amaliy tavsiya

1. Serverda `sudo bash install.sh` — `.env` ni o'zi yaratadi, faqat API kalitlarini qo'lda to'ldirasiz.
2. Har deploy oldidan `scripts/preflight-deploy.sh` `.env` ni tekshiradi (`update.sh` va `install.sh` chaqiradi).
3. Service-specific env fayllar faqat lokal yordamchi holatlarda ishlatilsin, deploy qarorlarini belgilamasin.
