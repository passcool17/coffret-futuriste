# Coffret — douze dossiers rejouables, spécification finale proposée

Date : 7 novembre 2026 (Toronto). Concept approuvé par Pascal dans sa réponse à t135s903 : « Oui, ajoute les 12 configurations variées au Coffret en conservant ma partie actuelle. » Cette spécification complète doit encore être présentée pour dernière revue propriétaire. DOCUMENT UNIQUEMENT : aucune construction, aucun plan d’implémentation ni push dans cette étape.

Base examinée : HEAD 7e637f0, propriété confirmée dans CLAIMS.md. Un seul projet : coffret-futuriste; ni projet vidéo 1 ni brouillon polish.

## Résumé

Nouvelle partie choisit un autre dossier parmi douze, sans répétition avant épuisement. Indices et solutions changent pour les trois mécanismes; la partie en cours ne change jamais au rechargement. Trois familles proposent des raisonnements différents, quatre dossiers par famille. C’est une variété finie, pas douze architectures entièrement différentes ni un générateur infini. Les formes 3D, cadran, symboles, gestes accessibles, musique et effets restent inchangés.

La banque exacte ci-dessous a été énumérée hors dépôt pendant la conception : une solution sur 24 routages, 216 triplets et 24 séquences pour chaque dossier. Les douze réponses de chaque étage sont distinctes entre dossiers, et différentes de legacy-v1. Les quatre contraintes de chaque étage sont essentielles (sans chacune, au moins deux solutions). Cela prouve cohérence et non-redondance, pas une difficulté mesurée auprès d’adolescents ni une QA visuelle.

## 1. Choix de conception et vocabulaire fermé

Alternatives examinées : permutations seules (peu coûteuses mais mêmes raisonnements), génération libre à l’exécution (plus de risques de difficulté/contradictions), banque préparée et vérifiée (retenue). Aucun solveur dans la boucle de rendu; pas de service, compte, asset externe ou nouvel étage.

Les quatre fiches et languettes restent Soleil S, Vague V, Feuille L, Montagne M. Les six symboles des anneaux restent, dans l’ordre horaire : S,V,L,M,N,E (Lune N, Étoile E). Indices numériques 0..5 inchangés. Initialisation des trois anneaux : Étoile, soit [5,5,5]. Pas de permutation secrète du cadran ou de la position des fiches selon la solution.

Relations linéaires (prises/séquence) :
- « précède » : indice strictement inférieur, sans exiger le contact;
- « voisins » : différence absolue 1, sans bouclage entre positions 4 et 1;
- « ne sont pas voisins » : différence absolue différente de 1;
- « X est entre Y et Z » : position de X strictement comprise entre celles de Y et Z, sans exiger trois positions consécutives ni imposer lequel des deux est à gauche;
- « ni premier ni dernier » : position 2 ou 3.

Relations des anneaux : voisins = un pas dans le cadran cyclique à six symboles; opposés = trois pas; « W suit immédiatement V sur le cadran horaire » = index(W)=(index(V)+1) modulo 6. Cette dernière relation ne dit PAS de tourner un anneau une fois : elle concerne les symboles lus aux repères fixes. Le cadran imprimé/affiché reste observable dans les définitions. La variante n’est jamais indiquée par un son de justesse.

## 2. Trois familles et règles exactes

### Alimentation

A,B,C,D désignent les quatre symboles de la colonne P de la table, dans cet ordre. Ce sont des paramètres de conception, jamais les noms des prises visibles.

- Famille A, « bloc et ordre » : A précède B; A précède D; A voisin de B; B voisin de C. Solution ABCD : les trois symboles A–B–C forment un bloc orienté; sa position 2–4 placerait D avant A, donc bloc en 1–3.
- Famille B, « bloc et intervalle » : A précède B; A voisin de B; A non voisin de C; C entre B et D. Solution ABCD : examiner les trois emplacements possibles du bloc AB. En 2–3, Entre est impossible; en 3–4, C doit être 2 et touche A. Il reste AB en 1–2, C3,D4.
- Famille C, « deux précédences et intervalle » : A précède B; A précède C; A non voisin de D; C entre B et D. Solution ABCD : A est 1 ou 2; A2 force D1 adjacent, donc A1. D3 ne permet pas Entre, donc D4, C3,B2.

### Anneaux

O=extérieur, T=milieu, I=intérieur. U,V,W sont trois rôles distincts qui se substituent à O/T/I selon la colonne rôles; ils ne sont pas des symboles. Pj désigne le symbole réellement alimenté par la prise j, acquis après alimentation. Les paramètres j et paire k/l sont dans la table.

