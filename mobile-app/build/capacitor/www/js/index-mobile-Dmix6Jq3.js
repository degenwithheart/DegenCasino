import{r as l,j as t}from"./three-DV31HySq.js";import{aH as Z,aJ as ee,aI as te,t as ne,aU as oe,G as ae,bf as ie,aL as se,o as u,bm as re,T as O,aM as le,b1 as ce,d as n,bn as C}from"./index-BarUt2o_.js";import{m as de}from"./deterministicRng-BQgZTO1k.js";import{u as G}from"./useGameMeta-C4Hfe5lB.js";import{B as xe}from"./bump-Cqe_Y3Ym.js";import{W as pe,F as ue}from"./fall-BnLIoEie.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const ge=n.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #1a1a2e 75%, #0f0f23 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,me=n.div`
  padding: 16px 20px 8px 20px;
  background: rgba(15, 15, 35, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(66, 153, 225, 0.3);
  z-index: 10;
`,be=n.h1`
  color: #4299e1;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`,fe=n.p`
  color: #90cdf4;
  font-size: 14px;
  margin: 0;
  text-align: center;
`,he=n.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  min-height: 0;
`,$e=n.div`
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
  background: ${e=>e.$hasResult?e.$isWin?"rgba(72, 187, 120, 0.2)":"rgba(245, 158, 11, 0.2)":"rgba(144, 205, 244, 0.1)"};
  border: 2px solid ${e=>e.$hasResult?e.$isWin?"rgba(72, 187, 120, 0.5)":"rgba(245, 158, 11, 0.5)":"rgba(144, 205, 244, 0.3)"};
  border-radius: 16px;
  transition: all 0.3s ease;
`,ke=n.div`
  font-size: 16px;
  font-weight: ${e=>e.$hasResult?"700":"400"};
  color: ${e=>e.$hasResult?e.$isWin?"#48bb78":"#f59e0b":"#90cdf4"};
  margin-bottom: 8px;
`,ve=n.div`
  text-align: center;
  margin-bottom: 24px;
`,je=n.div`
  font-size: 28px;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 4px;
`,we=n.div`
  font-size: 14px;
  color: #90cdf4;
`,ye=n.div`
  background: rgba(15, 15, 35, 0.8);
  border: 3px solid #4299e1;
  border-radius: 16px;
  padding: 16px;
  margin: 20px 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,Me=n.div`
  flex: 1;
  position: relative;
  margin-bottom: 16px;
  min-height: 120px;
`,We=n.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 8px;
  position: absolute;
  top: ${e=>e.$rowIndex/e.$totalRows*90}%;
  left: 50%;
  transform: translateX(-50%);
`,Pe=n.div`
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #90cdf4, #4299e1);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(66, 153, 225, 0.6);
`,Re=n.div`
  position: absolute;
  top: -10px;
  left: ${e=>e.$x??50}%;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #ffd700, #ff6b35);
  border-radius: 50%;
  transform: translateX(-50%);
  opacity: ${e=>e.$active?1:0};
  transition: all 0.3s ease;
  box-shadow: 0 0 12px rgba(255, 215, 0, 0.8);
  z-index: 10;
  
  ${e=>e.$active&&`
    animation: drop 2s ease-in-out;
    @keyframes drop {
      0% { top: -10px; }
      100% { top: 100%; }
    }
  `}
`,Se=n.div`
  display: flex;
  gap: 2px;
  justify-content: space-between;
`,Be=n.div`
  flex: 1;
  height: 40px;
  background: ${e=>{const a=C(e.$multiplier);return e.$active?`linear-gradient(135deg, ${a.primary}, ${a.secondary})`:`linear-gradient(135deg, ${a.secondary}, ${a.tertiary})`}};
  border: 2px solid ${e=>{const a=C(e.$multiplier);return e.$active?a.primary:a.secondary}};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  position: relative;
  transition: all 0.3s ease;
  
  ${e=>e.$active&&`
    animation: glow 0.5s ease-in-out;
    @keyframes glow {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); box-shadow: 0 0 20px ${C(e.$multiplier).primary}; }
      100% { transform: scale(1); }
    }
  `}
`,Ce=n.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`,U=n.button`
  flex: 1;
  padding: 12px;
  background: ${e=>e.$active?"linear-gradient(135deg, #4299e1, #2b6cb0)":"rgba(15, 15, 35, 0.6)"};
  border: 2px solid ${e=>e.$active?"#4299e1":"rgba(144, 205, 244, 0.3)"};
  border-radius: 12px;
  color: ${e=>e.$active?"#fff":"#90cdf4"};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.98);
  }
