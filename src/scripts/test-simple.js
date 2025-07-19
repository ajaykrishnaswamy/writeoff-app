const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Console colors for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Database path
const dbPath = path.join(__dirname, 'dev.db');

// Test data
const testUser = {
  email: 'test@example.com',
  utm_source: 'test',
  utm_medium: 'script',
  utm_campaign: 'database-test',
  utm_content: 'test-content',
  utm_term: 'test-term',
  referrer: 'http://localhost:3000'
};

let db;
let exitCode = 0;

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function error(message) {
  log('❌ ' + message, 'red');
  exitCode = 1;
}

function success(message) {
  log('✅ ' + message, 'green');
}

function info(message) {
  log('ℹ️  ' + message, 'blue');
}

function warning(message) {
  log('⚠️  ' + message, 'yellow');
}

// Step 1: Connect to database
function connectToDatabase() {
  return new Promise((resolve, reject) => {
    info('Connecting to database...');
    
    try {
      db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          error('Failed to connect to database: ' + err.message);
          reject(err);
        } else {
          success('Connected to database successfully');
          resolve();
        }
      });
    } catch (err) {
      error('Error creating database connection: ' + err.message);
      reject(err);
    }
  });
}

// Step 2: Create table if it doesn't exist
function createTable() {
  return new Promise((resolve, reject) => {
    info('Creating waitlist_users table...');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS waitlist_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        utm_source TEXT,
        utm_medium TEXT,
        utm_campaign TEXT,
        utm_content TEXT,
        utm_term TEXT,
        referrer TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    db.run(createTableSQL, (err) => {
      if (err) {
        error('Failed to create table: ' + err.message);
        reject(err);
      } else {
        success('Table created/verified successfully');
        resolve();
      }
    });
  });
}

// Step 3: Insert test record
function insertTestRecord() {
  return new Promise((resolve, reject) => {
    info('Inserting test record...');
    
    const insertSQL = `
      INSERT INTO waitlist_users (email, utm_source, utm_medium, utm_campaign, utm_content, utm_term, referrer)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(insertSQL, [
      testUser.email,
      testUser.utm_source,
      testUser.utm_medium,
      testUser.utm_campaign,
      testUser.utm_content,
      testUser.utm_term,
      testUser.referrer
    ], function(err) {
      if (err) {
        error('Failed to insert test record: ' + err.message);
        reject(err);
      } else {
        success(`Test record inserted successfully (ID: ${this.lastID})`);
        resolve(this.lastID);
      }
    });
  });
}

// Step 4: Query test record back
function queryTestRecord() {
  return new Promise((resolve, reject) => {
    info('Querying test record...');
    
    const selectSQL = `
      SELECT * FROM waitlist_users WHERE email = ?
    `;
    
    db.get(selectSQL, [testUser.email], (err, row) => {
      if (err) {
        error('Failed to query test record: ' + err.message);
        reject(err);
      } else if (!row) {
        error('Test record not found');
        reject(new Error('Test record not found'));
      } else {
        success('Test record retrieved successfully');
        info(`Retrieved: ${JSON.stringify(row, null, 2)}`);
        resolve(row);
      }
    });
  });
}

// Step 5: Delete test record
function deleteTestRecord() {
  return new Promise((resolve, reject) => {
    info('Deleting test record...');
    
    const deleteSQL = `
      DELETE FROM waitlist_users WHERE email = ?
    `;
    
    db.run(deleteSQL, [testUser.email], function(err) {
      if (err) {
        error('Failed to delete test record: ' + err.message);
        reject(err);
      } else if (this.changes === 0) {
        warning('No records were deleted');
        resolve();
      } else {
        success(`Test record deleted successfully (${this.changes} record(s) affected)`);
        resolve();
      }
    });
  });
}

// Step 6: Close database connection
function closeDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) {
          error('Failed to close database: ' + err.message);
          reject(err);
        } else {
          success('Database connection closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

// Main test function
async function runDatabaseTest() {
  log('\n🧪 Starting database functionality test...\n', 'blue');
  
  try {
    // Step 1: Connect to database
    await connectToDatabase();
    
    // Step 2: Create table
    await createTable();
    
    // Step 3: Insert test record
    await insertTestRecord();
    
    // Step 4: Query test record
    await queryTestRecord();
    
    // Step 5: Delete test record
    await deleteTestRecord();
    
    // All tests passed
    log('\n🎉 All database tests passed successfully!', 'green');
    
  } catch (err) {
    error('Database test failed: ' + err.message);
    exitCode = 1;
  } finally {
    // Step 6: Close database
    await closeDatabase();
    
    // Print final result
    if (exitCode === 0) {
      log('\n✅ Database is working correctly!', 'green');
    } else {
      log('\n❌ Database test failed!', 'red');
    }
    
    process.exit(exitCode);
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  warning('\nReceived SIGINT, closing database connection...');
  await closeDatabase();
  process.exit(1);
});

process.on('SIGTERM', async () => {
  warning('\nReceived SIGTERM, closing database connection...');
  await closeDatabase();
  process.exit(1);
});

// Run the test
runDatabaseTest();