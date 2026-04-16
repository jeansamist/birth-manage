import { z } from "zod"

const optionalString = z.string().optional()
const optionalDate = z.string().optional()

// ─── Step 1: Baby + Medical ───────────────────────────────────────────────────

export const babyStepSchema = z.object({
  babyFirstName: z.string().min(1, "Prénom requis"),
  babyLastName: z.string().min(1, "Nom requis"),
  babyGender: z.enum(["MALE", "FEMALE"], { error: "Sexe requis" }),
  birthDate: z.string().min(1, "Date de naissance requise"),
  birthTime: optionalString,
  birthPlace: optionalString,
  weightGrams: z.coerce.number().positive().optional(),
  heightCm: z.coerce.number().positive().optional(),
  apgarScore: z.coerce.number().min(0).max(10).optional(),
  deliveryType: z.enum(["NATURAL", "CAESAREAN", "FORCEPS", "VACUUM"]).optional(),
  medicalNotes: optionalString,
})

// ─── Step 2: Mother ───────────────────────────────────────────────────────────

export const motherStepSchema = z.object({
  motherFirstName: z.string().min(1, "Prénom de la mère requis"),
  motherLastName: z.string().min(1, "Nom de la mère requis"),
  motherBirthDate: optionalDate,
  motherNationality: optionalString,
  motherCni: optionalString,
  motherProfession: optionalString,
  motherAddress: optionalString,
  motherPhone: optionalString,
  motherEmail: z.string().email("Email invalide").optional().or(z.literal("")),
})

// ─── Step 3: Father ───────────────────────────────────────────────────────────

export const fatherStepSchema = z.object({
  fatherFirstName: optionalString,
  fatherLastName: optionalString,
  fatherBirthDate: optionalDate,
  fatherNationality: optionalString,
  fatherCni: optionalString,
  fatherProfession: optionalString,
  fatherAddress: optionalString,
  fatherPhone: optionalString,
})

// ─── Step 4: Marriage + City hall ─────────────────────────────────────────────

export const reviewStepSchema = z.object({
  parentsMarried: z.boolean().default(false),
  marriageCertNumber: optionalString,
  marriageDate: optionalDate,
  cityHallId: z.string().min(1, "Veuillez sélectionner une mairie"),
})

// ─── Combined ─────────────────────────────────────────────────────────────────

export const birthFormSchema = babyStepSchema
  .merge(motherStepSchema)
  .merge(fatherStepSchema)
  .merge(reviewStepSchema)

export type BirthFormInput = z.input<typeof birthFormSchema>
export type BirthFormData = z.output<typeof birthFormSchema>

export const babyStepFields = Object.keys(babyStepSchema.shape) as (keyof BirthFormInput)[]
export const motherStepFields = Object.keys(motherStepSchema.shape) as (keyof BirthFormInput)[]
export const fatherStepFields = Object.keys(fatherStepSchema.shape) as (keyof BirthFormInput)[]
export const reviewStepFields = Object.keys(reviewStepSchema.shape) as (keyof BirthFormInput)[]

// ─── Decline schema ───────────────────────────────────────────────────────────

export const declineSchema = z.object({
  reason: z.string().min(10, "Veuillez préciser une raison (min. 10 caractères)"),
})

export type DeclineInput = z.infer<typeof declineSchema>
