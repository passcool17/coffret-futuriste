// Preserve keyboard position across replacement; never steal focus from outside.
export function replaceControls(container,html,document,fallback){
 const active=document.activeElement;
 const owned=container.contains(active);
 const old=[...container.querySelectorAll('button,select')];
 const index=old.indexOf(active),id=active?.id,isTab=Boolean(active?.dataset?.tab);
 container.innerHTML=html;
 if(!owned)return;
 const nodes=[...container.querySelectorAll('button,select')];
 const same=nodes.find(n=>n.id===id&&!n.disabled);
 let target=same;
 if(!target&&isTab){
  const tabs=nodes.filter(n=>n.dataset.tab);
  const at=tabs.findIndex(n=>n.id===id);
  const ordered=[...tabs.slice(at+1),...tabs.slice(0,at+1)];
  target=ordered.find(n=>!n.disabled)||nodes.find(n=>n.id==='action-open'&&!n.disabled);
 }
 if(!target){const ordered=[...nodes.slice(index+1),...nodes.slice(0,index+1)];target=ordered.find(n=>!n.disabled);}
 (target||fallback)?.focus({preventScroll:true});
}
