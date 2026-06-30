export function numberToFrenchWords(num: number): string {
  const units = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"]
  const teens = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"]
  const tens = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "", "quatre-vingt", "quatre-vingt-dix"]
  
  if (num === 0) return "zéro"
  if (num < 10) return units[num]
  if (num < 20) return teens[num - 10]
  if (num < 70) {
    const ten = Math.floor(num / 10)
    const unit = num % 10
    if (unit === 1) return tens[ten] + " et un"
    return tens[ten] + (unit > 0 ? "-" + units[unit] : "")
  }
  if (num < 80) {
    const unit = num % 10
    if (unit === 1) return "soixante et onze"
    return "soixante-" + teens[unit]
  }
  if (num < 90) {
    const unit = num % 10
    return "quatre-vingt" + (unit > 0 ? "-" + units[unit] : "")
  }
  if (num < 100) {
    const unit = num % 10
    return "quatre-vingt-" + teens[unit]
  }
  return String(num)
}

export function yearToFrenchWords(year: number): string {
  if (year === 2026) return "deux mille vingt-six"
  if (year === 2027) return "deux mille vingt-sept"
  if (year >= 2000 && year < 2100) {
    const rest = year - 2000
    if (rest === 0) return "deux mille"
    return "deux mille " + numberToFrenchWords(rest)
  }
  if (year >= 1900 && year < 2000) {
    const rest = year - 1900
    return "mille neuf cent " + numberToFrenchWords(rest)
  }
  return String(year)
}

export function dateToFrenchLetters(dateStr?: string | Date | null): string {
  if (!dateStr) return ".................................................."
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ".................................................."
  
  const day = date.getDate()
  const monthNames = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
  ]
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()
  
  const dayStr = day === 1 ? "premier" : numberToFrenchWords(day)
  const yearStr = yearToFrenchWords(year)
  
  return `${dayStr} ${month} ${yearStr}`
}

export function formatDateStandard(dateStr?: string | Date | null) {
  if (!dateStr) return ".........................................."
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ".........................................."
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date)
}
