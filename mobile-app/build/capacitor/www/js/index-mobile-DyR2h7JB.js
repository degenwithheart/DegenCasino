import{r as l,R as Z,j as t}from"./three-DV31HySq.js";import{aH as ee,aJ as te,aI as ne,t as ie,aU as ae,G as se,bf as re,aL as oe,aE as le,bm as de,T as Y,aM as ce,b1 as ue,d as n}from"./index-BarUt2o_.js";import{u as L}from"./useGameMeta-C4Hfe5lB.js";import{S as W,g as fe,L as P,a as xe,b as pe}from"./utils-D_fBc4qe.js";import{S as ge,a as me,b as be,c as he,d as $e,e as ye}from"./win-Ct7LYCZq.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const Se=n.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #16213e 75%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,ve=n.div`
  padding: 16px 20px 8px 20px;
  background: rgba(26, 26, 46, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  z-index: 10;
`,we=n.h1`
  color: #ffd700;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`,je=n.p`
  color: #87ceeb;
  font-size: 14px;
  margin: 0;
  text-align: center;
`,Re=n.div`
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
  background: ${e=>e.$hasResult?e.$isWin?"rgba(255, 215, 0, 0.2)":"rgba(220, 20, 60, 0.2)":"rgba(135, 206, 235, 0.1)"};
  border: 2px solid ${e=>e.$hasResult?e.$isWin?"rgba(255, 215, 0, 0.5)":"rgba(220, 20, 60, 0.5)":"rgba(135, 206, 235, 0.3)"};
  border-radius: 16px;
  transition: all 0.3s ease;
`,ke=n.div`
  font-size: 16px;
  font-weight: ${e=>e.$hasResult?"700":"400"};
  color: ${e=>e.$hasResult?e.$isWin?"#ffd700":"#dc143c":"#87ceeb"};
  margin-bottom: 8px;
`,Me=n.div`
  text-align: center;
  margin-bottom: 24px;
`,Ee=n.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 4px;
`,Ae=n.div`
  font-size: 14px;
  color: #87ceeb;
`,Te=n.div`
  background: rgba(26, 26, 46, 0.8);
  border: 3px solid #ffd700;
  border-radius: 16px;
  padding: 16px;
  margin: 20px 0;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,Le=n.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  height: 120px;
`,Pe=n.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(15, 52, 96, 0.6);
  animation: ${e=>e.$spinning?"spin 0.1s infinite linear":"none"};
  
  @keyframes spin {
    0% { transform: translateY(0); }
    100% { transform: translateY(-20px); }
  }
`,Ge=n.div`
  height: 36px;
  background: ${e=>e.$revealed?e.$winning?"linear-gradient(135deg, #ffd700, #ffed4e)":e.$item.multiplier>=P?"linear-gradient(135deg, #ff6b6b, #ee5a24)":e.$item.multiplier>=2?"linear-gradient(135deg, #74b9ff, #0984e3)":"linear-gradient(135deg, #a29bfe, #6c5ce7)":"rgba(135, 206, 235, 0.3)"};
  border: 2px solid ${e=>e.$winning?"#ffd700":e.$item.multiplier>=P?"#ff6b6b":"rgba(255,255,255,0.2)"};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${e=>e.$winning&&`
    animation: pulse 0.5s infinite alternate;
    @keyframes pulse {
      0% { transform: scale(1); box-shadow: 0 0 5px #ffd700; }
      100% { transform: scale(1.05); box-shadow: 0 0 20px #ffd700; }
    }
  `}
`,_e=n.div`
  font-size: 10px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  
  &:before {
    content: '${e=>e.$item.multiplier>=175?"💎":e.$item.multiplier>=80?"👑":e.$item.multiplier>=30?"🎯":e.$item.multiplier>=10?"☀️":e.$item.multiplier>=5?"💎":e.$item.multiplier>=2?"🪙":e.$item.multiplier>0?"🔸":"💀"}';
    display: block;
    font-size: 16px;
  }
`,Ne=n.div`
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 3px;
  background: ${e=>e.$active?"linear-gradient(90deg, transparent, #ffd700, #ffd700, #ffd700, transparent)":"none"};
  transform: translateY(-50%);
  z-index: 10;
  opacity: ${e=>e.$active?1:0};
  transition: opacity 0.3s ease;
  box-shadow: ${e=>e.$active?"0 0 10px #ffd700":"none"};
`,ze=n.div`
  margin-bottom: 20px;
`,Oe=n.div`
  background: rgba(26, 26, 46, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`,Ce=n.div`
  font-size: 14px;
  color: #87ceeb;
  margin-bottom: 12px;
`,Ie=n.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 16px;
`,De=n.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,k=n.button`
  background: rgba(15, 52, 96, 0.8);
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
    background: rgba(15, 52, 96, 1);
  }
`,Ue=n.button`
  width: 100%;
  background: ${e=>e.$disabled?"rgba(135, 206, 235, 0.4)":"linear-gradient(135deg, #ffd700, #ffed4e)"};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${e=>e.$disabled?"#87ceeb":"#1a1a2e"};
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
`,Ye=n.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  font-size: 12px;
  color: #87ceeb;
`,Ze=()=>{const e=ee(),[r,M]=te(),f=ne(),G=ie(),E=ae(G?.mint),_=se.useGame(),B=re("slots"),x=4,o=3,m=x*o,[$,y]=l.useState(!1),[d,S]=l.useState(!1),[F,A]=l.useState(m),[H,N]=l.useState(Array(m).fill(W[0])),[b,T]=l.useState([]),[p,h]=l.useState(null),g=l.useRef(null),v=l.useRef(),c=oe({win:ye,lose:$e,reveal:he,revealLegendary:be,spin:me,play:ge}),z=Z.useMemo(()=>(Math.min(f.maxPayout,r*Math.max(...le.slots.betArray)),fe()),[f.maxPayout,r]),w=Math.max(...z),O=r*w,V=O>f.maxPayout,C=(()=>{if(G?.mint?.equals?.(ue))return E?.baseWager??.01;const i=E?.usdPrice??0;return i>0?1/i:E?.baseWager??.01})(),K=w>0?Math.min(f.maxPayout/w,f.balance):f.balance,I=i=>{const a=Math.max(C,r*i);M(a)};l.useEffect(()=>()=>{v.current&&clearTimeout(v.current)},[]);const D=(i,a=0)=>{c.play("reveal",{playbackRate:1.1});const j=(a+1)*o;A(j);for(let s=0;s<o;s++){const u=a*o+s;if(u<i.length&&i[u].multiplier>=P){c.play("revealLegendary");break}}if(a<x-1)v.current=setTimeout(()=>D(i,a+1),300);else{c.sounds.spin.player.stop();const s=pe(i,x,o);T(s),v.current=setTimeout(()=>{y(!1),s.length>0?(h("win"),c.play("win"),g.current?.winFlash("#ffd700",1.5),s.length>=3?g.current?.screenShake(2,1e3):s.length>=2?g.current?.screenShake(1.5,700):g.current?.screenShake(1,500)):(h("lose"),c.play("lose"),g.current?.loseFlash("#dc143c",.8)),S(!0)},500)}},q=async()=>{if(!($||r<=0))try{y(!0),S(!1),h(null),T([]),A(0),c.play("play"),c.play("spin"),await _.play({bet:z,wager:r,metadata:["slots",x,o]});const i=await _.result(),a=xe(i.resultIndex,W,m);N(a);const j=i.payout-r;B.updateStats(j),setTimeout(()=>{D(a)},1500)}catch(i){console.error("🎰 MOBILE SLOTS ERROR:",i),y(!1),S(!1),h(null)}},J=()=>{S(!1),y(!1),h(null),T([]),A(m),N(Array(m).fill(W[0]))},Q=i=>b.some(a=>a.payline.includes(i));return t.jsxs(Se,{children:[t.jsxs(ve,{children:[t.jsx(we,{children:"🎰 Slots"}),t.jsxs(je,{children:["Mobile Edition • RTP ",(de.slots*100).toFixed(0),"%"]})]}),t.jsxs(Re,{children:[t.jsx(We,{$hasResult:d&&p!==null,$isWin:p==="win",children:t.jsx(ke,{$hasResult:d&&p!==null,$isWin:p==="win",children:d&&p!==null?p==="win"?`WIN! ${b.length} Payline${b.length>1?"s":""}!`:"No winning combinations":"Spin the reels for winning combinations!"})}),t.jsxs(Me,{children:[t.jsx(Ee,{children:t.jsx(Y,{exact:!0,amount:O})}),t.jsxs(Ae,{children:["Max Win (",w.toFixed(1),"x)"]})]}),t.jsxs(Te,{children:[t.jsx(Ne,{$active:b.length>0}),t.jsx(Le,{children:Array.from({length:x}).map((i,a)=>t.jsx(Pe,{$spinning:$,children:Array.from({length:o}).map((j,s)=>{const u=a*o+s,U=u<F,R=H[u]||W[0],X=d&&Q(u);return t.jsx(Ge,{$revealed:U,$winning:X,$item:R,children:U&&t.jsx(_e,{$item:R,children:R.multiplier>0?`${R.multiplier}x`:"0x"})},u)})},a))})]}),t.jsxs(Ye,{children:[t.jsxs("span",{children:["Paylines: ",x,"x",o]}),t.jsxs("span",{children:["Winning Lines: ",b.length]})]}),t.jsx(ze,{children:t.jsxs(Oe,{children:[t.jsx(Ce,{children:"Wager Amount"}),t.jsx(Ie,{children:t.jsx(Y,{exact:!0,amount:r})}),t.jsxs(De,{children:[t.jsx(k,{onClick:()=>I(.5),children:"1/2"}),t.jsx(k,{onClick:()=>I(2),children:"2x"}),t.jsx(k,{onClick:()=>M(C),children:"Min"}),t.jsx(k,{onClick:()=>M(K),children:"Max"})]})]})}),t.jsx(Ue,{$disabled:e.isPlaying||$||!d&&V||r<=0,onClick:d?J:q,children:$?"Spinning...":d?"Spin Again":"Spin Reels"})]}),t.jsx(ce,{ref:g,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...L("slots")&&{title:L("slots").name,description:L("slots").description}})]})};export{Ze as default};
