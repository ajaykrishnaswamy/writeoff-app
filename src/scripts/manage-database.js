const fs = require('fs/promises');
const path = require('path');
const readline = require('readline');
const chalk = require('chalk');

// Database path
const DB_PATH = path.join(__dirname, '../src/database/waitlist.db');
const BACKUP_DIR = path.join(__dirname, '../backups');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility functions
const question = (query) => new Promise(resolve => rl.question(query, resolve));

const logHeader = (text) => {
  console.log('\n' + chalk.bold.blue('=' .repeat(50)));
  console.log(chalk.bold.blue(`  ${text}`));
  console.log(chalk.bold.blue('=' .repeat(50)) + '\n');
};

const logSuccess = (text) => console.log(chalk.green('✓ ' + text));
const logError = (text) => console.log(chalk.red('✗ ' + text));
const logWarning = (text) => console.log(chalk.yellow('⚠ ' + text));
const logInfo = (text) => console.log(chalk.cyan('ℹ ' + text));

// Database operations (simplified versions of database functions)
const Database = require('sqlite3').Database;

const executeQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = new Database(DB_PATH);
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
      db.close();
    });
  });
};

const executeRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    const db = new Database(DB_PATH);
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ changes: this.changes, lastID: this.lastID });
      }
      db.close();
    });
  });
};

// Ensure database and table exist
const initDatabase = async () => {
  try {
    await executeRun(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  } catch (error) {
    logError(`Failed to initialize database: ${error.message}`);
    process.exit(1);
  }
};

// Main functions
const viewData = async () => {
  logHeader('Waitlist Entries');
  try {
    const entries = await executeQuery('SELECT * FROM waitlist ORDER BY created_at DESC');
    
    if (entries.length === 0) {
      logWarning('No entries found in the waitlist.');
      return;
    }

    console.log(chalk.bold('ID'.padEnd(5) + 'EMAIL'.padEnd(30) + 'NAME'.padEnd(20) + 'CREATED AT'));
    console.log('-'.repeat(80));
    
    entries.forEach(entry => {
      const date = new Date(entry.created_at).toLocaleString();
      console.log(
        entry.id.toString().padEnd(5) + 
        entry.email.padEnd(30) + 
        entry.name.padEnd(20) + 
        date
      );
    });
    
    logSuccess(`Total entries: ${entries.length}`);
  } catch (error) {
    logError(`Failed to fetch data: ${error.message}`);
  }
};

const exportData = async () => {
  logHeader('Export Data');
  try {
    const entries = await executeQuery('SELECT * FROM waitlist ORDER BY created_at DESC');
    
    if (entries.length === 0) {
      logWarning('No data to export.');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `waitlist-export-${timestamp}.csv`;
    const filepath = path.join(process.cwd(), filename);

    let csv = 'ID,Email,Name,Created At\n';
    entries.forEach(entry => {
      csv += `${entry.id},"${entry.email}","${entry.name}","${entry.created_at}"\n`;
    });

    await fs.writeFile(filepath, csv);
    logSuccess(`Data exported to: ${filename}`);
    logInfo(`${entries.length} entries exported`);
  } catch (error) {
    logError(`Failed to export data: ${error.message}`);
  }
};

const backupDatabase = async () => {
  logHeader('Backup Database');
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilename = `waitlist-backup-${timestamp}.db`;
    
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    
    const backupPath = path.join(BACKUP_DIR, backupFilename);
    
    // Copy database file
    await fs.copyFile(DB_PATH, backupPath);
    
    logSuccess(`Database backed up to: ${path.relative(process.cwd(), backupPath)}`);
  } catch (error) {
    logError(`Failed to backup database: ${error.message}`);
  }
};

const clearData = async () => {
  logHeader('Clear All Data');
  logWarning('This will permanently delete ALL waitlist entries!');
  
  const confirmation = await question(chalk.red('Type "DELETE" to confirm: '));
  
  if (confirmation !== 'DELETE') {
    logInfo('Operation cancelled.');
    return;
  }

  try {
    const result = await executeRun('DELETE FROM waitlist');
    logSuccess(`Deleted ${result.changes} entries`);
  } catch (error) {
    logError(`Failed to clear data: ${error.message}`);
  }
};

const addTestData = async () => {
  logHeader('Add Test Data');
  
  const testData = [
    { email: 'john.doe@example.com', name: 'John Doe' },
    { email: 'jane.smith@example.com', name: 'Jane Smith' },
    { email: 'bob.wilson@example.com', name: 'Bob Wilson' },
    { email: 'alice.brown@example.com', name: 'Alice Brown' },
    { email: 'charlie.davis@example.com', name: 'Charlie Davis' }
  ];

  try {
    let added = 0;
    for (const user of testData) {
      try {
        await executeRun(
          'INSERT INTO waitlist (email, name) VALUES (?, ?)',
          [user.email, user.name]
        );
        added++;
      } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          logWarning(`Skipped duplicate: ${user.email}`);
        } else {
          throw err;
        }
      }
    }
    
    logSuccess(`Added ${added} test entries`);
  } catch (error) {
    logError(`Failed to add test data: ${error.message}`);
  }
};

