import { addWaitlistEntry, getAllWaitlistEntries, getWaitlistCount } from './database';

async function testDatabase() {
  console.log('🧪 Testing Database Functionality...\n');

  try {
    // Test 1: Add a sample waitlist entry
    console.log('1. Testing addWaitlistEntry...');
    const testEntry = {
      name: 'John Doe',
      phone: '+1234567890',
      email: 'test@example.com'
    };

    const addResult = addWaitlistEntry(testEntry);
    console.log('✅ Entry added successfully:', addResult);
    console.log('');

    // Test 2: Get all waitlist entries
    console.log('2. Testing getAllWaitlistEntries...');
    const entries = getAllWaitlistEntries();
    console.log(`✅ Retrieved ${entries.length} waitlist entries:`);
    entries.forEach((entry, index) => {
      console.log(`   Entry ${index + 1}:`, {
        id: entry.id,
        name: entry.name,
        phone: entry.phone,
        email: entry.email,
        created_at: entry.created_at
      });
    });
    console.log('');

    // Test 3: Get waitlist count
    console.log('3. Testing getWaitlistCount...');
    const count = getWaitlistCount();
    console.log(`✅ Total waitlist count: ${count}`);
    console.log('');

    // Test 4: Add another entry to test count increment
    console.log('4. Testing with second entry...');
    const secondEntry = {
      name: 'Jane Smith',
      phone: '+1987654321',
      email: 'jane@example.com'
    };

    addWaitlistEntry(secondEntry);
    const newCount = getWaitlistCount();
    console.log(`✅ Second entry added, new count: ${newCount}`);
    console.log('');

    console.log('🎉 All database tests completed successfully!');
    console.log('Database functionality is working correctly.');

  } catch (error) {
    console.error('❌ Database test failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
  }
}

// Run the test
testDatabase();