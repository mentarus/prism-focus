'use client'

import { useState } from 'react'
import { usePosts } from '@/hooks/use-posts'
import { PostCard } from '@/components/posts/post-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

const categories = [
  { value: 'all', label: 'All' },
  { value: 'general', label: 'General' },
  { value: 'launch', label: 'Launch' },
  { value: 'classifieds', label: 'Classifieds' },
  { value: 'recruiting', label: 'Recruiting' },
]

export default function DashboardPage() {
  const [category, setCategory] = useState('all')
  const { data: posts, isLoading } = usePosts(
    category === 'all' ? undefined : category
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Board</h1>
          <p className="mt-1 text-gray-600">
            Connect with fellow LGBTQ+ founders
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="mb-6 flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              category === cat.value
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : posts && posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  )
}
