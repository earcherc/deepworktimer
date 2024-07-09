# Use an official Python runtime as a parent image
FROM python:3.11-alpine

# Set the working directory in the container
WORKDIR /backend

# Install dependencies and additional utilities, including Git and OpenSSH
RUN apk update && \
  apk add --no-cache gcc musl-dev libffi-dev netcat-openbsd git openssh

# Copy the dependencies file to the working directory
COPY requirements.txt .

# Install any dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container
COPY . .

# Make scripts executable
RUN chmod +x ./wait-for-db.sh
RUN chmod +x ./run.sh

# Inform Docker that the container is listening on the specified port at runtime.
EXPOSE 8000

# Run the wait script before starting the application
CMD ["./wait-for-db.sh"]