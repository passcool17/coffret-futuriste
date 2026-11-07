# Coffret futuriste Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Construire localement le coffret jouable à trois énigmes approuvées le 7 novembre à 11 h 09 Toronto.
**Architecture:** Règles pures et sauvegarde versionnée indépendantes de Three.js. Scène procédurale avec raycasting, commandes HTML alternatives utilisant les mêmes transitions, audio synthétique local.
**Tech Stack:** JavaScript modules, Three.js distribué par npm puis vendored avec licence, Node test, serveur HTTP Python.

## Global Constraints
- Aucun remote, publication, service distant, modification d’un autre jeu ou cloud agent.
- Routage SVLM, anneaux (1,0,3), libération VLSM; vérification globale uniquement.
- Souris/tactile/clavier, cibles HTML 48 px, français, reprise locale, aides facultatives.
- Aucun essai visuel/sonore/S20 revendiqué avant QA réelle.

### 1. État et preuves de solution
Files: src/model.js, tests/model.test.js, package.json.
Interface: fresh(), transition(state, action), powerValid(array), ringsValid(array,power), releaseValid(array,rings), restore(string), tick(state,dt,active).
- [x] Écrire assertions d’énumération des 24/216/24 candidats et progression interdite hors ordre, lancer `node --test` et constater le rouge.
- [x] Implémenter état immuable {v,power,rings,sequence,stage,hints,assisted,elapsed,challenge,settings}; transition renvoie {state,message,ok}.
- [x] Ajouter tests de connexions occupées, annulation, répétitions, saves incohérentes, reprise, aide et timer; constater rouge puis implémenter.
- [x] Exécuter tests verts et enregistrer commit local.

### 2. Interface et persistence
Files: index.html, style.css, src/app.js, src/content.js, tests/surface.test.js.
Interface: app appelle transition; renderer reçoit update(state), focus(module), dispose(); events 3D transmettent mêmes actions.
- [x] Écrire tests de contrat statiques: modules locaux, canvas, commandes accessibles, labels, contexte perdu et pointercancel; constater rouge avant création.
- [x] Créer interface française compacte, indices visibles par module, contrôles alternatifs repliables, confirmations de reset/apply, timer challenge facultatif, menu, son/réduction animation mémorisés.
- [x] Capter erreurs localStorage, reprise invalide, visibilité/focus pour chrono, son et annulation. Sauver seulement actions confirmées/temps actif.
- [x] Tests et syntaxe verts puis commit local.

### 3. Objet 3D et manipulations
Files: vendor/three.module.js, vendor/three.core.js, vendor/LICENSE, src/scene.js, src/audio.js.
- [x] Tests statiques de présence raycaster, capture pointeur, contexte perdu, rendu à la demande; constater rouge.
- [x] Acquérir distribution publique Three.js, conserver licence; construire coque graphite, capots coulissants, câbles/prises, anneaux crantés, languettes, poignée, couvercle articulé et noyau.
- [x] Raycast commandes: fiche vers prise ou clic sélection, anneaux drag angulaire et clic cran, languettes glissement/clic et poignée clic; fond seul orbite limitée. Annulation remet l’état confirmé.
- [x] Animer uniquement représentation; ratio pixels mobile plafonné puis adaptatif, rendu suspendu onglet caché, pas de postprocessing ni ombres dynamiques.
- [x] Tests/syntaxe verts; QA visuelle explicitement confiée au parent, pas de navigateur lancé depuis Shell.

### 4. Livraison locale vérifiable
Files: README.md, GAME.md.
- [x] Écrire commandes de lancement, limites vérifiées/non vérifiées et procédure QA avec solutions dans GAME.md seulement.
- [x] `npm test`, `node --check` sur tous modules; vérifier dépendances runtime locales, poids des assets et git diff.
- [x] Commit local avec identité par commande, aucun remote. Démarrer HTTP port 8887 si libre, consigner PID et URL. Remettre checklist parent.

## Revue du plan
Toutes les exigences de la spec sont affectées aux étapes 1–4; les budgets de performance restent cibles à mesurer, pas succès déclarés. Exécution locale autorisée explicitement. Aucune confirmation routinière supplémentaire requise.

## Résultat de construction
Implémentation locale réalisée, tests purs et contrats statiques verts. QA navigateur explicitement non exécutée par Shell : checklist transmise dans GAME.md. Aucun remote ou publication. Les budgets GPU restent non mesurés.
