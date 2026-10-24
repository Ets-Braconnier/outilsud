OUTILSUD — PREMIÈRE VERSION DE DÉMONSTRATION

Ouvrez index.html dans votre navigateur pour visualiser le site.
Contenu : accueil, catalogue filtrable de 12 machines d'exemple, sélection multiple,
formulaire de demande de location, vente, services, à propos et contact.

IMPORTANT AVANT PUBLICATION
1. Remplacer le logo typographique provisoire par le logo officiel Outilsud.
2. Vérifier la nuance exacte de bleu (variables CSS --blue et --blue2).
3. Valider la liste réelle des machines. Le catalogue actuel est FICTIF.
4. Ajouter de vraies photographies, les marques et caractéristiques techniques.
5. Ajouter les coordonnées, horaires, mentions légales, politique de confidentialité.
6. Configurer l'adresse de réception dans app.js : const configuredEmail='...';
7. Le mailto ouvre le logiciel e-mail du client : il ne garantit PAS l'envoi.
   En production, remplacer par un formulaire serveur avec anti-spam et notification.
8. Aucune réservation ni disponibilité en temps réel n'est assurée.
9. machines.json est fourni comme base de catalogue à importer ultérieurement
   dans une interface d'administration ; la démo utilise les données JS intégrées.

Aucun paiement ni réservation ferme n'est prévu à ce stade.

MISE À JOUR : identité Outilsud
- Logo original fourni dans images-site/outilsud-Fond-Blanc.jpg
- Bleu principal extrait du logo : #32317F (approximation à partir des pixels).
- Vidéo YouTube EHhL8LVfJyE intégrée en fond d'accueil, muette et en boucle.
- La lecture dépend de YouTube, du réseau, des cookies et des restrictions d'intégration.
- Pour une vidéo auto-hébergée, il faut obtenir le fichier et les droits de diffusion.

VERSION 3 : logo Outilsud agrandi, nouveau titre d'accueil, logo officiel Braconnier sous la vidéo et dans le pied de page, liens vers https://braconnier.be/fr/index.html.
La vidéo YouTube dépend des autorisations d'intégration et de lecture automatique du navigateur.

VERSION 4 : Logo Outilsud recadré et agrandi, CSS prioritaire, catalogue affichant
3 machines par page sur ordinateur (1 sur mobile), navigation avec flèches.
La recherche et les catégories filtrent toujours l'ensemble des machines.
Pour GitHub : remplacer TOUS les fichiers (index.html, styles.css, app.js,
images-site/) puis vérifier le déploiement Pages et actualiser Ctrl+F5.

VERSION 5 : aérogommeuse ajoutée au catalogue (machine illustrative, stock à confirmer). Boutons « Demander un devis de location » et « Ajoutée au devis ». Mise à jour du texte des demandes.\n