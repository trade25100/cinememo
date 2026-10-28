# CinéMémo — carnet de films

Petit site statique en français pour noter les films et les phrases qui vous ont marqué.

## Fonctions
- Ajouter / modifier / supprimer un film
- Titre, catégorie, note sur 5, description, citations (une par ligne)
- Lien et galerie d'images par URL
- Recherche, filtre par catégorie et tri
- Export / import JSON
- Enregistrement local dans le navigateur (localStorage)

## Publier sur GitHub Pages
1. Décompressez l’archive ZIP.
2. Créez un dépôt GitHub, par exemple `cinememo`.
3. Téléversez `index.html`, `style.css`, `app.js` et `README.md` à la racine du dépôt.
4. Ouvrez **Settings → Pages**.
5. Dans **Build and deployment**, choisissez **Deploy from a branch**, branche `main`, dossier `/(root)`, puis **Save**.
6. Patientez le temps du déploiement. Votre adresse sera du type `https://VOTRE-PSEUDO.github.io/cinememo/`.

## À savoir
Les données sont conservées dans le stockage local du navigateur et de l’appareil. Elles ne sont pas synchronisées entre appareils et peuvent être perdues si les données du navigateur sont effacées. Utilisez **Exporter mes données (JSON)** pour faire une sauvegarde régulière. Les URL de galerie doivent être accessibles publiquement et pointer vers des fichiers images. Le site ne télécharge pas et n’héberge pas les images.
