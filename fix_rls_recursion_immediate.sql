-- Fix RLS recursion immediately
-- This script will resolve the infinite recursion issue

-- First, completely disable RLS to remove all policies
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Now drop all existing policies (they should be removable when RLS is disabled)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Agents can view client profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role bypass" ON public.user_profiles;
DROP POLICY IF EXISTS "Service role full access" ON public.user_profiles;

-- Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies

-- 1. Users can only access their own profile
CREATE POLICY "Users can manage own profile" ON public.user_profiles 
  FOR ALL USING (auth.uid() = user_id);

-- 2. Service role can bypass all restrictions (for system operations)
CREATE POLICY "Service role full access" ON public.user_profiles 
  FOR ALL USING (auth.role() = 'service_role');


-- 3. For admin access, we'll use a different approach
-- Instead of checking their role in the same table, we'll use auth.jwt()
-- This requires the role to be included in the JWT token
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles 
  FOR ALL USING (
    auth.jwt()->>'role' = 'admin'
  );

-- Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;