Quatre contraintes, dans cet ordre :
- A : U voisin de Pj; V voisin de U; W opposé à V; W vient de Pk ou Pl.
- B : U voisin de Pj; V voisin de U; W suit immédiatement V sur le cadran horaire; W vient de Pk ou Pl.
- C : U voisin de Pj; V opposé à U; W voisin de V; W vient de Pk ou Pl.

Raisonnement humain : U a deux candidats, voisins de Pj. En A/B, chacun donne deux V; W se déduit exactement de V (opposé/suivant horaire). En C, chaque U donne exactement V, puis deux W. Il reste quatre triplets hypothétiques; la paire des prises conserve un seul triplet. Ce sont des déductions sur les indices visibles, pas une obligation d’essayer des positions dans le jeu. La table des témoins en fin de document donne les quatre branches de chaque dossier.

### Libération

O,T,I désignent cette fois les symboles réellement acquis aux trois repères. F est le seul des quatre symboles actifs absent de ces trois repères; les dossiers garantissent trois repères distincts et actifs. Définition affichée : « Le symbole restant est celui des quatre languettes qui n’apparaît à aucun des trois repères acquis. » Les contraintes doivent parler de ces références, pas annoncer directement l’ordre de la solution.

- A : O précède T; T précède I; F ni premier ni dernier; F non voisin de I. Solution O,F,T,I. La chaîne O<T<I laisse deux places intérieures pour F; celle adjacente à I est exclue.
- B : I précède O; I voisin de O; I non voisin de F; F entre O et T. Solution I,O,F,T. Même raisonnement de bloc/intervalle que l’alimentation B, mais références dérivées des anneaux, non constantes.
- C : T précède F; T précède I; T non voisin de O; I entre F et O. Solution T,F,I,O. Même élimination que l’alimentation C avec les rôles dérivés.

Les différences structurelles entre familles sont explicites : A n’utilise pas Entre, B combine bloc orienté et Entre, C ne possède aucun lien de voisinage positif dans ses contraintes linéaires. Dans chaque famille quatre dossiers changent les symboles, références de prises et/ou rôles d’anneaux; ces quatre instances ne sont pas annoncées comme quatre nouvelles structures.

## 3. Banque immuable replay-bank-v1 — réservée à la conception/testeur

P : solutions prises 1→4. R : solutions extérieur/milieu/intérieur. Q : solution des languettes. Les colonnes de paramètres définissent les contraintes, pas une autre source de règles. Les réponses ci-dessous sont des assertions de test; le jeu valide les contraintes et déduit la réponse unique pour l’aide, sans comparateur divergent codé en dur.

| ID | P | rôles U,V,W | j | k/l | R (O,T,I) | Q |
|---|---|---|---:|---|---|---|
| A1 | L,M,V,S | O,T,I | 3 | 2/4 | L,M,S | L,V,M,S |
| A2 | L,V,M,S | T,O,I | 2 | 3/4 | M,L,S | M,V,L,S |
| A3 | M,V,L,S | I,T,O | 2 | 1/4 | S,M,L | S,V,M,L |
| A4 | S,L,M,V | T,I,O | 2 | 1/3 | M,V,S | M,L,V,S |
| B1 | V,M,L,S | O,I,T | 4 | 2/3 | V,M,L | L,V,S,M |
| B2 | S,V,M,L | I,T,O | 1 | 3/4 | M,L,V | V,M,S,L |
| B3 | S,M,L,V | O,T,I | 1 | 2/3 | V,L,M | M,V,S,L |
| B4 | V,L,M,S | T,I,O | 4 | 2/3 | M,V,L | L,M,S,V |
| C1 | M,V,S,L | T,O,I | 2 | 1/4 | M,S,L | S,V,L,M |
| C2 | L,S,M,V | T,I,O | 1 | 2/4 | V,M,S | M,L,S,V |
| C3 | M,S,V,L | O,T,I | 4 | 2/3 | M,S,V | S,L,V,M |
| C4 | L,V,S,M | I,O,T | 1 | 2/3 | S,V,M | V,L,M,S |

Chaque dossier utilise sa famille, sa ligne et les règles de la section 2. Aucun paramètre aléatoire supplémentaire ne modifie les contraintes. Le nom visible est simplement « Dossier A1 », etc.; ne pas afficher les colonnes solutions dans le jeu.

### Indices explicites par dossier

Les listes suivantes lèvent toute ambiguïté de substitution. Dans les textes finaux, « symbole extérieur/milieu/intérieur » conserve la référence aux anneaux acquis et « symbole restant » la définition F. À l’étape finale déverrouillée, chaque référence est aussi interpolée avec le nom acquis : « le symbole extérieur (Feuille) », « le symbole du milieu (Montagne) », « le symbole intérieur (Soleil) » dans A1, et « le symbole restant (Vague) ». Appliquer le même format aux autres dossiers. Ainsi les indices visibles changent réellement avec les symboles, même dans une famille. Avant acquisition des anneaux, afficher seulement les rôles, jamais des noms déduits des anneaux encore en cours de réglage.

