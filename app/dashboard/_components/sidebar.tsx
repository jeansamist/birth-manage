"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import type { SessionPayload } from "@/types/auth"
import {
  HomeIcon,
  PlusIcon,
  FileTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  SendIcon,
  ArrowRightLeftIcon,
  Building2Icon,
  LandmarkIcon,
  UsersIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  InboxIcon,
  BookOpenIcon,
  BarChart2Icon,
  AlertCircleIcon,
} from "lucide-react"

interface NavProps {
  session: SessionPayload
}

// ─── Nav Link ─────────────────────────────────────────────────────────────────

function NavLink({
  href,
  icon: Icon,
  label,
  badge,
  exact = false,
}: {
  href: string
  icon: React.ElementType
  label: string
  badge?: string
  exact?: boolean
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [hrefPath, hrefQuery] = href.split("?")
  const pathMatches = exact ? pathname === hrefPath : pathname.startsWith(hrefPath)

  let paramsMatch = true
  if (hrefQuery) {
    const urlParams = new URLSearchParams(hrefQuery)
    for (const [key, value] of urlParams.entries()) {
      if (searchParams.get(key) !== value) {
        paramsMatch = false
        break
      }
    }
  } else {
    if (
      searchParams.get("filter") ||
      searchParams.get("section") ||
      searchParams.get("view")
    ) {
      paramsMatch = false
    }
  }

  const active = pathMatches && paramsMatch

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={active} className="h-[38px]" asChild>
        <Link href={href}>
          <Icon className="size-4 shrink-0" />
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
          {active && (
            <ChevronRightIcon className="size-3.5 text-muted-foreground opacity-60" />
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function CollapsibleSection({
  label,
  children,
  defaultOpen = true,
}: {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel className="flex items-center gap-1.5 px-0 text-[10px] font-semibold tracking-wider text-muted-foreground">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1.5 cursor-pointer"
        >
          <ChevronDownIcon
            className={cn(
              "size-3.5 transition-transform duration-200",
              !open && "-rotate-90"
            )}
          />
          {label}
        </button>
      </SidebarGroupLabel>
      {open && (
        <SidebarGroupContent>
          <SidebarMenu className="mt-1">{children}</SidebarMenu>
        </SidebarGroupContent>
      )}
    </SidebarGroup>
  )
}

// ─── Initials helper ──────────────────────────────────────────────────────────

function getInitials(username: string) {
  return username
    .split(/[.\-_\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("")
}

// ─── Role label ───────────────────────────────────────────────────────────────

function roleLabel(role: string) {
  switch (role) {
    case "DOCTOR": return "Médecin"
    case "SECRETAIRE": return "Secrétaire"
    case "MAIRE": return "Maire"
    case "MAINTAINER": return "Mainteneur"
    case "ADMIN": return "Administrateur"
    default: return role
  }
}

// ─── Main sidebar ─────────────────────────────────────────────────────────────

export function DashboardSidebar({
  session,
  ...props
}: NavProps & React.ComponentProps<typeof Sidebar>) {
  const institutionLabel = session.institutionType === "hospital"
    ? "Hôpital"
    : session.institutionType === "city-hall"
    ? "Mairie"
    : "Système"

  const initials = getInitials(session.username)

  return (
    <Sidebar collapsible="offcanvas" className="lg:border-r-0!" {...props}>
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <SidebarHeader className="p-5 pb-0">
        <div className="flex items-center justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
              <div className="size-7 rounded-full overflow-hidden bg-linear-to-br from-green-600 via-yellow-500 to-red-600 flex items-center justify-center ring-1 ring-white/40 shadow-lg" />
              <span className="font-medium text-sm text-muted-foreground truncate max-w-28">
                {session.institutionName ?? "État Civil"}
              </span>
              <ChevronDownIcon className="size-3 text-muted-foreground shrink-0" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-60">
              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Institution
              </DropdownMenuLabel>
              <DropdownMenuItem className="gap-2">
                <div className="size-5 rounded-full bg-linear-to-br from-green-600 via-yellow-500 to-red-600 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{session.institutionName ?? "État Civil"}</span>
                  <span className="text-[10px] text-muted-foreground">{institutionLabel}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
                Compte
              </DropdownMenuLabel>
              <DropdownMenuItem className="gap-2">
                <Avatar className="size-5">
                  <AvatarFallback className="text-[9px]">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{session.username}</span>
                  <span className="text-[10px] text-muted-foreground">{roleLabel(session.role)}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Avatar className="size-7">
            <AvatarFallback className="text-xs bg-muted">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </SidebarHeader>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <SidebarContent className="px-5 pt-5 gap-4">
        {/* Search */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            className="pl-8 pr-10 h-9 bg-background text-sm"
            readOnly
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-muted px-1.5 py-0.5 rounded text-[10px] text-muted-foreground font-medium">
            ⌘K
          </div>
        </div>

        {/* ── DOCTOR ──────────────────────────────────────────────────── */}
        {session.role === "DOCTOR" && (
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink href="/dashboard/hospital/births/new" icon={PlusIcon} label="Déclarer une naissance" />
                <NavLink href="/dashboard/hospital" icon={FileTextIcon} label="Brouillons & Corrections" exact />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* ── SECRETAIRE ────────────────────────────────────────────── */}
        {session.role === "SECRETAIRE" && (
          <>
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavLink href="/dashboard/city-hall" icon={HomeIcon} label="Tableau de bord" exact />
                  <NavLink href="/dashboard/city-hall?filter=submitted" icon={InboxIcon} label="Dossiers reçus" />
                  <NavLink href="/dashboard/city-hall?filter=processing" icon={ClockIcon} label="En traitement" />
                  <NavLink href="/dashboard/city-hall?filter=pending_approval" icon={SendIcon} label="Soumis au maire" />
                  <NavLink href="/dashboard/city-hall?filter=approved" icon={CheckCircleIcon} label="Actes Approuvés" />
                  <NavLink href="/dashboard/city-hall?filter=copies" icon={ArrowRightLeftIcon} label="Copies reçues" />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <CollapsibleSection label="RACCOURCIS">
              <NavLink href="/dashboard/city-hall?filter=all" icon={BookOpenIcon} label="Tous les dossiers" />
            </CollapsibleSection>
          </>
        )}

        {/* ── MAINTAINER ────────────────────────────────────────────── */}
        {session.role === "MAINTAINER" && (
          <>
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavLink href="/dashboard/city-hall" icon={HomeIcon} label="Tableau de bord" exact />
                  <NavLink href="/dashboard/city-hall?filter=all" icon={BookOpenIcon} label="Tous les dossiers" />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* ── MAIRE ─────────────────────────────────────────────────── */}
        {session.role === "MAIRE" && (
          <>
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  <NavLink href="/dashboard/maire" icon={HomeIcon} label="Tableau de bord" exact />
                  <NavLink href="/dashboard/maire?section=approvals" icon={AlertCircleIcon} label="À approuver" />
                  <NavLink href="/dashboard/maire?section=transfers" icon={ArrowRightLeftIcon} label="Transferts" />
                  <NavLink href="/dashboard/maire?filter=approved" icon={CheckCircleIcon} label="Actes signés" />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <CollapsibleSection label="HISTORIQUE">
              <NavLink href="/dashboard/maire?filter=declined" icon={XCircleIcon} label="Actes refusés" />
              <NavLink href="/dashboard/maire?filter=all" icon={BookOpenIcon} label="Tout l'historique" />
              <NavLink href="/dashboard/maire?view=stats" icon={BarChart2Icon} label="Statistiques" />
            </CollapsibleSection>
          </>
        )}

        {/* ── ADMIN ─────────────────────────────────────────────────── */}
        {session.role === "ADMIN" && (
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              <SidebarMenu>
                <NavLink href="/dashboard" icon={HomeIcon} label="Administration" exact />
                <NavLink href="/dashboard/settings" icon={SettingsIcon} label="Paramètres système" />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Système footer links */}
        <SidebarGroup className="p-0 mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <NavLink href="/dashboard/settings" icon={SettingsIcon} label="Paramètres" />
              <NavLink href="https://bunec.cm" icon={HelpCircleIcon} label="Aide / Documentation" />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <SidebarFooter className="px-5 pb-5">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="inline-flex w-full items-center justify-center gap-2 h-9 px-4 rounded-md border border-border bg-background hover:bg-muted shadow-xs text-sm font-medium transition-colors cursor-pointer">
              <LogOutIcon className="size-4" />
              Se déconnecter
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
              <AlertDialogDescription>
                Votre session sera immédiatement invalidée. Vous devrez vous reconnecter pour accéder à nouveau au système.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <form action="/api/auth/signout" method="POST">
                <AlertDialogAction type="submit" className="w-full cursor-pointer">
                  Confirmer la déconnexion
                </AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  )
}
