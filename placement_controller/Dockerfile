# Base image
FROM node:lts-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Default environment variables
ENV TOWER_LABEL_MAPPING='{"Frankfurt (AWS Cell)": "AWS", "Patras (UoP Cell)": "UoP-1"}'

# Run the app
CMD ["node", "placement_controller.js"]
