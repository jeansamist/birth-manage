import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { createUser } from "@/app/actions/admin"
import { UserForm } from "../../_components/user-form"

export default async function NewUserPage() {
  const session = await getSession()
  requireAdmin(session)

  const [cityHalls, hospitals] = await Promise.all([
    prisma.cityHall.findMany({ select: { id: true, name: true, city: true }, orderBy: { name: "asc" } }),
    prisma.hospital.findMany({ select: { id: true, name: true, city: true }, orderBy: { name: "asc" } }),
  ])

  async function submit(formData: FormData) {
    "use server"
    await createUser(formData)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-lg font-semibold">Nouvel utilisateur</h1>
      <UserForm
        action={submit}
        cityHalls={cityHalls}
        hospitals={hospitals}
        submitLabel="Créer le compte"
        cancelHref="/dashboard/admin/users"
      />
    </div>
  )
}
