-- ========================================
-- ADMIN USER CREATION SCRIPT (Standard SQL)
-- Run this directly in Supabase SQL Editor
-- ========================================

-- Step 1: Check if admin user already exists
SELECT 'CHECKING EXISTING ADMIN USERS...' as status;
SELECT 
    COUNT(*) as admin_count,
    role
FROM public.user_profiles 
WHERE role = 'admin'
GROUP BY role;

-- Step 2: Create admin profile for existing auth user
-- First, let's see if there's an auth user with admin@insurio.com
SELECT 'SEARCHING FOR AUTH USER admin@insurio.com...' as status;

-- This will show if the auth user exists
SELECT 
    id as auth_user_id,
    email,
    created_at
FROM auth.users 
WHERE email = 'admin@insurio.com';

-- Step 3: Create or update the admin profile
-- This will create the profile if auth user exists, or show what's needed
INSERT INTO public.user_profiles (
    user_id,
    role,
    full_name,
    created_at,
    updated_at
) 
SELECT 
    id,
    'admin',
    'Admin User',
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'admin@insurio.com'
ON CONFLICT (user_id) DO UPDATE SET
    role = 'admin',
    full_name = 'Admin User',
    updated_at = NOW();

-- Step 4: Verify results
SELECT 'VERIFICATION RESULTS:' as status;

-- Show all admin users
SELECT 
    'ADMIN USERS:' as user_type,
    u.email,
    up.role,
    up.full_name,
    up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE up.role = 'admin'
ORDER BY up.created_at DESC;

-- Show user counts by role
SELECT 
    'USER COUNTS BY ROLE:' as summary,
    role,
    COUNT(*) as count
FROM public.user_profiles
GROUP BY role
ORDER BY count DESC;

-- Show all users for reference
SELECT 
    'ALL USERS:' as user_list,
    u.email,
    up.role,
    up.full_name,
    up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY up.created_at DESC;

-- ========================================
-- NEXT STEPS (if no admin user was created)
-- ========================================

-- If the above query didn't create an admin user, you need to:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Click "Add user"
-- 3. Email: admin@insurio.com
-- 4. Password: admin123
-- 5. Check "Auto-confirm user"
-- 6. Click "Save"
-- 7. Run this script again

-- Test login credentials:
-- Email: admin@insurio.com
-- Password: admin123
-- Login URL: http://localhost:3000/admin/login
-- Dashboard: http://localhost:3000/dashboard
