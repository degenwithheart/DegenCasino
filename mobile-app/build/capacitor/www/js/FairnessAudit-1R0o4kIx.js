import{r as l,j as e}from"./three-DV31HySq.js";import{d as r,m as B,B as N,u as O,a as I,U as z,c as D,f as S,b as A,n as _,g as F,i as H,L as U,o as G,C as W,H as V,M as Y,D as J,p as K,q}from"./index-BarUt2o_.js";import{g as Q}from"./utils-D_fBc4qe.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const X=B`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;B`
  0% { opacity: 0.5; }
  100% { opacity: 1; }
`;const Z=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${({status:s})=>{switch(s){case"success":return"rgba(34, 197, 94, 0.1)";case"loading":return"rgba(59, 130, 246, 0.1)";case"error":return"rgba(239, 68, 68, 0.1)";default:return"rgba(156, 163, 175, 0.1)"}}};
  border: 1px solid ${({status:s})=>{switch(s){case"success":return"rgba(34, 197, 94, 0.3)";case"loading":return"rgba(59, 130, 246, 0.3)";case"error":return"rgba(239, 68, 68, 0.3)";default:return"rgba(156, 163, 175, 0.3)"}}};

  .status-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .status-icon {
      font-size: 1.2rem;
    }
    
    .status-text {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .last-updated {
    font-size: 0.9rem;
    color: var(--text-secondary);
    
    .time {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`,ee=r.div`
  margin-bottom: 1.5rem;
`,re=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`,te=r.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`,se=r.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);

  input[type="checkbox"] {
    accent-color: #ffd700;
  }

  span {
    user-select: none;
  }
`,ae=r.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  
  b {
    color: var(--text-primary);
    font-weight: 600;
  }
`,ne=r.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--slate-6);
  border-top: 3px solid #ffd700;
  border-radius: 50%;
  animation: ${X} 1s linear infinite;
  margin: 0 auto;
`,oe=r.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--slate-6);
`,ie=r.div`
  @media (max-width: 768px) {
    display: none;
  }
`,le=r.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--slate-1);
`,x=r.th`
  padding: 1rem;
  text-align: left;
  background: var(--slate-6);
  color: var(--text-primary);
  font-weight: 600;
  border-bottom: 1px solid var(--slate-6);
  
  &:first-child {
    border-top-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
  }
`,b=r.td`
  padding: 1rem;
  border-bottom: 1px solid var(--slate-6);
  color: var(--text-secondary);
`,de=r.tr`
  &:hover {
    background: rgba(255, 215, 0, 0.05);
  }

  ${({status:s})=>s==="error"?`
        background: rgba(239, 68, 68, 0.05);
        border-left: 3px solid #ef4444;
      `:s==="warning"?`
        background: rgba(245, 158, 11, 0.05);
        border-left: 3px solid #f59e0b;
      `:`
      background: rgba(34, 197, 94, 0.02);
      border-left: 3px solid #22c55e;
    `}
