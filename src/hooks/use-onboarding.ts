'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { debug, debugError, formatErrorForUser } from '@/lib/debug'

export function useOnboarding() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const saveOnboarding = async (data: any) => {
    debug('saveOnboarding called')
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')
      debug('User authenticated:', user.id)

      debug('Saving onboarding data for user:', user.id)
      debug('Form data:', data)

      // First, verify the profile exists (use maybeSingle to avoid error if not found)
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (profileCheckError) {
        const err = debugError('Profile check error:', profileCheckError)
        setError(`Profile error: ${err?.message || 'Unknown error'}`)
        throw new Error('Failed to check profile')
      }

      // If profile doesn't exist, create it first
      if (!existingProfile) {
        debug('Profile does not exist, creating new profile')
        const { error: createError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: data.full_name || '',
            headline: data.headline || '',
            bio: data.bio || '',
            location: data.location || '',
            email: user.email || '',
          })

        if (createError) {
          const err = debugError('Profile creation error:', createError)
          setError(`Failed to create profile: ${err?.message || 'Unknown error'}`)
          throw new Error('Failed to create profile')
        }
        debug('Profile created successfully')
      } else {
        debug('Profile exists, proceeding with update')
      }

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
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (profileError) {
        const err = debugError('Profile update error:', profileError)
        setError(`Failed to save profile: ${err?.message || 'Unknown error'}`)
        throw profileError
      }

      debug('Profile updated successfully')

      // Verify the update worked
      const { data: verifyProfile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()
      debug('Verification - onboarding_completed in DB:', verifyProfile?.onboarding_completed)

      // Handle company creation/update (non-blocking - failures won't stop onboarding)
      if (data.company_name?.trim()) {
        try {
          debug('Processing company:', data.company_name)
          const slug = data.company_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

          // Check if user already has a company
          const { data: existingLink, error: existingLinkError } = await supabase
            .from('company_founders')
            .select('company_id, company:companies(*)')
            .eq('founder_id', user.id)
            .eq('is_primary', true)
            .maybeSingle()

          if (existingLinkError) {
            const err = debugError('Company founders lookup error:', existingLinkError)
            setError(formatErrorForUser(err))
            return
          }

          const existingCompany = existingLink?.company as any

          if (existingCompany) {
            // Update existing company
            debug('Updating existing company:', existingCompany.id)
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
              .eq('id', existingCompany.id)

            if (updateError) {
              const err = debugError('Company update error:', updateError)
              setError(formatErrorForUser(err))
              return
            }
            debug('Company updated successfully')
          } else {
            // No existing link found - check if company exists by slug
            // (in case user has access to an existing company but no founder link)
            debug('No existing company_founders link - checking if company exists by slug')
            const { data: companyBySlug, error: slugCheckError } = await supabase
              .from('companies')
              .select('id')
              .eq('slug', slug)
              .maybeSingle()

            if (slugCheckError) {
              const err = debugError('Company slug lookup error:', slugCheckError)
              setError(formatErrorForUser(err))
              return
            }

            if (companyBySlug) {
              // Company exists by slug - update it
              debug('Found existing company by slug, updating:', companyBySlug.id)
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
                .eq('id', companyBySlug.id)

              if (updateError) {
                const err = debugError('Company update error:', updateError)
                setError(formatErrorForUser(err))
                return
              }
              debug('Company updated successfully')

              // Ensure founder link exists (upsert to avoid duplicate link)
              const { error: linkError } = await supabase
                .from('company_founders')
                .upsert(
                  {
                    company_id: companyBySlug.id,
                    founder_id: user.id,
                    role: data.headline,
                    is_primary: true,
                  },
                  { onConflict: 'company_id,founder_id' }
                )

              if (linkError) {
                const err = debugError('Company link upsert error:', linkError)
                setError(formatErrorForUser(err))
                return
              }
              debug('Founder linked/updated for company')
            } else {
              // Company does not exist - create it fresh
              debug('Creating new company')
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
                const err = debugError('Company creation error:', companyError)
                setError(formatErrorForUser(err))
                return
              }
              debug('Company created:', company)

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
                  const err = debugError('Company link error:', linkError)
                  setError(formatErrorForUser(err))
                  return
                }
                debug('Founder linked to company')
              }
            }
          }
        } catch (companyErr) {
          const err = debugError('Company processing failed:', companyErr)
          setError(formatErrorForUser(err))
          return
        }
      }

      debug('Onboarding completed successfully')
    } catch (err: any) {
      debugError('Onboarding save error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { saveOnboarding, loading, error }
}
