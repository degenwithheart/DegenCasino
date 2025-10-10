import{R as u,j as e}from"./three-D4AtYCWe.js";import{d,aL as k,m as z,G as b,az as ne,ax as ae,aP as ie,aw as re,T,aB as _,aC as U,aD as oe,b6 as H}from"./index-eL7pTMGs.js";import{h as V,s as le}from"./physics-audio-DLMfKFaI.js";import{u as ce}from"./useGameMeta-BoUQYdhj.js";import{G as de}from"./GameRecentPlaysHorizontal-DwRhmHlC.js";import{G as pe}from"./GameControlsSection-vCoWFXil.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";const fe="/assets/finish-DCLnd53M.mp3",ge="/assets/tick-CgJL76C9.mp3",xe="/assets/win-D69axww9.mp3",ue="/assets/axe-BkqtzrHr.mp3",me="/assets/explode-pCL8nVGw.mp3",c=16,he=1.06,B=[1,3,5,10,15],j={multiplier:[1.25,1.2,1.15,1.12,1.1,1.08],wagerPercent:[100,130,150,170,180,190],wagerMaxIncrease:[0,2,3,3.5,4,4.5]},ye=z`
  0%, 50%, 100% {
    transform: scale(1);
    filter: brightness(1);
    /* background: #764cc4; */
    /* box-shadow: 0 0 1px 1px #ffffff00; */
  }
  25% {
    transform: scale(0.95);
    filter: brightness(1.5);
    /* background: #945ef7; */
    /* box-shadow: 0 0 1px 1px #ffffff99; */
  }
`,be=z`
  0% {
    filter: brightness(1);
    /* background: #ffffff; */
    transform: scale(1.1);
  }
  75% {
    filter: brightness(2);
    /* background: #3fff7a; */
    transform: scale(1.2);
  }
`,je=z`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  51% {
    background: #ffffff;
    transform: scale(1.6);
  }
`;z`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;d.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  height: 100%;
`;const ve=d.div`
  display: grid;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 14px;
  user-select: none;
  backdrop-filter: blur(20px);
`,we=d.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 8px;
`;d.div`
  border-radius: 5px;
  color: gray;
  background: #292a307d;
  overflow: hidden;
  width: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  height: 50px;
`;d.div`
  margin: 0 auto;
  width: 25%;
  text-align: center;
  padding: 5px 0;
  opacity: .5;
  text-wrap: nowrap;

  & > div:first-child {
    font-size: 60%;
    color: gray;
  }

  ${t=>t.$active&&k`
    background: #FFFFFF11;
    background: 2px 0px 10px #00000033;
    color: #32cd5e;
    opacity: 1;
  `}
`;const Se=d.button`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  background: #9358ff;
  background-size: 100%;
  border: none;
  border-bottom: 5px solid #00000055;
  border-radius: 4px;
  font-weight: bold;
  aspect-ratio: 1;
  width: 60px;
  transition: background 0.3s, opacity .3s, filter .2s ease;
  font-size: 12px;
  cursor: pointer;

  ${t=>t.selected&&k`
    animation: ${ye} .5s ease infinite;
    z-index: 10;
    opacity: 1!important;
  `}

  ${t=>t.status==="gold"&&k`
    color: white;
    animation: ${be} .5s ease;
    opacity: 1;
  `}

  ${t=>t.status==="mine"&&k`
    background: #ff5252;
    z-index: 10;
    animation: ${je} .3s ease;
    opacity: 1;
  `}

  ${t=>t.status==="hidden"&&k`
    &:disabled {
      opacity: .5;
    }
  `}

  &:disabled {
    cursor: default;
  }

  &:hover:not(:disabled) {
    filter: brightness(1.5);
  }
`;d.div`
  padding: 20px;
  display: flex;
  gap: 20px;
  justify-content: center;
