'use client'

import { useState } from 'react'
import { useCompanies } from '@/hooks/use-companies'
import { Input } from '@/components/ui/input'
import { Search, Building2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default function CompaniesPage() {
  const [search, setSearch] = useState('')
  const { data: companies, isLoading } = useCompanies(search)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Company Directory</h1>
        <p className="mt-1 text-gray-600">
          Explore companies founded by LGBTQ+ entrepreneurs
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading companies...</p>
        </div>
      ) : companies && companies.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company: any) => (
            <Link key={company.id} href={`/companies/${company.slug}`}>
              <div className="group rounded-lg border bg-white p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                    {company.logo_url ? (
                      <img
                        src={company.logo_url}
                        alt={company.name}
                        className="h-12 w-12 rounded"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {company.name}
                    </h3>
                    {company.tagline && (
                      <p className="text-sm text-gray-600">{company.tagline}</p>
                    )}
                  </div>
                </div>

                {company.description && (
                  <p className="mt-4 line-clamp-2 text-sm text-gray-700">
                    {company.description}
                  </p>
                )}

                {company.tags && company.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {company.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {company.company_founders && company.company_founders.length > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {company.company_founders.slice(0, 3).map((cf: any) => (
                        <Avatar key={cf.founder.id} className="h-8 w-8 border-2 border-white">
                          <AvatarImage src={cf.founder.avatar_url || ''} />
                          <AvatarFallback>
                            {cf.founder.full_name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {company.company_founders.length} founder
                      {company.company_founders.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {search ? 'No companies found matching your search.' : 'No companies yet.'}
          </p>
        </div>
      )}
    </div>
  )
}
