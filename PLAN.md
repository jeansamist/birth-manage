# 📋 PLAN — Refonte UI & Extension de birth-manage

> **Référence visuelle :** `CODE/dashboard-3` (Square UI — dashboard institutionnel)
> **Objectif :** Adopter le design system complet de `dashboard-3` (sidebar shadcn riche,
> header avec ThemeToggle + layout density, stats cards, alert banner, dark mode)
> en l'adaptant à chacun des 4 rôles métier, tout en conservant 100% de la logique existante.

---

## 🧠 Vision globale

Chaque rôle a son **propre espace institutionnel** :
- Sa sidebar avec les bons liens, son institution en header dropdown
- Ses stats cards avec des données réelles issues de Prisma
- Son alert banner contextuel (urgences, actions requises)
- Ses tables enrichies avec badges colorés et actions inline

---

## 📐 Architecture des fichiers

```
app/
├── layout.tsx                          [MOD] Inter + ThemeProvider
├── globals.css                         [MOD] Nouvelle palette + fond #f3f3f3
├── page.tsx                            [MOD] Hero landing premium
├── auth/login/_components/
│   └── login-form.tsx                  [MOD] Formulaire premium
└── dashboard/
    ├── layout.tsx                      [REFONTE] SidebarProvider + layout
    └── _components/
        ├── sidebar.tsx                 [NOUVEAU] Sidebar shadcn riche par rôle
        ├── header.tsx                  [NOUVEAU] Header + ThemeToggle + Edit Layout
        └── status-badge.tsx            [CONSERVER]

components/
├── theme-toggle.tsx                    [NOUVEAU] Bouton dark/light
└── ui/sidebar.tsx                      [VÉRIFIER] Composant shadcn Sidebar

store/
└── dashboard-store.ts                  [NOUVEAU] Zustand — layout density
```

---

## 🎨 ÉTAPE 1 — Design System

### `app/globals.css`
- Police : remplacer `--font-mono` par **Inter** (sans-serif propre)
- Fond light : `bg-[#f3f3f3]` (gris très léger, même que dashboard-3)
- Fond dark : `bg-background` oklch(0.145 0 0)
- Tokens oklch existants : **conservés tels quels**
- Body : ajouter `antialiased`

### `app/layout.tsx`
```tsx
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

// Body className : inter.variable + antialiased + bg-[#f3f3f3] dark:bg-background
// Wrapper : <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
```

---

## 🗂️ ÉTAPE 2 — Sidebar riche (par rôle)

### Structure générale (inspirée de `dashboard-3/sidebar.tsx`)

```
┌─────────────────────────────┐
│  SidebarHeader              │
│  ┌────────────────────────┐ │
│  │ 🔵 État Civil ▾        │ │  ← DropdownMenu institution
│  │                   [👤] │ │  ← Avatar initiales (Dr. Kouam → "DK")
│  └────────────────────────┘ │
├─────────────────────────────┤
│  SidebarContent             │
│  ┌────────────────────────┐ │
│  │ 🔍 Rechercher...   ⌘K  │ │  ← Search bar (décorative)
│  └────────────────────────┘ │
│                             │
│  ── NAVIGATION ──────────── │
│  [liens selon rôle]         │
│                             │
│  ── RACCOURCIS ▾ ─────────  │  ← Collapsible (comme FAVORITES)
│  [liens rapides contextuels]│
│                             │
│  ── [Banner info/upgrade] ─ │  ← Card dismissable optionnelle
│                             │
│  ── SYSTÈME ─────────────── │
│  Paramètres / Aide          │
├─────────────────────────────┤
│  SidebarFooter              │
│  [Se déconnecter]           │
└─────────────────────────────┘
```

---

### 🩺 SIDEBAR — Rôle DOCTOR

**Header dropdown :** Nom de l'hôpital (ex: "CHU de Yaoundé")
**Avatar :** Initiales du médecin

```
NAVIGATION
  🏠  Tableau de bord          /dashboard/hospital
  ➕  Nouvelle naissance        /dashboard/hospital/births/new
  📋  Mes déclarations          /dashboard/hospital  (même page, ancre)

RACCOURCIS (collapsible)
  📁  Brouillons               /dashboard/hospital?filter=draft
  📤  Soumis en attente        /dashboard/hospital?filter=submitted
  ✅  Approuvés                /dashboard/hospital?filter=approved

SYSTÈME
  ⚙️  Paramètres               (futur)
  ❓  Aide                     (futur)
```

