import{j as n}from"./three-DV31HySq.js";import{d as o,be as u,x as F,m as I}from"./index-BarUt2o_.js";import"./blockchain-C0nfa7Sw.js";const z=I`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;function c(e,a){return!e||typeof e!="string"?(a+1).toString():F(e).slice(0,2).toUpperCase()}const A=o.div`
  background: 
    radial-gradient(ellipse at center, 
      #1a5f1a 0%, 
      #0d4b0d 60%, 
      #0a3a0a 100%
    );
  border: 8px solid #c9b037;
  border-radius: 20px;
  box-shadow: 
    inset 0 0 50px rgba(255, 215, 0, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.7),
    0 0 80px rgba(255, 215, 0, 0.3);
  padding: clamp(15px, 3vw, 25px) clamp(20px, 4vw, 30px);
  margin: 0;
  width: calc(100% - clamp(40px, 8vw, 60px));
  margin-left: clamp(20px, 4vw, 30px);
  margin-right: clamp(20px, 4vw, 30px);
  max-height: 65vh;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
    border-radius: 24px;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding: clamp(10px, 2.5vw, 15px);
    width: calc(100% - clamp(20px, 4vw, 30px));
    margin-left: clamp(10px, 2vw, 15px);
    margin-right: clamp(10px, 2vw, 15px);
    max-height: 55vh;
  }
`;o.div`
  display: flex;
  flex-direction: column;
  gap: clamp(15px, 3vw, 25px);
  width: 100%;
  align-items: center;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: clamp(25px, 5vw, 40px);
    padding: 0 clamp(15px, 3vw, 25px);
  }
`;o.div`
  @media (min-width: 768px) {
    flex: 1;
    max-width: 60%;
  }
`;o.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(12px, 3vw, 18px);
  width: 100%;
  max-width: 400px;
  padding: clamp(8px, 2vw, 15px);
  align-content: flex-start;

  @media (min-width: 768px) {
    flex: 0 0 350px;
    max-width: 350px;
    grid-template-columns: repeat(2, 1fr);
    gap: clamp(15px, 2.5vw, 22px);
    padding: clamp(15px, 2.5vw, 25px);
    align-content: flex-start;
  }
`;o.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1px;
  margin: 5px;
  width: 100%;
  max-width: 300px;
  
  /* Small tablets */
  @media (min-width: 480px) {
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 2px;
    margin: 8px;
    max-width: 400px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(3, 1fr);
    margin: 10px;
    flex: 1;
    max-width: none;
  }
`;const v=o.button`
  width: 100%;
  height: 30px;
  min-width: 25px;
  border: 2px solid ${e=>e.$color==="red"?"#8b0000":e.$color==="black"?"#1a1a1a":"#004d00"};
  border-radius: 4px;
  
  /* Small tablets */
  @media (min-width: 480px) {
    height: 40px;
    border-radius: 5px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 50px;
    height: clamp(45px, 8vw, 55px);
    border: 3px solid ${e=>e.$color==="red"?"#8b0000":e.$color==="black"?"#1a1a1a":"#004d00"};
    border-radius: 6px;
  }
  background: ${e=>e.$color==="red"?"linear-gradient(135deg, #dc143c 0%, #b91c1c 50%, #991b1b 100%)":e.$color==="black"?"linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #0d0d0d 100%)":"linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)"};
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: ${e=>e.disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  
  ${e=>e.$hasBet&&u`
    animation: ${z} 1.5s infinite;
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.8),
      0 3px 6px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  `}

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 12px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(255, 215, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.4),
      inset 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    transform: none;
  }
