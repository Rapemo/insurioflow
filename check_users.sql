-- Query to check current users in the system
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.email_confirmed_at,
  up.role,
  up.full_name,
  up.company_id,
  up.phone,
  up.created_at as profile_created_at,
  up.updated_at as profile_updated_at
FROM auth.users u
LEFT JOIN public.user_profiles up ON u.id = up.user_id
ORDER BY u.created_at DESC;
