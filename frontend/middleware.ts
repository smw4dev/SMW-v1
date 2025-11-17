import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const ADMIN_PREFIX = '/admin'
const ADMIN_LOGIN_PATH = '/admin/login'
const IS_STAFF_COOKIE = 'smw_is_staff'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith(ADMIN_PREFIX)) {
    return NextResponse.next()
  }

  const isLoginRoute = pathname.startsWith(ADMIN_LOGIN_PATH)
  const isStaff = request.cookies.get(IS_STAFF_COOKIE)?.value === 'true'

  if (!isStaff && !isLoginRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = ADMIN_LOGIN_PATH
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  if (isStaff && isLoginRoute) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = ADMIN_PREFIX
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
