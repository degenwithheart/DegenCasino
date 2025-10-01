import{j as e,R as o}from"./three-DV31HySq.js";import{H as pe,be as p,d as i,m as J,G as g,aH as ye,aI as ve,aJ as we,aK as je,an as ke,bf as ze,aL as Me,aM as Ce,T as D,aN as ie,b8 as Se,aO as ae,aV as ne,aP as oe}from"./index-BarUt2o_.js";import{G as $e}from"./GameStatsHeader-DfbFCrGS.js";import{u as K}from"./useGameMeta-C4Hfe5lB.js";import{S as Pe}from"./HiLoBackground.enhanced.styles-CUZ-VCTJ.js";import{m as Re}from"./deterministicRng-BQgZTO1k.js";import{a as Ne,b as Oe,c as Le,S as De}from"./card-Bpd4J03d.js";import{G as Ie}from"./GameRecentPlaysHorizontal-CmiF3H-Z.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const Fe="/assets/finish-DCLnd53M.mp3",V=pe.RANKS,xe=J`
  0% { transform: scale(.0) translateY(100px) rotateY(90deg); }
  100% { transform: scale(1) translateY(0) rotateY(0deg) }
`,He=i.div`
  user-select: none;
  background: #9967e300;
  transition: opacity .2s;
  ${({$disabled:t})=>t&&p`
    pointer-events: none;
    opacity: .7;
  `}
`,Ge=i.div`
  display: flex;
  flex-direction: column;
`,se=i.button`
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  transition: opacity .2s, background .2s ease;
  display: flex;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  color: white;
  & > div:first-child {
    font-size: 48px;
    filter: drop-shadow(-4px 4px 2px #00000066);
    margin-right: 10px;
  }

  --opacity: .5;

  &:hover {
    --opacity : 1;
  }

  ${t=>t.selected&&p`
    --opacity: 1;
  `}

  opacity: var(--opacity);
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    font-size: 16px;
    & > div:first-child {
      font-size: 36px;
      margin-right: 8px;
    }
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    font-size: 18px;
    & > div:first-child {
      font-size: 42px;
      margin-right: 9px;
    }
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    font-size: 19px;
    & > div:first-child {
      font-size: 45px;
      margin-right: 9px;
    }
  }
  
  @media (min-width: 900px) {
    font-size: 20px;
    & > div:first-child {
      font-size: 48px;
      margin-right: 10px;
    }
  }
`;i.div`
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 50px;
  background: #69ff6d;
  padding: 5px;
  /* Animation will be conditionally applied via class or props */
`;const Ye=i.div`
  display: flex;
  border-radius: 5px;
  gap: 5px;
  padding: 5px;
  margin-top: 30px;
  justify-content: center;
  & > div {
    transition: opacity .2s;
  }
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    gap: 3px;
    padding: 3px;
    margin-top: 20px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    gap: 4px;
    padding: 4px;
    margin-top: 25px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    gap: 4px;
    padding: 4px;
    margin-top: 28px;
  }
  
  @media (min-width: 900px) {
    gap: 5px;
    padding: 5px;
    margin-top: 30px;
  }
`,Ae=i.div`
  transition: ${t=>t.enableMotion!==!1?"transform .2s ease":"none"};
  perspective: 500px;
  display: flex;
  position: relative;
  justify-content: flex-end;
  align-items: center;
