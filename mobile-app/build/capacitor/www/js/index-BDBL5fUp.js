var bt=Object.defineProperty;var ht=(a,r,o)=>r in a?bt(a,r,{enumerable:!0,configurable:!0,writable:!0,value:o}):a[r]=o;var de=(a,r,o)=>ht(a,typeof r!="symbol"?r+"":r,o);import{r as c,j as e,R as ye}from"./three-DV31HySq.js";import{aZ as yt,a_ as vt,a$ as He,d as v,j as Le,b0 as wt,t as it,b1 as Ge,G as ne,as as _,m as se,a6 as Oe,aL as ke,b2 as kt,T as Pe,o as xe,b3 as St,b4 as Ue,b5 as jt,b6 as Ke,P as qe,aC as Mt,aH as Ct,aI as Et,aJ as Pt,aK as It,b7 as Bt,aN as Rt,b8 as Xe,aO as Tt}from"./index-BarUt2o_.js";import{P as At,K as $t}from"./blockchain-C0nfa7Sw.js";import{A as lt}from"./index-CSHl0t8b.js";import{M as te,m as J}from"./matter-BpV9e9-B.js";import{m as Ve}from"./deterministicRng-BQgZTO1k.js";import{F as Wt,W as Ft}from"./fall-BnLIoEie.js";import"./react-vendor-faCf7XlP.js";import"./physics-audio-Bm3pLP40.js";const Dt=c.createContext(null);function zt(){const a=c.useRef(!1);return yt(()=>(a.current=!0,()=>{a.current=!1}),[]),a}function Gt(){const a=zt(),[r,o]=c.useState(0),l=c.useCallback(()=>{a.current&&o(r+1)},[r]);return[c.useCallback(()=>vt.postRender(l),[l]),r]}const Ot=a=>!a.isLayoutDirty&&a.willUpdate(!1);function Je(){const a=new Set,r=new WeakMap,o=()=>a.forEach(Ot);return{add:l=>{a.add(l),r.set(l,l.addEventListener("willUpdate",o))},remove:l=>{a.delete(l);const n=r.get(l);n&&(n(),r.delete(l)),o()},dirty:o}}const ct=a=>a===!0,Lt=a=>ct(a===!0)||a==="id",Nt=({children:a,id:r,inherit:o=!0})=>{const l=c.useContext(He),n=c.useContext(Dt),[C,g]=Gt(),p=c.useRef(null),u=l.id||n;p.current===null&&(Lt(o)&&u&&(r=r?u+"-"+r:u),p.current={id:r,group:ct(o)&&l.group||Je()});const h=c.useMemo(()=>({...p.current,forceRender:C}),[g]);return e.jsx(He.Provider,{value:h,children:a})},Yt=v.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg, 
    var(--deep-romantic-night) 0%, 
    var(--soft-purple-twilight) 15%, 
    var(--deep-crimson-rose) 30%, 
    var(--love-letter-gold) 45%, 
    var(--deep-crimson-rose) 60%, 
    var(--soft-purple-twilight) 75%, 
    var(--deep-romantic-night) 90%
  );
  border-radius: 24px;
  border: 3px solid var(--love-letter-gold);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.9),
    inset 0 2px 4px rgba(212, 165, 116, 0.2),
    inset 0 -2px 4px rgba(10, 5, 17, 0.7),
    0 0 40px var(--deep-crimson-rose);
  overflow: hidden;
  animation: romanticPulse 5s ease-in-out infinite;
  
  /* Romantic racing elements */
  &::before {
    content: '💫';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 150px;
    opacity: 0.12;
    transform: rotate(-18deg);
    pointer-events: none;
    color: var(--love-letter-gold);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.8);
    animation: romantic-velocity-float 8s ease-in-out infinite;
  }

  &::after {
    content: '💖';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 130px;
    opacity: 0.15;
    transform: rotate(25deg);
    pointer-events: none;
    color: var(--deep-crimson-rose);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.8);
    animation: romantic-heartbeat-float 10s ease-in-out infinite reverse;
  }

  @keyframes romanticPulse {
    0%, 100% { 
      filter: brightness(1) saturate(1) hue-rotate(0deg);
      border-color: var(--love-letter-gold);
    }
    25% { 
      filter: brightness(1.05) saturate(1.1) hue-rotate(5deg);
      border-color: var(--deep-crimson-rose);
    }
    50% { 
      filter: brightness(1.1) saturate(1.2) hue-rotate(10deg);
      border-color: var(--soft-purple-twilight);
    }
    75% { 
      filter: brightness(1.05) saturate(1.1) hue-rotate(5deg);
      border-color: var(--deep-crimson-rose);
    }
  }

  @keyframes romantic-velocity-float {
    0%, 100% { 
      transform: rotate(-18deg) translateY(0px) scale(1);
      opacity: 0.12;
    }
    25% { 
      transform: rotate(-15deg) translateY(-15px) scale(1.05);
      opacity: 0.18;
    }
    50% { 
      transform: rotate(-12deg) translateY(-25px) scale(1.1);
      opacity: 0.25;
    }
    75% { 
      transform: rotate(-15deg) translateY(-15px) scale(1.05);
      opacity: 0.18;
    }
  }

  @keyframes romantic-heartbeat-float {
    0%, 100% { 
      transform: rotate(25deg) translateY(0px) scale(1);
      opacity: 0.15;
    }
    33% { 
      transform: rotate(30deg) translateY(-12px) scale(1.08);
      opacity: 0.22;
    }
    66% { 
      transform: rotate(35deg) translateY(-20px) scale(1.15);
      opacity: 0.3;
    }
  }

  /* Override GameScreenFrame's dark background */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  /* General override for any dark background in the frame */
  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }

  /* Override GameScreenFrame wrapper */
  & > div[class*="absolute"][class*="inset"][class*="bg-"] {
    background: transparent !important;
  }

  /* Allow internal layout to flow naturally without height constraints */
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
    pointer-events: auto;
  }

  /* Ensure game content is interactive */
  & [data-component="GameScreenFrame"] {
    z-index: 10;
    position: relative;
    pointer-events: auto;
  }

  /* Ensure the wrapper inside GameScreenFrame is interactive */
  & [data-component="GameScreenFrame"] > * {
    pointer-events: auto;
    z-index: 11;
  }

  .plinko-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional velocity vortex elements */
  .velocity-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🏁';
      position: absolute;
      top: 20%;
      right: 15%;
      font-size: 120px;
      opacity: 0.05;
      transform: rotate(-25deg);
      color: #4d4d9a;
      animation: float-velocity 12s ease-in-out infinite;
    }

    &::after {
      content: '⚡';
      position: absolute;
      bottom: 25%;
      left: 12%;
      font-size: 110px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #2d2d5a;
      animation: float-velocity 9s ease-in-out infinite reverse;
    }
  }

  .race-whispers-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(112, 112, 218, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(77, 77, 154, 0.06) 0%, transparent 50%),
      radial-gradient(circle at 50% 0%, rgba(58, 58, 122, 0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .lightning-speed-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    border: 2px solid rgba(112, 112, 218, 0.1);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
    animation: pulse-speed 4s ease-in-out infinite;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;
      border: 1px solid rgba(96, 96, 186, 0.08);
      border-radius: 50%;
      animation: pulse-speed 6s ease-in-out infinite reverse;
    }

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100px;
      height: 100px;
      border: 1px solid rgba(45, 45, 90, 0.06);
      border-radius: 50%;
      animation: pulse-speed 8s ease-in-out infinite;
    }
  }

  @keyframes float-velocity {
    0%, 100% { 
      transform: translateY(0px) rotate(-18deg); 
      opacity: 0.06; 
    }
    25% { 
      transform: translateY(-10px) rotate(-15deg); 
      opacity: 0.08; 
    }
    50% { 
      transform: translateY(-20px) rotate(-22deg); 
      opacity: 0.04; 
    }
    75% { 
      transform: translateY(-5px) rotate(-20deg); 
      opacity: 0.07; 
    }
  }

  @keyframes pulse-speed {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.1;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.1);
      opacity: 0.05;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 640px) {
    &::before {
      font-size: 80px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 70px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 60px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 50px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 120px;
      height: 120px;

      &::before {
        width: 80px;
        height: 80px;
      }

      &::after {
        width: 50px;
        height: 50px;
      }
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    &::before {
      font-size: 90px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 80px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 70px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 60px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 140px;
      height: 140px;

      &::before {
        width: 90px;
        height: 90px;
      }

      &::after {
        width: 60px;
        height: 60px;
      }
    }
  }

  @media (min-width: 769px) and (max-width: 899px) {
    &::before {
      font-size: 110px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 95px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 85px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 75px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 160px;
      height: 160px;

      &::before {
        width: 110px;
        height: 110px;
      }

      &::after {
        width: 75px;
        height: 75px;
      }
    }
  }

  @media (min-width: 900px) {
    &::before {
      font-size: 120px;
      top: 5%;
      left: 3%;
    }

    &::after {
      font-size: 100px;
      bottom: 5%;
      right: 3%;
    }

    .velocity-bg-elements {
      &::before {
        font-size: 90px;
        top: 15%;
        right: 10%;
      }

      &::after {
        font-size: 80px;
        bottom: 20%;
        left: 8%;
      }
    }

    .lightning-speed-indicator {
      width: 180px;
      height: 180px;

      &::before {
        width: 120px;
        height: 120px;
      }

      &::after {
        width: 80px;
        height: 80px;
      }
    }
  }
`,_t=se`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`,Ht=se`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`,Ut=v(_.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,Kt=v(_.div)`
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  padding: 32px;
  border-radius: 20px;
  width: 92%;
  max-width: 480px;
  color: #fff;
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: ${_t} 3s ease-in-out infinite;
`,qt=v.h2`
  margin: 0 0 24px;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff9500 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`,Ie=v.div`
  margin-bottom: 20px;
`,ve=v.label`
  display: block;
  font-size: 1rem;
  margin-bottom: 8px;
  color: #ffd700;
  font-weight: 600;
`,Xt=v.div`
  display: flex;
  gap: 12px;
`,Te=v.button`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid ${({active:a})=>a?"#ffd700":"rgba(255, 255, 255, 0.2)"};
  border-radius: 12px;
  background: ${({active:a})=>a?"rgba(255, 215, 0, 0.1)":"rgba(40, 40, 40, 0.8)"};
  color: ${({active:a})=>a?"#ffd700":"#fff"};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.2);
    border-color: #ffd700;
  }
