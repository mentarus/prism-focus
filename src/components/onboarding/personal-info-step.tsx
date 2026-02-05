'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/shared/image-upload'

interface PersonalInfoStepProps {
  data: any
  updateData: (data: any) => void
  onNext: () => void
}

const PRONOUNS = [
  'Select pronouns',
  'He/Him',
  'She/Her',
  'They/Them',
  'He/They',
  'She/They',
  'Other',
]

export function PersonalInfoStep({ data, updateData, onNext }: PersonalInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!data.full_name?.trim()) {
      newErrors.full_name = 'Full name is required'
    }

    if (!data.headline?.trim()) {
      newErrors.headline = 'Job title/role is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validate()) {
      onNext()
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold">Welcome to Prism Focus</CardTitle>
        <CardDescription>
          Let's start building your founder profile. Join the network of exceptional LGBTQ+ founders.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Photo */}
        <div className="flex flex-col items-center gap-4">
          <ImageUpload
            currentImageUrl={data.avatar_url}
            onImageUploaded={(url) => updateData({ avatar_url: url })}
            fallbackText={data.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
            type="avatar"
          />
          <div className="text-center">
            <p className="text-sm font-medium">Profile Photo</p>
            <p className="text-xs text-gray-500">
              Upload a clear photo to help other founders recognize you
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="full_name"
            placeholder="e.g. Alex Rivera"
            value={data.full_name}
            onChange={(e) => updateData({ full_name: e.target.value })}
          />
          {errors.full_name && (
            <p className="text-sm text-red-600">{errors.full_name}</p>
          )}
        </div>

        {/* Pronouns & Job Title */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pronouns">Pronouns (Optional)</Label>
            <select
              id="pronouns"
              value={data.pronouns}
              onChange={(e) => updateData({ pronouns: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              {PRONOUNS.map((pronoun) => (
                <option key={pronoun} value={pronoun === 'Select pronouns' ? '' : pronoun}>
                  {pronoun}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headline">
              Job Title / Role <span className="text-red-500">*</span>
            </Label>
            <Input
              id="headline"
              placeholder="e.g. Co-Founder & CEO"
              value={data.headline}
              onChange={(e) => updateData({ headline: e.target.value })}
            />
            {errors.headline && (
              <p className="text-sm text-red-600">{errors.headline}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="e.g. San Francisco, CA"
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself and your journey..."
            rows={4}
            value={data.bio}
            onChange={(e) => updateData({ bio: e.target.value })}
          />
        </div>

        {/* Next Button */}
        <div className="pt-4">
          <Button onClick={handleNext} className="w-full" size="lg">
            Next: Startup Details →
          </Button>
          <p className="mt-3 text-center text-xs text-gray-500">
            🔒 Your information is securely stored and visible only to community members
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
