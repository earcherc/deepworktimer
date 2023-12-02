#!/bin/bash
set -e

# This script is run when the PostgreSQL container is started to initialize the database.

# Note: Ensure that the POSTGRES_USER and DATABASE_NAME environment variables are set.

# Check if the database already exists
db_exists=$(psql -U "$POSTGRES_USER" -tAc "SELECT 1 FROM pg_database WHERE datname='$DATABASE_NAME'")

# If the database doesn't exist, create it
if [ -z "$db_exists" ]; then
    echo "Creating database: $DATABASE_NAME"
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
        CREATE DATABASE "$DATABASE_NAME";
EOSQL
else
    echo "Database $DATABASE_NAME already exists"
fi
