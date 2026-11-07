# Coffret Audio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Ajouter musique originale douce et effets mécaniques avec volumes persistants, sans changer les énigmes.
**Architecture:** Contrat d’événement audio sans symboles/solutions à la sortie de act; moteur Web Audio unique avec bus et ressources bornées. Migration tolérante des préférences v1.
**Tech Stack:** JavaScript ES modules, Web Audio natif, Node test et doubles de contexte/horloge; aucune dépendance runtime supplémentaire.

## Global Constraints
- Pas de push avant revue indépendante; aucun autre jeu, service externe, asset tiers ou navigateur automatisé.
- Clé et format de sauvegarde v1 conservés; master/mute existants inchangés.
- Musique: au plus trois voix; effets: huit voix; timer 120 ms, horizon 250 ms, silence en arrière-plan.
- Variation uniquement après étape acquise; aucun symbole, valeur ou correction partielle transmis au moteur.
- Aucun test numérique ne constitue une écoute réelle ou une mesure S20.

### 1. Préférences compatibles
Files: src/model.js, tests/audio-settings.test.js.
- [ ] Tester anciennes saves aux étapes 0–3, défauts .25/.8, champs ajoutés invalides, volume/mute préservés: `node --test tests/audio-settings.test.js` doit échouer avant changement.
- [ ] fresh.settings ajoute musicVolume/effectsVolume; transition.settings borne chaque nombre fini; restore garde les défauts pour champs absents/invalides sans rejeter la partie. Les règles de puzzle ne changent pas.
- [ ] Tests verts puis commit local du design/plan et de cette unité.

### 2. Contrat et moteur
Files: src/audio-events.js, src/audio.js, tests/audio.test.js, tests/audio-events.test.js.
Interfaces: audioEvent(action,before,result) -> {type,ok,changed,fromStage,toStage}; effectFor(event) -> nom ou null. audio({createContext,setTimer,clearTimer,available,onUnavailable}) -> {handleAction(event,settings),resume(settings,stage),sync(settings),pause(),dispose()}.
- [ ] Tester événements sans données de solution, mêmes timbres sur variantes, no-op/indice silencieux, réussite seulement sur stage acquis. Constater rouge.
- [ ] Implémenter contrat et mapping insertion/retrait/cran/languette/ressort/butée/ouverture/révélation.
- [ ] Tester contexte paresseux unique, refus resume capturé, pause/dispose et génération, volumes/mute/zéro, timer unique, plafond de voix et cleanup. Constater rouge.
- [ ] Construire bus musique/effets/master + compresseur; oscillateurs enveloppés et bruit filtré commun; nappe originale huit mesures72bpm, scheduler borné et arrêt des notes futures. Pas de dépendance au RAF.
- [ ] Vérifier tests verts et enregistrer commit local.

### 3. Intégration unique et contrôles
Files: src/app.js, index.html, tests/audio-hooks.test.js; adaptations minimales des harness existants si interface audio modifiée.
- [ ] Tester un hook par act, boutons/curseurs identifiés, resume après menu avec geste, pause menu/blur/hidden, aucune reprise automatique en focus/visibility, dispose pagehide. Constater rouge.
- [ ] act compare l’état via audioEvent puis appelle handleAction une fois; settings appelle sync, jamais un clic mécanique. Reprendre/Son/nouvelle partie/cadrage/zoom fournissent un geste sans effet puzzle; aucune émission depuis scene.js.
- [ ] Ajouter curseurs Musique/Effets au menu existant, synchroniser leur valeur et sauvegarder via transition.settings. Capture d’erreur audio annoncée une fois avec bouton Son pour réessayer.
- [ ] Rejouer toute la suite, node --check et git diff --check; commit local.

### 4. Documentation et remise en revue
Files: README.md, GAME.md, plan.
- [ ] Préciser ancien clic/toucher S20 confirmés par l’utilisateur, QA responsive réussie; nouveau mix non écouté.
- [ ] Documenter écoute réelle à faire: balance, casque/mono/haut-parleur, pause/reprise, mute au premier geste, niveaux à zéro, recharge2/3, final sans replay,10min.
- [ ] Si renderer offline déjà accessible sans navigateur, métriques optionnelles uniquement; ne pas ajouter de dépendance pour cela.
- [ ] Tests et syntaxe verts; état propre, commits locaux remis au coordinateur, aucun push.

## Auto-relecture du plan
Migration affectée à1, contrat/oracle/limites/erreurs à2, entrées/pause/menus à3, QAetécoute à4. Le scheduler ne réveille jamais le contexte; seul un geste explicite le peut. Règles et sauvegardes de progression inchangées. Pas d’extension de périmètre.
