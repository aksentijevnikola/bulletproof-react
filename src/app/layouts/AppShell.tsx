import { Link } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import type { PropsWithChildren } from "react";

import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

import { ThemeControl } from "./ThemeControl";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="bg-background sr-only rounded px-3 py-2 focus:not-sr-only focus:absolute focus:z-50"
      >
        Skip to content
      </a>
      <header className="border-border border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="text-lg font-bold tracking-tight">
            Bulletproof <span className="text-primary">React</span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-2 sm:flex">
            <Link
              to="/"
              className="hover:bg-accent rounded-lg px-3 py-2 text-sm [&.active]:font-semibold"
            >
              Home
            </Link>
            <Link
              to="/records"
              className="hover:bg-accent rounded-lg px-3 py-2 text-sm [&.active]:font-semibold"
            >
              Sample records
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeControl />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="sm:hidden"
                  aria-label="Open navigation menu"
                >
                  <MenuIcon aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/records">Sample records</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main id="main" className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        {children}
      </main>
      <footer className="border-border text-muted-foreground border-t px-4 py-6 text-center text-sm">
        A reusable frontend shell. Replace the sample pages with your product.
      </footer>
    </div>
  );
}
