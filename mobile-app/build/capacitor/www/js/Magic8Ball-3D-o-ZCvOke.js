import{r,j as e,C as $,E as L,O as E,u as z,T as Y}from"./three-DV31HySq.js";import{G as A,aH as W,aI as B,aJ as O,an as _,bf as H,aM as U,aN as V,aO as J,aV as Z,d as D,B as q}from"./index-BarUt2o_.js";import{G as K}from"./GameStatsHeader-DfbFCrGS.js";import{u as v}from"./useGameMeta-C4Hfe5lB.js";import{G as Q}from"./GameRecentPlaysHorizontal-CmiF3H-Z.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const ee=D.div`
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  min-height: 400px;
  
  /* Consistent background for all states */
  background: radial-gradient(circle at center, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);

  /* Romantic degen background elements */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0.15;
    background-image: 
      /* Large dice symbols positioned like 2D version */
      radial-gradient(circle at 12% 15%, transparent 30px, transparent 31px),
      radial-gradient(circle at 88% 85%, transparent 25px, transparent 26px),
      radial-gradient(circle at 75% 25%, transparent 15px, transparent 16px),
      radial-gradient(circle at 25% 75%, transparent 15px, transparent 16px);
    z-index: 1;
  }

  /* Dice symbols overlay */
  &::after {
    content: '⚃ ⚄ ⚂ ⚁ ⚀ ⚅ ⚃ ⚄';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    color: rgba(212, 165, 116, 0.2);
    font-size: 40px;
    font-family: serif;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    letter-spacing: 20px;
    transform: rotate(-15deg);
    z-index: 1;
  }

  /* Mystical circles animation */
  background-size: 400px 400px;
  animation: ${c=>c.$gameState==="playing"?"mysticalFloat 8s ease-in-out infinite":"none"};

  @keyframes mysticalFloat {
    0%, 100% { 
      background-position: 0% 0%, 25% 25%, 75% 75%, 50% 50%; 
    }
    50% { 
      background-position: 25% 25%, 75% 75%, 25% 25%, 75% 75%; 
    }
  }

  /* Floating rune animations */
  @keyframes float0 { 0%, 100% { transform: rotate(0deg) translateY(0px); } 50% { transform: rotate(180deg) translateY(-20px); } }
  @keyframes float1 { 0%, 100% { transform: rotate(45deg) translateY(0px); } 50% { transform: rotate(225deg) translateY(-15px); } }
  @keyframes float2 { 0%, 100% { transform: rotate(90deg) translateY(0px); } 50% { transform: rotate(270deg) translateY(-25px); } }
  @keyframes float3 { 0%, 100% { transform: rotate(135deg) translateY(0px); } 50% { transform: rotate(315deg) translateY(-10px); } }
  @keyframes float4 { 0%, 100% { transform: rotate(180deg) translateY(0px); } 50% { transform: rotate(0deg) translateY(-30px); } }
  @keyframes float5 { 0%, 100% { transform: rotate(225deg) translateY(0px); } 50% { transform: rotate(45deg) translateY(-18px); } }
  @keyframes float6 { 0%, 100% { transform: rotate(270deg) translateY(0px); } 50% { transform: rotate(90deg) translateY(-22px); } }
  @keyframes float7 { 0%, 100% { transform: rotate(315deg) translateY(0px); } 50% { transform: rotate(135deg) translateY(-12px); } }

  /* Mystical circle orbit animations */
  @keyframes orbit0 { 0% { transform: rotate(0deg) translateX(50px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(50px) rotate(-360deg); } }
  @keyframes orbit1 { 0% { transform: rotate(0deg) translateX(70px) rotate(0deg); } 100% { transform: rotate(-360deg) translateX(70px) rotate(360deg); } }
  @keyframes orbit2 { 0% { transform: rotate(0deg) translateX(90px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(90px) rotate(-360deg); } }
  @keyframes orbit3 { 0% { transform: rotate(0deg) translateX(110px) rotate(0deg); } 100% { transform: rotate(-360deg) translateX(110px) rotate(360deg); } }
  @keyframes orbit4 { 0% { transform: rotate(0deg) translateX(130px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(130px) rotate(-360deg); } }
  @keyframes orbit5 { 0% { transform: rotate(0deg) translateX(150px) rotate(0deg); } 100% { transform: rotate(-360deg) translateX(150px) rotate(360deg); } }
`,te=D.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 18px;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
`,ae=({number:c,isAnimating:l,isShaking:f,isWin:n,isLose:x,mobile:s})=>{const o=r.useRef(null),m=r.useRef(null),[d,h]=r.useState(0),[y,S]=r.useState(0);r.useEffect(()=>{if(h(l?.1:.02),f){S(.1);const u=setTimeout(()=>S(0),500);return()=>clearTimeout(u)}},[l,f]),z(u=>{o.current&&(o.current.rotation.x+=d*.5,o.current.rotation.y+=d,y>0?(o.current.position.x=(Math.random()-.5)*y,o.current.position.z=(Math.random()-.5)*y):(o.current.position.x=0,o.current.position.z=0),n?o.current.scale.setScalar(1+Math.sin(u.clock.elapsedTime*4)*.05):x?o.current.scale.setScalar(1+Math.sin(u.clock.elapsedTime*6)*.03):o.current.scale.setScalar(1))});const j="#1a1a2e",t=s?1.2:1.5;return e.jsxs("group",{children:[e.jsxs("mesh",{ref:o,position:[0,0,0],children:[e.jsx("sphereGeometry",{args:[t,32,32]}),e.jsx("meshStandardMaterial",{color:j,metalness:.2,roughness:.1,emissive:"#000",emissiveIntensity:0})]}),e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,0,t*1.08],children:[e.jsx("circleGeometry",{args:[t*.35,32]}),e.jsx("meshStandardMaterial",{color:"#000011",transparent:!0,opacity:1,emissive:"#000055",emissiveIntensity:.4})]}),e.jsx("group",{position:[0,t*.25,t*1.09],children:e.jsx(Y,{fontSize:s?.15:.18,color:"#ffffff",anchorX:"center",anchorY:"middle",outlineWidth:.015,outlineColor:"#000000",fontWeight:"bold",children:"OUTCOME"})}),e.jsx("group",{ref:m,position:[0,-t*.1,t*1.09],children:e.jsx(Y,{fontSize:s?.4:.5,color:n?"#00ff88":x?"#ff4444":"#ffffff",anchorX:"center",anchorY:"middle",outlineWidth:.025,outlineColor:"#000000",fontWeight:"bold",children:typeof c=="string"&&c!==""||typeof c=="number"&&c>0?c.toString():l?"?":"-"})})]}),(l||n)&&e.jsx(e.Fragment,{children:Array.from({length:8}).map((u,g)=>e.jsx(re,{delay:g*.1,color:n?"#ffd700":"#9c27b0",radius:t*1.5},g))})]})},re=({delay:c,color:l,radius:f})=>{const n=r.useRef(null);return z(x=>{if(n.current){const s=x.clock.elapsedTime+c,o=Math.cos(s*2)*f,m=Math.sin(s*3)*.5,d=Math.sin(s*2)*f;n.current.position.set(o,m,d),n.current.scale.setScalar(.5+Math.sin(s*4)*.2)}}),e.jsxs("mesh",{ref:n,children:[e.jsx("sphereGeometry",{args:[.05,8,8]}),e.jsx("meshStandardMaterial",{color:l,emissive:l,emissiveIntensity:.5,transparent:!0,opacity:.7})]})};function fe(){const c=A.useGame(),l=W(),f=B(),[n,x]=O(),{mobile:s}=_(),o=r.useRef(null),[m,d]=r.useState(!1),[h,y]=r.useState(null),[S,j]=r.useState(-1),[t,u]=r.useState({currentNumber:0,targetNumber:0,isAnimating:!1,animationProgress:0,particles:[],randomSequence:[],currentSequenceIndex:0}),g=r.useRef(),k=r.useRef(0),P=H("magic8ball"),C=q.magic8ball.getMultiplier()*n>f.maxPayout,N=2500,R=r.useCallback(i=>{k.current===0&&(k.current=i);const a=i-k.current,b=Math.min(a/N,1),M=80,p=20,I=Math.min(Math.floor(a/M),p-1);u(T=>b>=1||I>=p-1?{...T,isAnimating:!1,animationProgress:1,currentSequenceIndex:p-1}:(g.current=requestAnimationFrame(R),{...T,animationProgress:b,currentSequenceIndex:I}))},[N]),X=r.useCallback(i=>{const a=[],M=typeof i=="string"?i:i===1?"Win":"Lose";for(let p=0;p<19;p++)a.push("Thinking...");a.push(M),u({currentNumber:0,targetNumber:i,isAnimating:!0,animationProgress:0,particles:[],randomSequence:a,currentSequenceIndex:0}),k.current=0,g.current=requestAnimationFrame(R)},[R]),F=r.useMemo(()=>t.isAnimating?t.randomSequence.length>0&&t.currentSequenceIndex<t.randomSequence.length?t.randomSequence[t.currentSequenceIndex]:t.targetNumber!==0&&t.targetNumber!==""?t.targetNumber:"Thinking...":t.targetNumber!==0&&t.targetNumber!==""?t.targetNumber:m&&S>=0?S===1?"Win":"Lose":l.isPlaying?"Thinking...":"-",[t,S,m,l.isPlaying]),w=async()=>{if(n<=0)return;d(!1),j(-1),y(null),u(I=>({...I,currentNumber:0,targetNumber:0,isAnimating:!1,animationProgress:0,particles:[],randomSequence:[],currentSequenceIndex:0})),k.current=0,g.current&&(cancelAnimationFrame(g.current),g.current=void 0);const i=q.magic8ball.calculateBetArray();await c.play({wager:n,bet:i});const a=await c.result(),b=a.payout>0;y(b?"win":"lose");const M=b?"Win":"Lose";j(b?1:0);const p=a.payout-n;P.updateStats(p),setTimeout(()=>X(M),50),setTimeout(()=>{d(!0)},N+100)},G=()=>{d(!1),j(-1),y(null),u(i=>({...i,currentNumber:0,targetNumber:0,isAnimating:!1,animationProgress:0,particles:[],randomSequence:[],currentSequenceIndex:0}))};return e.jsxs(e.Fragment,{children:[e.jsx(A.Portal,{target:"recentplays",children:e.jsx(Q,{gameId:"magic8ball"})}),e.jsx(A.Portal,{target:"stats",children:e.jsx(K,{gameName:"Magic 8-Ball",gameMode:"3D",rtp:"95",stats:P.stats,onReset:P.resetStats,isMobile:s})}),e.jsx(A.Portal,{target:"screen",children:e.jsxs(ee,{$gameState:h==="win"&&!t.isAnimating?"win":h==="lose"&&!t.isAnimating?"lose":t.isAnimating?"playing":"idle",children:[e.jsxs("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:2,opacity:t.isAnimating?.6:.3,transition:"opacity 0.5s ease"},children:[["✦","✧","✩","✪","✫","✬","✭","✮"].map((i,a)=>e.jsx("div",{style:{position:"absolute",color:"rgba(255, 215, 0, 0.6)",fontSize:"24px",fontFamily:"serif",left:`${10+a*10}%`,top:`${20+Math.sin(a*.8)*30}%`,transform:`rotate(${a*45}deg)`,animation:t.isAnimating?`float${a} 3s ease-in-out infinite`:"none"},children:i},a)),Array.from({length:6}).map((i,a)=>e.jsx("div",{style:{position:"absolute",width:`${30+a*10}px`,height:`${30+a*10}px`,borderRadius:"50%",border:"2px solid rgba(138, 43, 226, 0.3)",left:`${20+a*12}%`,top:`${30+a*8}%`,animation:t.isAnimating?`orbit${a} 4s linear infinite`:"none"}},`circle-${a}`))]}),e.jsx(r.Suspense,{fallback:e.jsx(te,{children:"Loading Magic 8-Ball..."}),children:e.jsxs($,{camera:{position:[0,0,s?3.5:4],fov:s?60:50},style:{width:"100%",height:"100%",zIndex:3},children:[e.jsx("ambientLight",{intensity:.4}),e.jsx("spotLight",{position:[10,10,10],angle:.15,penumbra:1,intensity:1,castShadow:!0}),e.jsx("pointLight",{position:[-10,-10,-10],intensity:.5}),e.jsx(L,{preset:"night"}),e.jsx("group",{position:[0,0,0],children:e.jsx(ae,{number:F,isAnimating:t.isAnimating,isShaking:l.isPlaying,isWin:h==="win",isLose:h==="lose",mobile:s})}),e.jsx(E,{enablePan:!1,enableZoom:!0,minDistance:s?2.5:2,maxDistance:s?6:8,minPolarAngle:Math.PI/4,maxPolarAngle:Math.PI-Math.PI/4,target:[0,0,0]})]})}),e.jsx(U,{ref:o,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...v("magic8ball")&&{title:v("magic8ball").name,description:v("magic8ball").description}})]})}),e.jsxs(A.Portal,{target:"controls",children:[e.jsx(V,{wager:n,setWager:x,onPlay:m?G:w,playDisabled:l.isPlaying||!m&&t.isAnimating||C,playText:m?"New Game":"Ask Magic 8-Ball"}),e.jsx(J,{onPlay:m?G:w,playDisabled:l.isPlaying||!m&&t.isAnimating||C,playText:m?"New Game":"Ask Magic 8-Ball",children:e.jsx(Z,{value:n,onChange:x})})]})]})}export{fe as default};
