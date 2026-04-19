import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { isAdminEmail } from '@/lib/admin-auth'

export async function proxy(request: NextRequest) {
  const { supabase, response } = updateSession(request)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const isAdminUser = isAdminEmail(user?.email)

  const pathname = request.nextUrl.pathname
  const isAdminPath = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'

  if (isAdminPath && !isAdminLogin && !isAdminUser) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin/login'
    redirectUrl.searchParams.set('next', pathname)
    if (user && !isAdminUser) {
      redirectUrl.searchParams.set('forbidden', '1')
    }
    return NextResponse.redirect(redirectUrl)
  }

  if (isAdminLogin && isAdminUser) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
