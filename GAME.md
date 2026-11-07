# État et QA locale — Le Coffret

## Livraison

Prototype vertical jouable à trois énigmes, construit localement après approbation du design. Ce n’est pas une certification de qualité visuelle ou de performance S20. Aucun autre jeu modifié. Publication du prototype autorisée ensuite, le 7 novembre 2026 à 11 h 19 (Toronto), sur le nouveau dépôt public passcool17/coffret-futuriste et GitHub Pages.

Fichiers : `src/model.js` règles et sauvegarde; `src/app.js` interface/session; `src/content.js` indices; `src/scene.js` scène et gestes; `src/audio.js` clics synthétiques; `style.css` présentation; `vendor/` Three.js et licence. Aucun build requis.

## Contrôles QA à faire en navigateur

- [ ] Ouvrir `http://localhost:8887/`; contrôler console réseau et rendu sans ressource externe.
- [ ] Capture ensemble, trois cadrages, chaque ouverture de cache, couvercle et noyau final. Vérifier échelles, lecture des glyphes et absence de chevauchements.
- [ ] Souris : sélection panneau, orbitage depuis le fond seulement, zoom, fiche déposée sur bonne/mauvaise cible, prise occupée, fiche débranchée par deuxième clic.
- [ ] Anneaux : drag dans les deux directions et passage du zéro, clic incrémental; vérifier symboles affichés au repère et texte du carnet concordants.
- [ ] Languettes : clic et glissement; ordre faux complet refusé sans signalement de préfixe; annulation et ressaisie possibles; poignée et ouverture finale.
- [ ] Clavier seul via commandes accessibles : Tab, Entrée, Espace, flèches d’anneaux; retour Échap, focus visible sans piège. Vérifier focus après désactivation du dernier contrôle utilisé.
- [ ] Tactile réel/émulé 360×800 et paysage : aucun conflit orbitage/manipulation ni double activation; les cibles HTML sont ≥48 px. Vérifier les cibles de meshes sur appareil et les agrandir si besoin.
- [ ] Annulation pendant geste : Échap, perte de focus, orientation, pointercancel; positions confirmées retrouvées.
- [ ] Recharge après chaque étape, après anneau modifié et après séquence partielle; état final rechargé sans rejouer la réussite.
- [ ] Stockage refusé et sauvegarde corrompue : message français, jeu encore utilisable. La clé est exclusivement `coffret-futuriste:v1`.
- [ ] Menu/onglet masqué/fenêtre inactive : temps arrêté; reprise sans saut. Défi dépassé : poursuivre sans limite conserve la partie.
- [ ] Son après premier geste : clics, refus et réussite; muet persistant, volume et réduction mouvement. Pas d’affirmation sonore avant cette écoute.
- [ ] WebGL indisponible/perdu : repli jouable via HTML, relance de la vue sans perdre l’état.
- [ ] Profil réel : triangle count, appels de dessin, textures, frametimes; cible 30 fps S20 / 60 fps bureau, pas résultat acquis. Rendre 10 minutes sur vrai S20 si disponible.

## Solutions réservées au testeur — divulgâchage

**Alimentation** : prises 1 Soleil, 2 Vague, 3 Feuille, 4 Montagne. Les fiches au repos ne sont pas rangées dans cet ordre, pour ne pas dévoiler visuellement la réponse. Lever l’interrupteur.

**Anneaux** : extérieur Vague, milieu Soleil, intérieur Montagne. Leurs états initiaux sont Étoile. Depuis Étoile, avancer respectivement de 2, 1 et 4 crans avec les boutons +, puis vérifier. Correspondance interne : Soleil 0, Vague 1, Feuille 2, Montagne 3, Lune 4, Étoile 5.

**Libération** : Vague → Feuille → Soleil → Montagne, puis soulever la poignée. Mauvais ordre témoin : Soleil → Vague → Feuille → Montagne; ne doit rien ouvrir.

Les raisonnements humains et les contraintes indépendantes sont détaillés dans `docs/superpowers/specs/2026-11-07-coffret-design.md`. Le test de chaque domaine doit n’accepter qu’une solution. Le bouton Appliquer n’est accessible qu’après les trois niveaux d’indice du module courant.

## Limites à traiter selon la QA

Pas de navigateur lancé par le constructeur. Le coordinateur a ensuite rapporté une résolution des trois étapes sur le site public et la reprise à 2/3; audio, tactile/mobile, cadrage détaillé et performances restent à vérifier. Les sources ne constituent pas une preuve visuelle. La scène utilise un plafonnement de ratio pixels et une réduction de qualité; son seuil doit être vérifié au profiler. Le nombre d’objets/étiquettes peut nécessiter une optimisation des appels de dessin. Le noyau n’a pas de pulsation continue, afin de garder le rendu à la demande au repos. Pas de génération aléatoire ni d’autre coffret.

## Corrections de revue — 7 novembre 2026, 11 h 17 et suivantes (Toronto)

