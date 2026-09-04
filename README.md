# DevLoup Devis Dashboard

Mini application frontend Next.js pour créer et gérer des devis avec un aperçu A4 inspiré du devis DevLoup Solutions Web.

## Fonctionnalités
- Dashboard avec liste des devis
- Nouveau devis / modification / suppression
- Données enregistrées dans localStorage
- Aperçu A4 en direct
- Impression / Enregistrement PDF via le navigateur
- Informations DevLoup et CIH pré-remplies
- Aucun backend requis

## Démarrage
```bash
npm install
npm run dev
```
Puis ouvrir http://localhost:3000

## Export PDF
Ouvrir un devis, cliquer sur **Imprimer / PDF**, puis choisir **Enregistrer au format PDF** dans la boîte d'impression du navigateur.


## Export PDF
Le bouton **Télécharger PDF** capture directement l'aperçu A4 (`#quote-paper`) avec `html2canvas` puis génère un PDF A4 via `jsPDF`. Le PDF garde donc le même rendu visuel que l'aperçu de l'application.
