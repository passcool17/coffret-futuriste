# Coffret Replay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Construire les douze dossiers exacts approuvés sans changer une partie existante.

**Architecture:** Une banque immuable et des prédicats fermés alimentent règles et textes. Un sélecteur pur gère le sac; une frontière de persistance protège le raw ancien avant toute reprise/remplacement. La scène ne change que ses deux inscriptions; app orchestre le dossier courant.

**Tech Stack:** JavaScript modules statiques, Three.js0.180 déjà vendored, Node test, localStorage. Aucun paquet nouveau.

## Global Constraints

- Spécification normative : `docs/superpowers/specs/2026-11-07-coffret-replay-design.md`, approuvée t135s908.
- Douze dossiers A1..C4, trois familles, solutions distinctes par étage; unicité24/216/24 et quatre contraintes essentielles.
- Clé `coffret-futuriste:v1`, schéma v2; legacy-v1 immuable, même progression et préférences. Erreur de lecture/reprise : aucune écriture avant confirmation.
- Cadran S,V,L,M,N,E, glyphes, raycast, gestes et audio inchangés. Relations et plaques synchronisées.
- Local uniquement, main explicitement autorisée, aucun push; commits auteur passcool17 par flags de commande. Brouillon polish exclu.
- Aucun navigateur, dépendance/service/asset externe. Aucun résultat visuel/S20 prétendu.

## Décision de compatibilité réversible

`fresh(challenge=false,selection=null)` reste le constructeur pur d’un état legacy vide lorsque selection=null (utile pour migration et tests historiques). L’interface crée toutes ses nouvelles parties par `newGameState(previous,challenge,seed)` qui sélectionne toujours banque1; aucun bouton ne doit appeler fresh directement. Restore n’appelle jamais le générateur de seed. Aucun changement aux signatures legacy de powerValid/ringsValid/releaseValid : ajouter config en dernier argument avec default legacy.

## Fichiers et interfaces

- `src/puzzles.js` nouveau : SYMBOLS/ACTIVE, LEGACY, IDS, banque gelée; `getPuzzle(config)`, `constraintsFor(config,stage)`, `matches(candidate,constraints,{stage,power,rings})`, `solutionsFor(config)` unique, memoïsé par ID.
- `src/selector.js` nouveau : `bagFor(selector) -> {ids,endState}`, `selectNext(previousSelector,seed) -> {config,selector}`, `validSelection(config,selector) -> boolean`, `makeSeed() -> uint32`.
- `src/model.js` : re-export SYMBOLS, prédicats configurés, `fresh`, `newGameState`, `restore`, transitions configurées sans changer actions/sons.
- `src/session-storage.js` nouveau : `createPersistence(storage,decode)` retourne `load()`, `save(state)`, `allowReplacement()`, `playInMemory()`, état `status` (empty/ready/blocked/unavailable/memory). Storage est injecté, jamais lu au chargement du module.
- `src/content.js` : conserver exports legacy; `puzzleContent(state)` retourne `{clues,definitions,hints,plates,id}` du dossier courant.
- `src/app.js`, `index.html` : flux de reprise bloqué, Retry/New/Memory explicites; affichage dossier, nouveaux textes; nouvelles parties via newGameState.
- `src/scene.js` : `puzzleContent` fournit deux plaques actualisées uniquement quand config change; libération existante réutilisée. `src/ring-graphics.js` : seul chemin import modèle versionné.
- Tests nouveaux : `tests/replay-bank.test.js`, `tests/selector.test.js`, `tests/replay-model.test.js`, `tests/session-storage.test.js`, `tests/replay-content.test.js`; adapter harness/contrat cache existants sans supprimer comportements.

### Task1 : banque et sélection pures

- [x] RED : tests attendus indépendants des données de production pour les douze lignes de spec et pour unicité/essentialité.
```js
for(const expected of fixtures){
 const config={bankVersion:1,dossierId:expected.id};
 assert.deepEqual(solutionsFor(config),{power:expected.p,rings:expected.r,sequence:expected.q});
 // Sur domaines24/216/24, retirer chacune des quatre contraintes et exiger >=2.
}
assert.equal(new Set(Array.from({length:12},()=>draw())).size,12);
```
- [x] Exécuter `node --test tests/replay-bank.test.js tests/selector.test.js`; constater absence des fonctions.
- [x] GREEN : coder familles exactes de section2 et douze lignes de section3. Évaluer seulement before/adj/notadj/between/notend/opposite/next/in, refs Pj/O/T/I/F. Enumérer une fois les solutions et refuser toute banque non unique.
```js
const profileA=[['before','A','B'],['before','A','D'],['adj','A','B'],['adj','B','C']];
// Les paramètres A..D proviennent de order, jamais d’une réponse saisie.
```
- [x] Coder xorshift/Fisher–Yates de section5, seed/normalisation, cursor et avoidId; valider sac courant en onze tirages, uint32 et ID.
```js
const x0=state>>>0;let x=x0;x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0;
```
- [x] Tester graines1,0x6d2b79f5,0xffffffff et1000 graines/24tirages, même séquence avec seed égale; aucun ID répété dans sac/frontière.
- [x] `npm test`, commit explicite banque/sélecteur/tests/plan.

### Task2 : modèle configuré et migration