`,w=o.button`
  padding: clamp(10px, 2vw, 16px) clamp(12px, 2.5vw, 18px);
  margin: 0;
  border: 2px solid #b8860b;
  border-radius: 8px;
  width: 100%;
  min-height: clamp(45px, 8vw, 55px);
  
  /* Small tablets */
  @media (min-width: 480px) {
    padding: 10px 16px;
    margin: 3px;
    border-radius: 7px;
    min-height: 45px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    padding: 12px 20px;
    margin: 4px;
    border-radius: 8px;
    width: auto;
    min-height: auto;
  }
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(20, 20, 20, 0.9) 50%, rgba(0, 0, 0, 0.8) 100%),
    radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  color: #ffd700;
  font-weight: bold;
  font-size: 0.9rem;
  cursor: ${e=>e.disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 
    0 3px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 215, 0, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  
  ${e=>e.$hasBet&&u`
    animation: ${z} 1.5s infinite;
    background: 
      linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(184, 134, 11, 0.3) 50%, rgba(255, 215, 0, 0.2) 100%),
      radial-gradient(ellipse at center, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
    box-shadow: 
      0 0 20px rgba(255, 215, 0, 0.7),
      0 3px 8px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 215, 0, 0.3);
    border-color: #ffd700;
  `}

  &:hover:not(:disabled) {
    background: 
      linear-gradient(135deg, rgba(255, 215, 0, 0.25) 0%, rgba(184, 134, 11, 0.4) 50%, rgba(255, 215, 0, 0.25) 100%),
      radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, transparent 70%);
    transform: translateY(-1px);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.5),
      0 0 15px rgba(255, 215, 0, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.5;
  }
`;o.div`
  position: relative;
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%),
    radial-gradient(ellipse at center, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #b8860b;
  color: #ffd700;
  font-size: 0.75rem;
  font-weight: bold;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 215, 0, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
  width: 100%;
  text-align: center;
  
  /* Tablets and up */
  @media (min-width: 768px) {
    position: absolute;
    top: 12px;
    right: 18px;
    padding: 12px 18px;
    border-radius: 10px;
    font-size: 0.9rem;
    margin-bottom: 0;
    width: auto;
    text-align: left;
  }
`;const h=o.div`
  position: absolute;
  top: ${e=>-8-e.$playerIndex*3}px;
  right: ${e=>-8-e.$playerIndex*3}px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${e=>{const a=["#8b0000","#006400","#191970","#8b4513","#800080","#b8860b","#2f4f4f","#556b2f"];return a[e.$playerIndex%a.length]}};
  background: ${e=>{const a=["linear-gradient(135deg, #ff4757 0%, #c44569 100%)","linear-gradient(135deg, #2ed573 0%, #1e90ff 100%)","linear-gradient(135deg, #3742fa 0%, #2f3542 100%)","linear-gradient(135deg, #f39c12 0%, #e67e22 100%)","linear-gradient(135deg, #9c88ff 0%, #8c7ae6 100%)","linear-gradient(135deg, #ffd700 0%, #daa520 100%)","linear-gradient(135deg, #70a1ff 0%, #5352ed 100%)","linear-gradient(135deg, #7bed9f 0%, #2ed573 100%)"];return a[e.$playerIndex%a.length]}};
  color: white;
  font-size: 6px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${e=>10+e.$playerIndex};
  box-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  
  /* Small tablets */
  @media (min-width: 480px) {
    top: ${e=>-9-e.$playerIndex*4}px;
    right: ${e=>-9-e.$playerIndex*4}px;
    width: 20px;
    height: 20px;
    font-size: 7px;
    border: 2px solid ${e=>{const a=["#8b0000","#006400","#191970","#8b4513","#800080","#b8860b","#2f4f4f","#556b2f"];return a[e.$playerIndex%a.length]}};
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    top: ${e=>-10-e.$playerIndex*5}px;
    right: ${e=>-10-e.$playerIndex*5}px;
    width: 24px;
    height: 24px;
    font-size: 8px;
    box-shadow: 
      0 3px 6px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3),
      inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 1px;
    right: 1px;
    bottom: 1px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    pointer-events: none;
    
    @media (min-width: 768px) {
      top: 2px;
      left: 2px;
      right: 2px;
      bottom: 2px;
    }
  }
