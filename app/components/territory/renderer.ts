import { HEIGHT, WIDTH, type Game, type ItemType, type Point } from './engine';
const unit=10;
const noise=(i:number,salt:number)=>{const v=Math.sin(i*127.1+salt*311.7)*43758.5453;return v-Math.floor(v);};
const teamInk=['#637365','#087f71','#ba5c53'];
const teamFill=['#f1eddc','#88d5b7','#eeb5a5'];
export const portraits=['hero','mage','pirate','rogue'];
function contour(cells:number[],team:number){
  const edges=new Map<string,Array<[number,number]>>();
  const edge=(x:number,y:number,tx:number,ty:number)=>{const k=`${x},${y}`;edges.set(k,[...(edges.get(k)??[]),[tx,ty]]);};
  for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)if(cells[y*WIDTH+x]===team){
    const i=y*WIDTH+x;
    if(y===0||cells[i-WIDTH]!==team)edge(x,y,x+1,y);
    if(x===WIDTH-1||cells[i+1]!==team)edge(x+1,y,x+1,y+1);
    if(y===HEIGHT-1||cells[i+WIDTH]!==team)edge(x+1,y+1,x,y+1);
    if(x===0||cells[i-1]!==team)edge(x,y+1,x,y);
  }
  const path=new Path2D();
  while(edges.size){
    const first=edges.keys().next().value!;let key=first;let points:Point[]=[];
    for(let n=0;n<WIDTH*HEIGHT*4;n++){
      const [x,y]=key.split(',').map(Number);points.push({x:x*unit,y:y*unit});const options=edges.get(key);if(!options?.length)break;
      const to=options.pop()!;if(!options.length)edges.delete(key);key=to.join(',');if(key===first)break;
    }
    if(points.length<3)continue;
    // One quadratic corner per contour vertex removes the stair-step look without drawing a grid.
    for(let pass=0;pass<5;pass++)points=points.map((p,i)=>{const before=points[(i+points.length-1)%points.length],after=points[(i+1)%points.length];return{x:(before.x+2*p.x+after.x)/4,y:(before.y+2*p.y+after.y)/4};});
    const last=points[points.length-1],start=points[0];path.moveTo((last.x+start.x)/2,(last.y+start.y)/2);
    points.forEach((p,i)=>{const next=points[(i+1)%points.length];path.quadraticCurveTo(p.x,p.y,(p.x+next.x)/2,(p.y+next.y)/2);});path.closePath();
  }
  return path;
}
export function drawItemSymbol(ctx:CanvasRenderingContext2D,type:ItemType,x:number,y:number,size=16){
  ctx.save();ctx.translate(x,y);ctx.scale(size/16,size/16);ctx.strokeStyle='#fff';ctx.fillStyle='#fff';ctx.lineWidth=2;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();
  if(type==='speed'){ctx.moveTo(2,-10);ctx.lineTo(-7,1);ctx.lineTo(0,1);ctx.lineTo(-2,10);ctx.lineTo(8,-2);ctx.lineTo(1,-2);ctx.closePath();ctx.fill();}
  else if(type==='burst'){ctx.arc(0,0,6,0,Math.PI*2);ctx.stroke();for(let i=0;i<8;i++){const a=i*Math.PI/4;ctx.beginPath();ctx.moveTo(Math.cos(a)*9,Math.sin(a)*9);ctx.lineTo(Math.cos(a)*12,Math.sin(a)*12);ctx.stroke();}}
  else if(type==='loop'){ctx.ellipse(0,0,9,7,-.5,0,Math.PI*1.8);ctx.stroke();ctx.beginPath();ctx.moveTo(4,-8);ctx.lineTo(10,-7);ctx.lineTo(9,-1);ctx.stroke();}
  else if(type==='trap'){ctx.ellipse(0,7,10,4,0,0,Math.PI*2);ctx.stroke();for(const dx of [-7,0,7]){ctx.beginPath();ctx.moveTo(dx,6);ctx.lineTo(dx,-7);ctx.stroke();}ctx.beginPath();ctx.arc(0,-3,9,Math.PI,0);ctx.stroke();}
  else {ctx.arc(0,0,9,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-13,0);ctx.lineTo(-5,0);ctx.moveTo(5,0);ctx.lineTo(13,0);ctx.moveTo(0,-13);ctx.lineTo(0,-5);ctx.moveTo(0,5);ctx.lineTo(0,13);ctx.stroke();}
  ctx.restore();
}
export function createRenderer(canvas:HTMLCanvasElement,images:HTMLImageElement[]){
  const ctx=canvas.getContext('2d')!;const terrain=document.createElement('canvas');terrain.width=960;terrain.height=640;const bg=terrain.getContext('2d')!;let revision=-1,oldCells:number[]|null=null;
  return (g:Game)=>{
    const time=120-g.remaining;
    if(revision!==g.revision||oldCells!==g.cells){
      revision=g.revision;oldCells=g.cells;
      const ground=bg.createLinearGradient(0,0,960,640);ground.addColorStop(0,'#f6efdc');ground.addColorStop(1,'#e4e8ce');bg.fillStyle=ground;bg.fillRect(0,0,960,640);
      for(let i=0;i<550;i++){const x=noise(i,1)*960,y=noise(i,2)*640;bg.fillStyle=i%3?'#8e9d5920':'#ffffff80';bg.beginPath();bg.ellipse(x,y,1.5+(i%3),.8,i,0,Math.PI*2);bg.fill();}
      for(const team of [1,2]){
        const path=contour(g.cells,team);
        bg.save();bg.shadowColor=team===1?'#1c80683a':'#9d4f4033';bg.shadowBlur=10;bg.shadowOffsetY=4;bg.fillStyle=teamFill[team];bg.fill(path,'evenodd');bg.restore();
        bg.strokeStyle=team===1?'#4ba891':'#cf8a79';bg.lineWidth=2;bg.stroke(path);
        bg.save();bg.clip(path,'evenodd');
        for(let i=0;i<700;i++){const x=noise(i,3)*960,y=noise(i,4)*640;bg.strokeStyle=team===1?'#24795b22':'#a95e4f20';bg.lineWidth=1.5;bg.beginPath();bg.moveTo(x-2,y+2);bg.quadraticCurveTo(x,y-5,x+1,y);bg.stroke();if(i%13===0){bg.fillStyle='#fffae6a0';bg.beginPath();bg.arc(x+4,y,2,0,Math.PI*2);bg.fill();}}
        bg.restore();
      }
    }
    ctx.drawImage(terrain,0,0);
    for(const trap of g.traps){const x=trap.x*unit,y=trap.y*unit,r=trap.radius*unit;
      ctx.fillStyle='#7163ad18';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7364a6';ctx.lineWidth=3;ctx.setLineDash([7,5]);ctx.stroke();ctx.setLineDash([]);
      for(let i=0;i<16;i++){const a=i*Math.PI/8;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r,y+Math.sin(a)*r);ctx.lineTo(x+Math.cos(a)*(r+7),y+Math.sin(a)*(r+7));ctx.stroke();}
      ctx.font='bold 14px system-ui';ctx.fillStyle='#514177';ctx.textAlign='center';ctx.fillText(String(Math.ceil(trap.remaining)),x,y-r-8);
    }
    for(const p of g.players){
      if(p.trace.length){ctx.beginPath();ctx.moveTo(p.trace[0].x*unit,p.trace[0].y*unit);for(let i=1;i<p.trace.length;i++)ctx.lineTo(p.trace[i].x*unit,p.trace[i].y*unit);ctx.lineTo(p.x*unit,p.y*unit);
        ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=p.effects.loop>0?'#f3bf55a0':'#ffffffe0';ctx.lineWidth=p.effects.loop>0?14:10;ctx.stroke();ctx.strokeStyle=teamInk[p.team];ctx.lineWidth=6;ctx.stroke();}
    }
    const itemColors:Record<ItemType,string>={burst:'#298f79',trap:'#7860ac',loop:'#c88b30',speed:'#4299b1',catch:'#ce675d'};
    for(const item of g.items){const x=item.x*unit,y=item.y*unit-2*Math.sin(time*3+item.id);
      ctx.fillStyle='#314a3920';ctx.beginPath();ctx.ellipse(x,y+17,15,5,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff8e9';ctx.beginPath();ctx.arc(x,y,19,0,Math.PI*2);ctx.fill();ctx.fillStyle=itemColors[item.type];ctx.beginPath();ctx.arc(x,y,15,0,Math.PI*2);ctx.fill();drawItemSymbol(ctx,item.type,x,y,14);
    }
    for(const p of g.players){
      const x=p.x*unit,y=p.y*unit;ctx.save();if(p.cooldown>0)ctx.globalAlpha=.4+.3*Math.sin(time*24);
      if(p.effects.catch>0){ctx.fillStyle='#dd68522b';ctx.strokeStyle='#c85a47';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,32,0,Math.PI*2);ctx.fill();ctx.stroke();}
      if(p.effects.speed>0){ctx.strokeStyle='#68cbe7';ctx.lineWidth=3;for(const offset of [-8,0,8]){ctx.beginPath();ctx.moveTo(x-Math.cos(p.angle)*25+Math.sin(p.angle)*offset,y-Math.sin(p.angle)*25-Math.cos(p.angle)*offset);ctx.lineTo(x-Math.cos(p.angle)*38+Math.sin(p.angle)*offset,y-Math.sin(p.angle)*38-Math.cos(p.angle)*offset);ctx.stroke();}}
      ctx.fillStyle='#223e3333';ctx.beginPath();ctx.ellipse(x,y+18,18,6,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff9e8';ctx.beginPath();ctx.arc(x,y,20,0,Math.PI*2);ctx.fill();
      ctx.save();ctx.beginPath();ctx.arc(x,y,16,0,Math.PI*2);ctx.clip();const image=images[p.id-1];if(image?.complete&&image.naturalWidth)ctx.drawImage(image,x-16,y-16,32,32);else{ctx.fillStyle=teamFill[p.team];ctx.fillRect(x-16,y-16,32,32);}ctx.restore();
      ctx.strokeStyle=teamInk[p.team];ctx.lineWidth=p.id===1?4:2.5;ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.stroke();
      ctx.save();ctx.translate(x,y);ctx.rotate(p.angle);ctx.fillStyle=teamInk[p.team];ctx.beginPath();ctx.moveTo(29,0);ctx.lineTo(22,-5);ctx.lineTo(22,5);ctx.closePath();ctx.fill();ctx.restore();
      ctx.fillStyle=teamInk[p.team];ctx.beginPath();ctx.arc(x+14,y+14,7,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 9px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(p.id),x+14,y+14);ctx.restore();
    }
  };
}
