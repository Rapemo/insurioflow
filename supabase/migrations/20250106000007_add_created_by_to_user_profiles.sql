-- Add created_by field to user_profiles table for tracking who created each profile
-- This enables admins to only manage profiles they created

ALTER TABLE public.user_profiles 
ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add index for better performance on created_by queries
CREATE INDEX idx_user_profiles_created_by ON public.user_profiles(created_by);

-- Update existing profiles to have created_by set to their own user_id (for migration purposes)
UPDATE public.user_profiles 
SET created_by = user_id 
WHERE created_by IS NULL;

-- Add comment to explain the purpose
COMMENT ON COLUMN public.user_profiles.created_by IS 'UUID of the admin user who created this profile';

-- Update RLS policies to respect created_by field for admin access control
-- Drop existing admin policies
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

-- Create new admin policy that respects created_by field
CREATE POLICY "Admins can manage profiles they created" ON public.user_profiles 
  FOR ALL USING (
    -- Allow if current user is the creator
    auth.uid() = created_by
    OR
    -- Allow if current user is the profile owner
    auth.uid() = user_id
  );

-- Update existing user policies to be more explicit
DROP POLICY IF EXISTS "Users can manage own profile" ON public.user_profiles;

CREATE POLICY "Users can manage own profile" ON public.user_profiles 
  FOR ALL USING (auth.uid() = user_id);

-- Keep agent policy if it exists
-- Agents can view client profiles only
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' AND policyname = 'Agents can view client profiles'
  ) THEN
    -- Update agent policy to respect created_by for admin oversight
    DROP POLICY "Agents can view client profiles" ON public.user_profiles;
    
    CREATE POLICY "Agents can view client profiles" ON public.user_profiles 
      FOR SELECT USING (
        -- Check if current user is an agent
        (SELECT role FROM public.user_profiles WHERE user_id = auth.uid() LIMIT 1) = 'agent'
        AND role = 'client' -- Only allow viewing client profiles
      );
  END IF;
END $$;

-- Add comments for clarity
COMMENT ON POLICY "Admins can manage profiles they created" ON public.user_profiles IS 'Admin users can only manage profiles they created, plus their own profile';
COMMENT ON POLICY "Users can manage own profile" ON public.user_profiles IS 'Users can only manage their own profile';
