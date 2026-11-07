const KEY='coffret-futuriste:v1';
// A single atomic key. The original raw value also remains available in this session.
export function createPersistence(storage,decode){
 let status='unloaded',originalRaw=null;
 return {
  get status(){return status;},get originalRaw(){return originalRaw;},
  load(){
   let raw;try{raw=storage.getItem(KEY);}catch{status='unavailable';return null;}
   originalRaw=raw;
   if(raw===null){status='empty';return null;}
   let state;try{state=decode(raw);}catch{state=null;}
   status=state?'ready':'blocked';return state||null;
  },
  save(state){
   if(!['ready','empty'].includes(status))return false;
   try{storage.setItem(KEY,JSON.stringify(state));status='ready';return true;}
   catch{status='unavailable';return false;}
  },
  allowReplacement(){status='ready';},
  playInMemory(){status='memory';}
 };
}
