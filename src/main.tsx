import React,{useCallback,useEffect,useRef,useState} from 'react';

import {createRoot} from 'react-dom/client';

import {ArrowRight,RotateCcw,CalendarDays,Clock3,Copy,Send,ShieldCheck,Volume2,VolumeX,ChevronLeft} from 'lucide-react';

import Duck from './Duck';

import {CONFIG as DEFAULT_CONFIG} from './config';

import Admin from './Admin';

import type {StepDefinition} from './config';

import {playSound} from './sound';

import './styles.css';

type Point={x:number;y:number};

const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};

const dateLabel=(value:string)=>value?new Date(value+'T12:00:00').toLocaleDateString('en-IN',{weekday:'short',month:'short',day:'numeric',year:'numeric'}):'—';

const timeLabel=(value:string)=>new Date('2000-01-01T'+value+':00').toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'});

function Confetti(){return <div className="confetti" aria-hidden="true">{Array.from({length:42},(_,i)=><span key={i} style={{left:`${(i*73)%100}%`,animationDelay:`${(i%9)*.11}s`,animationDuration:`${2.2+(i%5)*.4}s`,backgroundColor:['#a1fcda','#ffcb73','#fb93b1','#aaa4ff'][i%4]}}/>)}</div>}

function EscapeButton({sound,decline,quips}:{sound:boolean;decline:()=>void;quips:string[]}){

 const arena=useRef<HTMLDivElement>(null),button=useRef<HTMLButtonElement>(null);

 const position=useRef<Point>({x:0,y:0}),target=useRef<Point>({x:0,y:0}),velocity=useRef<Point>({x:0,y:0});

 const pointer=useRef<Point|null>(null),count=useRef(0),last=useRef(0),frame=useRef(0),path=useRef<Point[]>([]),reduced=useRef(false);

 const [quip,setQuip]=useState('Try catching the suspicious button.');const [shown,setShown]=useState(0);

 const measure=useCallback(()=>{const a=arena.current,b=button.current;if(!a||!b)return;

  const w=Math.max(0,a.clientWidth-b.offsetWidth-24),h=Math.max(0,a.clientHeight-b.offsetHeight-24);

  path.current=[[.5,.55],[.12,.14],[.86,.12],[.81,.77],[.16,.81],[.47,.15],[.91,.48],[.35,.85],[.08,.43],[.65,.66]].map(([x,y])=>({x:12+x*w,y:12+y*h}));

  if(count.current===0){position.current={...path.current[0]};target.current={...path.current[0]};velocity.current={x:0,y:0};b.style.transform=`translate3d(${position.current.x}px,${position.current.y}px,0)`;}

  else{position.current={x:Math.min(position.current.x,w+12),y:Math.min(position.current.y,h+12)};target.current={x:Math.min(target.current.x,w+12),y:Math.min(target.current.y,h+12)}};

 },[]);

 const evade=useCallback((force=false)=>{if(reduced.current)return;const a=arena.current,b=button.current;if(!a||!b)return;

  const now=performance.now();if(now-last.current<170)return;

  const mouse=pointer.current??{x:position.current.x+b.offsetWidth/2,y:position.current.y+b.offsetHeight/2};

  const distance=Math.hypot(position.current.x+b.offsetWidth/2-mouse.x,position.current.y+b.offsetHeight/2-mouse.y);

  if(!force&&distance>130)return;

  last.current=now;

  // Choreographed sequence, with proximity-aware selection: no random teleports and no escape limit.

  const route=path.current;let destination=route[(count.current*3+1)%route.length];

  for(let i=0;i<route.length;i++){const p=route[(count.current*3+1+i)%route.length];if(Math.hypot(p.x+b.offsetWidth/2-mouse.x,p.y+b.offsetHeight/2-mouse.y)>125&&Math.hypot(p.x-position.current.x,p.y-position.current.y)>75){destination=p;break}}

  target.current={...destination};count.current++;setShown(count.current);setQuip((quips.length?quips:DEFAULT_CONFIG.quips)[(count.current-1)%(quips.length||DEFAULT_CONFIG.quips.length)]);playSound('dodge',sound);

 },[sound,quips]);

 useEffect(()=>{const query=window.matchMedia('(prefers-reduced-motion: reduce)');reduced.current=query.matches;

  const change=()=>{reduced.current=query.matches};query.addEventListener?.('change',change);

  measure();const observer=new ResizeObserver(measure);if(arena.current)observer.observe(arena.current);

  const tick=()=>{if(!reduced.current){const p=position.current,v=velocity.current,t=target.current;

    v.x=(v.x+(t.x-p.x)*.045)*.79;v.y=(v.y+(t.y-p.y)*.045)*.79;p.x+=v.x;p.y+=v.y;

    if(button.current)button.current.style.transform=`translate3d(${p.x}px,${p.y}px,0) rotate(${Math.max(-14,Math.min(14,v.x*.8))}deg)`;

    const m=pointer.current;if(m&&Math.hypot(p.x+(button.current?.offsetWidth??0)/2-m.x,p.y+(button.current?.offsetHeight??0)/2-m.y)<105)evade();}

    frame.current=requestAnimationFrame(tick);};frame.current=requestAnimationFrame(tick);

  return()=>{observer.disconnect();query.removeEventListener?.('change',change);cancelAnimationFrame(frame.current)};

 },[evade,measure]);

 const track=(event:React.PointerEvent<HTMLDivElement>)=>{if(event.pointerType==='touch')return;const r=event.currentTarget.getBoundingClientRect();pointer.current={x:event.clientX-r.left,y:event.clientY-r.top}};

 return <div className="escape-wrap"><div className="escape-arena" ref={arena} onPointerMove={track} onPointerLeave={()=>pointer.current=null}>

  <div className="escape-lines" aria-hidden="true"/>

  <button ref={button} className="runaway" type="button" aria-label="Playful dodging No button" onPointerEnter={()=>evade(true)} onTouchStart={e=>{if(!reduced.current){e.preventDefault();evade(true)}}} onClick={e=>{e.preventDefault();evade(true)}}>Nope 🙃</button>

  <div className="escape-hint" aria-live="polite">{reduced.current?'The duck is resting (reduced motion).':quip}{shown?` · Escape #${shown}`:''}</div>

 </div><button className="decline-link" type="button" onClick={decline}>Actually, I can’t meet — decline invitation</button></div>

}

