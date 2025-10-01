import{r as c,j as n}from"./three-DV31HySq.js";import{aH as D,aJ as H,aI as Y,t as F,aU as K,G as q,bf as J,aL as V,T as G,aM as Q,b1 as X,d as r}from"./index-BarUt2o_.js";import{u as R}from"./useGameMeta-C4Hfe5lB.js";import{S as Z,a as ee,b as te,c as ne}from"./chip-_2yZgDj4.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const re=r.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a0f0f 0%, #2d1b1b 25%, #4a2c2c 50%, #2d1b1b 75%, #1a0f0f 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,ae=r.div`
  padding: 16px 20px 8px 20px;
  background: rgba(26, 15, 15, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  z-index: 10;
`,ie=r.h1`
  color: #ffd700;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`,se=r.p`
  color: #daa520;
  font-size: 14px;
  margin: 0;
  text-align: center;
`,oe=r.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  min-height: 0;
`,le=r.div`
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
  background: ${e=>e.$hasResult?e.$isWin?"rgba(255, 215, 0, 0.2)":"rgba(220, 20, 60, 0.2)":"rgba(218, 165, 32, 0.1)"};
  border: 2px solid ${e=>e.$hasResult?e.$isWin?"rgba(255, 215, 0, 0.5)":"rgba(220, 20, 60, 0.5)":"rgba(218, 165, 32, 0.3)"};
  border-radius: 16px;
  transition: all 0.3s ease;
`,de=r.div`
  font-size: 16px;
  font-weight: ${e=>e.$hasResult?"700":"400"};
  color: ${e=>e.$hasResult?e.$isWin?"#ffd700":"#dc143c":"#daa520"};
  margin-bottom: 8px;
`,ce=r.div`
  text-align: center;
  margin-bottom: 24px;
`,ue=r.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 4px;
`,ge=r.div`
  font-size: 14px;
  color: #daa520;
`,be=r.div`
  width: 200px;
  height: 200px;
  margin: 20px auto;
  background: radial-gradient(circle, #8b0000 0%, #4a0000 30%, #2d0000  60%, #000 100%);
  border-radius: 50%;
  border: 6px solid #ffd700;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
  transform: ${e=>e.$spinning?"rotate(720deg)":"rotate(0deg)"};
  transition: transform 2s ease-out;
`,fe=r.div`
  position: absolute;
  width: 40px;
  height: 40px;
  background: ${e=>e.$active?"linear-gradient(135deg, #ffd700, #ffed4e)":[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(e.$number)?"linear-gradient(135deg, #dc143c, #8b0000)":"linear-gradient(135deg, #2f2f2f, #000)"};
  border: 2px solid ${e=>e.$active?"#ffd700":"#666"};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  transform: ${e=>`rotate(${e.$number*10}deg) translateY(-70px) rotate(-${e.$number*10}deg)`};
  
  ${e=>e.$active&&`
    animation: pulse 0.5s ease-in-out infinite alternate;
    @keyframes pulse {
      0% { transform: rotate(${e.$number*10}deg) translateY(-70px) rotate(-${e.$number*10}deg) scale(1); }
      100% { transform: rotate(${e.$number*10}deg) translateY(-70px) rotate(-${e.$number*10}deg) scale(1.2); }
    }
  `}
`,pe=r.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #ffd700, #daa520);
  border-radius: 50%;
  border: 3px solid #8b0000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #8b0000;
  text-align: center;
`,xe=r.div`
  background: rgba(26, 15, 15, 0.8);
  border: 2px solid #ffd700;
  border-radius: 16px;
  padding: 16px;
  margin: 20px 0;
`,me=r.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`,he=r.button`
  padding: 12px 8px;
  background: ${e=>e.$active?Re(e.$betType):"rgba(26, 15, 15, 0.6)"};
  border: 2px solid ${e=>e.$active?"#ffd700":"rgba(255, 215, 0, 0.3)"};
  border-radius: 8px;
  color: ${e=>e.$active?"#fff":"#daa520"};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
`,$e=r.div`
  display: ${e=>e.$visible?"grid":"none"};
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  margin: 12px 0;
`,ye=r.button`
  padding: 8px 4px;
  background: ${e=>e.$active?"linear-gradient(135deg, #ffd700, #daa520)":[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(e.$number)?"linear-gradient(135deg, #dc143c, #8b0000)":"linear-gradient(135deg, #2f2f2f, #000)"};
  border: 1px solid ${e=>e.$active?"#ffd700":"#666"};
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
  }
`,ve=r.div`
  margin-bottom: 20px;
`,je=r.div`
  background: rgba(26, 15, 15, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`,we=r.div`
  font-size: 14px;
  color: #daa520;
  margin-bottom: 12px;
`,ke=r.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 16px;
`,Se=r.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,j=r.button`
  background: rgba(74, 44, 44, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffd700;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(74, 44, 44, 1);
  }
`,We=r.button`
  width: 100%;
  background: ${e=>e.$disabled?"rgba(218, 165, 32, 0.4)":"linear-gradient(135deg, #ffd700, #daa520)"};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${e=>e.$disabled?"#8b7355":"#8b0000"};
  font-size: 18px;
  font-weight: 700;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  box-shadow: ${e=>e.$disabled?"none":"0 4px 16px rgba(255, 215, 0, 0.4)"};
  
  ${e=>!e.$disabled&&`
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
    }
  `}
`,Re=e=>{switch(e){case"straight":return"linear-gradient(135deg, #dc143c, #8b0000)";case"red":return"linear-gradient(135deg, #dc143c, #8b0000)";case"black":return"linear-gradient(135deg, #2f2f2f, #000)";case"even":return"linear-gradient(135deg, #4682b4, #2f4f4f)";case"odd":return"linear-gradient(135deg, #4682b4, #2f4f4f)";default:return"linear-gradient(135deg, #ffd700, #daa520)"}},N={straight:{label:"Single Number",multiplier:35,numbers:1},red:{label:"Red",multiplier:1,numbers:18},black:{label:"Black",multiplier:1,numbers:18},even:{label:"Even",multiplier:1,numbers:18},odd:{label:"Odd",multiplier:1,numbers:18},high:{label:"High (19-36)",multiplier:1,numbers:18},low:{label:"Low (1-18)",multiplier:1,numbers:18}},Ce=()=>{const e=D(),[l,w]=H(),p=Y(),M=F(),k=K(M?.mint),T=q.useGame(),P=J("roulette-royale"),[s,C]=c.useState("red"),[S,O]=c.useState(1),[u,x]=c.useState(!1),[m,h]=c.useState(!1),[f,$]=c.useState(null),[g,y]=c.useState(null),b=c.useRef(null),v=V({win:ne,lose:te,play:ee,chip:Z}),E=(()=>{const t=Array(37).fill(0),i=N[s].multiplier+1;if(s==="straight")t[S]=i;else if(s==="red")[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].forEach(d=>t[d]=i);else if(s==="black")[2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35].forEach(d=>t[d]=i);else if(s==="even")for(let a=2;a<=36;a+=2)t[a]=i;else if(s==="odd")for(let a=1;a<=36;a+=2)t[a]=i;else if(s==="high")for(let a=19;a<=36;a++)t[a]=i;else if(s==="low")for(let a=1;a<=18;a++)t[a]=i;return t})(),W=Math.max(...E),A=l*W,I=A>p.maxPayout,z=(()=>{if(M?.mint?.equals?.(X))return k?.baseWager??.01;const t=k?.usdPrice??0;return t>0?1/t:k?.baseWager??.01})(),L=W>0?Math.min(p.maxPayout/W,p.balance):p.balance,B=t=>{const o=Math.max(z,l*t);w(o)},_=async()=>{if(!(m||l<=0))try{h(!0),x(!1),y(null),$(null),v.play("play"),v.play("chip"),await T.play({bet:E,wager:l,metadata:[s,S]});const t=await T.result(),o=t.resultIndex;$(o),setTimeout(()=>{h(!1);const i=t.payout>0;y(i?"win":"lose");const a=t.payout-l;if(P.updateStats(a),i){v.play("win"),b.current?.winFlash("#ffd700",1.5);const d=t.payout/l;d>=20?b.current?.screenShake(2,1e3):d>=10?b.current?.screenShake(1.5,700):d>=5&&b.current?.screenShake(1,500)}else v.play("lose"),b.current?.loseFlash("#dc143c",.8);x(!0)},2e3)}catch(t){console.error("🎰 MOBILE ROULETTE ERROR:",t),h(!1),x(!1),y(null),$(null)}},U=()=>{x(!1),h(!1),y(null),$(null)};return n.jsxs(re,{children:[n.jsxs(ae,{children:[n.jsx(ie,{children:"🎰 Roulette Royale"}),n.jsx(se,{children:"Mobile Edition • European Style"})]}),n.jsxs(oe,{children:[n.jsx(le,{$hasResult:u&&g!==null,$isWin:g==="win",children:n.jsx(de,{$hasResult:u&&g!==null,$isWin:g==="win",children:u&&g!==null&&f!==null?`${g==="win"?"WIN!":"LOSE"} - Number ${f}`:"Place your bet and spin the wheel!"})}),n.jsxs(ce,{children:[n.jsx(ue,{children:n.jsx(G,{exact:!0,amount:A})}),n.jsxs(ge,{children:["Possible Win (",N[s].multiplier+1,"x)"]})]}),n.jsxs(be,{$spinning:m,children:[n.jsx(pe,{children:f!==null?f:"SPIN"}),Array.from({length:12}).map((t,o)=>{const i=o*3+1;return n.jsx(fe,{$number:i,$active:f===i,children:i},i)})]}),n.jsxs(xe,{children:[n.jsx(me,{children:Object.entries(N).map(([t,o])=>n.jsxs(he,{$active:s===t,$betType:t,onClick:()=>C(t),children:[o.label," (",o.multiplier+1,"x)"]},t))}),n.jsx($e,{$visible:s==="straight",children:Array.from({length:36},(t,o)=>o+1).map(t=>n.jsx(ye,{$number:t,$active:S===t,onClick:()=>O(t),children:t},t))})]}),n.jsx(ve,{children:n.jsxs(je,{children:[n.jsx(we,{children:"Wager Amount"}),n.jsx(ke,{children:n.jsx(G,{exact:!0,amount:l})}),n.jsxs(Se,{children:[n.jsx(j,{onClick:()=>B(.5),children:"1/2"}),n.jsx(j,{onClick:()=>B(2),children:"2x"}),n.jsx(j,{onClick:()=>w(z),children:"Min"}),n.jsx(j,{onClick:()=>w(L),children:"Max"})]})]})}),n.jsx(We,{$disabled:e.isPlaying||m||!u&&I||l<=0,onClick:u?U:_,children:m?"Spinning...":u?"Spin Again":"Spin Wheel"})]}),n.jsx(Q,{ref:b,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...R("roulette-royale")&&{title:R("roulette-royale").name,description:R("roulette-royale").description}})]})};export{Ce as default};
