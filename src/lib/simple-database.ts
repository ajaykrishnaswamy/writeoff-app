import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'dev.db');

let db: any = null;

// Initialize database connection
async function initDatabase() {
  if (db) return db;
  
  try {
    db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Create waitlist_users table if it doesn't exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS waitlist_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Get database connection
async function getDatabase() {
  if (!db) {
    await initDatabase();
  }
  return db;
}

// Create a new waitlist user
export async function createWaitlistUser(email: string, name: string, phone?: string) {
  try {
    const database = await getDatabase();
    
    const result = await database.run(
      'INSERT INTO waitlist_users (email, name, phone) VALUES (?, ?, ?)',
      [email, name, phone || null]
    );

    return {
      success: true,
      id: result.lastID,
      message: 'User added to waitlist successfully'
    };
  } catch (error: any) {
    console.error('Error creating waitlist user:', error);
    
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        success: false,
        message: 'Email already exists in waitlist'
      };
    }
    
    return {
      success: false,
      message: 'Failed to add user to waitlist'
    };
  }
}

// Get all waitlist users
export async function getWaitlistUsers() {
  try {
    const database = await getDatabase();
    
    const users = await database.all(
      'SELECT id, email, name, phone, created_at FROM waitlist_users ORDER BY created_at DESC'
    );

    return {
      success: true,
      data: users
    };
  } catch (error) {
    console.error('Error fetching waitlist users:', error);
    return {
      success: false,
      message: 'Failed to fetch waitlist users',
      data: []
    };
  }
}

// Check database health
export async function checkDatabaseHealth() {
  try {
    const database = await getDatabase();
    
    // Test database connection with a simple query
    const result = await database.get('SELECT COUNT(*) as count FROM waitlist_users');
    
    return {
      success: true,
      message: 'Database is healthy',
      userCount: result.count
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      success: false,
      message: 'Database health check failed'
    };
  }
}

// Clean up database connection
export async function closeDatabase() {
  if (db) {
    await db.close();
    db = null;
  }
}

// Initialize database on module load
initDatabase().catch(console.error);