const showStats = async () => {
  logHeader('Database Statistics');
  try {
    const [countResult, recentEntries] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM waitlist'),
      executeQuery('SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 5')
    ]);

    const count = countResult[0].count;
    
    console.log(chalk.bold('General Stats:'));
    console.log(`Total entries: ${chalk.green(count)}`);
    
    if (count > 0) {
      const [oldestEntry, newestEntry] = await Promise.all([
        executeQuery('SELECT * FROM waitlist ORDER BY created_at ASC LIMIT 1'),
        executeQuery('SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 1')
      ]);

      console.log(`Oldest entry: ${chalk.cyan(new Date(oldestEntry[0].created_at).toLocaleString())}`);
      console.log(`Newest entry: ${chalk.cyan(new Date(newestEntry[0].created_at).toLocaleString())}`);
      
      console.log('\n' + chalk.bold('Recent Entries:'));
      recentEntries.forEach(entry => {
        console.log(`${chalk.yellow(entry.email)} - ${entry.name} (${new Date(entry.created_at).toLocaleString()})`);
      });
    }
  } catch (error) {
    logError(`Failed to get stats: ${error.message}`);
  }
};

const searchData = async () => {
  logHeader('Search/Filter Data');
  
  const searchTerm = await question('Enter email or name to search for: ');
  
  if (!searchTerm.trim()) {
    logWarning('No search term provided.');
    return;
  }

  try {
    const results = await executeQuery(
      'SELECT * FROM waitlist WHERE email LIKE ? OR name LIKE ? ORDER BY created_at DESC',
      [`%${searchTerm}%`, `%${searchTerm}%`]
    );

    if (results.length === 0) {
      logWarning(`No entries found matching: ${searchTerm}`);
      return;
    }

    console.log(chalk.bold(`Found ${results.length} matching entries:\n`));
    console.log(chalk.bold('ID'.padEnd(5) + 'EMAIL'.padEnd(30) + 'NAME'.padEnd(20) + 'CREATED AT'));
    console.log('-'.repeat(80));
    
    results.forEach(entry => {
      const date = new Date(entry.created_at).toLocaleString();
      console.log(
        entry.id.toString().padEnd(5) + 
        entry.email.padEnd(30) + 
        entry.name.padEnd(20) + 
        date
      );
    });
  } catch (error) {
    logError(`Search failed: ${error.message}`);
  }
};

