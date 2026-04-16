import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Connexion — Gestion des Actes de Naissance",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
      {children}
    </div>
  )
}
