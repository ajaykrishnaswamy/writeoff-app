#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// Color codes for terminal output
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

// Helper function to colorize output
function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

// Helper function to print status messages
function printStatus(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: colorize('ℹ', 'blue'),
    success: colorize('✓', 'green'),
    error: colorize('✗', 'red'),
    warning: colorize('⚠', 'yellow')
  };
  
  console.log(`${prefix[type]} ${colorize(`[${timestamp}]`, 'cyan')} ${message}`);
}

// Main function to run the database setup
async function runDatabaseSetup() {
  printStatus('Starting database setup...', 'info');
  
  try {
    // Path to the setup script
    const setupScriptPath = path.join(__dirname, 'src', 'scripts', 'setup-database.js');
    
    // Check if the setup script exists
    const fs = require('fs');
    if (!fs.existsSync(setupScriptPath)) {
      throw new Error(`Setup script not found at: ${setupScriptPath}`);
    }
    
    printStatus(`Found setup script at: ${setupScriptPath}`, 'info');
    
    // Run the setup script
    const setupProcess = spawn('node', [setupScriptPath], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    // Handle process events
    setupProcess.on('error', (error) => {
      printStatus(`Failed to start setup process: ${error.message}`, 'error');
      process.exit(1);
    });
    
    setupProcess.on('close', (code) => {
      if (code === 0) {
        printStatus('Database setup completed successfully!', 'success');
        verifySetup();
      } else {
        printStatus(`Setup process exited with code ${code}`, 'error');
        process.exit(1);
      }
    });
    
  } catch (error) {
    printStatus(`Setup failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Function to verify the setup was successful
function verifySetup() {
  printStatus('Verifying database setup...', 'info');
  
  try {
    // Check if database connection can be established
    const verifyProcess = spawn('node', ['-e', `
      const db = require('./src/lib/database');
      db.query('SELECT 1 AS test', (err, results) => {
        if (err) {
          console.error('Database verification failed:', err.message);
          process.exit(1);
        }
        console.log('Database connection verified successfully');
        process.exit(0);
      });
    `], {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    verifyProcess.on('error', (error) => {
      printStatus(`Verification failed: ${error.message}`, 'warning');
      printStatus('Database may have been created but verification could not be completed', 'info');
    });
    
    verifyProcess.on('close', (code) => {
      if (code === 0) {
        printStatus('Database verification completed successfully!', 'success');
        printStatus('Your database is ready to use.', 'info');
      } else {
        printStatus('Database verification failed. Please check your configuration.', 'warning');
      }
    });
    
  } catch (error) {
    printStatus(`Verification error: ${error.message}`, 'warning');
    printStatus('Database setup may have completed, but verification failed', 'info');
  }
}

// Handle process termination
process.on('SIGINT', () => {
  printStatus('Setup process interrupted by user', 'warning');
  process.exit(1);
});

process.on('SIGTERM', () => {
  printStatus('Setup process terminated', 'warning');
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  printStatus(`Uncaught exception: ${error.message}`, 'error');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  printStatus(`Unhandled rejection at: ${promise}, reason: ${reason}`, 'error');
  process.exit(1);
});

// Print banner
console.log(colorize('='.repeat(60), 'cyan'));
console.log(colorize('  Database Setup Script', 'bright'));
console.log(colorize('='.repeat(60), 'cyan'));
console.log();

// Run the setup
runDatabaseSetup();