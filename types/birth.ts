export type BirthStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PROCESSING"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "DECLINED"

export type Gender = "MALE" | "FEMALE"
export type DeliveryType = "NATURAL" | "CAESAREAN" | "FORCEPS" | "VACUUM"

export interface BirthRecordSummary {
  id: string
  status: BirthStatus
  babyFirstName: string | null
  babyLastName: string | null
  babyGender: Gender | null
  birthDate: Date | null
  certificateNumber: string | null
  createdAt: Date
  updatedAt: Date
  hospital: { id: string; name: string; city: string }
  doctor: { id: string; firstName: string; lastName: string }
  cityHall: { id: string; name: string; city: string } | null
  secretaire: { id: string; firstName: string; lastName: string } | null
  maire: { id: string; firstName: string; lastName: string } | null
}

export interface ActionResult {
  success: boolean
  error?: string
  id?: string
}
