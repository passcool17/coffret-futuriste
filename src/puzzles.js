export const SYMBOLS=Object.freeze(['S','V','L','M','N','E']);
export const ACTIVE=Object.freeze(SYMBOLS.slice(0,4));
export const LEGACY=Object.freeze({bankVersion:0,dossierId:'legacy-v1'});
const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
const linear={
 A:[['before','A','B'],['before','A','D'],['adj','A','B'],['adj','B','C']],
 B:[['before','A','B'],['adj','A','B'],['notadj','A','C'],['between','C','B','D']],
 C:[['before','A','B'],['before','A','C'],['notadj','A','D'],['between','C','B','D']]
};
const rows=[
 ['A1','LMVS','OTI',3,[2,4]],['A2','LVMS','TOI',2,[3,4]],
 ['A3','MVLS','ITO',2,[1,4]],['A4','SLMV','TIO',2,[1,3]],
 ['B1','VMLS','OIT',4,[2,3]],['B2','SVML','ITO',1,[3,4]],
 ['B3','SMLV','OTI',1,[2,3]],['B4','VLMS','TIO',4,[2,3]],
 ['C1','MVSL','TOI',2,[1,4]],['C2','LSMV','TIO',1,[2,4]],
 ['C3','MSVL','OTI',4,[2,3]],['C4','LVSM','IOT',1,[2,3]]
];
function build(id,order,roles,anchor,pair){
 const family=id[0],map=Object.fromEntries([...order].map((symbol,i)=>['ABCD'[i],symbol]));
 const [u,v,w]=roles;
 const power=linear[family].map(([type,...args])=>[type,...args.map(x=>map[x])]);
 const rings=[['adj',u,['P',anchor]], [family==='C'?'opposite':'adj',v,u],
  [family==='A'?'opposite':family==='B'?'next':'adj',w,v],['in',w,pair.map(n=>['P',n])]];
 const sequence=family==='A'?[['before','O','T'],['before','T','I'],['notend','F'],['notadj','F','I']]:
  family==='B'?[['before','I','O'],['adj','I','O'],['notadj','I','F'],['between','F','O','T']]:
  [['before','T','F'],['before','T','I'],['notadj','T','O'],['between','I','F','O']];
 return {id,family,order,roles,anchor,pair,constraints:[power,rings,sequence]};
}
const bank=new Map(rows.map(row=>{const p=freeze(build(...row));return [p.id,p];}));
export const IDS=Object.freeze(rows.map(row=>row[0]));
const legacy=build('A0','SVLM','OTI',3,[1,4]);
legacy.id='legacy-v1';legacy.family='legacy';
legacy.constraints[0]=[['before','S','V'],['adj','S','V'],['before','S','M'],['adj','V','L']];
legacy.constraints[2]=[['before','O','T'],['before','T','I'],['notend','L'],['notadj','L','I']];
freeze(legacy);
export function getPuzzle(config=LEGACY){
 if(config?.bankVersion===0&&config.dossierId==='legacy-v1')return legacy;
 return config?.bankVersion===1?bank.get(config.dossierId)||null:null;
}
export function constraintsFor(config,stage){
 const p=getPuzzle(config);if(!p||!Number.isInteger(stage)||stage<0||stage>2)throw new RangeError('Dossier inconnu.');
 return p.constraints[stage];
}
const isPermutation=a=>Array.isArray(a)&&a.length===4&&new Set(a).size===4&&a.every(x=>ACTIVE.includes(x));
export function matches(candidate,constraints,{stage=0,power=[],rings=[]}={}){
 if(stage===1){if(!Array.isArray(candidate)||candidate.length!==3||candidate.some(x=>!Number.isInteger(x)||x<0||x>5))return false;}
 else if(!isPermutation(candidate))return false;
 function symbol(ref){
  if(Array.isArray(ref)&&ref[0]==='P')return power[ref[1]-1];
  if(['O','T','I'].includes(ref))return SYMBOLS[rings['OTI'.indexOf(ref)]];
  if(ref==='F')return ACTIVE.find(x=>!rings.map(i=>SYMBOLS[i]).includes(x));
  return ref;
 }
 function value(ref){
  if(stage===1){if(typeof ref==='string'&&'OTI'.includes(ref))return candidate['OTI'.indexOf(ref)];return SYMBOLS.indexOf(symbol(ref));}
  return candidate.indexOf(symbol(ref));
 }
 return constraints.every(([type,a,b,c])=>{
  const x=value(a);if(!Number.isInteger(x)||x<0)return false;
  if(type==='in')return b.some(ref=>x===value(ref));
  if(type==='notend')return x!==0&&x!==3;
  const y=value(b);if(!Number.isInteger(y)||y<0)return false;
  const distance=stage===1?(x-y+6)%6:Math.abs(x-y);
  if(type==='before')return x<y;
  if(type==='adj')return stage===1?distance===1||distance===5:distance===1;
  if(type==='notadj')return distance!==1;
  if(type==='opposite')return distance===3;
  if(type==='next')return distance===1;
  if(type==='between'){const z=value(c);return z>=0&&Math.min(y,z)<x&&x<Math.max(y,z);}
  return false;
 });
}
const permutations=a=>a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>i!==j)).map(r=>[x,...r])):[[]];
const permutations4=permutations(ACTIVE);
const triples=Array.from({length:216},(_,n)=>[Math.floor(n/36),Math.floor(n/6)%6,n%6]);
const answers=new Map();
export function solutionsFor(config=LEGACY){
 const puzzle=getPuzzle(config);if(!puzzle)throw new RangeError('Dossier inconnu.');
 if(answers.has(puzzle.id))return answers.get(puzzle.id);
 const answer={power:[],rings:[],sequence:[]};
 for(let stage=0;stage<3;stage++){
  const candidates=(stage===1?triples:permutations4).filter(candidate=>matches(candidate,puzzle.constraints[stage],{stage,power:answer.power,rings:answer.rings}));
  if(candidates.length!==1)throw new Error('Dossier non unique : '+puzzle.id);
  answer[['power','rings','sequence'][stage]]=candidates[0];
 }
 freeze(answer);answers.set(puzzle.id,answer);return answer;
}