- [x] RED : chaque dossier résolu par vraies transitions, tous candidats faux refusés; restore v1 aux quatre étapes et partiels; config inconnue, curseur et progression invalides refusés.
```js
const selected=newGameState(null,false,1);
assert.equal(selected.v,2);assert.equal(selected.config.bankVersion,1);
const migrated=restore(JSON.stringify(v1Fixture));
assert.deepEqual(migrated.power,v1Fixture.power);
assert.deepEqual(migrated.config,{bankVersion:0,dossierId:'legacy-v1'});
```
- [x] `node --test tests/replay-model.test.js` rouge.
- [x] GREEN : remplacer seuls appels de prédicats et réponses apply; transmettre n.config à matches/solutions. Copier champs schema connus dans restore, vérifier progression selon le dossier. Préserver normalisation audio historique.
```js
const answer=solutionsFor(s.config);
if(s.stage===0)n.power=[...answer.power];
if(s.stage===1)n.rings=[...answer.rings];
if(s.stage===2)n.sequence=[...answer.sequence];
```
- [x] `npm test`, tous tests historiques legacy conservés. Commit modèle/test.

### Task3 : persistance protectrice

- [x] RED : stockage corrompu + save/timer simulés ne font aucun setItem; lecture refusée idem. Retry relit sans remplacement; remplacement confirmé autorise une seule écriture; quota laisse raw intact, état mémoire explicite.
```js
const p=createPersistence(fakeStorage,restore);p.load();
assert.equal(p.save(newState),false);assert.equal(fakeStorage.writes,0);
p.allowReplacement();assert.equal(p.save(newState),true);
```
- [x] `node --test tests/session-storage.test.js` rouge.
- [x] GREEN : frontière unique d’écriture; load retourne state|null et status, bloque auto-save sur erreur. Aucun removeItem ni autre clé/backup. La chaîne brute reste la sauvegarde tant que le propriétaire n’a pas confirmé remplacement; c’est la sauvegarde de sécurité retenue, sans deuxième clé pouvant se désynchroniser.
- [x] Tester ancien raw préservé après erreur quota et load vide vs corrupt distincts; commit module/tests.

### Task4 : carnet, plaques et app

- [x] RED : contenu de chaque dossier différent, plaques dérivées des mêmes AST, aides finales égales aux solutions; pas de noms d’anneaux non acquis dans indices finaux. Scène CPU constate textes actuels après swap/restore de config.
```js
const c=puzzleContent(state);
assert.equal(c.clues[0].length,4);assert.equal(c.plates.length,2);
assert.ok(c.hints[0][2].includes(expectedFirstName));
```
- [x] `node --test tests/replay-content.test.js` rouge.
- [x] GREEN : formateurs fermés et textes exacts section4; legacy conserve textes initiaux. Définir Entre et symbole restant; références finales annotées par noms acquis seulement à stage>=2.
- [x] App : chargement avant création, state=fresh neutre pour repli verrouillé; si load empty appeler newGameState et sauver; si saved reprendre sans tirage. `act`/timer inactifs tant que session bloquée; commandes Retry/New/Memory visibles et accessibles. Pas de render qui efface message d’action. Nouvelle partie confirmée crée selectNext, conserve settings, puis sauvegarde atomique.
- [x] Scène : remplacer deux inscriptions hardcodées par références de meshes, writeLabel si ID/config différent; aucune modification géométrie glyphes. Bloquer canvas via inert sur section de jeu pendant erreur, garder boutons de récupération hors zone inerte.
- [x] Version déterministe `replay-bank-v1` sur HTML et tous modules changés y compris chemins partagés depuis ring-graphics et tests; audio reste unique non modifié.
- [x] Tester intégration app minimale via harness Node : erreur startup/timer/retry/newgame, contrôle cache transitif et labels scène. `npm test`, syntaxe, commit UI/textes/cache/tests.

### Task5 : preuve finale et documentation

- [x] Vérifier `npm test`, `for f in src/*.js tests/*.js tests/helpers/*.js; do node --check "$f"; done`, `git diff --check`.
- [x] README/GAME : état local non publié, migration exacte, dossier affiché, douze instances/trois familles, erreurs et protocole QA non spoiler. Garder solutions réservées au testeur dans spec, pas UI hors aide.
- [x] Mettre cases du plan à jour selon exécution; commit docs. Vérifier `git show --stat`, status (seul polish non suivi), aucune modification audio/geometry autre qu’import versionné.
- [x] Retourner SHA, nombre tests, rouge→vert, limites et checklist QA. HOLD push pour revue indépendante et QA coordonnée.

## Auto-revue du plan

Couverture : banque/règles/hints Task1/2/4; déterminisme Task1; v1/erreurs Task2/3/4; scènes et cache Task4; QA honnête Task5. Pas d’écart nécessaire au cahier approuvé. Choix de frontière mémoire/stockage explicite; aucun backup supplémentaire promis. Méthode locale inline fixée par coordination; ne pas redemander le choix. Aucun brouillon polish ou autre jeu dans les commits.


## Résultat d’exécution

Tâches1–5 exécutées localement. 90 tests : les67 comportements de base et23 ajouts. Traces des lots dans /tmp/coffret-replay-task1-tests.txt, task2-tests.txt, task3-tests.txt et task4-focus-tests.txt (préfixe coffret-replay-); vérification finale répétée avant livraison. Trois couches de preuve indépendantes : assertions normatives de banque, prédicats/validateurs, parcours app DOM simulé. Limites navigateur explicites dans GAME.md.

Ajustements réversibles dans le périmètre : état de session running injecté dans les anciens harness; appel explicite du prédicat dans filter pour ne pas confondre l’index du callback et config; garde après import asynchrone si reprise devenue bloquée; focus explicite après récupération. Chacun conserve les comportements historiques et possède une couverture. Aucun conflit avec la spec nécessitant une décision propriétaire supplémentaire. Publication non exécutée; revue indépendante à venir.
