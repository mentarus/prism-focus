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

  // Check onboarding and approval status for authenticated users
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed, is_approved, is_admin')
      .eq('id', user.id)
      .single()

    const onboardingCompleted = profile?.onboarding_completed ?? false
    const isApproved = profile?.is_approved ?? false
    const isAdmin = profile?.is_admin ?? false
    const pathname = request.nextUrl.pathname
    const isOnboardingPage = pathname.startsWith('/onboarding')
    const isLoginPage = pathname === '/login'
    const isPendingPage = pathname === '/pending-approval'

    // Step 1: Must complete onboarding first
    if (!onboardingCompleted && !isOnboardingPage && !isLoginPage) {
      debug('Middleware redirecting to /onboarding', { path: pathname })
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Step 2: After onboarding, must be approved (admins bypass this)
    if (onboardingCompleted && !isApproved && !isAdmin && !isPendingPage && !isOnboardingPage && !isLoginPage) {
      debug('Middleware redirecting to /pending-approval', { path: pathname })
      return NextResponse.redirect(new URL('/pending-approval', request.url))
    }

    // Redirect away from onboarding if already completed
    if (onboardingCompleted && isOnboardingPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect away from pending page if already approved
    if (isPendingPage && (isApproved || isAdmin)) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect authenticated users away from login page
    if (isLoginPage) {
      if (!onboardingCompleted) return NextResponse.redirect(new URL('/onboarding', request.url))
      if (!isApproved && !isAdmin) return NextResponse.redirect(new URL('/pending-approval', request.url))
      return NextResponse.redirect(new URL('/dashboard', request.url))
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
