-- Create benefits table
CREATE TABLE public.benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('medical', 'dental', 'vision', 'life', 'disability', 'wellness')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.benefits ENABLE ROW LEVEL SECURITY;

-- Create policies for benefits table
CREATE POLICY "Enable read access for all users"
  ON public.benefits
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON public.benefits
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
  ON public.benefits
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION public.update_benefits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_benefits_updated_at
BEFORE UPDATE ON public.benefits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
