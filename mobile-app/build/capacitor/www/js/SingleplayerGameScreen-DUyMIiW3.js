import{r as l,j as t}from"./three-DV31HySq.js";import{K as X}from"./blockchain-C0nfa7Sw.js";import{j as Z,t as ee,aL as te,bf as ae,an as ne,G as C,aV as O,x as H,aN as oe,aO as re,d as u,m as le}from"./index-BarUt2o_.js";import{G as ie}from"./GameStatsHeader-DfbFCrGS.js";import{a as se,R as de}from"./RouletteWheel-DiJhWd16.js";import ce from"./CreateSingleplayerGameModal-B62-ROlx.js";import"./index-BoZlPyW9.js";import{R as S}from"./rtpConfigMultiplayer-CragVKAz.js";import{S as pe,a as ge,b as xe,c as ue}from"./chip-_2yZgDj4.js";import{G as me}from"./GameRecentPlaysHorizontal-CmiF3H-Z.js";import{G as fe}from"./GameControlsSection-BZ3LzTmM.js";import"./react-vendor-faCf7XlP.js";import"./physics-audio-Bm3pLP40.js";import"./index-CSHl0t8b.js";const be=le`
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
  }
`;u.div`
  padding: 20px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  color: white;
  background: radial-gradient(ellipse at center, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%);
`;u.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
`;u.h2`
  color: #ffd700;
  margin: 0;
  font-size: 1.5rem;
`;u.div`
  display: flex;
  align-items: center;
  gap: 15px;
  color: #ffd700;
  font-weight: bold;
