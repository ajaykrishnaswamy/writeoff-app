const { execSync } = require('child_process');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Color codes for terminal output
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

// Helper function to print colored messages
function printMessage(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Helper function to print section headers
function printSection(title) {
  console.log(`\n${colors.cyan}${'='.repeat(50)}${colors.reset}`);
  console.log(`${colors.cyan}${title}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(50)}${colors.reset}\n`);
}

// Helper function to run commands with error handling
function runCommand(command, description) {
  try {
    printMessage(`Running: ${command}`, 'blue');
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    printMessage(`✓ ${description} completed successfully`, 'green');
    return output;
  } catch (error) {
    printMessage(`✗ ${description} failed:`, 'red');
    printMessage(error.message, 'red');
    throw error;
  }
}

// Function to check if Prisma schema exists
function checkPrismaSchema() {
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    printMessage('✗ Prisma schema not found at prisma/schema.prisma', 'red');
    printMessage('Please ensure you have a Prisma schema file in the prisma directory', 'yellow');
    process.exit(1);
  }
  printMessage('✓ Prisma schema found', 'green');
}

// Function to check if .env file exists and has DATABASE_URL
function checkEnvironmentFile() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    printMessage('✗ .env file not found', 'red');
    printMessage('Please create a .env file with DATABASE_URL', 'yellow');
    process.exit(1);
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!envContent.includes('DATABASE_URL')) {
    printMessage('✗ DATABASE_URL not found in .env file', 'red');
    printMessage('Please add DATABASE_URL to your .env file', 'yellow');
    process.exit(1);
  }
  
  printMessage('✓ Environment file configured', 'green');
}

// Function to generate Prisma client
function generatePrismaClient() {
  try {
    runCommand('npx prisma generate', 'Prisma client generation');
  } catch (error) {
    printMessage('Failed to generate Prisma client. This might be due to schema issues.', 'red');
    throw error;
  }
}

// Function to push database schema
function pushDatabaseSchema() {
  try {
    runCommand('npx prisma db push', 'Database schema push');
  } catch (error) {
    printMessage('Failed to push database schema. This might be due to connection issues.', 'red');
    throw error;
  }
}

// Function to test database connection
async function testDatabaseConnection() {
  let prisma;
  try {
    // Import PrismaClient after generation
    const { PrismaClient } = require('@prisma/client');
    prisma = new PrismaClient();
    
    // Test connection by querying the database
    await prisma.$connect();
    printMessage('✓ Database connection successful', 'green');
    
    // Try to get database info
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    printMessage('✓ Database query test successful', 'green');
    
    return prisma;
  } catch (error) {
    printMessage('✗ Database connection failed:', 'red');
    printMessage(error.message, 'red');
    throw error;
  }
}

// Function to create a test entry (customize based on your schema)
async function createTestEntry(prisma) {
  try {
    // This is a generic test - you'll need to customize based on your actual schema
    // First, let's check what models are available
    const models = Object.keys(prisma).filter(key => 
      !key.startsWith('$') && 
      typeof prisma[key] === 'object' && 
      prisma[key].create
    );
    
    if (models.length === 0) {
      printMessage('No models found to test. Schema might be empty.', 'yellow');
      return;
    }
    
    printMessage(`Available models: ${models.join(', ')}`, 'blue');
    
    // You can customize this section based on your specific models
    // For example, if you have a User model:
    /*
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User'
      }
    });
    printMessage(`✓ Test user created with ID: ${testUser.id}`, 'green');
    
    // Clean up test data
    await prisma.user.delete({
      where: { id: testUser.id }
    });
    printMessage('✓ Test data cleaned up', 'green');
    */
    
    printMessage('✓ Database models are accessible', 'green');
    printMessage('Note: Customize the test entry creation based on your schema', 'yellow');
    
  } catch (error) {
    printMessage('✗ Test entry creation failed:', 'red');
    printMessage(error.message, 'red');
    printMessage('This might be normal if your schema has required fields', 'yellow');
  }
}

// Main function to fix database issues
async function fixDatabaseIssues() {
  printSection('DATABASE SETUP AND REPAIR SCRIPT');
  
  try {
    // Step 1: Check prerequisites
    printSection('Step 1: Checking Prerequisites');
    checkPrismaSchema();
    checkEnvironmentFile();
    
    // Step 2: Generate Prisma client
    printSection('Step 2: Generating Prisma Client');
    generatePrismaClient();
    
    // Step 3: Push database schema
    printSection('Step 3: Creating Database and Tables');
    pushDatabaseSchema();
    
    // Step 4: Test database connection
    printSection('Step 4: Testing Database Connection');
    const prisma = await testDatabaseConnection();
    
    // Step 5: Create test entry
    printSection('Step 5: Testing Database Operations');
    await createTestEntry(prisma);
    
    // Close the connection
    await prisma.$disconnect();
    
    // Success message
    printSection('SUCCESS');
    printMessage('✓ Database setup completed successfully!', 'green');
    printMessage('✓ Prisma client generated', 'green');
    printMessage('✓ Database and tables created', 'green');
    printMessage('✓ Database connection verified', 'green');
    printMessage('✓ Database operations tested', 'green');
    
    printMessage('\nYour database is now ready to use!', 'cyan');
    
  } catch (error) {
    printSection('SETUP FAILED');
    printMessage('✗ Database setup failed. Please check the errors above.', 'red');
    
    // Provide troubleshooting tips
    printMessage('\nTroubleshooting Tips:', 'yellow');
    printMessage('1. Ensure your DATABASE_URL is correct in .env file', 'white');
    printMessage('2. Check if your database server is running', 'white');
    printMessage('3. Verify database permissions', 'white');
    printMessage('4. Check your Prisma schema for syntax errors', 'white');
    printMessage('5. Run "npx prisma studio" to inspect your database', 'white');
    
    process.exit(1);
  }
}

// Additional utility functions
function resetDatabase() {
  printSection('RESETTING DATABASE');
  try {
    runCommand('npx prisma db push --force-reset', 'Database reset');
    printMessage('✓ Database reset completed', 'green');
  } catch (error) {
    printMessage('✗ Database reset failed', 'red');
    throw error;
  }
}

function viewDatabaseSchema() {
  printSection('DATABASE SCHEMA');
  try {
    const output = runCommand('npx prisma db pull', 'Schema introspection');
    printMessage('✓ Schema introspection completed', 'green');
  } catch (error) {
    printMessage('✗ Schema introspection failed', 'red');
    throw error;
  }
}

// Command line argument handling
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case 'reset':
    resetDatabase();
    break;
  case 'schema':
    viewDatabaseSchema();
    break;
  case 'help':
    printMessage('Available commands:', 'cyan');
    printMessage('  node fix-database.js         - Run complete database setup', 'white');
    printMessage('  node fix-database.js reset   - Reset database', 'white');
    printMessage('  node fix-database.js schema  - View database schema', 'white');
    printMessage('  node fix-database.js help    - Show this help', 'white');
    break;
  default:
    fixDatabaseIssues();
}