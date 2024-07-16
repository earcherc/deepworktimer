#!/bin/sh
set -e

# Run alembic migrations
alembic upgrade head

# Start the application
if [ "$APP_ENV" = "production" ]; then
    uvicorn app.main:app --host 0.0.0.0 --port 8000
else
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
fi