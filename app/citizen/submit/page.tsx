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
    <div className="border border-neutral-200 rounded-md overflow-hidden bg-white shadow-xs">
      <SubmitForm cityHalls={cityHalls} />
    </div>
  )
}
