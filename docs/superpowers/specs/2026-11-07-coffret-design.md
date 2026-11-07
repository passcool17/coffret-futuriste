# Le Coffret — Noyau boréal

Date : 7 novembre 2026. Statut : design approuvé le 7 novembre 2026 à 11 h 09 (Toronto), construction locale autorisée.

## Mandat et limites

Un jeu autonome de navigateur, en français, sur un seul coffret futuriste 3D manipulable en gros plan, souris ou doigt, avec cible mobile Samsung S20. L’autorisation « go » valide la direction, pas encore les choix détaillés ci-dessous. Aucun jeu existant n’est modifié. Aucun dépôt, compte, déploiement ou code de jeu n’est créé à ce stade. Le brouillon desamorcage-diagnostic d’Arcade 2 reste entièrement séparé. Le nom local coffret-futuriste est réservé dans CLAIMS.md.

But : réveiller un noyau de lumière enfermé dans un coffret de maintenance polaire, sans bombe, arme, danger réaliste ni sanction. Difficulté de raisonnement visée : environ 12–14 ans et plus; la cible de durée est détaillée plus bas. Une seule configuration soigneusement conçue, rejouable par remise à zéro, pas de génération aléatoire.

## Références et approches comparées

Les extraits analysés de la première vidéo montrent mallette robuste, compte à rebours LED, tablette/manuels, interrupteurs protégés, indices codés et circuits à pinces. Ceux de la seconde montrent cylindre, câbles, schémas gravés, anneaux LED indépendants et alignement suivi de voyants tous validés et d’un journal de console. Ce sont des références de manipulation et de confirmation, pas une autorisation de reprendre marque, silhouette exacte, assets ou solutions.

1. **Coffret 3D fixe avec cadrages guidés (retenu)** : une vue d’ensemble orientable et trois vues de module. Manipulations lisibles, coût mobile borné; moins de liberté qu’un objet tournable dans toutes les directions.
2. Objet totalement libre à tourner : sensation de possession intéressante, mais indices cachés et conflits de gestes plus importants, davantage de faces à produire.
3. Panneau 2,5D illustré : solution la plus légère et accessible, mais ouvertures et profondeur moins convaincantes. Conservée seulement comme repli textuel interactif accessible, non comme second jeu.

## Difficulté et contrat de déduction

Révision demandée : raisonnement réel de niveau environ 12–14 ans et plus, **pas une classification d’âge**. Les anciennes associations explicites sont supprimées. Cible indicative : 20–35 minutes pour une première résolution sans aide, à vérifier avec des joueurs; la durée n’est pas une preuve de difficulté. Chaque mécanisme croise quatre contraintes indépendantes. Ni calcul fastidieux, ni code externe, ni essai exhaustif nécessaire. Les règles utilisent « avant », « voisin » et « opposé » définis sur l’objet.

## Parcours et solutions exactes — section de conception avec spoilers

Trois zones : alimentation à gauche, anneaux au centre, verrous à droite. Les modules précédents restent consultables; des boutons de rappel montrent leur état acquis, jamais une solution future. Chaque indice a une légende textuelle lisible en plus de sa gravure. Les indices sont répartis entre le dessous intérieur du capot et le bord du module, accessibles par les cadrages guidés, pas par recherche de pixels.

### 1 — Déduire le routage

Quatre câbles captifs sont identifiés soleil (S), vague (V), feuille (L), montagne (M). Quatre prises sont numérotées 1 à 4 de gauche à droite. Une prise accueille exactement une fiche. « Avant » signifie à gauche dans cette rangée; « voisins » signifie prises immédiatement adjacentes, sans bouclage 4–1. Aucun dessin ne donne directement un branchement.

Quatre contraintes gravées, réparties deux par surface :
- Le soleil précède la vague.
- Soleil et vague occupent des prises voisines.
- Le soleil précède la montagne.
- La vague et la feuille occupent des prises voisines.

**Solution unique : 1 soleil, 2 vague, 3 feuille, 4 montagne.** Raisonnement humain : soleil–vague forment un bloc orienté; la feuille doit suivre la vague car sa place à gauche est déjà prise par le soleil. Le bloc soleil–vague–feuille occupe donc 1–3 ou 2–4. Dans le second cas la montagne serait avant le soleil, interdit. Elle est donc en 4.

