import Link from "next/link"
import { ArrowRightIcon, FileSearchIcon, ShieldCheckIcon, StampIcon, UsersIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-background via-muted/20 to-muted/40">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-16 md:py-24">
        {/* Hero */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-lg md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="relative max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <ShieldCheckIcon className="size-3.5" />
                Plateforme Officielle
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                  État Civil{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Numérique
                  </span>
                </h1>
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  Les hôpitaux déclarent les naissances, les mairies instruisent
                  les dossiers et le maire signe l&apos;acte. Après approbation, un
                  identifiant unique permet au citoyen de vérifier où son acte est
                  disponible.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg" className="shadow-md">
                  <Link href="/citizen">
                    Accéder au portail citoyen{" "}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/login">Connexion agents</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <UsersIcon className="size-4" />
                </span>
                1. Déclaration
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              L&apos;hôpital soumet la naissance à la mairie compétente.
            </CardContent>
          </Card>
          <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 fill-mode-both group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <StampIcon className="size-4" />
                </span>
                2. Signature
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Le secrétariat complète le dossier et le maire approuve l&apos;acte.
            </CardContent>
          </Card>
          <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-both group">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-sm">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-105">
                  <FileSearchIcon className="size-4" />
                </span>
                3. Portail citoyen
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Le citoyen utilise son identifiant unique pour suivre l&apos;acte ou
              demander un transfert.
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
