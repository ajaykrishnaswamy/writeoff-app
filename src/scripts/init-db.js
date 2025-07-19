#!/usr/bin/env node

const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database configuration
const DB_PATH = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
const MIGRATION_PATH = path.join(__dirname, '..', '..', 'prisma', 'migrations', '001_init', 'migration.sql');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

console.log(`${colors.blue}🔧 Initializing SQLite Database...${colors.reset}\n`);

// Create database directory if it doesn't exist
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`${colors.green}✓ Created database directory: ${dbDir}${colors.reset}`);
}

// Read migration SQL
let migrationSQL;
try {
  if (!fs.existsSync(MIGRATION_PATH)) {
    // Create migration SQL that matches the Prisma schema
    migrationSQL = `
-- CreateTable
CREATE TABLE "waitlist_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_users_email_key" ON "waitlist_users"("email");

-- CreateIndex
CREATE INDEX "waitlist_users_createdAt_idx" ON "waitlist_users"("createdAt");

-- CreateIndex
CREATE INDEX "waitlist_users_email_idx" ON "waitlist_users"("email");
    `.trim();
    
    // Create migration directory and file
    const migrationDir = path.dirname(MIGRATION_PATH);
    if (!fs.existsSync(migrationDir)) {
      fs.mkdirSync(migrationDir, { recursive: true });
    }
    fs.writeFileSync(MIGRATION_PATH, migrationSQL);
    console.log(`${colors.green}✓ Created migration file: ${MIGRATION_PATH}${colors.reset}`);
  } else {
    migrationSQL = fs.readFileSync(MIGRATION_PATH, 'utf8');
    console.log(`${colors.green}✓ Read migration file: ${MIGRATION_PATH}${colors.reset}`);
  }
} catch (error) {
  console.error(`${colors.red}✗ Error reading migration file: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Initialize database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(`${colors.red}✗ Error opening database: ${err.message}${colors.reset}`);
    process.exit(1);
  }
  console.log(`${colors.green}✓ Connected to SQLite database: ${DB_PATH}${colors.reset}`);
});

// Function to run SQL statements
function runSQL(sql) {
  return new Promise((resolve, reject) => {
    db.run(sql, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Function to check if table exists
function tableExists(tableName) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
      [tableName],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!row);
        }
      }
    );
  });
}

// Main initialization function
async function initializeDatabase() {
  try {
    // Check if waitlist_users table already exists
    const exists = await tableExists('waitlist_users');
    
    if (exists) {
      console.log(`${colors.yellow}⚠ waitlist_users table already exists. Skipping migration.${colors.reset}`);
      
      // Verify table structure
      db.all("PRAGMA table_info(waitlist_users)", (err, rows) => {
        if (err) {
          console.error(`${colors.red}✗ Error checking table structure: ${err.message}${colors.reset}`);
        } else {
          console.log(`${colors.blue}📋 Table structure verified:${colors.reset}`);
          rows.forEach(row => {
            console.log(`   ${row.name} (${row.type})`);
          });
        }
        
        // Close database connection
        db.close((err) => {
          if (err) {
            console.error(`${colors.red}✗ Error closing database: ${err.message}${colors.reset}`);
          } else {
            console.log(`\n${colors.green}🎉 Database initialization complete!${colors.reset}`);
          }
        });
      });
      
      return;
    }

    // Split migration SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`${colors.blue}📄 Running ${statements.length} SQL statements...${colors.reset}`);

    // Execute each statement
    for (const statement of statements) {
      try {
        await runSQL(statement);
        
        // Log what was executed
        if (statement.includes('CREATE TABLE')) {
          const tableName = statement.match(/CREATE TABLE "?(\w+)"?/)[1];
          console.log(`${colors.green}✓ Created table: ${tableName}${colors.reset}`);
        } else if (statement.includes('CREATE INDEX')) {
          const indexName = statement.match(/CREATE (?:UNIQUE )?INDEX "?(\w+)"?/)[1];
          console.log(`${colors.green}✓ Created index: ${indexName}${colors.reset}`);
        }
      } catch (error) {
        console.error(`${colors.red}✗ Error executing SQL: ${error.message}${colors.reset}`);
        console.error(`${colors.red}   Statement: ${statement}${colors.reset}`);
        throw error;
      }
    }

    // Verify the table was created successfully
    const tableCreated = await tableExists('waitlist_users');
    if (!tableCreated) {
      throw new Error('waitlist_users table was not created successfully');
    }

    // Get table info to verify structure
    db.all("PRAGMA table_info(waitlist_users)", (err, rows) => {
      if (err) {
        console.error(`${colors.red}✗ Error verifying table structure: ${err.message}${colors.reset}`);
      } else {
        console.log(`${colors.blue}📋 Table structure verified:${colors.reset}`);
        rows.forEach(row => {
          console.log(`   ${row.name} (${row.type})`);
        });
      }
    });

    // Get index info
    db.all("PRAGMA index_list(waitlist_users)", (err, rows) => {
      if (err) {
        console.error(`${colors.red}✗ Error verifying indexes: ${err.message}${colors.reset}`);
      } else {
        console.log(`${colors.blue}📇 Indexes created:${colors.reset}`);
        rows.forEach(row => {
          console.log(`   ${row.name} (unique: ${row.unique})`);
        });
      }
    });

    console.log(`\n${colors.green}🎉 Database initialization complete!${colors.reset}`);
    console.log(`${colors.green}   Database path: ${DB_PATH}${colors.reset}`);
    console.log(`${colors.green}   Ready to accept waitlist entries!${colors.reset}`);

  } catch (error) {
    console.error(`${colors.red}✗ Database initialization failed: ${error.message}${colors.reset}`);
    process.exit(1);
  } finally {
    // Close database connection
    db.close((err) => {
      if (err) {
        console.error(`${colors.red}✗ Error closing database: ${err.message}${colors.reset}`);
      }
    });
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}🛑 Process interrupted. Closing database...${colors.reset}`);
  db.close((err) => {
    if (err) {
      console.error(`${colors.red}✗ Error closing database: ${err.message}${colors.reset}`);
    }
    process.exit(0);
  });
});

// Run the initialization
initializeDatabase().catch((error) => {
  console.error(`${colors.red}✗ Unexpected error: ${error.message}${colors.reset}`);
  process.exit(1);
});