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

# Install necessary libraries for Puppeteer and Chromium
RUN apt-get update && apt-get install -y wget gnupg && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list && \
    apt-get update && apt-get install -y google-chrome-stable --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Set the PUPPETEER_EXECUTABLE_PATH environment variable
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

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
