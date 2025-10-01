import{R as s,j as t}from"./three-DV31HySq.js";import{aJ as st,G as M,aI as nt,aL as ot,aK as rt,an as it,bf as lt,aM as ct,aN as ut,bp as dt,aV as pt,aW as mt,d as S}from"./index-BarUt2o_.js";import{G as ht}from"./GameStatsHeader-DfbFCrGS.js";import{W as xt,C as gt,S as ft,a as bt,b as yt,L as Ct,c as Mt,d as St,e as jt,f as wt,M as Rt,R as Ft}from"./win-C3lEYgs3.js";import{u as L}from"./useGameMeta-C4Hfe5lB.js";import{m as Pt}from"./deterministicRng-BQgZTO1k.js";import{G as $t}from"./GameRecentPlaysHorizontal-CmiF3H-Z.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const vt=S.div`
  display: flex;
  align-items: center;
  gap: 24px;
  
  @media (max-width: 800px) {
    display: none;
  }
`,X=S.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`,Y=S.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  width: 80px;
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`,Gt=S.button`
  background: ${a=>a.disabled?"#666":"linear-gradient(135deg, #4CAF50, #45a049)"};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: ${a=>a.disabled?"not-allowed":"pointer"};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${a=>a.disabled?"#666":"linear-gradient(135deg, #45a049, #4CAF50)"};
    transform: ${a=>a.disabled?"none":"translateY(-1px)"};
  }
  
  &:active {
    transform: ${a=>a.disabled?"none":"translateY(0)"};
  }
