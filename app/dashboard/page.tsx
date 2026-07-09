import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardContent, type StatCard } from "@/app/dashboard/_components/content"
import { LandmarkIcon, Building2Icon, UsersIcon, StethoscopeIcon, ChevronRightIcon } from "lucide-react"

const ADMIN_LINKS = [
  { href: "/dashboard/admin/mairies", label: "Mairies", icon: LandmarkIcon },
  { href: "/dashboard/admin/hopitaux", label: "Hôpitaux", icon: Building2Icon },
  { href: "/dashboard/admin/maires", label: "Maires", icon: UsersIcon },
  { href: "/dashboard/admin/secretaires", label: "Secrétaires", icon: UsersIcon },
  { href: "/dashboard/admin/medecins", label: "Médecins", icon: StethoscopeIcon },
]

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  if (session.role === "DOCTOR") redirect("/dashboard/hospital")
  if (session.role === "SECRETAIRE") redirect("/dashboard/city-hall")
  if (session.role === "MAIRE") redirect("/dashboard/maire")
  if (session.role === "MAINTAINER") redirect("/dashboard/city-hall")

  // ADMIN
  const [cityHallCount, hospitalCount, maireCount, secretaireCount, doctorCount] = await Promise.all([
    prisma.cityHall.count({ where: { isActive: true } }),
    prisma.hospital.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: "MAIRE", isActive: true } }),
    prisma.user.count({ where: { role: "SECRETAIRE", isActive: true } }),
    prisma.user.count({ where: { role: "DOCTOR", isActive: true } }),
  ])

  const statsCards: StatCard[] = [
    { title: "Mairies actives", value: String(cityHallCount), subtitle: "Voir toutes", icon: "file", subtitleIcon: "file" },
    { title: "Hôpitaux actifs", value: String(hospitalCount), subtitle: "Voir tous", icon: "file", subtitleIcon: "file" },
    { title: "Maires", value: String(maireCount), subtitle: "Comptes actifs", icon: "check", subtitleIcon: "check" },
    { title: "Secrétaires", value: String(secretaireCount), subtitle: "Comptes actifs", icon: "check", subtitleIcon: "check" },
  ]

  return (
    <DashboardContent statsCards={statsCards}>
      <div>
        <h1 className="text-sm font-bold uppercase tracking-wider text-neutral-800">Administration</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Connecté en tant que <strong>{session.username}</strong> · {doctorCount} médecin{doctorCount > 1 ? "s" : ""} actif{doctorCount > 1 ? "s" : ""}
        </p>
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ADMIN_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4 hover:bg-muted/40 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Icon className="size-5 text-muted-foreground" />
              <span className="font-medium">{label}</span>
            </div>
            <ChevronRightIcon className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </DashboardContent>
  )
}
