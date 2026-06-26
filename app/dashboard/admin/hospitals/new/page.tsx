import { getSession } from "@/lib/auth"
import { requireAdmin } from "@/lib/admin/guards"
import { createHospital } from "@/app/actions/admin"
import { InstitutionForm } from "../../_components/institution-form"

export default async function NewHospitalPage() {
  const session = await getSession()
  requireAdmin(session)

  async function submit(formData: FormData) {
    "use server"
    await createHospital(formData)
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-lg font-semibold">Nouvel hôpital</h1>
      <InstitutionForm
        action={submit}
        submitLabel="Créer l'hôpital"
        cancelHref="/dashboard/admin/hospitals"
      />
    </div>
  )
}
