import Link from "next/link"
import {
  ArrowRightIcon,
  Building2Icon,
  CheckCircle2Icon,
  FileCheckIcon,
  FileSearchIcon,
  FileTextIcon,
  GlobeIcon,
  ShieldCheckIcon,
  StampIcon,
  UsersIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import FooterStandard from "@/components/mvpblocks/footer-standard"

const stats = [
  { value: "500+", label: "Actes enregistrés", icon: FileCheckIcon },
  { value: "3", label: "Mairies connectées", icon: Building2Icon },
  { value: "3", label: "Hôpitaux partenaires", icon: ShieldCheckIcon },
  { value: "24/7", label: "Disponibilité", icon: GlobeIcon },
]

const features = [
  {
    icon: FileTextIcon,
    title: "Déclaration",
    description:
      "Les médecins et personnel hospitalier déclarent les naissances en ligne, directement depuis l'hôpital.",
  },
  {
    icon: StampIcon,
    title: "Instruction & Signature",
    description:
      "Le secrétariat de la mairie instruit le dossier et le maire signe électroniquement l'acte.",
  },
  {
    icon: FileSearchIcon,
    title: "Vérification citoyenne",
    description:
      "Le citoyen vérifie l'état de son acte avec un identifiant unique et peut demander un transfert.",
  },
  {
    icon: UsersIcon,
    title: "Gestion multi-utilisateurs",
    description:
      "Médecins, secrétaires, maires — chaque rôle a ses droits et responsabilités dans le flux.",
  },
]

const steps = [
  {
    step: "01",
    title: "L'hôpital déclare",
    description:
      "Le médecin remplit le formulaire de naissance avec les informations de l'enfant, de la mère et du père.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    step: "02",
    title: "La mairie instruit",
    description:
      "Le secrétariat vérifie les pièces justificatives et complète le dossier de l'acte de naissance.",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    step: "03",
    title: "Le maire signe",
    description:
      "Le maire approuve et signe électroniquement l'acte. Le document devient officiel et opposable.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    step: "04",
    title: "Le citoyen accède",
    description:
      "Avec son identifiant unique, le citoyen vérifie, suit et récupère son acte de naissance où qu'il soit.",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
]

export default function Page() {
  return (
    <main className="min-h-svh bg-gradient-to-b from-background via-muted/20 to-muted/40">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-20 px-4 py-16 md:py-24">

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

        {/* Stats */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all duration-200 hover:shadow-md hover:bg-muted/20"
              >
                <stat.icon className="size-5 text-primary" />
                <span className="text-2xl font-bold tracking-tight md:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Une plateforme complète
            </h2>
            <p className="mt-2 text-muted-foreground">
              Tout ce qu&apos;il faut pour gérer l&apos;état civil numérique du Cameroun.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, i) => (
              <Card
                key={feature.title}
                className={`animate-in fade-in slide-in-from-bottom-6 duration-700 delay-${(i + 1) * 100} fill-mode-both group border-border/60 transition-all duration-200 hover:shadow-md hover:bg-muted/10`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-200 group-hover:scale-110">
                      <feature.icon className="size-4.5" />
                    </span>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How it works - Flow */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Comment ça marche
            </h2>
            <p className="mt-2 text-muted-foreground">
              Un processus simple et transparent, de la déclaration à la délivrance.
            </p>
          </div>
          <div className="relative grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-10 shrink-0 items-center justify-center rounded-xl font-bold text-sm ${s.color}`}
                    >
                      {s.step}
                    </span>
                    {i < steps.length - 1 && (
                      <div className="hidden h-px flex-1 bg-border md:block" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{s.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {s.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Appuyé par les institutions
            </h2>
            <p className="mt-2 text-muted-foreground">
              Un projet du Bureau National de l&apos;État Civil du Cameroun.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {[
              "BUNEC",
              "Ministère de la Décentralisation",
              "Mairie de Yaoundé",
              "Ministère de la Santé Publique",
            ].map((partner) => (
              <div
                key={partner}
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground/60 transition-colors hover:text-muted-foreground"
              >
                <CheckCircle2Icon className="size-4" />
                {partner}
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
          <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-primary/5 p-8 text-center md:p-12">
            <div className="relative space-y-4">
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Prêt à commencer ?
              </h2>
              <p className="mx-auto max-w-md text-muted-foreground">
                Accédez au portail citoyen pour vérifier votre acte de naissance
                ou connectez-vous en tant qu&apos;agent pour instruire les dossiers.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button asChild size="lg" className="shadow-md">
                  <Link href="/citizen">
                    Portail citoyen{" "}
                    <ArrowRightIcon className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/login">Espace agents</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </div>

      <FooterStandard />
    </main>
  )
}
