import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type InstitutionFormProps = {
  action: (formData: FormData) => void | Promise<void>
  defaultValues?: {
    name?: string
    city?: string
    address?: string | null
    phone?: string | null
    email?: string | null
    isActive?: boolean
  }
  submitLabel: string
  cancelHref: string
}

export function InstitutionForm({
  action,
  defaultValues,
  submitLabel,
  cancelHref,
}: InstitutionFormProps) {
  return (
    <form action={action} className="max-w-lg space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nom</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="city">Ville</Label>
        <Input id="city" name="city" defaultValue={defaultValues?.city} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="address">Adresse</Label>
        <Input id="address" name="address" defaultValue={defaultValues?.address ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" defaultValue={defaultValues?.email ?? ""} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={defaultValues?.isActive ?? true}
          className="size-4 accent-primary"
        />
        Établissement actif
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
