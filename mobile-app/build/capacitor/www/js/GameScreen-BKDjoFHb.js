import{j as e,r as c}from"./three-DV31HySq.js";import{u as q}from"./useRateLimitedGame-A6A-g3e6.js";import{T as M,d as p,j as J,aL as V,bf as X,an as Q,G as W,x as Z,b4 as $,b5 as ee,b6 as z,P as _,m as te}from"./index-BarUt2o_.js";import{G as ne}from"./GameStatsHeader-DfbFCrGS.js";import{R as ae,a as se}from"./RouletteWheel-DiJhWd16.js";import"./index-BoZlPyW9.js";import{R as B}from"./rtpConfigMultiplayer-CragVKAz.js";import{S as re,a as ie,b as le,c as oe}from"./chip-_2yZgDj4.js";import{G as de}from"./GameControlsSection-BZ3LzTmM.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";import"./index-CSHl0t8b.js";const pe=p.div`
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
`,ce=p.h4`
  color: #ffd700;
  margin: 0 0 15px 0;
  text-align: center;
`,ge=p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 6px;
  background: ${s=>s.$isCurrentPlayer?"rgba(255, 215, 0, 0.2)":"rgba(255, 255, 255, 0.1)"};
  border: 2px solid ${s=>s.$isCurrentPlayer?"rgba(255, 215, 0, 0.5)":"transparent"};
`,xe=p.div`
  font-size: 0.9rem;
  color: white;
`,ue=p.div`
  font-size: 0.8rem;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${s=>{switch(s.$status){case"ready":return"#4caf50";case"betting":return"#ff9800";case"waiting":return"#9e9e9e";default:return"#9e9e9e"}}};
`,me=s=>s.toBase58().slice(0,6)+"...";function fe({players:s,currentPlayer:y,gameState:g}){return e.jsxs(pe,{children:[e.jsxs(ce,{children:["Players (",s.length,")"]}),s.length===0?e.jsx("div",{style:{textAlign:"center",opacity:.6,fontSize:"0.9rem"},children:"No players yet"}):s.map((t,R)=>e.jsxs(ge,{$isCurrentPlayer:y?.equals(t.user),children:[e.jsxs("div",{children:[e.jsx(xe,{children:y?.equals(t.user)?"👤 You":`Player ${R+1}`}),e.jsx("div",{style:{fontSize:"0.8rem",opacity:.7},children:me(t.user)})]}),e.jsxs("div",{style:{textAlign:"right"},children:[t.wager&&e.jsx("div",{style:{marginBottom:"4px"},children:e.jsx(M,{amount:t.wager})}),e.jsx(ue,{$status:t.status||"waiting",children:g.waiting?"Waiting":"Ready"})]})]},t.user.toString()))]})}const U=te`
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
  }
`,ye=p.div`
  padding: 20px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  color: white;
  background: radial-gradient(ellipse at center, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%);
`;p.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;p.h2`
  color: #ffd700;
  margin: 0;
  font-size: 1.5rem;
`;p.div`
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  text-align: center;
  animation: ${s=>s.phase==="betting"?U:"none"} 2s ease-in-out infinite;
  
  background: ${s=>{switch(s.phase){case"betting":return"linear-gradient(45deg, #4caf50, #45a049)";case"spinning":return"linear-gradient(45deg, #ff9800, #f57c00)";case"results":return"linear-gradient(45deg, #2196f3, #1976d2)";default:return"rgba(255, 255, 255, 0.2)"}}};
`;p.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;p.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;p.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;const he=p.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: ${s=>s.isStale?"#ff9800":"#4caf50"};
  opacity: 0.8;
`,be=p.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${s=>s.isStale?"#ff9800":"#4caf50"};
  animation: ${s=>s.isStale?"none":"pulse 2s infinite"};
