import { NextResponse } from "next/server"
import { PDFDocument, PDFFont, StandardFonts, rgb, degrees } from "pdf-lib"
import { getSession } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import path from "path"
import fs from "fs"
import { dateToFrenchLetters, formatDateStandard } from "@/lib/utils/date-words"

// Le template reproduit fidèlement l'aperçu React `CertificatePreview`
// (components/form/preview/*) : mêmes libellés, mêmes proportions (échelle
// 0.75 pt/px), valeurs en Times bold-italic bleu sur pointillés.

function fmt(date: Date | null | undefined): string {
  if (!date) return "—"
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(date))
}

// WinAnsi couvre les accents latins ; on ne remplace que ce qu'il ne connaît pas
function cleanText(text: string | null | undefined): string {
  if (!text) return ""
  return text
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE")
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "AE")
    .replace(/’/g, "'")
    .replace(/[–—]/g, "-")
}

function getBaseUrl() {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT || 3000}`
}

// Couleurs de l'aperçu (Tailwind)
const BLUE_900 = rgb(30 / 255, 58 / 255, 138 / 255)
const RED_600 = rgb(220 / 255, 38 / 255, 38 / 255)
const NEUTRAL_900 = rgb(23 / 255, 23 / 255, 23 / 255)
const NEUTRAL_800 = rgb(38 / 255, 38 / 255, 38 / 255)
const NEUTRAL_700 = rgb(64 / 255, 64 / 255, 64 / 255)
const NEUTRAL_600 = rgb(82 / 255, 82 / 255, 82 / 255)
const NEUTRAL_500 = rgb(115 / 255, 115 / 255, 115 / 255)
const NEUTRAL_400 = rgb(163 / 255, 163 / 255, 163 / 255)
const NEUTRAL_300 = rgb(212 / 255, 212 / 255, 212 / 255)
const NEUTRAL_200 = rgb(229 / 255, 229 / 255, 229 / 255)

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  // Seule la secrétaire d'état civil peut télécharger l'acte en PDF
  if (session.role !== "SECRETAIRE") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
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

  // Secrétaire de la mairie du dossier, ou d'une mairie détenant une copie
  const hasCopy = birth.copies && birth.copies.length > 0
  const canAccess = session.institutionId === birth.cityHallId || hasCopy

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
  const fontSerifItalic = await doc.embedFont(StandardFonts.TimesRomanBoldItalic)
  const fontMono = await doc.embedFont(StandardFonts.CourierBold)

  const M = 32 // padding du document (p-8 de l'aperçu)
  const contentLeft = M
  const contentRight = width - M

  // 1. Bordure fine du document (border neutral-300 de l'aperçu)
  page.drawRectangle({
    x: 8,
    y: 8,
    width: width - 16,
    height: height - 16,
    borderColor: NEUTRAL_300,
    borderWidth: 1,
  })

  // 2. Filigrane : armoiries + texte oblique « PAIX TRAVAIL PATRIE »
  let logoImage = null
  try {
    const logoPath = path.join(process.cwd(), "public", "cameroon-logo.png")
    if (fs.existsSync(logoPath)) {
      const logoBytes = fs.readFileSync(logoPath)
      logoImage = await doc.embedPng(logoBytes)

      page.drawImage(logoImage, {
        x: width / 2 - 144,
        y: height / 2 - 144,
        width: 288,
        height: 288,
        opacity: 0.05,
      })
    }
  } catch (e) {
    console.error("Failed to load logo image", e)
  }

  const watermarkText = "PAIX TRAVAIL PATRIE · PEACE WORK FATHERLAND"
  const watermarkSize = 25
  const watermarkWidth = fontBold.widthOfTextAtSize(watermarkText, watermarkSize)
  const angle = (33 * Math.PI) / 180
  page.drawText(watermarkText, {
    x: width / 2 - (watermarkWidth / 2) * Math.cos(angle),
    y: height / 2 - (watermarkWidth / 2) * Math.sin(angle),
    font: fontBold,
    size: watermarkSize,
    color: NEUTRAL_800,
    opacity: 0.02,
    rotate: degrees(33),
  })

  // 3. En-tête bilingue officiel
  const hy = height - M - 8
  // Gauche (FR)
  page.drawText("RÉPUBLIQUE DU CAMEROUN", { x: contentLeft, y: hy, font: fontBold, size: 7, color: NEUTRAL_900 })
  page.drawText("Paix-Travail-Patrie", { x: contentLeft, y: hy - 9, font: fontItalic, size: 5.5, color: NEUTRAL_600 })
  page.drawText("------------------", { x: contentLeft, y: hy - 17, font, size: 5.5, color: NEUTRAL_400 })
  page.drawText("Région : ", { x: contentLeft, y: hy - 27, font, size: 5.5, color: NEUTRAL_800 })
  page.drawText("LITTORAL", { x: contentLeft + font.widthOfTextAtSize("Région : ", 5.5), y: hy - 27, font: fontBold, size: 5.5, color: NEUTRAL_800 })
  page.drawText("Département : ", { x: contentLeft, y: hy - 35, font, size: 5.5, color: NEUTRAL_800 })
  page.drawText("WOURI", { x: contentLeft + font.widthOfTextAtSize("Département : ", 5.5), y: hy - 35, font: fontBold, size: 5.5, color: NEUTRAL_800 })
  page.drawText("Arrondissement : ", { x: contentLeft, y: hy - 43, font, size: 5.5, color: NEUTRAL_800 })
  page.drawText("DOUALA V", { x: contentLeft + font.widthOfTextAtSize("Arrondissement : ", 5.5), y: hy - 43, font: fontBold, size: 5.5, color: NEUTRAL_800 })

  // Droite (EN) — alignée à droite
  function drawRight(text: string, y: number, f: PDFFont, size: number, color = NEUTRAL_800) {
    page.drawText(text, { x: contentRight - f.widthOfTextAtSize(text, size), y, font: f, size, color })
  }
  drawRight("REPUBLIC OF CAMEROON", hy, fontBold, 7, NEUTRAL_900)
  drawRight("Peace-Work-Fatherland", hy - 9, fontItalic, 5.5, NEUTRAL_600)
  drawRight("------------------", hy - 17, font, 5.5, NEUTRAL_400)
  function drawRightPair(label: string, value: string, y: number) {
    const labelW = font.widthOfTextAtSize(label, 5.5)
    const valueW = fontBold.widthOfTextAtSize(value, 5.5)
    page.drawText(label, { x: contentRight - labelW - valueW, y, font, size: 5.5, color: NEUTRAL_800 })
    page.drawText(value, { x: contentRight - valueW, y, font: fontBold, size: 5.5, color: NEUTRAL_800 })
  }
  drawRightPair("Region : ", "LITTORAL", hy - 27)
  drawRightPair("Division : ", "WOURI", hy - 35)
  drawRightPair("Subdivision : ", "DOUALA V", hy - 43)

  // Armoiries au centre de l'en-tête
  if (logoImage) {
    page.drawImage(logoImage, {
      x: width / 2 - 18,
      y: hy - 33,
      width: 36,
      height: 36,
    })
  }

  // Ligne sous l'en-tête
  page.drawLine({
    start: { x: contentLeft, y: hy - 52 },
    end: { x: contentRight, y: hy - 52 },
    thickness: 0.5,
    color: NEUTRAL_200,
  })

  // 4. Titre central
  let cy = hy - 68
  function drawCentered(text: string, y: number, f: PDFFont, size: number, color = NEUTRAL_900) {
    page.drawText(text, { x: width / 2 - f.widthOfTextAtSize(text, size) / 2, y, font: f, size, color })
  }
  drawCentered("CENTRE D'ÉTAT CIVIL / CIVIL STATUS REGISTRATION CENTRE", cy, fontBold, 6, NEUTRAL_700)
  const cityHallLine = cleanText(`De / of : ${(birth.cityHall?.name || "MAIRIE DE DOUALA 5EME").toUpperCase()}`)
  drawCentered(cityHallLine, cy - 10, fontBold, 6.5, NEUTRAL_900)

  const mainTitle = "ACTE DE NAISSANCE / BIRTH CERTIFICATE"
  drawCentered(mainTitle, cy - 28, fontBold, 9.5, NEUTRAL_900)
  const titleW = fontBold.widthOfTextAtSize(mainTitle, 9.5)
  page.drawLine({
    start: { x: width / 2 - titleW / 2 - 36, y: cy - 32 },
    end: { x: width / 2 + titleW / 2 + 36, y: cy - 32 },
    thickness: 1.5,
    color: NEUTRAL_900,
  })
  drawCentered(`N°: ${birth.certificateNumber}`, cy - 45, fontMono, 8, RED_600)

  // 5. Corps de l'acte — lignes label + valeur sur pointillés
  const LABEL_SIZE = 6.4
  const VALUE_SIZE = 7.2
  const NAME_SIZE = 8 // valeurs nom/prénom, légèrement plus grandes (comme l'aperçu)
  const spacing = 16.2

  function drawDots(x1: number, x2: number, y: number) {
    if (x2 <= x1) return
    page.drawLine({
      start: { x: x1, y: y - 1.5 },
      end: { x: x2, y: y - 1.5 },
      thickness: 0.6,
      color: NEUTRAL_400,
      dashArray: [1, 1.8],
    })
  }

  function drawSegment(
    label: string,
    value: string | null | undefined,
    x: number,
    segmentEnd: number,
    y: number,
    opts: { uppercase?: boolean; valueSize?: number } = {},
  ) {
    const lbl = cleanText(label)
    page.drawText(lbl, { x, y, font: fontBold, size: LABEL_SIZE, color: NEUTRAL_700 })
    const labelW = fontBold.widthOfTextAtSize(lbl, LABEL_SIZE)
    const valX = x + labelW + 4
    drawDots(valX, segmentEnd, y)
    let val = cleanText(value)
    if (val) {
      if (opts.uppercase !== false) val = val.toUpperCase()
      const size = opts.valueSize ?? VALUE_SIZE
      // Tronque si la valeur déborde du segment
      let display = val
      while (display.length > 1 && fontSerifItalic.widthOfTextAtSize(display, size) > segmentEnd - valX - 4) {
        display = display.slice(0, -1)
      }
      page.drawText(display, { x: valX + 3, y: y + 0.5, font: fontSerifItalic, size, color: BLUE_900 })
    }
  }

  function drawRow(label: string, value: string | null | undefined, y: number, opts?: { uppercase?: boolean; valueSize?: number }) {
    drawSegment(label, value, contentLeft + 2, contentRight - 2, y, opts)
  }

  function drawRowSplit(
    label1: string,
    value1: string | null | undefined,
    label2: string,
    value2: string | null | undefined,
    y: number,
    rightWidth: number,
    opts1: { uppercase?: boolean } = {},
    opts2: { uppercase?: boolean } = {},
  ) {
    const label2W = fontBold.widthOfTextAtSize(cleanText(label2), LABEL_SIZE)
    const rightStart = contentRight - 2 - rightWidth - label2W - 4
    drawSegment(label1, value1, contentLeft + 2, rightStart - 8, y, opts1)
    drawSegment(label2, value2, rightStart, contentRight - 2, y, opts2)
  }

  const fatherFullName = [birth.fatherFirstName, birth.fatherLastName].filter(Boolean).join(" ")
  const motherFullName = [birth.motherFirstName, birth.motherLastName].filter(Boolean).join(" ")

  const fatherBirthPlace = birth.fatherAddress
    ? birth.fatherAddress.split(",")[1]?.trim() || birth.fatherAddress.split(" ")[1]?.trim() || "Douala"
    : "Mbanga Mpongo"

  const motherBirthPlace = birth.motherAddress
    ? birth.motherAddress.split(",")[1]?.trim() || birth.motherAddress.split(" ")[1]?.trim() || "Douala"
    : "Mbanga Mpongo"

  const birthPlace =
    birth.birthPlace || (birth.hospital ? `${birth.hospital.name}, ${birth.hospital.city}` : "")

  const genderLabel =
    birth.babyGender === "MALE" ? "Masculin / Male" : birth.babyGender === "FEMALE" ? "Féminin / Female" : ""

  const declaredOn = birth.approvedAt ? formatDateStandard(birth.approvedAt) : formatDateStandard(new Date())

  // Largeurs des segments droits (w-32/w-48/w-56/w-64 de l'aperçu × 0.75)
  const W32 = 96
  const W48 = 144
  const W56 = 168
  const W64 = 192

  let y = cy - 66

  drawRow("Nom de l'enfant / Surname of the Child :", birth.babyLastName, y, { valueSize: NAME_SIZE }); y -= spacing
  drawRow("Prénoms de l'enfant / Given name of the Child :", birth.babyFirstName, y, { valueSize: NAME_SIZE }); y -= spacing
  drawRowSplit("Ne(e) le / Born on the :", dateToFrenchLetters(birth.birthDate), "Sexe / Sex :", genderLabel, y, W32, { uppercase: false }, { uppercase: false }); y -= spacing
  drawRow("A / At :", birthPlace, y); y -= spacing
  drawRow("De / Of :", fatherFullName, y); y -= spacing
  drawRowSplit("Ne a / Born at :", birth.fatherFirstName ? fatherBirthPlace : "", "le / the :", birth.fatherBirthDate ? formatDateStandard(birth.fatherBirthDate) : "", y, W48, {}, { uppercase: false }); y -= spacing
  drawRow("Domicilie a / Resident At :", birth.fatherAddress, y); y -= spacing
  drawRowSplit("Nationalite / Nationality :", birth.fatherNationality || (birth.fatherFirstName ? "Camerounaise" : ""), "Profession / Occupation :", birth.fatherProfession, y, W56); y -= spacing
  drawRow("Document de reference / Reference Document :", birth.fatherCni, y); y -= spacing
  drawRow("Et de / And Of :", motherFullName, y); y -= spacing
  drawRowSplit("Nee a / Born at :", motherBirthPlace, "le / the :", birth.motherBirthDate ? formatDateStandard(birth.motherBirthDate) : "", y, W48, {}, { uppercase: false }); y -= spacing
  drawRow("Domiciliee a / Resident At :", birth.motherAddress, y); y -= spacing
  drawRowSplit("Nationalite / Nationality :", birth.motherNationality || "Camerounaise", "Profession / Occupation :", birth.motherProfession, y, W56); y -= spacing
  drawRow("Document de reference / Reference Document :", birth.motherCni, y); y -= spacing
  drawRowSplit("Declare le / Declared on the :", declaredOn, "Par / By :", "Mère présente / Mother present", y, W64, { uppercase: false }); y -= spacing

  // Formation sanitaire : nom en gras + pointillés (comme l'aperçu)
  const hospitalLabel = cleanText((birth.hospital?.name || "CENTRE HOSPITALIER LAQUINTINIE").toUpperCase())
  page.drawText(hospitalLabel, { x: contentLeft + 2, y, font: fontBold, size: LABEL_SIZE, color: NEUTRAL_700 })
  drawDots(contentLeft + 2 + fontBold.widthOfTextAtSize(hospitalLabel, LABEL_SIZE) + 4, contentRight - 2, y)
  y -= spacing

  drawRowSplit("le / on the :", declaredOn, "/ :", "", y, W48, { uppercase: false }); y -= spacing

  // Ligne de certification en italique
  page.drawText(cleanText("lesquels ont certifie la sincerite de la presente declaration - Who attested to the truth of this declaration"), {
    x: contentLeft + 2, y, font: fontItalic, size: 5.6, color: NEUTRAL_500,
  }); y -= spacing

  const maireName = birth.maire ? `${birth.maire.firstName} ${birth.maire.lastName}` : "BIYA SIMON"
  const secretaireName = birth.secretaire ? `${birth.secretaire.firstName} ${birth.secretaire.lastName}` : "MBUYI CECILE"

  drawRow("Par nous / By Us :", `${maireName} (Officier d'état Civil / Civil Status Registrar)`, y); y -= spacing
  drawRow("Assiste de - In the presence of :", `${secretaireName} (Secretaire d'état Civil / Civil Status Secretary)`, y); y -= spacing

  // 6. Bloc signatures (border-top + 3 colonnes, comme l'aperçu)
  const sigTop = Math.min(y - 6, 168)
  page.drawLine({
    start: { x: contentLeft, y: sigTop },
    end: { x: contentRight, y: sigTop },
    thickness: 0.5,
    color: NEUTRAL_300,
  })

  const sy = sigTop - 16
  const colW = (contentRight - contentLeft) * 0.3
  const leftColCenter = contentLeft + colW / 2
  const rightColCenter = contentRight - colW / 2

  function drawCenteredAt(text: string, cx: number, yPos: number, f: PDFFont, size: number, color = NEUTRAL_500) {
    page.drawText(text, { x: cx - f.widthOfTextAtSize(text, size) / 2, y: yPos, font: f, size, color })
  }

  // Secrétaire (gauche)
  drawCenteredAt("LE SECRÉTAIRE / SECRETARY", leftColCenter, sy, fontBold, 5.6)
  drawCenteredAt(cleanText(secretaireName.toUpperCase()), leftColCenter, sy - 34, fontSerifItalic, 6.75, BLUE_900)

  // Officier (droite) — signature manuscrite du maire au-dessus du nom
  drawCenteredAt("L'OFFICIER / REGISTRAR", rightColCenter, sy, fontBold, 5.6)
  if (birth.maireSignature?.startsWith("data:image/png;base64,")) {
    try {
      const sigBytes = Buffer.from(birth.maireSignature.split(",")[1], "base64")
      const sigImage = await doc.embedPng(sigBytes)
      const sigDims = sigImage.scaleToFit(colW * 0.8, 26)
      page.drawImage(sigImage, {
        x: rightColCenter - sigDims.width / 2,
        y: sy - 30,
        width: sigDims.width,
        height: sigDims.height,
      })
    } catch (e) {
      console.error("Failed to embed maire signature", e)
    }
  }
  drawCenteredAt(cleanText(maireName.toUpperCase()), rightColCenter, sy - 34, fontSerifItalic, 6.75, BLUE_900)

  // QR de vérification (centre)
  if (birth.citizenAccessId) {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${getBaseUrl()}/verify/${birth.citizenAccessId}`)}`
      const res = await fetch(qrUrl)
      if (res.ok) {
        const qrBytes = await res.arrayBuffer()
        const qrImage = await doc.embedPng(new Uint8Array(qrBytes))

        // Cadre blanc du QR (comme l'aperçu)
        page.drawRectangle({
          x: width / 2 - 26,
          y: sy - 46,
          width: 52,
          height: 52,
          color: rgb(1, 1, 1),
          borderColor: NEUTRAL_200,
          borderWidth: 0.5,
        })
        page.drawImage(qrImage, {
          x: width / 2 - 23,
          y: sy - 43,
          width: 46,
          height: 46,
        })
      }
    } catch (e) {
      console.error("Failed to embed QR code in PDF", e)
    }
  }

  // Numéro d'acte sous le QR
  drawCenteredAt(cleanText(birth.certificateNumber), width / 2, sy - 54, fontMono, 4.5, NEUTRAL_400)

  // 7. Pied de page discret
  page.drawText(
    cleanText(`Document généré le ${fmt(new Date())} · ${birth.certificateNumber}`),
    { x: contentLeft, y: 16, font, size: 5, color: NEUTRAL_400 },
  )

  const pdfBytes = await doc.save()

  return new Response(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${birth.certificateNumber}.pdf"`,
    },
  })
}
