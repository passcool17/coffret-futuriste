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

**QA publique bureau rapportée par le coordinateur :** trois étapes résolues, mauvaises solutions refusées, reprise à 2/3 observée. **Restent non validés :** audio audible, tactile/mobile, lecteur d’écran, contexte WebGL perdu/restauré et performances matérielles. La lisibilité et les gestes demandent encore une inspection plus approfondie. Aucun test physique Samsung S20 réalisé. Les tests statiques ne remplacent pas cette QA. Les budgets fps, appels de dessin et mémoire GPU de la spec sont des objectifs, pas des résultats mesurés; l’objet contient de nombreuses étiquettes et nécessite un profil réel, voire un regroupement supplémentaire avant validation mobile finale.

Ressources runtime : environ 2,05 Mo non compressés; environ 0,411 Mo en somme gzip indicative. Le serveur Python ne sert pas gzip par défaut. Pas d’images, police ou audio téléchargés à l’exécution. Pas de compte ni télémétrie dans le jeu. Le prototype est publié séparément sous passcool17, sans modifier les autres jeux.

Voir `GAME.md` pour la checklist QA et les solutions destinées au testeur, pas à l’interface du jeu.

### Revue corrective locale

Nettoyage des handlers après relance 3D et continuité du focus clavier corrigés, avec reproductions Node rouge→vert (31 tests au total). Ces tests utilisent des doubles DOM/WebGL, pas un navigateur. La QA locale sur localhost était bloquée; une QA bureau du site public a depuis été rapportée, sans validation sonore, tactile ou S20.

## Prototype public — publication autorisée

- Jeu : https://passcool17.github.io/coffret-futuriste/
- Sources : https://github.com/passcool17/coffret-futuriste
- GitHub Pages : branche `main`, dossier racine `/`, fichiers statiques avec `.nojekyll`.

Publication expressément autorisée par Pascal le 7 novembre 2026 à 11 h 19 (Toronto), malgré la QA visuelle et sonore locale bloquée. La vérification de disponibilité HTTP et d’identité des fichiers est distincte d’un essai du jeu : le parcours bureau public a ensuite été observé par le coordinateur; son, tactile/mobile et performances S20 restent non validés. Les solutions sont séparées dans GAME.md et les documents de conception, pas affichées dans le jeu hors indices demandés.

### Correctifs des messages après QA publique
Le refus d’une prise occupée apparaît maintenant directement sous le menu de la fiche, sans permutation automatique. Le message au chargement reflète la progression restaurée et n’écrase pas les messages d’action lors des rafraîchissements. Une icône locale explicite évite la recherche implicite du favicon racine manquant (404 confirmé); le 404 non identifié de la console ne peut pas être attribué avec certitude sans son URL. 35 tests Node passent après ces corrections.
