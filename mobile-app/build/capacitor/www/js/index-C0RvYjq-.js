import{r as u,j as e}from"./three-DV31HySq.js";import{t as te,b2 as Oe,G,aN as ae,aO as ne,d as r,be as re,as as Ge,m as q,j as De,aL as Re,T as U,b4 as We,b5 as Ne,b6 as ze,P as Me,aJ as Be,bf as Ye,aM as Ue,aP as Q,aV as Je,aC as Ke}from"./index-BarUt2o_.js";import{P as se}from"./blockchain-C0nfa7Sw.js";import{P as Ee,g as Ve}from"./rtpConfigMultiplayer-CragVKAz.js";import{u as Qe}from"./useRateLimitedGame-A6A-g3e6.js";import{S as _e,a as $e,b as He,c as Le}from"./card-Bpd4J03d.js";import{G as Xe}from"./GameStatsHeader-DfbFCrGS.js";import"./react-vendor-faCf7XlP.js";import"./physics-audio-Bm3pLP40.js";const qe={BALANCED:{keepPairs:!0,keepHighCards:!0,drawToFlush:!0,drawToStraight:!1,riskLevel:"balanced"}},Ze=q`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  }
`,le=r.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  color: white;
  overflow-y: auto;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`,ea=r.div`
  text-align: center;
  padding: 10px 0;
`,aa=r.h1`
  color: #ffd700;
  font-size: 2.5rem;
  margin-bottom: 10px;
`,na=r.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 30px;
`,X=r.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    gap: 15px;
    padding: 15px;
  }