#### A1
- Alimentation : Feuille précède Montagne. / Feuille précède Soleil. / Feuille et Montagne sont voisins. / Montagne et Vague sont voisins.
- Anneaux : Le symbole extérieur est voisin du symbole alimenté par la prise 3. / Le symbole du milieu est voisin de celui de l’anneau extérieur. / Le symbole intérieur est opposé à celui de l’anneau du milieu. / Le symbole intérieur provient de la prise 2 ou de la prise 4.
- Finale : Le symbole extérieur précède le symbole du milieu. / Le symbole du milieu précède le symbole intérieur. / Le symbole restant n’est ni premier ni dernier. / Le symbole restant et le symbole intérieur ne sont pas voisins.

#### A2
- Alimentation : Feuille précède Vague. / Feuille précède Soleil. / Feuille et Vague sont voisins. / Vague et Montagne sont voisins.
- Anneaux : Le symbole du milieu est voisin du symbole alimenté par la prise 2. / Le symbole extérieur est voisin de celui de l’anneau du milieu. / Le symbole intérieur est opposé à celui de l’anneau extérieur. / Le symbole intérieur provient de la prise 3 ou de la prise 4.
- Finale : Le symbole extérieur précède le symbole du milieu. / Le symbole du milieu précède le symbole intérieur. / Le symbole restant n’est ni premier ni dernier. / Le symbole restant et le symbole intérieur ne sont pas voisins.

#### A3
- Alimentation : Montagne précède Vague. / Montagne précède Soleil. / Montagne et Vague sont voisins. / Vague et Feuille sont voisins.
- Anneaux : Le symbole intérieur est voisin du symbole alimenté par la prise 2. / Le symbole du milieu est voisin de celui de l’anneau intérieur. / Le symbole extérieur est opposé à celui de l’anneau du milieu. / Le symbole extérieur provient de la prise 1 ou de la prise 4.
- Finale : Le symbole extérieur précède le symbole du milieu. / Le symbole du milieu précède le symbole intérieur. / Le symbole restant n’est ni premier ni dernier. / Le symbole restant et le symbole intérieur ne sont pas voisins.

#### A4
- Alimentation : Soleil précède Feuille. / Soleil précède Vague. / Soleil et Feuille sont voisins. / Feuille et Montagne sont voisins.
- Anneaux : Le symbole du milieu est voisin du symbole alimenté par la prise 2. / Le symbole intérieur est voisin de celui de l’anneau du milieu. / Le symbole extérieur est opposé à celui de l’anneau intérieur. / Le symbole extérieur provient de la prise 1 ou de la prise 3.
- Finale : Le symbole extérieur précède le symbole du milieu. / Le symbole du milieu précède le symbole intérieur. / Le symbole restant n’est ni premier ni dernier. / Le symbole restant et le symbole intérieur ne sont pas voisins.

#### B1
- Alimentation : Vague précède Montagne. / Vague et Montagne sont voisins. / Vague et Feuille ne sont pas voisins. / Feuille est entre Montagne et Soleil.
- Anneaux : Le symbole extérieur est voisin du symbole alimenté par la prise 4. / Le symbole intérieur est voisin de celui de l’anneau extérieur. / Le symbole du milieu suit immédiatement celui de l’anneau intérieur sur le cadran horaire. / Le symbole du milieu provient de la prise 2 ou de la prise 3.
- Finale : Le symbole intérieur précède le symbole extérieur. / Le symbole intérieur et le symbole extérieur sont voisins. / Le symbole intérieur et le symbole restant ne sont pas voisins. / Le symbole restant est entre le symbole extérieur et le symbole du milieu.

#### B2
- Alimentation : Soleil précède Vague. / Soleil et Vague sont voisins. / Soleil et Montagne ne sont pas voisins. / Montagne est entre Vague et Feuille.
- Anneaux : Le symbole intérieur est voisin du symbole alimenté par la prise 1. / Le symbole du milieu est voisin de celui de l’anneau intérieur. / Le symbole extérieur suit immédiatement celui de l’anneau du milieu sur le cadran horaire. / Le symbole extérieur provient de la prise 3 ou de la prise 4.
- Finale : Le symbole intérieur précède le symbole extérieur. / Le symbole intérieur et le symbole extérieur sont voisins. / Le symbole intérieur et le symbole restant ne sont pas voisins. / Le symbole restant est entre le symbole extérieur et le symbole du milieu.

