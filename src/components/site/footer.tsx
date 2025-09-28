import type React from "react";
import Link from "next/link";
function SocialIcon({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      aria-label={label}
      href={href}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border hover:bg-secondary"
    >
      {children}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-primary" />
              <span className="font-semibold">Rankify</span>
            </div>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Where Resumes Get Noticed.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-muted-foreground sm:grid-cols-4">
              <li>
                <Link href="#features" className="hover:text-foreground">
                  Features
                </Link>
              </li>

              <li>
                <Link href="#testimonials" className="hover:text-foreground">
                  Customers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground">
                  Privacy
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <SocialIcon label="Twitter" href="#">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.2-.8.5-1.7.8-2.6 1-1.6-1.7-4.5-1.4-5.6.7-.6 1.1-.5 2.3.1 3.3-3.2-.2-6-1.7-7.9-4.1-1.1 2 .1 4.2 2.1 5-.6 0-1.2-.2-1.7-.4 0 2.1 1.6 3.9 3.6 4.3-.7.2-1.3.2-2 .1.6 1.8 2.3 3.2 4.3 3.2-1.6 1.3-3.6 2-5.6 2-.4 0-.8 0-1.1-.1 2 1.3 4.4 2 6.9 2 8.3 0 12.9-7.1 12.6-13.4.9-.7 1.5-1.3 2-2.1z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="GitHub" href="#">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.4 1 1.4 1 .8 1.4 2.1 1 2.6.7.1-.6.4-1 .7-1.2-2.2-.2-4.5-1.2-4.5-5.2 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-2.9 0 0 .9-.3 3 .9.9-.2 1.8-.3 2.7-.3s1.8.1 2.7.3c2.1-1.2 3-.9 3-.9.6 1.5.2 2.6.1 2.9.7.8 1.1 1.8 1.1 3 0 4-2.3 5-4.5 5.2.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="LinkedIn" href="#">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M4.98 3.5C4.98 4.9 3.9 6 2.5 6S0 4.9 0 3.5 1.1 1 2.5 1 5 2.1 5 3.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-1 1.8-2.2 3.7-2.2 3.9 0 4.6 2.6 4.6 6V24h-4v-6.7c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V24h-4V8z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Rankify, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
