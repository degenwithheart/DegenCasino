import{r as f,j as e}from"./three-DV31HySq.js";import{t as R,b2 as E,G as p,aN as J,aO as O,d as i,be as j,as as $,m as N}from"./index-BarUt2o_.js";import{P as _}from"./blockchain-C0nfa7Sw.js";import{C as Y}from"./index-BoZlPyW9.js";import"./react-vendor-faCf7XlP.js";import"./physics-audio-Bm3pLP40.js";import"./rtpConfigMultiplayer-CragVKAz.js";import"./index-CSHl0t8b.js";const K=N`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  }
`,u=i.div`
  padding: 10px;
  width: 100%;
  height: 100%;
  color: white;
  overflow-y: auto;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    padding: 20px;
  }
`,U=i.div`
  text-align: center;
  padding: 10px 0;
`,X=i.h1`
  color: #ffd700;
  font-size: 2.5rem;
  margin-bottom: 10px;
`,Q=i.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin-bottom: 30px;
`,c=i.div`
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
`,a=i.button.withConfig({shouldForwardProp:n=>!["variant"].includes(n)})`
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
  
  ${n=>n.variant==="primary"?j`
    background: linear-gradient(45deg, #ff6b6b, #ffd700);
    color: white;
    animation: ${K} 3s ease-in-out infinite;
    
    &:hover {
      transform: scale(1.05);
    }
  `:j`
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
`,y=i.div`
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    margin-bottom: 30px;
  }
`,w=i.h2`
  color: #ffd700;
  font-size: 1.4rem;
  margin-bottom: 15px;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 20px;
  }
`,v=i.div`
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
`,T=i($.div)`
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
`,C=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`,k=i.h3`
  color: #ffd700;
  margin: 0;
  font-size: 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.2rem;
  }
`,P=i.span.withConfig({shouldForwardProp:n=>!["available"].includes(n)})`
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
`,z=i.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`,s=i.div`
  display: flex;
  justify-content: space-between;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8rem;
  
  @media (min-width: 768px) {
    font-size: 0.9rem;
  }
`,S=i.button`
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
`,V=i.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
`,Z=i.div`
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
`,I=i.div`
  text-align: left;
`,q=i.div`
  background: linear-gradient(to bottom, transparent, rgba(255, 215, 0, 0.3), transparent);
  width: 100%;
  
  @media (max-width: 768px) {
    display: none;
  }
