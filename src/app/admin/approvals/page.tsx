'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, MapPin, Building2 } from 'lucide-react'
import { debugError } from '@/lib/debug'

type PendingFounder = {
  id: string
  full_name: string
  headline: string
  bio: string
  location: string
  avatar_url: string
  email: string
  created_at: string
}

export default function AdminApprovalsPage() {
  const [pending, setPending] = useState<PendingFounder[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push('/login')

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) return router.push('/dashboard')

      fetchPending()
    }
    checkAdminAndFetch()
  }, [])

  const fetchPending = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, headline, bio, location, avatar_url, email, created_at')
      .eq('onboarding_completed', true)
      .eq('is_approved', false)
      .order('created_at', { ascending: true })

    if (error) debugError('Failed to fetch pending founders:', error)
    else setPending(data || [])
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    setActing(id)
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: true })
      .eq('id', id)

    if (error) debugError('Approve error:', error)
    else setPending((prev) => prev.filter((f) => f.id !== id))
    setActing(null)
  }

  const handleReject = async (id: string) => {
    setActing(id)
    // Reset onboarding so they land back on onboarding page if they sign in again
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: false })
      .eq('id', id)

    if (error) debugError('Reject error:', error)
    else setPending((prev) => prev.filter((f) => f.id !== id))
    setActing(null)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="mt-1 text-gray-600">
          Review and approve founders waiting to join the community
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500 py-12 text-center">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <Check className="mx-auto h-10 w-10 text-green-500 mb-3" />
          <p className="text-gray-600 font-medium">All caught up — no pending approvals</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((founder) => (
            <Card key={founder.id}>
              <CardContent className="flex items-start gap-4 p-4">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage src={founder.avatar_url} />
                  <AvatarFallback>
                    {founder.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900">{founder.full_name || 'No name'}</p>
                    <p className="text-sm text-gray-500">{founder.email}</p>
                  </div>
                  {founder.headline && (
                    <p className="text-sm text-blue-600">{founder.headline}</p>
                  )}
                  {founder.location && (
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {founder.location}
                    </p>
                  )}
                  {founder.bio && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{founder.bio}</p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(founder.id)}
                    disabled={acting === founder.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(founder.id)}
                    disabled={acting === founder.id}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
