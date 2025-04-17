FROM node:20

WORKDIR /app

# Copy root-level config files and package.json
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm install

# Copy the entire source code (including apps/)
COPY apps/ ./apps/

# Build the API
RUN npm run build:api

# Expose the port
EXPOSE 3001

# Run the compiled API
CMD ["node", "dist/apps/cooking-ai-api/main.js"]