import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { url } = request
  const session = request.cookies.get('session')?.value
  const isAuthPage = url.includes('/auth')

  if (isAuthPage) {
    if (session)
      return NextResponse.redirect(new URL('/dashboard/settings', url))
    return NextResponse.next()
  }

  if (!session)
    return NextResponse.redirect(new URL('/auth/login', request.url))
}

export const config = {
  matcher: ['/auth/:path', '/dashboard/:path'],
}
