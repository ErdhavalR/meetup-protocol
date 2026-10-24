let audio:AudioContext|null=null;
/** All sounds are synthesized locally. No external audio files, autoplay, or network traffic. */
export function playSound(kind:'click'|'dodge'|'win'|'back',enabled:boolean){
 if(!enabled)return;
 try{
  audio??=new AudioContext();if(audio.state==='suspended')void audio.resume();
  const notes=kind==='win'?[523,659,784,1046]:kind==='dodge'?[420,580]:kind==='back'?[340]:[620];
  notes.forEach((frequency,i)=>{
   const osc=audio!.createOscillator(),gain=audio!.createGain(),t=audio!.currentTime+i*.075;
   osc.type=kind==='dodge'?'triangle':'sine';osc.frequency.setValueAtTime(frequency,t);
   if(kind==='dodge')osc.frequency.exponentialRampToValueAtTime(frequency*1.33,t+.09);
   gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(.055,t+.012);
   gain.gain.exponentialRampToValueAtTime(.0001,t+.13);
   osc.connect(gain);gain.connect(audio!.destination);osc.start(t);osc.stop(t+.15);
  });
 }catch{/* Web Audio is optional */}
}
