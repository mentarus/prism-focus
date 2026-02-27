'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '@/hooks/use-onboarding'
import { debug, debugError } from '@/lib/debug'
import { PersonalInfoStep } from '@/components/onboarding/personal-info-step'
import { StartupDetailsStep } from '@/components/onboarding/startup-details-step'
import { InterestsStep } from '@/components/onboarding/interests-step'

const STORAGE_KEY = 'prism-focus-onboarding'

type OnboardingFormData = {
  // Personal info
  full_name: string
  headline: string
  bio: string
  location: string
  avatar_url: string
  pronouns: string
  twitter_handle: string
  linkedin_url: string
  github_handle: string
  website: string

  // Company info
  company_name: string
  company_tagline: string
  company_description: string
  company_website: string
  company_logo_url: string
  company_stage: string
  company_tags: string[]

  // Interests & community
  interests: string[]
  looking_for: string[]
  can_help_with: string
  identity_tags: string[]
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { saveOnboarding, loading, error } = useOnboarding()

  // Load from localStorage on mount
  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse saved onboarding data')
        }
      }
    }
    return {
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
      company_tags: [],

      // Interests & community
      interests: [],
      looking_for: [],
      can_help_with: '',
      identity_tags: [],
    }
  })
  const router = useRouter()

  const totalSteps = 3

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    }
  }, [formData])

  // Clear localStorage after successful completion
  const clearSavedData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  }

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
    debug('handleComplete called')
    try {
      debug('Calling saveOnboarding...')
      await saveOnboarding(formData)
      debug('saveOnboarding completed, clearing data and redirecting...')
      clearSavedData()
      router.push('/dashboard')
      debug('router.push called')
    } catch (err) {
      debugError('Failed to save onboarding:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-gray-600">
            <span>Step {currentStep} of {totalSteps}</span>
            {currentStep === totalSteps && (
              <span className="font-medium text-blue-600">Almost there!</span>
            )}
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
