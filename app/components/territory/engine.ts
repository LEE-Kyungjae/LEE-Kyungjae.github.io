export const WIDTH = 96;
export const HEIGHT = 64;
export const DURATION = 120;
export const EFFECT_SECONDS = 6;
export const TRAP_SECONDS = 4;
export const ITEM_TYPES = ['burst', 'trap', 'loop', 'speed', 'catch'] as const;
export type ItemType = typeof ITEM_TYPES[number];
export type Point = { x: number; y: number };
export type Player = Point & { id: number; team: number; angle: number; trail: number[]; trace: Point[]; cooldown: number; cuts: number; captures: number; gauge: number; effects: Record<'loop' | 'speed' | 'catch', number>; botPath: Point[]; botRound: number };
export type Item = Point & { id: number; type: ItemType };
export type Trap = Point & { team: number; radius: number; remaining: number; caught: number[] };
export type Game = { cells: number[]; revision: number; players: Player[]; remaining: number; mode: 'ready' | 'playing' | 'paused' | 'ended'; bot: boolean; itemsEnabled: boolean; items: Item[]; traps: Trap[]; spawnIn: number; nextItemId: number; randomSeed: number; event: { kind: 'capture' | 'cut' | 'item'; player: number; amount: number; ttl: number; item?: ItemType } | null };
export const cellAt = (x: number, y: number) => Math.floor(y) * WIDTH + Math.floor(x);
export function createGame(bot = true, itemsEnabled = true, seed = 14287): Game {
  const cells = Array<number>(WIDTH * HEIGHT).fill(0);
  const players: Player[] = [[17,27,1],[79,27,2],[17,37,1],[79,37,2]].map(([x,y,team],i)=>({id:i+1,team,x:x+.5,y:y+.5,angle:team===1?0:Math.PI,trail:[],trace:[],cooldown:0,cuts:0,captures:0,gauge:0,effects:{loop:0,speed:0,catch:0},botPath:[],botRound:0}));
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)for(const [cx,team] of [[17.5,1],[79.5,2]]) if(Math.hypot(x+.5-cx,y+.5-32.5)<10)cells[y*WIDTH+x]=team;
  const g: Game={cells,revision:0,players,remaining:DURATION,mode:'ready',bot,itemsEnabled,items:[],traps:[],spawnIn:8,nextItemId:1,randomSeed:seed>>>0,event:null};
  if(itemsEnabled){spawnItem(g);spawnItem(g);spawnItem(g);}return g;
}
export function areas(g: Game) { return [1,2].map(team=>g.cells.reduce((n,v)=>n+Number(v===team),0)); }
export function claim(g: Game,p: Player,indices: Iterable<number>) {
  let neutral=0,enemy=0;
  for(const i of indices){if(i<0||i>=g.cells.length||g.cells[i]===p.team)continue;if(g.cells[i]===0)neutral++;else enemy++;g.cells[i]=p.team;}
  if(neutral+enemy){p.gauge=Math.min(100,p.gauge+(neutral+enemy*2)*.08);g.revision++;}
  return neutral+enemy;
}
export function capture(g: Game, p: Player, widen = false) {
  if(!p.trail.length)return;
  const boundary=new Set(p.trail);
  if(widen)for(const i of p.trail){const x=i%WIDTH,y=Math.floor(i/WIDTH);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(x+dx>=0&&x+dx<WIDTH&&y+dy>=0&&y+dy<HEIGHT)boundary.add((y+dy)*WIDTH+x+dx);}
  const outside=new Uint8Array(WIDTH*HEIGHT),queue:number[]=[];
  const visit=(i:number)=>{if(!outside[i]&&g.cells[i]!==p.team&&!boundary.has(i)){outside[i]=1;queue.push(i);}};
  for(let x=0;x<WIDTH;x++){visit(x);visit((HEIGHT-1)*WIDTH+x);}for(let y=0;y<HEIGHT;y++){visit(y*WIDTH);visit(y*WIDTH+WIDTH-1);}
  for(let n=0;n<queue.length;n++){const i=queue[n],x=i%WIDTH,y=Math.floor(i/WIDTH);if(x>0)visit(i-1);if(x<WIDTH-1)visit(i+1);if(y>0)visit(i-WIDTH);if(y<HEIGHT-1)visit(i+WIDTH);}
  const claimed:number[]=[];for(let i=0;i<outside.length;i++)if(!outside[i])claimed.push(i);
  const amount=claim(g,p,claimed);p.trail=[];p.trace=[];p.captures++;g.event={kind:'capture',player:p.id,amount,ttl:1.8};
}
export function returnHome(g: Game,p: Player){
  let home=-1,distance=Infinity;
  for(let i=0;i<g.cells.length;i++)if(g.cells[i]===p.team){const d=Math.hypot(i%WIDTH+.5-p.x,Math.floor(i/WIDTH)+.5-p.y);if(d<distance){home=i;distance=d;}}
  if(home<0){home=g.cells.findIndex(v=>v===0);if(home<0){g.mode='ended';return;}g.cells[home]=p.team;g.revision++;}
  p.x=home%WIDTH+.5;p.y=Math.floor(home/WIDTH)+.5;p.trail=[];p.trace=[];p.cooldown=1;p.angle=p.team===1?0:Math.PI;p.botPath=[];
  for(const trap of g.traps)trap.caught=trap.caught.filter(id=>id!==p.id);
}
function random(g:Game){g.randomSeed=(Math.imul(g.randomSeed,1664525)+1013904223)>>>0;return g.randomSeed/4294967296;}
export function spawnItem(g:Game){
  if(g.items.length>=4)return;
  for(let attempt=0;attempt<50;attempt++){
    const x=8+random(g)*(WIDTH-16),y=8+random(g)*(HEIGHT-16);
    if(g.cells[cellAt(x,y)]!==0||g.players.some(p=>Math.hypot(p.x-x,p.y-y)<7)||g.items.some(i=>Math.hypot(i.x-x,i.y-y)<8))continue;
    g.items.push({id:g.nextItemId++,x,y,type:ITEM_TYPES[Math.floor(random(g)*ITEM_TYPES.length)]});return;
  }
}
export function collectItem(g:Game,p:Player,item:Item){
  g.items=g.items.filter(i=>i.id!==item.id);
  if(item.type==='burst'){
    const disk:number[]=[];for(let y=Math.max(0,Math.floor(p.y-7));y<Math.min(HEIGHT,p.y+7);y++)for(let x=Math.max(0,Math.floor(p.x-7));x<Math.min(WIDTH,p.x+7);x++)if(Math.hypot(x+.5-p.x,y+.5-p.y)<=7)disk.push(y*WIDTH+x);
    claim(g,p,disk);
  }else if(item.type==='trap')g.traps.push({x:p.x,y:p.y,team:p.team,radius:9,remaining:TRAP_SECONDS,caught:[]});
  else p.effects[item.type]=EFFECT_SECONDS;
  g.event={kind:'item',item:item.type,player:p.id,amount:0,ttl:2};
}
function steerBot(g:Game,p:Player){
  if(p.cooldown>0)return;
  if(!p.botPath.length){
    const cx=p.team===1?17.5:79.5,cy=p.id<=2?26.5:38.5,dir=p.team===1?1:-1,side=p.id<=2?-1:1;
    const depth=Math.min(49,14+(p.botRound++%7)*5);
    p.botPath=[{x:cx,y:cy},...Array.from({length:24},(_,i)=>{const angle=(i+1)/24*Math.PI*2;return{x:cx+dir*depth*(1-Math.cos(angle))/2,y:cy+side*9*Math.sin(angle)};})];
  }
  while(p.botPath.length&&Math.hypot(p.botPath[0].x-p.x,p.botPath[0].y-p.y)<.5)p.botPath.shift();
  if(p.botPath.length)p.angle=Math.atan2(p.botPath[0].y-p.y,p.botPath[0].x-p.x);
}
function constrainTraps(g:Game,p:Player,next:Point):Point{
  const active=g.traps.filter(t=>t.team!==p.team&&t.caught.includes(p.id));
  if(!active.length||active.every(t=>Math.hypot(next.x-t.x,next.y-t.y)<=t.radius))return next;
  let lo=0,hi=1;for(let n=0;n<14;n++){const f=(lo+hi)/2,x=p.x+(next.x-p.x)*f,y=p.y+(next.y-p.y)*f;if(active.every(t=>Math.hypot(x-t.x,y-t.y)<=t.radius))lo=f;else hi=f;}
  return{x:p.x+(next.x-p.x)*lo,y:p.y+(next.y-p.y)*lo};
}
export function step(g:Game,seconds:number){
  if(g.mode!=='playing'||seconds<=0)return;
  const dt=Math.min(seconds,g.remaining),count=Math.max(1,Math.ceil(dt*60));
  for(let s=0;s<count&&g.mode==='playing';s++){
    const d=dt/count;
    for(const p of g.players){for(const key of ['speed','loop','catch'] as const)p.effects[key]=Math.max(0,p.effects[key]-d);if(g.bot&&p.id!==1)steerBot(g,p);}
    for(const trap of g.traps){trap.remaining-=d;for(const p of g.players)if(p.team!==trap.team&&p.cooldown<=0&&Math.hypot(p.x-trap.x,p.y-trap.y)<=trap.radius&&!trap.caught.includes(p.id))trap.caught.push(p.id);}
    g.traps=g.traps.filter(t=>t.remaining>0);
    const destinations=g.players.map(p=>{
      if(p.cooldown>0){p.cooldown=Math.max(0,p.cooldown-d);return{x:p.x,y:p.y};}
      const speed=p.effects.speed>0?16:10;
      const x=p.x+Math.cos(p.angle)*speed*d,y=p.y+Math.sin(p.angle)*speed*d;
      if(x<.1||x>WIDTH-.1)p.angle=Math.PI-p.angle;if(y<.1||y>HEIGHT-.1)p.angle=-p.angle;
      return constrainTraps(g,p,{x:Math.max(.1,Math.min(WIDTH-.1,x)),y:Math.max(.1,Math.min(HEIGHT-.1,y))});
    });
    const cut=new Set<number>();
    g.players.forEach((attacker,i)=>{
      if(attacker.cooldown>0)return;const c=cellAt(destinations[i].x,destinations[i].y);
      g.players.forEach((victim,j)=>{if(victim.team===attacker.team||victim.cooldown>0)return;
        if(victim.trail.includes(c)||(attacker.effects.catch>0&&Math.hypot(destinations[i].x-destinations[j].x,destinations[i].y-destinations[j].y)<3.2)){
          if(!cut.has(victim.id))attacker.cuts++;cut.add(victim.id);
        }
      });
    });
    g.players.forEach((p,i)=>{
      if(cut.has(p.id)){returnHome(g,p);g.event={kind:'cut',player:p.id,amount:0,ttl:1.8};return;}
      if(p.cooldown>0)return;
      const old=cellAt(p.x,p.y),prior={x:p.x,y:p.y};[p.x,p.y]=[destinations[i].x,destinations[i].y];const c=cellAt(p.x,p.y);
      const loop=p.effects.loop>0&&old!==c&&p.trail.indexOf(c)>=0&&p.trail.indexOf(c)<p.trail.length-3;
      if(old!==c&&old%WIDTH!==c%WIDTH&&Math.floor(old/WIDTH)!==Math.floor(c/WIDTH)){
        const bridge=Math.floor(p.y)*WIDTH+old%WIDTH;if(g.cells[bridge]!==p.team&&!p.trail.includes(bridge))p.trail.push(bridge);
      }
      if(g.cells[c]===p.team||loop)capture(g,p,loop);
      else{if(!p.trace.length)p.trace.push(prior);const last=p.trace[p.trace.length-1];if(Math.hypot(last.x-p.x,last.y-p.y)>.3)p.trace.push({x:p.x,y:p.y});if(!p.trail.includes(c))p.trail.push(c);}
      if(g.itemsEnabled){const item=g.items.find(item=>Math.hypot(item.x-p.x,item.y-p.y)<1.8);if(item)collectItem(g,p,item);}
    });
    for(const p of g.players)if(!g.cells.includes(p.team))returnHome(g,p);
    if(g.event){g.event.ttl-=d;if(g.event.ttl<=0)g.event=null;}
    if(g.itemsEnabled){g.spawnIn-=d;if(g.spawnIn<=0){spawnItem(g);g.spawnIn=8;}}
  }
  g.remaining=Math.max(0,g.remaining-dt);if(g.remaining===0)g.mode='ended';
}
