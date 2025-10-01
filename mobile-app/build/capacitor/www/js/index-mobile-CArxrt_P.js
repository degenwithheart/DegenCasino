import{r as c,j as e}from"./three-DV31HySq.js";import{aH as J,aJ as Q,aI as X,t as Z,aU as ee,G as te,bf as ne,aL as oe,bl as W,T as D,aM as ie,b1 as ae,d as n,B as se}from"./index-BarUt2o_.js";import{O as s}from"./constants-sF6ISFPH.js";import{u as M}from"./useGameMeta-C4Hfe5lB.js";import{S as re,a as le,b as ce,c as de}from"./win-BKYOjMDH.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const xe=n.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,pe=n.div`
  padding: 16px 20px 8px 20px;
  background: rgba(26, 32, 44, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
`,ue=n.h1`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`,ge=n.p`
  color: #a0aec0;
  font-size: 14px;
  margin: 0;
  text-align: center;
`,be=n.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 20px 20px 20px;
  position: relative;
  min-height: 0;
`,me=n.div`
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
  background: ${t=>t.$hasResult?t.$isWin?"rgba(72, 187, 120, 0.2)":"rgba(229, 62, 62, 0.2)":"rgba(160, 174, 192, 0.1)"};
  border: 2px solid ${t=>t.$hasResult?t.$isWin?"rgba(72, 187, 120, 0.5)":"rgba(229, 62, 62, 0.5)":"rgba(160, 174, 192, 0.2)"};
  border-radius: 16px;
  transition: all 0.3s ease;
`,he=n.div`
  font-size: 16px;
  font-weight: ${t=>t.$hasResult?"700":"400"};
  color: ${t=>t.$hasResult?t.$isWin?"#48bb78":"#e53e3e":"#a0aec0"};
  margin-bottom: 8px;
`,fe=n.div`
  text-align: center;
  margin-bottom: 24px;
`,je=n.div`
  font-size: 32px;
  font-weight: 700;
  color: #48bb78;
  margin-bottom: 4px;
`,$e=n.div`
  font-size: 14px;
  color: #a0aec0;
`,ve=n.div`
  margin-bottom: 24px;
`,we=n.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 12px;
  color: #a0aec0;
  padding: 0 4px;
`,ye=n.div`
  position: relative;
  height: 48px;
  background: rgba(45, 55, 72, 0.8);
  border-radius: 24px;
  padding: 4px;
  margin-bottom: 16px;
`,ke=n.div`
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: ${t=>t.$isUnder?"4px":"auto"};
  right: ${t=>t.$isUnder?"auto":"4px"};
  width: ${t=>t.$isUnder?t.$value:100-t.$value}%;
  background: linear-gradient(90deg, #48bb78, #38a169);
  border-radius: 20px;
  transition: all 0.3s ease;
`,Re=n.div`
  position: absolute;
  left: ${t=>t.$value}%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  border-radius: 50%;
  border: 3px solid #4a5568;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 2;
`,Se=n.input`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 3;
`,We=n.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`,C=n.div`
  flex: 1;
  min-width: 0;
  background: rgba(26, 32, 44, 0.9);
  border: 2px solid rgba(74, 85, 104, 0.5);
  border-radius: 16px;
  padding: 16px 12px;
  text-align: center;
  cursor: ${t=>t.$clickable?"pointer":"default"};
  transition: all 0.3s ease;
  
  ${t=>t.$clickable&&`
    &:active {
      transform: scale(0.98);
      background: rgba(26, 32, 44, 0.7);
    }
  `}
`,A=n.div`
  font-size: 12px;
  color: #a0aec0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`,G=n.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`,Me=n.div`
  margin-bottom: 20px;
`,Ce=n.div`
  background: rgba(26, 32, 44, 0.9);
  border: 2px solid rgba(74, 85, 104, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`,Ae=n.div`
  font-size: 14px;
  color: #a0aec0;
  margin-bottom: 12px;
`,Ge=n.div`
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
`,Pe=n.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,j=n.button`
  background: rgba(74, 85, 104, 0.8);
  border: 1px solid rgba(160, 174, 192, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(74, 85, 104, 0.6);
  }
`,Te=n.button`
  width: 100%;
  background: ${t=>t.$disabled?"rgba(74, 85, 104, 0.5)":"linear-gradient(135deg, #48bb78, #38a169)"};
  border: none;
  border-radius: 16px;
  padding: 20px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  cursor: ${t=>t.$disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  box-shadow: ${t=>t.$disabled?"none":"0 4px 16px rgba(72, 187, 120, 0.4)"};
  
  ${t=>!t.$disabled&&`
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(72, 187, 120, 0.6);
    }
  `}
`,$=n.div`
  position: absolute;
  ${t=>{switch(t.$position){case"top-left":return"top: 20px; left: 20px;";case"top-right":return"top: 20px; right: 20px;";case"bottom-left":return"bottom: 120px; left: 20px;";case"bottom-right":return"bottom: 120px; right: 20px;";default:return""}}}
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 50%, #1a202c 100%);
  border-radius: 8px;
  transform: ${t=>{switch(t.$position){case"top-left":return"rotate(-15deg)";case"top-right":return"rotate(15deg)";case"bottom-left":return"rotate(25deg)";case"bottom-right":return"rotate(-25deg)";default:return"rotate(0deg)"}}};
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  opacity: 0.6;
  pointer-events: none;
`,Fe=()=>{const t=J(),[r,v]=Q(),u=X(),P=Z(),d=ee(P?.mint),T=te.useGame(),L=ne("dice-v2"),[i,_]=c.useState(50),[x,N]=c.useState(!0),[l,g]=c.useState(!1),[b,m]=c.useState(-1),[w,h]=c.useState(null),p=c.useRef(null),z=oe({win:de,play:ce,lose:le,tick:re}),y=x?i/s:(s-i-1)/s,f=y>0?1/y*W["dice-v2"]:0,E=f*r,B=E>u.maxPayout,I=(()=>{if(P?.mint?.equals?.(ae))return d?.baseWager??.01;const o=d?.usdPrice??0;return o>0?1/o*(d?.baseWager??Math.pow(10,d?.decimals??9)):d?.baseWager??.01})(),F=f>0?Math.min(u.maxPayout/f,u.balance):u.balance,U=o=>{const a=Math.max(I,r*o);v(a)},V=async()=>{try{if(r<=0)return;g(!1),m(-1),h(null),z.play("play");const o=se["dice-v2"];let a;if(x)a=o.calculateBetArray(i);else{a=Array(s).fill(0);const O=(s-i-1)/s;if(O>0){const q=1/O*W["dice-v2"];for(let S=i+1;S<s;S++)a[S]=q}}await T.play({wager:r,bet:a});const k=await T.result(),R=k.payout>0,K=k.resultIndex;h(R?"win":"lose"),m(K);const Y=k.payout-r;L.updateStats(Y),setTimeout(()=>{g(!0),z.play(R?"win":"lose"),R?(p.current?.winFlash("#00ff00",1.5),p.current?.screenShake(1,600)):(p.current?.loseFlash("#ff4444",.8),p.current?.screenShake(.5,400))},100)}catch(o){console.error("🎲 MOBILE PLAY ERROR:",o),g(!1),m(-1),h(null)}},H=()=>{g(!1),m(-1),h(null)};return e.jsxs(xe,{children:[e.jsxs(pe,{children:[e.jsx(ue,{children:"🎲 Dice"}),e.jsxs(ge,{children:["Mobile Edition • RTP ",(W["dice-v2"]*100).toFixed(0),"%"]})]}),e.jsxs(be,{children:[e.jsx($,{$position:"top-left"}),e.jsx($,{$position:"top-right"}),e.jsx($,{$position:"bottom-left"}),e.jsx($,{$position:"bottom-right"}),e.jsx(me,{$hasResult:l&&b>=0,$isWin:w==="win",children:e.jsx(he,{$hasResult:l&&b>=0,$isWin:w==="win",children:l&&b>=0?`Roll Result: ${b} - ${w==="win"?"WIN!":"LOSE"}`:"Game results will appear here"})}),e.jsxs(fe,{children:[e.jsx(je,{children:e.jsx(D,{exact:!0,amount:E})}),e.jsx($e,{children:"Possible Winning"})]}),e.jsxs(ve,{children:[e.jsxs(we,{children:[e.jsx("span",{children:"0"}),e.jsx("span",{children:"25"}),e.jsx("span",{children:"50"}),e.jsx("span",{children:"75"}),e.jsx("span",{children:"100"})]}),e.jsxs(ye,{children:[e.jsx(ke,{$isUnder:x,$value:i}),e.jsx(Re,{$value:i}),e.jsx(Se,{type:"range",min:"1",max:"99",value:i,onChange:o=>_(parseInt(o.target.value))})]})]}),e.jsxs(We,{children:[e.jsxs(C,{children:[e.jsx(A,{children:"Multiplier"}),e.jsxs(G,{children:[f.toFixed(2),"x"]})]}),e.jsxs(C,{$clickable:!0,onClick:()=>N(!x),children:[e.jsxs(A,{children:[x?"Roll Under":"Roll Over"," ↻"]}),e.jsx(G,{children:i})]}),e.jsxs(C,{children:[e.jsx(A,{children:"Win Chance"}),e.jsxs(G,{children:[(y*100).toFixed(0),"%"]})]})]}),e.jsx(Me,{children:e.jsxs(Ce,{children:[e.jsx(Ae,{children:"Wager Amount"}),e.jsx(Ge,{children:e.jsx(D,{exact:!0,amount:r})}),e.jsxs(Pe,{children:[e.jsx(j,{onClick:()=>U(.5),children:"1/2"}),e.jsx(j,{onClick:()=>U(2),children:"2x"}),e.jsx(j,{onClick:()=>v(I),children:"Min"}),e.jsx(j,{onClick:()=>v(F),children:"Max"})]})]})}),e.jsx(Te,{$disabled:t.isPlaying||!l&&B,onClick:l?H:V,children:t.isPlaying?"Rolling...":l?"Roll Again":"Roll Dice"})]}),e.jsx(ie,{ref:p,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...M("dice-v2")&&{title:M("dice-v2").name,description:M("dice-v2").description}})]})};export{Fe as default};