`,L=r.button.withConfig({shouldForwardProp:n=>!["variant"].includes(n)})`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 80px;
  max-width: 140px;
  
  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
    border-radius: 8px;
    flex: none;
    min-width: auto;
    max-width: none;
  }
  
  ${n=>n.variant==="primary"?re`
    background: linear-gradient(45deg, #ff6b6b, #ffd700);
    color: white;
    animation: ${Ze} 3s ease-in-out infinite;
    
    &:hover {
      transform: scale(1.05);
    }
  `:re`
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
`,oe=r.div`
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    margin-bottom: 30px;
  }
`,de=r.h2`
  color: #ffd700;
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
`,ce=r.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
  width: 100%;
  
  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
`,ue=r(Ge.div)`
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  @media (min-width: 768px) {
    padding: 20px;
    border-radius: 15px;
    
    &:hover {
      border-color: #ffd700;
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
  }
`,pe=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`,ge=r.h3`
  color: #ffd700;
  margin: 0;
  font-size: 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`,he=r.span.withConfig({shouldForwardProp:n=>!["available"].includes(n)})`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: bold;
  background: ${n=>n.available?"rgba(40, 167, 69, 0.3)":"rgba(220, 53, 69, 0.3)"};
  color: ${n=>n.available?"#28a745":"#dc3545"};
  border: 1px solid ${n=>n.available?"#28a745":"#dc3545"};
  
  @media (min-width: 768px) {
    padding: 4px 10px;
    font-size: 0.8rem;
    border-radius: 16px;
  }
`,me=r.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,N=r.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`,xe=r.button`
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  background: linear-gradient(45deg, #28a745, #20c997);
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: bold;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (min-width: 768px) {
    padding: 12px;
    margin-top: 15px;
    font-size: 0.9rem;
    border-radius: 8px;
    
    &:hover {
      transform: scale(1.02);
      background: linear-gradient(45deg, #218838, #17a2b8);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`,ra=r.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
`,ta=r.div`
  padding: 15px;
  width: 100%;
  height: 100%;
  color: white;
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.3) 0%, rgba(0, 0, 0, 0.7) 100%);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 2px 1fr;
    gap: 30px;
    padding: 25px;
  }
`,fe=r.div`
  text-align: left;
`,sa=r.div`
  background: linear-gradient(to bottom, transparent, rgba(255, 215, 0, 0.3), transparent);
  width: 100%;
  
  @media (max-width: 768px) {
    display: none;
  }
`,ke=r.h2`
  color: #ffd700;
  font-size: 1.3rem;
  margin-bottom: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (min-width: 768px) {
    font-size: 1.6rem;
    margin-bottom: 15px;
  }
`,ye=r.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 1.05rem;
    line-height: 1.6;
    margin-bottom: 20px;
  }
`,be=r.ul`
  list-style: none;
  padding: 0;
  color: rgba(255, 255, 255, 0.8);
  
  li {
    margin-bottom: 8px;
    padding: 5px 0;
    font-size: 0.85rem;
    border-bottom: 1px solid rgba(255, 215, 0, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    @media (min-width: 768px) {
      margin-bottom: 10px;
      padding: 6px 0;
      font-size: 0.9rem;
    }
  }
`,ia=[{id:"sp_001",wager:.01,name:"Penny Table"},{id:"sp_010",wager:.1,name:"Dime Table"},{id:"sp_050",wager:.5,name:"Half Dollar Table"},{id:"sp_100",wager:1,name:"Dollar Table"}];function la({onJoinSingleplayer:n,onJoinMultiplayer:f,onCreateSingleplayer:i,onCreateMultiplayer:k}){const c=te(),[l,s]=u.useState("info"),[m,T]=u.useState("singleplayer"),{games:R}=Oe({creator:new se("DP1uxUKbZPhFh1BTPfAHgBLsRc8gNPj3DhBNXQbdxuFM")}),E=R.filter(y=>y.players.length<Ee.MAX_PLAYERS&&y.state.waiting).slice(0,4),w=y=>`${y.toFixed(y<1?3:1)} SOL`,S=y=>w(y/c.baseWager),$=()=>e.jsxs(ta,{children:[e.jsxs(fe,{children:[e.jsx(ke,{children:"🤖 Singleplayer Mode"}),e.jsx(ye,{children:"Play against the house with AI opponents. Perfect for practice and learning roulette strategies."}),e.jsxs(be,{children:[e.jsx("li",{children:"🎯 Play against AI opponents with balanced difficulty"}),e.jsx("li",{children:"💰 Fixed wager tables from 0.01 to 1.0 SOL"}),e.jsx("li",{children:"⚡ Instant games - no waiting for other players"}),e.jsx("li",{children:"📈 Practice your betting strategies risk-free"}),e.jsx("li",{children:"⚙️ Configurable game settings and AI behavior"})]})]}),e.jsx(sa,{}),e.jsxs(fe,{children:[e.jsx(ke,{children:"👥 Multiplayer Mode"}),e.jsx(ye,{children:"Compete against real players in live roulette games. Winner takes the entire prize pool!"}),e.jsxs(be,{children:[e.jsx("li",{children:"🌍 Play against real players worldwide"}),e.jsx("li",{children:"🎮 Create custom tables with your own wager rules"}),e.jsx("li",{children:"🪑 Join existing games with available spots"}),e.jsx("li",{children:"🏆 Winner-takes-all prize pool system"}),e.jsx("li",{children:"💎 Live betting with real SOL stakes"})]})]})]}),D=()=>e.jsx(le,{children:e.jsxs(oe,{children:[e.jsx(de,{children:"🎲 Active Poker Tables"}),e.jsx(ce,{children:ia.map(y=>e.jsxs(ue,{whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsxs(pe,{children:[e.jsx(ge,{children:y.name}),e.jsx(he,{available:!0,children:"Available"})]}),e.jsxs(me,{children:[e.jsxs(N,{children:[e.jsx("span",{children:"Wager:"}),e.jsx("span",{children:w(y.wager)})]}),e.jsxs(N,{children:[e.jsx("span",{children:"Players:"}),e.jsx("span",{children:"1/1 (You vs House)"})]}),e.jsxs(N,{children:[e.jsx("span",{children:"Type:"}),e.jsx("span",{children:"AI Opponents"})]}),e.jsxs(N,{children:[e.jsx("span",{children:"Difficulty:"}),e.jsx("span",{children:"Balanced"})]})]}),e.jsx(xe,{onClick:n,children:"🎯 Join Table"})]},y.id))})]})}),H=()=>e.jsx(le,{children:e.jsxs(oe,{children:[e.jsx(de,{children:"👥 Multiplayer Tables (vs Real Players)"}),e.jsx(ce,{children:E.length>0?E.map(y=>e.jsxs(ue,{whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsxs(pe,{children:[e.jsxs(ge,{children:["Table #",y.gameId.slice(0,8),"..."]}),e.jsx(he,{available:!0,children:"Joining"})]}),e.jsxs(me,{children:[e.jsxs(N,{children:[e.jsx("span",{children:"Wager:"}),e.jsx("span",{children:S(y.wager||0)})]}),e.jsxs(N,{children:[e.jsx("span",{children:"Players:"}),e.jsxs("span",{children:[y.players.length,"/8"]})]}),e.jsxs(N,{children:[e.jsx("span",{children:"Type:"}),e.jsx("span",{children:"Real Players"})]}),e.jsxs(N,{children:[e.jsx("span",{children:"Creator:"}),e.jsxs("span",{children:[y.creator?.toBase58().slice(0,6),"..."]})]})]}),e.jsx(xe,{onClick:()=>f(y.gameId),children:"🚀 Join Game"})]},y.gameId)):e.jsxs(ra,{style:{gridColumn:"1 / -1"},children:[e.jsx("h3",{children:"No multiplayer games available"}),e.jsx("p",{children:"Be the first to create a multiplayer table!"})]})})]})});return e.jsxs(e.Fragment,{children:[e.jsx(G.Portal,{target:"stats",children:e.jsxs(ea,{children:[e.jsx(aa,{children:"� Poker Showdown Lobby"}),e.jsx(na,{children:l==="info"?"Choose your game mode and join a table":`Browse ${m==="singleplayer"?"Singleplayer":"Multiplayer"} Tables`})]})}),e.jsxs(G.Portal,{target:"screen",children:[l==="info"&&$(),l==="browsing"&&m==="singleplayer"&&D(),l==="browsing"&&m==="multiplayer"&&H()]}),e.jsxs(G.Portal,{target:"controls",children:[e.jsx(ae,{wager:0,setWager:()=>{},onPlay:()=>{},hideWager:!0,hideMessage:"Choose Your Table! 🎲",children:l==="info"?e.jsxs(X,{children:[e.jsx(L,{variant:"primary",onClick:()=>s("browsing"),children:"🎮 Join"}),e.jsx(L,{variant:"secondary",onClick:i,children:"🤖 + Create Singleplayer"}),e.jsx(L,{variant:"secondary",onClick:k,children:"👥 + Create Multiplayer"})]}):e.jsxs(X,{children:[e.jsx(L,{variant:"secondary",onClick:()=>s("info"),children:"← Go Back"}),e.jsx(L,{variant:m==="singleplayer"?"primary":"secondary",onClick:()=>T("singleplayer"),children:"🤖 SP Tables"}),e.jsx(L,{variant:m==="multiplayer"?"primary":"secondary",onClick:()=>T("multiplayer"),children:"👥 MP Tables"})]})}),e.jsx(ne,{children:l==="info"?e.jsxs(X,{children:[e.jsx(L,{variant:"primary",onClick:()=>s("browsing"),children:"🎮 Join"}),e.jsx(L,{variant:"secondary",onClick:i,children:"🤖 + Create Singleplayer"}),e.jsx(L,{variant:"secondary",onClick:k,children:"👥 + Create Multiplayer"})]}):e.jsxs(X,{children:[e.jsx(L,{variant:"secondary",onClick:()=>s("info"),children:"← Go Back"}),e.jsx(L,{variant:m==="singleplayer"?"primary":"secondary",onClick:()=>T("singleplayer"),children:"🤖 SP Tables"}),e.jsx(L,{variant:m==="multiplayer"?"primary":"secondary",onClick:()=>T("multiplayer"),children:"👥 MP Tables"})]})})]})]})}const J=Ee,M=1200,B=800,K=120,je=168,O=280,ve=[{angle:0,x:0,y:-O},{angle:60,x:O*.87,y:-O*.5},{angle:120,x:O*.87,y:O*.5},{angle:180,x:0,y:O},{angle:240,x:-O*.87,y:O*.5},{angle:300,x:-O*.87,y:-O*.5}],o={table:"#0d5a2d",felt:"#1a6b3a",gold:"#ffd700",cardBack:"#1a237e",background:"#0a0a0a",text:"#ffffff",accent:"#ff6b35"},oa=r.canvas`
  border: 3px solid ${o.gold};
  border-radius: 15px;
  background: ${o.table};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`,da=r.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: ${o.background};
`;function ca({gameResult:n,currentPhase:f,playerNames:i,onAnimationComplete:k}){const c=u.useRef(null),l=u.useRef(),[s,m]=u.useState(0);u.useEffect(()=>{if(!c.current)return;const a=c.current,g=a.getContext("2d");if(g)return a.width=M,a.height=B,T(g),(f==="dealing"||f==="drawing"||f==="showdown")&&y(),()=>{l.current&&cancelAnimationFrame(l.current)}},[n,f,s]);const T=a=>{a.fillStyle=o.table,a.fillRect(0,0,M,B),R(a),n?(n.players.forEach((g,x)=>{E(a,g,x,i[x]||`Player ${x+1}`)}),H(a,n.totalPot)):D(a)},R=a=>{const g=M/2,x=B/2,j=280;a.beginPath(),a.ellipse(g,x,j,j*.7,0,0,Math.PI*2),a.fillStyle=o.felt,a.fill(),a.strokeStyle=o.gold,a.lineWidth=8,a.stroke(),a.beginPath(),a.ellipse(g,x,j-20,j*.7-15,0,0,Math.PI*2),a.strokeStyle="rgba(255, 215, 0, 0.3)",a.lineWidth=2,a.stroke()},E=(a,g,x,j)=>{const p=M/2,I=B/2,h=ve[x];if(!h)return;const C=p+h.x,t=I+h.y;a.fillStyle=o.text,a.font="bold 16px Arial",a.textAlign="center",a.fillText(j,C,t-100),g.isWinner&&(a.fillStyle=o.gold,a.font="bold 20px Arial",a.fillText("🏆 WINNER! 🏆",C,t-120)),f==="results"||f==="showdown"?(w(a,g.finalHand,C-5*(K*.6+5)/2,t-40,!0),a.fillStyle=g.isWinner?o.gold:o.text,a.font="bold 14px Arial",a.fillText(g.handEval.name,C,t+60)):f==="dealing"&&w(a,g.initialHand,C-5*(K*.6+5)/2,t-40,!1),f==="drawing"&&$(a,g,C-5*(K*.6+5)/2,t-40)},w=(a,g,x,j,p)=>{const C=K*.6,t=je*.6;g.forEach((A,v)=>{const d=x+v*(C+5);S(a,A,d,j,C,t,p)})},S=(a,g,x,j,p,I,h)=>{if(a.fillStyle=h?"#ffffff":o.cardBack,a.strokeStyle=o.gold,a.lineWidth=2,a.beginPath(),a.roundRect(x,j,p,I,8),a.fill(),a.stroke(),h&&g){const C=["♠","♥","♦","♣"],t=["A","2","3","4","5","6","7","8","9","T","J","Q","K"],A=g.suit===1||g.suit===2?"#e53935":"#1a1a1a";a.fillStyle=A,a.font=`bold ${Math.floor(p*.12)}px Arial`,a.textAlign="left",a.fillText(t[g.rank]||"A",x+p*.08,j+I*.15),a.font=`${Math.floor(p*.25)}px Arial`,a.textAlign="center",a.fillText(C[g.suit]||"♠",x+p/2,j+I/2+p*.08),a.save(),a.translate(x+p*.92,j+I*.85),a.rotate(Math.PI),a.font=`bold ${Math.floor(p*.12)}px Arial`,a.textAlign="left",a.fillText(t[g.rank]||"A",0,0),a.restore()}else h||(a.fillStyle="rgba(255, 255, 255, 0.1)",a.font=`${Math.floor(p*.15)}px Arial`,a.textAlign="center",a.fillText("🂠",x+p/2,j+I/2+p*.05))},$=(a,g,x,j)=>{const h=K*.6,C=je*.6;g.discardIndices.forEach(t=>{const A=x+t*(h+5),v=j;a.fillStyle="rgba(255, 0, 0, 0.7)",a.fillRect(A,v,h,C),a.fillStyle="#ffffff",a.font="bold 16px Arial",a.textAlign="center",a.fillText("DISCARD",A+h/2,v+C/2)})},D=a=>{const g=M/2,x=B/2;ve.forEach((j,p)=>{const I=g+j.x,h=x+j.y;a.strokeStyle="rgba(255, 215, 0, 0.3)",a.setLineDash([5,5]),a.lineWidth=2,a.beginPath(),a.ellipse(I,h,60,40,0,0,Math.PI*2),a.stroke(),a.setLineDash([]),a.fillStyle="rgba(255, 255, 255, 0.5)",a.font="14px Arial",a.textAlign="center",a.fillText(`Seat ${p+1}`,I,h)})},H=(a,g)=>{const x=M/2,j=B/2;a.fillStyle="rgba(0, 0, 0, 0.7)",a.beginPath(),a.ellipse(x,j,80,40,0,0,Math.PI*2),a.fill(),a.strokeStyle=o.gold,a.lineWidth=3,a.stroke(),a.fillStyle=o.gold,a.font="bold 18px Arial",a.textAlign="center",a.fillText("POT",x,j-5),a.fillStyle=o.text,a.font="14px Arial";const p=(g/1e9).toFixed(3);a.fillText(`${p} SOL`,x,j+15)},y=()=>{l.current=requestAnimationFrame(()=>{m(a=>a+1),s>60&&k?.()})};return e.jsx(da,{children:e.jsx(oa,{ref:c})})}const ua=q`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`,we=r.div`
  background: ${o.background};
  width: 100%;
  height: 100%;
  color: ${o.text};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
`,pa=r.div`
  background: linear-gradient(135deg, ${o.table} 0%, ${o.felt} 100%);
  padding: 20px;
  border-bottom: 3px solid ${o.gold};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
`,ga=r.h1`
  color: ${o.gold};
  margin: 0;
  font-size: 24px;
  font-weight: bold;
`,ha=r.div`
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`,ee=r.div`
  background: rgba(0, 0, 0, 0.3);
  padding: 8px 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  font-size: 14px;
  
  span {
    color: ${o.gold};
    font-weight: bold;
  }
`,ma=r.div`
  background: ${n=>{switch(n.$phase){case"waiting":return"rgba(255, 193, 7, 0.2)";case"strategy":return"rgba(33, 150, 243, 0.2)";case"playing":return"rgba(76, 175, 80, 0.2)";case"results":return"rgba(156, 39, 176, 0.2)";default:return"rgba(158, 158, 158, 0.2)"}}};
  border: 2px solid ${n=>{switch(n.$phase){case"waiting":return"#ffc107";case"strategy":return"#2196f3";case"playing":return"#4caf50";case"results":return"#9c27b0";default:return"#9e9e9e"}}};
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: bold;
  animation: ${ua} 2s infinite;
`,xa=r.div`
  background: rgba(0, 0, 0, 0.4);
  border-radius: 15px;
  padding: 20px;
  margin: 20px;
  border: 2px solid rgba(255, 215, 0, 0.2);
`,fa=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
`,ka=r.div`
  background: ${n=>n.$isYou?"rgba(255, 215, 0, 0.1)":"rgba(0, 0, 0, 0.3)"};
  border: 2px solid ${n=>n.$isYou?o.gold:n.$ready?"#4caf50":"rgba(255, 255, 255, 0.2)"};
  border-radius: 10px;
  padding: 15px;
  
  .player-name {
    font-weight: bold;
    color: ${n=>n.$isYou?o.gold:o.text};
    margin-bottom: 5px;
  }
  
  .player-status {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .player-wager {
    font-size: 14px;
    color: ${o.accent};
    margin-top: 5px;
  }
`,ya=r.div`
  background: rgba(0, 0, 0, 0.4);
  padding: 20px;
  margin: 20px;
  border-radius: 15px;
  border: 2px solid rgba(255, 215, 0, 0.2);
  text-align: center;
`,V=r.button`
  padding: 12px 25px;
  margin: 0 10px;
  border: 2px solid ${n=>n.$primary?o.accent:o.gold};
  background: ${n=>n.$primary?o.accent:"transparent"};
  color: ${o.text};
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${n=>n.$primary?o.accent:o.gold};
    color: ${n=>n.$primary?o.text:o.background};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`,ba=r.div`
  background: linear-gradient(135deg, rgba(26, 107, 58, 0.8) 0%, rgba(13, 90, 45, 0.9) 100%);
  border: 3px solid ${o.gold};
  border-radius: 20px;
  padding: 30px;
  margin: 20px;
  text-align: center;
  
  .winner-announcement {
    font-size: 32px;
    color: ${o.gold};
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .winning-hand {
    font-size: 24px;
    margin-bottom: 15px;
  }
  
  .payout-info {
    font-size: 18px;
    color: ${o.accent};
    margin-bottom: 20px;
  }
`;function ja({gamePubkey:n,selectedStrategy:f,onBack:i}){const{publicKey:k}=De(),c=te(),l=u.useRef(null),{game:s}=Qe(n,{fetchMetadata:!0,updateInterval:1e3,criticalUpdatePhases:["settled","waiting"]}),[m,T]=u.useState("waiting"),[R,E]=u.useState([]),[w,S]=u.useState(null),[$,D]=u.useState(!1),[H,y]=u.useState(0),[a,g]=u.useState(!1),[x,j]=u.useState(!1),p=Re({win:Le,lose:He,play:$e,card:_e});u.useEffect(()=>{if(!s){console.log("🎯 Waiting for multiplayer game data...");return}console.log("🎯 Processing real multiplayer game state:",{settled:s.state?.settled,started:s.state?.started,waiting:s.state?.waiting,playersCount:s.players?.length});const d=s.players||[];E(d),s.state?.settled?(T("results"),console.log("🏆 Game settled - showing results")):s.state?.started?(T("playing"),console.log("🎮 Game started - in progress")):d.length>=J.MIN_PLAYERS?(T("strategy"),y(30),console.log("⚡ Strategy phase - players ready")):(T("waiting"),console.log("⏳ Waiting for more players"))},[s]),u.useEffect(()=>{if(H>0&&m==="strategy"){const d=setTimeout(()=>{y(b=>b-1)},1e3);return()=>clearTimeout(d)}else H===0&&m==="strategy"&&$&&console.log("⏰ Strategy time expired - waiting for shared pot settlement")},[H,m,$]);const I=k&&R.some(d=>d.user?.equals?.(k)||d.user?.toString()===k.toString()),h=k&&!I&&R.length<J.MAX_PLAYERS&&m==="waiting";R.length>=J.MIN_PLAYERS&&R.every(d=>d.ready||d.status==="ready");const C=u.useCallback(async()=>{if(h)try{console.log("🎯 Joining Poker Showdown game..."),p.play("play")}catch(d){console.error("❌ Failed to join game:",d)}},[h,p]),t=u.useCallback(async()=>{if(I)try{D(!$),p.play("card")}catch(d){console.error("❌ Failed to toggle ready state:",d)}},[I,$,p]);u.useEffect(()=>{if(!s?.state.settled||w||!k)return;console.log("🎯 Processing REAL shared pot Poker Showdown results...");const d=Number(s.winnerIndexes[0]),b=s.players.map(z=>z.user),P=b.findIndex(z=>z.toString()===k.toString());console.log("🎲 Shared pot winner analysis:",{winnerIndex:d,userPlayerIndex:P,totalPlayers:b.length,userWins:d===P});const W=d===P,_=Date.now(),Z=s.players.map(z=>Number(z.pendingPayout??z.pending_payout??0));console.log("🎲 Creating deterministic multiplayer outcome for shared pot:",W?"WIN":"LOSE","Winner index:",d);const ie=va(W,[f,{keepPairs:!0,keepHighCards:!0,drawToFlush:!0,drawToStraight:!1,riskLevel:"balanced"}],s.wager,_,k,f);ie.players[0].payout=Z[P]||0,S(ie),T("results"),W?(p.play("win"),l.current&&(l.current.winFlash("#ffd700",3),setTimeout(()=>{l.current?.particleBurst(void 0,void 0,"#ffd700",50)},500))):(p.play("lose"),l.current&&l.current.loseFlash("#f44336",2))},[s,w,k,f,p,l]);const A=d=>d.toBase58().slice(0,8)+"...",v=d=>{switch(d){case"waiting":return"Waiting for Players";case"strategy":return`Strategy Selection (${H}s)`;case"playing":return"Game in Progress";case"results":return"Game Complete";default:return"Unknown Phase"}};return s?e.jsx(e.Fragment,{children:e.jsx(G.Portal,{target:"screen",children:e.jsxs(we,{children:[e.jsxs(pa,{children:[e.jsxs("div",{children:[e.jsx(ga,{children:"🃏 Poker Showdown"}),e.jsxs("div",{style:{fontSize:"14px",color:"rgba(255,255,255,0.7)"},children:["Game ID: ",n.toBase58().slice(0,8),"..."]})]}),e.jsxs(ha,{children:[e.jsx(ma,{$phase:m,children:v(m)}),e.jsxs(ee,{children:["Players: ",e.jsxs("span",{children:[R.length,"/",J.MAX_PLAYERS]})]}),e.jsxs(ee,{children:["Entry: ",e.jsx("span",{children:e.jsx(U,{exact:!0,amount:1e6,mint:c?.mint})})]}),e.jsxs(ee,{children:["Total Pot: ",e.jsx("span",{children:e.jsx(U,{exact:!0,amount:1e6*R.length,mint:c?.mint})})]})]}),e.jsx(V,{onClick:i,children:"Back to Lobby"})]}),e.jsxs(xa,{children:[e.jsx("h3",{style:{margin:"0 0 15px 0",color:o.gold},children:"Players"}),e.jsx(fa,{children:Array.from({length:J.MAX_PLAYERS},(d,b)=>{const P=R[b],W=P?.user&&k&&(P.user.equals?.(k)||P.user.toString()===k.toString());return e.jsxs(ka,{$isYou:W,$ready:P?.status==="ready",children:[e.jsx("div",{className:"player-name",children:P?e.jsxs(e.Fragment,{children:[A(P.user),W&&" (You)"]}):`Seat ${b+1}`}),e.jsx("div",{className:"player-status",children:P?P.ready||P.status==="ready"?"✅ Ready":"⏳ Selecting Strategy":"👤 Empty Seat"}),P&&e.jsx("div",{className:"player-wager",children:e.jsx(U,{exact:!0,amount:P.wager||1e6,mint:c?.mint})})]},b)})})]}),e.jsxs(ya,{children:[!I&&h&&m==="waiting"&&e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Join this Poker Showdown game!"}),e.jsx(We.JoinGame,{pubkey:n,account:s,creatorAddress:Me,creatorFeeBps:ze,referralFee:Ne,enableMetadata:!0,onTx:()=>{p.play("play"),C()}})]}),I&&m==="waiting"&&e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Game will start when all players are ready."}),e.jsx(V,{$primary:!0,onClick:t,children:$?"✅ Ready":"⏳ Mark Ready"})]}),I&&m==="strategy"&&e.jsxs(e.Fragment,{children:[e.jsxs("p",{children:["Strategy Selection Phase - ",H," seconds remaining"]}),e.jsxs("div",{style:{marginTop:"10px",fontSize:"16px"},children:["Your Strategy: ",e.jsx("strong",{children:f.riskLevel.toUpperCase()})]}),e.jsx(V,{onClick:t,disabled:$,children:$?"✅ Strategy Confirmed":"Confirm Strategy"})]}),m==="playing"&&e.jsx("p",{children:"Game in progress... Cards are being dealt and strategies applied!"}),m==="results"&&w&&e.jsxs(ba,{children:[e.jsxs("div",{className:"winner-announcement",children:["🏆 ",A(new se(w.players[w.winnerIndex].playerId))," Wins!"]}),e.jsx("div",{className:"winning-hand",children:w.players[w.winnerIndex].handEval.name}),e.jsxs("div",{className:"payout-info",children:["Prize: ",e.jsx(U,{exact:!0,amount:w.players[w.winnerIndex].payout,mint:c?.mint})]}),e.jsx(V,{$primary:!0,onClick:i,children:"Return to Lobby"})]})]}),w&&m==="results"&&e.jsx(ca,{gameResult:w,currentPhase:"results",playerNames:R.map(d=>A(d.user)),onAnimationComplete:()=>console.log("Animation complete")})]})})}):e.jsx(G.Portal,{target:"screen",children:e.jsx(we,{children:e.jsxs("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",flexDirection:"column",gap:"20px"},children:[e.jsx("div",{style:{fontSize:"24px"},children:"🔄 Loading Multiplayer Game..."}),e.jsxs("div",{style:{color:"rgba(255,255,255,0.7)"},children:["Game ID: ",n.toBase58().slice(0,8),"..."]}),e.jsx(V,{onClick:i,children:"Back to Lobby"})]})})})}function va(n,f,i,k,c,l){const s=k%6;if(n)switch(s){case 0:return F([{rank:0,suit:0},{rank:0,suit:1},{rank:0,suit:2},{rank:12,suit:0},{rank:12,suit:1}],[{rank:11,suit:0},{rank:11,suit:1},{rank:11,suit:2},{rank:10,suit:0},{rank:9,suit:0}],{rank:"FULL_HOUSE",name:"As full of Ks",value:6e3},{rank:"THREE_OF_A_KIND",name:"Three Qs",value:3e3},0,i,c,l);case 1:return F([{rank:0,suit:0},{rank:12,suit:1},{rank:11,suit:2},{rank:10,suit:3},{rank:9,suit:0}],[{rank:12,suit:0},{rank:12,suit:2},{rank:11,suit:0},{rank:11,suit:3},{rank:8,suit:1}],{rank:"STRAIGHT",name:"A high straight",value:4e3},{rank:"TWO_PAIR",name:"Ks and Qs",value:2e3},0,i,c,l);case 2:return F([{rank:10,suit:0},{rank:10,suit:1},{rank:10,suit:2},{rank:10,suit:3},{rank:0,suit:0}],[{rank:9,suit:0},{rank:9,suit:1},{rank:9,suit:2},{rank:8,suit:0},{rank:8,suit:1}],{rank:"FOUR_OF_A_KIND",name:"Four Js",value:7e3},{rank:"FULL_HOUSE",name:"10s full of 9s",value:6e3},0,i,c,l);case 3:return F([{rank:1,suit:0},{rank:1,suit:1},{rank:1,suit:2},{rank:0,suit:0},{rank:12,suit:1}],[{rank:11,suit:0},{rank:11,suit:1},{rank:10,suit:2},{rank:9,suit:3},{rank:8,suit:0}],{rank:"THREE_OF_A_KIND",name:"Three 2s",value:3e3},{rank:"PAIR",name:"Pair of Qs",value:1e3},0,i,c,l);case 4:return F([{rank:0,suit:0},{rank:11,suit:0},{rank:9,suit:0},{rank:7,suit:0},{rank:5,suit:0}],[{rank:8,suit:0},{rank:7,suit:1},{rank:6,suit:2},{rank:5,suit:3},{rank:4,suit:0}],{rank:"FLUSH",name:"A high flush",value:5e3},{rank:"STRAIGHT",name:"9 high straight",value:4e3},0,i,c,l);default:return F([{rank:0,suit:0},{rank:0,suit:1},{rank:12,suit:0},{rank:12,suit:2},{rank:11,suit:0}],[{rank:10,suit:0},{rank:10,suit:1},{rank:9,suit:2},{rank:8,suit:3},{rank:7,suit:0}],{rank:"TWO_PAIR",name:"As and Ks",value:2e3},{rank:"PAIR",name:"Pair of Js",value:1e3},0,i,c,l)}else switch(s){case 0:return F([{rank:0,suit:0},{rank:11,suit:0},{rank:9,suit:0},{rank:7,suit:0},{rank:5,suit:0}],[{rank:12,suit:0},{rank:12,suit:1},{rank:12,suit:2},{rank:11,suit:0},{rank:11,suit:1}],{rank:"FLUSH",name:"A high flush",value:5e3},{rank:"FULL_HOUSE",name:"Ks full of Qs",value:6e3},1,i,c,l);case 1:return F([{rank:0,suit:0},{rank:0,suit:1},{rank:12,suit:0},{rank:12,suit:2},{rank:11,suit:0}],[{rank:8,suit:0},{rank:7,suit:1},{rank:6,suit:2},{rank:5,suit:3},{rank:4,suit:0}],{rank:"TWO_PAIR",name:"As and Ks",value:2e3},{rank:"STRAIGHT",name:"9 high straight",value:4e3},1,i,c,l);case 2:return F([{rank:10,suit:0},{rank:10,suit:1},{rank:10,suit:2},{rank:0,suit:0},{rank:12,suit:1}],[{rank:9,suit:0},{rank:9,suit:1},{rank:9,suit:2},{rank:9,suit:3},{rank:8,suit:0}],{rank:"THREE_OF_A_KIND",name:"Three Js",value:3e3},{rank:"FOUR_OF_A_KIND",name:"Four 10s",value:7e3},1,i,c,l);case 3:return F([{rank:11,suit:0},{rank:11,suit:1},{rank:10,suit:2},{rank:9,suit:3},{rank:8,suit:0}],[{rank:0,suit:0},{rank:0,suit:1},{rank:0,suit:2},{rank:12,suit:0},{rank:11,suit:3}],{rank:"PAIR",name:"Pair of Qs",value:1e3},{rank:"THREE_OF_A_KIND",name:"Three As",value:3e3},1,i,c,l);case 4:return F([{rank:12,suit:0},{rank:11,suit:1},{rank:10,suit:2},{rank:9,suit:3},{rank:7,suit:0}],[{rank:0,suit:0},{rank:0,suit:1},{rank:10,suit:0},{rank:9,suit:0},{rank:8,suit:2}],{rank:"HIGH_CARD",name:"K high",value:130},{rank:"PAIR",name:"Pair of As",value:1e3},1,i,c,l);default:return F([{rank:12,suit:0},{rank:12,suit:1},{rank:11,suit:0},{rank:11,suit:2},{rank:10,suit:0}],[{rank:8,suit:0},{rank:8,suit:1},{rank:8,suit:2},{rank:7,suit:0},{rank:7,suit:1}],{rank:"TWO_PAIR",name:"Ks and Qs",value:2e3},{rank:"FULL_HOUSE",name:"9s full of 8s",value:6e3},1,i,c,l)}}function F(n,f,i,k,c,l,s,m){return{gameId:"deterministic-multiplayer",players:[{playerId:s?.toBase58()||"player",playerIndex:0,initialHand:n,finalHand:n,handEval:i,isWinner:c===0,payout:0,discardIndices:[],strategy:m},{playerId:"opponent",playerIndex:1,initialHand:f,finalHand:f,handEval:k,isWinner:c===1,payout:0,discardIndices:[],strategy:{keepPairs:!0,keepHighCards:!0,drawToFlush:!0,drawToStraight:!1,riskLevel:"balanced"}}],winnerIndex:c,totalPot:l,seed:`deterministic-multiplayer-${c===0?"win":"loss"}`}}const wa=q`
  0%, 100% { box-shadow: 0 0 5px rgba(255, 215, 0, 0.3); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.4); }
`,Fe=q`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`,Sa=r.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 50%, #0f1419 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,Aa=r.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  position: relative;
  min-height: 0; // Important for flex child
