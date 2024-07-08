
# Development Setup Guide

## Introduction

Welcome to the Deep Work Companion App project! This guide will help you set up the development environment from scratch so you can start contributing to the project.

## Prerequisites

Ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [Direnv](https://direnv.net/docs/installation.html)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Tmux](https://github.com/tmux/tmux/wiki)
- [Tmuxinator](https://github.com/tmuxinator/tmuxinator)

### Using Homebrew on macOS

If you use macOS, you can install the prerequisites with the following commands:
```sh
brew install docker-compose git direnv tmux tmuxinator
```

## Cloning the Repository

1. Clone the repository to your local machine, in an appropriate directory:
   ```sh
   git clone https://github.com/earcherc/deep-work.git
   cd deep-work
   ```

## Environment Variables

1. In the ROOT of the project, copy and rename `.env.example`:
   ```sh
   cp .env.example .env
   ```

   Edit the `.env` file and set the values for your environment.
   
  And lastly, `cd frontend`:
  ```sh
   cp .env.example .env.local
   ```


Next you need to install backend dependencies 
pip install requirements.txt


## Setting Up the Development Environment

3. Run the following commands to set up and start the development environment:

   - **Rebuild and Start Containers**:
     ```sh
     docker-compose up --build
     ```

## Initializing the Database

4. If you have a database initialization script (e.g., `init-db.sh`), ensure it contains the necessary commands to set up your database schema and initial data. This script will run automatically when the Postgres container starts.

## Accessing the Application

5. Once the setup is complete, you can access the different parts of the application:
   - **Frontend**: Open your browser and navigate to `http://localhost:3000`
   - **Backend**: Access the API at `http://localhost:8000`
   - **Nginx**: The reverse proxy should be accessible at `http://localhost:80`

## Useful Docker Commands

Here are some useful Docker commands you might need during development:

- **Basic Docker Commands**:
  ```sh
  docker ps: List all running containers.
  docker logs -f <container_id>: Follow the log output of a container.
  docker exec -it <container_id> /bin/bash: Execute an interactive bash shell on the container.
  docker exec -it <container_id> env: Print environment variables of the container.
  docker image ls: List all Docker images.
  docker image prune: Remove unused images.
  docker image prune -a: Remove all unused images (including dangling images).
  docker volume ls: List all volumes.
  docker volume rm <volume_name>: Remove a specific volume.
  ```

- **Docker Compose Commands**:
  ```sh
  docker-compose up: Create and start containers as per the docker-compose.yml.
  docker-compose down: Stop and remove containers and networks created by 'up'.
  docker-compose restart <service_name>: Restart a specific service.
  docker-compose build <service_name>: Build or rebuild a specific service.
  docker-compose up -d --no-deps --force-recreate <service_name>: Recreate a specific service without affecting others.
  docker-compose logs <service_name>: View output from services.
  ```

- **Database and Migration Related (For Backend Services)**:
  ```sh
  docker exec -it <postgres_db_container_id> psql -U <username> -d <db_name>: Access PostgreSQL database.
  docker exec -it <container_id> alembic revision --autogenerate -m "Migration message goes here": Create a new Alembic migration.
  docker exec -it <container_id> alembic upgrade head: Apply the latest Alembic migration.
  docker exec -it <container_id> alembic downgrade -1: Revert the last Alembic migration.
  ```

- **Installing Tools in Containers**:
  ```sh
  docker exec -it <container_id> apt-get update && apt-get install curl: Install curl in a container (for Debian-based images).
  ```

## Conclusion

That's it! You should now have a fully functioning development environment for the Deep Work Companion App. If you encounter any issues, feel free to reach out to the project maintainers or check the project's documentation for more details.
