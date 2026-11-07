# Le Coffret — Noyau boréal

Jeu original de déduction en français, autonome, local et sans backend. Trois mécanismes connectés : routage de quatre câbles, accord d’anneaux, séquence de libération du noyau. Niveau de raisonnement visé : environ 12–14 ans et plus, pas une classification d’âge.

## Lancer

Depuis `/workspace/games/coffret-futuriste` :

```sh
python3 -m http.server 8887 --bind 0.0.0.0
```

Ouvrir `http://localhost:8887/`. Aucun `npm install` ni build requis. Les modules JavaScript nécessitent HTTP, pas une ouverture `file://`. Three.js 0.180.0 est fourni dans `vendor/`, avec sa licence MIT; aucune dépendance réseau à l’exécution. `npm test` utilise uniquement Node (testé avec le Node installé sur la box).

## Commandes

- Vue d’ensemble : toucher un grand panneau pour s’en rapprocher; glisser le fond pour regarder. Les boutons de cadrage restent disponibles.
- Fiche : glisser vers une prise, ou cliquer la fiche puis la prise. Cliquer de nouveau la fiche sélectionnée la débranche. Une prise occupée refuse une autre fiche.
- Anneau : glissement circulaire avec crans, ou clic pour avancer d’un cran. Boutons −/+ dans les commandes accessibles.
- Languette : tirer/glisser ou cliquer; ensuite soulever la poignée. Annuler le dernier / Effacer dans les commandes accessibles.
- Toutes les actions existent dans « Commandes accessibles », au clavier ou au clic. Tab, Entrée/Espace, flèches sur les boutons d’anneaux; Échap annule un geste et revient à l’ensemble hors menu.
- Indices facultatifs en trois niveaux, puis application confirmée d’une étape avec marque d’aide. Menu : nouvelle partie confirmée, défi facultatif, volume, animations réduites et affichage du temps.

## État honnête

Construction locale : règles, scène 3D procédurale, gestes pointeur, audio synthétique, reprise versionnée et commandes HTML alternatives. Les tests purs énumèrent les 24 / 216 / 24 configurations; des contrats statiques vérifient les principaux branchements de surface. La syntaxe des modules est vérifiée par Node.

**Pas encore validés par un navigateur à la livraison :** rendu, lisibilité des gravures, précision des gestes, annonces lecteur d’écran, audio audible, contexte WebGL réel et parcours navigateur complet. Aucun test physique Samsung S20 réalisé. Les tests statiques ne remplacent pas cette QA. Les budgets fps, appels de dessin et mémoire GPU de la spec sont des objectifs, pas des résultats mesurés; l’objet contient de nombreuses étiquettes et nécessite un profil réel, voire un regroupement supplémentaire avant validation mobile finale.

Ressources runtime : environ 2,05 Mo non compressés; environ 0,411 Mo en somme gzip indicative. Le serveur Python ne sert pas gzip par défaut. Pas d’images, police ou audio téléchargés à l’exécution. Pas de compte, télémétrie ou publication. Aucun remote Git configuré.

Voir `GAME.md` pour la checklist QA et les solutions destinées au testeur, pas à l’interface du jeu.
