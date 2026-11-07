export const SYMBOLS=['S','V','L','M','N','E'];
const permutation=a=>Array.isArray(a)&&a.length===4&&new Set(a).size===4&&a.every(x=>SYMBOLS.slice(0,4).includes(x));
const neighbor=(a,b)=>(a-b+6)%6===1||(b-a+6)%6===1;
export function powerValid(p){return permutation(p)&&p.indexOf('S')<p.indexOf('V')&&Math.abs(p.indexOf('S')-p.indexOf('V'))===1&&p.indexOf('S')<p.indexOf('M')&&Math.abs(p.indexOf('V')-p.indexOf('L'))===1;}
export function ringsValid(r,p){return Array.isArray(r)&&r.length===3&&r.every(x=>Number.isInteger(x)&&x>=0&&x<6)&&powerValid(p)&&neighbor(r[0],SYMBOLS.indexOf(p[2]))&&neighbor(r[1],r[0])&&(r[2]-r[1]+6)%6===3&&[p[0],p[3]].includes(SYMBOLS[r[2]]);}
export function releaseValid(q,r){if(!permutation(q)||!Array.isArray(r)||r.length!==3)return false;const [o,m,i]=r.map(x=>SYMBOLS[x]);return q.indexOf(o)<q.indexOf(m)&&q.indexOf(m)<q.indexOf(i)&&![0,3].includes(q.indexOf('L'))&&Math.abs(q.indexOf('L')-q.indexOf(i))!==1;}
export function fresh(challenge=false){return {v:1,power:[null,null,null,null],rings:[5,5,5],sequence:[],stage:0,hints:[0,0,0],assisted:[false,false,false],elapsed:0,challenge,settings:{muted:false,volume:.35,musicVolume:.25,effectsVolume:.8,reduced:false,clock:true}};}
export function transition(s,a){
 const fail=message=>({state:s,ok:false,message});
 let n=structuredClone(s), message='';
 switch(a.type){
 case 'connect':{
  if(s.stage!==0||!SYMBOLS.slice(0,4).includes(a.symbol)||!Number.isInteger(a.slot)||a.slot<0||a.slot>3)return fail('Connexion indisponible.');
  if(s.power[a.slot]&&s.power[a.slot]!==a.symbol)return fail('Prise occupée : débranchez sa fiche.');
  n.power=n.power.map(x=>x===a.symbol?null:x);n.power[a.slot]=a.symbol;message='Fiche enclenchée dans la prise '+(a.slot+1)+'.';break;}
 case 'unplug':if(s.stage!==0)return fail('Alimentation acquise.');n.power=n.power.map(x=>x===a.symbol?null:x);message='Fiche débranchée.';break;
 case 'power':if(s.stage!==0)return fail('Alimentation déjà acquise.');if(!powerValid(s.power))return fail('Routage incompatible avec les contraintes.');n.stage=1;message='Alimentation établie. Le cache des anneaux s’ouvre.';break;
 case 'ring':if(s.stage!==1||!Number.isInteger(a.index)||a.index<0||a.index>2||!Number.isInteger(a.value)||a.value<0||a.value>5)return fail('Anneau indisponible.');n.rings[a.index]=a.value;message='Cran enclenché.';break;
 case 'align':if(s.stage!==1)return fail('Anneaux indisponibles.');if(!ringsValid(s.rings,s.power))return fail('Alignement incompatible avec les contraintes.');n.stage=2;message='Anneaux accordés. Le volet des verrous s’ouvre.';break;
 case 'tab':if(s.stage!==2||!SYMBOLS.slice(0,4).includes(a.symbol)||s.sequence.includes(a.symbol))return fail('Languette indisponible.');n.sequence.push(a.symbol);message='Languette enregistrée, position '+n.sequence.length+'.';break;
 case 'undo':if(s.stage!==2)return fail('Séquence indisponible.');n.sequence.pop();message='Dernière languette annulée.';break;
 case 'clear':if(s.stage!==2)return fail('Séquence indisponible.');n.sequence=[];message='Séquence effacée.';break;
 case 'open':if(s.stage!==2)return fail('Poignée indisponible.');if(!releaseValid(s.sequence,s.rings))return fail('Séquence incompatible.');n.stage=3;message='Noyau stabilisé. Le coffret est ouvert.';break;
 case 'hint':if(s.stage>=3)return fail('Coffret résolu.');n.hints[s.stage]=Math.min(3,n.hints[s.stage]+1);message='Indice niveau '+n.hints[s.stage]+'.';break;
 case 'apply':if(s.stage>=3||s.hints[s.stage]<3)return fail('Révélez les trois indices avant cette aide.');n.assisted[s.stage]=true;if(s.stage===0)n.power=['S','V','L','M'];if(s.stage===1)n.rings=[1,0,3];if(s.stage===2)n.sequence=['V','L','S','M'];n.stage++;message='Étape appliquée avec aide.';break;
 case 'settings':for(const k of ['muted','reduced','clock'])if(typeof a[k]==='boolean')n.settings[k]=a[k];for(const k of ['volume','musicVolume','effectsVolume'])if(Number.isFinite(a[k]))n.settings[k]=Math.max(0,Math.min(1,a[k]));break;
 case 'untimed':n.challenge=false;message='Poursuite sans limite.';break;
 default:return fail('Action inconnue.');
 }
 return {state:n,ok:true,message};
}
export function tick(s,seconds,active){if(!active||s.stage===3||!Number.isFinite(seconds)||seconds<0||seconds>5)return s;return {...s,elapsed:s.elapsed+seconds};}
export function restore(raw){try{
 const s=JSON.parse(raw);
 if(!s||s.v!==1||!Number.isInteger(s.stage)||s.stage<0||s.stage>3||!Array.isArray(s.power)||s.power.length!==4||s.power.some(x=>x!==null&&!SYMBOLS.slice(0,4).includes(x))||new Set(s.power.filter(Boolean)).size!==s.power.filter(Boolean).length)return null;
 if(!Array.isArray(s.rings)||s.rings.length!==3||s.rings.some(x=>!Number.isInteger(x)||x<0||x>5)||!Array.isArray(s.sequence)||s.sequence.length>4||new Set(s.sequence).size!==s.sequence.length||s.sequence.some(x=>!SYMBOLS.slice(0,4).includes(x)))return null;
 if(!Number.isFinite(s.elapsed)||s.elapsed<0||typeof s.challenge!=='boolean'||!s.settings||!['muted','reduced','clock'].every(k=>typeof s.settings[k]==='boolean')||!Number.isFinite(s.settings.volume)||s.settings.volume<0||s.settings.volume>1)return null;
 if(!Array.isArray(s.hints)||s.hints.length!==3||s.hints.some(x=>!Number.isInteger(x)||x<0||x>3)||!Array.isArray(s.assisted)||s.assisted.length!==3||s.assisted.some(x=>typeof x!=='boolean'))return null;
 if(s.stage>0&&!powerValid(s.power)||s.stage>1&&!ringsValid(s.rings,s.power)||s.stage>2&&!releaseValid(s.sequence,s.rings)||s.stage<2&&s.sequence.length)return null;
 if(s.stage===0&&s.rings.some(x=>x!==5)||s.hints.some((x,i)=>i>s.stage&&x!==0)||s.assisted.some((x,i)=>x&&(i>=s.stage||s.hints[i]!==3)))return null;
 // Copy the known schema only; untrusted saves cannot add settings or properties.
 const n=fresh(s.challenge);for(const k of ['power','rings','sequence','stage','hints','assisted','elapsed'])n[k]=s[k];for(const k of Object.keys(n.settings)){if(['musicVolume','effectsVolume'].includes(k)){const value=s.settings[k];if(Number.isFinite(value)&&value>=0&&value<=1)n.settings[k]=value;}else n.settings[k]=s.settings[k];}return n;
 }catch{return null;}}
