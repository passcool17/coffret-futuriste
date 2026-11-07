import {SYMBOLS,ACTIVE,getPuzzle,solutionsFor} from './puzzles.js?v=replay-bank-v1';
export const names={S:'Soleil',V:'Vague',L:'Feuille',M:'Montagne',N:'Lune',E:'Étoile'};
export const glyphs={S:'☼',V:'≋',L:'♧',M:'△',N:'☾',E:'☆'};
export const titles=['01 / Acheminer l’énergie','02 / Accorder les anneaux','03 / Libérer le noyau','Noyau stabilisé'];
export const intros=['Quatre fiches. Quatre prises. Déduisez le routage puis levez l’interrupteur.','Les prises alimentées sont votre clé. Réglez les trois symboles sous les repères fixes du haut, un par anneau, puis vérifiez.','Tirez les quatre languettes dans l’ordre déduit, puis soulevez la poignée. Une languette ne peut être utilisée qu’une fois.','Le coffret a retrouvé son équilibre. Les modules restent consultables.'];
export const clues=[['Le soleil précède la vague.','Soleil et vague occupent des prises voisines.','Le soleil précède la montagne.','La vague et la feuille occupent des prises voisines.'],['Le symbole extérieur est voisin du symbole alimenté par la prise 3.','Le symbole du milieu est voisin du symbole extérieur.','Le symbole intérieur est opposé à celui du milieu.','Le symbole intérieur provient de la prise 1 ou de la prise 4.'],['Libérer le symbole extérieur avant celui du milieu.','Libérer le symbole du milieu avant celui de l’intérieur.','La feuille n’est ni la première ni la dernière.','La feuille ne doit pas être voisine du symbole intérieur dans la séquence.']];
export const definitions=['« Avant » = à gauche, pas nécessairement juste à côté. « Voisins » = deux prises consécutives, sans bouclage 4–1.','Cadran horaire : Soleil → Vague → Feuille → Montagne → Lune → Étoile → Soleil. Voisins = un pas, opposés = trois pas. Le petit triangle fixe au sommet de chaque anneau désigne le symbole lu. Les relations portent sur les symboles affichés au repère, pas sur les rayons des anneaux.','« Avant » ne veut pas dire immédiatement avant. « Voisins » = deux positions consécutives, sans relier la dernière à la première.'];
export const hints=[['Croisez les deux contraintes qui citent la vague.','Soleil–vague–feuille forment un bloc. Où reste la montagne ?','Prises 1 à 4 : Soleil, Vague, Feuille, Montagne.'],['Relisez les prises 1, 3 et 4. Cherchez les deux possibilités de l’intérieur.','Le milieu doit être soleil ou montagne. Lequel peut être voisin d’un candidat de l’extérieur ?','Extérieur : Vague. Milieu : Soleil. Intérieur : Montagne.'],['Remplacez les noms des anneaux par leurs symboles.','Vague précède Soleil, qui précède Montagne. Où placer Feuille sans toucher Montagne ?','Ordre : Vague, Feuille, Soleil, Montagne.']];
export function resumeMessage(state){
 if(state.stage===3)return 'Noyau stabilisé. Le coffret est ouvert; vous pouvez revoir les mécanismes.';
 if(state.stage===2)return 'Progression reprise : 2 / 3. Les anneaux sont accordés. Déduisez l’ordre des languettes pour libérer les verrous.';
 if(state.stage===1)return 'Progression reprise : 1 / 3. L’alimentation est établie. Accordez les trois anneaux.';
 const connected=state.power.filter(Boolean).length;
 return connected?`Alimentation en cours : ${connected} / 4 fiches branchées. Poursuivez le routage puis levez l’interrupteur.`:'Réveillez le noyau. Commencez par l’alimentation à gauche.';
}

