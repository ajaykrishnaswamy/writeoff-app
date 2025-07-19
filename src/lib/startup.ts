import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

interface StartupResult {
  success: boolean;
  message: string;
  error?: Error;
}

class StartupError extends Error {
  constructor(message: string, public cause?: Error) {
    super(message);
    this.name = 'StartupError';
  }
}

let prisma: PrismaClient | null = null;

function log(level: 'info' | 'warn' | 'error', message: string, error?: Error) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  if (level === 'error') {
    console.error(logMessage);
    if (error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
  } else if (level === 'warn') {
    console.warn(logMessage);
  } else {
    console.log(logMessage);
  }
}

function checkDatabaseFile(): boolean {
  try {
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './prisma/dev.db';
    const fullPath = join(process.cwd(), dbPath);
    
    log('info', `Checking database file at: ${fullPath}`);
    
    const exists = existsSync(fullPath);
    log('info', `Database file exists: ${exists}`);
    
    return exists;
  } catch (error) {
    log('error', 'Error checking database file', error as Error);
    return false;
  }
}

async function initializePrisma(): Promise<void> {
  try {
    log('info', 'Initializing Prisma client...');
    
    if (prisma) {
      log('info', 'Prisma client already initialized');
      return;
    }
    
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      errorFormat: 'pretty',
    });
    
    // Test the connection
    await prisma.$connect();
    log('info', 'Prisma client initialized successfully');
    
  } catch (error) {
    log('error', 'Failed to initialize Prisma client', error as Error);
    throw new StartupError('Failed to initialize database client', error as Error);
  }
}

async function runMigrations(): Promise<void> {
  try {
    log('info', 'Running database migrations...');
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      // In production, run migrations deploy
      log('info', 'Running production migrations...');
      execSync('npx prisma migrate deploy', {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
    } else {
      // In development, run migrations dev
      log('info', 'Running development migrations...');
      execSync('npx prisma migrate dev --name init', {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
    }
    
    log('info', 'Database migrations completed successfully');
    
  } catch (error) {
    log('error', 'Failed to run migrations', error as Error);
    throw new StartupError('Failed to run database migrations', error as Error);
  }
}

async function generatePrismaClient(): Promise<void> {
  try {
    log('info', 'Generating Prisma client...');
    
    execSync('npx prisma generate', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    
    log('info', 'Prisma client generated successfully');
    
  } catch (error) {
    log('error', 'Failed to generate Prisma client', error as Error);
    throw new StartupError('Failed to generate Prisma client', error as Error);
  }
}

async function seedDatabase(): Promise<void> {
  try {
    log('info', 'Checking if database needs seeding...');
    
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    // Check if we have any data in critical tables
    const userCount = await prisma.waitlistUser.count();
    
    if (userCount === 0) {
      log('info', 'Database appears to be empty, running seed...');
      
      // Check if seed script exists
      const seedScript = join(process.cwd(), 'prisma/seed.ts');
      if (existsSync(seedScript)) {
        execSync('npx prisma db seed', {
          stdio: 'inherit',
          cwd: process.cwd(),
        });
        log('info', 'Database seeding completed successfully');
      } else {
        log('warn', 'No seed script found, skipping seeding');
      }
    } else {
      log('info', 'Database already contains data, skipping seeding');
    }
    
  } catch (error) {
    log('warn', 'Database seeding failed or skipped', error as Error);
    // Don't throw here as seeding failure shouldn't prevent app startup
  }
}

async function verifyDatabaseConnection(): Promise<void> {
  try {
    log('info', 'Verifying database connection...');
    
    if (!prisma) {
      throw new Error('Prisma client not initialized');
    }
    
    // Test basic query
    await prisma.$queryRaw`SELECT 1`;
    
    log('info', 'Database connection verified successfully');
    
  } catch (error) {
    log('error', 'Database connection verification failed', error as Error);
    throw new StartupError('Failed to verify database connection', error as Error);
  }
}

async function cleanupOnShutdown(): Promise<void> {
  if (prisma) {
    log('info', 'Cleaning up database connections...');
    await prisma.$disconnect();
    prisma = null;
    log('info', 'Database connections cleaned up');
  }
}

export async function initializeDatabase(): Promise<StartupResult> {
  try {
    log('info', 'Starting database initialization...');
    
    // Step 1: Check if database file exists
    const dbExists = checkDatabaseFile();
    
    // Step 2: Generate Prisma client if needed
    await generatePrismaClient();
    
    // Step 3: Initialize Prisma client
    await initializePrisma();
    
    // Step 4: Run migrations
    if (!dbExists || process.env.FORCE_MIGRATION === 'true') {
      await runMigrations();
    } else {
      log('info', 'Database exists, skipping migration (set FORCE_MIGRATION=true to force)');
    }
    
    // Step 5: Verify connection
    await verifyDatabaseConnection();
    
    // Step 6: Seed database if needed
    await seedDatabase();
    
    // Step 7: Set up cleanup handlers
    process.on('SIGINT', cleanupOnShutdown);
    process.on('SIGTERM', cleanupOnShutdown);
    process.on('beforeExit', cleanupOnShutdown);
    
    log('info', 'Database initialization completed successfully');
    
    return {
      success: true,
      message: 'Database initialized successfully',
    };
    
  } catch (error) {
    log('error', 'Database initialization failed', error as Error);
    
    // Clean up on failure
    await cleanupOnShutdown();
    
    return {
      success: false,
      message: error instanceof StartupError ? error.message : 'Database initialization failed',
      error: error as Error,
    };
  }
}

export function getDatabaseClient(): PrismaClient {
  if (!prisma) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return prisma;
}

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    if (!prisma) {
      return false;
    }
    
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    log('error', 'Database health check failed', error as Error);
    return false;
  }
}

export { cleanupOnShutdown };