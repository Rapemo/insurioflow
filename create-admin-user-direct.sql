-- ========================================
-- ADMIN USER CREATION SCRIPT
-- Run this directly in Supabase SQL Editor
-- ========================================

-- First, let's check if the admin user already exists
DO $$
DECLARE
    admin_count INTEGER;
    user_id UUID;
BEGIN
    -- Count existing admin users
    SELECT COUNT(*) INTO admin_count 
    FROM public.user_profiles 
    WHERE role = 'admin';
    
    IF admin_count > 0 THEN
        RAISE NOTICE '✅ Admin user already exists. Total admin users: %', admin_count;
        
        -- Show existing admin users
        FOR user_id IN SELECT user_id FROM public.user_profiles WHERE role = 'admin' LOOP
            RAISE NOTICE 'Admin User ID: %', user_id;
        END LOOP;
    ELSE
        RAISE NOTICE 'ℹ️  No admin users found. Creating admin user...';
    END IF;
END $$;

-- ========================================
-- METHOD 1: Create admin profile for existing auth user
-- ========================================

-- Check if there's an auth user with admin@insurio.com email
DO $$
DECLARE
    auth_user_id UUID;
    profile_count INTEGER;
BEGIN
    -- Try to find existing auth user
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = 'admin@insurio.com' 
    LIMIT 1;
    
    IF auth_user_id IS NOT NULL THEN
        RAISE NOTICE '🔍 Found existing auth user: %', auth_user_id;
        
        -- Check if profile already exists
        SELECT COUNT(*) INTO profile_count
        FROM public.user_profiles 
        WHERE user_id = auth_user_id;
        
        IF profile_count = 0 THEN
            -- Create admin profile
            INSERT INTO public.user_profiles (
                user_id,
                role,
                full_name,
                created_at,
                updated_at
            ) VALUES (
                auth_user_id,
                'admin',
                'Admin User',
                NOW(),
                NOW()
            );
            
            RAISE NOTICE '✅ Admin profile created for existing auth user';
        ELSE
            -- Update existing profile to admin
            UPDATE public.user_profiles 
            SET role = 'admin',
                full_name = 'Admin User',
                updated_at = NOW()
            WHERE user_id = auth_user_id;
            
            RAISE NOTICE '✅ Existing profile updated to admin role';
        END IF;
    ELSE
        RAISE NOTICE '⚠️  No auth user found with admin@insurio.com';
        RAISE NOTICE 'ℹ️  Please create the auth user first in Supabase Auth dashboard:';
        RAISE NOTICE '    - Email: admin@insurio.com';
        RAISE NOTICE '    - Password: admin123';
        RAISE NOTICE '    - Confirm email: Yes';
    END IF;
END $$;

-- ========================================
-- METHOD 2: Create admin profile for any existing user
-- (Use this if you want to make an existing user admin)
-- ========================================

-- Uncomment and modify this section to make an existing user admin
/*
DO $$
DECLARE
    target_email TEXT := 'your-existing-user@example.com'; -- Change this email
    auth_user_id UUID;
BEGIN
    SELECT id INTO auth_user_id 
    FROM auth.users 
    WHERE email = target_email 
    LIMIT 1;
    
    IF auth_user_id IS NOT NULL THEN
        INSERT INTO public.user_profiles (
            user_id,
            role,
            full_name,
            created_at,
            updated_at
        ) VALUES (
            auth_user_id,
            'admin',
            'Admin User',
            NOW(),
            NOW()
        ) ON CONFLICT (user_id) DO UPDATE SET
            role = 'admin',
            updated_at = NOW();
            
        RAISE NOTICE '✅ Made % an admin user', target_email;
    ELSE
        RAISE NOTICE '❌ User % not found', target_email;
    END IF;
END $$;
*/

-- ========================================
-- VERIFICATION & RESULTS
-- ========================================

-- Show all admin users
RAISE NOTICE '';
RAISE NOTICE '📋 === ADMIN USERS ===';
SELECT 
    'Admin User' as user_type,
    u.email,
    up.role,
    up.full_name,
    up.created_at,
    up.updated_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
WHERE up.role = 'admin'
ORDER BY up.created_at DESC;

-- Show user counts by role
RAISE NOTICE '';
RAISE NOTICE '📊 === USER COUNTS BY ROLE ===';
SELECT 
    role,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM public.user_profiles
GROUP BY role
ORDER BY count DESC;

-- Show all users for reference
RAISE NOTICE '';
RAISE NOTICE '👥 === ALL USERS ===';
SELECT 
    u.email,
    up.role,
    up.full_name,
    up.created_at
FROM auth.users u
JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY up.created_at DESC;

-- ========================================
-- NEXT STEPS
-- ========================================

RAISE NOTICE '';
RAISE NOTICE '🎯 === NEXT STEPS ===';
RAISE NOTICE '1. If no auth user was found, create one in Supabase Auth dashboard:';
RAISE NOTICE '   - Go to Authentication > Users';
RAISE NOTICE '   - Click "Add user"';
RAISE NOTICE '   - Email: admin@insurio.com';
RAISE NOTICE '   - Password: admin123';
RAISE NOTICE '   - Check "Auto-confirm user"';
RAISE NOTICE '   - Click "Save"';
RAISE NOTICE '';
RAISE NOTICE '2. After creating the auth user, run this script again';
RAISE NOTICE '';
RAISE NOTICE '3. Test login at: http://localhost:3000/admin/login';
RAISE NOTICE '   - Email: admin@insurio.com';
RAISE NOTICE '   - Password: admin123';
RAISE NOTICE '';
RAISE NOTICE '4. Access dashboard at: http://localhost:3000/dashboard';