`,Pa=r.div`
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1.2;
  background: radial-gradient(ellipse at center, #1a5d1a 0%, #0d2818 70%);
  border: 3px solid #ffd700;
  border-radius: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 0 20px rgba(255, 215, 0, 0.3),
    inset 0 0 30px rgba(0, 0, 0, 0.5);
  
  @media (min-width: 768px) {
    max-width: 500px;
  }
`,Se=r.div`
  display: flex;
  gap: 8px;
  margin: 15px 0;
  
  @media (min-width: 768px) {
    gap: 12px;
  }
`,Ae=r.div`
  width: 45px;
  height: 63px;
  background: ${n=>n.$revealed?"#fff":"url('/png/images/card.png')"};
  background-size: cover;
  background-position: center;
  border-radius: 6px;
  border: 2px solid ${n=>n.$isWinning?"#ffd700":"#333"};
  position: relative;
  transform-style: preserve-3d;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${Fe} 0.5s ease-out;
  
  ${n=>n.$isWinning&&re`
    animation: ${wa} 2s infinite;
  `}
  
  ${n=>n.$revealed&&`
    transform: rotateY(180deg);
  `}
  
  @media (min-width: 768px) {
    width: 60px;
    height: 84px;
  }
  
    &::before {
    content: ${n=>n.$revealed?`'${n.children}'`:"''"};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotateY(180deg);
    font-size: 12px;
    font-weight: bold;
    color: ${n=>n.$revealed?"#000":"transparent"};
    
    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
`,Pe=r.div`
  color: #ffd700;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 16px;
  }
`,Te=r.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
`,Ie=r.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
`,Ce=r.div`
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #ffd700;
  border-radius: 15px;
  padding: 15px;
  margin: 10px;
  text-align: center;
  color: white;
  animation: ${Fe} 0.5s ease-out;
`,Ta=r.div`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 15px;
`,Ia=r.button`
  background: ${n=>n.$active?"#ffd700":"transparent"};
  color: ${n=>n.$active?"#000":"#ffd700"};
  border: 1px solid #ffd700;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 4px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #ffd700;
    color: #000;
  }
  
  @media (min-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`,Y={CONSERVATIVE:{keepPairs:!0,keepHighCards:!0,drawToFlush:!1,drawToStraight:!1,riskLevel:"conservative",description:"Play it safe - keep pairs and high cards"},BALANCED:{keepPairs:!0,keepHighCards:!0,drawToFlush:!0,drawToStraight:!1,riskLevel:"balanced",description:"Balanced approach - moderate risk/reward"},AGGRESSIVE:{keepPairs:!1,keepHighCards:!1,drawToFlush:!0,drawToStraight:!0,riskLevel:"aggressive",description:"High risk, high reward - chase big hands"}};function Ca({onBack:n}){const f=G.useGame(),[i,k]=Be(),c=te(),l=u.useRef(null),[s,m]=u.useState(null),[T,R]=u.useState(!1),[E,w]=u.useState("setup"),[S,$]=u.useState("BALANCED"),[D,H]=u.useState(!1),y=Ye("poker-showdown-singleplayer"),a=Re({win:Le,lose:He,play:$e,card:_e}),g=u.useCallback(async()=>{if(!(i<=0||T)){R(!0),w("playing"),H(!1),a.play("play");try{const t=Y[S],A=Y.BALANCED,v=[t,A],d=Ve(t.riskLevel);await f.play({bet:d,wager:i,metadata:[t.keepPairs?1:0,t.keepHighCards?1:0,t.drawToFlush?1:0,t.drawToStraight?1:0,t.riskLevel==="aggressive"?2:t.riskLevel==="balanced"?1:0]});const b=await f.result(),P=b.payout>0;console.log("🎲 Creating deterministic outcome that matches Gamba decision:",P?"WIN":"LOSE");const W=Date.now(),_=I(P,v,i,W);console.log("🎯 Deterministic result created:",{gambaWins:P,playerWins:_.winnerIndex===0,playerHand:_.players[0].handEval.name,aiHand:_.players[1].handEval.name,playerValue:_.players[0].handEval.value,aiValue:_.players[1].handEval.value}),_.players[0].payout=b.payout,_.players[0].payout=b.payout,console.log("🎯 Game Result:",{winner:_.winnerIndex===0?"Player":"AI",playerHand:_.players[0].handEval.name,aiHand:_.players[1].handEval.name,payout:_.players[0].payout}),m(_),setTimeout(()=>{H(!0),a.play("card")},1e3),setTimeout(()=>{w("results");const Z=b.payout>0;y.updateStats(b.payout),Z?(a.play("win"),l.current&&(l.current.winFlash("#ffd700",3),setTimeout(()=>{l.current?.particleBurst(void 0,void 0,"#ffd700",30)},500))):(a.play("lose"),l.current&&l.current.loseFlash("#f44336",2))},2500)}catch(t){console.error("❌ Singleplayer game failed:",t),w("setup")}finally{R(!1)}}},[i,T,S,a,f,y]),x=u.useCallback(()=>{m(null),w("setup"),H(!1)},[]),j=t=>{const A=["♠","♥","♦","♣"];return`${["A","2","3","4","5","6","7","8","9","10","J","Q","K"][t.rank]}${A[t.suit]}`},p=t=>{switch(t){case"AGGRESSIVE":return"4.0x";case"BALANCED":return"2.5x";case"CONSERVATIVE":return"2.2x";default:return"2.5x"}},I=(t,A,v,d)=>{const b=d%6;if(t)switch(b){case 0:return h([{rank:0,suit:0},{rank:0,suit:1},{rank:0,suit:2},{rank:12,suit:0},{rank:12,suit:1}],[{rank:11,suit:0},{rank:11,suit:1},{rank:11,suit:2},{rank:10,suit:0},{rank:9,suit:0}],{rank:"FULL_HOUSE",name:"As full of Ks",value:6e3},{rank:"THREE_OF_A_KIND",name:"Three Qs",value:3e3},0,v);case 1:return h([{rank:0,suit:0},{rank:12,suit:1},{rank:11,suit:2},{rank:10,suit:3},{rank:9,suit:0}],[{rank:12,suit:0},{rank:12,suit:2},{rank:11,suit:0},{rank:11,suit:3},{rank:8,suit:1}],{rank:"STRAIGHT",name:"A high straight",value:4e3},{rank:"TWO_PAIR",name:"Ks and Qs",value:2e3},0,v);case 2:return h([{rank:10,suit:0},{rank:10,suit:1},{rank:10,suit:2},{rank:10,suit:3},{rank:0,suit:0}],[{rank:9,suit:0},{rank:9,suit:1},{rank:9,suit:2},{rank:8,suit:0},{rank:8,suit:1}],{rank:"FOUR_OF_A_KIND",name:"Four Js",value:7e3},{rank:"FULL_HOUSE",name:"10s full of 9s",value:6e3},0,v);case 3:return h([{rank:1,suit:0},{rank:1,suit:1},{rank:1,suit:2},{rank:0,suit:0},{rank:12,suit:1}],[{rank:11,suit:0},{rank:11,suit:1},{rank:10,suit:2},{rank:9,suit:3},{rank:8,suit:0}],{rank:"THREE_OF_A_KIND",name:"Three 2s",value:3e3},{rank:"PAIR",name:"Pair of Qs",value:1e3},0,v);case 4:return h([{rank:0,suit:0},{rank:11,suit:0},{rank:9,suit:0},{rank:7,suit:0},{rank:5,suit:0}],[{rank:8,suit:0},{rank:7,suit:1},{rank:6,suit:2},{rank:5,suit:3},{rank:4,suit:0}],{rank:"FLUSH",name:"A high flush",value:5e3},{rank:"STRAIGHT",name:"9 high straight",value:4e3},0,v);default:return h([{rank:0,suit:0},{rank:0,suit:1},{rank:12,suit:0},{rank:12,suit:2},{rank:11,suit:0}],[{rank:10,suit:0},{rank:10,suit:1},{rank:9,suit:2},{rank:8,suit:3},{rank:7,suit:0}],{rank:"TWO_PAIR",name:"As and Ks",value:2e3},{rank:"PAIR",name:"Pair of Js",value:1e3},0,v)}else switch(b){case 0:return h([{rank:0,suit:0},{rank:11,suit:0},{rank:9,suit:0},{rank:7,suit:0},{rank:5,suit:0}],[{rank:12,suit:0},{rank:12,suit:1},{rank:12,suit:2},{rank:11,suit:0},{rank:11,suit:1}],{rank:"FLUSH",name:"A high flush",value:5e3},{rank:"FULL_HOUSE",name:"Ks full of Qs",value:6e3},1,v);case 1:return h([{rank:0,suit:0},{rank:0,suit:1},{rank:12,suit:0},{rank:12,suit:2},{rank:11,suit:0}],[{rank:8,suit:0},{rank:7,suit:1},{rank:6,suit:2},{rank:5,suit:3},{rank:4,suit:0}],{rank:"TWO_PAIR",name:"As and Ks",value:2e3},{rank:"STRAIGHT",name:"9 high straight",value:4e3},1,v);case 2:return h([{rank:10,suit:0},{rank:10,suit:1},{rank:10,suit:2},{rank:0,suit:0},{rank:12,suit:1}],[{rank:9,suit:0},{rank:9,suit:1},{rank:9,suit:2},{rank:9,suit:3},{rank:8,suit:0}],{rank:"THREE_OF_A_KIND",name:"Three Js",value:3e3},{rank:"FOUR_OF_A_KIND",name:"Four 10s",value:7e3},1,v);case 3:return h([{rank:11,suit:0},{rank:11,suit:1},{rank:10,suit:2},{rank:9,suit:3},{rank:8,suit:0}],[{rank:0,suit:0},{rank:0,suit:1},{rank:0,suit:2},{rank:12,suit:0},{rank:11,suit:3}],{rank:"PAIR",name:"Pair of Qs",value:1e3},{rank:"THREE_OF_A_KIND",name:"Three As",value:3e3},1,v);case 4:return h([{rank:12,suit:0},{rank:11,suit:1},{rank:10,suit:2},{rank:9,suit:3},{rank:7,suit:0}],[{rank:0,suit:0},{rank:0,suit:1},{rank:10,suit:0},{rank:9,suit:0},{rank:8,suit:2}],{rank:"HIGH_CARD",name:"K high",value:130},{rank:"PAIR",name:"Pair of As",value:1e3},1,v);default:return h([{rank:12,suit:0},{rank:12,suit:1},{rank:11,suit:0},{rank:11,suit:2},{rank:10,suit:0}],[{rank:8,suit:0},{rank:8,suit:1},{rank:8,suit:2},{rank:7,suit:0},{rank:7,suit:1}],{rank:"TWO_PAIR",name:"Ks and Qs",value:2e3},{rank:"FULL_HOUSE",name:"9s full of 8s",value:6e3},1,v)}},h=(t,A,v,d,b,P)=>({gameId:"deterministic",players:[{playerId:"human",playerIndex:0,initialHand:t,finalHand:t,handEval:v,isWinner:b===0,payout:0,discardIndices:[],strategy:Y[S]},{playerId:"ai",playerIndex:1,initialHand:A,finalHand:A,handEval:d,isWinner:b===1,payout:0,discardIndices:[],strategy:Y.BALANCED}],winnerIndex:b,totalPot:P,seed:`deterministic-${b===0?"win":"loss"}`}),C=(t,A,v=!1)=>!t||t.length===0?e.jsxs("div",{children:[e.jsx(Pe,{children:A}),e.jsx(Se,{children:Array.from({length:5},(d,b)=>e.jsx(Ae,{children:"?"},b))})]}):e.jsxs("div",{children:[e.jsx(Pe,{children:A}),e.jsx(Se,{children:t.map((d,b)=>e.jsx(Ae,{$revealed:D,$isWinning:v,children:D?j(d):"?"},b))})]});return e.jsxs(e.Fragment,{children:[e.jsx(G.Portal,{target:"stats",children:e.jsx(Xe,{gameName:"Poker Showdown",gameMode:`SP vs AI (${S} - ${p(S)})`,rtp:"94",stats:y.stats})}),e.jsx(G.Portal,{target:"screen",children:e.jsx(Ue,{effectsRef:l,children:e.jsx(Sa,{children:e.jsxs(Aa,{children:[e.jsx(Pa,{children:s?e.jsxs(e.Fragment,{children:[e.jsx(Te,{children:C(s.players[1]?.finalHand||[],"AI Opponent",s.winnerIndex===1)}),e.jsx(Ie,{children:C(s.players[0]?.finalHand||[],"Your Hand",s.winnerIndex===0)})]}):e.jsxs(e.Fragment,{children:[e.jsx(Te,{children:C([],"AI Opponent")}),e.jsx(Ie,{children:C([],"Your Hand")})]})}),E==="setup"&&e.jsxs(Ta,{children:[e.jsx("div",{style:{marginBottom:"10px",color:"#ffd700",fontSize:"14px",fontWeight:"bold"},children:"Choose Your Strategy"}),e.jsx("div",{children:Object.entries(Y).map(([t,A])=>e.jsxs(Ia,{$active:S===t,onClick:()=>$(t),children:[t," (",p(t),")"]},t))}),e.jsx("div",{style:{fontSize:"12px",color:"rgba(255, 255, 255, 0.7)",marginTop:"8px"},children:Y[S].description}),e.jsxs("div",{style:{fontSize:"11px",color:"#ffd700",marginTop:"4px",fontWeight:"bold"},children:["💰 Win Payout: ",p(S),S==="AGGRESSIVE"&&" (High Risk, High Reward)",S==="BALANCED"&&" (Standard Risk & Reward)",S==="CONSERVATIVE"&&" (Lower Risk, Better Odds)"]})]}),E==="playing"&&e.jsxs(Ce,{children:[e.jsx("div",{children:"🎯 Cards being dealt..."}),e.jsxs("div",{style:{fontSize:"12px",marginTop:"5px"},children:["Strategy: ",S," (Win Payout: ",p(S),")"]})]}),E==="results"&&s&&e.jsxs(Ce,{children:[e.jsx("div",{style:{fontSize:"18px",fontWeight:"bold",marginBottom:"10px"},children:s.players[0].payout>0?"🏆 You Win!":"💔 You Lose!"}),e.jsxs("div",{style:{marginBottom:"8px"},children:["Your Hand: ",s.players[0].handEval.name]}),e.jsxs("div",{style:{marginBottom:"8px"},children:["AI Hand: ",s.players[1].handEval.name]}),e.jsx("div",{style:{color:"#ffd700",fontWeight:"bold"},children:s.players[0].payout>0?e.jsxs(e.Fragment,{children:["Won: ",e.jsx(U,{exact:!0,amount:s.players[0].payout,mint:c?.mint})]}):e.jsxs(e.Fragment,{children:["Lost: ",e.jsx(U,{exact:!0,amount:i,mint:c?.mint})]})})]})]})})})}),e.jsx(G.Portal,{target:"controls",children:E==="setup"?e.jsxs(e.Fragment,{children:[e.jsx(ae,{wager:i,setWager:k,onPlay:g,playDisabled:T||i<=0,playText:"Deal Cards"}),e.jsx(ne,{children:e.jsxs("div",{style:{display:"flex",gap:"15px",alignItems:"center"},children:[e.jsx(Q,{onClick:n,children:"Back to Lobby"}),e.jsx(Je,{value:i,onChange:k,disabled:T}),e.jsx(Q,{onClick:g,disabled:T||i<=0,variant:"primary",children:T?"Dealing...":"Deal Cards"})]})})]}):E==="results"?e.jsxs(e.Fragment,{children:[e.jsx(ae,{wager:i,setWager:k,onPlay:x,playDisabled:!1,playText:"Deal Again"}),e.jsx(ne,{children:e.jsxs("div",{style:{display:"flex",gap:"15px",alignItems:"center",justifyContent:"center"},children:[e.jsx(Q,{onClick:n,children:"Back to Lobby"}),e.jsx(Q,{onClick:x,variant:"primary",children:"Deal Again"})]})})]}):e.jsx("div",{style:{padding:"20px",textAlign:"center",color:"#fff"},children:e.jsx("p",{children:"Game in progress..."})})})]})}function Na(){const n=Ke({gameName:"Poker Showdown",description:"Strategy meets destiny in this multiplayer arena where minds clash before cards are ever dealt. Choose your approach—conservative safety, balanced wisdom, or aggressive ambition—then watch as fate unfolds your predetermined path. This is not mere chance, but calculated risk made manifest, where every decision echoes through the digital felt. Five cards become your weapon, strategy your shield, and the pot your prize. Here, victory belongs not to the lucky, but to those who understand that in poker, as in life, the choices made before the battle often determine its outcome.",rtp:94,maxWin:"600x"}),[f,i]=u.useState("lobby"),[k,c]=u.useState(null),[l,s]=u.useState(!1),m=u.useCallback(()=>{i("lobby"),c(null),s(!1)},[]),T=u.useCallback(()=>{i("singleplayer")},[]),R=u.useCallback(S=>{c(new se(S)),i("multiplayer")},[]),E=u.useCallback(()=>{i("singleplayer")},[]),w=u.useCallback(()=>{s(!0)},[]);return u.useCallback(S=>{c(S),i("multiplayer"),s(!1)},[]),console.log("🃏 POKER SHOWDOWN COMPONENT LOADING..."),e.jsxs(e.Fragment,{children:[n,f==="lobby"&&e.jsx(la,{onJoinSingleplayer:T,onJoinMultiplayer:R,onCreateSingleplayer:E,onCreateMultiplayer:w}),f==="singleplayer"&&e.jsx(Ca,{onBack:m}),f==="multiplayer"&&k&&e.jsx(ja,{gamePubkey:k,selectedStrategy:qe.BALANCED,onBack:()=>{i("lobby"),c(null)}})]})}export{Na as default};
