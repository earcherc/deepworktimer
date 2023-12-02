# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /backend

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container
COPY . .

# Install additional utilities
RUN apt-get update && \
  apt-get install -y --no-install-recommends netcat-openbsd && \
  rm -rf /var/lib/apt/lists/*

# Make scripts executable
RUN chmod +x ./wait-for-db.sh
RUN chmod +x ./run.sh

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 8000

# Run the wait script before starting the application
CMD ["./wait-for-db.sh"]