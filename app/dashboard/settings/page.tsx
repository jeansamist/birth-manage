import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardContent } from "@/app/dashboard/_components/content"

export default async function DashboardSettingsPage() {
  const session = await getSession()
  if (!session) redirect("/auth/login")

  return (
    <DashboardContent>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-base font-bold uppercase tracking-wider text-neutral-800">
            Paramètres du compte
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Gérez les informations associées à votre session d'accès.
          </p>
        </div>

        {/* Informations du compte */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Informations du compte
            </h2>
          </div>
          <div className="divide-y divide-neutral-100">
            <SettingsRow label="Identifiant" value={session.username} />
            <SettingsRow label="Rôle" value={roleLabel(session.role)} />
            <SettingsRow
              label="Institution"
              value={session.institutionName ?? "Système central"}
            />
            <SettingsRow
              label="Type d'institution"
              value={
                session.institutionType === "hospital"
                  ? "Établissement hospitalier"
                  : session.institutionType === "city-hall"
                  ? "Centre d'état civil / Mairie"
                  : "Administration centrale"
              }
            />
          </div>
        </div>

        {/* Sécurité */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Sécurité
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-xs text-neutral-500 leading-relaxed">
              La gestion des mots de passe et des accès est assurée par l'administrateur système. 
              Contactez votre responsable informatique ou l'équipe BUNEC pour toute modification d'identifiants.
            </p>
            <p className="text-[10px] text-neutral-400 leading-relaxed border-l-2 border-neutral-200 pl-3">
              Pour des raisons de sécurité, chaque session est strictement limitée à un seul rôle et une seule institution. 
              La déconnexion invalide immédiatement et définitivement le jeton de session courant.
            </p>
          </div>
        </div>

        {/* BUNEC */}
        <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
          <div className="px-5 py-3 border-b border-neutral-100 bg-neutral-50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
              Cadre légal
            </h2>
          </div>
          <div className="p-5 text-xs text-neutral-500 leading-relaxed space-y-2">
            <p>
              Ce système est opéré sous l'autorité du <strong>Bureau National de l'État Civil (BUNEC)</strong>, 
              conformément à l'Ordonnance camerounaise <strong>n° 81-02 du 29 juin 1981</strong> et à la Loi 
              <strong> n° 2011/011</strong> portant organisation de l'état civil.
            </p>
            <p className="text-[10px] text-neutral-400">
              Toute tentative d'accès non autorisé ou de falsification de données est passible de poursuites judiciaires.
            </p>
          </div>
        </div>
      </div>
    </DashboardContent>
  )
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 px-5 py-3 text-xs gap-4">
      <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">
        {label}
      </span>
      <span className="col-span-2 text-neutral-800 font-medium">{value}</span>
    </div>
  )
}

function roleLabel(role: string) {
  switch (role) {
    case "DOCTOR": return "Médecin déclarant"
    case "SECRETAIRE": return "Secrétaire d'État Civil"
    case "MAIRE": return "Officier d'État Civil / Maire"
    case "MAINTAINER": return "Mainteneur"
    case "ADMIN": return "Administrateur système"
    default: return role
  }
}
