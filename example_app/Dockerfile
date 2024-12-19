# Use a lightweight Node.js base image
FROM node:lts-alpine

# Set working directory inside the container
WORKDIR /app

# Copy backend files
COPY backend.js .

# Copy frontend file into a "public" directory for express to serve
RUN mkdir public
COPY frontend.html ./public/index.html

# Install necessary dependencies
COPY package*.json ./
RUN npm install --production

# Expose the WebSocket and HTTP port
EXPOSE 80

# Start the server
CMD ["node", "backend.js"]
