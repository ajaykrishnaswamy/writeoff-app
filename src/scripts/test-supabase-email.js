const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './env' });

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabaseEmailInsert() {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test connection by trying to read from the table
    const { data: existingData, error: readError } = await supabase
      .from('waitlist_emails')
      .select('*')
      .limit(1);
    
    if (readError) {
      console.error('❌ Error reading from waitlist_emails table:', readError.message);
      console.log('This might mean the table doesn\'t exist or there are permission issues');
      return;
    }
    
    console.log('✅ Successfully connected to Supabase and accessed waitlist_emails table');
    console.log(`📊 Found ${existingData?.length || 0} existing records`);
    
    // Test inserting a new email
    const testEmail = {
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      phone: '+1234567890',
      signup_date: new Date().toISOString(),
    };
    
    console.log('🔄 Testing email insertion...');
    const { data: insertData, error: insertError } = await supabase
      .from('waitlist_emails')
      .insert([testEmail])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Error inserting email:', insertError.message);
      return;
    }
    
    console.log('✅ Successfully inserted test email into waitlist_emails table');
    console.log('📧 Inserted email:', insertData);
    
    // Clean up - delete the test record
    console.log('🔄 Cleaning up test record...');
    const { error: deleteError } = await supabase
      .from('waitlist_emails')
      .delete()
      .eq('email', testEmail.email);
    
    if (deleteError) {
      console.warn('⚠️ Warning: Could not delete test record:', deleteError.message);
    } else {
      console.log('✅ Test record cleaned up successfully');
    }
    
    console.log('\n🎉 Supabase waitlist_emails table is working correctly!');
    console.log('Your waitlist form should now save emails to Supabase.');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the test
testSupabaseEmailInsert(); 