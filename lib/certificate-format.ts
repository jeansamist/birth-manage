const MONTHS_FR = [
  "janvier",
  "fevrier",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "aout",
  "septembre",
  "octobre",
  "novembre",
  "decembre",
]

const ONES = [
  "",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
  "dix-sept",
  "dix-huit",
  "dix-neuf",
]

function dayToFrench(day: number): string {
  if (day === 1) return "Premier"
  if (day < 20) return ONES[day]
  if (day === 20) return "vingt"
  if (day < 30) return `vingt-${ONES[day - 20]}`.replace("-un", " et un")
  if (day === 30) return "trente"
  if (day === 31) return "trente et un"
  return String(day)
}

function yearToFrench(year: number): string {
  if (year < 2000) {
    const rest = year % 100
    if (rest === 0) return "mille neuf cent"
    return `mille neuf cent ${ONES[rest] || rest}`.trim()
  }
  const mill = Math.floor(year / 1000)
  const cent = Math.floor((year % 1000) / 100)
  const rest = year % 100
  let out = mill === 2 ? "deux mille" : `${ONES[mill]} mille`
  if (cent > 0) out += ` ${cent === 1 ? "cent" : `${ONES[cent]} cent`}`
  if (rest > 0) out += ` ${ONES[rest] || rest}`
  return out.trim()
}

export function dateToFrenchWords(date: Date | null | undefined): string {
  if (!date) return "-"
  const d = new Date(date)
  const day = d.getDate()
  const month = MONTHS_FR[d.getMonth()]
  const year = d.getFullYear()
  return `${dayToFrench(day)} ${month} ${yearToFrench(year)}`
}

export function fmtDateShort(date: Date | null | undefined): string {
  if (!date) return "-"
  const d = new Date(date)
  const day = String(d.getDate()).padStart(2, "0")
  const month = MONTHS_FR[d.getMonth()]
  const year = d.getFullYear()
  return `${day} ${month} ${year}`
}

export function pdfSafe(text: string): string {
  return text
    .replace(/—/g, "-")
    .replace(/…/g, "...")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

export function fullName(
  first: string | null | undefined,
  last: string | null | undefined,
): string {
  return `${last ?? ""} ${first ?? ""}`.trim().toUpperCase() || "-"
}

export function givenNames(first: string | null | undefined): string {
  return (first ?? "-").toUpperCase()
}

export function surname(last: string | null | undefined): string {
  return (last ?? "-").toUpperCase()
}

type Territory = { region: string; department: string; subdivision: string }

const TERRITORIES: Record<string, Territory> = {
  yaounde: { region: "CENTRE", department: "MFOUNDI", subdivision: "YAOUNDE I" },
  douala: { region: "LITTORAL", department: "WOURI", subdivision: "DOUALA V" },
  bafoussam: { region: "OUEST", department: "MIFI", subdivision: "BAFOUSSAM I" },
}

export function territoryForCity(city: string | null | undefined): Territory {
  const key = (city ?? "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  if (key.includes("yaounde")) return TERRITORIES.yaounde
  if (key.includes("douala")) return TERRITORIES.douala
  if (key.includes("bafoussam")) return TERRITORIES.bafoussam
  return {
    region: (city ?? "CAMEROUN").toUpperCase(),
    department: "-",
    subdivision: "-",
  }
}
