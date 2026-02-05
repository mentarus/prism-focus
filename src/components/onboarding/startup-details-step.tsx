'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Rocket, ArrowLeft } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCompanySearch } from '@/hooks/use-companies'
import { ImageUpload } from '@/components/shared/image-upload'

interface StartupDetailsStepProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const INDUSTRIES = [
  'SaaS',
  'Fintech',
  'Healthcare',
  'E-commerce',
  'AI/ML',
  'Climate Tech',
  'EdTech',
  'Social Impact',
  'Consumer',
  'B2B',
  'Developer Tools',
  'Gaming',
]

const STAGES = [
  { value: 'idea', label: 'Pre-seed', subtitle: 'Idea / Prototype' },
  { value: 'seed', label: 'Seed', subtitle: 'Early Traction' },
  { value: 'growth', label: 'Series A+', subtitle: 'Growth' },
]

export function StartupDetailsStep({ data, updateData, onNext, onBack }: StartupDetailsStepProps) {
  const [tagInput, setTagInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [companySearch, setCompanySearch] = useState('')
  const { data: suggestions } = useCompanySearch(companySearch)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleIndustry = (industry: string) => {
    const tags = data.company_tags || []
    if (tags.includes(industry)) {
      updateData({ company_tags: tags.filter((t: string) => t !== industry) })
    } else {
      updateData({ company_tags: [...tags, industry] })
    }
  }

  const addCustomTag = () => {
    if (tagInput.trim() && !data.company_tags?.includes(tagInput.trim())) {
      updateData({ company_tags: [...(data.company_tags || []), tagInput.trim()] })
      setTagInput('')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
          <Rocket className="h-4 w-4" />
          STARTUP DETAILS
        </div>
        <CardTitle className="text-2xl">What are you building?</CardTitle>
        <CardDescription>
          We need a few details to categorize your company correctly within the Prism network.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Company Logo */}
        <div className="flex flex-col items-center gap-4">
          <ImageUpload
            currentImageUrl={data.company_logo_url}
            onImageUploaded={(url) => updateData({ company_logo_url: url })}
            fallbackText={data.company_name?.charAt(0) || 'C'}
            type="logo"
          />
          <p className="text-xs text-gray-500 text-center">
            Upload your company logo (optional)
          </p>
        </div>

        {/* Company Name & Website */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 relative" ref={suggestionsRef}>
            <Label htmlFor="company_name">Startup Name</Label>
            <Input
              id="company_name"
              placeholder="e.g. Prism"
              value={data.company_name}
              onChange={(e) => {
                updateData({ company_name: e.target.value })
                setCompanySearch(e.target.value)
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            {showSuggestions && suggestions && suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg max-h-60 overflow-auto">
                <div className="p-2 text-xs text-gray-500 border-b">
                  Existing companies (click to select):
                </div>
                {suggestions.map((company: any) => (
                  <button
                    key={company.id}
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b last:border-b-0"
                    onClick={() => {
                      updateData({
                        company_name: company.name,
                        company_tagline: company.tagline || data.company_tagline,
                      })
                      setShowSuggestions(false)
                    }}
                  >
                    <div className="font-medium">{company.name}</div>
                    {company.tagline && (
                      <div className="text-xs text-gray-600">{company.tagline}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_website">Website URL</Label>
            <Input
              id="company_website"
              placeholder="www.yourstartup.com"
              value={data.company_website}
              onChange={(e) => updateData({ company_website: e.target.value })}
            />
          </div>
        </div>

        {/* One-line Pitch */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="company_tagline">One-line Pitch</Label>
            <span className="text-xs text-gray-500">
              Max 140 chars
            </span>
          </div>
          <Textarea
            id="company_tagline"
            placeholder="The community hub for LGBTQ+ founders."
            rows={2}
            maxLength={140}
            value={data.company_tagline}
            onChange={(e) => updateData({ company_tagline: e.target.value })}
          />
        </div>

        {/* Industry Tags */}
        <div className="space-y-3">
          <Label>Industry</Label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRIES.map((industry) => (
              <Badge
                key={industry}
                variant={data.company_tags?.includes(industry) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleIndustry(industry)}
              >
                {industry}
                {data.company_tags?.includes(industry) && ' ✓'}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add custom industry..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCustomTag()
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.preventDefault()
                addCustomTag()
              }}
              disabled={!tagInput.trim()}
            >
              Add
            </Button>
          </div>
        </div>

        {/* Current Stage */}
        <div className="space-y-3">
          <Label>Current Stage</Label>
          <div className="grid gap-3 md:grid-cols-3">
            {STAGES.map((stage) => (
              <button
                key={stage.value}
                type="button"
                onClick={() => updateData({ company_stage: stage.value })}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  data.company_stage === stage.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="mb-1 text-sm font-semibold">{stage.label}</div>
                <div className="text-xs text-gray-600">{stage.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="w-32">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={onNext} className="flex-1" size="lg">
            Next: Community Tags →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
