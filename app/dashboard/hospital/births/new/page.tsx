import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { BirthForm } from "./_components/birth-form"

export default async function NewBirthPage() {
  const session = await getSession()
  if (!session || session.role !== "DOCTOR") redirect("/dashboard")

  const [cityHalls, assignment] = await Promise.all([
    prisma.cityHall.findMany({
      where: { isActive: true },
      select: { id: true, name: true, city: true },
      orderBy: { name: "asc" },
    }),
    prisma.doctorHospitalAssignment.findFirst({
      where: { userId: session.userId, isApproved: true },
      include: { hospital: { select: { name: true, city: true } } },
    }),
  ])

  const defaultBirthPlace = assignment?.hospital
    ? `${assignment.hospital.name}, ${assignment.hospital.city}`
    : ""

  return (
    // Full-height page, no extra padding — the form manages its own layout
    <div className="h-full min-h-0 flex flex-col">
      <BirthForm cityHalls={cityHalls} defaultBirthPlace={defaultBirthPlace} />
    </div>
  )
}
