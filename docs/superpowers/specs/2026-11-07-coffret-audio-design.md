# Le Coffret — musique et mécanique sonore

7 novembre 2026, Toronto. **Design approuvé par Pascal le 7 novembre 2026 à 11 h 42 (Toronto). Construction et publication autorisées; push retenu jusqu’à revue indépendante.**

## Contexte vérifié

Base publique 8bf3225, suite existante 36 tests. Le moteur `src/audio.js` ne produit actuellement qu’un oscillateur bref pour succès/refus. `app.js` transmet un booléen après presque chaque action, suspend au menu/blur/onglet caché, et ne distingue pas le matériau ou le mécanisme. Il n’y a aucune musique. Le volume `.35` et le mute sont sauvegardés dans `settings` par `model.js`. Les deux types de commandes (3D et HTML) convergent déjà dans `act` : c’est le point d’accroche unique.

QA connue : parcours public bureau des trois énigmes, mauvaises réponses refusées, reprise 2/3; émulation 360 × 800 et correctif de recouvrement vérifiés par le coordinateur. À 11 h 36 Toronto, le coordinateur rapporte que Pascal a répondu oui au clic entendu et au toucher direct sur son S20. C’est une confirmation utilisateur, pas un profilage matériel ni une écoute de cette nouvelle musique, qui n’existe pas encore. Les anciens constats contraires dans README/GAME sont historiques et seront clarifiés dans une future passe approuvée.

## Deux approches

**A — Web Audio procédural original, recommandé.** Une ambiance harmonique discrète et des bruits synthétiques mécaniques, fabriqués localement sans téléchargement, service ni licence externe. Dépendances nulles, réglages fins et faible poids; le réalisme du métal restera stylisé plutôt que celui d’un enregistrement de studio. Une écoute réelle reste indispensable pour éviter un résultat trop « bip ».

**B — Fichiers pré-rendus originaux ou sous licence explicite.** Meilleur réalisme possible, mixage stable, mais nouveaux assets, poids, boucles et décodage à gérer; des fichiers tiers imposent vérification de droits/attribution. Une fabrication originale pré-rendue serait légitime, mais inutile pour cette petite passe. Aucun enregistrement externe, titre commercial, Suno, crédits ou service génératif proposé.

## Direction musicale retenue à valider

Ambiance futuriste douce, sans percussion, voix, alarme ou montée de stress. Une nappe chaude et aérée, registre médium audible sur téléphone plutôt que sous-basses; quelques notes espacées, beaucoup de silence. Motif original de huit mesures à 72 pulsations/minute (environ 26,7 secondes), sans accent de chronomètre : centre ré, couleurs ré/fa/la/do/mi. Deux voix tenues filtrées plus une voix mélodique intermittente; pas de mélodie connue ni empruntée. Attaques de 0,4–0,8 s et relâchements de 1–2 s, changements harmoniques lents. La boucle n’accélère pas avec le temps écoulé.

Étape 0 : texture minimale. Après validation complète de l’alimentation : une couleur harmonique légèrement plus ouverte. Après validation complète des anneaux : motif un peu plus lumineux. Ouverture finale : accord de résolution d’environ deux secondes, puis nappe calme sans surenchère. Seules les étapes **déjà annoncées visuellement** changent la musique. Aucun changement en fonction d’une fiche correcte, d’un cran juste, d’un préfixe de séquence ou d’un indice demandé. La réussite n’est jamais annoncée avant le modèle.

Mixage : musique en retrait (cible de départ environ 10–14 dB sous les transitoires d’effets, à régler à l’écoute, pas promesse de volume acoustique). Pendant une ouverture, léger retrait de la musique de 3 dB sur 0,6 s. Pas de stéréo indispensable, chaque signal reste intelligible en mono. Pas de vibration matérielle requise.

## Effets et événements exacts

Tous les sons sont originaux, issus d’oscillateurs/enveloppes et d’un petit tampon de bruit filtré partagé.

| Événement confirmé | Son prévu |
|---|---|
| Fiche branchée / débranchée | Petit contact mat, clic métallique très court, légère différence insertion/retrait; même timbre pour toutes les associations |
| Anneau déplacé à un autre cran | Cran sec et bas, queue métallique discrète; identique quel que soit le symbole ou sa justesse |
| Languette inscrite | Glissement bref puis arrêt mécanique, identique pour chaque position de la séquence |
| Annuler / effacer séquence | Retour de ressort feutré, une fois par commande effective |
| Validation globale refusée / prise occupée | Butée mate douce, pas de sirène; même réponse sans information de justesse partielle |
| Étape acquise 0→1 ou 1→2 | Relais électrique discret puis rail/capot glissant, environ 0,5 s |
| Étape 2→3 acquise | Quatre retraits mécaniques regroupés, mouvement de couvercle et accord du noyau, durée totale environ 1,6 s |

Une action sans changement n’émet pas de faux enclenchement. Les glissements de caméra, réglages de volume, demandes d’indices et rotations visuelles annulées n’ajoutent pas d’effet de puzzle. Un drag d’anneau conserve un seul clic au cran effectivement relâché; pas de boucle sonore à chaque pointermove. L’aide « Appliquer » déclenche uniquement le son de l’étape acquise, pas une rafale d’actions fictives. Recharger une partie acquise ne rejoue aucune fanfare.

## Architecture ciblée et erreurs