`;u.div`
  display: flex;
  gap: 20px;
  flex-grow: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;u.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;u.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;u.div`
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  padding: 15px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;u.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 15px;
  flex-wrap: wrap;
`;u.div`
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 10px 20px;
  text-align: center;
  font-weight: bold;
  border-radius: 8px;
  margin-bottom: 20px;
  animation: ${be} 2s ease-in-out infinite;
`;const he=u.button`
  background: rgba(255, 0, 0, 0.2);
  color: white;
  border: 1px solid rgba(255, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 0, 0, 0.4);
    border-color: rgba(255, 0, 0, 0.8);
  }
`;function Te({onBack:T,initialWager:y}){const{publicKey:s}=Z(),R=ee(),m=te({win:ue,lose:xe,play:ge,chip:pe}),G=ae("roulette-royale"),{mobile:Y}=ne(),[r,f]=l.useState("placing"),[F,k]=l.useState(!1),[p,M]=l.useState(null),[A,B]=l.useState(30),[ye,K]=l.useState(30),[L,E]=l.useState(15),[b,z]=l.useState([]),[I,W]=l.useState([]),[$,_]=l.useState([]),[d,N]=l.useState(null),D=l.useRef(!1);l.useEffect(()=>{console.log("🎮 Singleplayer: Winning number changed to:",d,"Game phase:",r)},[d,r]);const[v,P]=l.useState(!1),V=e=>{M(e),j(e.fixedWager),B(e.gameDuration),f("wagering"),console.log("⚙️ Singleplayer game configured:",e)},[g,j]=l.useState(y||p?.fixedWager||1e6);l.useEffect(()=>{if(y&&!p){const e={wagerMode:"fixed",fixedWager:y,gameDuration:30,autoStart:!0,showBotActions:!0};console.log("🚀 Auto-configuring singleplayer game from table join:",e),M(e),j(e.fixedWager),B(e.gameDuration),k(!1),P(!0);const a=[];w.forEach((i,o)=>{const n=`fake_player_${o}_${i.replace(/\s/g,"_")}`,x=S.CHIPS_PER_PLAYER;for(let c=0;c<x;c++)Math.random()>.6?a.push({type:"outside",value:Math.random()>.5?"red":"black",amount:e.fixedWager,player:n}):a.push({type:"number",value:Math.floor(Math.random()*37),amount:e.fixedWager,player:n})}),_(a),W(a),f("placing"),console.log("⚡ Skipping to placing phase for table join with",a.length,"fake bets")}},[y,p]);const q=()=>[...Array.from({length:50},(i,o)=>H(`roulette_bot_${String(o+1).padStart(3,"0")}_${Date.now()}`))].sort(()=>Math.random()-.5).slice(0,3),[w]=l.useState(()=>q()),h=e=>e===0?"green":[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(e)?"red":"black";l.useEffect(()=>{if(r==="placing"){let e;return A>0&&(e=setInterval(()=>{B(a=>a<=1?(f("spinning"),0):a-1)},1e3)),()=>{e&&clearInterval(e)}}if(r==="spinning"&&d===null&&!D.current){D.current=!0;const e=Math.floor(Math.random()*37);console.log("🎲 DEBUG: Generated winning number (will reveal in 2s):",e);const a=setTimeout(()=>{console.log("🎯 DEBUG: Revealing winning number:",e),N(e)},2e3);console.log("⏰ DEBUG: Setting outcome timeout for 5 seconds");const i=setTimeout(()=>{console.log("🎯 DEBUG: Outcome timeout FIRED - Transitioning to outcome phase"),f("outcome");const o=b.some(n=>n.type==="number"&&n.value===e||n.type==="outside"&&n.value==="red"&&h(e)==="red"||n.type==="outside"&&n.value==="black"&&h(e)==="black");console.log("🏆 DEBUG: Winner check result:",{hasWinner:o,randomWinningNumber:e}),m.play(o?"win":"lose"),console.log("⏰ DEBUG: Setting lobby timeout for 15 seconds (from outcome)"),setTimeout(()=>{console.log("🔄 DEBUG: Lobby timeout FIRED - Transitioning to lobby"),f("lobby"),E(15)},3e3)},5e3);return()=>{clearTimeout(a),clearTimeout(i)}}if(r==="lobby"){console.log("🏠 DEBUG: In lobby phase, countdown:",L);const e=setInterval(()=>{E(a=>a<=1?(console.log("🔄 DEBUG: Auto-returning to lobby (countdown finished)"),T(),0):a-1)},1e3);return()=>clearInterval(e)}},[r,v]),l.useCallback(()=>{console.log("🔄 DEBUG: Staying with table - Restarting game"),f("placing"),N(null),z([]),W([]),_([]),B(p?.gameDuration||30),K(30),E(15),P(!0),D.current=!1},[p]),l.useCallback(()=>{if(v)return;P(!0),f("placing"),m.play("play");const e=[];w.forEach((a,i)=>{const o=`fake_player_${i}_${a.replace(/\s/g,"_")}`,n=S.CHIPS_PER_PLAYER;for(let x=0;x<n;x++){let c=g;p?.wagerMode==="random"&&p.minWager&&p.maxWager&&(c=Math.floor(Math.random()*(p.maxWager-p.minWager)+p.minWager)),Math.random()>.6?e.push({type:"outside",value:Math.random()>.5?"red":"black",amount:c,player:o}):e.push({type:"number",value:Math.floor(Math.random()*37),amount:c,player:o})}}),_(e),W([...b,...e]),console.log("🎰 Generated fake player bets for chip visualization:",e),e.forEach((a,i)=>{setTimeout(()=>{console.log(`🤖 Fake player ${a.player} placed bet:`,a)},Math.random()*5e3+1e3)})},[v,m,w,g,b]);const J=l.useCallback(e=>{if(r!=="placing"||!v||!s)return;m.play("chip");const a=s.toBase58(),i={...e,player:a};z(o=>{const n=o.filter(x=>x.player===a);if(n.length>=S.CHIPS_PER_PLAYER){const x=[...n.slice(1),i];return[...o.filter(Q=>Q.player!==a),...x]}else return[...o,i]}),W(o=>{const n=o.filter(c=>c.player!==a),x=o.filter(c=>c.player===a);if(x.length>=S.CHIPS_PER_PLAYER){const c=[...x.slice(1),i];return[...n,...c,...$]}else return[...o,i]})},[r,v,s,m,$]);l.useCallback(()=>{P(!0),f("placing"),m.play("play")},[m]);const U=l.useCallback(()=>{f("spinning"),m.play("play")},[m]);return[...w.map((e,a)=>({user:X.generate().publicKey,name:e,status:"joined",wager:g})),...v&&s?[{user:s,name:"You",status:"joined",wager:g}]:[]],t.jsxs(t.Fragment,{children:[t.jsx(C.Portal,{target:"recentplays",children:t.jsx(me,{gameId:"roulette-royale"})}),t.jsx(C.Portal,{target:"stats",children:t.jsx(ie,{gameName:"Roulette Royale",gameMode:"Debug",rtp:(.973*100).toFixed(0),stats:G.stats,onReset:G.resetStats,isMobile:Y})}),t.jsx(C.Portal,{target:"screen",children:t.jsxs("div",{style:{width:"100%",height:"100%",position:"relative",background:"radial-gradient(ellipse at center, rgba(139, 69, 19, 0.4) 0%, rgba(0, 0, 0, 0.9) 70%)"},children:[t.jsxs("div",{style:{position:"absolute",top:"0",left:"0",right:"0",bottom:"clamp(130px, 28vw, 150px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"clamp(15px, 4vw, 25px)"},children:[!p&&!y&&t.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[t.jsx("div",{style:{fontSize:"2rem",color:"#ffd700",textAlign:"center",marginBottom:"15px"},children:"🎰 Roulette Royale - Singleplayer 🎰"}),t.jsx("div",{style:{fontSize:"1rem",color:"rgba(255, 255, 255, 0.8)",textAlign:"center",maxWidth:"400px",lineHeight:"1.5",marginBottom:"20px"},children:"Play against the house with AI opponents. Configure your singleplayer game settings and wagers."}),t.jsx("button",{onClick:()=>k(!0),style:{padding:"15px 30px",fontSize:"1.1rem",fontWeight:"bold",background:"linear-gradient(45deg, #ff6b6b, #ffd700)",border:"none",borderRadius:"10px",color:"white",cursor:"pointer",boxShadow:"0 0 20px rgba(255, 215, 0, 0.3)",transition:"all 0.3s ease"},onMouseEnter:e=>{e.currentTarget.style.transform="scale(1.05)",e.currentTarget.style.boxShadow="0 0 30px rgba(255, 215, 0, 0.5)"},onMouseLeave:e=>{e.currentTarget.style.transform="scale(1)",e.currentTarget.style.boxShadow="0 0 20px rgba(255, 215, 0, 0.3)"},children:"⚙️ Configure Singleplayer Game"})]}),r==="placing"&&t.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px",width:"100%",height:"100%"},children:[t.jsx("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",width:"100%"},children:p?.wagerMode!=="fixed"&&t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",background:"rgba(0, 0, 0, 0.3)",padding:"8px 16px",borderRadius:"8px",border:"1px solid rgba(255, 215, 0, 0.2)"},children:[t.jsx("span",{style:{color:"#a0aec0",fontSize:"0.9rem"},children:"Wager:"}),t.jsx(O,{value:g,onChange:j,disabled:!1})]})}),t.jsx(se,{gamePhase:r,onBetPlaced:J,playerBets:I,wagerAmount:g,disabled:r!=="placing"||!s||b.filter(e=>e.player===s.toBase58()).length>=S.CHIPS_PER_PLAYER})]}),r==="spinning"&&t.jsx("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%"},children:t.jsx(de,{spinning:!0,winningNumber:d,gamePhase:r,playerBets:I,gameResult:{winnerIndexes:d?[d]:[]}})}),r==="outcome"&&t.jsx("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px",width:"100%",maxWidth:"500px",margin:"0 auto"},children:t.jsxs("div",{style:{background:"rgba(0, 0, 0, 0.9)",borderRadius:"15px",padding:"15px",border:"2px solid #ffd700",width:"100%",maxHeight:"500px",overflowY:"auto"},children:[t.jsx("div",{style:{textAlign:"center",marginBottom:"15px",padding:"10px",background:`linear-gradient(135deg, ${d!==null&&h(d)==="red"?"#dc3545, #a71e2a":d!==null&&h(d)==="black"?"#343a40, #1a1e21":"#28a745, #1e7e34"})`,borderRadius:"10px",border:"2px solid #ffd700"},children:t.jsxs("h3",{style:{color:"white",margin:0,fontSize:"1.2rem"},children:["🎯 Winning Number: ",d," (",d!==null?h(d).toUpperCase():"UNKNOWN",")"]})}),t.jsx("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:(()=>{const e=[];return w.forEach((a,i)=>{const o=`fake_player_${i}`,n=[],x=S.CHIPS_PER_PLAYER;for(let c=0;c<x;c++)Math.random()>.7?n.push({type:"outside",value:Math.random()>.5?"red":"black",amount:g,player:o}):n.push({type:"number",value:Math.floor(Math.random()*37),amount:g,player:o});e.push({name:a,key:o,bets:n})}),s&&b.length>0&&e.push({name:"You",key:s.toBase58(),bets:b}),e.length>0?e.map((a,i)=>{const o=a.bets.some(n=>n.type==="number"&&n.value===d||n.type==="outside"&&n.value==="red"&&h(d||0)==="red"||n.type==="outside"&&n.value==="black"&&h(d||0)==="black");return t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:o?"rgba(40, 167, 69, 0.2)":"rgba(220, 53, 69, 0.2)",border:`2px solid ${o?"#28a745":"#dc3545"}`,borderRadius:"8px",fontSize:"0.9rem"},children:[t.jsx("div",{style:{color:o?"#28a745":"#dc3545",fontWeight:"bold",minWidth:"80px"},children:o?"🏆 WIN":"❌ LOSE"}),t.jsx("div",{style:{color:"white",flex:1,textAlign:"center",fontWeight:a.name==="You"?"bold":"normal"},children:a.name}),t.jsx("div",{style:{color:"#ffd700",fontSize:"0.8rem",minWidth:"120px",textAlign:"right"},children:a.bets.map(n=>n.type==="number"?`#${n.value}`:n.value.toUpperCase()).join(", ")})]},i)}):t.jsx("div",{style:{textAlign:"center",color:"#888",fontSize:"0.9rem"},children:"No bets placed"})})()})]})}),r==="lobby"&&t.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"30px"},children:[t.jsx("h2",{style:{color:"#ffd700",margin:0,fontSize:"2rem"},children:"Game Finished!"}),t.jsxs("div",{style:{color:"#a0aec0",fontSize:"1.2rem",textAlign:"center"},children:["Returning to lobby in ",L," seconds..."]}),t.jsx("div",{style:{display:"flex",gap:"20px",flexWrap:"wrap",justifyContent:"center"},children:t.jsx(he,{onClick:T,children:"← Back to Lobby"})})]})]}),(r==="placing"||r==="spinning"||r==="outcome")&&t.jsx(fe,{children:t.jsxs("div",{style:{display:"flex",alignItems:"center",width:"100%",justifyContent:"space-between",padding:"0 5px",gap:"10px"},children:[t.jsxs("div",{style:{display:"flex",gap:"min(12px, 3vw)",alignItems:"center",flexWrap:"wrap"},children:[t.jsxs("div",{style:{background:"rgba(26, 32, 44, 0.9)",borderRadius:"12px",padding:"clamp(8px, 2vw, 12px)",textAlign:"center",minWidth:"clamp(80px, 20vw, 100px)",flex:"1 1 auto",maxWidth:"120px",border:s?"2px solid rgba(72, 187, 120, 0.6)":"2px solid rgba(74, 85, 104, 0.5)",boxShadow:"0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"},children:[t.jsx("div",{style:{fontSize:"clamp(10px, 2vw, 12px)",marginBottom:"4px",color:"#a0aec0",fontWeight:"bold"},children:s?H(s.toBase58()):"You"}),t.jsx("div",{style:{fontSize:"clamp(12px, 2.5vw, 14px)",fontWeight:"bold",color:s?"#48bb78":"#e53e3e",marginBottom:"2px"},children:s?"🟢":"🔴"}),t.jsx("div",{style:{fontSize:"clamp(8px, 1.5vw, 10px)",color:"#a0aec0",wordBreak:"break-all",lineHeight:"1.2"},children:s?`${s.toBase58().slice(0,4)}...${s.toBase58().slice(-4)}`:"No Wallet"}),t.jsx("div",{style:{fontSize:"clamp(10px, 2vw, 12px)",color:"#ffd700",marginTop:"4px",fontWeight:"bold"},children:r==="placing"?`${(g/R.baseWager).toFixed(3).replace(/\.?0+$/,"")} SOL`:b.length>0?`${b.length} bets`:"No bets"})]}),w.map((e,a)=>{const i=`fake_player_${a}_${e.replace(/\s/g,"_")}`,o=I.filter(n=>n.player===i).length;return t.jsxs("div",{style:{background:"rgba(26, 32, 44, 0.9)",borderRadius:"12px",padding:"clamp(8px, 2vw, 12px)",textAlign:"center",minWidth:"clamp(80px, 20vw, 100px)",flex:"1 1 auto",maxWidth:"120px",border:"2px solid rgba(255, 165, 0, 0.6)",boxShadow:"0 4px 16px rgba(26, 32, 44, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)"},children:[t.jsx("div",{style:{fontSize:"clamp(10px, 2vw, 12px)",marginBottom:"4px",color:"#a0aec0",fontWeight:"bold"},children:e}),t.jsx("div",{style:{fontSize:"clamp(12px, 2.5vw, 14px)",fontWeight:"bold",color:"#ffa500",marginBottom:"2px"},children:"🤖"}),t.jsx("div",{style:{fontSize:"clamp(8px, 1.5vw, 10px)",color:"#a0aec0",lineHeight:"1.2"},children:"AI Player"}),t.jsx("div",{style:{fontSize:"clamp(10px, 2vw, 12px)",color:"#ffd700",marginTop:"4px",fontWeight:"bold"},children:r==="placing"?`${(g/R.baseWager).toFixed(3).replace(/\.?0+$/,"")} SOL`:o>0?`${o} bets`:"Ready"})]},a)})]}),t.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"6px",background:"rgba(0, 0, 0, 0.3)",padding:"clamp(8px, 2vw, 12px)",borderRadius:"8px",border:"1px solid rgba(255, 215, 0, 0.3)",minWidth:"200px"},children:[t.jsxs("div",{style:{color:"#ffd700",fontSize:"clamp(11px, 2.2vw, 13px)",fontWeight:"bold",textAlign:"right",textShadow:"0 1px 2px rgba(0, 0, 0, 0.5)"},children:["💰 Total: ",(b.length*g/R.baseWager).toFixed(3).replace(/\.?0+$/,"")," SOL | ",r]}),t.jsxs("div",{style:{color:"#ffd700",fontSize:"clamp(10px, 2vw, 12px)",fontWeight:"500",textAlign:"right",opacity:.9},children:["Place Your Bets! Time left: ",A,"s"]}),t.jsx("button",{onClick:()=>k(!0),style:{padding:"4px 8px",fontSize:"clamp(10px, 1.8vw, 11px)",background:"rgba(255, 255, 255, 0.1)",border:"1px solid rgba(255, 215, 0, 0.4)",borderRadius:"4px",color:"#ffd700",cursor:"pointer",transition:"all 0.2s ease",alignSelf:"flex-end"},onMouseOver:e=>{e.currentTarget.style.background="rgba(255, 215, 0, 0.1)",e.currentTarget.style.borderColor="rgba(255, 215, 0, 0.6)"},onMouseOut:e=>{e.currentTarget.style.background="rgba(255, 255, 255, 0.1)",e.currentTarget.style.borderColor="rgba(255, 215, 0, 0.4)"},children:"🔧 Settings"})]})]})})]})}),t.jsxs(C.Portal,{target:"controls",children:[t.jsx(oe,{wager:g,setWager:j,onPlay:U,playDisabled:r!=="placing",playText:r==="placing"?"Start Spinning":"Waiting..."}),t.jsx(re,{onPlay:U,playDisabled:r!=="placing",playText:r==="placing"?"Start Spinning":"Waiting...",children:t.jsx(O,{value:g,onChange:j,disabled:r!=="placing"||!!y})})]}),F&&t.jsx(ce,{onClose:()=>k(!1),onConfigureGame:V})]})}export{Te as default};
