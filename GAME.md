# État et QA locale — Le Coffret

## Livraison

Prototype vertical jouable à trois énigmes, construit localement après approbation du design. Ce n’est pas une certification de qualité visuelle ou de performance S20. Aucun autre jeu modifié. Publication du prototype autorisée ensuite, le 7 novembre 2026 à 11 h 19 (Toronto), sur le nouveau dépôt public passcool17/coffret-futuriste et GitHub Pages.

Fichiers : `src/model.js` règles et sauvegarde; `src/app.js` interface/session; `src/content.js` indices; `src/scene.js` scène et gestes; `src/ring-graphics.js` face des anneaux et pictogrammes vectoriels; `src/audio.js` clics synthétiques; `style.css` présentation; `vendor/` Three.js et licence. Aucun build requis.

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

## Passe audio — historique de construction avant revue indépendante

Design et construction autorisés par Pascal via sa réponse à la carte t126s858. Implémentation locale uniquement, push retenu pour revue. Version publique inchangée : 8bf3225. Aucun autre jeu ou compte modifié. Les notes de QA plus anciennes ci-dessus décrivent les versions et observations à leur date. Mise à jour : correctif de recouvrement retesté avec succès à 360 × 800 et favicon 200, selon le coordinateur; Pascal a confirmé le clic entendu et le toucher direct sur S20 à 11 h 36 (Toronto). Cela ne valide pas cette nouvelle musique ni un profilage S20.

Changements locaux : `audio-events.js` isole un contrat sans symboles/solutions; `audio.js` conserve un seul contexte paresseux, bus Musique/Effets/master, limiteur, voix et scheduler bornés. Nappe originale huit mesures à 72 bpm sans percussion, timbres mécaniques distincts, ouverture/cadence uniquement après progression acquise. Réglages général/Musique/Effets persistants. Sauvegarde v1 conservée et migrée sans perdre fiches, anneaux, séquence, chrono ou mute.

Pause : timer musique arrêté, voix futures annulées, sortie amortie sur 15 ms et suspension à 25 ms. Reprise depuis geste seulement, pas de son joué en rafale après retour. Fermeture définitive dispose le contexte; pagehide avec bfcache le suspend sans rendre le retour inutilisable. Allocations échouées et promesses resume rejetées sont capturées avec message français une fois; une autre commande peut réessayer.

Les limites conservatrices abandonnent les requêtes excédentaires plutôt que dépasser trois voix musicales ou huit effets, ni produire une queue différée. Le final est prioritaire sur le filtre anti-rebond. Tout cela est testé avec doubles, pas mesuré sur hardware.

### Checklist d’écoute de cette nouvelle passe
- [ ] Premier geste déclenche musique douce; aucun autoplay au chargement. Test avec une ancienne sauvegarde à 2/3, mute activé et désactivé.
- [ ] Écouter au casque puis haut-parleur/mono : musique en retrait, effets identifiables, aucune agressivité ni saturation audible. Volume faible d’abord.
- [ ] Vérifier réglages indépendants général/Musique/Effets et mute après recharge; deux bus à zéro ne consomment pas un scheduler actif.
- [ ] Comparer sons de crans/fiches corrects ou incorrects avant validation : aucune différence indiquant la solution.
- [ ] Menu/pause/onglet caché/app en arrière-plan : extinction sans bruit parasite, reprise sans rafale au prochain geste; vérifier Safari/Chrome si disponibles.
- [ ] Entrées très rapides, dernière languette puis poignée : cadence finale toujours présente; recharger fini ne la rejoue pas.
- [ ] Lire/agir pendant 10 minutes sur bureau puis S20 : pas de fatigue, fluidité/échauffement comparés musique active et muette. Aucun résultat matériel promis.

Aucun navigateur ni service externe utilisé pour la construction audio. Pas de renderer Web Audio offline préinstallé; l’échantillon optionnel est donc omis sans ajouter de bibliothèque. Les métriques de voix/temps obtenues dans les tests ne prouvent pas une qualité audible.

