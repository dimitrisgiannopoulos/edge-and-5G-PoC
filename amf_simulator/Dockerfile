# Use a lightweight Node.js base image
FROM node:lts-alpine

# Set working directory inside the container
WORKDIR /app

# Copy backend files
COPY backend.js .

# Copy frontend file and rename it to index.html
COPY frontend.html ./index.html

# Install only production dependencies for express
RUN npm install express --production

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start the backend server
CMD ["node", "backend.js"]