Placer les fiches puis lever l’interrupteur vérifie l’ensemble. En cas d’erreur : « Routage incompatible avec les contraintes », sans indiquer quelle fiche serait correcte ni révéler une règle supplémentaire. L’interrupteur redescend; rien n’est effacé. Les prises restent modifiables. Une prise occupée refuse l’insertion. Une validation correcte verrouille les connexions, allume quatre pistes numérotées et ouvre le cache central. La rangée résolue reste visible et constitue une clé pour les anneaux.

### 2 — Croiser les relations des anneaux

Trois anneaux indépendants à six crans; chacun présente sous un repère fixe supérieur l’un des symboles du cadran de référence. Cadran commun, ordre horaire : soleil (0), vague (1), feuille (2), montagne (3), lune (4), étoile (5). « Voisins sur le cadran » signifie crans séparés d’un pas, y compris étoile–soleil. « Opposés » signifie face à face, trois pas. Cette définition est illustrée par un schéma neutre de six points sans sélectionner de réponse. Les relations portent sur les symboles affichés aux repères, pas sur les positions physiques des anneaux de rayons différents.

Quatre contraintes, deux sur le cache relevé et deux sur le bord central :
- Le symbole extérieur est voisin du symbole alimenté par la prise 3.
- Le symbole du milieu est voisin du symbole extérieur.
- Le symbole intérieur est opposé à celui du milieu.
- Le symbole intérieur provient de l’une des deux prises d’extrémité : 1 ou 4.

État initial : trois étoiles. **Solution unique : extérieur vague (1), milieu soleil (0), intérieur montagne (3).** Raisonnement : prise 3 = feuille, donc extérieur = vague ou montagne. L’intérieur est soleil ou montagne (prises 1 et 4); son opposé au milieu doit donc être montagne ou soleil. Si l’extérieur était montagne, ses voisins feuille/lune ne conviendraient pas au milieu. L’extérieur est donc vague, le milieu soleil et l’intérieur montagne.

Le bouton Vérifier teste les trois ensemble. Échec global sans signaler les bons anneaux; aucune perte des positions. Réussite : verrouillage, trois lignes lumineuses depuis les repères vers le volet final, ouverture de celui-ci. Les symboles acquis restent visibles et nommés « extérieur / milieu / intérieur », y compris dans le rappel accessible.

### 3 — Déduire l’ordre de libération

Quatre languettes à ressort portent les mêmes quatre symboles. Une languette tirée jusqu’à sa butée s’inscrit dans une piste visible de quatre emplacements; le geste ne demande pas de maintien. Les symboles peuvent aussi être sélectionnés par clic ou clavier. Rien n’indique en cours de saisie si le préfixe est juste : les languettes ne servent pas d’oracle d’essais.

Quatre contraintes révélées sur le volet et le cadre de la poignée :
- Libérer le symbole de l’anneau extérieur avant celui du milieu.
- Libérer le symbole du milieu avant celui de l’intérieur.
- La feuille n’est ni la première ni la dernière.
- La feuille ne doit pas être voisine du symbole de l’anneau intérieur dans la séquence.

« Avant » n’impose pas une succession immédiate; « voisin » signifie deux emplacements consécutifs, sans bouclage. **Solution unique : vague, feuille, soleil, montagne.** Raisonnement : les anneaux imposent vague avant soleil avant montagne. La feuille se glisse au milieu, mais pas juste avant montagne; elle doit donc être entre vague et soleil. Les symboles sont consultables, aucun exercice de mémorisation imposé.

La poignée est active lorsque quatre symboles distincts sont inscrits. La tirer vérifie l’ordre entier : erreur → bruit mat, message « Séquence incompatible », poignée revient, sélection conservée. Boutons Annuler le dernier / Effacer la séquence; aucune mauvaise action ne détruit une étape acquise. Réussite → les quatre verrous se rétractent, couvercle à 65°, noyau déployé de quelques centimètres. Message « Noyau stabilisé », durée et Revoir / Recommencer. Pas de quatrième énigme cachée.

### Chaîne causale

