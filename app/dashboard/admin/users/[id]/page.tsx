import { notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { prisma } from "@/lib/prisma"
import { updateUser } from "@/app/actions/admin"
import { UserForm } from "../../_components/user-form"

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession()
  requireAdmin(session)

  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) notFound()

  const [cityHalls, hospitals] = await Promise.all([
    prisma.cityHall.findMany({ select: { id: true, name: true, city: true }, orderBy: { name: "asc" } }),
    prisma.hospital.findMany({ select: { id: true, name: true, city: true }, orderBy: { name: "asc" } }),
  ])

  const updateAction = async (formData: FormData) => {
    "use server"
    await updateUser(id, formData)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-lg font-semibold">Modifier — {user.username}</h1>
      <UserForm
        action={updateAction}
        cityHalls={cityHalls}
        hospitals={hospitals}
        defaultValues={user}
        submitLabel="Enregistrer"
        cancelHref="/dashboard/admin/users"
        isEdit
      />
    </div>
  )
}
