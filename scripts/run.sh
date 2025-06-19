#!/usr/bin/env bash

set -e

cleanup() {
    docker compose -f  docker-compose.dev.yml down
    trap '' EXIT INT TERM
    exit $err
}

trap cleanup SIGINT EXIT

COMPOSE_HTTP_TIMEOUT=60 docker compose -f docker-compose.dev.yml up -d --force-recreate

npm run dev-server