`,j=e=>e===0?"green":[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(e)?"red":"black";Array.from({length:36},(e,a)=>a+1);function X({onBetPlaced:e,gamePhase:a="waiting",playerBets:l=[],disabled:r=!1,wagerAmount:y=1}){const f=y,$=t=>{r||!e||e({type:"number",value:t,amount:f})},m=t=>{r||!e||e({type:"outside",value:t,amount:f})},d=t=>l.some(i=>i.type==="number"&&i.value===t),p=t=>l.some(i=>i.type==="outside"&&i.value===t),g=t=>l.filter(i=>i.type==="number"&&i.value===t),b=t=>l.filter(i=>i.type==="outside"&&i.value===t);return l.reduce((t,i)=>t+i.amount,0),n.jsxs(A,{children:[n.jsx("div",{style:{display:"flex",flexDirection:"column",width:"100%",alignItems:"center",gap:"10px"},children:n.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px",width:"100%",maxWidth:"800px",margin:"0 auto"},children:[n.jsxs("div",{style:{display:"flex",gap:"4px",justifyContent:"center"},children:[n.jsx("div",{style:{display:"flex",flexDirection:"column"},children:n.jsxs(v,{$color:"green",$hasBet:d(0),disabled:r,onClick:()=>$(0),style:{height:"120px",width:"40px",writingMode:"vertical-rl",textOrientation:"mixed"},children:["0",g(0).slice(0,4).map((t,i)=>n.jsx(h,{$playerIndex:i,children:c(t?.player||"unknown",i)},`${t?.player||"unknown"}-${i}`))]})}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(12, 1fr)",gridTemplateRows:"repeat(3, 1fr)",gap:"2px",flex:1},children:[[3,6,9,12,15,18,21,24,27,30,33,36].map(t=>{const i=g(t);return n.jsxs(v,{$color:j(t),$hasBet:i.length>0,disabled:r,onClick:()=>$(t),style:{height:"36px"},children:[t,i.slice(0,4).map((x,s)=>n.jsx(h,{$playerIndex:s,children:c(x?.player||"unknown",s)},`${x?.player||"unknown"}-${s}`))]},t)}),[2,5,8,11,14,17,20,23,26,29,32,35].map(t=>{const i=g(t);return n.jsxs(v,{$color:j(t),$hasBet:i.length>0,disabled:r,onClick:()=>$(t),style:{height:"36px"},children:[t,i.slice(0,4).map((x,s)=>n.jsx(h,{$playerIndex:s,children:c(x?.player||"unknown",s)},`${x?.player||"unknown"}-${s}`))]},t)}),[1,4,7,10,13,16,19,22,25,28,31,34].map(t=>{const i=g(t);return n.jsxs(v,{$color:j(t),$hasBet:i.length>0,disabled:r,onClick:()=>$(t),style:{height:"36px"},children:[t,i.slice(0,4).map((x,s)=>n.jsx(h,{$playerIndex:s,children:c(x?.player||"unknown",s)},`${x?.player||"unknown"}-${s}`))]},t)})]})]}),n.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(6, 1fr)",gap:"4px",marginTop:"8px"},children:[n.jsxs(w,{$hasBet:p("1-18"),disabled:r,onClick:()=>m("1-18"),style:{gridColumn:"span 2"},children:["1-18",b("1-18").slice(0,4).map((t,i)=>n.jsx(h,{$playerIndex:i,children:c(t?.player||"unknown",i)},`${t?.player||"unknown"}-${i}`))]}),n.jsxs(w,{$hasBet:p("even"),disabled:r,onClick:()=>m("even"),children:["Even",b("even").slice(0,4).map((t,i)=>n.jsx(h,{$playerIndex:i,children:c(t?.player||"unknown",i)},`${t?.player||"unknown"}-${i}`))]}),n.jsxs(w,{$hasBet:p("red"),disabled:r,onClick:()=>m("red"),children:["🔴 Red",b("red").slice(0,4).map((t,i)=>n.jsx(h,{$playerIndex:i,children:c(t?.player||"unknown",i)},`${t?.player||"unknown"}-${i}`))]}),n.jsxs(w,{$hasBet:p("black"),disabled:r,onClick:()=>m("black"),children:["⚫ Black",b("black").slice(0,4).map((t,i)=>n.jsx(h,{$playerIndex:i,children:c(t?.player||"unknown",i)},`${t?.player||"unknown"}-${i}`))]}),n.jsxs(w,{$hasBet:p("odd"),disabled:r,onClick:()=>m("odd"),children:["Odd",b("odd").slice(0,4).map((t,i)=>n.jsx(h,{$playerIndex:i,children:c(t?.player||"unknown",i)},`${t?.player||"unknown"}-${i}`))]}),n.jsxs(w,{$hasBet:p("19-36"),disabled:r,onClick:()=>m("19-36"),style:{gridColumn:"span 2"},children:["19-36",b("19-36").slice(0,4).map((t,i)=>n.jsx(h,{$playerIndex:i,children:c(t?.player||"unknown",i)},`${t?.player||"unknown"}-${i}`))]})]})]})}),a==="waiting"&&n.jsx("div",{style:{textAlign:"center",marginTop:"15px",color:"#ffd700"},children:"🎯 Place your bets! Click numbers or betting areas above."}),a==="betting"&&n.jsx("div",{style:{textAlign:"center",marginTop:"15px",color:"#ff6b6b"},children:"⏰ Betting time! Get your bets in now!"}),a==="spinning"&&n.jsx("div",{style:{textAlign:"center",marginTop:"15px",color:"#ffd700"},children:"🎰 No more bets! The wheel is spinning..."})]})}const D=I`
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
`,T=I`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.5); }
  50% { box-shadow: 0 0 40px rgba(255, 215, 0, 0.8); }