const roleTerms={O:'le symbole extérieur',T:'le symbole du milieu',I:'le symbole intérieur',F:'le symbole restant'};
const ringNames={O:'l’anneau extérieur',T:'l’anneau du milieu',I:'l’anneau intérieur'};
const capitalize=s=>s[0].toUpperCase()+s.slice(1);
function term(ref,stage,state){
 if(Array.isArray(ref))return 'le symbole alimenté par la prise '+ref[1];
 if(roleTerms[ref]){
  let text=roleTerms[ref];
  if(stage===2&&state.stage>=2){const symbol=ref==='F'?ACTIVE.find(x=>!state.rings.map(i=>SYMBOLS[i]).includes(x)):SYMBOLS[state.rings['OTI'.indexOf(ref)]];text+=' ('+names[symbol]+')';}
  return text;
 }
 return names[ref];
}
function sentence([type,a,b,c],stage,state){
 const x=term(a,stage,state),y=type==='in'||type==='notend'?null:term(b,stage,state);
 let text;
 if(type==='before')text=`${x} précède ${y}`;
 if(type==='adj')text=`${x} et ${y} sont voisins`;
 if(type==='notadj')text=`${x} et ${y} ne sont pas voisins`;
 if(type==='between')text=`${x} est entre ${y} et ${term(c,stage,state)}`;
 if(type==='notend')text=`${x} n’est ni premier ni dernier`;
 if(type==='opposite')text=`${x} est opposé à ${y}`;
 if(type==='next')text=`${x} suit immédiatement ${y} sur le cadran horaire`;
 if(type==='in')text=`${x} provient de la prise ${b[0][1]} ou de la prise ${b[1][1]}`;
 return capitalize(text)+'.';
}
function compact([type,a,b,c]){
 const x=glyphs[a],y=glyphs[b];
 if(type==='between')return `entre(${x};${y},${glyphs[c]})`;
 return `${x} ${{before:'<',adj:'~',notadj:'≁'}[type]} ${y}`;
}
const linearDefinition='« Avant » = à gauche, pas nécessairement juste à côté. « Voisins » = deux positions consécutives, sans bouclage 4–1. « Entre » = position strictement entre les deux autres, pas nécessairement voisine. < précède; ~ voisins; ≁ non voisins; entre(X;Y,Z) : X est entre Y et Z.';
function dossierHints(puzzle,answer){
 const [A,B,C,D]=[...puzzle.order].map(s=>names[s]);const [U,V,W]=[...puzzle.roles].map(r=>ringNames[r]);const j=puzzle.anchor,[k,l]=puzzle.pair;
 const power={
  A:['Croisez les deux relations de voisinage.',`${A}, ${B}, ${C} forment un bloc dans cet ordre. L’autre position du bloc placerait ${D} avant ${A}.`],
  B:[`Croisez la précédence et le voisinage qui portent sur ${A} et ${B}.`,`Le bloc ${A}–${B} a trois emplacements possibles. La règle Entre exclut celui du milieu; la non-voisineté de ${A} et ${C} exclut celui de droite.`],
  C:[`${A} doit être avant deux symboles. Quelles positions restent possibles ?`,`Si ${A} était deuxième, ${D} serait premier et le toucherait. Placez donc ${A} en premier, puis utilisez Entre.`]
 }[puzzle.family];
 const ring={
  A:[`Relevez les symboles des prises ${j}, ${k} et ${l}; ne confondez pas positions sur le coffret et positions dans le cadran.`,`${U} a deux candidats. Pour chacun, déduisez les deux candidats de ${V} par voisinage avec ${U}, puis leur opposé pour ${W}. La paire des prises ${k}/${l} élimine trois branches.`],
  B:[`Relevez les symboles des prises ${j}, ${k} et ${l}; « suit immédiatement » se lit dans le cadran horaire, pas comme un geste à effectuer.`,`${U} a deux candidats; chacun donne deux candidats pour ${V}. Déduisez pour ${W} le symbole qui suit celui de ${V}, puis éliminez avec les prises ${k}/${l}.`],
  C:[`Relevez les symboles des prises ${j}, ${k} et ${l}, puis la relation d’opposition.`,`Pour chacun des deux candidats de ${U}, déduisez son opposé pour ${V}, puis les deux candidats de ${W} voisins du symbole de ${V}. La paire des prises ${k}/${l} élimine trois branches.`]
 }[puzzle.family];
 const sequence={
  A:['Traduisez extérieur, milieu et intérieur avec le carnet des résultats acquis; identifiez le symbole restant.','Conservez la chaîne extérieur → milieu → intérieur. Le symbole restant doit se placer à l’intérieur, sans toucher celui de l’anneau intérieur.'],
  B:['Le symbole intérieur et celui de l’extérieur forment un bloc orienté.','Examinez les trois emplacements de ce bloc sur le papier. Entre et la non-voisineté avec le symbole restant éliminent deux emplacements.'],
  C:['Celui du milieu doit précéder deux autres symboles; identifiez aussi le symbole restant.','Le symbole du milieu doit être premier, sinon celui de l’extérieur le toucherait. La règle Entre fixe ensuite les trois autres.']
 }[puzzle.family];
 const list=a=>a.map(s=>names[s]).join(', ');
 return [[...power,'Prises 1 à 4 : '+list(answer.power)+'.'],[...ring,`Extérieur : ${names[SYMBOLS[answer.rings[0]]]}. Milieu : ${names[SYMBOLS[answer.rings[1]]]}. Intérieur : ${names[SYMBOLS[answer.rings[2]]]}.`],[...sequence,'Ordre : '+list(answer.sequence)+'.']].map(levels=>levels.map(capitalize));
}
export function puzzleContent(state){
 const puzzle=getPuzzle(state.config);
 if(!puzzle)throw new RangeError('Dossier inconnu.');
 if(puzzle.family==='legacy')return {id:puzzle.id,clues,definitions,hints,plates:['☼ < ≋   /   ☼ ~ ≋','☼ < △   /   ≋ ~ ♧']};
 const rules=puzzle.constraints,power=rules[0].map(compact);
 return {id:puzzle.id,clues:rules.map((cs,stage)=>cs.map(c=>sentence(c,stage,state))),
  definitions:[linearDefinition,definitions[1]+' « Suit immédiatement » désigne le symbole suivant dans ce cadran, pas un geste à effectuer.',linearDefinition+' Le symbole restant est celui des quatre languettes qui n’apparaît à aucun des trois repères acquis.'],
  hints:dossierHints(puzzle,solutionsFor(state.config)),plates:[power.slice(0,2).join(' / '),power.slice(2).join(' / ')]};
}
