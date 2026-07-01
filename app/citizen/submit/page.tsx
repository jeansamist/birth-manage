import * as React from "react"
import { prisma } from "@/lib/prisma"
import { SubmitForm } from "./_components/submit-form"

export default async function SubmitPage() {
  const cityHalls = await prisma.cityHall.findMany({
    where: { isActive: true },
    orderBy: [{ city: "asc" }, { name: "asc" }],
    select: { id: true, name: true, city: true },
  })

  return (
    <div className="w-full h-[calc(100vh-7rem)] min-h-0">
      <SubmitForm cityHalls={cityHalls} />
    </div>
  )
}
