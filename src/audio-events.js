// No puzzle values cross this boundary. Effects describe confirmed manipulation only.
export function audioEvent(action,before,result){
 const after=result.state;
 const changed=before.stage!==after.stage||['power','rings','sequence'].some(k=>JSON.stringify(before[k])!==JSON.stringify(after[k]));
 return {type:action.type,ok:result.ok,changed,fromStage:before.stage,toStage:after.stage};
}
export function effectFor(event){
 if(event.ok&&event.toStage>event.fromStage)return event.toStage===3?'reveal':'shutter';
 if(!event.ok)return ['connect','power','align','open'].includes(event.type)&&event.fromStage<3?'stop':null;
 if(!event.changed)return null;
 return {connect:'plug-in',unplug:'plug-out',ring:'detent',tab:'latch',undo:'spring',clear:'spring'}[event.type]??null;
}
