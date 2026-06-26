"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2Icon,
  FileTextIcon,
  HomeIcon,
  LandmarkIcon,
  LogOutIcon,
  PlusIcon,
  ShieldCheckIcon,
  StethoscopeIcon,
  UsersIcon,
  ArrowRightLeftIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { SessionPayload } from "@/types/auth"

interface NavProps {
  session: SessionPayload
  inboxBadge?: number
}

function NavLink({
  href,
  icon: Icon,
  label,
  exact = false,
  badge,
}: {
  href: string
  icon: React.ElementType
  label: string
  exact?: boolean
  badge?: number
}) {
  const pathname = usePathname()
  const active = exact ? pathname === href : pathname.startsWith(href)

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2 text-xs transition-colors",
        active
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Icon className="size-3.5 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge != null && badge > 0 ? (
        <Badge className="h-4 min-w-4 justify-center rounded-full px-1 text-[10px]">
          {badge > 9 ? "9+" : badge}
        </Badge>
      ) : null}
    </Link>
  )
}

export function DashboardNav({ session, inboxBadge = 0 }: NavProps) {
  const institutionLabel =
    session.institutionType === "hospital" ? "Hôpital" : "Mairie"

  return (
    <aside className="flex h-full w-52 shrink-0 flex-col border-r border-border bg-card">
      {/* Brand */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <FileTextIcon className="size-4 text-primary" />
        <span className="text-xs font-semibold">État Civil</span>
      </div>

      {/* Role badge */}
      <div className="border-b border-border px-4 py-2">
        <div className="flex items-center gap-1.5">
          {session.role === "DOCTOR" && (
            <Building2Icon className="size-3 text-muted-foreground" />
          )}
          {(session.role === "MAIRE" ||
            session.role === "SECRETAIRE" ||
            session.role === "MAINTAINER") && (
            <LandmarkIcon className="size-3 text-muted-foreground" />
          )}
          {session.role === "ADMIN" && (
            <ShieldCheckIcon className="size-3 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {session.role} · {institutionLabel || "Système"}
          </span>
        </div>
        <p className="mt-0.5 text-xs font-medium">{session.username}</p>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 p-2">
        {/* Doctor */}
        {session.role === "DOCTOR" && (
          <>
            <NavLink
              href="/dashboard/hospital"
              icon={HomeIcon}
              label="Tableau de bord"
              exact
            />
            <NavLink
              href="/dashboard/hospital/births/new"
              icon={PlusIcon}
              label="Nouvelle naissance"
            />
          </>
        )}

        {/* Secretaire */}
        {session.role === "SECRETAIRE" && (
          <>
            <NavLink
              href="/dashboard/city-hall"
              icon={HomeIcon}
              label="Tableau de bord"
              exact
              badge={inboxBadge}
            />
          </>
        )}

        {/* Maire */}
        {session.role === "MAIRE" && (
          <>
            <NavLink
              href="/dashboard/maire"
              icon={HomeIcon}
              label="Approbations"
              exact
              badge={inboxBadge}
            />
          </>
        )}

        {/* Maintainer */}
        {session.role === "MAINTAINER" && (
          <NavLink
            href="/dashboard/city-hall"
            icon={HomeIcon}
            label="Tableau de bord"
            exact
            badge={inboxBadge}
          />
        )}

        {/* Admin */}
        {session.role === "ADMIN" && (
          <>
            <NavLink href="/dashboard/admin" icon={HomeIcon} label="Vue d'ensemble" exact />
            <NavLink href="/dashboard/admin/hospitals" icon={Building2Icon} label="Hôpitaux" />
            <NavLink href="/dashboard/admin/city-halls" icon={LandmarkIcon} label="Mairies" />
            <NavLink href="/dashboard/admin/users" icon={UsersIcon} label="Utilisateurs" />
            <NavLink href="/dashboard/admin/doctors" icon={StethoscopeIcon} label="Médecins" />
            <NavLink href="/dashboard/admin/births" icon={FileTextIcon} label="Actes" />
            <NavLink href="/dashboard/admin/transfers" icon={ArrowRightLeftIcon} label="Transferts" />
          </>
        )}
      </nav>

      {/* Sign out */}
      <div className="mt-auto border-t border-border p-2">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOutIcon className="size-3.5" />
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  )
}
