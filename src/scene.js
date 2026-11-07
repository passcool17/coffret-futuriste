import * as THREE from '../vendor/three.module.js';
import {SYMBOLS} from './model.js?v=replay-bank-v1';
import {names,glyphs,puzzleContent} from './content.js?v=replay-bank-v1';
import {createRing,drawSymbol,RING_DEPTH,ringValueFromDrag} from './ring-graphics.js?v=replay-bank-v1';

export function createScene(canvas,dispatch,notify){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setClearColor(0x0b151b,0);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
 const world=new THREE.Scene(),camera=new THREE.PerspectiveCamera(38,1,.1,100);
 world.add(new THREE.HemisphereLight(0xc2e7ed,0x192027,2.3));const key=new THREE.DirectionalLight(0xffe9c7,3);key.position.set(-3,6,10);world.add(key);const fill=new THREE.DirectionalLight(0x73b9cf,1.4);fill.position.set(7,-3,4);world.add(fill);
 const mat=(color,metalness=.3,roughness=.5)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
 const graphite=mat(0x25343c,.65,.38),black=mat(0x0b151b,.3,.7),metal=mat(0x70838b,.8,.32),accent=mat(0x8ebeb1,.5,.32),amber=mat(0xd4a66b,.4,.5);
 const boxGeo=new THREE.BoxGeometry(1,1,1),targets=[],textures=[];
 function box(parent,x,y,z,w,h,d,material=graphite){const mesh=new THREE.Mesh(boxGeo,material);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;}
 function label(parent,text,x,y,z,w=1,h=.2,color='#c8dfdf',bg=null){const c=document.createElement('canvas');c.width=512;c.height=Math.max(32,Math.min(512,Math.round(512*h/w)));const ctx=c.getContext('2d');if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);}ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${Math.round(c.height*.65)}px system-ui`;const symbol=Object.keys(glyphs).find(k=>glyphs[k]===text);if(symbol)drawSymbol(ctx,symbol,c.width/2,c.height/2,Math.min(c.width,c.height)*.85,color);else ctx.fillText(text,c.width/2,c.height/2,c.width*.94);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;textures.push(texture);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false}));mesh.position.set(x,y,z);parent.add(mesh);return mesh;}
 function pick(mesh,data){mesh.userData.action=data;targets.push(mesh);return mesh;}
 const base=new THREE.Group();world.add(base);
 box(base,0,0,-.45,10.7,4.4,.85,graphite);box(base,0,0,.01,10.25,4.02,.16,black);
 for(const x of [-5.25,5.25])for(const y of [-2,2])box(base,x,y,-.28,.35,.48,.85,metal);
 box(base,0,0,.14,8.9,3.3,.15,black);
 const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.66,1),new THREE.MeshStandardMaterial({color:0x99e6d2,emissive:0x42b8a1,emissiveIntensity:.6,metalness:.5,roughness:.3,flatShading:true}));core.position.set(0,0,-.05);base.add(core);
 const cradle=new THREE.Mesh(new THREE.TorusGeometry(.95,.11,8,48),metal);cradle.position.set(0,0,.12);base.add(cradle);
 const lidPivot=new THREE.Group();lidPivot.position.set(0,2.03,.2);base.add(lidPivot);const lid=new THREE.Group();lid.position.y=-2.03;lidPivot.add(lid);
 box(lid,0,0,.05,10.5,4.16,.24,graphite);
 for(const x of [-3.35,0,3.35]){box(lid,x,0,.22,3.16,3.75,.12,black);box(lid,x,1.79,.32,2.92,.035,.035,metal);}
 // Small repeated fasteners use one draw call.
 const bolts=new THREE.InstancedMesh(new THREE.CylinderGeometry(.045,.045,.04,6),metal,8);let bi=0;for(const x of [-5,-1.7,1.7,5])for(const y of [-1.88,1.88]){const m=new THREE.Matrix4().compose(new THREE.Vector3(x,y,.22),new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI/2,0,0)),new THREE.Vector3(1,1,1));bolts.setMatrixAt(bi++,m);}lid.add(bolts);
 label(lid,'01 / ÉNERGIE',-3.35,1.48,.36,2.5,.22);label(lid,'02 / ACCORD',0,1.48,.36,2.5,.22);label(lid,'03 / LIBÉRATION',3.35,1.48,.36,2.5,.22);
 const sourceX=[-4.48,-3.73,-2.98,-2.23],homeX=[-2.98,-3.73,-2.23,-4.48],homeY=-.79,socketY=.67;
 const plugs=[],wires=[],sockets=[];const cableColors=[0xd5b276,0x87bac8,0x9dbba1,0xa6a8c5];
 function tube(points,color){return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.038,5,false),mat(color,.25,.55));}
 function cable(i,end){const x=homeX[i];const points=[new THREE.Vector3(x,-1.48,.42),new THREE.Vector3(x-.2,-1.1,.64),new THREE.Vector3((x+end.x)/2,-.35,.72),new THREE.Vector3(end.x,end.y,.61)];return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),20,.038,5,false);}
 for(let i=0;i<4;i++){
  const x=sourceX[i];const socket=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.12,20),metal);socket.rotation.x=Math.PI/2;socket.position.set(x,socketY,.45);lid.add(socket);pick(socket,{kind:'socket',slot:i});sockets.push(socket);label(lid,String(i+1),x,1.03,.5,.35,.24);
  const plug=box(lid,homeX[i],homeY,.64,.42,.38,.19,mat(cableColors[i],.55,.4));pick(plug,{kind:'plug',index:i,symbol:SYMBOLS[i]});plugs.push(plug);label(plug,glyphs[SYMBOLS[i]],0,0,.56,.65,.65,'#10252b');
  label(lid,names[SYMBOLS[i]],homeX[i],-1.68,.48,.7,.18);
  const w=tube([new THREE.Vector3(x,-1.48,.42),new THREE.Vector3(x,homeY,.6)],cableColors[i]);w.geometry.dispose();w.geometry=cable(i,plug.position);lid.add(w);wires.push(w);
 }
 const powerSwitch=pick(box(lid,-3.35,-.08,.5,.65,.36,.2,amber),{kind:'power'});label(lid,'VÉRIFIER',-3.35,-.37,.6,1,.15);
 const rings=[],ringLabels=[],radii=[1.23,.88,.53];
 for(let i=0;i<3;i++){
  const group=new THREE.Group();group.position.z=.48;lid.add(group);rings.push(group);
  const ring=createRing(THREE,document,radii[i],i===1?accent:metal,i===1?'#8ebeb1':'#70838b');textures.push(ring.material[0].map);group.add(ring);pick(ring,{kind:'ring',index:i});
  const l=label(lid,'',0,-1.46-i*.17,.6,2.5,.15);l.visible=false;ringLabels.push(l);
 }
 const referenceMaterial=new THREE.MeshBasicMaterial({color:0xffe06a,toneMapped:false});
 for(let i=0;i<3;i++){const pointer=new THREE.Mesh(new THREE.ConeGeometry(.045,.06,3),referenceMaterial);pointer.rotation.z=Math.PI;pointer.position.set(0,radii[i]+.175,.48+RING_DEPTH+.02);pointer.userData.ringReference=i+1;lid.add(pointer);}
 pick(box(lid,0,-1.63,.45,.9,.3,.12,amber),{kind:'align'});label(lid,'VÉRIFIER',0,-1.63,.53,.84,.16,'#11212a');
 function shutter(x,text){const g=new THREE.Group();g.position.set(x,0,.84);lid.add(g);box(g,0,0,0,2.94,2.7,.09,graphite);for(let i=0;i<8;i++)box(g,0,-1.14+i*.32,.06,2.8,.025,.02,metal);label(g,text,0,0,.08,2.4,.32);return g;}
 const centerCover=shutter(0,'ALIMENTATION REQUISE'),rightCover=shutter(3.35,'ACCORD REQUIS');
 const tabs=[];for(let i=0;i<4;i++){const x=2.23+i*.75;box(lid,x,.25,.38,.09,1.4,.06,metal);const tab=pick(box(lid,x,.65,.58,.47,.5,.2,mat(cableColors[i],.55,.42)),{kind:'tab',symbol:SYMBOLS[i],index:i});tabs.push(tab);label(tab,glyphs[SYMBOLS[i]],0,0,.56,.62,.6,'#11252b');label(lid,names[SYMBOLS[i]],x,-.43,.48,.7,.17);}
 const handle=new THREE.Group();handle.position.set(3.35,-1.24,.54);lid.add(handle);for(const x of [-.57,.57])box(handle,x,0,0,.13,.37,.15,metal);const grip=pick(box(handle,0,.16,.12,1.27,.16,.2,amber),{kind:'open'});label(lid,'SOULEVER',3.35,-1.72,.5,1.7,.17);
 const sequenceLabels=[];for(let i=0;i<4;i++)sequenceLabels.push(label(lid,'·',2.23+i*.75,-.8,.6,.44,.25));
 // Engraved strips carry mnemonic relations; the full readable wording is in the adjacent carnet.
 const cluePlates=[label(lid,'',-3.35,1.25,.4,2.5,.16),label(lid,'',-3.35,-1.95,.4,2.5,.16)];cluePlates[0].name='power-clue-top';cluePlates[1].name='power-clue-bottom';let plateConfig='';
 const moduleTargets=[];for(let i=0;i<3;i++){const proxy=pick(box(lid,[-3.35,0,3.35][i],0,1.3,3.16,3.75,.01,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false})),{kind:'module',index:i});moduleTargets.push(proxy);}
 let state,selected=null,drag=null,view=-1,zoom=1,yaw=0,tilt=.6,raf=0,disposed=false,lost=false;
 const listeners=[];
 function listen(target,type,handler,allowLost=false){const guarded=e=>{if(disposed||lost&&!allowLost)return;handler(e);};target.addEventListener(type,guarded);listeners.push(()=>target.removeEventListener(type,guarded));}
 let lidAngle=0,cover1=0,cover2=0,coreZ=-.05;let previousStage=0;
 const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();const plane=new THREE.Plane(new THREE.Vector3(0,0,1),-.65);
 function size(){if(disposed||lost)return;const r=canvas.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();request();}
 const obs=new ResizeObserver(size);obs.observe(canvas);
 function point(e){const r=canvas.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);return ray.intersectObjects(targets,false).find(hit=>{const a=hit.object.userData.action;if(!a)return false;if(view<0)return a.kind==='module';if(a.kind==='module')return false;return a.kind==='ring'||a.kind==='align'?state.stage>=1:a.kind==='tab'||a.kind==='open'?state.stage>=2:true;});}
 function onPlane(e){point(e);return ray.ray.intersectPlane(plane,new THREE.Vector3());}
 function wireUpdate(i){wires[i].geometry.dispose();wires[i].geometry=cable(i,plugs[i].position);}
 function writeLabel(mesh,text){const c=mesh.material.map.image;const ctx=c.getContext('2d');ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle='#c8dfdf';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${Math.round(c.height*.65)}px system-ui`;const symbol=Object.keys(glyphs).find(k=>glyphs[k]===text);if(symbol)drawSymbol(ctx,symbol,c.width/2,c.height/2,Math.min(c.width,c.height)*.85,'#c8dfdf');else ctx.fillText(text,c.width/2,c.height/2,c.width*.94);mesh.material.map.needsUpdate=true;}
 function restorePositions(){if(!state)return;for(let i=0;i<4;i++){const slot=state.power.indexOf(SYMBOLS[i]);plugs[i].position.set(slot<0?homeX[i]:sourceX[slot],slot<0?homeY:socketY,.64);plugs[i].material.emissive.setHex(selected===i?0x4a7060:0);wireUpdate(i);}for(let i=0;i<3;i++)rings[i].rotation.z=state.rings[i]*Math.PI/3;for(let i=0;i<4;i++)tabs[i].position.y=state.sequence.includes(SYMBOLS[i])?-.1:.65;}
 function update(s,instant=false){state=s;const configKey=JSON.stringify(s.config);if(plateConfig!==configKey){puzzleContent(s).plates.forEach((text,i)=>writeLabel(cluePlates[i],text));plateConfig=configKey;}if(s.stage!==previousStage){selected=null;previousStage=s.stage;}restorePositions();for(let i=0;i<3;i++)writeLabel(ringLabels[i],['Extérieur','Milieu','Intérieur'][i]+' : '+names[SYMBOLS[s.rings[i]]]);for(let i=0;i<4;i++)writeLabel(sequenceLabels[i],s.sequence[i]?glyphs[s.sequence[i]]:'·');powerSwitch.material=s.stage>0?accent:amber;if(instant){lidAngle=s.stage===3?-65*Math.PI/180:0;cover1=s.stage>0?1:0;cover2=s.stage>1?1:0;coreZ=s.stage===3?.7:-.05;}request();}
 function focus(v){view=v;yaw=0;tilt=.6;zoom=1;request();}
 function request(){if(!raf&&!disposed&&!lost&&!document.hidden)raf=requestAnimationFrame(render);}
 let slowSamples=[],quality=0;
 function render(){raf=0;if(disposed||!state||lost)return;const reduced=state.settings.reduced;const factor=reduced?1:.16;const targetLid=state.stage===3?-65*Math.PI/180:0,t1=state.stage>0?1:0,t2=state.stage>1?1:0,tz=state.stage===3?.7:-.05;
 lidAngle+=(targetLid-lidAngle)*factor;cover1+=(t1-cover1)*factor;cover2+=(t2-cover2)*factor;coreZ+=(tz-coreZ)*factor;
 lidPivot.rotation.x=lidAngle;centerCover.position.y=cover1*1.3;centerCover.scale.y=1-cover1*.97;rightCover.position.y=cover2*1.3;rightCover.scale.y=1-cover2*.97;core.position.z=coreZ;handle.rotation.x=state.stage===3?-.4:0;
 const x=view<0?0:[-3.35,0,3.35][view];const distance=(view<0?Math.max(8.8,16/camera.aspect):Math.max(5.6,5.4/camera.aspect))*zoom;camera.position.set(x+Math.sin(yaw)*distance*.4,-Math.sin(tilt)*distance,Math.cos(tilt)*distance);camera.lookAt(x,0,0);camera.updateMatrixWorld();
 const start=performance.now();renderer.render(world,camera);const time=performance.now()-start;if(drag){slowSamples.push(time);if(slowSamples.length>90){const sorted=[...slowSamples].sort((a,b)=>a-b);if(sorted[45]>33&&quality<2){quality++;renderer.setPixelRatio(1);if(quality===2)core.material.emissiveIntensity=.2;}slowSamples=[];}}
 const anim=Math.abs(targetLid-lidAngle)+Math.abs(t1-cover1)+Math.abs(t2-cover2)+Math.abs(tz-coreZ)>.003;if(anim)request();
 }
 const ringAngle=e=>{const center=rings[0].localToWorld(new THREE.Vector3(0,0,RING_DEPTH)).project(camera),r=canvas.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+(1-center.y)*r.height/2),e.clientX-(r.left+(center.x+1)*r.width/2));};
 listen(canvas,'pointerdown',e=>{if(!state||drag)return;if(e.button!==0)return;const hit=point(e);drag={id:e.pointerId,x:e.clientX,y:e.clientY,action:hit?.object.userData.action,startYaw:yaw,startTilt:tilt,angle:ringAngle(e),base:hit?.object.userData.action.kind==='ring'?state.rings[hit.object.userData.action.index]:0,moved:false};canvas.setPointerCapture(e.pointerId);});
 listen(canvas,'pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.hypot(dx,dy)>8)drag.moved=true;if(!drag.moved)return;const a=drag.action;if(!a){yaw=THREE.MathUtils.clamp(drag.startYaw+dx*.004,-.61,.61);tilt=THREE.MathUtils.clamp(drag.startTilt+dy*.003,.26,.96);}else if(a.kind==='plug'&&state.stage===0){const p=onPlane(e);if(p){plugs[a.index].position.x=THREE.MathUtils.clamp(p.x,-4.9,-1.8);plugs[a.index].position.y=THREE.MathUtils.clamp(p.y,-1.4,1.1);wireUpdate(a.index);}}else if(a.kind==='ring'&&state.stage===1){let delta=ringAngle(e)-drag.angle;delta=Math.atan2(Math.sin(delta),Math.cos(delta));drag.value=ringValueFromDrag(drag.base,delta);rings[a.index].rotation.z=drag.value*Math.PI/3;}else if(a.kind==='tab'&&state.stage===2){tabs[a.index].position.y=THREE.MathUtils.clamp(.65-dy*.01,-.1,.65);}request();});
 listen(canvas,'pointerup',e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag,a=d.action;drag=null;try{canvas.releasePointerCapture(e.pointerId);}catch{}if(!a){request();return;}
 if(a.kind==='module'){if(!d.moved)dispatch({type:'focus',index:a.index});}
 else if(a.kind==='plug'&&state.stage===0){if(d.moved){const p=onPlane(e);const slot=p&&sourceX.findIndex(x=>Math.abs(p.x-x)<.33&&Math.abs(p.y-socketY)<.38);if(Number.isInteger(slot)&&slot>=0)dispatch({type:'connect',symbol:a.symbol,slot});else restorePositions();}else {if(selected===a.index){dispatch({type:'unplug',symbol:a.symbol});selected=null;}else{selected=a.index;notify(names[a.symbol]+' sélectionné : touchez une prise, ou sa fiche pour débrancher.');}restorePositions();}}
 else if(a.kind==='socket'&&selected!==null&&state.stage===0){dispatch({type:'connect',symbol:SYMBOLS[selected],slot:a.slot});selected=null;restorePositions();}
 else if(a.kind==='ring'&&state.stage===1)dispatch({type:'ring',index:a.index,value:d.moved?(d.value??d.base):(state.rings[a.index]+1)%6});
 else if(a.kind==='tab'&&state.stage===2)dispatch({type:'tab',symbol:a.symbol});
 else if(a.kind==='power')dispatch({type:'power'});else if(a.kind==='align')dispatch({type:'align'});else if(a.kind==='open')dispatch({type:'open'});else if(!d.moved)notify('Ce module attend l’étape précédente.');
 restorePositions();request();});
 function cancel(){if(drag){try{canvas.releasePointerCapture(drag.id);}catch{}drag=null;restorePositions();request();}}
 listen(canvas,'pointercancel',cancel);listen(canvas,'lostpointercapture',cancel);listen(window,'blur',cancel);listen(window,'orientationchange',cancel);
 listen(canvas,'webglcontextlost',e=>{e.preventDefault();cancel();lost=true;notify('Contexte 3D perdu. Utilisez les commandes accessibles ou relancez la vue.',true);});listen(canvas,'webglcontextrestored',()=>{lost=false;request();},true);
 listen(document,'visibilitychange',()=>{cancel();if(!document.hidden)request();});
 listen(window,'keydown',e=>{if(e.key==='Escape')cancel();});
 size();return {update,focus,cancel,zoom(delta){zoom=THREE.MathUtils.clamp(zoom+delta,.65,1.5);request();},dispose(){if(disposed)return;listeners.splice(0).forEach(remove=>remove());cancel();disposed=true;cancelAnimationFrame(raf);raf=0;obs.disconnect();const geometries=new Set(),materials=new Set();world.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])materials.add(m);});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();},stats:()=>renderer.info};
}