`,R=o.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  flex-direction: column;
  margin: 0;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  overflow: hidden;
  
  /* Small tablets */
  @media (min-width: 480px) {
    padding: 15px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    padding: 20px;
  }
`,N=o.div`
  position: relative;
  width: min(280px, calc(100vw - 40px));
  height: min(280px, calc(100vw - 40px));
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(320px, calc(100vw - 60px));
    height: min(320px, calc(100vw - 60px));
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 350px;
    height: 350px;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 400px;
    height: 400px;
  }
`,O=o.div`
  width: min(280px, calc(100vw - 40px));
  height: min(280px, calc(100vw - 40px));
  border: 4px solid #8B4513;
  border-radius: 50%;
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(320px, calc(100vw - 60px));
    height: min(320px, calc(100vw - 60px));
    border: 5px solid #8B4513;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 350px;
    height: 350px;
    border: 6px solid #8B4513;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 400px;
    height: 400px;
    border: 7px solid #8B4513;
  }
  background: 
    radial-gradient(circle at center, #654321 0%, #8B4513 30%, #A0522D 60%, #8B4513 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  

  
  ${e=>e.$spinning&&e.$winningNumber===null?u`
        animation: ${D} 1s linear infinite;
        transform: translate(-50%, -50%) rotate(0deg);
      `:e.$spinning&&e.$winningNumber!==null&&e.$finalRotation!==void 0?u`
        transform: translate(-50%, -50%) rotate(${e.$finalRotation}deg);
        transition: transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        animation: none;
      `:!e.$spinning&&e.$winningNumber!==null&&e.$finalRotation!==void 0?u`
        transform: translate(-50%, -50%) rotate(${e.$finalRotation}deg);
        transition: none;
        animation: none;
      `:u`
        transform: translate(-50%, -50%) rotate(0deg);
        transition: none;
        animation: none;
      `}
  box-shadow: 
    0 0 30px rgba(184, 134, 11, 0.6),
    0 0 60px rgba(184, 134, 11, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
  background-image: 
    radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
`,M=o.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 24px solid #ffd700;
  z-index: 15;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
  
  /* Small tablets */
  @media (min-width: 480px) {
    top: -13px;
    border-left: 13px solid transparent;
    border-right: 13px solid transparent;
    border-top: 26px solid #ffd700;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    top: -15px;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-top: 30px solid #ffd700;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.5));
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    top: -18px;
    border-left: 18px solid transparent;
    border-right: 18px solid transparent;
    border-top: 36px solid #ffd700;
  }
