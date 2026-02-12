'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Exchange the code for a session
        const code = searchParams.get('code')

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            console.error('Auth error:', error)
            router.push('/login')
            return
          }
        }

        // Get the authenticated user
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push('/login')
          return
        }

        // Check if user has completed onboarding
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', user.id)
          .single()

        const onboardingCompleted = profile?.onboarding_completed ?? false

        // Redirect based on onboarding status
        if (onboardingCompleted) {
          router.push('/dashboard')
        } else {
          router.push('/onboarding')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/login')
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Logging you in...</p>
    </div>
  )
}
