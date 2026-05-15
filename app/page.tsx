import Link from "next/link"
import { ArrowRightIcon, FileSearchIcon, ShieldCheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="min-h-svh bg-muted/30 px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheckIcon className="size-5" />
              <span className="text-xs font-semibold tracking-wide uppercase">
                État Civil
              </span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                Suivi sécurisé des actes de naissance
              </h1>
              <p className="text-sm leading-6 text-muted-foreground">
                Les hôpitaux déclarent les naissances, les mairies instruisent
                les dossiers et le maire signe l’acte. Après approbation, un
                identifiant unique permet au citoyen de vérifier où son acte est
                disponible et de demander le transfert d’une copie vers une
                mairie autorisée.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/citizen">
                  Accéder au portail citoyen{" "}
                  <ArrowRightIcon className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/login">Connexion agents</Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">1. Déclaration</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              L’hôpital soumet la naissance à la mairie compétente.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">2. Signature</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Le secrétariat complète le dossier et le maire approuve l’acte.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <FileSearchIcon className="size-4" /> 3. Portail citoyen
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Le citoyen utilise son identifiant unique pour suivre l’acte ou
              demander un transfert.
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
