const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');

// Database file path
const dbPath = './dev.db';

// Remove existing database file if it exists
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
  console.log('Removed existing database file');
}

// Create new database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error creating database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Create the waitlist_users table
const createTableSQL = `
  CREATE TABLE IF NOT EXISTS waitlist_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`;

// Create indexes
const createEmailIndexSQL = `
  CREATE INDEX IF NOT EXISTS idx_waitlist_users_email ON waitlist_users(email)
`;

const createCreatedAtIndexSQL = `
  CREATE INDEX IF NOT EXISTS idx_waitlist_users_createdAt ON waitlist_users(createdAt)
`;

// Create trigger for automatic updatedAt updates
const createTriggerSQL = `
  CREATE TRIGGER IF NOT EXISTS update_waitlist_users_updatedAt
  AFTER UPDATE ON waitlist_users
  FOR EACH ROW
  BEGIN
    UPDATE waitlist_users SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
  END
`;

// Execute all SQL statements
db.serialize(() => {
  // Create table
  db.run(createTableSQL, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
      process.exit(1);
    }
    console.log('Created waitlist_users table');
  });

  // Create email index
  db.run(createEmailIndexSQL, (err) => {
    if (err) {
      console.error('Error creating email index:', err.message);
      process.exit(1);
    }
    console.log('Created email index');
  });

  // Create createdAt index
  db.run(createCreatedAtIndexSQL, (err) => {
    if (err) {
      console.error('Error creating createdAt index:', err.message);
      process.exit(1);
    }
    console.log('Created createdAt index');
  });

  // Create trigger
  db.run(createTriggerSQL, (err) => {
    if (err) {
      console.error('Error creating trigger:', err.message);
      process.exit(1);
    }
    console.log('Created updatedAt trigger');
  });
});

// Close database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
    process.exit(1);
  }
  console.log('Database setup completed successfully!');
  console.log(`Database created at: ${path.resolve(dbPath)}`);
  process.exit(0);
});