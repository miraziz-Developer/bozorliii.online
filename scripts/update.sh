#!/usr/bin/env bash
# Serverda kodni yangilab qayta ishga tushiradi (CI/CD yoki qo'lda).
#
#   bash scripts/update.sh            # origin dagi joriy branch'ning oxirgi commit'iga
#   bash scripts/update.sh <sha|ref>  # aniq commit'ga (GitHub Actions shuni ishlatadi)
#   bash scripts/update.sh <ref> backend nginx   # faqat shu servislarni qayta build qiladi
#
# Birinchi o'rnatish uchun install.sh; bu skript faqat allaqachon o'rnatilgan serverda.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

COMPOSE="docker compose -f docker-compose.prod.yml"
REF="${1:-}"
shift || true
SERVICES=("$@")

[[ -f .env ]] || { echo "FAIL: .env yo'q — avval: sudo bash install.sh" >&2; exit 1; }

echo "== Kodni yangilash"
git fetch -q origin
if [[ -n "$REF" ]]; then
  git reset --hard -q "$REF"
else
  branch="$(git rev-parse --abbrev-ref HEAD)"
  if [[ "$branch" == "HEAD" ]]; then
    echo "FAIL: detached HEAD — commit ko'rsating: bash scripts/update.sh <sha>" >&2
    exit 1
  fi
  git reset --hard -q "origin/${branch}"
fi
echo "OK   $(git log --oneline -1)"

echo "== Preflight"
bash scripts/preflight-deploy.sh .env

echo "== Build + ishga tushirish"
$COMPOSE up -d --build --wait --wait-timeout 900 "${SERVICES[@]}"

docker image prune -f >/dev/null

echo "== Tekshiruv"
if $COMPOSE exec -T backend curl -fsS http://127.0.0.1:8000/api/v1/health/live >/dev/null 2>&1; then
  echo "OK   backend sog'lom"
else
  echo "FAIL backend javob bermadi" >&2
  $COMPOSE logs --tail=40 backend >&2
  exit 1
fi
$COMPOSE ps --format 'table {{.Name}}\t{{.Status}}'
