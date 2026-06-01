import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define routes that require authentication
const protectedRoutes = ['/', '/insights', '/upload-data', '/risk-monitoring', '/reports', '/settings']

// Define auth routes (login/signup) - redirect to dashboard if already logged in
const authRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  // Note: Since we're using localStorage, we'll handle auth checks on client-side
  // This middleware is for additional server-side protection if needed
  
  const pathname = request.nextUrl.pathname
  
  // For now, allow all routes - client-side auth will handle protection
  // You can add server-side token validation here if needed
  
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [], // Empty array to disable middleware - using client-side auth only
}
