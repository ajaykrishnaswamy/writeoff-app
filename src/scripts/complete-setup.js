#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { promisify } = require('util');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m'
};

// Utility functions for colored output
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.bgBlue} ${msg} ${colors.reset}\n`),
  divider: () => console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`)
};

// Progress indicator
class ProgressIndicator {
  constructor(message) {
    this.message = message;
    this.spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    this.index = 0;
    this.interval = null;
  }

  start() {
    process.stdout.write(`${colors.cyan}${this.spinner[0]}${colors.reset} ${this.message}`);
    this.interval = setInterval(() => {
      this.index = (this.index + 1) % this.spinner.length;
      process.stdout.write(`\r${colors.cyan}${this.spinner[this.index]}${colors.reset} ${this.message}`);
    }, 100);
  }

  stop(success = true) {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    const symbol = success ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
    process.stdout.write(`\r${symbol} ${this.message}\n`);
  }
}

// Run command with promise
const runCommand = (command, args = [], options = {}) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'pipe',
      ...options
    });

    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject({ code, stdout, stderr });
      }
    });

    child.on('error', (error) => {
      reject({ error, stdout, stderr });
    });
  });
};

// Check if file exists
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Check prerequisites
async function checkPrerequisites() {
  const checks = [
    { name: 'Node.js', command: 'node', args: ['--version'] },
    { name: 'npm', command: 'npm', args: ['--version'] },
    { name: 'SQLite3', command: 'sqlite3', args: ['--version'] }
  ];

  const results = [];

  for (const check of checks) {
    try {
      const result = await runCommand(check.command, check.args);
      results.push({
        name: check.name,
        status: 'success',
        version: result.stdout.trim()
      });
    } catch (error) {
      results.push({
        name: check.name,
        status: 'error',
        error: error.stderr || error.error?.message || 'Command not found'
      });
    }
  }

  return results;
}

// Check required files
function checkRequiredFiles() {
  const requiredFiles = [
    'package.json',
    'setup-database.js',
    'test-waitlist-api.js',
    'server.js'
  ];

  const results = [];

  for (const file of requiredFiles) {
    if (fileExists(file)) {
      results.push({ name: file, status: 'success' });
    } else {
      results.push({ name: file, status: 'error', error: 'File not found' });
    }
  }

  return results;
}

// Install dependencies
async function installDependencies() {
  const progress = new ProgressIndicator('Installing dependencies...');
  progress.start();

  try {
    await runCommand('npm', ['install']);
    progress.stop(true);
    return { success: true };
  } catch (error) {
    progress.stop(false);
    return {
      success: false,
      error: error.stderr || error.error?.message || 'Failed to install dependencies'
    };
  }
}

// Run database setup
async function runDatabaseSetup() {
  const progress = new ProgressIndicator('Setting up database...');
  progress.start();

  try {
    const result = await runCommand('node', ['setup-database.js']);
    progress.stop(true);
    return { success: true, output: result.stdout };
  } catch (error) {
    progress.stop(false);
    return {
      success: false,
      error: error.stderr || error.error?.message || 'Database setup failed',
      output: error.stdout
    };
  }
}

// Run API tests
async function runApiTests() {
  const progress = new ProgressIndicator('Running API tests...');
  progress.start();

  try {
    const result = await runCommand('node', ['test-waitlist-api.js']);
    progress.stop(true);
    return { success: true, output: result.stdout };
  } catch (error) {
    progress.stop(false);
    return {
      success: false,
      error: error.stderr || error.error?.message || 'API tests failed',
      output: error.stdout
    };
  }
}

