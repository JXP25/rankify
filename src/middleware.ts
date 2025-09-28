import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // The updateSession function runs first to handle session management
  return await updateSession(request);
}

export const config = {
  // The matcher specifies which paths the middleware should run on.
  // This avoids running it on unnecessary routes like static files (_next/static)
  // or images, which improves performance.
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