- `app.js`, dans `act`, compare ancien/nouvel état puis appelle une fois `sound.handleAction({type,ok,changed,fromStage,toStage}, settings)`. Le contrat audio exclut les symboles, valeurs de crans et solutions; il ne peut pas tester la justesse partielle. La scène 3D n’émet pas directement de son. Ainsi HTML et toucher produisent exactement les mêmes événements.
- `audio.js` conserve un seul AudioContext paresseux, un bus musique, un bus effets, un master avec mute et limiteur doux. Petites enveloppes de gain (au moins 10 ms sur arrêt/mute) pour éviter les coupures parasites. Tous les nœuds transitoires sont arrêtés et déconnectés à leur fin.
- La planification de musique est indépendante du RAF et du moteur 3D : réveil environ toutes les 120 ms, horizon limité à 250 ms, au plus trois voix musicales et huit voix transitoires simultanées. Limiter les commandes répétées rapides et abandonner une requête excédentaire plutôt que dépasser la limite pendant la sortie amortie; aucune queue de sons retardés. Tampon bruit mono 1 seconde maximum, créé une fois. Pas de convolution, spatialisation lourde, worklet ou animation 3D continue ajoutée.
- Création/réactivation depuis un geste utilisateur effectif (pointeur ou clavier de commande), jamais au chargement ni depuis une minuterie. Si le navigateur refuse `resume`, capturer le rejet et garder le jeu utilisable; message discret une fois « Son indisponible, réessayez avec le bouton Son ». Nouvelle tentative seulement après un autre geste, pas de boucle automatique.
- Menu, perte de focus, onglet caché : arrêter la minuterie du séquenceur, annuler les notes futures et amortir les voix, puis suspendre le contexte. Aucun son caché, aucune reprise en rafale. Menu Reprendre ou prochain geste sur le jeu relance au point musical courant recalé, pas une accumulation des notes manquées. Retour visible sans geste : silence jusqu’au prochain geste autorisé. Un garde de génération neutralise les callbacks périmés.
- Mute global ou deux volumes à zéro : silence immédiat amorti, planificateur arrêté; aucune résurrection au changement d’étape. Unmute depuis le bouton réactive seulement si le contexte est autorisé. `dispose` est idempotent : retire les hooks propres au moteur, arrête minuteries/voix, déconnecte les bus et ferme le contexte.

## Réglages et compatibilité

Conserver le bouton Son comme mute global et le volume existant comme volume général, sans changer sa valeur sauvegardée. Ajouter au même menu deux curseurs accessibles « Musique » et « Effets », valeurs initiales proposées 0,25 et 0,8 (multiplicateurs du master, à équilibrer à l’écoute). Pas de panneaux superposés à la scène. Labels, commandes clavier et mute persistants.

Élargir `settings` avec `musicVolume` et `effectsVolume`, chacun borné [0,1]. **Conserver la clé et le format v1** : au restore, l’absence des deux champs dans une ancienne partie prend les défauts; préserver intégralement prises, anneaux, séquence, chrono, aides, volume général et mute. Si un champ ajouté est invalide, le normaliser au défaut sans détruire une sauvegarde de puzzle autrement valide. Copier uniquement les propriétés connues. Ne sérialiser ni contexte, ni nœud, ni position du séquenceur. Les nouvelles parties conservent les préférences comme actuellement.

## Vérification après approbation

TDD d’abord, sans toucher aux règles : ancienne sauvegarde à chaque étape, migration des deux volumes et champs invalides, mute préexistant, défauts et bornes. Tests d’événements : une action valide/refusée donne le bon type, no-op silencieux; les 24 routages et 216 triplets gardent les mêmes timbres avant validation; aucune donnée de solution ne traverse le contrat. Les 36 tests de base doivent rester verts.

Tests du cycle de vie audio avec horloge/contexte factices : un seul contexte après gestes répétés, promesse de resume rejetée capturée, aucune note après pause/dispose, aucune double minuterie après reprises, limite de polyphonie, arrêt des voix futures, volumes à zéro et mute avant premier geste. Rendu audio offline de sons représentatifs si disponible pour vérifier échantillons finis, pics sans saturation numérique et queue amortie; ce n’est pas une validation agréable à l’oreille.

QA d’écoute réelle bureau puis S20 : balance musique/effets à faible volume, casque et haut-parleur/mono, 10 minutes sans fatigue ni clic parasite, actions rapides, appels/app en arrière-plan, menu, mute/unmute, recharge à 2/3 et fin sans rejouer la révélation. Comparer fluidité et activité en arrière-plan avec musique active/coupée. La confirmation utilisateur antérieure du clic ne valide pas le nouveau mix. Aucune revendication de latence, fps ou consommation mesurés sans observation correspondante.

## Porte d’approbation et auto-relecture

Périmètre limité à audio, hooks d’événements et réglages compatibles; aucune énigme, modèle de difficulté, image, caméra ou navigation refondue. Pas d’oracle sonore de justesse partielle, de mode stress, d’enregistrement externe ou de service. Coûts de voix, mise en pause et sauvegardes explicitement bornés. Proposition relue sans placeholder; le caractère agréable du mix doit être validé par écoute, non déduit des tests.

**Approbation reçue : « Oui, je valide la musique futuriste douce, les effets mécaniques et les volumes séparés. Construis et publie cette version. » Prochaine étape : plan, construction locale testée et revue indépendante avant push.**

## Précision de construction
Le plafond de voix est strict et conservateur : les effets excédentaires sont abandonnés, jamais empilés dans une queue. Les validations d’étape contournent seulement l’anti-rebond des clics; la cadence reçoit priorité dans la limite des huit voix. Push retenu pour revue indépendante.
