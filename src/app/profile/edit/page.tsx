'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding } from '@/hooks/use-onboarding'
import { PersonalInfoStep } from '@/components/onboarding/personal-info-step'
import { StartupDetailsStep } from '@/components/onboarding/startup-details-step'
import { InterestsStep } from '@/components/onboarding/interests-step'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function EditProfilePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { saveOnboarding, loading, error } = useOnboarding()
  const supabase = createClient()
  const router = useRouter()

  const [formData, setFormData] = useState({
    // Personal info
    full_name: '',
    headline: '',
    bio: '',
    location: '',
    avatar_url: '',
    pronouns: '',
    twitter_handle: '',
    linkedin_url: '',
    github_handle: '',
    website: '',

    // Company info
    company_name: '',
    company_tagline: '',
    company_description: '',
    company_website: '',
    company_logo_url: '',
    company_stage: '',
    company_tags: [] as string[],

    // Interests & community
    interests: [] as string[],
    looking_for: [] as string[],
    can_help_with: '',
    identity_tags: [] as string[],
  })

  const totalSteps = 3

  // Load user's existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        // Get profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        // Get company data if exists
        const { data: companyLink } = await supabase
          .from('company_founders')
          .select(`
            role,
            company:companies (*)
          `)
          .eq('founder_id', user.id)
          .eq('is_primary', true)
          .single()

        const company = companyLink?.company

        setFormData({
          full_name: profile.full_name || '',
          headline: profile.headline || '',
          bio: profile.bio || '',
          location: profile.location || '',
          avatar_url: profile.avatar_url || '',
          pronouns: profile.pronouns || '',
          twitter_handle: profile.twitter_handle || '',
          linkedin_url: profile.linkedin_url || '',
          github_handle: profile.github_handle || '',
          website: profile.website || '',
          company_name: company?.name || '',
          company_tagline: company?.tagline || '',
          company_description: company?.description || '',
          company_website: company?.website || '',
          company_logo_url: company?.logo_url || '',
          company_stage: company?.status || '',
          company_tags: company?.tags || [],
          interests: profile.interests || [],
          looking_for: profile.looking_for || [],
          can_help_with: profile.can_help_with || '',
          identity_tags: profile.identity_tags || [],
        })
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleComplete = async () => {
    try {
      await saveOnboarding(formData)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        router.push(`/founders/${user.id}`)
      }
    } catch (err) {
      console.error('Failed to save profile:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Step {currentStep} of {totalSteps}</span>
            <span className="font-medium text-blue-600">Edit Profile</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step content */}
        {currentStep === 1 && (
          <PersonalInfoStep
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        )}

        {currentStep === 2 && (
          <StartupDetailsStep
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}

        {currentStep === 3 && (
          <InterestsStep
            data={formData}
            updateData={updateFormData}
            onComplete={handleComplete}
            onBack={prevStep}
            loading={loading}
          />
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}
      </div>
    </div>
  )
}
