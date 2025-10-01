const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["js/GameLobby-B04FMvWU.js","js/three-DV31HySq.js","js/react-vendor-faCf7XlP.js","js/index-BarUt2o_.js","js/blockchain-C0nfa7Sw.js","js/physics-audio-Bm3pLP40.js","assets/index-dVJG-fdv.css","js/rtpConfigMultiplayer-CragVKAz.js","js/index-CSHl0t8b.js","js/GameScreen-BKDjoFHb.js","js/useRateLimitedGame-A6A-g3e6.js","js/GameStatsHeader-DfbFCrGS.js","js/RouletteWheel-DiJhWd16.js","js/chip-_2yZgDj4.js","js/GameControlsSection-BZ3LzTmM.js","js/SingleplayerGameScreen-DUyMIiW3.js","js/CreateSingleplayerGameModal-B62-ROlx.js","js/GameRecentPlaysHorizontal-CmiF3H-Z.js"])))=>i.map(i=>d[i]);
import{r as a,j as e,R as T,_ as W}from"./three-DV31HySq.js";import{j as U,b0 as J,t as Y,b1 as X,d as s,as as z,be as I,m as K,aC as V}from"./index-BarUt2o_.js";import{P as q}from"./blockchain-C0nfa7Sw.js";import{R as H}from"./rtpConfigMultiplayer-CragVKAz.js";import{A as $}from"./index-CSHl0t8b.js";const i=H,x=18,G=Math.ceil(x/3),L=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36],P=t=>L.includes(t%(L.length+1)),A=t=>3-t%3,Q=Array.from({length:x}).map((t,l)=>l+1),p=(t,l,[r,n])=>{const d=Q.filter(l);return{label:t,numbers:d,row:n,column:r}},Z=Array.from({length:x}).reduce((t,l,r)=>({...t,[r+1]:{label:String(r+1),numbers:[String(r+1)],row:A(r),column:1+Math.floor(r/3),color:P(r+1)?"red":"black"}}),{});({...Z,firstHalf:p("<"+Math.floor(x/2+1),t=>t<=x/2,[1,4]),even:p("Even",t=>t%2===0,[2,4]),red:p("Red",t=>P(t),[3,4]),black:p("Black",t=>!P(t),[4,4]),odd:p("Odd",t=>t%2===1,[5,4]),secondHalf:p(">"+Math.floor(x/2),t=>t>x/2,[6,4]),row1:p("2:1",t=>A(t-1)===1,[G+1,1]),row2:p("2:1",t=>A(t-1)===2,[G+1,2]),row3:p("2:1",t=>A(t-1)===3,[G+1,3])});const ee=K`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`,te=s(z.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`,ae=s(z.div)`
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  color: white;
  position: relative;
`,re=s.h2`
  text-align: center;
  margin-bottom: 25px;
  color: #ffd700;
  font-size: 1.5rem;
`,C=s.div`
  margin-bottom: 20px;
`,_=s.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #ffd700;
`,v=s.input`
  width: 100%;
  padding: 10px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
  }
`,oe=s.select`
  width: 100%;
  padding: 10px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: rgba(255, 215, 0, 0.6);
  }

  option {
    background: rgba(0, 0, 0, 0.9);
    color: white;
  }
`,ne=s.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
`,O=s.button.withConfig({shouldForwardProp:t=>!["variant"].includes(t)})`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${t=>t.variant==="primary"?I`
    background: linear-gradient(45deg, #ff6b6b, #ffd700);
    color: white;
    animation: ${ee} 3s ease-in-out infinite;
    
    &:hover {
      transform: scale(1.05);
    }
  `:I`
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`,le=s.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`,se=s.div`
  color: #ff6b6b;
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
`,ie=s.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 15px;
  line-height: 1.4;
`;function ce({onClose:t}){const{publicKey:l}=U(),{createGame:r}=J(),n=Y(),d=n.mint.equals(X),[h,f]=a.useState(i.MAX_PLAYERS),[u,g]=a.useState("sameWager"),[S,m]=a.useState(1),[b,j]=a.useState(.1),[M,R]=a.useState(5),[y,w]=a.useState(!1),[c,E]=a.useState(null),F=async()=>{if(!l)return E("Connect wallet first");if(d)return E("Multiplayer games require real tokens. Please select a live token.");w(!0),E(null);const o=i.BETTING_TIME_SECONDS,D=Math.min(h,5),k={mint:n.mint,creatorAddress:l,maxPlayers:h,softDuration:o,preAllocPlayers:D,winnersTarget:1,wagerType:["sameWager","customWager","betRange"].indexOf(u),payoutType:0};u==="sameWager"?k.wager=Math.floor(S*n.baseWager):u==="betRange"&&(k.minBet=Math.floor(b*n.baseWager),k.maxBet=Math.floor(M*n.baseWager));try{await r(k),t()}catch(B){E(B instanceof Error?B.message:"Failed to create game")}finally{w(!1)}};return e.jsx($,{children:e.jsx(te,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:o=>o.target===o.currentTarget&&t(),children:e.jsxs(ae,{initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.8,opacity:0},transition:{type:"spring",stiffness:300,damping:25},children:[e.jsx(le,{onClick:t,children:"×"}),e.jsx(re,{children:"🎰 Create Multiplayer Table"}),e.jsx(ie,{children:"Create your own roulette table for multiplayer vs real players. Winner takes the entire prize pool!"}),e.jsxs(C,{children:[e.jsxs(_,{children:["Maximum Players (2-",i.MAX_PLAYERS,")"]}),e.jsx(v,{type:"number",min:"2",max:i.MAX_PLAYERS,value:h,onChange:o=>f(Math.max(2,Math.min(i.MAX_PLAYERS,parseInt(o.target.value)||2)))})]}),e.jsxs(C,{children:[e.jsx(_,{children:"Betting Type"}),e.jsxs(oe,{value:u,onChange:o=>g(o.target.value),children:[e.jsx("option",{value:"sameWager",children:"Fixed Wager (All players bet same amount)"}),e.jsx("option",{value:"betRange",children:"Bet Range (Players choose within range)"})]})]}),u==="sameWager"&&e.jsxs(C,{children:[e.jsxs(_,{children:["Fixed Wager Amount (",n.symbol,")"]}),e.jsx(v,{type:"number",min:i.MIN_WAGER,max:i.MAX_WAGER_MULTIPLIER*i.MIN_WAGER,step:"0.01",value:S,onChange:o=>m(parseFloat(o.target.value)||i.MIN_WAGER)})]}),u==="betRange"&&e.jsxs(e.Fragment,{children:[e.jsxs(C,{children:[e.jsxs(_,{children:["Minimum Bet (",n.symbol,")"]}),e.jsx(v,{type:"number",min:i.MIN_WAGER,step:"0.01",value:b,onChange:o=>j(parseFloat(o.target.value)||i.MIN_WAGER)})]}),e.jsxs(C,{children:[e.jsxs(_,{children:["Maximum Bet (",n.symbol,")"]}),e.jsx(v,{type:"number",min:b,step:"0.01",value:M,onChange:o=>R(Math.max(b,parseFloat(o.target.value)||b))})]})]}),e.jsxs(ne,{children:[e.jsx(O,{variant:"secondary",onClick:t,disabled:y,children:"Cancel"}),e.jsx(O,{variant:"primary",onClick:F,disabled:y||d||!l,children:y?"Creating...":"Create Table"})]}),c&&e.jsx(se,{children:c})]})})})}const N=T.lazy(()=>W(()=>import("./GameLobby-B04FMvWU.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8]))),pe=T.lazy(()=>W(()=>import("./GameScreen-BKDjoFHb.js"),__vite__mapDeps([9,1,2,10,3,4,5,6,11,12,7,13,14,8]))),de=T.lazy(()=>W(()=>import("./SingleplayerGameScreen-DUyMIiW3.js"),__vite__mapDeps([15,1,2,4,3,5,6,11,12,16,8,7,13,17,14]))),ue=T.lazy(()=>W(()=>import("./CreateSingleplayerGameModal-B62-ROlx.js"),__vite__mapDeps([16,1,2,3,4,5,6,8]))),ge=()=>e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",height:"400px",color:"white",fontSize:"18px"},children:"Loading Roulette Royale..."});function me(){const t=V({gameName:"Roulette Royale",description:"Multiplayer roulette with real-time betting! Compete with other players on the same wheel for the ultimate prize",rtp:97,maxWin:"35x"}),[l,r]=a.useState("lobby"),[n,d]=a.useState(null),[h,f]=a.useState(1e6),[u,g]=a.useState(!1),[S,m]=a.useState(!1),b=a.useCallback(()=>{r("lobby"),d(null),f(0),g(!1),m(!1)},[]),j=a.useCallback(c=>{f(c),r("singleplayer"),g(!1),m(!1)},[]),M=a.useCallback(c=>{d(new q(c)),r("multiplayer"),g(!1),m(!1)},[]),R=a.useCallback(()=>{g(!0)},[]),y=a.useCallback(()=>{m(!0)},[]),w=a.useCallback(c=>{f(c.fixedWager),r("singleplayer"),g(!1)},[]);return a.useCallback(c=>{d(c),r("multiplayer"),m(!1)},[]),console.log("🎰 ROULETTE ROYALE COMPONENT LOADING..."),e.jsxs(e.Fragment,{children:[t,e.jsxs(a.Suspense,{fallback:e.jsx(ge,{}),children:[l==="lobby"?e.jsx(N,{onJoinSingleplayer:j,onJoinMultiplayer:M,onCreateSingleplayer:R,onCreateMultiplayer:y}):l==="singleplayer"?e.jsx(de,{onBack:b,initialWager:h}):l==="multiplayer"&&n?e.jsx(pe,{gamePubkey:n,onBack:b}):e.jsx(N,{onJoinSingleplayer:j,onJoinMultiplayer:M,onCreateSingleplayer:R,onCreateMultiplayer:y}),u&&e.jsx(ue,{onClose:()=>g(!1),onConfigureGame:w}),S&&e.jsx(ce,{onClose:()=>m(!1)})]})]})}const Ce=Object.freeze({__proto__:null,default:me});export{i as C,Ce as i};
