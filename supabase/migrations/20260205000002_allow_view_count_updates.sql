-- Allow anyone to increment view counts (but only view_count field)
-- Drop the restrictive update policy
DROP POLICY IF EXISTS "Users can update own posts" ON public.posts;

-- Create separate policies for different update scenarios
CREATE POLICY "Users can update own posts content"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Anyone can increment view count"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
