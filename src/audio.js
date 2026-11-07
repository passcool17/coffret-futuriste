import {effectFor} from './audio-events.js';

const BEAT=60/72, BAR=BEAT*4, PHRASE=BAR*8;
const clamp=(n,fallback)=>Number.isFinite(n)?Math.max(0,Math.min(1,n)):fallback;
const levels=s=>({muted:Boolean(s.muted),volume:clamp(s.volume,.35),musicVolume:clamp(s.musicVolume,.25),effectsVolume:clamp(s.effectsVolume,.8)});

// A single lazy context owns both buses; no renderer, DOM listener or puzzle data here.
export function audio({
 createContext=()=>new (globalThis.AudioContext||globalThis.webkitAudioContext)(),
 setTimer=(fn,ms)=>setTimeout(fn,ms),clearTimer=id=>clearTimeout(id),
 available=()=>!document.hidden&&document.hasFocus(),onUnavailable=()=>{}
}={}){
 let context,master,musicBus,effectsBus,limiter,noiseBuffer,pendingResume;
 let settings=levels({}),stage=0,paused=true,disposed=false,warned=false,epoch=0;
 let timer=null,suspendTimer=null,nextMusic=0,musicStep=0,lastEffect=-Infinity;
 const voices=new Set(),buses=[];
 const audible=()=>!settings.muted&&settings.volume>0&&(settings.musicVolume>0||settings.effectsVolume>0);
 function report(){if(!warned){warned=true;onUnavailable('Son indisponible, réessayez avec le bouton Son.');}}
 function ramp(param,value,time,duration=.025){
  if(param.cancelAndHoldAtTime)param.cancelAndHoldAtTime(time);
  else {param.cancelScheduledValues(time);param.setValueAtTime(param.value,time);}
  param.linearRampToValueAtTime(value,time+duration);
 }
 function initialize(){
  if(context)return;
  context=createContext();
  try{
  master=context.createGain();musicBus=context.createGain();effectsBus=context.createGain();limiter=context.createDynamicsCompressor();
  master.gain.setValueAtTime(0,context.currentTime);
  musicBus.connect(master);effectsBus.connect(master);master.connect(limiter);limiter.connect(context.destination);
  limiter.threshold.setValueAtTime(-12,context.currentTime);limiter.knee.setValueAtTime(12,context.currentTime);limiter.ratio.setValueAtTime(6,context.currentTime);limiter.attack.setValueAtTime(.005,context.currentTime);limiter.release.setValueAtTime(.15,context.currentTime);
  buses.push(musicBus,effectsBus,master,limiter);
  noiseBuffer=context.createBuffer(1,context.sampleRate,context.sampleRate);
  const data=noiseBuffer.getChannelData(0);let seed=117;
  for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/2147483648-1)*.65;}
  }catch(error){for(const node of [master,musicBus,effectsBus,limiter])node?.disconnect();buses.length=0;try{Promise.resolve(context.close()).catch(()=>{});}catch{}context=master=musicBus=effectsBus=limiter=noiseBuffer=undefined;throw error;}
 }
 function gains(){if(!context)return;const t=context.currentTime;ramp(master.gain,settings.muted?0:settings.volume,t);ramp(musicBus.gain,settings.musicVolume,t);ramp(effectsBus.gain,settings.effectsVolume,t);}
 function release(voice,time){if(voice.released)return;voice.released=true;ramp(voice.gain.gain,0,time,.015);try{voice.source.stop(time+.02);}catch{}}
 function cleanup(voice){if(voice.cleaned)return;voice.cleaned=true;voices.delete(voice);voice.source.disconnect();voice.gain.disconnect();voice.filter?.disconnect();}
 function reap(){for(const v of voices)if(v.end<=context.currentTime){cleanup(v);}}
 function voice({bus='fx',frequency=220,endFrequency=frequency,type='sine',noise=false,cutoff=1800,at=context.currentTime,duration=.12,attack=.008,releaseTime=.06,peak=.16}){
  reap();const limit=bus==='music'?3:8;
  const group=[...voices].filter(v=>v.bus===bus&&!v.cleaned);
  // Never queue or steal a still-fading voice: discard an excess request.
  if(group.length>=limit)return;
  const source=noise?context.createBufferSource():context.createOscillator(),gain=context.createGain();
  if(noise)source.buffer=noiseBuffer;else{source.type=type;source.frequency.setValueAtTime(frequency,at);source.frequency.exponentialRampToValueAtTime(Math.max(20,endFrequency),at+duration);}
  let filter;if(noise||bus==='music'){filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.setValueAtTime(cutoff,at);filter.Q.setValueAtTime(.5,at);source.connect(filter);filter.connect(gain);}else source.connect(gain);
  gain.connect(bus==='music'?musicBus:effectsBus);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(peak,at+attack);gain.gain.setValueAtTime(peak,at+Math.max(attack,duration-releaseTime));gain.gain.linearRampToValueAtTime(0,at+duration);
  const v={source,gain,filter,bus,end:at+duration,cleaned:false,released:false};voices.add(v);source.onended=()=>cleanup(v);try{source.start(at);source.stop(v.end+.005);}catch(error){try{source.stop();}catch{}cleanup(v);throw error;}return v;
 }
 function stopBus(bus){if(!context)return;for(const v of voices)if(!bus||v.bus===bus)release(v,context.currentTime);}
 function stopScheduler(){if(timer!==null){clearTimer(timer);timer=null;}}
 function schedule(){
  timer=null;
  if(disposed||paused||!available()||!audible()||settings.musicVolume===0){if(!available())pause();return;}
  reap();const t=context.currentTime;
  if(nextMusic<t-.25)nextMusic=t+.04; // A late timer never catches up with a burst.
  if(nextMusic<=t+.25){
   const step=musicStep%4,root=[146.832,174.614,130.813,146.832][step];
   voice({bus:'music',frequency:root,at:nextMusic,duration:BAR*2-.3,attack:.7,releaseTime:1.4,peak:.10,cutoff:850});
   voice({bus:'music',frequency:root*(stage===0?1.5:stage===1?2:1.25),at:nextMusic,duration:BAR*2-.3,attack:.8,releaseTime:1.5,peak:.065,cutoff:1100});
   musicStep++;nextMusic+=BAR*2;
  }
  // Sparse phrase notes are scheduled only within the short lookahead, never a full song queue.
  const phrasePosition=t%PHRASE,slot=Math.floor(phrasePosition/(BAR*2));
  const noteTime=Math.floor(t/PHRASE)*PHRASE+slot*BAR*2+BAR;
  if(stage>0&&noteTime>=t&&noteTime<t+.25&&lastMelody!==noteTime){
   lastMelody=noteTime;voice({bus:'music',frequency:[293.665,349.228,440,329.628][slot],at:noteTime,duration:1.5,attack:.4,releaseTime:.8,peak:.055,cutoff:1250});
  }
  timer=setTimer(()=>{try{schedule();}catch{pause();report();}},120);
 }
 let lastMelody=-Infinity;
 function startScheduler(){if(timer===null&&!paused&&settings.musicVolume>0){nextMusic=context.currentTime+.04;lastMelody=-Infinity;schedule();}}
 function pause(){
  if(disposed)return;paused=true;epoch++;stopScheduler();
  if(suspendTimer!==null){clearTimer(suspendTimer);suspendTimer=null;}
  if(!context)return;
  ramp(master.gain,0,context.currentTime,.015);stopBus();
  const token=epoch;suspendTimer=setTimer(()=>{suspendTimer=null;if(!disposed&&paused&&token===epoch){try{Promise.resolve(context.suspend()).catch(report);}catch{report();}}},25);
 }
 function sync(next){
  settings=levels(next);
  if(!audible()){pause();return;}
  if(!context)return;
  if(!paused)gains();
  if(settings.musicVolume===0){stopScheduler();stopBus('music');}
  if(settings.effectsVolume===0)stopBus('fx');
  // Only a live user gesture in resume may start a stopped scheduler/context.
 }
 async function resume(next,currentStage){
  try{
  sync(next);stage=Math.max(0,Math.min(3,currentStage));
  if(disposed||!available()||!audible())return false;
  if(suspendTimer!==null){clearTimer(suspendTimer);suspendTimer=null;}
  paused=false;const token=epoch;
   initialize();
   if(!pendingResume){const result=context.state==='running'?Promise.resolve():Promise.resolve(context.resume());pendingResume=result.finally(()=>{pendingResume=null;});}
   await pendingResume;
   if(disposed||paused||token!==epoch||!available()||!audible()){if(!disposed&&!available())pause();return false;}
   gains();startScheduler();return true;
  }catch{pause();report();return false;}
 }
 function effect(kind){
  if(!kind||settings.effectsVolume===0)return;
  const t=context.currentTime;if(t-lastEffect<.045&&!['shutter','reveal'].includes(kind))return;lastEffect=t;
  const click=(frequency,peak=.17,delay=0)=>voice({frequency,endFrequency:frequency*.55,at:t+delay,duration:.1,peak});
  const scrape=(duration=.22,peak=.13,delay=0,cutoff=1700)=>voice({noise:true,at:t+delay,duration,attack:.015,releaseTime:.08,peak,cutoff});
  if(kind==='plug-in'){scrape(.08,.18,0,2200);click(1050,.15,.025);}
  else if(kind==='plug-out'){scrape(.12,.13,0,1300);click(620,.11);}
  else if(kind==='detent'){click(430,.17);scrape(.07,.07,.01,1900);}
  else if(kind==='latch'){scrape(.20,.14);click(290,.19,.12);}
  else if(kind==='spring'){voice({frequency:380,endFrequency:170,type:'triangle',duration:.17,peak:.12});}
  else if(kind==='stop'){voice({frequency:135,endFrequency:85,duration:.14,peak:.16});scrape(.08,.07,0,550);}
  else if(kind==='shutter'||kind==='reveal'){
   ramp(musicBus.gain,settings.musicVolume*.707,t,.02);musicBus.gain.linearRampToValueAtTime(settings.musicVolume,t+.6);
   if(kind==='shutter'){click(640,.13);scrape(.48,.13,.035,950);click(190,.12,.44);}
   else{for(const f of [293.665,440,587.33])voice({frequency:f,at:t+.55,duration:1.6,attack:.18,releaseTime:.9,peak:.095});scrape(.65,.12,.25,1050);for(let i=0;i<4;i++)click(280-i*23,.11,i*.09);}
  }
 }
 async function handleAction(event,next){try{const token=epoch;const started=Date.now();if(await resume(next,event.toStage)){if(token!==epoch||Date.now()-started>250)return;effect(effectFor(event));}}catch{pause();report();}}
 function dispose(){
  if(disposed)return;pause();disposed=true;epoch++;stopScheduler();if(suspendTimer!==null){clearTimer(suspendTimer);suspendTimer=null;}
  for(const v of [...voices]){try{v.source.stop();}catch{}cleanup(v);}buses.forEach(n=>n.disconnect());noiseBuffer=null;
  if(context){try{Promise.resolve(context.close()).catch(()=>{});}catch{}}
 }
 return {handleAction,resume,sync(next){try{sync(next);}catch{pause();report();}},pause,dispose};
}
