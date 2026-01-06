-- Create user_profiles table for role-based authentication
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin', 'agent')),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (can manage all profiles)
CREATE POLICY "Admins can manage all profiles" ON public.user_profiles 
  FOR ALL USING (
    auth.uid() IN (
      SELECT user_id FROM public.user_profiles WHERE role = 'admin'
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_company_id ON public.user_profiles(company_id);

-- Create trigger to update updated_at column
CREATE TRIGGER update_user_profiles_updated_at 
BEFORE UPDATE ON public.user_profiles 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin user (optional - for initial setup)
INSERT INTO public.user_profiles (user_id, role, full_name, created_at, updated_at)
SELECT 
  id,
  'admin',
  email,
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@insurio.com'
LIMIT 1;
