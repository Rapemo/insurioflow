-- Direct SQL to create admin user
-- Run this in your Supabase SQL Editor

-- Step 1: Create the auth user (this might fail if user already exists)
-- You may need to create the user via Supabase Auth dashboard first

-- Step 2: Create or update the user profile with admin role
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
  u.email,
  up.role,
  up.full_name,
  up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.email = 'admin@insurio.com';
