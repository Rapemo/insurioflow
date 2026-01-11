-- RPC Function to make all users admin
CREATE OR REPLACE FUNCTION make_all_users_admin()
RETURNS TABLE(message TEXT) AS $$
BEGIN
  -- Create admin profiles for users without profiles
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

  RETURN QUERY SELECT 'All users updated to admin role'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION make_all_users_admin() TO authenticated;
