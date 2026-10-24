import {useEffect,useState} from 'react';
import type {StepDefinition} from './config';
type Props={mood:StepDefinition['duckMood'];reactToPointer:boolean};
export default function Duck({mood,reactToPointer}:Props){
 const [eye,setEye]=useState({x:0,y:0});
 useEffect(()=>{
  if(!reactToPointer)return;
  const move=(event:PointerEvent)=>{const x=(event.clientX/window.innerWidth-.5)*12,y=(event.clientY/window.innerHeight-.5)*9;setEye({x:Math.max(-6,Math.min(6,x)),y:Math.max(-4,Math.min(4,y))})};
  window.addEventListener('pointermove',move,{passive:true});return()=>window.removeEventListener('pointermove',move);
 },[reactToPointer]);
 return <div className={`duck duck-${mood}`} role="img" aria-label={`Cheeky duck mascot feeling ${mood}`}>
   <span className="duck-spark s1">✦</span><span className="duck-spark s2">✧</span>
   <div className="duck-body"><div className="duck-tuft"/><div className="duck-wing"/>
    <div className="duck-eye left"><span style={{transform:`translate(${eye.x}px,${eye.y}px)`}}/></div>
    <div className="duck-eye right"><span style={{transform:`translate(${eye.x}px,${eye.y}px)`}}/></div>
    <div className="duck-cheek c1"/><div className="duck-cheek c2"/><div className="duck-beak"/>
   </div><div className="duck-shadow"/>
   <span className="duck-bubble">{({curious:'hmm?',cheeky:'QUACK!',excited:'yay!',thinking:'calculating…',party:'WOO!',calm:'all good!'})[mood]}</span>
 </div>
}
