# LoveResume

Application Vue 3 / TypeScript / Tailwind pour créer un CV sentimental, avec aperçu en direct, sauvegarde locale et export PDF direct dans le navigateur.

## Démarrage

1. `npm install`
2. `npm run dev`

## Scripts

- `npm run dev` : serveur de développement Vite.
- `npm run build` : vérification TypeScript puis build de production.
- `npm run preview` : prévisualisation du build.

## Fonctionnalités

- Formulaire guidé : profil, bio, parcours amoureux, avis, traits, valeurs et compétences.
- Aperçu en direct du CV et export PDF A4.
- Contenu du PDF : `Version complète`, `Sans les prénoms` et `Sans parcours ni avis`. En mode sans prénoms, le parcours et les avis restent mais les prénoms deviennent « Une personne » ; en mode sans parcours ni avis, ces sections disparaissent de l’aperçu et du PDF. Ce réglage change le contenu du fichier, pas les droits d’accès après export.
- Sauvegarde locale automatique dans `localStorage` (clé `loveresume:draft:v1`), sans compte, backend ni envoi de données.
- Bouton « Tout effacer » avec confirmation.
- Exemple prérempli pour découvrir l’outil, avec possibilité de repartir de zéro.
- Export PDF direct via `html2pdf.js`, sans service externe.
- Interface responsive et bilingue FR / EN.
- Filtre les gros mots, le verlan et leurs variantes modernes, et demande de ne jamais partager de coordonnées personnelles.

## Notes

- Les données restent dans le navigateur de la personne qui utilise l’application.
- Le PDF est généré par le navigateur ; l’application n’envoie aucun document.