const validateData = async () => {
  logHeader('Validate Data');
  try {
    const entries = await executeQuery('SELECT * FROM waitlist');
    
    if (entries.length === 0) {
      logInfo('No data to validate.');
      return;
    }

    let invalidEmails = 0;
    let duplicateEmails = 0;
    let emptyNames = 0;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const seenEmails = new Set();

    console.log(chalk.bold('Validation Results:\n'));

    entries.forEach(entry => {
      // Check email format
      if (!emailRegex.test(entry.email)) {
        console.log(chalk.red(`Invalid email: ID ${entry.id} - ${entry.email}`));
        invalidEmails++;
      }

      // Check for duplicates (shouldn't happen due to UNIQUE constraint, but check anyway)
      if (seenEmails.has(entry.email.toLowerCase())) {
        console.log(chalk.red(`Duplicate email: ID ${entry.id} - ${entry.email}`));
        duplicateEmails++;
      }
      seenEmails.add(entry.email.toLowerCase());

      // Check for empty names
      if (!entry.name || entry.name.trim() === '') {
        console.log(chalk.red(`Empty name: ID ${entry.id} - ${entry.email}`));
        emptyNames++;
      }
    });

    console.log('\n' + chalk.bold('Summary:'));
    console.log(`Total entries: ${entries.length}`);
    console.log(`Invalid emails: ${invalidEmails > 0 ? chalk.red(invalidEmails) : chalk.green('0')}`);
    console.log(`Duplicate emails: ${duplicateEmails > 0 ? chalk.red(duplicateEmails) : chalk.green('0')}`);
    console.log(`Empty names: ${emptyNames > 0 ? chalk.red(emptyNames) : chalk.green('0')}`);

    if (invalidEmails === 0 && duplicateEmails === 0 && emptyNames === 0) {
      logSuccess('All data is valid!');
    }
  } catch (error) {
    logError(`Validation failed: ${error.message}`);
  }
};

const repairDatabase = async () => {
  logHeader('Repair Database');
  
  try {
    logInfo('Running VACUUM to optimize database...');
    await executeRun('VACUUM');
    
    logInfo('Running REINDEX to rebuild indexes...');
    await executeRun('REINDEX');
    
    logInfo('Checking database integrity...');
    const integrityCheck = await executeQuery('PRAGMA integrity_check');
    
    if (integrityCheck[0]['integrity_check'] === 'ok') {
      logSuccess('Database integrity check passed');
    } else {
      logError('Database integrity issues found');
      console.log(integrityCheck);
    }

    logSuccess('Database repair completed');
  } catch (error) {
    logError(`Database repair failed: ${error.message}`);
  }
};

const showMenu = () => {
  console.clear();
  logHeader('Waitlist Database Manager');
  
  console.log(chalk.bold('Available Commands:\n'));
  console.log('1.  View Data        - Display all waitlist entries');
  console.log('2.  Export Data      - Export to CSV format');
  console.log('3.  Backup Database  - Create backup of database file');
  console.log('4.  Clear Data       - Remove all entries (with confirmation)');
  console.log('5.  Add Test Data    - Insert sample entries for testing');
  console.log('6.  Database Stats   - Show count, recent entries, etc.');
  console.log('7.  Search/Filter    - Find entries by email or name');
  console.log('8.  Validate Data    - Check for invalid emails, duplicates');
  console.log('9.  Repair Database  - Fix common database issues');
  console.log('10. Exit\n');
};

const handleChoice = async (choice) => {
  switch (choice) {
    case '1':
      await viewData();
      break;
    case '2':
      await exportData();
      break;
    case '3':
      await backupDatabase();
      break;
    case '4':
      await clearData();
      break;
    case '5':
      await addTestData();
      break;
    case '6':
      await showStats();
      break;
    case '7':
      await searchData();
      break;
    case '8':
      await validateData();
      break;
    case '9':
      await repairDatabase();
      break;
    case '10':
      console.log(chalk.green('\nGoodbye!'));
      rl.close();
      process.exit(0);
    default:
      logError('Invalid choice. Please select 1-10.');
      break;
  }

  if (choice !== '10') {
    console.log('\n' + chalk.dim('Press Enter to continue...'));
    await question('');
  }
};

const main = async () => {
  // Initialize database
  await initDatabase();
  
  // Main loop
  while (true) {
    showMenu();
    const choice = await question(chalk.bold.cyan('Enter your choice (1-10): '));
    await handleChoice(choice.trim());
  }
};

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\nExiting...'));
  rl.close();
  process.exit(0);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logError(`Uncaught exception: ${error.message}`);
  process.exit(1);
});

// Start the application
main().catch((error) => {
  logError(`Application error: ${error.message}`);
  process.exit(1);
});