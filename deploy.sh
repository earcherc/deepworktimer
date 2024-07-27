#!/bin/bash
git pull origin master
export NEXT_PUBLIC_COMMIT_HASH=$(git rev-parse HEAD)

docker compose down

docker system prune --force

docker image prune --all --force --filter "until=24h"
docker builder prune --all --force --filter "until=24h"

docker volume ls -q | grep -v "deepworktimer_db_data\|deepworktimer_redis_data" | xargs -r docker volume rm

docker compose build --pull
docker compose up -d

docker system df