`,kt=S.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  z-index: 100;
`;function Ht(){const[a,j]=st(),[x,B]=s.useState(2),[n,$]=s.useState(1),[e,w]=s.useState("waiting"),[J,I]=s.useState(0),[l,D]=s.useState(!1),[R,E]=s.useState(0),[g,z]=s.useState(0),[Ot,N]=s.useState(0),[f,W]=s.useState(null),K=M.useGame(),v=nt(),d=ot({music:ft,crash:gt,win:xt}),u=s.useRef(null),T=s.useMemo(()=>100,[]),G=s.useMemo(()=>v.maxPayout/T,[v.maxPayout,T]),_=a*n>v.maxPayout;s.useEffect(()=>{a>G&&j(G)},[G,a,j]);const{settings:h}=rt(),{mobile:V}=it(),b=lt("crash"),p=s.useRef(null),Q=()=>{const o=Math.max(n,1),r=Math.log(o),i=Math.log(20),c=Math.min(r/i,1),y=10,C=15,F=y+c*(85-y),k=C+Math.pow(c,1.2)*(80-C),O=Math.pow(c,.8),P=90,A=P-O*(P-15);return{bottom:`${k}%`,left:`${F}%`,transform:`rotate(${A}deg)`,transition:e==="crashed"?"none":"all 0.1s ease-out"}},Z=o=>{const i=Pt(`crash:${o}`)();return i<.5?1+i*2:i<.8?2+(i-.5)/.3*3:i<.95?5+(i-.8)/.15*15:20+(i-.95)/.05*80},H=s.useCallback(o=>{let r,i=Date.now(),c=1;const y=()=>{const F=Date.now(),k=F-i;i=F;const O=8e-4,P=(c-1)*3e-4,A=(O+P)*k;if(c=Math.min(c+A,o),$(c),l&&c>=x&&e==="playing"){U();return}if(c>=o){tt();return}e==="playing"&&(r=requestAnimationFrame(y))};r=requestAnimationFrame(y);const C=()=>cancelAnimationFrame(r);return u.current=C,C},[l,x,e]),U=s.useCallback(async()=>{if(!(e!=="playing"||!l||!f)){E(n),w("cashed_out");try{console.log(`💰 Cashed out at ${n.toFixed(2)}x`),p.current?.winFlash(),p.current?.particleBurst(70,30,void 0,12),p.current?.screenShake(1,400),d.play("win"),d.sounds.music.player.stop()}catch(o){console.error("Cash out error:",o)}}},[e,l,f,n,d]),tt=s.useCallback(()=>{w("crashed"),I(n),p.current?.loseFlash(),p.current?.particleBurst(70,30,void 0,25),p.current?.screenShake(3,800),d.play("crash"),d.sounds.music.player.stop(),console.log(`💥 Crashed at ${n.toFixed(2)}x`),setTimeout(m,3e3)},[n,d]),m=s.useCallback(()=>{u.current&&(u.current(),u.current=null),w("betting"),$(1),I(0),D(!1),E(0),N(0),W(null),z(5);const o=setInterval(()=>{z(r=>r<=1?(clearInterval(o),w("playing"),0):r-1)},1e3)},[]),q=async()=>{if(!(e!=="betting"||l||a<=0))try{const o=[0,a*.96],r=K.play({wager:a,bet:o});W(r),D(!0),console.log(`🎮 Bet placed: ${a} SOL`)}catch(o){console.error("Failed to place bet:",o)}},et=s.useMemo(()=>e==="crashed"?"#ff0000":e==="cashed_out"?"#00ff00":n>=2?"#ffd700":"#ffffff",[e,n]);return s.useEffect(()=>{m()},[m]),s.useEffect(()=>{e==="playing"&&l&&f&&(async()=>{try{u.current&&(u.current(),u.current=null),$(1);const r=await f,i=Z(`${r.resultIndex}:${r.payout}`);N(i),console.log(`🚀 Game started! Crash point: ${i.toFixed(2)}x`),d.play("music"),setTimeout(()=>{H(i)},50)}catch(r){console.error("Game processing error:",r),m()}})()},[e,l,f,d,H,m]),s.useEffect(()=>{e==="cashed_out"&&R>0?(b.updateStats(a*R*.96),setTimeout(m,2e3)):e==="crashed"&&b.updateStats(0)},[e,R,a,b,m]),s.useEffect(()=>()=>{u.current&&u.current()},[]),t.jsxs(t.Fragment,{children:[t.jsx(M.Portal,{target:"recentplays",children:t.jsx($t,{gameId:"crash"})}),t.jsx(M.Portal,{target:"stats",children:t.jsx(ht,{gameName:"Crash",gameMode:"Rocket",rtp:"96",stats:b.stats,onReset:b.resetStats,isMobile:V})}),t.jsxs(M.Portal,{target:"screen",children:[t.jsxs(bt,{children:[t.jsx(yt,{enableMotion:h.enableMotion,style:{opacity:n>3?0:1}}),t.jsx(Ct,{enableMotion:h.enableMotion,style:{opacity:n>3?1:0}}),t.jsx(Mt,{enableMotion:h.enableMotion,style:{opacity:n>2?0:1}}),t.jsx(St,{enableMotion:h.enableMotion,style:{opacity:n>2?1:0}}),t.jsx(jt,{enableMotion:h.enableMotion,style:{opacity:n>1?0:1}}),t.jsx(wt,{enableMotion:h.enableMotion,style:{opacity:n>1?1:0}}),t.jsxs(kt,{children:[e==="betting"&&`Betting Phase: ${g}s`,e==="playing"&&"Flying...",e==="crashed"&&`Crashed at ${J.toFixed(2)}x`,e==="cashed_out"&&`Cashed out at ${R.toFixed(2)}x`,e==="waiting"&&"Starting..."]}),t.jsxs(Rt,{color:et,children:[n.toFixed(2),"x"]}),t.jsx(Ft,{style:Q()}),l&&e==="playing"&&t.jsx("div",{style:{position:"absolute",bottom:"20px",left:"50%",transform:"translateX(-50%)"},children:t.jsxs(Gt,{onClick:U,children:["Cash Out @ ",n.toFixed(2),"x",t.jsx("br",{}),t.jsxs("small",{children:["Win: ",(a*n*.96).toFixed(4)," SOL"]})]})})]}),t.jsx(ct,{ref:p,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...L("crash")&&{title:L("crash").name,description:L("crash").description}})]}),t.jsxs(M.Portal,{target:"controls",children:[t.jsx(ut,{wager:a,setWager:j,onPlay:q,playDisabled:e!=="betting"||l||_||a<=0,playText:e==="betting"?l?`Bet Placed (${g}s)`:`Place Bet (${g}s)`:e==="playing"?"Round Active":"Next Round",children:t.jsx(dt,{label:"Auto Cash Out",value:x,children:t.jsxs(X,{children:[t.jsx("span",{style:{color:"white",fontSize:"12px"},children:"Auto @"}),t.jsx(Y,{type:"number",value:x,onChange:o=>B(Math.max(1.01,parseFloat(o.target.value)||1.01)),min:"1.01",max:"100",step:"0.01",disabled:e==="playing"}),t.jsx("span",{style:{color:"white",fontSize:"12px"},children:"x"})]})})}),t.jsxs(vt,{children:[t.jsx(pt,{value:a,onChange:j,disabled:e==="playing"}),t.jsxs(X,{children:[t.jsx("span",{style:{color:"white",fontSize:"14px"},children:"Auto Cash Out @"}),t.jsx(Y,{type:"number",value:x,onChange:o=>B(Math.max(1.01,parseFloat(o.target.value)||1.01)),min:"1.01",max:"100",step:"0.01",disabled:e==="playing"}),t.jsx("span",{style:{color:"white",fontSize:"14px"},children:"x"})]}),t.jsx(mt,{onClick:q,disabled:e!=="betting"||l||_||a<=0,children:e==="betting"?l?`Bet Placed (${g}s)`:`Place Bet (${g}s)`:e==="playing"?"Round Active":"Next Round"})]})]})]})}export{Ht as default};
