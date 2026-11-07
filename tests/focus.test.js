import {audioEvent} from '../src/audio-events.js';
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {fresh,SYMBOLS} from '../src/model.js';import {names,glyphs} from '../src/content.js';
let replaceControls;try{({replaceControls}=await import('../src/control-focus.js'));}catch{}
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
function run(state,view,activeId){
 const doc={activeElement:null};let nodes=[];
 const container={contains:n=>nodes.includes(n),querySelectorAll:()=>nodes,get innerHTML(){return '';},set innerHTML(html){const removed=nodes.includes(doc.activeElement);nodes=[...html.matchAll(/<(button|select)\b([^>]*)>/g)].map(m=>{const attrs=m[2],id=/\bid="([^"]+)"/.exec(attrs)?.[1]||'',tab=/data-tab="([^"]+)"/.exec(attrs)?.[1];return {id,disabled:/\bdisabled\b/.test(attrs),dataset:{tab},focus(){doc.activeElement=this;}};});if(removed)doc.activeElement={id:'body'};}};
 const external={id:'view-all',focus(){doc.activeElement=this;}};const $=id=>id==='controls'?container:nodes.find(n=>n.id===id)||(id==='view-all'?external:null);
 const option=(value,text,selected)=>`<option value="${value}" ${selected?'selected':''}>${text}</option>`;
 const source=app.slice(app.indexOf('function controls()'),app.indexOf('function render()'));
 const controls=new Function('state','view','SYMBOLS','names','glyphs','document','$','option','replaceControls',source+'\nreturn controls;')(state,view,SYMBOLS,names,glyphs,doc,$,option,replaceControls);
 controls();doc.activeElement=nodes.find(n=>n.id===activeId)||{id:activeId};controls();return {active:doc.activeElement.id,nodes};
}
test('pulled tab advances keyboard to another available latch',()=>{const state={...fresh(),stage:2,sequence:['V']};assert.equal(run(state,2,'tab-V').active,'tab-L');});
test('last physical latch wraps to an unused latch, not undo',()=>{const state={...fresh(),stage:2,sequence:['M']};assert.equal(run(state,2,'tab-M').active,'tab-S');});
test('fourth pulled latch focuses the enabled final handle',()=>{const state={...fresh(),stage:2,sequence:['V','L','S','M']};assert.equal(run(state,2,'tab-M').active,'action-open');});
test('every rebuilt action has stable id; failed verification keeps focus',()=>{for(let view=0;view<3;view++){const state={...fresh(),stage:view};const r=run(state,view,['action-power','action-align','action-undo'][view]);assert.ok(r.nodes.every(n=>n.id),'every interactive node needs a stable ID');assert.equal(r.active,['action-power','action-align','action-undo'][view]);}});
test('all-disabled completed module falls back outside controls',()=>assert.equal(run({...fresh(),stage:3},2,'tab-M').active,'view-all'));
test('external focus is not stolen during redraw',()=>assert.equal(run(fresh(),0,'hintButton').active,'hintButton'));
test('stage progression explicitly hands keyboard focus to new module',async()=>{const {transition}=await import('../src/model.js');const focus={id:'action-power'},doc={activeElement:focus};let handed;const source=app.slice(app.indexOf('function act('),app.indexOf('function format('));const act=new Function('state','transition','document','$','announce','sound','save','render','scene','setView','view','won','audioEvent','let running=true;'+source+'\nreturn act;')({...fresh(),power:['S','V','L','M']},transition,doc,()=>({contains:n=>n===focus}),()=>{},{handleAction(){},sync(){},resume(){}},()=>{},()=>{doc.activeElement={id:'body'};},null,(v,force)=>{handed=force;},0,false,audioEvent);act({type:'power'});assert.equal(handed,true);});