`,je=v.input`
  box-sizing: border-box;
  width: 100%;
  padding: 14px 16px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  background: rgba(40, 40, 40, 0.8);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;

  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    background: rgba(50, 50, 50, 0.9);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`,Vt=v.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`,Jt=v.button`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(30, 30, 30, 0.8);
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.5);
    transform: translateY(-1px);
  }
`,Qt=v.div`
  display: flex;
  gap: 16px;
`,Qe=v(Ie)`
  flex: 1;
  margin-bottom: 0;
`,Zt=v.p`
  font-size: 0.9rem;
  color: #ffc107;
  margin: 16px 0 0;
  line-height: 1.4;
  background: rgba(255, 193, 7, 0.1);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 193, 7, 0.3);
  animation: ${Ht} 2s ease-in-out infinite;
`,en=v.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`,Ze=v.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${({variant:a})=>{switch(a){case"primary":return`
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: #fff;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
          }
        `;case"secondary":return`
          background: linear-gradient(135deg, #666 0%, #888 100%);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background: linear-gradient(135deg, #888 0%, #aaa 100%);
            transform: translateY(-2px);
          }
        `;default:return`
          background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
          color: #000;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          }
        `}}}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`,tn=v.p`
  color: #e74c3c;
  margin: 12px 0 0;
  text-align: center;
  font-size: 0.95rem;
  background: rgba(231, 76, 60, 0.1);
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid rgba(231, 76, 60, 0.3);
`;function nn({isOpen:a,onClose:r}){const{publicKey:o}=Le(),{createGame:l}=wt(),n=it(),C=n.mint.equals(Ge),[g,p]=c.useState(10),[u,h]=c.useState("sameWager"),[y,w]=c.useState(1),[M,$]=c.useState(.1),[k,S]=c.useState(5),[x,W]=c.useState(!1),[j,I]=c.useState(null),t=async()=>{if(!o)return I("Connect wallet first");if(C)return I("Multiplayer games require real tokens. Please select a live token.");W(!0),I(null);const s=60,f=Math.min(g,5),d={mint:n.mint,creatorAddress:o,maxPlayers:g,softDuration:s,preAllocPlayers:f,winnersTarget:1,wagerType:["sameWager","customWager","betRange"].indexOf(u),payoutType:0};if(u==="sameWager"){const R=Math.floor(y*n.baseWager);d.wager=R,d.minBet=R,d.maxBet=R}else if(u==="customWager")d.wager=0,d.minBet=0,d.maxBet=0;else{const R=Math.floor(M*n.baseWager),T=Math.floor(k*n.baseWager);d.wager=R,d.minBet=R,d.maxBet=T}try{await l(d),r()}catch(R){console.error(R),I(R.message||"Failed to create game")}finally{W(!1)}};return e.jsx(ne.Portal,{target:"screen",children:e.jsx(lt,{children:a&&e.jsx(Ut,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},children:e.jsxs(Kt,{initial:{opacity:0,scale:.96},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.98},transition:{duration:.2},children:[e.jsx(qt,{children:"🎯 Create Plinko Race"}),e.jsxs(Ie,{children:[e.jsx(ve,{children:"Max Players"}),e.jsx(je,{type:"number",min:2,max:1e3,value:g,onChange:s=>p(Number(s.target.value))})]}),e.jsxs(Ie,{children:[e.jsx(ve,{children:"Wager Type"}),e.jsxs(Xt,{children:[e.jsx(Te,{active:u==="sameWager",onClick:()=>h("sameWager"),children:"Same"}),e.jsx(Te,{active:u==="betRange",onClick:()=>h("betRange"),children:"Range"}),e.jsx(Te,{active:u==="customWager",onClick:()=>h("customWager"),children:"Unlimited"})]})]}),u==="sameWager"&&e.jsxs(Ie,{children:[e.jsxs(ve,{children:["Wager (",n.symbol,")"]}),e.jsx(je,{type:"number",lang:"en-US",inputMode:"decimal",min:.05,step:.01,value:y,onChange:s=>w(Number(s.target.value))}),e.jsx(Vt,{children:[.1,.5,1].map(s=>e.jsxs(Jt,{onClick:()=>w(s),children:[s," ",n.symbol]},s))})]}),u==="betRange"&&e.jsxs(Qt,{children:[e.jsxs(Qe,{children:[e.jsxs(ve,{children:["Min Bet (",n.symbol,")"]}),e.jsx(je,{type:"number",min:.01,step:.01,value:M,onChange:s=>$(Number(s.target.value))})]}),e.jsxs(Qe,{children:[e.jsxs(ve,{children:["Max Bet (",n.symbol,")"]}),e.jsx(je,{type:"number",min:M,step:.01,value:k,onChange:s=>S(Number(s.target.value))})]})]}),e.jsx(Zt,{children:"⚠️Creating a game requires paying refundable “rent” to cover on-chain storage. You’ll get it back automatically once the game ends."}),j&&e.jsx(tn,{children:j}),e.jsxs(en,{children:[e.jsx(Ze,{variant:"secondary",onClick:r,disabled:x,children:"Cancel"}),e.jsx(Ze,{variant:"primary",onClick:t,disabled:x,children:x?"🎯 Creating…":"🎯 Create Game"})]})]})})})})}const dt="/assets/lobby-BXw65rDG.mp3",D={sound:null,count:0,timer:0,sub:null,muted:!1};try{const a=localStorage.getItem("plinkorace_music_muted");a!=null&&(D.muted=a==="1")}catch{}function Be(a){D.sound=a;const r=Oe.getState().volume;a.gain.set({gain:D.muted?0:r}),D.sub||(D.sub=Oe.subscribe(o=>{D.sound&&D.sound.gain.set({gain:D.muted?0:o.volume})}))}function pt(){try{D.sound?.player.stop()}catch{}D.sound=null,D.sub?.(),D.sub=null}function an(a){D.muted=a;try{localStorage.setItem("plinkorace_music_muted",a?"1":"0")}catch{}const r=Oe.getState().volume;try{D.sound?.gain.set({gain:a?0:r})}catch{}}function ut(){an(!D.muted)}const et=a=>a.toBase58().slice(0,4)+"...",rn=a=>{const r=Math.ceil(a/1e3),o=Math.floor(r/60),l=r%60;return`${o}:${l.toString().padStart(2,"0")}`},on=se`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`,gt=se`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`,ft=se`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`,sn=v.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  animation: ${ft} 0.6s ease-out;
`,ln=v.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(162, 89, 255, 0.1) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  animation: ${on} 3s ease-in-out infinite;
`,cn=v.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff9500 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`,dn=v.div`
  display: flex;
  gap: 16px;
  align-items: center;
`,Ae=v.button`
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;

  ${({variant:a})=>{switch(a){case"primary":return`
          background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
          color: #fff;
          box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
          }
        `;case"secondary":return`
          background: linear-gradient(135deg, #333 0%, #555 100%);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background: linear-gradient(135deg, #555 0%, #777 100%);
            transform: translateY(-2px);
          }
        `;case"danger":return`
          background: linear-gradient(135deg, #ff6b35 0%, #ff5722 100%);
          color: #fff;
          box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
          }
        `;default:return`
          background: linear-gradient(135deg, #ffd700 0%, #ffb300 100%);
          color: #000;
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
          }
        `}}}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`,pn=v.div`
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 12px;
  padding: 16px 20px;
  color: #ffc107;
  font-size: 1rem;
  text-align: center;
  margin: 16px 0;
  animation: ${gt} 2s ease-in-out infinite;
`,un=v.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 0 8px;
`,gn=v.div`
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.9) 0%, rgba(40, 40, 40, 0.9) 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 215, 0, 0.2);
  transition: all 0.3s ease;
  cursor: ${({clickable:a})=>a?"pointer":"default"};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({status:a})=>{switch(a){case"waiting":return"linear-gradient(90deg, #4caf50, #45a049)";case"started":return"linear-gradient(90deg, #ff6b35, #ff5722)";case"ended":return"linear-gradient(90deg, #666, #555)";default:return"linear-gradient(90deg, #ffd700, #ffb300)"}}};
  }

  &:hover {
    ${({clickable:a})=>a?`
      transform: translateY(-8px);
      box-shadow: 0 12px 32px rgba(255, 215, 0, 0.2);
      border-color: rgba(255, 215, 0, 0.4);
    `:""}
  }

  animation: ${ft} 0.6s ease-out;
  animation-fill-mode: both;
`,fn=v.div`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '🎯';
    font-size: 1.5rem;
  }
`,xn=v.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`,$e=v.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
`,We=v.span`
  color: #ccc;
  font-weight: 500;
`,tt=v.span`
  color: #fff;
  font-weight: 600;
`,mn=v.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  ${({status:a})=>{switch(a){case"waiting":return`
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(69, 160, 73, 0.2) 100%);
          color: #4caf50;
          border: 1px solid rgba(76, 175, 80, 0.3);
        `;case"started":return`
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 87, 34, 0.2) 100%);
          color: #ff6b35;
          border: 1px solid rgba(255, 107, 53, 0.3);
        `;case"ended":return`
          background: linear-gradient(135deg, rgba(102, 102, 102, 0.2) 0%, rgba(85, 85, 85, 0.2) 100%);
          color: #888;
          border: 1px solid rgba(102, 102, 102, 0.3);
        `}}}
