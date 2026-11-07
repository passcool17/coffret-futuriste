# Le Coffret — Noyau boréal

Jeu original de déduction en français, autonome, local et sans backend. Trois mécanismes connectés : routage de quatre câbles, accord d’anneaux, séquence de libération du noyau. Niveau de raisonnement visé : environ 12–14 ans et plus, pas une classification d’âge.

## Douze dossiers — publiés en 56e5ef8

La rejouabilité est publiée en 56e5ef8 : douze configurations exactes, trois familles de déduction. Nouvelle partie change les indices, prises, anneaux et ordre final ensemble; le même dossier revient seulement après épuisement du sac de douze. Ce sont trois familles réutilisées, pas une infinité d’énigmes structurellement inédites. Le dossier courant est affiché dans le carnet.

Une sauvegarde historique v1 reprend comme **Partie d’origine conservée**, avec ses anciennes règles et sa progression; seule la prochaine Nouvelle partie confirmée choisit un nouveau dossier. La recharge ne tire jamais une autre configuration. Clé locale inchangée, contenu migré au schéma v2. Préférences et audio conservés.

Une sauvegarde illisible n’est plus écrasée automatiquement : Réessayer la lecture, Nouvelle partie avec confirmation, ou Jouer sans sauvegarder. En mémoire seule, garder la page ouverte; l’ancienne valeur enregistrée reste intacte. Aucune copie persistante secondaire ni synchronisation cloud. Un backup du raw lu reste seulement en mémoire de la session.

**Preuves locales : 90 tests Node**, incluant unicité24/216/24 des douze dossiers, contraintes essentielles, douze parcours dans la vraie app avec DOM/WebGL simulés et recharges à chaque étape, migration v1 et erreurs de stockage. Ce ne sont pas des essais navigateur, ni une validation de lisibilité, son ou S20. Cette version a depuis été publiée en 56e5ef8; la QA complémentaire rapportée ci-dessous reste distincte des tests Node.

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

**QA publique bureau rapportée par le coordinateur :** trois étapes résolues, mauvaises solutions refusées, reprise à 2/3 observée. **Restent non validés :** nouveau mix audio, lecteur d’écran, contexte WebGL perdu/restauré et performances matérielles. Le clic et le toucher de la version précédente ont été confirmés par Pascal sur S20 (retour utilisateur, pas profilage). La lisibilité et les gestes demandent encore une inspection plus approfondie. Aucun profilage physique Samsung S20 réalisé par le constructeur. Les tests statiques ne remplacent pas cette QA. Les budgets fps, appels de dessin et mémoire GPU de la spec sont des objectifs, pas des résultats mesurés; l’objet contient de nombreuses étiquettes et nécessite un profil réel, voire un regroupement supplémentaire avant validation mobile finale.

Ressources runtime de cette version locale : 2 084 895 octets non compressés sur 16 fichiers; 424 194 octets en somme gzip indicative. Le serveur Python ne sert pas gzip par défaut. Pas d’images, police ou audio téléchargés à l’exécution. Pas de compte ni télémétrie dans le jeu. Le prototype est publié séparément sous passcool17, sans modifier les autres jeux.

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

Après QA responsive bureau à 360 × 800 : la légende et le zoom sont déplacés dans une barre réservée hors canvas, sans masquer de texte. Un branchement direct a été observé, ainsi que la persistance du mute/volume après recharge; cela ne valide ni un écran tactile physique ni un son audible. Le coordinateur a confirmé que le 404 concernait favicon.ico. Retest responsive du placement rapporté réussi par le coordinateur. Suite de base avant audio : 36 tests Node.

## Passe audio approuvée — publiée en 9027626

Musique originale procédurale douce (sans percussion), effets distincts pour fiches/anneaux/languettes/capots et courte cadence finale. Le menu propose Volume général, Musique et Effets; Son reste le mute global. Ces préférences persistent sans invalider les anciennes sauvegardes v1. La musique démarre sur une commande explicite, pas au chargement; menu, onglet caché et perte de focus la mettent en pause, puis Reprendre ou le prochain geste la réactive. Le rendu audio n’utilise pas la boucle 3D.

