-- Admin-specific RLS policies

-- Allow admins to view all profiles (regular users can already view all profiles)
-- This is redundant but explicit for clarity
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin() OR true);

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Prevent non-admins from updating the is_admin flag
-- (This is enforced by only allowing admins to update other profiles)
-- But we'll add an explicit check in the application layer

-- Allow admins to delete posts from any user
CREATE POLICY "Admins can delete any post"
  ON public.posts FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Allow admins to update any post (e.g., to pin/unpin)
CREATE POLICY "Admins can update any post"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Allow admins to delete any comment
CREATE POLICY "Admins can delete any comment"
  ON public.comments FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Note: To make a user an admin, manually update the database:
-- UPDATE public.profiles SET is_admin = true WHERE email = 'admin@example.com';
