import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// const isPublicRoute = createRouteMatcher(['/sign-in(.*)'])

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  const response = NextResponse.next()
  if (!isPublicRoute(request)) {
    await auth.protect()
  }

  const protocol =
    request.headers.get('x-forwarded-proto') || request.nextUrl.protocol

  const host =
    request.headers.get('x-forwarded-host') || request.headers.get('host') || ''

  const baseUrl = `${protocol}${protocol.endsWith(':') ? '//' : '://'}${host}`

  response.headers.set('x-url', request.url)
  response.headers.set('x-host', host)
  response.headers.set('x-protocol', protocol)
  response.headers.set('x-base-url', baseUrl)

  return response
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)' // Applies to all routes except static files
  ]
}

// import type { NextRequest } from 'next/server'
// import { NextResponse } from 'next/server'

// import { clerkMiddleware } from '@clerk/nextjs/server'

// export default clerkMiddleware()

// export const config = {
//   matcher: ['/((?!_next|.*\\..*).*)'] // applies to all routes except static files
// }

// export function middleware(request: NextRequest) {
//   // Create a response
//   const response = NextResponse.next()

//   // Get the protocol from X-Forwarded-Proto header or request protocol
//   const protocol =
//     request.headers.get('x-forwarded-proto') || request.nextUrl.protocol

//   // Get the host from X-Forwarded-Host header or request host
//   const host =
//     request.headers.get('x-forwarded-host') || request.headers.get('host') || ''

//   // Construct the base URL - ensure protocol has :// format
//   const baseUrl = `${protocol}${protocol.endsWith(':') ? '//' : '://'}${host}`

//   // Add request information to response headers
//   response.headers.set('x-url', request.url)
//   response.headers.set('x-host', host)
//   response.headers.set('x-protocol', protocol)
//   response.headers.set('x-base-url', baseUrl)

//   return response
// }
