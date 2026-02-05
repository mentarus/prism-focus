'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function usePosts(category?: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['posts', category],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author:profiles!author_id (
            id,
            full_name,
            avatar_url,
            headline
          )
        `)
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error
      return data
    },
  })
}

export function usePost(id: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!author_id (
            id,
            full_name,
            avatar_url,
            headline
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Increment view count
      if (data) {
        supabase
          .from('posts')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', id)
          .then(() => {})
      }

      return data
    },
  })
}

export function useComments(postId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles!author_id (
            id,
            full_name,
            avatar_url,
            headline
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data
    },
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (post: { content: string; category: string; title?: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...post, author_id: user.id }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useCreateComment() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('comments')
        .insert([{ post_id: postId, author_id: user.id, content }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] })
    },
  })
}

export function useReactions(postId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['reactions', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('post_id', postId)

      if (error) throw error
      return data
    },
  })
}

export function useToggleReaction() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ postId, reactionType = 'like' }: { postId: string; reactionType?: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Check if reaction already exists
      const { data: existing } = await supabase
        .from('reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .eq('reaction_type', reactionType)
        .single()

      if (existing) {
        // Remove reaction
        const { error } = await supabase
          .from('reactions')
          .delete()
          .eq('id', existing.id)

        if (error) throw error
        return { action: 'removed' }
      } else {
        // Add reaction
        const { error } = await supabase
          .from('reactions')
          .insert([{ post_id: postId, user_id: user.id, reaction_type: reactionType }])

        if (error) throw error
        return { action: 'added' }
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reactions', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
