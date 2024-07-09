
# Development Setup Guide

## Introduction

Welcome! This guide will help you set up the development environment from scratch so you can start contributing to the project.

Please document your setup process so we can update/maintain this setup guide.
Each user setup is valuable.

## Local development prerequisites

Ensure you have the following installed on your system:
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)
- [Direnv](https://direnv.net/docs/installation.html)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Tmux](https://github.com/tmux/tmux/wiki)
- [Tmuxinator](https://github.com/tmuxinator/tmuxinator)

### Using a package manager

If you use macOS, you can install the prerequisites with the following commands:
```sh
brew install docker-compose git direnv tmux tmuxinator
```

For Windows, consider using [Chocolatey](https://chocolatey.org/) to install the prerequisites:
```sh
choco install docker-desktop git direnv vscode tmux tmuxinator
```

## Cloning the Repository

1. Clone the repository to your local machine to an appropriate directory:
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
   
2. Change directory to /frontend:
   ```sh
   cd frontend
   cp .env.example .env.local
   ```

## VSCode Dev Containers

Now, I've set this project to work with Vscode Dev Containers.

VSCode Dev Containers allow you to run your development environment within a Docker container, ensuring consistency across different setups. For more information, refer to the [Dev Containers documentation](https://code.visualstudio.com/docs/remote/containers).

There may be some issues with getting git working properly. You will most likely need to change the `devcontainer.json` mounting paths so that Docker has access to your ssh keys. 

Replace the mounts list with this if running Windows:
```json
"mounts": [
    "source=${localEnv:HOME}/.ssh,target=/home/vscode/.ssh,type=bind,consistency=cached",
]
```

This [Stack Overflow post](https://stackoverflow.com/questions/73676584/sharing-ssh-credentials-with-dev-container-in-vscode) provides solutions to this problem.

## Local Development without Dev Containers

If you prefer to set up your development environment locally without using Dev Containers, follow these steps:

1. **Backend Setup**:
    - Ensure you have Python 3.11 installed.
    - Navigate to the backend directory:
      ```sh
      cd backend
      ```
    - Create and activate a virtual environment:
      ```sh
      python3 -m venv venv
      source venv/bin/activate
      ```
    - Install the dependencies:
      ```sh
      pip install -r requirements.txt
      ```

2. **Frontend Setup**:
    - Ensure you have Node.js installed.
    - Navigate to the frontend directory:
      ```sh
      cd frontend
      ```
    - Install the dependencies:
      ```sh
      npm install
      ```
    - Run the frontend development server:
      ```sh
      npm run dev
      ```

## Pushing Commits and Pushing to the Repository

1. **Committing Changes**:
   - Stage your changes:
     ```sh
     git add .
     ```
   - Commit your changes with a meaningful message:
     ```sh
     git commit -m "Your commit message"
     ```

2. **Pushing Changes**:
   - Push your changes to the repository:
     ```sh
     git push origin master
     ```

   If you encounter issues with SSH keys, make sure your SSH agent is running and has the necessary keys added:
   ```sh
   eval $(ssh-agent -s)
   ssh-add ~/.ssh/your_private_key
   ```

## Accessing the Application

Once the setup is complete, you can access the different parts of the application:
- **Frontend**: Open your browser and navigate to `http://localhost`
- **Backend**: Access the API at `http://localhost/api`
- **Nginx**: The reverse proxy should be accessible at `http://localhost:80`

## Production Server

For production, you can access the server at the following IP:
```sh
ssh user@172.233.155.46
```

Ensure you have the necessary SSH keys configured to access the server.

---

Feel free to reach out if you have any questions or encounter any issues during the setup process. Happy coding!
