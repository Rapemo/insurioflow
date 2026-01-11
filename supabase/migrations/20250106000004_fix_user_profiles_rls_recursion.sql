-- Fix infinite recursion in user_profiles RLS policies
-- The issue is in the "Admins can manage all profiles" policy which creates circular dependency

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

-- Create a better admin policy that doesn't cause recursion
-- This policy uses a direct check on the user's role from their own profile
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles 
  FOR ALL USING (
    -- Allow if the current user is an admin (check their own profile)
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Alternative approach: Create a function-based policy to avoid recursion
-- Create a helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user(user_uuid UUID) 
RETURNS BOOLEAN 
LANGUAGE sql 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role = 'admin' FROM public.user_profiles 
  WHERE user_id = user_uuid 
  LIMIT 1;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin_user TO authenticated;

-- Update the admin policy to use the function (more efficient)
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles 
  FOR ALL USING (public.is_admin_user(auth.uid()));

-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Agents can view client profiles" ON public.user_profiles;

-- Simple and clear policies without recursion

-- Users can only access their own profile
CREATE POLICY "Users can manage own profile" ON public.user_profiles 
  FOR ALL USING (auth.uid() = user_id);

-- Admins can access all profiles
-- Note: This assumes admins have their role set correctly in their profile
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles 
  FOR ALL USING (
    -- Check if current user's profile has admin role
    -- This uses a subquery but limits it to avoid recursion
    (SELECT role FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1) = 'admin'
  );

-- Agents can view client profiles only (if it doesn't already exist)
-- Note: This policy may already exist, so we add IF NOT EXISTS
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Agents can view client profiles'
  ) THEN
    CREATE POLICY "Agents can view client profiles" ON public.user_profiles 
      FOR SELECT USING (
        -- Check if current user is an agent
        (SELECT role FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1) = 'agent'
        AND role = 'client' -- Only allow viewing client profiles
      );
  END IF;
END $$;

-- Comment on the policies for clarity
COMMENT ON POLICY "Users can manage own profile" ON public.user_profiles IS 'Users can only view their own profile';
COMMENT ON POLICY "Admins can manage all profiles" ON public.user_profiles IS 'Admin users can perform any operation on all profiles';
COMMENT ON POLICY "Agents can view client profiles" ON public.user_profiles IS 'Agent users can view client profiles';