`;d.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-top: 10px;
`;d.div`
  font-size: 14px;
  color: #666;
`;d.div`
  font-size: 16px;
  font-weight: bold;
  color: ${t=>t.$isActive?"#4caf50":"#fff"};
`;const Ce=t=>{const s=Math.min(t,j.multiplier.length-1);return{maxMultiplier:j.multiplier[s],maxWagerRatio:j.wagerPercent[s]/100}},X=(t,s,r)=>{const{maxMultiplier:l}=Ce(t),a=Number(BigInt(s)*10000n/BigInt(s-r))/1e4;return Math.min(a,l)},ke=(t,s,r,l)=>{const a=Math.min(t,j.wagerPercent.length-1),i=(j.wagerPercent[a]-100)/100,m=s*(1+i),D=j.wagerMaxIncrease[a],P=s+D,p=Math.min(m,P),h=l/X(t,c-t,1),y=Math.min(r,p,h);return Math.max(s,y)},W=t=>Array.from({length:t}).fill({status:"hidden",profit:0}),Pe=(t,s,r)=>t.map((l,a)=>a===s?{status:"gold",profit:r}:l),Ie=(t,s,r)=>{const l=t.map((a,i)=>({cell:a,index:i})).sort((a,i)=>a.index===s?-1:i.index===s?1:a.cell.status==="hidden"&&i.cell.status==="hidden"?Math.random()-.5:a.cell.status==="hidden"?-1:i.cell.status==="hidden"?1:0).map(a=>a.index).slice(0,r);return t.map((a,i)=>l.includes(i)?{status:"mine",profit:0}:a)};function Be(){const t=b.useGame();ce("mines"),ne("mines");const s=ae({tick:ge,win:xe,finish:fe,step:ue,explode:me}),r=ie(),[l,a]=u.useState(W(c)),[i,m]=u.useState(0),[D,P]=u.useState(-1),[p,h]=u.useState(0),[y,v]=u.useState(!1),[g,I]=u.useState(!1),[x,E]=re(),[f,L]=u.useState(B[2]),w=n=>{const o=c-n;return X(n,o,f)},S=u.useMemo(()=>{const n=c-f;let o=0,C=x;return Array.from({length:n}).map((F,M)=>{const $=M===0?x:ke(M,x,C,r.maxPayout),A=w(M),ee=c-M,te=Array.from({length:ee},(We,se)=>se<f?0:A),R=$*(A-1);o+=R;const O=$+R;return C=O,{bet:te,wager:$,profit:R,cumProfit:o,balance:O}}).filter(F=>Math.max(...F.bet)*F.wager<r.maxPayout)},[x,f,r.maxPayout]),q=c-i<=f,J=g&&!y&&!q,{wager:K,bet:Z}=S[i]??{},N=async()=>{try{V.state!=="running"&&(await le(),await V.resume(),console.debug("🎵 Audio context initialized on game start")),a(W(c)),v(!1),m(0),h(0),I(!0)}catch(n){console.warn("⚠️ Failed to initialize audio:",n),a(W(c)),v(!1),m(0),h(0),I(!0)}},G=async()=>{s.play("finish"),Q()},Q=()=>{a(W(c)),v(!1),m(0),h(0),I(!1)},Y=async n=>{v(!0),P(n);try{s.sounds.step.player.loop=!0,s.play("step",{}),s.sounds.tick.player.loop=!0,s.play("tick",{}),await t.play({bet:Z,wager:K,metadata:[i]});const o=await t.result();if(s.sounds.tick.player.stop(),o.payout===0){I(!1),a(Ie(l,n,f)),s.play("explode");return}const C=i+1;m(C),a(Pe(l,n,o.profit)),h(o.payout),C<c-f?s.play("win",{playbackRate:Math.pow(he,i)}):(s.play("win",{playbackRate:.9}),s.play("finish"))}finally{v(!1),P(-1),s.sounds.tick.player.stop(),s.sounds.step.player.stop()}};return e.jsxs(e.Fragment,{children:[e.jsx(b.Portal,{target:"recentplays",children:e.jsx(de,{gameId:"mines"})}),e.jsx(b.Portal,{target:"screen",children:e.jsxs("div",{style:{position:"relative",width:"100%",height:"100%"},children:[e.jsx("div",{style:{position:"absolute",top:"20px",left:"20px",right:"20px",bottom:"120px",borderRadius:"10px",overflow:"hidden",border:"2px solid rgba(147, 88, 255, 0.4)",background:"linear-gradient(135deg, #0a0511 0%, #0d0618 25%, #0f081c 50%, #0a0511 75%, #0a0511 100%)",perspective:"100px"},children:e.jsx(b.Responsive,{children:e.jsx(ve,{children:e.jsx(we,{children:l.map((n,o)=>e.jsx(Se,{status:n.status,selected:D===o,onClick:()=>Y(o),disabled:!J||n.status!=="hidden",children:n.status==="gold"&&e.jsxs("div",{children:["+",e.jsx(T,{amount:n.profit})]})},o))})})})}),e.jsxs(pe,{children:[e.jsxs("div",{style:{flex:"1",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#9358ff",marginBottom:4},children:"LEVELS"}),e.jsx("div",{style:{fontSize:"16px",color:"rgba(147,88,255,0.9)",fontWeight:600},children:g?`${i+1}/${S.length}`:`1/${S.length}`})]}),e.jsxs("div",{style:{flex:"1",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#4caf50",marginBottom:4},children:"BASE x"}),e.jsx("div",{style:{fontSize:"16px",color:"rgba(76,175,80,0.9)",fontWeight:600},children:g?`${w(i).toFixed(2)}x`:`${w(0).toFixed(2)||"1.00"}x`})]}),e.jsxs("div",{style:{flex:"1",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#ffeb3b",marginBottom:4},children:"NEXT x"}),e.jsx("div",{style:{fontSize:"16px",color:"rgba(255,235,59,0.9)",fontWeight:600},children:g?`${w(i+1).toFixed(2)}x`:S[1]?`${w(1).toFixed(2)}x`:"Start"})]}),e.jsxs("div",{style:{flex:"1",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#4caf50",marginBottom:4},children:"TOTAL WON"}),e.jsx("div",{style:{fontSize:"16px",color:"rgba(76,175,80,0.9)",fontWeight:600},children:e.jsx(T,{amount:p})})]}),e.jsxs("div",{style:{flex:"1",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"},children:[e.jsx("div",{style:{fontSize:"14px",fontWeight:"bold",color:"#ff9800",marginBottom:4},children:"NEXT WAGER"}),e.jsx("div",{style:{fontSize:"16px",color:"rgba(255,152,0,0.9)",fontWeight:600},children:e.jsx(T,{amount:g?S[i+1]?.wager||0:x})})]})]})]})}),e.jsx(b.Portal,{target:"controls",children:g?e.jsxs(e.Fragment,{children:[e.jsx(_,{wager:x,setWager:E,onPlay:G,playDisabled:y||p===0,playText:p>0?"Cash":"New",children:g&&p>0&&e.jsx("div",{style:{marginTop:10},children:e.jsx(H,{onClick:G,disabled:y||p===0,variant:"primary",children:"💰 Cash Out"})})}),e.jsx(U,{children:g&&p>0&&e.jsx(H,{onClick:G,disabled:y||p===0,variant:"primary",children:"💰 Cash Out"})})]}):e.jsxs(e.Fragment,{children:[e.jsx(_,{wager:x,setWager:E,onPlay:N,playDisabled:r.maxPayout===0,playText:"Start",children:e.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center",marginBottom:10},children:[e.jsx("label",{style:{color:"#fff",minWidth:60},children:"Mines:"}),e.jsx(b.Select,{options:B,value:f,onChange:L,label:n=>e.jsxs(e.Fragment,{children:[n," Mines"]})})]})}),e.jsxs(U,{onPlay:N,playDisabled:r.maxPayout===0,playText:"Start",children:[e.jsx(oe,{value:x,onChange:E}),e.jsxs("div",{style:{display:"flex",gap:10,alignItems:"center"},children:[e.jsx("label",{style:{color:"#fff",minWidth:60},children:"Mines:"}),e.jsx("select",{value:f,onChange:n=>L(Number(n.target.value)),style:{padding:8,borderRadius:4,border:"1px solid rgba(147, 88, 255, 0.3)",background:"#1a1a2e",color:"#fff"},children:B.map(n=>e.jsx("option",{value:n,children:n},n))})]})]})]})})]})}export{Be as default};
