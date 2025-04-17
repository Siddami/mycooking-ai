FROM node:20

WORKDIR /app

COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

RUN npm install

COPY apps/cooking-ai-api/ ./apps/cooking-ai-api/
COPY dist/apps/cooking-ai-api/ ./dist/apps/cooking-ai-api/

EXPOSE 3001

CMD ["node", "dist/apps/cooking-ai-api/main.js"]