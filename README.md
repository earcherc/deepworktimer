# Deep Work Companion App

## Introduction

[Planning Doc](https://docs.google.com/document/d/1zfZVOmlV_5TOfJoYeOAtwDp23rfpGEp4Doelewh11Kg/edit?usp=sharing)

The Deep Work Companion App is designed to help users achieve optimal deep work routines. This app integrates features like metrics tracking, friend connectivity, and Pomodoro timers to enhance productivity and focus. Whether you're a professional looking to maximize efficiency or a student aiming to improve study habits, this app provides the tools necessary to establish and maintain a powerful deep work routine.

## Tech Stack

### Frontend

- **Next.js**: Utilized within a development Docker container for a consistent development environment and seamless SSR/SSG capabilities.
- **Jotai**: For efficient and straightforward state management.
- **React Hook Form**: To manage form states with minimal re-rendering.
- **URQL**: For handling GraphQL data fetching and caching.
- **TailwindCSS**: For a utility-first approach to styling.
- **GraphQL**: Used as the querying language to communicate with the backend.

### Backend

- **GraphQL**: Serves as the main API endpoint for front-end data querying.
- **FastAPI**: Running inside a development Docker container, providing a high-performance, easy-to-use framework for APIs.
- **Redis**: Used for caching and session management.
- **Session-Based Authentication**: To securely manage user sessions.
- **SQLModel (SQLAlchemy Abstraction)**: Simplifies interactions with the Postgres database.
- **Postgres**: The primary database for storing application data.
- **S3**: Amazon file storage service.

## Features

- **Pomodoro Timer**: A customizable Pomodoro timer to help users focus and take regular breaks.
- **Metrics Tracking**: Insights into productivity patterns and focus sessions.
- **Friend Connectivity**: Connect with friends, share progress, and stay motivated.
- **Customizable Routines**: Tailor your deep work routine to fit your personal preferences and schedule.

<br>
<br>

# Useful Docker Commands

## Basic Docker Commands
- `docker ps`: List all running containers.
- `docker logs -f <container_id>`: Follow the log output of a container.
- `docker exec -it <container_id> /bin/bash`: Execute an interactive bash shell on the container.
- `docker exec -it <container_id> env`: Print environment variables of the container.
- `docker image ls`: List all Docker images.
- `docker image prune`: Remove unused images.
- `docker image prune -a`: Remove all unused images (including dangling images).
- `docker volume ls`: List all volumes.
- `docker volume rm <volume_name>`: Remove a specific volume.

## Docker Compose Commands
- `docker-compose up`: Create and start containers as per the docker-compose.yml.
- `docker-compose down`: Stop and remove containers and networks created by 'up'.
- `docker-compose restart <service_name>`: Restart a specific service.
- `docker-compose build <service_name>`: Build or rebuild a specific service.
- `docker-compose up -d --no-deps --force-recreate <service_name>`: Recreate a specific service without affecting others.
- `docker-compose logs <service_name>`: View output from services.

## Database and Migration Related (For Backend Services)
- `docker exec -it <postgres_db_container_id> psql -U <username> -d <db_name>`: Access PostgreSQL database.
- `docker exec -it <container_id> alembic revision --autogenerate -m "Migration message goes here"`: Create a new Alembic migration.
- `docker exec -it <container_id> alembic upgrade head`: Apply the latest Alembic migration.
- `docker exec -it <container_id> alembic downgrade -1`: Revert the last Alembic migration.

## Installing Tools in Containers
- `docker exec -it <container_id> apt-get update && apt-get install curl`: Install curl in a container (for Debian-based images).