Deux défauts reproduits avant correction dans des tests Node, sans lancer de navigateur :
- Après deux relances, un clic d’anneau déclenchait trois actions. Les listeners de la scène sont désormais enregistrés dans un registre et tous retirés au dispose, sur canvas/window/document. Dispose est idempotent; capture, RAF, observer, géométries, matériaux, textures et renderer sont libérés. Une scène perdue ou détruite ne traite plus d’entrée. Les relances asynchrones concurrentes ne construisent que la dernière scène demandée.
- Une languette désactivée laissait le focus sur le body; les boutons de vérification sans ID perdaient aussi le focus. Toutes les commandes reconstruites ont un ID stable. Le focus reste sur le contrôle actif s’il demeure disponible; sinon passe à la prochaine languette disponible (avec bouclage), à la poignée après la quatrième, puis à un contrôle/navigation disponible. Le déverrouillage transfère explicitement le focus clavier vers le nouveau module. Les rafraîchissements ne capturent pas le focus extérieur.

31 tests passent, dont les nouvelles reproductions cycle de vie et focus. Le harness de cycle de vie utilise la géométrie Three.js réelle, un renderer factice et des EventTarget Node; celui du focus utilise un DOM minimal simulé. Ils ne prouvent pas le fonctionnement visuel dans Chrome ni un lecteur d’écran réel.

État historique avant QA publique — QA locale bloquée : le coordinateur signale localhost inaccessible depuis le navigateur malgré HTTP 200 via curl. Aucun contournement par automatisation navigateur tenté. Rendu, son et S20 restent non validés. Ajouter à la QA réelle : relancer la vue deux fois puis cliquer un anneau (un seul cran), et résoudre la séquence au clavier sans perdre le focus.

## Publication du prototype

Jeu : https://passcool17.github.io/coffret-futuriste/
Sources : https://github.com/passcool17/coffret-futuriste
Déploiement statique GitHub Pages depuis `main:/`, sans dépendance CDN runtime. `.nojekyll` conserve les fichiers tels quels. La vérification de livraison compare les SHA-256 locaux et les réponses publiques pour l’entrée, le CSS et tous les modules, y compris les deux fichiers Three.js. Cette vérification réseau ne valide ni le rendu ni l’audio. QA publique bureau rapportée ensuite par le coordinateur; S20, audio et tactile restent non testés. La checklist exhaustive reste ouverte.

## QA publique et correctifs — 7 novembre 2026, après 11 h 28 (Toronto)

Observations rapportées par le coordinateur : trois mécanismes résolus dans le navigateur bureau public, mauvaises solutions rejetées, reprise de progression à 2/3 fonctionnelle. Ceci ne valide pas le son, les interactions tactiles/mobile ou le S20; aucun nouvel essai navigateur exécuté par ce constructeur.

Deux messages corrigés après reproduction Node rouge→vert : refus d’une prise occupée affiché aussi sous le menu concerné (pas d’échange de fiches), et message de reprise dérivé de l’étape acquise/partielle à l’initialisation seulement. Les messages d’action ne sont pas remplacés par les redraws.

Investigation du 404 : les URL publiques `/favicon.ico` et `/coffret-futuriste/favicon.ico` renvoyaient effectivement 404 et l’entrée n’avait aucun `rel=icon`. Une icône SVG locale explicitement référencée élimine cette ressource implicite manquante. L’URL du 404 de console n’étant pas fournie, son identité reste non démontrée : ne pas prétendre avoir supprimé tous les 404. Les fichiers runtime publiés sont revérifiés par hash après déploiement.

35 tests Node passent, avec quatre régressions supplémentaires : messages de reprise de chaque étape, initialisation sans écrasement des messages d’action, refus inline sans échange de fiches, lien favicon local existant. Syntaxe des modules et diff-check propres.

### Complément QA publique 360 × 800 et correction de recouvrement
Le coordinateur a obtenu une vue DevTools responsive 360 × 800 (émulation, pas un téléphone physique) : branchement direct Soleil → prise 1 observé; mute et volume persistent après recharge. Une icône de haut-parleur apparaît brièvement dans l’onglet, mais aucune écoute n’a établi que le son est audible. Le favicon.ico a été confirmé comme l’URL en 404; les requêtes du jeu étaient 200/304. L’icône locale explicite corrige donc cette cause identifiée.

Capture de QA fournie : les légendes et boutons de zoom recouvraient les étiquettes/câbles en gros plan. Correction structurelle : légende ET boutons restent visibles mais occupent une barre dédiée dans le flux, en dehors du viewport/canvas 3D. Même séparation sur bureau pour éviter une seconde logique de placement. Aucune énigme ou caméra modifiée. Le retest visuel après cette correction reste à faire par le coordinateur.

36 tests Node passent, dont la régression de séparation des outils et de la zone interactive. Son audible, gestes tactiles réels, fluidité mobile et S20 toujours non validés.
