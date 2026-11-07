import {SYMBOLS} from './model.js?v=replay-bank-v1';

export const RING_STEP=Math.PI/3;
export const RING_DEPTH=.12;
export function ringSymbols(radius){
 return SYMBOLS.map((symbol,index)=>{const angle=Math.PI/2-index*RING_STEP;return {symbol,index,x:radius*Math.cos(angle),y:radius*Math.sin(angle),rotation:-index*RING_STEP};});
}
export function ringValueFromDrag(base,screenDelta){return ((base-Math.round(screenDelta/RING_STEP))%6+6)%6;}

// One original, font-independent family for ring inlays, plugs and latch faces.
export function drawSymbol(ctx,symbol,x,y,size,color='#0b1b21'){
 ctx.save();ctx.translate(x,y);ctx.scale(size,size);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=.075;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
 if(symbol==='S'){
  ctx.arc(0,0,.20,0,Math.PI*2);ctx.stroke();ctx.beginPath();
  for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.moveTo(.31*Math.cos(a),.31*Math.sin(a));ctx.lineTo(.43*Math.cos(a),.43*Math.sin(a));}
 }else if(symbol==='V'){
  for(const y0 of [-.25,0,.25]){ctx.moveTo(-.42,y0);ctx.bezierCurveTo(-.21,y0-.18,-.21,y0+.18,0,y0);ctx.bezierCurveTo(.21,y0-.18,.21,y0+.18,.42,y0);}
 }else if(symbol==='L'){
  ctx.moveTo(-.32,.34);ctx.bezierCurveTo(-.48,-.17,-.06,-.43,.36,-.38);ctx.bezierCurveTo(.43,.02,.17,.42,-.32,.34);ctx.moveTo(-.34,.38);ctx.lineTo(.22,-.23);
 }else if(symbol==='M'){
  ctx.moveTo(-.44,.35);ctx.lineTo(-.09,-.38);ctx.lineTo(.13,.06);ctx.lineTo(.27,-.17);ctx.lineTo(.45,.35);ctx.closePath();
 }else if(symbol==='N'){
  ctx.moveTo(.18,-.4);ctx.bezierCurveTo(-.5,-.43,-.5,.43,.18,.4);ctx.bezierCurveTo(-.19,.18,-.19,-.18,.18,-.4);ctx.closePath();
 }else if(symbol==='E'){
  for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?.19:.43;const px=Math.cos(a)*r,py=Math.sin(a)*r;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.closePath();
 }
 ctx.stroke();ctx.restore();
}

export function createRing(THREE,document,radius,sideMaterial,faceColor){
 const outer=radius+.13,inner=radius-.13;
 const shape=new THREE.Shape();shape.absarc(0,0,outer,0,Math.PI*2,false);
 const hole=new THREE.Path();hole.absarc(0,0,inner,0,Math.PI*2,true);shape.holes.push(hole);
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:RING_DEPTH,bevelEnabled:false,steps:1,curveSegments:48});
 // ExtrudeGeometry cap UVs use world x/y by default. Normalize both axes to the atlas.
 const pos=geometry.attributes.position,uv=geometry.attributes.uv;
 for(const group of geometry.groups.filter(g=>g.materialIndex===0))for(let i=group.start;i<group.start+group.count;i++)uv.setXY(i,.5+pos.getX(i)/(2*outer),.5+pos.getY(i)/(2*outer));
 uv.needsUpdate=true;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=radius>.7?1024:512;
 const ctx=canvas.getContext('2d');ctx.fillStyle=faceColor;ctx.fillRect(0,0,canvas.width,canvas.height);
 const layout=ringSymbols(radius),scale=canvas.width/(2*outer);
 for(const icon of layout){ctx.save();ctx.translate(canvas.width/2+icon.x*scale,canvas.height/2-icon.y*scale);ctx.rotate(-icon.rotation);drawSymbol(ctx,icon.symbol,0,0,.21*scale);ctx.restore();}
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.userData.symbolLayout=layout;
 const face=new THREE.MeshStandardMaterial({map:texture,color:0xffffff,metalness:.35,roughness:.5});
 return new THREE.Mesh(geometry,[face,sideMaterial]);
}
