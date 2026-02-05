'use client'

import { useState } from 'react'
import { useFounders } from '@/hooks/use-founders'
import { FounderCard } from '@/components/founders/founder-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function FoundersPage() {
  const [search, setSearch] = useState('')
  const { data: founders, isLoading } = useFounders(search)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Founder Directory</h1>
        <p className="mt-1 text-gray-600">
          Discover and connect with LGBTQ+ founders
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search founders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading founders...</p>
        </div>
      ) : founders && founders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {founders.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {search ? 'No founders found matching your search.' : 'No founders yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
