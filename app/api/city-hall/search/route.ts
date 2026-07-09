import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Recherche rapide pour le champ de la sidebar : quelques résultats,
// mêmes champs que la recherche avancée mais en un seul texte libre.

export async function GET(req: Request) {
  const session = await getSession()
  if (!session || !["SECRETAIRE", "MAINTAINER"].includes(session.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const cityHallId = session.institutionId
  if (!cityHallId) {
    return NextResponse.json({ results: [] })
  }

  const q = new URL(req.url).searchParams.get("q")?.trim() ?? ""
  if (q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const terms = q.split(/\s+/).filter(Boolean).slice(0, 6)
  const termFields = (term: string) => [
    { babyFirstName: { contains: term, mode: "insensitive" as const } },
    { babyLastName: { contains: term, mode: "insensitive" as const } },
    { motherFirstName: { contains: term, mode: "insensitive" as const } },
    { motherLastName: { contains: term, mode: "insensitive" as const } },
    { fatherFirstName: { contains: term, mode: "insensitive" as const } },
    { fatherLastName: { contains: term, mode: "insensitive" as const } },
    { certificateNumber: { contains: term, mode: "insensitive" as const } },
    { birthPlace: { contains: term, mode: "insensitive" as const } },
    { hospital: { is: { name: { contains: term, mode: "insensitive" as const } } } },
  ]

  const records = await prisma.birthRecord.findMany({
    where: {
      cityHallId,
      AND: terms.map((term) => ({ OR: termFields(term) })),
    },
    orderBy: { updatedAt: "desc" },
    take: 8,
    select: {
      id: true,
      babyFirstName: true,
      babyLastName: true,
      motherFirstName: true,
      motherLastName: true,
      certificateNumber: true,
      status: true,
      hospital: { select: { name: true } },
    },
  })

  return NextResponse.json({
    results: records.map((r) => ({
      id: r.id,
      childName: `${r.babyFirstName ?? ""} ${r.babyLastName ?? ""}`.trim() || null,
      motherName: `${r.motherFirstName ?? ""} ${r.motherLastName ?? ""}`.trim() || null,
      certificateNumber: r.certificateNumber,
      status: r.status,
      hospitalName: r.hospital.name,
    })),
  })
}
