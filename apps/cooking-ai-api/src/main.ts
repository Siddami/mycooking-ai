import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import * as net from 'net';

// Try multiple possible locations for the .env file
const possiblePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '.env'),
  path.resolve(__dirname, '..', '.env'),
  path.resolve(__dirname, '..', '..', '.env'),
  path.resolve(__dirname, '..', '..', '..', '.env'),
  path.resolve(__dirname, '..', '..', '..', '..', '.env'),
  path.resolve(process.cwd(), 'apps', 'cooking-ai-api', '.env'),
];

let envFilePath = null;
for (const filePath of possiblePaths) {
  if (fs.existsSync(filePath)) {
    envFilePath = filePath;
    console.log(`Found .env file at: ${filePath}`);
    break;
  }
}

if (envFilePath) {
  const result = dotenv.config({ path: envFilePath });
  if (result.error) {
    console.error(`Error loading .env file: ${result.error.message}`);
  } else {
    console.log('Successfully loaded .env file');
  }
} else {
  console.warn('No .env file found in any of the possible locations');
}

console.log('GEMINI_API_KEY is', process.env.GEMINI_API_KEY ? 'set' : 'not set');

async function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, '0.0.0.0');
    server.on('listening', () => {
      const address = server.address();
      if (address && typeof address === 'object') {
        const port = address.port;
        server.close(() => {
          console.log(`Port ${port} is available`);
          resolve(port);
        });
      }
    });
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${startPort} is in use, trying ${startPort + 1}`);
        server.close(() => {
          findAvailablePort(startPort + 1).then(resolve).catch(reject);
        });
      } else {
        reject(err);
      }
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: '*', // Allow all origins for now (temporary for debugging)
    methods: 'GET,POST,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
    maxAge: 86400,
  });

  const port = await findAvailablePort(3001);
  await app.listen(port, '0.0.0.0');
  console.log(`API is listening on port ${port}`);
}

bootstrap();
