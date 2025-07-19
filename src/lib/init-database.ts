import { PrismaClient } from '@prisma/client';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';

interface DatabaseInitStatus {
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
}

class DatabaseInitializer {
  private static instance: DatabaseInitializer;
  private status: DatabaseInitStatus = {
    isInitialized: false,
    isInitializing: false,
    error: null
  };
  private prisma: PrismaClient | null = null;

  private constructor() {}

  static getInstance(): DatabaseInitializer {
    if (!DatabaseInitializer.instance) {
      DatabaseInitializer.instance = new DatabaseInitializer();
    }
    return DatabaseInitializer.instance;
  }

  private async ensureDataDirectory(): Promise<void> {
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
      console.log('Created data directory');
    }
  }

  private async checkDatabaseExists(): Promise<boolean> {
    try {
      if (!this.prisma) {
        await this.ensureDataDirectory();
        this.prisma = new PrismaClient({
          log: ['error'],
        });
      }
      
      // Try to execute a simple query to check if database is accessible
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.log('Database check failed, needs initialization:', error);
      return false;
    }
  }

  private async createDatabase(): Promise<void> {
    try {
      console.log('Creating database...');
      
      // Ensure data directory exists
      await this.ensureDataDirectory();

      // Initialize prisma client
      if (!this.prisma) {
        this.prisma = new PrismaClient({
          log: ['error'],
        });
      }

      // Create the tables manually using raw SQL
      await this.prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "waitlist_users" (
          "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
          "email" TEXT NOT NULL UNIQUE,
          "name" TEXT NOT NULL,
          "phone" TEXT,
          "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await this.prisma.$executeRaw`
        CREATE UNIQUE INDEX IF NOT EXISTS "waitlist_users_email_key" ON "waitlist_users"("email");
      `;

      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "waitlist_users_email_idx" ON "waitlist_users"("email");
      `;

      await this.prisma.$executeRaw`
        CREATE INDEX IF NOT EXISTS "waitlist_users_createdAt_idx" ON "waitlist_users"("createdAt");
      `;

      console.log('Database created successfully');

    } catch (error) {
      console.error('Database creation failed:', error);
      throw error;
    }
  }

  private async initializeDatabase(): Promise<void> {
    if (this.status.isInitialized || this.status.isInitializing) {
      return;
    }

    this.status.isInitializing = true;
    this.status.error = null;

    try {
      const exists = await this.checkDatabaseExists();
      
      if (!exists) {
        await this.createDatabase();
      }

      // Verify database is working after initialization
      const isWorking = await this.checkDatabaseExists();
      if (!isWorking) {
        throw new Error('Database verification failed after initialization');
      }

      this.status.isInitialized = true;
      this.status.isInitializing = false;
      
      console.log('Database is ready');
      
    } catch (error) {
      this.status.error = error instanceof Error ? error.message : 'Unknown database initialization error';
      this.status.isInitializing = false;
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  async ensureDatabaseReady(): Promise<void> {
    if (this.status.isInitialized) {
      return;
    }

    if (this.status.isInitializing) {
      // Wait for ongoing initialization
      while (this.status.isInitializing) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      if (this.status.error) {
        throw new Error(this.status.error);
      }
      
      return;
    }

    await this.initializeDatabase();
  }

  getStatus(): DatabaseInitStatus {
    return { ...this.status };
  }

  async disconnect(): Promise<void> {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.prisma = null;
    }
  }
}

// Initialize database on import (async, non-blocking)
const dbInitializer = DatabaseInitializer.getInstance();

// Export the main function for API routes
export const ensureDatabaseReady = async (): Promise<void> => {
  return dbInitializer.ensureDatabaseReady();
};

// Export status checker
export const getDatabaseStatus = (): DatabaseInitStatus => {
  return dbInitializer.getStatus();
};

// Export disconnect function for cleanup
export const disconnectDatabase = async (): Promise<void> => {
  return dbInitializer.disconnect();
};

// Handle process cleanup
process.on('beforeExit', () => {
  dbInitializer.disconnect().catch(console.error);
});

process.on('SIGINT', () => {
  dbInitializer.disconnect().then(() => process.exit(0)).catch(() => process.exit(1));
});

process.on('SIGTERM', () => {
  dbInitializer.disconnect().then(() => process.exit(0)).catch(() => process.exit(1));
});