**Banner sidebar :** "X déclarations en brouillon — pensez à les soumettre"

---

### 🏛️ SIDEBAR — Rôle SECRETAIRE

**Header dropdown :** Nom de la mairie (ex: "Mairie de Yaoundé 1er")
**Avatar :** Initiales de la secrétaire

```
NAVIGATION
  🏠  Tableau de bord          /dashboard/city-hall
  📥  Dossiers reçus           /dashboard/city-hall  (filtre SUBMITTED)
  🔄  En traitement            /dashboard/city-hall?filter=processing
  📤  Soumis au maire          /dashboard/city-hall?filter=pending_approval

RACCOURCIS (collapsible)
  📁  Tous les dossiers        /dashboard/city-hall?filter=all
  🔍  Rechercher un acte       (barre de recherche)

SYSTÈME
  ⚙️  Paramètres               (futur)
  ❓  Aide                     (futur)
```

**Banner sidebar :** "X dossiers en attente depuis plus de 3 jours"

---

### 👔 SIDEBAR — Rôle MAIRE

**Header dropdown :** Nom de la mairie + sceau/insigne
**Avatar :** Initiales du maire

```
NAVIGATION
  🏠  Tableau de bord          /dashboard/maire
  ✍️  À approuver              /dashboard/maire  (section PENDING_APPROVAL)
  ↔️  Transferts à valider     /dashboard/maire  (section transferts)
  📜  Actes signés             /dashboard/maire?filter=approved

RACCOURCIS (collapsible)
  📊  Statistiques             /dashboard/maire?view=stats
  📁  Actes refusés            /dashboard/maire?filter=declined
  🗂️  Historique complet       /dashboard/maire?filter=all

SYSTÈME
  ⚙️  Paramètres               (futur)
  ❓  Aide                     (futur)
```

**Banner sidebar :** "X actes urgents attendent votre signature"

---

### 🔧 SIDEBAR — Rôle MAINTAINER

```
NAVIGATION
  🏠  Tableau de bord          /dashboard/city-hall
  📋  Tous les dossiers        /dashboard/city-hall
  🔍  Recherche avancée        (futur)

SYSTÈME
  ⚙️  Configuration            (futur)
  ❓  Aide                     (futur)
```

---

### 🛡️ SIDEBAR — Rôle ADMIN

```
NAVIGATION
  🏠  Administration           /dashboard
  🏥  Hôpitaux                 (futur — /dashboard/admin/hospitals)
  🏛️  Mairies                  (futur — /dashboard/admin/city-halls)
  👥  Utilisateurs             (futur — /dashboard/admin/users)
  📊  Rapports                 (futur — /dashboard/admin/reports)

SYSTÈME
  ⚙️  Paramètres système       (futur)
  ❓  Aide                     (futur)
```

---

## 📊 ÉTAPE 3 — Header du dashboard

