-- Comprehensive Admin User Creation SQL Script
-- Run this in your Supabase SQL Editor

-- Step 1: Create the auth user (if not exists)
-- Note: This might need to be done via Supabase Auth dashboard first
-- But we'll try with the admin function if available

-- Step 2: Create or update user profile with admin role
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

-- Step 3: Verify the admin user was created
SELECT 
  'SUCCESS: Admin User Created' as status,
  u.email,
  up.role,
  up.full_name,
  up.created_at,
  up.updated_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.email = 'admin@insurio.com';

-- Step 4: Show all current users for verification
SELECT 
  'ALL CURRENT USERS' as info,
  u.email,
  up.role,
  up.full_name,
  up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY up.created_at DESC;

-- Step 5: Count users by role
SELECT 
  'USER COUNTS BY ROLE' as summary,
  role,
  COUNT(*) as count
FROM public.user_profiles
GROUP BY role
ORDER BY count DESC;
