'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useCompanies(search?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['companies', search],
    queryFn: async () => {
      let query = supabase
        .from('companies')
        .select(`
          *,
          company_founders!company_id (
            role,
            is_primary,
            founder:profiles (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (search) {
        query = query.or(
          `name.ilike.%${search}%,tagline.ilike.%${search}%,description.ilike.%${search}%`
        )
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
  })
}

export function useCompany(slug: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['company', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          company_founders!company_id (
            role,
            is_primary,
            founder:profiles (*)
          )
        `)
        .eq('slug', slug)
        .single()

      if (error) throw error
      return data
    },
  })
}

export function useCompanySearch(search: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['company-search', search],
    queryFn: async () => {
      if (!search || search.length < 2) return []

      const { data, error } = await supabase
        .from('companies')
        .select('id, name, slug, tagline')
        .ilike('name', `%${search}%`)
        .limit(10)

      if (error) throw error
      return data || []
    },
    enabled: search.length >= 2,
  })
}

export async function fetchCompanyDetails(companyId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('companies')
    .select('id, name, slug, tagline, description, website, logo_url, tags')
    .eq('id', companyId)
    .single()

  if (error) throw error
  return data
}