### `app/dashboard/_components/header.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡] [Icône] Titre de page            [🕐 Mis à jour il y a 5m] │
│                                       [🌙] [Edit Layout ▾]      │
└─────────────────────────────────────────────────────────────────┘
```

**Composants :**
- `SidebarTrigger` — visible mobile uniquement
- Titre dynamique selon `pathname` (ex: "Tableau de bord", "Approbations")
- Timestamp de dernière mise à jour (heure de chargement)
- `ThemeToggle` — bascule dark/light
- Dropdown **Edit Layout** :
  - Densité : `Compact` / `Default` / `Comfortable`
  - Afficher/masquer : Banner · Stats Cards · Table

---

## 📈 ÉTAPE 4 — Stats Cards (données réelles Prisma)

### Style (inspiré de `stats-cards.tsx`)

```
┌──────────────────────────────┐
│  [👶] Naissances déclarées   │
│                              │
│  42                          │  ← grande valeur
│                              │
│  📄 Ce mois : 8              │  ← sous-titre avec icône
└──────────────────────────────┘
```
Fond avec `bg-linear-to-br from-black/5 to-transparent` (overlay subtil)

### DOCTOR — 4 cards
| # | Titre | Valeur Prisma | Sous-titre |
|---|-------|--------------|-----------|
| 1 | Total déclarations | `count(doctorId = me)` | Depuis le début |
| 2 | En brouillon | `count(status=DRAFT)` | À soumettre |
| 3 | En cours mairie | `count(status IN [SUBMITTED,PROCESSING,PENDING])` | En traitement |
| 4 | Approuvées | `count(status=APPROVED)` | Actes signés |

### SECRETAIRE — 3 cards
| # | Titre | Valeur Prisma | Sous-titre |
|---|-------|--------------|-----------|
| 1 | Dossiers reçus | `count(cityHallId=moi, status=SUBMITTED)` | Nouveaux |
| 2 | En traitement | `count(cityHallId=moi, status=PROCESSING)` | Par notre équipe |
| 3 | Soumis au maire | `count(cityHallId=moi, status=PENDING_APPROVAL)` | En attente signature |

### MAIRE — 4 cards
| # | Titre | Valeur Prisma | Sous-titre |
|---|-------|--------------|-----------|
| 1 | À approuver | `count(cityHallId=moi, status=PENDING_APPROVAL)` | 🔴 Urgent |
| 2 | Actes signés | `count(cityHallId=moi, status=APPROVED)` | Total |
| 3 | Refusés | `count(cityHallId=moi, status=DECLINED)` | Total |
| 4 | Transferts en attente | `count(transferRequests PENDING)` | À valider |

---

## 🔔 ÉTAPE 5 — Alert Banner (dismissable)

Style identique à `alert-banner.tsx` (dashboard-3) :

```
┌────────────────────────────────────────────────────────────────────┐
│ 🗒️  Vous avez 3 actes en attente de signature                      │
│     et 2 demandes de transfert à traiter.         [Export] [Agir ▾]│
└────────────────────────────────────────────────────────────────────┘
```

- Bouton **Export** → future fonctionnalité PDF
- Bouton **Agir** → scroll vers la section action ou redirect

| Rôle | Message |
|------|---------|
| DOCTOR | "X naissances soumises attendent un retour de la mairie." |
| SECRETAIRE | "X nouveaux dossiers reçus · X soumis au maire." |
| MAIRE | "X actes attendent votre signature · X transferts à valider." |
| (hidden si 0 action) | Banner masqué automatiquement |

---

## 📋 ÉTAPE 6 — Tables enrichies

Style inspiré de `employees-table.tsx` :

```
┌──────┬─────────────────┬──────────────┬───────────┬──────────────┬─────────┐
│      │ Enfant          │ Date naiss.  │ Mairie    │ Statut       │ Action  │
├──────┼─────────────────┼──────────────┼───────────┼──────────────┼─────────┤
│  👶  │ Jean Kouam      │ 15 juin 2026 │ Yaounde 1 │ ✅ Approuvé  │ Cert. ↗ │
│  👶  │ —               │ —            │ —         │ 📝 Brouillon │ Modifier│
└──────┴─────────────────┴──────────────┴───────────┴──────────────┴─────────┘
```

**Améliorations :**
- Avatar/icône enfant en première colonne
- Badges de statut colorés (vert/orange/rouge/gris)
- Bouton action contextuel à droite (Modifier / Voir / Approuver / Certificat)
- Ligne hover avec fond subtil
- État vide avec illustration + CTA
- Tri par colonne (côté client, simple)

---

## 🔐 ÉTAPE 7 — Page Login

```
┌──────────────────────────────────────────────────┐
│           République du Cameroun                 │
│         🛡️  État Civil — Naissance               │
│                                                  │
│  Institution    [Hôpital ▾ / Mairie ▾]           │
│  Établissement  [CHU de Yaoundé ▾]               │
│  Identifiant    [dr.kouam.jean       ]           │
│  Mot de passe   [••••••••••••••      ]           │
│                                                  │
│  [       Se connecter →                      ]   │
└──────────────────────────────────────────────────┘
```

- Card centrée, ombre premium, fond #f3f3f3
- Icône bouclier vert/bleu (institutionnel)
- Select institution avec icône Hôpital / Mairie
- Animation subtile sur focus des inputs

---

## 🏠 ÉTAPE 8 — Landing Page

```
┌──────────────────────────────────────────────────────────┐
│  🛡️ ÉTAT CIVIL                                           │
│                                                          │
│  Suivi sécurisé des actes                                │
│  de naissance au Cameroun                                │
│                                                          │
│  [Portail citoyen →]  [Connexion agents]                 │
├──────────────────────────────────────────────────────────┤
│  01 Déclaration    02 Signature      03 Portail citoyen  │
│  L'hôpital         Le maire          Vérifiez et         │
│  déclare           approuve          demandez copie      │
└──────────────────────────────────────────────────────────┘
```

---

## 🌐 ÉTAPE 9 — Portail Citoyen

- Input de recherche grand format (hero-style)
- Card résultat avec badge "✅ APPROUVÉ" très visible
- Mairies disponibles en liste avec icônes
- Timeline des transferts (statut PENDING → APPROVED avec date)

---

## 🛠️ Récap fichiers

### Créer
| Fichier | Description |
|---------|-------------|
| `app/dashboard/_components/sidebar.tsx` | Sidebar shadcn riche, par rôle |
| `app/dashboard/_components/header.tsx` | Header + ThemeToggle + Edit Layout |
| `components/theme-toggle.tsx` | Bouton dark/light mode |
| `store/dashboard-store.ts` | Zustand — density + show/hide |

### Modifier
| Fichier | Changement |
|---------|-----------|
| `app/globals.css` | Inter + fond #f3f3f3 + antialiased |
| `app/layout.tsx` | Inter + ThemeProvider |
| `app/dashboard/layout.tsx` | SidebarProvider + sidebar + header |
| `app/dashboard/hospital/page.tsx` | Stats cards + alert banner + table enrichie |
| `app/dashboard/city-hall/page.tsx` | Stats cards + alert banner + table enrichie |
| `app/dashboard/maire/page.tsx` | Stats cards + alert banner + table enrichie |
| `app/page.tsx` | Landing redesign |
| `app/auth/login/_components/login-form.tsx` | Login premium |
| `app/citizen/page.tsx` | Portail citoyen amélioré |

### Conserver intacts (ne pas toucher)
| Fichier | Raison |
|---------|--------|
| `app/actions/` | Server Actions — logique métier |
| `lib/auth.ts` | JWT — ne pas casser |
| `lib/prisma.ts` | Client DB |
| `prisma/schema.prisma` | Schéma |
| `app/dashboard/_components/status-badge.tsx` | Déjà propre |
| `app/dashboard/*/births/` | Pages détail — refonte phase 2 |

---

## 📦 Dépendances

| Package | Statut | Usage |
|---------|--------|-------|
| `shadcn` (sidebar) | ✅ installé | Sidebar, Avatar, DropdownMenu |
| `next-themes` | ✅ installé | ThemeProvider, ThemeToggle |
| `framer-motion` | ✅ installé | Animations transitions |
| `lucide-react` | ✅ installé | Toutes les icônes |
| `recharts` | ✅ installé | Graphiques (phase 2) |
| `zustand` | ❓ à vérifier | Dashboard store (density) |

---

## 🗓️ Ordre d'exécution

```
Phase 1 — Foundation (design system + structure)
  1. globals.css + layout.tsx      ← Inter, ThemeProvider, fond
  2. theme-toggle.tsx              ← Composant bouton dark/light
  3. store/dashboard-store.ts      ← Zustand layout density

Phase 2 — Shell du dashboard
  4. sidebar.tsx                   ← Sidebar riche par rôle
  5. header.tsx                    ← Header + Edit Layout
  6. dashboard/layout.tsx          ← SidebarProvider wrapping

Phase 3 — Contenu par rôle
  7. hospital/page.tsx             ← Stats + banner + table
  8. city-hall/page.tsx            ← Stats + banner + table
  9. maire/page.tsx                ← Stats + banner + table

Phase 4 — Pages publiques
  10. auth/login                   ← Formulaire premium
  11. app/page.tsx                 ← Landing
  12. citizen/page.tsx             ← Portail citoyen
```
