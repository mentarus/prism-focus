import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  console.log('Auth callback received with code:', code ? 'yes' : 'no')

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Session exchange error:', exchangeError)
      return NextResponse.redirect(`${origin}/login?error=exchange_failed`)
    }

    // Check if user needs onboarding
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError) {
      console.error('Get user error:', userError)
      return NextResponse.redirect(`${origin}/login?error=get_user_failed`)
    }

    if (!user) {
      console.error('No user after session exchange')
      return NextResponse.redirect(`${origin}/login?error=no_user`)
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile query error:', profileError)
      return NextResponse.redirect(`${origin}/login?error=profile_query_failed`)
    }

    console.log('Onboarding completed:', profile?.onboarding_completed)

    // Redirect to onboarding if not completed
    if (!profile?.onboarding_completed) {
      return NextResponse.redirect(`${origin}/onboarding`)
    }

    return NextResponse.redirect(`${origin}/dashboard`)
  }

  console.error('No code in callback')
  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`)
}
