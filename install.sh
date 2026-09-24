#!/usr/bin/env bash
# Bozorliii — bitta buyruqli server o'rnatuvchi (Ubuntu 22.04 / 24.04).
#
#   git clone https://github.com/miraziz-Developer/bozorliii.online.git /opt/bozorliii
#   cd /opt/bozorliii
#   sudo bash install.sh          # 1-marta: .env yaratadi, kalitlarni so'raydi
#   nano .env                     # faqat majburiy kalitlarni to'ldiring
#   sudo bash install.sh          # 2-marta: hammasini o'zi qiladi
#
# Skript IDEMPOTENT — istalgan payt qayta ishga tushirsa bo'ladi (yangilash ham shu).
# Nima qiladi: paketlar → Docker → swap → .env (parollarni o'zi generatsiya qiladi) →
#              preflight → firewall → SSL → docker compose build+up → backup cron → tekshiruv.
#
# Flaglar:
#   --check         hech narsani o'zgartirmaydi: faqat .env va compose'ni tekshiradi
#   --no-ssl        SSL sertifikat bosqichini o'tkazib yuboradi
#   --no-firewall   ufw ni sozlamaydi (masalan Azure NSG ishlatsangiz)
#   --help

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"
CHECK_ONLY=0
DO_SSL=1
DO_FIREWALL=1
GENERATED_ADMIN_PASS=""

for arg in "$@"; do
  case "$arg" in
    --check) CHECK_ONLY=1 ;;
    --no-ssl) DO_SSL=0 ;;
    --no-firewall) DO_FIREWALL=0 ;;
    --help|-h) sed -n '2,19p' "${BASH_SOURCE[0]}"; exit 0 ;;
    *) echo "Noma'lum flag: $arg (--help)" >&2; exit 1 ;;
  esac
done

step() { printf '\n\033[1;34m== %s\033[0m\n' "$1"; }
ok()   { printf '  \033[32mOK\033[0m   %s\n' "$1"; }
warn() { printf '  \033[33mWARN\033[0m %s\n' "$1"; }
die()  { printf '  \033[31mFAIL\033[0m %s\n' "$1" >&2; exit 1; }

env_val() {
  grep -E "^${1}=" "$ENV_FILE" 2>/dev/null | head -1 | cut -d= -f2- | sed 's/^[[:space:]]*//;s/[[:space:]]*$//;s/^"//;s/"$//' || true
}

set_env() { # set_env KEY VALUE — mavjud qatorni almashtiradi yoki oxiriga qo'shadi
  local key="$1" val="$2"
  if grep -qE "^${key}=" "$ENV_FILE"; then
    local tmp; tmp="$(mktemp)"
    awk -v k="$key" -v v="$val" 'BEGIN{done=0} index($0, k"=")==1 && !done {print k"="v; done=1; next} {print}' "$ENV_FILE" > "$tmp"
    cat "$tmp" > "$ENV_FILE"; rm -f "$tmp"
  else
    printf '%s=%s\n' "$key" "$val" >> "$ENV_FILE"
  fi
}

is_placeholder() { [[ -z "$1" || "$1" == CHANGE_ME* ]]; }

gen_hex() { openssl rand -hex "$1"; }

# ---------------------------------------------------------------- root
if [[ "$CHECK_ONLY" -eq 0 && "$EUID" -ne 0 ]]; then
  exec sudo -E bash "$0" "$@"
fi

# ---------------------------------------------------------------- 1. paketlar
step "1/9 Tizim paketlari"
if [[ "$CHECK_ONLY" -eq 1 ]]; then
  ok "--check: paket o'rnatish o'tkazib yuborildi"
