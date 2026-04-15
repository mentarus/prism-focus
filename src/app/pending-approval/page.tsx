'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function PendingApprovalPage() {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Image
              src="/assets/prism_logo.png"
              alt="Prism Focus Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
          </div>
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-yellow-100 p-3">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Application Under Review</CardTitle>
          <CardDescription className="text-base mt-2">
            Thanks for completing your profile! A Prism Focus admin will review your
            application and approve your access shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            You'll be able to access the community once an admin approves your account.
            This usually happens within 24 hours.
          </p>
          <Button variant="outline" onClick={handleSignOut} className="w-full">
            Sign out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
