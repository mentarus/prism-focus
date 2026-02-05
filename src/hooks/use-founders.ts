'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useFounders(search?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['founders', search],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (search) {
        query = query.or(
          `full_name.ilike.%${search}%,headline.ilike.%${search}%,bio.ilike.%${search}%`
        )
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
  })
}

export function useFounder(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['founder', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          company_founders!founder_id (
            role,
            is_primary,
            company:companies (*)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
  })
}
