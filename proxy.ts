import { clerkMiddleware } from "@clerk/nextjs/server"

export default clerkMiddleware()

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
