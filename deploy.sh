#!/bin/bash

# Pull the latest changes from Git
git pull origin master  # Replace 'main' with your branch name if different

# Rebuild and restart Docker containers
docker-compose down
docker-compose build
docker-compose up -d

# Optional: Remove unused Docker images to free up space
docker image prune -f