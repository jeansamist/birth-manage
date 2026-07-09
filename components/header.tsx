"use client"

import { MobileNav } from "@/components/mobile-nav"
import { Button } from "@/components/ui/button"
import { useScroll } from "@/hooks/use-scroll"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

export const navLinks = [
  {
    label: "Recherche & Transferts",
    href: "/citizen",
  },
  {
    label: "Suivre un dossier",
    href: "/citizen/track",
  },
  // {
  //   label: "Déclaration FNU",
  //   href: "/citizen/submit",
  // },
]

export function Header() {
  const scrolled = useScroll(10)

  return (
    <header
      className={cn(
        "fixed top-1 right-0 left-0 z-50 mx-auto w-full max-w-5xl border-b border-neutral-100 bg-white/80 backdrop-blur-md md:transition-all md:ease-out",
        {
          "border-neutral-200 bg-white/90 backdrop-blur-md md:top-2 md:max-w-4xl md:rounded-md md:shadow-xs":
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
          className="flex cursor-pointer items-center gap-2.5 rounded-md p-1 hover:bg-neutral-50"
          href="/citizen"
        >
          <div className="relative h-8 w-8 select-none">
            <Image
              src="/bunec-logo.png"
              alt="BUNEC Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="h-4 w-px bg-neutral-200" />
          <div className="flex flex-col text-left select-none">
            <span className="text-[10px] leading-tight font-black tracking-wider text-neutral-800 uppercase">
              BUNEC
            </span>
            <span className="text-[6.5px] leading-none font-bold tracking-widest text-neutral-500 uppercase">
              État Civil Cameroun
            </span>
          </div>
        </Link>
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex gap-1">
            {navLinks.map((link) => (
              <Button
                asChild
                key={link.label}
                size="sm"
                variant="ghost"
                className="rounded-sm text-xs font-semibold tracking-wider text-neutral-600 uppercase hover:text-neutral-900"
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
          {/* <span className="h-4 w-px bg-neutral-200" />
          <Button
            asChild
            size="sm"
            variant="outline"
            className="rounded-sm border-neutral-300 text-xs font-semibold tracking-wider uppercase hover:bg-neutral-50"
          >
            <Link href="/auth/login">Espace Agents</Link>
          </Button> */}
        </div>
        <div className="flex md:hidden">
          <MobileNav />
        </div>
      </nav>
    </header>
  )
}