Limites : trois voix musicales, huit voix d’effets, tampon bruit mono d’une seconde, aucune ressource audio externe. Les effets excédentaires sont abandonnés plutôt que mis en attente; les ouvertures ont priorité sur l’anti-rebond ordinaire. La musique dépend seulement des étapes acquises, pas de la justesse partielle.

Cette passe a été publiée en 9027626 après revue indépendante. Pascal a indiqué que la musique convenait à 12 h 02 (Toronto), selon le coordinateur. Aucun essai auditif du nouveau mix effectué par le constructeur. Les tests utilisent des contextes/horloges factices; aucun renderer offline n’était installé et aucune dépendance n’a été ajoutée pour produire un échantillon. Écoute réelle bureau/S20 et mesure de consommation restent à faire.

## Historique — correction des anneaux, publiée en 26758d5

La solution logique demeure inchangée. Les anciens pictogrammes étaient des plans rectangulaires au-dessus d’un tore, avec une rotation locale de signe erroné : quatre symboles sur six arrivaient inclinés au repère. Les anneaux ont maintenant une face annulaire solide dont la texture de matériau porte directement les symboles vectoriels, sans plaque flottante. Chaque bande possède son repère fixe; le symbole sélectionné est redressé. La même famille de tracés sert aux fiches et languettes physiques.

66 tests Node passent, y compris 18 correspondances physiques, les 216 combinaisons logiques et les deux sens/passage du zéro. Ces contrôles CPU et Canvas2D simulés ne prouvent pas encore le résultat visuel : revue puis QA réelle bureau et 360 × 800 requises avant publication. Sauvegardes, solutions et musique conservées. Voir GAME.md pour le protocole de validation.

### Historique — livraison des icônes et cache, publiée en 7e637f0

La QA publique suivant 26758d5 a résolu le centre avec les commandes accessibles et repris à l’étape suivante, mais la capture exécutait encore l’ancien rendu et l’ancien texte. Ce n’est donc pas une validation visuelle des nouveaux anneaux. Les fichiers publics nouveaux ont été vérifiés par HTTP; Pages annonce un cache de dix minutes.

L’entrée app.js et les imports modifiés content.js, scene.js et ring-graphics.js portent désormais la version déterministe `rings-26758d5`. Les deux références à content.js utilisent exactement la même URL. Un rechargement normal qui récupère le nouvel HTML choisit ainsi les nouveaux modules, sans DevTools, service worker ni effacement de sauvegarde. Les URL non modifiées du modèle et de l’audio restent uniques. Le délai éventuel de cache HTML/CDN n’est pas supprimé par ce mécanisme.

À cette livraison : 67 tests Node passaient; graphe HTML/imports vérifié sans navigateur. Publication 7e637f0 et hashes publics confirmés ensuite; inspection réelle du nouveau rendu distincte de cette preuve réseau.

## Documentation de rejouabilité

Règles et données exactes : `docs/superpowers/specs/2026-11-07-coffret-replay-design.md` (solutions réservées au testeur). Plan exécuté : `docs/superpowers/plans/2026-11-07-coffret-replay-implementation.md`. `GAME.md` décrit les limites et le protocole de QA réel à effectuer avant toute promesse de rendu ou de performances.

## Repères fixes — correctif local, en attente de revue

Demande précisée : plus clairs, **pas plus grands**. Seul le matériau des trois petits repères fixes change : jaune doré clair constant, indépendant des lumières et du tone mapping. Rayon0,045, hauteur0,06, trois segments, positions/rotation/échelle et buffers géométriques strictement identiques. Aucun halo, animation, lumière ou texture supplémentaire. Règles, sauvegardes, audio et glyphes intégrés inchangés.

92 tests Node passent. Le contraste calculé des couleurs source contre le graphite des interstices passe de5,79 à9,86; ce n’est pas une mesure des pixels rendus, ni un contraste garanti contre les bandes blanches. La lisibilité effective doit être revue dans le navigateur. Nouvelle entrée/import scène versionnés `ring-markers-v1`, dépendances inchangées conservant leurs URL canoniques.

QA de56e5ef8 rapportée par le coordinateur : reprise legacy2/3, dossierC3 résolu3/3 en session privée, recharge1/3 et3/3, lecture360×800. Ces essais ne valident pas encore ce nouveau matériau; aucun navigateur/image utilisé pour construire le correctif. Aucun push de cette passe avant revue indépendante.
