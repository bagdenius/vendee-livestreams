import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const {
    url,
    nextUrl: { pathname },
    cookies,
  } = request

  const session = cookies.get('session')?.value

  const isAuthRoute = pathname.startsWith('/auth')
  const isDeactivationRoute = pathname === '/auth/deactivation'
  const isDashboardRoute = pathname.startsWith('/dashboard')

  if (!session && (isDashboardRoute || isDeactivationRoute))
    return NextResponse.redirect(new URL('/auth/login', url))

  if (session && isAuthRoute && !isDeactivationRoute)
    return NextResponse.redirect(new URL('/dashboard/settings', url))

  return NextResponse.next()
}

export const config = {
  matcher: ['/auth/:path*', '/dashboard/:path*'],
}
