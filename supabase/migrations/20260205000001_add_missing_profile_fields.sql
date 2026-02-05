-- Add missing profile fields for onboarding
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pronouns TEXT,
ADD COLUMN IF NOT EXISTS identity_tags TEXT[],
ADD COLUMN IF NOT EXISTS can_help_with TEXT;

-- Add index for identity_tags
CREATE INDEX IF NOT EXISTS idx_profiles_identity_tags ON public.profiles USING GIN(identity_tags);
