import fs from 'node:fs';import * as model from '../../src/model.js';import * as content from '../../src/content.js';import {createPersistence} from '../../src/session-storage.js';import {audioEvent} from '../../src/audio-events.js';
export function appRig(raw=null,{deferScene=false}={}){
 class Node extends EventTarget{constructor(id){super();this.id=id;this.dataset={};this.hidden=false;this.open=false;this.checked=false;this.value='0';this.textContent='';this.inert=false;}replaceChildren(...children){this.children=children;}contains(){return false;}querySelector(){return null;}querySelectorAll(){return [];}showModal(){this.open=true;}close(){this.open=false;}focus(){doc.activeElement=this;}}
 const nodes=new Map(),get=id=>{if(!nodes.has(id))nodes.set(id,new Node(id));return nodes.get(id);};
 const views=[-1,0,1,2].map(v=>{const n=get(v<0?'view-all':'view-'+v);n.dataset.view=String(v);n.setAttribute=()=>{};return n;});
 const doc=new Node('document');doc.hasFocus=()=>true;doc.activeElement=get('view-all');doc.createElement=()=>new Node('li');doc.getElementById=get;doc.querySelectorAll=s=>s==='[data-view]'?views:[];doc.querySelector=s=>s==='dialog[open]'?[...nodes.values()].find(n=>['menu','win','timeout'].includes(n.id)&&n.open)||null:null;doc.hidden=false;
 const window=new Node('window'),ticks=[],timeouts=[],sceneLoads=[];let confirmation=true,sceneBuilds=0;
 const storage={raw,writes:0,getItem(){if(this.readError)throw Error('denied');return this.raw;},setItem(key,value){if(this.writeError)throw Error('quota');if(key!=='coffret-futuriste:v1')throw Error('wrong key');this.writes++;this.raw=value;}};
 const sound={resume(){},pause(){},dispose(){},sync(){},handleAction(){}};
 const source=fs.readFileSync(new URL('../../src/app.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace(/await import\('\.\/scene\.js[^']*'\)/g,'await loadScene()');
 const env={...model,...content,createPersistence,audioEvent,audio:()=>sound,replaceControls:(node,html)=>{node.innerHTML=html;},document:doc,window,localStorage:storage,matchMedia:()=>({matches:false}),confirm:()=>confirmation,setInterval:fn=>{ticks.push(fn);},setTimeout:fn=>{timeouts.push(fn);},loadScene:()=>{const module={createScene:()=>{sceneBuilds++;return {focus(){},update(){},dispose(){},cancel(){},zoom(){}};}};return deferScene?new Promise(resolve=>sceneLoads.push(()=>resolve(module))):Promise.resolve(module);}};
 const api=new Function(...Object.keys(env),source+'\nreturn {act,newGame,getState:()=>state};')(...Object.values(env));
 return {...api,nodes,storage,get,active:()=>doc.activeElement,sceneBuilds:()=>sceneBuilds,resolveScene:()=>sceneLoads.shift()?.(),tick:()=>ticks.forEach(fn=>fn()),confirm:value=>{confirmation=value;},flushTimeouts:()=>timeouts.splice(0).forEach(fn=>fn())};
}
