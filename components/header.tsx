"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";

export const navLinks = [
  {
    label: "Recherche & Impression",
    href: "/citizen",
  },
  {
    label: "Suivre un dossier",
    href: "/citizen/track",
  },
  {
    label: "Déclaration FNU",
    href: "/citizen/submit",
  },
];

export function Header() {
  const scrolled = useScroll(10);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-5xl border-transparent border-b md:transition-all md:ease-out",
        {
          "border-neutral-200 bg-white/90 backdrop-blur-md md:top-2 md:max-w-4xl md:shadow-xs md:rounded-md":
            scrolled,
        }
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          {
            "md:px-4": scrolled,
          }
        )}
      >
        <Link
          className="flex items-center gap-2 rounded-md p-1 hover:bg-neutral-50"
          href="/citizen"
        >
          <Logo className="h-4.5 text-neutral-900" />
          <span className="h-4 w-px bg-neutral-200" />
          <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-600">
            Portail Citoyen
          </span>
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex gap-1">
            {navLinks.map((link) => (
              <Button asChild key={link.label} size="sm" variant="ghost" className="text-neutral-600 hover:text-neutral-900 text-xs font-semibold uppercase tracking-wider rounded-sm">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
          <span className="h-4 w-px bg-neutral-200" />
          <Button asChild size="sm" variant="outline" className="border-neutral-300 hover:bg-neutral-50 text-xs font-semibold uppercase tracking-wider rounded-sm">
            <Link href="/auth/login">Espace Agents</Link>
          </Button>
        </div>
        <div className="flex md:hidden">
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
