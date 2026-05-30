import { clerkMiddleware } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const hasClerk = !!process.env.CLERK_SECRET_KEY

export default function middleware(req: any, event: any) {
  if (!hasClerk) {
    return NextResponse.next()
  }
  return clerkMiddleware()(req, event)
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and favicon
    "/((?!api|_next|static|favicon.ico).*)",
    // Always run for API and TRPC routes
    "/(api|trpc)(.*)",
    // Always run for Clerk proxy/auto-proxy routes
    "/__clerk/(.*)",
  ],
}
