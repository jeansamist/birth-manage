import Link from "next/link"
import { PlusIcon } from "lucide-react"
import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminUsersPage() {
  const session = await getSession()
  requireAdmin(session)

  const users = await prisma.user.findMany({
    orderBy: { username: "asc" },
    include: { cityHall: { select: { name: true } } },
  })

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Utilisateurs</h1>
          <p className="text-xs text-muted-foreground">{users.length} compte(s)</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/admin/users/new">
            <PlusIcon className="mr-1.5 size-3.5" /> Ajouter
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Identifiant</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Nom</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Rôle</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Mairie</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Statut</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{u.username}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="px-4 py-3">{u.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.cityHall?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={u.isActive ? "text-green-600" : "text-red-600"}>
                      {u.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/dashboard/admin/users/${u.id}`} className="text-primary hover:underline">
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
