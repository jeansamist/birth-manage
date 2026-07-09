"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  staffCreateSchema,
  type StaffCreateInput,
  type StaffUpdateInput,
} from "@/lib/schemas/admin"
import { createStaff, updateStaff, regeneratePassword } from "@/app/actions/admin"
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
import { PlusIcon, SearchIcon, KeyRoundIcon, UsersIcon } from "lucide-react"

interface CityHallOption {
  id: string
  name: string
}

interface StaffRow {
  id: string
  username: string
  firstName: string
  lastName: string
  email: string | null
  isActive: boolean
  cityHallId: string | null
  cityHall: { name: string } | null
}

interface StaffTableProps {
  role: "MAIRE" | "SECRETAIRE"
  rows: StaffRow[]
  cityHalls: CityHallOption[]
}

const ROLE_LABEL: Record<StaffTableProps["role"], { title: string; singular: string }> = {
  MAIRE: { title: "Maires", singular: "un maire" },
  SECRETAIRE: { title: "Secrétaires", singular: "un(e) secrétaire" },
}

export function StaffTable({ role, rows, cityHalls }: StaffTableProps) {
  const label = ROLE_LABEL[role]
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<StaffRow | null>(null)
  const [credentials, setCredentials] = React.useState<{ username: string; password: string } | null>(null)

  const filteredRows = React.useMemo(() => {
    const q = searchQuery.toLowerCase()
    return rows.filter(
      (r) =>
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.username.toLowerCase().includes(q) ||
        (r.cityHall?.name ?? "").toLowerCase().includes(q),
    )
  }, [rows, searchQuery])

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }
  function openEdit(row: StaffRow) {
    setEditing(row)
    setDialogOpen(true)
  }

  async function handleRegenerate(row: StaffRow) {
    const result = await regeneratePassword(row.id)
    if (result.success && result.username && result.generatedPassword) {
      setCredentials({ username: result.username, password: result.generatedPassword })
    }
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <UsersIcon className="size-5 text-muted-foreground" />
          <span className="font-medium text-muted-foreground">{label.title}</span>
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
                Mairie
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
                    {row.cityHall?.name ?? "—"}
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

      <StaffFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        role={role}
        editing={editing}
        cityHalls={cityHalls}
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

function StaffFormDialog({
  open,
  onOpenChange,
  role,
  editing,
  cityHalls,
  onSuccess,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: "MAIRE" | "SECRETAIRE"
  editing: StaffRow | null
  cityHalls: CityHallOption[]
  onSuccess: () => void
  onCreated: (username: string, password: string) => void
}) {
  const label = ROLE_LABEL[role]
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<StaffCreateInput>({
    resolver: zodResolver(staffCreateSchema),
    defaultValues: { username: "", firstName: "", lastName: "", email: "", cityHallId: "" },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        username: editing?.username ?? "",
        firstName: editing?.firstName ?? "",
        lastName: editing?.lastName ?? "",
        email: editing?.email ?? "",
        cityHallId: editing?.cityHallId ?? "",
      })
      setFormError(null)
    }
  }, [open, editing, form])

  async function onSubmit(data: StaffCreateInput) {
    setIsSubmitting(true)
    setFormError(null)

    if (editing) {
      const updateData: StaffUpdateInput = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cityHallId: data.cityHallId,
      }
      const result = await updateStaff(editing.id, updateData)
      setIsSubmitting(false)
      if (!result.success) {
        setFormError(result.error?.message ?? "Une erreur est survenue.")
        return
      }
      onOpenChange(false)
      onSuccess()
      return
    }

    const result = await createStaff(role, data)
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
          <DialogTitle>
            {editing ? "Modifier" : "Créer"} {label.singular}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Mettez à jour les informations du compte."
              : `Un mot de passe sera généré automatiquement pour ${label.singular}.`}
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
          <Field label="Mairie" error={form.formState.errors.cityHallId?.message}>
            <Select
              value={form.watch("cityHallId")}
              onValueChange={(value) => form.setValue("cityHallId", value, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une mairie" />
              </SelectTrigger>
              <SelectContent>
                {cityHalls.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
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
