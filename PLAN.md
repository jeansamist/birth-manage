# 📋 PLAN D'IMPLÉMENTATION TECHNIQUE SECURE — birth-manage

> **Cible :** Guide pas-à-pas détaillé pour l'écriture du code (AI-ready).
> **Axe Principal :** Charte graphique **Split-Screen Live Preview** et **Portail Citoyen**.

---

## 🎨 PARTIE 1 — Refonte UI des Dashboards (Split-Screen Live Preview)

Objectif : Implémenter le double panneau 50/50 Desktop. À gauche le formulaire de saisie, à droite la feuille blanche A4 virtuelle qui se remplit en direct.

### Étape 1.1 — Le Rendu CSS de la Feuille A4 Physique
Créer un composant réutilisable de rendu A4 : `components/document-preview.tsx`
*   **Dimensions :** `aspect-[1/1.414]` (ratio A4), `w-full max-w-[800px]`, `bg-white shadow-xl border border-border/50 text-black p-8 relative overflow-hidden select-none`.
*   **Aperçus distincts :**
    1.  `DeclarationSheet` : Grille identique à [declaration de naissance.jpg](file:///home/kali-root/Dev/Personnal%20Projects/%21@Github%20Organizations/wistant/birth-manage/public/declaration%20de%20naissance.jpg) (Sections 1 à 5).
    2.  `CertificateSheet` : Acte avec le grand filigrane armoiries nationales en arrière-plan, numéro en rouge et QR code en bas ([acte-naissance.png](file:///home/kali-root/Dev/Personnal%20Projects/%21@Github%20Organizations/wistant/birth-manage/public/acte-naissance.png)).
*   **Polices :** Roboto/Sans pour les libellés officiels, et une police cursive/manuscrite (ex: `font-serif italic text-blue-900`) pour les données saisies par l'utilisateur.

### Étape 1.2 — Refonte Formulaire Médecin (Dashboard Hôpital)
*   **Fichier :** `app/dashboard/hospital/births/new/page.tsx` (et ses sous-composants).
*   **Structure HTML :**
    ```tsx
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6 overflow-y-auto pr-2"> {/* Saisie */} </div>
      <div className="sticky top-20 hidden xl:flex items-center justify-center bg-muted/20 rounded-2xl border p-6 overflow-hidden">
        <DocumentPreview type="declaration" data={currentFormData} />
      </div>
    </div>
    ```
*   **Champs de saisie :** Sexe, date, heure, poids, nom de la mère.
*   **Rendu live :** Complétion en direct de la **Section 1** et **Section 2** sur le document de droite.

### Étape 1.3 — Le Formulaire Citoyen (Complétion Civile)
*   **Fichier :** `app/citizen/declare/page.tsx` (Nouvelle route).
*   **Structure HTML :** Même disposition split-screen grid.
*   **Champs de saisie :** Prénoms de l'enfant, père, acte de mariage.
*   **Rendu live :** Le document de droite affiche les Sections 1 & 2 pré-remplies et cadenassées. Le parent remplit les Sections 3 & 4.
*   *Responsive mobile :* Sur mobile, le panneau de droite est masqué. Il s'affiche uniquement à la dernière étape (Review) sous forme de modal plein écran zoomable.

### Étape 1.4 — Le Dashboard Mairie (Secrétaire & Maire)
*   **Fichiers :** 
    *   `app/dashboard/city-hall/births/[id]/page.tsx`
    *   `app/dashboard/maire/page.tsx`
*   **Structure HTML :** Layout double panneau.
    *   *Gauche :* Boutons `[Valider]`, `[Renvoyer pour correction]`, `[Signer l'acte]`.
    *   *Droite :* `<DocumentPreview type="certificate" data={birthRecord} />` (Rendu de l'acte de naissance final avec le grand filigrane, signatures et QR code de vérification au milieu inférieur).

---

## 🌐 PARTIE 2 — Le Portail Citoyen Sécurisé & Restrictions Hôpital

Mise en œuvre du modèle Zero-Trust, de la restriction du rôle médecin à la déclaration pure, et de la validation universelle par QR Code.

### Étape 2.1 — Restriction Strict du Rôle Médecin (Hôpital)
*   **Objectif :** Un médecin (DOCTOR) doit uniquement déclarer les naissances et ne doit pas avoir accès aux outils de consultation globale, aux statistiques des actes signés, ni à la recherche d'actes d'autres enfants.
*   **Modifications Moteur de Recherche & Dashboard Hôpital (`app/dashboard/hospital/page.tsx`) :**
    1.  Modifier la requête Prisma pour ne remonter que les dossiers de statut `DRAFT` et `DECLINED` associés à son identifiant (`doctorId: session.userId`).
    2.  Désactiver l'affichage des graphiques de flux globaux et des compteurs d'actes approuvés (`APPROVED`), en cours de traitement, etc.
    3.  Remplacer l'interface par un tableau de bord ultra-simplifié : un bouton d'action principal bien visible **[Déclarer une nouvelle naissance]** et un tableau listant uniquement ses brouillons en cours et les dossiers refusés par la mairie en attente de correction.
*   **Mise à jour de la Sidebar (`app/dashboard/_components/sidebar.tsx`) :**
    1.  Pour le rôle `DOCTOR`, retirer complètement la section rétractable "MES DÉCLARATIONS" (qui contient les filtres "En attente", "Approuvées", etc.).
    2.  Ne conserver que les deux liens essentiels : **[Déclarer une naissance]** et **[Brouillons & Corrections]**.

### Étape 2.2 — Génération Dynamique de QR Codes Absolus (Acte & Déclaration)
*   **Objectif :** Intégrer de vrais QR Codes scannables par smartphone, avec des URLs absolues qui dirigent vers la plateforme d'authentification et de suivi.
*   **Mécanisme URL de base :**
    *   Créer une fonction utilitaire `getBaseUrl()` dans `lib/utils.ts` pour récupérer de manière dynamique le protocole et l'hôte (`window.location.origin` côté client, `process.env.NEXT_PUBLIC_APP_URL` ou `process.env.VERCEL_URL` côté serveur, avec un fallback vers `http://localhost:3000`).
*   **QR Code dans la Déclaration Médicale (`components/form/preview/section-registrar.tsx`) :**
    1.  Ajouter un bloc QR Code visuel dans la **Section 5 (Accusé de réception)** de la déclaration.
    2.  Données du QR Code : `${getBaseUrl()}/verify/${citizenTrackingCode}`.
    3.  L'utilisateur scanne la déclaration papier et accède instantanément à l'état d'avancement de son dossier en ligne.
*   **QR Code dans l'Acte de Naissance (`components/form/preview/certificate-signatures.tsx`) :**
    1.  Assurer que la signature de l'Officier contient le QR Code absolu : `${getBaseUrl()}/verify/${citizenAccessId}`.
    2.  L'utilisateur ou l'administration scanne l'acte de naissance A4 et accède à la page publique de certification de l'acte.

### Étape 2.3 — Route Unifiée de Suivi et de Vérification (`app/verify/[token]/page.tsx`)
*   **Objectif :** Unifier la page de vérification pour traiter à la fois les codes d'accès citoyen (`CID-...`) et les codes de suivi de déclaration (`TRK-...`).
*   **Modifications Logique de Recherche (`page.tsx`) :**
    1.  Modifier la requête Prisma pour rechercher un enregistrement où `citizenAccessId == token` OU `citizenTrackingCode == token`.
*   **Gestion Dynamique des Écrans selon le Statut :**
    *   **Cas 1 : Acte Approuvé (`status === "APPROVED"`) :**
        *   Afficher le badge vert **"ACTE DE NAISSANCE AUTHENTIQUE"**.
        *   Afficher le tableau de comparaison des données d'état civil (Nom, Prénom, Mère, Père, Mairie, Date) pour vérification visuelle.
    *   **Cas 2 : Brouillon Citoyen (`status === "DRAFT"` et non complété) :**
        *   Afficher le badge orange **"DÉCLARATION MÉDICALE ENREGISTRÉE"**.
        *   Expliquer aux parents qu'ils doivent finaliser la déclaration civile.
        *   Afficher un bouton d'action proéminent **[Compléter ma déclaration en ligne]** renvoyant vers `/citizen/declare?code=${citizenTrackingCode}`.
    *   **Cas 3 : En Cours de Traitement (`SUBMITTED`, `PROCESSING`, `PENDING_APPROVAL`) :**
        *   Afficher le badge bleu **"DÉCLARATION EN COURS D'INSTRUCTION"**.
        *   Afficher une timeline visuelle interactive montrant l'état actuel de validation à la mairie d'origine.
    *   **Cas 4 : Rejeté par la Mairie (`status === "DECLINED"`) :**
        *   Afficher le badge rouge **"DOSSIER À CORRIGER"**.
        *   Afficher clairement le motif de rejet saisi par l'Officier de mairie pour que l'utilisateur puisse corriger le tir.
    *   **Cas 5 : Inconnu :**
        *   Afficher le message d'erreur **"DOCUMENT NON AUTHENTIFIÉ"** standard.
