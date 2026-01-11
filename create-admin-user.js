#!/usr/bin/env node

/**
 * Admin User Creation Script
 * This script creates an admin user in the Supabase database
 * Usage: node create-admin-user.js
 */

const { createClient } = require('@supabase/supabase-js');

// Configuration - Update these with your environment variables
const SUPABASE_URL = 'https://zberkdnwjkzqjfvzgxkv.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZXJrZG53amt6cWpmdnpneGt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTM2Nzc0OCwiZXhwIjoyMDgwOTQzNzQ4fQ.pM5qL-5gQ2RJwGhXqzYXqL2jQ6x7J3Q8R4d2K1mF3Y';

const ADMIN_EMAIL = 'admin@insurio.com';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin User';

async function createAdminUser() {
  console.log('🚀 Creating admin user...');
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Step 1: Create the auth user
    console.log('📝 Creating auth user...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: {
        full_name: ADMIN_NAME,
        role: 'admin'
      }
    });

    if (authError && !authError.message.includes('already registered')) {
      throw new Error(`Auth error: ${authError.message}`);
    }

    let userId;
    
    if (authData.user) {
      userId = authData.user.id;
      console.log('✅ New auth user created with ID:', userId);
    } else {
      // User might already exist, get their ID
      console.log('🔍 User might already exist, searching...');
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers.users.find(u => u.email === ADMIN_EMAIL);
      
      if (!existingUser) {
        throw new Error('Could not find or create auth user');
      }
      
      userId = existingUser.id;
      console.log('✅ Found existing user with ID:', userId);
    }

    // Step 2: Create/update user profile with admin role
    console.log('👤 Creating user profile...');
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        role: 'admin',
        full_name: ADMIN_NAME,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (profileError) {
      throw new Error(`Profile error: ${profileError.message}`);
    }

    console.log('✅ Admin user profile created successfully!');
    console.log('');
    console.log('📋 Admin User Details:');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Name: ${ADMIN_NAME}`);
    console.log(`   Role: admin`);
    console.log('');
    console.log('🔗 Login URLs:');
    console.log(`   Main: http://localhost:3000`);
    console.log(`   Admin Login: http://localhost:3000/admin/login`);
    console.log(`   Dashboard: http://localhost:3000/dashboard`);

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();
