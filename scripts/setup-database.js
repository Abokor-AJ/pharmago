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

async function setupDatabase() {
  console.log('🔧 Setting up PharmaGo database...\n');

  try {
    // Check if users table exists and has data
    console.log('📋 Checking users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.error('❌ Error accessing users table:', usersError);
      console.log('\n📝 Please make sure you have created the users table with this SQL:');
      console.log(`
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'pharmacy', 'delivery', 'customer')),
  must_change_password BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
      return;
    }

    console.log(`✅ Users table accessible. Found ${users.length} users.`);

    if (users.length === 0) {
      console.log('\n👤 No users found. Creating admin user...');
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          username: 'admin',
          password_hash: 'admin123',
          role: 'admin',
          must_change_password: true,
          is_active: true
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ Error creating admin user:', insertError);
        return;
      }

      console.log('✅ Admin user created successfully!');
      console.log('📝 Login credentials:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
    } else {
      console.log('\n👥 Existing users:');
      users.forEach(user => {
        console.log(`   - ${user.username} (${user.role}) - Active: ${user.is_active}`);
      });

      // Check if admin user exists
      const adminUser = users.find(u => u.username === 'admin');
      if (!adminUser) {
        console.log('\n👤 Admin user not found. Creating admin user...');
        
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            username: 'admin',
            password_hash: 'admin123',
            role: 'admin',
            must_change_password: true,
            is_active: true
          })
          .select()
          .single();

        if (insertError) {
          console.error('❌ Error creating admin user:', insertError);
          return;
        }

        console.log('✅ Admin user created successfully!');
      } else {
        console.log('\n✅ Admin user already exists');
        console.log('📝 Login credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
      }
    }

    // Test login
    console.log('\n🔐 Testing login...');
    const { data: testUser, error: testError } = await supabase
      .from('users')
      .select('*')
      .eq('username', 'admin')
      .eq('password_hash', 'admin123')
      .eq('is_active', true)
      .single();

    if (testError || !testUser) {
      console.error('❌ Login test failed:', testError);
    } else {
      console.log('✅ Login test successful!');
      console.log(`   User ID: ${testUser.id}`);
      console.log(`   Role: ${testUser.role}`);
      console.log(`   Must change password: ${testUser.must_change_password}`);
    }

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupDatabase(); 