const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupNewDatabase() {
  console.log('🔧 Setting up PharmaGo database with new schema...\n');

  try {
    // Check if admins table exists and has data
    console.log('📋 Checking admins table...');
    const { data: admins, error: adminsError } = await supabase
      .from('admins')
      .select('*')
      .limit(5);

    if (adminsError) {
      console.error('❌ Error accessing admins table:', adminsError);
      console.log('\n📝 Please run the new-database-schema.sql script in your Supabase SQL Editor first!');
      return;
    }

    console.log(`✅ Admins table accessible. Found ${admins.length} admins.`);

    // Check if users table exists and has data
    console.log('\n📋 Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.error('❌ Error accessing users table:', usersError);
      return;
    }

    console.log(`✅ Users table accessible. Found ${users.length} users.`);

    // Display existing data
    if (admins.length > 0) {
      console.log('\n👑 Existing admins:');
      admins.forEach(admin => {
        console.log(`   - ${admin.username} - Active: ${admin.is_active} - Must change password: ${admin.must_change_password}`);
      });
    }

    if (users.length > 0) {
      console.log('\n👥 Existing users:');
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.role}) - Active: ${user.is_active} - Must change password: ${user.must_change_password}`);
      });
    }

    // Test admin login
    console.log('\n🔐 Testing admin login...');
    const { data: testAdmin, error: testAdminError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', 'admin')
      .eq('is_active', true)
      .eq('password_hash', 'superadmin123')
      .single();

    if (testAdminError || !testAdmin) {
      console.error('❌ Admin login test failed:', testAdminError);
    } else {
      console.log('✅ Admin login test successful!');
      console.log(`   Admin ID: ${testAdmin.id}`);
      console.log(`   Username: ${testAdmin.username}`);
      console.log(`   Password hash: ${testAdmin.password_hash}`);
      console.log(`   Must change password: ${testAdmin.must_change_password}`);
    }

    // Test user login
    console.log('\n🔐 Testing user login...');
    const { data: testUser, error: testUserError } = await supabase
      .from('users')
      .select('*')
      .eq('phone', '77824710')
      .eq('password_hash', 'pharmacy123')
      .eq('is_active', true)
      .single();

    if (testUserError || !testUser) {
      console.error('❌ User login test failed:', testUserError);
    } else {
      console.log('✅ User login test successful!');
      console.log(`   User ID: ${testUser.id}`);
      console.log(`   Role: ${testUser.role}`);
      console.log(`   Must change password: ${testUser.must_change_password}`);
    }

    console.log('\n📝 Available login credentials:');
    console.log('   Admin: username=admin, password=superadmin123');
    console.log('   Pharmacy: phone=77824710, password=pharmacy123');
    console.log('   Delivery: phone=77824087, password=delivery123');
    console.log('   Customer: phone=77746161, password=customer123');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupNewDatabase(); 