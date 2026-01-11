-- Create admin@insurio.com account with known password

-- Step 1: Create the user in auth.users (if not exists)
-- This needs to be done via Supabase Auth API or admin interface

-- Step 2: Create admin profile for the user
INSERT INTO public.user_profiles (
  user_id,
  role,
  full_name,
  created_at,
  updated_at
)
SELECT 
  u.id,
  'admin',
  'System Administrator',
  NOW(),
  NOW()
FROM auth.users u
WHERE u.email = 'admin@insurio.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_profiles up WHERE up.user_id = u.id
);

-- Alternative: Create admin profile for any existing user
-- Replace 'USER_ID_HERE' with actual user ID from auth.users
INSERT INTO public.user_profiles (
  user_id,
  role,
  full_name,
  created_at,
  updated_at
)
VALUES (
  'USER_ID_HERE', -- Replace with actual user ID
  'admin',
  'System Administrator',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Verify admin creation
SELECT 
  u.email,
  up.role,
  up.full_name,
  up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE up.role = 'admin';
