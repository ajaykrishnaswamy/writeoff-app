import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

let prisma: PrismaClient | null = null;

interface DatabaseInitResult {
  success: boolean;
  message: string;
  error?: Error;
}

/**
 * Initialize database connection with proper error handling
 */
export async function initializeDatabase(): Promise<DatabaseInitResult> {
  try {
    // Create database directory if it doesn't exist
    const dbDir = path.dirname(process.env.DATABASE_URL?.replace('file:', '') || './prisma/dev.db');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`Created database directory: ${dbDir}`);
    }

    // Initialize Prisma client
    if (!prisma) {
      prisma = new PrismaClient({
        log: ['error', 'warn'],
        errorFormat: 'pretty',
      });
    }

    // Test database connection
    await prisma.$connect();
    console.log('Database connection established successfully');

    // Check if database is properly initialized by testing a simple query
    const isInitialized = await checkDatabaseInitialization();
    if (!isInitialized.success) {
      return {
        success: false,
        message: 'Database schema not properly initialized',
        error: isInitialized.error
      };
    }

    return {
      success: true,
      message: 'Database initialized successfully'
    };

  } catch (error) {
    console.error('Database initialization failed:', error);
    
    // Attempt to disconnect if connection was established
    if (prisma) {
      try {
        await prisma.$disconnect();
      } catch (disconnectError) {
        console.error('Error disconnecting from database:', disconnectError);
      }
      prisma = null;
    }

    return {
      success: false,
      message: 'Failed to initialize database',
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Check if database is properly initialized with required tables
 */
export async function checkDatabaseInitialization(): Promise<DatabaseInitResult> {
  try {
    if (!prisma) {
      throw new Error('Database not connected');
    }

    // Test database connectivity with a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if main tables exist by attempting to count records
    // This will fail if tables don't exist, indicating schema issues
    const tableChecks = await Promise.allSettled([
      prisma.$queryRaw`SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`,
    ]);

    const failedChecks = tableChecks.filter(result => result.status === 'rejected');
    
    if (failedChecks.length > 0) {
      throw new Error(`Database schema validation failed: ${failedChecks.length} table checks failed`);
    }

    return {
      success: true,
      message: 'Database is properly initialized'
    };

  } catch (error) {
    console.error('Database initialization check failed:', error);
    return {
      success: false,
      message: 'Database initialization check failed',
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Get the current Prisma client instance
 */
export function getPrismaClient(): PrismaClient {
  if (!prisma) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return prisma;
}

/**
 * Safely disconnect from database
 */
export async function disconnectDatabase(): Promise<void> {
  if (prisma) {
    try {
      await prisma.$disconnect();
      console.log('Database disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    } finally {
      prisma = null;
    }
  }
}

/**
 * Reset database connection (useful for testing or recovery)
 */
export async function resetDatabaseConnection(): Promise<DatabaseInitResult> {
  await disconnectDatabase();
  return await initializeDatabase();
}

/**
 * Database health check utility
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  responsive: boolean;
  tablesExist: boolean;
  error?: string;
}> {
  try {
    if (!prisma) {
      return {
        connected: false,
        responsive: false,
        tablesExist: false,
        error: 'Database not connected'
      };
    }

    // Check basic connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    // Check if tables exist
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) as count 
      FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    ` as { count: number }[];

    return {
      connected: true,
      responsive: true,
      tablesExist: tableCount[0]?.count > 0,
    };

  } catch (error) {
    return {
      connected: false,
      responsive: false,
      tablesExist: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Run database migrations programmatically
 */
export async function runMigrations(): Promise<DatabaseInitResult> {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    console.log('Running database migrations...');
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    
    if (stderr && !stderr.includes('warnings')) {
      throw new Error(stderr);
    }

    console.log('Migrations completed successfully:', stdout);
    
    return {
      success: true,
      message: 'Database migrations completed successfully'
    };

  } catch (error) {
    console.error('Migration failed:', error);
    return {
      success: false,
      message: 'Database migration failed',
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Generate Prisma client
 */
export async function generatePrismaClient(): Promise<DatabaseInitResult> {
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    console.log('Generating Prisma client...');
    const { stdout, stderr } = await execAsync('npx prisma generate');
    
    if (stderr && !stderr.includes('warnings')) {
      throw new Error(stderr);
    }

    console.log('Prisma client generated successfully:', stdout);
    
    return {
      success: true,
      message: 'Prisma client generated successfully'
    };

  } catch (error) {
    console.error('Prisma client generation failed:', error);
    return {
      success: false,
      message: 'Prisma client generation failed',
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

/**
 * Complete database setup (generate + migrate + initialize)
 */
export async function setupDatabase(): Promise<DatabaseInitResult> {
  try {
    console.log('Starting complete database setup...');

    // Generate Prisma client
    const generateResult = await generatePrismaClient();
    if (!generateResult.success) {
      return generateResult;
    }

    // Run migrations
    const migrateResult = await runMigrations();
    if (!migrateResult.success) {
      return migrateResult;
    }

    // Initialize database connection
    const initResult = await initializeDatabase();
    if (!initResult.success) {
      return initResult;
    }

    console.log('Database setup completed successfully');
    return {
      success: true,
      message: 'Database setup completed successfully'
    };

  } catch (error) {
    console.error('Database setup failed:', error);
    return {
      success: false,
      message: 'Database setup failed',
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, closing database connection...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, closing database connection...');
  await disconnectDatabase();
  process.exit(0);
});