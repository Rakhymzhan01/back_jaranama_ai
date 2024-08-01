# Use the official Node.js 18 image as a base for the build stage
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use the slim Node.js 18 image as the base for the final image
FROM node:18-slim

# Install necessary libraries for Puppetee

# Install Chromium manually
#RUN apt-get update && apt-get install -y chromium && apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the PUPPETEER_EXECUTABLE_PATH environment variable
#ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app .

# Install production dependencies
RUN npm install --only=production

# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["node", "./dist/index.js"]