#### B3
- Alimentation : Soleil précède Montagne. / Soleil et Montagne sont voisins. / Soleil et Feuille ne sont pas voisins. / Feuille est entre Montagne et Vague.
- Anneaux : Le symbole extérieur est voisin du symbole alimenté par la prise 1. / Le symbole du milieu est voisin de celui de l’anneau extérieur. / Le symbole intérieur suit immédiatement celui de l’anneau du milieu sur le cadran horaire. / Le symbole intérieur provient de la prise 2 ou de la prise 3.
- Finale : Le symbole intérieur précède le symbole extérieur. / Le symbole intérieur et le symbole extérieur sont voisins. / Le symbole intérieur et le symbole restant ne sont pas voisins. / Le symbole restant est entre le symbole extérieur et le symbole du milieu.

#### B4
- Alimentation : Vague précède Feuille. / Vague et Feuille sont voisins. / Vague et Montagne ne sont pas voisins. / Montagne est entre Feuille et Soleil.
- Anneaux : Le symbole du milieu est voisin du symbole alimenté par la prise 4. / Le symbole intérieur est voisin de celui de l’anneau du milieu. / Le symbole extérieur suit immédiatement celui de l’anneau intérieur sur le cadran horaire. / Le symbole extérieur provient de la prise 2 ou de la prise 3.
- Finale : Le symbole intérieur précède le symbole extérieur. / Le symbole intérieur et le symbole extérieur sont voisins. / Le symbole intérieur et le symbole restant ne sont pas voisins. / Le symbole restant est entre le symbole extérieur et le symbole du milieu.

#### C1
- Alimentation : Montagne précède Vague. / Montagne précède Soleil. / Montagne et Feuille ne sont pas voisins. / Soleil est entre Vague et Feuille.
- Anneaux : Le symbole du milieu est voisin du symbole alimenté par la prise 2. / Le symbole extérieur est opposé à celui de l’anneau du milieu. / Le symbole intérieur est voisin de celui de l’anneau extérieur. / Le symbole intérieur provient de la prise 1 ou de la prise 4.
- Finale : Le symbole du milieu précède le symbole restant. / Le symbole du milieu précède le symbole intérieur. / Le symbole du milieu et le symbole extérieur ne sont pas voisins. / Le symbole intérieur est entre le symbole restant et le symbole extérieur.

#### C2
- Alimentation : Feuille précède Soleil. / Feuille précède Montagne. / Feuille et Vague ne sont pas voisins. / Montagne est entre Soleil et Vague.
- Anneaux : Le symbole du milieu est voisin du symbole alimenté par la prise 1. / Le symbole intérieur est opposé à celui de l’anneau du milieu. / Le symbole extérieur est voisin de celui de l’anneau intérieur. / Le symbole extérieur provient de la prise 2 ou de la prise 4.
- Finale : Le symbole du milieu précède le symbole restant. / Le symbole du milieu précède le symbole intérieur. / Le symbole du milieu et le symbole extérieur ne sont pas voisins. / Le symbole intérieur est entre le symbole restant et le symbole extérieur.

#### C3
- Alimentation : Montagne précède Soleil. / Montagne précède Vague. / Montagne et Feuille ne sont pas voisins. / Vague est entre Soleil et Feuille.
- Anneaux : Le symbole extérieur est voisin du symbole alimenté par la prise 4. / Le symbole du milieu est opposé à celui de l’anneau extérieur. / Le symbole intérieur est voisin de celui de l’anneau du milieu. / Le symbole intérieur provient de la prise 2 ou de la prise 3.
- Finale : Le symbole du milieu précède le symbole restant. / Le symbole du milieu précède le symbole intérieur. / Le symbole du milieu et le symbole extérieur ne sont pas voisins. / Le symbole intérieur est entre le symbole restant et le symbole extérieur.

#### C4
- Alimentation : Feuille précède Vague. / Feuille précède Soleil. / Feuille et Montagne ne sont pas voisins. / Soleil est entre Vague et Montagne.
- Anneaux : Le symbole intérieur est voisin du symbole alimenté par la prise 1. / Le symbole extérieur est opposé à celui de l’anneau intérieur. / Le symbole du milieu est voisin de celui de l’anneau extérieur. / Le symbole du milieu provient de la prise 2 ou de la prise 3.
- Finale : Le symbole du milieu précède le symbole restant. / Le symbole du milieu précède le symbole intérieur. / Le symbole du milieu et le symbole extérieur ne sont pas voisins. / Le symbole intérieur est entre le symbole restant et le symbole extérieur.

## 4. Textes, aides et cohérence physique

