-- Create admin user script
-- This will create an admin user with email admin@insurio.com

-- First, create the auth user (this needs to be done via Supabase auth)
-- Then create the user profile entry

-- Insert admin user profile (assuming auth user already exists)
INSERT INTO public.user_profiles (
  user_id, 
  role, 
  full_name, 
  created_at, 
  updated_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@insurio.com' LIMIT 1),
  'admin',
  'Admin User',
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET
  role = 'admin',
  full_name = 'Admin User',
  updated_at = NOW();

-- Check if admin user exists
SELECT 
  u.email,
  up.role,
  up.full_name,
  up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.email = 'admin@insurio.com';