Bilan de construction audio : 60 tests passent (36 de base et 24 ajouts). Une dernière régression vérifie qu’un démarrage musical partiellement échoué amortit aussi les voix déjà démarrées. Syntaxe et diff-check propres. À ce stade historique, revue indépendante requise avant push et nouveau mix non écouté. Depuis : revue effectuée et version 9027626 publiée; Pascal a indiqué à 12 h 02 (Toronto) que la musique convenait, selon le coordinateur. Pas de mesure matérielle ni d’écoute par le constructeur.

## Correction ciblée des anneaux — 7 novembre 2026 (Toronto), locale non publiée

Demande t131u et précision t132u : énigme centrale difficile à interpréter, symboles ressemblant à des autocollants non collés. La QA publique reçue prouve un seul pas Étoile→Soleil extérieur concordant avec le texte; elle ne prouve pas les 18 correspondances. Les captures montrent les plaques sombres détachées. Les précédentes résolutions par comptage de clics ne validaient pas la lecture des glyphes 3D.

**Diagnostic démontré avant correction (tests rouges)** : le placement des centres au repère était juste; l’orientation locale `+index·π/3` s’ajoutait à la rotation du groupe au lieu de la compenser. Vague/Feuille/Lune/Étoile arrivaient à 120° ou 240°, contre 0° attendu. Les rectangles étaient à z=0,64 alors que le point le plus haut du tore était à z=0,61; leur largeur radiale de 0,27 dépassait aussi la bande de 0,26. Ce défaut géométrique est distinct de la logique : les 216 configurations donnent toujours la seule solution décrite plus haut.

**Correction** : bande annulaire extrudée, face plane métallique avec tracés intégrés à sa propre texture de matériau; plus aucun mesh rectangulaire de symbole sur les anneaux. Tracés originaux sans police, centrés dans la largeur utile, contre-rotation correcte et trois petits repères fixes dans les interstices. Même famille vectorielle sur fiches/languettes. Le centre du geste circulaire est projeté depuis le centre réel de la face, pas une position mondiale approximative. Aucune solution, règle, difficulté, progression, sauvegarde ou musique changée. Pas de mise en évidence de la bonne réponse.

**Preuves locales** : deux reproductions rouges puis vertes (orientation et support physique), 65/66 tests, syntaxe et diff-check. Tests CPU de tous les symboles sur les trois anneaux, UV de face normalisés, absence des plaques, trois repères, motifs vectoriels distincts, deux sens et tours complets/passage du zéro, solution unique inchangée. Le renderer et Canvas2D restent simulés : aucune affirmation de validation visuelle ou de fluidité physique.

**Revue et QA navigateur à effectuer avant push** :
- [ ] Gros plan bureau et 360 × 800 : face/support continus, aucun rectangle, trou ni scintillement; symboles lisibles et non étirés. Les petits triangles sont dans les interstices, sans masquer les symboles.
- [ ] Pour chaque anneau, parcourir six clics : Étoile→Soleil→Vague→Feuille→Montagne→Lune→Étoile. À chaque cran, pictogramme au triangle et nom du carnet correspondent; pictogramme du haut droit, soleil distinct d’étoile, feuille identifiable. Photographier au moins Vague et Feuille (anciens angles erronés).
- [ ] Glisser dans les deux sens, traverser le zéro et annuler un geste; un seul cran/action confirmé, fond seul pour orbiter. Vérifier sur appareil si possible, sans prétendre à un profilage S20.
- [ ] Refuser une combinaison erronée, accepter extérieur Vague / milieu Soleil / intérieur Montagne, puis poursuivre la troisième énigme. Vérifier aussi clavier et boutons accessibles.
- [ ] Recharger une sauvegarde existante à 2/3 puis une sauvegarde avec anneaux partiellement réglés : état et symbole conservés. Relancer deux fois la 3D et répéter un clic (pas de double événement).
- [ ] Vérifier musique/volumes/mute inchangés, uniquement comme non-régression. Aucun nouvel essai auditif du constructeur.

Push volontairement retenu pour revue indépendante et coordination de la QA réelle. Le brouillon de conception générale non approuvé reste hors de ce correctif.

## Livraison cache — investigation et correction locale, 7 novembre 2026 (Toronto)

