'use client'

import { use, useEffect, useState } from 'react'
import { useFounder } from '@/hooks/use-founders'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Globe, Twitter, Linkedin, Github, Building2, ArrowLeft, Edit } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ensureHttps } from '@/lib/utils'

export default function FounderProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: founder, isLoading, error } = useFounder(id)
  const router = useRouter()
  const supabase = createClient()
  const [isOwnProfile, setIsOwnProfile] = useState(false)

  useEffect(() => {
    const checkOwnProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setIsOwnProfile(user?.id === id)
    }
    checkOwnProfile()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    )
  }

  if (error || !founder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600">Failed to load profile</p>
        <Button onClick={() => router.push('/founders')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>
    )
  }

  const initials = founder.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U'

  const primaryCompany = founder.company_founders?.find((cf: any) => cf.is_primary)?.company

  return (
    <div>
      {/* Back button and Edit button */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push('/founders')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
        {isOwnProfile && (
          <Button
            onClick={() => router.push('/profile/edit')}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={founder.avatar_url || ''} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{founder.full_name}</h1>
                  {founder.headline && (
                    <p className="mt-1 text-lg text-gray-600">{founder.headline}</p>
                  )}
                  {founder.pronouns && (
                    <p className="mt-1 text-sm text-gray-500">({founder.pronouns})</p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {founder.location && (
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{founder.location}</span>
                      </div>
                    )}

                    {founder.website && (
                      <a
                        href={ensureHttps(founder.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Website</span>
                      </a>
                    )}

                    {founder.twitter_handle && (
                      <a
                        href={`https://twitter.com/${founder.twitter_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>@{founder.twitter_handle}</span>
                      </a>
                    )}

                    {founder.linkedin_url && (
                      <a
                        href={ensureHttps(founder.linkedin_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}

                    {founder.github_handle && (
                      <a
                        href={`https://github.com/${founder.github_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Github className="h-4 w-4" />
                        <span>{founder.github_handle}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {founder.bio && (
                <div className="mt-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{founder.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Card */}
          {primaryCompany && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Company
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link
                  href={`/companies/${primaryCompany.slug}`}
                  className="group block"
                >
                  <div className="flex items-start gap-4">
                    {primaryCompany.logo_url && (
                      <img
                        src={primaryCompany.logo_url}
                        alt={primaryCompany.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                        {primaryCompany.name}
                      </h3>
                      {primaryCompany.tagline && (
                        <p className="mt-1 text-gray-600">{primaryCompany.tagline}</p>
                      )}
                      {primaryCompany.tags && primaryCompany.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {primaryCompany.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Can Help With */}
          {founder.can_help_with && (
            <Card>
              <CardHeader>
                <CardTitle>How I Can Help</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{founder.can_help_with}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Tags & Info */}
        <div className="space-y-6">
          {/* Interests */}
          {founder.interests && founder.interests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {founder.interests.map((interest: string) => (
                    <Badge key={interest} variant="default">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Looking For */}
          {founder.looking_for && founder.looking_for.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Looking For</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {founder.looking_for.map((item: string) => (
                    <Badge key={item} variant="outline">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Identity Tags */}
          {founder.identity_tags && founder.identity_tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Community Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {founder.identity_tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
