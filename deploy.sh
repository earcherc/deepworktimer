#!/bin/bash

git pull origin master

export NEXT_PUBLIC_COMMIT_HASH=$(git rev-parse HEAD)

docker compose down

docker container prune -f
docker network prune -f
docker image prune -f

docker compose build --pull
docker compose up -d
docker volume prune -f
docker builder prune -f --filter until=24h
docker image prune -a --force --filter "until=24h"