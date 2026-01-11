-- Create RPC function to bypass RLS for user profile operations
-- This function will be used as a fallback when RLS policies cause recursion

-- Function to get user profile bypassing RLS
CREATE OR REPLACE FUNCTION public.get_user_profile_admin(user_uuid UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  role TEXT,
  company_id UUID,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    up.id,
    up.user_id,
    up.role,
    up.company_id,
    up.full_name,
    up.phone,
    up.avatar_url,
    up.preferences,
    up.created_at,
    up.updated_at
  FROM public.user_profiles up
  WHERE up.user_id = user_uuid;
$$;

-- Function to create user profile bypassing RLS
CREATE OR REPLACE FUNCTION public.create_user_profile_admin(
  p_user_id UUID,
  p_role TEXT DEFAULT 'client',
  p_full_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_company_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  role TEXT,
  company_id UUID,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate role
  IF p_role NOT IN ('client', 'admin', 'agent') THEN
    RAISE EXCEPTION 'Invalid role: %', p_role;
  END IF;

  -- Insert the profile
  INSERT INTO public.user_profiles (
    user_id,
    role,
    full_name,
    phone,
    company_id,
    preferences,
    created_at,
    updated_at
  ) VALUES (
    p_user_id,
    p_role,
    p_full_name,
    p_phone,
    p_company_id,
    '{}'::jsonb,
    now(),
    now()
  )
  RETURNING 
    id,
    user_id,
    role,
    company_id,
    full_name,
    phone,
    avatar_url,
    preferences,
    created_at,
    updated_at;
  
  RETURN;
END;
$$;

-- Function to update user profile bypassing RLS
CREATE OR REPLACE FUNCTION public.update_user_profile_admin(
  p_user_id UUID,
  p_full_name TEXT DEFAULT NULL,
  p_phone TEXT DEFAULT NULL,
  p_company_id UUID DEFAULT NULL,
  p_preferences JSONB DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  role TEXT,
  company_id UUID,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the profile
  UPDATE public.user_profiles SET
    full_name = COALESCE(p_full_name, full_name),
    phone = COALESCE(p_phone, phone),
    company_id = COALESCE(p_company_id, company_id),
    preferences = COALESCE(p_preferences, preferences),
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING 
    id,
    user_id,
    role,
    company_id,
    full_name,
    phone,
    avatar_url,
    preferences,
    created_at,
    updated_at;
  
  RETURN;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_profile_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_profile_admin TO authenticated;

-- Grant execute permissions to service role for system operations
GRANT EXECUTE ON FUNCTION public.get_user_profile_admin TO service_role;
GRANT EXECUTE ON FUNCTION public.create_user_profile_admin TO service_role;
GRANT EXECUTE ON FUNCTION public.update_user_profile_admin TO service_role;

-- Add comments
COMMENT ON FUNCTION public.get_user_profile_admin IS 'Get user profile bypassing RLS for admin operations';
COMMENT ON FUNCTION public.create_user_profile_admin IS 'Create user profile bypassing RLS for admin operations';
COMMENT ON FUNCTION public.update_user_profile_admin IS 'Update user profile bypassing RLS for admin operations';
