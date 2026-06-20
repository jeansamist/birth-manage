import { Baby, UserIcon, UsersIcon, LandmarkIcon } from "lucide-react"
import {
  babyStepSchema,
  motherStepSchema,
  fatherStepSchema,
  reviewStepSchema,
  babyStepFields,
  motherStepFields,
  fatherStepFields,
  reviewStepFields,
} from "@/lib/schemas/birth"

export const STEPS = [
  { label: "Enfant", sublabel: "Identité & Santé", icon: <Baby className="size-3.5" />, schema: babyStepSchema, fields: babyStepFields },
  { label: "Mère", sublabel: "Identité & Contact", icon: <UserIcon className="size-3.5" />, schema: motherStepSchema, fields: motherStepFields },
  { label: "Père", sublabel: "Identité & Dossier", icon: <UsersIcon className="size-3.5" />, schema: fatherStepSchema, fields: fatherStepFields },
  { label: "Révision", sublabel: "Mairie & Signature", icon: <LandmarkIcon className="size-3.5" />, schema: reviewStepSchema, fields: reviewStepFields },
]

export const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 30 : -30, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -30 : 30, opacity: 0 }),
}
