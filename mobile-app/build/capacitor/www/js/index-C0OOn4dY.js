import{R as oe,r as i,j as r}from"./three-DV31HySq.js";import{aC as re,G as C,aH as ie,aI as le,aJ as ce,aK as ue,an as de,aX as me,B as ge,aN as xe,aO as he,aV as fe,aP as Se,d as E}from"./index-BarUt2o_.js";import{G as Ce}from"./GameStatsHeader-DfbFCrGS.js";import{G as Le}from"./GameRecentPlaysHorizontal-CmiF3H-Z.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const t={GRID_SIZE:40,GRID_COLS:8,GRID_ROWS:5,MAX_SELECTION:10,DRAW_COUNT:10,CANVAS_WIDTH:1200,CANVAS_HEIGHT:800,CELL_SIZE:60,CELL_GAP:8,GRID_START_X:200,GRID_START_Y:150,COLORS:{background:"#0f0f23",gridBackground:"rgba(212, 165, 116, 0.1)",cellDefault:"rgba(212, 165, 116, 0.2)",cellSelected:"#d4a574",cellWinning:"#b8336a",cellDrawn:"rgba(139, 90, 158, 0.6)",text:"#ffffff",textSecondary:"#d4a574"}},pe={1:{0:0,1:3},2:{0:0,1:1,2:9},3:{0:0,1:1,2:2,3:16},4:{0:0,1:.5,2:2,3:6,4:25},5:{0:0,1:.5,2:1,3:3,4:15,5:50},6:{0:0,1:.5,2:1,3:2,4:3,5:30,6:75},7:{0:0,1:.5,2:.5,3:1,4:6,5:12,6:36,7:100},8:{0:0,1:.5,2:.5,3:1,4:2,5:4,6:20,7:80,8:500},9:{0:0,1:.5,2:.5,3:1,4:1,5:5,6:10,7:50,8:200,9:1e3},10:{0:0,1:0,2:.5,3:1,4:2,5:5,6:15,7:40,8:100,9:250,10:1800}},g={IDLE:"idle",PLAYING:"playing",REVEALING:"revealing",COMPLETE:"complete"},p={click:()=>{const s=new Audio;s.volume=.3;const o=new AudioContext,u=o.createOscillator(),x=o.createGain();u.connect(x),x.connect(o.destination),u.frequency.setValueAtTime(800,o.currentTime),x.gain.setValueAtTime(.1,o.currentTime),x.gain.exponentialRampToValueAtTime(.01,o.currentTime+.1),u.start(),u.stop(o.currentTime+.1)},draw:()=>{const s=new AudioContext,o=s.createOscillator(),u=s.createGain();o.connect(u),u.connect(s.destination),o.frequency.setValueAtTime(1200,s.currentTime),o.frequency.exponentialRampToValueAtTime(600,s.currentTime+.3),u.gain.setValueAtTime(.15,s.currentTime),u.gain.exponentialRampToValueAtTime(.01,s.currentTime+.3),o.start(),o.stop(s.currentTime+.3)},hit:()=>{const s=new AudioContext,o=s.createOscillator(),u=s.createGain();o.connect(u),u.connect(s.destination),o.frequency.setValueAtTime(1e3,s.currentTime),o.frequency.setValueAtTime(1200,s.currentTime+.1),u.gain.setValueAtTime(.2,s.currentTime),u.gain.exponentialRampToValueAtTime(.01,s.currentTime+.2),o.start(),o.stop(s.currentTime+.2)},bigWin:()=>{const s=new AudioContext;for(let o=0;o<3;o++)setTimeout(()=>{const u=s.createOscillator(),x=s.createGain();u.connect(x),x.connect(s.destination),u.frequency.setValueAtTime(800+o*200,s.currentTime),x.gain.setValueAtTime(.15,s.currentTime),x.gain.exponentialRampToValueAtTime(.01,s.currentTime+.3),u.start(),u.stop(s.currentTime+.3)},o*100)}},Ee=E.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${t.COLORS.background};
  position: relative;
  overflow: hidden;
`,be=E.div`
  position: relative;
  background: linear-gradient(135deg, ${t.COLORS.background} 0%, rgba(212, 165, 116, 0.05) 100%);
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`,Ae=E.canvas`
  display: block;
  border-radius: 18px;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 0 30px rgba(212, 165, 116, 0.3);
  }
`,Te=E.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: ${t.COLORS.text};
  
  h3 {
    margin: 0 0 10px 0;
    color: ${t.COLORS.textSecondary};
    font-size: 24px;
  }
  
  p {
    margin: 5px 0;
    font-size: 16px;
  }
`,ye=E.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: ${t.COLORS.text};
  font-size: 14px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  max-width: 200px;
  
  h4 {
    margin: 0 0 10px 0;
    color: ${t.COLORS.textSecondary};
    text-align: center;
  }
  
  .payout-row {
    display: flex;
    justify-content: space-between;
    margin: 3px 0;
    padding: 2px 5px;
    border-radius: 3px;
    
    &.highlighted {
      background: rgba(212, 165, 116, 0.2);
      color: ${t.COLORS.textSecondary};
    }
  }
