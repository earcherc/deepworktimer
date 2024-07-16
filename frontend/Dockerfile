# Use the official Node.js 18 image, Alpine version.
FROM node:20-alpine

# Install Git and OpenSSH
RUN apk add --no-cache git openssh

# Create and change to the app directory.
WORKDIR /app/frontend

# Copy package.json and package-lock.json, and install dependencies.
COPY package*.json ./

RUN npm install --frozen-lockfile

# Copy the rest of the files
COPY . .
COPY .env .env.local

# Expose the port the app runs on.
EXPOSE 3000

CMD if [ "$NODE_ENV" = "production" ]; then \
  npm run build && npm start; \
  else \
  npm run dev; \
  fi