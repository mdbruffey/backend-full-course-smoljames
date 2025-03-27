# Use an official node.js runtime  as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and the package-lock.json files to the container
COPY *.json .
COPY prisma .
COPY public .
COPY src .

# Install the dependencies
RUN npm install

# Copy the rest of the application code

# Expose the port the app runs on
EXPOSE 4001