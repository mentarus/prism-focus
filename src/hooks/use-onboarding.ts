'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function useOnboarding() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const saveOnboarding = async (data: any) => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      console.log('Saving onboarding data for user:', user.id)
      console.log('Form data:', data)

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          headline: data.headline,
          bio: data.bio,
          location: data.location,
          avatar_url: data.avatar_url || null,
          website: data.website || null,
          twitter_handle: data.twitter_handle || null,
          linkedin_url: data.linkedin_url || null,
          github_handle: data.github_handle || null,
          pronouns: data.pronouns || null,
          interests: data.interests || [],
          looking_for: data.looking_for || [],
          identity_tags: data.identity_tags || [],
          can_help_with: data.can_help_with || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) {
        console.error('Profile update error:', profileError)
        throw profileError
      }

      console.log('Profile updated successfully')

      // Handle company creation/update
      if (data.company_name?.trim()) {
        console.log('Processing company:', data.company_name)
        const slug = data.company_name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        // Check if user already has a company
        const { data: existingLink } = await supabase
          .from('company_founders')
          .select('company_id, company:companies(*)')
          .eq('founder_id', user.id)
          .eq('is_primary', true)
          .single()

        if (existingLink?.company) {
          // Update existing company
          console.log('Updating existing company:', existingLink.company.id)
          const { error: updateError } = await supabase
            .from('companies')
            .update({
              name: data.company_name,
              tagline: data.company_tagline || null,
              description: data.company_description || null,
              website: data.company_website || null,
              logo_url: data.company_logo_url || null,
              tags: data.company_tags || [],
            })
            .eq('id', existingLink.company.id)

          if (updateError) {
            console.error('Company update error:', updateError)
            throw updateError
          }
          console.log('Company updated successfully')
        } else {
          // Create new company
          console.log('Creating new company')
          const { data: company, error: companyError } = await supabase
            .from('companies')
            .insert([
              {
                slug,
                name: data.company_name,
                tagline: data.company_tagline || null,
                description: data.company_description || null,
                website: data.company_website || null,
                logo_url: data.company_logo_url || null,
                tags: data.company_tags || [],
              },
            ])
            .select()
            .single()

          if (companyError) {
            console.error('Company creation error:', companyError)
            throw companyError
          }

          console.log('Company created:', company)

          // Link founder to company
          if (company) {
            const { error: linkError } = await supabase
              .from('company_founders')
              .insert([
                {
                  company_id: company.id,
                  founder_id: user.id,
                  role: data.headline,
                  is_primary: true,
                },
              ])

            if (linkError) {
              console.error('Company link error:', linkError)
              throw linkError
            }
            console.log('Founder linked to company')
          }
        }
      }

      console.log('Onboarding completed successfully')
    } catch (err: any) {
      console.error('Onboarding save error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { saveOnboarding, loading, error }
}