Une représentation typée et fermée des contraintes sert aux prédicats, au carnet et aux inscriptions physiques. Pas d’eval ni de moteur de règles généraliste. Garder des noms complets en français; formes compactes autorisées seulement sur les plaques 3D. Pour les inscriptions d’alimentation : les deux premières relations sur la plaque haute, les deux dernières sur la plaque basse. Légende courte : `<` précède, `~` voisins, `≁` non voisins, `entre(X;Y,Z)` Entre. Chacun a sa définition accessible dans le carnet; aucune information indispensable uniquement en 3D ou uniquement par couleur.

Retirer les deux anciens textes gravés fixes de scene.js et les dériver du dossier. Pas de symbole absent ni d’inscription contradictoire après reprise ou Nouvelle partie. L’ordre global SYMBOLS et les atlas intégrés des anneaux restent inchangés; seuls les textes de contraintes changent. Refaire les textures des deux plaques uniquement au changement de dossier/relance de scène, en libérant les anciennes. Ne pas multiplier les objets ni reconstruire les anneaux à chaque cran. Contrôler à 360×800 que les relations tiennent sans réduire la lecture à un texte minuscule; les phrases complètes restent dans le carnet.

Aides : trois niveaux par mécanisme, sans accumulation de nouveaux paramètres. Les interpolations sont des noms/références tirés du dossier immuable. Voici les textes exacts à instancier :

| Étape/famille | Niveau 1 | Niveau 2 |
|---|---|---|
| Alimentation A | Croisez les deux relations de voisinage. | {A}, {B}, {C} forment un bloc dans cet ordre. L’autre position du bloc placerait {D} avant {A}. |
| Alimentation B | Croisez la précédence et le voisinage qui portent sur {A} et {B}. | Le bloc {A}–{B} a trois emplacements possibles. La règle Entre exclut celui du milieu; la non-voisineté de {A} et {C} exclut celui de droite. |
| Alimentation C | {A} doit être avant deux symboles. Quelles positions restent possibles ? | Si {A} était deuxième, {D} serait premier et le toucherait. Placez donc {A} en premier, puis utilisez Entre. |
| Anneaux A | Relevez les symboles des prises {j}, {k} et {l}; ne confondez pas positions sur le coffret et positions dans le cadran. | {U} a deux candidats. Pour chacun, déduisez les deux candidats de {V} par voisinage avec {U}, puis leur opposé pour {W}. La paire des prises {k}/{l} élimine trois branches. |
| Anneaux B | Relevez les symboles des prises {j}, {k} et {l}; « suit immédiatement » se lit dans le cadran horaire, pas comme un geste à effectuer. | {U} a deux candidats; chacun donne deux candidats pour {V}. Déduisez pour {W} le symbole qui suit celui de {V}, puis éliminez avec les prises {k}/{l}. |
| Anneaux C | Relevez les symboles des prises {j}, {k} et {l}, puis la relation d’opposition. | Pour chacun des deux {U}, déduisez son opposé {V}, puis les deux candidats de {W} voisins du symbole de {V}. La paire des prises {k}/{l} élimine trois branches. |
| Finale A | Traduisez extérieur, milieu et intérieur avec le carnet des résultats acquis; identifiez le symbole restant. | Conservez la chaîne extérieur → milieu → intérieur. Le symbole restant doit se placer à l’intérieur, sans toucher celui de l’anneau intérieur. |
| Finale B | Le symbole intérieur et celui de l’extérieur forment un bloc orienté. | Examinez les trois emplacements de ce bloc sur le papier. Entre et la non-voisineté avec le symbole restant éliminent deux emplacements. |
| Finale C | Celui du milieu doit précéder deux autres symboles; identifiez aussi le symbole restant. | Le symbole du milieu doit être premier, sinon celui de l’extérieur le toucherait. La règle Entre fixe ensuite les trois autres. |

Les {U,V,W} deviennent « l’anneau extérieur / du milieu / intérieur »; ces interpolations désignent les anneaux porteurs de symboles, pas des positions adjacentes sur le coffret. Mettre la première lettre de chaque phrase en majuscule après interpolation. Niveau 3, pour chaque dossier : alimentation « Prises 1 à 4 : {P en noms complets}. »; anneaux « Extérieur : {R0}. Milieu : {R1}. Intérieur : {R2}. »; finale « Ordre : {Q en noms complets}. » Ces valeurs doivent venir de l’unique solution validée, et correspondre aux assertions de banque. Appliquer conserve le verrou des trois indices et le marquage d’aide; il utilise cette même réponse, pas les constantes legacy.

Aucune aide ne réordonne secrètement le cadran; aucun son ne confirme un symbole/branche juste avant validation globale. Musique/FX/volumes, pause, cadence finale, chrono facultatif et accessibilité restent tels quels.