`,Te=i.div`
  position: absolute;
  bottom: 0;
  transition: ${t=>t.enableMotion!==!1?"transform .25s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity .25s ease":"none"};
  filter: drop-shadow(-10px 10px 0px #00000011);
  transform-origin: bottom;
  perspective: 500px;
  & > div {
    ${t=>t.enableMotion!==!1&&p`
      animation: ${xe} .25s cubic-bezier(0.5, 0.9, 0.35, 1.05);
    `}
  }
`;i.div`
  ${t=>t.$small?p`
    height: 35px;
    font-size: 15px;
    padding: 5px;
    border-radius: 4px;
  `:p`
    height: 100px;
    font-size: 70px;
    padding: 10px;
    border-radius: 8px;
  `}
  box-shadow: -5px 5px 10px 1px #0000003d;
  background: white;
  aspect-ratio: 4/5.5;
  position: relative;
  color: #333;
  overflow: hidden;
  .rank {
    font-weight: bold;
    line-height: 1em;
  }
  .suit {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 50%;
    background-size: cover;
    background-repeat: none;
    transform: translate(0%, 0%);
    font-size: 128px;
    opacity: .9;
  }
  
  /* Responsive adjustments for large cards */
  ${t=>!t.$small&&p`
    @media (max-width: 640px) {
      height: 80px;
      font-size: 56px;
      padding: 8px;
    }
    
    @media (min-width: 641px) and (max-width: 768px) {
      height: 90px;
      font-size: 63px;
      padding: 9px;
    }
    
    @media (min-width: 769px) and (max-width: 899px) {
      height: 95px;
      font-size: 66px;
      padding: 9px;
    }
    
    @media (min-width: 900px) {
      height: 100px;
      font-size: 70px;
      padding: 10px;
    }
  `}
  
  /* Responsive adjustments for small cards */
  ${t=>t.$small&&p`
    @media (max-width: 640px) {
      height: 28px;
      font-size: 12px;
      padding: 4px;
    }
    
    @media (min-width: 641px) and (max-width: 768px) {
      height: 31px;
      font-size: 13px;
      padding: 4px;
    }
    
    @media (min-width: 769px) and (max-width: 899px) {
      height: 33px;
      font-size: 14px;
      padding: 4px;
    }
    
    @media (min-width: 900px) {
      height: 35px;
      font-size: 15px;
      padding: 5px;
    }
  `}
`;const Be=J`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;i.div`
  ${t=>t.enableMotion!==!1&&p`
    animation: ${Be} 2s ease-in-out infinite;
  `}
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateX(100%) translateY(-50%);
  background-color: rgba(255, 204, 0, 0.8);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  color: black;
  white-space: nowrap;
  pointer-events: none;
`;i.div`
  font-size: 18px;
  color: #005400;
  margin-top: 20px;
  border-radius: 50px;
  background: #69ff6d;
  padding: 5px 10px;
  ${t=>t.enableMotion!==!1&&p`
    animation: ${xe} .25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  `}
  cursor: pointer;
  
  /* Responsive adjustments */
  @media (max-width: 640px) {
    font-size: 14px;
    margin-top: 16px;
    padding: 4px 8px;
  }
  
  @media (min-width: 641px) and (max-width: 768px) {
    font-size: 16px;
    margin-top: 18px;
    padding: 4px 9px;
  }
  
  @media (min-width: 769px) and (max-width: 899px) {
    font-size: 17px;
    margin-top: 19px;
    padding: 5px 9px;
  }
  
  @media (min-width: 900px) {
    font-size: 18px;
    margin-top: 20px;
    padding: 5px 10px;
  }
`;const We=["A","K","Q","J","10","9","8","7","6","5","4","3","2"],_e=i.div`
  width: ${t=>t.small?"35px":"100px"};
  height: ${t=>t.small?"49px":"140px"};
  margin: 5px;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
  transition: ${t=>t.enableMotion!==!1?"transform 0.6s":"none"};
  transform-style: preserve-3d;
  transform: ${t=>t.enableMotion===!1?(t.revealed,"rotateY(0deg)"):t.revealed?"rotateY(0deg)":"rotateY(180deg)"};

  &:hover {
    transform: ${t=>t.enableMotion===!1?(t.revealed,"scale(1.05)"):t.revealed?"rotateY(0deg) scale(1.05)":"rotateY(180deg) scale(1.05)"};
  }
`,Ee=i.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  background: white;
  box-shadow: -5px 5px 10px 1px #0000003d;
  color: #333;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${t=>t.small?"4px":"10px"};
  font-weight: bold;
  user-select: none;
`,Ue=i.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  /* Use provided card back image */
  background-image: url('/png/images/card.png');
  background-repeat: no-repeat;
  background-size: cover; /* fill completely to avoid white borders */
  background-color: #2d1810; /* darker fallback to match card */
  box-shadow: -5px 5px 10px 1px #0000003d;
  padding: 6px;
  display: ${t=>t.enableMotion===!1&&t.revealed?"none":"flex"};
  align-items: center;
  justify-content: center;
  transform: rotateY(180deg);
  border: none; /* image includes its own frame */
  overflow: hidden; /* keep rounded corners clean */
`,Ke=i.div`
  font-size: ${t=>t.small?"12px":"70px"};
  font-weight: bold;
  line-height: 1em;
  align-self: flex-start;
`,Ve=i.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 50%;
  height: 50%;
  background-image: ${t=>t.logo?`url(${t.logo})`:"none"};
  background-size: cover;
  background-repeat: no-repeat;
  transform: translate(0%, 0%);
  font-size: ${t=>t.small?"64px":"128px"};
  opacity: 0.9;
`,re=({rank:t,revealed:d=!0,small:l=!1,logo:F,onClick:S,enableMotion:x=!0,style:H})=>{const $=We[t%13];return e.jsxs(_e,{revealed:d,enableMotion:x,small:l,onClick:S,style:H,children:[e.jsxs(Ee,{small:l,children:[e.jsx(Ke,{small:l,className:"rank",children:$}),e.jsx(Ve,{small:l,logo:F,className:"suit"})]}),e.jsx(Ue,{revealed:d,enableMotion:x,small:l})]})},Je=J`
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
`,Qe=i.div`
  text-align: center;
  background: rgba(0, 150, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  min-height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: nowrap;
  gap: 25px;
  opacity: ${t=>t.visible?1:0};
  visibility: ${t=>t.visible?"visible":"hidden"};
  transition: ${t=>t.enableMotion!==!1?"opacity 0.3s ease, visibility 0.3s ease":"none"};
  box-shadow: 0 2px 10px rgba(0, 255, 0, 0.1);
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 12px;
    margin: 15px 0;
    gap: 15px;
    min-height: 60px;
  }
  
  @media (max-width: 480px) {
    padding: 8px;
    gap: 8px;
    min-height: 50px;
  }
  
  ${t=>t.visible&&t.enableMotion!==!1&&p`
    animation: ${Je} 1.6s infinite;
  `}
`,f=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  max-width: 140px;
  padding: 8px 6px;
  flex: 1;
  
  @media (max-width: 768px) {
    min-width: 60px;
    max-width: 100px;
    padding: 6px 4px;
  }
  
  @media (max-width: 480px) {
    min-width: 50px;
    max-width: 80px;
    padding: 4px 2px;
  }
`,u=i.div`
  font-size: 13px;
  color: #bbb;
  margin-bottom: 6px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 11px;
    margin-bottom: 4px;
    letter-spacing: 0.3px;
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
    margin-bottom: 2px;
    letter-spacing: 0.2px;
  }
`,y=i.div`
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`,Xe=i.div`
  font-size: 18px;
  font-weight: bold;
  color: ${t=>t.profit>0?"#4caf50":t.profit<0?"#f44336":"#fff"};
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`,de=(t,d=0)=>{const l=Re(t+":"+d);return 1+Math.floor(l()*(V-1))},le=(t,d)=>({key:d,rank:t}),I=(t,d)=>pe.calculateBetArray(t,d);function pt(t){const d=g.useGame(),l=ye(),F=ve(),[S]=o.useState(()=>"hilo-init"),[x,H]=o.useState([le(de(S,0),0)]),[$,Q]=o.useState(!1),[r,v]=we(),[Ze,w]=o.useState(0),j=x[x.length-1].rank,[c,X]=o.useState(j>V/2?"lo":"hi"),[Z,P]=o.useState(),[G,R]=o.useState(!1),[N,k]=o.useState(0),[q,z]=o.useState(0),[ce,M]=o.useState(0),[s,ee]=o.useState(!0),{settings:C}=je(),{mobile:me}=ke(),Y=ze("hilo"),b=o.useRef(null),A=a=>H(n=>[...n,le(a,n.length)].slice(-5)),h=Me({card:De,win:Le,lose:Oe,play:Ne,finish:Fe});o.useMemo(()=>{let a=0;for(let n=0;n<13;n++){const m=I(n,!0),E=I(n,!1),U=Math.max(...m),be=Math.max(...E);a=Math.max(a,U,be)}return a},[]);const T=o.useMemo(()=>I(j,!0),[j]),B=o.useMemo(()=>I(j,!1),[j]),he=o.useMemo(()=>{const a=Z??c;return a==="hi"?T:a==="lo"?B:[0]},[T,B,Z,c]),ge=async()=>{try{if($)return;h.play("finish",{playbackRate:.8}),setTimeout(()=>{w(0),h.play("card"),A(de(S+":reset",Date.now()%10)),Q(!1)},300)}catch{Q(!1)}},O=()=>{k(r),z(0),M(0),R(!0),h.play("play"),_()},fe=()=>{R(!1),k(0),z(0),M(0),w(0),ge()},W=he,ue=Math.max(...W),L=F.maxPayout/ue,te=G?N:r,_=async()=>{if(te<=0){console.error("❌ BLOCKED: Cannot play with zero wager");return}h.play("play"),await d.play({bet:W,wager:te});const a=await d.result();A(a.resultIndex),h.play("card",{playbackRate:.8});const n=a.payout>0;setTimeout(()=>{n?(h.play("win"),console.log("🃏 HILO WIN! Correct prediction"),b.current?.winFlash(),b.current?.particleBurst(50,60,void 0,8),b.current?.screenShake(.8,500),k(a.payout),z(a.payout-r),M(m=>m+1),w(a.payout),s||setTimeout(()=>{R(!1),k(0),z(0),M(0),w(0)},150)):(h.play("lose"),console.log("💔 HILO LOSE! Wrong prediction"),b.current?.loseFlash(),b.current?.screenShake(.5,300),setTimeout(()=>{R(!1),k(0),z(-r),M(0),w(0)},150)),Y.updateStats(a.payout)},450)};return e.jsxs(e.Fragment,{children:[e.jsx(g.Portal,{target:"recentplays",children:e.jsx(Ie,{gameId:"hilo"})}),e.jsx(g.Portal,{target:"stats",children:e.jsx($e,{gameName:"HiLo",gameMode:s?"Progressive":"Normal",rtp:"95",stats:Y.stats,onReset:Y.resetStats,isMobile:me})}),e.jsx(g.Portal,{target:"screen",children:e.jsxs(Pe,{children:[e.jsx("div",{className:"romance-bg-elements"}),e.jsx("div",{className:"razor-overlay"}),e.jsx("div",{className:"fragile-indicator"}),e.jsx(Ce,{ref:b,...K("hilo")&&{title:K("hilo").name,description:K("hilo").description},children:e.jsx(g.Responsive,{children:e.jsx("div",{className:"hilo-content",children:e.jsxs(He,{$disabled:$||l.isPlaying,children:[e.jsx(Qe,{visible:!0,enableMotion:C.enableMotion,children:G?e.jsxs(e.Fragment,{children:[e.jsxs(f,{children:[e.jsx(u,{children:"Current Balance"}),e.jsx(Xe,{profit:N,children:e.jsx(D,{amount:N})})]}),e.jsxs(f,{children:[e.jsx(u,{children:"Total Profit"}),e.jsx(y,{style:{color:q>0?"#4caf50":"#f44336"},children:e.jsx(D,{amount:q})})]}),e.jsxs(f,{children:[e.jsx(u,{children:"Hands Played"}),e.jsx(y,{children:ce})]})]}):e.jsxs(e.Fragment,{children:[e.jsxs(f,{children:[e.jsx(u,{children:"Game Status"}),e.jsx(y,{children:"Ready to Play"})]}),e.jsxs(f,{children:[e.jsx(u,{children:"Game Type"}),e.jsx(y,{children:s?"Progressive HiLo":"Classic HiLo"})]}),e.jsxs(f,{children:[e.jsx(u,{children:"Starting Wager"}),e.jsx(y,{children:e.jsx(D,{amount:r})})]}),e.jsxs(f,{children:[e.jsx(u,{children:"Mode"}),e.jsx(y,{children:"Progressive"})]})]})}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr"},children:[e.jsx(Ae,{enableMotion:C.enableMotion,children:x.map((a,n)=>{const m=-(x.length-(n+1)),E=x.length>3?n/x.length:1,U=Math.min(1,E*3);return e.jsx(Te,{enableMotion:C.enableMotion,style:{transform:`translate(${m*30}px, ${-m*0}px) rotateZ(-5deg) rotateY(5deg)`,opacity:U},children:e.jsx(re,{rank:a.rank,revealed:!0,small:!1,logo:t.logo,enableMotion:C.enableMotion})},a.key)})}),e.jsxs(Ge,{children:[e.jsxs(se,{selected:c==="hi",onClick:()=>X("hi"),onMouseEnter:()=>P("hi"),onMouseLeave:()=>P(void 0),children:[e.jsx("div",{children:"💘"}),e.jsxs("div",{children:["Romance Rises - (",Math.max(...T).toFixed(2),"x)"]})]}),e.jsxs(se,{selected:c==="lo",onClick:()=>X("lo"),onMouseEnter:()=>P("lo"),onMouseLeave:()=>P(void 0),children:[e.jsx("div",{children:"💔"}),e.jsxs("div",{children:["Fragile Falls - (",Math.max(...B).toFixed(2),"x)"]})]})]})]}),e.jsx(Ye,{children:Array.from({length:V}).map((a,n)=>{const m=W[n]>0?.9:.5;return e.jsx(re,{rank:n,revealed:!0,small:!0,logo:t.logo,enableMotion:C.enableMotion,style:{opacity:m},onClick:()=>A(n)},n)})})]})})})})]})}),e.jsx(g.Portal,{target:"controls",children:G?e.jsxs(e.Fragment,{children:[e.jsx(ie,{wager:r,setWager:v,onPlay:s?_:O,playDisabled:s?!c:!1,playText:s?"Continue":"Again"}),e.jsxs(ae,{onPlay:s?_:O,playDisabled:s?!c:!1,playText:s?"Continue":"Again",children:[e.jsx(ne,{value:r,onChange:v,disabled:!0}),e.jsx(D,{amount:N}),s&&e.jsx(oe,{disabled:l.isPlaying,onClick:fe,children:"Cash Out"})]})]}):e.jsxs(e.Fragment,{children:[e.jsx(ie,{wager:r,setWager:v,onPlay:O,playDisabled:!c||r>L,playText:"Start",children:e.jsx(Se,{label:"Progressive Mode",checked:s,onChange:ee,disabled:!1})}),e.jsxs(ae,{onPlay:O,playDisabled:!c||r>L,playText:"Start",children:[e.jsx(ne,{value:r,onChange:v}),e.jsx("div",{children:"Progressive:"}),e.jsx(g.Switch,{checked:s,onChange:ee}),r>L&&e.jsx(oe,{onClick:()=>v(L),children:"Set max"})]})]})})]})}export{pt as default};
