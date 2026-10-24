/** V3 experience definition. Edit this file to change the journey without editing React UI logic. */
export type StepKind = 'intro'|'question'|'schedule'|'activities'|'success'|'declined';
export type StepDefinition = { id:string; kind:StepKind; eyebrow:string; title:string; description:string; next?:string; previous?:string; animation:'pop'|'slide'|'bounce'|'reveal'; duckMood:'curious'|'cheeky'|'excited'|'thinking'|'party'|'calm' };
export const CONFIG = {
  inviter:'Your suspiciously entertaining friend',
  brand:'UNOFFICIAL / PROTOCOL',
  steps:[
    {id:'intro',kind:'intro',eyebrow:'CLASSIFIED TRANSMISSION',title:'You have been summoned.',description:'A very important request for approximately 45 minutes of your extremely valuable time.',next:'question',animation:'reveal',duckMood:'curious'},
    {id:'question',kind:'question',eyebrow:'DECISION REQUIRED',title:'Okay, serious question… sort of.',description:'Would you consider hanging out with a reasonably entertaining human?',next:'schedule',previous:'intro',animation:'pop',duckMood:'cheeky'},
    {id:'schedule',kind:'schedule',eyebrow:'AVAILABILITY INVESTIGATION',title:'Check your very busy celebrity schedule.',description:'When might you be free to hang out?',next:'activities',previous:'question',animation:'slide',duckMood:'thinking'},
    {id:'activities',kind:'activities',eyebrow:'CHOOSE THE LEVEL OF CHAOS',title:'What’s our official excuse?',description:'Pick the meetup that sounds least suspicious.',next:'success',previous:'schedule',animation:'bounce',duckMood:'excited'},
    {id:'success',kind:'success',eyebrow:'MISSION: MOSTLY ACCOMPLISHED',title:'This could be fun.',description:'You’ve officially proposed a meetup. The committee approves.',previous:'activities',animation:'pop',duckMood:'party'},
    {id:'declined',kind:'declined',eyebrow:'MESSAGE RECEIVED',title:'All good. No pressure.',description:'The meetup committee respects your decision. Enjoy your day!',animation:'reveal',duckMood:'calm'}
  ] as StepDefinition[],
  quips:['Nice try, speedy fingers.','The duck has trained for this.','Unexpected cardio, huh?','Catch me if you can!','Even ducks need boundaries.','Plot twist: still running.','Quack-powered evasive maneuvers!'],
  activities:[
    {id:'coffee',emoji:'☕',title:'Coffee mission',desc:'Caffeine and questionable stories'},
    {id:'food',emoji:'🍕',title:'Food expedition',desc:'An excellent excuse to eat'},
    {id:'chat',emoji:'💬',title:'Random conversations',desc:'Absolutely no agenda'},
    {id:'surprise',emoji:'🎲',title:'Surprise me',desc:'Mild adventure, maximum vibes'}
  ],
  timeOptions:['11:00','13:00','16:00','18:00','20:00']
};