`,M=i.h2`
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
`,L=i.p`
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
`,B=i.ul`
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
`,ee=[{id:"sp_001",wager:.01,name:"Penny Table"},{id:"sp_010",wager:.1,name:"Dime Table"},{id:"sp_050",wager:.5,name:"Half Dollar Table"},{id:"sp_100",wager:1,name:"Dollar Table"}];function de({onJoinSingleplayer:n,onJoinMultiplayer:A,onCreateSingleplayer:x,onCreateMultiplayer:h}){const g=R(),[o,l]=f.useState("info"),[t,d]=f.useState("singleplayer"),{games:D}=E({creator:new _("DP1uxUKbZPhFh1BTPfAHgBLsRc8gNPj3DhBNXQbdxuFM")}),m=D.filter(r=>r.players.length<Y.MAX_PLAYERS&&r.state.waiting).slice(0,4),b=r=>`${r.toFixed(r<1?3:1)} SOL`,G=r=>b(r/g.baseWager),F=()=>e.jsxs(Z,{children:[e.jsxs(I,{children:[e.jsx(M,{children:"🤖 Singleplayer Mode"}),e.jsx(L,{children:"Play against the house with AI opponents. Perfect for practice and learning roulette strategies."}),e.jsxs(B,{children:[e.jsx("li",{children:"🎯 Play against AI opponents with balanced difficulty"}),e.jsx("li",{children:"💰 Fixed wager tables from 0.01 to 1.0 SOL"}),e.jsx("li",{children:"⚡ Instant games - no waiting for other players"}),e.jsx("li",{children:"📈 Practice your betting strategies risk-free"}),e.jsx("li",{children:"⚙️ Configurable game settings and AI behavior"})]})]}),e.jsx(q,{}),e.jsxs(I,{children:[e.jsx(M,{children:"👥 Multiplayer Mode"}),e.jsx(L,{children:"Compete against real players in live roulette games. Winner takes the entire prize pool!"}),e.jsxs(B,{children:[e.jsx("li",{children:"🌍 Play against real players worldwide"}),e.jsx("li",{children:"🎮 Create custom tables with your own wager rules"}),e.jsx("li",{children:"🪑 Join existing games with available spots"}),e.jsx("li",{children:"🏆 Winner-takes-all prize pool system"}),e.jsx("li",{children:"💎 Live betting with real SOL stakes"})]})]})]}),W=()=>e.jsx(u,{children:e.jsxs(y,{children:[e.jsx(w,{children:"🤖 Singleplayer Tables (vs House)"}),e.jsx(v,{children:ee.map(r=>e.jsxs(T,{whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsxs(C,{children:[e.jsx(k,{children:r.name}),e.jsx(P,{available:!0,children:"Available"})]}),e.jsxs(z,{children:[e.jsxs(s,{children:[e.jsx("span",{children:"Wager:"}),e.jsx("span",{children:b(r.wager)})]}),e.jsxs(s,{children:[e.jsx("span",{children:"Players:"}),e.jsx("span",{children:"1/1 (You vs House)"})]}),e.jsxs(s,{children:[e.jsx("span",{children:"Type:"}),e.jsx("span",{children:"AI Opponents"})]}),e.jsxs(s,{children:[e.jsx("span",{children:"Difficulty:"}),e.jsx("span",{children:"Balanced"})]})]}),e.jsx(S,{onClick:()=>n(r.wager*g.baseWager),children:"🎯 Join Table"})]},r.id))})]})}),H=()=>e.jsx(u,{children:e.jsxs(y,{children:[e.jsx(w,{children:"👥 Multiplayer Tables (vs Real Players)"}),e.jsx(v,{children:m.length>0?m.map(r=>e.jsxs(T,{whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsxs(C,{children:[e.jsxs(k,{children:["Table #",r.gameId.slice(0,8),"..."]}),e.jsx(P,{available:!0,children:"Joining"})]}),e.jsxs(z,{children:[e.jsxs(s,{children:[e.jsx("span",{children:"Wager:"}),e.jsx("span",{children:G(r.wager||0)})]}),e.jsxs(s,{children:[e.jsx("span",{children:"Players:"}),e.jsxs("span",{children:[r.players.length,"/8"]})]}),e.jsxs(s,{children:[e.jsx("span",{children:"Type:"}),e.jsx("span",{children:"Real Players"})]}),e.jsxs(s,{children:[e.jsx("span",{children:"Creator:"}),e.jsxs("span",{children:[r.creator?.toBase58().slice(0,6),"..."]})]})]}),e.jsx(S,{onClick:()=>A(r.gameId),children:"🚀 Join Game"})]},r.gameId)):e.jsxs(V,{style:{gridColumn:"1 / -1"},children:[e.jsx("h3",{children:"No multiplayer games available"}),e.jsx("p",{children:"Be the first to create a multiplayer table!"})]})})]})});return e.jsxs(e.Fragment,{children:[e.jsx(p.Portal,{target:"stats",children:e.jsxs(U,{children:[e.jsx(X,{children:"🎰 Roulette Royale Lobby"}),e.jsx(Q,{children:o==="info"?"Choose your game mode and join a table":`Browse ${t==="singleplayer"?"Singleplayer":"Multiplayer"} Tables`})]})}),e.jsxs(p.Portal,{target:"screen",children:[o==="info"&&F(),o==="browsing"&&t==="singleplayer"&&W(),o==="browsing"&&t==="multiplayer"&&H()]}),e.jsxs(p.Portal,{target:"controls",children:[e.jsx(J,{wager:0,setWager:()=>{},onPlay:()=>{},hideWager:!0,hideMessage:"Choose Your Table! 🎲",children:o==="info"?e.jsxs(c,{children:[e.jsx(a,{variant:"primary",onClick:()=>l("browsing"),children:"🎮 Join"}),e.jsx(a,{variant:"secondary",onClick:x,children:"🤖 + Create Singleplayer"}),e.jsx(a,{variant:"secondary",onClick:h,children:"👥 + Create Multiplayer"})]}):e.jsxs(c,{children:[e.jsx(a,{variant:"secondary",onClick:()=>l("info"),children:"← Go Back"}),e.jsx(a,{variant:t==="singleplayer"?"primary":"secondary",onClick:()=>d("singleplayer"),children:"🤖 SP Tables"}),e.jsx(a,{variant:t==="multiplayer"?"primary":"secondary",onClick:()=>d("multiplayer"),children:"👥 MP Tables"})]})}),e.jsx(O,{children:o==="info"?e.jsxs(c,{children:[e.jsx(a,{variant:"primary",onClick:()=>l("browsing"),children:"🎮 Join"}),e.jsx(a,{variant:"secondary",onClick:x,children:"🤖 + Create Singleplayer"}),e.jsx(a,{variant:"secondary",onClick:h,children:"👥 + Create Multiplayer"})]}):e.jsxs(c,{children:[e.jsx(a,{variant:"secondary",onClick:()=>l("info"),children:"← Go Back"}),e.jsx(a,{variant:t==="singleplayer"?"primary":"secondary",onClick:()=>d("singleplayer"),children:"🤖 SP Tables"}),e.jsx(a,{variant:t==="multiplayer"?"primary":"secondary",onClick:()=>d("multiplayer"),children:"👥 MP Tables"})]})})]})]})}export{de as default};
