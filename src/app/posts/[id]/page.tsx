'use client'

import { use, useState } from 'react'
import { usePost, useComments, useCreateComment } from '@/hooks/use-posts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, MessageCircle, Eye } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: post, isLoading: postLoading, error: postError } = usePost(id)
  const { data: comments, isLoading: commentsLoading } = useComments(id)
  const { mutate: createComment, isPending } = useCreateComment()
  const [commentContent, setCommentContent] = useState('')
  const router = useRouter()

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return

    createComment(
      { postId: id, content: commentContent.trim() },
      {
        onSuccess: () => {
          setCommentContent('')
        },
      }
    )
  }

  if (postLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600">Loading post...</p>
      </div>
    )
  }

  if (postError || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-red-600">Failed to load post</p>
        <Button onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Community Board
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Back button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/dashboard')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Community Board
      </Button>

      {/* Post Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar_url || ''} />
                <AvatarFallback>
                  {post.author.full_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/founders/${post.author.id}`}
                  className="font-semibold text-gray-900 hover:text-blue-600"
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
        </CardHeader>
        <CardContent>
          {post.title && (
            <h1 className="mb-4 text-2xl font-bold text-gray-900">{post.title}</h1>
          )}
          <p className="whitespace-pre-wrap text-gray-900">{post.content}</p>

          <div className="mt-6 flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{post.view_count} views</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{comments?.length || 0} comments</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">
            Comments ({comments?.length || 0})
          </h2>
        </CardHeader>
        <CardContent>
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <Textarea
              placeholder="Write a comment..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              rows={3}
              className="mb-3"
            />
            <div className="flex justify-end">
              <Button type="submit" disabled={!commentContent.trim() || isPending}>
                {isPending ? 'Posting...' : 'Post Comment'}
              </Button>
            </div>
          </form>

          {/* Comments List */}
          {commentsLoading ? (
            <p className="text-center text-gray-600">Loading comments...</p>
          ) : comments && comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment: any) => (
                <div
                  key={comment.id}
                  className="flex gap-3 rounded-lg border bg-gray-50 p-4"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar_url || ''} />
                    <AvatarFallback>
                      {comment.author.full_name
                        .split(' ')
                        .map((n: string) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/founders/${comment.author.id}`}
                        className="font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {comment.author.full_name}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    {comment.author.headline && (
                      <p className="text-xs text-gray-600">{comment.author.headline}</p>
                    )}
                    <p className="mt-2 whitespace-pre-wrap text-gray-900">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              No comments yet. Be the first to comment!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
