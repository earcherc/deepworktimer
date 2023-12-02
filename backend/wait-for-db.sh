#!/bin/sh
set -e

echo "Waiting for Database connection"

# Loop until the database is available
while ! nc -z db 5433; do
    sleep 1
done

echo "Database is up - executing command"

# Execute the remaining command
exec "./run.sh"