function App(){

 const [CONFIG,setConfig]=useState(DEFAULT_CONFIG);

 const [inviteCode,setInviteCode]=useState<string|null>(null);

 const [loadError,setLoadError]=useState('');

 const [sent,setSent]=useState(false);

 useEffect(() => {
   const match = window.location.pathname.match(/^\/i\/([a-zA-Z0-9_-]+)\/?$/);
   if (!match) return;
   fetch(`/api/invitations/${match[1]}`)
     .then(async response => {
       if (!response.ok) throw new Error('This invitation is unavailable');
       return response.json();
     })
     .then(result => {
       setConfig(result.config);
       setInviteCode(result.id);
     })
     .catch(error => setLoadError(error.message));
 }, []);

 const submit=async(status:'accepted'|'declined')=>{if(!inviteCode)return;try{const response=await fetch(`/api/invitations/${inviteCode}/responses`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({status,date,time,activity:CONFIG.activities.find(a=>a.id===activity)?.title||activity,note})});if(!response.ok)throw Error('Could not submit response');setSent(true);setFeedback(status==='accepted'?'Your proposal has been sent to the inviter!':'Your decline has been recorded.')}catch(e){setFeedback((e as Error).message)}};

 const [id,setId]=useState('intro'),[date,setDate]=useState(''),[time,setTime]=useState('18:00'),[activity,setActivity]=useState('coffee'),[note,setNote]=useState(''),[muted,setMuted]=useState(()=>localStorage.getItem('meetup-muted')==='true'),[feedback,setFeedback]=useState('');

 const step=CONFIG.steps.find(s=>s.id===id)??CONFIG.steps[0];const stepNumber=Math.max(0,CONFIG.steps.filter(s=>s.kind!=='declined').findIndex(s=>s.id===id));

 const pick=CONFIG.activities.find(a=>a.id===activity)??CONFIG.activities[0];const sound=!muted;

 const go=(to:string|undefined,kind:'click'|'win'|'back'='click')=>{if(!to)return;playSound(kind,sound);setId(to);setFeedback('')};

 const reset=()=>{setSent(false);setDate('');setTime('18:00');setActivity('coffee');setNote('');go('intro','back')};

 const toggleSound=()=>{setMuted(m=>{localStorage.setItem('meetup-muted',String(!m));if(m)playSound('click',true);return !m})};

 const summary=`UNOFFICIAL MEETUP PROTOCOL — proposal\nDate: ${dateLabel(date)}\nTime: ${timeLabel(time)}\nPlan: ${pick.emoji} ${pick.title}${note.trim()?`\nNote: ${note.trim()}`:''}\n\nSuggested only, not confirmed. 🦆`;

 const copy=async()=>{try{await navigator.clipboard.writeText(summary);setFeedback('Copied! Send it to your friend.');playSound('click',sound)}catch{setFeedback('Clipboard unavailable: select the summary text below.')}};

 const share = async () => {
   if (navigator.share) {
     try {
       await navigator.share({ title: 'Meetup Protocol', text: summary });
       setFeedback('Shared using your device.');
       return;
     } catch (error) {
       if ((error as Error).name === 'AbortError') return;
     }
   }
   await copy();
 };

 const render=(s:StepDefinition)=>{switch(s.kind){

  case 'intro':return <div className="center"><div className="scan-box">▌ Source: {CONFIG.inviter} <span className="scan-blink">_</span></div><button className="primary wide" onClick={()=>go(s.next)}>Investigate suspicious request <ArrowRight size={18}/></button><p className="footnote">No pop quizzes. No paperwork. Probably.</p></div>;

  case 'question':return <div className="center"><button className="primary yes" onClick={()=>go(s.next)}>Fine, let’s hang out 😎 <ArrowRight size={18}/></button><EscapeButton sound={sound} quips={CONFIG.quips} decline={()=>go('declined','back')}/><p className="footnote">The duck is persistent. Your choice is still yours.</p></div>;

  case 'schedule':return <><div className="field-grid"><label className="field"><span><CalendarDays size={16}/> Day</span><input type="date" required min={today()} value={date} onChange={e=>setDate(e.target.value)}/></label><label className="field"><span><Clock3 size={16}/> Time</span><select value={time} onChange={e=>setTime(e.target.value)}>{CONFIG.timeOptions.map(t=><option key={t} value={t}>{timeLabel(t)}</option>)}</select></label></div><div className="tip">✨ Zero pressure. This is a suggestion, not a binding legal contract.</div><div className="actions"><button className="secondary" onClick={()=>go(s.previous,'back')}><ChevronLeft size={16}/> Back</button><button className="primary" disabled={!date||date<today()} onClick={()=>go(s.next)}>Next: the agenda <ArrowRight size={17}/></button></div></>;

  case 'activities':return <><div className="activity-grid">{CONFIG.activities.map(a=><button type="button" key={a.id} className={`activity ${activity===a.id?'selected':''}`} onClick={()=>{setActivity(a.id);playSound('click',sound)}}><span className="activity-emoji">{a.emoji}</span><strong>{a.title}</strong><small>{a.desc}</small><span className="activity-check">{activity===a.id?'✓':''}</span></button>)}</div><label className="field note"><span>Optional note</span><textarea maxLength={240} rows={2} placeholder="Preferred place or tiny request?" value={note} onChange={e=>setNote(e.target.value)}/></label><div className="actions"><button className="secondary" onClick={()=>go(s.previous,'back')}><ChevronLeft size={16}/> Back</button><button className="primary" onClick={()=>go(s.next,'win')}>Complete the mission <ArrowRight size={17}/></button></div></>;

  case 'success':return <div className="center"><div className="summary"><div><span>DATE</span><strong>{dateLabel(date)}</strong></div><div><span>TIME</span><strong>{timeLabel(time)}</strong></div><div><span>THE PLOT</span><strong>{pick.emoji} {pick.title}</strong></div>{note.trim()&&<div><span>EXTRA INFO</span><strong>{note.trim()}</strong></div>}</div><p className="notice"><ShieldCheck size={16}/> It’s a proposal until both people confirm.</p>{inviteCode&&<button className="primary wide" disabled={sent} onClick={()=>submit("accepted")}>{sent?"✓ Proposal sent":"Submit meetup proposal to inviter"}</button>}<div className="actions center-actions"><button className="secondary" onClick={copy}><Copy size={16}/> Copy details</button><button className="primary" onClick={share}><Send size={16}/> Share with inviter</button></div><p className="footnote" role="status">{feedback || (inviteCode ? (sent ? 'Your meetup proposal has been saved successfully!' : 'Click Submit meetup proposal to send your response.') : 'Preview mode: Share the details manually. Nothing is saved.')}</p>{feedback.includes('unavailable')&&<textarea className="fallback" readOnly value={summary} onFocus={e=>e.currentTarget.select()}/>}<button className="decline-link" onClick={()=>go(s.previous,'back')}>Edit the plan</button></div>;

  case 'declined':return <div className="center">{inviteCode&&!sent&&<button className="primary wide" onClick={()=>submit('declined')}>Send decline to inviter</button>}<p role="status">{feedback}</p><button className="secondary" onClick={reset}>Return to start <RotateCcw size={16}/></button><p className="footnote">{sent?'Your response was recorded.':'Nothing is sent unless you choose to send it.'}</p></div>;

 }};

 if(loadError)return <main className="shell"><h1>{loadError}</h1><p>Please ask your friend for a new link.</p></main>;

 return <><div className="orb orb-a"/><div className="orb orb-b"/>{step.kind==='success'&&<Confetti/>}<main className="shell"><header className="masthead"><div className="brand"><span className="brand-mark">✳</span> {CONFIG.brand}</div><div className="header-actions"><button className="sound-toggle" onClick={toggleSound} aria-label={muted?'Unmute sounds':'Mute sounds'} title={muted?'Sound off':'Sound on'}>{muted?<VolumeX size={18}/>:<Volume2 size={18}/>}</button><span className="top-status"><span className="status-dot"/> OPERATION: HANGOUT</span></div></header>

 <section className="panel"><div className="panel-top"><span>TRANSMISSION {String(Math.min(stepNumber+1,5)).padStart(2,'0')} / 05</span><button className="restart" onClick={reset}><RotateCcw size={14}/> Restart</button></div><div className="progress"><div style={{width:`${(Math.min(stepNumber+1,5)/5)*100}%`}}/></div>

 <div key={step.id} className={`stage stage-${step.animation}`}><div className="center step-heading"><Duck mood={step.duckMood} reactToPointer={true}/><div className="eyebrow">✦ {step.eyebrow}</div><h1>{step.title}</h1><p className="lead">{step.description}</p></div>{render(step)}</div>

 </section><footer className="footer">Built for laughs, not obligations. <span>✦</span> Zero awkward commitments.</footer></main></>;

}

createRoot(document.getElementById('root')!).render(<React.StrictMode>{location.pathname.startsWith('/admin')?<Admin/>:<App/>}</React.StrictMode>);
