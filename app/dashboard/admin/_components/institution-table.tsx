"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { institutionSchema, type InstitutionInput } from "@/lib/schemas/admin"
import { createCityHall, updateCityHall, createHospital, updateHospital } from "@/app/actions/admin"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusToggle } from "./status-toggle"
import { PlusIcon, SearchIcon, Building2Icon, LandmarkIcon } from "lucide-react"

interface InstitutionRow {
  id: string
  name: string
  city: string
  address: string | null
  phone: string | null
  email: string | null
  isActive: boolean
}

interface InstitutionTableProps {
  kind: "mairie" | "hopital"
  rows: InstitutionRow[]
}

const KIND_CONFIG = {
  mairie: {
    title: "Mairies",
    singular: "une mairie",
    entity: "cityHall" as const,
    icon: LandmarkIcon,
    createAction: createCityHall,
    updateAction: updateCityHall,
  },
  hopital: {
    title: "Hôpitaux",
    singular: "un hôpital",
    entity: "hospital" as const,
    icon: Building2Icon,
    createAction: createHospital,
    updateAction: updateHospital,
  },
}

export function InstitutionTable({ kind, rows }: InstitutionTableProps) {
  const config = KIND_CONFIG[kind]
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<InstitutionRow | null>(null)

  const filteredRows = React.useMemo(() => {
    const q = searchQuery.toLowerCase()
    return rows.filter(
      (r) => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q),
    )
  }, [rows, searchQuery])

  function openCreate() {
    setEditing(null)
    setDialogOpen(true)
  }
  function openEdit(row: InstitutionRow) {
    setEditing(row)
    setDialogOpen(true)
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b">
        <div className="flex items-center gap-2">
          <config.icon className="size-5 text-muted-foreground" />
          <span className="font-medium text-muted-foreground">{config.title}</span>
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
              <TableHead className="text-muted-foreground font-medium">Ville</TableHead>
              <TableHead className="hidden md:table-cell text-muted-foreground font-medium">
                Contact
              </TableHead>
              <TableHead className="w-[90px] text-muted-foreground font-medium">Actif</TableHead>
              <TableHead className="w-[80px]" />
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
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.city}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                    {row.phone || row.email || "—"}
                  </TableCell>
                  <TableCell>
                    <StatusToggle entity={config.entity} id={row.id} isActive={row.isActive} />
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => openEdit(row)}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Modifier
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <InstitutionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        kind={kind}
        editing={editing}
        onSuccess={() => router.refresh()}
      />
    </div>
  )
}

function InstitutionFormDialog({
  open,
  onOpenChange,
  kind,
  editing,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  kind: "mairie" | "hopital"
  editing: InstitutionRow | null
  onSuccess: () => void
}) {
  const config = KIND_CONFIG[kind]
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)

  const form = useForm<InstitutionInput>({
    resolver: zodResolver(institutionSchema),
    defaultValues: { name: "", city: "", address: "", phone: "", email: "" },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: editing?.name ?? "",
        city: editing?.city ?? "",
        address: editing?.address ?? "",
        phone: editing?.phone ?? "",
        email: editing?.email ?? "",
      })
      setFormError(null)
    }
  }, [open, editing, form])

  async function onSubmit(data: InstitutionInput) {
    setIsSubmitting(true)
    setFormError(null)
    const result = editing
      ? await config.updateAction(editing.id, data)
      : await config.createAction(data)
    setIsSubmitting(false)
    if (!result.success) {
      setFormError(result.error?.message ?? "Une erreur est survenue.")
      return
    }
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Modifier" : "Créer"} {config.singular}
          </DialogTitle>
          <DialogDescription>
            {editing
              ? "Mettez à jour les informations."
              : `Renseignez les informations pour créer ${config.singular}.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <Field label="Nom" error={form.formState.errors.name?.message}>
            <Input {...form.register("name")} />
          </Field>
          <Field label="Ville" error={form.formState.errors.city?.message}>
            <Input {...form.register("city")} />
          </Field>
          <Field label="Adresse">
            <Input {...form.register("address")} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Téléphone">
              <Input {...form.register("phone")} />
            </Field>
            <Field label="Email" error={form.formState.errors.email?.message}>
              <Input {...form.register("email")} />
            </Field>
          </div>
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
