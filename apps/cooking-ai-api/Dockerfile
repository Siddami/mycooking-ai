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

# Clear Nx cache and build thFROM node:20

WORKDIR /app

# Copy root-level config files and package.json
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm install

# Copy the entire source code (including apps/)
COPY apps/ ./apps/

# Clear Nx cache and build the API with verbose output and no cache
RUN npx nx reset && npm run build:api -- --verbose --skip-nx-cache

# Expose the port
EXPOSE 3001

# Run the compiled API
CMD ["node", "dist/apps/cooking-ai-api/main.js"]e API with verbose output and no cache
RUN npx nx reset && npm run build:api -- --verbose --skip-nx-cache

# Expose the port
EXPOSE 3001

# Run the compiled API
CMD ["node", "dist/apps/cooking-ai-api/main.js"]