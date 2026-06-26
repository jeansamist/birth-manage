import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import {
  approveDoctorAssignment,
  revokeDoctorAssignment,
} from "@/app/actions/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AdminDoctorsPage() {
  const session = await getSession()
  requireAdmin(session)

  const assignments = await prisma.doctorHospitalAssignment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { username: true, firstName: true, lastName: true, email: true } },
      hospital: { select: { name: true, city: true } },
    },
  })

  const pending = assignments.filter((a) => !a.isApproved)
  const approved = assignments.filter((a) => a.isApproved)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold">Médecins & affectations</h1>
        <p className="text-xs text-muted-foreground">
          {pending.length} en attente · {approved.length} approuvé(s)
        </p>
      </div>

      {pending.length > 0 && (
        <Card>
          <CardHeader className="border-b border-border px-4 py-3">
            <CardTitle className="text-sm font-medium text-amber-700">
              En attente d&apos;approbation
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Médecin</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Hôpital</th>
                  <th className="px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {pending.map((a) => (
                  <tr key={a.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">Dr. {a.user.firstName} {a.user.lastName}</p>
                      <p className="text-muted-foreground">{a.user.username}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.hospital.name}</td>
                    <td className="px-4 py-3 text-right">
                      <form action={approveDoctorAssignment.bind(null, a.id)}>
                        <button type="submit" className="rounded-md bg-primary px-3 py-1.5 text-primary-foreground hover:bg-primary/90">
                          Approuver
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="text-sm font-medium">Affectations approuvées</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Médecin</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Hôpital</th>
                <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Approuvé le</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {approved.map((a) => (
                <tr key={a.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">Dr. {a.user.firstName} {a.user.lastName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{a.hospital.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.approvedAt
                      ? new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(a.approvedAt)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={revokeDoctorAssignment.bind(null, a.id)}>
                      <button type="submit" className="text-red-600 hover:underline">
                        Révoquer
                      </button>
                    </form>
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
