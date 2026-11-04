#!/bin/sh
# Prepares the database and starts the app:
#   1. apply pending migrations (retrying while the database is not reachable yet)
#   2. run the idempotent seed (disable with SEED_ON_START=false)
#   3. exec the main process so it receives signals directly
set -eu

MAX_ATTEMPTS="${DB_WAIT_ATTEMPTS:-30}"
attempt=1

until npx --no-install prisma migrate deploy; do
  if [ "$attempt" -ge "$MAX_ATTEMPTS" ]; then
    echo "Database is not reachable after $attempt attempts, giving up" >&2
    exit 1
  fi
  echo "Migration attempt $attempt failed, retrying in 2s..." >&2
  attempt=$((attempt + 1))
  sleep 2
done

if [ "${SEED_ON_START:-true}" = "true" ]; then
  node dist/seed/seed.js
fi

exec "$@"
