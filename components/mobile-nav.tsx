import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { navLinks } from "@/components/header";
import { XIcon, MenuIcon } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden cursor-pointer"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="ghost"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4 bg-background/95 backdrop-blur-md border-t border-border"
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="grid gap-y-2">
              {navLinks.map((link) => (
                <Button
                  asChild
                  className="justify-start text-muted-foreground font-semibold uppercase tracking-wider rounded-lg text-xs hover:text-foreground hover:bg-muted/50"
                  key={link.label}
                  variant="ghost"
                  onClick={() => setOpen(false)}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              <Button asChild className="w-full text-xs font-semibold uppercase tracking-wider rounded-lg" variant="outline" onClick={() => setOpen(false)}>
                <Link href="/auth/login">Espace Agents</Link>
              </Button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