`;p.div`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${s=>s.urgent?"#ff6b6b":"#ffd700"};
  padding: 10px;
  border: 2px solid ${s=>s.urgent?"#ff6b6b":"#ffd700"};
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
`;const D=p.button`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;p.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(45deg, #ffd700, #ff6b6b);
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  z-index: 1000;
  animation: ${U} 1s ease-in-out infinite;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
`;function $e({gamePubkey:s,onBack:y}){const{publicKey:g}=J(),{game:t,metadata:R,isStale:E}=q(s,{fetchMetadata:!0,updateInterval:3e3,criticalUpdatePhases:["settled","waiting"]}),h=V({win:oe,lose:le,play:ie,chip:re}),k=X("roulette-royale"),{mobile:F}=Q(),[l,b]=c.useState("waiting"),[S,O]=c.useState(0),[u,G]=c.useState(null),[we,N]=c.useState(null),[w,L]=c.useState(!1),[ve,P]=c.useState(!1),[v,j]=c.useState(!1),f=c.useRef(null);c.useEffect(()=>{console.log("🎯 WINNING NUMBER STATE CHANGED to:",u,"Current game phase:",l,"Spinning:",v)},[u,l,v]);const[Se,je]=c.useState({}),[I,A]=c.useState([]),[d,C]=c.useState([]),m=n=>n===0?"green":[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(n)?"red":"black";c.useEffect(()=>{if(console.log("🎮 GAME STATE EFFECT:",{hasChainGame:!!t,gameState:t?.state,gamePhase:l,hasProcessedResults:w,isSpinning:v,gameId:t?.gameId}),!!t)if(t.state.waiting)console.log("⏳ Game state: WAITING - resetting all state"),b("waiting"),C([]),A([]),G(null),N(null),P(!1),L(!1),j(!1),console.log("🔄 Game reset - cleared all state for new game"),f.current&&(clearTimeout(f.current),f.current=null);else if(t.state.playing){b("betting");const n=Number(t.softExpirationTimestamp)*1e3,o=()=>{const a=Date.now(),i=Math.max(0,n-a);O(Math.ceil(i/1e3)),i<=0&&(b("spinning"),j(!0))};o();const r=setInterval(o,1e3);return()=>clearInterval(r)}else t.state.settled?(console.log("🏁 Game state: SETTLED",{hasProcessedResults:w,shouldProcess:!w,winnerIndexes:t.winnerIndexes,gameId:t.gameId}),w?console.log("⚠️ Results already processed, skipping"):(console.log("✅ Processing results for the first time..."),L(!0),Y(),l!=="spinning"&&(console.log("🎲 Starting spinning phase"),b("spinning"),j(!0)),f.current&&clearTimeout(f.current),f.current=setTimeout(()=>{console.log("🎯 Stopping spin, showing results"),j(!1),b("results")},2e3))):console.log("🤔 Unknown game state:",t.state)},[t?.state,l,w]),c.useEffect(()=>()=>{f.current&&clearTimeout(f.current)},[]);const Y=c.useCallback(()=>{if(console.log("🎲 handleGameResults CALLED with chainGame:",{hasChainGame:!!t,gameState:t?.state,hasWinnerIndexes:!!t?.winnerIndexes,winnerIndexes:t?.winnerIndexes,playersCount:t?.players?.length||0,allPlayerBets:d.length,myBets:I.length}),console.log("📊 CURRENT PLAYER BETS:",{allPlayerBets:d.map(a=>({player:a.player?.slice(0,8)+"...",type:a.type,value:a.value,amount:a.amount})),myBets:I.map(a=>({type:a.type,value:a.value,amount:a.amount}))}),!t||!t.winnerIndexes){console.error("❌ No chain game or winner indexes available:",{chainGame:!!t,winnerIndexes:t?.winnerIndexes});return}console.log("🎯 Raw winnerIndexes:",t.winnerIndexes,"Type:",typeof t.winnerIndexes[0]);const n=Number(t.winnerIndexes[0]);if(n<0||n>36){console.error("❌ Invalid winner index:",n,"Expected 0-36. Full winnerIndexes:",t.winnerIndexes);return}console.log("🎯 ✅ GAME RESULT - Setting winning number:",n,"from winnerIndexes:",t.winnerIndexes),console.log("🎲 Game details:",{gameId:t.gameId,gameState:t.state,spinning:v,winnerIndex:n,color:m(n)});const o=d.filter(a=>a.type==="number"&&a.value===n||a.type==="outside"&&a.value==="red"&&m(n)==="red"||a.type==="outside"&&a.value==="black"&&m(n)==="black");console.log("🏆 WINNING ANALYSIS:",{winnerIndex:n,color:m(n),totalBets:d.length,winningBets:o.map(a=>({player:a.player?.slice(0,8)+"...",type:a.type,value:a.value,amount:a.amount})),losers:d.length-o.length}),G(n);const r=t.players.find(a=>{const i=a.user.toBase58();return d.some(x=>x.player===i&&(x.type==="number"&&x.value===n||x.type==="outside"&&x.value==="red"&&m(n)==="red"||x.type==="outside"&&x.value==="black"&&m(n)==="black"))});r?(N(r.user),P(!0),h.play("win"),setTimeout(()=>{P(!1)},5e3)):h.play("lose")},[t,d,h]),T=g&&t?.players.some(n=>n.user.equals(g)),H=t?.state.waiting&&!T&&(t.players?.length||0)<B.MAX_PLAYERS,K=n=>{const o=Math.floor(n/60),r=n%60;return`${o}:${r.toString().padStart(2,"0")}`};return t?e.jsxs(e.Fragment,{children:[e.jsx(W.Portal,{target:"stats",children:e.jsx(ne,{gameName:"Roulette Royale",gameMode:"Multiplayer",rtp:(.973*100).toFixed(0),stats:k.stats,onReset:k.resetStats,isMobile:F})}),e.jsx(W.Portal,{target:"screen",children:e.jsxs("div",{style:{width:"100%",height:"100%",position:"relative",background:"radial-gradient(ellipse at center, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%)"},children:[e.jsxs("div",{style:{position:"absolute",top:"clamp(15px, 4vw, 25px)",left:"0",right:"0",bottom:"clamp(130px, 28vw, 150px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"clamp(15px, 4vw, 25px)",padding:"clamp(10px, 2vw, 20px)"},children:[t?.state.complete&&u!==null&&e.jsxs("div",{style:{position:"absolute",top:"10px",right:"10px",background:"rgba(0, 0, 0, 0.9)",padding:"10px 15px",borderRadius:"10px",border:"2px solid #ffd700",zIndex:1e3,minWidth:"200px",maxWidth:"300px"},children:[e.jsxs("div",{style:{textAlign:"center",fontSize:"0.9rem",color:"#ffd700",marginBottom:"8px",fontWeight:"bold"},children:["🎯 Winner: ",u," (",m(u).toUpperCase(),")"]}),e.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"4px",fontSize:"0.8rem"},children:d.length>0?d.filter((n,o,r)=>r.findIndex(a=>a.player===n.player)===o).map(n=>{const o=d.filter(i=>i.player===n.player),r=o.some(i=>i.type==="number"&&i.value===u||i.type==="outside"&&i.value==="red"&&m(u)==="red"||i.type==="outside"&&i.value==="black"&&m(u)==="black"),a=n.player===g?.toBase58()?"You":`${n.player.slice(0,6)}...`;return e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:r?"rgba(40, 167, 69, 0.25)":"rgba(220, 53, 69, 0.25)",borderRadius:"6px",border:`2px solid ${r?"#28a745":"#dc3545"}`},children:[e.jsx("span",{style:{color:r?"#28a745":"#dc3545",fontWeight:"bold",minWidth:"60px"},children:r?"🏆 WIN":"❌ LOSE"}),e.jsx("span",{style:{color:"white",fontWeight:a==="You"?"bold":"normal",flex:1,textAlign:"center"},children:a}),e.jsx("span",{style:{color:"#ffd700",fontSize:"0.75rem",minWidth:"80px",textAlign:"right"},children:o.map(i=>i.type==="number"?`#${i.value}`:i.value.charAt(0).toUpperCase()).join(", ")})]},n.player)}):e.jsx("div",{style:{textAlign:"center",color:"#888",fontSize:"0.8rem"},children:"No players with bets"})})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"15px",width:"100%"},children:[e.jsx("div",{children:e.jsxs("h2",{style:{color:"#ffd700",margin:0,fontSize:"1.5rem"},children:["🎰 Roulette Royale - Table ",s.toBase58().slice(0,6)]})}),e.jsxs("div",{style:{display:"flex",gap:"15px",alignItems:"center"},children:[e.jsxs(he,{isStale:E,children:[e.jsx(be,{isStale:E}),E?"Updating...":"Live"]}),e.jsxs("div",{style:{padding:"8px 16px",borderRadius:"20px",fontWeight:"bold",fontSize:"0.9rem",textAlign:"center",animation:l==="betting"?"glowPulse 2s ease-in-out infinite":"none",background:l==="betting"?"linear-gradient(45deg, #4caf50, #45a049)":l==="spinning"?"linear-gradient(45deg, #ff9800, #f57c00)":l==="results"?"linear-gradient(45deg, #2196f3, #1976d2)":"rgba(255, 255, 255, 0.2)"},children:[l==="waiting"&&"⏳ Waiting for Players",l==="betting"&&"💰 Betting Open",l==="spinning"&&"🎲 Spinning...",l==="results"&&"🎊 Results"]}),e.jsx(D,{onClick:y,children:"← Lobby"})]})]}),l==="betting"&&S>0&&e.jsxs("div",{style:{textAlign:"center",fontSize:"1.2rem",fontWeight:"bold",color:S<=10?"#ff6b6b":"#ffd700",padding:"10px",border:`2px solid ${S<=10?"#ff6b6b":"#ffd700"}`,borderRadius:"8px",background:"rgba(0, 0, 0, 0.3)"},children:["⏰ Betting closes in: ",K(S)]}),e.jsx("div",{style:{flex:1,display:"flex",alignItems:"center",justifyContent:"center",width:"100%"},children:l==="spinning"||l==="results"?e.jsx(ae,{spinning:v,winningNumber:u,gamePhase:l,playerBets:d,gameResult:t},`wheel-${t?.gameId||"default"}`):e.jsx("div",{style:{background:"rgba(0, 0, 0, 0.3)",padding:"15px",borderRadius:"8px",border:"2px solid rgba(255, 215, 0, 0.3)",width:"100%",maxWidth:"600px"},children:e.jsx(fe,{players:t.players,currentPlayer:g,gameState:t.state})})}),I.length>0&&e.jsxs("div",{style:{background:"rgba(0, 0, 0, 0.3)",padding:"15px",borderRadius:"8px",border:"2px solid rgba(255, 215, 0, 0.3)",width:"100%",maxWidth:"600px"},children:[e.jsx("h4",{style:{color:"#ffd700",margin:"0 0 10px 0"},children:"My Bets"}),I.map((n,o)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:"5px"},children:[e.jsx("span",{children:n.type}),e.jsx(M,{amount:n.amount})]},o))]})]}),(t?.players?.length||0)>0&&e.jsx(de,{children:l==="betting"?e.jsx(se,{gamePhase:l,wagerAmount:R?.wager||1,onBetPlaced:n=>{if(!g)return;h.play("chip"),console.log("🎯 PLAYER BET PLACED:",{player:g.toBase58().slice(0,8)+"...",betType:n.type,betValue:n.value,betAmount:n.amount,gamePhase:l,gameId:t?.gameId});const o=g.toBase58(),r=d.filter(a=>a.player===o);if(console.log("💰 BET TRACKING:",{playerKey:o.slice(0,8)+"...",currentBetsCount:r.length,maxAllowed:B.CHIPS_PER_PLAYER,allPlayersTotal:d.length}),r.length>=B.CHIPS_PER_PLAYER){const a=[...r.slice(1),{...n,player:o}],i=d.filter(x=>x.player!==o);C([...i,...a]),A(a),console.log("🔄 BET REPLACED (at limit):",{oldBet:r[0],newBet:n,newBetsCount:a.length})}else{const a={...n,player:o};C(i=>[...i,a]),A(i=>[...i,n]),console.log("➕ NEW BET ADDED:",{newBet:a,totalPlayerBets:r.length+1,totalAllBets:d.length+1})}},playerBets:d,disabled:l!=="betting"||!T||g&&d.filter(n=>n.player===g.toBase58()).length>=B.CHIPS_PER_PLAYER}):e.jsx("div",{style:{display:"flex",gap:"min(12px, 3vw)",alignItems:"center",width:"100%",justifyContent:"center",flexWrap:"wrap",padding:"0 5px"},children:t?.players?.map((n,o)=>{const r=n.user.toBase58(),a=g?.toBase58()===r,i=d.filter(x=>x.player===r);return e.jsxs("div",{style:{background:"rgba(26, 32, 44, 0.9)",borderRadius:"12px",padding:"clamp(8px, 2vw, 12px)",textAlign:"center",minWidth:"clamp(80px, 20vw, 100px)",flex:"1 1 auto",maxWidth:"120px",border:a?"2px solid rgba(72, 187, 120, 0.6)":"2px solid rgba(74, 85, 104, 0.5)",boxShadow:"0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"},children:[e.jsx("div",{style:{fontSize:"clamp(10px, 2vw, 12px)",marginBottom:"4px",color:"#a0aec0",fontWeight:"bold"},children:Z(r)}),e.jsx("div",{style:{fontSize:"clamp(12px, 2.5vw, 14px)",fontWeight:"bold",color:a?"#48bb78":"#ffa500",marginBottom:"2px"},children:a?"🟢":"👤"}),e.jsx("div",{style:{fontSize:"clamp(8px, 1.5vw, 10px)",color:"#a0aec0",wordBreak:"break-all",lineHeight:"1.2"},children:`${r.slice(0,4)}...${r.slice(-4)}`}),e.jsx("div",{style:{fontSize:"clamp(10px, 2vw, 12px)",color:"#ffd700",marginTop:"4px",fontWeight:"bold"},children:i.length>0?`${i.length} bets`:"Ready"})]},r)})||[]})})]})}),e.jsx(W.Portal,{target:"controls",children:e.jsxs("div",{style:{display:"flex",justifyContent:"center",gap:"15px",padding:"15px",flexWrap:"wrap"},children:[H&&e.jsx($.JoinGame,{pubkey:s,account:t,creatorAddress:_,creatorFeeBps:z,referralFee:ee,enableMetadata:!0,onTx:()=>h.play("play")}),T&&l==="waiting"&&e.jsx($.EditBet,{pubkey:s,account:t,creatorAddress:_,creatorFeeBps:z,onComplete:()=>{}})]})})]}):e.jsx(ye,{children:e.jsxs("div",{style:{textAlign:"center",padding:"40px"},children:[e.jsx("div",{style:{fontSize:"1.2rem",marginBottom:"20px"},children:"🔄 Loading game..."}),e.jsx(D,{onClick:y,children:"← Back to Lobby"})]})})}export{$e as default};