`,S=o.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: 50% 50%;
  width: min(288px, calc(100vw - 32px));
  height: min(288px, calc(100vw - 32px));
  background: linear-gradient(45deg, #DAA520, #B8860B, #DAA520);
  border-radius: 50%;
  z-index: 0;
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(330px, calc(100vw - 50px));
    height: min(330px, calc(100vw - 50px));
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 362px;
    height: 362px;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 414px;
    height: 414px;
  }
`,P=o.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(180px, calc(100vw * 0.45));
  height: min(180px, calc(100vw * 0.45));
  border: 2px solid #DAA520;
  border-radius: 50%;
  background: linear-gradient(135deg, #228B22 0%, #32CD32 30%, #228B22 70%, #1F5F1F 100%);
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(0, 0, 0, 0.3);
  z-index: -1;
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(220px, calc(100vw * 0.5));
    height: min(220px, calc(100vw * 0.5));
    border: 3px solid #DAA520;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 240px;
    height: 240px;
    box-shadow: 
      inset 0 2px 4px rgba(255, 255, 255, 0.2),
      inset 0 -2px 4px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(0, 0, 0, 0.3);
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 280px;
    height: 280px;
  }
`,W=o.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(60px, calc(100vw * 0.15));
  height: min(60px, calc(100vw * 0.15));
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: min(70px, calc(100vw * 0.18));
    height: min(70px, calc(100vw * 0.18));
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 80px;
    height: 80px;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 90px;
    height: 90px;
  }
  background: 
    radial-gradient(ellipse at 30% 30%, #FFD700 0%, #DAA520 50%, #B8860B 100%);
  border: 4px solid #8B4513;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #000;
  font-size: 1.2rem;
  z-index: 10;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  ${e=>e.$winningNumber!==null&&u`
    background: 
      radial-gradient(ellipse at 30% 30%, #FF6B6B 0%, #E53935 50%, #C62828 100%);
    animation: ${T} 1s infinite;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(255, 107, 107, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.3);
  `}
`;o.div`
  text-align: center;
  margin-top: 10px;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 8px;
  width: calc(100% - 20px);
  max-width: 300px;
  
  /* Small tablets */
  @media (min-width: 480px) {
    margin-top: 15px;
    font-size: 1.2rem;
    padding: 12px 18px;
    border-radius: 10px;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    margin-top: 20px;
    font-size: 1.4rem;
    padding: 15px;
    border-radius: 12px;
    width: auto;
    max-width: none;
  }
  ${e=>e.$isWinning?u`
    color: #ffd700;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 107, 107, 0.2));
    border: 2px solid #ffd700;
    animation: ${T} 2s infinite;
  `:u`
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
  `}
`;const E=o.div`
  position: absolute;
  width: 18px;
  height: 28px;
  top: 50%;
  left: 50%;
  transform-origin: 50% 50%;
  transform: ${e=>{const l=Math.cos((e.$angle-90)*Math.PI/180)*85,r=Math.sin((e.$angle-90)*Math.PI/180)*85;return`translate(calc(-50% + ${l}px), calc(-50% + ${r}px)) rotate(${e.$angle}deg)`}};
  
  /* Small tablets */
  @media (min-width: 480px) {
    width: 20px;
    height: 30px;
    transform: ${e=>{const l=Math.cos((e.$angle-90)*Math.PI/180)*95,r=Math.sin((e.$angle-90)*Math.PI/180)*95;return`translate(calc(-50% + ${l}px), calc(-50% + ${r}px)) rotate(${e.$angle}deg)`}};
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    width: 22px;
    height: 32px;
    transform: ${e=>{const l=Math.cos((e.$angle-90)*Math.PI/180)*105,r=Math.sin((e.$angle-90)*Math.PI/180)*105;return`translate(calc(-50% + ${l}px), calc(-50% + ${r}px)) rotate(${e.$angle}deg)`}};
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    width: 26px;
    height: 38px;
    transform: ${e=>{const l=Math.cos((e.$angle-90)*Math.PI/180)*120,r=Math.sin((e.$angle-90)*Math.PI/180)*120;return`translate(calc(-50% + ${l}px), calc(-50% + ${r}px)) rotate(${e.$angle}deg)`}};
  }
  
  background: ${e=>e.$number===0?"linear-gradient(135deg, #228B22 0%, #32CD32 50%, #228B22 100%)":[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(e.$number)?"linear-gradient(135deg, #DC143C 0%, #FF1744 50%, #DC143C 100%)":"linear-gradient(135deg, #000000 0%, #2F2F2F 50%, #000000 100%)"};
  border: 1px solid #DAA520;
  border-radius: 4px;
  box-shadow: 
    inset 0 1px 2px rgba(255, 255, 255, 0.2),
    inset 0 -1px 2px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 5;
`,G=o.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.6rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.9), 0 0 1px rgba(0, 0, 0, 1);
  z-index: 100;
  pointer-events: none;
  transform: rotate(${e=>-e.$angle}deg);
  
  /* Small tablets */
  @media (min-width: 480px) {
    font-size: 0.65rem;
  }
  
  /* Tablets and up */
  @media (min-width: 768px) {
    font-size: 0.7rem;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    font-size: 0.75rem;
  }