`,bn=v.div`
  text-align: center;
  padding: 60px 20px;
  color: #888;
  font-size: 1.2rem;
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.8) 0%, rgba(40, 40, 40, 0.8) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${gt} 3s ease-in-out infinite;

  &::before {
    content: '🎲';
    font-size: 3rem;
    display: block;
    margin-bottom: 16px;
    opacity: 0.5;
  }
`;function hn({wagerType:a,wager:r,minBet:o,maxBet:l,token:n}){return"sameWager"in a?e.jsx(Pe,{amount:r.toNumber()}):"customWager"in a?e.jsx("span",{style:{color:"#ffd700",fontWeight:"bold"},children:"Unlimited"}):e.jsxs("span",{style:{color:"#00ff88",fontWeight:"bold"},children:[e.jsx(Pe,{amount:o.toNumber()})," – ",e.jsx(Pe,{amount:l.toNumber()})]})}function yn({onSelect:a,onDebug:r}){const o=ke({lobby:dt}),{play:l}=o,n=it(),C=n.mint.equals(Ge),{games:g}=kt({creator:new At("DP1uxUKbZPhFh1BTPfAHgBLsRc8gNPj3DhBNXQbdxuFM")}),[p,u]=c.useState(!1),[h,y]=c.useState(Date.now());return c.useEffect(()=>{const w=setInterval(()=>{y(Date.now())},1e3);return()=>clearInterval(w)},[]),c.useEffect(()=>{const w=o.sounds.lobby;if(!D.sound){w.player.loop=!0;const M=()=>{w.ready?(l("lobby"),Be(w)):setTimeout(M,100)};M()}return()=>{}},[]),e.jsxs(e.Fragment,{children:[e.jsxs(sn,{children:[e.jsxs(ln,{children:[e.jsx(cn,{children:"Plinko Race Lobby"}),e.jsxs(dn,{children:[e.jsx(Ae,{variant:"primary",onClick:()=>u(!0),disabled:C,title:C?"Multiplayer games require real tokens":"Create a new game",children:"🎯 Create Game"}),e.jsx(Ae,{variant:"secondary",onClick:()=>{D.muted,ut()},children:"🔇"}),e.jsx(Ae,{variant:"danger",onClick:r,children:"🛠️ Debug"})]})]}),C&&e.jsx(pn,{children:"⚠️ PlinkoRace is a multiplayer game that requires real tokens. Please select a live token to create or join games."}),e.jsx(un,{children:g.filter(w=>{const M=w.account?.mint;return!(M&&M.equals&&M.equals(Ge))}).map(w=>{const{gameId:M,gameMaker:$,players:k,maxPlayers:S,wagerType:x,wager:W,minBet:j,maxBet:I,softExpirationTimestamp:t,state:s}=w.account,i=Number(t)*1e3-h,d=s.waiting,R=s.started;let T="waiting",N="",q="";return d?(T="waiting",N=i>0?`Starts in ${rn(i)}`:"Ready to start",q=i>0?"⏱️":"🚀"):R?(T="started",N="In Progress",q="🏁"):(T="ended",N="Ended",q="🏆"),e.jsxs(gn,{clickable:d&&!C,status:T,onClick:()=>{d&&!C&&a(M)},children:[e.jsx(fn,{children:et(M)}),e.jsxs(xn,{children:[e.jsxs($e,{children:[e.jsx(We,{children:"Maker:"}),e.jsx(tt,{children:et($)})]}),e.jsxs($e,{children:[e.jsx(We,{children:"Players:"}),e.jsxs(tt,{children:[k.length," / ",S]})]}),e.jsxs($e,{children:[e.jsx(We,{children:"Bet:"}),e.jsx(hn,{wagerType:x,wager:W,minBet:j,maxBet:I,token:n})]})]}),e.jsxs(mn,{status:T,children:[q," ",N]})]},M)})}),g.length===0&&e.jsx(bn,{children:"No active games. Be the first to create one!"})]}),p&&e.jsx(nn,{isOpen:p,onClose:()=>u(!1)})]})}const re=700,ue=700,Re=5,ae=13,vn=.9,nt=.6,at=xe.PEGS.normal,wn=4,kn=4;var B=(a=>(a.Blank="blank",a.Score="score",a.Multiplier="mult",a.ExtraBall="extraBall",a.Kill="kill",a.Deduct="deduct",a.Dynamic="dynamic",a))(B||{});const H=[{type:"dynamic"},{type:"score",value:10},{type:"mult",value:2.5},{type:"score",value:6},{type:"mult",value:1.5},{type:"score",value:3},{type:"dynamic"},{type:"score",value:3},{type:"mult",value:1.5},{type:"score",value:6},{type:"mult",value:2.5},{type:"score",value:10},{type:"dynamic"}],oe=["blank","extraBall","mult","deduct"],Ne=5,Ye=5,pe=60;H.findIndex(a=>a.type==="dynamic");const xt=180;class Fe{constructor(){de(this,"engine");de(this,"world");de(this,"runner");this.engine=te.Engine.create({gravity:{y:vn},timing:{timeScale:wn}}),this.runner=te.Runner.create({isFixed:!0}),this.world=this.engine.world,J.Composite.add(this.world,[...this.buildPegs(),...this.buildBarriers()])}tick(r=16){te.Runner.tick(this.runner,this.engine,r)}getBodies(){return J.Composite.allBodies(this.world)}cleanup(){te.Runner.stop(this.runner),te.World.clear(this.world,!1),te.Engine.clear(this.engine)}buildPegs(){const r=ue/(at+2);let o=0;return Array.from({length:at}).flatMap((l,n,C)=>{const g=n+1,p=re*n/(C.length-1),u=g===1?0:p/(g-1);return Array.from({length:g}).map((h,y)=>te.Bodies.circle(re/2-p/2+u*y,r*n+r/2,Re,{isStatic:!0,restitution:nt,label:"Peg",plugin:{pegIndex:o++}}))}).slice(3)}buildBarriers(){const r=re/H.length;return[0,...H.map((o,l)=>r*(l+1))].map(o=>te.Bodies.rectangle(o,ue-pe/2,4,pe*1.2,{isStatic:!0,restitution:nt,label:"Barrier"}))}}function Sn(a){return new TextEncoder().encode(a).reduce((l,n)=>(l<<5)-l+n>>>0,0)}function jn(a){let r=a>>>0;return()=>{r+=1831565813;let o=Math.imul(r^r>>>15,1|r);return o=o+Math.imul(o^o>>>7,61|o)^o,((o^o>>>14)>>>0)/4294967296}}function Mn(a){const r=Sn(a);return jn(r)}const Cn=2e5,De=150,En=100,we=4,Pn=ue*.5;class In{constructor(r,o){de(this,"players");de(this,"rng");de(this,"staticWorld",new Fe);de(this,"replayWorld");this.players=r,this.rng=Mn(o||JSON.stringify(r))}recordRace(r,o=En){if(this.players.length===0)return{winnerIndex:-1,paths:[],offsets:[],pathOwners:[],events:[],totalFrames:0};for(let l=1;l<=De;l++){const n=this.runSingleAttempt(r,o);if(n){try{console.log(`[PlinkoRace] recordRace: success on attempt ${l}/${De} (players=${this.players.length}, winnerIdx=${r}, frames=${n.totalFrames})`)}catch{}return n}}try{console.warn(`[PlinkoRace] recordRace: failed to find a valid run after ${De} attempts (players=${this.players.length}, winnerIdx=${r})`)}catch{}throw new Error("No valid run found")}runSingleAttempt(r,o){const l=new Fe,n=J.Composite.create();J.Composite.add(l.world,n);const C=()=>re/2+(this.rng()*16-8),g=[],p=[],u=[],h=[],y=new Float32Array(this.players.length),w=new Float32Array(this.players.length).fill(1),M=[];this.players.forEach((s,f)=>{g[f]=C(),p[f]=f,u[f]=[];const i=J.Bodies.circle(g[f],-10,ae,{restitution:.4,collisionFilter:{group:-1},label:"Ball",plugin:{playerIndex:f}});h[f]=i,J.Composite.add(n,i)});const $=H.map((s,f)=>s.type===B.Dynamic?f:-1).filter(s=>s>=0),k=oe.findIndex(s=>s===B.Blank),S=oe.map((s,f)=>f).filter(s=>s!==k),x=$.map(()=>Math.floor(this.rng()*S.length));$.forEach((s,f)=>{M.push({frame:0,player:-1,kind:"bucketPattern",value:x[f],bucket:s})});const W=new Array(H.length).fill(k);let j=0;const I=(s,f)=>{te.Body.setPosition(s,{x:g[f],y:-10}),te.Body.setVelocity(s,{x:0,y:0})};let t=0;e:for(let s=0;s<Cn;s++){if($.length&&s>0&&s%xt===0){j++;for(let f=0;f<$.length;f++){const i=$[f],d=j===0?k:S[(j-1+x[f])%S.length];W[i]=d,M.push({frame:s,player:-1,kind:"bucketMode",value:d,bucket:i})}}l.tick();for(let f=0;f<h.length;f++){const i=h[f],d=p[f];if(u[f].push(i.position.x,i.position.y),i.position.x<0||i.position.x>re||i.position.y>ue){I(i,f);continue}if(i.position.y>=ue-pe){const R=re/H.length,T=Math.floor(i.position.x/R);this.handleBucketHit({bucket:H[T],bucketIndex:T,dynModeIdx:W[T]??k,ballBody:i,ballPathIx:f,playerIx:d,frame:s,events:M,balls:h,paths:u,offsets:g,pathOwners:p,mults:w,scores:y,layer:n}),I(i,f)}if(d!==r&&y[d]>=o)return l.cleanup(),null;if(d===r&&y[d]>=o&&Array.from(y).every((R,T)=>T===r||R<o)){t=s+1;break e}}}return l.cleanup(),t?(u.forEach(s=>{s.length=t*2}),M.forEach(s=>s.frame*=we),{winnerIndex:r,paths:u.map(s=>new Float32Array(s)),offsets:g,pathOwners:p,events:M,totalFrames:t*we}):null}handleBucketHit(r){const{bucket:o,bucketIndex:l,dynModeIdx:n,ballBody:C,ballPathIx:g,playerIx:p,frame:u,events:h,balls:y,paths:w,offsets:M,pathOwners:$,mults:k,scores:S,layer:x}=r,W=oe[n],j=o.type===B.Dynamic?{type:W,value:W===B.Multiplier?Ne:W===B.Deduct?Ye:o.value}:o;switch(j.type){case B.Blank:break;case B.Score:{const I=(j.value??0)*k[p];S[p]+=I,h.push({frame:u,player:p,kind:"score",value:I,bucket:l}),k[p]=1}break;case B.Multiplier:{const I=j.value??1,t=k[p],s=Math.min((t===1?0:t)+I,64);k[p]=s,h.push({frame:u,player:p,kind:"mult",value:I,bucket:l})}break;case B.Deduct:{const t=(j.value??0)*k[p];S[p]=Math.max(0,S[p]-t),h.push({frame:u,player:p,kind:"deduct",value:t,bucket:l}),k[p]=1}break;case B.ExtraBall:{h.push({frame:u,player:p,kind:"extraBall",bucket:l});const I=Math.min(Math.max(M[g]+(this.rng()*30-15),ae),re-ae),t=J.Bodies.circle(I,-10,ae,{restitution:.4,collisionFilter:{group:-1},label:"Ball",plugin:{playerIndex:p}});y.push(t),J.Composite.add(x,t),M.push(I),$.push(p);const s=u+1,f=[];for(let i=0;i<s;i++)f.push(I,-10);w.push(f)}break;case B.Kill:h.push({frame:u,player:p,kind:"ballKill",bucket:l}),J.Composite.remove(x,C),y[g]=J.Bodies.circle(-999,-999,1,{isStatic:!0});break}}replayRace(r,o){this.replayWorld?.cleanup();const l=new Fe;this.replayWorld=l;const n=[],C=k=>{const S=r.pathOwners[k],x=J.Bodies.circle(r.offsets[k],-10,ae,{isStatic:!0,label:"Ball",plugin:{playerIndex:S}});n[k]=x,J.Composite.add(l.world,x)};this.players.forEach((k,S)=>C(S));let g=0;const p=r.totalFrames,h=1e3/60;let y=performance.now(),w=0;const M=()=>{r.events.forEach(x=>{x.kind==="extraBall"&&x.frame===g&&C(n.length)});const k=Math.floor(g/we),S=g%we/we;n.forEach((x,W)=>{const j=r.paths[W];if(j.length<2)return;const I=j.length/2-1,t=Math.min(k,I),s=Math.min(t+1,I),f=j[t*2],i=j[t*2+1],d=j[s*2],R=j[s*2+1],[T,N]=i-R>Pn?S===0?[f,i]:[d,R]:[f*(1-S)+d*S,i*(1-S)+R*S];te.Body.setPosition(x,{x:T,y:N})}),o?.(g),g++},$=k=>{for(w+=k-y,y=k;w>=h&&g<p;)M(),w-=h;g<p&&requestAnimationFrame($)};requestAnimationFrame($)}getBodies(){return[...this.staticWorld.getBodies(),...this.replayWorld?this.replayWorld.getBodies():[]]}cleanup(){this.staticWorld.cleanup(),this.replayWorld?.cleanup()}}function Bn(a,r){const[o,l]=c.useState(null);c.useEffect(()=>{const g=new In(a,r);return l(g),()=>g.cleanup()},[a.map(g=>g.id).join(","),r]);const n=c.useCallback((g,p)=>{if(!o)throw new Error("Engine not ready");return o.recordRace(g,p)},[o]),C=c.useCallback((g,p)=>{if(!o)throw new Error("Engine not ready");o.replayRace(g,p)},[o]);return{engine:o,recordRace:n,replayRace:C}}const Rn=se`
  0%   { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  12%  { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
  80%  { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(0);   opacity: 0; }
`,Tn=v.div`
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Impact', sans-serif;
  font-size: 64px;
  letter-spacing: 2px;
  color: #fff;
  text-shadow: 0 0 10px #000;
  pointer-events: none;
  animation: ${Rn} 1.5s cubic-bezier(.2,1.2,.6,1) forwards;
`;function An({message:a}){const[r,o]=c.useState(null);return c.useEffect(()=>{if(!a)return;o(a);const l=setTimeout(()=>o(null),1500);return()=>clearTimeout(l)},[a]),r?e.jsx(Tn,{children:r.text}):null}const rt=12,ze=10,$n=(ae+Re)**2;function Wn(a,r){const o=a.type===B.Dynamic?{type:oe[r],value:oe[r]===B.Multiplier?Ne:oe[r]===B.Deduct?Ye:a.value}:a;switch(o.type){case B.Score:return{hue:220,label:`${o.value} ▲`};case B.Multiplier:return{hue:120,label:`${o.value}×`};case B.Deduct:return{hue:10,label:`-${o.value} ▼`};case B.ExtraBall:return{hue:60,label:"+1"};case B.Kill:return{hue:0,label:"☠"};case B.Blank:return{hue:30,label:"–"};default:return{hue:30,label:"–"}}}function Fn(a,r,o){if(a.type!==B.Dynamic)return null;const l=oe.findIndex(u=>u===B.Blank),n=oe.map((u,h)=>h).filter(u=>u!==l),C=r===l?n[o%n.length]:n[(n.indexOf(r)+1)%n.length],g=oe[C],p={type:g,value:g===B.Multiplier?Ne:g===B.Deduct?Ye:a.value};switch(p.type){case B.Score:return{hue:220,label:`${p.value} ▼`};case B.Multiplier:return{hue:120,label:`${p.value}×`};case B.Deduct:return{hue:10,label:`-${p.value}`};case B.ExtraBall:return{hue:60,label:"+1"};case B.Kill:return{hue:0,label:"☠"};case B.Blank:return{hue:30,label:"–"};default:return{hue:30,label:"–"}}}function Dn(a){const{engine:r,dynModes:o,patternOffsets:l,started:n,bucketAnim:C,pegAnim:g,particles:p,arrowPos:u,labelPos:h,mults:y,roster:w,metadata:M,youIdx:$,popups:k}=a,S=c.useRef({}),x=c.useRef(o);x.current!==o&&(H.forEach((t,s)=>{if(t.type!==B.Dynamic)return;const f=x.current[s]??0,i=o[s]??0;f!==i&&(S.current[s]=performance.now())}),x.current=o),n&&H.forEach((t,s)=>{t.type===B.Dynamic&&S.current[s]==null&&(S.current[s]=performance.now())});const W=xt*kn/60*1e3,j=c.useRef(null),I=c.useRef({x:0,y:0,w:0,h:0});return c.useEffect(()=>{const t=s=>{const f=j.current;if(!f)return;const i=f.getBoundingClientRect(),d=s.clientX-i.left,R=s.clientY-i.top,{x:T,y:N,w:q,h:ie}=I.current;d>=T&&d<=T+q&&R>=N&&R<=N+ie&&(ut(),s.stopPropagation(),s.preventDefault())};return window.addEventListener("click",t),()=>window.removeEventListener("click",t)},[]),e.jsx(ne.Canvas,{render:({ctx:t,size:s,canvas:f})=>{if(!r)return;j.current=f,t.clearRect(0,0,s.width,s.height),t.fillStyle="#0b0b13",t.fillRect(0,0,s.width,s.height);const i=Math.min(s.width/re,s.height/ue),d=(s.width-re*i)/2,R=(s.height-ue*i)/2;t.save(),t.translate(d,R),t.scale(i,i);const T=r.getBodies(),N=T.filter(E=>E.label==="Ball"),q=T.filter(E=>E.label==="Peg"),ie=(E,m,O)=>E+(m-E)*O,Q=.15;N.forEach(E=>{const{x:m,y:O}=E.position;q.forEach(F=>{const{x:L,y:b}=F.position,A=m-L,P=O-b;if(A*A+P*P<$n){const z=F.plugin?.pegIndex??-1;z>=0&&(g[z]=1)}})});for(let E=p.length-1;E>=0;E--){const m=p[E];if(--m.life<=0){p.splice(E,1);continue}m.x+=m.vx,m.y+=m.vy,m.opacity*=.96,m.size*=.98,t.fillStyle=`rgba(255,180,0,${m.opacity})`,t.beginPath(),t.arc(m.x,m.y,m.size,0,2*Math.PI),t.fill()}const X=re/H.length;H.forEach((E,m)=>{let O=C[m]||0;O>0&&(C[m]=O*.85);const F=m*X,L=ue-pe,b=F+X/2,A=L+pe/2,P=o[m]??0,{hue:z,label:G}=Wn(E,P),Y=H.slice(0,m+1).filter(K=>K.type===B.Dynamic).length-1,le=Fn(E,P,l[Y]??0);if(O>.02){const K=pe*3*O,U=t.createLinearGradient(0,L,0,L-K);U.addColorStop(0,`hsla(${z},80%,70%,${.4*O})`),U.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=U,t.fillRect(F,L-K,X,K)}t.fillStyle=`hsla(${z},70%,50%,0.3)`,t.fillRect(F,L,X,pe),t.font="bold 18px sans-serif",t.textAlign="center",t.textBaseline="middle",t.lineWidth=3,t.strokeStyle=`hsla(${z},60%,20%,1)`,t.strokeText(G,b,A),t.fillStyle=`hsla(${z},80%,75%,1)`,t.fillText(G,b,A);for(let K=0;K<k.length;K++){const U=k[K];if(U.bucketIndex!==m)continue;U.life-=1,U.y+=.8;const ce=Math.max(0,Math.min(1,U.life/30)),V=U.value>=0,Se=`${V?"+":""}${Math.abs(U.value).toFixed(1).replace(/\.0$/,"")}`,he=L-8-U.y;t.font="bold 16px sans-serif",t.textAlign="center",t.textBaseline="middle",t.lineWidth=4,t.strokeStyle=`rgba(0,0,0,${.5*ce})`,t.strokeText(Se,b,he),t.fillStyle=V?`rgba(34,197,94,${ce})`:`rgba(239,68,68,${ce})`,t.fillText(Se,b,he)}if(le){t.font="12px sans-serif",t.textAlign="center",t.textBaseline="top",t.fillStyle=`hsla(${le.hue},80%,75%,0.9)`,t.fillText(le.label,b,L+4);const K=S.current[m]??performance.now(),U=performance.now()-K,V=1-Math.min(Math.max(U/W,0),1),Se=Math.min(X,pe)*.45;t.save(),t.translate(b,A),t.beginPath(),t.lineWidth=3,t.strokeStyle=`hsla(${z},80%,70%,0.9)`;const he=-Math.PI/2;t.arc(0,0,Se,he,he+Math.PI*2*V),t.stroke(),t.restore()}}),T.forEach(E=>{if(E.label==="Barrier"){t.beginPath(),E.vertices.forEach((m,O)=>O?t.lineTo(m.x,m.y):t.moveTo(m.x,m.y)),t.closePath(),t.fillStyle="#444",t.fill();return}if(E.label==="Peg"){const m=E.plugin?.pegIndex??-1;let O=g[m]||0;O>0&&(g[m]=O*.9),t.save(),t.translate(E.position.x,E.position.y),t.scale(1+O*.4,1+O*.4);const F=(E.position.x+E.position.y+Date.now()*.05)%360;t.fillStyle=`hsla(${F},75%,60%,${(1+O*2)*.2})`,t.beginPath(),t.arc(0,0,Re+4,0,2*Math.PI),t.fill(),t.fillStyle=`hsla(${F},85%,${75+O*25}%,1)`,t.beginPath(),t.arc(0,0,Re,0,2*Math.PI),t.fill(),t.restore();return}}),N.forEach(E=>{const m=E.plugin?.playerIndex,O=y[m]??1,{x:F,y:L}=E.position;if(!Number.isFinite(F)||!Number.isFinite(L))return;const b=w[m].id,A=M[b];if(O>1){t.globalCompositeOperation="lighter";const P=ae*2,z=t.createRadialGradient(F,L,0,F,L,P);z.addColorStop(0,"rgba(255,255,200,0.5)"),z.addColorStop(1,"rgba(255,255,200,0)"),t.fillStyle=z,t.beginPath(),t.arc(F,L,P,0,2*Math.PI),t.fill(),t.globalCompositeOperation="source-over"}if(O>=5&&p.length<200){t.globalCompositeOperation="lighter";const P=ae*1.2,z=Math.floor(performance.now()/250),Y=.8+Ve(`flame:${E.id}:${z}`)()*.4,le=P*2.3*Y,K=t.createRadialGradient(F,L,0,F,L,le);K.addColorStop(0,`rgba(255,180,0,${.6*Y})`),K.addColorStop(1,"rgba(255,0,0,0)"),t.fillStyle=K,t.beginPath(),t.arc(F,L,le,0,2*Math.PI),t.fill();const U=P*.8*Y,ce=t.createRadialGradient(F,L,0,F,L,U);ce.addColorStop(0,"rgba(255,255,220,1)"),ce.addColorStop(1,"rgba(255,200,0,0)"),t.fillStyle=ce,t.beginPath(),t.arc(F,L,U,0,2*Math.PI),t.fill(),t.globalCompositeOperation="source-over";const V=Ve(`particle:${E.id}:${p.length}:${z}`);p.push({x:F+(V()-.5)*5,y:L+(V()-.5)*5,size:2+V()*2,opacity:.5+V()*.5,life:20+Math.floor(V()*10),vx:(V()-.5)*.5,vy:(V()-.5)*.5-.5})}if(t.fillStyle=w[m%w.length].color,t.beginPath(),t.arc(F,L,ae,0,2*Math.PI),t.fill(),m===$){const P=F,z=L-ae-2,G=u.get(E.id)??{px:P,py:z};G.px=ie(G.px,P,Q),G.py=ie(G.py,z,Q),u.set(E.id,G),t.fillStyle="#fff",t.beginPath(),t.moveTo(G.px,G.py),t.lineTo(G.px-rt/2,G.py-ze),t.lineTo(G.px+rt/2,G.py-ze),t.closePath(),t.fill()}if(A){const P=ae+6+(m===$?ze:0),z=F,G=L-P,Y=h.get(E.id)??{px:z,py:G};Y.px=ie(Y.px,z,Q),Y.py=ie(Y.py,G,Q),h.set(E.id,Y),t.font="12px sans-serif",t.textAlign="center",t.textBaseline="bottom",t.lineWidth=3,t.strokeStyle="rgba(0,0,0,0.7)",t.strokeText(A,Y.px,Y.py),t.fillStyle="#ffffff",t.fillText(A,Y.px,Y.py)}});const me=new Set(N.map(E=>E.id));u.forEach((E,m)=>{me.has(m)||u.delete(m)}),h.forEach((E,m)=>{me.has(m)||h.delete(m)}),t.restore();const be=8,ge=130,fe=34,Z=s.width-ge-be,ee=s.height-fe-be;I.current={x:Z,y:ee,w:ge,h:fe},t.fillStyle="rgba(0,0,0,0.6)",t.strokeStyle="rgba(255,255,255,0.2)",t.lineWidth=1,t.beginPath(),t.roundRect(Z,ee,ge,fe,8),t.fill(),t.stroke(),t.font="600 13px system-ui, sans-serif",t.fillStyle="#fff",t.textAlign="center",t.textBaseline="middle",t.fillText(D.muted?"Unmute Music":"Mute Music",Z+ge/2,ee+fe/2)}})}function zn({roster:a,scores:r,mults:o,targetPoints:l,final:n=!1,payouts:C=[],metadata:g={}}){const p=a.map((y,w)=>({p:y,s:r[w]??0,m:o[w]??1,w:C[w]??0,name:g[y.id]??""})).sort((y,w)=>w.s-y.s),u=p[0],h=u?Math.max(0,Math.min(1,u.s/l))*100:0;return e.jsx(Nt,{children:e.jsxs(_.div,{layoutId:"scoreboard-container",layout:!0,transition:{type:"spring",stiffness:280,damping:30},style:{position:n?"fixed":"absolute",top:n?0:12,left:n?0:12,right:n?0:void 0,bottom:n?0:void 0,width:n?"-webkit-fill-available":"auto",height:n?"fit-content":"auto",maxWidth:n?"none":300,overflowY:n?"auto":void 0,background:n?"linear-gradient(135deg, rgba(15,15,35,0.98) 0%, rgba(26,26,46,0.98) 50%, rgba(15,15,35,0.98) 100%)":"linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(15,15,35,0.85) 100%)",padding:n?"min(5vw, 24px)":"12px 16px",borderRadius:n?0:16,border:n?"none":"1px solid rgba(255,215,0,0.2)",color:"#fff",fontSize:n?"clamp(12px, 3vw, 14px)":13,boxShadow:n?"none":"0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,215,0,0.05)",backdropFilter:n?"blur(20px)":"blur(12px)",zIndex:n?9999:400,display:"flex",flexDirection:"column",justifyContent:n?"flex-start":void 0,alignItems:"center"},children:[e.jsxs(_.div,{layout:!0,style:{marginBottom:n?"min(4vh, 20px)":12,marginTop:n?"min(3vh, 16px)":0,textAlign:"center",position:"relative",width:"100%",maxWidth:n?"min(100vw, 600px)":"auto",padding:n?"0 min(4vw, 16px)":"0"},children:[e.jsx(_.div,{layout:!0,style:{fontWeight:800,fontSize:n?"clamp(18px, 6vw, 28px)":16,letterSpacing:n?"clamp(0.5px, 0.2vw, 1.5px)":.5,background:"linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #f1c40f 100%)",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textShadow:n?"0 0 30px rgba(255,215,0,0.4)":"0 0 20px rgba(255,215,0,0.3)",marginBottom:n?"min(2vh, 12px)":8},children:n?"🏁 RACE COMPLETE":"⚡ RACE TO "+l}),!n&&e.jsxs(_.div,{layout:!0,style:{fontWeight:600,fontSize:12,opacity:.8,marginBottom:8},children:["TARGET: ",l]}),e.jsxs(_.div,{layout:!0,style:{marginTop:n?"min(1.5vh, 8px)":8,marginLeft:"auto",marginRight:"auto",maxWidth:n?"min(90vw, 400px)":240,height:n?"clamp(6px, 2vw, 12px)":8,borderRadius:20,background:"linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,215,0,0.08) 100%)",overflow:"hidden",border:"1px solid rgba(255,215,0,0.2)",position:"relative"},children:[e.jsx(_.div,{initial:{width:0},animate:{width:`${h}%`},transition:{type:"spring",stiffness:300,damping:30},style:{height:"100%",background:h>80?"linear-gradient(90deg, #ff6b35 0%, #ffd700 50%, #00ff88 100%)":"linear-gradient(90deg, #a259ff 0%, #ffd700 100%)",borderRadius:20,boxShadow:h>80?"0 0 20px rgba(255,215,0,0.6), 0 0 40px rgba(0,255,136,0.3)":"0 0 16px rgba(255,215,0,0.4)",position:"relative"},children:h>15&&e.jsxs(_.div,{style:{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:n?"clamp(9px, 1.2vw, 12px)":8,fontWeight:700,color:"#000",textShadow:"0 1px 2px rgba(255,255,255,0.8)"},children:[Math.round(h),"%"]})}),h>50&&e.jsx(_.div,{initial:{opacity:0},animate:{opacity:[0,1,0]},transition:{duration:1.5,repeat:1/0},style:{position:"absolute",right:`${100-h}%`,top:"50%",transform:"translateY(-50%)",color:"#fff",fontSize:n?"clamp(14px, 1.5vw, 16px)":12,filter:"drop-shadow(0 0 4px #ffd700)"},children:"⚡"})]})]}),n&&e.jsxs(_.div,{layout:"position",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},style:{display:"grid",gridTemplateColumns:"auto 1fr auto auto",gap:"min(3vw, 12px)",fontSize:"clamp(10px, 3vw, 12px)",fontWeight:700,marginBottom:"min(3vh, 16px)",textTransform:"uppercase",letterSpacing:"clamp(0.3px, 0.1vw, 0.8px)",opacity:.8,paddingBottom:"min(2vh, 8px)",borderBottom:"1px solid rgba(255,215,0,0.3)",width:"100%",maxWidth:"600px",padding:"0 min(4vw, 16px)"},children:[e.jsx("div",{children:"Rank"}),e.jsx("div",{children:"Player"}),e.jsx("div",{style:{textAlign:"right"},children:"Score"}),e.jsx("div",{style:{textAlign:"right"},children:"Payout"})]}),e.jsx("div",{style:{width:"100%",maxWidth:"600px",flex:n?"none":"auto",display:"flex",flexDirection:"column",maxHeight:n?"calc(100vh - 200px)":"auto",overflowY:n?"auto":"visible",padding:n?"0 min(4vw, 16px)":"0"},children:e.jsx(lt,{mode:"popLayout",children:p.map(({p:y,name:w,s:M,m:$,w:k},S)=>{const x=n&&S===0,W=n&&S<3;return e.jsxs(_.div,{layout:!0,initial:{opacity:0,y:-8,scale:.95},animate:{opacity:1,y:0,scale:1,boxShadow:x?"0 0 40px rgba(255,215,0,0.6), 0 12px 24px rgba(0,0,0,0.4)":W?"0 0 30px rgba(162,89,255,0.3), 0 8px 16px rgba(0,0,0,0.3)":"0 4px 12px rgba(0,0,0,0.2)"},exit:{opacity:0,y:8,scale:.95},transition:{type:"spring",stiffness:300,damping:30,delay:S*.05},style:{display:n?"grid":"flex",gridTemplateColumns:n?"auto 1fr auto auto":void 0,alignItems:"center",gap:n?"min(3vw, 12px)":8,marginBottom:n?"min(2vh, 8px)":8,padding:n?"min(3vw, 12px)":"8px 12px",background:x?"linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,237,78,0.15) 100%)":W?"linear-gradient(135deg, rgba(162,89,255,0.15) 0%, rgba(255,215,0,0.08) 100%)":"linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",borderRadius:n?"min(2vw, 10px)":12,border:x?"2px solid rgba(255,215,0,0.6)":W?"1px solid rgba(162,89,255,0.4)":"1px solid rgba(255,255,255,0.1)",fontSize:n?"clamp(11px, 3vw, 14px)":13,position:"relative",overflow:"hidden"},children:[x&&e.jsx(_.div,{initial:{scale:0,rotate:-180},animate:{scale:1,rotate:0},transition:{delay:.5,type:"spring",stiffness:300},style:{position:"absolute",top:-12,right:-12,fontSize:n?"clamp(20px, 3vw, 28px)":24,filter:"drop-shadow(0 0 12px #ffd700)"},children:"👑"}),n&&e.jsx(_.div,{layout:!0,style:{display:"flex",alignItems:"center",justifyContent:"center",width:"clamp(24px, 8vw, 36px)",height:"clamp(24px, 8vw, 36px)",borderRadius:"50%",background:x?"linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)":W?"linear-gradient(135deg, #a259ff 0%, #c084fc 100%)":"linear-gradient(135deg, #374151 0%, #4b5563 100%)",color:x?"#000":"#fff",fontWeight:900,fontSize:"clamp(10px, 3vw, 14px)",border:"1px solid rgba(255,255,255,0.3)",boxShadow:x?"0 0 30px rgba(255,215,0,0.7)":W?"0 0 20px rgba(162,89,255,0.5)":"none"},children:S+1}),e.jsxs("div",{style:{display:"flex",alignItems:"center",flex:n?void 0:1,minWidth:0},children:[e.jsx(_.div,{layout:!0,whileHover:{scale:1.1},style:{width:n?"clamp(12px, 4vw, 16px)":14,height:n?"clamp(12px, 4vw, 16px)":14,background:`linear-gradient(135deg, ${y.color} 0%, ${y.color}aa 100%)`,borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",boxShadow:`0 0 12px ${y.color}44`,marginRight:n?"min(2vw, 8px)":8,flexShrink:0}}),e.jsx("div",{style:{fontWeight:x?800:600,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:x?"#ffd700":"#fff",textShadow:x?"0 0 15px rgba(255,215,0,0.7)":"none",fontSize:n?"clamp(12px, 3.5vw, 16px)":"inherit"},children:w||`${y.id.slice(0,n?8:4)}…`})]}),!n&&$>1&&e.jsxs(_.div,{layout:!0,initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.8,opacity:0},whileHover:{scale:1.05},style:{padding:"4px 8px",background:`linear-gradient(135deg, ${y.color}22 0%, ${y.color}11 100%)`,borderRadius:8,border:`1px solid ${y.color}44`,fontFamily:"monospace",fontWeight:700,fontSize:11,color:y.color,boxShadow:`0 0 8px ${y.color}22`,textShadow:`0 0 4px ${y.color}44`},children:["×",$]}),e.jsx(_.div,{layout:!0,style:{textAlign:"right",fontFamily:"monospace",fontWeight:800,fontSize:n?"clamp(12px, 3.5vw, 16px)":14,color:x?"#ffd700":"#fff",textShadow:x?"0 0 12px rgba(255,215,0,0.7)":"none",minWidth:n?"auto":40},children:Number.isInteger(M)?M:M.toFixed(1)}),n&&e.jsx(_.div,{layout:!0,initial:{width:0,opacity:0},animate:{width:"auto",opacity:1},style:{textAlign:"right",fontFamily:"monospace",fontWeight:700,fontSize:"clamp(10px, 3vw, 12px)",color:k>0?"#00ff88":"#666",textShadow:k>0?"0 0 12px rgba(0,255,136,0.5)":"none"},children:e.jsx(Pe,{amount:k})})]},y.id)})})}),n&&e.jsx(_.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},style:{marginTop:"min(3vh, 16px)",marginBottom:"min(2vh, 12px)",padding:"min(3vw, 12px) min(4vw, 16px)",borderTop:"1px solid rgba(255,215,0,0.3)",textAlign:"center",fontSize:"clamp(10px, 3vw, 12px)",opacity:.8,fontStyle:"italic",width:"100%",maxWidth:"600px"},children:"🏁 Race Complete • Lightning Fast Results"})]})})}const Gn="/assets/extraball-DdWHhTNO.mp3",On="/assets/readygo-CgyenfA7.mp3",Ln="/assets/fall-B80AaX79.mp3",Nn="/assets/bigcombo-fvuoFgIw.mp3",Yn="/assets/finsh-DiltAugL.mp3",_n="/assets/ouch-1Nk5r8E8.mp3";function mt({players:a,winnerIdx:r,metadata:o={},youIndexOverride:l,gamePk:n,targetPoints:C=100,payouts:g,onFinished:p}){const u=c.useMemo(()=>{const m=["#e6194B","#3cb44b","#ffe119","#4363d8","#f58231","#911eb4","#46f0f0","#f032e6","#bcf60c","#fabebe","#008080","#e6beff","#9a6324","#fffac8","#800000","#aaffc3","#808000","#ffd8b1","#000075","#a9a9a9"];return a.map((O,F)=>({id:O.toBase58(),color:m[F%m.length]}))},[a]),{publicKey:h}=Le(),y=c.useMemo(()=>l??u.findIndex(m=>m.id===h?.toBase58()),[u,h,l]),{engine:w,recordRace:M,replayRace:$}=Bn(u,n),[k,S]=c.useState([]),[x,W]=c.useState([]),[j,I]=c.useState([]),[t,s]=c.useState(!1),[f,i]=c.useState([]),[d,R]=c.useState(!1),[T,N]=c.useState(null),[q,ie]=c.useState([]),Q=m=>{N({text:m,key:Date.now()})},X=c.useRef({}).current,me=c.useRef({}).current,be=c.useRef([]).current,ge=c.useRef(new Map).current,fe=c.useRef(new Map).current,{play:Z,sounds:ee}=ne.useSound({ready:On,extra:Gn,fall:Ln,finish:Yn,bigcombo:Nn,ouch:_n}),E=c.useRef(0);return c.useEffect(()=>{S(Array(u.length).fill(0)),W(Array(u.length).fill(1)),I([]),s(!1),R(!1),Object.keys(X).forEach(m=>X[+m]=0),Object.keys(me).forEach(m=>me[+m]=0),be.length=0,ge.clear(),fe.clear()},[u]),c.useEffect(()=>{d&&p?.()},[d,p]),c.useEffect(()=>{if(!w||r==null)return;Q("GO"),ee.ready?.ready&&Z("ready"),s(!0);const m=M(r,C),O=[...m.events],F=Array(u.length).fill(1);$(m,L=>{for(;O.length&&O[0].frame===L;){const b=O.shift();if(b.kind==="bucketMode"){I(A=>{const P=[...A.length?A:Array(H.length).fill(0)];return b.bucket!==void 0?P[b.bucket]=b.value??0:H.forEach((z,G)=>{z.type===B.Dynamic&&(P[G]=b.value??0)}),P}),b.bucket!==void 0?X[b.bucket]=1:H.forEach((A,P)=>{A.type===B.Dynamic&&(X[P]=1)});continue}if(b.kind==="bucketPattern"&&b.bucket!==void 0){i(A=>{const P=H.map((Y,le)=>Y.type===B.Dynamic?le:-1).filter(Y=>Y>=0),z=P.indexOf(b.bucket),G=[...A.length?A:Array(P.length).fill(0)];return z>=0&&(G[z]=b.value??0),G});continue}if(b.bucket!==void 0){const A=b.bucket;X[A]=1;const P=performance.now();ee.fall?.ready&&P-E.current>60&&(E.current=P,Z("fall")),b.kind==="extraBall"&&(Q("EXTRA BALL"),ee.extra?.ready&&Z("extra"));const z=H[A],G=j[A]??0;(z.type===B.Dynamic?oe[G]:z.type)===B.ExtraBall&&b.kind!=="extraBall"&&(Q("EXTRA BALL"),ee.extra?.ready&&Z("extra"))}if(b.kind==="mult"){const A=b.value||1,P=F[b.player];F[b.player]=Math.min((P===1?0:P)+A,64),W(z=>{const G=[...z];return G[b.player]=F[b.player],G}),F[b.player]>=5&&(Q("BIG COMBO"),ee.bigcombo?.ready&&Z("bigcombo"))}b.kind==="deduct"&&(Q("DEDUCTION"),ee.ouch?.ready&&Z("ouch"),S(A=>{const P=[...A];return P[b.player]=Math.max(0,(P[b.player]??0)-(b.value||0)),P}),b.bucket!==void 0&&ie(A=>[{bucketIndex:b.bucket,value:-(b.value||0),life:30,y:0},...A])),b.kind==="score"&&(S(A=>{const P=[...A];return P[b.player]+=b.value||0,P}),F[b.player]=1,W(A=>{const P=[...A];return P[b.player]=1,P}),b.bucket!==void 0&&ie(A=>[{bucketIndex:b.bucket,value:b.value||0,life:30,y:0},...A])),b.kind==="ballKill"&&Q("PLAYER OUT")}L===m.totalFrames-1&&(ee.finish?.ready&&Z("finish"),R(!0))})},[w,r,M,$,C,u.length]),u.length===0&&r!==null?e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",color:"#fff",background:"#0b0b13"},children:"Game settled with 0 players"}):e.jsxs("div",{style:{position:"relative",width:"100%",height:"100%"},children:[e.jsx(Dn,{engine:w,dynModes:j,patternOffsets:f,started:t,bucketAnim:X,pegAnim:me,particles:be,arrowPos:ge,labelPos:fe,mults:x,roster:u,metadata:o,youIdx:y,popups:q}),e.jsx(zn,{roster:u,scores:k,mults:x,targetPoints:C,final:d,payouts:g,metadata:o}),e.jsx(An,{message:T})]})}const _e="/assets/action-Do835deA.mp3",Hn=se`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`,Un=v.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.3);

  ${({status:a})=>{switch(a){case"waiting":return`
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, rgba(69, 160, 73, 0.2) 100%);
          color: #4caf50;
          border-color: rgba(76, 175, 80, 0.3);
        `;case"playing":return`
          background: linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 87, 34, 0.2) 100%);
          color: #ff6b35;
          border-color: rgba(255, 107, 53, 0.3);
        `;case"settled":return`
          background: linear-gradient(135deg, rgba(162, 89, 255, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%);
          color: #a259ff;
          border-color: rgba(162, 89, 255, 0.3);
        `}}}
`,Kn=v.div`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%);
  color: #ffd700;
  border: 1px solid rgba(255, 215, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: ${Hn} 2s ease-in-out infinite;
`,qn=v.button`
  padding: 10px 20px;
  margin-right: 12px;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(112, 112, 218, 0.3) 0%, rgba(162, 89, 255, 0.3) 100%);
  color: #fff;
  border: 1px solid rgba(112, 112, 218, 0.2);
  border-radius: 8px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(112, 112, 218, 0.3);
    border-color: rgba(112, 112, 218, 0.4);
  }
`;function Xn({pk:a,onBack:r,effectsRef:o}){const{game:l,metadata:n}=St(a,{fetchMetadata:!0}),{publicKey:C}=Le(),[g,p]=c.useState(null),[u,h]=c.useState(null),[y,w]=c.useState(null),[M,$]=c.useState(!1);c.useEffect(()=>{if(!l?.state.settled||g)return;const i=Number(l.winnerIndexes[0]);if(p(l.players.map(d=>d.user)),h(i),w(l.players.map(d=>Number(d.pendingPayout??d.pending_payout??0))),o?.current){const d=l.players.find(R=>R.user.toString()===C?.toString());d&&(Number(d.pendingPayout??d.pending_payout??0)>0?(o.current.winFlash("#ffd700",2.5),setTimeout(()=>{o.current?.particleBurst(void 0,void 0,"#ffd700",60),o.current?.screenShake(3,1200)},300)):(o.current.loseFlash("#ff4444",1.5),setTimeout(()=>{o.current?.screenShake(1.5,800)},200)))}},[l,g,o]),c.useEffect(()=>{g&&g.length===0&&$(!0)},[g]);const[k,S]=c.useState(0);c.useEffect(()=>{if(!l?.softExpirationTimestamp)return;const i=Number(l.softExpirationTimestamp)*1e3,d=()=>S(Math.max(i-Date.now(),0));d();const R=setInterval(d,1e3);return()=>clearInterval(R)},[l?.softExpirationTimestamp]);const x=g===null,W=x?l?.players.map(i=>i.user)||[]:g,j=x?null:u,I=x?void 0:y,t=i=>{const d=Math.ceil(i/1e3),R=Math.floor(d/60),T=d%60;return`${R}:${T.toString().padStart(2,"0")}`};c.useEffect(()=>(clearTimeout(D.timer),D.count+=1,()=>{D.count-=1,D.count===0&&(D.timer=setTimeout(pt,200))}),[]);const{play:s,sounds:f}=ke({action:_e},{disposeOnUnmount:!1});return c.useEffect(()=>{if(!x){try{D.sound?.player.stop()}catch{}const i=f.action;if(i){i.player.loop=!0;const d=()=>{if(i.ready){s("action"),Be(i);try{i.gain.set({gain:D.muted?0:i.gain.get().gain})}catch{}}else setTimeout(d,100)};d()}}},[x,s,f]),e.jsxs(e.Fragment,{children:[e.jsx(mt,{players:W,winnerIdx:j,gamePk:a.toBase58(),payouts:I,metadata:n,onFinished:x?void 0:()=>$(!0)}),e.jsxs("div",{style:{position:"absolute",top:16,right:16,zIndex:200,display:"flex",flexDirection:"column",gap:"8px",alignItems:"flex-end"},children:[e.jsx(Un,{status:x?"waiting":M?"settled":"playing",children:x?"⏳ Waiting":M?"🏆 Settled":"🏁 Playing"}),x&&k>0&&e.jsxs(Kn,{children:["Starts in ",t(k)]})]}),e.jsxs(ne.Portal,{target:"controls",children:[e.jsx(qn,{onClick:r,children:"← Lobby"}),x&&l?.state.waiting?C&&!l.players.some(i=>i.user.equals(C))?e.jsx(Ue.JoinGame,{pubkey:a,account:l,creatorAddress:qe,creatorFeeBps:Ke,referralFee:jt,enableMetadata:!0,onTx:()=>{}}):e.jsx(Ue.EditBet,{pubkey:a,account:l,creatorAddress:qe,creatorFeeBps:Ke,onComplete:()=>{}}):null]})]})}se`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`;se`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;const Vn=se`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`,Jn=v.div`
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
`,Qn=v.div`
  background: linear-gradient(135deg, rgba(24, 24, 24, 0.95) 0%, rgba(40, 40, 40, 0.95) 100%);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  animation: ${Vn} 0.6s ease-out;
`,Zn=v.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 215, 0, 0.2);
`,ea=v.h2`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff9500 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
`,ta=v.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`,Me=v.label`
  display: grid;
  gap: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffd700;
`,Ce=v.input`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 16px;
  border-radius: 12px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  background: rgba(40, 40, 40, 0.8);
  color: #fff;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
    background: rgba(50, 50, 50, 0.9);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`,na=v.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 215, 0, 0.2);
`,aa=v.button`
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: #fff;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`,Ee=v.div`
  color: #ccc;
  font-size: 0.9rem;
  font-weight: 400;
`;function ra({onBack:a}){const[r,o]=c.useState(5),[l,n]=c.useState(0),[C,g]=c.useState(0),[p,u]=c.useState([]),[h,y]=c.useState(null),[w,M]=c.useState(""),[$,k]=c.useState(null),[S,x]=c.useState(!1),W=p.length===0;c.useEffect(()=>(clearTimeout(D.timer),D.count+=1,()=>{D.count-=1,D.count===0&&(D.timer=setTimeout(pt,200))}),[]);const{play:j,sounds:I}=ke({lobby:dt},{disposeOnUnmount:!1});c.useEffect(()=>{if(!D.sound){const i=I.lobby;if(i){i.player.loop=!0;const d=()=>{i.ready?(j("lobby"),Be(i)):setTimeout(d,100)};d()}}},[I,j]);const{play:t,sounds:s}=ke({action:_e},{disposeOnUnmount:!1});c.useEffect(()=>{if(!W){try{D.sound?.player.stop()}catch{}const i=s.action;if(i){i.player.loop=!0;const d=()=>{i.ready?(t("action"),Be(i)):setTimeout(d,100)};d()}}},[W,s,t]);const f=c.useCallback(()=>{const i=Math.max(1,Math.min(20,r)),d=Math.max(0,Math.min(i-1,C));g(d),u(Array.from({length:i},oa)),y(Math.max(0,Math.min(i-1,l)));const R=w.trim()||$t.generate().publicKey.toBase58();k(R),x(!1)},[r,l,C,w]);return e.jsxs(e.Fragment,{children:[p.length===0&&e.jsx(Jn,{children:e.jsxs(Qn,{children:[e.jsx(Zn,{children:e.jsx(ea,{children:"🐞 Debug Simulator"})}),e.jsxs(ta,{children:[e.jsxs(Me,{children:[e.jsx("span",{children:"Balls (Players)"}),e.jsx(Ce,{type:"number",min:1,max:20,step:1,inputMode:"numeric",value:r,onChange:i=>o(+i.target.value)}),e.jsx(Ee,{children:"How many players (1–20)"})]}),e.jsxs(Me,{children:[e.jsx("span",{children:"Winner Index"}),e.jsx(Ce,{type:"number",min:0,step:1,inputMode:"numeric",value:l,onChange:i=>n(+i.target.value)}),e.jsx(Ee,{children:"Zero-based index of the winner"})]}),e.jsxs(Me,{children:[e.jsx("span",{children:"Your Index"}),e.jsx(Ce,{type:"number",min:0,max:Math.max(0,r-1),step:1,inputMode:"numeric",value:C,onChange:i=>g(+i.target.value)}),e.jsxs(Ee,{children:['Which ball is "you" (0…',Math.max(0,r-1),")"]})]}),e.jsxs(Me,{children:[e.jsx("span",{children:"Seed (optional)"}),e.jsx(Ce,{type:"text",placeholder:"Base58 seed or leave empty",value:w,onChange:i=>M(i.target.value)}),e.jsx(Ee,{children:"Leave empty to use a random seed"})]})]}),e.jsx(na,{children:e.jsx(aa,{onClick:f,children:"🎯 Run Race"})})]})}),p.length>0&&$&&e.jsx(mt,{players:p,winnerIdx:h,youIndexOverride:C,gamePk:$,onFinished:()=>x(!0)}),e.jsx(ne.Portal,{target:"controls",children:p.length>0&&S&&e.jsx(ne.Button,{onClick:a,children:"← Back to lobby"})})]})}function oa(a,r){throw new Error("Function not implemented.")}xe.normal;xe.degen;const ot=xe.PEGS,st=xe.BUCKETS;function ma(){const a=Mt({gameName:"Plinko Race",description:"Multiplayer Plinko racing! Compete with other players as balls race down through pegs to the finish",rtp:98,maxWin:"1000x"});console.log("🎯 PLINKO RACE COMPONENT LOADING..."),ne.useGame();const r=Ct(),o=Et(),[l,n]=Pt(),[C,g]=ye.useState(!1),[p,u]=ye.useState(!1),h=ye.useMemo(()=>{const j=Math.max(...xe.normal),I=Math.max(...xe.degen);return Math.max(j,I)},[]),y=ye.useMemo(()=>o.maxPayout/h,[o.maxPayout,h]);l*h>o.maxPayout,ye.useEffect(()=>{l>y&&n(y)},[y,l,n]);const{settings:M}=It(),[$,k]=c.useState(null),[S,x]=c.useState(!1);ke({bump:_e,win:Ft,fall:Wt}),c.useCallback((j,I)=>{if(!M.enableEffects){console.log("♿ Flash effect skipped - accessibility visual feedback disabled");return}console.log("♿ ACCESSIBILITY FLASH triggered:",{color:j,intensity:I});const t=Math.min(I*1.5,.8),s=[()=>document.querySelector('[data-game-effects-container="true"]'),()=>document.querySelector("[data-quality]"),()=>document.querySelector('[class*="EffectsContainer"]'),()=>document.querySelector('div[style*="--flash-color"]'),()=>document.querySelector('div[style*="position: relative"][style*="width: 100%"]'),()=>{const T=document.querySelectorAll("div");for(const N of Array.from(T)){const q=window.getComputedStyle(N,"::before");if(q.content!=="none"&&q.position==="absolute")return N}return null},()=>{const T=document.querySelector("canvas")||document.querySelector('[data-testid="plinko-race-game"]');return T?.closest('div[class*="motion"]')||T?.parentElement?.parentElement}];let f=null;for(let T=0;T<s.length;T++)try{if(f=s[T](),f){console.log(`🎯 Found container using method ${T+1}:`,f);break}}catch(N){console.log(`❌ Method ${T+1} failed:`,N)}if(!f){console.log("❌ No effects container found with any method");return}console.log("♿ Adding enhanced accessibility flash overlay");const i=document.createElement("div");i.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: ${j};
      opacity: ${t};
      z-index: 9999;
      pointer-events: none;
      border-radius: 8px;
      border: 6px solid ${j};
      box-shadow: inset 0 0 30px ${j}, 0 0 50px ${j}, 0 0 100px ${j}80;
      transition: opacity 0.3s ease;
    `,f.appendChild(i);const d=document.createElement("div");d.setAttribute("aria-live","polite"),d.setAttribute("role","status"),d.style.cssText=`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 18px;
      font-weight: bold;
      z-index: 10000;
      pointer-events: none;
      text-align: center;
      border: 2px solid ${j};
    `;const R=j.includes("00ff")||j.includes("ffff");d.textContent=R?"🏆 WIN!":"❌ LOSE",f.appendChild(d),console.log("♿ Added enhanced accessibility flash overlay with text indicator"),setTimeout(()=>{f.classList.remove("flashing"),i.parentNode&&(i.style.opacity="0",setTimeout(()=>{i.parentNode&&i.parentNode.removeChild(i)},300)),d.parentNode&&(d.style.opacity="0",setTimeout(()=>{d.parentNode&&d.parentNode.removeChild(d)},300))},2e3)},[M.enableEffects]);const W=c.useCallback(()=>{k(null),x(!1)},[]);return p?ot.degen:ot.normal,p?st.degen:st.normal,e.jsxs(e.Fragment,{children:[a,e.jsx(ne.Portal,{target:"screen",children:e.jsxs(Yt,{children:[e.jsx("div",{className:"velocity-bg-elements"}),e.jsx("div",{className:"race-whispers-overlay"}),e.jsx("div",{className:"lightning-speed-indicator"}),e.jsx(Bt,{title:"⚡ PLINKO RACE",description:"Where Lightning Strikes the Fastest",children:e.jsx("div",{style:{position:"absolute",inset:0,display:"flex"},children:e.jsx("div",{style:{pointerEvents:"auto",position:"relative",zIndex:10,width:"100%",height:"100%"},children:S?e.jsx(ra,{onBack:()=>x(!1)}):$?e.jsx(Xn,{pk:$,onBack:W}):e.jsx(yn,{onSelect:k,onDebug:()=>x(!0)})})})})]})}),e.jsxs(ne.Portal,{target:"controls",children:[e.jsxs(Rt,{wager:l,setWager:n,onPlay:()=>{},hideWager:!0,hideMessage:"Join a Game Above! 🎯",children:[e.jsx(Xe,{label:"Degen Mode",checked:p,onChange:u,disabled:r.isPlaying}),e.jsx(Xe,{label:"Debug Mode",checked:S,onChange:x,disabled:!1})]}),e.jsxs(Tt,{children:[" ",e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",padding:"20px",color:"#ffd700",fontSize:"18px",fontWeight:"700",textShadow:"0 2px 4px rgba(0, 0, 0, 0.5)"},children:"Join a Game Above! 🎯"}),e.jsx("div",{children:"Degen:"}),e.jsx(ne.Switch,{disabled:r.isPlaying,checked:p,onChange:u}),e.jsx("div",{children:"Debug:"}),e.jsx(ne.Switch,{disabled:!1,checked:S,onChange:x})]})]})]})}export{ma as default};
