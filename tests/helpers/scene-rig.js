import * as ringGraphics from '../../src/ring-graphics.js';
import fs from 'node:fs';import * as THREE from '../../vendor/three.module.js';import {SYMBOLS} from '../../src/model.js';import {names,glyphs,puzzleContent} from '../../src/content.js';
export async function sceneRig(){
 class Target extends EventTarget{getBoundingClientRect(){return {left:0,top:0,width:800,height:600};}setPointerCapture(){}releasePointerCapture(){}}
 const canvas=new Target(),window=new Target(),document=new Target();document.hidden=false;document.createElement=()=>{const c={_iconFrames:[]};c.getContext=()=>{let m=[1,0,0,1,0,0],stack=[];return {canvas:c,fillRect(){},clearRect(){},fillText(text){c._text=text;},beginPath(){},moveTo(){},lineTo(){},arc(){},stroke(){},fill(){},closePath(){},save(){stack.push([...m]);},restore(){m=stack.pop();},translate(x,y){m[4]+=m[0]*x+m[2]*y;m[5]+=m[1]*x+m[3]*y;},scale(x,y){m[0]*=x;m[1]*=x;m[2]*=y;m[3]*=y;c._iconFrames.push([...m]);},rotate(a){const [aa,b,cc,d]=m,co=Math.cos(a),si=Math.sin(a);m[0]=aa*co+cc*si;m[1]=b*co+d*si;m[2]=-aa*si+cc*co;m[3]=-b*si+d*co;},bezierCurveTo(){}};};return c;};
 let frame,world;class Renderer{setClearColor(){}setPixelRatio(){}setSize(){}dispose(){}render(scene){world=scene;}info={};}
 const source=fs.readFileSync(new URL('../../src/scene.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replace('export function createScene','function createScene');
 const create=new Function('THREE','SYMBOLS','names','glyphs','puzzleContent','window','document','ResizeObserver','requestAnimationFrame','cancelAnimationFrame','devicePixelRatio',...Object.keys(ringGraphics),source+'\nreturn createScene;')({...THREE,WebGLRenderer:Renderer},SYMBOLS,names,glyphs,puzzleContent,window,document,class {observe(){}disconnect(){}},fn=>{frame=fn;return 1;},()=>{},1,...Object.values(ringGraphics));
 const scene=create(canvas,()=>{},()=>{});
 return {scene,draw(){const fn=frame;frame=null;fn?.();world.updateMatrixWorld(true);const groups=[];world.traverse(n=>{if(n.children?.some(c=>c.userData.action?.kind==='ring'))groups.push(n);});return {world,groups};}};
}
