#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up WriteOff Waitlist Database...\n');

// Define paths
const projectRoot = process.cwd();
const dbPath = path.join(projectRoot, 'dev.db');

console.log('📂 Project root:', projectRoot);
console.log('🗄️  Database path:', dbPath);

// Function to run command with error handling
function runCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    console.log(`   Running: ${command}`);
    
    const output = execSync(command, { 
      cwd: projectRoot,
      stdio: 'inherit'
    });
    
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Main setup process
try {
  console.log('🔄 Starting database setup process...\n');

  // Step 1: Generate Prisma client
  console.log('--- Step 1: Generating Prisma Client ---');
  const generateSuccess = runCommand('npx prisma generate', 'Generating Prisma client');
  
  if (!generateSuccess) {
    console.error('❌ Failed to generate Prisma client. Please check your schema.');
    process.exit(1);
  }

  // Step 2: Push database schema
  console.log('\n--- Step 2: Creating Database and Tables ---');
  const pushSuccess = runCommand('npx prisma db push', 'Creating database and tables');
  
  if (!pushSuccess) {
    console.error('❌ Failed to create database. Please check your configuration.');
    process.exit(1);
  }

  // Step 3: Verify database creation
  console.log('\n--- Step 3: Verifying Database ---');
  if (fs.existsSync(dbPath)) {
    const stats = fs.statSync(dbPath);
    console.log(`✅ Database file created successfully`);
    console.log(`📊 Database file size: ${stats.size} bytes`);
  } else {
    console.log('⚠️  Database file not found at expected location');
  }

  // Success message
  console.log('\n🎉 Database setup completed successfully!');
  console.log('✅ Prisma client generated');
  console.log('✅ Database and tables created');
  console.log('✅ Waitlist system is ready to use');
  
  console.log('\n📌 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Test the waitlist form on your website');
  console.log('3. Check the admin panel at /admin');
  console.log('4. Configure Twilio in .env for SMS notifications (optional)');

} catch (error) {
  console.error('\n❌ Setup failed with error:', error.message);
  
  console.log('\n🔍 Troubleshooting tips:');
  console.log('1. Make sure you have a valid prisma/schema.prisma file');
  console.log('2. Check your .env file has DATABASE_URL set');
  console.log('3. Ensure you have the required dependencies installed');
  console.log('4. Try running: npm install @prisma/client prisma');
  
  process.exit(1);
}