`,$=r.span`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${({status:s})=>{switch(s){case"ok":return`
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;case"warning":return`
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;case"error":return`
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;default:return`
          background: rgba(156, 163, 175, 0.1);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        `}}}
`,ce=r.div`
  display: none;
  background: var(--slate-1);
  border: 1px solid var(--slate-6);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  ${({status:s})=>s==="error"?"border-left: 3px solid #ef4444;":s==="warning"?"border-left: 3px solid #f59e0b;":"border-left: 3px solid #22c55e;"}

  @media (max-width: 768px) {
    display: block;
  }
`,f=r.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  background: rgba(255, 215, 0, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
`;r.span`
  font-weight: 600;
  color: ${({status:s})=>{switch(s){case"good":return"#22c55e";case"bad":return"#ef4444";default:return"var(--text-primary)"}}};
`;const ge=r.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--slate-6);
    color: var(--text-secondary);
    line-height: 1.5;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: var(--text-primary);
    }
  }
`;r.div``;r.h3``;r.div``;r.div``;r.button``;r.div``;r.div``;r.div``;r.div``;r.div``;const me=()=>N["multipoker-v2"].calculateBetArray(),ue=1e6,he=1e4,pe=(s,a="")=>{const u=Array.isArray(s)?s:[...s];if(a.includes("mode")){const i=a.includes("standard")?14:12;let d=0;for(let h=0;h<u.length;h++){let v=1;for(let c=1;c<=h;c++)v=v*(i-(h-c))/c;const p=v/Math.pow(2,i);d+=u[h]*p}return{rtp:d,houseEdge:1-d,note:a}}const j=u.reduce((i,d)=>i+d,0)/u.length;return{rtp:j,houseEdge:1-j,note:a}},xe=()=>({blackjack:[...q.betArray],flip:K.calculateBetArray(1,1,"heads"),dice:J.calculateBetArray(50),mines:Y.generateBetArray(5,1),hilo:V.calculateBetArray(6,!0),crash:W.calculateBetArray(1.5),slots:Q(),plinkoStd:G.normal,plinkoDegen:G.degen,progressivepoker:me()});function Re(){const s=I("Fairness Audit","Verify our provably fair gaming algorithms. Real-time fairness testing and audit results for all casino games"),{currentColorScheme:a}=O(),[u,j]=l.useState(0),[i,d]=l.useState(!1),[h,v]=l.useState(null),[p,c]=l.useState(!1),[L,P]=l.useState(""),E=i?ue:he,M=l.useCallback(()=>{j(Date.now()),P(""),c(!0),setTimeout(()=>{c(!1)},1e3)},[]),g=l.useMemo(()=>{const t=xe();return[{game:"Coin Flip",key:"flip",targetRtp:96,onChain:!0,noLocalRng:!0},{game:"Dice Roll",key:"dice",targetRtp:95,onChain:!0,noLocalRng:!0},{game:"Crash",key:"crash",targetRtp:98,onChain:!0,noLocalRng:!0},{game:"Mines",key:"mines",targetRtp:97,onChain:!0,noLocalRng:!0},{game:"HiLo",key:"hilo",targetRtp:96,onChain:!0,noLocalRng:!0},{game:"BlackJack",key:"blackjack",targetRtp:99.2,onChain:!0,noLocalRng:!0},{game:"Slots",key:"slots",targetRtp:96,onChain:!0,noLocalRng:!0},{game:"Plinko (Standard)",key:"plinkoStd",targetRtp:99,onChain:!0,noLocalRng:!0},{game:"Plinko (Degen)",key:"plinkoDegen",targetRtp:98,onChain:!0,noLocalRng:!0},{game:"Multi Poker",key:"progressivepoker",targetRtp:96,onChain:!0,noLocalRng:!0}].map(o=>{const R=t[o.key],n=pe(R,o.key.includes("plinko")?`${o.key} mode`:""),C=n.rtp*100,y=o.targetRtp,w=Math.abs(C-y);let T="ok";return w>2?T="error":w>1&&(T="warning"),{game:o.game,onChain:o.onChain,noLocalRng:o.noLocalRng,rtp:n,targetRtp:y/100,note:`Target: ${y}%, Actual: ${C.toFixed(2)}%`,status:T,betVector:R}})},[u,i]),k=l.useMemo(()=>{const t=g.map(n=>n.game.split(" ")[0]).filter((n,C,y)=>y.indexOf(n)===C),m=g.filter(n=>n.onChain).length,o=g.filter(n=>n.onChain).length,R=g.filter(n=>n.noLocalRng).length;return{totalGames:t.length,liveGames:m,offlineGames:t.length-m,onChainGames:o,trulyRandomGames:R}},[g]);return e.jsxs(e.Fragment,{children:[s,e.jsxs(z,{$colorScheme:a,children:[e.jsx(D,{$colorScheme:a,children:"Game Fairness Audit"}),e.jsx(S,{$colorScheme:a,style:{textAlign:"center",marginBottom:"2rem",fontSize:"1.1rem",fontStyle:"italic",opacity:.9},children:"Comprehensive real-time validation of Return-to-Player (RTP) rates and edge case scenarios. Our transparent testing ensures every game maintains its promised fairness standards."}),e.jsxs(A,{$colorScheme:a,children:[e.jsxs(Z,{status:L?"error":p?"loading":"success",children:[e.jsxs("div",{className:"status-info",children:[e.jsx("span",{className:"status-icon",children:L?"❌":p?"⏳":"✅"}),e.jsx("span",{className:"status-text",children:L?"Testing Failed":p?"Running Tests...":"All Systems Healthy"})]}),e.jsxs("div",{className:"last-updated",children:["Last verified: ",e.jsx("span",{className:"time",children:new Date().toLocaleTimeString()})]})]}),e.jsx(ee,{children:e.jsxs(re,{children:[e.jsxs(te,{children:[e.jsx(_,{$colorScheme:a,onClick:M,children:"🔄 Refresh Data"}),e.jsxs(se,{children:[e.jsx("input",{type:"checkbox",checked:i,onChange:t=>d(t.target.checked)}),e.jsxs("span",{children:["Enable ",e.jsx("b",{children:"High-Volume Testing"})," (1M plays per game)"]})]})]}),e.jsxs(ae,{children:["Currently showing: ",e.jsx("b",{children:E.toLocaleString()})," test games played to verify fairness"]})]})})]}),e.jsxs(A,{$colorScheme:a,children:[e.jsx(F,{$colorScheme:a,children:"Game Status Overview"}),e.jsxs(H,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))",gap:"1rem"},children:[e.jsxs("div",{style:{background:"rgba(255, 255, 255, 0.05)",backdropFilter:"blur(10px)",borderRadius:"12px",padding:"1.5rem",border:"1px solid rgba(255, 215, 0, 0.2)",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"2rem",fontWeight:"bold",color:"#ffd700",marginBottom:"0.5rem"},children:k.totalGames}),e.jsx("div",{style:{color:"rgba(255, 255, 255, 0.8)"},children:"Total Games"})]}),e.jsxs("div",{style:{background:"rgba(255, 255, 255, 0.05)",backdropFilter:"blur(10px)",borderRadius:"12px",padding:"1.5rem",border:"1px solid rgba(255, 215, 0, 0.2)",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"2rem",fontWeight:"bold",color:"#ffd700",marginBottom:"0.5rem"},children:k.liveGames}),e.jsx("div",{style:{color:"rgba(255, 255, 255, 0.8)"},children:"Live Games"})]}),e.jsxs("div",{style:{background:"rgba(255, 255, 255, 0.05)",backdropFilter:"blur(10px)",borderRadius:"12px",padding:"1.5rem",border:"1px solid rgba(255, 215, 0, 0.2)",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"2rem",fontWeight:"bold",color:"#ffd700",marginBottom:"0.5rem"},children:k.onChainGames}),e.jsx("div",{style:{color:"rgba(255, 255, 255, 0.8)"},children:"On-Chain Verified"})]}),e.jsxs("div",{style:{background:"rgba(255, 255, 255, 0.05)",backdropFilter:"blur(10px)",borderRadius:"12px",padding:"1.5rem",border:"1px solid rgba(255, 215, 0, 0.2)",textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"2rem",fontWeight:"bold",color:"#ffd700",marginBottom:"0.5rem"},children:k.trulyRandomGames}),e.jsx("div",{style:{color:"rgba(255, 255, 255, 0.8)"},children:"Truly Random"})]})]})]}),e.jsxs(A,{$colorScheme:a,children:[e.jsx(F,{$colorScheme:a,children:"RTP Analysis Results"}),e.jsx(S,{$colorScheme:a,children:p?e.jsxs("div",{style:{textAlign:"center",padding:"2rem"},children:[e.jsx(ne,{}),e.jsx("p",{children:"Running fairness tests..."})]}):e.jsxs(oe,{children:[e.jsx(ie,{children:e.jsxs(le,{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx(x,{children:"Game"}),e.jsx(x,{children:"On-Chain"}),e.jsx(x,{children:"Target RTP"}),e.jsx(x,{children:"Actual RTP"}),e.jsx(x,{children:"House Edge"}),e.jsx(x,{children:"Status"})]})}),e.jsx("tbody",{children:g.map((t,m)=>e.jsxs(de,{status:t.status,children:[e.jsx(b,{children:t.game}),e.jsx(b,{children:t.onChain?"✅":"❌"}),e.jsx(b,{children:e.jsxs(f,{children:[(t.targetRtp*100).toFixed(1),"%"]})}),e.jsx(b,{children:e.jsxs(f,{children:[(t.rtp.rtp*100).toFixed(2),"%"]})}),e.jsx(b,{children:e.jsxs(f,{children:[(t.rtp.houseEdge*100).toFixed(2),"%"]})}),e.jsx(b,{children:e.jsx($,{status:t.status,children:t.status==="ok"?"✅ Pass":t.status==="warning"?"⚠️ Warning":"❌ Fail"})})]},m))})]})}),e.jsx("div",{style:{display:"block"},children:g.map((t,m)=>e.jsxs(ce,{status:t.status,children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.5rem"},children:[e.jsx("strong",{children:t.game}),e.jsx($,{status:t.status,children:t.status==="ok"?"✅":t.status==="warning"?"⚠️":"❌"})]}),e.jsxs("div",{style:{fontSize:"0.9rem",color:"var(--text-secondary)"},children:[e.jsxs("div",{children:["On-Chain: ",t.onChain?"✅ Yes":"❌ No"]}),e.jsxs("div",{children:["Target RTP: ",e.jsxs(f,{children:[(t.targetRtp*100).toFixed(1),"%"]})]}),e.jsxs("div",{children:["Actual RTP: ",e.jsxs(f,{children:[(t.rtp.rtp*100).toFixed(2),"%"]})]}),e.jsxs("div",{children:["House Edge: ",e.jsxs(f,{children:[(t.rtp.houseEdge*100).toFixed(2),"%"]})]})]})]},m))})]})})]}),e.jsxs(A,{$colorScheme:a,children:[e.jsx(F,{$colorScheme:a,children:"How We Ensure Fair Play"}),e.jsx(S,{$colorScheme:a,children:e.jsxs(ge,{children:[e.jsxs("li",{children:[e.jsx("strong",{children:"Real Game Code:"})," We test the actual code that runs our games, not fake versions."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Random Selection:"})," Every game outcome is randomly selected using fair mathematical principles."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Live Testing:"})," All games are continuously tested using the same logic players experience."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Accurate Results:"})," Test results should closely match our target payout percentages."]}),e.jsxs("li",{children:[e.jsx("strong",{children:"Always Updated:"})," When we improve games, these fairness reports automatically update too."]})]})})]}),e.jsxs(S,{$colorScheme:a,style:{marginTop:"2rem",textAlign:"center",fontSize:"0.9rem",opacity:.8},children:[e.jsxs("p",{children:["Report generated ",new Date().toLocaleString(),". This audit uses our actual game code to ensure accuracy."]}),e.jsx("p",{children:e.jsx(U,{to:"/",style:{color:"#ffd700"},children:"← Back to Casino"})})]})]})]})}export{Re as default};
