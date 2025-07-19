import { config } from 'dotenv';
import { join } from 'path';
import { initializeDatabase } from './src/lib/database';
import { createHash } from 'crypto';

// Load environment variables
config();

interface TestResult {
  success: boolean;
  message: string;
  details?: any;
}

interface WaitlistUser {
  id: number;
  email: string;
  name: string;
  company: string;
  created_at: string;
}

class DatabaseTester {
  private testEmail = `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`;
  private testId: number | null = null;

  private log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {
    const timestamp = new Date().toISOString();
    const colors = {
      info: '\x1b[36m',    // cyan
      success: '\x1b[32m', // green
      error: '\x1b[31m',   // red
      warning: '\x1b[33m'  // yellow
    };
    const reset = '\x1b[0m';
    
    console.log(`${colors[type]}[${timestamp}] [${type.toUpperCase()}] ${message}${reset}`);
  }

  private async testDatabaseConnection(): Promise<TestResult> {
    try {
      this.log('Testing database connection...');
      
      const db = await initializeDatabase();
      
      // Test basic connection with a simple query
      const result = await db.exec('SELECT 1 as test');
      
      if (result && result.length > 0) {
        this.log('Database connection successful', 'success');
        return { success: true, message: 'Database connection established' };
      } else {
        throw new Error('No result from test query');
      }
    } catch (error) {
      this.log(`Database connection failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return { 
        success: false, 
        message: 'Database connection failed', 
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async testTableExists(): Promise<TestResult> {
    try {
      this.log('Checking if waitlist_users table exists...');
      
      const db = await initializeDatabase();
      
      const result = await db.exec(`
        SELECT name FROM sqlite_master 
        WHERE type='table' AND name='waitlist_users'
      `);
      
      if (result && result.length > 0 && result[0].values.length > 0) {
        this.log('waitlist_users table exists', 'success');
        return { success: true, message: 'Table exists' };
      } else {
        throw new Error('waitlist_users table does not exist');
      }
    } catch (error) {
      this.log(`Table check failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return { 
        success: false, 
        message: 'Table check failed', 
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async testCreateRecord(): Promise<TestResult> {
    try {
      this.log('Creating test record...');
      
      const db = await initializeDatabase();
      
      const testData = {
        email: this.testEmail,
        name: 'Test User',
        company: 'Test Company'
      };
      
      const result = await db.exec(`
        INSERT INTO waitlist_users (email, name, company) 
        VALUES (?, ?, ?)
      `, [testData.email, testData.name, testData.company]);
      
      // Get the last inserted row ID
      const lastId = await db.exec('SELECT last_insert_rowid() as id');
      
      if (lastId && lastId.length > 0 && lastId[0].values.length > 0) {
        this.testId = lastId[0].values[0][0] as number;
        this.log(`Test record created with ID: ${this.testId}`, 'success');
        return { 
          success: true, 
          message: 'Test record created successfully', 
          details: { id: this.testId, ...testData }
        };
      } else {
        throw new Error('Failed to get inserted record ID');
      }
    } catch (error) {
      this.log(`Record creation failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return { 
        success: false, 
        message: 'Record creation failed', 
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async testQueryRecord(): Promise<TestResult> {
    try {
      this.log('Querying test record...');
      
      if (!this.testId) {
        throw new Error('No test record ID available');
      }
      
      const db = await initializeDatabase();
      
      const result = await db.exec(`
        SELECT id, email, name, company, created_at 
        FROM waitlist_users 
        WHERE id = ?
      `, [this.testId]);
      
      if (result && result.length > 0 && result[0].values.length > 0) {
        const row = result[0].values[0];
        const record: WaitlistUser = {
          id: row[0] as number,
          email: row[1] as string,
          name: row[2] as string,
          company: row[3] as string,
          created_at: row[4] as string
        };
        
        // Verify the data matches what we inserted
        if (record.email === this.testEmail && record.name === 'Test User' && record.company === 'Test Company') {
          this.log('Test record queried successfully and data matches', 'success');
          return { 
            success: true, 
            message: 'Record queried successfully', 
            details: record
          };
        } else {
          throw new Error('Queried data does not match inserted data');
        }
      } else {
        throw new Error('No record found with the test ID');
      }
    } catch (error) {
      this.log(`Record query failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return { 
        success: false, 
        message: 'Record query failed', 
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async testCleanup(): Promise<TestResult> {
    try {
      this.log('Cleaning up test record...');
      
      if (!this.testId) {
        this.log('No test record to clean up', 'warning');
        return { success: true, message: 'No cleanup needed' };
      }
      
      const db = await initializeDatabase();
      
      const result = await db.exec(`
        DELETE FROM waitlist_users 
        WHERE id = ?
      `, [this.testId]);
      
      // Verify deletion
      const verifyResult = await db.exec(`
        SELECT COUNT(*) as count 
        FROM waitlist_users 
        WHERE id = ?
      `, [this.testId]);
      
      if (verifyResult && verifyResult.length > 0 && verifyResult[0].values.length > 0) {
        const count = verifyResult[0].values[0][0] as number;
        if (count === 0) {
          this.log('Test record cleaned up successfully', 'success');
          return { success: true, message: 'Cleanup completed' };
        } else {
          throw new Error('Record was not deleted');
        }
      } else {
        throw new Error('Could not verify deletion');
      }
    } catch (error) {
      this.log(`Cleanup failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return { 
        success: false, 
        message: 'Cleanup failed', 
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async testEnvironmentSetup(): Promise<TestResult> {
    try {
      this.log('Checking environment setup...');
      
      const dbPath = process.env.DATABASE_PATH;
      if (!dbPath) {
        throw new Error('DATABASE_PATH environment variable is not set');
      }
      
      this.log(`Database path: ${dbPath}`, 'info');
      
      // Check if the path is absolute or relative
      const isAbsolute = dbPath.startsWith('/') || dbPath.match(/^[A-Za-z]:/);
      this.log(`Path type: ${isAbsolute ? 'absolute' : 'relative'}`, 'info');
      
      return { 
        success: true, 
        message: 'Environment setup is correct', 
        details: { dbPath, isAbsolute }
      };
    } catch (error) {
      this.log(`Environment setup check failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return { 
        success: false, 
        message: 'Environment setup failed', 
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async testDatabaseSchema(): Promise<TestResult> {
    try {
      this.log('Checking database schema...');
      
      const db = await initializeDatabase();
      
      const result = await db.exec(`
        PRAGMA table_info(waitlist_users)
      `);
      
      if (result && result.length > 0) {
        const columns = result[0].values.map(row => ({
          name: row[1] as string,
          type: row[2] as string,
          notnull: row[3] as number,
          defaultValue: row[4],
          pk: row[5] as number
        }));
        
        // Check for required columns
        const requiredColumns = ['id', 'email', 'name', 'company', 'created_at'];
        const missingColumns = requiredColumns.filter(col => 
          !columns.some(dbCol => dbCol.name === col)
        );
        
        if (missingColumns.length > 0) {
          throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
        }
        
        this.log('Database schema is correct', 'success');
        return { 
          success: true, 
          message: 'Schema validation passed', 
          details: columns
        };
      } else {
        throw new Error('Could not retrieve table schema');
      }
    } catch (error) {
      this.log(`Schema check failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return { 
        success: false, 
        message: 'Schema validation failed', 
        details: error instanceof Error ? error.message : String(error)
      };
    }
  }

  public async runAllTests(): Promise<void> {
    this.log('Starting database functionality tests...', 'info');
    this.log('='.repeat(60), 'info');
    
    const tests = [
      { name: 'Environment Setup', test: () => this.testEnvironmentSetup() },
      { name: 'Database Connection', test: () => this.testDatabaseConnection() },
      { name: 'Table Existence', test: () => this.testTableExists() },
      { name: 'Database Schema', test: () => this.testDatabaseSchema() },
      { name: 'Record Creation', test: () => this.testCreateRecord() },
      { name: 'Record Query', test: () => this.testQueryRecord() },
      { name: 'Cleanup', test: () => this.testCleanup() }
    ];
    
    const results: Array<{ name: string; result: TestResult }> = [];
    let allPassed = true;
    
    for (const { name, test } of tests) {
      this.log(`\n--- Running ${name} Test ---`, 'info');
      
      try {
        const result = await test();
        results.push({ name, result });
        
        if (!result.success) {
          allPassed = false;
          // If a critical test fails, we might want to stop
          if (name === 'Database Connection' || name === 'Table Existence') {
            this.log(`Critical test failed: ${name}. Stopping further tests.`, 'error');
            break;
          }
        }
      } catch (error) {
        const errorResult: TestResult = {
          success: false,
          message: `Test execution failed: ${error instanceof Error ? error.message : String(error)}`,
          details: error instanceof Error ? error.stack : String(error)
        };
        results.push({ name, result: errorResult });
        allPassed = false;
        this.log(`Test ${name} threw an exception: ${error instanceof Error ? error.message : String(error)}`, 'error');
      }
    }
    
    // Print summary
    this.log('\n' + '='.repeat(60), 'info');
    this.log('TEST SUMMARY', 'info');
    this.log('='.repeat(60), 'info');
    
    for (const { name, result } of results) {
      const status = result.success ? 'PASS' : 'FAIL';
      const logType = result.success ? 'success' : 'error';
      this.log(`${name}: ${status} - ${result.message}`, logType);
      
      if (result.details && !result.success) {
        this.log(`  Details: ${JSON.stringify(result.details, null, 2)}`, 'error');
      }
    }
    
    const passCount = results.filter(r => r.result.success).length;
    const totalCount = results.length;
    
    this.log(`\nOverall Result: ${passCount}/${totalCount} tests passed`, allPassed ? 'success' : 'error');
    
    if (allPassed) {
      this.log('✅ All database functionality tests passed! The database is ready for use.', 'success');
    } else {
      this.log('❌ Some tests failed. Please check the database setup and configuration.', 'error');
    }
    
    // Exit with appropriate code
    process.exit(allPassed ? 0 : 1);
  }
}

// Execute the tests
if (require.main === module) {
  const tester = new DatabaseTester();
  tester.runAllTests().catch(error => {
    console.error('Fatal error running tests:', error);
    process.exit(1);
  });
}

export { DatabaseTester };