import fs from "fs"
import path from "path"
import QRCode from "qrcode"
import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb, degrees } from "pdf-lib"
import {
  dateToFrenchWords,
  fmtDateShort,
  fullName,
  givenNames,
  pdfSafe,
  surname,
  territoryForCity,
} from "@/lib/certificate-format"

export type CertificateBirth = {
  id: string
  certificateNumber: string
  citizenAccessId: string | null
  babyFirstName: string | null
  babyLastName: string | null
  babyGender: "MALE" | "FEMALE" | null
  birthDate: Date | null
  birthPlace: string | null
  motherFirstName: string | null
  motherLastName: string | null
  motherBirthDate: Date | null
  motherNationality: string | null
  motherCni: string | null
  motherProfession: string | null
  motherAddress: string | null
  fatherFirstName: string | null
  fatherLastName: string | null
  fatherBirthDate: Date | null
  fatherNationality: string | null
  fatherCni: string | null
  fatherProfession: string | null
  fatherAddress: string | null
  approvedAt: Date | null
  hospital: { name: string; city: string }
  cityHall: { name: string; city: string } | null
  doctor: { firstName: string; lastName: string }
  maire: { firstName: string; lastName: string } | null
  secretaire: { firstName: string; lastName: string } | null
}

const RED = rgb(0.78, 0.08, 0.08)
const BLUE = rgb(0.05, 0.25, 0.65)
const BLACK = rgb(0, 0, 0)
const GRAY = rgb(0.55, 0.55, 0.55)
const WATERMARK = rgb(0.88, 0.88, 0.9)

function drawWatermark(page: PDFPage, font: PDFFont, width: number, height: number) {
  page.drawText("PAIX  TRAVAIL  PATRIE", {
    x: width / 2 - 120,
    y: height / 2 + 40,
    size: 28,
    font,
    color: WATERMARK,
    rotate: degrees(35),
  })
  page.drawText("PEACE  WORK  FATHERLAND", {
    x: width / 2 - 150,
    y: height / 2 - 20,
    size: 22,
    font,
    color: WATERMARK,
    rotate: degrees(35),
  })
}

function drawDottedLine(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  value: string,
  font: PDFFont,
  fontBold: PDFFont,
  labelWidth = 0,
) {
  const dots = ".".repeat(Math.max(8, Math.floor((width - labelWidth) / 4)))
  page.drawText(pdfSafe(dots), {
    x: x + labelWidth,
    y,
    size: 8,
    font,
    color: GRAY,
  })
  if (value && value !== "-") {
    page.drawText(pdfSafe(value), {
      x: x + labelWidth + 2,
      y: y + 1,
      size: 9,
      font: fontBold,
      color: BLACK,
    })
  }
}

function drawBilingualField(
  page: PDFPage,
  font: PDFFont,
  fontBold: PDFFont,
  x: number,
  y: number,
  width: number,
  labelFr: string,
  labelEn: string,
  value: string,
) {
  const label = `${labelFr} / ${labelEn} :`
  page.drawText(pdfSafe(label), { x, y, size: 8, font: fontBold, color: BLACK })
  const labelWidth = label.length * 4.2
  drawDottedLine(page, x, y - 10, width, value, font, fontBold, labelWidth)
}

function drawSplitField(
  page: PDFPage,
  font: PDFFont,
  fontBold: PDFFont,
  x: number,
  y: number,
  width: number,
  leftLabel: string,
  leftValue: string,
  rightLabel: string,
  rightValue: string,
) {
  const half = width / 2 - 8
  drawBilingualField(page, font, fontBold, x, y, half, leftLabel.split(" / ")[0], leftLabel.split(" / ")[1] ?? "", leftValue)
  drawBilingualField(page, font, fontBold, x + half + 16, y, half, rightLabel.split(" / ")[0], rightLabel.split(" / ")[1] ?? "", rightValue)
}

async function embedWatermarkImage(doc: PDFDocument, page: PDFPage, width: number, height: number) {
  try {
    const imagePath = path.join(process.cwd(), "public", "certificate", "reference.png")
    if (!fs.existsSync(imagePath)) return
    const bytes = fs.readFileSync(imagePath)
    const image = await doc.embedPng(bytes)
    page.drawImage(image, {
      x: width * 0.12,
      y: height * 0.18,
      width: width * 0.76,
      height: height * 0.62,
      opacity: 0.07,
    })
  } catch {
    // optional watermark
  }
}

async function drawQrCode(
  doc: PDFDocument,
  page: PDFPage,
  content: string,
  x: number,
  y: number,
  size: number,
) {
  const dataUrl = await QRCode.toDataURL(content, { margin: 0, width: 200 })
  const base64 = dataUrl.split(",")[1]
  const bytes = Buffer.from(base64, "base64")
  const image = await doc.embedPng(bytes)
  page.drawImage(image, { x, y, width: size, height: size })
}