Routage déduit → connexions figées et cache ouvert → positions des prises utilisées pour déduire les anneaux → symboles d’anneaux utilisés pour ordonner les languettes → vérification par poignée et ouverture réelle. Les indices d’une étape ne donnent pas la réponse de la suivante. Les étapes acquises restent acquises jusqu’à nouvelle partie.

### Indices gradués, exacts et facultatifs

Chaque demande avance d’un niveau pour le module courant; aucun indice automatique après un délai.
- Alimentation : (1) « Croise les deux contraintes qui citent la vague. » (2) « Soleil–vague–feuille forment un bloc; où reste la montagne ? » (3) Révéler 1 soleil, 2 vague, 3 feuille, 4 montagne.
- Anneaux : (1) « Relis les prises 1, 3 et 4, puis cherche les deux possibilités de l’intérieur. » (2) « Le milieu doit être soleil ou montagne. Lequel peut être voisin des deux candidats de l’extérieur ? » (3) Révéler extérieur vague, milieu soleil, intérieur montagne.
- Verrous : (1) « Remplace les noms des anneaux par leurs symboles. » (2) « Vague précède soleil, qui précède montagne. Dans quel intervalle placer la feuille sans toucher montagne ? » (3) Révéler vague, feuille, soleil, montagne.
Le troisième niveau propose ensuite Appliquer cette étape, avec confirmation et marque d’aide dans le bilan. Aucun indice n’est requis pour pouvoir manipuler.

### Validation combinatoire de conception

Script de vérification indépendant, hors projet : /workspace/coffret-design-validation/check.py. Ce n’est ni du code de jeu ni un scaffold. Énumération exécutée : alimentation 24 permutations → une solution SVLM; anneaux 216 triplets → une solution (1,0,3); libération 24 permutations → une solution VLSM. Retirer successivement chaque contrainte laisse respectivement : alimentation 2/4/2/3 solutions; anneaux 4/4/8/4; libération 2/2/2/2. Chaque indice est donc nécessaire au sein de son module. L’unicité et l’indépendance sont prouvées pour ces domaines; elles ne prouvent pas la difficulté vécue, qui exige observation de joueurs. Les déductions ci-dessus fournissent un chemin sans brute force.

## Manipulation et accessibilité

Vue d’ensemble : rotation limitée à ±35° horizontalement et 15–55° en élévation, jamais sous le coffret. Un glissement commencé sur le fond tourne la caméra; commencé sur une commande, il capture uniquement cette commande jusqu’au relâchement ou annulation. Seuil de glissement 8 pixels CSS; un tap sélectionne et rapproche un module. Un bouton permanent « Vue d’ensemble » et trois boutons de module évitent toute nécessité d’orbiter. Pas de pinch obligatoire; le zoom utilise deux boutons. Aucun geste ne désactive le zoom d’accessibilité de la page entière.

Fiche : glisser vers une prise, ou toucher la fiche puis la destination. Anneau : glisser tangentiellement avec aperçu du cran et validation au relâchement; alternative boutons −/+ par anneau. Languettes : déplacement contraint au rail ou boutons nommés par symbole; une activation inscrit le symbole dans la séquence. Poignée : tap/clic ou Entrée; aucun maintien ni geste précis requis. Relâcher hors cible une fiche la remet dans sa dernière prise valide ou son logement source; Échap/pointercancel annulent le geste. Le changement d’orientation ou la perte de focus annulent également tout geste non confirmé.

Chaque action existe aussi en commandes HTML nommées, utilisables au clavier et avec lecteur d’écran, pilotant le même état que la scène. Tab suit l’ordre alimentation → anneaux → verrous; flèches ajustent le contrôle actif, Entrée/Espace activent, Échap ferme la vue rapprochée puis rend le focus au bouton d’origine. Pas de piège clavier ni de commande cachée dans le canvas. Annonces textuelles des changements de module, connexions et réussite, pas de bavardage à chaque frame.

Cibles interactives : au moins 48 × 48 pixels CSS, espace de 8 pixels entre boutons; zones de prise élargies sans chevauchement. Texte de commande minimum 16 pixels, contraste de texte 4,5:1; traits, motifs et noms doublent les couleurs. Portrait et paysage supportés, panneau HTML sous la scène en portrait. Aucun indice situé exclusivement sur une tranche difficile à voir.

