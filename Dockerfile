# Use the official Node.js image from the Docker Hub
FROM node:22-alpine

# Create and set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./ 

# Install the dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the application for production
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application in production mode
CMD ["node", "dist/main"]
