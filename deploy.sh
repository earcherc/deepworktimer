#!/bin/bash

git pull origin master

export NEXT_PUBLIC_COMMIT_HASH=$(git rev-parse HEAD)

docker compose down
docker compose build
docker compose up -d

docker image prune -f