## Feedback, apparence et son

Objet compact à coins arrondis, coque graphite mate, aluminium brossé discret, gravures claires et lumière cyan/ambre contenue. Fond sombre neutre et socle immobile; lumière principale douce, remplissage fixe, ombres précalculées ou simulées. Pas de promesse photoréaliste. Les trois zones se distinguent par formes et numéros, pas uniquement par teintes. Une bande supérieure présente progression 1/3, 2/3, 3/3; une barre inférieure contient Vue, Indice, Son et Menu.

Chaque cran combine clic bref, déplacement perceptible et repère visuel; insertion : petit enclenchement + anneau de confirmation; blocage : bruit mat doux + texte explicatif; ouverture : glissement mécanique puis arrêt amorti. Audio synthétique original Web Audio, activé après la première interaction, volume réglable et muet mémorisé. Aucun retour matériel/vibration requis. Pas de secousse de caméra, flash stroboscopique ou son d’alarme obligatoire. Réduction des animations : transitions raccourcies à 100 ms, aucun tremblement ni pulsation continue; toutes les confirmations restent lisibles sans son.

## Aides, temps et maîtrise de la session

Bouton Indice : trois niveaux par module, affichés seulement à la demande : orienter l’attention; expliciter une déduction intermédiaire; révéler la solution exacte, selon les textes de chaque module ci-dessus. Dernier niveau propose « Appliquer cette étape » avec confirmation : réalise seulement le module courant et le marque aidé. Les actions restent possibles ensuite dans les étapes suivantes. Cela constitue l’issue de secours, sans risque de sauvegarde bloquée.

Mode par défaut tranquille : durée écoulée informative, masquable. Défi chrono facultatif choisi avant nouvelle partie, objectif 25 minutes; à zéro, proposer Continuer sans limite ou Recommencer, sans effacer ni verrouiller la partie. Le temps compte seulement lorsque la page est visible et active, pas pendant menus ni suspension. Aucun classement, compte ou réseau.

Sauvegarde locale versionnée après chaque action confirmée et chaque validation; jamais au milieu d’un geste ou d’une animation. Reprendre recharge connexions, positions, étapes, aide et temps actif; les animations s’installent directement à leur état final. Fermer/recharger ne crée pas de second déclenchement. Menu : Reprendre, Nouvelle partie (confirmation d’effacement de cette partie), Revenir au module, Son, Réduire les animations. Échap ne quitte pas le site. Si stockage indisponible : jeu en mémoire avec avertissement « Reprise indisponible sur cet appareil ». Sauvegarde corrompue/incompatible : explication et proposition de nouvelle partie, aucune boucle d’erreur. Le jeu ne lit ni n’efface les données d’autres projets; clé dédiée coffret-futuriste:v1.

## Choix technique borné, sans architecture excessive

Application statique, Three.js pour la scène 3D, HTML/CSS pour commandes et aide, Web Audio pour sons. Pas de backend, télémétrie, compte ni ressource externe indispensable à l’exécution. État de puzzle sérialisable séparé du rendu : commandes validées → nouvel état → sauvegarde + scène + annonce. Les règles vérifient les préconditions même si une commande est envoyée hors ordre. Les animations représentent l’état, elles ne décident jamais du déverrouillage. Les transitions répétées sont sans effet supplémentaire. Trois responsabilités simples : règles/état, présentation 3D/entrées, interface/sauvegarde/audio. Le détail des fichiers relève du plan futur.

Si WebGL échoue, proposer les mêmes commandes HTML avec description de l’objet, indices et progression; signaler que la vue 3D est indisponible, sans écran vide. Perte de contexte WebGL : conserver l’état, proposer relancer la vue ou poursuivre avec les commandes. Aucun mode plein écran imposé.

## Budget S20 et adaptation

Objectifs à vérifier, **aucune mesure physique S20 réalisée** : 30 fps stables au minimum sur S20, 60 fps visés sur bureau; commandes répondant en moins de 100 ms hors chargement; chargement jouable visé sous 5 s sur connexion 10 Mbit/s après accès au serveur. Budget transfert initial compressé ≤4 Mo, géométrie visible ≤100 000 triangles, ≤70 appels de dessin, textures ≤1024² et ≤32 Mo de mémoire textures estimée. Pas de post-traitement lourd, de physique générale, de lumières/ombres dynamiques multiples ni de reflets temps réel.

