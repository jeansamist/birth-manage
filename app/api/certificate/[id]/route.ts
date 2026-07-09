import { NextResponse } from "next/server"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import path from "path"
import fs from "fs"
import { dateToFrenchLetters, formatDateStandard } from "@/lib/utils/date-words"

function fmt(date: Date | null | undefined): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

function cleanText(text: string | null | undefined): string {
  if (!text) return "—"
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/œ/g, "oe")
    .replace(/Æ/g, "AE")
    .replace(/æ/g, "ae")
    .replace(/°/g, "o")
    .replace(/’/g, "'")
}

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT || 3000}`
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
      secretaire: { select: { firstName: true, lastName: true } },
      maire: { select: { firstName: true, lastName: true } },
      copies: {
        where: { cityHallId: session.institutionId || "" }
      }
    },
  })

  if (!birth || birth.status !== "APPROVED" || !birth.certificateNumber) {
    return NextResponse.json({ error: "Certificat introuvable" }, { status: 404 })
  }

  // Only the doctor, city-hall members, or target city halls with a copy can download
  const hasCopy = birth.copies && birth.copies.length > 0
  const canAccess =
    session.role === "ADMIN" ||
    session.userId === birth.doctorId ||
    session.institutionId === birth.cityHallId ||
    hasCopy

  if (!canAccess) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  // ── Build PDF ──────────────────────────────────────────────────────────────
  const doc = await PDFDocument.create()
  const page = doc.addPage([595, 842]) // A4
  const { width, height } = page.getSize()

  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique)
  const fontBoldItalic = await doc.embedFont(StandardFonts.HelveticaBoldOblique)

  const primary = rgb(0.08, 0.35, 0.63)
  const dark = rgb(0.1, 0.1, 0.1)
  const muted = rgb(0.45, 0.45, 0.45)

  // 1. Draw double borders
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1.5,
  })
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  })

  // 2. Embed background logo watermark
  let logoImage = null
  try {
    const logoPath = path.join(process.cwd(), "public", "cameroon-logo.png")
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath)
      logoImage = await doc.embedPng(logoBytes)
      
      // Watermark in background
      page.drawImage(logoImage, {
        x: width / 2 - 130,
        y: height / 2 - 130,
        width: 260,
        height: 260,
        opacity: 0.05,
      })
    }
  } catch (e) {
    console.error("Failed to load logo image", e)
  }

  // 3. Draw Header
  // Left Header
  let hy = height - 40
  page.drawText(cleanText("REPUBLIQUE DU CAMEROUN"), { x: 35, y: hy, font: fontBold, size: 7.5, color: dark })
  page.drawText(cleanText("Paix-Travail-Patrie"), { x: 35, y: hy - 10, font: fontItalic, size: 6.5, color: muted })
  page.drawText(cleanText("------------------"), { x: 35, y: hy - 18, font, size: 6.5, color: muted })
  page.drawText(cleanText("Region : LITTORAL"), { x: 35, y: hy - 28, font: fontBold, size: 6.5, color: dark })
  page.drawText(cleanText("Departement : WOURI"), { x: 35, y: hy - 36, font: fontBold, size: 6.5, color: dark })
  page.drawText(cleanText("Arrondissement : DOUALA V"), { x: 35, y: hy - 44, font: fontBold, size: 6.5, color: dark })

  // Right Header
  page.drawText(cleanText("REPUBLIC OF CAMEROON"), { x: width - 150, y: hy, font: fontBold, size: 7.5, color: dark })
  page.drawText(cleanText("Peace-Work-Fatherland"), { x: width - 150, y: hy - 10, font: fontItalic, size: 6.5, color: muted })
  page.drawText(cleanText("------------------"), { x: width - 150, y: hy - 18, font, size: 6.5, color: muted })
  page.drawText(cleanText("Region : LITTORAL"), { x: width - 150, y: hy - 28, font: fontBold, size: 6.5, color: dark })
  page.drawText(cleanText("Division : WOURI"), { x: width - 150, y: hy - 36, font: fontBold, size: 6.5, color: dark })
  page.drawText(cleanText("Subdivision : DOUALA V"), { x: width - 150, y: hy - 44, font: fontBold, size: 6.5, color: dark })

  // Header Logo in middle
  if (logoImage) {
    page.drawImage(logoImage, {
      x: width / 2 - 18,
      y: hy - 40,
      width: 36,
      height: 36,
    })
  }

  // Under Header Line
  page.drawLine({
    start: { x: 30, y: hy - 54 },
    end: { x: width - 30, y: hy - 54 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  })

  // 4. Center Title
  let cy = hy - 70
  page.drawText(cleanText("Centre d'etat civil / Civil Status Registration Centre"), {
    x: width / 2 - 130,
    y: cy,
    font: fontBold,
    size: 7.5,
    color: dark,
  })
  page.drawText(cleanText(`De / of : ${birth.cityHall?.name || "MAIRIE DE DOUALA 5EME"}`), {
    x: width / 2 - 120,
    y: cy - 12,
    font: fontBold,
    size: 8,
    color: dark,
  })

  // Acte de naissance Title Box
  page.drawRectangle({
    x: width / 2 - 130,
    y: cy - 42,
    width: 260,
    height: 22,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.1, 0.1, 0.1),
    borderWidth: 1,
  })
  page.drawText(cleanText("Acte de Naissance / Birth Certificate"), {
    x: width / 2 - 100,
    y: cy - 35,
    font: fontBold,
    size: 10,
    color: dark,
  })

  // N° code
  page.drawText(cleanText(`N°: ${birth.certificateNumber}`), {
    x: width / 2 - 80,
    y: cy - 58,
    font: fontBold,
    size: 10,
    color: rgb(0.85, 0.1, 0.1),
  })

  // 5. Body Rows
  let y = cy - 80

  function drawField(label: string, value: string | null | undefined, yPos: number) {
    const val = value ?? ""
    page.drawText(cleanText(label), { x: 45, y: yPos, font: fontBold, size: 7.5, color: dark })
    const labelWidth = fontBold.widthOfTextAtSize(cleanText(label), 7.5)
    const valX = 45 + labelWidth + 5
    const dotsWidth = width - 45 - valX
    let dots = ""
    for (let i = 0; i < Math.floor(dotsWidth / 2.2); i++) dots += "."
    page.drawText(dots, { x: valX, y: yPos, font, size: 7.5, color: rgb(0.6, 0.6, 0.6) })
    if (val) {
      page.drawText(cleanText(val.toUpperCase()), { x: valX + 2, y: yPos + 0.5, font: fontBoldItalic, size: 8, color: primary })
    }
  }

  function drawFieldSplit(label1: string, value1: string | null | undefined, label2: string, value2: string | null | undefined, yPos: number) {
    const val1 = value1 ?? ""
    const val2 = value2 ?? ""

    // Part 1
    page.drawText(cleanText(label1), { x: 45, y: yPos, font: fontBold, size: 7.5, color: dark })
    const label1Width = fontBold.widthOfTextAtSize(cleanText(label1), 7.5)
    const val1X = 45 + label1Width + 5
    const val1Width = 190
    let dots1 = ""
    for (let i = 0; i < Math.floor(val1Width / 2.2); i++) dots1 += "."
    page.drawText(dots1, { x: val1X, y: yPos, font, size: 7.5, color: rgb(0.6, 0.6, 0.6) })
    if (val1) {
      page.drawText(cleanText(val1), { x: val1X + 2, y: yPos + 0.5, font: fontBoldItalic, size: 8, color: primary })
    }

    // Part 2
    const label2X = val1X + val1Width + 10
    page.drawText(cleanText(label2), { x: label2X, y: yPos, font: fontBold, size: 7.5, color: dark })
    const label2Width = fontBold.widthOfTextAtSize(cleanText(label2), 7.5)
    const val2X = label2X + label2Width + 5
    const val2Width = width - 45 - val2X
    let dots2 = ""
    for (let i = 0; i < Math.floor(val2Width / 2.2); i++) dots2 += "."
    page.drawText(dots2, { x: val2X, y: yPos, font, size: 7.5, color: rgb(0.6, 0.6, 0.6) })
    if (val2) {
      page.drawText(cleanText(val2), { x: val2X + 2, y: yPos + 0.5, font: fontBoldItalic, size: 8, color: primary })
    }
  }

  const fatherFullName = [birth.fatherFirstName, birth.fatherLastName].filter(Boolean).join(" ")
  const motherFullName = [birth.motherFirstName, birth.motherLastName].filter(Boolean).join(" ")

  const fatherBirthPlace = birth.fatherAddress
    ? birth.fatherAddress.split(",")[1]?.trim() || birth.fatherAddress.split(" ")[1]?.trim() || "Douala"
    : "Mbanga Mpongo"

  const motherBirthPlace = birth.motherAddress
    ? birth.motherAddress.split(",")[1]?.trim() || birth.motherAddress.split(" ")[1]?.trim() || "Douala"
    : "Mbanga Mpongo"

  const spacing = 19

  drawField("Nom de l'enfant / Surname of the Child :", birth.babyLastName, y); y -= spacing
  drawField("Prénoms de l'enfant / Given name of the Child :", birth.babyFirstName, y); y -= spacing
  drawFieldSplit("Ne(e) le / Born on the :", dateToFrenchLetters(birth.birthDate), "Sexe / Sex :", birth.babyGender === "MALE" ? "Masculin / Male" : birth.babyGender === "FEMALE" ? "Féminin / Female" : "", y); y -= spacing
  drawField("A / At :", birth.birthPlace, y); y -= spacing
  drawField("De / Of :", fatherFullName, y); y -= spacing
  drawFieldSplit("Ne a / Born at :", birth.fatherFirstName ? fatherBirthPlace : "", "le / the :", birth.fatherBirthDate ? formatDateStandard(birth.fatherBirthDate) : "", y); y -= spacing
  drawField("Domicilie a / Resident At :", birth.fatherAddress, y); y -= spacing
  drawFieldSplit("Nationalite / Nationality :", birth.fatherNationality || (birth.fatherFirstName ? "Camerounaise" : ""), "Profession / Occupation :", birth.fatherProfession, y); y -= spacing
  drawField("Document de reference / Reference Document :", birth.fatherCni, y); y -= spacing
  drawField("Et de / And Of :", motherFullName, y); y -= spacing
  drawFieldSplit("Nee a / Born at :", motherBirthPlace, "le / the :", birth.motherBirthDate ? formatDateStandard(birth.motherBirthDate) : "", y); y -= spacing
  drawField("Domiciliee a / Resident At :", birth.motherAddress, y); y -= spacing
  drawFieldSplit("Nationalite / Nationality :", birth.motherNationality || "Camerounaise", "Profession / Occupation :", birth.motherProfession, y); y -= spacing
  drawField("Document de reference / Reference Document :", birth.motherCni, y); y -= spacing
  drawFieldSplit("Declare le / Declared on the :", birth.approvedAt ? formatDateStandard(birth.approvedAt) : formatDateStandard(new Date()), "Par / By :", birth.declarationRef ? "Medecin / Doctor" : "Mere presente / Mother present", y); y -= spacing
  drawField("Formation sanitaire / Health Facility :", birth.hospital.name, y); y -= spacing
  drawFieldSplit("le / on the :", birth.approvedAt ? formatDateStandard(birth.approvedAt) : formatDateStandard(new Date()), "CNI / ID :", birth.citizenAccessId || "", y); y -= spacing
  
  // Italic line
  page.drawText(cleanText("lesquels ont certifie la sincerite de la presente declaration - Who attested to the truth of this declaration"), {
    x: 45, y: y + 2, font: fontItalic, size: 6.5, color: muted
  }); y -= spacing

  const maireName = birth.maire ? `${birth.maire.firstName} ${birth.maire.lastName}` : "BIYA SIMON"
  const secretaireName = birth.secretaire ? `${birth.secretaire.firstName} ${birth.secretaire.lastName}` : "MBUYI CECILE"

  drawField("Par nous / By Us :", `${maireName} (Officier d'etat Civil / Civil Status Registrar)`, y); y -= spacing
  drawField("Assiste de - In the presence of :", `${secretaireName} (Secretaire d'etat Civil / Civil Status Secretary)`, y); y -= 25

  // 6. Signatures Area
  let sy = 135
  // Left Column
  page.drawText(cleanText("Le Secretaire / Secretary"), { x: 50, y: sy, font: fontBold, size: 7.5, color: muted })
  page.drawText(cleanText(secretaireName.toUpperCase()), { x: 50, y: sy - 45, font: fontBoldItalic, size: 8.5, color: primary })

  // Right Column
  page.drawText(cleanText("L'Officier / Registrar"), { x: width - 180, y: sy, font: fontBold, size: 7.5, color: muted })
  page.drawText(cleanText(maireName.toUpperCase()), { x: width - 180, y: sy - 45, font: fontBoldItalic, size: 8.5, color: primary })

  // Embed QR code in middle
  if (birth.citizenAccessId) {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${getBaseUrl()}/verify/${birth.citizenAccessId}`)}`
      const res = await fetch(qrUrl)
      if (res.ok) {
        const qrBytes = await res.arrayBuffer()
        const qrImage = await doc.embedPng(new Uint8Array(qrBytes))
        
        page.drawImage(qrImage, {
          x: width / 2 - 30,
          y: sy - 50,
          width: 60,
          height: 60,
        })
      }
    } catch (e) {
      console.error("Failed to embed QR code in PDF", e)
    }
  }

  // Tracking Code below QR Code
  page.drawText(cleanText(birth.certificateNumber), {
    x: width / 2 - 45,
    y: sy - 62,
    font,
    size: 5.5,
    color: muted,
  })

  // 7. Footer Page Info
  page.drawRectangle({
    x: 25,
    y: 25,
    width: width - 50,
    height: 18,
    color: rgb(0.97, 0.97, 0.97),
  })
  page.drawText(
    cleanText(`Document genere le ${fmt(new Date())} · ${birth.certificateNumber}`),
    { x: 35, y: 31, font, size: 6.5, color: muted },
  )

  const pdfBytes = await doc.save()

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${birth.certificateNumber}.pdf"`,
    },
  })
}
