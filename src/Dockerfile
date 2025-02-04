FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production

# Command to run the application
CMD ["node", "dist/server.js"]
