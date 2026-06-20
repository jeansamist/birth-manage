import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BirthForm } from "../../new/_components/birth-form"

interface EditBirthPageProps {
  params: Promise<{ id: string }>
}

export default async function EditBirthPage({ params }: EditBirthPageProps) {
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") redirect("/dashboard")

  const { id } = await params

  const record = await prisma.birthRecord.findUnique({
    where: { id },
  })

  // Verify the record exists, is owned by this doctor, and is in a state allowing edits
  if (!record || record.doctorId !== session.userId) {
    redirect("/dashboard/hospital")
  }

  if (record.status !== "DRAFT" && record.status !== "DECLINED") {
    redirect("/dashboard/hospital")
  }

  const cityHalls = await prisma.cityHall.findMany({
    where: { isActive: true },
    select: { id: true, name: true, city: true },
    orderBy: { name: "asc" },
  })

  // Format Date objects to YYYY-MM-DD strings for date inputs
  const initialData = {
    ...record,
    birthDate: record.birthDate ? record.birthDate.toISOString().split("T")[0] : "",
    motherBirthDate: record.motherBirthDate
      ? record.motherBirthDate.toISOString().split("T")[0]
      : "",
    fatherBirthDate: record.fatherBirthDate
      ? record.fatherBirthDate.toISOString().split("T")[0]
      : "",
    marriageDate: record.marriageDate
      ? record.marriageDate.toISOString().split("T")[0]
      : "",
    weightGrams: record.weightGrams ?? undefined,
    heightCm: record.heightCm ?? undefined,
    apgarScore: record.apgarScore ?? undefined,
    deliveryType: record.deliveryType ?? undefined,
    cityHallId: record.cityHallId ?? "",
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <BirthForm cityHalls={cityHalls} initialData={initialData} id={id} />
    </div>
  )
}
