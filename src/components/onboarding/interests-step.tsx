'use client'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Heart, Search, Rocket } from 'lucide-react'

interface InterestsStepProps {
  data: any
  updateData: (data: any) => void
  onComplete: () => void
  onBack: () => void
  loading?: boolean
}

const SKILLS = [
  'Fundraising',
  'GTM & Sales',
  'Product Design',
  'Backend Dev',
  'Frontend Dev',
  'Marketing',
  'Legal',
  'Recruiting',
  'Operations',
  'Finance',
]

const IDENTITY_TAGS = [
  'Trans Founder',
  'Non-binary',
  'BIPOC',
  'First-time Founder',
  'Immigrant',
  'Woman Founder',
  'Solo Founder',
  'Second-time Founder',
]

const LOOKING_FOR = [
  'Co-founder',
  'Technical Co-founder',
  'Investors',
  'Advisors',
  'Beta Testers',
  'Early Customers',
  'Mentorship',
  'Community Support',
]

export function InterestsStep({ data, updateData, onComplete, onBack, loading }: InterestsStepProps) {
  const toggleItem = (field: 'interests' | 'looking_for', item: string) => {
    const items = data[field] || []
    if (items.includes(item)) {
      updateData({ [field]: items.filter((i: string) => i !== item) })
    } else {
      updateData({ [field]: [...items, item] })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="mb-4 text-center">
          <div className="mb-2 text-sm font-medium text-purple-600">
            Step 3 of 3 • ALMOST THERE!
          </div>
          <CardTitle className="text-2xl">Deepen your connections</CardTitle>
          <CardDescription>
            Tell us what you know and who you are so we can connect you with the right founders.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Where do you shine? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <Label className="text-base font-semibold">Where do you shine?</Label>
          </div>
          <p className="text-sm text-gray-600">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <Badge
                key={skill}
                variant={data.interests?.includes(skill) ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => toggleItem('interests', skill)}
              >
                {skill}
                {data.interests?.includes(skill) && ' ✓'}
              </Badge>
            ))}
          </div>
        </div>

        {/* Identity Tags */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            <Label className="text-base font-semibold">Identity Tags</Label>
            <Badge variant="secondary" className="text-xs">
              Optional
            </Badge>
          </div>
          <p className="text-sm text-gray-600">
            Helps with community affinity matching. Visible to members only.
          </p>
          <div className="flex flex-wrap gap-2">
            {IDENTITY_TAGS.map((tag) => (
              <Badge
                key={tag}
                variant={data.identity_tags?.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => {
                  const tags = data.identity_tags || []
                  if (tags.includes(tag)) {
                    updateData({ identity_tags: tags.filter((t: string) => t !== tag) })
                  } else {
                    updateData({ identity_tags: [...tags, tag] })
                  }
                }}
              >
                {tag}
                {data.identity_tags?.includes(tag) && ' ✓'}
              </Badge>
            ))}
          </div>
        </div>

        {/* What are you looking for? */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            <Label className="text-base font-semibold">What are you looking for?</Label>
          </div>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR.map((item) => (
              <Badge
                key={item}
                variant={data.looking_for?.includes(item) ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => toggleItem('looking_for', item)}
              >
                {item}
                {data.looking_for?.includes(item) && ' ✓'}
              </Badge>
            ))}
          </div>
        </div>

        {/* How can you help others? */}
        <div className="space-y-2">
          <Label htmlFor="can_help_with" className="text-base font-semibold">
            How can you help others?
          </Label>
          <Textarea
            id="can_help_with"
            placeholder="e.g. I can offer advice on pitch decks, intros to fintech investors, or beta testing your product..."
            rows={3}
            value={data.can_help_with}
            onChange={(e) => updateData({ can_help_with: e.target.value })}
          />
        </div>

        {/* Navigation */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="w-32">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={onComplete}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size="lg"
            disabled={loading}
          >
            <Rocket className="mr-2 h-4 w-4" />
            {loading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500">
          By clicking Complete Profile, you agree to our Community Guidelines
        </p>
      </CardContent>
    </Card>
  )
}
