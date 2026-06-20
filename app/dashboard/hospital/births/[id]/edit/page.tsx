import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import type { BirthFormInput } from "@/lib/schemas/birth"
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

  // Format and safely map the Prisma record fields to BirthFormInput type
  const initialData: Partial<BirthFormInput> = {
    babyFirstName: record.babyFirstName ?? "",
    babyLastName: record.babyLastName ?? "",
    babyGender: (record.babyGender as "MALE" | "FEMALE") ?? undefined,
    birthDate: record.birthDate ? record.birthDate.toISOString().split("T")[0] : "",
    birthTime: record.birthTime ?? undefined,
    birthPlace: record.birthPlace ?? undefined,
    weightGrams: record.weightGrams ?? undefined,
    heightCm: record.heightCm ?? undefined,
    apgarScore: record.apgarScore ?? undefined,
    deliveryType: record.deliveryType ?? undefined,
    medicalNotes: record.medicalNotes ?? undefined,
    motherFirstName: record.motherFirstName ?? "",
    motherLastName: record.motherLastName ?? "",
    motherBirthDate: record.motherBirthDate
      ? record.motherBirthDate.toISOString().split("T")[0]
      : undefined,
    motherNationality: record.motherNationality ?? undefined,
    motherCni: record.motherCni ?? undefined,
    motherProfession: record.motherProfession ?? undefined,
    motherAddress: record.motherAddress ?? undefined,
    motherPhone: record.motherPhone ?? undefined,
    motherEmail: record.motherEmail ?? undefined,
    fatherFirstName: record.fatherFirstName ?? undefined,
    fatherLastName: record.fatherLastName ?? undefined,
    fatherBirthDate: record.fatherBirthDate
      ? record.fatherBirthDate.toISOString().split("T")[0]
      : undefined,
    fatherNationality: record.fatherNationality ?? undefined,
    fatherCni: record.fatherCni ?? undefined,
    fatherProfession: record.fatherProfession ?? undefined,
    fatherAddress: record.fatherAddress ?? undefined,
    fatherPhone: record.fatherPhone ?? undefined,
    parentsMarried: record.parentsMarried,
    marriageCertNumber: record.marriageCertNumber ?? undefined,
    marriageDate: record.marriageDate
      ? record.marriageDate.toISOString().split("T")[0]
      : undefined,
    cityHallId: record.cityHallId ?? "",
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <BirthForm cityHalls={cityHalls} initialData={initialData} id={id} />
    </div>
  )
}
