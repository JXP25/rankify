import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Profile } from "@/types/global";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Fetch profile if user exists
  let profile: Profile | null = null;
  if (user) {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.sub)
      .maybeSingle();
    profile = profileData as Profile | null;
  }
  console.log("user", user);
  console.log("profile", profile);

  // Handle routing logic based on user and profile existence
  if (user && profile) {
    // Both user and profile exist - check role-based access
    const currentPath = request.nextUrl.pathname;

    // Check if user is trying to access wrong role path
    if (profile.role === "CANDIDATE" && currentPath.startsWith("/reviewer")) {
      const url = request.nextUrl.clone();
      url.pathname = "/candidate/dashboard";
      return NextResponse.redirect(url);
    }

    if (profile.role === "REVIEWER" && currentPath.startsWith("/candidate")) {
      const url = request.nextUrl.clone();
      url.pathname = "/reviewer/dashboard";
      return NextResponse.redirect(url);
    }

    // If accessing root or other paths, redirect to role dashboard
    if (
      currentPath === "/" ||
      (!currentPath.startsWith("/candidate") &&
        !currentPath.startsWith("/reviewer"))
    ) {
      const url = request.nextUrl.clone();
      if (profile.role === "CANDIDATE") {
        url.pathname = "/candidate/dashboard";
      } else if (profile.role === "REVIEWER") {
        url.pathname = "/reviewer/dashboard";
      }
      return NextResponse.redirect(url);
    }
  } else if (user && !profile) {
    // Only user exists - redirect to onboarding (but not if already on onboarding)
    if (request.nextUrl.pathname !== "/onboarding") {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }
  } else if (!user) {
    // No user - redirect to home (but allow access to auth paths)
    if (
      request.nextUrl.pathname !== "/" &&
      !request.nextUrl.pathname.startsWith("/auth")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
