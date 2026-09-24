#!/usr/bin/env bash
# Let's Encrypt sertifikatini yangilaydi (install.sh cron'ga qo'yadi, har dushanba).
# certbot standalone :80 ni ishlatadi — nginx faqat yangilash paytida qisqa to'xtatiladi.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE="docker compose -f $ROOT/docker-compose.prod.yml"

command -v certbot >/dev/null 2>&1 || { echo "certbot o'rnatilmagan — o'tkazib yuborildi"; exit 0; }
[[ -d /etc/letsencrypt/live ]] || { echo "Let's Encrypt sertifikati yo'q — o'tkazib yuborildi"; exit 0; }

certbot renew --quiet --standalone \
  --pre-hook "$COMPOSE stop nginx" \
  --deploy-hook "cp \"\$RENEWED_LINEAGE/fullchain.pem\" $ROOT/deploy/ssl/fullchain.pem && cp \"\$RENEWED_LINEAGE/privkey.pem\" $ROOT/deploy/ssl/privkey.pem && chmod 644 $ROOT/deploy/ssl/fullchain.pem && chmod 600 $ROOT/deploy/ssl/privkey.pem" \
  --post-hook "$COMPOSE start nginx"

echo "$(date '+%F %T') SSL tekshiruvi tugadi"
