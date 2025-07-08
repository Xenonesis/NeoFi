import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Check if we're accessing the about-us page
  if (request.nextUrl.pathname.includes('/company/about-us')) {
    // Redirect to the dashboard about page instead
    return NextResponse.redirect(new URL('/dashboard/about', request.url));
  }
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/company/:path*'],
};