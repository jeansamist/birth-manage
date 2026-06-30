# 📋 PLAN D'IMPLÉMENTATION TECHNIQUE — birth-manage

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

## 🌐 PARTIE 2 — Le Portail Citoyen Sécurisé

Mise en œuvre du modèle Zero-Trust avec authentification contextuelle par étapes.

### Étape 2.1 — Chemin 1 : Consultation et Téléchargement Sécurisé (Niveau 1, 2, 3)
*   **Fichiers :**
    *   `app/citizen/page.tsx` (Page d'accueil portail / Recherche).
    *   `app/actions/citizen.ts` (Server Actions d'auth).
*   **Flux de vérification sécurisé :**
    1.  **Niveau 1 :** Saisie du code `CID-YYYY-XXX-XXXXXXXX`.
    2.  **Niveau 2 :** Saisie du nom de famille de la mère.
        *   *Sécurité :* Si le code ou le nom est incorrect, renvoyer la même erreur générique ("Aucun dossier trouvé") pour bloquer les scans de brute-force.
    3.  **Niveau 3 :** Clic sur "Télécharger l'acte" ➔ envoi OTP SMS à la mère ➔ validation ➔ génération du PDF avec le QR code d'authenticité intégré à la volée.

### Étape 2.2 — Chemin 2 : Suivi du Dossier en Ligne
*   **Fichier :** `app/citizen/track/page.tsx`.
*   **Action :** Le citoyen entre le code de suivi `TRK-A8K2-X9QP` ou `REQ-2026-XXXXXX`.
    *   Affiche la timeline de traitement (`StatusTimeline`).
    *   Si le statut est `DRAFT` (médical uniquement), le bouton **[Finaliser ma déclaration]** apparaît pour basculer vers la complétion civile (Partie 1.3).

### Étape 2.3 — Chemin 3 : Déclaration En Ligne (Clinique Hors-Système)
*   **Fichier :** `app/citizen/submit/page.tsx`.
*   **Action :** Pour les naissances avec formulaire FNU papier.
    *   Le parent scanne le QR code du FNU papier.
    *   Le serveur valide le HMAC du code FNU pour s'assurer que c'est un formulaire BUNEC officiel.
    *   Le citoyen saisit toutes les informations, choisit sa mairie et soumet.
    *   Crée une demande `CitizenDeclarationRequest` pour validation manuelle par la mairie.

### Étape 2.4 — Chemin 4 : Vérification d'Authenticité Publique (Sans authentification)
*   **Fichiers :**
    *   `app/verify/[token]/page.tsx`
    *   `app/api/verify/[token]/route.ts`
*   **Action :** Page publique accessible en scannant le QR code d'un acte officiel.
    *   Décoder le JWT sécurisé (HS256) du token.
    *   Vérifier le `contentHash` avec celui en base de données.
    *   Affiche le statut vert "ACTE AUTHENTIQUE" ou rouge "ACTE INCORRECT" avec les données de base pour comparaison visuelle rapide.
