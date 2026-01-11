-- Check existing users in database
-- Run this in Supabase SQL Editor

-- Check user_profiles table
SELECT 
  up.id,
  up.user_id,
  up.role,
  up.full_name,
  up.company_id,
  up.created_at,
  up.updated_at,
  -- Try to get email from auth users (this might not work with client permissions)
  u.email
FROM public.user_profiles up
LEFT JOIN auth.users u ON up.user_id = u.id
ORDER BY up.created_at DESC;

-- Count users by role
SELECT 
  role,
  COUNT(*) as count
FROM public.user_profiles
GROUP BY role;

-- Check if admin user exists
SELECT 
  COUNT(*) as admin_count
FROM public.user_profiles
WHERE role = 'admin';

-- Show recent user activity
SELECT 
  up.role,
  up.full_name,
  up.created_at,
  up.updated_at
FROM public.user_profiles up
ORDER BY up.updated_at DESC
LIMIT 10;
