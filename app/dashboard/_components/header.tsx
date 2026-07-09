"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { NotificationBell } from "./notification-bell"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  PanelLeftIcon,
  HomeIcon,
  CheckIcon,
  RefreshCwIcon,
} from "lucide-react"
import {
  useDashboardStore,
  type LayoutDensity,
} from "@/store/dashboard-store"

const densityLabels: Record<LayoutDensity, string> = {
  compact: "Compact",
  default: "Standard",
  comfortable: "Confortable",
}

function getPageTitle(pathname: string): string {
  if (pathname.includes("/hospital/births/new")) return "Nouvelle naissance"
  if (pathname.includes("/hospital/births")) return "Dossier naissance"
  if (pathname.includes("/hospital")) return "Tableau de bord — Hôpital"
  if (pathname.includes("/city-hall/births")) return "Dossier naissance"
  if (pathname.includes("/city-hall")) return "Tableau de bord — Mairie"
  if (pathname.includes("/maire")) return "Approbations — Maire"
  if (pathname === "/dashboard") return "Administration"
  return "Tableau de bord"
}

export function DashboardHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  const layoutDensity = useDashboardStore((s) => s.layoutDensity)
  const showAlertBanner = useDashboardStore((s) => s.showAlertBanner)
  const showStatsCards = useDashboardStore((s) => s.showStatsCards)
  const showTable = useDashboardStore((s) => s.showTable)
  const setLayoutDensity = useDashboardStore((s) => s.setLayoutDensity)
  const setShowAlertBanner = useDashboardStore((s) => s.setShowAlertBanner)
  const setShowStatsCards = useDashboardStore((s) => s.setShowStatsCards)
  const setShowTable = useDashboardStore((s) => s.setShowTable)
  const resetLayout = useDashboardStore((s) => s.resetLayout)

  return (
    <header className="w-full flex items-center gap-3 px-4 sm:px-6 py-4 border-b bg-background sticky top-0 z-10">
      <SidebarTrigger className="lg:hidden">
        <PanelLeftIcon className="size-5" />
      </SidebarTrigger>

      <HomeIcon className="size-5 text-muted-foreground hidden sm:block" />
      <h1 className="flex-1 font-medium text-base truncate">{pageTitle}</h1>

      <span className="hidden sm:block text-xs text-muted-foreground">
        {new Date().toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </span>

      <div className="hidden sm:block h-5 w-px bg-border" />

      <NotificationBell />
      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
            <PanelLeftIcon className="size-4" />
            Affichage
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
            Densité
          </DropdownMenuLabel>
          {(Object.keys(densityLabels) as LayoutDensity[]).map((key) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setLayoutDensity(key)}
            >
              {densityLabels[key]}
              {layoutDensity === key && (
                <CheckIcon className="size-4 ml-auto" />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
            Sections visibles
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={showAlertBanner}
            onCheckedChange={setShowAlertBanner}
          >
            Bannière d'alertes
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showStatsCards}
            onCheckedChange={setShowStatsCards}
          >
            Cartes statistiques
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={showTable}
            onCheckedChange={setShowTable}
          >
            Tableau principal
          </DropdownMenuCheckboxItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={resetLayout}>
            <RefreshCwIcon className="size-4 mr-2" />
            Réinitialiser
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
