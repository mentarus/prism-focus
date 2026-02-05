'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { MessageCircle, Eye, ThumbsUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface PostCardProps {
  post: {
    id: string
    content: string
    category: string
    created_at: string
    view_count: number
    author: {
      id: string
      full_name: string
      avatar_url: string | null
      headline: string | null
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const contentPreview = post.content.substring(0, 300)
  const needsExpansion = post.content.length > 300

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={post.author.avatar_url || ''} />
            <AvatarFallback>
              {post.author.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link
              href={`/founders/${post.author.id}`}
              className="font-semibold hover:underline"
            >
              {post.author.full_name}
            </Link>
            {post.author.headline && (
              <p className="text-sm text-gray-600">{post.author.headline}</p>
            )}
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
        <Badge variant="secondary">{post.category}</Badge>
      </div>

      <div className="mt-4">
        <p className="whitespace-pre-wrap text-gray-900">
          {isExpanded ? post.content : contentPreview}
          {needsExpansion && !isExpanded && '...'}
        </p>
        {needsExpansion && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span>{post.view_count}</span>
        </div>
        <button className="flex items-center gap-2 hover:text-blue-600">
          <ThumbsUp className="h-4 w-4" />
          <span>Like</span>
        </button>
        <button className="flex items-center gap-2 hover:text-blue-600">
          <MessageCircle className="h-4 w-4" />
          <span>Comment</span>
        </button>
      </div>
    </div>
  )
}
