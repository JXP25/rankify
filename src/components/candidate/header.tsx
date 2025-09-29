"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "../ui/logout-button";

function Logo() {
  return (
    <Link
      href="#"
      className="flex items-center gap-2"
      aria-label="Rankify home"
    >
      <Image src="/logo.png" alt="Rankify" width={32} height={32} />
      <span className="font-semibold">Rankify</span>
    </Link>
  );
}

const nav = [
  { href: "/candidate/dashboard", label: "Dashboard" },
  { href: "/candidate/profile", label: "Profile" },
];

export function RoleHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <LogoutButton />
        </div>
        <button
          className="md:hidden inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm hover:bg-secondary"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>
      <div
        id="mobile-nav"
        className={cn("md:hidden border-t", open ? "block" : "hidden")}
      >
        <nav className="mx-auto max-w-6xl grid gap-1 px-4 py-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-sm hover:bg-secondary"
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
          <div className="mt-4 space-y-2">
            <LogoutButton />
          </div>
        </nav>
      </div>
    </header>
  );
}
