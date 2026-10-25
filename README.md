# Outilsud — site statique multi-pages (refonte v9)

## Structure

- `index.html` — Accueil et vidéo
- `location.html` — Catalogue avec recherche et carrousel de 3 machines
- `vente.html` — Vente et diaporama automatique des photos du magasin
- `services.html` — Services
- `apropos.html` — Histoire d'Outilsud
- `contact.html` — Formulaire de contact
- `demande.html` — Sélection de machines et demande de devis
- `machines.json` — Catalogue éditable
- `assets/css/styles.css` — CSS structuré par sections
- `assets/js/common.js` — Menu, sélection et paramètres partagés
- `assets/js/location.js` — Catalogue et filtres
- `assets/js/request.js` — Demande de devis
- `assets/js/gallery.js` — Diaporama
- `assets/js/photos.js` — Liste exacte des 23 photos du magasin
- `assets/js/contact.js` — Formulaire de contact
- `assets/images/` — Logos et photographies

## Important avant publication

1. **Téléverser tous les fichiers et dossiers à la racine du dépôt GitHub Pages**, pas le dossier englobant `outilsud-refonte`.
2. Dans `assets/js/common.js`, définir `CONTACT_EMAIL` avec l'adresse officielle Outilsud. Tant qu'elle est vide, les formulaires avertissent l'utilisateur et n'envoient rien. Il s'agit de brouillons `mailto:`, pas d'un système d'envoi automatique.
3. Vérifier les fiches machines, les tarifs, la disponibilité, les coordonnées officielles et les mentions légales avant publication. Le catalogue fourni dans l'archive initiale contient des fiches indicatives.
4. Les 23 photos sont intégrées avec leurs **noms exacts**. Les deux noms erronés `9.9.2.png` et `9.9.9.png` ont été supprimés de la liste ; les fichiers existants `9.92.png` et `9.9.png` sont bien utilisés.
5. Pour tester localement : `python -m http.server 8000` puis ouvrir `http://localhost:8000/` (nécessaire pour charger `machines.json` en HTTP).
6. Sur GitHub Pages, attendre la fin du déploiement puis forcer le rechargement avec `Ctrl + F5`.

La sélection de location est conservée entre les pages grâce à `localStorage`.
