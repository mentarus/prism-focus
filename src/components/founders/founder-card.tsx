import Link from 'next/link'
import { MapPin, Twitter, Linkedin, Github } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface FounderCardProps {
  founder: {
    id: string
    full_name: string
    avatar_url: string | null
    headline: string | null
    bio: string | null
    location: string | null
    interests: string[] | null
    twitter_handle: string | null
    linkedin_url: string | null
    github_handle: string | null
  }
}

export function FounderCard({ founder }: FounderCardProps) {
  return (
    <Link href={`/founders/${founder.id}`}>
      <div className="group rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={founder.avatar_url || ''} />
            <AvatarFallback>
              {founder.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
              {founder.full_name}
            </h3>
            {founder.headline && (
              <p className="text-sm text-gray-600">{founder.headline}</p>
            )}

            {founder.location && (
              <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{founder.location}</span>
              </div>
            )}
          </div>
        </div>

        {founder.bio && (
          <p className="mt-4 line-clamp-2 text-sm text-gray-700">
            {founder.bio}
          </p>
        )}

        {founder.interests && founder.interests.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {founder.interests.slice(0, 3).map((interest) => (
              <Badge key={interest} variant="secondary" className="text-xs">
                {interest}
              </Badge>
            ))}
            {founder.interests.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{founder.interests.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="mt-4 flex gap-3">
          {founder.twitter_handle && (
            <div className="text-gray-500 hover:text-blue-600">
              <Twitter className="h-4 w-4" />
            </div>
          )}
          {founder.linkedin_url && (
            <div className="text-gray-500 hover:text-blue-600">
              <Linkedin className="h-4 w-4" />
            </div>
          )}
          {founder.github_handle && (
            <div className="text-gray-500 hover:text-gray-900">
              <Github className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
