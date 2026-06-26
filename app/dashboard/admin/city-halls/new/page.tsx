import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { createCityHall } from "@/app/actions/admin"
import { InstitutionForm } from "../../_components/institution-form"

export default async function NewCityHallPage() {
  const session = await getSession()
  requireAdmin(session)

  async function submit(formData: FormData) {
    "use server"
    await createCityHall(formData)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-lg font-semibold">Nouvelle mairie</h1>
      <InstitutionForm
        action={submit}
        submitLabel="Créer la mairie"
        cancelHref="/dashboard/admin/city-halls"
      />
    </div>
  )
}
