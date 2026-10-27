'use client';
import {useEffect,useRef} from 'react';

type Spark={x:number;y:number;vx:number;vy:number;born:number;life:number;size:number;color:string};
type Trail={x:number;y:number;born:number;color:string;stroke:number};
export default function PointerEffects({calm}:{calm:boolean}){
  const canvas=useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const el=canvas.current!,ctx=el.getContext('2d');if(!ctx||calm)return;
    let frame=0,down=false,stroke=0,lastX=0,lastY=0,color='#edc780';
    let sparks:Spark[]=[],trail:Trail[]=[];
    const resize=()=>{const ratio=Math.min(devicePixelRatio,2);el.width=innerWidth*ratio;el.height=innerHeight*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);};resize();
    const draw=(now:number)=>{
      frame=0;ctx.clearRect(0,0,innerWidth,innerHeight);
      sparks=sparks.filter(s=>now-s.born<s.life);trail=trail.filter(p=>now-p.born<700);
      ctx.lineCap='round';ctx.lineJoin='round';
      for(let i=1;i<trail.length;i++){
        const a=trail[i-1],b=trail[i];if(a.stroke!==b.stroke)continue;
        const life=1-(now-b.born)/700;ctx.globalAlpha=life*.7;ctx.strokeStyle=b.color;ctx.lineWidth=life*2.4;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        ctx.globalAlpha=life*.75;ctx.strokeStyle='#fff3ce';ctx.lineWidth=life*.65;ctx.stroke();
      }
      for(const s of sparks){const age=(now-s.born)/s.life,seconds=(now-s.born)/1000,x=s.x+s.vx*seconds,y=s.y+s.vy*seconds+22*seconds*seconds;
        ctx.globalAlpha=(1-age)**1.7;ctx.fillStyle=s.color;ctx.save();ctx.translate(x,y);ctx.rotate(age*2+s.vx*.01);const size=s.size*(1-age*.6);ctx.fillRect(-size/2,-size/2,size,size);ctx.restore();}
      ctx.globalAlpha=1;el.dataset.particles=String(sparks.length);el.dataset.trail=String(trail.length);
      if(sparks.length||trail.length)frame=requestAnimationFrame(draw);
    };
    const wake=()=>{if(!frame&&!document.hidden)frame=requestAnimationFrame(draw);};
    const burst=(x:number,y:number,count:number)=>{const now=performance.now();for(let i=0;i<count;i++){const angle=Math.PI*2*(i/count)+Math.random()*.3,speed=25+Math.random()*65;sparks.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,born:now,life:400+Math.random()*350,size:1.5+Math.random()*2.5,color});}sparks=sparks.slice(-140);wake();};
    const start=(e:PointerEvent)=>{if(!e.isPrimary||e.button!==0)return;down=true;stroke++;lastX=e.clientX;lastY=e.clientY;color=(e.target as Element).closest('.splash-gahyeon')?'#77e9e4':'#edc780';trail.push({x:lastX,y:lastY,born:performance.now(),color,stroke});burst(lastX,lastY,16);};
    const move=(e:PointerEvent)=>{if(!down||!e.isPrimary)return;const events=e.getCoalescedEvents?.()||[e];for(const p of events.length?events:[e]){if(Math.hypot(p.clientX-lastX,p.clientY-lastY)<2)continue;lastX=p.clientX;lastY=p.clientY;trail.push({x:lastX,y:lastY,born:performance.now(),color,stroke});}trail=trail.slice(-180);if(Math.random()>.6)burst(lastX,lastY,1);wake();};
    const end=()=>{down=false;};
    const hidden=()=>{if(document.hidden){down=false;cancelAnimationFrame(frame);frame=0;sparks=[];trail=[];ctx.clearRect(0,0,innerWidth,innerHeight);}};
    window.addEventListener('resize',resize);window.addEventListener('pointerdown',start,{passive:true});window.addEventListener('pointermove',move,{passive:true});window.addEventListener('pointerup',end);window.addEventListener('pointercancel',end);window.addEventListener('blur',end);document.addEventListener('visibilitychange',hidden);
    return()=>{cancelAnimationFrame(frame);ctx.clearRect(0,0,innerWidth,innerHeight);window.removeEventListener('resize',resize);window.removeEventListener('pointerdown',start);window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',end);window.removeEventListener('blur',end);document.removeEventListener('visibilitychange',hidden);};
  },[calm]);
  return <canvas ref={canvas} className="portfolio-pointer-effects" aria-hidden="true"/>;
}
