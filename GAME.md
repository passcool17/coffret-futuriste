# État et QA locale — Le Coffret

## Livraison

Prototype vertical jouable à trois énigmes, construit localement après approbation du design. Ce n’est pas une certification de qualité visuelle ou de performance S20. Aucun autre jeu modifié, aucun dépôt distant créé, aucun push/déploiement.

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

Pas de navigateur lancé par le constructeur : gestes, cadrage, son et performances restent à observer. Les sources ne constituent pas une preuve visuelle. La scène utilise un plafonnement de ratio pixels et une réduction de qualité; son seuil doit être vérifié au profiler. Le nombre d’objets/étiquettes peut nécessiter une optimisation des appels de dessin. Le noyau n’a pas de pulsation continue, afin de garder le rendu à la demande au repos. Pas de génération aléatoire ni d’autre coffret.

## Corrections de revue — 7 novembre 2026, 11 h 17 et suivantes (Toronto)

Deux défauts reproduits avant correction dans des tests Node, sans lancer de navigateur :
- Après deux relances, un clic d’anneau déclenchait trois actions. Les listeners de la scène sont désormais enregistrés dans un registre et tous retirés au dispose, sur canvas/window/document. Dispose est idempotent; capture, RAF, observer, géométries, matériaux, textures et renderer sont libérés. Une scène perdue ou détruite ne traite plus d’entrée. Les relances asynchrones concurrentes ne construisent que la dernière scène demandée.
- Une languette désactivée laissait le focus sur le body; les boutons de vérification sans ID perdaient aussi le focus. Toutes les commandes reconstruites ont un ID stable. Le focus reste sur le contrôle actif s’il demeure disponible; sinon passe à la prochaine languette disponible (avec bouclage), à la poignée après la quatrième, puis à un contrôle/navigation disponible. Le déverrouillage transfère explicitement le focus clavier vers le nouveau module. Les rafraîchissements ne capturent pas le focus extérieur.

31 tests passent, dont les nouvelles reproductions cycle de vie et focus. Le harness de cycle de vie utilise la géométrie Three.js réelle, un renderer factice et des EventTarget Node; celui du focus utilise un DOM minimal simulé. Ils ne prouvent pas le fonctionnement visuel dans Chrome ni un lecteur d’écran réel.

QA navigateur toujours bloquée : le coordinateur signale localhost inaccessible depuis le navigateur malgré HTTP 200 via curl. Aucun contournement par automatisation navigateur tenté. Rendu, son et S20 restent non validés. Ajouter à la QA réelle : relancer la vue deux fois puis cliquer un anneau (un seul cran), et résoudre la séquence au clavier sans perdre le focus.
