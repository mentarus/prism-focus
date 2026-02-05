'use client'

import { use } from 'react'
import { useCompany } from '@/hooks/use-companies'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe, Twitter, Linkedin, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ensureHttps } from '@/lib/utils'

export default function CompanyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { data: company, isLoading, error } = useCompany(slug)
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading company...</p>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600">Failed to load company</p>
        <Button onClick={() => router.push('/companies')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Button>
      </div>
    )
  }

  const founders = company.company_founders || []

  return (
    <div>
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/companies')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Directory
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - Company Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-24 w-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100">
                    <span className="text-3xl font-bold text-gray-400">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                  {company.tagline && (
                    <p className="mt-2 text-lg text-gray-600">{company.tagline}</p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {company.website && (
                      <a
                        href={ensureHttps(company.website)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Visit Website</span>
                      </a>
                    )}

                    {company.twitter_handle && (
                      <a
                        href={`https://twitter.com/${company.twitter_handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Twitter className="h-4 w-4" />
                        <span>@{company.twitter_handle}</span>
                      </a>
                    )}

                    {company.linkedin_url && (
                      <a
                        href={ensureHttps(company.linkedin_url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {company.description && (
                <div className="mt-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{company.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Card */}
          {founders.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {founders.map((cf: any) => (
                    <Link
                      key={cf.founder.id}
                      href={`/founders/${cf.founder.id}`}
                      className="group flex items-center gap-4 rounded-lg p-3 hover:bg-gray-50"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={cf.founder.avatar_url || ''} />
                        <AvatarFallback>
                          {cf.founder.full_name
                            ?.split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600">
                          {cf.founder.full_name}
                        </p>
                        {cf.role && (
                          <p className="text-sm text-gray-600">{cf.role}</p>
                        )}
                        {cf.founder.headline && (
                          <p className="text-sm text-gray-500">{cf.founder.headline}</p>
                        )}
                      </div>
                      {cf.is_primary && (
                        <Badge variant="secondary">Primary</Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Tags & Info */}
        <div className="space-y-6">
          {/* Industry Tags */}
          {company.tags && company.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {company.tags.map((tag: string) => (
                    <Badge key={tag} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Company Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {company.team_size && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Team Size</p>
                  <p className="mt-1 text-gray-900">{company.team_size}</p>
                </div>
              )}
              {company.location && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="mt-1 text-gray-900">{company.location}</p>
                </div>
              )}
              {company.founded_date && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Founded</p>
                  <p className="mt-1 text-gray-900">
                    {new Date(company.founded_date).getFullYear()}
                  </p>
                </div>
              )}
              {company.status && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge
                    variant={company.status === 'active' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {company.status}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
