import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Option = { id: string; name: string; city: string }

type UserFormProps = {
  action: (formData: FormData) => void | Promise<void>
  cityHalls: Option[]
  hospitals: Option[]
  defaultValues?: {
    username?: string
    email?: string | null
    firstName?: string
    lastName?: string
    role?: string
    cityHallId?: string | null
    isActive?: boolean
  }
  submitLabel: string
  cancelHref: string
  isEdit?: boolean
}

const ROLES = ["ADMIN", "DOCTOR", "MAIRE", "SECRETAIRE", "MAINTAINER"] as const

export function UserForm({
  action,
  cityHalls,
  hospitals,
  defaultValues,
  submitLabel,
  cancelHref,
  isEdit,
}: UserFormProps) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" defaultValue={defaultValues?.firstName} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" defaultValue={defaultValues?.lastName} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="username">Identifiant</Label>
        <Input id="username" name="username" defaultValue={defaultValues?.username} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">
          Mot de passe {isEdit ? "(laisser vide pour ne pas changer)" : ""}
        </Label>
        <Input id="password" name="password" type="password" required={!isEdit} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="role">Rôle</Label>
        <select
          id="role"
          name="role"
          defaultValue={defaultValues?.role ?? "SECRETAIRE"}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="cityHallId">Mairie (Maire / Secrétaire / Mainteneur)</Label>
        <select
          id="cityHallId"
          name="cityHallId"
          defaultValue={defaultValues?.cityHallId ?? ""}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">—</option>
          {cityHalls.map((c) => (
            <option key={c.id} value={c.id}>{c.name} — {c.city}</option>
          ))}
        </select>
      </div>
      {!isEdit && (
        <div className="space-y-1.5">
          <Label htmlFor="hospitalId">Hôpital (Médecin)</Label>
          <select
            id="hospitalId"
            name="hospitalId"
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">—</option>
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
            ))}
          </select>
        </div>
      )}
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={defaultValues?.isActive ?? true}
          className="size-4 accent-primary"
        />
        Compte actif
      </label>
      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm">{submitLabel}</Button>
        <Button asChild size="sm" variant="outline">
          <Link href={cancelHref}>Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
