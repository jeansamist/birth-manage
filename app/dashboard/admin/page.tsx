import Link from "next/link"
import {
  Building2Icon,
  FileTextIcon,
  LandmarkIcon,
  StethoscopeIcon,
  UsersIcon,
  ArrowRightLeftIcon,
} from "lucide-react"
import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { getAdminStats } from "@/lib/admin/stats"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const links = [
  { href: "/dashboard/admin/hospitals", label: "Hôpitaux", icon: Building2Icon },
  { href: "/dashboard/admin/city-halls", label: "Mairies", icon: LandmarkIcon },
  { href: "/dashboard/admin/users", label: "Utilisateurs", icon: UsersIcon },
  { href: "/dashboard/admin/doctors", label: "Médecins", icon: StethoscopeIcon },
  { href: "/dashboard/admin/births", label: "Actes de naissance", icon: FileTextIcon },
  { href: "/dashboard/admin/transfers", label: "Transferts", icon: ArrowRightLeftIcon },
]

export default async function AdminDashboardPage() {
  const session = await getSession()
  requireAdmin(session)

  const stats = await getAdminStats()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Administration</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {session!.username} — accès global
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="text-xs text-muted-foreground">Hôpitaux</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{stats.hospitals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="text-xs text-muted-foreground">Mairies</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{stats.cityHalls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="text-xs text-muted-foreground">Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{stats.users}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="px-4 pt-4 pb-1">
            <CardTitle className="text-xs text-muted-foreground">Actes approuvés</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold text-green-600">{stats.approvedBirths}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:bg-muted/50"
          >
            <Icon className="size-4 text-primary" />
            {label}
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="text-sm font-medium">Actes par statut</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
            {Object.entries(stats.birthsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between rounded-md bg-muted/40 px-3 py-2">
                <span className="text-muted-foreground">{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
          {stats.pendingDoctors > 0 && (
            <p className="mt-4 text-xs text-amber-700">
              {stats.pendingDoctors} médecin(s) en attente d&apos;approbation hôpital.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
