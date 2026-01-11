-- Check existing admin users in the system

-- 1. Check if admin@insurio.com exists in auth.users
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users 
WHERE email = 'admin@insurio.com';

-- 2. Check user_profiles for admin@insurio.com
SELECT 
  up.*,
  u.email
FROM public.user_profiles up
JOIN auth.users u ON up.user_id = u.id
WHERE u.email = 'admin@insurio.com';

-- 3. Check all admin users
SELECT 
  u.id,
  u.email,
  u.created_at,
  up.role,
  up.full_name,
  up.created_at as profile_created
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE up.role = 'admin'
ORDER BY u.created_at DESC;

-- 4. Check all users without profiles
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_profiles)
ORDER BY created_at DESC;
