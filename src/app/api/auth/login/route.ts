import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    console.log('Login API called with email:', email)

    const supabase = await createClient()
    console.log('Supabase client created')

    console.log('NEXT_PUBLIC_APP_URL value:', process.env.NEXT_PUBLIC_APP_URL)
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    console.log('Redirect URL:', redirectUrl)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    })

    if (error) {
      console.error('OTP error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    console.log('OTP sent successfully')
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
