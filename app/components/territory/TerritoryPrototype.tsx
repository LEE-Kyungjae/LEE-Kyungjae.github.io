'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import {copy} from './copy';
import { areas, createGame, HEIGHT, step, WIDTH, useSkill, type Game, type ItemType } from './engine';
import {createUnityRenderer} from './unityRenderer';
const portraits=['hero','mage','pirate','rogue'];
import './territory.css';

type HarnessWindow = Window & { render_game_to_text?: () => string; advanceTime?: (ms: number) => void };
const snapshot=(g:Game)=>({mode:g.mode,remaining:g.remaining,area:areas(g),gauge:g.players[0].gauge,effects:{...g.players[0].effects},event:g.event?{...g.event}:null});
export function TerritoryPrototype({onExit}:{onExit:()=>void}){
  const canvas=useRef<HTMLCanvasElement>(null),frame=useRef<HTMLDivElement>(null),game=useRef<Game>(createGame()),joystick=useRef<HTMLDivElement>(null);
  const draw=useRef<()=>void>(()=>{}),held=useRef(new Set<string>()),stickPointer=useRef<number|null>(null);
  const[assets,setAssets]=useState('loading'),[view,setView]=useState(snapshot(game.current)),[stick,setStick]=useState({x:0,y:0});
  const refresh=useCallback(()=>{setView(snapshot(game.current));draw.current();},[]);
  const start=()=>{if(assets!=='ready')return;game.current=createGame(true,true,crypto.getRandomValues(new Uint32Array(1))[0]);game.current.mode='playing';refresh();canvas.current?.focus();};
  const pause=useCallback(()=>{const g=game.current;if(g.mode==='playing'||g.mode==='paused'){g.mode=g.mode==='playing'?'paused':'playing';stickPointer.current=null;setStick({x:0,y:0});refresh();}},[refresh]);
  const fullscreen=()=>{if(document.fullscreenElement)void document.exitFullscreen();else void frame.current?.requestFullscreen?.().catch(()=>{});};
  useEffect(()=>{
    const element=canvas.current!,renderer=createUnityRenderer(element);let disposed=false;const render=renderer.render;draw.current=()=>render(game.current);
    renderer.ready.then(()=>{if(!disposed){setAssets('ready');render(game.current);}}).catch(()=>{if(!disposed)setAssets('error');});
    let animation=0,last=performance.now(),accumulated=0,manual=false;
    const publish=()=>{setView(snapshot(game.current));render(game.current);};
    const tick=(now:number)=>{const dt=Math.min((now-last)/1000,.05);last=now;if(!manual){step(game.current,dt);accumulated+=dt;if(accumulated>.1){publish();accumulated=0;}else render(game.current);}animation=requestAnimationFrame(tick);};
    const key=(e:KeyboardEvent)=>{
      const arrows:Record<string,string>={ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d'},k=({KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d'} as Record<string,string>)[e.code]??arrows[e.key]??e.key.toLowerCase();
      if('wasd'.includes(k)&&k.length===1){e.preventDefault();if(e.type==='keydown')held.current.add(k);else held.current.delete(k);const dx=Number(held.current.has('d'))-Number(held.current.has('a')),dy=Number(held.current.has('s'))-Number(held.current.has('w'));if(dx||dy){game.current.players[0].angle=Math.atan2(dy,dx);setStick({x:dx*23,y:dy*23});}else setStick({x:0,y:0});}
      if(e.type==='keydown'&&!e.repeat){if(e.key==='Escape'){onExit();return;}if(e.code==='Space'){e.preventDefault();useSkill(game.current);refresh();}if(k==='f')fullscreen();}
    };
    const blur=()=>{held.current.clear();stickPointer.current=null;setStick({x:0,y:0});if(game.current.mode==='playing'){game.current.mode='paused';publish();}};
    const visibility=()=>{if(document.hidden)blur();};
    window.addEventListener('keydown',key);window.addEventListener('keyup',key);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
    const w=window as HarnessWindow;
    w.render_game_to_text=()=>JSON.stringify({coordinates:'origin top-left; x right, y down; cell units',width:WIDTH,height:HEIGHT,mode:game.current.mode,remaining:game.current.remaining,areas:areas(game.current),players:game.current.players,items:game.current.items,traps:game.current.traps,cells:game.current.cells});
    w.advanceTime=(ms)=>{manual=true;step(game.current,Math.max(0,Math.min(ms,180000))/1000);publish();};
render(game.current);animation=requestAnimationFrame(tick);
    return()=>{disposed=true;renderer.dispose();cancelAnimationFrame(animation);window.removeEventListener('keydown',key);window.removeEventListener('keyup',key);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);delete w.render_game_to_text;delete w.advanceTime;};
  },[pause,onExit,refresh]);
  const release=()=>{stickPointer.current=null;setStick({x:0,y:0});};
  const steer=(e:React.PointerEvent<HTMLDivElement>)=>{
    if(game.current.mode!=='playing')return;
    if(e.type==='pointerdown'){if(stickPointer.current!==null)return;stickPointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);}
    if(stickPointer.current!==e.pointerId)return;
    const r=e.currentTarget.getBoundingClientRect(),dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,d=Math.hypot(dx,dy),limit=r.width*.29;
    setStick({x:d>limit?dx/d*limit:dx,y:d>limit?dy/d*limit:dy});if(d>7)game.current.players[0].angle=Math.atan2(dy,dx);
  };
  const pct=(n:number)=>(n/game.current.playableCells*100).toFixed(1)+'%',seconds=Math.ceil(view.remaining),result=view.area[0]===view.area[1]?copy.draw:view.area[0]>view.area[1]?copy.win:copy.lose;
  const effectName=(type:ItemType)=>copy.effects[type];
  return <div className="territory-prototype" ref={frame}>
    <header className="territory-heading"><div><strong>{copy.title}</strong><span>{copy.prototype} · {copy.teamMode}</span></div><div className="territory-actions"><button className="scene-back" onClick={onExit} aria-label="작업실로 돌아가기">←</button><button onClick={pause} disabled={view.mode==='ready'||view.mode==='ended'}>{view.mode==='paused'?copy.resume:copy.pause}</button></div></header>
    <main className="territory-main">
      <div className="territory-score"><div className="territory-you"><div className="territory-portraits">{[0,2].map(i=><img key={i} src={`/assets/projects/territory-icons/${portraits[i]}.webp`} alt={i===0?copy.player:copy.computer}/>)}</div><div><b>{copy.ourTeam}</b><strong>{pct(view.area[0])}</strong></div></div><time aria-label={copy.time}>{Math.floor(seconds/60)}:{String(seconds%60).padStart(2,'0')}</time><div className="territory-bot"><div><b>{copy.otherTeam}</b><strong>{pct(view.area[1])}</strong></div><div className="territory-portraits">{[1,3].map(i=><img key={i} src={`/assets/projects/territory-icons/${portraits[i]}.webp`} alt={copy.computer}/>)}</div></div></div>
      <div className="territory-board"><canvas ref={canvas} width={960} height={640} tabIndex={0} aria-label={copy.board}/>
        {view.event&&view.mode==='playing'&&<div className="territory-event" role="status">{view.event.player===1?copy.player:`${copy.computer} ${view.event.player}`} · {view.event.kind==='item'?effectName(view.event.item!):view.event.kind==='cut'?copy.cut:`${copy.capture} +${view.event.amount}`}</div>}
        {view.mode!=='playing'&&<div className="territory-overlay"><div><span>{view.mode==='ended'?copy.ended:copy.computerCount}</span><h1>{assets==='error'?'캐릭터 로딩 실패':assets!=='ready'?'불러오는 중':view.mode==='ready'?copy.title:view.mode==='paused'?copy.pause:result}</h1>{view.mode==='ready'&&<kbd>{copy.controls}</kbd>}<button disabled={assets!=='ready'} id="territory-start" onClick={view.mode==='paused'?pause:start}>{view.mode==='paused'?copy.resume:view.mode==='ended'?copy.restart:copy.start}</button></div></div>}
      </div>
      <div className="territory-controls">
        <div className="territory-joystick" ref={joystick} role="group" aria-label={copy.joystick} onPointerDown={steer} onPointerMove={steer} onPointerUp={e=>{if(e.pointerId===stickPointer.current)release();}} onPointerCancel={release} onLostPointerCapture={release}><span className="territory-stick-cross"/><span className="territory-stick" style={{transform:`translate(${stick.x}px,${stick.y}px)`}}/></div>
        <div className="territory-player-status"><div className="territory-gauge-heading"><span>{copy.gauge}</span><b>{Math.floor(view.gauge)}%</b></div><div className="territory-gauge" role="progressbar" aria-label={copy.gauge} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(view.gauge)}><span style={{width:`${view.gauge}%`}}/></div><div className="territory-effects">{(['loop','speed','catch'] as const).filter(type=>view.effects[type]>0).map(type=><span key={type}>{effectName(type)} <b>{Math.ceil(view.effects[type])}s</b></span>)}</div><button disabled={view.mode!=='playing'||view.gauge<100||game.current.players[0].cooldown>0} onClick={()=>{useSkill(game.current);refresh();}}>스킬</button><button onClick={start}>{copy.restart}</button></div>
      </div>
    </main>
  </div>;
}