Qualité initiale mobile : ratio pixels plafonné à 1,5, pas d’ombre dynamique. Si médiane de frame dépasse 33 ms pendant 3 secondes de manipulation visible, descendre une fois à ratio 1 puis désactiver halos décoratifs. Pas de remontée automatique dans la session pour éviter l’oscillation. Respecter réduction de mouvement et économie d’effets; suspendre rendu et son lorsque l’onglet est caché. Au repos, rendu à la demande hors animation courte. Ces budgets ne constituent pas une garantie avant essai réel S20; si le minimum n’est pas atteint, le mode HTML reste jouable et le constat sera communiqué.

## Critères de réussite et vérification prévue

- Résoudre sans aide les trois modules dans l’ordre produit exactement le noyau ouvert; aucune combinaison incorrecte ne déverrouille le module suivant.
- Tous les indices précèdent leur besoin et toutes les solutions sont observables, sans essai aléatoire requis. Une personne non briefée sera invitée à expliquer les trois relations; observer les blocages plutôt que lui souffler les solutions.
- Toute action est possible souris, tactile simulé et clavier seul; annuler, relâcher hors zone, double-cliquer, tourner l’écran ou recharger ne bloque jamais une partie.
- Sauvegarder/reprendre chaque étape conserve l’état; nouvelle partie demande confirmation; mode chrono ne détruit jamais le progrès.
- Tests purs : les 24 permutations de câbles (une seule valide), les 216 positions d’anneaux (une seule valide), les 24 ordres complets de languettes (un seul valide), séquences partielles et toutes les préconditions de poignée, commandes répétées, normalisation de sauvegarde, temps actif/masqué et application des aides. Tests round-trip de sérialisation aux étapes, et données corrompues.
- Tests navigateur bureau automatisés : parcours complet clavier et pointeur, faux tactile en viewport 360 × 800 puis paysage, rechargement aux trois étapes et pendant une séquence partielle de languettes, stockage refusé, mode muet, réduction de mouvement, annulation de gestes et double activation. Vérifier absence d’erreurs console, texte accessible et cibles. Simulation mobile ≠ validation matérielle.
- Inspection bureau manuelle : cadrages, lecture des gravures, absence d’occlusion, câbles distincts, sons après geste autorisé, synchronisation ouverture/état. Captures avant/après de chaque module; profiler transfert, triangles, appels et frames dans les deux qualités.
- Test matériel S20 souhaité avant de prétendre au confort réel : 10 minutes portrait/paysage, échauffement, fluidité, lisibilité au doigt, reprise après suspension. Si indisponible, publier le bilan « bureau et émulation uniquement », sans prétendre l’avoir mesuré.

## Auto-relecture et prochaine porte

Relecture effectuée : trois modules, solutions déterministes et préconditions explicites et quatre contraintes indépendantes chacune, énumérées exhaustivement; les commandes alternatives ne contournent pas les règles; aucun échec irréversible; état final distinct des animations; chiffres de performance explicitement des cibles. Pas d’espace multijoueur, inventaire, seconde salle, narration extensive ou outil de désamorçage. Aucun placeholder de conception restant. Les anciens fléchages de solution, positions directement dictées et ordre I puis II ont été retirés. Aucun signal de justesse partielle ne permet de résoudre par collecte de confirmations. Les règles et aides ne reposent pas sur les couleurs.

Ce document est local, non commité et non publié, conformément à la portée limitée aux documents. Le choix et les règles demandent maintenant l’approbation de Pascal. Après approbation seulement : plan d’implémentation distinct, puis construction locale. Aucune autorisation de publication déduite de cette spécification.

## Suivi de construction locale
Autorisation reçue : « Oui, je valide les trois énigmes de déduction reliées et le design du coffret. Construis-le maintenant. » Plan créé dans ../plans/2026-11-07-coffret-implementation.md. Le mandat ci-dessus décrit la phase de conception initiale; README.md et GAME.md décrivent désormais l’implémentation et ses limites vérifiées/non vérifiées. Aucune publication autorisée ici.
