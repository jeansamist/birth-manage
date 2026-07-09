"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  doctorCreateSchema,
  doctorUpdateSchema,
  type DoctorCreateInput,
  type DoctorUpdateInput,
} from "@/lib/schemas/admin"
import { createDoctor, updateDoctor, regeneratePassword } from "@/app/actions/admin"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusToggle } from "./status-toggle"
import { CredentialsRevealDialog } from "./credentials-reveal-dialog"
import { PlusIcon, SearchIcon, KeyRoundIcon, StethoscopeIcon } from "lucide-react"

interface HospitalOption {
  id: string
  name: string
}

interface DoctorRow {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string | null
  isActive: boolean
  hospitalAssignments: { hospital: { name: string } }[]
}

interface DoctorTableProps {
  rows: DoctorRow[]
  hospitals: HospitalOption[]
}

export function DoctorTable({ rows, hospitals }: DoctorTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<DoctorRow | null>(null)
  const [credentials, setCredentials] = React.useState<{ username: string; password: string } | null>(null)

  const filteredRows = React.useMemo(() => {
    const q = searchQuery.toLowerCase()
    return rows.filter(
      (r) =>
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.username.toLowerCase().includes(q) ||
        r.hospitalAssignments.some((a) => a.hospital.name.toLowerCase().includes(q)),
    )
  }, [rows, searchQuery])

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }
  function openEdit(row: DoctorRow) {
    setEditing(row)
    setDialogOpen(true)
  }

  async function handleRegenerate(row: DoctorRow) {
    const result = await regeneratePassword(row.id)
    if (result.success && result.username && result.generatedPassword) {
      setCredentials({ username: result.username, password: result.generatedPassword })
    }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <StethoscopeIcon className="size-5 text-muted-foreground" />
          <span className="font-medium text-muted-foreground">Médecins</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-[220px] h-9"
            />
          </div>
          <Button size="sm" className="gap-2" onClick={openCreate}>
            <PlusIcon className="size-4" />
            Nouveau
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-muted-foreground font-medium">Nom</TableHead>
              <TableHead className="text-muted-foreground font-medium">Identifiant</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground font-medium">
                Hôpital(aux)
              </TableHead>
              <TableHead className="w-[90px] text-muted-foreground font-medium">Actif</TableHead>
              <TableHead className="w-[140px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Aucun résultat.
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.firstName} {row.lastName}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{row.username}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {row.hospitalAssignments.map((a) => a.hospital.name).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusToggle entity="user" id={row.id} isActive={row.isActive} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => handleRegenerate(row)}
                        title="Régénérer le mot de passe"
                        className="text-xs font-semibold text-muted-foreground hover:text-primary cursor-pointer"
                      >
                        <KeyRoundIcon className="size-3.5" />
                      </button>
                      <button
                        onClick={() => openEdit(row)}
                        className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                      >
                        Modifier
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <DoctorFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        hospitals={hospitals}
        onSuccess={() => router.refresh()}
        onCreated={(username, password) => setCredentials({ username, password })}
      />

      <CredentialsRevealDialog
        open={credentials !== null}
        onOpenChange={(open) => !open && setCredentials(null)}
        username={credentials?.username ?? null}
        password={credentials?.password ?? null}
      />
    </div>
  )
}

function DoctorFormDialog({
  open,
  onOpenChange,
  editing,
  hospitals,
  onSuccess,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: DoctorRow | null
  hospitals: HospitalOption[]
  onSuccess: () => void
  onCreated: (username: string, password: string) => void
}) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<DoctorCreateInput>({
    resolver: zodResolver(doctorCreateSchema),
    defaultValues: { username: "", firstName: "", lastName: "", email: "", hospitalId: "" },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        username: editing?.username ?? "",
        firstName: editing?.firstName ?? "",
        lastName: editing?.lastName ?? "",
        email: editing?.email ?? "",
        hospitalId: hospitals[0]?.id ?? "",
      })
      setFormError(null)
    }
  }, [open, editing, form, hospitals])

  async function onSubmit(data: DoctorCreateInput) {
    setIsSubmitting(true)
    setFormError(null)

    if (editing) {
      const updateData: DoctorUpdateInput = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      }
      const parsed = doctorUpdateSchema.safeParse(updateData)
      if (!parsed.success) {
        setIsSubmitting(false)
        setFormError(parsed.error.issues[0].message)
        return
      }
      const result = await updateDoctor(editing.id, updateData)
      setIsSubmitting(false)
      if (!result.success) {
        setFormError(result.error?.message ?? "Une erreur est survenue.")
        return
      }
      onOpenChange(false)
      onSuccess()
      return
    }

    const result = await createDoctor(data)
    setIsSubmitting(false)
    if (!result.success) {
      setFormError(result.error?.message ?? "Une erreur est survenue.")
      return
    }
    onOpenChange(false)
    onSuccess()
    if (result.username && result.generatedPassword) {
      onCreated(result.username, result.generatedPassword)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Modifier" : "Créer"} un médecin</DialogTitle>
          <DialogDescription>
            {editing
              ? "Mettez à jour les informations du compte."
              : "Un mot de passe sera généré automatiquement et le médecin sera immédiatement approuvé dans l'hôpital sélectionné."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" error={form.formState.errors.firstName?.message}>
              <Input {...form.register("firstName")} />
            </Field>
            <Field label="Nom" error={form.formState.errors.lastName?.message}>
              <Input {...form.register("lastName")} />
            </Field>
          </div>
          {!editing && (
            <Field label="Identifiant" error={form.formState.errors.username?.message}>
              <Input {...form.register("username")} />
            </Field>
          )}
          <Field label="Email">
            <Input {...form.register("email")} />
          </Field>
          {!editing && (
            <Field label="Hôpital" error={form.formState.errors.hospitalId?.message}>
              <Select
                value={form.watch("hospitalId")}
                onValueChange={(value) => form.setValue("hospitalId", value, { shouldValidate: true })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un hôpital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((h) => (
                    <SelectItem key={h.id} value={h.id}>
                      {h.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
          {formError && <p className="text-xs text-destructive">{formError}</p>}
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : editing ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