`,C=[0,32,15,19,4,21,2,25,17,34,6,27,13,36,11,30,8,23,10,5,24,16,33,1,20,14,31,9,22,18,29,7,28,12,35,3,26];function _({spinning:e=!1,winningNumber:a=null,gamePhase:l="waiting",playerBets:r=[],gameResult:y=null}){console.log("🎡 RouletteWheel render:",{spinning:e,winningNumber:a,gamePhase:l,hasPlayerBets:r.length>0,playerBets:r.map(d=>({type:d.type,value:d.value,player:d.player?.slice(0,8)})),gameResult:y});const f=a,m=(d=>{if(d===null)return console.log("🎡 No winning number, returning 0 rotation"),0;const p=C.indexOf(d);if(p===-1)return console.error("🎡 ❌ Number not found in wheel:",d,"Available numbers:",C),0;console.log("🎡 Calculating rotation for number:",d,"at index:",p);const g=360/37,b=p*g,t=b+g/2,x=t-1.8;console.log("🎯 PRECISE POSITIONING:",{number:d,index:p,basePosition:b.toFixed(2)+"°",segmentCenter:t.toFixed(2)+"°",withOffset:x.toFixed(2)+"°",segmentSize:g.toFixed(3)+"°"});const s=5+Math.random()*2,B=Math.floor(s)*360,k=-(B+x);return console.log("🎡 FINAL CALCULATION:",{number:d,numberPosition:x.toFixed(1)+"°",fullRotations:B+"°",totalRotation:k.toFixed(1)+"°"}),console.log("🎡 ✅ Final rotation:",k,"degrees for number:",d),k})(f);return console.log("🎡 Final rotation result:",m,"for winning number:",f),n.jsx(R,{children:n.jsxs(N,{children:[n.jsx(M,{}),n.jsx(S,{}),n.jsxs(O,{$spinning:e,$winningNumber:f,$finalRotation:m,children:[n.jsx(P,{}),C.map((d,p)=>{const g=p*9.72972972972973;return n.jsx(E,{$number:d,$angle:g,children:n.jsx(G,{$number:d,$angle:g,children:d})},d)}),n.jsx(W,{$winningNumber:a,children:a!==null?a:e?"🌟":"🎲"})]})]})})}export{_ as R,X as a};