## 5. Sélection déterministe et absence de répétition

Identifiants dans l’ordre canonique : A1,A2,A3,A4,B1,B2,B3,B4,C1,C2,C3,C4. La sélection ne change qu’après confirmation de Nouvelle partie ou à la première création sur stockage réellement vide. Reload/restore, Reprendre, pause, contexte WebGL et aides n’avancent jamais le sélecteur. Une annulation de la confirmation ne consomme aucun dossier.

Sélecteur version 1 : seed non nulle uint32; xorshift32 à arithmétique uint32 (xor avec décalage gauche13, puis droit non signé17, puis gauche5). Pour chaque tirage pseudo-aléatoire, appliquer ces trois opérations et réduire à uint32. Mélanger une copie de la liste canonique par Fisher–Yates, i de 11 à 1, j=tirage modulo (i+1), échange i/j. Ce modulo a un biais minime assumé; il ne compromet ni unicité des puzzles ni absence de répétition, et aucune garantie cryptographique n’est annoncée.

Configuration sauvegardée : `v:2`, `config:{bankVersion:1,dossierId}`, `selector:{version:1,initialSeed,bagSeed,avoidId,cursor}` en plus des champs de progression/préférences. `cursor` vaut 1..12 et désigne le nombre de dossiers déjà distribués dans le sac, incluant l’actuel. Le dossier actuel est le sac dérivé à l’indice cursor−1. `bagSeed` est l’état PRNG avant le mélange; `initialSeed` conserve la graine d’origine à titre de reproductibilité. `avoidId` est null au premier sac, sinon le dernier dossier du sac précédent. Si le premier du nouveau mélange vaut avoidId, échanger ses deux premiers éléments, sans nouveau tirage. Les douze éléments restent uniques.

Premier sac : bagSeed=initialSeed, avoidId=null, cursor=1. Nouvelle partie avec cursor<12 : cursor+1, pas de nouveau mélange. Après cursor=12 : nouvelle bagSeed égale l’état PRNG après les onze tirages du mélange précédent; avoidId égale le dossier actuel; mélanger et mettre cursor=1. Le correctif éventuel des deux premières positions ne consomme pas de PRNG. La reprise recalcule seulement les onze tirages du sac courant et vérifie l’ID; aucun historique de cycles à rejouer. Initialisation de seed via crypto.getRandomValues, sinon Math.random une seule fois lors de la création; zéro est normalisé en 0x6d2b79f5. Ce hasard ne produit jamais les contraintes elles-mêmes.

Tous les dossiers de la banque ayant des réponses distinctes à chaque étage, chaque Nouvelle partie change les trois réponses, même à la frontière de sacs. Pas de contrôle « choisir sa seed », classements, campagne narrative ou autre interface supplémentaire dans ce périmètre.

## 6. Migration, reprise et erreurs sans écrasement

Conserver la clé locale `coffret-futuriste:v1` pour retrouver la partie existante; c’est le schéma JSON qui passe à v2. Les versions publiées de banque sont immuables; aucun ID existant ne change de sens. Le validateur refuse les propriétés non prévues et ne charge jamais de règle/code depuis une sauvegarde.

- v1 valide : valider avec les règles historiques AVANT migration. Migrer en `config:{bankVersion:0,dossierId:'legacy-v1'}`, selector=null. Conserver exactement les champs power/rings/sequence/stage/hints/assisted/elapsed/challenge/settings, y compris les defaults audio historiques déjà appliqués par le validateur v1. Ne pas tirer de seed. Le dossier legacy conserve les contraintes/hints/solutions d’origine : P=S,V,L,M; R=V,S,M; Q=V,L,S,M. La prochaine Nouvelle partie confirmée crée le premier sac de banque1; ses trois réponses seront différentes de legacy.
- v2 legacy : selector doit être null; valider selon legacy. Pas de nouveau dossier au reload, même terminé.
- v2 banque1 : ID appartenant à la banque, selector version1, initialSeed et bagSeed entiers 1..2^32−1, avoidId null ou ID connu, cursor 1..12; si avoidId=null exiger bagSeed=initialSeed. Le sac régénéré doit contenir l’ID courant à cursor−1. Valider ensuite les invariants de progression et les étapes acquises avec CE dossier. Ne pas conserver de propriété inconnue.
- Vérifier les mêmes interdictions qu’actuellement : anneaux initiaux à l’étape0, aucune séquence avant l’étape2, aides et indices cohérents avec étapes acquises, valeurs/positions/symboles bornés. Aucune supposition qu’un triplet arbitraire d’un autre dossier est accepté.
- Sauvegarde inconnue/corrompue/incohérente : garder sa chaîne brute intacte. Pas de sauvegarde automatique, même dans le timer, tant qu’un remplacement n’a pas été confirmé. Afficher « La sauvegarde ne peut pas être reprise. Elle n’a pas été remplacée. » avec Réessayer la lecture et Nouvelle partie (confirmation explicite de remplacement). Pas de progression ancienne couplée à une autre configuration. Avant ce choix, ne pas rendre une partie de remplacement active et enregistrable.
- Échec de lecture/écriture ou stockage refusé : avertissement français, choix explicite de jouer sans sauvegarder; partie jouable en mémoire et auto-save désactivé si inaccessible. Une écriture localStorage échouée ne justifie ni removeItem ni effacement de l’ancienne valeur. Après confirmation, sauvegarder config, sélecteur et progression dans une SEULE écriture atomique de la clé, jamais deux clés pouvant se désynchroniser. Si cela échoue, avertir que la nouvelle partie est en mémoire et l’ancienne reste éventuellement sur disque.
- Préférences de son/mouvement/horloge conservées lors de Nouvelle partie; seules progression/aides/chrono de la nouvelle session sont réinitialisées. Même origine et chemin public; aucun changement de compte ni de clé d’autres jeux.

