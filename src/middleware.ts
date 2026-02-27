import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { debug } from '@/lib/debug'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect unauthenticated users to login (except for login and auth pages)
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check onboarding status for authenticated users
  if (user) {
    // Fetch user profile to check onboarding status
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()

    const onboardingCompleted = profile?.onboarding_completed ?? false
    const isOnboardingPage = request.nextUrl.pathname.startsWith('/onboarding')
    const isLoginPage = request.nextUrl.pathname === '/login'

    // Redirect to onboarding if not completed and not already there
    if (!onboardingCompleted && !isOnboardingPage && !isLoginPage) {
      debug('Middleware redirecting to /onboarding - onboardingCompleted:', onboardingCompleted, 'path:', request.nextUrl.pathname)
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Redirect to dashboard if onboarding is completed but user is on onboarding page
    if (onboardingCompleted && isOnboardingPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect authenticated users away from login page
    if (isLoginPage) {
      const redirectUrl = onboardingCompleted ? '/dashboard' : '/onboarding'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (api folder)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
