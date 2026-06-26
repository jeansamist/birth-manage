import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { canDownloadCertificate } from "@/lib/certificate-access"
import { buildBirthCertificatePdf } from "@/lib/certificate-pdf"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const birth = await prisma.birthRecord.findUnique({
    where: { id },
    include: {
      hospital: { select: { name: true, city: true } },
      cityHall: { select: { name: true, city: true } },
      doctor: { select: { firstName: true, lastName: true } },
      maire: { select: { firstName: true, lastName: true } },
      secretaire: { select: { firstName: true, lastName: true } },
    },
  })

  if (!birth || birth.status !== "APPROVED" || !birth.certificateNumber) {
    return NextResponse.json({ error: "Certificat introuvable" }, { status: 404 })
  }

  if (!(await canDownloadCertificate(session, id, birth.cityHallId))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  const pdfBytes = await buildBirthCertificatePdf({
    ...birth,
    certificateNumber: birth.certificateNumber,
  })

  const pdfBuffer = new ArrayBuffer(pdfBytes.length)
  new Uint8Array(pdfBuffer).set(pdfBytes)

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="acte-naissance-${birth.certificateNumber}.pdf"`,
    },
  })
}