else
  export DEBIAN_FRONTEND=noninteractive
  need=()
  for pkg in ca-certificates curl gnupg git openssl dnsutils ufw cron; do
    dpkg -s "$pkg" >/dev/null 2>&1 || need+=("$pkg")
  done
  if [[ ${#need[@]} -gt 0 ]]; then
    apt-get update -qq
    apt-get install -y -qq "${need[@]}"
  fi
  ok "paketlar tayyor"
fi

# ---------------------------------------------------------------- 2. docker
step "2/9 Docker"
if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  ok "$(docker --version)"
elif [[ "$CHECK_ONLY" -eq 1 ]]; then
  die "Docker yo'q (install.sh o'rnatadi, --check'siz ishga tushiring)"
else
  bash deploy/install-docker.sh
  ok "Docker o'rnatildi"
fi

# ---------------------------------------------------------------- 3. swap
step "3/9 Swap (OOM himoyasi)"
if [[ "$CHECK_ONLY" -eq 1 ]]; then
  ok "--check: o'tkazib yuborildi"
else
  mem_kb="$(awk '/MemTotal/ {print $2}' /proc/meminfo)"
  if [[ "$(swapon --show --noheadings | wc -l)" -gt 0 ]]; then
    ok "swap allaqachon bor"
  elif [[ "$mem_kb" -lt 12000000 ]]; then
    bash deploy/setup-swap.sh 4
  else
    bash deploy/setup-swap.sh 2
  fi
fi

# ---------------------------------------------------------------- 4. .env
step "4/9 .env"
if [[ ! -f "$ENV_FILE" ]]; then
  [[ "$CHECK_ONLY" -eq 1 ]] && die ".env yo'q — avval 'sudo bash install.sh' ni ishga tushiring"
  cp .env.production.example "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  ok ".env .env.production.example dan yaratildi"
fi

if [[ "$CHECK_ONLY" -eq 0 ]]; then
  chmod 600 "$ENV_FILE"
  db_pass="$(env_val POSTGRES_PASSWORD)"
  if is_placeholder "$db_pass"; then
    db_pass="$(gen_hex 16)"
    set_env POSTGRES_PASSWORD "$db_pass"
    ok "POSTGRES_PASSWORD generatsiya qilindi"
    regen_db_url=1
  fi
  # DATABASE_URL: yangi parol yoki placeholder bo'lsa POSTGRES_* dan yig'iladi (mavjud sozlamaga tegmaydi)
  if [[ "${regen_db_url:-0}" -eq 1 ]] || is_placeholder "$(env_val DATABASE_URL)" || [[ "$(env_val DATABASE_URL)" == *CHANGE_ME* ]]; then
    set_env DATABASE_URL "postgresql://$(env_val POSTGRES_USER):${db_pass}@postgres:5432/$(env_val POSTGRES_DB)"
  fi

  for spec in "JWT_SECRET:32" "ADMIN_API_KEY:24" "ADMIN_PANEL_SECRET:32" "ADMIN_SESSION_SECRET:32"; do
    key="${spec%%:*}"; len="${spec##*:}"
    if is_placeholder "$(env_val "$key")"; then
      set_env "$key" "$(gen_hex "$len")"
      ok "$key generatsiya qilindi"
    fi
  done
  if is_placeholder "$(env_val ADMIN_PANEL_PASSWORD)"; then
    GENERATED_ADMIN_PASS="$(gen_hex 10)"
    set_env ADMIN_PANEL_PASSWORD "$GENERATED_ADMIN_PASS"
    ok "ADMIN_PANEL_PASSWORD generatsiya qilindi"
  fi
fi

# ---------------------------------------------------------------- 5. preflight
step "5/9 Preflight (.env tekshiruvi)"
if ! bash scripts/preflight-deploy.sh "$ENV_FILE"; then
  cat <<EOF

  .env da majburiy kalitlar yetishmayapti. Ularni to'ldiring:
      nano $ROOT/$ENV_FILE
  Majburiy:  TELEGRAM_BOT_TOKEN
             GROQ_API_KEY  (yoki AZURE_OPENAI_API_KEY + AZURE_OPENAI_ENDPOINT)
             GOOGLE_API_KEY (yoki OPENAI_API_KEY)  — katalog embedding uchun
  Keyin qayta:  sudo bash install.sh
EOF
  [[ -n "$GENERATED_ADMIN_PASS" ]] && echo "  (Admin paroli .env da saqlangan: ADMIN_PANEL_PASSWORD)"
  exit 2
fi

step "   Compose konfiguratsiyasi"
docker compose -f "$COMPOSE_FILE" config --quiet && ok "$COMPOSE_FILE to'g'ri"

if [[ "$CHECK_ONLY" -eq 1 ]]; then
  printf '\n\033[1;32m--check muvaffaqiyatli: hammasi tayyor. Ishga tushirish: sudo bash install.sh\033[0m\n'
  exit 0
fi

# ---------------------------------------------------------------- 6. firewall
step "6/9 Firewall"
if [[ "$DO_FIREWALL" -eq 0 ]]; then
  ok "o'tkazib yuborildi (--no-firewall)"
elif command -v ufw >/dev/null 2>&1; then
  ufw allow 22/tcp >/dev/null
  ufw allow 80/tcp >/dev/null
  ufw allow 443/tcp >/dev/null
  ufw status | grep -q "Status: active" || ufw --force enable >/dev/null
  ok "ufw: 22, 80, 443 ochiq"
else
  warn "ufw yo'q — firewall sozlanmadi"
fi

# ---------------------------------------------------------------- 7. SSL
step "7/9 SSL sertifikat"
mkdir -p "$ROOT/.logs"
if [[ -s deploy/ssl/fullchain.pem && -s deploy/ssl/privkey.pem && ! -f deploy/ssl/.selfsigned ]]; then
  ok "deploy/ssl/ da sertifikat bor"
elif [[ "$DO_SSL" -eq 0 ]]; then
  if [[ ! -s deploy/ssl/fullchain.pem ]]; then
    bash deploy/bootstrap-selfsigned-ssl.sh
    touch deploy/ssl/.selfsigned
  fi
  warn "--no-ssl: vaqtinchalik self-signed sertifikat (brauzer ogohlantiradi)"
elif bash deploy/bootstrap-ssl.sh; then
  rm -f deploy/ssl/.selfsigned
  ok "Let's Encrypt sertifikati olindi"
else
  if [[ ! -s deploy/ssl/fullchain.pem ]]; then
    bash deploy/bootstrap-selfsigned-ssl.sh
    touch deploy/ssl/.selfsigned
  fi
  warn "DNS hali tayyor emas — vaqtinchalik self-signed sertifikat."
  warn "DNS A yozuvlarini shu server IP'ga yo'naltirib qayta ishga tushiring: sudo bash install.sh"
fi
if [[ -d /etc/letsencrypt/live ]] && ! crontab -l 2>/dev/null | grep -q "renew-ssl.sh"; then
  ( crontab -l 2>/dev/null; echo "17 4 * * 1 $ROOT/deploy/renew-ssl.sh >> $ROOT/.logs/renew-ssl.log 2>&1" ) | crontab -
  ok "SSL avto-yangilanish cron (har dushanba 04:17)"
fi

# ---------------------------------------------------------------- 8. build + up
step "8/9 Docker build + ishga tushirish (bir necha daqiqa)"
docker compose -f "$COMPOSE_FILE" up -d --build --wait --wait-timeout 900
docker compose -f "$COMPOSE_FILE" ps --format 'table {{.Name}}\t{{.Status}}'

# ---------------------------------------------------------------- 9. backup cron + tekshiruv
step "9/9 Backup cron va yakuniy tekshiruv"
mkdir -p "$ROOT/backups"
if [[ "$ROOT" == "/opt/bozorliii" ]]; then
  if ! crontab -l 2>/dev/null | grep -q "stage-backup.sh"; then
    ( crontab -l 2>/dev/null; echo "20 */6 * * * $ROOT/scripts/backup/stage-backup.sh >> $ROOT/.logs/stage-backup.log 2>&1" ) | crontab -
    ok "har 6 soatda DB backup cron o'rnatildi"
  else
    ok "backup cron allaqachon bor"
  fi
else
  warn "backup skripti /opt/bozorliii yo'lini kutadi — loyiha $ROOT da, cron o'rnatilmadi"
fi

if docker compose -f "$COMPOSE_FILE" exec -T backend curl -fsS http://127.0.0.1:8000/api/v1/health/live >/dev/null 2>&1; then
  ok "backend sog'lom"
else
  warn "backend health javob bermadi: docker compose -f $COMPOSE_FILE logs --tail=50 backend"
fi
site_domain="$(env_val SITE_DOMAIN)"; site_domain="${site_domain:-bozorliii.online}"
code="$(curl -ks -o /dev/null -w '%{http_code}' --max-time 10 --resolve "${site_domain}:443:127.0.0.1" "https://${site_domain}/" || true)"
if [[ "$code" == "200" ]]; then ok "https://${site_domain}/ → 200 (nginx + frontend)"; else warn "https://${site_domain}/ → ${code:-yoq}"; fi

cat <<EOF

$(printf '\033[1;32m')Tayyor.$(printf '\033[0m')
  Do'kon     https://$(env_val SITE_DOMAIN)
  CRM        https://$(env_val CRM_DOMAIN)
  API        https://$(env_val API_DOMAIN)/api/v1/health/live
  Loglar     docker compose -f $COMPOSE_FILE logs -f --tail=100
  Yangilash  git pull && sudo bash install.sh    (yoki: bash scripts/update.sh)
EOF
if [[ -n "$GENERATED_ADMIN_PASS" ]]; then
  cat <<EOF

  Admin panel: login=$(env_val ADMIN_PANEL_USERNAME)  parol=$GENERATED_ADMIN_PASS
  (bir marta ko'rsatiladi; .env ichida ham saqlangan: ADMIN_PANEL_PASSWORD)
EOF
fi
if [[ -f deploy/ssl/.selfsigned ]]; then
  echo
  warn "Sertifikat hali self-signed. DNS ni server IP'ga yo'naltirib qayta ishga tushiring."
fi
