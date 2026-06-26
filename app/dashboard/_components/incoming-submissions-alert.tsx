import { BellIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { UserRole } from "@/types/auth"

interface IncomingSubmissionsAlertProps {
  count: number
  role: UserRole
}

export function IncomingSubmissionsAlert({
  count,
  role,
}: IncomingSubmissionsAlertProps) {
  if (count === 0) return null

  const label =
    count > 1
      ? `${count} nouveaux dossiers reçus des hôpitaux`
      : "1 nouveau dossier reçu d'un hôpital"

  const description =
    role === "SECRETAIRE"
      ? "Des déclarations de naissance attendent d'être prises en charge dans la section ci-dessous."
      : role === "MAIRE"
        ? "L'hôpital a transmis des actes à votre mairie. Le secrétariat doit les traiter avant votre approbation."
        : "Des dossiers envoyés par les hôpitaux sont en attente de traitement par le secrétariat."

  return (
    <Alert className="border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
      <BellIcon />
      <AlertTitle>{label}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}

interface PendingApprovalAlertProps {
  count: number
}

export function PendingApprovalAlert({ count }: PendingApprovalAlertProps) {
  if (count === 0) return null

  const label =
    count > 1
      ? `${count} dossiers attendent votre signature`
      : "1 dossier attend votre signature"

  return (
    <Alert className="border-primary/30 bg-primary/5 text-foreground">
      <BellIcon />
      <AlertTitle>{label}</AlertTitle>
      <AlertDescription>
        Le secrétariat a transmis des actes pour approbation. Consultez la section
        « Dossiers en attente de signature ».
      </AlertDescription>
    </Alert>
  )
}