`;function ke({}){const s=re({gameName:"Keno",description:"Pick your lucky numbers and watch the draw! Classic lottery-style game with up to 10 number selections",rtp:95,maxWin:"1000x"}),o=C.useGame();ie(),le();const[u,x]=ce(),{settings:Re}=ue();oe.useRef(null);const{mobile:N}=de(),[h,L]=i.useState(g.IDLE),[d,b]=i.useState([]),[A,v]=i.useState([]),[k,T]=i.useState(new Set),[U,y]=i.useState(null),[j,R]=i.useState(0),[q,V]=i.useState(0),[Ie,F]=i.useState(0),[X,K]=i.useState(0),[z,J]=i.useState(0),[Q,ee]=i.useState(0),[Ge,te]=i.useState(0),I=i.useRef(null),G=i.useRef(),[W,O]=i.useState([]),_=me(),S=i.useMemo(()=>{const n=[];for(let e=1;e<=t.GRID_SIZE;e++){const a=Math.floor((e-1)/t.GRID_COLS),l=(e-1)%t.GRID_COLS;n.push({number:e,x:t.GRID_START_X+l*(t.CELL_SIZE+t.CELL_GAP),y:t.GRID_START_Y+a*(t.CELL_SIZE+t.CELL_GAP),selected:d.includes(e),drawn:A.includes(e),revealed:k.has(e),isWinning:d.includes(e)&&A.includes(e)})}return n},[d,A,k]),ne=i.useCallback(n=>{if(h!==g.IDLE)return;const e=I.current;if(!e)return;const a=e.getBoundingClientRect(),l=n.clientX-a.left,m=n.clientY-a.top;for(const c of S)if(l>=c.x&&l<=c.x+t.CELL_SIZE&&m>=c.y&&m<=c.y+t.CELL_SIZE){d.includes(c.number)?(b(f=>f.filter(w=>w!==c.number)),p.click()):d.length<t.MAX_SELECTION&&(b(f=>[...f,c.number]),p.click(),P(c.x+t.CELL_SIZE/2,c.y+t.CELL_SIZE/2,t.COLORS.cellSelected));break}},[h,S,d]),P=i.useCallback((n,e,a)=>{const l=[];for(let m=0;m<8;m++)l.push({x:n,y:e,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*10,life:1,color:a});O(m=>[...m,...l])},[]),M=i.useCallback(()=>{O(n=>n.map(e=>({...e,x:e.x+e.vx,y:e.y+e.vy,vx:e.vx*.98,vy:e.vy*.98,life:e.life-.02})).filter(e=>e.life>0))},[]),Z=i.useCallback(()=>{const n=I.current;if(!n)return;const e=n.getContext("2d");e&&(e.fillStyle=t.COLORS.background,e.fillRect(0,0,t.CANVAS_WIDTH,t.CANVAS_HEIGHT),e.fillStyle=t.COLORS.gridBackground,e.fillRect(t.GRID_START_X-20,t.GRID_START_Y-20,(t.CELL_SIZE+t.CELL_GAP)*t.GRID_COLS-t.CELL_GAP+40,(t.CELL_SIZE+t.CELL_GAP)*t.GRID_ROWS-t.CELL_GAP+40),S.forEach(a=>{let l=t.COLORS.cellDefault,m="transparent",c=!1;a.revealed?a.isWinning?(l=t.COLORS.cellWinning,c=!0):a.drawn&&(l=t.COLORS.cellDrawn):a.selected&&(l=t.COLORS.cellSelected,m=t.COLORS.textSecondary),c?(e.shadowColor=t.COLORS.cellWinning,e.shadowBlur=20):e.shadowBlur=0,e.fillStyle=l,e.fillRect(a.x,a.y,t.CELL_SIZE,t.CELL_SIZE),m!=="transparent"&&(e.strokeStyle=m,e.lineWidth=2,e.strokeRect(a.x,a.y,t.CELL_SIZE,t.CELL_SIZE)),e.shadowBlur=0,e.fillStyle=t.COLORS.text,e.font="bold 18px Arial",e.textAlign="center",e.textBaseline="middle",e.fillText(a.number.toString(),a.x+t.CELL_SIZE/2,a.y+t.CELL_SIZE/2)}),W.forEach(a=>{e.globalAlpha=a.life,e.fillStyle=a.color,e.beginPath(),e.arc(a.x,a.y,3,0,Math.PI*2),e.fill()}),e.globalAlpha=1)},[S,W]);i.useEffect(()=>{const n=()=>{M(),Z(),G.current=requestAnimationFrame(n)};return n(),()=>{G.current&&cancelAnimationFrame(G.current)}},[M,Z]);const H=i.useCallback(n=>ge["keno-v2"].calculateBetArray(n),[]),B=i.useCallback((n,e)=>{const l=Array.from({length:t.GRID_SIZE},(m,c)=>c+1).filter(m=>!e.includes(m));if(n&&e.length>0){const m=Math.min(Math.ceil(e.length*.7),e.length),c=e.slice(0,m),f=t.DRAW_COUNT-c.length,D=[...l].sort(()=>Math.random()-.5).slice(0,f);return[...c,...D].sort(()=>Math.random()-.5)}else{const m=Math.max(0,Math.floor(e.length*.3)),c=e.slice(0,m),f=t.DRAW_COUNT-c.length,D=[...l].sort(()=>Math.random()-.5).slice(0,f);return[...c,...D].sort(()=>Math.random()-.5)}},[]),Y=i.useCallback(async(n,e)=>{L(g.REVEALING);for(let l=0;l<n.length;l++)await new Promise(m=>{setTimeout(()=>{if(T(c=>new Set(c).add(n[l])),d.includes(n[l])){p.hit();const c=S.find(f=>f.number===n[l]);c&&P(c.x+t.CELL_SIZE/2,c.y+t.CELL_SIZE/2,t.COLORS.cellWinning)}else p.draw();m(!0)},300)});const a=d.filter(l=>n.includes(l)).length;R(a),setTimeout(()=>{e&&p.bigWin(),L(g.COMPLETE)},500)},[d,S,P]),$=i.useCallback(async()=>{if(d.length===0){_({title:"Selection Required",description:"Please select at least one number!"});return}try{L(g.PLAYING),T(new Set),y(null),R(0);const n=H(d.length);await o.play({wager:u,bet:n});const e=await o.result(),a=e.payout>0;V(e.payout),y(a);const l=B(a,d);v(l),await Y(l,a)}catch(n){_({title:"Game Error",description:`Game error: ${n.message}`}),L(g.IDLE)}},[d,u,o,H,B,Y,_]),ae=i.useCallback(()=>{b([]),v([]),T(new Set),y(null),R(0),V(0),L(g.IDLE),O([])},[]),se=i.useMemo(()=>d.length===0?{}:pe[d.length]||{},[d.length]);return r.jsxs(r.Fragment,{children:[s,r.jsx(C.Portal,{target:"recentplays",children:r.jsx(Le,{gameId:"keno-v2"})}),r.jsx(C.Portal,{target:"stats",children:r.jsx(Ce,{gameName:"Keno",gameMode:"V2",rtp:"95",stats:{gamesPlayed:X,wins:z,losses:Q},onReset:()=>{K(0),J(0),ee(0),F(0),te(0)},isMobile:N})}),r.jsx(C.Portal,{target:"screen",children:r.jsx(C.Responsive,{children:r.jsx(Ee,{children:r.jsxs(be,{children:[r.jsx(Ae,{ref:I,width:t.CANVAS_WIDTH,height:t.CANVAS_HEIGHT,onClick:ne}),r.jsxs(Te,{children:[r.jsx("h3",{children:"Keno v2"}),r.jsxs("p",{children:["Selected: ",d.length,"/",t.MAX_SELECTION]}),h===g.COMPLETE&&r.jsxs(r.Fragment,{children:[r.jsxs("p",{children:["Hits: ",j,"/",d.length]}),r.jsxs("p",{children:["Result: ",U?`Won ${q.toFixed(2)}`:"Lost"]})]})]}),d.length>0&&r.jsxs(ye,{children:[r.jsx("h4",{children:"Paytable"}),Object.entries(se).map(([n,e])=>r.jsxs("div",{className:`payout-row ${j===parseInt(n)?"highlighted":""}`,children:[r.jsxs("span",{children:[n," hits:"]}),r.jsxs("span",{children:[Number(e).toFixed(1),"x"]})]},n))]})]})})})}),r.jsx(C.Portal,{target:"controls",children:N?r.jsx(xe,{wager:u,setWager:x,onPlay:$,playDisabled:d.length===0||h===g.PLAYING||h===g.REVEALING,playText:h===g.PLAYING?"Playing...":"Play"}):r.jsxs(he,{onPlay:$,playDisabled:d.length===0||h===g.PLAYING||h===g.REVEALING,playText:h===g.PLAYING?"Playing...":"Play",children:[r.jsx(fe,{value:u,onChange:x,disabled:h!==g.IDLE}),r.jsx(Se,{onClick:ae,disabled:h===g.PLAYING||h===g.REVEALING,children:"Clear"})]})})]})}export{ke as default};
