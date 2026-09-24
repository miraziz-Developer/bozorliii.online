# Bozorliii — disaster recovery

Production runs on a single low-trust cloud VM (migrated off the old 2-droplet
DigitalOcean split onto one Azure VM in 2026-09). If it disappears, everything
needed to stand the platform back up is in two places:

| What | Where |
|---|---|
| Code | this GitHub repo (`main`) |
| DB dump, uploaded media, server `.env` | the founder's Mac: `~/Backups/bozorliii/` |

`~/Backups/bozorliii/latest/` always points at the newest verified snapshot:

```
latest/
├── db.sql.gz        # pg_dump of the production database
├── uploads.tar.gz   # contents of the bozorliii_bozor_uploads volume
└── server.env       # production /opt/bozorliii/.env  (secrets!)
```

`~/Backups/bozorliii/server-stage/` holds the last ~4 days of 6-hourly dumps
pulled from the server (`db-<ts>.sql.gz`, `uploads-<ts>.tar.gz`).

---

## Backup schedule

- **Server**, every 6h (`bozorliii` user cron): `scripts/backup/stage-backup.sh`
  → dumps into `/opt/bozorliii/backups/`, keeps 4 days.
- **Mac**, every 6h (launchd `uz.bozorliii.backup.plist` → `~/Backups/bozorliii/backup.sh`,
  a copy of `scripts/backup/local-pull.sh`)
  → rsyncs the server's staging dir down (catch-up) + takes its own verified
    snapshot + pulls `.env`. macOS notification on failure.

Check health:

```bash
tail -20 ~/Backups/bozorliii/.logs/backup.log
ls -la ~/Backups/bozorliii/latest/
```

---

## Restore onto a fresh server

Assume a new Ubuntu 24.04 VM, single-server layout (`docker-compose.prod.yml`).

```bash
# 0. on the Mac — copy the artefacts up
scp ~/Backups/bozorliii/latest/db.sql.gz \
    ~/Backups/bozorliii/latest/uploads.tar.gz \
    ~/Backups/bozorliii/latest/server.env \
    bozorliii@<NEW_SERVER_IP>:/home/bozorliii/

# 1. on the new server — install Docker, clone, restore .env
curl -fsSL https://get.docker.com | sh
git clone https://github.com/miraziz-Developer/bozorliii.online.git /opt/bozorliii
cd /opt/bozorliii
cp ~/server.env .env

# 2. bring up just the database first
docker compose -f docker-compose.prod.yml up -d postgres redis
sleep 10

# 3. restore the database
DB_USER=$(grep -E '^POSTGRES_USER=' .env | head -1 | cut -d= -f2-)
DB_NAME=$(grep -E '^POSTGRES_DB=' .env | head -1 | cut -d= -f2-)
gunzip -c ~/db.sql.gz | docker exec -i bozorliii-postgres-1 psql -U "$DB_USER" -d "$DB_NAME"

# 4. restore uploaded media into the named volume
docker run --rm -v bozorliii_bozor_uploads:/data -v /home/bozorliii:/backup alpine \
  sh -c 'cd /data && tar xzf /backup/uploads.tar.gz'

# 5. bring up the rest (nginx, frontend, merchant-crm, platform-admin, bots, celery)
bash scripts/preflight-deploy.sh .env
docker compose -f docker-compose.prod.yml up -d --build --wait --wait-timeout 900
curl -s localhost/api/v1/health -H "Host: bozorliii.online" -k

# 6. repoint DNS (bozorliii.online / api / crm / admin) at the new IP
```

Always use `docker-compose.prod.yml` (the only compose file for production; the old
2-droplet split files were removed).

### Re-arm the backups on the new server

`sudo bash install.sh` installs this cron automatically (only when the repo lives in
`/opt/bozorliii`). To add it by hand:

```bash
mkdir -p /opt/bozorliii/.logs
( crontab -l 2>/dev/null; \
  echo '20 */6 * * * /opt/bozorliii/scripts/backup/stage-backup.sh >> /opt/bozorliii/.logs/stage-backup.log 2>&1' \
) | crontab -
```

Add the Mac's backup public key (`~/.ssh/bozorliii_backup_key.pub`) to the new
server's `/home/bozorliii/.ssh/authorized_keys`, then update `HOST` in
`~/Backups/bozorliii/backup.sh` on the Mac.

---

## Restore a single 6-hourly dump (point-in-time)

```bash
ls ~/Backups/bozorliii/server-stage/          # pick a db-<ts>.sql.gz
gunzip -c ~/Backups/bozorliii/server-stage/db-<ts>.sql.gz \
  | docker exec -i bozorliii-postgres-1 psql -U <user> -d <db>
```