// Generate setup report
function generateReport(results) {
  log.header('SETUP REPORT');
  log.divider();

  // Prerequisites
  console.log(`${colors.bright}Prerequisites:${colors.reset}`);
  results.prerequisites.forEach(check => {
    if (check.status === 'success') {
      log.success(`${check.name}: ${check.version}`);
    } else {
      log.error(`${check.name}: ${check.error}`);
    }
  });

  log.divider();

  // Required files
  console.log(`${colors.bright}Required Files:${colors.reset}`);
  results.files.forEach(file => {
    if (file.status === 'success') {
      log.success(`${file.name}: Found`);
    } else {
      log.error(`${file.name}: ${file.error}`);
    }
  });

  log.divider();

  // Dependencies
  console.log(`${colors.bright}Dependencies:${colors.reset}`);
  if (results.dependencies.success) {
    log.success('All dependencies installed successfully');
  } else {
    log.error(`Installation failed: ${results.dependencies.error}`);
  }

  log.divider();

  // Database setup
  console.log(`${colors.bright}Database Setup:${colors.reset}`);
  if (results.database.success) {
    log.success('Database setup completed successfully');
    if (results.database.output) {
      console.log(`${colors.dim}${results.database.output}${colors.reset}`);
    }
  } else {
    log.error(`Database setup failed: ${results.database.error}`);
    if (results.database.output) {
      console.log(`${colors.dim}${results.database.output}${colors.reset}`);
    }
  }

  log.divider();

  // API tests
  console.log(`${colors.bright}API Tests:${colors.reset}`);
  if (results.tests.success) {
    log.success('All API tests passed');
    if (results.tests.output) {
      console.log(`${colors.dim}${results.tests.output}${colors.reset}`);
    }
  } else {
    log.error(`API tests failed: ${results.tests.error}`);
    if (results.tests.output) {
      console.log(`${colors.dim}${results.tests.output}${colors.reset}`);
    }
  }

  log.divider();

  // Overall status
  const allSuccess = results.prerequisites.every(p => p.status === 'success') &&
                    results.files.every(f => f.status === 'success') &&
                    results.dependencies.success &&
                    results.database.success &&
                    results.tests.success;

  if (allSuccess) {
    log.header('🎉 SETUP COMPLETED SUCCESSFULLY! 🎉');
    console.log(`${colors.bright}Your waitlist system is ready to use!${colors.reset}\n`);
    
    console.log(`${colors.bright}Next Steps:${colors.reset}`);
    log.step('Start the server: npm start');
    log.step('Or run manually: node server.js');
    log.step('Visit: http://localhost:3000');
    log.step('Admin dashboard: http://localhost:3000/admin');
    log.step('API endpoints are available at: http://localhost:3000/api/*');
    
    console.log(`\n${colors.bright}Available API Endpoints:${colors.reset}`);
    console.log(`${colors.cyan}POST${colors.reset} /api/waitlist - Add to waitlist`);
    console.log(`${colors.cyan}GET${colors.reset}  /api/waitlist - Get all entries (admin)`);
    console.log(`${colors.cyan}GET${colors.reset}  /api/waitlist/stats - Get statistics`);
    console.log(`${colors.cyan}DELETE${colors.reset} /api/waitlist/:id - Remove entry (admin)`);
    
    console.log(`\n${colors.bright}Database Location:${colors.reset}`);
    console.log(`${colors.dim}./waitlist.db${colors.reset}`);
  } else {
    log.header('❌ SETUP FAILED');
    console.log(`${colors.bright}Please fix the errors above and try again.${colors.reset}\n`);
    
    console.log(`${colors.bright}Common Solutions:${colors.reset}`);
    log.step('Ensure all prerequisite software is installed');
    log.step('Check that all required files are present');
    log.step('Run: npm install (if dependencies failed)');
    log.step('Check file permissions');
    log.step('Ensure port 3000 is available');
  }
}

// Main setup function
async function main() {
  console.log(`${colors.bright}${colors.bgBlue}                                                        ${colors.reset}`);
  console.log(`${colors.bright}${colors.bgBlue}  🚀 WAITLIST SYSTEM SETUP - AUTOMATED INSTALLER  🚀  ${colors.reset}`);
  console.log(`${colors.bright}${colors.bgBlue}                                                        ${colors.reset}\n`);

  const results = {
    prerequisites: [],
    files: [],
    dependencies: { success: false },
    database: { success: false },
    tests: { success: false }
  };

  try {
    // Check prerequisites
    log.step('Checking prerequisites...');
    results.prerequisites = await checkPrerequisites();
    
    const prereqFailed = results.prerequisites.some(p => p.status === 'error');
    if (prereqFailed) {
      log.error('Some prerequisites are missing. Please install them and try again.');
      generateReport(results);
      process.exit(1);
    }

    // Check required files
    log.step('Checking required files...');
    results.files = checkRequiredFiles();
    
    const filesFailed = results.files.some(f => f.status === 'error');
    if (filesFailed) {
      log.error('Some required files are missing. Please ensure you have all necessary files.');
      generateReport(results);
      process.exit(1);
    }

    // Install dependencies
    log.step('Installing dependencies...');
    results.dependencies = await installDependencies();
    
    if (!results.dependencies.success) {
      log.error('Failed to install dependencies.');
      generateReport(results);
      process.exit(1);
    }

    // Run database setup
    log.step('Setting up database...');
    results.database = await runDatabaseSetup();
    
    if (!results.database.success) {
      log.error('Database setup failed.');
      generateReport(results);
      process.exit(1);
    }

    // Run API tests
    log.step('Running API tests...');
    results.tests = await runApiTests();
    
    if (!results.tests.success) {
      log.warning('API tests failed, but setup may still be functional.');
    }

    // Generate final report
    generateReport(results);
    
    if (results.tests.success) {
      process.exit(0);
    } else {
      process.exit(1);
    }

  } catch (error) {
    log.error(`Unexpected error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log(`\n${colors.yellow}Setup cancelled by user.${colors.reset}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log(`\n${colors.yellow}Setup terminated.${colors.reset}`);
  process.exit(1);
});

// Run the main function
if (require.main === module) {
  main();
}

module.exports = { main, checkPrerequisites, checkRequiredFiles };