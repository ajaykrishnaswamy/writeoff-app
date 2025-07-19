import { createDatabase, setupDatabase } from '../lib/database.js';
import { v4 as uuidv4 } from 'uuid';

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(`[${step}] ${message}`, 'blue');
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

async function testDatabaseConnection(db) {
  const testUser = {
    id: uuidv4(),
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date().toISOString()
  };

  const testExpense = {
    id: uuidv4(),
    userId: testUser.id,
    amount: 29.99,
    description: 'Test expense',
    date: new Date().toISOString(),
    category: 'office',
    receiptUrl: null,
    mileage: null,
    createdAt: new Date().toISOString()
  };

  try {
    logStep('TEST', 'Creating test user...');
    
    const insertUser = db.prepare(`
      INSERT INTO users (id, email, name, created_at)
      VALUES (?, ?, ?, ?)
    `);
    
    insertUser.run(testUser.id, testUser.email, testUser.name, testUser.createdAt);
    logSuccess('Test user created successfully');

    logStep('TEST', 'Creating test expense...');
    
    const insertExpense = db.prepare(`
      INSERT INTO expenses (id, user_id, amount, description, date, category, receipt_url, mileage, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertExpense.run(
      testExpense.id,
      testExpense.userId,
      testExpense.amount,
      testExpense.description,
      testExpense.date,
      testExpense.category,
      testExpense.receiptUrl,
      testExpense.mileage,
      testExpense.createdAt
    );
    logSuccess('Test expense created successfully');

    logStep('TEST', 'Retrieving test data...');
    
    const getUser = db.prepare('SELECT * FROM users WHERE id = ?');
    const retrievedUser = getUser.get(testUser.id);
    
    const getExpense = db.prepare('SELECT * FROM expenses WHERE id = ?');
    const retrievedExpense = getExpense.get(testExpense.id);

    if (!retrievedUser) {
      throw new Error('Failed to retrieve test user');
    }

    if (!retrievedExpense) {
      throw new Error('Failed to retrieve test expense');
    }

    logSuccess('Test data retrieved successfully');
    
    // Verify data integrity
    if (retrievedUser.email !== testUser.email) {
      throw new Error('User data integrity check failed');
    }
    
    if (retrievedExpense.amount !== testExpense.amount) {
      throw new Error('Expense data integrity check failed');
    }

    logSuccess('Data integrity verified');

    logStep('TEST', 'Testing relationships...');
    
    const getUserWithExpenses = db.prepare(`
      SELECT u.*, e.id as expense_id, e.amount, e.description
      FROM users u
      LEFT JOIN expenses e ON u.id = e.user_id
      WHERE u.id = ?
    `);
    
    const userWithExpenses = getUserWithExpenses.all(testUser.id);
    
    if (userWithExpenses.length === 0) {
      throw new Error('Failed to retrieve user with expenses');
    }

    logSuccess('Database relationships working correctly');

    logStep('CLEANUP', 'Removing test data...');
    
    const deleteExpense = db.prepare('DELETE FROM expenses WHERE id = ?');
    const deleteUser = db.prepare('DELETE FROM users WHERE id = ?');
    
    deleteExpense.run(testExpense.id);
    deleteUser.run(testUser.id);
    
    logSuccess('Test data cleaned up successfully');

    return true;
  } catch (error) {
    logError(`Database test failed: ${error.message}`);
    
    // Attempt cleanup even on failure
    try {
      const deleteExpense = db.prepare('DELETE FROM expenses WHERE id = ?');
      const deleteUser = db.prepare('DELETE FROM users WHERE id = ?');
      
      deleteExpense.run(testExpense.id);
      deleteUser.run(testUser.id);
      logWarning('Test data cleaned up after failure');
    } catch (cleanupError) {
      logError(`Cleanup failed: ${cleanupError.message}`);
    }
    
    return false;
  }
}

async function runSetup() {
  log('\n=== WriteOff Database Setup ===\n', 'cyan');
  
  try {
    logStep('INIT', 'Starting database setup...');
    
    // Create database connection
    logStep('DB', 'Creating database connection...');
    const db = createDatabase();
    logSuccess('Database connection established');

    // Setup database schema
    logStep('SCHEMA', 'Creating database tables...');
    await setupDatabase();
    logSuccess('Database schema created successfully');

    // Test database functionality
    logStep('TEST', 'Testing database functionality...');
    const testSuccess = await testDatabaseConnection(db);
    
    if (!testSuccess) {
      throw new Error('Database functionality test failed');
    }

    logSuccess('Database functionality test passed');

    // Final verification
    logStep('VERIFY', 'Performing final verification...');
    
    const tables = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%'
    `).all();
    
    const expectedTables = ['users', 'expenses'];
    const actualTables = tables.map(t => t.name);
    
    for (const table of expectedTables) {
      if (!actualTables.includes(table)) {
        throw new Error(`Missing table: ${table}`);
      }
    }
    
    logSuccess(`All expected tables present: ${actualTables.join(', ')}`);

    // Check table structure
    for (const table of expectedTables) {
      const columns = db.prepare(`PRAGMA table_info(${table})`).all();
      logSuccess(`Table '${table}' has ${columns.length} columns`);
    }

    db.close();
    logSuccess('Database connection closed');

    log('\n=== Setup Complete ===\n', 'green');
    log('✓ Database created successfully', 'green');
    log('✓ Tables created and verified', 'green');
    log('✓ Database functionality tested', 'green');
    log('✓ All connections properly closed', 'green');
    
    log('\nNext steps:', 'cyan');
    log('1. Run your application: npm run dev', 'white');
    log('2. Check database file: ls -la database.sqlite', 'white');
    log('3. View tables: sqlite3 database.sqlite ".tables"', 'white');
    
    process.exit(0);
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    
    if (error.stack) {
      log('\nStack trace:', 'red');
      log(error.stack, 'red');
    }
    
    log('\nSetup failed. Please check the errors above and try again.', 'red');
    
    process.exit(1);
  }
}

// Handle process signals
process.on('SIGINT', () => {
  log('\n\nSetup interrupted by user', 'yellow');
  process.exit(130);
});

process.on('SIGTERM', () => {
  log('\n\nSetup terminated', 'yellow');
  process.exit(143);
});

process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  if (error.stack) {
    log(error.stack, 'red');
  }
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logError(`Unhandled promise rejection: ${reason}`);
  process.exit(1);
});

// Run the setup
runSetup();