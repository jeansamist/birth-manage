import { NextResponse } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

function fmt(date: Date | null | undefined): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

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
      hospital: true,
      cityHall: true,
      doctor: { select: { firstName: true, lastName: true } },
    },
  })

  if (!birth || birth.status !== "APPROVED" || !birth.certificateNumber) {
    return NextResponse.json({ error: "Certificat introuvable" }, { status: 404 })
  }

  // Only the doctor or city-hall members can download
  const canAccess =
    session.role === "ADMIN" ||
    session.userId === birth.doctorId ||
    session.institutionId === birth.cityHallId

  if (!canAccess) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  // ── Build PDF ──────────────────────────────────────────────────────────────
  const doc = await PDFDocument.create()
  const page = doc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const font = await doc.embedFont(StandardFonts.Helvetica)

  const primary = rgb(0.08, 0.35, 0.63)
  const dark = rgb(0.1, 0.1, 0.1)
  const muted = rgb(0.45, 0.45, 0.45)

  let y = height - 50

  // Header bar
  page.drawRectangle({ x: 0, y: height - 80, width, height: 80, color: primary })
  page.drawText("ACTE DE NAISSANCE", {
    x: 50, y: height - 50,
    font: fontBold, size: 20, color: rgb(1, 1, 1),
  })
  page.drawText("RÉPUBLIQUE DU CAMEROUN", {
    x: 50, y: height - 70,
    font, size: 9, color: rgb(0.8, 0.9, 1),
  })

  y = height - 110

  // Certificate number
  page.drawText(`N° ${birth.certificateNumber}`, {
    x: 50, y, font: fontBold, size: 11, color: primary,
  })

  y -= 30

  function section(title: string) {
    y -= 8
    page.drawRectangle({ x: 50, y: y - 2, width: width - 100, height: 20, color: rgb(0.93, 0.96, 1) })
    page.drawText(title.toUpperCase(), {
      x: 55, y: y + 3, font: fontBold, size: 8, color: primary,
    })
    y -= 16
  }

  function row(label: string, value: string) {
    page.drawText(label, { x: 55, y, font, size: 9, color: muted })
    page.drawText(value, { x: 200, y, font: fontBold, size: 9, color: dark })
    y -= 16
  }

  // Enfant
  section("Informations sur l'enfant")
  row("Prénom", birth.babyFirstName ?? "—")
  row("Nom", birth.babyLastName ?? "—")
  row("Sexe", birth.babyGender === "MALE" ? "Masculin" : "Féminin")
  row("Date de naissance", fmt(birth.birthDate))
  if (birth.birthTime) row("Heure", birth.birthTime)
  if (birth.birthPlace) row("Lieu", birth.birthPlace)

  y -= 6

  // Mère
  section("Mère")
  row("Prénom & Nom", `${birth.motherFirstName ?? "—"} ${birth.motherLastName ?? ""}`)
  if (birth.motherBirthDate) row("Date de naissance", fmt(birth.motherBirthDate))
  if (birth.motherNationality) row("Nationalité", birth.motherNationality)
  if (birth.motherCni) row("CNI / Passeport", birth.motherCni)
  if (birth.motherProfession) row("Profession", birth.motherProfession)

  y -= 6

  // Père
  if (birth.fatherFirstName) {
    section("Père")
    row("Prénom & Nom", `${birth.fatherFirstName} ${birth.fatherLastName ?? ""}`)
    if (birth.fatherBirthDate) row("Date de naissance", fmt(birth.fatherBirthDate))
    if (birth.fatherNationality) row("Nationalité", birth.fatherNationality)
    if (birth.fatherCni) row("CNI / Passeport", birth.fatherCni)
    if (birth.fatherProfession) row("Profession", birth.fatherProfession)
    y -= 6
  }

  // Mariage
  section("Situation matrimoniale")
  row("Parents mariés", birth.parentsMarried ? "Oui" : "Non")
  if (birth.parentsMarried && birth.marriageCertNumber) {
    row("N° acte de mariage", birth.marriageCertNumber)
    row("Date du mariage", fmt(birth.marriageDate))
  }

  y -= 6

  // Institution
  section("Établissements")
  row("Hôpital", birth.hospital.name)
  row("Mairie", birth.cityHall?.name ?? "—")
  row("Médecin", `Dr. ${birth.doctor.firstName} ${birth.doctor.lastName}`)
  row("Approuvé le", fmt(birth.approvedAt))

  y -= 30

  // Signature area
  page.drawText("Signature du Maire", { x: width - 200, y, font: fontBold, size: 9, color: dark })
  page.drawLine({ start: { x: width - 220, y: y - 40 }, end: { x: width - 50, y: y - 40 }, thickness: 1, color: muted })

  // Footer
  page.drawRectangle({ x: 0, y: 0, width, height: 35, color: rgb(0.96, 0.97, 0.99) })
  page.drawText(
    `Document généré le ${fmt(new Date())} · ${birth.certificateNumber}`,
    { x: 50, y: 12, font, size: 7.5, color: muted },
  )

  const pdfBytes = await doc.save()

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="acte-naissance-${birth.certificateNumber}.pdf"`,
    },
  })
}