## 7. Intégration bornée et cache

Zones à modifier après revue finale : model.js (configuration/règles/aides/migration), content.js (formatage/hints/définitions), app.js (sélection/affichage/protection des erreurs), scene.js (deux inscriptions variables), tests et docs. Un petit module de banque contient les données typées immuables; un petit sélecteur pur isole les onze opérations de mélange. Pas de réécriture générale de l’application.

ring-graphics.js garde exactement l’ordre et le dessin des symboles. Si son import model.js doit être versionné, ce changement de chemin seul est nécessaire : l’URL modèle doit être la même dans app/scène/atlas/banque éventuelle, pas deux instances. audio.js et audio-events.js gardent leur contrat sans valeurs de puzzle et leurs URL uniques, sauf changement de chemin rendu nécessaire par le graphe. Pas de nouveaux événements sonores.

Choisir une nouvelle étiquette de livraison déterministe pour l’entrée et CHAQUE module changé et chaque import de module partagé changé, y compris les imports dynamiques et transitifs. Test de résolution depuis le vrai HTML : une URL canonique par module, aucun ancien chemin des composants modifiés, aucune duplication d’audio/modèle. Pas de Date.now ni service worker. La fraîcheur de l’HTML Pages reste distincte (cache max-age600 observé); ne pas promettre une mise à jour instantanée sans recharge. Hashs publics après publication seulement lorsqu’elle sera autorisée.

## 8. Preuves de conception, tests futurs et critères d’acceptation

Scripts de scratch uniquement hors dépôt : `/workspace/coffret-design-validation/replay/audit.py`; résultat `/workspace/coffret-design-validation/replay/validated-bank.json`. Ces scripts ne font pas partie du jeu ni de la banque livrée; la présente table est la spécification normative. Exécution de conception : 12×(24+216+24)=3168 candidats complets, et retrait un par un des contraintes. Elle ne remplace pas les tests de la future implémentation indépendante.

| Famille | solutions complètes P/R/Q (chacun des 4 dossiers) | candidats si chaque contrainte retirée, P | R | Q |
|---|---|---|---|---|
| A | 1 / 1 / 1 | 2,2,4,3 | 4,4,8,4 | 2,2,2,2 |
| B | 1 / 1 / 1 | 2,2,2,4 | 4,4,8,4 | 2,2,2,4 |
| C | 1 / 1 / 1 | 2,2,3,4 | 4,8,4,4 | 2,2,3,4 |

Avant livraison : reproduire ces résultats sur les fonctions du jeu, pas seulement le scratch, puis tester toutes les mauvaises réponses, progression complète de chaque dossier, aides/Appliquer, refus d’étapes hors ordre, commandes répétées, annulation/undo/clear et prises occupées. Aucune tolérance à deux solutions ni à une aide correspondant à un autre dossier.

Tester les 12 réponses distinctes par étage et exclusion des réponses legacy. Tester determinisme sur les graines 1,0x6d2b79f5,0xffffffff et un échantillon fixe de 1000 graines : même seed/version donne mêmes dossiers, 12 sans répétition, frontières de sacs différentes; annuler/recharger ne consomme rien. Vérifier que la régénération du sac courant est bornée à onze tirages, même pour une donnée hostile. Tests de corruption de chaque champ et de l’ID par rapport au curseur.

