-- Add policies for creating and updating companies

-- Allow authenticated users to create companies
DROP POLICY IF EXISTS "Users can create companies" ON public.companies;
CREATE POLICY "Users can create companies"
  ON public.companies FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow company founders to update their companies
DROP POLICY IF EXISTS "Founders can update their companies" ON public.companies;
CREATE POLICY "Founders can update their companies"
  ON public.companies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT company_id
      FROM public.company_founders
      WHERE founder_id = auth.uid()
    )
  );

-- Allow users to insert into company_founders
DROP POLICY IF EXISTS "Users can link themselves to companies" ON public.company_founders;
CREATE POLICY "Users can link themselves to companies"
  ON public.company_founders FOR INSERT
  TO authenticated
  WITH CHECK (founder_id = auth.uid());

-- Allow users to update their own company links
DROP POLICY IF EXISTS "Users can update own company links" ON public.company_founders;
CREATE POLICY "Users can update own company links"
  ON public.company_founders FOR UPDATE
  TO authenticated
  USING (founder_id = auth.uid());
