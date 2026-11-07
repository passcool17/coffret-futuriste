import {IDS} from './puzzles.js?v=replay-bank-v1';
const uint32=x=>Number.isInteger(x)&&x>0&&x<=0xffffffff;
function next(x){x^=x<<13;x^=x>>>17;x^=x<<5;return x>>>0;}
export function makeSeed(){
 const a=new Uint32Array(1);
 try{globalThis.crypto.getRandomValues(a);}catch{a[0]=Math.floor(Math.random()*0x100000000);}
 return a[0]||0x6d2b79f5;
}
export function bagFor(selector){
 if(!uint32(selector?.bagSeed))throw new RangeError('Graine invalide.');
 let state=selector.bagSeed;const ids=[...IDS];
 for(let i=ids.length-1;i>0;i--){state=next(state);const j=state%(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}
 if(ids[0]===selector.avoidId)[ids[0],ids[1]]=[ids[1],ids[0]];
 return {ids,endState:state};
}
export function validSelection(config,selector){
 if(config?.bankVersion!==1||!IDS.includes(config.dossierId)||selector?.version!==1||!uint32(selector.initialSeed)||!uint32(selector.bagSeed)||!Number.isInteger(selector.cursor)||selector.cursor<1||selector.cursor>12||selector.avoidId!==null&&!IDS.includes(selector.avoidId))return false;
 if(selector.avoidId===null&&selector.bagSeed!==selector.initialSeed)return false;
 return bagFor(selector).ids[selector.cursor-1]===config.dossierId;
}
export function selectNext(previous=null,seed){
 let selector;
 if(previous){
  const current=bagFor(previous).ids[previous.cursor-1];
  if(!validSelection({bankVersion:1,dossierId:current},previous))throw new RangeError('Sélecteur invalide.');
  selector=previous.cursor<12?{...previous,cursor:previous.cursor+1}:{version:1,initialSeed:previous.initialSeed,bagSeed:bagFor(previous).endState,avoidId:current,cursor:1};
 }else{const initialSeed=(seed===undefined?makeSeed():seed>>>0)||0x6d2b79f5;selector={version:1,initialSeed,bagSeed:initialSeed,avoidId:null,cursor:1};}
 return {config:{bankVersion:1,dossierId:bagFor(selector).ids[selector.cursor-1]},selector};
}
