-- Fix profile for existing user: devaicovera@gmail.com (ID: e9162f23-0559-4854-a42d-0ecf93f26f5c)

-- First, let's check if a profile already exists
SELECT * FROM public.user_profiles WHERE user_id = 'e9162f23-0559-4854-a42d-0ecf93f26f5c';

-- If no profile exists, create one with admin role
INSERT INTO public.user_profiles (
  id,
  user_id, 
  role, 
  full_name, 
  phone, 
  created_at, 
  updated_at
) VALUES (
  gen_random_uuid(),
  'e9162f23-0559-4854-a42d-0ecf93f26f5c',
  'admin',
  'Admin User',
  NULL,
  NOW(),
  NOW()
) ON CONFLICT (user_id) DO NOTHING;

-- Verify the profile was created
SELECT * FROM public.user_profiles WHERE user_id = 'e9162f23-0559-4854-a42d-0ecf93f26f5c';

-- Also check all existing users without profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  up.role as profile_role
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
WHERE up.user_id IS NULL
ORDER BY u.created_at DESC;
