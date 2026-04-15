-- Add is_approved flag to profiles table
-- New users must be approved by an admin before accessing the platform
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Existing users with completed onboarding are auto-approved
UPDATE public.profiles
  SET is_approved = true
  WHERE onboarding_completed = true;

-- Admins are always approved
UPDATE public.profiles
  SET is_approved = true
  WHERE is_admin = true;

CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON public.profiles(is_approved) WHERE is_approved = false;
