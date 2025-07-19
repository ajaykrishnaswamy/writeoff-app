const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Database file path
const DB_PATH = './dev.db';

// ANSI color codes for better console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Helper function to format console output
function logStep(step, message, status = 'info') {
  const timestamp = new Date().toISOString();
  const statusColors = {
    info: colors.blue,
    success: colors.green,
    warning: colors.yellow,
    error: colors.red
  };
  
  console.log(
    `${colors.bright}[${timestamp}]${colors.reset} ` +
    `${statusColors[status]}${step}:${colors.reset} ${message}`
  );
}

// Helper function to run SQL queries with Promise wrapper
function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes, lastID: this.lastID });
      }
    });
  });
}

// Helper function to get query results with Promise wrapper
function getQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

// Helper function to get all query results with Promise wrapper
function allQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// Main database setup function
async function setupDatabase() {
  let db;
  
  try {
    logStep('INITIALIZATION', 'Starting database setup process');
    
    // Check if database file exists
    const dbExists = fs.existsSync(DB_PATH);
    logStep('FILE CHECK', dbExists ? 'Database file exists' : 'Database file does not exist, will be created');
    
    // Create database connection
    logStep('CONNECTION', 'Creating database connection');
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        throw new Error(`Failed to connect to database: ${err.message}`);
      }
    });
    
    // Enable foreign keys
    logStep('CONFIGURATION', 'Enabling foreign key constraints');
    await runQuery(db, 'PRAGMA foreign_keys = ON');
    
    // Create waitlist_users table
    logStep('TABLE CREATION', 'Creating waitlist_users table');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS waitlist_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await runQuery(db, createTableSQL);
    logStep('TABLE CREATION', 'waitlist_users table created successfully', 'success');
    
    // Create indexes
    logStep('INDEX CREATION', 'Creating indexes on email, createdAt, and updatedAt columns');
    
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email)',
      'CREATE INDEX IF NOT EXISTS idx_waitlist_users_createdAt ON waitlist_users(createdAt)',
      'CREATE INDEX IF NOT EXISTS idx_waitlist_users_updatedAt ON waitlist_users(updatedAt)'
    ];
    
    for (const indexSQL of indexes) {
      await runQuery(db, indexSQL);
    }
    logStep('INDEX CREATION', 'All indexes created successfully', 'success');
    
    // Create trigger for automatically updating updatedAt
    logStep('TRIGGER CREATION', 'Creating trigger for automatic updatedAt updates');
    const triggerSQL = `
      CREATE TRIGGER IF NOT EXISTS update_waitlist_users_updatedAt
      AFTER UPDATE ON waitlist_users
      FOR EACH ROW
      BEGIN
        UPDATE waitlist_users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `;
    
    await runQuery(db, triggerSQL);
    logStep('TRIGGER CREATION', 'updatedAt trigger created successfully', 'success');
    
    // Check if test record already exists
    logStep('TEST RECORD', 'Checking for existing test record');
    const existingRecord = await getQuery(db, 'SELECT * FROM waitlist_users WHERE email = ?', ['test@example.com']);
    
    if (existingRecord) {
      logStep('TEST RECORD', 'Test record already exists, skipping insertion', 'warning');
      logStep('EXISTING RECORD', JSON.stringify(existingRecord, null, 2));
    } else {
      // Insert test record
      logStep('TEST RECORD', 'Inserting test record');
      const insertSQL = `
        INSERT INTO waitlist_users (name, email, phone)
        VALUES (?, ?, ?)
      `;
      
      const result = await runQuery(db, insertSQL, ['John Doe', 'test@example.com', '+1234567890']);
      logStep('TEST RECORD', `Test record inserted successfully with ID: ${result.lastID}`, 'success');
    }
    
    // Verify the database structure
    logStep('VERIFICATION', 'Verifying database structure');
    
    // Check table schema
    const tableInfo = await allQuery(db, 'PRAGMA table_info(waitlist_users)');
    logStep('TABLE SCHEMA', 'waitlist_users table structure:');
    tableInfo.forEach(column => {
      console.log(`  ${colors.cyan}${column.name}${colors.reset}: ${column.type}${column.notnull ? ' NOT NULL' : ''}${column.pk ? ' PRIMARY KEY' : ''}${column.dflt_value ? ` DEFAULT ${column.dflt_value}` : ''}`);
    });
    
    // Check indexes
    const indexInfo = await allQuery(db, 'PRAGMA index_list(waitlist_users)');
    logStep('INDEXES', 'Available indexes:');
    indexInfo.forEach(index => {
      console.log(`  ${colors.cyan}${index.name}${colors.reset}: ${index.unique ? 'UNIQUE' : 'NON-UNIQUE'}`);
    });
    
    // Check triggers
    const triggerInfo = await allQuery(db, 'SELECT name FROM sqlite_master WHERE type = "trigger" AND tbl_name = "waitlist_users"');
    logStep('TRIGGERS', 'Available triggers:');
    triggerInfo.forEach(trigger => {
      console.log(`  ${colors.cyan}${trigger.name}${colors.reset}`);
    });
    
    // Get record count
    const countResult = await getQuery(db, 'SELECT COUNT(*) as count FROM waitlist_users');
    logStep('RECORD COUNT', `Total records in waitlist_users: ${countResult.count}`);
    
    // Test the trigger by updating a record
    if (existingRecord) {
      logStep('TRIGGER TEST', 'Testing updatedAt trigger');
      const originalUpdatedAt = existingRecord.updatedAt;
      
      // Wait a moment to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await runQuery(db, 'UPDATE waitlist_users SET name = ? WHERE email = ?', ['John Doe Updated', 'test@example.com']);
      
      const updatedRecord = await getQuery(db, 'SELECT * FROM waitlist_users WHERE email = ?', ['test@example.com']);
      
      if (updatedRecord.updatedAt !== originalUpdatedAt) {
        logStep('TRIGGER TEST', 'updatedAt trigger working correctly', 'success');
      } else {
        logStep('TRIGGER TEST', 'updatedAt trigger may not be working', 'warning');
      }
    }
    
    logStep('COMPLETION', 'Database setup completed successfully', 'success');
    
  } catch (error) {
    logStep('ERROR', `Database setup failed: ${error.message}`, 'error');
    console.error(`${colors.red}Error details:${colors.reset}`, error);
    process.exit(1);
  } finally {
    // Close database connection
    if (db) {
      logStep('CLEANUP', 'Closing database connection');
      db.close((err) => {
        if (err) {
          logStep('CLEANUP', `Error closing database: ${err.message}`, 'error');
        } else {
          logStep('CLEANUP', 'Database connection closed successfully', 'success');
        }
      });
    }
  }
}

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  logStep('UNCAUGHT EXCEPTION', error.message, 'error');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logStep('UNHANDLED REJECTION', `Reason: ${reason}`, 'error');
  console.error('Promise:', promise);
  process.exit(1);
});

// Run the setup
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase, runQuery, getQuery, allQuery };