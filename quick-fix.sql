-- QUICK FIX: Create profile for devaicovera@gmail.com
-- This will immediately fix the loading issue

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
WHERE email = 'devaicovera@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    role = 'admin',
    updated_at = NOW();

-- Verify it was created
SELECT 
    'SUCCESS: Profile created for devaicovera@gmail.com' as status,
    u.email,
    up.role,
    up.full_name
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE u.email = 'devaicovera@gmail.com';
