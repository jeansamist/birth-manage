import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminCityHallsPage() {
  const session = await getSession()
  requireAdmin(session)

  const cityHalls = await prisma.cityHall.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { births: true, users: true } } },
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Mairies</h1>
          <p className="text-xs text-muted-foreground">{cityHalls.length} mairie(s)</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/admin/city-halls/new">
            <PlusIcon className="mr-1.5 size-3.5" /> Ajouter
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="text-sm font-medium">Liste des mairies</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Nom</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Ville</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Agents</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Actes</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {cityHalls.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.city}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c._count.users}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c._count.births}</td>
                  <td className="px-4 py-3">
                    <span className={c.isActive ? "text-green-600" : "text-red-600"}>
                      {c.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/admin/city-halls/${c.id}`} className="text-primary hover:underline">
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
