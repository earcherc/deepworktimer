# Use the official Node.js 18 image.
# Alpine for production
FROM node:18

# Create and change to the app directory.
WORKDIR /app

# Copy package.json and package-lock.json, and install dependencies.
COPY package*.json ./

RUN npm install --frozen-lockfile

# Copy the rest of the files
COPY . .

# Expose the port the app runs on.
EXPOSE 3000

# Start the development server using the `dev` script from your package.json.
CMD ["npm", "run", "dev"]