La dernière QA publique annoncée sur 26758d5 a résolu le centre par contrôles accessibles et rechargé la troisième étape. Toutefois la capture montre les anciens tores/plaques et l’ancienne phrase « sous le repère du haut » : cette session exécutait des modules antérieurs. Cette résolution n’est PAS une validation des nouvelles faces intégrées. Les requêtes HTTP ordinaires et avec paramètre neuf ont livré les nouveaux fichiers, avec `Cache-Control: max-age=600`; aucune réponse CDN ancienne reproduite depuis Shell. Cache HTTP navigateur ou modules conservés par le document : distinction non établie sans son réseau. Aucun service worker.

Manifeste d’investigation externe au jeu : `/workspace/coffret-cache-audit-26758d5.json`. Treize ressources runtime parcourues récursivement, toutes 200 et identiques. Le manifeste audio précédent comptait douze ressources runtime plus LICENSE et .nojekyll (14); avec ring-graphics, le total comparable est maintenant 15. Il ne manquait pas de module.

Correctif minimal local : HTML→app.js?v=rings-26758d5; app→content/scene versionnés; scene→content/ring-graphics avec la même version. Modèle, audio, Three.js et autres dépendances inchangés gardent leurs URL canoniques, sans duplication des singletons. Même origine, même clé de sauvegarde, aucun changement de règles ni d’audio. Pas de Date.now ou d’invalidation du stockage. Il faut que le navigateur obtienne le nouvel HTML; le délai de cache HTML Pages éventuel reste distinct.

Régression rouge sur l’entrée non versionnée, puis verte : le graphe simulé à partir du vrai HTML et des vrais imports statiques/dynamiques atteint chacun des quatre modules modifiés uniquement par URL versionnée, et conserve une seule URL pour modèle/audio/événements/focus. 67 tests, syntaxe et diff-check. Push retenu pour revue.

QA après publication autorisée :
- [ ] Rechargement normal sans vider le stockage : progression conservée; nouvelle phrase « repères fixes du haut, un par anneau » visible.
- [ ] Nouvelle géométrie : bandes plates pleines, sans plaques sombres indépendantes; trois triangles fixes. Vérifier les 18 positions et leur concordance au carnet.
- [ ] Avant résolution (étape1), cadrer Anneaux d’abord, puis cliquer une bande : un cran. En Ensemble, le premier clic ne fait que cadrer; après résolution les anneaux sont verrouillés, volontairement.
- [ ] Souris/toucher, clavier, rechargement à progression conservée et son inchangé. Ne pas considérer les tests CPU comme preuve visuelle.

## Rejouabilité — construction locale approuvée, push retenu

Concept approuvé t135s903, cahier exact approuvé t135s908. Douze dossiers A1..C4, trois familles; les données et réponses réservées au testeur figurent dans la spec replay, pas ici dans la checklist non spoiler. Version publique toujours 7e637f0; aucune publication de cette passe. Les paragraphes « publication retenue » précédents sont des états historiques, pas une affirmation que les correctifs 26758d5/7e637f0 n’ont pas été publiés.

Nouveaux modules : puzzles.js banque immuable/prédicats/solutions uniques memoïsées; selector.js sac déterministe; session-storage.js frontière d’écriture protectrice. model.js est configuré; content.js formate les mêmes contraintes pour carnet, hints et plaques. Les deux plaques de scene.js sont redessinées lors du changement de dossier seulement, sans réallouer leurs textures. Ordre physique, UV et tracés des anneaux inchangés; seul l’import modèle de ring-graphics.js est versionné. Audio et contrat audio-events inchangés, aucune indication de justesse partielle ajoutée.

Sauvegarde : même clé locale, schéma v2 et dossier explicite. Restore v1 valide conserve valeurs de progression, indices/aides, chrono/défi et préférences normalisées historiques, config legacy, aucun tirage. Les versions inconnues/dossiers invalides ne deviennent pas une autre énigme en silence. Raw original gardé dans l’objet de session; sur disque il reste intact tant qu’aucun remplacement/écriture valide n’a réussi. Ce n’est PAS une copie de secours persistante secondaire. Erreur de lecture/corruption : jeu inerte, timer/actions sans écriture, commandes de récupération hors zone inerte. Erreur quota : progression mémoire maintenue, aucune nouvelle tentative automatique répétée; lecture explicite de l’ancien état demande confirmation. Choix mémoire seul ne remplace jamais le raw ancien.

