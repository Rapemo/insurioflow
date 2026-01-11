-- Fix authentication loading issue
-- Create user profile for existing authenticated user

-- The user devaicovera@gmail.com exists but has no profile
-- This causes the auth context to stay in loading state

-- Create profile for the existing user
INSERT INTO public.user_profiles (
    user_id,
    role,
    full_name,
    created_at,
    updated_at
) 
SELECT 
    id,
    'admin',  -- Make this user an admin
    'Admin User',
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'devaicovera@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    role = 'admin',
    full_name = 'Admin User',
    updated_at = NOW();

-- Verify the profile was created
SELECT 
    'PROFILE CREATED FOR:' as status,
    u.email,
    up.role,
    up.full_name,
    up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.email = 'devaicovera@gmail.com';

-- Show all current users
SELECT 
    'ALL CURRENT USERS:' as summary,
    u.email,
    up.role,
    up.full_name,
    up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY up.created_at DESC;
