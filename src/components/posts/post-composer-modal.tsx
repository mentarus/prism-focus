'use client'

import { useState } from 'react'
import { useCreatePost } from '@/hooks/use-posts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface PostComposerModalProps {
  open: boolean
  onClose: () => void
}

const CATEGORIES = [
  { value: 'general', label: 'General', description: 'General discussion' },
  { value: 'launch', label: 'Launch', description: 'Product launches' },
  { value: 'classifieds', label: 'Classifieds', description: 'Buy, sell, trade' },
  { value: 'recruiting', label: 'Recruiting', description: 'Job openings' },
  { value: 'question', label: 'Question', description: 'Ask the community' },
  { value: 'announcement', label: 'Announcement', description: 'News and updates' },
]

export function PostComposerModal({ open, onClose }: PostComposerModalProps) {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('general')
  const [error, setError] = useState('')
  const { mutate: createPost, isPending } = useCreatePost()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!content.trim()) {
      setError('Please enter some content')
      return
    }

    createPost(
      { content: content.trim(), category },
      {
        onSuccess: () => {
          setContent('')
          setCategory('general')
          onClose()
        },
        onError: (err: any) => {
          setError(err.message || 'Failed to create post')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
          <DialogDescription>
            Share something with the LGBTQ+ founder community
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat.value}
                  variant={category === cat.value ? 'default' : 'outline'}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => setCategory(cat.value)}
                >
                  {cat.label}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              {CATEGORIES.find((c) => c.value === category)?.description}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">What's on your mind?</Label>
            <Textarea
              id="content"
              placeholder="Share your thoughts, ask a question, or make an announcement..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="resize-none"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{content.length} characters</span>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !content.trim()}>
              {isPending ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