Migration v1 : fixtures aux quatre étapes, séquence/anneaux partiels permis, indices/aide, partie terminée et niveaux audio absents anciens; aucun changement des valeurs normalisées, aucune seed créée avant Nouvelle partie. Reprise v2 de chaque dossier à chaque étape, legacy v2 et reload terminé sans rejouer la victoire. Tester explicitement qu’erreur de reprise/timer ne remplace jamais l’ancienne chaîne sans confirmation et qu’une écriture échouée laisse sa valeur précédente.

Tester génération des textes des 12 dossiers, définitions, deux plaques et hints à partir du même modèle, solutions d’aides conformes à la banque, et les 18 correspondances de symboles déjà couvertes sans changer le cadran. Conserver les 67 tests existants avec adaptations nécessaires des fixtures et expectations, sans supprimer les comportements historiques couverts. Le nombre final de tests n’est pas encore connu.

QA réelle à coordonner : une résolution bureau de chaque famille, vérification visuelle des 24 inscriptions, lecture à 360×800, gestes souris/toucher/clavier et reprise S20 si disponible. Les contrôles CPU ne certifient ni lisibilité, ni son, ni niveau humain 12–14+, ni fps. Audio inchangé, test de non-régression seulement. Coût cible : données modestes, inscriptions remplacées au changement de dossier, pas de solveur par frame ni multiplication des textures de cadran; aucune performance S20 mesurée annoncée.

## 9. Témoins de raisonnement des anneaux — réservés au testeur

Chaque ligne donne les quatre branches U,V,W avant le dernier indice de paire; ✓ indique celle conservée. Les valeurs incorrectes peuvent inclure Lune/Étoile car le domaine de chaque anneau contient bien six symboles. Les solutions finales retenues ont toujours trois symboles distincts parmi les quatre languettes disponibles.

- A1 : Pj=V, paire=M,S; rôles U,V,W=O,T,I : S,E,L × ; S,V,N × ; L,V,N × ; L,M,S ✓.
- A2 : Pj=V, paire=M,S; rôles U,V,W=T,O,I : S,E,L × ; S,V,N × ; L,V,N × ; L,M,S ✓.
- A3 : Pj=V, paire=M,S; rôles U,V,W=I,T,O : S,E,L × ; S,V,N × ; L,V,N × ; L,M,S ✓.
- A4 : Pj=L, paire=S,M; rôles U,V,W=T,I,O : V,S,M ✓ ; V,L,E × ; M,L,E × ; M,N,V ×.
- B1 : Pj=S, paire=M,L; rôles U,V,W=O,I,T : E,N,E × ; E,S,V × ; V,S,V × ; V,L,M ✓.
- B2 : Pj=S, paire=M,L; rôles U,V,W=I,T,O : E,N,E × ; E,S,V × ; V,S,V × ; V,L,M ✓.
- B3 : Pj=S, paire=M,L; rôles U,V,W=O,T,I : E,N,E × ; E,S,V × ; V,S,V × ; V,L,M ✓.
- B4 : Pj=S, paire=L,M; rôles U,V,W=T,I,O : E,N,E × ; E,S,V × ; V,S,V × ; V,L,M ✓.
- C1 : Pj=V, paire=M,L; rôles U,V,W=T,O,I : S,M,L ✓ ; S,M,N × ; L,E,N × ; L,E,S ×.
- C2 : Pj=L, paire=S,V; rôles U,V,W=T,I,O : V,N,M × ; V,N,E × ; M,S,E × ; M,S,V ✓.
- C3 : Pj=L, paire=S,V; rôles U,V,W=O,T,I : V,N,M × ; V,N,E × ; M,S,E × ; M,S,V ✓.
- C4 : Pj=L, paire=V,S; rôles U,V,W=I,O,T : V,N,M × ; V,N,E × ; M,S,E × ; M,S,V ✓.

## 10. Auto-revue et gate

Banque exacte définie : douze dossiers, trois familles, règles et noms paramétrés sans case ouverte; unicité et utilité des contraintes démontrées hors dépôt. Les limites sont explicites : trois familles réutilisées, pas douze structures neuves, pas de génération libre. Les réponses/hints/plaques ne peuvent plus être des constantes historiques séparées. Migration legacy et erreurs d’écriture préservent l’ancienne partie; sélection et reprise sont dissociées. Glyphes/audio et autres jeux exclus des changements de comportement. Aucune option de conception restante à arbitrer.

Ce document approuvé en concept, maintenant finalisé, est à soumettre à la dernière revue propriétaire. Le commit autorisé est documentaire seulement. Pas de plan, construction ou publication avant cette revue. README/GAME ne doivent pas présenter cette fonctionnalité comme réalisée; leurs notes historiques ne sont pas une preuve d’implémentation de rejouabilité.