Reproductions rouges→vertes : modules banque/sélecteur absents; absence de création configurable et migration v2; save non protégé; contenus/plaques fixes; flux app qui écrivait quatre fois sur raw corrompu; graphe de version incomplet. Deux défauts trouvés en intégration ont leur régression propre : requête asynchrone 3D encore constructible après blocage de reprise, et focus conservé dans un bouton de récupération désormais masqué. Les gardes annulent ce démarrage périmé et déplacent le focus au cadrage pertinent.

### Preuves exécutées localement

90/90 tests Node passent, syntaxe de src/tests/helpers et diff-check propres. Aucun test historique de comportement retiré; harness adaptés aux imports/config et à l’état de session active.
- Les douze dossiers : une seule réponse dans24/216/24 via prédicats de production ET via validateurs du modèle, quatre contraintes essentielles par étage. Douze réponses différentes par étage, également différentes des réponses legacy.
- Chaque dossier résolu jusqu’au bout par transition et par la vraie app sous doubles DOM/audio/scène, avec recharge après chaque étage; mauvais candidats tous rejetés par les validateurs. Hints/Appliquer suivent les mêmes solutions.
- Seed1/0x6d2b79f5/0xffffffff et1000 graines : deux sacs sans répétition, frontière différente, régénération stable; vecteur Fisher–Yates de référence indépendant. Restore ne fait pas avancer le sac.
- Migration v1 aux quatre étapes et états partiels; validation config/selector/corruption; raw invalide conservé malgré ticks et actions; quota et mémoire seule; annulation de Nouvelle partie sans effet.
- Douze jeux de textes et aides, deux vraies textures Canvas inspectées avec géométrie Three réelle/renderer factice, mêmes textures réutilisées; les18 correspondances de symboles restent couvertes. Aucune preuve visuelle tirée de Canvas factice.
- Graphe résolu depuis HTML : replay-bank-v1 sur tous modules modifiés, y compris modèle via atlas; une seule URL par module partagé, audio unique. CSS versionné. Pas de service worker, Date.now de cache ni ressource nouvelle externe. Le cache de l’HTML Pages reste distinct.

### QA réelle à coordonner — sans réponses révélées

Utiliser une session de test distincte de la partie physique du propriétaire; ne pas effacer sa sauvegarde pour tester.
- [ ] Reprendre une copie de partie v1 à1/3 puis2/3 : même position/temps/hints/volumes et « Partie d’origine conservée ». Ne sélectionner Nouvelle partie qu’après cette vérification.
- [ ] Confirmer Nouvelle partie : ID visible, indices/plaques accordés; recharger immédiatement puis après chaque mécanisme, ID et progression identiques.
- [ ] Jouer au moins un dossier de chacune des trois familles. Vérifier les douze jeux d’inscriptions à360×800, sans texte tronqué ni ancien indice gravé restant. Les solutions restent dans la spec testeur si nécessaire, pas dans ce protocole.
- [ ] En session de test, douze nouvelles parties confirmées : douze IDs différents, puis treizième différente de la douzième; annuler une confirmation ne change rien. Ne pas confondre diversité des noms/références et nouveaux mécanismes physiques.
- [ ] Souris et toucher direct sur anneaux après cadrage, clavier accessible et focus après progression/récupération; aucun changement des repères/glyphes. Contrôler spécifiquement le soleil/étoile et les18 états si rendu douteux.
- [ ] Stockage illisible/refusé/quota via environnement de test : avertissement lisible hors zone inerte; Réessayer/New/Memory utilisables au clavier; aucune ancienne partie remplacée sans confirmation.
- [ ] Musique et réglages inchangés, pause/reprise sans rafale; test de non-régression seulement. Aucun nouveau son produit par cette passe.
- [ ] Après publication ultérieurement autorisée : run Pages exact, graphe HTTP exhaustif des URL réellement versionnées et hashes. Un rechargement normal doit récupérer le nouvel HTML; une query sur la page seule ne versionne pas ses imports.

Limites : pas de navigateur utilisé par le constructeur; doubles Node non équivalents à un navigateur réel, un lecteur d’écran ou un S20. Aucun chiffre de fluidité, profil thermique, niveau humain12–14+ ou nouvelle écoute revendiqué. Revue indépendante puis QA coordonnée requises, sans push automatique de cette branche locale.
