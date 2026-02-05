-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  logo_url TEXT,
  website TEXT,
  twitter_handle TEXT,
  linkedin_url TEXT,
  team_size TEXT,            -- e.g., "1-10", "11-50"
  location TEXT,
  founded_date DATE,
  status TEXT DEFAULT 'active',
  tags TEXT[],               -- e.g., ["B2B", "SaaS", "AI"]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company founders junction table
CREATE TABLE IF NOT EXISTS public.company_founders (
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  founder_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT,                 -- e.g., "Co-founder & CEO"
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (company_id, founder_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_companies_location ON public.companies(location);
CREATE INDEX IF NOT EXISTS idx_companies_tags ON public.companies USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_company_founders_founder ON public.company_founders(founder_id);

-- RLS Policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_founders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Companies viewable by authenticated users" ON public.companies;
DROP POLICY IF EXISTS "Company founders viewable by authenticated users" ON public.company_founders;

CREATE POLICY "Companies viewable by authenticated users"
  ON public.companies FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Company founders viewable by authenticated users"
  ON public.company_founders FOR SELECT
  TO authenticated USING (true);