`,Ge=n.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`,Ie=n.div`
  display: flex;
  gap: 12px;
  align-items: center;
`,I=n.div`
  flex: 1;
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid rgba(66, 153, 225, 0.5);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
`,T=n.div`
  font-size: 12px;
  color: #90cdf4;
  margin-bottom: 6px;
`,z=n.div`
  font-size: 16px;
  font-weight: 700;
  color: #4299e1;
`,Te=n.div`
  margin-bottom: 20px;
`,ze=n.div`
  background: rgba(15, 15, 35, 0.8);
  border: 2px solid rgba(66, 153, 225, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`,Ae=n.div`
  font-size: 14px;
  color: #90cdf4;
  margin-bottom: 12px;
`,Ee=n.div`
  font-size: 24px;
  font-weight: 700;
  color: #4299e1;
  margin-bottom: 16px;
`,De=n.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,M=n.button`
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid rgba(66, 153, 225, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #4299e1;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(22, 33, 62, 1);
  }
`,Le=n.button`
  width: 100%;
  background: ${e=>e.$disabled?"rgba(144, 205, 244, 0.4)":"linear-gradient(135deg, #4299e1, #2b6cb0)"};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${e=>e.$disabled?"#90cdf4":"#fff"};
  font-size: 18px;
  font-weight: 700;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  box-shadow: ${e=>e.$disabled?"none":"0 4px 16px rgba(66, 153, 225, 0.4)"};
  
  ${e=>!e.$disabled&&`
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(66, 153, 225, 0.6);
    }
  `}
`,Je=()=>{const e=Z(),[a,W]=ee(),m=te(),A=ne(),P=oe(A?.mint),E=ae.useGame(),_=ie("plinko"),[c,D]=l.useState(!1),[d,b]=l.useState(!1),[f,h]=l.useState(!1),[$,k]=l.useState(null),[x,v]=l.useState(null),[H,j]=l.useState(50),p=l.useRef(null),w=se({bump:xe,fall:ue,win:pe}),s=c?u.degen:u.normal,R=c?u.PEGS.degen:u.PEGS.normal,y=Math.max(...s),L=a*y,X=L>m.maxPayout,F=(()=>{if(A?.mint?.equals?.(ce))return P?.baseWager??.01;const o=P?.usdPrice??0;return o>0?1/o:P?.baseWager??.01})(),V=y>0?Math.min(m.maxPayout/y,m.balance):m.balance,N=o=>{const i=Math.max(F,a*o);W(i)},q=()=>{const o=[];for(let i=0;i<Math.min(R,10);i++){const S=i+3;o.push(t.jsx(We,{$rowIndex:i,$totalRows:Math.min(R,10),children:Array.from({length:Math.min(S,8)}).map((g,r)=>t.jsx(Pe,{},r))},i))}return o},J=async()=>{if(!(f||a<=0))try{h(!0),b(!1),v(null),k(null),w.play("bump"),j(50+(Math.random()-.5)*20),await E.play({bet:s,wager:a,metadata:[c?"degen":"normal",s.length]});const o=await E.result(),i=`${o.resultIndex}:${o.payout}:${s.length}`,S=de(i);let g=50;for(let r=0;r<5;r++)setTimeout(()=>{w.play("bump"),g+=(S()-.5)*30,g=Math.max(10,Math.min(90,g)),j(g)},r*200);setTimeout(()=>{const r=o.resultIndex;k(r),j(r/(s.length-1)*80+10),w.play("fall");const Q=o.payout-a;_.updateStats(Q),setTimeout(()=>{h(!1);const K=o.payout>a;if(v(K?"win":"lose"),K){w.play("win"),p.current?.winFlash("#4299e1",1.5);const B=s[r];B>=10?p.current?.screenShake(2,1e3):B>=5?p.current?.screenShake(1.5,700):B>=2&&p.current?.screenShake(1,500)}else p.current?.loseFlash("#f59e0b",.8);b(!0)},500)},2e3)}catch(o){console.error("🎯 MOBILE PLINKO ERROR:",o),h(!1),b(!1),v(null),k(null)}},Y=()=>{b(!1),h(!1),v(null),k(null),j(50)};return t.jsxs(ge,{children:[t.jsxs(me,{children:[t.jsx(be,{children:"🎯 Plinko"}),t.jsxs(fe,{children:["Mobile Edition • RTP ",(re.plinko*100).toFixed(0),"%"]})]}),t.jsxs(he,{children:[t.jsx($e,{$hasResult:d&&x!==null,$isWin:x==="win",children:t.jsx(ke,{$hasResult:d&&x!==null,$isWin:x==="win",children:d&&x!==null&&$!==null?`${x==="win"?"WIN!":"TRY AGAIN"} - Bucket ${$+1}: ${s[$]}x`:"Drop the ball to see where it lands!"})}),t.jsxs(ve,{children:[t.jsx(je,{children:t.jsx(O,{exact:!0,amount:L})}),t.jsxs(we,{children:["Max Win (",y.toFixed(1),"x)"]})]}),t.jsxs(Ce,{children:[t.jsxs(U,{$active:!c,onClick:()=>D(!1),children:["Normal (",u.BUCKETS.normal," buckets)"]}),t.jsxs(U,{$active:c,onClick:()=>D(!0),children:["Degen (",u.BUCKETS.degen," buckets)"]})]}),t.jsxs(ye,{children:[t.jsx(Re,{$active:f,$x:H}),t.jsx(Me,{children:q()}),t.jsx(Se,{children:s.map((o,i)=>t.jsxs(Be,{$multiplier:o,$active:$===i,children:[o.toFixed(1),"x"]},i))})]}),t.jsx(Ge,{children:t.jsxs(Ie,{children:[t.jsxs(I,{children:[t.jsx(T,{children:"Buckets"}),t.jsx(z,{children:s.length})]}),t.jsxs(I,{children:[t.jsx(T,{children:"Mode"}),t.jsx(z,{children:c?"Degen":"Normal"})]}),t.jsxs(I,{children:[t.jsx(T,{children:"Pegs"}),t.jsx(z,{children:R})]})]})}),t.jsx(Te,{children:t.jsxs(ze,{children:[t.jsx(Ae,{children:"Wager Amount"}),t.jsx(Ee,{children:t.jsx(O,{exact:!0,amount:a})}),t.jsxs(De,{children:[t.jsx(M,{onClick:()=>N(.5),children:"1/2"}),t.jsx(M,{onClick:()=>N(2),children:"2x"}),t.jsx(M,{onClick:()=>W(F),children:"Min"}),t.jsx(M,{onClick:()=>W(V),children:"Max"})]})]})}),t.jsx(Le,{$disabled:e.isPlaying||f||!d&&X||a<=0,onClick:d?Y:J,children:f?"Dropping...":d?"Drop Again":"Drop Ball"})]}),t.jsx(le,{ref:p,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...G("plinko")&&{title:G("plinko").name,description:G("plinko").description}})]})};export{Je as default};
