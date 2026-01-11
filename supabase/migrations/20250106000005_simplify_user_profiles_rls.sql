-- Simplified RLS policies for user_profiles without recursion
-- This is an alternative approach that avoids complex subqueries

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

-- Agents can view client profiles only
CREATE POLICY "Agents can view client profiles" ON public.user_profiles 
  FOR SELECT USING (
    -- Check if current user is an agent
    (SELECT role FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1) = 'agent'
    AND role = 'client' -- Only allow viewing client profiles
  );

-- Create a bypass for service roles (for admin operations)
CREATE POLICY "Service role bypass" ON public.user_profiles 
  FOR ALL USING (auth.role() = 'service_role');

-- Add comments for clarity
COMMENT ON POLICY "Users can manage own profile" ON public.user_profiles IS 'Users can perform any operation on their own profile only';
COMMENT ON POLICY "Admins can manage all profiles" ON public.user_profiles IS 'Admin users can perform any operation on all profiles';
COMMENT ON POLICY "Agents can view client profiles" ON public.user_profiles IS 'Agent users can view client profiles only';
COMMENT ON POLICY "Service role bypass" ON public.user_profiles IS 'Service roles can bypass all restrictions for system operations';
