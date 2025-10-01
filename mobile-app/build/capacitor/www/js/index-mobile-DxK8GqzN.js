import{r as u,j as e}from"./three-DV31HySq.js";import{aH as se,aJ as oe,aI as re,t as le,aU as ce,G as de,bf as pe,aL as xe,B as ue,bl as Y,T as F,aM as ge,b1 as be,d as n}from"./index-BarUt2o_.js";import{m as fe}from"./deterministicRng-BQgZTO1k.js";import{u as L}from"./useGameMeta-C4Hfe5lB.js";import{S as me,a as he,b as $e,c as je}from"./play-BNe00jeK.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const ye=n.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a0f2e 0%, #2a1810 25%, #8b5a9e 50%, #2a1810 75%, #1a0f2e 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,ve=n.div`
  padding: 16px 20px 8px 20px;
  background: rgba(26, 15, 46, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(212, 165, 116, 0.3);
  z-index: 10;
`,we=n.h1`
  color: #d4a574;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`,Ce=n.p`
  color: #8b5a9e;
  font-size: 14px;
  margin: 0;
  text-align: center;
`,ke=n.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  min-height: 0;
`,We=n.div`
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
  background: ${t=>t.$hasResult?t.$isWin?"rgba(80, 200, 120, 0.2)":"rgba(231, 76, 60, 0.2)":"rgba(139, 90, 158, 0.1)"};
  border: 2px solid ${t=>t.$hasResult?t.$isWin?"rgba(80, 200, 120, 0.5)":"rgba(231, 76, 60, 0.5)":"rgba(139, 90, 158, 0.3)"};
  border-radius: 16px;
  transition: all 0.3s ease;
`,Se=n.div`
  font-size: 16px;
  font-weight: ${t=>t.$hasResult?"700":"400"};
  color: ${t=>t.$hasResult?t.$isWin?"#50c878":"#e74c3c":"#d4a574"};
  margin-bottom: 8px;
`,Me=n.div`
  text-align: center;
  margin-bottom: 24px;
`,Re=n.div`
  font-size: 28px;
  font-weight: 700;
  color: #d4a574;
  margin-bottom: 4px;
`,Ae=n.div`
  font-size: 14px;
  color: #8b5a9e;
`,Pe=n.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
  min-height: 120px;
  align-items: center;
`,Te=n.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${t=>t.$result?t.$result==="heads"?"linear-gradient(135deg, #ffd700 0%, #ffa500 100%)":"linear-gradient(135deg, #c0c0c0 0%, #808080 100%)":"linear-gradient(135deg, #d4a574 0%, #b8336a 100%)"};
  border: 3px solid ${t=>t.$side==="heads"?"#ffd700":"#c0c0c0"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #2a1810;
  position: relative;
  transform: ${t=>t.$flipping?"rotateY(720deg)":"rotateY(0deg)"};
  transition: transform 0.8s ease-in-out;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
`,ze=n.div`
  text-transform: uppercase;
  font-size: 10px;
`,Fe=n.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
`,G=n.div`
  display: flex;
  gap: 12px;
  align-items: center;
`,N=n.div`
  flex: 1;
  background: rgba(26, 15, 46, 0.8);
  border: 2px solid rgba(139, 90, 158, 0.5);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  cursor: ${t=>t.$clickable?"pointer":"default"};
  transition: all 0.3s ease;
  
  ${t=>t.$clickable&&`
    &:active {
      transform: scale(0.98);
      background: rgba(26, 15, 46, 0.6);
    }
  `}
`,I=n.div`
  font-size: 12px;
  color: #8b5a9e;
  margin-bottom: 6px;
`,Le=n.div`
  font-size: 16px;
  font-weight: 700;
  color: #d4a574;
`,Ge=n.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`,q=n.button`
  flex: 1;
  padding: 16px 12px;
  background: ${t=>t.$active?t.$side==="heads"?"linear-gradient(135deg, #ffd700, #ffa500)":"linear-gradient(135deg, #c0c0c0, #808080)":"rgba(26, 15, 46, 0.6)"};
  border: 2px solid ${t=>t.$active?t.$side==="heads"?"#ffd700":"#c0c0c0":"rgba(139, 90, 158, 0.3)"};
  border-radius: 12px;
  color: ${t=>t.$active?"#2a1810":"#d4a574"};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  
  &:active {
    transform: scale(0.98);
  }
`,J=n.div`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
`,W=n.button`
  width: 40px;
  height: 40px;
  background: rgba(139, 90, 158, 0.6);
  border: 1px solid rgba(212, 165, 116, 0.5);
  border-radius: 8px;
  color: #d4a574;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(139, 90, 158, 0.8);
  }
`,Q=n.div`
  min-width: 60px;
  padding: 8px 16px;
  background: rgba(26, 15, 46, 0.8);
  border: 2px solid rgba(139, 90, 158, 0.5);
  border-radius: 8px;
  color: #d4a574;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
`,Ne=n.div`
  margin-bottom: 20px;
`,Ie=n.div`
  background: rgba(26, 15, 46, 0.8);
  border: 2px solid rgba(139, 90, 158, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`,_e=n.div`
  font-size: 14px;
  color: #8b5a9e;
  margin-bottom: 12px;
`,Ee=n.div`
  font-size: 24px;
  font-weight: 700;
  color: #d4a574;
  margin-bottom: 16px;
`,Oe=n.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,S=n.button`
  background: rgba(139, 90, 158, 0.6);
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #d4a574;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(139, 90, 158, 0.8);
  }
`,Be=n.button`
  width: 100%;
  background: ${t=>t.$disabled?"rgba(139, 90, 158, 0.4)":"linear-gradient(135deg, #d4a574, #b8336a)"};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${t=>t.$disabled?"#8b5a9e":"#2a1810"};
  font-size: 18px;
  font-weight: 700;
  cursor: ${t=>t.$disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  box-shadow: ${t=>t.$disabled?"none":"0 4px 16px rgba(212, 165, 116, 0.4)"};
  
  ${t=>!t.$disabled&&`
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(212, 165, 116, 0.6);
    }
  `}
`,et=()=>{const t=se(),[M,R]=oe(),$=re(),_=le(),A=ce(_?.mint),E=de.useGame(),X=pe("flip-v2"),[l,O]=u.useState("heads"),[s,Z]=u.useState(1),[d,B]=u.useState(1),[g,j]=u.useState(!1),[y,v]=u.useState(!1),[w,P]=u.useState(Array(8).fill(null)),[b,C]=u.useState(null),f=u.useRef(null),T=xe({win:je,lose:$e,coin:he,play:me}),ee=ue["flip-v2"].calculateBetArray(s,d,l),z=(()=>{let i=0;for(let a=d;a<=s;a++)i+=((h,x)=>{if(x<0||x>h)return 0;x=Math.min(x,h-x);let o=1;for(let r=0;r<x;r++)o=o*(h-r)/(r+1);return o})(s,a)*Math.pow(.5,s);return i})(),k=z>0?1/z*Y["flip-v2"]:0,m=M*s,D=k*m,te=D>$.maxPayout,U=(()=>{if(_?.mint?.equals?.(be))return A?.baseWager??.01;const i=A?.usdPrice??0;return i>0?1/i/s:(A?.baseWager??.01)/s})(),ne=k>0?Math.min($.maxPayout/k,$.balance)/s:$.balance/s,K=i=>{const a=Math.max(U,M*i);R(a)},H=i=>{const a=Math.max(1,Math.min(8,s+i));Z(a),B(Math.min(d,a))},V=i=>{const a=Math.max(1,Math.min(s,d+i));B(a)},ae=async()=>{if(!(y||m<=0))try{v(!0),j(!1),C(null),P(Array(8).fill(null)),T.play("play"),await E.play({bet:ee,wager:m,metadata:[s,d,l==="heads"?1:0]});const i=await E.result();T.play("coin");const a=i.payout>0,p=[],h=`${i.resultIndex}:${i.payout}:${i.multiplier}:${s}:${d}:${l}`,x=fe(h);if(a){let o=0;for(let r=0;r<d;r++)p.push(l),o++;for(let r=d;r<s;r++){const c=x()<.5;p.push(c?l:l==="heads"?"tails":"heads"),c&&o++}}else{const o=Math.min(d-1,s);for(let c=0;c<o;c++)p.push(l);const r=l==="heads"?"tails":"heads";for(let c=o;c<s;c++)p.push(r)}for(let o=p.length-1;o>0;o--){const r=Math.floor(x()*(o+1));[p[o],p[r]]=[p[r],p[o]]}setTimeout(()=>{const o=Array(8).fill(null);for(let c=0;c<s;c++)o[c]=p[c];P(o),C(a?"win":"lose");const r=i.payout-m;X.updateStats(r),setTimeout(()=>{j(!0),v(!1),T.play(a?"win":"lose"),a?(f.current?.winFlash("#d4a574",1.5),f.current?.screenShake(1,600)):(f.current?.loseFlash("#e74c3c",.8),f.current?.screenShake(.5,400))},800)},100)}catch(i){console.error("🪙 MOBILE FLIP ERROR:",i),v(!1),j(!1),C(null)}},ie=()=>{j(!1),v(!1),C(null),P(Array(8).fill(null))};return e.jsxs(ye,{children:[e.jsxs(ve,{children:[e.jsx(we,{children:"🪙 Coin Flip"}),e.jsxs(Ce,{children:["Mobile Edition • RTP ",(Y["flip-v2"]*100).toFixed(0),"%"]})]}),e.jsxs(ke,{children:[e.jsx(We,{$hasResult:g&&b!==null,$isWin:b==="win",children:e.jsx(Se,{$hasResult:g&&b!==null,$isWin:b==="win",children:g&&b!==null?`${b==="win"?"WIN!":"LOSE"} - ${w.filter((i,a)=>a<s&&i===l).length}/${s} ${l}`:"Coin flip results will appear here"})}),e.jsxs(Me,{children:[e.jsx(Re,{children:e.jsx(F,{exact:!0,amount:D})}),e.jsxs(Ae,{children:["Possible Winning (",k.toFixed(2),"x)"]})]}),e.jsx(Pe,{children:Array.from({length:s}).map((i,a)=>e.jsx(Te,{$flipping:y,$result:w[a],$side:l,children:e.jsx(ze,{children:w[a]?w[a].substring(0,1).toUpperCase():l.substring(0,1).toUpperCase()})},a))}),e.jsxs(Ge,{children:[e.jsx(q,{$active:l==="heads",$side:"heads",onClick:()=>O("heads"),children:"🪙 Heads"}),e.jsx(q,{$active:l==="tails",$side:"tails",onClick:()=>O("tails"),children:"🪙 Tails"})]}),e.jsxs(Fe,{children:[e.jsx(G,{children:e.jsxs(N,{children:[e.jsx(I,{children:"Number of Coins"}),e.jsxs(J,{children:[e.jsx(W,{onClick:()=>H(-1),children:"-"}),e.jsx(Q,{children:s}),e.jsx(W,{onClick:()=>H(1),children:"+"})]})]})}),e.jsx(G,{children:e.jsxs(N,{children:[e.jsxs(I,{children:["At Least ",d," ",l]}),e.jsxs(J,{children:[e.jsx(W,{onClick:()=>V(-1),children:"-"}),e.jsx(Q,{children:d}),e.jsx(W,{onClick:()=>V(1),children:"+"})]})]})}),e.jsx(G,{children:e.jsxs(N,{children:[e.jsx(I,{children:"Win Chance"}),e.jsxs(Le,{children:[(z*100).toFixed(1),"%"]})]})})]}),e.jsx(Ne,{children:e.jsxs(Ie,{children:[e.jsxs(_e,{children:["Wager per Coin (Total: ",e.jsx(F,{exact:!0,amount:m}),")"]}),e.jsx(Ee,{children:e.jsx(F,{exact:!0,amount:M})}),e.jsxs(Oe,{children:[e.jsx(S,{onClick:()=>K(.5),children:"1/2"}),e.jsx(S,{onClick:()=>K(2),children:"2x"}),e.jsx(S,{onClick:()=>R(U),children:"Min"}),e.jsx(S,{onClick:()=>R(ne),children:"Max"})]})]})}),e.jsx(Be,{$disabled:t.isPlaying||y||!g&&te,onClick:g?ie:ae,children:y?"Flipping...":g?"Flip Again":"Flip Coins"})]}),e.jsx(ge,{ref:f,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...L("flip-v2")&&{title:L("flip-v2").name,description:L("flip-v2").description}})]})};export{et as default};
