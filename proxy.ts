import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Routes that strictly require an agent to be logged in
const isProtectedRoute = createRouteMatcher([
    '/agent-dashboard(.*)',
    '/add-property(.*)'
]);

export default clerkMiddleware((auth, req) => {
    if (isProtectedRoute(req)) {
        auth.protect()
    }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/:path*',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};