export async function buildBirthCertificatePdf(
  birth: CertificateBirth,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold)
  const fontItalic = await doc.embedFont(StandardFonts.HelveticaOblique)

  const page = doc.addPage([595, 842])
  const { width, height } = page.getSize()
  const margin = 36
  const contentWidth = width - margin * 2

  await embedWatermarkImage(doc, page, width, height)
  drawWatermark(page, fontBold, width, height)

  const territory = territoryForCity(birth.cityHall?.city ?? birth.hospital.city)
  const cityHallName = (birth.cityHall?.name ?? "MAIRIE").toUpperCase()

  // ── Header FR (left) ───────────────────────────────────────────────────────
  let hy = height - margin
  const headerSize = 7.5
  page.drawText("REPUBLIQUE DU CAMEROUN", { x: margin, y: hy, size: headerSize, font: fontBold })
  hy -= 10
  page.drawText("Paix-Travail-Patrie", { x: margin, y: hy, size: headerSize, font })
  hy -= 12
  page.drawText("------------------", { x: margin, y: hy, size: headerSize, font })
  hy -= 11
  page.drawText(`Region : ${territory.region}`, { x: margin, y: hy, size: headerSize, font })
  hy -= 10
  page.drawText(`Departement : ${territory.department}`, { x: margin, y: hy, size: headerSize, font })
  hy -= 10
  page.drawText(`Arrondissement : ${territory.subdivision}`, { x: margin, y: hy, size: headerSize, font })

  // ── Header EN (right) ────────────────────────────────────────────────────
  hy = height - margin
  const rightX = width - margin - 155
  page.drawText("REPUBLIC OF CAMEROON", { x: rightX, y: hy, size: headerSize, font: fontBold })
  hy -= 10
  page.drawText("Peace-Work-Fatherland", { x: rightX, y: hy, size: headerSize, font })
  hy -= 12
  page.drawText("------------------", { x: rightX, y: hy, size: headerSize, font })
  hy -= 11
  page.drawText(`Region : ${territory.region}`, { x: rightX, y: hy, size: headerSize, font })
  hy -= 10
  page.drawText(`Division : ${territory.department}`, { x: rightX, y: hy, size: headerSize, font })
  hy -= 10
  page.drawText(`Subdivision : ${territory.subdivision}`, { x: rightX, y: hy, size: headerSize, font })

  // ── Center emblem placeholder ────────────────────────────────────────────
  page.drawCircle({ x: width / 2, y: height - margin - 35, size: 22, borderColor: GRAY, borderWidth: 1 })
  page.drawText("CM", { x: width / 2 - 8, y: height - margin - 40, size: 10, font: fontBold, color: GRAY })

  // ── Registration centre ────────────────────────────────────────────────────
  let y = height - margin - 95
  const centre = "CENTRE D'ETAT CIVIL / CIVIL STATUS REGISTRATION CENTRE"
  page.drawText(pdfSafe(centre), {
    x: width / 2 - fontBold.widthOfTextAtSize(pdfSafe(centre), 8) / 2,
    y,
    size: 8,
    font: fontBold,
  })
  y -= 14
  const deOf = `De / of : ${cityHallName}`
  page.drawText("De / of : ", { x: width / 2 - 70, y, size: 9, font })
  page.drawText(pdfSafe(cityHallName), {
    x: width / 2 - 70 + font.widthOfTextAtSize("De / of : ", 9),
    y,
    size: 9,
    font: fontBold,
    color: RED,
  })

  y -= 22
  const title = "ACTE DE NAISSANCE / BIRTH CERTIFICATE"
  page.drawText(pdfSafe(title), {
    x: width / 2 - fontBold.widthOfTextAtSize(pdfSafe(title), 11) / 2,
    y,
    size: 11,
    font: fontBold,
  })
  page.drawLine({
    start: { x: width / 2 - 120, y: y - 3 },
    end: { x: width / 2 + 120, y: y - 3 },
    thickness: 1,
    color: BLACK,
  })

  y -= 18
  const certLabel = `N°: ${birth.certificateNumber}`
  page.drawText(pdfSafe(certLabel), {
    x: width / 2 - fontItalic.widthOfTextAtSize(pdfSafe(certLabel), 10) / 2,
    y,
    size: 10,
    font: fontItalic,
    color: RED,
  })

  // ── Child fields ─────────────────────────────────────────────────────────
  y -= 28
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "Nom de l'enfant", "Surname of the Child",
    surname(birth.babyLastName),
  )
  y -= 26
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "Prenoms de l'enfant", "Given name of the Child",
    givenNames(birth.babyFirstName),
  )
  y -= 26
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "Ne(e) le", "Born on the",
    dateToFrenchWords(birth.birthDate),
  )
  y -= 26
  drawSplitField(
    page, font, fontBold, margin, y, contentWidth,
    "A / At", birth.cityHall?.city ?? birth.hospital.city ?? "-",
    "Sexe / Sex", birth.babyGender === "MALE" ? "Masculin" : "Feminin",
  )

  // ── Father ─────────────────────────────────────────────────────────────────
  y -= 30
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "De", "Of",
    fullName(birth.fatherFirstName, birth.fatherLastName),
  )
  y -= 26
  drawSplitField(
    page, font, fontBold, margin, y, contentWidth,
    "Ne a / Born at", birth.fatherAddress ?? birth.hospital.city ?? "-",
    "le / the", fmtDateShort(birth.fatherBirthDate),
  )
  y -= 26
  drawSplitField(
    page, font, fontBold, margin, y, contentWidth,
    "Domicilie a / Resident At", birth.fatherAddress ?? "-",
    "Nationalite / Nationality", birth.fatherNationality ?? "Camerounaise",
  )
  y -= 26
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "Profession", "Occupation",
    (birth.fatherProfession ?? "-").toUpperCase(),
  )
  y -= 26
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "Document de reference", "Reference Document",
    (birth.fatherCni ?? "-").toUpperCase(),
  )

  // ── Mother ───────────────────────────────────────────────────────────────
  y -= 30
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "Et de", "And Of",
    fullName(birth.motherFirstName, birth.motherLastName),
  )
  y -= 26
  drawSplitField(
    page, font, fontBold, margin, y, contentWidth,
    "Nee a / Born at", birth.motherAddress ?? birth.hospital.city ?? "-",
    "le / the", fmtDateShort(birth.motherBirthDate),
  )
  y -= 26
  drawSplitField(
    page, font, fontBold, margin, y, contentWidth,
    "Domiciliee a / Resident At", birth.motherAddress ?? "-",
    "Nationalite / Nationality", birth.motherNationality ?? "Camerounaise",
  )
  y -= 26
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "Profession", "Occupation",
    (birth.motherProfession ?? "-").toUpperCase(),
  )
  y -= 26
  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth,
    "Document de reference", "Reference Document",
    (birth.motherCni ?? "-").toUpperCase(),
  )

  // ── Declaration ──────────────────────────────────────────────────────────
  y -= 30
  const declaredDate = fmtDateShort(birth.approvedAt ?? birth.birthDate)
  const declarer = fullName(birth.doctor.firstName, birth.doctor.lastName)
  drawSplitField(
    page, font, fontBold, margin, y, contentWidth,
    "Declare le / Declared on the", declaredDate,
    "Par / By", declarer,
  )
  y -= 22
  page.drawText(pdfSafe(birth.hospital.name.toUpperCase()), {
    x: margin,
    y,
    size: 7.5,
    font: fontBold,
  })
  y -= 20
  drawSplitField(
    page, font, fontBold, margin, y, contentWidth,
    "le / on the", declaredDate,
    "", "",
  )
  y -= 18
  page.drawText(
    pdfSafe("lesquels ont certifie la sincerite de la presente declaration - Who attested to the truth of this declaration"),
    { x: margin, y, size: 7, font: fontItalic, color: GRAY },
  )

  y -= 22
  const maireName = birth.maire
    ? fullName(birth.maire.firstName, birth.maire.lastName)
    : "-"
  const secretaireName = birth.secretaire
    ? fullName(birth.secretaire.firstName, birth.secretaire.lastName)
    : "-"

  drawBilingualField(
    page, font, fontBold, margin, y, contentWidth * 0.55,
    "Par nous / By Us", "",
    maireName,
  )
  page.drawText("Officier d'etat Civil - Civil Status registrar", {
    x: margin,
    y: y - 14,
    size: 7,
    font,
  })

  drawBilingualField(
    page, font, fontBold, margin + contentWidth * 0.52, y, contentWidth * 0.48,
    "Assiste de - In the presence of", "",
    secretaireName,
  )
  page.drawText("Secretaire d'etat Civil - Secretary", {
    x: margin + contentWidth * 0.52,
    y: y - 14,
    size: 7,
    font,
  })

  // ── Signatures + QR ────────────────────────────────────────────────────────
  y -= 55
  page.drawText("Le Secretaire / Secretary", {
    x: margin + 20,
    y,
    size: 8,
    font: fontBold,
    color: RED,
  })
  page.drawText("L'Officier / Registrar", {
    x: width - margin - 120,
    y,
    size: 8,
    font: fontBold,
    color: RED,
  })

  y -= 35
  page.drawLine({
    start: { x: margin, y },
    end: { x: margin + 150, y },
    thickness: 0.5,
    color: GRAY,
  })
  page.drawLine({
    start: { x: width - margin - 150, y },
    end: { x: width - margin, y },
    thickness: 0.5,
    color: GRAY,
  })

  y -= 14
  page.drawText(pdfSafe(secretaireName), {
    x: margin,
    y,
    size: 8,
    font: fontBold,
    color: BLUE,
  })
  page.drawText(pdfSafe(maireName), {
    x: width - margin - 150,
    y,
    size: 8,
    font: fontBold,
    color: BLUE,
  })

  const qrPayload =
    birth.citizenAccessId ??
    `${birth.certificateNumber}|${birth.id}`
  await drawQrCode(doc, page, qrPayload, width / 2 - 35, y - 10, 70)

  return doc.save()
}
