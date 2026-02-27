import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { debug, debugError } from '@/lib/debug'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    debug('Login API called with email:', email)

    const supabase = await createClient()
    debug('Supabase client created')

    debug('NEXT_PUBLIC_APP_URL value:', process.env.NEXT_PUBLIC_APP_URL)
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    debug('Redirect URL:', redirectUrl)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      debugError('OTP error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    debug('OTP sent successfully')
    return NextResponse.json({ success: true })
  } catch (err) {
    debugError('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
