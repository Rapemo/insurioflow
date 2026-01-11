-- SIMPLE SCRIPT: Make existing users admins
-- Run this in Supabase SQL Editor

-- First, see current users without profiles
SELECT 
  u.id,
  u.email,
  u.created_at,
  up.role as current_role
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;

-- Create admin profiles for all existing users
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
  COALESCE(u.user_metadata->>'full_name', u.email, 'Admin User'),
  NOW(),
  NOW()
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles up WHERE up.user_id = u.id
);

-- Update existing profiles to admin role
UPDATE public.user_profiles 
SET role = 'admin', updated_at = NOW()
WHERE role != 'admin';

-- Verify the changes
SELECT 
  u.id,
  u.email,
  up.role,
  up.full_name,
  up.created_at,
  up.updated_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;
